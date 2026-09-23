// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
package dev.earthpulse.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "sync_runs")
public class SyncRunEntity {

    @Id
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private EventSource source;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private SyncStatus status;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "finished_at")
    private Instant finishedAt;

    @Column(name = "records_read", nullable = false)
    private int recordsRead;

    @Column(name = "records_written", nullable = false)
    private int recordsWritten;

    @Column(name = "error_message", length = 500)
    private String errorMessage;

    protected SyncRunEntity() {}

    public SyncRunEntity(EventSource source, Instant startedAt) {
        id = UUID.randomUUID();
        this.source = source;
        this.startedAt = startedAt;
        status = SyncStatus.RUNNING;
    }

    public void succeed(int read, int written, Instant finishedAt) {
        status = SyncStatus.SUCCESS;
        recordsRead = read;
        recordsWritten = written;
        this.finishedAt = finishedAt;
        errorMessage = null;
    }

    public void fail(String message, Instant finishedAt) {
        status = SyncStatus.FAILED;
        this.finishedAt = finishedAt;
        errorMessage = message == null ? "Error de sincronización" : message.substring(0, Math.min(500, message.length()));
    }

    public UUID getId() { return id; }
    public EventSource getSource() { return source; }
    public SyncStatus getStatus() { return status; }
    public Instant getStartedAt() { return startedAt; }
    public Instant getFinishedAt() { return finishedAt; }
    public int getRecordsRead() { return recordsRead; }
    public int getRecordsWritten() { return recordsWritten; }
    public String getErrorMessage() { return errorMessage; }
}
