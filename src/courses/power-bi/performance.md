---
title: 'Faster reports: Performance Analyzer and model size'
seoTitle: 'Speed up Power BI: Performance Analyzer and model tips'
summary: Find what makes a report slow with Performance Analyzer, then fix it in the right place, usually the model, sometimes the DAX, sometimes the number of visuals.
minutes: 16
updated: 2026-11-22
quiz:
  - q: What does Performance Analyzer show for each visual?
    choices: ['Its colour', 'Time spent in the DAX query, the visual display and other work, and the query itself', 'The data source password']
    ans: 1
    why: It splits each visual's time into DAX query, visual display and other, and lets you copy the DAX query to test it.
  - q: Which change usually shrinks a model the most?
    choices: ['Renaming tables', 'Removing unused columns, especially high-cardinality ones like IDs and timestamps', 'Changing the theme']
    ans: 1
    why: The engine compresses columns; columns with millions of different values compress badly and take most of the space.
  - q: Why is calling a measure inside SUMX over a big fact table slow?
    choices: ['It is not', 'Each row triggers context transition, building a new filter context for every row', 'SUMX is always slow']
    ans: 1
    why: Context transition per row of a large table is expensive. Iterate a smaller table or use plain column arithmetic.
---

**Module 8 · about 16 minutes · read first: 5.5.** You'll be able to find and fix the usual causes of slow reports.

## 1. Why this matters

A report that takes ten seconds per click doesn't get used. Performance questions come up in BI interviews ("how would you speed up a slow report?") and in the job every week.

## 2. Find the slow part

**Optimize > Performance analyzer > Start recording**, then refresh visuals. Each visual shows:

- **DAX query:** time the engine took. Long means the model or the measure.
- **Visual display:** time to draw. Long means too many points or a heavy custom visual.
- **Other:** waiting for other visuals. Long means too many visuals on the page.

Copy the query and run it in DAX query view to test changes.

## 3. Fix it in the right place

**Model (biggest wins)**

1. Remove columns nobody uses. Split date-time into date and time, round decimals you don't need.
2. Star schema with integer keys; no huge flat tables; no bidirectional relationships unless needed.
3. Turn off auto date/time.
4. Move calculated columns to Power Query or the source.
5. For very large data, aggregations or a summary table, or DirectQuery for live data (with a cost in speed).

**DAX**

<!--fig:dax-pad perf-iterate-->

- Avoid measures inside iterators over the fact table; iterate dimensions instead.
- Use variables to avoid computing the same thing twice.
- Prefer column filters (`Product[Category] = "Home"`) to `FILTER(Table, …)` in CALCULATE.
- DIVIDE rather than IF tests for zero.

**Report**

- Fewer visuals per page (each runs at least one query); cards with several values instead of six cards.
- Limit table visuals to what people read; use drill through for detail.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** Power BI's VertiPaq engine stores each column compressed, with a dictionary of distinct values. Size and speed depend mostly on **cardinality** (the number of distinct values) and the number of rows. A column of 10 million unique transaction IDs can be bigger than all other columns together.

**Tool:** the free DAX Studio and its VertiPaq Analyzer show the size of every column, which tells you exactly what to remove first.
</details>

## 4. Worked example

*A 900 MB model refreshes in 40 minutes.* VertiPaq Analyzer shows a `TransactionID` column (12 million distinct values) taking 380 MB and a `Timestamp` column 250 MB. Neither is used in any visual or measure. Remove TransactionID, split Timestamp into Date (relates to the Date table) and Hour. The model drops to 210 MB and refresh to 9 minutes, without changing a single report page.

## 5. Practice

1. Performance Analyzer shows a table visual with 2 s DAX query and 6 s visual display. Where do you look?
2. Why is a GUID key slower than an integer key?
3. Name two DAX habits that make measures faster.

<details>
<summary>Answers</summary>

1. The visual: it is drawing too many rows or columns. Reduce what it shows or page it with drill through.
2. It's a long text with very high cardinality, so it compresses badly and joins are slower.
3. Variables for repeated expressions; iterate small tables instead of the fact table; column filters instead of FILTER(Table).
</details>
