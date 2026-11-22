---
title: 'Rolling averages'
summary: 'Smooth a noisy daily series with rolling windows: 7-day and 28-day averages, rolling sums, time-based windows, centred windows for history, expanding totals, and exponentially weighted averages.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'Why use a 7-day rolling average on daily sales?'
    choices: ['It cancels the weekly pattern so the trend shows', 'It removes all noise', 'It forecasts next week']
    ans: 0
    why: 'Every 7-day window holds each weekday once (Statistics Lesson 8.4).'
  - q: 'What are the first 6 values of rolling(7).mean()?'
    choices: ['NaN, because there are not yet 7 values', 'Zeros', 'The raw values']
    ans: 0
    why: 'Use min_periods= to allow shorter windows at the start.'
  - q: "What does rolling('7D') do differently from rolling(7)?"
    choices: ['Uses the last 7 calendar days, however many rows that is', 'Nothing', 'Uses 7 weeks']
    ans: 0
    why: 'A time-based window works even when some days are missing.'
---

**Module 7 · about 15 minutes · uses Lesson 7.1.** You'll be able to smooth daily KPIs and compute running totals.

## 1. rolling

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
daily = orders.groupby('date')['qty'].sum()
smooth = pd.DataFrame({
    'daily': daily,
    'avg_7d': daily.rolling(7).mean().round(1),
    'avg_28d': daily.rolling(28).mean().round(1),
    'sum_7d': daily.rolling(7).sum(),
})
smooth.loc['2025-11-20':'2025-12-05']
```

Each value is the mean of the current day and the 6 before it (a **trailing** window), so it lags the real change by about half a window. For charts of history, `rolling(7, center=True)` doesn't lag, but it needs future days, so it can't be used for the latest days or forecasts.

## 2. Windows by time, and running totals

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
s06 = orders[orders['store_id'] == 'S06'].groupby('date')['qty'].sum()   # some days missing
display(s06.rolling('7D').sum().head(10))                                  # last 7 calendar days
ytd = s06.loc['2026'].expanding().sum()                                    # year-to-date running total
ytd.tail(3)
```

`expanding()` is a window that grows from the start: running totals, running maximums. `.cumsum()` does the same for sums.

## 3. Exponential smoothing

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
daily = orders.groupby('date')['qty'].sum()
pd.DataFrame({'daily': daily, 'ewm': daily.ewm(alpha=0.3).mean().round(1)}).tail(7)
```

`ewm` weights recent days more (Statistics Lesson 8.5). `alpha` near 1 follows the data closely; near 0 is very smooth.

## 4. Your turn

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
daily = orders.groupby('date')['qty'].sum()
# Make avg_7d = 7-day rolling mean of daily. Show the date where avg_7d was highest (use idxmax).
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
daily = orders.groupby('date')['qty'].sum()
avg_7d = daily.rolling(7).mean()
avg_7d.idxmax()
```
```python check
exp = daily.rolling(7).mean().idxmax()
assert str(_)[:10] == str(exp)[:10], f'Expected {str(exp)[:10]}; take daily.rolling(7).mean().idxmax().'
```
```hint
daily.rolling(7).mean() gives the averages; .idxmax() gives the date of the highest.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** a rolling mean of k points averages away noise (its SD shrinks by about `$1/\sqrt{k}$`) at the cost of lag and lost detail. Choose k from the pattern you want to remove: 7 for a weekly cycle, 28 or 30 for a monthly view.

**Trailing mean at day t:**

```math
\bar y_t = \frac{1}{k}\sum_{j=0}^{k-1} y_{t-j}
```
</details>

## 5. Practice

1. A 28-day rolling sum of revenue.
2. Why does a trailing 7-day average turn late after a big change?
3. Running maximum of daily sales.

<details>
<summary>Answers</summary>

1. `daily.rolling(28).sum()` (or `rolling('28D')`).
2. On the day of the change only 1 of the 7 values reflects it; it takes a week for the window to fill with new values.
3. `daily.cummax()` or `daily.expanding().max()`.
</details>

**Try it on your own data:** [[time-series-analyser]] splits a series into trend and seasonal pattern.

**New words:** *rolling window*, *trailing*, *centred*, *expanding*, *year to date*, *ewm*.
