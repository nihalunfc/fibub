# daily-data-platform: acceptance checklist

Tick an item only when the evidence link works on a fresh clone.

| # | Criterion | Evidence (link) | Done |
| --- | --- | --- | --- |
| 1 | One command (`just demo`) generates data, starts the stack and materialises everything | README, video | [ ] |
| 2 | Four sources land idempotently with a manifest and a completeness report | screenshot, test | [ ] |
| 3 | Contracts, quarantine, five data-quality families, robust volume checks | DQ report | [ ] |
| 4 | Dagster: partitions, sensors, retries, blocking checks, a backfill | screenshots | [ ] |
| 5 | Warehouse resource with at least 2 targets; merge or delete-insert loads; load audit | tests, audit query | [ ] |
| 6 | dbt star schemas for each business; SCD2; tests; docs | dbt docs | [ ] |
| 7 | Metric dictionary and the key metrics for each business | docs, dashboards | [ ] |
| 8 | Dashboards (Power BI and/or Metabase) with row-level security and a freshness banner | screenshots | [ ] |
| 9 | Idempotent daily email with the partial-data rule | screenshot | [ ] |
| 10 | SLOs, health dashboard, 2 triage reports, 1 incident review | docs | [ ] |
| 11 | CI green; data diff; Dockerfile; deploy and rollback docs | Actions run | [ ] |
| 12 | Cost model, security and ops plan, business case, ADRs | docs | [ ] |
| 13 | End-to-end reconciliation check runs before the email and blocks it on a gap | asset check | [ ] |
