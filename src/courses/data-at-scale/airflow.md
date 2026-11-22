---
title: Airflow and Cloud Composer
summary: 'DAGs, tasks, operators, sensors and backfills; a real DAG that runs Spark on Dataproc and SQL in BigQuery; idempotent tasks; and the Module 3 mini project.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: In Airflow, what is a DAG?
    choices: ['A database', 'A directed acyclic graph of tasks with dependencies and a schedule', 'A type of Spark job']
    ans: 1
    why: A DAG is the workflow itself. It lists the tasks, which run after which, and when the whole thing runs.
  - q: Which property makes a task safe to rerun for the same date?
    choices: ['It appends rows every run', 'It is idempotent, replacing exactly that date''s data so two runs give the same result', 'It uses random numbers']
    ans: 1
    why: Idempotent tasks (overwrite or MERGE by partition) make retries and backfills safe. Appending duplicates the rows.
  - q: Should Airflow workers do the heavy data processing themselves?
    choices: ['Yes, always', 'No; Airflow should start and watch work done by Spark, BigQuery or Dataflow', 'Only for CSV files']
    ans: 1
    why: Airflow is the conductor, not the orchestra. Heavy lifting belongs in engines built for it.
sources:
  - 'Apache Airflow documentation https://airflow.apache.org/docs/'
  - 'Apache Airflow documentation: best practices https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html'
  - 'Google Cloud documentation: Cloud Composer https://cloud.google.com/composer/docs'
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly, Chapter 2 (orchestration as an undercurrent)'
---

**Module 3 · about 30 minutes · read first: [3.4](/learn/courses/data-at-scale/dataproc/).** You'll be able to explain DAGs, tasks, operators, sensors and the scheduler, write a DAG that waits for files, runs Spark and builds BigQuery tables, and make tasks idempotent so reruns and backfills are safe.

<div class="bigidea">Airflow runs no data itself; it is the conductor that tells Spark, BigQuery and friends when to play, in what order, for which date, and what to do when someone misses a cue.</div>

## 1. What Airflow does

**Apache Airflow** (started at Airbnb in 2014; Airflow 3 arrived in 2025) schedules and monitors workflows written in Python. It does not process data. It tells other systems what to do and in which order, retries failures, and shows you what happened.

Think of an orchestra conductor. The conductor plays no instrument. They decide when each section comes in, keep time, and notice when someone misses a cue. Spark, BigQuery and Dataflow are the musicians; the **DAG** is the score. If the violins (one task) fail, the conductor has them play their part again (a retry) without restarting the whole symphony.

If you took [Pipeline to Dashboard](/learn/courses/etl/what-orchestrators-do/), you met the same ideas in Dagster. Airflow is the orchestrator you will see most in job postings.

## 2. The vocabulary

| Term | Meaning |
|---|---|
| **DAG** | A workflow: tasks plus the order between them, with a schedule (cron or data-driven) |
| **Task** | One step in the DAG |
| **Operator** | A ready-made kind of task: `BigQueryInsertJobOperator`, `DataprocCreateBatchOperator`, `PythonOperator` |
| **Sensor** | A task that waits for something: a file in Cloud Storage, another DAG, a partition |
| **Scheduler** | Decides which task runs are ready and queues them |
| **Executor / workers** | Run the tasks (Celery, Kubernetes) |
| **Logical date / data interval** | The period a run covers. The run for 3 November usually starts just after 3 November ends. |
| **XCom** | Small messages between tasks (an ID, a row count). Not for data. |
| **Connections and variables** | Stored credentials and settings, never written into code |
| **Backfill** | Running the DAG for past dates |

**Cloud Composer** is Google's managed Airflow (AWS has MWAA; Astronomer is the main independent host). Alternatives: **Dagster** (centred on data assets), **Prefect** (Pythonic), **Dataform** (SQL-only in BigQuery), **Argo Workflows** (Kubernetes).

Set the failure chance and the retries, then run the pipeline several times.

<figure class="fig" data-fig="@data-dag-retry"><figcaption>Notice that a failed task blocks everything after it, and that retries rescue short faults.</figcaption></figure>


## 3. A real DAG

```python
from datetime import datetime, timedelta
from airflow.sdk import DAG   # Airflow 2 and most older guides: from airflow import DAG
from airflow.providers.google.cloud.sensors.gcs import GCSObjectsWithPrefixExistenceSensor
from airflow.providers.google.cloud.operators.dataproc import DataprocCreateBatchOperator
from airflow.providers.google.cloud.operators.bigquery import BigQueryInsertJobOperator

REGION, LAKE = "northamerica-northeast2", "gs://YOURNAME-retail-lake"

with DAG(
    dag_id="sales_nightly",
    schedule="0 2 * * *",                       # 02:00 every day
    start_date=datetime(2026, 11, 1),
    catchup=False,
    max_active_runs=2,
    default_args={"retries": 2, "retry_delay": timedelta(minutes=10)},
    tags=["retail", "sales"],
) as dag:

    wait_for_files = GCSObjectsWithPrefixExistenceSensor(
        task_id="wait_for_files", bucket="YOURNAME-retail-lake",
        prefix="bronze/sales/dt={{ ds }}/", mode="reschedule", timeout=4 * 3600)

    clean_with_spark = DataprocCreateBatchOperator(
        task_id="clean_with_spark", region=REGION,
        batch_id="sales-{{ ds_nodash }}-{{ ti.try_number }}",
        batch={"pyspark_batch": {
            "main_python_file_uri": "gs://YOURNAME-code/sales_nightly.py",
            "args": ["--date", "{{ ds }}", "--lake", LAKE]}})

    build_mart = BigQueryInsertJobOperator(
        task_id="build_mart",
        configuration={"query": {"useLegacySql": False, "query": """
            DELETE FROM retail.fct_sales_daily WHERE sale_date = '{{ ds }}';
            INSERT INTO retail.fct_sales_daily
            SELECT sale_date, store_id, sku, SUM(net_revenue) AS net_revenue
            FROM retail.sales_clean_ext WHERE sale_date = '{{ ds }}'
            GROUP BY 1, 2, 3;"""}})

    wait_for_files >> clean_with_spark >> build_mart
```

Read it top to bottom: wait for the day's files, run serverless Spark on them, then rebuild that day's slice of the mart. `{{ ds }}` is the run's date, filled in by Airflow. That is what makes backfills work: the run for 1 October processes 1 October's files, even if it runs in December. Check the provider docs for the exact operator names in your Airflow version.

## 4. Idempotent tasks and backfills

A task is **idempotent** when running it twice gives the same result as running it once. The `build_mart` task deletes the day's rows and inserts them again, so a retry, a rerun or a backfill can never double the numbers. Think of a whiteboard: you wipe Tuesday's square before writing Tuesday's numbers, instead of adding a second line under the first.

Watch a backfill of four days with `max_active_runs=2`, then a rerun:

<div class="steps" data-fig="airflow-backfill">
<div class="step"><b>The request.</b> A new column was added to the mart, so the team asks Airflow to backfill 1 to 4 November: <code>airflow dags backfill sales_nightly -s 2026-11-01 -e 2026-11-04</code> (the exact command differs between Airflow versions).</div>
<div class="step"><b>Two at a time.</b> With <code>max_active_runs=2</code>, the runs for 1 and 2 November start together. Each waits for its own folder, runs Spark on its own date and rebuilds its own slice.</div>
<div class="step"><b>The next two.</b> Then 3 and 4 November. Four days took two rounds, not four.</div>
<div class="step"><b>A rerun.</b> A late file for 2 November arrives, so that day is cleared and run again. The mart task deletes 2 November's rows first, then inserts the new ones.</div>
<div class="step"><b>Same result.</b> 2 November still has one set of rows (980), not two. Had the task appended, the table would now hold 1,960 rows for that day and every report would double-count it.</div>
</div>

<div class="problem" data-problem="airflow-backfill-time"></div>

## 5. Rules good DAGs follow

1. **Idempotent tasks:** each run overwrites or merges exactly its own date.
2. **Thin DAG files:** no heavy work or database calls at the top level of the file; the scheduler reads it again and again.
3. **Sensors in reschedule mode** (or deferrable operators), so waiting does not hold a worker slot.
4. **Alerts on lateness, not only on failure:** notify when data is late, even if no code broke.
5. **Everything in Git,** with a test that loads every DAG and checks for import errors.

<div class="meaning">

<dl>
<dt>DAG</dt><dd>The workflow: tasks, their order and the schedule. "Acyclic" means no loops.</dd>
<dt>Sensor</dt><dd>A task that waits for a condition, such as a file appearing.</dd>
<dt>Logical date ({{ ds }})</dt><dd>The day a run is about, which may be long before the day it actually runs.</dd>
<dt>Idempotent</dt><dd>Running it twice gives the same result as running it once.</dd>
<dt>Backfill</dt><dd>Running the workflow for past dates, often many at once.</dd>
<dt>Physical meaning</dt><dd>A hotel group discovers its revenue table has been wrong since March. With idempotent, date-driven tasks, the fix is one backfill command and a few hours of compute. Without them, it is weeks of hand-written repair scripts and a finance team that no longer trusts the numbers.</dd>
</dl>

</div>

<div class="myth">

**"Airflow is where the data processing happens."** Airflow workers should only start and watch work. Pulling millions of rows into a `PythonOperator` makes the scheduler slow, fills worker memory and hides cost. Push the heavy lifting to BigQuery, Spark or Dataflow and let Airflow pass dates and check results.

</div>

## 6. Mini project for Module 3: the cloud nightly pipeline

**Brief (3 to 4 hours; free tier or local).**

1. **Local option (free):** run Airflow with Docker (`docker compose` from the official quick start), use a local folder as the "bucket" and DuckDB or local PySpark as the engine. **Cloud option:** use the free trial credit with Cloud Storage, serverless Spark and the BigQuery sandbox.
2. Land a day of synthetic sales in `bronze/sales/dt=YYYY-MM-DD/`.
3. Write the `sales_nightly` DAG: sensor → Spark clean (your Module 2 job) → BigQuery or DuckDB mart → a data quality task that fails if the row count drops more than 30 % from the previous day.
4. **Backfill** seven past days and show that rerunning one day does not duplicate rows.
5. README: a screenshot of the DAG graph, how you made it idempotent, and what it would cost per month at 50 GB a day (use the pricing pages; show your working).

Checklist for "done":

- [ ] The DAG loads with no import errors (`airflow dags list-import-errors` is empty).
- [ ] Seven backfilled days each show green in the grid view.
- [ ] A query before and after rerunning one day returns the same row count for that day.
- [ ] The quality task fails on purpose when you delete half of one day's input.

**Acceptance checks:** rerun-safe (same counts), quality gate proven to fail, monthly cost estimate with its arithmetic.

**New words:** *DAG*, *task*, *operator*, *sensor*, *scheduler*, *executor*, *logical date*, *data interval*, *XCom*, *connection*, *backfill*, *catchup*, *max_active_runs*, *idempotent*, *Cloud Composer*.

<div class="keypoints">

- Airflow orchestrates: it schedules, orders, retries and reports, while engines like Spark and BigQuery do the work.
- A DAG is tasks plus dependencies plus a schedule; sensors wait, operators act.
- {{ ds }}, the logical date, makes every run about one date, which is what makes backfills possible.
- Idempotent tasks (delete-then-insert or MERGE by date) make retries, reruns and backfills safe.
- Backfill time = rounds × run time, where rounds = days ÷ max_active_runs, rounded up.

</div>
