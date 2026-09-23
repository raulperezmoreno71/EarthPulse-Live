// =============================================================================
// EarthPulse Live — Panel geoespacial de eventos naturales reales
// Copyright (c) 2026 Raúl Pérez Moreno
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================
package dev.earthpulse.domain;

public sealed interface OperationResult<T>
        permits OperationResult.Success, OperationResult.Failure {

    record Success<T>(T value) implements OperationResult<T> {}

    record Failure<T>(String message, String causeType) implements OperationResult<T> {}
}
