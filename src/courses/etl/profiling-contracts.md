---
title: Profiling and data contracts
summary: 'Ask the data questions before cleaning: grain, key, types, nulls and ranges. Then write the answers as a contract in code that checks every load.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: count(*) is 10,000 and count(distinct order_id) is 4,100. What does that tell you?
    choices: ['There are 5,900 duplicate rows', 'order_id alone is not the key; rows are order lines, several per order', 'The file is corrupt']
    ans: 1
    why: It is a grain question first, not a duplicates question. Each order has several lines.
  - q: A new column appears in the vendor's file. Your contract has strict = True. What happens?
    choices: ['Validation fails, so you find out before anything downstream changes', 'The column is silently dropped', 'Nothing; strict only checks types']
    ans: 0
    why: Strict mode is your alarm for schema drift.
  - q: Three rows out of 40,000 have an impossible date. What is the best default?
    choices: ['Fail the whole load', 'Quarantine those rows, load the rest, and report the count', 'Replace the dates with today']
    ans: 1
    why: Row-level problems should not stop 39,997 good rows reaching the report, but they must be visible.
sources:
  - 'pandera documentation (data validation for pandas and Polars) https://pandera.readthedocs.io/'
  - 'DuckDB documentation: SUMMARIZE https://duckdb.org/docs/'
  - 'Codd, E. F. (1970), A Relational Model of Data for Large Shared Data Banks, Communications of the ACM 13(6), 377-387 https://doi.org/10.1145/362384.362685'
---

**Module 2 · about 35 minutes · read first: Module 1.** You'll be able to profile a new source with a checklist and DuckDB, state its grain and key and test them, write a data contract in Python with pandera, and decide what each kind of violation should do.

<div class="bigidea">Profiling is interviewing the data before you hire it; a contract is the written job description, checked every morning, so when the data changes its habits you hear about it at once.</div>

## 1. Why this matters

Beginners start cleaning by writing code. Experienced people start by **asking the data questions** and writing the answers down as rules. Those rules become a **contract**: what the source promises (columns, types, keys, ranges), checked on every load. When a vendor changes a column at 3 a.m., the contract fails loudly instead of the finance director's dashboard failing quietly.

Think of a new supplier for a restaurant. Before the first order, you agree what "a case of tomatoes" means: how many, what size, delivered by when. Every delivery is then checked against that agreement. Profiling is the first tasting; the contract is the agreement.

## 2. The profiling checklist

For every new source, answer these in `docs/profiles/<source>.md` before writing any transform:

1. **Grain:** what is one row? One order line? One order? One item per order with a quantity?
2. **Candidate key:** which columns are unique together? Test it: `count(*) = count(distinct key)`.
3. **Types:** what each column *should* be, against how it arrived (dates as text, numbers with commas).
4. **Nulls and blanks:** per column, and whether empty means "unknown", "none" or "does not apply".
5. **Ranges and domains:** smallest and largest numbers and dates; the list of values for categories.
6. **Volume:** rows per file and per day, and the normal range.
7. **Relationships:** does every `menu_item_id` exist in the menu table? Rows that point to nothing are **orphans**.
8. **Time:** which time stamp, in which time zone, and the business date rule.

DuckDB answers most of these straight from the files:

```sql
-- in the duckdb command line, or duckdb.sql(...) in Python
summarize select * from read_csv('data/landing/shared_drive/qsr/*/pos_*.csv', union_by_name=true, filename=true);

select count(*) as n_rows, count(distinct (order_id, menu_item_id)) as n_keys
from read_csv('data/landing/shared_drive/qsr/*/pos_*.csv');

-- orphans: till lines whose item is not on the menu
select p.menu_item_id
from read_csv('data/landing/shared_drive/qsr/*/pos_*.csv') p
anti join read_csv('data/reference/menu.csv') m using (menu_item_id);
```

Watch a key test on one small order:

<div class="steps">
<div class="step"><b>The rows.</b> Order 7001 has four lines: Classic Burger, Fries, Classic Burger, Shake. You guess the key is (order_id, menu_item_id).</div>
<div class="step"><b>Count.</b> <code>count(*)</code> = 4, but <code>count(distinct (order_id, menu_item_id))</code> = 3. One row is "extra".</div>
<div class="step"><b>Look before deleting.</b> The two burger lines are not copies: the customer ordered two burgers on separate lines. It is a genuine repeat, not a duplicate.</div>
<div class="step"><b>Fix the key, not the data.</b> The grain is "one line of an order", so the key needs a line number: (order_id, line_no). With it, 4 rows and 4 distinct keys. The guess was wrong; the data was right.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a key is a set of columns that picks out exactly one row: no two rows share a key value.

**Equation:** key `$K$` is valid exactly when

```math
|T| = |\pi_K(T)|
```

the number of rows equals the number of distinct values of `$K$` (written `$\pi_K$`, "project onto `$K$`"). The extra rows are `$|T| - |\pi_K(T)|$`.

**Analogy:** a house number on a street: each number should lead to one door. Where it breaks: if the tills write one row per *item* with no line number, (order_id, menu_item_id) is not unique when someone orders two separate burgers. Profiling tells you whether you need a line number.

**Try it:** 10,000 rows and 9,640 distinct (order_id, menu_item_id). How many rows are extra? *(360. Now find out how many are true copies and how many are genuine repeats.)*
</details>

<div class="problem" data-problem="profiling-contracts-repeats"></div>

## 3. Contracts as code

A contract lives next to the code and runs on every load. **pandera** is a Python library for this that works with pandas and Polars:

```python
import pandera.polars as pa
import polars as pl

class PosOrderLine(pa.DataFrameModel):
    restaurant_id: str = pa.Field(str_matches=r"^Q\d{3}$")
    order_id: str = pa.Field(nullable=False)
    order_ts: pl.Datetime = pa.Field(nullable=False)
    channel: str = pa.Field(isin=["counter", "drive_thru", "app", "delivery"])
    menu_item_id: str
    qty: int = pa.Field(ge=1, le=50)
    price: float = pa.Field(gt=0, lt=100)

    class Config:
        strict = True          # unexpected columns fail: catches schema drift
        coerce = True          # try to convert types before checking

PosOrderLine.validate(df, lazy=True)   # lazy=True collects every failure, not just the first
```

Check the column names against your own profile; the generated data may differ. pandera's API moves between versions, so check its docs if a field option is refused.

## 4. What should a violation do?

| Severity | Example | Action |
|---|---|---|
| **Blocker** | A required column is missing; the wrong file entirely | Fail the load, alert, keep yesterday's tables |
| **Row-level** | A bad date in 3 rows; an unknown menu item | Quarantine those rows, load the rest, report the counts |
| **Warning** | Volume 40% below normal; a new category value | Load, flag it on the data quality report, check tomorrow |

Teams usually go wrong in one of two directions: fail on everything (reports never arrive) or warn on everything (nobody reads warnings). Write this table down for each source.

<div class="meaning">

<dl>
<dt>Profile</dt><dd>A written description of a source: grain, key, types, nulls, ranges, volume, relationships and time rules.</dd>
<dt>Grain</dt><dd>What one row means.</dd>
<dt>Candidate key</dt><dd>Columns that should be unique together. Tested by comparing row count with distinct count.</dd>
<dt>Contract</dt><dd>The source's promises written as code and checked on every load.</dd>
<dt>Schema drift</dt><dd>A source changing its columns or types without warning.</dd>
<dt>Physical meaning</dt><dd>A contract is a conversation tool. Send the source team your profile and contract and ask "is this what you intend?". You will learn things no data shows: "prices include tax in our Quebec stores", "the app channel includes third-party delivery from March". Write those answers into the contract as comments. That is how experienced people know things beginners do not: they asked.</dd>
</dl>

</div>

<div class="myth">

**"More rows than distinct keys means duplicates, so delete the extras."** First ask whether your key matches the grain. Extra rows can be genuine repeats (two burgers on two lines), new versions of a record, or true copies. Only the last kind should be deleted, and Lesson 2.5 shows how to tell them apart.

</div>

## 5. Try it

1. `pip install polars duckdb "pandera[polars]"`. Profile the restaurant till files with the checklist and DuckDB, and write `docs/profiles/qsr_pos.md`.
2. Find and record: the grain, a key that works, the `00/00/0000` dates, the re-sent batches, the `item_note` column, and the encoding problem in one brand's files (look for `Jalape?o`).
3. Write `contracts/qsr_pos.py` with the pandera model. Validate one clean file (it passes) and one with bad dates (it fails with a readable report).
4. Write the severity table for the till source in the profile document.
5. Ask an AI assistant to profile the hotel booking files with the same checklist. Compare its answers with yours and note anything it got wrong or missed. This is practice in reviewing AI output.

Start a new repository, `qsr-clean`, and commit: `docs: profile and contract for QSR POS`.

**What to check:** your profile names a key that passes the `count(*) = count(distinct ...)` test once the true copies are set aside, and your contract fails on a file with an extra column you add by hand.

## 6. Practice

1. A column `discount` is empty in 98% of rows. What question do you ask the source team?
2. Why test the key on all files together and not one file at a time?
3. Classify each problem as blocker, row-level or warning: (a) the file has no `price` column; (b) 12 rows have `qty = 0`; (c) today's row count is half of last Tuesday's.

<details>
<summary>Answers</summary>

1. Does empty mean "no discount" (0), "unknown" or "not recorded at this restaurant"? The answer decides whether you fill it with 0 or keep it empty.
2. Keys can collide across files: the same order_id might appear in two restaurants' files, or a re-sent batch lands in a second file. Test at the level you will store.
3. (a) blocker; (b) row-level, quarantine; (c) warning, unless it drops to near zero, which you might make a blocker.
</details>

**New words:** *profile*, *grain*, *candidate key*, *orphan*, *contract*, *schema drift*, *strict mode*, *severity*.

<div class="keypoints">

- Profile before you transform: grain, key, types, nulls, ranges, volume, relationships and time.
- Test a key with `count(*) = count(distinct key)`; when it fails, check the grain before deleting anything.
- Write the contract as code (pandera) with strict mode, and run it on every load.
- Decide per source what a violation does: fail, quarantine or warn.

</div>
