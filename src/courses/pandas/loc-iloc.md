---
title: 'Rows and cells with loc and iloc'
summary: 'loc picks rows and columns by label, iloc by position. Read one cell, a block of rows and columns, rows matching a condition, and change values safely with loc.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: "df.iloc[0] gives what?"
    choices: ['The first row', 'The row labelled 0, wherever it is', 'The first column']
    ans: 0
    why: 'iloc counts positions from 0. loc[0] would look for the label 0.'
  - q: "How do you set discount to 0.1 for every row where store_id is 'S03'?"
    choices: ["df[df.store_id == 'S03']['discount'] = 0.1", "df.loc[df['store_id'] == 'S03', 'discount'] = 0.1", "df.iloc['S03'] = 0.1"]
    ans: 1
    why: 'loc[rows, column] = value changes the original in one step. The chained version changes a temporary copy (and pandas 3 never applies it).'
  - q: "Does df.loc[2:4] include row label 4?"
    choices: ['Yes: loc slices include the end label', 'No', 'Only with iloc']
    ans: 0
    why: 'Label slices include both ends; position slices (iloc[2:4]) stop before the end, like Python lists.'
---

**Module 2 · about 20 minutes · uses Lesson 2.1.** You'll be able to pick any rows and columns by label or position, and change values the right way.

## 1. loc: by label

`df.loc[rows, columns]`: say which rows and which columns, by their labels.

```python data=stores.csv
import pandas as pd

stores = pd.read_csv('stores.csv', index_col='store_id')   # use store_id as the row labels
print(stores.loc['S02', 'store'])                          # one cell
display(stores.loc[['S01', 'S05'], ['store', 'size']])     # chosen rows and columns
stores.loc['S02':'S04', :]                                 # a range of labels, all columns
```

`index_col='store_id'` made the ids the row labels, so `loc` can find a store by its id. Label slices like `'S02':'S04'` **include** the end.

## 2. iloc: by position

`df.iloc[rows, columns]`: positions counted from 0, like a Python list. The end of a slice is **not** included.

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
print(orders.iloc[0, 1])         # first row, second column
display(orders.iloc[:3, :4])     # first 3 rows, first 4 columns
orders.iloc[-2:]                 # the last 2 rows
```

Use `iloc` for "the first n" or "the last row"; use `loc` for everything with names, which keeps working when the column order changes.

## 3. Conditions with loc

`loc` also takes a True/False Series for the rows, which makes it the safe way to **change** values:

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
big = orders['qty'] >= 3
print(big.sum(), 'lines with 3 or more items')
orders.loc[big, 'discount'] = 0.15        # change only those rows, in one step
orders.loc[big, ['order_id', 'qty', 'discount']].head()
```

**Don't** write `orders[big]['discount'] = 0.15`: the first brackets make a temporary table and the change is lost (pandas 3 warns and ignores it). One `loc` with both parts always works.

## 4. Your turn

```python exercise data=stores.csv
import pandas as pd

stores = pd.read_csv('stores.csv', index_col='store_id')
# Show the province of store S04 using loc.
```
```python solution
import pandas as pd

stores = pd.read_csv('stores.csv', index_col='store_id')
stores.loc['S04', 'province']
```
```python check
assert _ == 'Quebec', "Show stores.loc['S04', 'province'] on the last line."
```
```hint
loc takes the row label, then the column name: stores.loc['S04', 'province'].
```

```python exercise data=products.csv
import pandas as pd

products = pd.read_csv('products.csv')
# Raise the price of every Electronics product by 10 % using loc. Then show those rows.
```
```python solution
import pandas as pd

products = pd.read_csv('products.csv')
is_elec = products['category'] == 'Electronics'
products.loc[is_elec, 'price'] = products.loc[is_elec, 'price'] * 1.10
products[is_elec]
```
```python check
e = products[products['category'] == 'Electronics']
assert abs(e['price'].sum() - 204.94 * 1.1) < 0.05, 'Multiply the Electronics prices by 1.10 inside products (use loc).'
assert abs(products.loc[products['category'] != 'Electronics', 'price'].sum() - 293.34) < 0.05, 'Only Electronics prices should change.'
```
```hint
Make a mask is_elec = products['category'] == 'Electronics', then products.loc[is_elec, 'price'] = products.loc[is_elec, 'price'] * 1.10.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** every row has a **label** (its index value) and a **position** (0, 1, 2, ...). After sorting or filtering they differ: the row labelled 57 might now be in position 0. `loc` uses labels; `iloc` uses positions; neither guesses.

```python data=orders.csv
import pandas as pd

top = pd.read_csv('orders.csv').sort_values('qty', ascending=False)
print(top.index[:3].tolist())    # labels of the first three rows
print(top.iloc[0]['order_id'])   # first by position
top.loc[top.index[0], 'order_id']
```
</details>

## 5. Practice

1. Write the code for rows 10 to 19 (by position) and columns `date` and `qty`.
2. After sorting, why might `df.loc[0]` not be the first row?
3. Set `segment` to `'VIP'` where `customer_id` is `'C0001'`.

<details>
<summary>Answers</summary>

1. `df.iloc[10:20][['date', 'qty']]`, or `df.loc[df.index[10:20], ['date', 'qty']]`.
2. `loc[0]` finds the row *labelled* 0, wherever sorting moved it.
3. `customers.loc[customers['customer_id'] == 'C0001', 'segment'] = 'VIP'`.
</details>

**New words:** *loc*, *iloc*, *label*, *position*, *index_col*, *chained assignment*.
