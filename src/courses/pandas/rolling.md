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
sources:
  - 'pandas documentation, User Guide: Windowing operations https://pandas.pydata.org/docs/user_guide/window.html'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 7 · about 15 minutes · uses Lesson 7.1.** You'll be able to smooth daily KPIs and compute running totals.

<div class="bigidea">A rolling average replaces each day by the average of the last few days, so day-to-day noise cancels and the trend shows.</div>

**In everyday terms:** judging a café by its last seven days instead of today alone: one rainy Tuesday no longer looks like a disaster.

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

Slide the window size and switch between trailing and centred.

<figure class="fig" data-fig="@data-rolling-window"><figcaption>Notice that a bigger window is smoother but later, and where the NaN values appear.</figcaption></figure>


## 3. Exponential smoothing

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
daily = orders.groupby('date')['qty'].sum()
pd.DataFrame({'daily': daily, 'ewm': daily.ewm(alpha=0.3).mean().round(1)}).tail(7)
```

`ewm` weights recent days more (Statistics Lesson 8.5). `alpha` near 1 follows the data closely; near 0 is very smooth.

<div class="meaning">

<dl>
<dt>rolling(7).mean()</dt><dd>Average of this row and the 6 before it.</dd>
<dt>First rows NaN</dt><dd>Until 7 rows exist; min_periods= relaxes that.</dd>
<dt>rolling('7D')</dt><dd>A window by time, safe when days are missing.</dd>
<dt>cumsum() / ewm(span=7)</dt><dd>Running total; a smoother that weights recent days more.</dd>
<dt>Physical meaning</dt><dd>A 7-day window covers each weekday exactly once, so weekly patterns cancel and only the trend remains. The price: the average lags, responding to a real change a few days late.</dd>
</dl>

</div>

<div class="myth">

**"A rolling average shows today's value."** It shows the last week's average, centred about 3 days back. A sudden drop takes a week to show fully.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Daily sales.</b> <table class="lk-tbl"><tr><th>day</th><th>sales</th></tr><tr><td>1</td><td>10</td></tr><tr><td>2</td><td>14</td></tr><tr><td>3</td><td>9</td></tr><tr><td>4</td><td>15</td></tr><tr><td>5</td><td>12</td></tr></table></div>
<div class="step"><b>Window of 3.</b> <code>s.rolling(3).mean()</code>; days 1-2 have no full window: NaN.</div>
<div class="step"><b>Day 3.</b> (10 + 14 + 9) ÷ 3 = 11.</div>
<div class="step"><b>Slide.</b> Day 4: (14 + 9 + 15) ÷ 3 = 12.67; day 5: (9 + 15 + 12) ÷ 3 = 12.</div>
<div class="step"><b>Result.</b> <table class="lk-tbl"><tr><th>day</th><th>sales</th><th>roll3</th></tr><tr><td>1</td><td>10</td><td>NaN</td></tr><tr><td>2</td><td>14</td><td>NaN</td></tr><tr><td>3</td><td>9</td><td><mark>11.0</mark></td></tr><tr><td>4</td><td>15</td><td><mark>12.67</mark></td></tr><tr><td>5</td><td>12</td><td><mark>12.0</mark></td></tr></table></div>
</div>

<div class="problem" data-problem="pd-rolling-mean"></div>

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

<div class="keypoints">

- rolling(n).mean() averages the current row and the n − 1 before it.
- The first n − 1 rows are NaN unless you set min_periods.
- Use a 7-day window for daily data with a weekly pattern.
- cumsum() for running totals; ewm() for recent-weighted smoothing.

</div>
