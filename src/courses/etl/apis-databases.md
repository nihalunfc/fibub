---
title: APIs and source databases
summary: 'Pull paginated APIs with retries, backoff and rate limits, re-pull late-changing days with a look-back window, and choose full, incremental or CDC extracts.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: Ad conversions for a day keep changing for about a week. What should the daily job do?
    choices: ['Load each day once and never touch it again', 'Re-pull and replace the last 7 days every run, and label them provisional', 'Wait 7 days before loading anything']
    ans: 1
    why: A look-back window keeps recent days fresh while their numbers settle.
  - q: Which extraction method catches rows deleted from a source table?
    choices: ['Incremental by updated_at', 'Change data capture from the transaction log (or a full extract compared with the last one)', 'Reading only new ids']
    ans: 1
    why: A filter on timestamps can never see a row that no longer exists. The transaction log records the delete.
  - q: 'An API answers 429 with "Retry-After: 30". What should your client do?'
    choices: ['Retry at once', 'Wait at least 30 seconds, then retry', 'Switch to a second API key']
    ans: 1
    why: Obey the server's instruction. It is how you avoid being blocked, and a second key to dodge limits may break the terms of use.
sources:
  - 'Fielding, R., Nottingham, M. and Reschke, J. (2022), RFC 9110: HTTP Semantics, Section 10.2.3 Retry-After https://www.rfc-editor.org/rfc/rfc9110'
  - 'Nottingham, M. and Fielding, R. (2012), RFC 6585: Additional HTTP Status Codes (429 Too Many Requests) https://www.rfc-editor.org/rfc/rfc6585'
  - 'dlt (data load tool) documentation https://dlthub.com/docs/'
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly Media, Chapter 11 (change data capture)'
---

**Module 1 · about 40 minutes · read first: 1.2, 1.4.** You'll be able to write an API client that pages through results, retries politely, respects rate limits and re-pulls recent days that are still changing. You'll also know the three ways to extract from a source database and when a library like dlt saves you work.

<div class="bigidea">Talking to an API is a phone call to a busy office: ask one page at a time, if the line is busy wait a little longer each time before calling back, and ring again about last week's numbers because they are still being corrected.</div>

## 1. Why this matters

Ad platforms, cloud till systems, booking engines, CRMs and payment providers all offer **REST APIs**: web addresses that return data (usually JSON) when you ask. Marketing data is the hardest teacher, because the numbers for "yesterday" keep changing for days as late sales are credited to ads. And sometimes the source is a company **database** you are allowed to read.

## 2. A well-behaved API client

```python
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def session():
    s = requests.Session()
    retry = Retry(total=5, backoff_factor=1.5, status_forcelist=[429, 500, 502, 503, 504],
                  respect_retry_after_header=True, allowed_methods=["GET"])
    s.mount("https://", HTTPAdapter(max_retries=retry))
    s.headers["Authorization"] = f"Bearer {settings.ads_token}"
    return s

def fetch_day(s, day: str):
    url, params, pages = f"{BASE}/reports/daily", {"date": day, "page": 1}, []
    while True:
        r = s.get(url, params=params, timeout=30)
        r.raise_for_status()
        body = r.json()
        pages.append(body)                     # land every page raw, unchanged
        if not body.get("next_page"):
            return pages
        params["page"] = body["next_page"]
```

**Pagination** (splitting results into pages) comes in three shapes: **page number**, **offset and limit**, and **cursor** (the server hands you a token or link for the next page). Cursors are the safest when data changes while you read. The exact backoff timing of the `Retry` helper depends on your urllib3 version, so check its docs if the waits matter.

Watch a call that keeps failing, then succeeds:

<div class="steps" data-fig="apis-databases-backoff">
<div class="step"><b>Attempt 1: 503</b> (service unavailable). The server is struggling. Wait the base time, 1.5 seconds.</div>
<div class="step"><b>Attempt 2: 503 again.</b> Double the wait: 3 seconds. Doubling gives the server more room each time.</div>
<div class="step"><b>Attempt 3: 502</b> (bad gateway). Double again: 6 seconds.</div>
<div class="step"><b>Attempt 4: 429</b> (too many requests) with <code>Retry-After: 20</code>. The rule would say 12 seconds, but the server asked for 20, and the server wins.</div>
<div class="step"><b>Attempt 5: 200 OK.</b> About 30 seconds after the first try, the page arrives and is landed raw, unchanged.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** exponential backoff spaces out retries so a struggling server can recover. A little random **jitter** stops thousands of clients from retrying at the same instant.

**Equation:** the wait before retry `$k$` is

```math
t_k = b \cdot 2^{k-1} + U(0, j)
```

where `$b$` is the base wait and `$U(0, j)$` a random extra between 0 and `$j$`. With `$b = 1.5$` s: 1.5, 3, 6, 12, 24 s. Without jitter the total over `$n$` retries is `$b(2^n - 1)$`.

**Analogy:** calling a busy friend: you wait a minute, then two, then four, instead of redialling every second. Where it breaks: a `429` with a `Retry-After` header overrides your formula. Obey it.

**Try it:** `$b = 2$` s and 4 retries. Longest total wait without jitter? *(2 + 4 + 8 + 16 = 30 s.)*
</details>

<div class="problem" data-problem="apis-databases-backoff"></div>

## 3. Data that changes after the fact

Ad conversions, hotel bookings (changed, cancelled), till refunds: yesterday's numbers are not final. The pattern is a **look-back window**: every run re-pulls the last `$N$` days and replaces them.

```math
\text{pull}(d) \text{ for every } d \in [\text{today} - N,\ \text{today} - 1]
```

Choose `$N$` from the data, not by guessing: measure how much a day's total still changes after 1, 3, 7 and 14 days. If changes after day 7 are under 0.1% of spend, `$N = 7$` is a defensible choice, and the report footer says "last 7 days provisional".

<div class="problem" data-problem="apis-databases-lookback"></div>

## 4. When the source is a database

| Method | How | Load on the source | Catches deletes? |
|---|---|---|---|
| **Full extract** | `SELECT *` every night | High, and it grows forever | Yes, by comparing with the last copy |
| **Incremental** | `WHERE updated_at > :watermark` | Low | No, unless rows are soft-deleted (flagged, not removed) |
| **CDC** (change data capture) | Read the database's transaction log: SQL Server CDC or Change Tracking, Postgres logical replication, Debezium | Lowest | Yes |

Always read from a **replica or a read-only login**, during agreed hours, with a query timeout. A heavy query on a restaurant's till database at lunchtime is how you meet the operations director.

<div class="meaning">

<dl>
<dt>Pagination</dt><dd>Getting results a page at a time: by page number, by offset, or by a cursor the server gives you.</dd>
<dt>Exponential backoff</dt><dd>Waiting twice as long after each failure before trying again.</dd>
<dt>Rate limit</dt><dd>The most calls an API allows per minute (or hour). Going over earns a 429.</dd>
<dt>Look-back window</dt><dd>Re-pulling and replacing the last N days on every run, because they may still change.</dd>
<dt>CDC</dt><dd>Reading every insert, update and delete from the database's own log of changes.</dd>
<dt>Physical meaning</dt><dd>An ad agency's client asks why yesterday's cost per sale fell overnight. Without a look-back window, the dashboard froze day one's half-counted conversions forever; with it, the number settles within a week and the report says which days are still provisional. Polite retries keep the agency's key from being blocked on the busiest morning of the month.</dd>
</dl>

</div>

<div class="myth">

**"Incremental loads by updated_at give me an exact copy of the table."** They miss every row that was hard-deleted, and every update made by a process that forgot to touch `updated_at`. Use CDC, or compare a periodic full extract, if deletes matter (they usually do for refunds and cancellations).

</div>

## 5. dlt: the same job in a few lines

**dlt** (data load tool) is an open-source Python library that handles pagination, incremental state, schema inference and changes, and loading into DuckDB, Postgres, SQL Server and Azure SQL, Snowflake, BigQuery and more (check its docs for the current list).

```python
import dlt
from datetime import date, timedelta

def days_between(start: str, end: date):
    d = date.fromisoformat(start)
    while d <= end:
        yield d.isoformat()
        d += timedelta(days=1)

@dlt.resource(write_disposition="merge", primary_key=["date", "campaign_id"])
def ad_stats(cursor=dlt.sources.incremental("date", initial_value="2026-09-01")):
    s = session()
    start = (date.fromisoformat(cursor.last_value) - timedelta(days=7)).isoformat()   # 7-day look-back
    for d in days_between(start, date.today() - timedelta(days=1)):
        for page in fetch_day(s, d):
            yield page["data"]          # dlt infers the schema, keeps state, merges on the key

pipeline = dlt.pipeline("ads", destination="duckdb", dataset_name="raw_ads")
print(pipeline.run(ad_stats()))         # change the destination later without changing the resource
```

Know both levels. Tools like dlt and Airbyte are excellent, and you would use them in a real low-cost stack (Module 7). But incidents and interviews test whether you understand what they do underneath: pagination, state, merge keys, schema changes. Build it by hand once, then adopt the tool and write down why. "I wrote the client, then replaced 300 lines with dlt and kept my tests" is a strong story.

## 6. Try it

1. Serve the course ad JSON as a fake API. Save this as `fake_api.py` and run it with `uv run fastapi dev fake_api.py` (install `fastapi[standard]` first):

   ```python
   import json
   from pathlib import Path
   from fastapi import FastAPI, HTTPException

   app, DIR = FastAPI(), Path("data/landing/api/ads")

   @app.get("/reports/daily")
   def daily(date: str, page: int = 1):
       f = DIR / f"{date}.json"
       if not f.exists():
           raise HTTPException(404)
       return json.loads(f.read_text())["pages"][page - 1]
   ```

2. Write `sources/ads_api.py` with retries, pagination and a 7-day look-back. Land each page raw as JSON lines with a `fetched_at` field.
3. Make the fake API return a `429` on 10% of calls and check your retries cope; log the retry counts.
4. Notice `spend_micros` (spend × 1,000,000) and the occasional `currency: USD`. Do not fix them yet; note them in `notes/sources.md` for Module 2.
5. Rebuild the same extract with dlt into DuckDB and compare row counts with your hand-built version. Write five lines in the README on what dlt gave you for free.

Commit: `feat(ingest): ads API client with backoff and look-back; dlt comparison`.

**What to check:** with the random 429s switched on, a full run still lands every page, and the row counts from your client and from dlt match.

## 7. Practice

1. A cursor-paginated API returns `next: null`. What does your loop do?
2. Your job re-pulls 7 days every morning, and Sunday's total changed on Wednesday. Is that a bug?
3. Why read from a replica rather than the main till database?

<details>
<summary>Answers</summary>

1. Stop: there are no more pages. Land what you have.
2. No. That is exactly why the look-back exists. Sunday is still inside the window and marked provisional.
3. A heavy read on the main database slows the tills for customers. A replica (or agreed quiet hours with a timeout) keeps your extract from hurting the business.
</details>

**New words:** *REST API*, *pagination*, *cursor*, *exponential backoff*, *jitter*, *rate limit*, *look-back window*, *incremental extract*, *CDC*, *dlt*.

<div class="keypoints">

- Page through APIs (cursors are safest), land every page raw, and set timeouts.
- Retry with exponential backoff and jitter, and always obey a Retry-After header.
- Data that changes after the fact needs a look-back window sized from measurements, with provisional days labelled.
- Full, incremental and CDC extracts differ in load and in whether they see deletes; read from a replica.

</div>
