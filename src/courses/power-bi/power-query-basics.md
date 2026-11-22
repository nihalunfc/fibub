---
title: 'Power Query: applied steps you can replay'
seoTitle: 'Power Query basics: applied steps explained'
summary: Power Query records every cleaning action as a step and replays the whole list on each refresh. See how steps work, why order matters, and how to keep queries tidy.
minutes: 14
updated: 2026-11-22
quiz:
  - q: What happens to your Power Query steps when next month's file arrives?
    choices: ['You redo them by hand', 'Power Query replays every step on the new data when you refresh', 'They are deleted']
    ans: 1
    why: Steps are a recipe, not a one-off edit. Refresh runs the recipe again, which is why Power Query saves so much time.
  - q: Why remove unneeded columns early in the step list?
    choices: ['It looks nicer', 'Later steps and the model handle less data, so refresh is faster and the file smaller', 'Power Query requires it']
    ans: 1
    why: Every column you keep is loaded, compressed and stored. Dropping it early also lets some sources (like SQL) skip sending it at all (query folding).
  - q: You delete a step in the middle and later steps break. Why?
    choices: ['Steps are random', 'Each step works on the result of the step before it, so a later step may refer to a column the deleted step created', 'Power Query has a bug']
    ans: 1
    why: Steps form a chain. If step 5 renamed a column that step 7 uses, deleting step 5 leaves step 7 looking for a name that no longer exists.
---

**Module 2 · about 14 minutes · read first: 1.4.** You'll be able to open Power Query, read the Applied steps list and explain why it beats cleaning by hand.

## 1. Why this matters

Real data arrives messy: extra header rows, totals mixed into the data, text where numbers should be, the same store spelled three ways. Analysts who clean in Excel by hand redo it every month and make different mistakes each time. Power Query records the cleaning once and repeats it exactly, forever. Interviewers often hand you a messy file to see if you reach for Power Query.

## 2. The idea in one picture

Click through the steps. Each one changes the table a little; the highlighted cells show what it changed, and the M line under the table is the code Power BI wrote for you.

<!--fig:pq-steps clean-->

## 3. How Power Query works

- **Home > Transform data** opens the Power Query Editor. On the left are your **queries** (one per table). In the middle, a preview of the data. On the right, **Applied steps**.
- Every button you press (Remove rows, Change type, Split column…) adds a step. Click any step to see the table as it was at that point.
- Steps are stored as **M code** (Lesson 2.5). You rarely need to type M, but reading it helps.
- **Close & Apply** loads the result into the model. The source file is never changed.
- On **Refresh**, Power BI fetches the source again and replays all steps.

## 4. Good habits

1. **Rename steps** to say why (right-click > Rename): "Removed till TOTAL row" beats "Filtered Rows1".
2. **Remove columns early**, and filter rows early, so later steps do less work.
3. **Set data types once, near the end** of cleaning, and check them. Wrong types are the most common cause of broken refreshes.
4. **Avoid hard-coded positions** like "keep the first 1,000 rows" or "remove the top 3 rows" when the file can change; filter on a value instead.
5. **Reference, don't duplicate:** right-click a query > Reference to build on it, so one fix flows into every query that uses it.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** a query is a pipeline of pure steps: each step takes the previous table and returns a new one, and nothing changes the source. That makes it repeatable, which is what "automated reporting" means in job ads.

**Analogy:** a recipe card rather than a cooked dish. You can cook it again tomorrow with fresh ingredients and get the same result.

**Try it:** in the simulation, which step must come before "Changed type" for the Qty column to become numbers without errors? (The TOTAL and blank rows don't break it, but the header row would: Promoted headers must come first.)
</details>

## 5. Worked example

*A till export arrives each Monday.* The steps above handle it: promote headers, trim and capitalise store names, drop blank rows, drop the till's TOTAL row, fix types, split "Desk lamp - Large" into product and size, add Amount. Next Monday the analyst drops the new file in the same folder and presses Refresh. Ten seconds, same cleaning, no mistakes.

## 6. Practice

1. Why is the TOTAL row dangerous if it stays in the data?
2. A colleague's query has a step "Kept First Rows (500)". What could go wrong next month?
3. What does Close & Apply do?

<details>
<summary>Answers</summary>

1. Every sum would count the sales twice: once in the lines and once in the total.
2. If the file grows past 500 rows, the extra rows are silently dropped.
3. Runs the steps and loads the result into the model; the report then uses it.
</details>

Next, Lesson 2.2 goes through the cleaning steps one by one. For a quick look at a messy CSV outside Power BI, the [[csv-profiler]] shows blanks, types and odd values in your browser.
