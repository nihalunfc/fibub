---
title: 'groupby: split, apply, combine'
summary: 'Summarise a table by group with groupby: split the rows by a key, apply a sum, mean or count to each group, and combine the results into one table. Group by one or several columns and keep the keys as columns.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: "What does orders.groupby('store_id')['qty'].sum() return?"
    choices: ['The total quantity for each store', 'The total quantity of all orders', 'Each order sorted by store']
    ans: 0
    why: 'One row per group (store), with the sum of qty within it.'
  - q: 'What is the difference between count() and size() in a groupby?'
    choices: ['None', 'count() skips missing values in each column; size() counts rows, missing or not', 'size() is slower']
    ans: 1
    why: 'size is "how many rows"; count is "how many non-missing values".'
  - q: "Why add as_index=False (or .reset_index())?"
    choices: ['To keep the group keys as normal columns, which is easier to join, plot or save', 'To sort the result', 'To remove duplicates']
    ans: 0
    why: 'By default the keys become the index; as_index=False keeps a flat table.'
---

**Module 4 · about 20 minutes · uses Lesson 2.5.** You'll be able to answer "how much per store / month / category?" with one line.

## 1. Split, apply, combine

`groupby` does three things: **split** the rows into groups by a key, **apply** a calculation to each group, and **combine** the answers into one table.

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
orders.groupby('store_id')['revenue'].sum().round(2)
```

Read it as: *group the orders by store, take revenue, sum it.* One row per store.

## 2. Common calculations

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
g = orders.groupby('store_id')
display(g['qty'].mean().round(2))          # average items per line
display(g.size())                          # rows per store
g['order_id'].nunique()                    # distinct orders per store
```

`sum`, `mean`, `median`, `min`, `max`, `count`, `size`, `nunique`, `std`, `first`, `last` all work.

## 3. Several keys and flat results

```python data=orders.csv,products.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
orders['year'] = orders['date'].dt.year
by = orders.groupby(['year', 'store_id'], as_index=False)['revenue'].sum()
by['revenue'] = by['revenue'].round(0)
by.sort_values(['year', 'revenue'], ascending=[True, False]).head(8)
```

With `as_index=False` the keys stay as ordinary columns: easier to sort, filter, join or save.

## 4. Your turn

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
# Total qty sold for each product_id. Show the 5 products with the highest total (largest first).
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv')
orders.groupby('product_id')['qty'].sum().nlargest(5)
```
```python check
exp = orders.groupby('product_id')['qty'].sum().nlargest(5)
assert isinstance(_, pd.Series) and len(_) == 5, 'Show a Series of the top 5 products.'
assert list(_.values) == list(exp.values), 'Sum qty by product_id, then take the 5 largest.'
```
```hint
orders.groupby('product_id')['qty'].sum() gives totals; .nlargest(5) keeps the top 5.
```

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
# Number of distinct customers who bought at each store, as a flat table with columns store_id and customers.
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv')
orders.groupby('store_id', as_index=False)['customer_id'].nunique().rename(columns={'customer_id': 'customers'})
```
```python check
assert isinstance(_, pd.DataFrame) and list(_.columns) == ['store_id', 'customers'], 'Columns should be store_id and customers.'
exp = orders.groupby('store_id')['customer_id'].nunique()
assert dict(zip(_['store_id'], _['customers'])) == exp.to_dict(), 'Count distinct customer_id per store.'
```
```hint
groupby('store_id', as_index=False)['customer_id'].nunique(), then rename customer_id to customers.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** groupby builds a map from each key to the row positions in that group, then runs the calculation once per group in compiled code. It's the pandas version of SQL's `GROUP BY` and a pivot table's rows.

**Grain warning:** group the table at the right grain. Counting rows in `orders` counts order **lines**; counting distinct `order_id` counts orders. "Average order value" needs revenue summed per order first, then averaged:

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
per_order = orders.groupby('order_id')['revenue'].sum()
print('average line value: ', round(orders['revenue'].mean(), 2))
print('average order value:', round(per_order.mean(), 2))
```
</details>

## 5. Practice

1. Average unit price per store.
2. How many lines had a discount, per store? (Hint: the mean of a True/False column is a share; the sum is a count.)
3. Why might `groupby(...).count()` and `.size()` differ?

<details>
<summary>Answers</summary>

1. `orders.groupby('store_id')['unit_price'].mean()`.
2. `orders.assign(promo=orders['discount'] > 0).groupby('store_id')['promo'].sum()`.
3. `count` skips missing values in each column; `size` counts all rows.
</details>

**Try it on your own data:** [[grouped-data-stats]] gives counts, means and spreads by group for any CSV without code.

**New words:** *groupby*, *split-apply-combine*, *aggregate*, *as_index*, *grain*.
