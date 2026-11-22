---
title: 'Stream processing: windows, watermarks and state'
summary: 'How Flink, Spark Structured Streaming, Dataflow and Kafka Streams turn endless events into answers, how late data is handled, and the Module 5 mini project.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: '"Sales per store for each 5-minute block, no overlaps" is which kind of window?'
    choices: ['Tumbling', 'Sliding', 'Session']
    ans: 0
    why: Tumbling windows are fixed-size blocks that touch end to end without overlapping. Sliding windows overlap; session windows end after a quiet gap.
  - q: What does a watermark of "latest event time minus 10 minutes" do?
    choices: ['Deletes events older than 10 minutes', 'Declares a window final once the latest event time seen is 10 minutes past its end, so later stragglers are treated as late', 'Delays every result by exactly 10 minutes of wall-clock time']
    ans: 1
    why: The watermark is the engine's guess that nothing older is still on its way. A longer watermark waits for more stragglers but holds results and state longer.
  - q: Why do stream engines take checkpoints?
    choices: ['To make dashboards prettier', 'To save state and the Kafka offsets together, so after a crash they resume without losing or double counting', 'To compress the data']
    ans: 1
    why: Restoring the counts and the read position from the same moment is what lets an engine restart and still give exactly-once results.
sources:
  - 'Akidau, T. et al. (2015), The Dataflow Model, Proceedings of the VLDB Endowment 8(12), 1792-1803 https://doi.org/10.14778/2824032.2824076'
  - 'Apache Spark documentation: Structured Streaming Programming Guide (spark.apache.org/docs)'
  - 'Apache Flink documentation: Timely stream processing (event time and watermarks) https://nightlies.apache.org/flink/flink-docs-stable/'
  - 'Akidau, T., Chernyak, S. and Lax, R. (2018), Streaming Systems, O''Reilly'
---

**Module 5 · about 30 minutes · read first: 5.1, 5.2.** You'll be able to explain tumbling, sliding and session windows, work out which late events a watermark accepts, say why state and checkpoints matter, choose a stream engine, and write a Spark Structured Streaming job that reads Kafka.

<div class="bigidea">A stream never ends, so a stream processor cuts it into time windows, waits a set amount for stragglers (the watermark), and keeps running totals (state) that it saves regularly so a crash costs nothing.</div>

## 1. The problem: answers from a stream that never ends

"Sales per store per 5 minutes" is easy in batch, because the data is complete. In a stream it never is: there is always another event coming, and some arrive late. Stream processors solve this with three ideas: **windows**, **watermarks** and **state**.

Picture counting cars crossing a bridge. You report a count every 5 minutes (a **window**). Some drivers' dashcams upload their crossing time late, because they were in a tunnel. How long do you keep the 10:00 to 10:05 tally open for them? Say 3 minutes after the latest crossing you have seen (the **watermark**). After that you close the book, and anything later goes on a "late" pile. The tally sheets you keep open meanwhile are your **state**.

## 2. Windows

| Window | Shape | Example |
|---|---|---|
| **Tumbling** | Fixed size, no overlap | Sales per 5 minutes |
| **Sliding** (hopping) | Fixed size, overlapping | Clicks in the last 10 minutes, updated every minute |
| **Session** | Ends after a quiet gap | One shopper's browsing session ends after 30 minutes idle |
| **Global with triggers** | Your own rule | A running total sent out every 100 events |

Always window by **event time** (when it happened), not processing time (when you saw it), or late data lands in the wrong bucket. Overlap has a price: in a sliding window every event joins several windows.

<div class="problem" data-problem="stream-processing-windows"></div>

## 3. Watermarks and late data

A **watermark** is the engine saying "I believe every event up to time T has now arrived." A common rule is T = latest event time seen − allowed lateness. When the watermark passes the end of a window, the window is **final** and its result is sent. Events that turn up after that are dropped, sent to a side output, or used to update a result already sent, depending on the engine and your settings.

<div class="steps" data-fig="stream-processing-windows">
<div class="step"><b>10:03.</b> Two orders arrive on time, at 10:01 and 10:03 event time. Both go into the 10:00 to 10:05 window. The allowed lateness is 3 minutes, so the watermark is 10:00: nothing can close yet.</div>
<div class="step"><b>10:06.</b> An order from 10:02 arrives four minutes late (a phone with weak signal). The watermark is still only 10:00, so the window is open and the order is counted. Then a 10:06 order arrives and the watermark moves to 10:03.</div>
<div class="step"><b>10:10.</b> Orders at 10:08 and 10:09:30 push the watermark to 10:06:30, past 10:05. The first window is final: 3 orders. Its result goes to the dashboard and its state is freed.</div>
<div class="step"><b>10:12.</b> An order from 10:04 finally arrives. Its window closed two minutes ago, so it is <b>late</b>: dropped or sent to a side table to be fixed in the nightly batch.</div>
</div>

A longer allowed lateness counts more stragglers but delays every result and keeps more state in memory. Now walk a table of arrivals yourself:

<div class="problem" data-problem="stream-processing-late"></div>

<div class="meaning">

<dl>
<dt>Window</dt><dd>A slice of event time (for example 10:00 to 10:05) whose events are added up together.</dd>
<dt>Watermark</dt><dd>The engine's "everything before this time is in" line, usually the latest event time minus the allowed lateness.</dd>
<dt>Late event</dt><dd>An event that arrives after its window was declared final.</dd>
<dt>State</dt><dd>The running totals the engine keeps between events: open windows, counts, seen event IDs.</dd>
<dt>Checkpoint</dt><dd>A saved copy of the state plus the Kafka offsets read so far, taken every few seconds or minutes.</dd>
<dt>Physical meaning</dt><dd>A restaurant chain's live dashboard shows each 5-minute block of orders a few minutes after it ends, not instantly, because the system deliberately waits for orders from tablets with weak Wi-Fi. That short wait is the watermark: a trade between "fast" and "complete" that someone chose on purpose.</dd>
</dl>

</div>

<div class="myth">

**"Just group by the time the event reached us; it is simpler."** Processing time is simpler, but a phone that was offline for 20 minutes then puts all its orders in the wrong block, and a replay after a crash puts a whole hour's events into one block. Group by event time and handle lateness with a watermark.

</div>

## 4. State and checkpoints

Counts, joins and de-duplication need **state** that survives crashes. Engines keep it in memory or on local disk (Flink often uses an embedded store called RocksDB) and take **checkpoints** to durable storage, together with the Kafka offsets read so far. After a failure they restore both from the same moment and carry on. That is how they avoid both losing and double counting events.

## 5. The engines

| Engine | Style | Choose it when |
|---|---|---|
| **Apache Flink** | True event-at-a-time processing, rich state and event-time features | Low latency and complex stateful logic (fraud, ad pacing). Runs on Kubernetes and as managed services |
| **Spark Structured Streaming** | Small batches of DataFrames, every few seconds | You already use Spark, seconds of delay are fine, and you want one code base for batch and streaming |
| **Dataflow** (Apache Beam) | One model for batch and streaming, serverless on Google Cloud | Google Cloud teams with Pub/Sub sources who want autoscaling without clusters |
| **Kafka Streams** | A library inside your own app | Kafka in, Kafka out, for application teams |

## 6. A Structured Streaming job

This reads the `pos.sales.v1` topic from Lesson 5.2 and counts revenue per store per 5-minute window with a 10-minute watermark. You met PySpark DataFrames in [PySpark hands on](/learn/courses/data-at-scale/pyspark-basics/).

```python
import pyspark
from pyspark.sql import SparkSession, functions as F

# The Kafka connector must match your Spark version (and Scala version: 2.13 for Spark 4, often 2.12 for Spark 3.5).
pkg = f"org.apache.spark:spark-sql-kafka-0-10_2.13:{pyspark.__version__}"
spark = SparkSession.builder.appName("live-sales").config("spark.jars.packages", pkg).getOrCreate()

schema = "txn long, store string, sku int, price double, ts double"
events = (spark.readStream.format("kafka")
    .option("kafka.bootstrap.servers", "localhost:9092")
    .option("subscribe", "pos.sales.v1")
    .option("startingOffsets", "earliest")
    .load()
    .select(F.from_json(F.col("value").cast("string"), schema).alias("e"))
    .select("e.*")
    .withColumn("event_time", F.col("ts").cast("timestamp")))

per_5min = (events
    .withWatermark("event_time", "10 minutes")
    .dropDuplicates(["txn"])                       # at-least-once input, counted once
    .groupBy(F.window("event_time", "5 minutes"), "store")
    .agg(F.sum("price").alias("revenue"), F.count("*").alias("txns")))

(per_5min.writeStream
    .outputMode("update")
    .format("console")
    .option("checkpointLocation", "chk/live-sales")  # state and offsets survive a restart
    .start()
    .awaitTermination())
```

Swap the console for Parquet files in Cloud Storage, a BigQuery table, another Kafka topic (to feed Druid), or a `foreachBatch` function that upserts. Check the Structured Streaming guide for how `dropDuplicates` keeps its state under a watermark in your Spark version.

## 7. Where streams meet the rest of the platform

- **Into the warehouse:** BigQuery's Storage Write API, Pub/Sub BigQuery subscriptions, Kafka Connect sinks.
- **Into serving stores:** Druid and Pinot read Kafka topics directly; Flink or Dataflow write counters to Bigtable.
- **Into machine learning:** "purchases in the last 30 minutes", computed in Flink and written to an online feature store (Lesson 6.2).

## 8. Mini project for Module 5: the live store dashboard

**Brief.** A grocer wants a live chart of sales per store per 5 minutes that stays correct when phones send events late, when messages arrive twice, and when the job restarts. Budget: 3 to 4 hours, all on your laptop with Docker, synthetic data only.

1. Run Kafka locally. Extend the Lesson 5.2 producer to send 50 events a second, with **5% delayed by up to 15 minutes** (set `ts` in the past) and **1% sent twice**.
2. Use an Avro or JSON schema and send malformed events to a `pos.sales.dlq` (dead-letter) topic instead of crashing.
3. Spark Structured Streaming (or Flink, or Kafka Streams): 5-minute tumbling windows per store, a 10-minute watermark, duplicates removed by `txn`.
4. Write results to Parquet or DuckDB and draw a chart (Streamlit, Grafana or Superset) that refreshes every 30 seconds.
5. Kill the streaming job mid-run, restart it, and show from the checkpoint that no window was counted twice.
6. Write a README: the delay you measured, how many late events were dropped at 2, 10 and 20-minute watermarks, and the trade-off you chose.

**Done looks like:**

- [ ] The chart updates on its own while the producer runs.
- [ ] Malformed events appear in the dead-letter topic, and the job keeps running.
- [ ] After a restart, the totals per window equal a batch recount of the same events (de-duplicated by `txn`, late events excluded).
- [ ] The README has a small table of watermark length against dropped events and result delay.

**Acceptance check:** run a DuckDB query over the raw events (`SELECT store, window_start, SUM(price) ... GROUP BY ...` on distinct `txn`, on-time only) and compare with the streaming output. Every window should match to the cent.

**New words:** *tumbling window*, *sliding window*, *session window*, *watermark*, *allowed lateness*, *late event*, *state*, *checkpoint*, *dead-letter topic*.

<div class="keypoints">

- Windows cut an endless stream into blocks of event time: tumbling (no overlap), sliding (overlap, more work), session (ends after a quiet gap).
- A watermark declares a window final once the latest event time seen has moved far enough past its end; later events are late.
- Longer watermarks are more complete but slower and use more memory: choose on purpose and write the choice down.
- State plus checkpoints (saved with the Kafka offsets) let engines restart without losing or double counting.
- Flink for low-latency stateful work, Spark Structured Streaming if you already use Spark, Dataflow on Google Cloud, Kafka Streams inside apps.

</div>
