---
title: 'Cohort retention tables'
summary: 'Group customers by the month they first bought, count how many come back in each later month, and turn it into the triangle-shaped retention table that subscription and retail teams read every week.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: "What is a customer's cohort here?"
    choices: ['The month of their first order', 'Their home store', 'Their total spend']
    ans: 0
    why: "groupby('customer_id')['date'].transform('min') finds each customer's first order date."
  - q: 'Why is the retention table a triangle?'
    choices: ['Later cohorts have had fewer months to come back', 'Some data was deleted', 'pandas pads it']
    ans: 0
    why: 'A June 2026 cohort has only month 0 so far.'
  - q: 'Why can the first cohort look different in a data extract?'
    choices: ['It also holds older customers seen for the first time in the extract', 'January is always busy', 'It has more rows']
    ans: 0
    why: 'The data starts in January 2025, so everyone who already shopped before lands in that cohort.'
---

**Module 8 · about 20 minutes · uses Lessons 4.3, 6.3 and 7.5.** You'll be able to build a cohort retention table and read it.

## 1. Each customer's cohort and age

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['month'] = orders['date'].dt.to_period('M')
orders['cohort'] = orders.groupby('customer_id')['month'].transform('min')
orders['age'] = (orders['month'] - orders['cohort']).apply(lambda d: d.n)   # months since first order
orders[['customer_id', 'date', 'month', 'cohort', 'age']].sort_values(['customer_id', 'date']).head(8)
```

- **cohort**: the month of the customer's first order, copied to every row with `transform` (Lesson 4.3).
- **age**: how many months after the first order this row happened. Month 0 is the first month.

## 2. The retention triangle

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['month'] = orders['date'].dt.to_period('M')
orders['cohort'] = orders.groupby('customer_id')['month'].transform('min')
orders['age'] = (orders['month'] - orders['cohort']).apply(lambda d: d.n)
counts = orders.groupby(['cohort', 'age'])['customer_id'].nunique().unstack()
retention = (counts.div(counts[0], axis=0) * 100).round(0)
retention.iloc[:, :8]
```

Read a **row** to follow one cohort over time; read a **column** to compare cohorts at the same age. `div(counts[0], axis=0)` divides each row by its own month-0 size.

<!--fig:cohort-heat-->

## 3. Reading it honestly

- **The first cohort is mixed.** The data starts in January 2025, so that cohort also holds every older customer who happened to buy that month. It is the biggest cohort (216 people against 153 the month after), which hints at it. Leave it out or label it.
- **A blank cell can mean zero.** If nobody from a cohort came back in some month, that cell is NaN; inside the triangle, `fillna(0)` it.
- **Small cohorts are noisy.** Late cohorts have few new customers, so one person changes the % a lot. Show the cohort size next to the table.
- **Recent columns are partial** if the last month is not over (Lesson 7.2).

## 4. Your turn

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['month'] = orders['date'].dt.to_period('M')
# Add cohort (each customer's first month, with transform). Then show the number of NEW customers per cohort
# (distinct customer_id per cohort, counting only rows where month == cohort), as a Series.
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['month'] = orders['date'].dt.to_period('M')
orders['cohort'] = orders.groupby('customer_id')['month'].transform('min')
orders[orders['month'] == orders['cohort']].groupby('cohort')['customer_id'].nunique()
```
```python check
assert 'cohort' in orders.columns, 'Add a cohort column with transform.'
assert isinstance(_, pd.Series) and int(_.sum()) == orders['customer_id'].nunique(), 'Each customer belongs to exactly one cohort, so the sizes should add up to all customers.'
```
```hint
orders.groupby('customer_id')['month'].transform('min') gives the cohort. Filter month == cohort, then groupby('cohort')['customer_id'].nunique().
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** comparing all customers this month with all customers last month mixes old and new people. A **cohort** follows one fixed group over time, so changes in the table are changes in behaviour, not in who is counted.

```math
\text{retention}_{c,a} = \frac{\text{active customers of cohort } c \text{ in month } c + a}{\text{customers of cohort } c}
```

**Shapes to look for:** a fast drop after month 0 then a flat line means a loyal core; a line that keeps falling means people drift away; columns that improve for newer cohorts mean the product or onboarding got better.
</details>

## 5. Practice

1. Cohorts by quarter instead of month.
2. Revenue retention instead of customer retention.
3. Why do subscription businesses read the diagonal of this table?

<details>
<summary>Answers</summary>

1. Use `to_period('Q')` and the age in quarters.
2. Sum revenue per cohort and age instead of `nunique` of customers, then divide by month 0 revenue.
3. Each diagonal is one calendar month, so a dip along a diagonal shows something that happened to everyone that month (an outage, a price rise).
</details>

**Try it on your own data:** [[csv-profiler]] checks the date and customer columns before you build cohorts.

**New words:** *cohort*, *retention*, *cohort age*, *triangle*, *left censoring*.
