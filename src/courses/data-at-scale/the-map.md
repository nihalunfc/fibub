---
title: 'The map: how the pieces connect'
summary: 'Every data platform does seven jobs: ingest, store, process, warehouse, serve, orchestrate and use. Follow one sale from the till to a dashboard and a model.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: Which tool's main job is to decide what runs when, in what order, and what happens if a step fails?
    choices: ['Kafka', 'Airflow', 'Druid']
    ans: 1
    why: Airflow is an orchestrator. It processes no data itself; it tells other tools when to run and retries them when they fail.
  - q: A data lake differs from a warehouse mainly because a lake...
    choices: ['is always faster', 'stores raw files of any shape cheaply, while a warehouse stores cleaned tables ready for SQL', 'cannot be queried at all']
    ans: 1
    why: A lake (Cloud Storage, S3) is cheap storage for raw files. A warehouse (BigQuery) holds structured tables built for SQL. A lakehouse blends both with open table formats such as Iceberg.
  - q: A dashboard needs sub-second answers for 2,000 advertisers at once. Which job is that?
    choices: ['Ingest', 'Serve', 'Orchestrate']
    ans: 1
    why: The serving layer (Druid, Bigtable, Elasticsearch or a cache) is built for many small, fast queries from apps and dashboards.
sources:
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly, Chapters 2 and 3 (the data engineering lifecycle and architecture)'
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 10 (Batch Processing) and Chapter 11 (Stream Processing)'
  - 'Apache Iceberg documentation https://iceberg.apache.org/docs/latest/'
---

**Module 1 · about 25 minutes · read first: [1.1](/learn/courses/data-at-scale/why-big-data/).** You'll be able to name the seven jobs in a data platform with a tool for each, follow one event from source to dashboard, and explain batch versus streaming and lake versus warehouse.

<div class="bigidea">Every data platform, from a start-up to a bank, does the same seven jobs; the products are just different ways of doing each one.</div>

## 1. Why this matters

When a job posting lists twelve tools, it is describing a platform. If you know the seven jobs, you can place each tool in its box in seconds, see which boxes the team has filled, and guess what you would work on. This lesson is the map for the rest of the course: every later module zooms into one box.

## 2. The seven jobs

Forget product names for a moment.

| # | Job | Question it answers | Tools you'll meet |
|---|---|---|---|
| 1 | **Ingest** | How does data get in? | Kafka, Pub/Sub, Kafka Connect, Fivetran, Airbyte, Datastream |
| 2 | **Store** | Where does it live, cheaply and safely? | Cloud Storage (GCS), S3, Azure Blob/ADLS; Parquet, Iceberg, Delta Lake |
| 3 | **Process** | How is it cleaned, joined and reshaped? | Spark (Dataproc, Databricks, EMR), Dataflow/Beam, Flink, dbt |
| 4 | **Warehouse** | Where do analysts ask questions in SQL? | BigQuery, Snowflake, Redshift, Microsoft Fabric, Databricks SQL |
| 5 | **Serve** | How do apps and dashboards get fast answers? | Druid, Pinot, ClickHouse, Bigtable, Cassandra, Elasticsearch, Redis |
| 6 | **Orchestrate** | What runs when, and what if it fails? | Airflow (Cloud Composer), Dagster, Prefect |
| 7 | **Use** | Who acts on it? | Looker, Power BI, Tableau; ML on Vertex AI or SageMaker; ad measurement |

Two concerns run across all seven: **governance** (who may see what, catalogues, lineage, privacy) and **observability** (is the data fresh, complete and correct, and what is it costing?).

Think of a city's water system. Rivers are the **sources**. Pipes and pumps are **ingestion**; Kafka is a main pipe that never stops flowing. The reservoir is the **lake**: huge, cheap, holds water as it arrived. The treatment plant is **processing**. Clean-water tanks are the **warehouse**. The taps in every house are the **serving layer**: water instantly, for millions at once. The control room that opens valves on a timetable is the **orchestrator**, and the inspectors are **quality and governance**.

## 3. Follow one sale through the platform

A shopper buys a box of cereal with a loyalty card at 10:02 am. Watch where that one event goes.

<div class="steps" data-fig="the-map-sale" data-ms="6500">
<div class="step"><b>10:02:00, ingest.</b> The till sends a small JSON event <code>{store: 214, sku: 88231, price: 4.99}</code> to a <b>Kafka</b> topic called <code>sales</code>. Kafka stores it in order, safely, within seconds.</div>
<div class="step"><b>10:02:01, live path.</b> A <b>stream job</b> (Flink, Spark Structured Streaming or Dataflow) reads the topic, adds the product's category and updates "sales this hour per store" in <b>Druid</b>. The store manager's live dashboard ticks up.</div>
<div class="step"><b>10:05, permanent copy.</b> A connector writes the raw events in batches to the <b>lake</b> (Cloud Storage) as Parquet files, in folders by date and hour. This is the cheap copy you keep for years.</div>
<div class="step"><b>02:00 next day, nightly batch.</b> <b>Airflow</b> starts the nightly job. <b>Spark</b> reads yesterday's files, removes duplicates and joins products and stores; then SQL in <b>BigQuery</b> builds the tables <code>fct_sales</code> and <code>dim_product</code>.</div>
<div class="step"><b>06:00, use.</b> Analysts open <b>Looker</b> or <b>Power BI</b> on BigQuery. Finance sees yesterday's sales.</div>
<div class="step"><b>Weekly, ML and serving.</b> A <b>Vertex AI</b> pipeline reads features from BigQuery ("bought cereal 3 times in 30 days") and retrains a recommender. Its scores go to <b>Bigtable</b>, so the app can fetch "recommended for you" in about 10 milliseconds.</div>
</div>

That is the whole course in one story. Module 2 is the Spark hop, Module 3 the Google Cloud boxes, Module 4 the serving stores, Module 5 the Kafka and stream path, Module 6 the ML path, and Module 7 adds ads: the retailer's media team joins ad views to these very sales to see whether an ad made people buy.

## 4. Two paths: batch and streaming

- **Batch path:** collect data, process it on a schedule (hourly, nightly). Simple, cheap and easy to rerun. Most reporting lives here. Like doing the laundry once a week.
- **Streaming path:** process each event as it arrives, within seconds. Needed for fraud checks, live dashboards, ad budget pacing and stock alerts. Harder to build and run. Like washing each cup the moment you finish with it.

Most companies run both from the same sources. Older designs kept two separate code bases (the **lambda architecture**); newer ones try to use one engine for both (the **kappa architecture**, or Spark and Beam code that runs either way). Module 6 returns to this.

Batch is cheap but always a little behind. How far behind is called **freshness**, and teams promise it in a **freshness SLA** (service level agreement), such as "yesterday's sales are in the report by 07:00". A late source file or a slow job breaks the promise.

<div class="problem" data-problem="the-map-sla"></div>

## 5. Lake, warehouse and lakehouse

- **Data lake:** files in object storage. Any shape, very cheap, but on its own it has no transactions and no easy updates, and it can turn into a "data swamp" nobody trusts. Like a big storage unit full of labelled boxes.
- **Data warehouse:** managed tables with SQL, fast and governed (BigQuery, Snowflake). Costs more per TB, very easy for analysts. Like a library with a catalogue.
- **Lakehouse:** open **table formats** (Apache Iceberg, Delta Lake, Apache Hudi) add transactions, updates and "time travel" (reading an older version) on top of files in the lake, so Spark, BigQuery, Trino and others can all read the same tables. BigQuery can read Iceberg tables through BigLake. This is where many large platforms are heading.

<div class="meaning">

<dl>
<dt>Ingest</dt><dd>Getting data in from tills, apps, databases and partners.</dd>
<dt>Process</dt><dd>Cleaning, joining and reshaping, in batches or as a stream.</dd>
<dt>Serve</dt><dd>Answering many small questions fast, for apps and dashboards.</dd>
<dt>Orchestrate</dt><dd>Deciding what runs when, in what order, and retrying failures.</dd>
<dt>Freshness</dt><dd>How old the newest data in a report is when someone reads it.</dd>
<dt>Physical meaning</dt><dd>When a store manager asks "why is my dashboard showing yesterday?", you can walk the map: was the event ingested, did the batch run, did the serving store refresh? The seven boxes are where you look, in order.</dd>
</dl>

</div>

<div class="myth">

**"A lake and a warehouse are the same thing with different names."** A lake holds raw files cheaply and lets any engine read them; a warehouse holds cleaned tables tuned for SQL, with permissions, fast queries and a higher price per TB. Most companies have both: raw history in the lake, business tables in the warehouse. The lakehouse tries to make one copy serve both jobs.

</div>

## 6. The three big clouds side by side

Job postings name one cloud; the ideas transfer. Learn one well (this course uses Google Cloud) and keep this table handy.

| Job | Google Cloud | AWS | Azure |
|---|---|---|---|
| Object storage | Cloud Storage (GCS) | S3 | Blob Storage / ADLS Gen2 |
| Warehouse | BigQuery | Redshift | Synapse / Microsoft Fabric |
| Managed Spark | Dataproc | EMR | Synapse Spark, Fabric, Databricks |
| Batch and stream pipelines | Dataflow (Apache Beam) | Managed Flink, Glue | Stream Analytics, Data Factory |
| Messaging | Pub/Sub, Managed Kafka | Kinesis, MSK (Kafka) | Event Hubs (Kafka-compatible) |
| Orchestration | Cloud Composer (Airflow) | MWAA (Airflow), Step Functions | Data Factory, Fabric pipelines |
| Wide-column NoSQL | Bigtable | DynamoDB, Keyspaces | Cosmos DB |
| ML platform | Vertex AI | SageMaker | Azure Machine Learning |

Databricks and Snowflake run on all three clouds, which is part of why they are popular. Service names change from time to time: check each cloud's own docs.

## 7. Practice

1. Draw the seven jobs as seven boxes on paper. For the business you picked in Lesson 1.1, write one tool in each box and label each arrow with what flows along it.
2. Mark which arrows are batch and which are streaming.
3. Which box would you check first if the morning report is missing yesterday's sales?

<details>
<summary>What a good answer looks like</summary>

1 and 2. A supermarket: till events → **Kafka** (streaming) → **Flink** → **Druid** live store dashboard (streaming); Kafka → **Cloud Storage** Parquet (small batches every few minutes); **Airflow** nightly → **Spark** → **BigQuery** tables (batch) → **Power BI** (batch); BigQuery → **Vertex AI** weekly retrain (batch) → scores in **Bigtable** for the app (served live). Governance: a data catalogue and tight access rules on loyalty-card data.

3. Orchestrate: did the nightly run succeed? Then work backwards: did the files land (ingest, store)?

What to check: every box has one tool and a reason, and every arrow says what flows.
</details>

**New words:** *ingest*, *serving layer*, *orchestrator*, *governance*, *observability*, *batch*, *streaming*, *freshness SLA*, *data lake*, *warehouse*, *lakehouse*, *table format*.

<div class="keypoints">

- Seven jobs: ingest, store, process, warehouse, serve, orchestrate, use. Governance and observability run across all of them.
- One sale can feed a live dashboard in a second, the lake in minutes, the warehouse overnight and an ML model weekly.
- Batch is simple and cheap but always behind; streaming is fresh but harder. Most companies run both.
- A lake holds raw files cheaply, a warehouse holds tables for SQL, and a lakehouse adds table formats so one copy serves many engines.
- Learn one cloud well; the same seven boxes exist on Google Cloud, AWS and Azure.

</div>
