// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
package dev.earthpulse.infrastructure.feed;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

final class Fingerprint {

    private Fingerprint() {}

    static String sha256(String value) {
        if (value == null) {
            throw new IllegalArgumentException("El valor del fingerprint no puede ser nulo");
        }

        String fingerprint;
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            fingerprint = HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 no está disponible", exception);
        }
        return fingerprint;
    }
}
