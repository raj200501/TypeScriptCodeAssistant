# ADR 0002: Keep a file-backed snippet store

## Status
Accepted

## Context
The project must work out of the box without a database dependency.

## Decision
Maintain a JSON file store in `backend/data/store.json` for snippets and analysis runs. MongoDB is
optional via docker-compose.

## Consequences
- Simple development and testing experience.
- Limited concurrency support; a database can be added later.
