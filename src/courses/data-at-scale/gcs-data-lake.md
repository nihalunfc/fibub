---
title: Cloud Storage and the data lake
summary: 'Buckets and objects, storage classes, lifecycle rules, folder layouts that make queries cheap, and the bronze, silver and gold layers of a tidy lake.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: Raw files you must keep for 7 years but almost never read belong in...
    choices: ['Standard', 'Nearline', 'Archive']
    ans: 2
    why: Archive is the cheapest to store, with higher retrieval cost and a 365-day minimum, which suits rarely read compliance copies.
  - q: Why use paths like sales/dt=2026-11-04/part-000.parquet?
    choices: ['They look tidy', 'Engines treat dt=... folders as partitions and skip the ones that do not match the filter', 'Cloud Storage requires it']
    ans: 1
    why: Hive-style key=value folders let Spark, BigQuery external tables and Trino skip whole folders (partition pruning).
  - q: Cloud Storage "folders" are really...
    choices: ['Directories on a disk', 'Part of each object''s name; the slash is just a character', 'Separate buckets']
    ans: 1
    why: Object storage is flat. sales/2026/file.csv is one object name. Tools show the slashes as folders for convenience.
sources:
  - 'Google Cloud documentation: storage classes https://cloud.google.com/storage/docs/storage-classes'
  - 'Google Cloud documentation: object lifecycle management https://cloud.google.com/storage/docs/lifecycle'
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly, Chapter 6 (Storage)'
---

**Module 3 · about 20 minutes · read first: [3.1](/learn/courses/data-at-scale/gcp-tour/).** You'll be able to create buckets and copy files with the gcloud command line, pick storage classes and write lifecycle rules, and design a lake layout with layers and partitioned paths.

<div class="bigidea">A data lake is cheap storage with nothing but labels, so the way you name and age your files decides how fast, safe and cheap everything built on it will be.</div>

## 1. Why this matters

Every engine in this course, Spark, BigQuery, Trino, Druid, reads from or writes to object storage. A lake with a good layout makes every query cheaper for years; a messy one becomes a "data swamp" nobody trusts, with a storage bill that grows forever. Both are decided in the first week, by a handful of naming and ageing rules.

## 2. Objects, not files

**Cloud Storage (GCS)** stores **objects** (any bytes, plus a little metadata) in **buckets** (globally unique names, each in one location). There are no real folders: `raw/sales/2026-11-04.csv` is one object name with slashes in it. Storage is strongly consistent (you can read what you just wrote straight away), very durable and cheap per GB. Amazon **S3** and Azure **Blob Storage** work the same way, and Spark reads `gs://`, `s3://` or `abfss://` paths alike.

Think of a self-storage facility. A **bucket** is your unit. **Objects** are boxes with labels. You get no shelves or rooms, only labels, so a good labelling scheme (`dt=2026-11-04`) is how you find things fast. **Storage classes** are units nearer or further from the entrance: the far ones are cheaper to rent but cost more each time you fetch something.

## 3. Hands on with the command line

```bash
gcloud storage buckets create gs://YOURNAME-retail-lake --location=northamerica-northeast2 --uniform-bucket-level-access
gcloud storage cp sales_2026-11-04.csv gs://YOURNAME-retail-lake/bronze/sales/dt=2026-11-04/
gcloud storage ls -r gs://YOURNAME-retail-lake/bronze/
gcloud storage rsync -r ./out/sales_clean gs://YOURNAME-retail-lake/silver/sales/
```

The older `gsutil` tool does the same and still appears in many guides. `--uniform-bucket-level-access` means permissions are set once for the whole bucket with IAM, not file by file, which is simpler and safer.

## 4. Storage classes and lifecycle rules

| Class | Minimum storage time | Use for |
|---|---|---|
| **Standard** | none | Data read often: current lake data, staging |
| **Nearline** | 30 days | Read about once a month: last quarter's raw files |
| **Coldline** | 90 days | Read about once a quarter: older backups |
| **Archive** | 365 days | Kept for compliance, rarely read |

Colder classes cost less to store and more to read, and charge for the minimum time even if you delete early. Check the pricing page for today's rates.

A **lifecycle rule** moves or deletes objects automatically by age. Follow one raw sales file through a typical rule:

<div class="steps">
<div class="step"><b>Day 0.</b> <code>bronze/pos/sales/dt=2026-11-04/store=214.parquet</code> lands in <b>Standard</b>. Tonight's job and this week's analysts read it often.</div>
<div class="step"><b>Day 30.</b> The rule "age &gt; 30 days → Nearline" moves it. Nobody notices: the name and path are the same, and it is still readable at any time. Storage cost roughly halves.</div>
<div class="step"><b>Day 365.</b> "Age &gt; 365 days → Archive". Storage is now a small fraction of Standard. Reading it costs more, which is fine for an audit once a year.</div>
<div class="step"><b>Year 7.</b> "Age &gt; 2,555 days → delete". The retention period your privacy and legal teams set has passed, so keeping it would be a risk, not an asset.</div>
</div>

As a JSON policy, applied with `gcloud storage buckets update gs://YOURNAME-retail-lake --lifecycle-file=rules.json`:

```json
{ "rule": [
  { "action": { "type": "SetStorageClass", "storageClass": "NEARLINE" }, "condition": { "age": 30, "matchesPrefix": ["bronze/"] } },
  { "action": { "type": "SetStorageClass", "storageClass": "ARCHIVE" },  "condition": { "age": 365, "matchesPrefix": ["bronze/"] } },
  { "action": { "type": "Delete" }, "condition": { "age": 2555, "matchesPrefix": ["bronze/"] } }
] }
```

**Autoclass** is an alternative that moves objects between classes for you, based on how often they are read.

<div class="problem" data-problem="gcs-data-lake-lifecycle"></div>

## 5. A lake layout that stays tidy

The **medallion** pattern names three layers, like a kitchen's delivery bay, prep station and serving counter:

- **Bronze (raw):** exactly what arrived, never edited, with the arrival time. `bronze/<source>/<entity>/dt=YYYY-MM-DD/`
- **Silver (clean):** typed, de-duplicated, conformed tables, usually Parquet or Iceberg. `silver/<entity>/dt=.../`
- **Gold (business):** aggregates and marts for BI and ML. Often lives in BigQuery instead.

Rules that save pain later:

1. **Partition by the column people filter on,** usually the event date, in `key=value` style. A query for one day then reads one folder.
2. **Separate buckets by environment** (`-dev`, `-prod`) and by sensitivity (a locked bucket for personal data).
3. **Never overwrite bronze.** It is your proof of what you received, and your way to rebuild silver after a bug.
4. **Avoid millions of tiny objects.** Batch small events into files of 100 MB or more (Lesson 2.3).

BigQuery can query lake files without loading them (**external tables**), and through **BigLake** it can read open **Iceberg** tables with fine-grained security. That is the lakehouse idea from Lesson 1.2: one copy of the data, many engines. [Pipeline to Dashboard](/learn/courses/etl/landing-files/) shows the same landing discipline on a single machine.

<div class="meaning">

<dl>
<dt>Bucket</dt><dd>A named container of objects in one location.</dd>
<dt>Object</dt><dd>One file's bytes plus metadata, found only by its full name.</dd>
<dt>Storage class</dt><dd>A price tier: cheaper to keep means dearer to read, with a minimum storage time.</dd>
<dt>Lifecycle rule</dt><dd>An automatic "move or delete after N days" for objects that match a prefix.</dd>
<dt>Bronze / silver / gold</dt><dd>Raw as received / clean and typed / business-ready.</dd>
<dt>Physical meaning</dt><dd>A grocery chain landing 100 GB a day piles up 36 TB a year. Without lifecycle rules the whole pile sits in the most expensive class forever; with them, most of it quietly moves to cheap shelves and old copies disappear on the date the law allows.</dd>
</dl>

</div>

<div class="myth">

**"Storage is cheap, so the lake's cost doesn't matter."** Storing bytes is cheap; **moving** and **touching** them is not. Egress (copying data out of a region or out of Google), millions of list and read operations on tiny files, and early deletion from cold classes all cost money. Keep compute in the same region as the bucket and compact small files.

</div>

## 6. Practice

Design the bucket and path layout for a grocery chain with: till sales (daily files per store), app events (JSON, every minute), loyalty members (a nightly full extract with personal data) and supplier invoices (PDFs). Say which storage class and lifecycle rule each gets.

<details>
<summary>One good layout, and what to check</summary>

- `gs://grocer-lake-prod/bronze/pos/sales/dt=.../store=.../` (Standard, then Nearline after 30 days)
- `gs://grocer-lake-prod/bronze/app/events/dt=.../hr=.../` (events batched into files of about 200 MB)
- `gs://grocer-pii-prod/bronze/loyalty/members/dt=.../` (a separate bucket with restricted IAM; delete raw extracts after the retention period the privacy team sets)
- `gs://grocer-docs-prod/invoices/yyyy=.../mm=.../` (Coldline after 90 days, Archive after a year)
- Silver as Iceberg tables under `gs://grocer-lake-prod/silver/`.

What to check: personal data sits in its own bucket, every path has a date partition, and every bronze prefix has a delete rule.
</details>

**New words:** *object storage*, *bucket*, *object*, *storage class*, *lifecycle rule*, *Autoclass*, *medallion*, *bronze*, *silver*, *gold*, *external table*, *BigLake*, *egress*.

<div class="keypoints">

- Cloud Storage is flat: objects in buckets, and "folders" are just parts of names.
- Storage classes trade cheaper storage for dearer reads and a minimum storage time; lifecycle rules move and delete by age.
- Lay the lake out in bronze, silver and gold, with key=value date partitions in every path.
- Never overwrite bronze, keep personal data in its own bucket, and avoid millions of tiny files.
- Storing is cheap; egress, operations and early deletes are where lake bills surprise people.

</div>
