---
title: Elasticsearch, and choosing a store
summary: 'Inverted indexes, analysers, relevance, shards and the ELK stack; then a decision table for picking the right store, and the Module 4 mini project.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: An inverted index maps...
    choices: ['Rows to columns', 'Each word to the list of documents that contain it', 'Dates to partitions']
    ans: 1
    why: Like the index at the back of a book, look up a word and get the pages. That is why text search is fast.
  - q: OpenSearch is...
    choices: ['A Google product', 'An open-source fork of Elasticsearch and Kibana started in 2021, led by AWS', 'A type of Kafka topic']
    ans: 1
    why: After Elastic changed its licence in 2021, AWS forked the last open-source version as OpenSearch. Elastic later added an open-source licence option again.
  - q: Product search must handle typos and rank results by relevance. Which store fits?
    choices: ['Bigtable', 'Elasticsearch or OpenSearch', 'Druid']
    ans: 1
    why: Search engines provide analysers, fuzzy matching and relevance scoring. The others are not built for it.
sources:
  - 'Elastic documentation: Elasticsearch guide https://www.elastic.co/guide/index.html'
  - 'OpenSearch documentation https://opensearch.org/docs/latest/'
  - 'Manning, C. D., Raghavan, P. and Schütze, H. (2008), Introduction to Information Retrieval, Cambridge University Press, Chapters 1 and 6 https://nlp.stanford.edu/IR-book/'
  - 'Robertson, S. and Zaragoza, H. (2009), The Probabilistic Relevance Framework: BM25 and Beyond, Foundations and Trends in Information Retrieval 3(4)'
---

**Module 4 · about 30 minutes · read first: [4.1](/learn/courses/data-at-scale/database-zoo/).** You'll be able to explain how an inverted index makes text search fast, describe indexes, documents, mappings, shards and replicas, and choose between BigQuery, Druid, Bigtable, Elasticsearch, Redis and Postgres for a requirement.

<div class="bigidea">A search engine reads every document once, in advance, and builds a book-style index from each word to the documents that contain it, so a search becomes a quick lookup instead of reading everything.</div>

## 1. What Elasticsearch is

**Elasticsearch** is a distributed search and analytics engine built on the **Apache Lucene** library. You send it JSON documents; it indexes every field so you can search text, filter, sort and count in milliseconds. It powers site search, log analytics and security monitoring. **OpenSearch** is the open-source fork, and **Apache Solr** is an older Lucene-based sibling.

To find "Kafka" in a 900-page book you don't read every page; you look in the index at the back, which lists the pages. An **inverted index** is that, for every word in every document. Elasticsearch also "cooks" the words first (lower-casing, dropping "the", turning "running" into "run"), so "Running Shoes" finds "run shoe".

## 2. Watch an index being built

Three products go into a tiny index: doc 1 "Blue Rain Jacket", doc 2 "Rain Boots for Kids", doc 3 "Blue Running Shoes".

<div class="steps">
<div class="step"><b>Analyse.</b> Each title is split into words and cooked: lower-case, plurals and "-ing" trimmed. Doc 1 → blue, rain, jacket. Doc 2 → rain, boot, kid (and "for" is dropped). Doc 3 → blue, run, shoe.</div>
<div class="step"><b>Build the index.</b> Each word points to the documents that hold it: blue → 1, 3 · rain → 1, 2 · jacket → 1 · boot → 2 · kid → 2 · run → 3 · shoe → 3.</div>
<div class="step"><b>Search "rain jaket".</b> The query is cooked the same way. "rain" is found directly → docs 1 and 2. "jaket" is not in the index, but fuzzy matching allows one wrong letter, so it matches "jacket" → doc 1.</div>
<div class="step"><b>Score and rank.</b> Doc 1 matches both words; doc 2 only one. The relevance score (BM25 by default) puts doc 1 first. Rare words like "jacket" count more than common ones like "rain".</div>
<div class="step"><b>Filter and count.</b> Filters (size M, price ≤ 80) are exact yes/no checks on keyword and number fields, and counts by brand for the side panel come from the same index. All of this takes milliseconds, even on millions of products.</div>
</div>

## 3. Core ideas

- **Index:** a collection of documents (like a table). **Document:** one JSON object. **Mapping:** field types: `text` for full-text search, `keyword` for exact filters and counts, numbers, dates, and `dense_vector` for embeddings.
- **Analysers:** split and normalise text; language analysers, synonyms ("tee" = "t-shirt"), and n-grams for search-as-you-type.
- **Relevance:** results are scored (BM25 by default); you can boost fields (title over description) and business signals (popularity, stock).
- **Shards and replicas:** an index is split into **primary shards** spread over nodes, each with **replica** copies for safety and extra read capacity.
- **Near real-time:** new documents become searchable after a short refresh, about a second by default.

```json
GET products/_search
{
  "query": { "bool": {
    "must":   { "match": { "name": { "query": "rain jaket", "fuzziness": "AUTO" } } },
    "filter": [ { "term": { "size": "M" } }, { "range": { "price": { "lte": 80 } } } ] } },
  "aggs": { "by_brand": { "terms": { "field": "brand" } } }
}
```

That finds "rain jacket" despite the typo, filters by size and price, and returns brand counts for the side panel (often called facets).

How many shards? Too few and each one grows huge and slow to move or recover; too many and the cluster wastes memory managing them. Elastic's sizing guidance suggests shards of tens of GB each; check the current docs for your version.

<div class="problem" data-problem="elasticsearch-shards"></div>

## 4. The ELK stack and logs

**Elasticsearch, Logstash and Kibana** (plus small **Beats** shippers) became the standard for central logs: every server sends its logs, Elasticsearch indexes them, Kibana searches and charts them. Data platforms use it to search pipeline logs and errors; security teams use it to spot attacks. Rivals include Splunk, Datadog, Grafana Loki and Google Cloud Logging.

It is **not** a system of record: keep the source of truth elsewhere and rebuild the index from it when needed. It is also not for heavy joins or big batch analytics. It now does **vector and hybrid search** for AI as well (Lesson 6.3).

## 5. Choosing a store: the decision table

| Requirement | First choice | Why |
|---|---|---|
| Analysts' ad hoc SQL over years of data | **BigQuery** (or Snowflake) | Scales, any question, pay per use |
| Live dashboards for thousands of outside users, seconds fresh | **Druid** or **Pinot** (ClickHouse if simpler running matters) | Low delay with many users, streaming ingestion |
| One key's data in milliseconds, huge volume | **Bigtable** (Cassandra, DynamoDB) | Fast key access, massive throughput |
| Text search, typos, facets, relevance | **Elasticsearch / OpenSearch** | Inverted index and relevance scoring |
| Tiny, hot data: sessions, rate limits, caches | **Redis / Memorystore** | In memory, microseconds |
| App transactions and modest analytics | **PostgreSQL / Cloud SQL / AlloyDB** | Transactions, SQL, joins, cheap at small scale |
| Global transactions at scale | **Spanner** | Strongly consistent, distributed SQL |

Most large platforms use **several**, all fed from the same lake or Kafka topics, each shaped for its own question.

<div class="meaning">

<dl>
<dt>Inverted index</dt><dd>A list from each word to the documents that contain it, like the index of a book.</dd>
<dt>Analyser</dt><dd>The steps that split and normalise text, used both when indexing and when searching.</dd>
<dt>Relevance score</dt><dd>How well a document matches; rare matched words count more.</dd>
<dt>Shard / replica</dt><dd>One slice of an index / a full copy of a slice on another node.</dd>
<dt>Facet</dt><dd>Counts by a field (brand, size) shown beside results to narrow a search.</dd>
<dt>Physical meaning</dt><dd>When a shopper types "rain jaket" on a retailer's site and still sees jackets, sorted with the in-stock ones first and brand counts on the side, an inverted index, an analyser, fuzzy matching and a relevance score have all run in a few milliseconds.</dd>
</dl>

</div>

<div class="myth">

**"Elasticsearch can be our main database, since it stores everything anyway."** It stores documents, but it is built for search, not as the system of record: it has no multi-document transactions, and mapping changes often mean rebuilding the index. Keep the truth in a database or the lake and treat the search index as a copy you can rebuild at any time.

</div>

## 6. Mini project for Module 4: three stores, one dataset

**Brief (3 hours, all local with Docker).**

1. Generate one day of synthetic ad events (campaign, placement, device, user, impressions, clicks, spend) and a product catalogue of 5,000 items.
2. **Analytical:** load the events into **ClickHouse** or **Druid** (both have single-container quick starts) and build an hourly campaign query that runs in under a second. Try it with and without rollup or a pre-aggregated table.
3. **Key-value:** load each user's "last 10 ads seen" into **Redis** (or the Bigtable emulator, `gcloud beta emulators bigtable start`) with a well-designed key.
4. **Search:** index the catalogue in **OpenSearch** or Elasticsearch and get a fuzzy query plus brand facets working.
5. README: one table comparing load time, query time and what each store **cannot** do.

Checklist for "done":

- [ ] One script loads all three stores from the same generated files.
- [ ] The hourly campaign query returns in under a second, with and without rollup timed.
- [ ] A user's last 10 ads come back with one key lookup.
- [ ] "rain jaket" finds the rain jackets in the catalogue.

**Acceptance checks:** totals from the analytical store match a plain count over the raw file; the README names one question each store refuses.

**New words:** *Lucene*, *inverted index*, *analyser*, *document*, *mapping*, *keyword field*, *relevance*, *BM25*, *fuzziness*, *facet*, *shard*, *replica*, *refresh interval*, *ELK stack*, *OpenSearch*.

<div class="keypoints">

- An inverted index maps each word to the documents containing it, which makes text search a lookup.
- Analysers cook text the same way at index and search time; fuzziness forgives typos; BM25 ranks results.
- Indexes are split into primary shards with replicas; total shards = primaries × (1 + replicas).
- Elasticsearch is a search copy, not the system of record: keep the truth elsewhere and rebuild when needed.
- Choose stores by question: BigQuery for ad hoc SQL, Druid for live dashboards, Bigtable for key lookups, Elasticsearch for search, Redis for tiny hot data, Postgres for transactions.

</div>
