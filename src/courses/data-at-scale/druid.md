---
title: Apache Druid and real-time OLAP
summary: 'How Druid answers group-by questions on billions of fresh events in under a second: segments, rollup, bitmap indexes, Kafka ingestion and its rivals.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What is rollup in Druid?
    choices: ['Deleting old data', 'Combining rows that share the same truncated time and dimension values into one row at ingestion', 'Backing up segments']
    ans: 1
    why: Rollup stores one row per (minute, campaign, device...) with summed metrics. It can shrink data many times and speed up queries, but row-level detail is lost.
  - q: Druid always splits data first by...
    choices: ['User ID', 'Time', 'File size']
    ans: 1
    why: Every Druid table has a primary timestamp, and segments are cut by time interval. Most queries filter on time.
  - q: Why might an advertiser portal use Druid rather than query BigQuery directly?
    choices: ['BigQuery cannot do SQL', 'Druid gives steady sub-second answers to thousands of small queries at once on data seconds old', 'Druid is a message queue']
    ans: 1
    why: Warehouses are great for big analytical queries; real-time OLAP stores are built for many users, low delay and fresh data.
sources:
  - 'Apache Druid documentation: design and architecture https://druid.apache.org/docs/latest/design/'
  - 'Apache Druid documentation: data rollup https://druid.apache.org/docs/latest/ingestion/rollup'
  - 'Yang, F. et al. (2014), Druid: A Real-time Analytical Data Store, Proceedings of the 2014 ACM SIGMOD International Conference on Management of Data'
---

**Module 4 · about 25 minutes · read first: [4.1](/learn/courses/data-at-scale/database-zoo/).** You'll be able to explain Druid's segments, time partitioning, rollup and bitmap indexes, describe how events from Kafka become queryable in seconds, and compare Druid, Pinot, ClickHouse and BigQuery for a live dashboard.

<div class="bigidea">Druid is a scoreboard you can slice: it adds events up as they arrive, keeps the totals in small time-sorted columnar chunks, and answers thousands of "totals by this and that" questions a second.</div>

## 1. The problem Druid solves

An ad platform shows each of 5,000 advertisers a dashboard: impressions, clicks and spend by hour, by placement and by device, for the last 30 days, **refreshed every minute**. That is thousands of group-by queries a minute over billions of rows, each expected back in under a second. A warehouse can answer each question; it struggles to answer **all of them, that fast, that fresh, that cheaply**.

**Apache Druid** was created at Metamarkets, an adtech company, in 2011 for exactly this. It is now used for ad analytics, network monitoring, product analytics and retail dashboards.

Think of a stadium scoreboard. A warehouse keeps every ball of every match on file and can answer any question, given a moment. A scoreboard keeps running totals that update the instant something happens and can be read by 50,000 people at once. Druid is a scoreboard you can still slice: totals by team, by quarter, by player, instantly.

## 2. How it works

- **Datasource:** Druid's word for a table. Every row has a **timestamp**, **dimensions** (things you group and filter by: campaign, placement, device, store) and **metrics** (things you add up: impressions, clicks, spend).
- **Segments:** data is cut into time chunks (say one per hour or per day), each stored in columns with compressed **bitmap indexes** on the dimensions. A bitmap is a row of 1s and 0s, one per row, saying "this row has campaign C123". A filter on `campaign = 'C123' AND device = 'mobile'` becomes a fast AND of two bitmaps.
- **Rollup:** at ingestion, rows with the same truncated time (say the minute) and the same dimension values are combined into one row with summed metrics. A billion raw events can become tens of millions of rows. You lose the individual events, so keep the raw copy in the lake or BigQuery.
- **Sketches:** approximate algorithms (HyperLogLog, Theta) give fast distinct counts such as unique reach, with a small, known error.
- **Deep storage:** segments are kept durably in Cloud Storage or S3; servers cache them on local disk for speed.

Watch rollup turn eight raw ad events into four stored rows:

<div class="steps" data-fig="druid-rollup">
<div class="step"><b>Raw events.</b> Eight impressions arrive from Kafka between 10:00:04 and 10:01:58, each with a time to the second, a campaign (A or B), a device and a click flag.</div>
<div class="step"><b>Truncate time.</b> The rollup granularity is one minute, so 10:00:04, 10:00:19, 10:00:33 and 10:00:51 all become 10:00. The seconds are thrown away.</div>
<div class="step"><b>Group.</b> Rows that now share minute, campaign and device are the same group: (10:00, A, mobile) has three events, (10:00, B, desktop) one, (10:01, A, mobile) two and (10:01, B, desktop) two.</div>
<div class="step"><b>Store one row per group.</b> Each group becomes one row with impressions counted and clicks summed: (10:00, A, mobile, 3 impressions, 1 click) and so on. Eight rows became four, and every total by minute, campaign or device is still exact.</div>
</div>

The more dimensions you keep, and the finer the time, the less rollup saves. A dimension with millions of values, such as user ID, can wipe out rollup completely, because almost no two events share it.

<div class="problem" data-problem="druid-rollup-rows"></div>

### The processes

| Process | Job |
|---|---|
| **Broker** | Receives queries, sends pieces to the servers holding the data, merges the results |
| **Historical** | Serves older, unchanging segments |
| **Ingestion tasks** (Middle Managers or Indexers) | Read from Kafka or files and serve the newest data before it is handed off |
| **Coordinator / Overlord** | Balance segments across servers and manage ingestion |

Step through the four stages, then change the aggregate and raise the HAVING bar.

<div class="steps" data-fig="@data-groupby-buckets">
<div class="step">Start with the plain table: ten rows, each with a region and an amount.</div>
<div class="step">Split: every row slides into the bucket for its region.</div>
<div class="step">Apply: the aggregate is worked out inside each bucket on its own.</div>
<div class="step">Combine: each bucket collapses to one result row. HAVING now removes whole groups.</div>
</div>


## 3. Streaming ingestion from Kafka

A Kafka **supervisor** reads an ad-events topic continuously. New events are **queryable within seconds**, while they are still being indexed. Every hour (or whatever segment size you set), that data is published as segments to deep storage and served by historicals. This is why Kafka and Druid appear together in so many job postings; Module 5 covers Kafka itself.

## 4. Querying

Druid speaks **SQL**:

```sql
SELECT TIME_FLOOR(__time, 'PT1H') AS hr, placement,
       SUM(impressions) AS imps, SUM(clicks) AS clicks,
       SUM(clicks) * 1.0 / SUM(impressions) AS ctr,
       APPROX_COUNT_DISTINCT_DS_HLL(user_sketch) AS reach
FROM ad_events
WHERE __time >= CURRENT_TIMESTAMP - INTERVAL '1' DAY AND campaign_id = 'C123'
GROUP BY 1, 2
ORDER BY 1;
```

Superset, Grafana, Looker and custom apps connect to it. The sketch function needs Druid's DataSketches extension; check the docs for your version.

## 5. Druid and its rivals

| | **Druid** | **Apache Pinot** | **ClickHouse** | **BigQuery** |
|---|---|---|---|---|
| Born at | Metamarkets (adtech) | LinkedIn ("who viewed your profile") | Yandex (web analytics) | Google |
| Sweet spot | Time-based slice-and-dice on streams | User-facing analytics, very many users, upserts | Fast SQL on big tables, simple to run | Large ad hoc analytics, nothing to run |
| Joins | Limited, improving | Limited | Good | Excellent |
| Freshness | Seconds | Seconds | Seconds to minutes | Seconds (streaming) to minutes |
| Many users at once | High | Very high | Medium to high | Moderate |

ClickHouse has become very popular because it is one program, quick to learn and fast for most analytics. Druid and Pinot win when you need **steady low delay for many users on streaming data**. Features move quickly in all four; check current docs before you decide.

<div class="meaning">

<dl>
<dt>Datasource</dt><dd>A Druid table: timestamp, dimensions to slice by, metrics to add up.</dd>
<dt>Segment</dt><dd>A time chunk of a datasource, stored in columns with indexes.</dd>
<dt>Rollup</dt><dd>Adding up events that share a truncated time and the same dimension values, at load time.</dd>
<dt>Bitmap index</dt><dd>A 1-or-0 flag per row for each value, so filters become fast bit operations.</dd>
<dt>Sketch</dt><dd>A small summary that estimates distinct counts (unique users) with a known small error.</dd>
<dt>Physical meaning</dt><dd>When a cereal brand watches its campaign on a retailer's advertiser portal, the "impressions today" number that ticks up every minute is very likely a rolled-up real-time OLAP table, fed from Kafka, with the raw events kept in the lake for the end-of-campaign audit.</dd>
</dl>

</div>

<div class="myth">

**"Rollup keeps all my data, just smaller."** Rollup keeps the totals for the dimensions you chose and throws away everything else, including each individual event and any column you did not keep. You cannot later ask "which user clicked at 10:00:19?". Always keep the raw events elsewhere, and choose dimensions with the questions in front of you.

</div>

## 6. Practice

One day of ad events has 2 billion rows with: timestamp (ms), campaign (2,000 values), placement (40), device (4), country (12), user_id (300 million), impressions, clicks, spend. Choose the rollup granularity and dimensions for an advertiser dashboard, estimate the rolled-up row count, and say how you would still report unique reach.

<details>
<summary>One answer, and what to check</summary>

Roll up to the **minute** with dimensions campaign, placement, device and country, and drop `user_id` as a dimension. The ceiling is 1,440 × 2,000 × 40 × 4 × 12 combinations, but most never occur; realistically tens of millions of rows, a large cut from 2 billion. Keep a **HyperLogLog sketch** of `user_id` as a metric for approximate unique reach. Raw events stay in Cloud Storage or BigQuery for exact audits.

What to check: user_id is not a dimension, there is a sketch for reach, and the raw copy has a home.
</details>

**Design questions an interviewer may ask:** what is your rollup granularity and what detail do you lose? Which dimensions have very many values and should not be dimensions? How do you handle events that arrive after their segment is published (re-ingest that interval from the lake)? Where is the raw copy for audits?

**New words:** *real-time OLAP*, *datasource*, *dimension*, *metric*, *segment*, *rollup*, *granularity*, *bitmap index*, *sketch*, *HyperLogLog*, *deep storage*, *broker*, *historical*, *supervisor*.

<div class="keypoints">

- Druid serves fast, fresh group-by answers to many users at once, which warehouses struggle to do cheaply.
- Data is split by time into columnar segments with bitmap indexes, kept in deep storage and cached on servers.
- Rollup adds up events with the same truncated time and dimensions; it saves space but loses row detail.
- Never make a near-unique column (user ID) a dimension; use a sketch for distinct counts instead.
- Kafka feeds Druid continuously, so new events are queryable within seconds.

</div>
