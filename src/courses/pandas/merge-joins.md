---
title: 'Joining tables with merge'
summary: 'Bring columns from one table into another by matching a key with pd.merge: inner, left, right and outer joins, different key names, several keys, and the indicator that shows which rows matched.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'You want every order, plus the product name where known. Which join?'
    choices: ["how='left' with orders on the left", "how='inner'", "how='right' with orders on the left"]
    ans: 0
    why: 'A left join keeps every row of the left table and fills NaN where no product matches.'
  - q: "The key is 'product_id' in orders and 'id' in products. How?"
    choices: ["pd.merge(orders, products, left_on='product_id', right_on='id')", "pd.merge(orders, products, on='product_id')", 'Rename is impossible']
    ans: 0
    why: 'left_on and right_on name the key in each table.'
  - q: "What does indicator=True add?"
    choices: ["A _merge column saying 'both', 'left_only' or 'right_only' for each row", 'A row count', 'An index']
    ans: 0
    why: 'It shows which rows matched, which is the quickest way to check a join.'
---

**Module 5 · about 25 minutes · uses Lesson 2.1.** You'll be able to join tables on a key and choose the right join type.

## 1. Why join

Data is split across tables so each fact is stored once: orders hold a `product_id`, the products table holds names and categories. To report revenue by category, you bring the category into the orders.

<!--anim:merge-anim (table animation, added once the shared tableviz engine is on main)-->

## 2. merge

```python data=orders.csv,products.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
products = pd.read_csv('products.csv')
full = pd.merge(orders, products[['product_id', 'product', 'category']], on='product_id', how='left')
print(len(orders), len(full))          # a left join on a unique key keeps the row count
full.head()
```

Then any summary by the new columns is one groupby away:

```python data=orders.csv,products.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
products = pd.read_csv('products.csv')
full = orders.merge(products, on='product_id', how='left', suffixes=('', '_list'))
full['revenue'] = full['qty'] * full['unit_price'] * (1 - full['discount'])
full.groupby('category')['revenue'].sum().round(0).sort_values(ascending=False)
```

`orders.merge(products, ...)` is the same as `pd.merge(orders, products, ...)`. `suffixes` names clashing columns (both tables have a price).

## 3. Join types

| `how=` | Keeps | Use for |
|---|---|---|
| `'inner'` | rows with a match on both sides | only what links up |
| `'left'` | every left row; NaN where no match | adding details to a main table (the most common) |
| `'right'` | every right row | the same, from the other side |
| `'outer'` | everything from both | finding what's missing on either side |

```python
import pandas as pd

sales = pd.DataFrame({'store_id': ['S01', 'S02', 'S09'], 'sales': [500, 420, 75]})
stores = pd.DataFrame({'store_id': ['S01', 'S02', 'S03'], 'store': ['Harbourview', 'Maple Ridge', 'Cedar Falls']})
for how in ['inner', 'left', 'right', 'outer']:
    print(how)
    display(pd.merge(sales, stores, on='store_id', how=how, indicator=True))
```

`S09` has sales but no store record (an orphan); `S03` is a store with no sales. The `_merge` column says which side each row came from.

## 4. Different names and several keys

```python
import pandas as pd

targets = pd.DataFrame({'shop': ['S01', 'S01', 'S02'], 'yr': [2025, 2026, 2026], 'target': [9000, 9500, 7000]})
actual = pd.DataFrame({'store_id': ['S01', 'S01', 'S02'], 'year': [2025, 2026, 2026], 'sales': [9100, 8800, 7300]})
m = actual.merge(targets, left_on=['store_id', 'year'], right_on=['shop', 'yr'], how='left').drop(columns=['shop', 'yr'])
m['vs_target'] = m['sales'] - m['target']
m
```

## 5. Your turn

```python exercise data=orders.csv,customers.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
customers = pd.read_csv('customers.csv')
# Left-join customers' segment onto orders (key customer_id). Then count order lines per segment.
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv')
customers = pd.read_csv('customers.csv')
full = orders.merge(customers[['customer_id', 'segment']], on='customer_id', how='left')
full['segment'].value_counts()
```
```python check
assert 'full' in dir() and len(full) == len(orders), 'A left join on customer_id should keep every order line (make a variable full).'
assert isinstance(_, pd.Series) and _.sum() == len(orders), 'Show the count of lines per segment.'
```
```hint
orders.merge(customers[['customer_id', 'segment']], on='customer_id', how='left'), then value_counts() on segment.
```

```python exercise
import pandas as pd

sales = pd.DataFrame({'store_id': ['S01', 'S02', 'S09'], 'sales': [500, 420, 75]})
stores = pd.DataFrame({'store_id': ['S01', 'S02', 'S03'], 'store': ['Harbourview', 'Maple Ridge', 'Cedar Falls']})
# Find the store_id values in sales that have no match in stores (use an outer join with indicator=True).
```
```python solution
import pandas as pd

sales = pd.DataFrame({'store_id': ['S01', 'S02', 'S09'], 'sales': [500, 420, 75]})
stores = pd.DataFrame({'store_id': ['S01', 'S02', 'S03'], 'store': ['Harbourview', 'Maple Ridge', 'Cedar Falls']})
m = sales.merge(stores, on='store_id', how='outer', indicator=True)
m.loc[m['_merge'] == 'left_only', 'store_id'].tolist()
```
```python check
assert _ == ['S09'], f"Got {_}; keep the rows where _merge is 'left_only'."
```
```hint
After the merge, filter m['_merge'] == 'left_only' and take store_id.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** for each key value, merge pairs every left row with every right row that has the same key. With a **unique** key on one side (one row per product), each order line finds at most one partner, so a left join keeps the row count. If the key repeats on both sides, rows multiply (next lesson).

**SQL:** `pd.merge(a, b, on='k', how='left')` is `SELECT * FROM a LEFT JOIN b ON a.k = b.k`.
</details>

## 6. Practice

1. Which join lists every store, including stores with no sales?
2. After a left join, how do you find rows that didn't match?
3. Why check `len()` before and after a join?

<details>
<summary>Answers</summary>

1. Stores on the left with `how='left'` (or stores on the right with `how='right'`).
2. Look for NaN in a column from the right table, or use `indicator=True` and keep `'left_only'`.
3. A change in row count after a left join means duplicate keys on the right; totals would be inflated.
</details>

**New words:** *merge*, *join*, *key*, *inner / left / right / outer join*, *orphan*, *indicator*, *suffixes*.
