# Contributing

Thanks for your interest in contributing to TypeScript Code Assistant!

## Development setup

1. Install dependencies: `npm install`
2. Start the stack: `npm run dev`
3. Run the smoke test: `npm run smoke`

## Quality gates

Before submitting a PR, make sure you have:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:integration`
- `npm run test:e2e`

## Code style

- Use TypeScript strict mode when possible.
- Keep API schemas in `packages/shared`.
- Keep analysis rules in `packages/analysis-engine`.

## Pull requests

- Include a summary of changes.
- Link to any relevant issues or ADRs.
- Update `docs/VERIFICATION.md` with new verification output if you touched runtime behavior.
