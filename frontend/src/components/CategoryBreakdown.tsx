// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { Layers3 } from 'lucide-react'
import type { DashboardData, EventCategory } from '../api/dashboard'
import { categoryLabels } from '../utils/format'

interface CategoryBreakdownProps {
  summary: DashboardData['summary'] | undefined
}

export function CategoryBreakdown({ summary }: CategoryBreakdownProps) {
  const categories = Object.entries(summary?.byCategory ?? {})
    .filter((entry): entry is [EventCategory, number] => typeof entry[1] === 'number' && entry[1] > 0)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)
  const total = summary?.total ?? 0

  return (
    <section className="breakdown-panel" aria-label="Categorías de la selección">
      <div className="panel-heading"><div><Layers3 size={16} /><span>Por fenómeno</span></div><small>EN VISTA</small></div>
      {categories.length === 0 ? <p className="breakdown-empty">Sin eventos en esta selección.</p> : (
        <div className="breakdown-list">
          {categories.map(([category, count]) => (
            <div className="breakdown-row" key={category}>
              <div><span className={`category-dot category-${category.toLowerCase()}`} />{categoryLabels[category]}<strong>{count}</strong></div>
              <span className="breakdown-track"><i className={`category-${category.toLowerCase()}`} style={{ width: `${Math.max(2, (count / total) * 100)}%` }} /></span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
