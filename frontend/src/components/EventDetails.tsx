// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { useEffect, useRef } from 'react'
import { Clock3, ExternalLink, MapPin, X } from 'lucide-react'
import type { NaturalEvent } from '../api/dashboard'
import { absoluteTime, categoryLabels, relativeTime, severityLabels, sourceLabels } from '../utils/format'

interface EventDetailsProps {
  event: NaturalEvent | null
  onClose: () => void
}

export function EventDetails({ event, onClose }: EventDetailsProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const eventId = event?.id
  useEffect(() => {
    if (eventId === undefined) return
    closeRef.current?.focus()
    const closeOnEscape = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => { document.removeEventListener('keydown', closeOnEscape) }
  }, [eventId, onClose])

  let content = null
  if (event !== null) content = (
    <aside className="detail-card" role="dialog" aria-modal="false" aria-labelledby="event-detail-title">
      <button ref={closeRef} className="detail-close" type="button" onClick={onClose} aria-label="Cerrar detalle"><X size={18} /></button>
      <div className="detail-kicker">
        <span className={`event-signal severity-${event.severity.toLowerCase()}`} aria-hidden="true" />
        {categoryLabels[event.category]} · {sourceLabels[event.source]}
      </div>
      <h2 id="event-detail-title">{event.title}</h2>
      <p className="detail-description"><Clock3 size={15} /> Registrado {relativeTime(event.occurredAt)}</p>
      <div className="priority-block">
        <span>Prioridad visual</span>
        <strong>{severityLabels[event.severity]}</strong>
        <small>Clasificación orientativa de EarthPulse, no alerta oficial.</small>
      </div>
      <dl className="detail-grid">
        <div><dt>Detectado</dt><dd>{absoluteTime(event.occurredAt)}</dd></div>
        {event.updatedAt != null ? <div><dt>Fuente actualizada</dt><dd>{absoluteTime(event.updatedAt)}</dd></div> : null}
        <div><dt>Estado</dt><dd>{event.status === 'OPEN' ? 'Activo' : event.status === 'CLOSED' ? 'Cerrado' : 'Informativo'}</dd></div>
        <div><dt>Latitud</dt><dd>{event.latitude.toFixed(4)}°</dd></div>
        <div><dt>Longitud</dt><dd>{event.longitude.toFixed(4)}°</dd></div>
        {event.magnitudeValue !== null && event.magnitudeValue !== undefined ? (
          <div><dt>Magnitud</dt><dd>{event.magnitudeValue.toFixed(1)} {event.magnitudeUnit ?? ''}</dd></div>
        ) : null}
        <div><dt>ID de origen</dt><dd>{event.externalId}</dd></div>
      </dl>
      <div className="detail-location"><MapPin size={15} /> Datos geográficos aportados por la fuente.</div>
      {event.sourceUrl !== null && event.sourceUrl !== undefined ? (
        <a className="source-link" href={event.sourceUrl} target="_blank" rel="noreferrer">
          Abrir fuente original <ExternalLink size={15} />
        </a>
      ) : null}
    </aside>
  )
  return content
}
