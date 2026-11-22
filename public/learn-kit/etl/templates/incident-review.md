# Post-incident review: <short title>

Blameless: this review asks how the process let the problem through, never who to blame.

- **Date of incident:** YYYY-MM-DD
- **Written by / reviewed by:**
- **Status:** draft | final

## Summary (3 sentences)
What broke, who saw a wrong or late number, and how long it lasted.

## Impact
| Report or table | What readers saw | From | To | Who was affected |
| --- | --- | --- | --- | --- |
| | | | | |

## Timeline (times in one stated time zone)
| Time | What happened | Evidence (link) |
| --- | --- | --- |
| | Alert fired / user reported | |
| | Triage started | |
| | Cause found | |
| | Fix released / data corrected | |
| | Readers told | |

## Evidence ladder
1. Is it real? (the check's own data, or "measurement unavailable")
2. Where in the chain? manifest -> run log -> load audit -> data quality -> mart -> report
3. What changed? source shape, code deploy, config, volume
4. Verdict: source issue | pipeline bug | expected behaviour | transient | not yet determined

## Root cause
The single change or condition that, if absent, would have prevented the incident.

## Why it was not caught earlier
Which check was missing, too loose, or not blocking.

## Actions
| Action | Owner | Due | Done |
| --- | --- | --- | --- |
| Add or tighten a check | | | |
| Add a test that reproduces it | | | |
| Update the runbook | | | |
