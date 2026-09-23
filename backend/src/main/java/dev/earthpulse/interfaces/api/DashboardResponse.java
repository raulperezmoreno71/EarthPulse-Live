// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
package dev.earthpulse.interfaces.api;

import dev.earthpulse.domain.EventCategory;
import dev.earthpulse.domain.EventSource;
import dev.earthpulse.domain.EventStatus;
import dev.earthpulse.domain.Severity;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record DashboardResponse(
        List<EventItem> events,
        Summary summary,
        List<TimelinePoint> timeline,
        List<SourceState> sources,
        Instant generatedAt) {

    public record EventItem(
            UUID id,
            EventSource source,
            String externalId,
            String title,
            EventCategory category,
            EventStatus status,
            Instant occurredAt,
            Instant updatedAt,
            BigDecimal latitude,
            BigDecimal longitude,
            BigDecimal magnitudeValue,
            String magnitudeUnit,
            Severity severity,
            String sourceUrl) {}

    public record Summary(
            int total,
            long last24Hours,
            long highPriority,
            Map<EventCategory, Long> byCategory) {}

    public record TimelinePoint(LocalDate date, long count) {}

    public record SourceState(
            EventSource source,
            String status,
            Instant lastAttempt,
            Instant lastSuccess,
            String message) {}
}
