// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { Activity, Clock3, DatabaseZap, ShieldAlert } from 'lucide-react'
import type { DashboardData } from '../api/dashboard'

interface MetricGridProps {
  summary: DashboardData['summary'] | undefined
  eventCount: number
  isLoading: boolean
}

export function MetricGrid({ summary, eventCount, isLoading }: MetricGridProps) {
  const metrics = [
    { label: 'Eventos visibles', value: summary?.total ?? eventCount, icon: Activity, tone: 'mint' },
    { label: 'Últimas 24 horas', value: summary?.last24Hours ?? 0, icon: Clock3, tone: 'blue' },
    { label: 'Prioridad alta', value: summary?.highPriority ?? 0, icon: ShieldAlert, tone: 'coral' },
    { label: 'Registros en vista', value: eventCount, icon: DatabaseZap, tone: 'amber' },
  ]

  return (
    <section className="metric-grid" aria-label="Resumen de actividad">
      {metrics.map(({ label, value, icon: Icon, tone }) => (
        <article className={`metric-card metric-${tone}`} key={label}>
          <div className="metric-icon"><Icon size={17} /></div>
          <p>{label}</p>
          <strong className={isLoading ? 'value-loading' : ''}>{isLoading ? '—' : value.toLocaleString('es-ES')}</strong>
          <span>{label === 'Prioridad alta' ? 'Clasificación visual, no alerta oficial' : 'Datos públicos normalizados'}</span>
        </article>
      ))}
    </section>
  )
}
