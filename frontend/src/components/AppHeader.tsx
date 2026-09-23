// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { Radio, Satellite } from 'lucide-react'
import type { DashboardData } from '../api/dashboard'
import { relativeTime, sourceLabels } from '../utils/format'

interface AppHeaderProps {
  sources: DashboardData['sources']
  generatedAt: string | undefined
}

export function AppHeader({ sources, generatedAt }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="brand" aria-label="EarthPulse Live">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
        </div>
        <div>
          <p className="eyebrow">Global event intelligence</p>
          <h1>EarthPulse <em>Live</em></h1>
        </div>
      </div>

      <div className="source-strip" aria-label="Estado de las fuentes">
        {sources.map((source) => (
          <div className={`source-pill status-${source.status.toLowerCase()}`} key={source.source}>
            {source.source === 'USGS' ? <Radio size={14} /> : <Satellite size={14} />}
            <span>{sourceLabels[source.source]}</span>
            <i aria-hidden="true" />
          </div>
        ))}
      </div>

      <div className="header-time">
        <span>Actualización automática</span>
        <strong>{generatedAt === undefined ? 'Conectando…' : relativeTime(generatedAt)}</strong>
      </div>
    </header>
  )
}
