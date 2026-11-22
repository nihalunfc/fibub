---
title: 'Dates as the index'
summary: 'Build a daily time series from transactions, set the date as the index, select by date strings and ranges, and fill in missing days so the series has one row for every day.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: "With a DatetimeIndex, what does s.loc['2026-03'] return?"
    choices: ['Every row in March 2026', 'Only 1 March', 'An error']
    ans: 0
    why: 'Partial date strings select whole periods.'
  - q: 'Why fill in days with no sales?'
    choices: ['So averages, rolling windows and shifts count every calendar day, not just the days that had sales', 'To make the file bigger', 'It is required']
    ans: 0
    why: 'A missing day is a zero-sales day; without it, a "7-row" window may span more than 7 days.'
  - q: "Which makes one row per day from order lines?"
    choices: ["orders.groupby('date')['revenue'].sum()", "orders.set_index('date')", "orders.sort_values('date')"]
    ans: 0
    why: 'Group by the date to sum all lines of each day.'
---

**Module 7 · about 15 minutes · uses Lessons 3.5 and 4.1.** You'll be able to turn transactions into a clean daily series indexed by date.

## 1. From transactions to a daily series

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
daily = orders.groupby('date')['revenue'].sum().round(2)
print(type(daily.index).__name__, daily.index.min(), daily.index.max(), len(daily))
daily.head()
```

The index is a **DatetimeIndex**, which unlocks date selection, resampling and rolling windows.

## 2. Selecting by date

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
daily = orders.groupby('date')['qty'].sum()
print('March 2026 total:', daily.loc['2026-03'].sum())
print('Black Friday week:', daily.loc['2025-11-24':'2025-11-30'].sum())
daily.loc['2025-12-20':'2025-12-27']
```

Partial strings (`'2026'`, `'2026-03'`) select whole periods, and date slices include both ends.

## 3. Every day present

A store with no sales on a day simply has no rows that day. Before rolling windows or growth rates, put the missing days back as zeros:

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
s06 = orders[orders['store_id'] == 'S06'].groupby('date')['qty'].sum()
full_range = pd.date_range(s06.index.min(), s06.index.max(), freq='D')
print(len(s06), 'days with sales out of', len(full_range))
s06 = s06.reindex(full_range, fill_value=0)
s06.head(10)
```

`reindex` lines the series up with the full calendar, filling the gaps.

## 4. Your turn

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
# Daily total qty for the WEB store, with every calendar day from 2025-01-01 to 2026-06-30 (fill 0).
# Show how many days had zero web sales.
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
web = orders[orders['store_id'] == 'WEB'].groupby('date')['qty'].sum()
web = web.reindex(pd.date_range('2025-01-01', '2026-06-30', freq='D'), fill_value=0)
(web == 0).sum()
```
```python check
assert 'web' in dir() and len(web) == 546, f'web should have 546 days, has {len(web)}.'
assert _ == (web == 0).sum(), 'Show the number of zero days.'
```
```hint
Group the WEB rows by date, then reindex with pd.date_range('2025-01-01', '2026-06-30', freq='D') and fill_value=0.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** time-series tools assume a **regular** series: one row per period, in order. Transactions are irregular (many on busy days, none on quiet ones). `groupby` + `reindex` (or `resample`, next lesson) converts one to the other.

**Zero vs missing:** a day with no orders had zero sales, so fill with 0. A day with no sensor reading is unknown, so leave NaN or interpolate. Decide which your data means.
</details>

## 5. Practice

1. Select all of 2025 from a daily series.
2. Why might a "7-row rolling average" not be a 7-day average?
3. Make a calendar of every Monday in 2026.

<details>
<summary>Answers</summary>

1. `daily.loc['2025']`.
2. If quiet days are missing, 7 rows can span more than 7 days; reindex to every day first (or use `rolling('7D')`).
3. `pd.date_range('2026-01-01', '2026-12-31', freq='W-MON')`.
</details>

**New words:** *time series*, *DatetimeIndex*, *date_range*, *reindex*, *regular series*.
