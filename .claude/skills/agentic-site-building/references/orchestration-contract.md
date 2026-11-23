# Orchestration Contract

## Request schema

- `mode`: create, redesign, scoped edit, or runtime repair.
- `target`: route, component, selector, section, or whole artifact.
- `preserve`: facts, sections, behavior, design tokens, and files outside scope.
- `acceptance`: observable conditions, including responsive and accessibility behavior.
- `budget`: model tier, maximum attempts, context size, and latency ceiling.

## Execution states

`planned -> editing -> validating -> repairing -> accepted -> persisted -> previewed`

Terminal alternatives are `preserved-current`, `rolled-back`, and `failed`. Persist the state transition and failure category without storing secrets or unnecessary prompt content.

## Verification layers

1. Parse and structural validity.
2. Requested-surface fingerprint or feature contract.
3. Collateral-change budget.
4. Runtime behavior for themes, media, animation, and embeds.
5. Browser evidence at critical viewports when the blast radius justifies it.

## Retry policy

- Retry only a recoverable failure.
- Feed the exact failed checks back to the repair attempt.
- Change strategy after repeated failure: patch repair, then bounded rewrite, then preserve current.
- Never loop on rate limits without backoff, provider fallback, and a hard stop.

## Production metrics

Track accepted edits, user re-prompts, patch versus rewrite ratio, verifier failures by category, token and latency percentiles, provider failures, rollback rate, and preview runtime errors.
