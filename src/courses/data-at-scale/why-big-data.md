---
title: Why big data needs different tools
summary: 'Data is big when one computer can''t store it, process it in time or keep up with it. Learn scale-up, scale-out and the three ideas behind every tool.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: A 3 GB CSV file loads slowly in Excel. What is the most sensible first step?
    choices: ['Set up a Spark cluster', 'Use DuckDB, Polars or pandas on your laptop', 'Stream it through Kafka']
    ans: 1
    why: 3 GB fits easily on one modern laptop. Single-machine tools are faster and simpler at this size. Big-data tools earn their keep only when one machine is not enough.
  - q: What does scale-out mean?
    choices: ['Buying a bigger server', 'Adding more ordinary machines that share the work', 'Compressing the data']
    ans: 1
    why: Scale-up buys a bigger machine. Scale-out adds more machines that split the work. Every tool in this course is built to scale out.
  - q: Why do big-data systems try to "move the code to the data"?
    choices: ['Code is secret', 'Sending a small program over the network is far cheaper than sending terabytes of data', 'Data cannot be copied']
    ans: 1
    why: The network is the slowest part of a cluster. Shipping a few kilobytes of code to the machine that already holds the data avoids moving the data at all.
sources:
  - 'Dean, J. and Ghemawat, S. (2008), MapReduce: Simplified Data Processing on Large Clusters, Communications of the ACM 51(1), 107-113 https://doi.org/10.1145/1327452.1327492'
  - 'Ghemawat, S., Gobioff, H. and Leung, S.-T. (2003), The Google File System, Proceedings of the 19th ACM Symposium on Operating Systems Principles'
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 1 (Reliable, Scalable and Maintainable Applications)'
  - 'DuckDB documentation https://duckdb.org/docs/'
---

**Module 1 · about 20 minutes · read first: nothing, this is the start.** You'll be able to say in one sentence when data counts as big, tell scale-up from scale-out, and name the three ideas that every big-data tool is built on.

<div class="bigidea">Data is "big" when one computer can no longer store it, process it in time, or keep up with how fast it arrives; from then on you split the data and the work over many machines.</div>

## 1. Why this matters

Job postings are full of names: Spark, BigQuery, Kafka, Druid, Bigtable, Airflow. It looks like a wall of products. It is not. Underneath, every one of them answers the same problem with the same three ideas. Learn the problem and the ideas first, and each product becomes "oh, it's that idea again, with these trade-offs".

If you have not built a small pipeline before, the course [Pipeline to Dashboard](/learn/courses/etl/) is the step before this one: it builds a daily pipeline on one machine. This course is about what changes when one machine is not enough.

## 2. The one-line definition

Data is **big** when one computer can no longer:

- **store** it (the disk is full),
- **process** it fast enough (last night's job is still running at lunchtime), or
- **keep up** with how quickly it arrives (events pile up faster than you can save them).

That's it. It is not a number of rows. It is the point where the tools you know (Excel, one SQL Server, pandas) stop coping.

People often describe it with **the three Vs**:

| V | Means | Retail example |
|---|---|---|
| **Volume** | How much | Ten years of every till receipt in 1,500 stores: billions of rows |
| **Velocity** | How fast it arrives | Every click on the website and app, thousands per second |
| **Variety** | How many shapes | Receipts (tables), reviews (text), shelf photos (images), app events (JSON) |

Think of a home cook. Dinner for four on one stove is easy. Asked to feed 4,000 people by 7 pm, the cook can't just cook faster. You need a kitchen: many cooks each doing part of the work, a head chef handing out tasks, a pantry everyone can reach, and an order rail so nothing gets lost. Big-data tools are that kitchen. In this course, Spark is the team of cooks, cloud storage is the pantry, Kafka is the order rail and Airflow is the head chef's schedule.

## 3. Scale up or scale out

When a job gets too big there are two ways to grow:

- **Scale up:** buy a bigger machine, with more memory and more cores. Simple, nothing in your code changes. But there is a ceiling, and the biggest machines cost far more per unit of power.
- **Scale out:** use many ordinary machines together, called a **cluster**. There is no ceiling in practice, and if one machine dies the others carry on. The price is complexity: the work must be split up and the results stitched back together.

Google described how it scaled out in two famous papers: the Google File System (2003) and MapReduce (2004). The open-source world rebuilt the ideas as **Hadoop**, and nearly everything in this course descends from that moment.

Here is scale-out on one small job: reading 12 GB of receipts, where one machine reads 200 MB per second.

<div class="steps" data-fig="why-big-data-split">
<div class="step"><b>One machine.</b> 12,000 MB ÷ 200 MB/s = 60 seconds. Fine for 12 GB, hopeless for 12 TB (about 17 hours).</div>
<div class="step"><b>Split.</b> Cut the data into 4 <b>partitions</b> (chunks) of 3 GB. Nothing has been read yet; we have only decided who reads what.</div>
<div class="step"><b>Read in parallel.</b> Four machines each read their own 3 GB at the same time: 15 seconds. Each machine reads data stored next to it, so nothing crosses the network.</div>
<div class="step"><b>Combine.</b> Each machine sends back one small number (its total). Adding four numbers takes a moment: about 17 seconds in all, not 60.</div>
<div class="step"><b>Expect failure.</b> Machine 3 dies halfway. Only its partition is read again, by machine 4: about 32 seconds. Still faster than one machine, and nobody had to restart the whole job.</div>
</div>

<div class="problem" data-problem="why-big-data-scaleout"></div>

## 4. The three ideas behind every tool

Once you see these, every product in the course looks like a variation.

1. **Split the data and the work.** Cut a big table into **partitions**. Each machine works on its own partitions in parallel. Spark, BigQuery, Kafka, Druid and Bigtable all split data this way; they just split by different rules (by file, by date, by key).
2. **Move the code, not the data.** The network is slow compared with reading a local disk. So send the small program to the machines that already hold the data. When data *must* move between machines (a **shuffle**), that is usually the slowest and most expensive step, and much tuning is about avoiding it.
3. **Keep an append-only log, and expect failure.** With 1,000 machines, one fails most days. Systems write things down in order (a **log**), keep copies on other machines (**replication**), and can redo lost work. Kafka *is* a log. Spark remembers the recipe for each result so it can recompute a lost piece.

<div class="meaning">

<dl>
<dt>Big data</dt><dd>Data that one computer cannot store, process in time, or keep up with.</dd>
<dt>Scale up</dt><dd>A bigger machine. Easy, but it has a ceiling and costs more per unit.</dd>
<dt>Scale out</dt><dd>More ordinary machines sharing the work (a cluster). No ceiling, but the work must be split and combined.</dd>
<dt>Partition</dt><dd>One chunk of a big dataset, handled by one worker at a time.</dd>
<dt>Shuffle</dt><dd>Moving data between machines over the network. Usually the slow, costly step.</dd>
<dt>Physical meaning</dt><dd>A supermarket chain's year of receipts is a mountain of paper. Scale-out means handing a stack to each of many clerks, each adding up their own stack where it sits, and only passing slips with totals to the head office. Big-data tools are that office, run by software.</dd>
</dl>

</div>

## 5. Why the cloud changed everything

Before about 2015, scale-out meant buying racks of servers and hiring people to run Hadoop. Today you rent it by the minute:

- **Storage and compute are separate.** Data sits in cheap object storage (Google Cloud Storage, Amazon S3, Azure Blob Storage). Compute clusters start, do the work and shut down. You pay for storage all the time, but for compute only while it runs. Think of a pantry you keep, and cooks you hire per evening.
- **Serverless services hide the cluster.** In BigQuery you write SQL and Google decides how many machines to use. You never see a server.
- **Pay as you go means a mistake costs money,** not just time. A careless query over a huge table can cost real dollars. Cost awareness is now part of the job, and you will practise it throughout this course.

## 6. When you do not need big-data tools

This matters in interviews as much as knowing the tools. A modern laptop handles **tens of gigabytes** with DuckDB or Polars, often faster than a small Spark cluster, because there is no network and no start-up cost. A rough guide (your data and team decide in the end):

- **Up to tens of GB, batch:** single-machine tools such as DuckDB or Polars, or a warehouse like BigQuery. The [pandas course](/learn/courses/pandas/) and [Pipeline to Dashboard](/learn/courses/etl/) live here.
- **Hundreds of GB to petabytes, or heavy custom processing:** Spark or Dataflow (Module 2).
- **Data arriving all the time and needed within seconds:** streaming with Kafka and a stream processor (Module 5).
- **Thousands of users needing answers in milliseconds:** a serving store such as Druid, Bigtable or Elasticsearch (Module 4).

<div class="myth">

**"Big data means lots of rows, so I should use Spark for anything over a million."** A million rows is a few hundred megabytes: a laptop handles it in seconds. The test is not a row count but whether one machine can still do the job in time. Saying "at 20 GB I'd use DuckDB, and move to Spark or BigQuery when the data or the team outgrows one machine" shows more judgement than "I'd use Spark".

</div>

## 7. Try it

Feel the single-machine limit yourself. Install DuckDB (`pip install duckdb`) and run this in Python. It makes 50 million fake sales rows and adds them up by store.

```python
import duckdb, time
con = duckdb.connect()
t = time.time()
con.sql("""
  CREATE TABLE sales AS
  SELECT range AS txn_id, (random() * 1500)::INT AS store_id, round(random() * 40, 2) AS amount
  FROM range(50000000)
""")
print(con.sql("SELECT store_id, sum(amount) FROM sales GROUP BY store_id ORDER BY 2 DESC LIMIT 5"))
print(f"{time.time() - t:.1f} seconds")
```

Change `50000000` to `500000000`. Does it still finish? Watch your memory. The point where your laptop struggles is your personal "big data" line.

## 8. Practice

1. Pick a business you know (a supermarket, a hotel chain, a bank). Write one data source for each V: something with huge volume, something with high velocity, something with variety. Guess its size per day.
2. A job takes 6 hours on one machine. Could 60 machines finish it in 6 minutes? What gets in the way?
3. Why can a cluster survive a machine dying when a single big server cannot?

<details>
<summary>Answers</summary>

1. A hotel chain: **volume** is ten years of reservations (millions of rows, a few GB); **velocity** is website search and booking events (hundreds a second at peak, maybe 5 GB a day of JSON); **variety** is guest reviews (text), room photos (images) and the nightly property-system extract (CSV).
2. Rarely exactly. Start-up time, combining results, any shuffle between machines, and the slowest machine all add time. 10 to 15 minutes would be a good result.
3. Data is copied to several machines and the work is split into small pieces, so a lost piece is redone elsewhere. A single server has no spare.

What to check: your answer to 1 has a size per day, not just a name.
</details>

**New words:** *three Vs*, *scale up*, *scale out*, *cluster*, *partition*, *shuffle*, *replication*, *serverless*.

<div class="keypoints">

- Data is big when one machine can't store it, process it in time, or keep up with it. It is not a row count.
- Scale up buys a bigger machine; scale out adds many machines. Every tool in this course scales out.
- Three ideas run through every tool: split the data and work, move the code not the data, keep a log and expect failure.
- The cloud separates storage from compute and bills by use, so cost is part of every design.
- Under tens of GB, single-machine tools like DuckDB or Polars are usually faster and simpler.

</div>
