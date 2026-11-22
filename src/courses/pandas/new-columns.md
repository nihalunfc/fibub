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
---

**Module 2 · about 20 minutes · uses Lesson 2.3.** You'll be able to build the calculated columns most analyses need: revenue, margin, flags and bands.

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
