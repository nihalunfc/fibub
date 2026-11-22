---
title: 'Merge and append: joining tables'
seoTitle: 'Merge vs append in Power Query: join kinds explained'
summary: Append stacks tables with the same columns on top of each other; merge joins tables side by side on a key. Try all six join kinds and see which rows survive each one.
minutes: 16
updated: 2026-11-22
quiz:
  - q: You have one CSV per month with the same columns. Which do you use to make one table?
    choices: ['Merge', 'Append (or a Folder source that appends them all)', 'Unpivot']
    ans: 1
    why: Same columns, more rows means append. Get data > Folder appends every file in a folder and picks up new months automatically.
  - q: Which join keeps every order line even when the product is missing from the product list?
    choices: ['Inner', 'Left outer (order lines on the left)', 'Right anti']
    ans: 1
    why: Left outer keeps every row of the left table and fills the right side's columns with null when there is no match.
  - q: After a merge, the table has more rows than before. What is the most likely cause?
    choices: ['Power Query added test rows', 'The key is not unique in the right table, so some left rows matched two or more right rows', 'Left outer always adds rows']
    ans: 1
    why: 'A left row is repeated once per matching right row. Duplicate keys in the lookup table multiply your sales: always check row counts after a merge.'
---

**Module 2 · about 16 minutes · read first: 2.2.** You'll be able to choose between append and merge, pick the right join kind and spot the classic row-count mistakes.

## 1. Why this matters

Data rarely arrives in one table. Monthly files need stacking; order lines need product details. Getting joins wrong silently loses or doubles sales, and "explain inner vs left join" is one of the most common interview questions for any data job.

## 2. Append: stack rows

**Append** puts tables with the same columns under each other: January's file, then February's, then March's.

| From | Date | Store | Amount |
|---|---|---|---|
| jan.csv | 2025-01-03 | Rideau | 39.52 |
| jan.csv | 2025-01-04 | Falls Centre | 93.60 |
| feb.csv | 2025-02-01 | Rideau | 18.72 |

Columns are matched **by name**. A column missing from one file is filled with null, and "Amount" and "amount " count as different columns, so clean names first. Even better: **Get data > Folder** combines every file in a folder and picks up new files on refresh.

## 3. Merge: join side by side

**Merge** adds columns from another table where a key matches, like `VLOOKUP` or SQL `JOIN`. Try each kind:

<!--fig:join-viz-->

| Join kind | Keeps | Use it for |
|---|---|---|
| **Left outer** | all left rows + matches | Adding details to a fact table (the usual choice) |
| **Inner** | only matching rows | When unmatched rows really should go (rare in BI) |
| **Right outer** | all right rows + matches | The same as left, with the tables swapped |
| **Full outer** | everything | Reconciling two lists |
| **Left anti** | left rows with no match | Data quality: sales for unknown products |
| **Right anti** | right rows with no match | Products that never sold |

In Power Query: **Home > Merge queries**, pick the second table, click the key column in each, choose the join kind, then **expand** (the ⇔ icon on the new column) to pick which columns to bring in.

## 4. Merge in Power Query, or a relationship in the model?

In Power BI you often **don't merge** dimension details into the fact table at all: you load Product as its own table and relate it in the model (Module 3). Merge when you need to fix or enrich data before it reaches the model, such as mapping old product codes to new ones, or when a lookup table is tiny and only used once.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** a join pairs every left row with every right row whose key matches. One match: one row. No match: kept or dropped depending on the kind. Two matches: two rows. So the row count after a left join equals the left count only if the right-hand key is unique.

**Check:** count rows before and after every merge. More rows means duplicate keys on the right; fewer means you used an inner join on data with gaps.
</details>

## 5. Worked example

*Northbay's new product list arrives with Desk lamp listed twice (two suppliers).* A left merge of 7,328 order lines on ProductKey now gives about 7,950 rows: every desk lamp line appears twice, and Home sales jump by a third. The fix: remove duplicates on ProductKey in the product query (keeping the current supplier), then merge again and confirm 7,328 rows.

## 6. Practice

1. Twelve monthly files, same columns: merge or append?
2. Which join finds stores in the sales data that are missing from the store list?
3. After merging, Sales went from 1,000 to 1,000 rows, but 40 rows have null Category. What does that tell you?

<details>
<summary>Answers</summary>

1. Append (ideally with a Folder source).
2. Left anti, with Sales on the left and the store list on the right (on StoreKey).
3. 40 lines have a ProductKey that isn't in the product table. Use a left anti join to list them and fix the product list.
</details>

Outside Power BI, [[merge-csv]] stacks or joins CSV files in your browser, which is handy for a quick check.
