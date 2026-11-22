---
title: 'Why pandas, and how to use this course'
summary: 'What pandas is, why analysts use it alongside Excel, SQL and Power BI, and how the code boxes in this course work: edit, Run, Check, Hint and Show answer, all in your browser.'
minutes: 10
updated: 2026-11-22
quiz:
  - q: 'What is pandas?'
    choices: ['A Python library for working with tables of data', 'A database', 'A charting app']
    ans: 0
    why: 'pandas gives Python a table type (the DataFrame) and hundreds of tools to clean, summarise, join and reshape it.'
  - q: 'Where does the Python in this course run?'
    choices: ['On a fibub server', 'In your own browser; nothing you type is sent anywhere', 'In the cloud']
    ans: 1
    why: 'The page downloads Python (Pyodide) once and runs it on your device.'
  - q: 'Why learn pandas if you already know Excel?'
    choices: ['Excel is obsolete', 'Repeatable steps, bigger files, and analyses that are awkward in a spreadsheet; employers list Python for analyst roles', 'pandas has better colours']
    ans: 1
    why: 'A script reruns the same cleaning on next month''s file in a second, and handles millions of rows.'
sources:
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
  - 'pandas documentation, User Guide: 10 minutes to pandas https://pandas.pydata.org/docs/user_guide/10min.html'
---

**Module 1 · about 10 minutes · no Python needed.** You'll know what pandas is for, and how to use the code boxes in this course.

<div class="bigidea">pandas lets you do to a table, in a few lines of code you can rerun, what would take dozens of clicks in a spreadsheet.</div>

**In everyday terms:** a spreadsheet is cooking by hand every time; pandas is writing the recipe down. The first meal takes a little longer, and every meal after that is one click, exactly the same, and anyone can check the recipe.

## 1. What pandas is

**pandas** is the Python library analysts use for tables: load a file, clean it, filter it, group and summarise it, join it with other tables, and reshape it for a report or a chart. It's the "Excel and SQL inside Python" that most data analyst job ads ask for.

Why analysts reach for it:

- **Repeatable:** a script cleans next month's export exactly like this month's.
- **Bigger data:** millions of rows, where spreadsheets slow down or stop.
- **Everything in one place:** cleaning, analysis, statistics and charts, with every step written down.
- **Works with your other tools:** read from Excel and SQL databases, write files for Power BI or Tableau.

## 2. Try it: your first code

Python runs right here in the page. Press **Run** (or **Ctrl+Enter**, **⌘+Enter** on a Mac). The first run downloads Python once, about 20 MB; after that it's instant and works offline.

```python data=stores.csv
import pandas as pd

stores = pd.read_csv('stores.csv')
stores
```

You've just read a CSV file into a **DataFrame**: a table with named columns. Change the last line to `stores.shape` and run it again: it tells you the number of rows and columns.

## 3. How the boxes work

- **Example boxes** (marked Python): edit anything and run it. **Reset** puts the original code back.
- **Exercise boxes** (marked Your turn): write code, then press **Check**. **Hint** gives a nudge; **Show answer** fills in a solution and runs it.
- Each box runs on its own, with `pandas` already available as `pd`.
- The **last line** of a box is shown if it's a value (a table, a number); use `print()` to show anything else.
- Errors show the line and the message. Read the last part first: `KeyError: 'Store'` means there is no column called `Store`.

```python exercise data=stores.csv
import pandas as pd

stores = pd.read_csv('stores.csv')
# Show only the first 3 rows, using stores.head(3)
```
```python solution
import pandas as pd

stores = pd.read_csv('stores.csv')
stores.head(3)
```
```python check
assert isinstance(_, pd.DataFrame), 'End with stores.head(3) so the box shows a table.'
assert len(_) == 3, f'Your table has {len(_)} rows; show 3.'
```
```hint
Put stores.head(3) on the last line, so the box shows it.
```

<div class="meaning">

<dl>
<dt>DataFrame</dt><dd>A table: named columns, rows with labels.</dd>
<dt>Series</dt><dd>One column of a DataFrame.</dd>
<dt>Method</dt><dd>An action on a table, written table.action(): orders.head(), orders.groupby(...).</dd>
<dt>Physical meaning</dt><dd>Every pandas line is a step you could do by hand in a spreadsheet: filter, sort, total, join. The difference is that the steps are written down, so next month's file goes through exactly the same steps in a second.</dd>
</dl>

</div>

<div class="myth">

**"pandas is for programmers, not analysts."** Most analyst pandas is a dozen commands: read, filter, group, join, pivot, plot. If you can write a spreadsheet formula, you can write these. This course teaches exactly that dozen first.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The question.</b> Which store sold the most units?</div>
<div class="step"><b>Read.</b> <code>orders = pd.read_csv('orders.csv')</code>: 9,717 order lines in memory.</div>
<div class="step"><b>Group.</b> <code>orders.groupby('store_id')['qty'].sum()</code>: one total per store.</div>
<div class="step"><b>Sort.</b> <code>.sort_values(ascending=False)</code>: biggest first.</div>
<div class="step"><b>Rerun next month.</b> New file, same three lines, answer in a second. No clicks to repeat, nothing to forget.</div>
</div>

<div class="problem" data-problem="pd-why-lines"></div>

<details class="maths" open>
<summary>How it works</summary>

**Principle:** pandas stores each column as a typed array (numbers, text, dates), so an operation on a column runs on all its values at once, in fast compiled code, instead of one cell at a time.

**In this course:** Python and pandas are [Pyodide](https://pyodide.org), a build of Python for web browsers, served from fibub itself. Your code runs on your device; nothing is uploaded. The datasets (a made-up shop's stores, products, customers and orders) are small CSV files the page reads when a box needs them.
</details>

## 4. The data we'll use

A made-up retail chain with six stores and a website:

| File | One row per | Rows |
|---|---|---|
| `stores.csv` | store | 7 |
| `products.csv` | product | 32 |
| `customers.csv` | customer | 1,200 |
| `orders.csv` | order line (one product in one order) | 9,717 |
| `orders_messy.csv` | a messy export, for cleaning practice | 412 |

The same tables come back throughout, so by the capstone you'll know them well.

## 5. Practice

Answer in words, then check:

1. Name two things pandas does better than a spreadsheet.
2. What does the last line of a code box do?

<details>
<summary>Answers</summary>

1. Repeating the same steps on new files; handling millions of rows; keeping every step written down; joining many tables.
2. If it's a value (a DataFrame, a number), the box shows it, as if you'd printed it.
</details>

**Try it on your own data:** fibub's [[csv-profiler]] gives an instant first look at any CSV in your browser, with no code.

**New words:** *pandas*, *library*, *DataFrame*, *Pyodide*.

<div class="keypoints">

- pandas works on tables (DataFrames) made of columns (Series).
- Code is a written recipe: repeatable, checkable and shareable.
- A handful of commands covers most analyst work.
- Every code box here runs real Python in your browser; edit and run freely.

</div>
