# TypeScript Code Assistant

TypeScript Code Assistant (TCA) is a production-grade, end-to-end toolchain for analyzing,
refactoring, and managing TypeScript code. It ships with a rule-based analysis engine, a
dependency-light backend API, and a fast vanilla JavaScript frontend.

## What it does

- **Static analysis without an LLM** using a deterministic rule engine.
- **Quick fixes** that apply structured text edits.
- **Live WebSocket streaming** for "analyze as you type" workflows.
- **Snippet library** backed by a file database.
- **History tracking** for analysis runs.

## Screenshots

Screenshot assets are generated locally to keep the repository binary-free. Run:

```bash
npm run screenshots
```

The generated files land in `docs/screenshots/` and match the filenames referenced by the
verification workflow.

## Architecture

```
Frontend (HTML/JS)
        │
        ▼
Backend API (Node.js HTTP + WebSocket)
        │
        ▼
Analysis Engine (rule-based diagnostics)
```

For more details, see [ARCHITECTURE.md](ARCHITECTURE.md).

## ✅ Verified Quickstart

The following steps were verified locally and will start both the backend API and frontend UI:

```bash
npm install
npm run dev
```

Backend health check:

```bash
curl http://localhost:5000/health
```

API example:

```bash
curl -X POST http://localhost:5000/api/suggestions \
  -H 'Content-Type: application/json' \
  -d '{"code":"const x = 1;"}'
```

Smoke test:

```bash
npm run smoke
```

## Scripts

- `npm run dev`: start frontend and backend
- `npm run test`: unit and integration tests (Node.js test runner)
- `npm run test:integration`: integration tests only
- `npm run test:e2e`: generate and validate screenshots
- `npm run screenshots`: regenerate screenshots
- `npm run lint`: repo checks (line endings/trailing whitespace)
- `npm run typecheck`: TypeScript checks for backend and packages
- `npm run verify`: full local verification pipeline

## API overview

- `POST /api/analyze`: diagnostics and quick fixes
- `POST /api/format`: format code
- `POST /api/refactor`: apply a quick fix
- `POST /api/suggestions`: legacy suggestions endpoint
- `GET /api/snippets`: snippet library
- `GET /api/runs`: analysis history
- `GET /api/openapi.json`: OpenAPI spec

More details are available in [API.md](API.md).

## Project structure

```
backend/               Node.js API + WebSocket
frontend/              Static HTML/JS UI
packages/shared/       Shared types & validators
packages/analysis-engine/ Rule-based analysis
packages/sdk/          Typed API client
scripts/               Dev utilities and smoke tests
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

MIT
