---
title: 'transform and filter: group results on every row'
summary: 'Use transform to put a group total or average back on every row (for shares, differences from the group mean and ranks within groups), and groupby filter to keep whole groups that pass a test.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: "What does groupby('store_id')['revenue'].transform('sum') return?"
    choices: ['One row per store', 'A column the same length as the table, with each row''s store total', 'The overall total']
    ans: 1
    why: 'transform returns one value per original row, so it can be added as a column.'
  - q: "How do you compute each line's share of its store's revenue?"
    choices: ["df['revenue'] / df.groupby('store_id')['revenue'].transform('sum')", "df['revenue'].sum()", "df.groupby('store_id').share()"]
    ans: 0
    why: 'Divide each row by its group total, which transform lines up with the rows.'
  - q: "What does groupby('customer_id').filter(lambda g: len(g) >= 5) keep?"
    choices: ['Customers with at least 5 rows, with all their rows', 'The first 5 rows', 'Only one row per customer']
    ans: 0
    why: 'filter keeps or drops whole groups.'
sources:
  - 'pandas documentation, User Guide: Group by (transformation, filtration) https://pandas.pydata.org/docs/user_guide/groupby.html#transformation'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 4 · about 20 minutes · uses Lesson 4.2.** You'll be able to compare each row with its group, and keep only the groups you want.

<div class="bigidea">transform puts a group's result back on every row of the group; filter keeps or drops whole groups by a rule.</div>

**In everyday terms:** a teacher writes each class's average on every pupil's report (transform), so each pupil can be compared with their class; then sends a note only to classes with more than 30 pupils (filter).

## 1. transform: a group value on every row

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
g = orders.groupby('store_id')['revenue']
orders['store_total'] = g.transform('sum')
orders['share_of_store'] = orders['revenue'] / orders['store_total']
orders['vs_store_avg'] = orders['revenue'] - g.transform('mean')
orders[['store_id', 'revenue', 'store_total', 'share_of_store', 'vs_store_avg']].head().round(4)
```

`agg` shrinks the table to one row per group; `transform` keeps every row and adds the group's value to each. That's what you need for shares, gaps from the average, and filling missing values per group (Lesson 3.1).

## 2. Ranks and running totals within groups

```python data=orders.csv,products.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
products = pd.read_csv('products.csv')
by = orders.groupby(['store_id', 'product_id'], as_index=False)['qty'].sum()
by['rank_in_store'] = by.groupby('store_id')['qty'].rank(ascending=False, method='first').astype(int)
display(by[by['rank_in_store'] <= 2].sort_values(['store_id', 'rank_in_store']).head(6))

daily = orders.groupby(['store_id', 'date'], as_index=False)['qty'].sum()
daily['running_qty'] = daily.groupby('store_id')['qty'].cumsum()
daily.head()
```

## 3. filter: keep whole groups

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
loyal = orders.groupby('customer_id').filter(lambda g: g['order_id'].nunique() >= 10)
print(loyal['customer_id'].nunique(), 'customers with 10 or more orders;', len(loyal), 'of their lines kept')
loyal.head()
```

The same with `transform`, often faster: `orders[orders.groupby('customer_id')['order_id'].transform('nunique') >= 10]`.

<div class="meaning">

<dl>
<dt>groupby(k)[c].transform('sum')</dt><dd>Same length as the table: each row gets its group's sum.</dd>
<dt>x / transform('sum')</dt><dd>Each row's share of its group.</dd>
<dt>groupby(k).filter(lambda g: len(g) >= 10)</dt><dd>Keep all rows of groups that pass.</dd>
<dt>cumsum(), rank() per group</dt><dd>Running totals and ranks that restart in each group.</dd>
<dt>Physical meaning</dt><dd>transform keeps the row grain while adding group context, which is what "share of store", "difference from the customer's average" and "fill with the group median" all need.</dd>
</dl>

</div>

<div class="myth">

**"agg and transform do the same thing."** agg gives one row per group; transform gives one value per original row. Use transform when the answer has to sit next to each row.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The rows.</b> <table class="lk-tbl"><tr><th>store</th><th>qty</th></tr><tr><td>S01</td><td>2</td></tr><tr><td>S01</td><td>6</td></tr><tr><td>WEB</td><td>4</td></tr><tr><td>WEB</td><td>4</td></tr></table></div>
<div class="step"><b>Group totals.</b> S01 → 8, WEB → 8.</div>
<div class="step"><b>transform('sum') puts them back on each row.</b> <table class="lk-tbl"><tr><th>store</th><th>qty</th><th>store_total</th></tr><tr><td>S01</td><td>2</td><td><mark>8</mark></td></tr><tr><td>S01</td><td>6</td><td><mark>8</mark></td></tr><tr><td>WEB</td><td>4</td><td><mark>8</mark></td></tr><tr><td>WEB</td><td>4</td><td><mark>8</mark></td></tr></table></div>
<div class="step"><b>Share.</b> qty ÷ store_total → 0.25, 0.75, 0.5, 0.5.</div>
</div>

<div class="problem" data-problem="pd-transform-share"></div>

## 4. Your turn

```python exercise data=products.csv
import pandas as pd

products = pd.read_csv('products.csv')
# Add a column 'vs_cat' = each product's price minus the average price of its category. Show the 3 rows with the largest vs_cat.
```
```python solution
import pandas as pd

products = pd.read_csv('products.csv')
products['vs_cat'] = products['price'] - products.groupby('category')['price'].transform('mean')
products.nlargest(3, 'vs_cat')
```
```python check
exp = products['price'] - products.groupby('category')['price'].transform('mean')
assert 'vs_cat' in products.columns and (products['vs_cat'] - exp).abs().max() < 1e-9, 'vs_cat = price minus the category mean (use transform).'
assert isinstance(_, pd.DataFrame) and len(_) == 3, 'Show the 3 largest with nlargest.'
```
```hint
products.groupby('category')['price'].transform('mean') gives each product its category average.
```

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
# Keep only the products (product_id) that were sold in at least 320 lines. Show how many distinct products remain.
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv')
kept = orders.groupby('product_id').filter(lambda g: len(g) >= 320)
kept['product_id'].nunique()
```
```python check
exp = (orders['product_id'].value_counts() >= 320).sum()
assert _ == exp, f'Expected {exp} products; keep groups with len(g) >= 320.'
```
```hint
orders.groupby('product_id').filter(lambda g: len(g) >= 320), then ['product_id'].nunique().
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** `agg` maps each group to **one** value; `transform` maps each group to a value **per row** (broadcast back to the group's rows, in the original order); `filter` maps each group to **True/False** and keeps the rows of the True groups. Same split, different combine.

| | Output rows | Typical use |
|---|---|---|
| `agg` | one per group | summary tables |
| `transform` | same as input | shares, gaps, group fills, ranks |
| `filter` | rows of passing groups | "customers with 5+ orders" |
</details>

## 5. Practice

1. Each product's share of its category's units sold.
2. Number each customer's orders 1, 2, 3 in date order.
3. Keep stores whose average discount is above 5 %.

<details>
<summary>Answers</summary>

1. Sum units per product, then `df['units'] / df.groupby('category')['units'].transform('sum')`.
2. `orders.sort_values('date').groupby('customer_id')['date'].rank(method='dense')` (or `cumcount() + 1` on one row per order).
3. `orders.groupby('store_id').filter(lambda g: g['discount'].mean() > 0.05)`.
</details>

**New words:** *transform*, *broadcast*, *group filter*, *cumsum*, *rank within group*.

<div class="keypoints">

- transform returns one value per row, aligned with the table.
- Use it for shares, differences from group means and group-based fills.
- filter keeps or drops whole groups.
- cumsum, cumcount and rank on a groupby restart per group.

</div>
