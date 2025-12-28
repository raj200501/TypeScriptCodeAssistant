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

up to date in 328ms
```

### Full verification

```bash
npm run verify
```

Output:

```
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> verify
> npm run lint && npm run typecheck && npm run test && npm run test:integration && npm run test:e2e && npm run smoke

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> lint
> node tools/lint.mjs

Lint checks passed.

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> typecheck
> npm run build --workspace packages/shared && npm run build --workspace packages/analysis-engine && npm run build --workspace packages/sdk && tsc -p backend/tsconfig.json --noEmit

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> @tca/shared@0.1.0 build
> tsc -p tsconfig.json

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> @tca/analysis-engine@0.1.0 build
> tsc -p tsconfig.json

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> @tca/sdk@0.1.0 build
> tsc -p tsconfig.json

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> test
> npm run build && node --test tests/**/*.test.js

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> build
> npm run build --workspace packages/shared && npm run build --workspace packages/analysis-engine && npm run build --workspace packages/sdk && npm run build --workspace backend && npm run build --workspace frontend

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> @tca/shared@0.1.0 build
> tsc -p tsconfig.json

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> @tca/analysis-engine@0.1.0 build
> tsc -p tsconfig.json

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> @tca/sdk@0.1.0 build
> tsc -p tsconfig.json

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> build
> tsc -p tsconfig.json

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> build
> node build.mjs

Frontend build complete.
{"level":"info","message":"Server running","port":"40155"}
{"level":"info","message":"request","requestId":"6f7013af-1ad2-4916-91e9-6d2e2dfc7015","method":"GET","path":"/health"}
{"level":"info","message":"request","requestId":"78e79ec2-468b-4fc6-9f1f-4d35651df691","method":"POST","path":"/api/suggestions"}
{"level":"info","message":"request","requestId":"5ece631a-4e2f-4b09-a7c1-f8630ad305e1","method":"POST","path":"/api/snippets"}
{"level":"info","message":"request","requestId":"277301ec-d091-42d5-b4a8-c19f755f8f1d","method":"GET","path":"/api/snippets/snip_1766913535255_9982"}
✔ backend endpoints respond (424.893156ms)
✔ analysis engine reports diagnostics (1.811744ms)
✔ analysis engine applies quick fixes (0.671351ms)
ℹ tests 3
ℹ suites 0
ℹ pass 3
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 719.155137

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> test:integration
> node --test tests/integration/**/*.test.js

{"level":"info","message":"Server running","port":"33695"}
{"level":"info","message":"request","requestId":"5e55e844-a6bd-49e3-a0a5-c1fb1fb42e45","method":"GET","path":"/health"}
{"level":"info","message":"request","requestId":"8e63825d-7e3e-4e6a-ad1c-f66b6cd304f4","method":"POST","path":"/api/suggestions"}
{"level":"info","message":"request","requestId":"6688b73b-b3ee-4d4e-8454-7eaef45b4dab","method":"POST","path":"/api/snippets"}
{"level":"info","message":"request","requestId":"a7082916-e6cf-4f01-9248-a48c5d5bf7bc","method":"GET","path":"/api/snippets/snip_1766913536240_1241"}
✔ backend endpoints respond (425.198968ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 625.917136

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> test:e2e
> node tools/screenshots.mjs && node tools/check-screenshots.mjs

Screenshots generated and cleaned.

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

> smoke
> ./scripts/smoke_test.sh

Smoke test passed
```

## Screenshot outputs

Screenshots are generated locally and cleaned after verification. Expected filenames:

- `docs/screenshots/editor-analysis.png`
- `docs/screenshots/editor-quick-fix.png`
- `docs/screenshots/snippets-library.png`

## Net new LOC measurement

```bash
git diff --stat HEAD~1
```

Output:

```
 .editorconfig                                      |  12 +
 .github/workflows/ci.yml                           |  22 ++
 .gitignore                                         |  13 +
 .prettierrc                                        |   5 +
 API.md                                             |  53 +++
 ARCHITECTURE.md                                    |  43 +++
 CHANGELOG.md                                       |   9 +
 CODE_OF_CONDUCT.md                                 |   9 +
 CONTRIBUTING.md                                    |  31 ++
 Dockerfile.backend                                 |  12 +
 Dockerfile.frontend                                |  12 +
 Makefile                                           |  25 ++
 README.md                                          | 122 ++++---
 ROADMAP.md                                         |  13 +
 SECURITY.md                                        |  16 +
 backend/analysis.integration.test.ts               |  20 ++
 backend/app-verified.ts                            |  16 +-
 backend/app.ts                                     |  13 +-
 backend/controllers/analysisController.ts          |  47 +++
 backend/controllers/snippetController.ts           |   6 +
 backend/controllers/suggestionController.ts        |  18 +-
 backend/fileDatabase.test.ts                       |  16 +
 backend/middleware/requestId.ts                    |   7 +
 backend/openapi.ts                                 |  99 ++++++
 backend/package.json                               |  18 +-
 backend/routes/analysisRoutes.ts                   |  10 +
 backend/routes/snippetRoutes.ts                    |   2 +
 backend/server-verified.ts                         |  10 +-
 backend/server.ts                                  |  10 +-
 backend/services/fileDatabase.ts                   |  35 +-
 backend/services/formatService.ts                  |   5 +
 backend/services/suggestionService.ts              |   3 +-
 backend/tsconfig.json                              |  27 +-
 backend/utils/codeAnalysis.ts                      |  34 +-
 backend/utils/logger.ts                            |   8 +
 backend/vitest.config.ts                           |   9 +
 backend/vitest.integration.config.ts               |   9 +
 backend/websocket/analyzeSocket.ts                 | 166 +++++++++
 docker-compose.yml                                 |  23 ++
 docs/VERIFICATION.md                               | 177 ++++++++++
 docs/adr/0001-analysis-engine.md                   |  17 +
 docs/adr/0002-file-backed-store.md                 |  15 +
 docs/adr/0003-websocket-streaming.md               |  15 +
 examples/analyze-request.json                      |   5 +
 examples/snippet.ts                                |   4 +
 frontend/index.html                                |  23 +-
 frontend/package.json                              |  22 +-
 frontend/playwright.config.ts                      |  18 +
 frontend/playwright/app.spec.ts                    |  35 ++
 frontend/src/App.css                               | 386 +++++++++++----------
 frontend/src/App.tsx                               |  16 +-
 frontend/src/components/AnalysisSummary.tsx        |  25 ++
 frontend/src/components/CodeEditor.tsx             |   4 +-
 frontend/src/components/DiagnosticsList.tsx        |  44 +++
 frontend/src/components/Footer.tsx                 |   6 +-
 frontend/src/components/Header.tsx                 |  18 +-
 frontend/src/components/HistoryList.tsx            |  32 ++
 frontend/src/components/MonacoEditor.tsx           |  18 +
 frontend/src/components/QuickFixPreview.tsx        |  41 +++
 frontend/src/components/SettingsPanel.tsx          |  58 ++++
 frontend/src/components/SnippetList.tsx            |  37 ++
 frontend/src/hooks/useSettings.ts                  |  40 +++
 frontend/src/pages/EditorPage.tsx                  | 140 +++++++-
 frontend/src/pages/HomePage.test.tsx               |  15 +
 frontend/src/pages/HomePage.tsx                    |  43 ++-
 frontend/src/pages/RunsPage.tsx                    |  28 ++
 frontend/src/pages/SettingsPage.tsx                |  32 ++
 frontend/src/pages/SnippetsPage.tsx                | 101 ++++++
 frontend/src/services/api.ts                       |  15 +-
 frontend/src/services/tcaClient.ts                 |   5 +
 frontend/src/test/setup.ts                         |   1 +
 frontend/tsconfig.json                             |  12 +-
 frontend/vitest.config.ts                          |  11 +
 package.json                                       |  23 +-
 packages/analysis-engine/package.json              |  15 +
 packages/analysis-engine/src/engine.ts             | 126 ++++++++
 packages/analysis-engine/src/index.ts              |   2 +
 packages/analysis-engine/src/rules/noConsoleRule.ts     |  36 ++
 packages/analysis-engine/src/rules/noNonNullAssertionRule.ts            |  28 ++
 packages/analysis-engine/src/rules/noVarRule.ts    |  36 ++
 packages/analysis-engine/src/rules/preferConstRule.ts   |  36 ++
 packages/analysis-engine/src/rules/types.ts        |  33 ++
 packages/analysis-engine/src/tests/engine.test.ts  |  19 +
 packages/analysis-engine/src/utils/range.ts        |  13 +
 packages/analysis-engine/tsconfig.json             |  13 +
 packages/sdk/package.json                          |  15 +
 packages/sdk/src/client.ts                         |  78 +++++
 packages/sdk/src/index.ts                          |   1 +
 packages/sdk/tsconfig.json                         |  12 +
 packages/shared/package.json                       |  13 +
 packages/shared/src/index.ts                       |   2 +
 packages/shared/src/schemas.ts                     |  43 +++
 packages/shared/src/types.ts                       |  84 +++++
 packages/shared/tsconfig.json                      |   8 +
 scripts/smoke_test.sh                              |  10 +-
 tools/measure-loc.mjs                              |   4 +
 tsconfig.base.json                                 |  19 +
 97 files changed, 2741 insertions(+), 395 deletions(-)
```

## Checklist

- [x] `npm install` succeeds
- [x] `npm run verify` passes
- [x] `npm run smoke` passes
- [x] Screenshots are generated locally and cleaned
