# Architecture Checklist

## Critical paths

- Authentication, signup, and account recovery.
- Primary read and write journeys.
- Upload, parsing, generation, publishing, and public delivery.
- Billing, admin, destructive operations, and external webhooks.

## Data and jobs

- Constraints encode invariants and hot queries have measured indexes.
- Transaction boundaries prevent partial state.
- Files have type, size, malware, access, and lifecycle policies.
- Jobs expose state, retries, backoff, idempotency, and dead-letter handling.

## Reliability and operations

- Dependencies have timeouts, circuit behavior, and degraded modes.
- Deployments run compatible migrations and have health checks and rollback.
- Logs carry request or job IDs; metrics cover latency, errors, saturation, and queue age.
- Alerts identify an owner and a user-visible symptom.
- Cost budgets cover compute, storage, egress, third-party APIs, and AI tokens.

## Extraction test

Extract a service only when at least one is true: it needs materially different scaling, a separate security boundary, independent release ownership, or fault isolation that cannot be achieved cleanly inside the current deployment.
