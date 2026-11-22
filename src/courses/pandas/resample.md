---
title: 'Daily to weekly and monthly with resample'
summary: 'Change the frequency of a time series with resample: daily to weekly, monthly or quarterly totals and averages, week start days, per-store resampling with groupby, and Grouper for dates inside a normal table.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: "What does daily.resample('MS').sum() give?"
    choices: ['Monthly totals, labelled by the first day of each month', 'The sum of all days', 'Daily values for one month']
    ans: 0
    why: "'MS' = month start; 'ME' = month end. Both make monthly buckets."
  - q: "Which rule makes weeks that run Monday to Sunday?"
    choices: ["'W-MON'", "'W-SUN'", "'MS'"]
    ans: 1
    why: "Weekly rules name the day the week ENDS: 'W-SUN' weeks run Monday to Sunday."
  - q: 'How do you resample each store separately?'
    choices: ["df.groupby('store_id').resample('W-SUN', on='date')['qty'].sum()", "df.resample('W-SUN')", 'You cannot']
    ans: 0
    why: 'Group first, then resample inside each group.'
---

**Module 7 · about 20 minutes · uses Lesson 7.1.** You'll be able to turn a daily series into weekly, monthly or quarterly ones.

## 1. resample

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
daily = orders.groupby('date')['revenue'].sum()
monthly = daily.resample('MS').sum().round(0)
monthly
```

Common rules: `'D'` day, `'W-SUN'` week ending Sunday, `'MS'` month (labelled by its start), `'QS'` quarter, `'YS'` year. Any aggregation works: `sum`, `mean`, `max`, `count`, or `agg([...])`.

## 2. Directly from a table, and per store

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
weekly = orders.resample('W-SUN', on='date').agg(lines=('qty', 'size'), units=('qty', 'sum'))
display(weekly.head())
per_store = (orders.groupby(['store_id', pd.Grouper(key='date', freq='QS')])['qty'].sum()
                   .unstack('store_id'))
per_store
```

`pd.Grouper(key='date', freq='QS')` is a date bucket you can use inside an ordinary groupby next to other keys.

## 3. Partial periods

The first and last buckets may be incomplete (the data starts mid-week, or the current month isn't over). Comparing a partial month with full ones is a classic dashboard mistake. Check the number of days in each bucket:

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
weekly = orders.assign(day=orders['date']).resample('W-SUN', on='date').agg(units=('qty', 'sum'), days=('day', 'nunique'))
weekly[weekly['days'] < 7]
```

## 4. Your turn

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
# Quarterly total qty (use resample with 'QS' on the date column). Show it.
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders.resample('QS', on='date')['qty'].sum()
```
```python check
assert isinstance(_, pd.Series) and len(_) == 6, f'Expected 6 quarters (2025 Q1 to 2026 Q2), got {len(_)}.'
assert int(_.sum()) == int(orders['qty'].sum()), 'The quarters should add up to the total qty.'
```
```hint
orders.resample('QS', on='date')['qty'].sum()
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** resample is a groupby where the key is a time bucket computed from each date. Downsampling (day → month) aggregates; upsampling (month → day) creates empty rows you then fill (`asfreq`, `ffill`, `interpolate`).

**Labels and edges:** each bucket has a label (start or end) and a closed side. Defaults differ between rules; when it matters (fiscal weeks, reporting cut-offs), set `label=` and `closed=` explicitly and check one bucket by hand.
</details>

## 5. Practice

1. Average daily revenue per month (not total).
2. Weekly units per category, as a category × week grid.
3. Why flag partial periods?

<details>
<summary>Answers</summary>

1. `daily.resample('MS').mean()` on a daily series with every day present.
2. `full.groupby(['category', pd.Grouper(key='date', freq='W-SUN')])['qty'].sum().unstack()`.
3. An incomplete week or month looks like a drop; compare like with like, or show it clearly as partial.
</details>

**New words:** *resample*, *frequency rule*, *Grouper*, *downsample*, *upsample*, *partial period*.
