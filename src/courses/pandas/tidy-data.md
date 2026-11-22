---
title: 'Tidy data: which shape for which job'
summary: 'The tidy data rules (one row per observation, one column per variable, one table per kind of thing), why long shapes are best for analysis and wide shapes for reading, and how to choose the right grain for a report.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'Which table is tidy?'
    choices: ['store, month, sales (one row per store-month)', 'store, Jan, Feb, Mar', 'One sheet per store']
    ans: 0
    why: 'Each variable (store, month, sales) is a column and each observation a row.'
  - q: 'When is a wide table the right choice?'
    choices: ['For a report people read across, such as months side by side', 'For groupby', 'Never']
    ans: 0
    why: 'Wide is for eyes; long is for code.'
  - q: 'What is the grain of a table?'
    choices: ['What one row represents, such as one order line or one customer per day', 'The number of columns', 'The file size']
    ans: 0
    why: 'Knowing the grain prevents double counting in joins and sums.'
---

**Module 6 · about 15 minutes · uses all of Module 6.** You'll be able to say what shape a table should be for the job, and get it there.

## 1. Three rules

A **tidy** table follows three rules:

1. Each **variable** is a column (store, month, sales).
2. Each **observation** is a row (one store in one month).
3. Each **kind of thing** is its own table (stores, products, orders), linked by keys.

`orders.csv`, `products.csv` and `stores.csv` are tidy. A budget sheet with a column per month is not: "month" is hiding in the column names.

## 2. Long for code, wide for eyes

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['month'] = orders['date'].dt.to_period('M').astype(str)
long = orders.groupby(['store_id', 'month'], as_index=False)['qty'].sum()    # tidy: for analysis
wide = long.pivot(index='store_id', columns='month', values='qty')            # for a report
print(long.shape, wide.shape)
display(long.head())
wide.iloc[:, -6:]
```

Analyse in the long shape (filter, group, join, model), then pivot to wide at the very end for the table people read.

## 3. Choose the grain on purpose

| Question | Grain you need |
|---|---|
| Which products sell together? | order line |
| Average order value | order (sum lines first) |
| Customer lifetime value | customer |
| Daily sales trend | store × day |

Moving to a coarser grain is a `groupby`; joining tables of different grains needs care (Lesson 5.3).

## 4. Your turn

```python exercise
import pandas as pd

budget = pd.DataFrame({'store': ['S01', 'S02'], 'Q1': [100, 80], 'Q2': [110, 85], 'Q3': [120, 90], 'Q4': [150, 110]})
# Make it tidy (columns store, quarter, budget), keep only the quarters where budget is 100 or more, and show it.
```
```python solution
import pandas as pd

budget = pd.DataFrame({'store': ['S01', 'S02'], 'Q1': [100, 80], 'Q2': [110, 85], 'Q3': [120, 90], 'Q4': [150, 110]})
tidy = budget.melt(id_vars='store', var_name='quarter', value_name='budget')
tidy[tidy['budget'] >= 100]
```
```python check
assert isinstance(_, pd.DataFrame) and list(_.columns) == ['store', 'quarter', 'budget'], 'Columns should be store, quarter, budget.'
assert len(_) == 5, f'Expected 5 rows with budget >= 100, got {len(_)}.'
```
```hint
melt with id_vars='store', var_name='quarter', value_name='budget', then filter budget >= 100.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** tools (groupby, merge, charts, models) expect variables in columns. Tidy data makes every question a filter or a group on a column. The idea comes from statistician Hadley Wickham's paper *Tidy Data* (2014), and it's the same as database normal form: one fact, one place.

**Power BI and Tableau** also want long, tidy tables (a fact table plus lookup tables): model the data that way and the visuals do the pivoting.
</details>

## 5. Practice

1. A survey sheet has one column per question. Tidy or not? How do you fix it?
2. Why pivot only at the end?
3. Name the grain of `customers.csv`.

<details>
<summary>Answers</summary>

1. Not tidy (question is a variable hidden in headers); melt to respondent, question, answer.
2. Wide tables are awkward to filter, group or join; keep the flexible shape until the final report.
3. One row per customer.
</details>

**New words:** *tidy data*, *observation*, *variable*, *grain*, *fact table*, *lookup table*.
