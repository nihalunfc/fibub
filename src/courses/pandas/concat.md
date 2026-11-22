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
---

**Module 5 · about 15 minutes · uses Lesson 1.4.** You'll be able to combine tables that share columns into one.

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

<!--anim:concat-anim (table animation, added once the shared tableviz engine is on main)-->

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
