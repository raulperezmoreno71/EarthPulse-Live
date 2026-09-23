// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
package dev.earthpulse.application;

import dev.earthpulse.domain.NormalizedEvent;
import dev.earthpulse.domain.OperationResult;
import dev.earthpulse.domain.SyncRunEntity;
import dev.earthpulse.infrastructure.feed.EonetFeedClient;
import dev.earthpulse.infrastructure.feed.FeedClient;
import dev.earthpulse.infrastructure.feed.UsgsFeedClient;
import dev.earthpulse.infrastructure.persistence.SyncRunRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class FeedIngestionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(FeedIngestionService.class);

    private final UsgsFeedClient usgsClient;
    private final EonetFeedClient eonetClient;
    private final EventUpsertService upsertService;
    private final SyncRunRepository syncRunRepository;
    private final Clock clock;

    public FeedIngestionService(
            UsgsFeedClient usgsClient,
            EonetFeedClient eonetClient,
            EventUpsertService upsertService,
            SyncRunRepository syncRunRepository) {
        this.usgsClient = usgsClient;
        this.eonetClient = eonetClient;
        this.upsertService = upsertService;
        this.syncRunRepository = syncRunRepository;
        clock = Clock.systemUTC();
    }

    @Scheduled(initialDelay = 2_000, fixedDelayString = "${earthpulse.sync.usgs-delay-ms}")
    public void synchronizeUsgs() {
        synchronize(usgsClient);
    }

    @Scheduled(initialDelay = 4_000, fixedDelayString = "${earthpulse.sync.eonet-delay-ms}")
    public void synchronizeEonet() {
        synchronize(eonetClient);
    }

    private void synchronize(FeedClient client) {
        Instant startedAt = clock.instant();
        SyncRunEntity syncRun = syncRunRepository.save(new SyncRunEntity(client.source(), startedAt));
        OperationResult<List<NormalizedEvent>> fetchResult = client.fetch();

        if (fetchResult instanceof OperationResult.Success<List<NormalizedEvent>> success) {
            List<NormalizedEvent> events = success.value();
            int written = upsertService.upsert(events, clock.instant());
            syncRun.succeed(events.size(), written, clock.instant());
            LOGGER.info("Sincronización {} completada: {} leídos, {} escritos", client.source(), events.size(), written);
        } else if (fetchResult instanceof OperationResult.Failure<List<NormalizedEvent>> failure) {
            syncRun.fail(failure.message() + " (" + failure.causeType() + ")", clock.instant());
            LOGGER.warn("Sincronización {} fallida: {}", client.source(), failure.message());
        }
        syncRunRepository.save(syncRun);
    }
}
