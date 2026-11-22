---
title: Free sandboxes to practise in
summary: 'Practise everything in this course for free: what runs on your laptop, what runs in free cloud sandboxes, and four steps that stop a surprise cloud bill.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: What should you do first, before creating anything paid in a cloud account?
    choices: ['Create the biggest cluster to save time', 'Set a budget with email alerts at a small amount', 'Turn off all logging']
    ans: 1
    why: A budget alert warns you when spending passes thresholds you choose, so a forgotten resource is caught in days, not at the end of the month.
  - q: Your query reads 3 columns of a 100 GB table and filters to one day of 30 daily partitions. Why does that matter in a sandbox?
    choices: ['It does not matter', 'You pay (or use up allowance) per byte scanned, so reading fewer columns and partitions makes your free allowance last far longer', 'It makes the results more accurate']
    ans: 1
    why: BigQuery's on-demand model charges by bytes read. Columnar storage and partition pruning can cut a query's scan from 100 GB to a fraction of a gigabyte.
  - q: Which tool should you run locally rather than leave running in the cloud while learning?
    choices: ['Airflow, because a managed Cloud Composer environment costs money for as long as it exists', 'Nothing can run locally', 'BigQuery']
    ans: 0
    why: Composer environments bill while they exist, even when idle. Learn Airflow in Docker and use Composer only briefly to see it, then delete it.
sources:
  - 'Google Cloud documentation: BigQuery sandbox (cloud.google.com/bigquery/docs/sandbox)'
  - 'Google Cloud documentation: Create, edit or delete budgets and budget alerts (cloud.google.com/billing/docs)'
  - 'Apache Spark documentation: Quick start (spark.apache.org/docs)'
  - 'Apache Kafka quick start https://kafka.apache.org/quickstart'
---

**Module 8 · about 15 minutes to read, an evening to set up.** You'll be able to install everything this course uses on your own laptop, use the free browser sandboxes, make a free query allowance last, and protect yourself from a surprise bill when you try real cloud services.

<div class="bigidea">Almost everything in this course runs free on your laptop or in a no-card sandbox, and the few real cloud runs you do become safe once a budget alert, idle shutdown and byte limits are in place before you start.</div>

## 1. On your laptop (free, works offline)

You need a recent **Python 3**, **Java 17** (for Spark; check the Spark docs for the versions your Spark release supports) and **Docker Desktop** (or Podman). Then:

| Tool | How |
|---|---|
| **PySpark** | `pip install pyspark`. The Spark UI is at `http://localhost:4040` while a job runs. |
| **DuckDB and Polars** | `pip install duckdb polars`: for comparisons and small marts. |
| **Kafka** | `docker run -d --name kafka -p 9092:9092 apache/kafka:latest`, then `pip install confluent-kafka` (Lesson 5.2). |
| **Airflow** | The official Docker Compose quick start in the Airflow docs, or `pip install apache-airflow` with the constraints file they give. |
| **ClickHouse** | `docker run -d -p 8123:8123 clickhouse/clickhouse-server`. |
| **Druid** | The official single-machine quick start or its Docker Compose file. It needs several GB of free memory. |
| **OpenSearch** | The single-node Docker example from the OpenSearch docs (it asks you to set an admin password), plus OpenSearch Dashboards. |
| **Redis** | `docker run -d -p 6379:6379 redis`. |
| **Bigtable emulator** | `gcloud beta emulators bigtable start` (part of the Google Cloud CLI), then point the client at `localhost:8086`. |
| **Feast and MLflow** | `pip install feast mlflow` (Lesson 6.2). |

Low on memory? Run one Docker service at a time, stop it when done (`docker stop kafka`), and practise on small samples. Everything you learn on 100,000 rows works the same on 100 million.

## 2. In the browser (free)

- **BigQuery sandbox:** sign in to the Google Cloud console and open BigQuery. You get a sandbox with no credit card and a monthly free allowance for queries and storage (check the BigQuery docs for the current amounts). Tables expire after 60 days, and some features are limited. Public datasets such as `bigquery-public-data.thelook_ecommerce` are ideal practice.
- **Google Colab:** free Python notebooks; `!pip install pyspark` works for Spark practice.
- **Databricks Free Edition:** a free, limited Databricks workspace for Spark and Delta Lake practice.

A free query allowance is measured in bytes scanned, so the habits from [BigQuery](/learn/courses/data-at-scale/bigquery/) (name your columns, filter on the partition) decide how far it goes:

<div class="problem" data-problem="free-sandboxes-queries"></div>

## 3. Free trial credit (use with care)

Google Cloud offers new accounts trial credit for a limited time (check the current offer). Use it for a few real runs: a Cloud Storage bucket, a Serverless Spark batch, a short-lived Dataproc cluster, a Pub/Sub topic. **Cloud Composer** environments cost money for as long as they exist, even when idle, so learn Airflow locally and create Composer only to see it, then delete it.

Picture a hotel minibar. Everything you take is billed, whether you meant to or not, and the bill only arrives when you check out. A budget alert is the friend who texts you when the tab passes $10.

<div class="steps" data-fig="free-sandboxes-budget">
<div class="step"><b>Day 0: set the budget.</b> Before creating anything, open Billing, then Budgets and alerts, and set a small monthly budget (here $25, as an example) with email alerts at 50%, 90% and 100%.</div>
<div class="step"><b>Days 1 to 11: practice runs.</b> A few Serverless Spark batches and queries. Spend creeps up to a few dollars: well under budget.</div>
<div class="step"><b>Day 12: a cluster is left running.</b> You forget to delete a Dataproc cluster. It bills every hour. The 50% alert fires on day 14 and the 90% alert on day 18.</div>
<div class="step"><b>Day 18: you act.</b> The alert email sends you to the console. You delete the cluster, and spend goes flat at once.</div>
<div class="step"><b>Month end.</b> Total spend stays under the budget. Without the alerts, the cluster would have billed for the rest of the month.</div>
</div>

<div class="meaning">

<dl>
<dt>Sandbox</dt><dd>A free, limited environment with no card, where nothing can bill you.</dd>
<dt>Trial credit</dt><dd>Free money in a real paid account: real services, real bills once it runs out or expires.</dd>
<dt>Budget alert</dt><dd>An email (or message) when spending passes a share of a budget you set. It warns; it does not stop spending by itself.</dd>
<dt>Idle shutdown</dt><dd>A setting that deletes a cluster after it has done nothing for a set time.</dd>
<dt>Physical meaning</dt><dd>Learners who get a surprise cloud bill almost always left one thing running: a cluster, a Composer environment, a big scheduled query. Four settings, done in ten minutes before the first run, turn "I hope I remembered" into "the system will tell me".</dd>
</dl>

</div>

<div class="myth">

**"A budget in the cloud console caps my spending."** A budget sends alerts; on its own it does not switch anything off. Spending stops only when you delete the resources (or set up automation to do it). Treat the alert as a fire alarm, not a sprinkler.

</div>

## 4. Before you create anything paid

1. Set a **budget with alerts** (Billing, then Budgets and alerts) at a small amount.
2. Use `--max-idle` when you create Dataproc clusters (for example `--max-idle=30m`), and delete them after use.
3. Set **maximum bytes billed** on BigQuery queries you schedule, so a mistake fails instead of scanning terabytes.
4. When you are done, **shut down the project**. That stops everything in it.

## 5. Try it

Set up your laptop for Module 5: start Kafka in Docker, create the `pos.sales.v1` topic, and run the producer and consumer from Lesson 5.2. Then open the BigQuery sandbox and run one query on a public dataset with only the columns you need.

**Check:** the consumer prints partition and offset numbers; in BigQuery, the "bytes processed" shown before you run the query drops when you remove columns from the `SELECT`.

**New words:** *sandbox*, *trial credit*, *budget alert*, *idle shutdown*, *maximum bytes billed*.

<div class="keypoints">

- Spark, Kafka, Airflow, ClickHouse, Druid, OpenSearch, Redis and the Bigtable emulator all run free on a laptop with Python, Java and Docker.
- The BigQuery sandbox, Colab and the Databricks Free Edition give free cloud practice with no card.
- Free query allowances are counted in bytes scanned: select only the columns you need and filter on partitions.
- Before any paid run: budget alerts, idle shutdown on clusters, maximum bytes billed on scheduled queries, and shut down the project when done.

</div>
