// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { z } from 'zod'

export const eventSourceSchema = z.enum(['USGS', 'NASA_EONET'])
export const eventCategorySchema = z.enum([
  'EARTHQUAKE',
  'WILDFIRE',
  'SEVERE_STORM',
  'VOLCANO',
  'FLOOD',
  'ICEBERG',
  'OTHER',
])
export const severitySchema = z.enum(['LOW', 'MODERATE', 'HIGH', 'CRITICAL'])

const eventSchema = z.object({
  id: z.string().uuid(),
  source: eventSourceSchema,
  externalId: z.string(),
  title: z.string(),
  category: eventCategorySchema,
  status: z.enum(['OPEN', 'CLOSED', 'UNKNOWN']),
  occurredAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable().optional(),
  latitude: z.number(),
  longitude: z.number(),
  magnitudeValue: z.number().nullable().optional(),
  magnitudeUnit: z.string().nullable().optional(),
  severity: severitySchema,
  sourceUrl: z.string().url().nullable().optional(),
})

const sourceStateSchema = z.object({
  source: eventSourceSchema,
  status: z.string(),
  lastAttempt: z.string().datetime().nullable().optional(),
  lastSuccess: z.string().datetime().nullable().optional(),
  message: z.string().nullable().optional(),
})

export const dashboardSchema = z.object({
  events: z.array(eventSchema),
  summary: z.object({
    total: z.number().int().nonnegative(),
    last24Hours: z.number().int().nonnegative(),
    highPriority: z.number().int().nonnegative(),
    byCategory: z.object({
      EARTHQUAKE: z.number().optional(),
      WILDFIRE: z.number().optional(),
      SEVERE_STORM: z.number().optional(),
      VOLCANO: z.number().optional(),
      FLOOD: z.number().optional(),
      ICEBERG: z.number().optional(),
      OTHER: z.number().optional(),
    }),
  }),
  timeline: z.array(z.object({ date: z.string(), count: z.number().nonnegative() })),
  sources: z.array(sourceStateSchema),
  generatedAt: z.string().datetime(),
})

export type EventSource = z.infer<typeof eventSourceSchema>
export type EventCategory = z.infer<typeof eventCategorySchema>
export type Severity = z.infer<typeof severitySchema>
export type NaturalEvent = z.infer<typeof eventSchema>
export type DashboardData = z.infer<typeof dashboardSchema>

export interface DashboardFilters {
  source: EventSource | null
  category: EventCategory | null
  severity: Severity | null
  hours: number
  query: string
}

export async function fetchDashboard(filters: DashboardFilters): Promise<DashboardData> {
  const parameters = new URLSearchParams({ hours: String(filters.hours), limit: '1200' })
  if (filters.source !== null) parameters.set('source', filters.source)
  if (filters.category !== null) parameters.set('category', filters.category)
  if (filters.severity !== null) parameters.set('severity', filters.severity)
  if (filters.query.trim().length > 0) parameters.set('query', filters.query.trim())

  const response = await fetch(`/api/v1/dashboard?${parameters.toString()}`, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) {
    throw new Error(`La API respondió con estado ${response.status}`)
  }

  const payload: unknown = await response.json()
  const result = dashboardSchema.safeParse(payload)
  if (!result.success) {
    throw new Error('La API devolvió datos con un formato inesperado')
  }
  return result.data
}
