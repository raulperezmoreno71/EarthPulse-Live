// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet.markercluster'
import type { NaturalEvent } from '../api/dashboard'

interface EventMapProps {
  events: NaturalEvent[]
  selectedId: string | null
  onSelect: (eventId: string) => void
}

export function EventMap({ events, selectedId, onSelect }: EventMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null)
  const markerRefs = useRef(new Map<string, L.Marker>())
  const selectRef = useRef(onSelect)

  useEffect(() => {
    selectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    if (containerRef.current === null || mapRef.current !== null) return

    const map = L.map(containerRef.current, {
      center: [18, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 12,
      worldCopyJump: true,
      zoomControl: false,
    })
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map)

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 48,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: (clusterMarker) => L.divIcon({
        className: 'event-cluster-wrapper',
        html: `<span class="event-cluster">${clusterMarker.getChildCount()}</span>`,
        iconSize: [44, 44],
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
    }
  }, [])

  useEffect(() => {
    const cluster = clusterRef.current
    if (cluster === null) return

    cluster.clearLayers()
    markerRefs.current.clear()
    for (const naturalEvent of events) {
      const magnitude = naturalEvent.magnitudeValue ?? null
      const marker = L.marker([naturalEvent.latitude, naturalEvent.longitude], {
        title: naturalEvent.title,
        icon: L.divIcon({
          className: 'event-marker-wrapper',
          html: `<span class="event-marker severity-${naturalEvent.severity.toLowerCase()}"><i></i>${magnitude === null ? '' : `<b>${magnitude.toFixed(1)}</b>`}</span>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        }),
      })
      marker.on('click', () => selectRef.current(naturalEvent.id))
      markerRefs.current.set(naturalEvent.id, marker)
      cluster.addLayer(marker)
    }
  }, [events])

  useEffect(() => {
    if (selectedId === null || mapRef.current === null) return
    const selected = events.find((event) => event.id === selectedId)
    if (selected !== undefined) {
      mapRef.current.flyTo([selected.latitude, selected.longitude], Math.max(mapRef.current.getZoom(), 5), { duration: 0.8 })
    }
  }, [events, selectedId])

  return (
    <section className="map-panel" aria-label="Mapa mundial de eventos">
      <div className="map-overlay map-title">
        <span>Situación global</span>
        <strong>{events.length.toLocaleString('es-ES')} señales visibles</strong>
      </div>
      <div className="map-overlay map-legend" aria-label="Leyenda de prioridad visual">
        <span><i className="legend-low" /> Baja</span>
        <span><i className="legend-moderate" /> Moderada</span>
        <span><i className="legend-high" /> Alta</span>
        <span><i className="legend-critical" /> Crítica</span>
      </div>
      <div className="map-canvas" ref={containerRef} />
    </section>
  )
}
