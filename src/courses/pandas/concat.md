---
title: 'Stacking tables with concat'
summary: 'Stack tables with the same columns on top of each other (monthly files into one), or side by side, with pd.concat; label where each row came from, and avoid the traps of mismatched columns and repeated index labels.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'You have twelve monthly sales files with the same columns. How do you combine them?'
    choices: ['pd.concat([jan, feb, ...], ignore_index=True)', 'pd.merge(jan, feb)', 'jan + feb']
    ans: 0
    why: 'concat stacks rows; merge matches rows on a key; + adds values cell by cell.'
  - q: 'One file has a column the others lack. What does concat do?'
    choices: ['Raises an error', 'Keeps the column and fills NaN for rows from the other files', 'Drops the column']
    ans: 1
    why: "concat takes the union of columns by default (join='outer')."
  - q: 'Why use ignore_index=True?'
    choices: ['To number the stacked rows 0 to n−1 instead of repeating each file''s 0, 1, 2…', 'To drop duplicates', 'To sort the rows']
    ans: 0
    why: 'Repeated index labels make loc ambiguous later.'
sources:
  - 'pandas documentation, User Guide: Merge, join, concatenate and compare https://pandas.pydata.org/docs/user_guide/merging.html'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 5 · about 15 minutes · uses Lesson 1.4.** You'll be able to combine tables that share columns into one.

<div class="bigidea">concat stacks tables that describe the same kind of thing: same columns, more rows. Label where each row came from so you can still tell the pieces apart.</div>

**In everyday terms:** putting this month's till rolls on top of last month's. The paper is the same shape, so the pile is just longer; write the month on each roll before you stack it.

## 1. Stack rows

```python
import pandas as pd

jan = pd.DataFrame({'store': ['S01', 'S02'], 'sales': [5200, 3800]})
feb = pd.DataFrame({'store': ['S01', 'S02', 'S03'], 'sales': [4900, 4100, 2300]})
both = pd.concat([jan, feb], keys=['2026-01', '2026-02'], names=['month', None]).reset_index(level='month')
both = both.reset_index(drop=True)
both
```

`keys=` labels which table each row came from; the `reset_index` steps turn that label into a normal `month` column and renumber the rows.


## 2. Many files at once

On your own computer, a folder of monthly CSVs becomes one table with a list:

```py
from pathlib import Path
files = sorted(Path('exports').glob('sales_2026-*.csv'))
sales = pd.concat([pd.read_csv(f).assign(source=f.name) for f in files], ignore_index=True)
```

Here the data is already one file, so split it and put it back together to see it work:

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
parts = [g.assign(month=m) for m, g in orders.groupby(orders['date'].dt.to_period('M'))]
print(len(parts), 'monthly tables')
again = pd.concat(parts, ignore_index=True)
print(len(again) == len(orders))
again[['order_id', 'date', 'month']].tail(3)
```

Switch between the four operations and add ids to either list to see how duplicates are handled.

<figure class="fig" data-fig="@data-set-ops"><figcaption>Notice that UNION removes duplicates, UNION ALL keeps them, and EXCEPT depends on which list comes first.</figcaption></figure>


## 3. Mismatched columns

```python
import pandas as pd

a = pd.DataFrame({'store': ['S01'], 'sales': [100]})
b = pd.DataFrame({'store': ['S02'], 'sales': [80], 'returns': [3]})
display(pd.concat([a, b], ignore_index=True))               # union of columns, NaN where missing
pd.concat([a, b], ignore_index=True, join='inner')          # only the shared columns
```

If column names differ only in spelling (`Sales` vs `sales`), clean the names first (Lesson 2.1), or the "same" column appears twice.

**Side by side:** `pd.concat([df1, df2], axis=1)` puts columns next to each other, matched by **index**. For matching on a key column, use `merge` (next lesson).

<div class="meaning">

<dl>
<dt>pd.concat([a, b])</dt><dd>Puts b's rows under a's; columns are matched by name.</dd>
<dt>ignore_index=True</dt><dd>Numbers the new table 0, 1, 2... instead of repeating the old labels.</dd>
<dt>keys=[...] or a new column</dt><dd>Records which piece each row came from.</dd>
<dt>axis=1</dt><dd>Places tables side by side, matched on the index.</dd>
<dt>Physical meaning</dt><dd>Stacking only adds rows: nothing is matched or combined, so row counts simply add. A column missing from one piece is filled with NaN, which is pandas telling you the pieces were not quite the same shape.</dd>
</dl>

</div>

<div class="myth">

**"concat and merge do the same thing."** concat glues tables along an edge without looking at any key. merge matches rows by a key. Stacking two months is concat; adding customer names to orders is merge.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Two monthly tables.</b> January <table class="lk-tbl"><tr><th>store</th><th>qty</th></tr><tr><td>S01</td><td>3</td></tr><tr><td>S02</td><td>5</td></tr></table> February <table class="lk-tbl"><tr><th>store</th><th>qty</th></tr><tr><td>S01</td><td>4</td></tr><tr><td>WEB</td><td>2</td></tr></table></div>
<div class="step"><b>Label them.</b> <code>jan.assign(month='Jan')</code>, <code>feb.assign(month='Feb')</code>.</div>
<div class="step"><b>Stack.</b> <code>pd.concat([jan, feb], ignore_index=True)</code><table class="lk-tbl"><tr><th></th><th>store</th><th>qty</th><th>month</th></tr><tr><td>0</td><td>S01</td><td>3</td><td>Jan</td></tr><tr><td>1</td><td>S02</td><td>5</td><td>Jan</td></tr><tr><td><mark>2</mark></td><td><mark>S01</mark></td><td><mark>4</mark></td><td><mark>Feb</mark></td></tr><tr><td><mark>3</mark></td><td><mark>WEB</mark></td><td><mark>2</mark></td><td><mark>Feb</mark></td></tr></table></div>
<div class="step"><b>Check.</b> 2 + 2 = 4 rows; total qty 8 + 6 = 14.</div>
<div class="step"><b>A column only in one piece?</b> It appears for all rows, with NaN where that piece had nothing.</div>
</div>

<div class="problem" data-problem="pd-concat-rows"></div>

## 4. Your turn

```python exercise
import pandas as pd

north = pd.DataFrame({'store': ['S01', 'S02'], 'sales': [500, 420]})
south = pd.DataFrame({'store': ['S05', 'S06'], 'sales': [610, 280]})
# Stack north and south into one table called all_stores with index 0..3, and add a 'region' column
# ('north' or 'south'). Show it.
```
```python solution
import pandas as pd

north = pd.DataFrame({'store': ['S01', 'S02'], 'sales': [500, 420]})
south = pd.DataFrame({'store': ['S05', 'S06'], 'sales': [610, 280]})
all_stores = pd.concat([north.assign(region='north'), south.assign(region='south')], ignore_index=True)
all_stores
```
```python check
assert 'all_stores' in dir() and len(all_stores) == 4, 'Make all_stores with 4 rows.'
assert list(all_stores.index) == [0, 1, 2, 3], 'Use ignore_index=True.'
assert list(all_stores['region']) == ['north', 'north', 'south', 'south'], "Add region with assign(region='north') etc."
```
```hint
pd.concat([north.assign(region='north'), south.assign(region='south')], ignore_index=True)
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** `concat` lines tables up by **column name** (stacking rows) or by **index** (side by side). It never looks at the values. That's the difference from `merge`, which matches rows by the values in a key column. In SQL terms, stacking rows is `UNION ALL`.

**Speed:** collect pieces in a list and call `concat` once. Calling it inside a loop copies the growing table every time and gets slow.
</details>

## 5. Practice

1. Stack 2025 and 2026 tables and keep a `year` column.
2. What does `join='inner'` do in `concat`?
3. Why not `concat` inside a loop?

<details>
<summary>Answers</summary>

1. `pd.concat([t25.assign(year=2025), t26.assign(year=2026)], ignore_index=True)`.
2. Keeps only the columns that every table has.
3. Each call copies everything so far; build a list and concat once.
</details>

**New words:** *concat*, *stack*, *ignore_index*, *keys*, *union of columns*.

<div class="keypoints">

- concat stacks tables with the same columns; rows add up.
- Use ignore_index=True for a clean 0, 1, 2... index.
- Add a column (or keys=) saying where each row came from.
- NaN after concat means a column was missing from one piece: check the names.

</div>
