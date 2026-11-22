---
title: The database zoo
summary: 'OLTP and OLAP, row and column stores, and the NoSQL families (key-value, document, wide-column, search, graph, vector), with the trade-off behind each.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: A checkout system saves one order at a time and reads one customer's orders. That workload is...
    choices: ['OLAP', 'OLTP', 'Search']
    ans: 1
    why: Many small reads and writes of single records is transactional work (OLTP), served by Postgres, MySQL, Spanner and similar.
  - q: Which family keeps data under a row key with flexible columns and is built for huge write volumes?
    choices: ['Graph', 'Wide-column (Bigtable, Cassandra, HBase)', 'Spreadsheet']
    ans: 1
    why: Wide-column stores keep rows sorted by key, spread over many servers, and handle very high write rates.
  - q: In most NoSQL databases you design the table around...
    choices: ['Normalising every entity', 'The exact questions the application will ask', 'Whatever is easiest to load']
    ans: 1
    why: NoSQL stores give up flexible querying for speed and scale, so the key design must match the access pattern.
sources:
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 2 (Data Models and Query Languages) and Chapter 3 (Storage and Retrieval)'
  - 'Stonebraker, M. et al. (2005), C-Store: A Column-oriented DBMS, Proceedings of the 31st VLDB Conference'
  - 'Brewer, E. (2012), CAP Twelve Years Later: How the "Rules" Have Changed, Computer 45(2), 23-29 https://doi.org/10.1109/MC.2012.37'
---

**Module 4 · about 25 minutes · read first: [1.2](/learn/courses/data-at-scale/the-map/), [3.3](/learn/courses/data-at-scale/bigquery/).** You'll be able to tell OLTP from OLAP and row stores from column stores, name each NoSQL family with one product and one use, and explain why NoSQL design starts from the question.

<div class="bigidea">Every database is shaped for one kind of question; a store that is fast for "show me order 123" is slow for "total sales by region for two years", and the other way round.</div>

## 1. Why this matters

A warehouse is not the only database on a data platform. Apps save orders in one kind of store, dashboards read from another, search uses a third. Picking the wrong one is expensive in a quiet way: everything works on day one, then gets slower and dearer as data grows. This module is about the serving stores from Lesson 1.2's "serve" box, starting with the map of the whole zoo.

## 2. Two kinds of work

| | **OLTP** (transactions) | **OLAP** (analytics) |
|---|---|---|
| Typical question | "Save this order." "Show order 123." | "Revenue by region by week for two years." |
| Rows touched | A few | Millions to billions |
| Storage | **Row** store | **Column** store |
| Examples | PostgreSQL, MySQL, SQL Server, Oracle, Spanner, AlloyDB | BigQuery, Snowflake, Redshift, ClickHouse, Druid, Pinot, DuckDB |

Think of a phone book and a census report. A phone book (row store) is perfect for finding one person and everything about them. A census report (column store) is perfect for "average age by city", because all the ages are printed together. Ask the phone book for the average age and you would turn every page.

Watch both stores answer "average order value for the West region" on a tiny table of four orders with columns id, customer, region, value and date:

<div class="steps">
<div class="step"><b>Row store layout.</b> On disk the rows sit one after another: <code>1, Ana, West, 40, 3 Nov | 2, Raj, East, 25, 3 Nov | 3, Li, West, 60, 4 Nov | 4, Sam, East, 30, 4 Nov</code>. Every value of a row is together.</div>
<div class="step"><b>Row store reads.</b> To find region and value, it reads every row in full: all 20 values, 15 of them useless for this question.</div>
<div class="step"><b>Column store layout.</b> Each column is stored on its own: <code>region: West, East, West, East</code> and <code>value: 40, 25, 60, 30</code>, and so on.</div>
<div class="step"><b>Column store reads.</b> It opens only the region and value columns: 8 values. It sees West at positions 1 and 3, takes 40 and 60, and answers 50. Repeated values like West, East, West, East also compress very well.</div>
<div class="step"><b>But for "show order 3".</b> The row store jumps to one row and reads it whole. The column store must visit five columns to stitch order 3 back together. Each layout wins its own kind of question.</div>
</div>

<div class="problem" data-problem="database-zoo-scan"></div>

## 3. The NoSQL families

"NoSQL" means "not only relational". Each family gives up something (joins, flexible queries, strict consistency) to get something (scale, speed, flexibility).

| Family | Shape | Products | Great for |
|---|---|---|---|
| **Key-value** | `key → value` | Redis, Memcached, DynamoDB | Caches, sessions, counters, feature lookups |
| **Document** | JSON documents | MongoDB, Firestore, Couchbase | App data with varied shapes: product catalogues, user profiles |
| **Wide-column** | Row key → column families → columns, sorted by key | **Bigtable**, HBase, Cassandra, ScyllaDB | Time series, events, IoT, very high write rates, ML feature serving |
| **Search** | Inverted index of words | **Elasticsearch**, OpenSearch, Solr | Full-text and fuzzy search, logs, filters with counts |
| **Real-time OLAP** | Columnar segments, often pre-aggregated | **Druid**, Pinot, ClickHouse | Sub-second dashboards on fresh events for many users |
| **Time-series** | Timestamped measurements | InfluxDB, TimescaleDB, Prometheus | Metrics, sensors, monitoring |
| **Graph** | Nodes and edges | Neo4j, Neptune, Spanner Graph | Fraud rings, recommendations, networks |
| **Vector** | Embeddings with similarity search | pgvector, Pinecone, Vertex AI Vector Search, Elasticsearch | Semantic search and retrieval for LLMs (Lesson 6.3) |

## 4. The trade-offs in plain words

- **Scale-out comes from a key.** NoSQL systems spread data over servers by a key (a row key, a partition key). Questions by that key are fast; questions by anything else may be slow or impossible. Like a coat check: give your ticket number and you get your coat at once; ask "which coats are blue?" and the attendant has to search every hook.
- **Design for the question.** In relational design you model the things (customers, orders) and write any query later. In wide-column and key-value stores you list the questions first and shape the key to answer them. Copying the same data into two tables for two questions is normal.
- **Consistency choices.** When servers are spread out and the network splits, a system must choose between always answering (perhaps with stale data) or refusing until it is sure. This is the **CAP theorem**. Bigtable gives strong consistency within a cluster; Cassandra lets you tune it per query.
- **Joins are rare.** Most NoSQL stores do not join; you **denormalise** ahead of time, usually in a Spark or Flink job.

## 5. Why analytical platforms add these stores

A warehouse like BigQuery answers big questions in seconds, but it is not built for:

- **thousands of users at once wanting answers in under a second** (an advertiser portal, a store manager app);
- **looking up one key in milliseconds** (a customer's features for a live model);
- **search** ("blue rain jacket, size M, under $80").

So platforms copy a slice of data into a **serving store** shaped for that job: Druid for dashboards, Bigtable for key lookups, Elasticsearch for search. The next three lessons take each in turn.

<div class="meaning">

<dl>
<dt>OLTP</dt><dd>Many small reads and writes of single records: the app's own database.</dd>
<dt>OLAP</dt><dd>Few big questions over many rows: the warehouse and dashboards.</dd>
<dt>Row store / column store</dt><dd>Keeps each record together / keeps each column together.</dd>
<dt>Access pattern</dt><dd>The exact questions an app will ask, which a NoSQL key must be shaped to answer.</dd>
<dt>Denormalise</dt><dd>Store data already joined, so no join is needed at read time.</dd>
<dt>Physical meaning</dt><dd>A grocery app keeps the cart in Redis (microseconds per shopper), past purchases in Bigtable (one shopper's history in milliseconds), the catalogue in Elasticsearch (typos forgiven), and all of it in BigQuery for analysts. Same data, four shapes, because there are four kinds of question.</dd>
</dl>

</div>

<div class="myth">

**"NoSQL is the modern replacement for SQL databases."** NoSQL stores solve specific problems (huge scale, fixed access patterns, flexible documents) by giving up joins and flexible queries. For most apps and most analytics, a relational database or a warehouse is still the simplest right answer. Many NoSQL products have even added SQL-like query languages.

</div>

## 6. Practice

Match each need to a family:

1. Show this shopper's last 50 product views in the app in 10 ms.
2. Advertisers see impressions and clicks by hour, refreshed every minute.
3. Search products by name, with typos.
4. Find groups of accounts that share devices and cards.
5. Store each user's cart while they shop.

<details>
<summary>Answers, and what to check</summary>

1. Wide-column (Bigtable), with a row key like `user#reverse_timestamp`.
2. Real-time OLAP (Druid or Pinot).
3. Search (Elasticsearch or OpenSearch).
4. Graph (Neo4j or Spanner Graph).
5. Key-value (Redis or Memorystore).

What to check: for each answer you can say which question the store's key or index makes fast.
</details>

**New words:** *OLTP*, *OLAP*, *row store*, *column store*, *NoSQL*, *key-value*, *document*, *wide-column*, *inverted index*, *real-time OLAP*, *time-series*, *graph*, *vector*, *CAP theorem*, *denormalise*, *serving store*.

<div class="keypoints">

- OLTP (single records, row stores) and OLAP (big scans, column stores) are different jobs needing different layouts.
- Column stores read only the columns a question needs and compress them well, which is why warehouses use them.
- Each NoSQL family trades joins and flexible queries for scale, speed or flexible shape.
- In NoSQL, design the key around the questions first; copying data for different questions is normal.
- Platforms copy slices of data into serving stores for fast dashboards, key lookups and search.

</div>
