-- =============================================================================
-- EarthPulse Live — Panel geoespacial de eventos naturales reales
-- Copyright (c) 2026 Raúl Pérez Moreno
-- Licensed under the MIT License. See LICENSE for details.
-- Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
-- =============================================================================

CREATE TABLE natural_events (
    id UUID PRIMARY KEY,
    source VARCHAR(24) NOT NULL,
    external_id VARCHAR(160) NOT NULL,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(32) NOT NULL,
    status VARCHAR(16) NOT NULL,
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    source_updated_at TIMESTAMP WITH TIME ZONE,
    ingested_at TIMESTAMP WITH TIME ZONE NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    magnitude_value NUMERIC(10, 3),
    magnitude_unit VARCHAR(32),
    severity VARCHAR(16) NOT NULL,
    source_url VARCHAR(1200),
    raw_fingerprint VARCHAR(64) NOT NULL,
    CONSTRAINT uk_natural_event_source_external_id UNIQUE (source, external_id),
    CONSTRAINT ck_event_latitude CHECK (latitude BETWEEN -90 AND 90),
    CONSTRAINT ck_event_longitude CHECK (longitude BETWEEN -180 AND 180)
);

CREATE INDEX idx_event_occurred_at ON natural_events (occurred_at DESC);
CREATE INDEX idx_event_category ON natural_events (category);
CREATE INDEX idx_event_severity ON natural_events (severity);
CREATE INDEX idx_event_source ON natural_events (source);

CREATE TABLE sync_runs (
    id UUID PRIMARY KEY,
    source VARCHAR(24) NOT NULL,
    status VARCHAR(16) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    finished_at TIMESTAMP WITH TIME ZONE,
    records_read INTEGER NOT NULL DEFAULT 0,
    records_written INTEGER NOT NULL DEFAULT 0,
    error_message VARCHAR(500)
);

CREATE INDEX idx_sync_source_started ON sync_runs (source, started_at DESC);
