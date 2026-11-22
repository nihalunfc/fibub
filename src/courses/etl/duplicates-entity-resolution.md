---
title: Duplicates, keys and entity resolution
summary: 'Tell copies, new versions and genuine repeats apart, keep the latest version with row_number(), and match messy names with a reviewed mapping table.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: A booking_id appears in three files with statuses confirmed, confirmed, cancelled. What does staging keep?
    choices: ['All three rows', 'The first row', 'The latest version (cancelled), with the history kept in raw']
    ans: 2
    why: It is a change feed. Latest wins in staging; the history stays in raw (and in SCD2 tables in Module 5).
  - q: Why must a generated line number be deterministic?
    choices: ['For speed', 'So reruns give the same numbers and keys stay stable', 'Power BI requires it']
    ans: 1
    why: Keys that change between runs break incremental loads and joins.
  - q: 'Fuzzy matching gives "Store 110" a 92% match to store 101. What is the safe process?'
    choices: ['Accept any score above 90%', 'Treat scores as suggestions and confirm them into a mapping table that overrides the algorithm', 'Average the top three matches']
    ans: 1
    why: A high score can still be wrong on the one character that matters (110 against 101).
sources:
  - 'Fellegi, I. P. and Sunter, A. B. (1969), A Theory for Record Linkage, Journal of the American Statistical Association 64(328), 1183-1210 https://doi.org/10.1080/01621459.1969.10501049'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 3 (surrogate and natural keys)'
  - 'RapidFuzz documentation https://rapidfuzz.github.io/RapidFuzz/'
  - 'Splink documentation (probabilistic record linkage) https://moj-analytical-services.github.io/splink/'
---

**Module 2 · about 40 minutes · read first: 2.1, 2.2.** You'll be able to tell the three kinds of "duplicate" apart, keep the latest version of each record with a window function, create natural, surrogate and line-number keys deliberately, and match messy names across systems without trusting a score blindly.

<div class="bigidea">"Duplicate" means three different things (a photocopy, a newer edition, or a second copy someone really bought), and each needs its own fix; mix them up and you either double-count sales or delete real ones.</div>

## 1. Why this matters

Double-counted revenue is the bug that ends trust in a dashboard. Deleted real sales are just as bad, and harder to notice. Both come from treating every repeated-looking row the same way.

Think of a library. Two identical photocopies of the same page are a true duplicate: keep one. The second edition of a book replaces the first on the "current" shelf, while the first stays in the archive. And two copies of a bestseller on the shelf are not duplicates at all: two readers can borrow them.

## 2. Three kinds of "duplicate"

| Kind | Example | Fix |
|---|---|---|
| **Exact re-send** | The till re-sent a batch; every column is identical | `distinct` on all business columns (keep the file lineage in raw) |
| **New version** | Hotel booking 512004 appears again with `status = cancelled` | Keep the latest version per business key |
| **Genuine repeat** | Two separate Classic Burgers on one order | Not a duplicate. It needs a line number, or a quantity |

Keeping the latest version is a job for a **window function**: a calculation over a group of rows that keeps every row. `row_number()` numbers the rows inside each group in the order you choose.

```sql
-- latest version per booking (DuckDB, Postgres and SQL Server all support this)
select * from (
  select *, row_number() over (partition by booking_id
                               order by file_received_at desc, src_row desc) as rn
  from raw_hotel_bookings
) where rn = 1;

-- DuckDB shortcut
select * from raw_hotel_bookings
qualify row_number() over (partition by booking_id order by file_received_at desc) = 1;
```

The `src_row desc` tie-breaker matters: if one file holds two versions of the same booking, the later row wins, and the result is the same on every run.

Watch seven rows become four bookings:

<div class="steps" data-fig="duplicates-entity-resolution-latest">
<div class="step"><b>The rows.</b> Three nightly files hold seven rows. Booking 512002 appears three times, 512001 twice.</div>
<div class="step"><b>Partition.</b> Group the rows by <code>booking_id</code> and sort each group newest file first.</div>
<div class="step"><b>Number.</b> <code>row_number()</code> gives 1 to the newest row in each group, 2 to the next, and so on.</div>
<div class="step"><b>Keep rn = 1.</b> Four bookings remain. 512002 is now cancelled, and 512001 has 3 nights (it was changed from 2). Summing all seven rows would have counted 17 nights; the truth is 6 confirmed nights.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** deduplication picks one representative from each group of rows that share a key.

**Equation:** say two rows are equivalent, `$r \sim r'$`, when `$K(r) = K(r')$`. The deduplicated table holds one row from each group, chosen by an order (latest received), so its size is

```math
|T/\!\sim| = |\pi_K(T)|
```

the number of distinct keys.

**Analogy:** simplifying fractions: 2/4, 3/6 and 1/2 are one group, represented by 1/2. Where it breaks: if `$K$` is too coarse (order_id alone for order lines), you merge rows that are not the same thing, which is how real sales disappear.

**Try it:** 1,000 booking rows, 880 distinct booking_ids. After keeping the latest per id, how many rows? *(880.)*
</details>

<div class="problem" data-problem="duplicates-entity-resolution-nights"></div>

## 3. Keys you create

- **Natural key:** comes from the business (`booking_id`, `store_code`, `sku`). It can change, clash between systems, or be reused.
- **Surrogate key:** made by you, meaningless and stable. In a warehouse it is an identity number, or a hash of the source plus the natural key: `md5(source || '|' || booking_id)`.
- **Line number:** when the source has none, create one deterministically: `row_number() over (partition by order_id order by src_row)`. Deterministic means a rerun gives exactly the same numbers.

## 4. Entity resolution: same thing, different names

"Store #104", "STORE 104 KING ST" and "St. 104 - King" can be the same store in three systems. **Entity resolution** is deciding which records describe the same real thing. The steps:

1. **Normalise:** case, punctuation, common abbreviations (`St.` to `Street`).
2. **Block:** compare only plausible pairs, for example names sharing a region or a number, so you do not compare every name with every other.
3. **Score:** a string similarity from 0 to 100.
4. **Decide** with a threshold, measuring precision and recall on a hand-labelled sample.
5. Keep a **manual mapping table** that overrides the algorithm.

```python
from rapidfuzz import process, fuzz
canon = stores["store_name"].tolist()
match, score, idx = process.extractOne("STORE 104 KING ST", canon, scorer=fuzz.token_sort_ratio)
```

For people (guest records across hotels, loyalty members) use a probabilistic matcher such as **Splink**, which learns how much each field (name, email, postcode) counts as evidence.

<div class="problem" data-problem="duplicates-entity-resolution-precision"></div>

<div class="meaning">

<dl>
<dt>Exact duplicate</dt><dd>A row identical in every business column to another: a re-send. Keep one.</dd>
<dt>Version</dt><dd>The same record again with changes. Keep the latest in staging, all of them in raw.</dd>
<dt>Window function</dt><dd>A calculation over a group of rows that keeps every row, such as <code>row_number()</code>.</dd>
<dt>Surrogate key</dt><dd>A meaningless, stable id you create, so keys never change when the business renames things.</dd>
<dt>Entity resolution</dt><dd>Deciding which records in different systems describe the same real store, product or person.</dd>
<dt>Physical meaning</dt><dd>The reviewed mapping table is the real deliverable: <code>map_store_alias(alias, store_code, confirmed_by, confirmed_on)</code>, kept in version control and winning over any score. Algorithms suggest; a person confirms. Matching people also raises privacy questions (in Canada, PIPEDA), so match only on fields you are allowed to use, and write down that you checked.</dd>
</dl>

</div>

<div class="myth">

**"SELECT DISTINCT removes the duplicates."** It removes only exact copies. It keeps every version of a booking (they differ in status) and it would wrongly merge two genuine burger lines if they have no line number. Decide which kind of duplicate you have before choosing the fix.

</div>

## 5. Try it

1. In `qsr-clean`, find the re-sent till batches: count rows identical on every business column. Remove them, and log how many per restaurant per day.
2. Check whether the till data has genuine repeat lines (the same item twice on one order). In the course data each order has one line, so you should find none. Write the check anyway, and add a deterministic `line_no` so the key survives if a real source has them.
3. Hotels: from all booking files, build `stg_bookings_latest` (latest per booking_id). Count how many bookings changed status at least once.
4. Make a messy alias list for the 12 grocery stores (ask an AI assistant for 40 variants with typos). Resolve them with RapidFuzz, choose a threshold, measure precision and recall against the truth, and write `map_store_alias.csv` for the misses.
5. Write a test for each rule.

Commit: `feat(clean): dedup rules, deterministic line numbers, store alias resolution`.

**What to check:** `stg_bookings_latest` has exactly one row per booking_id (`count(*) = count(distinct booking_id)`), and rows in = rows kept + exact copies removed for the till data.

## 6. Practice

1. Two rows are identical except `loaded_at`. Exact re-send or new version?
2. Why add `src_row` to the `order by` inside `row_number()`?
3. Your matcher has 97% precision and 60% recall. What does that mean in practice?

<details>
<summary>Answers</summary>

1. An exact re-send. `loaded_at` is your own metadata, not a business column, so leave it out when comparing.
2. As a tie-breaker. If two versions share a received time (same file), the result would otherwise change between runs. Deterministic order means stable output.
3. When it proposes a match it is almost always right, but it misses 40% of the true matches. Lower the threshold a little, or send the unmatched names to the manual mapping table.
</details>

**New words:** *exact duplicate*, *version*, *genuine repeat*, *window function*, *row_number*, *natural key*, *surrogate key*, *deterministic*, *entity resolution*, *blocking*, *precision*, *recall*.

<div class="keypoints">

- Three kinds of "duplicate": exact re-sends (keep one), versions (keep the latest) and genuine repeats (keep all, add a line number).
- Keep the latest version with `row_number() over (partition by key order by received desc)`, with a tie-breaker.
- Create surrogate keys and line numbers deterministically, so reruns give the same keys.
- Fuzzy scores are suggestions; a reviewed mapping table decides.

</div>
