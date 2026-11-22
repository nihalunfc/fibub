---
title: Azure SQL Database, hands on
summary: 'Create an Azure SQL database (or a free local SQL Server container), connect from Python with Microsoft Entra tokens and no passwords, set up schemas and roles, and bulk-load fast.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: Which way of connecting avoids storing any password for a pipeline running in Azure?
    choices: ['A Microsoft Entra token from a managed identity, through DefaultAzureCredential', 'A SQL login in a .env file', 'Sharing the admin login with the pipeline']
    ans: 0
    why: With a managed identity Azure gives the pipeline a token. No secret exists to leak or rotate.
  - q: Loading 200,000 rows with pyodbc executemany without fast_executemany is slow because...
    choices: ['It makes one network round trip per row; fast_executemany sends rows in batches', 'SQL Server is slow at inserts', 'pandas is slow']
    ans: 0
    why: Waiting on the network dominates. Batching turns 200,000 trips into a few dozen.
  - q: What permission should the Power BI reader have?
    choices: ['db_owner', 'select on the mart schema only', 'alter on all schemas']
    ans: 1
    why: Readers read the modelled layer and nothing else. Least privilege limits the damage of a leaked login.
sources:
  - 'Microsoft Learn: Azure SQL Database documentation (quickstarts, free offer, serverless) https://learn.microsoft.com/en-us/azure/azure-sql/'
  - 'Microsoft Learn: Connect to Azure SQL with Microsoft Entra authentication https://learn.microsoft.com/en-us/azure/azure-sql/database/authentication-aad-overview'
  - 'SQLAlchemy documentation: Microsoft SQL Server dialect (pyodbc, fast_executemany) https://docs.sqlalchemy.org/en/20/dialects/mssql.html'
---

**Module 4 · about 40 minutes · read first: [4.1](/learn/courses/etl/where-data-lives/).** You'll be able to create an Azure SQL database safely (or run the same engine locally for free), connect from Python without a password, organise it into raw, staging and mart schemas with least-privilege users, and load rows fast.

<div class="bigidea">Connecting to a warehouse the safe way means showing an ID badge, not knowing the door code: the pipeline proves who it is with a token Azure gives it, and each badge opens only the rooms it needs.</div>

## 1. Why this matters

Most companies that use Power BI and Microsoft 365 put their warehouse in Azure SQL or SQL Server. Today you build the connection layer every later load in this course uses, and you build it the way a security team would approve.

## 2. Create the database

**Option A: Azure.** In the Azure portal create a resource group (a folder for related resources), for example `rg-p2d`, then an **Azure SQL Database**. Microsoft offers a free Azure SQL Database offer with a monthly allowance; the terms change, so read them in the portal as you create it. Choose:

- **Authentication:** Microsoft Entra only (Entra is Microsoft's sign-in service, formerly Azure Active Directory), or Entra plus SQL logins. Make yourself the Entra admin.
- **Networking:** public endpoint, allow **your own IP address only**. Leave "allow Azure services" off unless you need it.
- **Compute:** serverless with **auto-pause**, so it costs nothing while idle. On day one, set a budget alert in Cost Management.

**Option B: local, free, offline.** The same engine in Docker:

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Str0ng!Passw0rd" \
  -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
```

Everything in this module works on both. Use B for heavy experiments; use A for Entra sign-in and your portfolio screenshots. (The password above is for a throwaway local container only.)

Pick a join type and press Play (or drag Rows built) to watch the result table being made one row at a time. Compare INNER with LEFT, then with FULL.

<figure class="fig" data-fig="@data-join-types"><figcaption>Notice which rows only some joins keep, and where NULL appears: always on the side that had no partner.</figcaption></figure>


## 3. Connect from Python

Install the **Microsoft ODBC Driver 18 for SQL Server** (follow Microsoft's install page for your system), then:

```python
import struct, urllib.parse
import sqlalchemy as sa
from azure.identity import DefaultAzureCredential

SERVER, DB = "p2d-sql.database.windows.net", "p2d"
odbc = (f"Driver={{ODBC Driver 18 for SQL Server}};Server=tcp:{SERVER},1433;Database={DB};"
        "Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30")

def entra_token_connect_args():
    tok = DefaultAzureCredential().get_token("https://database.windows.net/.default").token.encode("utf-16-le")
    return {"attrs_before": {1256: struct.pack(f"<I{len(tok)}s", len(tok), tok)}}  # 1256 = SQL_COPT_SS_ACCESS_TOKEN

engine = sa.create_engine(f"mssql+pyodbc:///?odbc_connect={urllib.parse.quote_plus(odbc)}",
                          connect_args=entra_token_connect_args(), fast_executemany=True, pool_pre_ping=True)
```

`DefaultAzureCredential` tries several ways to prove who you are. On your laptop it uses your `az login`. In Azure it uses a **managed identity** (an identity Azure gives a VM or container, covered in [Lesson 4.6](/learn/courses/etl/security-cost-azure/)). So there is no password anywhere. Tokens expire after a while; for long-running services, create the token when each connection opens (SQLAlchemy's `do_connect` event is the usual place).

For the local container, use a SQL login read from `.env`, with `TrustServerCertificate=yes` (local only, never in production). Microsoft also has a newer native Python driver, `mssql-python`; check its status before choosing it for production.

## 4. Schemas and users

A **schema** is a named folder of tables inside a database. Four folders keep the layers apart:

```sql
create schema raw;   create schema stg;   create schema mart;   create schema ops;   -- ops = audit, watermarks

-- a loader that can write raw, stg and ops, but cannot drop the database
create user [p2d-loader] from external provider;          -- an Entra app or managed identity
-- local container: create login p2d_loader with password = '...'; create user p2d_loader for login p2d_loader;
grant select, insert, update, delete, alter on schema::raw to [p2d-loader];
grant select, insert, update, delete, alter on schema::stg to [p2d-loader];
grant select, insert, update on schema::ops to [p2d-loader];

-- a reader for Power BI
create role report_reader;
grant select on schema::mart to report_reader;
```

This is **least privilege**: each identity can do exactly its job and nothing more. Like keys in a hotel: a guest's card opens one room, a cleaner's opens one floor, and only the manager's opens the safe.

## 5. Loading fast

| Method | Speed | When |
| --- | --- | --- |
| `df.to_sql(...)` with `fast_executemany=True` | Good, up to around a million rows | Daily loads |
| `executemany` without fast mode | Very slow: one round trip per row | Never for bulk |
| `bcp` command-line tool | Fast | Big one-off loads from CSV |
| `BULK INSERT` or `OPENROWSET` from Azure Blob storage | Fastest in Azure | Files already in storage |
| dlt with its SQL Server destination | Good, plus schema changes handled | If you use dlt |

The reason is the network. Every **round trip** (send a request, wait for the answer) takes time, often 10 to 50 ms to a cloud database. Row by row, that waiting adds up to hours.

<div class="steps">
<div class="step"><b>The job.</b> Load 100,000 rows of ad stats. Each round trip to Azure SQL takes 30 ms.</div>
<div class="step"><b>Row by row.</b> 100,000 trips × 30 ms = 3,000 s, about 50 minutes of pure waiting, before the database has done any real work.</div>
<div class="step"><b>Batches of 10,000.</b> <code>fast_executemany</code> sends rows as arrays: 10 trips × 30 ms = 0.3 s of waiting.</div>
<div class="step"><b>The rest.</b> Now the data's size and the database's write speed dominate, which is what you want. Batches that are too big hit memory and log limits, so 10,000 to 100,000 rows is a good range to tune in.</div>
</div>

<div class="problem" data-problem="azure-sql-hands-on-roundtrips"></div>

<div class="meaning">

<dl>
<dt>Entra token</dt><dd>A short-lived pass from Microsoft's sign-in service that proves who the pipeline is, instead of a password.</dd>
<dt>Managed identity</dt><dd>An identity Azure gives a VM, container or function, so code running there can get tokens with no stored secret.</dd>
<dt>Schema</dt><dd>A named folder of tables inside one database: raw, stg, mart, ops.</dd>
<dt>Round trip</dt><dd>One request to the database and its answer. Fewer, bigger trips load faster.</dd>
<dt>Physical meaning</dt><dd>A security reviewer asks "where is the database password stored?" and the answer is "there isn't one: the pipeline's VM has a managed identity that can write only to raw, stg and ops". That one sentence often decides whether your pipeline is allowed near customer data.</dd>
</dl>

</div>

<div class="myth">

**"A strong admin password in a config file is secure enough."** One shared admin login means one leak exposes everything, and nobody can tell which job did what. Security teams say yes to Entra-only sign-in, managed identities, IP-restricted or private network access, one least-privilege user per job, and auditing turned on. Build it that way, and say so in your README.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** network round trips dominate small-batch loading. Batching turns `$N$` trips into `$N/b$`.

**Equation:** for `$N$` rows of `$s$` bytes in batches of `$b$`, with round-trip time RTT:

```math
T \approx \frac{N}{b}\cdot \text{RTT} + \frac{N \cdot s}{\text{bandwidth}}
```

Row by row (`$b = 1$`) at 30 ms for 100,000 rows: 3,000 s. Batches of 10,000: 0.3 s of waiting plus the transfer.

**Analogy:** moving house with one van trip instead of one trip per box.

**Where it breaks:** huge batches hit memory and transaction-log limits. Tune `$b$` between about 10,000 and 100,000 rows.

**Try it:** 500,000 rows, RTT 20 ms, `$b$` = 5,000. Waiting time? (100 trips × 20 ms = 2 s.)
</details>

## 6. Try it

1. Create the database (option A, B, or both). If A, set a budget alert straight away.
2. Build `warehouse/azure_sql.py`: an engine factory that uses an Entra token (A) or a SQL login (B), chosen by a setting.
3. Create the four schemas, a loader user and a reader role.
4. Load `raw.ads_daily` from your staging Parquet with `to_sql` and `fast_executemany`. Time it at 10,000, 100,000 and 1,000,000 rows (repeat rows to scale up). Then time 10,000 rows without fast mode. Put the four timings in a table.
5. Create `ops.load_audit(load_id, asset, partition_key, rows, started_at, finished_at, status)` and insert one row per load.

**What to check:** connecting as the reader and running `insert into mart...` fails with a permission error; `grep -ri password src/` finds no real secret; the timing table shows fast mode many times faster than plain mode. Commit as `feat(warehouse): Azure SQL connection with Entra tokens, schemas, roles, timed bulk load`.

<div class="keypoints">

- Run the same engine two ways: Azure SQL (serverless, auto-pause, budget alert) or a free local SQL Server container.
- Connect with Microsoft Entra tokens via DefaultAzureCredential: your az login locally, a managed identity in Azure, no password anywhere.
- Split the database into raw, stg, mart and ops schemas, and give each identity only the rights its job needs.
- Batch your inserts: round trips dominate, and fast_executemany turns hours of waiting into seconds.

</div>
