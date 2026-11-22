---
title: 'pandas interview questions, answered'
summary: '35 pandas questions from data analyst and BI interviews and take-home tests, from loc vs iloc to merges that add rows, groupby with transform, pivots, dates and speed, each with a short answer, the line of code, and the lesson that explains it.'
seoTitle: 'pandas interview questions and answers for data analysts'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'An interviewer asks for the top 3 products by revenue in each store. Which tools do you reach for?'
    choices: ['groupby on store and product, then sort and groupby(store).head(3)', 'A for loop over stores', 'pivot_table only']
    ans: 0
    why: 'Sort first, then head(3) per group keeps the top rows of each store.'
  - q: 'A live coding task: your merge returned more rows than the left table. What do you say?'
    choices: ['The right table has repeated keys; I check with duplicated() and use validate=', 'pandas has a bug', 'Drop the extra rows with head()']
    ans: 0
    why: 'Explaining the cause and the check is what the interviewer is looking for (Lesson 5.3).'
  - q: 'How do you answer when you forget the exact method name?'
    choices: ['Say what the step does and what you would search for; the idea matters more than the spelling', 'Stay silent', 'Change the subject']
    ans: 0
    why: 'Interviewers test thinking. Everyone looks up syntax.'
---

**Module 9 · about 45 minutes · revision.** Answer each question out loud, write the line of code, then open the answer. In a live test, say what you are doing as you type: it shows your thinking even when the syntax slips.

## Basics

<details><summary>1. What is the difference between a Series and a DataFrame?</summary>

A Series is one column with an index; a DataFrame is a table of Series that share the same index. `df['qty']` is a Series, `df[['qty']]` is a one-column DataFrame. (Lessons 1.3, 1.4)
</details>

<details><summary>2. loc or iloc?</summary>

`loc` selects by **label** (index values and column names, and slices include the end); `iloc` by **position** (0, 1, 2..., end excluded). `df.loc[df.qty > 2, 'store_id']` filters and picks a column in one step. (Lesson 2.2)
</details>

<details><summary>3. How do you filter on two conditions?</summary>

`df[(df.qty > 2) & (df.store_id == 'S01')]`, with brackets round each condition and `&`, `|`, `~` instead of `and`, `or`, `not`. Or `df.query("qty > 2 and store_id == 'S01'")`. (Lessons 2.3, 2.6)
</details>

<details><summary>4. What does inplace=True do, and should you use it?</summary>

It changes the object instead of returning a new one. Most teams avoid it: it doesn't save memory, it breaks method chains, and it's being phased out. Assign the result instead. (Lesson 8.1)
</details>

<details><summary>5. How do you take a first look at a new dataset?</summary>

`shape`, `head()`, `info()` (types and missing values), `describe()` (ranges), `isna().sum()`, `duplicated().sum()`, `nunique()`, and `value_counts()` on key text columns. (Lesson 1.6)
</details>

## Cleaning

<details><summary>6. How do you handle missing values?</summary>

First find out why they are missing. Then drop (`dropna`) if few and random, fill (`fillna` with 0, a median, a group median via `transform`, or `ffill` for time series), or keep and flag. Say what you did in the report. (Lesson 3.1)
</details>

<details><summary>7. A numeric column is read as text. Why, and how do you fix it?</summary>

Something in it isn't a number: "$", commas, "n/a", spaces. Clean with `.str.replace`, then `pd.to_numeric(col, errors='coerce')` and check what turned into NaN. (Lessons 3.3, 3.4)
</details>

<details><summary>8. How do you find and remove duplicates?</summary>

`df.duplicated().sum()` for exact repeats, `df.duplicated(subset=['order_id', 'product_id'])` for repeated keys; `drop_duplicates(subset=..., keep='last')` to keep the latest. Look at a few before deleting. (Lesson 3.2)
</details>

<details><summary>9. Dates come in three formats. What do you do?</summary>

`pd.to_datetime(col, format='mixed', dayfirst=...)` or parse each format separately and combine; then check min, max and any NaT. Ambiguous ones like 03/04 need a rule from the data owner. (Lesson 3.5)
</details>

<details><summary>10. How do you clean messy text categories ("  toronto", "Toronto ")?</summary>

`.str.strip().str.title()`, then `value_counts()` to spot the rest, and `replace` or `map` for spellings. (Lesson 3.4)
</details>

## Grouping

<details><summary>11. Explain groupby in one sentence.</summary>

Split the rows into groups by a key, apply a summary to each group, and combine the results into one table. (Lesson 4.1)
</details>

<details><summary>12. Several summaries with names?</summary>

Named aggregation: `df.groupby('store_id').agg(revenue=('revenue', 'sum'), orders=('order_id', 'nunique'))`. (Lesson 4.2)
</details>

<details><summary>13. agg vs transform vs filter?</summary>

`agg` returns one row per group; `transform` returns a value for every original row (for share of group, group means); `filter` keeps or drops whole groups. (Lesson 4.3)
</details>

<details><summary>14. Each order line's share of its store's revenue?</summary>

`df['share'] = df['revenue'] / df.groupby('store_id')['revenue'].transform('sum')`. (Lesson 4.3)
</details>

<details><summary>15. Top 3 products per store?</summary>

```py
t = df.groupby(['store_id', 'product_id'], as_index=False)['revenue'].sum()
t.sort_values('revenue', ascending=False).groupby('store_id').head(3)
```
(Lessons 2.4, 4.1)
</details>

<details><summary>16. size() or count()?</summary>

`size()` counts rows including NaN; `count()` counts non-missing values per column. `nunique()` counts distinct values. (Lesson 4.1)
</details>

## Joining and reshaping

<details><summary>17. merge vs join vs concat?</summary>

`merge` joins on columns (like SQL JOIN); `join` is a shortcut that joins on the index; `concat` stacks tables on top of each other or side by side. (Lessons 5.1, 5.2)
</details>

<details><summary>18. Inner, left, right, outer?</summary>

Inner keeps keys in both; left keeps all left rows; right all right rows; outer everything. `indicator=True` adds a column saying where each row came from, great for finding unmatched keys. (Lesson 5.2)
</details>

<details><summary>19. A merge added rows. Why?</summary>

The right table has more than one row per key, so each left row is repeated. Check with `right.key.duplicated().sum()` and protect with `validate='many_to_one'`. (Lesson 5.3)
</details>

<details><summary>20. Like VLOOKUP for one column?</summary>

`df['category'] = df['product_id'].map(products.set_index('product_id')['category'])`. (Lesson 5.4)
</details>

<details><summary>21. Wide to long and back?</summary>

`melt(id_vars=..., var_name=..., value_name=...)` makes wide long; `pivot` or `pivot_table` makes long wide; `stack`/`unstack` move index levels to and from columns. (Lessons 6.1 to 6.3)
</details>

<details><summary>22. pivot vs pivot_table?</summary>

`pivot` only reshapes and fails on repeated index/column pairs; `pivot_table` aggregates repeats (`aggfunc`) and can add totals (`margins=True`). (Lessons 6.1, 6.3)
</details>

<details><summary>23. What is tidy data?</summary>

One row per observation, one column per variable, one table per kind of thing. Analyse long, show wide. (Lesson 6.5)
</details>

## Dates and time series

<details><summary>24. Daily data to monthly totals?</summary>

`df.resample('MS', on='date')['revenue'].sum()`, or `groupby(pd.Grouper(key='date', freq='MS'))` next to other keys. (Lesson 7.2)
</details>

<details><summary>25. 7-day rolling average, and its catch?</summary>

`daily.rolling(7).mean()`. It assumes one row per day, so fill missing days first or use `rolling('7D')`; it lags by about half a window. (Lessons 7.1, 7.3)
</details>

<details><summary>26. Month over month and year over year growth?</summary>

`monthly.pct_change()` and `monthly.pct_change(12)`; per group, `groupby(...).pct_change()`. Watch missing months and partial months. (Lesson 7.4)
</details>

<details><summary>27. Sales by weekday in the right order?</summary>

`dt.day_name()` as an ordered `Categorical`, or group on `dt.dayofweek`; compare per day, not totals. (Lesson 7.5)
</details>

## Analyses

<details><summary>28. How do you compute average order value from order lines?</summary>

Total revenue divided by `order_id.nunique()`, never the mean of line revenue; rebuild it from totals at every level, including the total row. (Lesson 8.2)
</details>

<details><summary>29. Describe RFM in a minute.</summary>

Per customer: days since last order, number of orders and total spend; `qcut` each into 1-5 scores; name segments with rules (`np.select`); give each a different action. (Lesson 8.4)
</details>

<details><summary>30. How do you build a cohort retention table?</summary>

Cohort = first order month (`transform('min')`), age = months since then, count distinct customers by cohort and age, `unstack`, divide each row by month 0. (Lesson 8.5)
</details>

<details><summary>31. Analyse an A/B test in pandas?</summary>

Check the split, then `groupby('group')` for visitors, conversions and means; lift with a 95 % CI and p-value; guardrails; segments as a consistency check only. (Lesson 8.6)
</details>

<details><summary>32. Write ROW_NUMBER() OVER (PARTITION BY customer ORDER BY date).</summary>

`df.sort_values('date').groupby('customer_id').cumcount() + 1`. (Lesson 8.7)
</details>

## Speed and good practice

<details><summary>33. Why avoid iterrows and apply(axis=1)?</summary>

They run Python code once per row; whole-column (vectorised) operations run in compiled code and are often hundreds of times faster. Use arithmetic on columns, `np.where`, `np.select`, `map`, `.str`. (Lesson 8.8)
</details>

<details><summary>34. A 5 GB CSV won't fit in memory. Options?</summary>

`usecols` and smaller `dtype`s (category, int32), `chunksize` to process in pieces, Parquet instead of CSV, or a tool built for it (DuckDB, Polars, Spark). (Lesson 8.8)
</details>

<details><summary>35. How do you make your analysis trustworthy and repeatable?</summary>

Method chains or small functions, `assert` checks after joins and cleaning, fixed snapshot dates, no manual edits, restart-and-run-all before sharing, and a README that states the question and the answer. (Lessons 8.1, 9.1)
</details>

**Next:** keep the [cheat sheet](/learn/courses/pandas/cheat-sheet/) open while you practise, and finish the [capstone notebook](/learn/courses/pandas/capstone-retail-notebook/) so you have something to show.

**New words:** *live coding*, *take-home test*, *vectorised*, *validate*, *named aggregation*.
