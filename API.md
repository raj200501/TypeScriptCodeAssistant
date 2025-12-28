# API Reference

Base URL: `http://localhost:5000/api`

## POST /api/analyze

Analyze TypeScript code and return diagnostics.

Request:

```json
{
  "code": "const value = 1;",
  "fileName": "example.ts",
  "strict": true,
  "rules": {
    "no-var": true
  }
}
```

Response:

```json
{
  "diagnostics": [],
  "summary": { "errorCount": 0, "warningCount": 0, "infoCount": 0 }
}
```

## POST /api/format

Normalize formatting for a snippet (trims trailing whitespace and enforces a newline).

## POST /api/refactor

Apply a quick fix by ID.

## POST /api/suggestions

Legacy endpoint that returns suggestion strings.

## CRUD /api/snippets

Create, list, update, and delete snippets.

## GET /api/runs

List recorded analysis runs.

## WebSocket /api/stream

Send JSON messages of type `settings` or `analyze` to receive live analysis results.
