# Baseline Audit

## Repository inspection

- Stack: Node.js + TypeScript (Vite frontend, Node backend, shared packages)
- Workspaces: `backend`, `frontend`, `packages/*`, `shared`
- CI: `.github/workflows/ci.yml` (Node 22)
- Documented commands: `npm install`, `npm run verify`, `npm run smoke`

## Commands run

### Install

```bash
npm install
```

Summary:
- Completed successfully.
- Warning: `npm warn Unknown env config "http-proxy"`.

### Full verification

```bash
npm run verify
```

Summary:
- Lint, typecheck, build, unit tests, integration tests, e2e screenshots, and smoke tests completed successfully.
- Warning: `npm warn Unknown env config "http-proxy"`.

## Notes

- Output logs recorded in the terminal session for this audit.
