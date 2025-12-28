# Verification

## Environment assumptions

- Node.js 22+
- npm 11+
- Ports: 5000 (backend) and 5173 (frontend)

## Commands run

### Install

```bash
npm install
```

Output:

```
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

added 5 packages in 865ms
```

### Full verification

```bash
npm run verify
```

Output:

```
> verify
> npm run lint && npm run typecheck && npm run test && npm run test:integration && npm run test:e2e && npm run smoke

Lint checks passed.
Frontend build complete.
✔ backend endpoints respond (471.715649ms)
✔ analysis engine reports diagnostics (2.462574ms)
✔ analysis engine applies quick fixes (0.895625ms)
ℹ tests 3
ℹ pass 3

✔ backend endpoints respond (495.886441ms)
ℹ tests 1
ℹ pass 1

Screenshots generated and cleaned.
Smoke test passed
```

### Smoke test

```bash
npm run smoke
```

Output:

```
> smoke
> ./scripts/smoke_test.sh

Smoke test passed
```

## Screenshot outputs

SVG previews are committed under `docs/screenshots/*.svg` and regenerated with:

```bash
npm run screenshots:svg
```

PNG screenshots used for e2e verification are generated at runtime and removed automatically.

## Checklist

- [x] `npm install` succeeds
- [x] `npm run verify` passes
- [x] `npm run smoke` passes
- [x] SVG previews exist under `docs/screenshots/*.svg`
