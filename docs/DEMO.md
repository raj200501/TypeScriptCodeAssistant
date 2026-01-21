# Demo

## Local demo (copy/paste)

```bash
npm install
npm run build
node scripts/demo.mjs --demo
```

What to expect:
- A temporary workspace path is printed.
- The analysis engine reports diagnostics.
- A quick fix is applied and printed.

## API smoke demo (local-only)

```bash
npm run dev
```

Open:
- Frontend: http://localhost:5173
- Backend health: http://localhost:5000/health
