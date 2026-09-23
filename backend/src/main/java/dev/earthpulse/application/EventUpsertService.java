// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
package dev.earthpulse.application;

import dev.earthpulse.domain.NaturalEventEntity;
import dev.earthpulse.domain.NormalizedEvent;
import dev.earthpulse.infrastructure.persistence.NaturalEventRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EventUpsertService {

    private final NaturalEventRepository repository;

    public EventUpsertService(NaturalEventRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public int upsert(List<NormalizedEvent> events, Instant ingestionTime) {
        if (events == null || ingestionTime == null) {
            throw new IllegalArgumentException("Los eventos y la fecha de ingesta son obligatorios");
        }

        int written = 0;
        for (NormalizedEvent event : events) {
            NaturalEventEntity entity = repository.findBySourceAndExternalId(event.source(), event.externalId())
                    .orElseGet(() -> new NaturalEventEntity(event.source(), event.externalId()));
            if (!event.rawFingerprint().equals(entity.getRawFingerprint())) {
                entity.apply(event, ingestionTime);
                repository.save(entity);
                written++;
            }
        }
        return written;
    }
}
