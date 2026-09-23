// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
import { useQuery } from '@tanstack/react-query'
import { fetchDashboard, type DashboardFilters } from '../api/dashboard'

export function useDashboard(filters: DashboardFilters) {
  return useQuery({
    queryKey: ['dashboard', filters],
    queryFn: () => fetchDashboard(filters),
    refetchInterval: 30_000,
    staleTime: 15_000,
    retry: 2,
  })
}
