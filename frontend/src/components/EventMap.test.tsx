// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import worldTopology from 'world-atlas/countries-110m.json'
import { EventMap } from './EventMap'

describe('EventMap', () => {
  it('packages real land and country geometries with the frontend', () => {
    expect(worldTopology.objects.land.type).toBe('GeometryCollection')
    expect(worldTopology.objects.countries.geometries.length).toBeGreaterThan(100)
  })

  it('offers a keyless atlas as the initial map mode', () => {
    const markup = renderToStaticMarkup(<EventMap events={[]} selectedId={null} onSelect={vi.fn()} />)

    expect(markup).toContain('Atlas interactivo con 0 eventos')
    expect(markup).toContain('aria-pressed="true"')
    expect(markup).toContain('sin API key')
  })
})
