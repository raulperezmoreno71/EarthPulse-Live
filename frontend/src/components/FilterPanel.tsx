// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { RotateCcw, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import type { DashboardFilters, EventCategory, EventSource, Severity } from '../api/dashboard'
import { categoryLabels, severityLabels, sourceLabels } from '../utils/format'

interface FilterPanelProps {
  filters: DashboardFilters
  counts: Partial<Record<EventCategory, number>>
  onChange: (filters: DashboardFilters) => void
}

const categories: EventCategory[] = ['EARTHQUAKE', 'WILDFIRE', 'SEVERE_STORM', 'VOLCANO', 'FLOOD', 'ICEBERG', 'OTHER']
const sources: EventSource[] = ['USGS', 'NASA_EONET']
const severities: Severity[] = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL']
const timeWindows = [{ label: '24 h', hours: 24 }, { label: '7 días', hours: 168 }, { label: '30 días', hours: 720 }, { label: '90 días', hours: 2160 }]

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
      <p className="filter-intro">Ajusta el radar a lo que te interesa.</p>

      <label className="search-field">
        <Search size={16} aria-hidden="true" />
        <span className="sr-only">Buscar por ubicación o título</span>
        <input
          type="search"
          value={filters.query}
          placeholder="Buscar ubicación…"
          maxLength={120}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
        />
      </label>

      <fieldset>
        <legend>Fuente</legend>
        <div className="segmented-control">
          <button type="button" aria-pressed={filters.source === null} className={filters.source === null ? 'active' : ''} onClick={() => onChange({ ...filters, source: null })}>Todas</button>
          {sources.map((source) => (
            <button type="button" aria-pressed={filters.source === source} className={filters.source === source ? 'active' : ''} onClick={() => onChange({ ...filters, source })} key={source}>
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
              aria-pressed={filters.category === category}
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
        <div className="time-grid">
          {timeWindows.map((window) => (
            <button type="button" key={window.hours} aria-pressed={filters.hours === window.hours} className={filters.hours === window.hours ? 'active' : ''} onClick={() => onChange({ ...filters, hours: window.hours })}>{window.label}</button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Prioridad visual</legend>
        <div className="severity-row">
          {severities.map((severity) => (
            <button
              type="button"
              aria-pressed={filters.severity === severity}
              className={`severity-chip severity-${severity.toLowerCase()} ${filters.severity === severity ? 'active' : ''}`}
              onClick={() => onChange({ ...filters, severity: filters.severity === severity ? null : severity })}
              key={severity}
            >
              {severityLabels[severity]}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="filter-footnote"><Sparkles size={15} /><span>La prioridad es una lectura visual orientativa, no una alerta oficial.</span></div>
    </aside>
  )
}
