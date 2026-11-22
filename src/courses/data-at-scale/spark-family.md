---
title: "Spark's relatives, and when not to use Spark"
summary: 'Hadoop, Databricks, Flink, Beam and Dataflow, Trino, Dask, Ray, Polars and DuckDB: where each fits, how to choose, and the Module 2 mini project.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: Which engine is built first for true event-at-a-time streaming with low delay?
    choices: ['Hadoop MapReduce', 'Apache Flink', 'DuckDB']
    ans: 1
    why: Flink processes events one at a time and keeps state, which suits low-delay streaming. Spark streams in small batches.
  - q: Trino is best described as...
    choices: ['A message queue', 'A SQL engine that queries data where it already lives, without loading it first', 'A Python dataframe library']
    ans: 1
    why: Trino is a distributed SQL engine for querying lake files and many databases in place.
  - q: Your team writes Apache Beam pipelines. On Google Cloud, which service runs them fully managed?
    choices: ['Dataproc', 'Dataflow', 'Bigtable']
    ans: 1
    why: Dataflow is Google's managed runner for Beam, for both batch and streaming.
sources:
  - 'Apache Flink documentation https://nightlies.apache.org/flink/flink-docs-stable/'
  - 'Apache Beam documentation https://beam.apache.org/documentation/'
  - 'Trino documentation https://trino.io/docs/current/'
  - 'Polars user guide https://docs.pola.rs/'
---

**Module 2 · about 25 minutes · read first: [2.1](/learn/courses/data-at-scale/how-spark-works/) to [2.3](/learn/courses/data-at-scale/spark-performance/).** You'll be able to place Spark's relatives on one map, pick an engine for a job by size, speed and team, and build a small end-to-end PySpark batch job for your portfolio.

<div class="bigidea">Spark is one engine in a family; the right choice depends on four questions: how big the data is, how fresh the answer must be, where the data already lives, and what the team knows.</div>

## 1. Why this matters

"Why Spark and not X?" is one of the most common interview questions for data roles, and one of the most common design mistakes at work is using a cluster for a job a laptop could do. Knowing the family lets you choose on purpose and explain the choice.

## 2. The family tree

| Engine | What it is | Best at | Where you'll see it |
|---|---|---|---|
| **Hadoop (HDFS, YARN, MapReduce)** | The original open-source big-data stack | Mostly legacy now; HDFS and YARN still run under some Spark clusters | Older banks and telecoms, own data centres |
| **Hive** | SQL on Hadoop; its metastore still catalogues tables | The table catalogue (Hive Metastore) | Anywhere Spark reads "Hive tables" |
| **Spark** | General distributed engine | Big batch jobs, ML features, lakehouse tables | Everywhere |
| **Databricks** | Commercial platform built on Spark and Delta Lake | Notebooks, jobs, SQL and ML in one place | Retail, banks, media, on any cloud |
| **Apache Flink** | Stream-first engine that keeps state | Low-delay streaming: fraud, live metrics | Payments, adtech, ride-hailing |
| **Apache Beam / Dataflow** | One programming model for batch and streaming; Dataflow runs it on Google Cloud | Serverless pipelines on Google Cloud | Google Cloud-heavy companies |
| **Trino / Presto** | Distributed SQL over data where it lives | Ad hoc SQL on lake files; joining many sources | Lakehouses; Amazon Athena is built on it |
| **Dask** | Parallel pandas and NumPy | Scaling Python code you already have | Science, research |
| **Ray** | Distributed Python for ML and AI | Model training, tuning, large batch inference | ML platforms |
| **Polars / DuckDB** | Very fast single-machine engines | Up to tens or hundreds of GB on one machine | Analysts, small teams, tests, dbt-duckdb |

Think of vehicles. DuckDB and Polars are a fast car: perfect for one person and most trips. Spark is a fleet of lorries: overkill for groceries, essential for moving a warehouse. Flink is a motorbike courier: carries small things constantly and never stops. Trino is a taxi that comes to you: it goes to where the data already is. Ray is a team of specialist movers for awkward heavy items such as model training.

Step through map, shuffle and reduce for a word count.

<div class="steps" data-fig="@data-mapreduce">
<div class="step">The text is split across three workers.</div>
<div class="step">Map: every word becomes a (word, 1) pair, each worker on its own.</div>
<div class="step">Shuffle: pairs for the same word travel to the same worker. This is the costly network step.</div>
<div class="step">Reduce: each worker adds up the 1s for its words.</div>
</div>


## 3. Choosing an engine: four questions

1. **How big?** Up to roughly 100 GB: DuckDB or Polars on one machine. Bigger, or growing fast: Spark, Dataflow, or the warehouse itself.
2. **How fresh must results be?** Hours: batch Spark or SQL. Minutes: small batches (Spark Structured Streaming). Seconds or less: Flink, Dataflow streaming or Kafka Streams.
3. **Where does the data already live?** All in BigQuery: often just SQL in BigQuery, no Spark at all. Files in a lake: Spark or Trino.
4. **What does the team know?** A Python team that knows pandas becomes productive in PySpark quickly. A Java team may prefer Flink or Beam.

Here are the four questions applied to one real-looking request from a hotel group: *"Every night, turn 30 GB of booking files into a table of nights sold per hotel."*

<div class="steps">
<div class="step"><b>How big?</b> 30 GB a night. That fits on one machine with room to spare. Point to DuckDB or Polars.</div>
<div class="step"><b>How fresh?</b> Nightly is fine; nobody needs it before breakfast. Batch, no streaming.</div>
<div class="step"><b>Where does it live?</b> Files land in Cloud Storage, and the result goes to BigQuery, where the analysts work. BigQuery could load the files and do it in SQL, too.</div>
<div class="step"><b>Who maintains it?</b> Two analysts who know SQL and a little Python. A cluster would be one more thing to learn and pay for.</div>
<div class="step"><b>Decision.</b> SQL in BigQuery (or DuckDB in a small scheduled job). Revisit Spark if the data grows past a few hundred GB a night or needs heavy custom Python. Write that threshold down: it is your rationale.</div>
</div>

Cost is the other half of the decision. On the cloud you pay per machine-hour while a cluster runs.

<div class="problem" data-problem="spark-family-cost"></div>

<div class="meaning">

<dl>
<dt>Single-machine engine</dt><dd>DuckDB or Polars: all the data on one computer, no network, no start-up wait.</dd>
<dt>Stream-first engine</dt><dd>Flink: handles each event as it arrives and remembers state between events.</dd>
<dt>Query engine</dt><dd>Trino: reads data in place, in the lake or other databases, without loading it first.</dd>
<dt>Managed runner</dt><dd>Dataflow: Google runs your Beam pipeline and decides the machines.</dd>
<dt>Physical meaning</dt><dd>For a restaurant chain with 30 GB of orders a night, a small scheduled DuckDB or BigQuery job may cost a few dollars a month; a Spark cluster for the same job costs more and needs someone who knows Spark. Choosing the smaller engine on purpose, and writing down when you would switch, is a sign of experience.</dd>
</dl>

</div>

<div class="myth">

**"Real data engineers always use Spark."** Many teams moved their transformations out of Spark and into the warehouse (BigQuery SQL plus dbt), because SQL is easier to hire for and the warehouse scales itself. Spark stays for what SQL does badly: very heavy joins on lake data, complex Python logic, ML feature engineering and unstructured data. Saying this in an interview shows you have seen real platforms. [Pipeline to Dashboard](/learn/courses/etl/) teaches the single-machine side with Polars, DuckDB and dbt.

</div>

## 4. Mini project for Module 2: the nightly sales job

**Brief (2 to 3 hours).** Build `sales_nightly.py`, a PySpark batch job you can show on GitHub.

1. **Input:** generate 2 million rows of synthetic till data with the Lesson 2.2 code. Add `customer_id` with 10 % nulls, and one "online" store with 40 % of the rows, to create skew.
2. **Clean:** typed dates, refunds flagged, duplicate `txn_id`s removed (keep the latest), null `customer_id` set to `"guest"`.
3. **Model:** a daily store-by-product fact table and a store dimension. Use a broadcast join for stores.
4. **Write:** Parquet partitioned by `sale_date`, with files of roughly 64 to 256 MB.
5. **Check:** rows in = rows out + duplicates removed (log the duplicates); no store-day with negative net revenue unless it has refunds.
6. **Explain:** a README with the `explain()` plan, a Spark UI screenshot of the slowest stage, and what you changed to make it faster.

Checklist for "done":

- [ ] The job runs end to end with one command: `python sales_nightly.py --date 2026-10-15`.
- [ ] Running it twice for the same date gives the same output (it overwrites that date, never appends).
- [ ] The row-count check prints numbers and fails the job if they don't add up.
- [ ] The README shows one before-and-after timing with the reason for the change.

**Acceptance checks:** row counts balance; the plan shows `BroadcastHashJoin` for stores; the slowest task is no more than about three times the median after your skew fix. Keep the project: in Module 3 you will run it on Dataproc against Cloud Storage, scheduled by Airflow.

**New words:** *Hadoop*, *Hive Metastore*, *Databricks*, *Flink*, *Beam*, *Dataflow*, *Trino*, *Dask*, *Ray*, *Polars*, *DuckDB*.

<div class="keypoints">

- Spark is the general engine; Flink is for low-delay streams; Beam/Dataflow is serverless on Google Cloud; Trino queries data in place; DuckDB and Polars are fast on one machine.
- Choose by four questions: size, freshness, where the data lives, and what the team knows.
- Many teams now do SQL transformations in the warehouse and keep Spark for heavy, non-SQL work.
- Cluster cost is machines × hours × rate: more machines for less time costs about the same.
- Write down the threshold at which you would switch engines; that is your design rationale.

</div>
