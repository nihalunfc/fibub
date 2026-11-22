---
title: 'Several summaries at once with agg'
summary: 'Use agg to compute many summaries in one groupby: several functions on one column, different functions per column, and named aggregations that give clean column names for reports.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: "What does .agg(['sum', 'mean']) on one column give?"
    choices: ['Two columns, sum and mean, for each group', 'An error', 'Only the sum']
    ans: 0
    why: 'A list of functions makes one column per function.'
  - q: "Which is a named aggregation?"
    choices: ["agg(total=('revenue', 'sum'))", "agg('revenue')", "agg(sum)"]
    ans: 0
    why: 'new_name=(column, function) gives the output column a clear name.'
  - q: "Why prefer named aggregations for reports?"
    choices: ['They are faster', 'Clean, flat column names that read well and don''t need renaming afterwards', 'They sort automatically']
    ans: 1
    why: 'Lists of functions create two-level column names; named aggregations avoid that.'
sources:
  - 'pandas documentation, User Guide: Group by (aggregation) https://pandas.pydata.org/docs/user_guide/groupby.html#aggregation'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 4 · about 20 minutes · uses Lesson 4.1.** You'll be able to build a summary table with many measures in one step.

<div class="bigidea">agg computes several summaries per group at once, and named aggregation gives each result a clear column name ready for a report.</div>

**In everyday terms:** one trip to each pile of receipts, writing down the total, the number of receipts and the biggest one, instead of three separate trips.

## 1. Several functions on one column

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
orders.groupby('store_id')['qty'].agg(['sum', 'mean', 'max']).round(2)
```

## 2. Named aggregations: the report-ready way

`new_column=(source_column, function)` for each measure:

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
summary = orders.groupby('store_id').agg(
    orders=('order_id', 'nunique'),
    lines=('order_id', 'size'),
    units=('qty', 'sum'),
    revenue=('revenue', 'sum'),
    avg_discount=('discount', 'mean'),
)
summary['revenue_per_order'] = summary['revenue'] / summary['orders']
summary.round(2).sort_values('revenue', ascending=False)
```

This is the shape of most KPI tables: one row per group, one column per measure, ratios computed after.

## 3. Your own functions

Any function that takes a Series and returns one value works, including a `lambda`:

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
orders.groupby('store_id').agg(
    promo_share=('discount', lambda s: (s > 0).mean()),
    p90_qty=('qty', lambda s: s.quantile(0.9)),
).round(3)
```

Built-in names (`'sum'`, `'mean'`) are much faster than lambdas on big tables; use lambdas for things without a built-in.

<div class="meaning">

<dl>
<dt>agg(['sum', 'mean'])</dt><dd>Several functions on one column.</dd>
<dt>agg(units=('qty', 'sum'), lines=('qty', 'size'))</dt><dd>Named aggregation: new name = (column, function).</dd>
<dt>Custom function</dt><dd>Any function that takes a group's values and returns one number.</dd>
<dt>Physical meaning</dt><dd>A report row per group: "Harbourview: 1,204 units, 610 lines, 312 customers". Each named result is one fact about the group, computed from its rows.</dd>
</dl>

</div>

<div class="myth">

**"The mean of group means is the overall mean."** Only if every group is the same size. Compute the overall figure from the totals (Lesson 8.2).

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The rows.</b> <table class="lk-tbl"><tr><th>store</th><th>customer</th><th>qty</th></tr><tr><td>S01</td><td>C1</td><td>2</td></tr><tr><td>S01</td><td>C2</td><td>3</td></tr><tr><td>S01</td><td>C1</td><td>1</td></tr><tr><td>WEB</td><td>C3</td><td>4</td></tr></table></div>
<div class="step"><b>Ask for three facts.</b> <code>agg(units=('qty', 'sum'), lines=('qty', 'size'), customers=('customer', 'nunique'))</code></div>
<div class="step"><b>S01.</b> units 6, lines 3, customers 2 (C1 counted once).</div>
<div class="step"><b>Result.</b> <table class="lk-tbl"><tr><th>store</th><th>units</th><th>lines</th><th>customers</th></tr><tr><td>S01</td><td>6</td><td>3</td><td>2</td></tr><tr><td>WEB</td><td>4</td><td>1</td><td>1</td></tr></table></div>
</div>

<div class="problem" data-problem="pd-agg-nunique"></div>

## 4. Your turn

```python exercise data=products.csv
import pandas as pd

products = pd.read_csv('products.csv')
# Per category: number of products (n), average price (avg_price) and highest price (max_price).
# Use named aggregations and round to 2 decimals.
```
```python solution
import pandas as pd

products = pd.read_csv('products.csv')
products.groupby('category').agg(
    n=('product_id', 'count'),
    avg_price=('price', 'mean'),
    max_price=('price', 'max'),
).round(2)
```
```python check
assert isinstance(_, pd.DataFrame), 'Show the summary table on the last line.'
assert list(_.columns) == ['n', 'avg_price', 'max_price'], f'Columns should be n, avg_price, max_price; got {list(_.columns)}.'
assert _.loc['Electronics', 'max_price'] == 59.99 and _.loc['Grocery', 'n'] == 8, 'Check the functions: count, mean and max.'
```
```hint
products.groupby('category').agg(n=('product_id', 'count'), avg_price=('price', 'mean'), max_price=('price', 'max')).round(2)
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** `agg` runs each (column, function) pair once per group and lays the answers side by side. Measures that are **ratios** (revenue per order, conversion rate) must be computed from the summed parts **after** aggregating, not by averaging per-row ratios, or small groups get the same weight as big ones.

**Example:** two stores with conversion 10 % (of 100 visitors) and 2 % (of 10,000). Average of rates: 6 %. True combined rate: 210 ÷ 10,100 ≈ 2.1 %.
</details>

## 5. Practice

1. Per customer: number of orders, total revenue and last order date.
2. Why compute revenue per order after `agg`, not as a mean of per-line values?
3. What does `agg(['min', 'max'])` produce as column names?

<details>
<summary>Answers</summary>

1. `orders.groupby('customer_id').agg(orders=('order_id', 'nunique'), revenue=('revenue', 'sum'), last=('date', 'max'))`.
2. A line isn't an order; per-order value needs the order's total, so divide total revenue by the number of orders.
3. Columns named `min` and `max` (with two-level names if you used it on several columns).
</details>

**New words:** *agg*, *named aggregation*, *summary table*, *ratio of sums*.

<div class="keypoints">

- agg runs several summaries per group in one pass.
- Named aggregation: new_name=(column, function).
- size counts rows; count skips NaN; nunique counts distinct values.
- Custom functions work but are slower than built-ins.

</div>
