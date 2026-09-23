// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
package dev.earthpulse.domain;

import java.math.BigDecimal;
import java.time.Instant;

public record NormalizedEvent(
        EventSource source,
        String externalId,
        String title,
        EventCategory category,
        EventStatus status,
        Instant occurredAt,
        Instant sourceUpdatedAt,
        BigDecimal latitude,
        BigDecimal longitude,
        BigDecimal magnitudeValue,
        String magnitudeUnit,
        Severity severity,
        String sourceUrl,
        String rawFingerprint) {}
