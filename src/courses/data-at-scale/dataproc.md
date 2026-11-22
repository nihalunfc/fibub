---
title: 'Dataproc: Spark on Google Cloud'
summary: 'Clusters, ephemeral clusters, serverless Spark batches, Spot workers and the BigQuery connector, with the cost and reliability habits platform teams expect.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: What is an ephemeral cluster?
    choices: ['A cluster that runs forever', 'A cluster created for one job or workflow and deleted when it finishes', 'A cluster with no workers']
    ans: 1
    why: Because the data lives in Cloud Storage, not on the cluster, you can create a cluster per job and delete it after, paying only while it runs.
  - q: Why can a Dataproc cluster be deleted without losing data?
    choices: ['The data is copied to the driver', 'Jobs read and write Cloud Storage through the connector, not the cluster''s own disks', 'BigQuery backs it up']
    ans: 1
    why: Separating storage (Cloud Storage) from compute (the cluster) is what makes ephemeral clusters safe.
  - q: Spot secondary workers are a good fit for...
    choices: ['The master node', 'Batch work that can survive losing a worker', 'Holding the only copy of the data']
    ans: 1
    why: Spot machines are much cheaper but can be taken back at short notice. Spark retries lost tasks, so batch jobs tolerate them well.
sources:
  - 'Google Cloud documentation: Dataproc https://cloud.google.com/dataproc/docs'
  - 'Google Cloud documentation: Spot VMs https://cloud.google.com/compute/docs/instances/spot'
  - 'Apache Spark documentation: cluster mode overview https://spark.apache.org/docs/latest/cluster-overview.html'
---

**Module 3 · about 20 minutes · read first: [2.1](/learn/courses/data-at-scale/how-spark-works/), [3.2](/learn/courses/data-at-scale/gcs-data-lake/).** You'll be able to explain a Dataproc cluster's parts, submit a PySpark job to a cluster and as a serverless batch, and choose between long-running clusters, ephemeral clusters and serverless Spark.

<div class="bigidea">Because the data lives in Cloud Storage and not on the machines, a Spark cluster can be rented for one job and handed back, so you pay for the cooking and never for the empty kitchen.</div>

## 1. Dataproc in one paragraph

**Dataproc** is Google's managed service for open-source Spark, Hadoop, Hive, Flink and Trino. You ask for a cluster and get one in a minute or two, with Spark installed, tuned and connected to Cloud Storage and BigQuery. It is Google Cloud's counterpart of AWS EMR, and it exists for a simple reason: lots of companies have Spark code, and Dataproc runs it without a rewrite.

Think of renting a kitchen. A **long-running cluster** is a restaurant kitchen you lease all year. An **ephemeral cluster** is a commercial kitchen you book for tonight's banquet and hand back. **Serverless Spark** is a catering service: you send the recipe, they bring the cooks and equipment, and you never see the kitchen. Your ingredients (the data) stay in your own pantry (Cloud Storage) the whole time, so handing the kitchen back loses nothing.

## 2. The parts of a cluster

- **Master node(s):** runs the YARN resource manager and usually the Spark driver. One, or three for high availability.
- **Primary workers:** run executors (and can hold HDFS data, which you rarely need on the cloud).
- **Secondary workers:** extra compute only, often **Spot VMs** at a large discount. Ideal for batch.
- **Autoscaling policy:** adds and removes workers based on pending work.
- **Initialization actions:** scripts that install extra packages when the cluster starts.
- **Component gateway:** secure links to the Spark UI and history server.

Watch one night of an ephemeral cluster:

<div class="steps">
<div class="step"><b>02:00, create.</b> Airflow creates <code>sales-nightly</code>: 1 master, 2 primary workers and 8 Spot secondary workers. About a minute later Spark is ready. Nothing is stored on it yet.</div>
<div class="step"><b>02:02, run.</b> The PySpark job reads <code>gs://.../bronze/sales/dt=2026-11-03/</code> through the Cloud Storage connector and starts 400 tasks across the workers.</div>
<div class="step"><b>02:20, a Spot worker is taken back.</b> Google reclaims one Spot machine. Its 12 running tasks are lost; Spark notices and reruns them on the other workers. The job takes a few minutes longer, and costs far less than paying full price for all 10 workers.</div>
<div class="step"><b>02:41, write.</b> Results go to <code>gs://.../silver/sales/dt=2026-11-03/</code> and a BigQuery table. Everything that matters is now outside the cluster.</div>
<div class="step"><b>02:42, delete.</b> Airflow deletes the cluster. If anything had gone wrong, <code>--max-idle=15m</code> would have deleted it anyway after 15 idle minutes. The bill stops.</div>
</div>

## 3. Run a job three ways

```bash
# 1. Create a cluster, run, delete (ephemeral)
gcloud dataproc clusters create sales-nightly --region=northamerica-northeast2 \
  --num-workers=2 --worker-machine-type=n2-standard-4 --max-idle=15m
gcloud dataproc jobs submit pyspark gs://YOURNAME-code/sales_nightly.py \
  --cluster=sales-nightly --region=northamerica-northeast2 \
  -- --input gs://YOURNAME-retail-lake/bronze/sales/ --output gs://YOURNAME-retail-lake/silver/sales/
gcloud dataproc clusters delete sales-nightly --region=northamerica-northeast2

# 2. Serverless batch: no cluster at all
gcloud dataproc batches submit pyspark gs://YOURNAME-code/sales_nightly.py \
  --region=northamerica-northeast2 -- --input ... --output ...
```

3. **Workflow templates** describe "create cluster → run jobs in order → delete" as one reusable object, though most teams use **Airflow** for this (next lesson).

`--max-idle=15m` deletes the cluster automatically if it sits idle: cheap insurance against the cluster someone forgot on Friday.

<div class="problem" data-problem="dataproc-run-cost"></div>

## 4. Reading and writing BigQuery from Spark

The **spark-bigquery connector** lets Spark read BigQuery tables (using the fast Storage Read API) and write results back:

```python
df = spark.read.format("bigquery").option("table", "retail.sales").load()
(result.write.format("bigquery")
   .option("table", "retail.daily_store_sales")
   .option("writeMethod", "direct").mode("overwrite").save())
```

## 5. Choosing the mode

| Mode | Good | Not so good | Use when |
|---|---|---|---|
| Long-running cluster | Instant start, interactive notebooks | Pay when idle; drifts out of date | Shared exploration with steady load |
| Ephemeral cluster | Pay per job, fresh setup each time | A minute or two to start | Scheduled batch pipelines |
| **Serverless Spark** | Nothing to size or patch | Less control; some settings limited | Most new batch jobs |
| Dataproc on GKE | Shares Kubernetes with other apps | Needs Kubernetes skills | Platform teams standardised on Kubernetes |

<div class="meaning">

<dl>
<dt>Ephemeral cluster</dt><dd>Created for one job or workflow, deleted when it ends.</dd>
<dt>Serverless Spark</dt><dd>You submit the job; Google supplies and removes the machines.</dd>
<dt>Spot VM</dt><dd>A spare machine at a big discount that Google can take back at short notice.</dd>
<dt>Max idle</dt><dd>A timer that deletes a cluster nobody is using.</dd>
<dt>Physical meaning</dt><dd>A retailer whose nightly job runs 40 minutes uses a cluster less than 3 % of the day. Keeping that cluster up around the clock means paying about 35 times more for the same work. Ephemeral clusters and Spot workers are how teams bring that waste close to zero.</dd>
</dl>

</div>

<div class="myth">

**"A cluster is a server you look after."** On the cloud, treat clusters as cattle, not pets: created from a script, identical every time, deleted after use. Platform teams pin image versions (a Spark upgrade changes behaviour), keep job code and dependencies in Cloud Storage or Artifact Registry, use a dedicated service account per pipeline, label clusters for cost reports and always set idle-delete.

</div>

## 6. Practice

Your nightly job reads 400 GB and runs 50 minutes on 10 workers.

1. Would you use a long-running, ephemeral or serverless setup, and why?
2. Where do Spot workers fit, and where must they never go?
3. Name two settings that stop surprise bills.
4. If you have Google's free trial credit, run your Module 2 job as a serverless batch on a small sample and find it in the console.

<details>
<summary>Answers, and what to check</summary>

1. Ephemeral or serverless: the job runs under an hour a day, so an always-on cluster would be idle about 96 % of the time. Serverless if the defaults suit you; ephemeral if you need special settings.
2. Spot fits secondary workers, because Spark reruns lost tasks. Never the master, and never the only copy of any data.
3. `--max-idle` on clusters, budgets with alerts on the project, labels for cost reports, and a maximum number of workers in the autoscaling policy.

What to check: your answer to 1 mentions how many hours a day the cluster would be idle.
</details>

**New words:** *Dataproc*, *master node*, *primary and secondary workers*, *Spot VM*, *autoscaling policy*, *initialization action*, *ephemeral cluster*, *serverless Spark*, *max idle*, *spark-bigquery connector*.

<div class="keypoints">

- Dataproc runs open-source Spark on Google Cloud; jobs read and write Cloud Storage and BigQuery, not the cluster's disks.
- Because storage is separate, clusters can be ephemeral: create, run, delete, and pay only while running.
- Serverless Spark removes cluster sizing entirely and suits most new batch jobs.
- Spot secondary workers cut cost for batch, since Spark reruns lost tasks; never use them for the master.
- Always set idle-delete, labels and a dedicated service account per pipeline.

</div>
