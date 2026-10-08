// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { useEffect, useRef, useState } from 'react'
import { Compass, Globe2, Layers3, MapPinned, RotateCcw } from 'lucide-react'
import L from 'leaflet'
import 'leaflet.markercluster'
import { feature, mesh } from 'topojson-client'
import type { GeometryCollection, GeometryObject, Topology } from 'topojson-specification'
import worldTopology from 'world-atlas/countries-110m.json'
import type { NaturalEvent } from '../api/dashboard'

interface EventMapProps {
  events: NaturalEvent[]
  selectedId: string | null
  onSelect: (eventId: string) => void
}

type MapMode = 'atlas' | 'streets'
const topology = worldTopology as unknown as Topology<{ land: GeometryObject; countries: GeometryCollection }>
const worldBounds = L.latLngBounds([[-58, -175], [78, 180]])

function createAtlasLayer(map: L.Map): L.LayerGroup {
  const graticule = L.layerGroup()
  for (let latitude = -60; latitude <= 60; latitude += 30) {
    L.polyline([[latitude, -180], [latitude, 180]], {
      pane: 'atlas-grid', color: '#355365', weight: 1, opacity: 0.34, interactive: false,
    }).addTo(graticule)
  }
  for (let longitude = -150; longitude <= 150; longitude += 30) {
    L.polyline([[-80, longitude], [80, longitude]], {
      pane: 'atlas-grid', color: '#355365', weight: 1, opacity: 0.34, interactive: false,
    }).addTo(graticule)
  }
  const land = L.geoJSON(feature(topology, topology.objects.land), {
    pane: 'atlas-land',
    style: { color: '#597989', weight: 1.25, opacity: 0.9, fillColor: '#173b49', fillOpacity: 1 },
    interactive: false,
  })
  const borders = L.geoJSON(mesh(topology, topology.objects.countries, (left, right) => left !== right), {
    pane: 'atlas-borders',
    style: { color: '#7891a0', weight: 0.7, opacity: 0.42, fillOpacity: 0 },
    interactive: false,
  })
  const atlas = L.layerGroup([graticule, land, borders])
  atlas.addTo(map)
  return atlas
}

function markerIcon(event: NaturalEvent, selected: boolean): L.DivIcon {
  const label = event.category === 'EARTHQUAKE' && event.magnitudeValue != null
    ? event.magnitudeValue.toFixed(1) : ''
  const icon = L.divIcon({
    className: 'event-marker-wrapper',
    html: `<span class="event-marker category-${event.category.toLowerCase()} severity-${event.severity.toLowerCase()}${selected ? ' is-selected' : ''}"><i></i><b>${label}</b></span>`,
    iconSize: [38, 38], iconAnchor: [19, 19],
  })
  return icon
}

export function EventMap({ events, selectedId, onSelect }: EventMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const atlasRef = useRef<L.LayerGroup | null>(null)
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null)
  const markerRefs = useRef(new Map<string, L.Marker>())
  const selectRef = useRef(onSelect)
  const selectedRef = useRef(selectedId)
  const previousSelectionRef = useRef<string | null>(null)
  const [mode, setMode] = useState<MapMode>('atlas')
  const [streetsUnavailable, setStreetsUnavailable] = useState(false)

  useEffect(() => { selectRef.current = onSelect }, [onSelect])
  useEffect(() => { selectedRef.current = selectedId }, [selectedId])

  useEffect(() => {
    if (containerRef.current === null || mapRef.current !== null) return
    const map = L.map(containerRef.current, {
      center: [16, 0], zoom: 2, minZoom: 1.5, maxZoom: 12,
      zoomSnap: 0.25, zoomDelta: 0.5, worldCopyJump: true,
      zoomControl: false, attributionControl: false, preferCanvas: true,
    })
    map.createPane('atlas-grid').style.zIndex = '210'
    map.createPane('atlas-land').style.zIndex = '220'
    map.createPane('atlas-borders').style.zIndex = '230'
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    atlasRef.current = createAtlasLayer(map)
    map.fitBounds(worldBounds, { padding: [14, 14], animate: false })

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false, maxClusterRadius: 45,
      spiderfyOnMaxZoom: true, disableClusteringAtZoom: 8,
      iconCreateFunction: (clusterMarker) => L.divIcon({
        className: 'event-cluster-wrapper',
        html: `<span class="event-cluster">${clusterMarker.getChildCount()}</span>`,
        iconSize: [48, 48],
      }),
    })
    cluster.addTo(map)
    mapRef.current = map
    clusterRef.current = cluster
    const resizeObserver = new ResizeObserver(() => map.invalidateSize({ animate: false }))
    resizeObserver.observe(containerRef.current)
    return () => {
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
      clusterRef.current = null
      atlasRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const atlas = atlasRef.current
    if (map === null || atlas === null) return
    if (mode === 'streets') {
      const tile = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18, updateWhenIdle: true, keepBuffer: 1,
      })
      const onTileError = () => {
        if (mapRef.current !== map) return
        tile.remove()
        if (!map.hasLayer(atlas)) atlas.addTo(map)
        setStreetsUnavailable(true)
        setMode('atlas')
      }
      const onTileLoad = () => { if (mapRef.current === map && map.hasLayer(atlas)) atlas.remove() }
      tile.on('tileerror', onTileError)
      tile.on('load', onTileLoad)
      tile.addTo(map)
      return () => {
        tile.off('tileerror', onTileError)
        tile.off('load', onTileLoad)
        tile.remove()
        if (mapRef.current === map && !map.hasLayer(atlas)) atlas.addTo(map)
      }
    }
    if (!map.hasLayer(atlas)) atlas.addTo(map)
  }, [mode])

  useEffect(() => {
    const cluster = clusterRef.current
    if (cluster === null) return
    cluster.clearLayers()
    markerRefs.current.clear()
    for (const naturalEvent of events) {
      const marker = L.marker([naturalEvent.latitude, naturalEvent.longitude], {
        title: naturalEvent.title,
        icon: markerIcon(naturalEvent, naturalEvent.id === selectedRef.current),
      })
      marker.on('click', () => selectRef.current(naturalEvent.id))
      markerRefs.current.set(naturalEvent.id, marker)
      cluster.addLayer(marker)
    }
  }, [events])

  useEffect(() => {
    for (const event of events) {
      markerRefs.current.get(event.id)?.setIcon(markerIcon(event, event.id === selectedId))
    }
    const selected = events.find((event) => event.id === selectedId)
    if (selected !== undefined && mapRef.current !== null && previousSelectionRef.current !== selectedId) {
      mapRef.current.flyTo([selected.latitude, selected.longitude], Math.max(mapRef.current.getZoom(), 4), { duration: 0.7 })
    }
    previousSelectionRef.current = selectedId
  }, [events, selectedId])

  const resetView = () => { mapRef.current?.fitBounds(worldBounds, { padding: [14, 14], animate: true }) }

  return (
    <section className="map-panel" aria-label="Mapa mundial de eventos">
      <div className="map-canvas" ref={containerRef} role="img" aria-label={`Atlas interactivo con ${events.length} eventos geolocalizados`} />
      <div className="map-overlay map-title">
        <span><Globe2 size={13} /> VISIÓN GLOBAL <i className="live-dot" /></span>
        <strong>{events.length.toLocaleString('es-ES')} eventos en el radar</strong>
        <small>Datos reales · posición facilitada por la fuente</small>
      </div>
      <div className="map-controls" aria-label="Capas y vista del mapa">
        <div className="map-mode" role="group" aria-label="Capa cartográfica">
          <button type="button" className={mode === 'atlas' ? 'active' : ''} onClick={() => setMode('atlas')} aria-pressed={mode === 'atlas'}><Globe2 size={15} /> Atlas</button>
          <button type="button" className={mode === 'streets' ? 'active' : ''} onClick={() => { setStreetsUnavailable(false); setMode('streets') }} aria-pressed={mode === 'streets'}><Layers3 size={15} /> Calles</button>
        </div>
        <button className="map-reset" type="button" onClick={resetView} aria-label="Ver todo el mundo" title="Ver todo el mundo"><RotateCcw size={16} /></button>
      </div>
      {streetsUnavailable ? <div className="map-fallback" role="status"><Compass size={14} /> Sin conexión a calles. El atlas local sigue disponible.</div> : null}
      <div className="map-overlay map-legend" aria-label="Leyenda de prioridad visual">
        <span><i className="legend-low" /> Baja</span><span><i className="legend-moderate" /> Moderada</span>
        <span><i className="legend-high" /> Alta</span><span><i className="legend-critical" /> Crítica</span>
      </div>
      <div className="map-attribution"><MapPinned size={11} /> Atlas: Natural Earth · {mode === 'streets' ? 'Calles: © OpenStreetMap contributors' : 'sin API key'}</div>
    </section>
  )
}
