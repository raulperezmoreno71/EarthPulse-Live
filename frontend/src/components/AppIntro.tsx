// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { ArrowUpRight, Crosshair } from 'lucide-react'
import type { NaturalEvent } from '../api/dashboard'
import { categoryLabels, relativeTime } from '../utils/format'

interface AppIntroProps {
  latestEvent: NaturalEvent | undefined
  isFetching: boolean
  onSelect: (eventId: string) => void
}

export function AppIntro({ latestEvent, isFetching, onSelect }: AppIntroProps) {
  return (
    <section className="intro-panel" aria-label="Presentación del observatorio">
      <div className="intro-copy">
        <span className="section-index">01 / OBSERVATORIO GLOBAL</span>
        <h2>La Tierra, <em>en movimiento.</em></h2>
        <p>Eventos naturales reales, reunidos en un mismo lugar. Explora el planeta y sigue cada señal hasta su fuente.</p>
      </div>
      <div className="intro-latest">
        <span className="intro-latest-label"><Crosshair size={15} /> ÚLTIMA SEÑAL {isFetching ? '· ACTUALIZANDO' : ''}</span>
        {latestEvent === undefined ? (
          <p>Esperando la primera lectura de las fuentes…</p>
        ) : (
          <button className="intro-latest-action" type="button" onClick={() => onSelect(latestEvent.id)}>
            <strong>{latestEvent.title}</strong>
            <span className="intro-latest-meta">{categoryLabels[latestEvent.category]} · {relativeTime(latestEvent.occurredAt)} <ArrowUpRight size={13} /></span>
          </button>
        )}
      </div>
    </section>
  )
}
