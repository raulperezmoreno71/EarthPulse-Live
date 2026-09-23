// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
package dev.earthpulse.infrastructure.persistence;

import dev.earthpulse.domain.EventSource;
import dev.earthpulse.domain.SyncRunEntity;
import dev.earthpulse.domain.SyncStatus;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SyncRunRepository extends JpaRepository<SyncRunEntity, UUID> {

    Optional<SyncRunEntity> findTopBySourceOrderByStartedAtDesc(EventSource source);

    Optional<SyncRunEntity> findTopBySourceAndStatusOrderByFinishedAtDesc(EventSource source, SyncStatus status);
}
