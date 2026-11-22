---
title: How to practise DAX in this course
seoTitle: 'Practise DAX online: how the editor works'
summary: Every lesson has a DAX editor that runs in your browser on the Northbay model. Learn to run code, read errors, check your answer and watch step by step what a formula did to the data.
minutes: 10
updated: 2026-11-22
quiz:
  - q: How do you run the code in the editor from the keyboard?
    choices: ['Ctrl+Enter (⌘+Enter on a Mac)', 'Ctrl+S', 'Shift+Tab']
    ans: 0
    why: Ctrl+Enter runs the editor, like in Power BI's DAX query view.
  - q: What does "Split by" do?
    choices: ['Splits your code into lines', 'Works out each measure once per value of the chosen column, like rows of a table visual', 'Deletes rows']
    ans: 1
    why: 'It plays the part of a table visual: each row brings a filter on that column, and the measure runs inside it.'
  - q: The error says "A single value for column 'Sales'[Amount] cannot be determined". What is the usual fix?
    choices: ['Delete the measure', 'Wrap the column in an aggregation such as SUM, or use an iterator such as SUMX', 'Rename the table']
    ans: 1
    why: A measure has no current row, so a bare column has many values. Aggregate it, or iterate with SUMX to create a row context.
---

**Module 1 · about 10 minutes.** You'll be able to use the practice editor: write measures, read errors, check answers and replay what happened.

## 1. Why this matters

You learn DAX by writing it, getting it wrong and seeing why. The editor in every lesson gives you instant feedback without installing anything, and it shows you what is usually invisible: which rows a formula can see.

## 2. Write and run

Type a measure as a name, an equals sign and a formula, one per line. Press **Run** or **Ctrl+Enter**. **Tab** indents; press **Esc** then Tab to move out of the box.

<!--fig:dax-pad try-editor-->

What you can write:

- **Measures:** `Total Sales = SUM(Sales[Amount])`. Names can have spaces. Use a measure in another one with square brackets: `[Total Sales]`.
- **Calculated columns:** `Sales[Margin] = Sales[Amount] - Sales[Quantity] * Sales[UnitCost]` (Lesson 3.4).
- **Queries:** `EVALUATE` followed by a table, such as `EVALUATE VALUES(Product[Category])` (Lesson 5.7).

Comments start with `//` or `--`.

## 3. See what happened

The best part. Run this, click the **Home** row, then **Show me what happened**:

<!--fig:dax-pad see-steps-->

Step 1 shows the **filter context**: the Home row of the visual filters the Product table to 3 products, and the filter flows along the relationship to Sales, leaving only Home order lines. Step 2 shows **SUM** adding up the Amount of the rows that are left. Kept rows are highlighted; filtered rows are faded with a line through them. Every DAX lesson uses this view.

## 4. Read the error, fix the code

Errors are written to tell you what to do. Run this one, read the message and fix it:

<!--fig:dax-pad fix-error-->

<details class="maths" open>
<summary>Principle</summary>

**Principle:** a measure is evaluated in a *filter context* (which rows are visible) and has no *current row*. That's why `Sales[Amount]` on its own fails in a measure but works in a calculated column, where there is a current row. Lessons 4.3 and 5.5 build on this one idea.

**About the engine:** this is a teaching engine written for the course. It follows Microsoft's documented DAX rules and covers the functions the course uses (the full list is under the [playground](/learn/courses/power-bi/playground/) editor), with single-direction, one-to-many relationships. Power BI itself has many more functions; everything you learn here works there unchanged.
</details>

## 5. Practice

1. In the first editor, add `Lines = COUNTROWS(Sales)` and split by `Store[Store]`.
2. In the playground, split by `'Date'[Weekday]`. Which weekday sells most?
3. Write a measure with a typo in a column name. What does the error suggest?

<details>
<summary>Answers</summary>

1. One row per store with Total Sales, Units and Lines.
2. Saturday and Sunday are highest: Northbay's weekends are about a third busier.
3. It lists the table's real columns so you can spot the right name.
</details>
