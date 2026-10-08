// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
package dev.earthpulse.infrastructure.feed;

import java.math.BigDecimal;
import java.net.URI;
import java.util.Locale;
import tools.jackson.databind.JsonNode;

final class FeedValidation {

    private FeedValidation() {
    }

    static boolean validCoordinates(JsonNode coordinates) {
        if (!coordinates.isArray() || coordinates.size() < 2
                || !coordinates.get(0).isNumber() || !coordinates.get(1).isNumber()) {
            return false;
        }
        BigDecimal longitude = coordinates.get(0).decimalValue();
        BigDecimal latitude = coordinates.get(1).decimalValue();
        return longitude.compareTo(BigDecimal.valueOf(-180)) >= 0
                && longitude.compareTo(BigDecimal.valueOf(180)) <= 0
                && latitude.compareTo(BigDecimal.valueOf(-90)) >= 0
                && latitude.compareTo(BigDecimal.valueOf(90)) <= 0;
    }

    static String safeSourceUrl(String candidate) {
        if (candidate == null || candidate.isBlank()) {
            return null;
        }
        String sourceUrl = null;
        try {
            URI uri = URI.create(candidate);
            String scheme = uri.getScheme() == null ? "" : uri.getScheme().toLowerCase(Locale.ROOT);
            if ((scheme.equals("https") || scheme.equals("http")) && uri.getHost() != null) {
                sourceUrl = candidate;
            }
        } catch (IllegalArgumentException ignoredInvalidUrl) {
            sourceUrl = null;
        }
        return sourceUrl;
    }
}
