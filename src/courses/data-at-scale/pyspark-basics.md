---
title: PySpark DataFrames, hands on
summary: 'Run Spark on your laptop, then read, clean, join, group and write data with PySpark and Spark SQL, next to the SQL and pandas you already know.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: Why is df.collect() on a 500 GB DataFrame dangerous?
    choices: ['It deletes the data', 'It pulls every row to the driver, which runs out of memory', 'It only works in Scala']
    ans: 1
    why: collect() brings all rows to one machine, the driver. Use show(), limit() or write the result out instead.
  - q: What does partitionBy("sale_date") do when writing Parquet?
    choices: ['Sorts the rows', 'Creates one folder per date, so later queries for one date read only that folder', 'Splits the columns into separate files']
    ans: 1
    why: Folder-per-value partitioning lets Spark, BigQuery and others skip folders that don't match a filter. This is called partition pruning.
  - q: Why prefer Parquet over CSV for big data?
    choices: ['Parquet is easier for people to read', 'Parquet is columnar, compressed and stores types, so engines read only the columns they need', 'CSV cannot hold numbers']
    ans: 1
    why: Columns stored together, compression and a stored schema mean far less to read and no guessing of types.
sources:
  - 'PySpark documentation: API reference and getting started https://spark.apache.org/docs/latest/api/python/'
  - 'Apache Spark documentation: Spark SQL, DataFrames and Datasets guide https://spark.apache.org/docs/latest/sql-programming-guide.html'
  - 'Apache Parquet documentation https://parquet.apache.org/docs/'
---

**Module 2 · about 30 minutes · read first: [2.1](/learn/courses/data-at-scale/how-spark-works/).** You'll be able to run PySpark on your own computer, read, filter, join, group and write data, use Spark SQL and window functions, and avoid the habits that crash real jobs.

<div class="bigidea">PySpark DataFrames are SQL tables you build with Python: the same filter, join and group by you already know, run lazily across many cores or many machines.</div>

## 1. Why this matters

Most Spark work in job postings is PySpark DataFrames, and most of it is moves you already know from SQL or [pandas](/learn/courses/pandas/), written slightly differently. Learning the translation takes an afternoon. What takes longer is the habits: never pulling big data to one machine, preferring built-in functions, and writing files in a layout others can query cheaply. This lesson does both.

## 2. Set up in five minutes

PySpark runs on one laptop in **local mode**: the driver and executors are threads on your machine. Same code, smaller scale, like rehearsing a play in your living room before the theatre. You need Python and Java (Spark 4 needs Java 17 or 21; check the PySpark install page for the current list).

```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install pyspark pandas
python -c "import pyspark; print(pyspark.__version__)"
```

No Java, or a locked-down work laptop? Use a free Google Colab notebook and run `!pip install pyspark`, or another option from [Free sandboxes](/learn/courses/data-at-scale/free-sandboxes/).

Step through map, shuffle and reduce for a word count.

<div class="steps" data-fig="@data-mapreduce">
<div class="step">The text is split across three workers.</div>
<div class="step">Map: every word becomes a (word, 1) pair, each worker on its own.</div>
<div class="step">Shuffle: pairs for the same word travel to the same worker. This is the costly network step.</div>
<div class="step">Reduce: each worker adds up the 1s for its words.</div>
</div>


## 3. Make some data

```python
from pyspark.sql import SparkSession, functions as F, Window
spark = SparkSession.builder.appName("retail").master("local[*]").getOrCreate()

import random, datetime as dt
rows = [(i, random.randint(1, 20), random.randint(1, 500),
         str(dt.date(2026, 10, 1) + dt.timedelta(days=random.randint(0, 30))),
         round(random.uniform(1, 40), 2), random.choice([1, 1, 1, 2, -1]))
        for i in range(200_000)]
sales = spark.createDataFrame(rows, "txn_id long, store_id int, sku int, sale_date string, price double, qty int")
stores = spark.createDataFrame([(s, f"Store {s}", random.choice(["ON", "QC", "BC"])) for s in range(1, 21)],
                               "store_id int, store_name string, province string")
sales.show(5); sales.printSchema()
```

`master("local[*]")` means "use every core on this machine". `qty = -1` is a refund: a fault planted on purpose, as in real till data.

## 4. The core moves, next to what you know

| Task | PySpark | SQL you know |
|---|---|---|
| Keep rows | `sales.filter(F.col("qty") > 0)` | `WHERE qty > 0` |
| Pick columns | `.select("store_id", "price")` | `SELECT store_id, price` |
| New column | `.withColumn("revenue", F.col("price") * F.col("qty"))` | `price * qty AS revenue` |
| Fix a type | `.withColumn("sale_date", F.to_date("sale_date"))` | `CAST(sale_date AS DATE)` |
| Remove duplicates | `.dropDuplicates(["txn_id"])` | `QUALIFY ROW_NUMBER() ... = 1` |
| Join | `.join(stores, "store_id", "left")` | `LEFT JOIN stores USING (store_id)` |
| Group | `.groupBy("province").agg(F.sum("revenue").alias("rev"))` | `GROUP BY province` |
| Sort and peek | `.orderBy(F.desc("rev")).show(10)` | `ORDER BY rev DESC LIMIT 10` |

Watch one till row go through a typical cleaning chain. Nothing runs until the last step, because only that one is an action.

<div class="steps">
<div class="step"><b>Read.</b> The row arrives as text: <code>txn 1042, store 7, sku 88, "2026-10-14", price 3.50, qty 2</code>. The date is still a string.</div>
<div class="step"><b>withColumn (narrow).</b> <code>to_date</code> turns the string into a real date, and <code>revenue = price × qty</code> adds 7.00. The row never leaves its partition.</div>
<div class="step"><b>filter (narrow).</b> <code>qty &gt; 0</code> is true, so the row stays. A refund row with qty −1 would be dropped here, or better, flagged and kept in its own table.</div>
<div class="step"><b>join (small table, broadcast).</b> Store 7 is looked up in the 20-row stores table, which Spark copied to every executor, so the row gains <code>province = ON</code> without moving.</div>
<div class="step"><b>groupBy + write (wide, then action).</b> The row is shuffled to the worker that owns the key (ON, 2026-10-14) and added to that day's total. <code>write</code> is the action that makes all of this actually happen.</div>
</div>

Put together in code:

```python
clean = (sales
  .withColumn("sale_date", F.to_date("sale_date"))
  .withColumn("is_refund", F.col("qty") < 0)
  .withColumn("revenue", F.col("price") * F.col("qty")))

by_prov = (clean.join(stores, "store_id", "left")
  .groupBy("province", "sale_date")
  .agg(F.sum("revenue").alias("net_revenue"),
       F.countDistinct("txn_id").alias("txns"),
       F.sum(F.when(F.col("is_refund"), 1).otherwise(0)).alias("refunds")))

by_prov.orderBy("province", "sale_date").show(10)
by_prov.explain()   # read the plan: 'Exchange' means a shuffle; look for 'BroadcastHashJoin'
```

Row counts are the first thing to check after each step. A join type you did not think about can silently drop or multiply rows.

<div class="problem" data-problem="pyspark-basics-rows"></div>

## 5. Spark SQL: same engine, SQL words

Many teams write mostly SQL. Register a view and query it:

```python
clean.createOrReplaceTempView("sales")
spark.sql("""
  SELECT store_id, sale_date, SUM(revenue) AS rev,
         SUM(SUM(revenue)) OVER (PARTITION BY store_id ORDER BY sale_date) AS running_rev
  FROM sales GROUP BY store_id, sale_date
""").show(5)
```

The DataFrame version of the same window:

```python
w = Window.partitionBy("store_id").orderBy("sale_date")
daily = clean.groupBy("store_id", "sale_date").agg(F.sum("revenue").alias("rev"))
daily.withColumn("running_rev", F.sum("rev").over(w)).show(5)
```

Both become the same plan. Use whichever your team reads more easily.

## 6. Write it like a real pipeline

```python
(clean.write.mode("overwrite")
   .partitionBy("sale_date")
   .parquet("out/sales_clean"))

spark.read.parquet("out/sales_clean").filter("sale_date = '2026-10-15'").count()
```

Open the `out/sales_clean` folder: one sub-folder per date, named like `sale_date=2026-10-15`. A query for one date reads one folder, like going straight to one drawer of a filing cabinet. In the cloud the path becomes `gs://my-bucket/sales_clean/` and nothing else changes.

**Parquet** stores each column together, compressed, with its type written in the file. A query that needs two of twenty columns reads about a tenth of the data. CSV makes the engine read every character of every row and guess the types.

<div class="meaning">

<dl>
<dt>SparkSession</dt><dd>Your connection to Spark; every DataFrame starts from it.</dd>
<dt>DataFrame</dt><dd>A table with named, typed columns, spread over partitions.</dd>
<dt>F (functions)</dt><dd>Spark's built-in column functions: sum, when, to_date and hundreds more. They run inside the engine, fast.</dd>
<dt>partitionBy</dt><dd>Write one folder per value of a column, so later readers can skip folders.</dd>
<dt>Physical meaning</dt><dd>A grocery chain's "net sales by province and day" report is exactly the chain above: read the till files, fix types, flag refunds, look up the store, group, write. On a laptop it handles 200,000 rows; on a cluster the same code handles 2 billion.</dd>
</dl>

</div>

<div class="myth">

**"I'll just call toPandas() and finish the analysis in pandas."** On a sample, fine. On real data, `toPandas()` and `collect()` pull every row to the driver, one machine, and crash it or run for hours. Use `show()`, `limit()` or aggregate first and then convert the small result. And prefer built-in `F.` functions to Python UDFs (`@udf`): built-ins run inside the engine and are many times faster. If you truly need Python, use a pandas UDF (`@pandas_udf`), which works on whole batches.

</div>

## 7. Practice

Using the data above:

1. Count refunds per store and find the store with the highest refund rate (refunds ÷ transactions).
2. Find each store's best day by net revenue using a window and `F.row_number()`.
3. Write the result as Parquet partitioned by `province`, read it back and confirm the row count matches.

<details>
<summary>One solution for step 2, and what to check</summary>

```python
w = Window.partitionBy("store_id").orderBy(F.desc("rev"))
(daily.withColumn("rn", F.row_number().over(w))
      .filter("rn = 1").orderBy("store_id").show())
```

What to check: step 2 returns exactly 20 rows (one per store), and the count you read back in step 3 equals the count you wrote.
</details>

**New words:** *local mode*, *SparkSession*, *DataFrame*, *temp view*, *window function*, *partitionBy*, *partition pruning*, *Parquet*, *UDF*.

<div class="keypoints">

- PySpark DataFrame moves map one-to-one onto SQL: filter, select, withColumn, join, groupBy, orderBy.
- Transformations are lazy; show, count and write are actions that run the plan. Use explain() to see shuffles and join types.
- Check row counts after every step: an inner join can silently drop unmatched rows.
- Write Parquet with partitionBy on the column people filter by, so readers skip folders.
- Never collect() or toPandas() big data, and prefer built-in functions to Python UDFs.

</div>
