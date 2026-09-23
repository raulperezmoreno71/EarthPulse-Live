// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { ChevronRight, Waves } from 'lucide-react'
import type { NaturalEvent } from '../api/dashboard'
import { categoryLabels, relativeTime, sourceLabels } from '../utils/format'

interface EventFeedProps {
  events: NaturalEvent[]
  selectedId: string | null
  onSelect: (eventId: string) => void
}

export function EventFeed({ events, selectedId, onSelect }: EventFeedProps) {
  return (
    <section className="feed-panel" aria-label="Actividad reciente">
      <div className="panel-heading feed-heading">
        <div><Waves size={16} /><span>Actividad reciente</span></div>
        <strong>{events.length}</strong>
      </div>
      <div className="event-feed">
        {events.length === 0 ? (
          <div className="empty-state">
            <span className="empty-orbit" />
            <strong>No hay eventos en esta vista</strong>
            <p>Prueba ampliando el intervalo o quitando algún filtro.</p>
          </div>
        ) : events.slice(0, 80).map((event) => (
          <button
            className={`event-row ${selectedId === event.id ? 'selected' : ''}`}
            type="button"
            onClick={() => onSelect(event.id)}
            key={event.id}
          >
            <span className={`event-signal severity-${event.severity.toLowerCase()}`} aria-hidden="true" />
            <span className="event-copy">
              <span className="event-meta">
                <span>{categoryLabels[event.category]}</span>
                <i>·</i>
                <span>{sourceLabels[event.source]}</span>
              </span>
              <strong>{event.title}</strong>
              <span className="event-time">{relativeTime(event.occurredAt)}</span>
            </span>
            {event.magnitudeValue !== null && event.magnitudeValue !== undefined ? (
              <span className="magnitude">M {event.magnitudeValue.toFixed(1)}</span>
            ) : <ChevronRight size={16} className="row-arrow" />}
          </button>
        ))}
      </div>
    </section>
  )
}
