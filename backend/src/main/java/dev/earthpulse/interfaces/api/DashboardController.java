// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
package dev.earthpulse.interfaces.api;

import dev.earthpulse.application.DashboardService;
import dev.earthpulse.domain.EventCategory;
import dev.earthpulse.domain.EventSource;
import dev.earthpulse.domain.Severity;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard(
            @RequestParam(required = false) EventSource source,
            @RequestParam(required = false) EventCategory category,
            @RequestParam(required = false) Severity severity,
            @RequestParam(defaultValue = "2160") @Min(1) @Max(8760) int hours,
            @RequestParam(required = false) @Size(max = 120) String query,
            @RequestParam(defaultValue = "1200") @Min(1) @Max(2000) int limit) {
        return dashboardService.dashboard(source, category, severity, hours, query, limit);
    }
}
