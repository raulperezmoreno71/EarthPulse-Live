// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
package dev.earthpulse.infrastructure.feed;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.core.JacksonException;
import dev.earthpulse.domain.EventCategory;
import dev.earthpulse.domain.EventSource;
import dev.earthpulse.domain.EventStatus;
import dev.earthpulse.domain.NormalizedEvent;
import dev.earthpulse.domain.OperationResult;
import dev.earthpulse.domain.Severity;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
public class UsgsFeedClient implements FeedClient {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String feedUrl;

    public UsgsFeedClient(
            RestClient.Builder builder,
            ObjectMapper objectMapper,
            @Value("${earthpulse.feeds.usgs-url}") String feedUrl) {
        restClient = builder.build();
        this.objectMapper = objectMapper;
        this.feedUrl = feedUrl;
    }

    @Override
    public EventSource source() {
        return EventSource.USGS;
    }

    @Override
    public OperationResult<List<NormalizedEvent>> fetch() {
        OperationResult<List<NormalizedEvent>> result;
        try {
            String payload = restClient.get().uri(feedUrl).retrieve().body(String.class);
            JsonNode root = objectMapper.readTree(payload);
            if (!root.path("features").isArray()) {
                throw new IllegalArgumentException("USGS devolvió una estructura no válida");
            }

            List<NormalizedEvent> events = new ArrayList<>();
            for (JsonNode feature : root.path("features")) {
                parseFeature(feature).ifPresent(events::add);
            }
            result = new OperationResult.Success<>(List.copyOf(events));
        } catch (RestClientException | JacksonException | IllegalArgumentException exception) {
            result = new OperationResult.Failure<>("No se pudo sincronizar USGS", exception.getClass().getSimpleName());
        }
        return result;
    }

    private java.util.Optional<NormalizedEvent> parseFeature(JsonNode feature) {
        JsonNode properties = feature.path("properties");
        JsonNode coordinates = feature.path("geometry").path("coordinates");
        String externalId = feature.path("id").asText("");
        String title = properties.path("place").asText("");
        long occurredAtMillis = properties.path("time").asLong(0);
        boolean valid = !externalId.isBlank()
                && !title.isBlank()
                && occurredAtMillis > 0
                && FeedValidation.validCoordinates(coordinates);

        java.util.Optional<NormalizedEvent> parsed = java.util.Optional.empty();
        if (valid) {
            BigDecimal longitude = coordinates.get(0).decimalValue();
            BigDecimal latitude = coordinates.get(1).decimalValue();
            BigDecimal magnitude = properties.path("mag").isNumber() ? properties.path("mag").decimalValue() : null;
            Instant occurredAt = Instant.ofEpochMilli(occurredAtMillis);
            long updatedMillis = properties.path("updated").asLong(occurredAtMillis);
            String sourceUrl = FeedValidation.safeSourceUrl(properties.path("url").asText(null));
            String fingerprint = Fingerprint.sha256(String.join("|",
                    externalId,
                    title,
                    occurredAt.toString(),
                    latitude.toPlainString(),
                    longitude.toPlainString(),
                    magnitude == null ? "" : magnitude.toPlainString()));
            parsed = java.util.Optional.of(new NormalizedEvent(
                    EventSource.USGS,
                    externalId,
                    title,
                    EventCategory.EARTHQUAKE,
                    EventStatus.UNKNOWN,
                    occurredAt,
                    Instant.ofEpochMilli(updatedMillis),
                    latitude,
                    longitude,
                    magnitude,
                    "Mw",
                    severityForMagnitude(magnitude),
                    sourceUrl,
                    fingerprint));
        }
        return parsed;
    }

    private Severity severityForMagnitude(BigDecimal magnitude) {
        Severity severity = Severity.LOW;
        if (magnitude != null && magnitude.compareTo(BigDecimal.valueOf(7)) >= 0) {
            severity = Severity.CRITICAL;
        } else if (magnitude != null && magnitude.compareTo(BigDecimal.valueOf(5.5)) >= 0) {
            severity = Severity.HIGH;
        } else if (magnitude != null && magnitude.compareTo(BigDecimal.valueOf(4)) >= 0) {
            severity = Severity.MODERATE;
        }
        return severity;
    }
}
