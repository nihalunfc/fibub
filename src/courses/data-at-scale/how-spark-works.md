---
title: How distributed processing works
summary: 'Drivers, executors, partitions, lazy plans and shuffles: what really happens when Spark runs your code on a cluster, shown with six rows on three workers.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: In Spark, which part plans the work and hands out tasks?
    choices: ['An executor', 'The driver', 'A partition']
    ans: 1
    why: The driver turns your code into a plan and schedules tasks. Executors on the worker machines do the actual work on partitions.
  - q: You write df.filter(...).select(...) and nothing runs. Why?
    choices: ['Spark is broken', 'Filter and select are transformations; Spark waits for an action such as count() or write', 'The cluster is asleep']
    ans: 1
    why: Transformations only build a plan. An action (count, show, collect, write) starts the work, which lets Spark improve the whole plan first.
  - q: Which operation causes a shuffle?
    choices: ['filter', 'withColumn', 'groupBy(...).agg(...)']
    ans: 2
    why: Grouping needs all rows with the same key on the same machine, so data crosses the network. filter and withColumn work row by row inside each partition.
sources:
  - 'Zaharia, M. et al. (2016), Apache Spark: A Unified Engine for Big Data Processing, Communications of the ACM 59(11), 56-65 https://doi.org/10.1145/2934664'
  - 'Apache Spark documentation: cluster mode overview https://spark.apache.org/docs/latest/cluster-overview.html'
  - 'Apache Spark documentation: RDD programming guide (transformations, actions and shuffle operations) https://spark.apache.org/docs/latest/rdd-programming-guide.html'
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 10 (Batch Processing)'
---

**Module 2 · about 25 minutes · read first: [1.1](/learn/courses/data-at-scale/why-big-data/).** You'll be able to explain the driver, executors, tasks and partitions, tell transformations from actions, and spot the narrow and wide operations that decide how fast a job runs.

<div class="bigidea">Spark splits your data into partitions, sends one small task per partition to many machines, and only moves data across the network when rows with the same key must meet; that move, the shuffle, is where jobs get slow.</div>

## 1. Spark in one paragraph

**Apache Spark** is an engine that runs data processing across many machines. You write what you want (in Python with **PySpark**, in SQL, Scala, Java or R) and Spark works out how to split it into small tasks, runs them in parallel and puts the results together. It started at UC Berkeley in 2009 as a faster successor to Hadoop MapReduce, mainly because it keeps data in memory between steps instead of writing it to disk after every one.

Picture marking 100,000 exam papers. The head examiner (the **driver**) marks nothing. They split the papers into bundles (**partitions**), hand bundles to markers (**executors**, each with a few pairs of hands, the **cores**) and collect the totals. "How many passed?" is easy: each marker counts their bundle and reports one number. But "rank every student within their school" means papers from the same school must end up on one desk, so everyone stands up and swaps papers. That swapping is the **shuffle**, and it is always the slow part.

## 2. The parts of a Spark application

- **Driver:** one process that runs your program, builds the plan and schedules tasks. If the driver dies, the job dies.
- **Executors:** processes on worker machines that run tasks and hold data in memory. Each has some **cores** (slots that run one task each) and some memory.
- **Cluster manager:** hands out machines. On Google Cloud that is YARN on Dataproc, or Kubernetes; Databricks has its own.
- **Partition:** one chunk of the data. One task processes one partition. 100 GB in 128 MB pieces is about 800 partitions, so about 800 tasks per step.

Put together: a **job** (started by one action) is cut into **stages** (a new stage begins at each shuffle), and each stage runs one **task** per partition. Tasks run in **waves**: with 50 cores, 800 tasks go 50 at a time, 16 waves.

<div class="problem" data-problem="how-spark-works-waves"></div>

Step through map, shuffle and reduce for a word count.

<div class="steps" data-fig="@data-mapreduce">
<div class="step">The text is split across three workers.</div>
<div class="step">Map: every word becomes a (word, 1) pair, each worker on its own.</div>
<div class="step">Shuffle: pairs for the same word travel to the same worker. This is the costly network step.</div>
<div class="step">Reduce: each worker adds up the 1s for its words.</div>
</div>


## 3. Lazy evaluation: Spark plans before it runs

Spark operations come in two kinds:

- **Transformations** describe a new dataset: `filter`, `select`, `withColumn`, `join`, `groupBy`. They return at once and run nothing.
- **Actions** need a result: `count()`, `show()`, `collect()`, `write`. Only now does Spark run.

Waiting lets Spark's optimiser (called **Catalyst**) look at the whole recipe and improve it: push filters down so less data is read, read only the columns you use, pick the best join. It is like a chef who reads the whole order before cooking, instead of starting each dish the moment a word is spoken.

If a partition is lost because an executor crashed, Spark recomputes just that piece from the recipe, called the **lineage**. That is how it survives failures without copying all the data everywhere.

## 4. Narrow and wide operations

- **Narrow:** each output partition needs only one input partition. `filter`, `select`, `withColumn`. Fast, because no data moves. Each marker works on their own bundle.
- **Wide:** an output partition needs rows from many input partitions. `groupBy`, most `join`s, `distinct`, `orderBy`, `repartition`. These trigger a **shuffle**: executors write rows to local disk, send them over the network to the executor that owns each key, and the next stage reads them.

Here is a shuffle you can follow by hand: "total sales per store" on six rows spread over three workers. Each row is a store letter and an amount.

<div class="steps" data-fig="how-spark-works-shuffle">
<div class="step"><b>Start.</b> Rows sit wherever they were read: worker 1 has A 5 and A 1, worker 2 has B 3 and A 2, worker 3 has C 4 and B 1. Store A is spread over two workers.</div>
<div class="step"><b>Add up locally (narrow).</b> Each worker first adds rows with the same store inside its own partition: worker 1 turns A 5 and A 1 into A 6. No network used, and there is less to send later.</div>
<div class="step"><b>Shuffle (wide).</b> Every store is assigned to one worker by hashing its key: A to worker 1, B to 2, C to 3. A 2 travels from worker 2 to worker 1; B 1 travels from 3 to 2. Two rows crossed the network.</div>
<div class="step"><b>Finish.</b> Each worker adds up the store it now owns: A 8, B 4, C 4. This was one job with two stages, split at the shuffle.</div>
</div>

With six rows the shuffle is instant. With six billion rows, the "two rows crossed the network" becomes hundreds of gigabytes written to disk and sent between machines. Shuffles are where jobs get slow, run out of memory or cost money, so half of Spark tuning (Lesson 2.3) is about making them smaller or avoiding them.

<div class="meaning">

<dl>
<dt>Driver</dt><dd>The planner: turns your code into stages and tasks and hands them out.</dd>
<dt>Executor</dt><dd>A worker process that runs tasks on partitions, with a few cores each.</dd>
<dt>Task</dt><dd>One partition processed by one core, in one stage.</dd>
<dt>Transformation / action</dt><dd>A step in the recipe / the request that makes Spark actually cook.</dd>
<dt>Shuffle</dt><dd>Rows sent between machines so that equal keys meet. Starts a new stage.</dd>
<dt>Physical meaning</dt><dd>When a retailer's nightly job "totals sales per store", every receipt for store 214 must end up on one machine. If receipts were stored by date, that means moving almost all of them across the network: the time and cost you see on the bill is mostly that move.</dd>
</dl>

</div>

<div class="myth">

**"Spark is fast because it uses lots of machines."** Machines help only with work that splits cleanly. A job full of shuffles can be slower on 50 machines than DuckDB on one laptop, because the network becomes the bottleneck. Spark is fast when most steps are narrow and the shuffles are few and small.

</div>

## 5. What Spark is made of

| Piece | What it is for |
|---|---|
| **Spark SQL and DataFrames** | Tables with columns, written as SQL or DataFrame code. What you will use 90 % of the time. |
| **Structured Streaming** | The same DataFrame code run on a stream, in small batches (Module 5). |
| **MLlib** | Machine learning spread over a cluster (regression, trees, recommendations). |
| **RDDs** | The original low-level API. You will read about it and rarely write it. |

You will meet Spark as open-source Spark on **Dataproc** (Google Cloud), **EMR** (AWS) and **Microsoft Fabric**, and most of all on **Databricks**, the company founded by Spark's creators. Retailers use it for nightly processing of billions of receipts and for building features for demand models; ad platforms to join impressions to sales for attribution; banks for risk reports over years of transactions.

## 6. Try it (no code)

For each step, write N (narrow) or W (wide):

1. Keep only rows from 2026.
2. Add a column `price_with_tax = price * 1.13`.
3. Total sales per store.
4. Join sales to a 300-row store table.
5. Sort all rows by date.

<details>
<summary>Answers</summary>

1. N. 2. N. 3. W (shuffle by store). 4. Usually W, **but** Spark will copy a tiny 300-row table to every executor (a broadcast join), which makes it effectively narrow: Lesson 2.3. 5. W (a global sort shuffles everything).

What to check: every W has a key that rows must be grouped by (store, join key, sort order).
</details>

**New words:** *driver*, *executor*, *core*, *task*, *stage*, *wave*, *transformation*, *action*, *lazy evaluation*, *Catalyst*, *lineage*, *narrow*, *wide*, *shuffle*.

<div class="keypoints">

- The driver plans; executors run one task per partition per stage, in waves as wide as the number of cores.
- Transformations build a plan; actions run it. Being lazy lets Spark optimise the whole recipe first.
- Narrow operations (filter, select, withColumn) stay inside a partition; wide ones (groupBy, join, orderBy) shuffle.
- Each shuffle starts a new stage and is usually the slowest, costliest step.
- Lost partitions are recomputed from their lineage, so jobs survive failed machines.

</div>
