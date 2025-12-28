# TypeScript Code Assistant

Welcome to the TypeScript Code Assistant! This innovative project aims to enhance the TypeScript development experience by providing real-time code suggestions, error checks, and refactoring options.

## Features

- **Real-time Code Suggestions:** Get suggestions while you code.
- **Error Checks:** Detect errors in your code instantly.
- **Refactoring Options:** Improve your code with suggested refactoring.

## ✅ Verified Quickstart

The original README did not include runnable commands. The following steps were verified locally and will start both the backend API and frontend UI:

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

## Troubleshooting

- **Port already in use**: Set a different port with `PORT=5055 npm run dev:backend` (the frontend can still run on 5173).
- **MongoDB not running**: The verified backend entrypoint (`backend/server-verified.ts`) does not require MongoDB. If you run `backend/server.ts` directly, it will attempt to connect to a local MongoDB instance.

## ✅ Verified Quickstart (workspace install)

If your environment blocks installing root devDependencies, use the workspace-only install command and the custom dev runner:

```bash
npm run install:workspaces
npm run dev:all
```

Then visit:
- Frontend: http://localhost:5173
- Backend health: http://localhost:5000/health

## UI Notes

The editor includes a sample snippet loader and a quick insights section to demonstrate the suggestion workflow. Use the **Load Example** button to populate the editor and run **Analyze Code** to see response cards.

### Alternative install if registry blocks workspace-root deps

If you continue to see a 403 for `concurrently`, install each workspace directly:

```bash
npm run install:workspaces:direct
```

If the workspace install still attempts to download root-only dependencies, use the prefix-based installer:

```bash
npm run install:workspaces:prefix
```

- **Registry access blocked**: If `npm install` fails with a 403, your environment may block npm registry access. You will need to configure a mirror or allowlist npmjs.org to install dependencies.

## ✅ Preview Without Dependencies

If npm installs are blocked, you can still run a lightweight preview server (no dependencies required):

```bash
npm run preview:static
```

Then open http://localhost:4173 to interact with a mock suggestions flow that mirrors the API response shape.

## Additional Preview Pages

The preview server exposes multiple static demo pages:

- http://localhost:4173/preview-dashboard
- http://localhost:4173/preview-workflows
- http://localhost:4173/preview-insights

## Backend File-Backed API (Verified Entry Point)

When running `backend/server-verified.ts`, the API now includes file-backed snippet storage:

- `GET /api/snippets`
- `POST /api/snippets`
- `GET /api/snippets/:id`
- `PUT /api/snippets/:id`
- `DELETE /api/snippets/:id`
- `POST /api/snippets/:id/analyze`
- `GET /api/analyses?snippetId=<id>`

These endpoints persist to `backend/data/store.json` (created automatically).
