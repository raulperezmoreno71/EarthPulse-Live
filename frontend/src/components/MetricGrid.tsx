// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { Activity, Clock3, Radio, ShieldAlert } from 'lucide-react'
import type { DashboardData } from '../api/dashboard'

interface MetricGridProps {
  summary: DashboardData['summary'] | undefined
  sources: DashboardData['sources']
  isLoading: boolean
}

export function MetricGrid({ summary, sources, isLoading }: MetricGridProps) {
  const healthySources = sources.filter((source) => source.status === 'SUCCESS').length
  const metrics = [
    { label: 'Eventos en vista', value: (summary?.total ?? 0).toLocaleString('es-ES'), description: 'En la ventana y filtros actuales', icon: Activity, tone: 'mint', index: '01' },
    { label: 'Últimas 24 horas', value: (summary?.last24Hours ?? 0).toLocaleString('es-ES'), description: 'Eventos en el último día', icon: Clock3, tone: 'blue', index: '02' },
    { label: 'Prioridad alta', value: (summary?.highPriority ?? 0).toLocaleString('es-ES'), description: 'Clasificación visual orientativa', icon: ShieldAlert, tone: 'coral', index: '03' },
    { label: 'Fuentes en línea', value: `${healthySources} / ${sources.length}`, description: 'USGS + NASA EONET', icon: Radio, tone: 'amber', index: '04' },
  ]

  return (
    <section className="metric-grid" aria-label="Resumen de actividad">
      {metrics.map(({ label, value, description, icon: Icon, tone, index }) => (
        <article className={`metric-card metric-${tone}`} key={label}>
          <div className="metric-top"><span className="metric-icon"><Icon size={19} /></span><span className="metric-index">{index} / 04</span></div>
          <p>{label}</p>
          <strong className={isLoading ? 'value-loading' : ''}>{isLoading ? '—' : value}</strong>
          <span>{description}</span>
        </article>
      ))}
    </section>
  )
}
