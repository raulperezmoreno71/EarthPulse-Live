// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
package dev.earthpulse.infrastructure.persistence;

import dev.earthpulse.domain.EventCategory;
import dev.earthpulse.domain.EventSource;
import dev.earthpulse.domain.NaturalEventEntity;
import dev.earthpulse.domain.Severity;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NaturalEventRepository extends JpaRepository<NaturalEventEntity, UUID> {

    Optional<NaturalEventEntity> findBySourceAndExternalId(EventSource source, String externalId);

    @Query("""
            select event from NaturalEventEntity event
            where (:source is null or event.source = :source)
              and (:category is null or event.category = :category)
              and (:severity is null or event.severity = :severity)
              and (:fromTime is null or event.occurredAt >= :fromTime)
              and (:queryText is null or lower(event.title) like lower(concat('%', :queryText, '%')))
            order by event.occurredAt desc
            """)
    List<NaturalEventEntity> findFiltered(
            @Param("source") EventSource source,
            @Param("category") EventCategory category,
            @Param("severity") Severity severity,
            @Param("fromTime") Instant fromTime,
            @Param("queryText") String queryText,
            Pageable pageable);
}
