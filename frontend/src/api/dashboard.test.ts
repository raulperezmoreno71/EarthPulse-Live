// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { describe, expect, it } from 'vitest'
import { dashboardSchema } from './dashboard'

const validPayload = {
  events: [{
    id: '7c790a8d-4cf0-43f5-8789-b2dd60f20a50',
    source: 'USGS',
    externalId: 'us7000test',
    title: 'Test earthquake',
    category: 'EARTHQUAKE',
    status: 'UNKNOWN',
    occurredAt: '2026-09-23T16:00:00Z',
    latitude: 37.123,
    longitude: -3.456,
    magnitudeValue: 4.2,
    magnitudeUnit: 'Mw',
    severity: 'MODERATE',
    sourceUrl: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000test',
  }],
  summary: {
    total: 1,
    last24Hours: 1,
    highPriority: 0,
    byCategory: { EARTHQUAKE: 1 },
  },
  timeline: [{ date: '2026-09-23', count: 1 }],
  sources: [{ source: 'USGS', status: 'SUCCESS', lastSuccess: '2026-09-23T16:01:00Z' }],
  generatedAt: '2026-09-23T16:01:05Z',
}

describe('dashboardSchema', () => {
  it('accepts a valid normalized dashboard response', () => {
    expect(dashboardSchema.safeParse(validPayload).success).toBe(true)
  })

  it('rejects coordinates represented as strings', () => {
    const invalidPayload = structuredClone(validPayload)
    invalidPayload.events[0]!.latitude = '37.123' as unknown as number
    expect(dashboardSchema.safeParse(invalidPayload).success).toBe(false)
  })

  it('rejects out-of-range coordinates and strips unsafe source links', () => {
    const badCoordinates = structuredClone(validPayload)
    badCoordinates.events[0]!.latitude = 120
    expect(dashboardSchema.safeParse(badCoordinates).success).toBe(false)

    const unsafeLink = structuredClone(validPayload)
    unsafeLink.events[0]!.sourceUrl = 'javascript:alert(1)'
    const parsed = dashboardSchema.safeParse(unsafeLink)
    expect(parsed.success).toBe(true)
    if (parsed.success) expect(parsed.data.events[0]?.sourceUrl).toBeNull()
  })
})
