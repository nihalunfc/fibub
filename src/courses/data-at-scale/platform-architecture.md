---
title: 'Platform architecture: putting it together'
summary: 'Lambda, kappa and lakehouse designs, the bronze-silver-gold layers, governance and observability, data mesh in plain words, and the Module 6 mini project.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What is the main weakness of a lambda architecture?
    choices: ['It cannot show fresh numbers', 'It has two code paths, batch and speed, that must give the same answers', 'It cannot store history']
    ans: 1
    why: Lambda pairs an accurate batch layer with a fast speed layer. Keeping two code bases in agreement is the ongoing cost.
  - q: In a kappa architecture, how do you reprocess history after fixing a bug?
    choices: ['Replay the event log through the fixed stream job', 'Run a separate batch system', 'You cannot']
    ans: 0
    why: Kappa treats everything as a stream. Reprocessing means replaying the log, which can be slow and costly for long histories.
  - q: What is a data product in data mesh?
    choices: ['A paid dashboard', 'A dataset owned by a domain team, with documentation, quality promises and a clear interface', 'Any CSV file']
    ans: 1
    why: Data mesh moves ownership to the teams who know the data best, and asks them to treat their data like a product for others to use.
sources:
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 12 (The future of data systems: lambda and kappa)'
  - 'Armbrust, M., Ghodsi, A., Xin, R. and Zaharia, M. (2021), Lakehouse: A New Generation of Open Platforms that Unify Data Warehousing and Advanced Analytics, CIDR 2021'
  - 'Dehghani, Z. (2022), Data Mesh: Delivering Data-Driven Value at Scale, O''Reilly'
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly, Chapter 3 (Designing good data architecture)'
---

**Module 6 · about 25 minutes · read first: 1.2, 5.4, 6.2.** You'll be able to compare lambda, kappa and lakehouse designs, estimate the cost of a kappa replay, describe the governance and observability layers around a platform, explain data mesh, and build the Module 6 mini project.

<div class="bigidea">A data platform is a few big choices (how batch and streaming fit together, where the one true copy lives) wrapped in layers that keep it trustworthy: a catalogue, quality tests, monitoring, security and cost control.</div>

## 1. Three architecture patterns

| Pattern | Idea | Strength | Weakness |
|---|---|---|---|
| **Lambda** | A batch layer (complete, accurate) plus a speed layer (fast, approximate), combined when you query | Accurate history and fresh numbers | Two code bases that must agree |
| **Kappa** | Everything is a stream; to reprocess, replay the log | One code base | Replaying long histories can be slow and costly |
| **Lakehouse** | Open table formats (Iceberg, Delta Lake) on cloud storage, read by many engines, with batch and streaming writes | One copy of the data, many engines, reliable updates on the lake | More moving parts than a pure warehouse |

Most real platforms are practical mixes: a lakehouse or warehouse as the system for analytics, Kafka for events, a few serving stores, and streaming only where it pays.

Think of a city's transport. Lambda is a city with a slow, reliable train (batch) and fast scooters (streaming), plus a timetable that combines them. Kappa is a city with only a metro that never stops; to "redo" a day, you rerun all of that day's trains. A lakehouse is one central station where every line, train or bus, uses the same platforms.

Kappa's simplicity has a price you can estimate before you choose it:

<div class="problem" data-problem="platform-architecture-replay"></div>

## 2. Bronze, silver, gold

Inside the lake and warehouse, most teams use the **medallion** layering you may know from [Pipeline to Dashboard](/learn/courses/etl/):

- **Bronze:** raw data exactly as it arrived, kept for replay and audit.
- **Silver:** cleaned, de-duplicated, typed and joined, but still detailed.
- **Gold:** business-ready marts and feature tables: star schemas, daily totals, model inputs.

<div class="steps">
<div class="step"><b>Arrive.</b> An ad impression event lands on Kafka topic <code>ads.impressions.v1</code>. Kafka Connect writes it, untouched, into an hourly Parquet file in the <b>bronze</b> bucket.</div>
<div class="step"><b>Live path.</b> At the same time, Druid reads the topic and the impression shows on the brand's live dashboard within a minute. This number is fast but provisional.</div>
<div class="step"><b>Clean.</b> Overnight, a Spark job removes duplicates and bot traffic and writes the <b>silver</b> Iceberg table. Our impression survives; a duplicate copy of it does not.</div>
<div class="step"><b>Model.</b> dbt in BigQuery builds the <b>gold</b> table <code>fct_impressions</code> and the billing mart. The invoice uses this exact number, not the live one.</div>
<div class="step"><b>Trust.</b> A test checks gold impressions match silver within 0.1%; lineage records which bronze files fed which invoice line. Fast and exact paths coexist on purpose, and the portal labels which is which.</div>
</div>

Set the failure chance and the retries, then run the pipeline several times.

<figure class="fig" data-fig="@data-dag-retry"><figcaption>Notice that a failed task blocks everything after it, and that retries rescue short faults.</figcaption></figure>


## 3. The layers around the core

- **Catalogue and lineage:** what data exists, who owns it, where it came from and what depends on it. On Google Cloud: **Dataplex**; elsewhere: Unity Catalog, DataHub, OpenMetadata.
- **Quality:** tests at each layer (dbt tests, Great Expectations, Soda, Dataplex data quality): not null, unique, accepted values, freshness, and reconciliation to source totals.
- **Observability:** monitors on freshness, volume, schema changes and value distributions, with alerts.
- **Security and privacy:** access roles (IAM), column masking and row-level policies, tokenising personal identifiers, retention rules, region controls.
- **FinOps** (cost management): cost per pipeline and per team, budgets, reserved capacity, clusters that delete themselves when idle.
- **Infrastructure as code:** Terraform for buckets, datasets, topics and service accounts; automated tests and deployment for pipelines.

<div class="meaning">

<dl>
<dt>Lambda</dt><dd>Two paths, fast and exact, joined at query time.</dd>
<dt>Kappa</dt><dd>One streaming path; history is fixed by replaying the log.</dd>
<dt>Lakehouse</dt><dd>One copy of the data in open table formats on cheap storage, used by many engines.</dd>
<dt>Medallion layers</dt><dd>Bronze (raw), silver (clean detail), gold (business-ready).</dd>
<dt>Physical meaning</dt><dd>A brand sees "1.2 million impressions so far" on a live chart at noon, and next month its invoice says 1,186,402. Both are right: the first came from the fast path, the second from the exact path after duplicates and bots were removed. Architecture is deciding where each number comes from and saying so.</dd>
</dl>

</div>

<div class="myth">

**"A modern platform streams everything."** Streaming everything means paying for always-on jobs and on-call engineers for data nobody reads before tomorrow. Mature platforms stream the few flows where minutes matter and batch the rest.

</div>

## 4. Data mesh and data products

**Data mesh** is an idea about people more than technology. Instead of one central team owning all data, **domain teams** (merchandising, supply chain, retail media) own their data as **products**: documented, with quality promises (service levels) and clear interfaces, built on a shared **self-serve platform** with common rules. In practice many companies adopt "data product" thinking without the full reorganisation.

## 5. A reference platform on Google Cloud

1. **Sources:** till and online-shop events, app clickstream, ad server logs, operational databases, partner files.
2. **Ingest:** Kafka or Pub/Sub; Datastream for change data capture; Storage Transfer for files.
3. **Lake:** Cloud Storage bronze; Iceberg silver tables (through BigLake).
4. **Process:** Dataproc or Serverless Spark for heavy jobs; Dataflow for streaming; BigQuery SQL with dbt or Dataform for models.
5. **Warehouse:** BigQuery gold marts and feature tables.
6. **Serve:** Druid for live dashboards; Bigtable for profiles and online features; Elasticsearch for search; Looker or Power BI for BI.
7. **Machine learning:** Vertex AI pipelines, feature store and endpoints.
8. **Run it:** Cloud Composer (Airflow), Dataplex (catalogue and quality), Cloud Monitoring, Terraform.

Every piece appeared earlier in this course: [Cloud Storage](/learn/courses/data-at-scale/gcs-data-lake/), [BigQuery](/learn/courses/data-at-scale/bigquery/), [Dataproc](/learn/courses/data-at-scale/dataproc/), [Airflow](/learn/courses/data-at-scale/airflow/), the [database zoo](/learn/courses/data-at-scale/database-zoo/) and Kafka (Module 5).

## 6. Mini project for Module 6: an ML-ready feature pipeline

**Brief.** A grocer's data science team wants to predict which customers will buy a category (say coffee) in the next 7 days. Build them a point-in-time training set, prove it does not leak, train a simple model and serve the latest features from an "online" table. Budget: 3 to 4 hours, on your laptop with DuckDB or Polars, or in the BigQuery sandbox. Synthetic data only.

1. Generate (or reuse from Module 2) a sales table with `customer_id`, `ts`, `category` and `amount`: about 5,000 customers over 6 months.
2. Build the training set: one row per customer per weekly `as_of_date`, with features from the 90 days **before** the date (purchases, spend, days since last visit, coffee share) and the label "bought coffee in the 7 days from the date".
3. Write a **leakage test** that fails if any feature used a transaction on or after its row's `as_of_date`.
4. Train a logistic regression (scikit-learn or BigQuery ML) on early weeks, test on later weeks, and record the metrics with the data snapshot date.
5. Write the latest feature values per customer to an "online" table (Redis, SQLite or a BigQuery table keyed by customer) and write a `lookup(customer_id)` function.
6. README: a diagram mapping your pieces to a feature store's offline store, online store and materialisation, and one paragraph on how you would stop training-serving skew.

**Done looks like:**

- [ ] The training table has one row per (customer, as_of_date) and no nulls in the label.
- [ ] The leakage test passes, and fails when you deliberately change a `<` to `<=` in the feature query.
- [ ] Training weeks all come before test weeks (no shuffling across time).
- [ ] `lookup("c123")` returns the same feature values as the newest training row for c123 would.

**Acceptance check:** pick three customers by hand, compute one feature for one as-of date with a pencil-and-paper style SQL query, and compare it with your training table. All three must match.

**New words:** *lambda architecture*, *kappa architecture*, *lakehouse*, *medallion layers*, *lineage*, *observability*, *FinOps*, *infrastructure as code*, *data mesh*, *data product*.

<div class="keypoints">

- Lambda gives fast plus exact numbers with two code paths; kappa has one streaming path but replays history to fix it; a lakehouse keeps one open copy for many engines.
- Bronze, silver and gold layers separate raw, clean and business-ready data, so every number can be traced and rebuilt.
- Catalogue, quality tests, observability, security, cost control and infrastructure as code are what make a platform trustworthy.
- Data mesh gives ownership of data to domain teams, who publish documented data products on a shared platform.

</div>
