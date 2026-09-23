// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
package dev.earthpulse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class EarthPulseApplication {

    public static void main(String[] args) {
        SpringApplication.run(EarthPulseApplication.class, args);
    }

}
