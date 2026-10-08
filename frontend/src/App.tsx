// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { lazy, Suspense, useCallback, useMemo, useState } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import type { DashboardFilters, EventCategory, NaturalEvent } from './api/dashboard'
import { AppHeader } from './components/AppHeader'
import { AppIntro } from './components/AppIntro'
import { CategoryBreakdown } from './components/CategoryBreakdown'
import { EventDetails } from './components/EventDetails'
import { EventFeed } from './components/EventFeed'
import { FilterPanel } from './components/FilterPanel'
import { MetricGrid } from './components/MetricGrid'
import { useDashboard } from './hooks/useDashboard'
import './App.css'

const initialFilters: DashboardFilters = {
  source: null,
  category: null,
  severity: null,
  hours: 2160,
  query: '',
}

const pendingSources = [
  { source: 'USGS' as const, status: 'PENDING', lastAttempt: null, lastSuccess: null, message: null },
  { source: 'NASA_EONET' as const, status: 'PENDING', lastAttempt: null, lastSuccess: null, message: null },
]

const emptyEvents: NaturalEvent[] = []

const EventMap = lazy(async () => {
  const module = await import('./components/EventMap')
  return { default: module.EventMap }
})

const ActivityChart = lazy(async () => {
  const module = await import('./components/ActivityChart')
  return { default: module.ActivityChart }
})

function App() {
  const [filters, setFilters] = useState<DashboardFilters>(initialFilters)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const dashboard = useDashboard(filters)
  const events = dashboard.data?.events ?? emptyEvents
  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedId) ?? null,
    [events, selectedId],
  )
  const visibleSelectedId = selectedEvent?.id ?? null
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<EventCategory, number>> = {}
    for (const event of events) counts[event.category] = (counts[event.category] ?? 0) + 1
    return counts
  }, [events])
  const degradedSources = dashboard.data?.sources.filter((source) => source.status === 'FAILED') ?? []

  const changeFilters = (nextFilters: DashboardFilters) => {
    setSelectedId(null)
    setFilters(nextFilters)
  }
  const closeDetails = useCallback(() => setSelectedId(null), [])

  return (
    <div className="app-shell">
      <AppHeader sources={dashboard.data?.sources ?? pendingSources} generatedAt={dashboard.data?.generatedAt} />

      <AppIntro latestEvent={events[0]} isFetching={dashboard.isFetching} onSelect={setSelectedId} />

      {dashboard.isError ? (
        <div className="system-banner error" role="alert">
          <AlertTriangle size={17} />
          <span>No podemos actualizar los datos ahora. Comprueba que el backend esté activo.</span>
          <button type="button" onClick={() => void dashboard.refetch()}><RefreshCw size={14} /> Reintentar</button>
        </div>
      ) : null}

      {degradedSources.length > 0 ? (
        <div className="system-banner warning" role="status">
          <AlertTriangle size={17} />
          <span>{degradedSources.map((source) => source.source === 'USGS' ? 'USGS' : 'NASA EONET').join(' y ')} no ha podido actualizarse. Se muestran los últimos datos disponibles.</span>
        </div>
      ) : null}

      <MetricGrid summary={dashboard.data?.summary} sources={dashboard.data?.sources ?? pendingSources} isLoading={dashboard.isLoading} />

      <main className="dashboard-grid">
        <FilterPanel filters={filters} counts={categoryCounts} onChange={changeFilters} />
        <div className="visual-column">
          <Suspense fallback={<div className="map-panel lazy-placeholder" />}>
            <EventMap events={events} selectedId={visibleSelectedId} onSelect={setSelectedId} />
          </Suspense>
          <div className="analytics-row">
            <Suspense fallback={<div className="chart-panel lazy-placeholder" />}>
              <ActivityChart timeline={dashboard.data?.timeline ?? []} />
            </Suspense>
            <CategoryBreakdown summary={dashboard.data?.summary} />
          </div>
          {dashboard.isLoading ? (
            <div className="map-loading" role="status">
              <span className="loading-radar" aria-hidden="true" />
              <strong>Conectando con la red global</strong>
              <small>Normalizando señales de USGS y NASA EONET</small>
            </div>
          ) : null}
        </div>
        <EventFeed events={events} selectedId={visibleSelectedId} onSelect={setSelectedId} isLoading={dashboard.isLoading} />
      </main>

      <EventDetails event={selectedEvent} onClose={closeDetails} />

      <footer>
        <span><i /> Datos públicos · Visualización informativa</span>
        <span>USGS · NASA EONET · Natural Earth</span>
      </footer>
    </div>
  )
}

export default App
