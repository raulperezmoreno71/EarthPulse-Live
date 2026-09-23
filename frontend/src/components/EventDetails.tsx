// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { ExternalLink, MapPin, X } from 'lucide-react'
import type { NaturalEvent } from '../api/dashboard'
import { absoluteTime, categoryLabels, severityLabels, sourceLabels } from '../utils/format'

interface EventDetailsProps {
  event: NaturalEvent | null
  onClose: () => void
}

export function EventDetails({ event, onClose }: EventDetailsProps) {
  let content = null
  if (event !== null) content = (
    <aside className="detail-card" aria-label={`Detalle de ${event.title}`}>
      <button className="detail-close" type="button" onClick={onClose} aria-label="Cerrar detalle"><X size={17} /></button>
      <div className="detail-kicker">
        <span className={`event-signal severity-${event.severity.toLowerCase()}`} aria-hidden="true" />
        {categoryLabels[event.category]} · {sourceLabels[event.source]}
      </div>
      <h2>{event.title}</h2>
      <div className="priority-block">
        <span>Prioridad visual</span>
        <strong>{severityLabels[event.severity]}</strong>
        <small>Clasificación orientativa de EarthPulse, no alerta oficial.</small>
      </div>
      <dl className="detail-grid">
        <div><dt>Detectado</dt><dd>{absoluteTime(event.occurredAt)}</dd></div>
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
