// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
package dev.earthpulse.infrastructure.feed;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import dev.earthpulse.domain.NormalizedEvent;
import dev.earthpulse.domain.OperationResult;
import dev.earthpulse.domain.Severity;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.ObjectMapper;

class UsgsFeedClientTest {

    @Test
    void normalizesGeoJsonAndCalculatesVisualPriority() {
        String url = "https://example.test/usgs.geojson";
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        server.expect(requestTo(url)).andRespond(withSuccess("""
                {
                  "features": [{
                    "id": "us-test-1",
                    "properties": {
                      "place": "12 km NE of Test City",
                      "time": 1790179200000,
                      "updated": 1790179260000,
                      "mag": 5.8,
                      "url": "https://earthquake.usgs.gov/test"
                    },
                    "geometry": {"coordinates": [-3.7038, 40.4168, 10.0]}
                  }]
                }
                """, MediaType.parseMediaType("application/geo+json")));

        UsgsFeedClient client = new UsgsFeedClient(builder, new ObjectMapper(), url);
        OperationResult<List<NormalizedEvent>> result = client.fetch();

        assertThat(result).isInstanceOf(OperationResult.Success.class);
        OperationResult.Success<List<NormalizedEvent>> success = (OperationResult.Success<List<NormalizedEvent>>) result;
        assertThat(success.value()).hasSize(1);
        assertThat(success.value().getFirst().severity()).isEqualTo(Severity.HIGH);
        assertThat(success.value().getFirst().title()).contains("Test City");
        server.verify();
    }
}
