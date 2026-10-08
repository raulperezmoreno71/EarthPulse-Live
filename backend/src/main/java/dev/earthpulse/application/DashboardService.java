// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
package dev.earthpulse.application;

import dev.earthpulse.domain.EventCategory;
import dev.earthpulse.domain.EventSource;
import dev.earthpulse.domain.NaturalEventEntity;
import dev.earthpulse.domain.Severity;
import dev.earthpulse.domain.SyncRunEntity;
import dev.earthpulse.domain.SyncStatus;
import dev.earthpulse.infrastructure.persistence.NaturalEventRepository;
import dev.earthpulse.infrastructure.persistence.SyncRunRepository;
import dev.earthpulse.interfaces.api.DashboardResponse;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    private final NaturalEventRepository eventRepository;
    private final SyncRunRepository syncRunRepository;
    private final Clock clock;

    public DashboardService(NaturalEventRepository eventRepository, SyncRunRepository syncRunRepository) {
        this.eventRepository = eventRepository;
        this.syncRunRepository = syncRunRepository;
        clock = Clock.systemUTC();
    }

    @Transactional(readOnly = true)
    public DashboardResponse dashboard(
            EventSource source,
            EventCategory category,
            Severity severity,
            int hours,
            String query,
            int limit) {
        int safeHours = Math.max(1, Math.min(hours, 24 * 365));
        int safeLimit = Math.max(1, Math.min(limit, 2_000));
        String normalizedQuery = query == null || query.isBlank() ? null : query.trim();
        Instant now = clock.instant();
        Instant fromTime = now.minus(safeHours, ChronoUnit.HOURS);
        List<NaturalEventEntity> entities = eventRepository.findFiltered(
                source,
                category,
                severity,
                fromTime,
                normalizedQuery,
                PageRequest.of(0, safeLimit));

        List<DashboardResponse.EventItem> events = entities.stream().map(this::toItem).toList();
        Map<EventCategory, Long> byCategory = new EnumMap<>(EventCategory.class);
        Map<LocalDate, Long> timelineCounts = new TreeMap<>();
        long last24Hours = 0;
        long highPriority = 0;
        Instant yesterday = now.minus(24, ChronoUnit.HOURS);

        for (NaturalEventEntity entity : entities) {
            byCategory.merge(entity.getCategory(), 1L, Long::sum);
            LocalDate date = entity.getOccurredAt().atZone(ZoneOffset.UTC).toLocalDate();
            timelineCounts.merge(date, 1L, Long::sum);
            if (!entity.getOccurredAt().isBefore(yesterday)) {
                last24Hours++;
            }
            if (entity.getSeverity() == Severity.HIGH || entity.getSeverity() == Severity.CRITICAL) {
                highPriority++;
            }
        }

        LocalDate firstDate = fromTime.atZone(ZoneOffset.UTC).toLocalDate();
        LocalDate lastDate = now.atZone(ZoneOffset.UTC).toLocalDate();
        for (LocalDate date = firstDate; !date.isAfter(lastDate); date = date.plusDays(1)) {
            timelineCounts.putIfAbsent(date, 0L);
        }

        List<DashboardResponse.TimelinePoint> timeline = timelineCounts.entrySet().stream()
                .map(entry -> new DashboardResponse.TimelinePoint(entry.getKey(), entry.getValue()))
                .toList();
        DashboardResponse.Summary summary = new DashboardResponse.Summary(
                events.size(), last24Hours, highPriority, Map.copyOf(byCategory));
        DashboardResponse response = new DashboardResponse(events, summary, timeline, sourceStates(), now);
        return response;
    }

    private DashboardResponse.EventItem toItem(NaturalEventEntity entity) {
        return new DashboardResponse.EventItem(
                entity.getId(),
                entity.getSource(),
                entity.getExternalId(),
                entity.getTitle(),
                entity.getCategory(),
                entity.getStatus(),
                entity.getOccurredAt(),
                entity.getSourceUpdatedAt(),
                entity.getLatitude(),
                entity.getLongitude(),
                entity.getMagnitudeValue(),
                entity.getMagnitudeUnit(),
                entity.getSeverity(),
                entity.getSourceUrl());
    }

    private List<DashboardResponse.SourceState> sourceStates() {
        List<DashboardResponse.SourceState> states = new ArrayList<>();
        for (EventSource source : EventSource.values()) {
            Instant lastSuccess = syncRunRepository
                    .findTopBySourceAndStatusOrderByFinishedAtDesc(source, SyncStatus.SUCCESS)
                    .map(SyncRunEntity::getFinishedAt)
                    .orElse(null);
            DashboardResponse.SourceState state = syncRunRepository.findTopBySourceOrderByStartedAtDesc(source)
                    .map(run -> toSourceState(run, lastSuccess))
                    .orElseGet(() -> new DashboardResponse.SourceState(source, "PENDING", null, null, "Esperando primera sincronización"));
            states.add(state);
        }
        return List.copyOf(states);
    }

    private DashboardResponse.SourceState toSourceState(SyncRunEntity run, Instant lastSuccess) {
        String message = run.getStatus() == SyncStatus.FAILED ? run.getErrorMessage() : null;
        return new DashboardResponse.SourceState(
                run.getSource(), run.getStatus().name(), run.getStartedAt(), lastSuccess, message);
    }
}
