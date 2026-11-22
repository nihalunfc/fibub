---
title: 'New columns from calculations'
summary: 'Add columns with arithmetic, conditions (np.where and np.select), rounding and clipping, and assign for several at once, the way analysts build revenue, margin and flag columns.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: "How do you add revenue = qty × unit_price × (1 − discount)?"
    choices: ["df['revenue'] = df['qty'] * df['unit_price'] * (1 - df['discount'])", "df.revenue(qty * unit_price)", "for row in df: row.revenue = ..."]
    ans: 0
    why: 'Whole-column arithmetic, assigned to a new name.'
  - q: "Which makes a column 'Big' when qty >= 3 and 'Small' otherwise?"
    choices: ["np.where(df['qty'] >= 3, 'Big', 'Small')", "if df['qty'] >= 3: 'Big'", "df['qty'].big()"]
    ans: 0
    why: 'np.where(condition, value if true, value if false) works on the whole column.'
  - q: 'What is assign good for?'
    choices: ['Adding several columns in one step inside a chain, without changing the original', 'Deleting columns', 'Sorting']
    ans: 0
    why: 'assign returns a new DataFrame with the extra columns, so it fits in method chains.'
sources:
  - 'pandas documentation, User Guide: 10 minutes to pandas (setting) https://pandas.pydata.org/docs/user_guide/10min.html#setting'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 2 · about 20 minutes · uses Lesson 2.3.** You'll be able to build the calculated columns most analyses need: revenue, margin, flags and bands.

<div class="bigidea">A new column is a calculation written once for the whole table: arithmetic, a yes/no test or a category from rules.</div>

**In everyday terms:** adding a column to a spreadsheet and filling the formula down, except there is nothing to fill: one line covers every row, now and in next month's file.

## 1. Arithmetic

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['gross'] = orders['qty'] * orders['unit_price']
orders['revenue'] = (orders['gross'] * (1 - orders['discount'])).round(2)
orders['discount_amt'] = orders['gross'] - orders['revenue']
print('total revenue:', round(orders['revenue'].sum(), 2))
orders.head()
```

## 2. Yes/no and categories

**Two outcomes:** `np.where(condition, if_true, if_false)`.
**Several:** `np.select([conditions], [values], default=...)`, checked in order.

```python data=orders.csv
import numpy as np
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
orders['channel'] = np.where(orders['store_id'] == 'WEB', 'online', 'store')
orders['size'] = np.select(
    [orders['revenue'] >= 50, orders['revenue'] >= 15],
    ['large', 'medium'],
    default='small')
orders[['order_id', 'store_id', 'revenue', 'channel', 'size']].head()
```

A True/False column is useful on its own: `orders['is_promo'] = orders['discount'] > 0`, then `orders['is_promo'].mean()` is the share of promo lines.

## 3. Several at once with assign

```python data=products.csv
import pandas as pd

products = pd.read_csv('products.csv')
products.assign(
    margin=lambda d: d['price'] - d['cost'],
    margin_pct=lambda d: (d['margin'] / d['price'] * 100).round(1),
    premium=lambda d: d['price'] > 20,
).sort_values('margin_pct', ascending=False).head()
```

`lambda d: ...` means "using the table as it is at this step", so `margin_pct` can use the `margin` made just before it.

<div class="meaning">

<dl>
<dt>df['rev'] = df.qty * df.price</dt><dd>Arithmetic on columns, row by row.</dd>
<dt>df['big'] = df.qty >= 3</dt><dd>A True/False column.</dd>
<dt>np.where(cond, a, b)</dt><dd>a where cond is True, else b.</dd>
<dt>assign(...)</dt><dd>Add several columns and return a new table.</dd>
<dt>Physical meaning</dt><dd>A new column is a new fact about each row, derived from facts you already have. Revenue is not in the file; it is quantity × price × (1 − discount) for each line.</dd>
</dl>

</div>

<div class="myth">

**"Discounts are already in the price."** Here unit_price is the list price and discount a share; revenue is qty × unit_price × (1 − discount). Always check what each column means before computing with it.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Start.</b> <table class="lk-tbl"><tr><th>qty</th><th>unit_price</th><th>discount</th></tr><tr><td>2</td><td>20.0</td><td>0.1</td></tr><tr><td>1</td><td>5.0</td><td>0</td></tr><tr><td>3</td><td>10.0</td><td>0.2</td></tr></table></div>
<div class="step"><b>Formula.</b> <code>revenue = qty * unit_price * (1 - discount)</code></div>
<div class="step"><b>Row 1.</b> 2 × 20 × 0.9 = 36.</div>
<div class="step"><b>All rows at once.</b> <table class="lk-tbl"><tr><th>qty</th><th>unit_price</th><th>discount</th><th>revenue</th></tr><tr><td>2</td><td>20.0</td><td>0.1</td><td><mark>36.0</mark></td></tr><tr><td>1</td><td>5.0</td><td>0</td><td><mark>5.0</mark></td></tr><tr><td>3</td><td>10.0</td><td>0.2</td><td><mark>24.0</mark></td></tr></table></div>
</div>

<div class="problem" data-problem="pd-revenue"></div>

## 4. Your turn

```python exercise data=products.csv
import pandas as pd

products = pd.read_csv('products.csv')
# Add margin_pct = (price - cost) / price * 100, rounded to 1 decimal. Show the 3 products with the highest margin_pct.
```
```python solution
import pandas as pd

products = pd.read_csv('products.csv')
products['margin_pct'] = ((products['price'] - products['cost']) / products['price'] * 100).round(1)
products.nlargest(3, 'margin_pct')
```
```python check
assert 'margin_pct' in products.columns, 'Add the margin_pct column to products.'
assert abs(products['margin_pct'].max() - 52.0) < 0.2, 'margin_pct should be (price - cost) / price * 100.'
assert isinstance(_, pd.DataFrame) and len(_) == 3, 'Show the top 3 rows (nlargest).'
```
```hint
Build the column first, then products.nlargest(3, 'margin_pct').
```

```python exercise data=orders.csv
import numpy as np
import pandas as pd

orders = pd.read_csv('orders.csv')
# Add a column 'promo' that is 'yes' when discount > 0 and 'no' otherwise. Show promo's value_counts().
```
```python solution
import numpy as np
import pandas as pd

orders = pd.read_csv('orders.csv')
orders['promo'] = np.where(orders['discount'] > 0, 'yes', 'no')
orders['promo'].value_counts()
```
```python check
assert set(orders['promo'].unique()) == {'yes', 'no'}, "promo should hold only 'yes' and 'no'."
assert (orders['promo'] == 'yes').sum() == (orders['discount'] > 0).sum(), "'yes' should match discount > 0."
```
```hint
np.where(orders['discount'] > 0, 'yes', 'no')
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** a new column is any expression that produces one value per row. Because the work is done on whole arrays, a column calculation on a million rows takes milliseconds; the same in a Python loop takes seconds or minutes (Lesson 8.8).

**Rounding money:** round at the end (when reporting), not at every step, or small rounding errors add up across thousands of rows. `round(2)` uses banker's rounding at exact halves (2.675 → 2.67 can surprise you); for invoices, use Python's `decimal` module.
</details>

## 5. Practice

1. Add `unit_cost_after` = `unit_price × (1 − discount)`.
2. Flag orders over $100 as `high_value` (True/False).
3. Bands: revenue < 10 'low', < 50 'mid', otherwise 'high'. Which function?

<details>
<summary>Answers</summary>

1. `df['unit_cost_after'] = df['unit_price'] * (1 - df['discount'])`.
2. `df['high_value'] = df['revenue'] > 100`.
3. `np.select([df.revenue < 10, df.revenue < 50], ['low', 'mid'], default='high')`, or `pd.cut` (Lesson 4.5).
</details>

**New words:** *calculated column*, *np.where*, *np.select*, *assign*, *lambda*.

<div class="keypoints">

- Column arithmetic works row by row for the whole table.
- Comparisons make True/False columns.
- np.where for two outcomes; np.select or pd.cut for more.
- assign adds columns inside a chain.

</div>
