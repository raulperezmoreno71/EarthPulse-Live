// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { BarChart3 } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DashboardData } from '../api/dashboard'

interface ActivityChartProps {
  timeline: DashboardData['timeline']
}

export function ActivityChart({ timeline }: ActivityChartProps) {
  const chartData = timeline.slice(-30).map((point) => ({
    ...point,
    label: new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', timeZone: 'UTC' }).format(new Date(`${point.date}T00:00:00Z`)),
  }))
  const total = chartData.reduce((sum, point) => sum + point.count, 0)
  const peak = chartData.reduce((highest, point) => Math.max(highest, point.count), 0)

  return (
    <section className="chart-panel" aria-label="Actividad temporal">
      <div className="chart-copy">
        <div className="panel-heading"><div><BarChart3 size={16} /><span>Ritmo de actividad</span></div></div>
        <p>Actividad diaria · hasta 30 días</p>
      </div>
      <p className="sr-only">{total} eventos en los días representados; el máximo diario es {peak}.</p>
      <div className="chart-wrap" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -26, bottom: 0 }}>
            <defs>
              <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#69E6CB" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#69E6CB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#8297a3', fontSize: 10 }} minTickGap={24} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8297a3', fontSize: 10 }} allowDecimals={false} />
            <Tooltip
              cursor={{ stroke: '#274656', strokeDasharray: '4 4' }}
              contentStyle={{ background: '#10212c', border: '1px solid #294552', borderRadius: 10, color: '#f2f7f8' }}
              labelStyle={{ color: '#91a6b2' }}
            />
            <Area type="monotone" dataKey="count" name="Eventos" stroke="#69E6CB" strokeWidth={2} fill="url(#activityFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
