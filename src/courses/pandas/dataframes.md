---
title: 'DataFrames: a table in Python'
summary: 'A DataFrame is a table of named columns sharing one index. Build one from a dictionary, look at its shape, columns and dtypes, pick a column, and add one.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: "df['qty'] returns what?"
    choices: ['A DataFrame with one column', 'A Series', 'A list']
    ans: 1
    why: "One name in single brackets gives a Series. df[['qty']] (a list inside) gives a one-column DataFrame."
  - q: 'df.shape is (9717, 8). What does that mean?'
    choices: ['9,717 columns and 8 rows', '9,717 rows and 8 columns', '9,717 cells']
    ans: 1
    why: 'shape is (rows, columns).'
  - q: "How do you add a column 'total' = qty × price?"
    choices: ["df.total = qty * price", "df['total'] = df['qty'] * df['unit_price']", "df.add('total')"]
    ans: 1
    why: 'Assign a Series to a new column name in square brackets.'
sources:
  - 'pandas documentation, User Guide: Intro to data structures https://pandas.pydata.org/docs/user_guide/dsintro.html'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 1 · about 15 minutes · uses Lesson 1.3.** You'll be able to build a DataFrame, describe its structure, and add a column.

<div class="bigidea">A DataFrame is a table of Series that share one index: pick a column and you get a Series back, add a Series and you get a new column.</div>

**In everyday terms:** a filing cabinet where each drawer is a column and each folder position is a row label. Pull out one drawer (a column), or look across all drawers at one position (a row).

## 1. Columns that share an index

A **DataFrame** is a table: named columns (each a Series), all sharing one index of row labels. The quickest way to make a small one is a dictionary of lists.

```python
import pandas as pd

df = pd.DataFrame({
    'store': ['Harbourview', 'Maple Ridge', 'Cedar Falls', 'Pine Lake'],
    'province': ['Ontario', 'Ontario', 'Ontario', 'Quebec'],
    'sales': [52000, 38500, 21900, 30400],
    'staff': [24, 17, 9, 14],
})
df
```

## 2. Its structure

```python
import pandas as pd

df = pd.DataFrame({
    'store': ['Harbourview', 'Maple Ridge', 'Cedar Falls', 'Pine Lake'],
    'sales': [52000, 38500, 21900, 30400],
    'staff': [24, 17, 9, 14],
})
print('shape:', df.shape)             # (rows, columns)
print('columns:', list(df.columns))
print(df.dtypes)                      # one type per column
```

`str` means text (pandas 3 stores text as its own string type), `int64` whole numbers, `float64` decimals.

Step through the chain one link at a time and watch the shape change.

<div class="steps" data-fig="@data-chain-pipeline">
<div class="step">Start: the raw DataFrame.</div>
<div class="step">query: fewer rows, same columns.</div>
<div class="step">assign: one new column, same rows.</div>
<div class="step">groupby and sum: many rows collapse to one per region.</div>
<div class="step">sort_values: same rows, new order.</div>
<div class="step">head: only the top rows are kept.</div>
</div>


## 3. A column in, a column out

```python
import pandas as pd

df = pd.DataFrame({
    'store': ['Harbourview', 'Maple Ridge', 'Cedar Falls', 'Pine Lake'],
    'sales': [52000, 38500, 21900, 30400],
    'staff': [24, 17, 9, 14],
})
df['sales_per_staff'] = (df['sales'] / df['staff']).round(0)
print(df['sales'].sum())
df
```

`df['sales']` is a Series, so everything from the last lesson works on it. Assigning to a new name adds a column.

<div class="meaning">

<dl>
<dt>df.shape</dt><dd>(rows, columns).</dd>
<dt>df.columns, df.index</dt><dd>Column names and row labels.</dd>
<dt>df['qty']</dt><dd>One column as a Series.</dd>
<dt>df['total'] = ...</dt><dd>A new column, computed for every row.</dd>
<dt>Physical meaning</dt><dd>Each row is one thing (an order line), each column one fact about it (qty, price). Keeping that shape is what lets every later step, from grouping to joining, work.</dd>
</dl>

</div>

<div class="myth">

**"df['qty'] and df[['qty']] are the same."** One bracket gives a Series (one column of values); two brackets give a DataFrame with one column. Some methods need one, some the other.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>A table.</b> <table class="lk-tbl"><tr><th></th><th>store</th><th>qty</th><th>price</th></tr><tr><td>0</td><td>S01</td><td>2</td><td>18.99</td></tr><tr><td>1</td><td>WEB</td><td>1</td><td>24.99</td></tr><tr><td>2</td><td>S01</td><td>3</td><td>4.5</td></tr></table></div>
<div class="step"><b>Shape.</b> 3 rows, 3 columns.</div>
<div class="step"><b>A column out.</b> <code>df['qty']</code> → the Series 2, 1, 3.</div>
<div class="step"><b>A column in.</b> <code>df['total'] = df['qty'] * df['price']</code><table class="lk-tbl"><tr><th></th><th>store</th><th>qty</th><th>price</th><th>total</th></tr><tr><td>0</td><td>S01</td><td>2</td><td>18.99</td><td><mark>37.98</mark></td></tr><tr><td>1</td><td>WEB</td><td>1</td><td>24.99</td><td><mark>24.99</mark></td></tr><tr><td>2</td><td>S01</td><td>3</td><td>4.5</td><td><mark>13.5</mark></td></tr></table></div>
</div>

<div class="problem" data-problem="pd-df-total"></div>

## 4. Your turn

```python exercise
import pandas as pd

df = pd.DataFrame({
    'product': ['Coffee beans', 'Olive oil', 'Pasta', 'Granola'],
    'price': [18.99, 12.49, 2.29, 6.99],
    'cost': [13.67, 8.99, 1.65, 5.03],
})
# Add a column 'margin' = price minus cost, then show df.
```
```python solution
import pandas as pd

df = pd.DataFrame({
    'product': ['Coffee beans', 'Olive oil', 'Pasta', 'Granola'],
    'price': [18.99, 12.49, 2.29, 6.99],
    'cost': [13.67, 8.99, 1.65, 5.03],
})
df['margin'] = df['price'] - df['cost']
df
```
```python check
assert 'margin' in df.columns, "Add a column called 'margin'."
assert abs(df['margin'].sum() - 11.42) < 0.01, 'margin should be price minus cost for each row.'
```
```hint
df['margin'] = df['price'] - df['cost']
```

```python exercise
import pandas as pd

df = pd.DataFrame({'store': ['A', 'B', 'C'], 'sales': [500, 800, 650], 'staff': [5, 10, 5]})
# Show the number of rows using df.shape (it's the first number).
```
```python solution
import pandas as pd

df = pd.DataFrame({'store': ['A', 'B', 'C'], 'sales': [500, 800, 650], 'staff': [5, 10, 5]})
df.shape[0]
```
```python check
assert _ == 3, 'Show df.shape[0] (or len(df)) on the last line.'
```
```hint
df.shape is a pair (rows, columns); [0] takes the first item. len(df) works too.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** a DataFrame is a set of Series (columns) glued to one shared index. Column operations are vectorised; row-by-row work is slow and rarely needed.

**Picking columns:** `df['sales']` (one name) gives a Series; `df[['store', 'sales']]` (a list of names) gives a DataFrame. `df.sales` also works for simple names, but brackets always work, even for names with spaces, so this course uses them.

**Copy-on-write (pandas 3):** taking part of a DataFrame and changing it never changes the original by accident. To change the original, assign to it directly (`df['x'] = ...` or `df.loc[...] = ...`).
</details>

## 5. Practice

1. How do you list a DataFrame's column names?
2. What's the difference between `df['sales']` and `df[['sales']]`?
3. Write the code to add `df['sales_k']` with sales in thousands.

<details>
<summary>Answers</summary>

1. `list(df.columns)` (or `df.columns`).
2. The first is a Series; the second is a DataFrame with one column.
3. `df['sales_k'] = df['sales'] / 1000`.
</details>

**New words:** *DataFrame*, *column*, *shape*, *dtypes*, *copy-on-write*.

<div class="keypoints">

- A DataFrame is columns (Series) sharing one index.
- df['col'] gives a Series; df[['a', 'b']] gives a DataFrame.
- Assigning to a new name adds a column computed for every row.
- shape, columns, index and dtypes describe the structure.

</div>
