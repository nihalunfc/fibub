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
---

**Module 4 · about 15 minutes · uses Lesson 4.1.** You'll be able to build frequency tables and two-way tables with percentages.

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
