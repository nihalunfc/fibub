---
title: 'Pivot tables'
summary: 'Build Excel-style pivot tables in pandas with pivot_table: rows, columns, values and an aggregation, plus totals, several measures, missing cells filled with zero, and percentages of a row or column.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: "In pivot_table(index='store_id', columns='year', values='revenue', aggfunc='sum'), what is in each cell?"
    choices: ['Total revenue for that store in that year', 'The number of orders', 'The average revenue']
    ans: 0
    why: 'index makes the rows, columns the columns, and aggfunc combines the values in each cell.'
  - q: 'What does margins=True add?'
    choices: ['Row and column totals ("All")', 'Wider columns', 'Percentages']
    ans: 0
    why: 'Like grand totals in an Excel pivot.'
  - q: 'Some store-month cells have no sales and show NaN. How do you show 0?'
    choices: ['fill_value=0', 'dropna=True', 'aggfunc=0']
    ans: 0
    why: 'fill_value fills empty cells after aggregating.'
sources:
  - 'pandas documentation, User Guide: Reshaping and pivot tables https://pandas.pydata.org/docs/user_guide/reshaping.html'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 6 · about 20 minutes · uses Lesson 4.2.** You'll be able to build pivot tables like the ones in Excel, in one line.

<div class="bigidea">A pivot table is a groupby by two things at once, laid out as a grid: one set of labels down the side, another across the top, a summary in each cell.</div>

**In everyday terms:** a school timetable: days across the top, periods down the side, and each cell answers one question (which class?). A pivot answers "how much?" in each cell.

## 1. Rows × columns × values


```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
orders['year'] = orders['date'].dt.year
pd.pivot_table(orders, index='store_id', columns='year', values='revenue', aggfunc='sum').round(0)
```

Excel's pivot fields map one to one: **Rows** → `index`, **Columns** → `columns`, **Values** → `values`, **Summarise by** → `aggfunc`.

## 2. Totals, zeros and several measures

```python data=orders.csv,products.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date']).merge(pd.read_csv('products.csv')[['product_id', 'category']], on='product_id')
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
orders['quarter'] = orders['date'].dt.to_period('Q').astype(str)
pt = orders.pivot_table(index='category', columns='quarter', values='revenue', aggfunc='sum',
                        fill_value=0, margins=True, margins_name='Total')
pt.round(0)
```

Several measures at once: `values=['revenue', 'qty'], aggfunc={'revenue': 'sum', 'qty': 'mean'}`. The result has two-level column names (Lesson 6.4).

## 3. Percentages

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
orders['weekday'] = orders['date'].dt.day_name().str[:3]
pt = orders.pivot_table(index='store_id', columns='weekday', values='revenue', aggfunc='sum')
pt = pt[['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']]                 # calendar order
(pt.div(pt.sum(axis=1), axis=0) * 100).round(1)                           # % of each store's week
```

`div(..., axis=0)` divides each row by its own total: row percentages. Each store's busiest day stands out.

<div class="meaning">

<dl>
<dt>index=</dt><dd>The labels down the side (rows).</dd>
<dt>columns=</dt><dd>The labels across the top.</dd>
<dt>values=, aggfunc=</dt><dd>What goes in each cell and how it is combined (sum, mean, count).</dd>
<dt>fill_value=0, margins=True</dt><dd>Zero for empty cells; an All row and column of totals.</dd>
<dt>Physical meaning</dt><dd>Each cell is the total of the rows that share that row label and column label. Add up a row of cells and you get that label's total; the grand total equals the plain sum of the column, so the pivot only rearranges, never invents.</dd>
</dl>

</div>

<div class="myth">

**"An empty cell means zero."** By default it is NaN: no rows had that pair. Fill with 0 only when "no rows" really means "nothing sold", and remember the mean of an empty cell is not 0.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Long data.</b> <table class="lk-tbl"><tr><th>store</th><th>month</th><th>qty</th></tr><tr><td>S01</td><td>Jan</td><td><mark>3</mark></td></tr><tr><td>S01</td><td>Feb</td><td>4</td></tr><tr><td>S02</td><td>Jan</td><td>5</td></tr><tr><td>S01</td><td>Jan</td><td><mark>2</mark></td></tr></table></div>
<div class="step"><b>Pick the grid.</b> <code>index='store', columns='month', values='qty', aggfunc='sum'</code></div>
<div class="step"><b>S01, Jan.</b> Two rows: 3 + 2 = 5.</div>
<div class="step"><b>Result.</b> <table class="lk-tbl"><tr><th>store</th><th>Feb</th><th>Jan</th></tr><tr><td>S01</td><td>4</td><td><mark>5</mark></td></tr><tr><td>S02</td><td><mark>0</mark></td><td>5</td></tr></table> S02 had no February rows; fill_value=0 shows 0.</div>
<div class="step"><b>Check.</b> Cells add to 14 = the sum of qty.</div>
</div>

<div class="problem" data-problem="pd-pivot-cell"></div>

## 4. Your turn

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['month'] = orders['date'].dt.month
# Pivot: rows store_id, columns month, values qty, summed. Fill empty cells with 0. Show it.
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['month'] = orders['date'].dt.month
orders.pivot_table(index='store_id', columns='month', values='qty', aggfunc='sum', fill_value=0)
```
```python check
assert isinstance(_, pd.DataFrame) and _.shape == (7, 12), f'Expected 7 stores x 12 months, got {_.shape}.'
assert int(_.values.sum()) == int(orders['qty'].sum()), 'The cells should add up to the total qty.'
```
```hint
orders.pivot_table(index='store_id', columns='month', values='qty', aggfunc='sum', fill_value=0)
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** a pivot table is a groupby on two keys followed by an unstack: the second key moves from rows into columns. These give the same numbers:

```python data=orders.csv
import pandas as pd

o = pd.read_csv('orders.csv', parse_dates=['date'])
o['year'] = o['date'].dt.year
a = o.pivot_table(index='store_id', columns='year', values='qty', aggfunc='sum')
b = o.groupby(['store_id', 'year'])['qty'].sum().unstack()
a.equals(b)
```

Pivots are for **reading** (reports, comparisons across a row). For further analysis, the long shape is usually easier (Lesson 6.5).
</details>

## 5. Practice

1. Average discount by category (rows) and store (columns).
2. Count of distinct orders by store and year.
3. How do you put the weekday columns in calendar order?

<details>
<summary>Answers</summary>

1. `pivot_table(index='category', columns='store_id', values='discount', aggfunc='mean')`.
2. `pivot_table(index='store_id', columns='year', values='order_id', aggfunc='nunique')`.
3. Select them in order, `pt[['Mon', 'Tue', ...]]`, or make weekday an ordered category before pivoting.
</details>

**New words:** *pivot_table*, *index / columns / values*, *aggfunc*, *margins*, *fill_value*, *unstack*.

<div class="keypoints">

- pivot_table(index, columns, values, aggfunc) is a two-way groupby as a grid.
- fill_value=0 for empty cells only when that is the truth.
- margins=True adds totals; they should match a plain sum.
- Several values or aggfuncs give a two-level column header.

</div>
