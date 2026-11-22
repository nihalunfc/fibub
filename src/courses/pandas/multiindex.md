---
title: 'MultiIndex without the fear'
summary: 'Understand the two-level row and column labels that groupby and pivot_table create, select from them with loc and xs, and flatten them back to plain columns when you are done.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'What is the easiest way to get rid of a MultiIndex on rows?'
    choices: ['reset_index()', 'drop()', 'sort_index()']
    ans: 0
    why: 'reset_index turns each index level into an ordinary column.'
  - q: "With rows indexed by (store, year), how do you pick store S01's 2026 row?"
    choices: ["df.loc[('S01', 2026)]", "df.loc['S01', '2026']", "df['S01'][2026]"]
    ans: 0
    why: 'A tuple gives one label per level.'
  - q: 'Columns are (revenue, sum), (revenue, mean). How do you flatten them to revenue_sum, revenue_mean?'
    choices: ["df.columns = ['_'.join(c) for c in df.columns]", 'df.flatten()', 'df.columns.drop()']
    ans: 0
    why: 'Join the parts of each column tuple into one name.'
sources:
  - 'pandas documentation, User Guide: MultiIndex / advanced indexing https://pandas.pydata.org/docs/user_guide/advanced.html'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 6 · about 15 minutes · uses Lesson 6.3.** You'll be able to read, select from and flatten tables with two-level labels.

<div class="bigidea">A MultiIndex is just two labels per row (or column), like a street and a house number. Select with a tuple, or flatten it into plain columns when you are done.</div>

**In everyday terms:** an address: the street alone gives a block of houses, street plus number gives one house. loc['S01'] is the street, loc[('S01', 'P101')] the house.

## 1. Where they come from

Grouping by two keys, or aggregating several columns with several functions, gives labels with two **levels**:

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['year'] = orders['date'].dt.year
t = orders.groupby(['store_id', 'year']).agg({'qty': ['sum', 'mean'], 'discount': ['mean']})
print(t.index.nlevels, 'row levels;', t.columns.nlevels, 'column levels')
t.head(4).round(3)
```

## 2. Selecting

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['year'] = orders['date'].dt.year
t = orders.groupby(['store_id', 'year']).agg({'qty': ['sum', 'mean']})
print(t.loc[('S01', 2026)])                 # one row: a tuple of labels
display(t.loc['S01'])                       # all years for S01
display(t.xs(2025, level='year'))           # every store, 2025 only
t[('qty', 'sum')].head(3)                   # one column: a tuple too
```

## 3. Flatten when done

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['year'] = orders['date'].dt.year
t = orders.groupby(['store_id', 'year']).agg({'qty': ['sum', 'mean']})
t.columns = ['_'.join(c) for c in t.columns]       # ('qty', 'sum') -> 'qty_sum'
t = t.reset_index()                                # store_id and year become columns
t.head()
```

Better still, avoid the column MultiIndex from the start with **named aggregations** (Lesson 4.2) and `as_index=False`.

<div class="meaning">

<dl>
<dt>Where it comes from</dt><dd>groupby on two columns, pivot_table with several values, set_index([a, b]).</dd>
<dt>df.loc['S01']</dt><dd>All rows under the outer label S01.</dd>
<dt>df.loc[('S01', 'P101')]</dt><dd>One row: both labels.</dd>
<dt>xs('P101', level='product')</dt><dd>All rows with that inner label, any outer.</dd>
<dt>Physical meaning</dt><dd>The labels are a sorted tree: outer level, then inner level inside each. Nothing new is stored; reset_index() turns the levels back into ordinary columns, the shape for joins and exports.</dd>
</dl>

</div>

<div class="myth">

**"MultiIndex is advanced, avoid it."** You meet it after every two-column groupby. Two moves cover nearly every case: loc with a tuple to select, reset_index() to flatten.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Two-column groupby.</b> <code>df.groupby(['store', 'product'])['qty'].sum()</code></div>
<div class="step"><b>Result: two labels per row.</b> <table class="lk-tbl"><tr><th>store</th><th>product</th><th>qty</th></tr><tr><td><mark>S01</mark></td><td>P101</td><td>5</td></tr><tr><td></td><td>P102</td><td>2</td></tr><tr><td>S02</td><td>P101</td><td>3</td></tr></table></div>
<div class="step"><b>Outer label.</b> <code>.loc['S01']</code> → P101 5, P102 2.</div>
<div class="step"><b>Both labels.</b> <code>.loc[('S02', 'P101')]</code> → 3.</div>
<div class="step"><b>Flatten.</b> <code>.reset_index()</code><table class="lk-tbl"><tr><th></th><th>store</th><th>product</th><th>qty</th></tr><tr><td>0</td><td>S01</td><td>P101</td><td>5</td></tr><tr><td>1</td><td><mark>S01</mark></td><td>P102</td><td>2</td></tr><tr><td>2</td><td>S02</td><td>P101</td><td>3</td></tr></table></div>
</div>

<div class="problem" data-problem="pd-multi-loc"></div>

## 4. Your turn

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
t = orders.groupby(['store_id', 'product_id'])['qty'].sum()
# Show the total qty of product P101 at store S03, using loc with a tuple.
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv')
t = orders.groupby(['store_id', 'product_id'])['qty'].sum()
t.loc[('S03', 'P101')]
```
```python check
exp = orders[(orders['store_id'] == 'S03') & (orders['product_id'] == 'P101')]['qty'].sum()
assert _ == exp, f"Expected {exp}; use t.loc[('S03', 'P101')]."
```
```hint
A two-level index takes a tuple: t.loc[('S03', 'P101')].
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** a MultiIndex is a list of label tuples, sorted level by level, so pandas can jump to "all rows for S01" quickly. It's compact for display and for `unstack`, but plain columns are easier for joins, filters and saving. A good habit: use MultiIndex while reshaping, then `reset_index()` before the next step.
</details>

## 5. Practice

1. How do you list the values of the second index level?
2. Flatten columns `('sales', 'sum')` style into `sales_sum`.
3. Select all stores for 2026 from a (store, year) index.

<details>
<summary>Answers</summary>

1. `t.index.get_level_values(1).unique()` (or by name).
2. `t.columns = ['_'.join(map(str, c)) for c in t.columns]`.
3. `t.xs(2026, level='year')`.
</details>

**New words:** *MultiIndex*, *level*, *tuple label*, *xs*, *flatten*.

<div class="keypoints">

- Two-column groupby and pivot_table make MultiIndexes.
- loc[outer] for a block; loc[(outer, inner)] for one row.
- xs(value, level=...) selects by an inner label.
- reset_index() flattens back to plain columns.

</div>
