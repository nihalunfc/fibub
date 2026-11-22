---
title: 'Long to wide with pivot, stack and unstack'
summary: 'Reshape long tables into wide ones with pivot (no aggregation) and move index levels between rows and columns with stack and unstack; know when pivot fails and pivot_table is needed.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'pivot raises "Index contains duplicate entries". Why?'
    choices: ['Some row/column pair has more than one value, and pivot cannot choose; use pivot_table with an aggfunc', 'The table is too big', 'A column is text']
    ans: 0
    why: 'pivot only rearranges; pivot_table also combines duplicates.'
  - q: 'What does unstack() do to a Series with a two-level index (store, year)?'
    choices: ['Moves the inner level (year) into columns', 'Sorts it', 'Drops a level']
    ans: 0
    why: 'unstack moves the last index level to the columns; stack does the reverse.'
  - q: 'After a groupby on two keys, which turns the result into a store × year grid?'
    choices: ['.unstack()', '.stack()', '.melt()']
    ans: 0
    why: 'The groupby result has a two-level index; unstack spreads the second level across.'
sources:
  - 'pandas documentation, User Guide: Reshaping and pivot tables https://pandas.pydata.org/docs/user_guide/reshaping.html'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 6 · about 15 minutes · uses Lessons 6.1 and 6.2.** You'll be able to move data between long and wide shapes in both directions.

<div class="bigidea">pivot spreads a long table back into a grid without adding anything up; unstack moves an index level into the columns, and stack moves it back.</div>

**In everyday terms:** folding a long receipt into a card: the same lines, laid out in a grid. Unfold it again and nothing is lost.

## 1. pivot: rearrange without combining

```python
import pandas as pd

long = pd.DataFrame({'store': ['S01', 'S01', 'S02', 'S02'], 'year': [2025, 2026, 2025, 2026], 'sales': [9100, 8800, 7200, 7300]})
long.pivot(index='store', columns='year', values='sales')
```

`pivot` only moves values; each (index, column) pair must appear **once**. If a pair repeats, it raises an error, and you need `pivot_table` with an `aggfunc` to decide how to combine them:

```python error
import pandas as pd

long = pd.DataFrame({'store': ['S01', 'S01', 'S01'], 'year': [2025, 2025, 2026], 'sales': [100, 50, 80]})
long.pivot(index='store', columns='year', values='sales')
```

## 2. stack and unstack


```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
s = orders.groupby([orders['store_id'], orders['date'].dt.year])['qty'].sum()
print(s.head(4))
grid = s.unstack()          # year moves to the columns
display(grid)
grid.stack().head(4)        # and back
```

`unstack(level=0)` moves the outer level instead; `unstack(fill_value=0)` fills gaps.

<div class="meaning">

<dl>
<dt>df.pivot(index, columns, values)</dt><dd>Reshapes; fails if a row/column pair appears twice.</dd>
<dt>pivot_table</dt><dd>Use instead when pairs repeat: it aggregates them.</dd>
<dt>unstack()</dt><dd>Moves the innermost row label into the columns.</dd>
<dt>stack()</dt><dd>Moves the columns back into the innermost row label.</dd>
<dt>Physical meaning</dt><dd>pivot, stack and unstack only move cells around: the same numbers in a different arrangement. If two rows claim the same cell, pivot refuses, because putting both in one cell would mean adding or choosing, which is pivot_table's job.</dd>
</dl>

</div>

<div class="myth">

**"pivot and pivot_table are interchangeable."** pivot errors on duplicate pairs ("Index contains duplicate entries") instead of summing. That error is useful: it tells you the data has a grain you did not expect.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>A groupby result (two row labels).</b> <table class="lk-tbl"><tr><th>store</th><th>qty</th><th>lines</th></tr><tr><td>S01</td><td>1</td><td>4</td></tr><tr><td>S01</td><td>2</td><td>2</td></tr><tr><td>S02</td><td>1</td><td>3</td></tr></table></div>
<div class="step"><b>unstack('qty').</b> The qty labels move across the top.</div>
<div class="step"><b>Result.</b> <table class="lk-tbl"><tr><th>store</th><th>1</th><th>2</th></tr><tr><td>S01</td><td>4</td><td>2</td></tr><tr><td>S02</td><td>3</td><td><mark>NaN</mark></td></tr></table></div>
<div class="step"><b>Fill.</b> <code>.unstack(fill_value=0)</code> puts 0 where S02 had no qty-2 lines.</div>
<div class="step"><b>stack()</b> goes back to three rows (the empty cell is dropped).</div>
</div>

<div class="problem" data-problem="pd-unstack-cells"></div>

Drag the slider between wide and long, or press Play, and follow one number as it moves.

<figure class="fig" data-fig="@data-reshape"><figcaption>Notice that no value changes, only its position: month names become values in a column.</figcaption></figure>


## 3. Your turn

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
# Count order lines by store_id and qty with groupby + size, then unstack qty into columns (fill gaps with 0). Show it.
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv')
orders.groupby(['store_id', 'qty']).size().unstack(fill_value=0)
```
```python check
assert isinstance(_, pd.DataFrame) and _.shape[0] == 7, 'One row per store.'
assert int(_.values.sum()) == len(orders), 'The grid should count every order line once.'
```
```hint
orders.groupby(['store_id', 'qty']).size() gives a two-level Series; .unstack(fill_value=0) spreads qty across.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** a DataFrame is a grid indexed by row labels and column labels. **stack** moves the column labels into the innermost row index (wide → long); **unstack** moves the innermost row index into the column labels (long → wide). `pivot` is `set_index([index, columns])[values].unstack()`; `melt` is roughly `set_index(ids).stack()` with the names reset.

| Want | Use |
|---|---|
| long → wide, one value per cell | `pivot` |
| long → wide, combining duplicates | `pivot_table` |
| wide → long | `melt` (or `stack`) |
| move an index level | `stack` / `unstack` |
</details>

## 4. Practice

1. When does `pivot` fail?
2. Turn a `groupby(['category', 'month'])['revenue'].sum()` into a category × month grid.
3. What does `stack` do to a store × year grid?

<details>
<summary>Answers</summary>

1. When an (index, columns) pair appears more than once.
2. `.unstack()` (with `fill_value=0` if needed).
3. Makes it long again: a Series indexed by (store, year).
</details>

**New words:** *pivot*, *stack*, *unstack*, *index level*.

<div class="keypoints">

- pivot reshapes long to wide; it never aggregates.
- Duplicate pairs: use pivot_table (or fix the grain).
- unstack moves a row level to columns; stack moves it back.
- fill_value=0 fills cells with no rows, when zero is true.

</div>
