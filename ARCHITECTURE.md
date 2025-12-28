# Architecture

TypeScript Code Assistant (TCA) is a dependency-light monorepo that uses a custom analysis engine,
minimal Node.js HTTP backend, and a lightweight vanilla JavaScript frontend. The goal is to keep the
repository fully runnable even in restrictive environments while still modeling a real product flow.

## High-level flow

```
┌──────────────────────┐   HTTP + WebSocket   ┌──────────────────────────┐
│  Frontend (HTML/JS)  │ ───────────────────▶ │  Node.js HTTP API         │
│  /, /editor, /runs   │                      │  /api/analyze, /stream    │
└──────────────────────┘                      └──────────┬───────────────┘
                                                       │
                                                       ▼
                                            ┌────────────────────────┐
                                            │ Analysis Engine         │
                                            │ Rule-based diagnostics  │
                                            └────────────────────────┘
```

## Packages

- `packages/shared`: Shared types and lightweight validation helpers.
- `packages/analysis-engine`: Rule-based analyzer and quick fix engine.
- `packages/sdk`: Typed API client (available for integration, optional in the frontend).

## Backend services

- `backend/httpApp.ts`: Dependency-free HTTP router and handlers.
- `backend/websocket/analyzeSocket.ts`: Minimal WebSocket server for live analysis.
- `backend/services/fileDatabase.ts`: JSON file-backed snippet store and analysis history.

## Frontend

- `frontend/index.html`: Static shell.
- `frontend/static/app.js`: UI logic for editor, snippets, history, settings.
- `frontend/server.mjs`: Static dev/preview server.

## Data storage

Local development uses `backend/data/store.json` for snippets and run history. MongoDB is optional
and can be added later if desired.
