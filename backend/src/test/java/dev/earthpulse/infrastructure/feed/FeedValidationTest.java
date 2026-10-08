// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
package dev.earthpulse.infrastructure.feed;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import tools.jackson.databind.ObjectMapper;

class FeedValidationTest {

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void acceptsGeographicCoordinatesAndRejectsMalformedPositions() {
        assertThat(FeedValidation.validCoordinates(mapper.readTree("[-3.7,40.4]"))).isTrue();
        assertThat(FeedValidation.validCoordinates(mapper.readTree("[181,40.4]"))).isFalse();
        assertThat(FeedValidation.validCoordinates(mapper.readTree("[-3.7,91]"))).isFalse();
        assertThat(FeedValidation.validCoordinates(mapper.readTree("[\"west\",40.4]"))).isFalse();
    }

    @Test
    void allowsOnlyAbsoluteHttpSourceLinks() {
        assertThat(FeedValidation.safeSourceUrl("https://earthquake.usgs.gov/test"))
                .isEqualTo("https://earthquake.usgs.gov/test");
        assertThat(FeedValidation.safeSourceUrl("javascript:alert(1) ")).isNull();
        assertThat(FeedValidation.safeSourceUrl("/relative")).isNull();
    }
}
