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
sources:
  - 'pandas documentation, User Guide: Group by: split-apply-combine https://pandas.pydata.org/docs/user_guide/groupby.html'
  - 'Wickham, H. (2011), The Split-Apply-Combine Strategy for Data Analysis, Journal of Statistical Software 40(1) https://doi.org/10.18637/jss.v040.i01'
---

**Module 4 · about 20 minutes · uses Lesson 2.5.** You'll be able to answer "how much per store / month / category?" with one line.

<div class="bigidea">groupby splits the table into groups by a key, applies a calculation to each group, and combines the answers into one small table.</div>

**In everyday terms:** sorting receipts into one pile per store, adding up each pile, and writing the totals on a single sheet. Split, apply, combine.

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

Step through the four stages, then change the aggregate and raise the HAVING bar.

<div class="steps" data-fig="@data-groupby-buckets">
<div class="step">Start with the plain table: ten rows, each with a region and an amount.</div>
<div class="step">Split: every row slides into the bucket for its region.</div>
<div class="step">Apply: the aggregate is worked out inside each bucket on its own.</div>
<div class="step">Combine: each bucket collapses to one result row. HAVING now removes whole groups.</div>
</div>


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

<div class="meaning">

<dl>
<dt>groupby('store')</dt><dd>Split: one group per distinct store.</dd>
<dt>['qty'].sum()</dt><dd>Apply: one total per group.</dd>
<dt>Result</dt><dd>Combine: a Series or table indexed by the key.</dd>
<dt>as_index=False / reset_index()</dt><dd>Keep the key as a normal column.</dd>
<dt>Physical meaning</dt><dd>groupby moves you from the grain of the rows (order lines) to the grain of the key (stores). Every row lands in exactly one group, so the group totals always add back to the grand total.</dd>
</dl>

</div>

<div class="myth">

**"groupby changes the table."** It returns a new, smaller table and leaves the original alone. If the group totals do not add up to the grand total, a key had missing values (dropped by default: use dropna=False).

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The rows.</b> <table class="lk-tbl"><tr><th>store</th><th>qty</th></tr><tr><td>S01</td><td>2</td></tr><tr><td>WEB</td><td>1</td></tr><tr><td>S01</td><td>3</td></tr><tr><td>S02</td><td>4</td></tr><tr><td>WEB</td><td>5</td></tr></table></div>
<div class="step"><b>Split.</b> S01: 2, 3. S02: 4. WEB: 1, 5.</div>
<div class="step"><b>Apply.</b> Sum each pile: S01 → 5, S02 → 4, WEB → 6.</div>
<div class="step"><b>Combine.</b> <table class="lk-tbl"><tr><th>store</th><th>qty</th></tr><tr><td>S01</td><td><mark>5</mark></td></tr><tr><td>S02</td><td><mark>4</mark></td></tr><tr><td>WEB</td><td><mark>6</mark></td></tr></table></div>
<div class="step"><b>Check.</b> 5 + 4 + 6 = 15 = the sum of all rows.</div>
</div>

<div class="problem" data-problem="pd-group-mean"></div>

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

<div class="keypoints">

- groupby = split by key, apply a calculation, combine.
- Common: sum, mean, count, size, nunique, min, max.
- Several keys give one row per combination; reset_index flattens.
- Group totals add up to the grand total (unless keys are missing).

</div>
