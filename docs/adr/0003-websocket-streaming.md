# ADR 0003: WebSocket streaming for live analysis

## Status
Accepted

## Context
Users expect instant feedback while editing code, and polling would be inefficient.

## Decision
Implement a WebSocket endpoint at `/api/stream` that accepts `settings` and `analyze` messages with
throttled processing.

## Consequences
- Smooth live analysis experiences.
- Requires additional server resource management in production.
