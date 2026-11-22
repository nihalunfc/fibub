---
title: What to learn, in what order
summary: 'A learning path from BI and SQL to big data, the ideas that outlast any tool, free practice, certifications, and how to judge a tool or a team.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: Coming from BI and SQL, what is the best first step on this path?
    choices: ['Kafka internals', 'BigQuery in depth: partitioning, clustering, cost and MERGE', 'Writing your own database']
    ans: 1
    why: It builds directly on the SQL and modelling you already have, and every later step (dbt, Spark, Airflow) uses a warehouse.
  - q: Why learn concepts like partitioning, shuffles and watermarks rather than only product names?
    choices: ['Products change names and versions every year; the ideas carry across every tool', 'Interviewers never ask about products', 'Concepts are shorter to memorise']
    ans: 0
    why: A person who understands shuffles can tune Spark, Flink or BigQuery. Tool names alone do not transfer.
  - q: What should you do before using paid cloud credit?
    choices: ['Nothing', 'Set a budget with alerts at a small amount', 'Give the account to a friend']
    ans: 1
    why: A budget alert is the cheapest insurance against a forgotten cluster. Lesson 8.4 shows the other safety steps.
sources:
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly'
  - 'Google Cloud: Professional Data Engineer certification exam guide (cloud.google.com/learn/certification)'
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly'
---

**Module 8 · about 20 minutes · read first: nothing; this lesson looks back over the whole course.** You'll be able to plan the next 8 to 12 weeks of learning from where you are now, list the ideas that carry across every tool, and know what to look for in a tool or in a team's platform.

<div class="bigidea">Build outward from the skills you already have, one useful step at a time, and learn the ideas underneath each tool, because the ideas last far longer than the product names.</div>

## 1. Start from what you already have

If you come from BI and SQL, you already have the skills that are hardest to teach: **SQL, data modelling, reconciling numbers, and explaining results to the business**. If you are not there yet, start with [Pipeline to Dashboard](/learn/courses/etl/), which builds those foundations first. Then build outward in this order. Each step is useful on its own, and each makes the next easier.

| Step | Learn | Practise on | Time (evenings and weekends) |
|---|---|---|---|
| 1 | **BigQuery** in depth: partitioning, clustering, nested data, cost, `MERGE`, scripting | BigQuery sandbox and public datasets | 1 to 2 weeks |
| 2 | **dbt or Dataform** on BigQuery: tested models, documentation | dbt Core with the BigQuery sandbox | 1 week |
| 3 | **Python for data** and **PySpark** DataFrames; reading plans and the Spark UI | Local Spark, Colab, Databricks free edition | 2 to 3 weeks |
| 4 | **Airflow**: DAGs, idempotency, backfills, providers | Airflow in Docker | 1 week |
| 5 | **Cloud Storage, IAM, Dataproc and Serverless Spark** | Google Cloud trial credit | 1 week |
| 6 | **Kafka** and one stream processor (Spark Structured Streaming or Flink) | Kafka in Docker | 2 weeks |
| 7 | **One serving store** in depth: Druid or ClickHouse for analytics, or Bigtable for key lookups | Docker quick starts, Bigtable emulator | 1 week |
| 8 | **ML platform basics**: point-in-time features, feature stores, model registries | Feast, MLflow, BigQuery ML | 1 week |
| 9 | **The domain**: retail media, attribution, incrementality, experiment design | Module 7 exercises, public case studies | ongoing |

If Python or pandas are new to you, take [Python pandas for analysis](/learn/courses/pandas/) before step 3; for the experiment maths in step 9, [Statistics for analysts](/learn/courses/statistics/).

Learning a city works the same way. First the main roads (SQL, modelling, one warehouse). Then the transit lines (Spark, Airflow, Kafka). Then the neighbourhoods (Druid, Bigtable, Elasticsearch). Tourists memorise landmarks (tool names); locals know how to get anywhere (the ideas). Aim to be a local.

<div class="steps" data-fig="learning-path-roadmap">
<div class="step"><b>Your starting point.</b> SQL, a star schema, a dashboard people trust, and the habit of checking numbers against the source. These are the foundations everything else stands on.</div>
<div class="step"><b>Steps 1 and 2: the warehouse.</b> BigQuery and dbt use the SQL you know, and teach the first big-data ideas: partitions, columnar storage and paying per byte.</div>
<div class="step"><b>Steps 3 to 5: processing and the cloud.</b> PySpark, Airflow and Dataproc: jobs too big for one machine, run on a schedule, in the cloud.</div>
<div class="step"><b>Steps 6 and 7: streaming and serving.</b> Kafka and one stream processor, then one serving store learned properly rather than five learned badly.</div>
<div class="step"><b>Steps 8 and 9: where the value is.</b> Feature pipelines for machine learning, and a business domain such as retail media measurement. This is what turns tools into a job.</div>
</div>

Turn the table into a plan with honest hours. Most people overestimate the time they have:

<div class="problem" data-problem="learning-path-weeks"></div>

## 2. Ideas over products

Products change names and versions every year; these ideas do not. Make sure you can explain each one without naming a tool:

- Partitioning, clustering and pruning; columnar storage; compression.
- Shuffles, skew and broadcast joins.
- Idempotency, backfills, late data, exactly-once results.
- Event time, windows, watermarks, state.
- OLTP against OLAP; row keys and access patterns; inverted indexes.
- Point-in-time correctness, leakage, training-serving skew.
- Attribution against incrementality; confidence intervals; statistical power.
- Cost models: per byte scanned, per slot, per node-hour, data leaving the cloud (egress).

<div class="meaning">

<dl>
<dt>Transferable idea</dt><dd>A concept, like a shuffle or a watermark, that works the same in every tool that does that job.</dd>
<dt>Learning step</dt><dd>One tool or skill, practised until you have a small project to show for it.</dd>
<dt>Depth over breadth</dt><dd>One serving store, one stream processor, one cloud learned well beats five touched briefly.</dd>
<dt>Physical meaning</dt><dd>An engineer who understood skew in Spark spotted the same problem in a Kafka topic on their first day with Kafka: one huge advertiser was keyed into one partition. Ideas you truly understand keep paying off every time the tools change.</dd>
</dl>

</div>

<div class="myth">

**"I need to learn every tool in the job posting before I apply."** Postings list wishes, not minimums. Show depth in the core (SQL, one warehouse, Spark or one processor, one orchestrator), show you understand the ideas behind the rest, and say honestly what you have and have not used. Lesson 8.2 shows how.

</div>

## 3. Free and cheap ways to practise

See [Free sandboxes](/learn/courses/data-at-scale/free-sandboxes/) for the set-up. In short: the **BigQuery sandbox** (no card needed), local **Spark**, **Kafka**, **Airflow**, **ClickHouse**, **Druid** and **OpenSearch** in Docker, the **Bigtable emulator**, Google Colab, the **Databricks free edition**, and Google Cloud's trial credit for a few real cloud runs. Always set a **budget alert** before using paid credit.

## 4. Certifications

Certifications do not replace projects, but some recruiters filter by them, and studying for one gives your learning a structure.

- **Google Cloud Professional Data Engineer:** the closest match to this course: BigQuery, Dataflow, Dataproc, Pub/Sub, Bigtable, Composer and ML.
- **Databricks Certified Data Engineer Associate:** Spark and Delta Lake on Databricks.
- **Confluent Certified Developer for Apache Kafka:** Kafka concepts and clients.
- Cloud-specific alternatives if the employers you want use AWS or Azure (AWS Certified Data Engineer Associate, Microsoft's Fabric data engineer certification).

Exam content, prices and names change: check each provider's official page before you book.

## 5. How to judge a tool

1. **Problem fit:** what does it do better than what is already there?
2. **Total cost:** licences or usage, people to run it, on-call load, training.
3. **Ecosystem and hiring:** connectors, community, how many people already know it.
4. **Openness:** open formats (Parquet, Iceberg), open APIs, a way out if you leave.
5. **Running it:** a managed option, upgrades, monitoring, the security model.

Pipeline to Dashboard has a full lesson on this: [Choosing tools](/learn/courses/etl/choosing-tools/).

## 6. How to judge a team's platform (as a candidate)

Ask in interviews: How do you test pipelines? What happens when a job fails at 3 am? How do you track cost? Who owns data quality? How are schema changes handled? The answers tell you how mature the platform is, and asking them shows you think like an engineer.

## 7. Try it

Write your own 8-week plan from the table: the steps you will do, the small project each one produces, and the hours per week you can honestly give. Keep it somewhere you will see it (a note on your phone, the README of a new repository).

**Check:** every step ends in something you can show (a repository, a screenshot, a short write-up), and the total hours fit inside your weekly hours × 8.

**New words:** *learning path*, *transferable idea*, *depth over breadth*, *certification*, *total cost of ownership*.

<div class="keypoints">

- Build outward from SQL, modelling and reconciliation: warehouse, then processing and cloud, then streaming and one serving store, then ML platforms and a domain.
- Learn the ideas under the tools (partitions, shuffles, idempotency, watermarks, point-in-time joins, incrementality, cost models); they transfer.
- Practise for free locally and in sandboxes; set a budget alert before any paid credit.
- Certifications add structure and pass filters, but projects are the proof.

</div>
