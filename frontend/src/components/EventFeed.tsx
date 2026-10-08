// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { useMemo, useState } from 'react'
import { ChevronRight, Waves } from 'lucide-react'
import type { NaturalEvent, Severity } from '../api/dashboard'
import { categoryLabels, relativeTime, sourceLabels } from '../utils/format'

interface EventFeedProps {
  events: NaturalEvent[]
  selectedId: string | null
  onSelect: (eventId: string) => void
  isLoading: boolean
}

const severityRank: Record<Severity, number> = { LOW: 0, MODERATE: 1, HIGH: 2, CRITICAL: 3 }

export function EventFeed({ events, selectedId, onSelect, isLoading }: EventFeedProps) {
  const [order, setOrder] = useState<'recent' | 'priority'>('recent')
  const [visibleCount, setVisibleCount] = useState(60)
  const sortedEvents = useMemo(() => {
    const sorted = [...events]
    if (order === 'priority') {
      sorted.sort((left, right) => severityRank[right.severity] - severityRank[left.severity]
        || Date.parse(right.occurredAt) - Date.parse(left.occurredAt))
    }
    return sorted
  }, [events, order])
  const visibleEvents = sortedEvents.slice(0, visibleCount)

  return (
    <section className="feed-panel" aria-label="Actividad reciente">
      <div className="feed-heading">
        <div className="panel-heading"><div><Waves size={17} /><span>Señales detectadas</span></div><strong>{events.length}</strong></div>
        <p>Selecciona una señal para examinarla en el mapa.</p>
        <div className="feed-sort" role="group" aria-label="Orden de las señales">
          <button type="button" aria-pressed={order === 'recent'} className={order === 'recent' ? 'active' : ''} onClick={() => setOrder('recent')}>Más recientes</button>
          <button type="button" aria-pressed={order === 'priority'} className={order === 'priority' ? 'active' : ''} onClick={() => setOrder('priority')}>Prioridad visual</button>
        </div>
      </div>
      <div className="event-feed">
        {isLoading ? (
          <div className="feed-loading" role="status"><span /><span /><span /><span /><p>Recibiendo señales de las fuentes…</p></div>
        ) : events.length === 0 ? (
          <div className="empty-state"><span className="empty-orbit" /><strong>Sin señales en esta vista</strong><p>Amplía el intervalo o retira un filtro para descubrir más eventos.</p></div>
        ) : visibleEvents.map((event) => (
          <button className={`event-row ${selectedId === event.id ? 'selected' : ''}`} type="button" onClick={() => onSelect(event.id)} key={event.id}>
            <span className={`event-signal severity-${event.severity.toLowerCase()}`} aria-hidden="true" />
            <span className="event-copy">
              <span className="event-meta"><span>{categoryLabels[event.category]}</span><i>·</i><span>{sourceLabels[event.source]}</span></span>
              <strong>{event.title}</strong>
              <span className="event-time">{relativeTime(event.occurredAt)}</span>
            </span>
            <span className="event-row-end">
              {event.category === 'EARTHQUAKE' && event.magnitudeValue != null ? <span className="magnitude">M {event.magnitudeValue.toFixed(1)}</span> : null}
              <ChevronRight size={15} className="row-arrow" />
            </span>
          </button>
        ))}
        {visibleCount < sortedEvents.length ? (
          <button className="feed-more" type="button" onClick={() => setVisibleCount((count) => count + 60)}>
            Mostrar más <span>{visibleEvents.length} / {sortedEvents.length}</span>
          </button>
        ) : null}
      </div>
      <div className="feed-footnote"><span className="live-dot" /> Datos enlazados a USGS y NASA EONET</div>
    </section>
  )
}
