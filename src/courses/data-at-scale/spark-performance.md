---
title: Making Spark fast and cheap
summary: 'File formats, file sizes, shuffle partitions, broadcast joins, skew, caching and the Spark UI: the few ideas behind almost every Spark performance fix.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: One task in a stage takes 40 minutes while the other 199 take 30 seconds. What is the likely cause?
    choices: ['Too much memory', 'Data skew: one key has far more rows than the rest', 'Parquet compression']
    ans: 1
    why: One giant partition means one task does most of the work. That is skew, often from a null key or one huge customer or store.
  - q: You join a 2 TB sales table to a 5 MB product table. What should happen?
    choices: ['A sort-merge join that shuffles both tables', 'A broadcast join that copies the small table to every executor', 'Collect both tables to the driver']
    ans: 1
    why: Broadcasting the small table avoids shuffling the 2 TB table. Spark does it automatically below a size threshold, or you can hint it with F.broadcast().
  - q: What does a table format like Iceberg or Delta add on top of Parquet files?
    choices: ['Images', 'Transactions, updates and deletes, schema changes and time travel', 'A faster network']
    ans: 1
    why: Parquet is a file format. Iceberg, Delta and Hudi add a metadata layer that makes a folder of files behave like a database table.
sources:
  - 'Apache Spark documentation: performance tuning (adaptive query execution, join strategy hints) https://spark.apache.org/docs/latest/sql-performance-tuning.html'
  - 'Apache Spark documentation: monitoring and the web UI https://spark.apache.org/docs/latest/web-ui.html'
  - 'Delta Lake documentation https://docs.delta.io/latest/index.html'
  - 'Apache Iceberg documentation https://iceberg.apache.org/docs/latest/'
---

**Module 2 · about 25 minutes · read first: [2.1](/learn/courses/data-at-scale/how-spark-works/), [2.2](/learn/courses/data-at-scale/pyspark-basics/).** You'll be able to choose file and table formats for a lake, fix the four common slowdowns (small files, wrong partition counts, bad joins and skew), and read the Spark UI to find the slow stage.

<div class="bigidea">Almost every Spark speed-up is the same move: make the job do less work, by reading fewer bytes, shuffling fewer rows and keeping every task about the same size.</div>

## 1. Why this matters

In the cloud you pay for machine time. A job that runs 40 minutes on 20 machines costs about the same as 20 minutes on 40 machines, so throwing machines at a slow job rarely saves money. Making a job *cheaper* means making it do less: read fewer columns and partitions, shuffle less, avoid skew, and shut the cluster down afterwards. A good answer to "how did you speed it up?" names the bottleneck you measured and the cost before and after.

## 2. Start with storage: formats decide speed

| Format | Shape | Use it for |
|---|---|---|
| CSV / JSON | Rows of text, no types | Landing raw data only |
| **Parquet** | Columns, compressed, typed | The default for analytics files |
| ORC | Columns, like Parquet | Older Hadoop and Hive estates |
| Avro | Rows, compact, schema attached | Kafka messages and row-by-row writes |
| **Iceberg / Delta / Hudi** | Table formats over Parquet | Lakehouse tables with updates, deletes, time travel |

Think of a filing cabinet. A CSV is a pile of whole forms: to total one box on every form you read every form. Parquet cuts each form into strips by field and files all the "amount" strips together, so totalling amounts means opening one drawer. Iceberg and Delta add an index card at the front listing exactly which strips belong to the current version, so you can add, fix or roll back forms safely.

## 3. The four common slowdowns

### Slowdown 1: too many small files, or a few giant ones

Spark makes about one task per file chunk. 200,000 files of 50 KB means 200,000 tiny tasks and slow listing; every reader pays that price forever. Aim for files of roughly **128 MB to 1 GB**. Fix it with `repartition(n)` or `coalesce(n)` before writing, a regular compaction job, or the table format's own command (Delta's `OPTIMIZE`, Iceberg's `rewrite_data_files`).

<div class="problem" data-problem="spark-performance-files"></div>

### Slowdown 2: the wrong number of shuffle partitions

After a shuffle Spark splits data into `spark.sql.shuffle.partitions` pieces (200 by default). For 2 TB that is 10 GB per task, which runs out of memory; for 2 GB it is 200 tiny tasks. **Adaptive Query Execution (AQE)**, on by default since Spark 3.2, looks at the real sizes while the job runs, merges small partitions and splits skewed ones. Keep it on and know it exists.

### Slowdown 3: joins

- **Broadcast hash join:** the small table is copied to every executor, and the big table never moves. Spark chooses it automatically when a table is under a size threshold (10 MB by default, often raised; see the tuning docs). Hint it with `big.join(F.broadcast(small), "sku")`.
- **Sort-merge join:** both sides are shuffled by the key and sorted. The default for two big tables.
- **Filter and select before joining,** so less data moves.

<div class="problem" data-problem="spark-performance-broadcast"></div>

### Slowdown 4: skew

One key holds most of the rows: the null customer ID, the "online store", one giant advertiser. One task gets a huge partition and runs forever while the others sit idle. Picture a supermarket with eight tills where every shopper with a full trolley is sent to till 1.

<div class="steps" data-fig="spark-performance-skew">
<div class="step"><b>What you hope for.</b> Eight stores, eight tasks of about 30 seconds each. The stage finishes in about 35 seconds.</div>
<div class="step"><b>Skew.</b> The online store has eight times the rows of any shop. Its task takes 240 seconds; the stage cannot finish until it does, so seven cores sit idle for over three minutes.</div>
<div class="step"><b>Salt the hot key.</b> Add a random number 0 to 3 to the online store's key: <code>online#0</code> to <code>online#3</code>. Its rows now spread over four tasks of about 60 seconds each.</div>
<div class="step"><b>Add the pieces back.</b> A second, tiny aggregation adds the four partial totals for "online" into one. The stage now takes about 70 seconds instead of 240.</div>
</div>

Fixes, in the order to try them: let AQE's skew-join handling split it; handle nulls separately (filter them out and process them on their own); **salt** the key as above. In code, salting looks like this:

```python
salted = sales.withColumn("salt", (F.rand() * 4).cast("int"))
partial = salted.groupBy("store_id", "salt").agg(F.sum("revenue").alias("rev"))
total = partial.groupBy("store_id").agg(F.sum("rev").alias("rev"))
```

## 4. Caching: only when reused

`df.cache()` keeps a DataFrame in memory after the first action. It is worth it only if you use that DataFrame **several times** in the same job. Caching everything wastes memory and can make jobs slower. Call `unpersist()` when you are done.

## 5. Read the Spark UI

Every Spark application has a web page (port 4040 on your laptop; on Dataproc it is linked from the cluster page as the history server). Look at:

- **Jobs → Stages:** which stage takes longest?
- **Stage detail → task durations:** a maximum far above the median means **skew**.
- **Shuffle read and write sizes:** big numbers mean a wide operation worth questioning.
- **Spill (memory and disk):** data did not fit in memory; partitions are too big.
- **SQL tab:** the physical plan, showing which join was chosen.

<div class="meaning">

<dl>
<dt>Small-files problem</dt><dd>Too many tiny files: too many tasks and slow listing for every reader.</dd>
<dt>Broadcast join</dt><dd>Copy the small table everywhere so the big one never moves.</dd>
<dt>Skew</dt><dd>One key with far more rows than the others, so one task does most of the work.</dd>
<dt>Salting</dt><dd>Splitting a hot key into a few random pieces, then adding the pieces back up.</dd>
<dt>AQE</dt><dd>Spark adjusting partition counts and join choices while the job runs, using real sizes.</dd>
<dt>Physical meaning</dt><dd>Picture an ad network whose attribution job has been "slow" for months. The Spark UI shows one task running 40 minutes on the rows with no user ID. Handling those rows on their own could cut the run from about 50 minutes to about 12, and the monthly bill by a similar share. Most real fixes look like that: find the one bad stage, remove the extra work.</dd>
</dl>

</div>

<div class="myth">

**"Caching makes Spark faster, so cache everything."** Caching costs memory and time to fill. It only pays off when the same DataFrame is used more than once in a job. Caching a DataFrame you read once just pushes other data out of memory and can cause spills.

</div>

## 6. Try it

In your Lesson 2.2 notebook:

1. Run the province join with and without `F.broadcast(stores)` and compare the `explain()` output. Look for `BroadcastHashJoin` versus `SortMergeJoin`.
2. Create skew by setting 80 % of rows to `store_id = 1`, run the daily group-by, and open `http://localhost:4040` to find the long task.
3. Write the data with `repartition(500)` and with `coalesce(4)` and count the files in each folder.

What to check: in step 2, the slowest task's duration is many times the median; in step 3, the file counts are 500 and 4 (per partition folder if you used partitionBy).

**New words:** *columnar*, *table format*, *compaction*, *shuffle partitions*, *AQE*, *broadcast hash join*, *sort-merge join*, *skew*, *salting*, *cache*, *spill*.

<div class="keypoints">

- Cheaper means less work: fewer bytes read, fewer rows shuffled, even task sizes. More machines rarely cut cost.
- Store analytics data as Parquet, or as Iceberg or Delta tables when you need updates and time travel, in files of roughly 128 MB to 1 GB.
- Broadcast small tables so the big table never shuffles; filter and select before joins.
- Skew shows as one task far slower than the median; fix it with AQE, separate handling of nulls, or salting.
- Use the Spark UI to find the slow stage before changing anything.

</div>
