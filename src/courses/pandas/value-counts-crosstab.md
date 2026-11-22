---
title: 'value_counts and crosstab'
summary: 'Count how often each value appears with value_counts (as counts or shares), and cross two categories with crosstab to get a frequency table with totals and row or column percentages.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: "How do you get shares instead of counts from value_counts?"
    choices: ['value_counts(normalize=True)', 'value_counts() / 100', 'value_counts(pct=True)']
    ans: 0
    why: 'normalize=True divides by the total, so the values add to 1.'
  - q: "What does pd.crosstab(df.store_id, df.segment) show?"
    choices: ['How many rows fall in each store × segment combination', 'The correlation between them', 'A list of stores']
    ans: 0
    why: 'A crosstab is a table of counts for every pair of categories.'
  - q: "In crosstab, normalize='index' makes:"
    choices: ['Each row add up to 1 (row percentages)', 'Each column add up to 1', 'The whole table add up to 1']
    ans: 0
    why: "'index' = rows, 'columns' = columns, True = whole table."
sources:
  - 'pandas documentation, User Guide: Reshaping and pivot tables (crosstab) https://pandas.pydata.org/docs/user_guide/reshaping.html#cross-tabulations'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 4 · about 15 minutes · uses Lesson 4.1.** You'll be able to build frequency tables and two-way tables with percentages.

<div class="bigidea">value_counts counts how often each value appears; crosstab counts every combination of two columns in a grid.</div>

**In everyday terms:** a tally sheet. value_counts is one column of tally marks per answer; crosstab is a grid with one tally box per pair of answers, like a seating chart of who sat where.

## 1. value_counts

```python data=customers.csv
import pandas as pd

customers = pd.read_csv('customers.csv')
display(customers['segment'].value_counts())
display(customers['segment'].value_counts(normalize=True).round(3))
customers[['segment', 'contact']].value_counts().head()      # combinations of two columns
```

Add `dropna=False` to count missing values too; by default they're left out.

## 2. crosstab

```python data=customers.csv
import pandas as pd

customers = pd.read_csv('customers.csv')
display(pd.crosstab(customers['home_store'], customers['segment'], margins=True))
(pd.crosstab(customers['home_store'], customers['segment'], normalize='index') * 100).round(1)
```

`margins=True` adds totals. `normalize='index'` gives **row percentages**: "of this store's customers, what share is each segment?" Choose the direction that answers your question; it's the commonest mistake in reading these tables.

**With a value:** `pd.crosstab(a, b, values=df['revenue'], aggfunc='sum')` sums a number instead of counting rows, like a pivot table (Lesson 6.1).

<div class="meaning">

<dl>
<dt>value_counts()</dt><dd>Counts per value, biggest first.</dd>
<dt>normalize=True</dt><dd>Shares instead of counts.</dd>
<dt>pd.crosstab(a, b)</dt><dd>Counts of each a-b combination.</dd>
<dt>normalize='index'</dt><dd>Shares within each row.</dd>
<dt>Physical meaning</dt><dd>A crosstab is the table a chi-square test reads (Statistics Lesson 6.5): if the row shares look alike, the two columns are unrelated; if they differ, one tells you something about the other.</dd>
</dl>

</div>

<div class="myth">

**"Compare the counts across rows."** Rows with more customers have bigger counts everywhere. Compare shares within each row (normalize='index') to see whether the mix really differs.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The rows.</b> segment by store for 6 customers: S01 Premium, S01 Regular, S01 Regular, WEB Premium, WEB Premium, WEB Regular.</div>
<div class="step"><b>Counts.</b> <code>pd.crosstab(df.store, df.segment)</code><table class="lk-tbl"><tr><th>store</th><th>Premium</th><th>Regular</th></tr><tr><td>S01</td><td>1</td><td>2</td></tr><tr><td>WEB</td><td>2</td><td>1</td></tr></table></div>
<div class="step"><b>Shares per row.</b> <code>normalize='index'</code><table class="lk-tbl"><tr><th>store</th><th>Premium</th><th>Regular</th></tr><tr><td>S01</td><td>0.33</td><td>0.67</td></tr><tr><td>WEB</td><td><mark>0.67</mark></td><td>0.33</td></tr></table></div>
<div class="step"><b>Read it.</b> WEB customers are twice as often Premium.</div>
</div>

<div class="problem" data-problem="pd-crosstab-share"></div>

## 3. Your turn

```python exercise data=customers.csv
import pandas as pd

customers = pd.read_csv('customers.csv')
# Share of customers using each contact method, as percentages rounded to 1 decimal.
```
```python solution
import pandas as pd

customers = pd.read_csv('customers.csv')
(customers['contact'].value_counts(normalize=True) * 100).round(1)
```
```python check
assert isinstance(_, pd.Series) and abs(_.sum() - 100) < 0.5, 'The percentages should add to about 100.'
assert set(_.index) == {'email', 'none', 'app'}, 'Count the contact column.'
```
```hint
value_counts(normalize=True) gives shares; multiply by 100 and round(1).
```

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
# A crosstab of store_id (rows) by qty (columns), with row percentages rounded to 1 decimal.
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv')
(pd.crosstab(orders['store_id'], orders['qty'], normalize='index') * 100).round(1)
```
```python check
assert isinstance(_, pd.DataFrame) and len(_) == 7, 'One row per store.'
assert (abs(_.sum(axis=1) - 100) < 0.5).all(), "Each row should add to 100: use normalize='index'."
```
```hint
pd.crosstab(orders['store_id'], orders['qty'], normalize='index') * 100, then .round(1).
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** a crosstab is a groupby on two keys with `size()`, unstacked so one key runs across the columns. It's also the input to a chi-square test of independence (Statistics Lesson 6.5): are segment and store related, or would the mix look like this by chance?

**Which percentage:** row % compares the *make-up* of rows; column % compares the make-up of columns; total % shows each cell's share of everything.
</details>

## 4. Practice

1. Count order lines by discount level, including how many have none.
2. What question does `normalize='columns'` answer in a store × segment table?
3. How would you test whether segment depends on store?

<details>
<summary>Answers</summary>

1. `orders['discount'].value_counts().sort_index()`.
2. "Of each segment's customers, what share belongs to each store?"
3. A chi-square test of independence on the count crosstab, such as with the [[crosstab-chi-square]] tool.
</details>

**Try it on your own data:** [[crosstab-chi-square]] builds the table and runs the test.

**New words:** *value_counts*, *normalize*, *crosstab*, *margins*, *row percentage*.

<div class="keypoints">

- value_counts gives counts or shares of one column.
- crosstab counts combinations of two columns.
- normalize='index' compares mixes fairly across rows.
- A crosstab is the input to a chi-square test.

</div>
