---
title: 'Capstone: design a retail media data platform'
summary: 'Every module in one design: the events, pipelines, stores, models and measurement behind a grocer''s retail media network, one campaign traced end to end, and the capstone brief.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: Why does the design keep both a live path (Kafka to Druid) and an exact path (lake to BigQuery)?
    choices: ['By mistake', 'Brands want fast numbers during a campaign, but invoices need exact, de-duplicated numbers', 'Druid cannot store data']
    ans: 1
    why: This is a deliberate lambda-style choice. The portal labels live numbers as provisional; billing uses the exact batch path.
  - q: Test stores' weekly sales rose from 60 to 66 and matched control stores' from 58 to 61. What did the screens add, by difference-in-differences?
    choices: ['6', '3', '9']
    ans: 1
    why: (66 − 60) − (61 − 58) = 6 − 3 = 3. The control change removes what the season did to every store.
  - q: How does the design stop brands from seeing row-level shopper data?
    choices: ['It trusts them', 'Brands get aggregates only, and joins with their own data happen in a clean room with minimum group sizes', 'It deletes all shopper data']
    ans: 1
    why: Clean rooms with aggregation thresholds, and aggregate-only exports, keep shopper rows inside the retailer.
sources:
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley'
  - 'Angrist, J. D. and Pischke, J.-S. (2009), Mostly Harmless Econometrics, Princeton University Press, Chapter 5 (Difference-in-differences)'
  - 'Interactive Advertising Bureau (IAB) and Media Rating Council (MRC), Retail Media Measurement Guidelines (2024), iab.com'
---

**Module 7 · about 35 minutes to read, 6 to 10 hours for the capstone · read first: all of Module 7.** You'll be able to design an end-to-end retail media platform and justify each tool, trace one campaign from set-up to an incrementality report, size the storage, read a store test, and build a working slice of the platform on your laptop.

<div class="bigidea">A retail media platform is every idea in this course working together: events stream in through Kafka, a fast path powers live dashboards and ad controls, an exact path builds the numbers brands are billed on, and a measurement layer proves whether the ads caused any extra sales.</div>

## 1. The brief

A national grocer with 400 stores, a website, an app and 10 million loyalty members launches a retail media network. It sells **sponsored products** onsite, **display** in the app, **screens** in 150 stores and **offsite** audiences. Brands want **live dashboards**, **closed-loop sales reporting** and **incrementality** reads. Privacy rules require that no brand ever sees row-level shopper data.

## 2. The design, layer by layer

1. **Sources.** App and web clickstream; ad server request, impression and click logs; in-store screen play logs; till transactions with loyalty IDs; online orders; product catalogue and stock (change data capture from the merchandising database); campaign set-up from the self-serve ad console.
2. **Ingest.** Everything event-shaped goes to **Kafka** topics (`ads.impressions.v1`, `ads.clicks.v1`, `web.events.v1`, `orders.v1`, `inventory.cdc.v1`) with Avro schemas in a registry ([Lesson 5.3](/learn/courses/data-at-scale/kafka-reliability/)). Till transactions arrive as nightly files in **Cloud Storage bronze**. **Datastream** or **Debezium** streams catalogue and stock changes.
3. **Real-time path.** **Flink** (or Dataflow) jobs filter invalid traffic, pace spend per campaign per minute, count impressions per user and campaign, and suppress out-of-stock products. Counters go to **Bigtable** (or Redis) for the ad server. **Druid** reads impressions and clicks from Kafka with a one-minute rollup for advertiser dashboards.
4. **Lake and batch path.** Kafka Connect writes raw events to Cloud Storage as hourly Parquet (bronze). Nightly, **Airflow** (Cloud Composer) runs **Spark on Dataproc**: remove duplicates, filter invalid traffic, build sessions, join identities, write **Iceberg** silver tables. **BigQuery** with dbt or Dataform builds gold marts: `fct_impressions`, `fct_clicks`, `fct_sales`, `dim_campaign`, `dim_product`, `dim_store`, `fct_attributed_sales`, `fct_billing`.
5. **Measurement.** The ad server logs holdout assignments. BigQuery jobs compute attribution under the network's published rules, incrementality reads with confidence intervals for user holdouts, and difference-in-differences for store screen tests. Every read is versioned and reproducible.
6. **Sharing.** **BigQuery data clean rooms** for brands' own data, with minimum group sizes. The advertiser portal reads Druid (live) and BigQuery aggregates (final). Agencies get scheduled exports of aggregates only.
7. **Machine learning.** **Vertex AI**: click prediction for the sponsored-products auction, audience models (likely category buyers) from point-in-time features, budget forecasting. Online features served from Bigtable.
8. **Product search.** **Elasticsearch** or OpenSearch for site search, with sponsored products blended into results by the ad server.
9. **Running it.** Dataplex catalogue and quality rules, freshness monitors on every topic and table, lineage from raw logs to invoice lines, Terraform for infrastructure, budgets and cost labels per pipeline, an on-call rota for the real-time path.

Impression logs are the biggest table in the design. Size them before you choose where they live:

<div class="problem" data-problem="retail-media-platform-storage"></div>

## 3. One campaign, end to end

<div class="steps">
<div class="step"><b>Booking.</b> A cola brand books a two-week sponsored-products and in-store screen campaign: $60,000, targeting "cola" and "soft drinks" searches, 75 test stores with screens and 75 matched control stores, and a 10% random holdout online.</div>
<div class="step"><b>Set-up flows.</b> The ad console writes the campaign to its database; change data capture puts it on Kafka; the ad server picks it up within a minute.</div>
<div class="step"><b>Serving.</b> Each ad request checks pacing and frequency counters in Bigtable. Impressions and clicks stream to Kafka; the brand sees impressions, clicks, CTR and spend in Druid within a minute.</div>
<div class="step"><b>Exact numbers.</b> Nightly, Spark and BigQuery build de-duplicated, bot-free tables. The billing table must match the ad server's totals within an agreed tolerance, or the pipeline raises an alert.</div>
<div class="step"><b>Measurement.</b> Two weeks after the campaign ends (to let the attribution window close), the job reports attributed ROAS, the online holdout lift with its 95% interval, the store test by difference-in-differences, and iROAS.</div>
<div class="step"><b>Learning.</b> The results feed the marketing mix model and the next campaign's audience model. The loop closes.</div>
</div>

The store screen test cannot use a user holdout: screens are seen by everyone in the store. Instead, compare how test stores changed against how matched control stores changed over the same weeks. That is **difference-in-differences**:

```math
\text{effect} = (\bar y_{\text{test, during}} - \bar y_{\text{test, before}}) - (\bar y_{\text{control, during}} - \bar y_{\text{control, before}})
```

The control stores' change captures everything that hit all stores at once: the season, the weather, a price change.

<div class="problem" data-problem="retail-media-platform-did"></div>

<div class="meaning">

<dl>
<dt>Live path</dt><dd>Kafka to Flink, Bigtable and Druid: seconds old, used for control and dashboards, provisional.</dd>
<dt>Exact path</dt><dd>Kafka to the lake, Spark and BigQuery: hours old, de-duplicated and reconciled, used for invoices.</dd>
<dt>Difference-in-differences</dt><dd>The test group's change minus the control group's change over the same time.</dd>
<dt>Reconciliation</dt><dd>Checking that two systems' totals agree within a tolerance, and alerting when they do not.</dd>
<dt>Physical meaning</dt><dd>When a cola brand renews its campaign because the grocer showed, with an interval, that the screens added about $3,000 of sales per store per week, every layer of this design was involved: the screen play logs, the till files, the matched control stores, the nightly Spark job and the versioned SQL that anyone can rerun to get the same answer.</dd>
</dl>

</div>

<div class="myth">

**"The live dashboard and the invoice should always show the same number."** They come from different paths on purpose. The live number is fast and includes events that will later be removed as duplicates or bot traffic. Good portals label live numbers as provisional and explain the gap.

</div>

## 4. Trade-offs to be ready to defend

- **Build or buy** the ad server and sponsored-products engine? Many networks license it and own the data layer.
- **Druid, Pinot, ClickHouse or BigQuery BI Engine** for the portal: how many brands query at once, how fresh, what the team already knows.
- **Kafka or Pub/Sub** on Google Cloud: company standards, ecosystem, who runs it.
- **Lambda-style** (live approximate plus nightly exact) is deliberate here: advertisers see fast numbers, invoices use exact ones, and the portal labels which is which.

## 5. The capstone

**Part A: design document (2 to 3 pages).** For a fictional retailer, write: goals and users; an architecture diagram; a table of every tool with **why it was chosen and what you rejected**; the data model for impressions, clicks and sales; privacy controls; delay and cost targets; and the three biggest risks.

**Part B: a working slice (local and free, synthetic data only).**

1. A generator for 7 days of impressions, clicks and sales for 3 campaigns and 50,000 shoppers, with a 10% holdout that gets no impressions and a true lift you choose (for example +15%). Plant duplicates and a few bot users too.
2. Kafka, then a stream job, then live per-campaign counts (Druid, ClickHouse or DuckDB plus a chart).
3. Batch: Spark (or DuckDB) removes duplicates and bots and builds `fct_impressions`, `fct_sales` and attributed sales with a 7-day click window.
4. A measurement notebook: attributed ROAS, measured lift with a 95% interval, iROAS.
5. An Airflow DAG that runs the batch and measurement steps in order.

**Part C: the story.** A one-page README a hiring manager can read in two minutes: the problem, the design, what you measured, and what you would do with a real team. Compare it with your Module 1 one-pager from [Who uses what](/learn/courses/data-at-scale/who-uses-what/).

**Done looks like:**

- [ ] The design document has a "why this tool, and what I rejected" row for every tool.
- [ ] The live counts and the batch counts differ only by the duplicates and bots you planted, and you can show the difference.
- [ ] The measured lift's 95% interval contains the lift you planted.
- [ ] iROAS is lower than attributed ROAS, and the README explains why in plain words.
- [ ] One command (or one DAG run) rebuilds every table from the raw events.

**Acceptance checks:** (1) `COUNT(DISTINCT event_id)` in `fct_impressions` equals the generator's count of real impressions; (2) your notebook recovers the planted lift within its interval on three different random seeds; (3) a stranger can run the slice from the README in under 15 minutes.

**New words:** *live path*, *exact path*, *difference-in-differences*, *matched control stores*, *reconciliation tolerance*, *aggregation threshold*.

<div class="keypoints">

- The platform combines everything: Kafka ingest, a live path (Flink, Bigtable, Druid), an exact path (lake, Spark, BigQuery), measurement, clean rooms and ML.
- Live and exact numbers coexist on purpose; invoices use the exact path and the portal labels live numbers as provisional.
- User holdouts measure online ads; store tests use matched control stores and difference-in-differences.
- Every choice needs a reason and a rejected alternative, and every number must be rebuildable from raw events.

</div>
