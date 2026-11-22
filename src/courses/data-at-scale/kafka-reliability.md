---
title: 'Reliable streams: guarantees, schemas, Connect and CDC'
summary: 'At-most-once, at-least-once and exactly-once delivery; schemas and the Schema Registry; Kafka Connect; and change data capture with Debezium, in plain words.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: Your pipeline must never lose a payment, and the warehouse table must show each payment once. What do you use?
    choices: ['At-most-once delivery', 'At-least-once delivery plus a sink that removes duplicates by event ID', 'Nothing special: networks never fail']
    ans: 1
    why: At-least-once never loses a message but may send one twice. An idempotent sink (upsert or de-duplicate by event ID) turns that into an exactly-once result.
  - q: Which schema change is backward compatible?
    choices: ['Renaming price to unit_price', 'Adding an optional field with a default value', 'Changing store_id from a number to text']
    ans: 1
    why: Readers using the new schema can still read old messages, because the missing field takes its default. Renames and type changes break readers.
  - q: What does log-based change data capture (CDC) read?
    choices: ['A full copy of every table each night', 'The database''s own change log, giving one event per insert, update and delete', 'Screenshots of the application']
    ans: 1
    why: Reading the change log is fast, puts little load on the database and, unlike nightly copies, also catches deletes.
sources:
  - 'Apache Kafka documentation: Message delivery semantics and Kafka Connect https://kafka.apache.org/documentation/'
  - 'Debezium documentation https://debezium.io/documentation/'
  - 'Apache Avro specification: schema resolution https://avro.apache.org/docs/'
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 4 (Encoding and evolution) and Chapter 11'
---

**Module 5 · about 25 minutes · read first: 5.2.** You'll be able to explain the three delivery guarantees, make a sink produce exactly-once results, evolve a schema without breaking readers, and describe how Kafka Connect and change data capture move data in and out of Kafka.

<div class="bigidea">Networks fail and machines restart, so a reliable stream assumes every message may arrive twice, gives each one an ID so the second copy can be ignored, and uses a schema as a contract so producers cannot break readers.</div>

## 1. Delivery guarantees

A producer sends a message; the network drops the reply; the producer cannot tell whether the message arrived. It can either give up (risking a loss) or send again (risking a duplicate). Every streaming system picks one of three promises:

| Guarantee | What it means | Fine for |
|---|---|---|
| **At-most-once** | Never duplicated, sometimes lost | Metrics where a tiny loss does not matter |
| **At-least-once** | Never lost, sometimes duplicated | The usual default |
| **Exactly-once** | Each message affects the result once | Money, budgets, billing |

Kafka gives two tools. **Idempotent producers** stop retries from writing the same message twice into a partition ("idempotent" means doing it again has no extra effect). **Transactions** let a job read, process and write back to Kafka as one all-or-nothing step, which Kafka Streams and Flink use for exactly-once processing inside Kafka.

Once data leaves Kafka (to BigQuery, an API, an email), you get exactly-once **results** by making the destination idempotent: upsert by key, or remove duplicates by event ID.

Think of paying a bill by cheque through the post. At-most-once: post it once and hope. At-least-once: keep posting copies until the company confirms, so they might get two. Exactly-once result: number the cheque, and the bank refuses any number it has already cashed. That number is your **event ID**.

<div class="steps">
<div class="step"><b>The payment.</b> A hotel guest pays $180. The booking app sends event <code>pay_7f3c</code> to Kafka.</div>
<div class="step"><b>A broker restarts.</b> The event was stored, but the acknowledgement never got back. The sink job also restarts from its last committed offset, which is just before <code>pay_7f3c</code>.</div>
<div class="step"><b>Delivered twice.</b> The warehouse loader now receives <code>pay_7f3c</code> a second time. A plain <code>INSERT</code> would book $360.</div>
<div class="step"><b>The idempotent sink.</b> The loader runs <code>MERGE ... ON event_id</code>. The second copy matches the existing row, so nothing changes. Revenue stays $180.</div>
</div>

Duplicates after a restart are normal, not rare. Here is how many a clean-up step might remove:

<div class="problem" data-problem="kafka-reliability-dedup"></div>

<div class="meaning">

<dl>
<dt>At-least-once</dt><dd>Keep resending until confirmed: nothing is lost, but copies happen.</dd>
<dt>Idempotent</dt><dd>Doing it twice has the same effect as doing it once, like pressing a lift button again.</dd>
<dt>Event ID</dt><dd>A unique name for each event, set by the producer, used to spot copies.</dd>
<dt>Exactly-once result</dt><dd>The final table or total counts each event once, even if the pipe delivered it twice.</dd>
<dt>Physical meaning</dt><dd>A guest's card is charged once and the hotel's revenue report matches the bank statement, even though, somewhere in the pipes, the payment message travelled twice after a server restarted at 3 am.</dd>
</dl>

</div>

<div class="myth">

**"Turn on exactly-once in Kafka and duplicates are solved."** Kafka's exactly-once covers work that reads from Kafka and writes back to Kafka. The moment you write to a warehouse, an API or an inbox, you need your own guard: a unique event ID and a sink that ignores repeats.

</div>

## 2. Schemas: contracts for events

If the app team renames `price` to `unit_price` on a Friday, every consumer breaks at 2 am. A **schema** is a written description of an event's fields and types, and it stops this.

- Formats: **Avro** (compact, the Kafka classic), **Protobuf** (popular with app developers) and **JSON Schema**.
- A **Schema Registry** (Confluent's, Apicurio, or the ones built into managed cloud services) stores every version and checks **compatibility** before a new version is allowed:
  - **Backward:** readers with the new schema can read old data. You may add optional fields with defaults and delete fields.
  - **Forward:** readers with the old schema can read new data.
  - **Full:** both.
- Each message carries a small schema ID, not the whole schema, so it stays small.

```json
{"type": "record", "name": "Sale", "namespace": "pos.v1", "fields": [
  {"name": "txn_id",     "type": "string"},
  {"name": "store_id",   "type": "int"},
  {"name": "sku",        "type": "int"},
  {"name": "price",      "type": {"type": "bytes", "logicalType": "decimal", "precision": 10, "scale": 2}},
  {"name": "loyalty_id", "type": ["null", "string"], "default": null},
  {"name": "ts",         "type": {"type": "long", "logicalType": "timestamp-millis"}}]}
```

Topic names carry a version (`pos.sales.v1`, then `v2` for a breaking change). Many teams now write **data contracts**: the schema plus an owner, what each field means, quality rules and how fresh the data will be.

Set the failure chance and the retries, then run the pipeline several times.

<figure class="fig" data-fig="@data-dag-retry"><figcaption>Notice that a failed task blocks everything after it, and that retries rescue short faults.</figcaption></figure>


## 3. Kafka Connect: plumbing without code

**Kafka Connect** runs ready-made **connectors** that you configure in JSON rather than code:

- **Source connectors** bring data in: databases (through Debezium), files, software-as-a-service apps.
- **Sink connectors** send data out: **Cloud Storage** or S3 (as Parquet, split by hour), **BigQuery**, Elasticsearch, Bigtable, Snowflake.

Small built-in transforms can rename fields or mask personal data on the way. This is how the "Kafka to Parquet in the lake" step from [The map](/learn/courses/data-at-scale/the-map/) usually works.

## 4. Change data capture (CDC)

Business systems (orders, stock, loyalty) live in operational databases. Copying whole tables every night is slow, loads the database and misses rows that were deleted. **Log-based CDC** reads the database's own change log, which the database writes anyway for its own safety, and turns each insert, update and delete into an event:

```json
{"op": "u", "before": {"sku": 88231, "price": 4.99}, "after": {"sku": 88231, "price": 4.49},
 "source": {"table": "products", "ts_ms": 1793786400000}}
```

- **Debezium** (open source, runs on Kafka Connect) supports PostgreSQL, MySQL, SQL Server, Oracle, MongoDB and others.
- **Google Datastream** is serverless CDC into BigQuery and Cloud Storage.
- In the warehouse you **MERGE** the changes into tables, or keep the full history as a slowly changing dimension (type 2), which Pipeline to Dashboard covers in [Dimensions and SCD2](/learn/courses/etl/dimensions-scd2/).

## 5. Who cares about this

Banks (every change must be audited), retailers (price and stock changes must reach the website and the warehouse in minutes), and every platform team that has been woken up by a schema change. "Schema evolution" and "CDC" are frequent interview topics for data engineers.

## 6. Try it

1. Add a field `promo_code` to the Sale schema above in a backward-compatible way.
2. Explain why changing `store_id` from `int` to `string` is not backward compatible, and how you would roll the change out instead.
3. Your BigQuery sink sometimes receives duplicates after a restart. Write the SQL that keeps one row per `txn_id`.

<details>
<summary>Answers and what to check</summary>

1. `{"name": "promo_code", "type": ["null", "string"], "default": null}`: optional, with a default. **Check:** old messages without the field still read, as `null`.
2. A reader using the new schema expects text where old data holds a number. Add a new field `store_code` (string) alongside, move consumers over, then drop the old field in a `v2` topic. **Check:** at no point does any running consumer see a type it does not expect.
3. ```sql
   SELECT * FROM sales
   QUALIFY ROW_NUMBER() OVER (PARTITION BY txn_id ORDER BY ingest_ts DESC) = 1
   ```
   or a `MERGE` on `txn_id`. **Check:** `COUNT(*)` equals `COUNT(DISTINCT txn_id)` afterwards.
</details>

**New words:** *at-most-once*, *at-least-once*, *exactly-once*, *idempotent*, *schema*, *schema registry*, *backward compatible*, *data contract*, *Kafka Connect*, *change data capture*.

<div class="keypoints">

- Assume every message may arrive twice. Give each event a unique ID and make the destination idempotent (upsert or de-duplicate by that ID).
- Kafka's idempotent producers and transactions give exactly-once inside Kafka; outside it, exactly-once is a property of your sink.
- Schemas in a registry are contracts: add optional fields with defaults, never rename or change types in place, and version topics for breaking changes.
- Kafka Connect moves data in and out with configured connectors; log-based CDC (Debezium, Datastream) turns database changes into events, deletes included.

</div>
