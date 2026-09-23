// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react'
import type { DashboardFilters, EventCategory, EventSource, Severity } from '../api/dashboard'
import { categoryLabels, severityLabels, sourceLabels } from '../utils/format'

interface FilterPanelProps {
  filters: DashboardFilters
  counts: Partial<Record<EventCategory, number>>
  onChange: (filters: DashboardFilters) => void
}

const categories: EventCategory[] = ['EARTHQUAKE', 'WILDFIRE', 'SEVERE_STORM', 'VOLCANO', 'FLOOD', 'ICEBERG', 'OTHER']
const sources: EventSource[] = ['USGS', 'NASA_EONET']
const severities: Severity[] = ['MODERATE', 'HIGH', 'CRITICAL']

export function FilterPanel({ filters, counts, onChange }: FilterPanelProps) {
  const reset = () => onChange({ source: null, category: null, severity: null, hours: 2160, query: '' })

  return (
    <aside className="filter-panel" aria-label="Filtros de eventos">
      <div className="panel-heading">
        <div><SlidersHorizontal size={16} /><span>Explorar</span></div>
        <button className="icon-button" type="button" onClick={reset} aria-label="Restablecer filtros" title="Restablecer filtros">
          <RotateCcw size={15} />
        </button>
      </div>

      <label className="search-field">
        <Search size={16} aria-hidden="true" />
        <span className="sr-only">Buscar por ubicación o título</span>
        <input
          type="search"
          value={filters.query}
          placeholder="Buscar ubicación…"
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
        />
      </label>

      <fieldset>
        <legend>Fuente</legend>
        <div className="segmented-control">
          <button type="button" className={filters.source === null ? 'active' : ''} onClick={() => onChange({ ...filters, source: null })}>Todas</button>
          {sources.map((source) => (
            <button type="button" className={filters.source === source ? 'active' : ''} onClick={() => onChange({ ...filters, source })} key={source}>
              {sourceLabels[source]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Categorías</legend>
        <div className="category-list">
          {categories.map((category) => (
            <button
              type="button"
              className={`category-filter category-${category.toLowerCase()} ${filters.category === category ? 'active' : ''}`}
              onClick={() => onChange({ ...filters, category: filters.category === category ? null : category })}
              key={category}
            >
              <span className="category-dot" aria-hidden="true" />
              <span>{categoryLabels[category]}</span>
              <strong>{counts[category] ?? 0}</strong>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Ventana temporal</legend>
        <select value={filters.hours} onChange={(event) => onChange({ ...filters, hours: Number(event.target.value) })}>
          <option value={24}>Últimas 24 horas</option>
          <option value={168}>Últimos 7 días</option>
          <option value={720}>Últimos 30 días</option>
          <option value={2160}>Últimos 90 días</option>
        </select>
      </fieldset>

      <fieldset>
        <legend>Prioridad visual</legend>
        <div className="severity-row">
          {severities.map((severity) => (
            <button
              type="button"
              className={`severity-chip severity-${severity.toLowerCase()} ${filters.severity === severity ? 'active' : ''}`}
              onClick={() => onChange({ ...filters, severity: filters.severity === severity ? null : severity })}
              key={severity}
            >
              {severityLabels[severity]}
            </button>
          ))}
        </div>
      </fieldset>
    </aside>
  )
}
