---
title: 'Growth rates: shift, pct_change and year over year'
summary: 'Compare each period with the one before and with the same period last year using shift and pct_change, compute growth per group, and avoid the common traps of missing periods and partial months.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'What does s.shift(1) do?'
    choices: ['Moves every value down one row, so each row sees the previous value', 'Deletes the first row', 'Adds 1 to each value']
    ans: 0
    why: 'shift lines up each period with an earlier one for comparison.'
  - q: 'Monthly data: which gives year-over-year growth?'
    choices: ['s.pct_change(12)', 's.pct_change(1)', 's.diff()']
    ans: 0
    why: 'Compare with 12 months earlier, so the season cancels.'
  - q: 'Growth per store: what must you do so one store is not compared with another?'
    choices: ["Use groupby('store_id') before shift or pct_change", 'Sort by revenue', 'Nothing']
    ans: 0
    why: 'Without the group, the first row of store B is compared with the last row of store A.'
---

**Module 7 · about 20 minutes · uses Lesson 7.2.** You'll be able to compute period-over-period and year-over-year growth correctly.

## 1. shift and pct_change

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
m = orders.resample('MS', on='date')['revenue'].sum().to_frame('revenue')
m['prev'] = m['revenue'].shift(1)
m['mom_%'] = (m['revenue'].pct_change() * 100).round(1)          # month over month
m['yoy_%'] = (m['revenue'].pct_change(12) * 100).round(1)        # same month last year
m.round(0).tail(8)
```

Month-over-month swings mostly show the season (December up, January down). **Year over year** compares like with like, so it shows growth.

## 2. Per group

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
q = orders.groupby(['store_id', pd.Grouper(key='date', freq='QS')])['qty'].sum().reset_index()
q['qoq_%'] = (q.groupby('store_id')['qty'].pct_change() * 100).round(1)
q['yoy_%'] = (q.groupby('store_id')['qty'].pct_change(4) * 100).round(1)
q[q['store_id'].isin(['S01', 'S06'])]
```

`groupby(...).pct_change()` restarts at each store, so each store is only compared with itself.

## 3. Traps

- **Missing periods:** `shift(12)` means "12 rows back". If a month is missing, it compares with the wrong month. Make the series regular first (Lesson 7.1).
- **Partial periods:** comparing this month so far with all of last month looks like a fall. Compare the same number of days (month-to-date vs the same days last year).
- **Small bases:** +300 % from 2 to 8 sales is noise. Show the counts beside the percentages.
- **Averaging growth rates:** +50 % then −50 % is not 0; it's −25 % overall. Compound growth uses the geometric mean.

## 4. Your turn

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
monthly = orders.resample('MS', on='date')['qty'].sum()
# Year-over-year growth in % for each month (pct_change with 12), rounded to 1 decimal. Show only the non-missing values.
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
monthly = orders.resample('MS', on='date')['qty'].sum()
(monthly.pct_change(12) * 100).round(1).dropna()
```
```python check
assert isinstance(_, pd.Series) and len(_) == 6, f'Expected 6 months with a value a year earlier (Jan-Jun 2026), got {len(_)}.'
exp = (monthly.pct_change(12) * 100).round(1).dropna()
assert (_.values == exp.values).all(), 'Use monthly.pct_change(12) * 100.'
```
```hint
monthly.pct_change(12) compares with 12 months earlier; multiply by 100, round(1), then dropna().
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** growth compares a value with a **reference** value. `shift(k)` brings the reference onto the same row; then any formula works.

```math
\text{growth}_t = \frac{y_t - y_{t-k}}{y_{t-k}}, \qquad \text{CAGR} = \left(\frac{y_\text{end}}{y_\text{start}}\right)^{1/\text{years}} - 1
```

With k = 1 it's period over period; with k = the season length (12 months, 52 weeks, 4 quarters) it's year over year.
</details>

## 5. Practice

1. Week-over-week change in units (difference, not %).
2. Sales went from $200k to $242k over 2 years. Compound annual growth?
3. Why can `shift(12)` give the wrong comparison?

<details>
<summary>Answers</summary>

1. `weekly.diff()` (= `weekly - weekly.shift(1)`).
2. `(242/200) ** 0.5 - 1` = 10 % a year.
3. It counts rows, not months; a missing month shifts everything after it.
</details>

**New words:** *shift*, *pct_change*, *diff*, *month over month*, *year over year*, *CAGR*.
