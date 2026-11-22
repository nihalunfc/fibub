---
title: Bigtable and wide-column stores
summary: 'Row keys, column families, tablets and hotspots: how Bigtable serves huge read and write volumes in milliseconds, and how HBase, Cassandra and DynamoDB compare.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: Why is a row key that starts with a timestamp a bad idea?
    choices: ['Timestamps are too long', 'All new writes go to the same tablet, overloading one node (a hotspot)', 'Bigtable rejects numbers']
    ans: 1
    why: Rows are sorted by key, so keys that grow with time send every current write to the end of the table, on one node. Lead with a well-spread field such as user ID.
  - q: Bigtable can quickly look up data by...
    choices: ['Any column', 'The row key, or a range of row keys (a prefix scan)', 'Full-text search']
    ans: 1
    why: Bigtable has one index, the row key. Anything else needs a full scan or a second table keyed differently.
  - q: Which workload suits Bigtable best?
    choices: ['A monthly finance report with complex joins', 'Serving per-user ML features to an app in under 10 ms at high volume', 'Ad hoc analyst SQL']
    ans: 1
    why: Bigtable is built for high-volume, low-delay key access. Joins and ad hoc analysis belong in BigQuery.
sources:
  - 'Chang, F. et al. (2008), Bigtable: A Distributed Storage System for Structured Data, ACM Transactions on Computer Systems 26(2) https://doi.org/10.1145/1365815.1365816'
  - 'Google Cloud documentation: Bigtable schema design best practices https://cloud.google.com/bigtable/docs/schema-design'
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 6 (Partitioning)'
---

**Module 4 · about 25 minutes · read first: [4.1](/learn/courses/data-at-scale/database-zoo/).** You'll be able to explain Bigtable's data model, design row keys that avoid hotspots and answer each question with one lookup or one range scan, and say when Bigtable is right and when another store is better.

<div class="bigidea">Bigtable keeps every row in strict order by one key and spreads ranges of keys over many machines, so a well-chosen key makes any lookup instant and a badly chosen one sends all the work to a single machine.</div>

## 1. Bigtable in one paragraph

**Bigtable** is Google's wide-column NoSQL database, described in a 2006 paper and still behind products like Search, Maps and YouTube. On Google Cloud it is a managed service that gives **single-digit millisecond** reads and writes and grows to very high throughput by adding nodes. **Apache HBase** is its open-source copy (and Bigtable speaks the HBase API), **Cassandra** and **ScyllaDB** are close cousins, and **DynamoDB** fills the same role on AWS.

Picture a vast card index in strict alphabetical order across thousands of drawers. Every card has one label, the **row key**. Finding one card, or every card from `user123#2026-11-01` to `user123#2026-11-04`, is instant. Finding "every card that mentions cereal" means reading every drawer. So you choose the label with great care, because it is the only way in.

## 2. The data model

- **Table** → rows sorted by **row key** (bytes, up to 4 KB, but keep them short).
- **Column families** (a few, defined up front) group related columns, such as `profile` and `views`.
- **Column qualifiers** can be created freely per row (`views:sku_88231`), so rows can have very different columns. Empty cells take no space.
- **Cells** hold values with **timestamps**; you can keep several versions and set garbage collection rules ("keep 30 days" or "keep the last 5").
- Writes to a single row are atomic. There are no multi-row transactions and no joins.

Under the hood the key space is cut into **tablets** (ranges of keys) spread over nodes, and Bigtable moves tablets around to balance load. The data sits in Google's distributed file system, so adding nodes does not copy data; it only moves who serves which range.

## 3. Row key design: the whole game

Write down the questions first, then design the key so each is a single lookup or one continuous scan.

| Question | Good row key | Why |
|---|---|---|
| A user's recent product views | `user_id#reverse_ts` | All of one user's rows sit together, newest first |
| Latest reading per sensor | `sensor_id#reverse_ts` | One prefix scan, limit 1 |
| Stock level for a store and product | `store_id#sku` | One point lookup |
| All events in the last hour, any user | Do not use Bigtable alone; send to BigQuery or Druid | A time range across users forces a hotspot or a full scan |

A **reverse timestamp** is a very large number minus the time (`MAX - ts`), so newer rows sort first and "latest 20" means "first 20".

**Avoid hotspots.** Because rows are sorted, keys that start with a timestamp or an increasing ID send every new write to the end of the table, which one node serves. Lead with a well-spread field instead, or add a short hash prefix (`hash(user) % 100 # user # ts`) and scan all prefixes when you need everything.

<div class="steps" data-fig="bigtable-hotspot">
<div class="step"><b>Key starts with time.</b> A delivery app writes GPS pings with keys like <code>2026-11-22T10:00:07#u481</code>. Every new key is "later" than all others, so every write lands in the last tablet, on node 4. Node 4 is at 100 %; nodes 1 to 3 do nothing.</div>
<div class="step"><b>Add nodes.</b> The team adds two nodes. It does not help: the newest key range still lives on one node, now node 6. Writes slow down and time out however many nodes you pay for.</div>
<div class="step"><b>Key starts with the user.</b> Change the key to <code>u481#9223370305...</code> (user, then reverse time). Users are spread across the alphabet, so writes spread across all four nodes at about 25 % each.</div>
<div class="step"><b>Add nodes again.</b> Now two more nodes really add capacity: about 17 % each. A user's latest pings are still one short scan of their own prefix.</div>
</div>

Once writes are spread evenly, sizing is simple arithmetic: peak operations per second divided by what one node handles at a safe load. The per-node figure depends on row size and workload, so measure it with your own load test.

<div class="problem" data-problem="bigtable-nodes"></div>

## 4. Who uses Bigtable and why

- **Personalisation:** recent views and purchases per shopper, read by the app's recommendation service.
- **ML feature serving:** Vertex AI's online feature store can serve features from Bigtable at low delay (Module 6).
- **Adtech:** user profiles, frequency caps ("this user has seen this ad 3 times today"), budget counters.
- **Finance:** market ticks and transaction histories per account.
- **IoT and energy:** smart-meter readings per meter.

## 5. When not to use it

- Analysts need ad hoc SQL and joins → **BigQuery** (which can query Bigtable as an external table for the odd analysis).
- Small app data with flexible queries → **Firestore**, **Cloud SQL** or **Postgres**.
- Modest data and traffic → a managed relational database is usually simpler and cheaper; Bigtable has a minimum cost per node-hour.
- Multi-row transactions or global SQL consistency → **Spanner**.

<div class="meaning">

<dl>
<dt>Row key</dt><dd>The one label every row is sorted and found by. The only index.</dd>
<dt>Column family</dt><dd>A named group of columns, defined up front, with its own garbage collection rule.</dd>
<dt>Tablet</dt><dd>A continuous range of row keys served by one node at a time.</dd>
<dt>Hotspot</dt><dd>One node doing most of the work because the keys being written or read all fall in its range.</dd>
<dt>Reverse timestamp</dt><dd>A big number minus the time, so the newest rows sort first.</dd>
<dt>Physical meaning</dt><dd>When a shopping app shows "recently viewed" in a blink, it is usually reading one short, contiguous range of rows that all start with that shopper's ID. The same app would freeze if it had to ask the same store "who viewed cereal last week?", which is a question for the warehouse.</dd>
</dl>

</div>

<div class="myth">

**"If Bigtable is slow, add more nodes."** Nodes only help if the work is spread across key ranges. With a hotspot, one node does the work however many you add, as the step player showed. Fix the key first (lead with a spread-out field, use reverse timestamps for "latest"), then size the cluster.

</div>

## 6. Practice

A grocery app must show (a) a shopper's last 20 purchases, (b) their loyalty points balance, and (c) the "frequently bought together" list for any product. Design one or two Bigtable tables: row keys, column families and garbage collection rules. Then name one question you would refuse to support in Bigtable and where it belongs instead.

<details>
<summary>One design, and what to check</summary>

Table `shopper`: key `shopper_id`; family `bal` (points, keep 1 version); family `buys` with qualifiers `reverse_ts#order_id` (keep 90 days). Reading the row and taking the first 20 `buys` columns answers (a); `bal` answers (b).

Table `product_pairs`: key `sku`; family `fbt` with qualifier `other_sku` and the score as the value, rebuilt nightly by a Spark job. That answers (c) with one lookup.

Refuse: "which shoppers bought cereal last week?" That is an analytics question for BigQuery.

What to check: every question is one lookup or one prefix scan, and no key starts with a timestamp.
</details>

**New words:** *wide-column store*, *row key*, *column family*, *column qualifier*, *cell version*, *garbage collection rule*, *tablet*, *node*, *hotspot*, *reverse timestamp*, *salting with a hash prefix*.

<div class="keypoints">

- Bigtable sorts rows by one key and serves key ranges (tablets) from many nodes, giving millisecond lookups at huge scale.
- Design the row key from the questions: each should be one lookup or one prefix scan.
- Never lead a key with a timestamp or increasing ID; it creates a hotspot that more nodes cannot fix.
- Reverse timestamps make "latest N" a simple first-N scan.
- Use Bigtable for high-volume key access; send joins and ad hoc SQL to BigQuery.

</div>
