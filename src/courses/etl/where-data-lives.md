---
title: Choosing where the data lives
summary: 'OLTP or OLAP, row store or column store, one machine or many. Put Azure SQL, Postgres, DuckDB, ClickHouse, BigQuery and Fabric on one map, size the data first, then decide.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: Which of these is an analytical (OLAP) workload?
    choices: ['Saving a hotel booking', 'Total ad spend by channel by week for two years', 'Updating one customer''s email address']
    ans: 1
    why: Analytics scans many rows, reads a few columns and adds them up. The other two touch one row by its key.
  - q: A 40-store retailer has 15 GB of compressed sales history and uses Microsoft 365 and Power BI. A sensible first warehouse?
    choices: ['A 10-node ClickHouse cluster', 'Azure SQL Database (or Postgres) with a columnstore index on the sales fact', 'A Spark cluster']
    ans: 1
    why: Size and ecosystem both point to one managed SQL database. Clusters solve problems this company does not have.
  - q: Why does a column store answer "total revenue" faster than a row store?
    choices: ['It reads only the revenue column, compressed, instead of every column of every row', 'It keeps all data in memory', 'It skips half the rows at random']
    ans: 0
    why: Values of one column sit together on disk and compress well, so a sum over one column reads a small fraction of the bytes.
sources:
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 3 (OLTP versus OLAP, column-oriented storage)'
  - 'Abadi, D., Boncz, P. and Harizopoulos, S. (2013), The Design and Implementation of Modern Column-Oriented Database Systems, Foundations and Trends in Databases 5(3) https://doi.org/10.1561/1900000024'
  - 'Microsoft Learn: Columnstore indexes overview https://learn.microsoft.com/en-us/sql/relational-databases/indexes/columnstore-indexes-overview'
  - 'Nygard, M. (2011), Documenting Architecture Decisions (the ADR format) https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions'
---

**Module 4 · about 35 minutes · read first: [3.7](/learn/courses/etl/proof-hotel-dagster/).** You'll be able to tell transaction and analytics workloads apart, explain row and column stores, place the main warehouses on one map, estimate data size before choosing, and write the choice down as a decision record.

<div class="bigidea">A warehouse is a library built for reading, not writing: choose it by how much you have, who will look after it, and where the company already lives, and estimate the size before you shop.</div>

## 1. Why this matters

"Which database should we use?" is a decision an experienced data person is expected to make and defend. The wrong answer costs a company years: a warehouse too small, too expensive, or one nobody on the team can run. In this lesson you build the map. In the rest of the module you load data into four of the places on it.

## 2. Two kinds of work

Databases do two very different jobs.

| | OLTP (transactions) | OLAP (analytics) |
| --- | --- | --- |
| Example | A till taking an order; a hotel system saving a booking | "Revenue by brand by week for two years" |
| Query shape | Read or write a few rows by key | Scan millions of rows, few columns, add up |
| Storage | Row store with B-tree indexes | Column store, compressed |
| Traffic | Thousands of small writes a second | Tens of heavy reads; writes in batches |
| Examples | SQL Server and Azure SQL (rowstore), Postgres, MySQL | ClickHouse, DuckDB, Snowflake, BigQuery, Fabric Warehouse; SQL Server and Azure SQL with **columnstore** indexes |

A shop till is like a cashier's drawer: quick to put one note in or take one out. A warehouse is like the accountant's ledger at month end: reading every line of one column and adding it up.

Azure SQL and Postgres are **general purpose**. They are excellent for small and medium analytics (up to hundreds of GB) when the tables are modelled well, and they get column-store speed from columnstore indexes (SQL Server) or extensions (Postgres has several; check which are maintained when you choose).

Drag the row count up, then tap columns to switch them to a smaller dtype.

<figure class="fig" data-fig="@data-dtype-memory"><figcaption>Notice that number columns shrink a little but text columns shrink a lot when they become category or datetime.</figcaption></figure>


## 3. Row store or column store

<div class="steps" data-fig="where-data-lives-rowcol">
<div class="step"><b>The question.</b> "What is total revenue?" The table has 4 rows and 4 columns: date, store, item, revenue.</div>
<div class="step"><b>Row store.</b> Each row is stored whole, one after another on a page. To add up revenue, the database reads every page, so all 16 cells, to pick out 4 numbers.</div>
<div class="step"><b>Column store.</b> Each column is stored on its own. The same query reads only the revenue column: 4 cells. With 40 columns, that is a fortieth of the reading.</div>
<div class="step"><b>Compression.</b> Values in one column look alike, so they squeeze well: "09-14" four times becomes "09-14 × 4". Real sales tables often shrink 5 to 10 times.</div>
</div>

Row stores are like a filing cabinet of complete customer folders: perfect for "get me everything about booking B1027". Column stores are like a spreadsheet where each column is a separate long strip: perfect for "add up this column".

## 4. The map

| Option | What it is | Cost shape | Sweet spot | Watch out |
| --- | --- | --- | --- | --- |
| **Azure SQL Database** | Managed SQL Server (row and columnstore) | vCore or DTU; serverless with auto-pause; a free offer exists | Microsoft shops, Power BI, up to around a terabyte | Very large scans; per-tier limits |
| **Postgres** (self-hosted, Azure Flexible Server, other managed hosts) | Open-source database | A VM or a managed instance | Cheap all-rounder, huge ecosystem | Large scans without a columnar extension |
| **DuckDB** (and MotherDuck, its hosted service) | Column store that runs inside your program | Free, or low | One-machine analytics, files, development | One writer at a time |
| **ClickHouse** (open source or Cloud) | Column store across many machines | A VM or usage | Billions of event rows, very fast dashboards | Updates and deletes work differently |
| **Snowflake, BigQuery, Databricks SQL** | Cloud column stores across many machines | Pay per use | Large, elastic, many teams | Bills grow quietly; needs cost rules |
| **Microsoft Fabric Warehouse** | Cloud warehouse inside Fabric | Capacity you reserve | Large Microsoft estates | Capacity sizing, licence complexity |

Prices and limits change; check each vendor's current page before you quote a number. For the cloud, many-machine end of this map, see [Data at Scale](/learn/courses/data-at-scale/database-zoo/).

## 5. Size it first

Most "big data" problems at medium-sized companies turn out to be a few hundred gigabytes, which one well-built SQL database handles. So estimate before you shop. A rough estimate within a factor of 3 is enough to rule options in or out.

<div class="problem" data-problem="where-data-lives-size"></div>

<div class="meaning">

<dl>
<dt>OLTP</dt><dd>Many small reads and writes of single rows: the systems that run the business.</dd>
<dt>OLAP</dt><dd>Big scans and totals over many rows: the systems that analyse the business.</dd>
<dt>Column store</dt><dd>Stores each column together and compressed, so a query reads only the columns it needs.</dd>
<dt>Decision record</dt><dd>A one-page note of a choice: the situation, the options, the decision and its consequences.</dd>
<dt>Physical meaning</dt><dd>A 40-restaurant chain's three years of order lines fit in about 8 GB compressed. That is one Azure SQL or Postgres database at tens of dollars a month, not a cluster. Knowing that number before the first vendor meeting saves the company a contract it did not need.</dd>
</dl>

</div>

<div class="myth">

**"We need big data tools because we have lots of data."** Measure first. Rows per day × days × bytes per row, divided by the compression ratio, usually lands in gigabytes for transactions. Clickstream, logs and sensor data are the exception: they can be 100 times larger, and that is where [Data at Scale](/learn/courses/data-at-scale/) begins.

</div>

## 6. How to choose

Ask these in order:

1. **Where does the company already live?** Microsoft 365 and Power BI point to Azure SQL or Fabric (sign-in, networking and skills fit). Google Workspace points to BigQuery. Neither: Postgres.
2. **How big, how fast?** Your size estimate, how quickly dashboards must respond, how many people query at once.
3. **Who runs it?** A managed service beats a cheaper self-hosted one if nobody can patch the server.
4. **What does it cost at three times today's volume?** Ask for this number before signing anything.
5. **How do you leave?** Standard SQL and open file formats (Parquet) keep the exit cheap.

Say "it depends", and then **actually decide**. For example: "For a 40-restaurant chain on Microsoft 365 with one analyst, I would use Azure SQL serverless with a columnstore index on the sales fact, because Power BI and Microsoft sign-in work out of the box and it costs little at this size. If they had no Microsoft licences: Postgres on a small VM, plus DuckDB for heavy scans."

Write the choice as an **ADR**, an architecture decision record: one page with *context* (the situation), *options*, *decision* and *consequences*. Six months later, when someone asks "why Azure SQL?", the answer is in the repo.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** estimate data size before choosing. Get within a factor of 3, then decide.

**Equation:**

```math
\text{raw bytes} \approx \text{rows per day} \times \text{days} \times \text{bytes per row}, \qquad \text{compressed} \approx \frac{\text{raw}}{5 \text{ to } 10}
```

**Analogy:** a "how many piano tuners are in Chicago?" estimate (a Fermi problem): a few rough numbers multiplied together land surprisingly close.

**Where it breaks:** event and clickstream data (web logs, app events, sensors) can be 100 times larger than transactions for the same business.

**Try it:** 300 restaurants × 1,500 order lines a day × 3 years × 120 bytes per row. Raw and compressed (÷ 7)? (300 × 1,500 × 1,095 × 120 ≈ 59 GB raw, about 8.5 GB compressed: one Postgres or Azure SQL database.)
</details>

## 7. Try it

1. Generate 120 days of data with the course generator. Using your Module 3 pipeline, export the ads, restaurant and hotel staging tables to Parquet. Write down row counts and file sizes.
2. Do a size estimate for each business at real-company scale (your own guesses for stores, rows per day and years). Write it in `docs/sizing.md`.
3. Write `docs/adr-001-warehouse.md` for the marketing agency in this module: context, options, decision, consequences.
4. Prepare the accounts and tools for this module: an Azure free account (or the local SQL Server container in the next lesson), and Docker for Postgres and ClickHouse. Do not create billable resources yet.

**What to check:** your ADR names at least three options with a reason for rejecting two; your size estimate shows its arithmetic; the compressed Parquet sizes you measured are within a factor of a few of your estimate. Start a new repo `ads-warehouse` and commit as `docs: sizing and ADR-001 warehouse choice`.

<div class="keypoints">

- OLTP touches a few rows by key; OLAP scans many rows and adds up a few columns.
- Column stores read only the columns a query needs, compressed, which is why they win at analytics.
- Estimate size first: rows per day × days × bytes per row ÷ compression. Most medium companies need gigabytes, not clusters.
- Choose by ecosystem, size, who runs it, cost at 3× volume and how you would leave, then write it down as an ADR.

</div>
