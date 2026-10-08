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
import java.time.DateTimeException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
public class EonetFeedClient implements FeedClient {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String feedUrl;

    public EonetFeedClient(
            RestClient.Builder builder,
            ObjectMapper objectMapper,
            @Value("${earthpulse.feeds.eonet-url}") String feedUrl) {
        restClient = builder.build();
        this.objectMapper = objectMapper;
        this.feedUrl = feedUrl;
    }

    @Override
    public EventSource source() {
        return EventSource.NASA_EONET;
    }

    @Override
    public OperationResult<List<NormalizedEvent>> fetch() {
        OperationResult<List<NormalizedEvent>> result;
        try {
            String payload = restClient.get().uri(feedUrl).retrieve().body(String.class);
            JsonNode root = objectMapper.readTree(payload);
            if (!root.path("features").isArray()) {
                throw new IllegalArgumentException("NASA EONET devolvió una estructura no válida");
            }

            List<NormalizedEvent> events = new ArrayList<>();
            for (JsonNode feature : root.path("features")) {
                parseFeature(feature).ifPresent(events::add);
            }
            result = new OperationResult.Success<>(List.copyOf(events));
        } catch (RestClientException | JacksonException | IllegalArgumentException exception) {
            result = new OperationResult.Failure<>("No se pudo sincronizar NASA EONET", exception.getClass().getSimpleName());
        }
        return result;
    }

    private Optional<NormalizedEvent> parseFeature(JsonNode feature) {
        JsonNode properties = feature.path("properties");
        JsonNode coordinates = feature.path("geometry").path("coordinates");
        String externalId = properties.path("id").asText(feature.path("id").asText(""));
        String title = properties.path("title").asText("");
        String date = properties.path("date").asText("");
        boolean valid = !externalId.isBlank() && !title.isBlank() && !date.isBlank()
                && FeedValidation.validCoordinates(coordinates);

        Optional<NormalizedEvent> parsed = Optional.empty();
        if (valid) {
            try {
                Instant occurredAt = Instant.parse(date);
                BigDecimal longitude = coordinates.get(0).decimalValue();
                BigDecimal latitude = coordinates.get(1).decimalValue();
                BigDecimal magnitude = properties.path("magnitudeValue").isNumber()
                        ? properties.path("magnitudeValue").decimalValue()
                        : null;
                String magnitudeUnit = properties.path("magnitudeUnit").asText(null);
                EventCategory category = mapCategory(properties.path("categories"));
                EventStatus status = properties.path("closed").isNull() || properties.path("closed").isMissingNode()
                        ? EventStatus.OPEN
                        : EventStatus.CLOSED;
                String sourceUrl = extractSourceUrl(properties);
                String fingerprint = Fingerprint.sha256(String.join("|",
                        externalId,
                        title,
                        occurredAt.toString(),
                        latitude.toPlainString(),
                        longitude.toPlainString(),
                        category.name(),
                        status.name()));
                parsed = Optional.of(new NormalizedEvent(
                        EventSource.NASA_EONET,
                        externalId,
                        title,
                        category,
                        status,
                        occurredAt,
                        occurredAt,
                        latitude,
                        longitude,
                        magnitude,
                        magnitudeUnit,
                        severityForCategory(category),
                        sourceUrl,
                        fingerprint));
            } catch (DateTimeException | ArithmeticException ignoredInvalidFeature) {
                parsed = Optional.empty();
            }
        }
        return parsed;
    }

    private EventCategory mapCategory(JsonNode categories) {
        String categoryId = "";
        if (categories.isArray() && !categories.isEmpty()) {
            JsonNode first = categories.get(0);
            categoryId = first.isTextual() ? first.asText() : first.path("id").asText(first.path("title").asText(""));
        }

        EventCategory category;
        String normalized = categoryId.toLowerCase(Locale.ROOT);
        if (normalized.contains("wildfire")) {
            category = EventCategory.WILDFIRE;
        } else if (normalized.contains("storm") || normalized.contains("cyclone")) {
            category = EventCategory.SEVERE_STORM;
        } else if (normalized.contains("volcano")) {
            category = EventCategory.VOLCANO;
        } else if (normalized.contains("flood")) {
            category = EventCategory.FLOOD;
        } else if (normalized.contains("ice")) {
            category = EventCategory.ICEBERG;
        } else {
            category = EventCategory.OTHER;
        }
        return category;
    }

    private Severity severityForCategory(EventCategory category) {
        Severity severity = switch (category) {
            case SEVERE_STORM, VOLCANO -> Severity.HIGH;
            case WILDFIRE, FLOOD -> Severity.MODERATE;
            default -> Severity.LOW;
        };
        return severity;
    }

    private String extractSourceUrl(JsonNode properties) {
        String sourceUrl = properties.path("link").asText(null);
        JsonNode sources = properties.path("sources");
        if (sources.isArray() && !sources.isEmpty()) {
            String candidate = sources.get(0).path("url").asText("");
            if (!candidate.isBlank()) {
                sourceUrl = candidate;
            }
        }
        return FeedValidation.safeSourceUrl(sourceUrl);
    }
}
