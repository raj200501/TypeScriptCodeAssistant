# Observability

## Metrics (opt-in)

Set `ENABLE_METRICS=1` to expose a Prometheus-style endpoint at `GET /metrics`.

Example:

```bash
ENABLE_METRICS=1 npm run dev:backend
curl http://localhost:5000/metrics
```

## OpenTelemetry scaffolding (opt-in)

Set `ENABLE_OTEL=1` to enable in-process OpenTelemetry hooks. By default no exporters are configured, so the scaffolding is safe for local development and tests.

Example:

```bash
ENABLE_OTEL=1 npm run dev:backend
```

## Structured logging

Use the JSON logger in `backend/utils/logger.ts` or the optional `createLogger` helper to switch between `json` and `pretty` formats.
