// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { lazy, Suspense, useMemo, useState } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import type { DashboardFilters, EventCategory, NaturalEvent } from './api/dashboard'
import { AppHeader } from './components/AppHeader'
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
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<EventCategory, number>> = {}
    for (const event of events) counts[event.category] = (counts[event.category] ?? 0) + 1
    return counts
  }, [events])

  return (
    <div className="app-shell">
      <AppHeader sources={dashboard.data?.sources ?? pendingSources} generatedAt={dashboard.data?.generatedAt} />

      {dashboard.isError ? (
        <div className="system-banner error" role="alert">
          <AlertTriangle size={17} />
          <span>No podemos actualizar los datos ahora. Comprueba que el backend esté activo.</span>
          <button type="button" onClick={() => void dashboard.refetch()}><RefreshCw size={14} /> Reintentar</button>
        </div>
      ) : null}

      <MetricGrid summary={dashboard.data?.summary} eventCount={events.length} isLoading={dashboard.isLoading} />

      <main className="dashboard-grid">
        <FilterPanel filters={filters} counts={categoryCounts} onChange={setFilters} />
        <div className="visual-column">
          <Suspense fallback={<div className="map-panel lazy-placeholder" />}>
            <EventMap events={events} selectedId={selectedId} onSelect={setSelectedId} />
          </Suspense>
          <Suspense fallback={<div className="chart-panel lazy-placeholder" />}>
            <ActivityChart timeline={dashboard.data?.timeline ?? []} />
          </Suspense>
          {dashboard.isLoading ? (
            <div className="map-loading" role="status">
              <span className="loading-radar" aria-hidden="true" />
              <strong>Conectando con la red global</strong>
              <small>Normalizando señales de USGS y NASA EONET</small>
            </div>
          ) : null}
        </div>
        <EventFeed events={events} selectedId={selectedId} onSelect={setSelectedId} />
      </main>

      <EventDetails event={selectedEvent} onClose={() => setSelectedId(null)} />

      <footer>
        <span><i /> Datos públicos · Visualización informativa</span>
        <span>USGS · NASA EONET · OpenStreetMap</span>
      </footer>
    </div>
  )
}

export default App
