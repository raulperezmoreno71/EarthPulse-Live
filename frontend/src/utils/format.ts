// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import type { EventCategory, EventSource, Severity } from '../api/dashboard'

export const categoryLabels: Record<EventCategory, string> = {
  EARTHQUAKE: 'Terremotos',
  WILDFIRE: 'Incendios',
  SEVERE_STORM: 'Tormentas',
  VOLCANO: 'Volcanes',
  FLOOD: 'Inundaciones',
  ICEBERG: 'Hielo',
  OTHER: 'Otros',
}

export const severityLabels: Record<Severity, string> = {
  LOW: 'Baja',
  MODERATE: 'Moderada',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
}

export const sourceLabels: Record<EventSource, string> = {
  USGS: 'USGS',
  NASA_EONET: 'NASA EONET',
}

export function relativeTime(isoDate: string): string {
  const seconds = Math.round((new Date(isoDate).getTime() - Date.now()) / 1000)
  const formatter = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })
  const absolute = Math.abs(seconds)
  let value = seconds
  let unit: Intl.RelativeTimeFormatUnit = 'second'
  if (absolute >= 86_400) {
    value = Math.round(seconds / 86_400)
    unit = 'day'
  } else if (absolute >= 3_600) {
    value = Math.round(seconds / 3_600)
    unit = 'hour'
  } else if (absolute >= 60) {
    value = Math.round(seconds / 60)
    unit = 'minute'
  }
  return formatter.format(value, unit)
}

export function absoluteTime(isoDate: string): string {
  const formatted = new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date(isoDate))
  return `${formatted} UTC`
}
