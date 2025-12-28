# Security Policy

## Reporting

If you discover a security vulnerability, please open a private security advisory or email the
maintainers. Do not open public issues for sensitive reports.

## Supported versions

Only the latest `main` branch is supported.

## Hardening notes

- API requests are rate limited.
- Payloads are validated with Zod.
- WebSocket analysis is debounced to reduce load.
