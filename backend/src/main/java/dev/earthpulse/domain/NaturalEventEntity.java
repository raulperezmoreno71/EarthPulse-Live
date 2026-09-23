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
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(
        name = "natural_events",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_natural_event_source_external_id",
                columnNames = {"source", "external_id"}),
        indexes = {
            @Index(name = "idx_event_occurred_at", columnList = "occurred_at"),
            @Index(name = "idx_event_category", columnList = "category"),
            @Index(name = "idx_event_severity", columnList = "severity"),
            @Index(name = "idx_event_source", columnList = "source")
        })
public class NaturalEventEntity {

    @Id
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private EventSource source;

    @Column(name = "external_id", nullable = false, length = 160)
    private String externalId;

    @Column(nullable = false, length = 500)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private EventCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private EventStatus status;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    @Column(name = "source_updated_at")
    private Instant sourceUpdatedAt;

    @Column(name = "ingested_at", nullable = false)
    private Instant ingestedAt;

    @Column(nullable = false, precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(name = "magnitude_value", precision = 10, scale = 3)
    private BigDecimal magnitudeValue;

    @Column(name = "magnitude_unit", length = 32)
    private String magnitudeUnit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Severity severity;

    @Column(name = "source_url", length = 1200)
    private String sourceUrl;

    @Column(name = "raw_fingerprint", nullable = false, length = 64)
    private String rawFingerprint;

    protected NaturalEventEntity() {}

    public NaturalEventEntity(EventSource source, String externalId) {
        this.id = UUID.randomUUID();
        this.source = Objects.requireNonNull(source);
        this.externalId = Objects.requireNonNull(externalId);
    }

    @PrePersist
    void initializeTimestamps() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        if (ingestedAt == null) {
            ingestedAt = Instant.now();
        }
    }

    public void apply(NormalizedEvent event, Instant ingestionTime) {
        Objects.requireNonNull(event);
        title = event.title();
        category = event.category();
        status = event.status();
        occurredAt = event.occurredAt();
        sourceUpdatedAt = event.sourceUpdatedAt();
        ingestedAt = Objects.requireNonNull(ingestionTime);
        latitude = event.latitude();
        longitude = event.longitude();
        magnitudeValue = event.magnitudeValue();
        magnitudeUnit = event.magnitudeUnit();
        severity = event.severity();
        sourceUrl = event.sourceUrl();
        rawFingerprint = event.rawFingerprint();
    }

    public UUID getId() { return id; }
    public EventSource getSource() { return source; }
    public String getExternalId() { return externalId; }
    public String getTitle() { return title; }
    public EventCategory getCategory() { return category; }
    public EventStatus getStatus() { return status; }
    public Instant getOccurredAt() { return occurredAt; }
    public Instant getSourceUpdatedAt() { return sourceUpdatedAt; }
    public Instant getIngestedAt() { return ingestedAt; }
    public BigDecimal getLatitude() { return latitude; }
    public BigDecimal getLongitude() { return longitude; }
    public BigDecimal getMagnitudeValue() { return magnitudeValue; }
    public String getMagnitudeUnit() { return magnitudeUnit; }
    public Severity getSeverity() { return severity; }
    public String getSourceUrl() { return sourceUrl; }
    public String getRawFingerprint() { return rawFingerprint; }
}
