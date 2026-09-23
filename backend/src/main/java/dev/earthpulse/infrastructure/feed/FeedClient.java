// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
package dev.earthpulse.infrastructure.feed;

import dev.earthpulse.domain.EventSource;
import dev.earthpulse.domain.NormalizedEvent;
import dev.earthpulse.domain.OperationResult;
import java.util.List;

public interface FeedClient {
    EventSource source();

    OperationResult<List<NormalizedEvent>> fetch();
}
