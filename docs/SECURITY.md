# Security

## Threat model (baseline)

- **Input validation**: API endpoints accept user-provided code/snippet content.
- **Local storage**: Snippets and analysis history persist on disk.
- **Service availability**: Backend enforces simple rate limiting.

## Safe defaults

- No external network calls during analysis.
- Health check is minimal and does not expose secrets.
- WebSocket streams are limited to analysis updates.

## Intentional restrictions

- No authentication or multi-tenant isolation (local-only demo scope).
- No external telemetry exporters (optional scaffolding is off by default).

## Recommendations for production

- Add authn/authz for API access.
- Run behind a reverse proxy with TLS.
- Configure a dedicated persistent store for snippets.
