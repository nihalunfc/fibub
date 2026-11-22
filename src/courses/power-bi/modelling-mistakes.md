---
title: Common modelling mistakes and how to fix them
seoTitle: 'Power BI data modelling mistakes and fixes'
summary: Seven model problems that cause wrong numbers or slow reports, how to spot each one, and the fix, from duplicate keys and bidirectional filters to mixed grains and missing date tables.
minutes: 15
updated: 2026-11-22
quiz:
  - q: Totals are too high after adding a product list. What is the first thing to check?
    choices: ['The font', 'Duplicate keys in the product table', 'The colour theme']
    ans: 1
    why: Duplicate keys turn the relationship many-to-many and can multiply rows in merges. Check that each key is unique on the one side.
  - q: Monthly targets are joined to every day in a month. What goes wrong?
    choices: ['Nothing', 'Each month''s target is counted once per day, so it is about 30 times too big', 'Targets become negative']
    ans: 1
    why: Mixing grains repeats the coarser value. Keep targets at month grain and compare at month level (Lesson 6.4).
  - q: Which is usually the better fix for "products sold in a store"?
    choices: ['Make every relationship bidirectional', 'A measure that counts in the fact table, e.g. DISTINCTCOUNT(Sales[ProductKey])', 'Copy Store into Product']
    ans: 1
    why: Counting in the fact table answers the question without changing how filters flow for every other measure.
---

**Module 3 · about 15 minutes · read first: 3.2.** You'll be able to diagnose the most common model problems from their symptoms.

## 1. Why this matters

When a number is wrong, the cause is usually in the model, not the DAX. Spotting these patterns quickly is what makes a BI developer trusted.

## 2. Seven mistakes

| Symptom | Likely cause | Fix |
|---|---|---|
| A slicer doesn't change a visual | Missing or inactive relationship | Create it in Model view; check the key columns' types match (text vs number) |
| Totals far too high | Duplicate keys on the one side, or a merge that multiplied rows | Remove duplicates on the key in Power Query; compare row counts |
| Targets about 30× too big | A monthly table related to daily dates (mixed grain) | Relate at the right grain, or compare at month level with TREATAS (Lesson 6.4) |
| Same visual shows blank category "(Blank)" | Fact rows whose key isn't in the dimension | Left anti merge to list them; add the missing rows to the dimension or fix the key |
| Odd numbers when two slicers interact | Several bidirectional relationships, ambiguous paths | Set single direction; use DISTINCTCOUNT on the fact table, or CROSSFILTER in one measure |
| Year-to-date or last year wrong | No proper date table, or using Sales[Date] on visuals | Build and mark a date table (Lesson 3.3); use its columns everywhere |
| Huge file, slow refresh | Unused columns, high-cardinality text (IDs, timestamps), many calculated columns, auto date/time | Remove columns, split date and time, move columns to Power Query, turn off auto date/time |

Try it: make the big store bigger and see the two ways of combining margins drift apart.

<figure class="fig" data-fig="@biz-ratio-of-sums"><figcaption>Notice that the real margin is a ratio of totals, not an average of percentages.</figcaption></figure>

## 3. See the blank-category problem

`(Blank)` appearing in a visual is the engine telling you some fact rows have no matching dimension row. It adds a blank row to the dimension so the totals still add up. Never ignore it: it's a data quality issue to report.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** every wrong total breaks one of three promises: keys are unique on the one side, each table has one grain, and filters have one path. Check those three first.

**Try it:** match each fix in the table above to the promise it restores.
</details>

## 4. Worked example

*"Our Region total for West is lower than the three West stores added up."* Check: the Store table has Harbour Front twice, once as "West" and once with a typo "Wset". Store's key is still unique (two different keys), but some Sales rows point to the typo row, so they show under "Wset". Fix the region in the source (or Power Query: replace values), and the totals reconcile. Lesson: always compare a total with the sum of its parts.

## 5. Practice

1. A relationship won't create; Power BI says the columns have different data types. What do you do?
2. A model has 40 calculated columns on a 10-million-row fact table and the file is 2 GB. Name two fixes.
3. Why is a timestamp column (date and time to the second) bad for compression?

<details>
<summary>Answers</summary>

1. Make both key columns the same type in Power Query (usually whole number or text).
2. Turn columns that only feed measures into measures (SUMX); move the rest to Power Query or the source; remove unused ones.
3. Almost every value is different (high cardinality), so the engine can't compress it. Split it into a Date column and a Time column (or drop the time).
</details>
