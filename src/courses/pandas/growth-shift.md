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
sources:
  - 'pandas documentation, User Guide: pandas.Series.pct_change https://pandas.pydata.org/docs/reference/api/pandas.Series.pct_change.html'
  - 'Hyndman, R. J. and Athanasopoulos, G. (2021), Forecasting: Principles and Practice, 3rd edition https://otexts.com/fpp3/'
---

**Module 7 · about 20 minutes · uses Lesson 7.2.** You'll be able to compute period-over-period and year-over-year growth correctly.

<div class="bigidea">Growth compares a period with an earlier one: shift moves a series down by some rows so you can divide this month by last month, or by the same month last year.</div>

**In everyday terms:** laying this year's calendar over last year's, one month offset or twelve months offset, and comparing the boxes that line up.

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

Slide the window size and switch between trailing and centred.

<figure class="fig" data-fig="@data-rolling-window"><figcaption>Notice that a bigger window is smoother but later, and where the NaN values appear.</figcaption></figure>


## 3. Traps

- **Missing periods:** `shift(12)` means "12 rows back". If a month is missing, it compares with the wrong month. Make the series regular first (Lesson 7.1).
- **Partial periods:** comparing this month so far with all of last month looks like a fall. Compare the same number of days (month-to-date vs the same days last year).
- **Small bases:** +300 % from 2 to 8 sales is noise. Show the counts beside the percentages.
- **Averaging growth rates:** +50 % then −50 % is not 0; it's −25 % overall. Compound growth uses the geometric mean.

<div class="meaning">

<dl>
<dt>shift(1)</dt><dd>Each row gets the previous row's value.</dd>
<dt>pct_change()</dt><dd>(this − previous) ÷ previous: growth as a share.</dd>
<dt>pct_change(12)</dt><dd>Year over year on monthly data.</dd>
<dt>groupby('store')[...].pct_change()</dt><dd>Growth within each store, never across stores.</dd>
<dt>Physical meaning</dt><dd>Growth is a ratio, so it depends on the base: from 10 to 20 is +100 %, from 20 to 10 is −50 %. Year over year compares like with like (December with December) and cancels the season.</dd>
</dl>

</div>

<div class="myth">

**"+50 % then −50 % gets you back where you started."** 100 → 150 → 75. Percentages compound on a changing base; work with the values, then compute the growth.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Monthly revenue.</b> <table class="lk-tbl"><tr><th>month</th><th>revenue</th></tr><tr><td>Jan</td><td>200</td></tr><tr><td>Feb</td><td>250</td></tr><tr><td>Mar</td><td>225</td></tr></table></div>
<div class="step"><b>shift(1).</b> <table class="lk-tbl"><tr><th>month</th><th>revenue</th><th>prev</th></tr><tr><td>Jan</td><td>200</td><td>NaN</td></tr><tr><td>Feb</td><td>250</td><td><mark>200</mark></td></tr><tr><td>Mar</td><td>225</td><td><mark>250</mark></td></tr></table></div>
<div class="step"><b>Divide.</b> Feb: 250 ÷ 200 − 1 = +25 %. Mar: 225 ÷ 250 − 1 = −10 %.</div>
<div class="step"><b>One call.</b> <code>s.pct_change()</code> gives NaN, 0.25, −0.10.</div>
<div class="step"><b>Per store.</b> Sort by date first, then <code>groupby('store')['revenue'].pct_change()</code>.</div>
</div>

<div class="problem" data-problem="pd-pct-change"></div>

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

<div class="keypoints">

- shift(n) lines a row up with the one n periods earlier.
- pct_change() = this ÷ previous − 1.
- Year over year on monthly data: pct_change(12).
- Sort by date and group by store before shifting.

</div>
