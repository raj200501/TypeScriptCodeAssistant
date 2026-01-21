# Architecture

## Overview

TypeScript Code Assistant (TCA) is a full-stack workspace with a browser UI, a Node.js backend, and shared TypeScript packages for analysis and SDK functionality.

```mermaid
graph TD
  UI[Frontend (Vite + React)] --> API[Backend (Node + HTTP)]
  API --> Engine[Analysis Engine]
  API --> Storage[File-backed Snippet Store]
  Engine --> Rules[Rule Pack]
  UI --> WS[WebSocket Stream]
  WS --> API
  API --> Shared[Shared Types]
```

## Components

- **Frontend**: React UI that renders diagnostics, quick-fixes, snippets, and run history.
- **Backend**: Node server that exposes REST endpoints, WebSocket streaming, and file-backed storage.
- **Analysis Engine**: TypeScript-based rules that evaluate code and produce diagnostics and quick-fix edits.
- **Shared Types**: Cross-package TypeScript types and schemas for API responses.

## Data flow

1. UI sends code to `/api/analyze`.
2. Backend calls the analysis engine to generate diagnostics and summary counts.
3. Diagnostics and quick fixes are returned to the UI.
4. Optional actions (format, refactor, snippets) are persisted in the file store.

## Operational notes

- Health check: `GET /health`
- Optional metrics endpoint: `GET /metrics` when `ENABLE_METRICS=1`
- Structured logging: JSON logs via `backend/utils/logger.ts`

## Observability

- Metrics endpoint (`/metrics`) is opt-in via `ENABLE_METRICS=1`.
- OpenTelemetry scaffolding is opt-in via `ENABLE_OTEL=1` and ships with no exporters configured.
