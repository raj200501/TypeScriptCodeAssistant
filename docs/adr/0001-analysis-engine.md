# ADR 0001: Use ts-morph for rule-based analysis

## Status
Accepted

## Context
We need a deterministic analysis engine for TypeScript without relying on an LLM. The engine must
produce diagnostics and quick fixes while supporting plugin rules.

## Decision
Adopt ts-morph to traverse the TypeScript AST and implement a rule registry. Each rule provides
metadata, diagnostics, and optional quick fixes.

## Consequences
- Rules are strongly typed and easy to extend.
- Analysis runs entirely in-process.
- Performance is sufficient for single-file analysis but may need optimization for multi-file runs.
