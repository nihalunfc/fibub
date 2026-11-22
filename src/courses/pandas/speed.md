---
title: 'Fast pandas: vectorise, avoid loops'
summary: 'Make pandas code fast: whole-column (vectorised) operations instead of loops and apply, np.where and np.select for conditions, categories for repeated text, reading only the columns you need, and timing code to see the difference.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'Why is df.qty * df.unit_price faster than a for loop over rows?'
    choices: ['The multiplication runs in compiled code over the whole column at once', 'Loops are not allowed', 'It uses less memory always']
    ans: 0
    why: 'Each Python loop step has overhead; vectorised code pays it once.'
  - q: 'What is usually the fastest way to add a column from a condition?'
    choices: ["np.where(df.qty > 2, 'big', 'small')", "df.apply(lambda r: 'big' if r.qty > 2 else 'small', axis=1)", 'iterrows()']
    ans: 0
    why: 'apply with axis=1 calls a Python function once per row.'
  - q: 'When does the category dtype save memory?'
    choices: ['When a text column repeats a few values many times', 'For unique IDs', 'For numbers']
    ans: 0
    why: 'Each value is stored once, and rows hold small integer codes.'
---

**Module 8 · about 15 minutes · uses Modules 2 and 3.** You'll be able to spot slow pandas code and rewrite it.

## 1. Loop, apply, vectorised

```python data=orders.csv
import pandas as pd
import numpy as np
import time

orders = pd.read_csv('orders.csv')

def timed(label, f):
    t = time.perf_counter(); out = f(); print(f'{label:<12} {1000 * (time.perf_counter() - t):8.1f} ms'); return out

def loop():
    out = []
    for _, r in orders.iterrows():
        out.append(r['qty'] * r['unit_price'] * (1 - r['discount']))
    return out

a = timed('iterrows', loop)
b = timed('apply', lambda: orders.apply(lambda r: r['qty'] * r['unit_price'] * (1 - r['discount']), axis=1))
c = timed('vectorised', lambda: orders['qty'] * orders['unit_price'] * (1 - orders['discount']))
print('same answer:', np.allclose(a, c))
```

Same result, very different speed: the vectorised line is usually hundreds of times faster. Times here are in your browser; on a laptop all three are faster, but the order is the same.

## 2. Conditions without loops

```python data=orders.csv
import pandas as pd
import numpy as np

orders = pd.read_csv('orders.csv')
orders['size'] = np.where(orders['qty'] >= 3, 'multi', 'single')                       # two outcomes
orders['band'] = np.select([orders['unit_price'] < 10, orders['unit_price'] < 50],       # many outcomes
                           ['budget', 'mid'], default='premium')
orders['vip'] = orders['customer_id'].isin(['C0001', 'C0002', 'C0003'])                  # membership
orders[['qty', 'size', 'unit_price', 'band', 'vip']].head()
```

Rules of thumb:

- Arithmetic and comparisons on columns: always vectorised.
- `if` per row: use `np.where` or `np.select`.
- A lookup: `map` or `merge`, never a loop.
- Text: the `.str` methods.
- Only when nothing else fits: `apply`, and preferably on a groupby, not on every row.

## 3. Memory: categories and fewer columns

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
before = orders.memory_usage(deep=True).sum()
small = pd.read_csv('orders.csv', usecols=['date', 'store_id', 'product_id', 'qty'],
                    dtype={'store_id': 'category', 'product_id': 'category', 'qty': 'int16'})
after = small.memory_usage(deep=True).sum()
print(f'{before / 1e6:.2f} MB -> {after / 1e6:.2f} MB')
small.dtypes
```

Read only the columns you need (`usecols`), and store repeated text as `category`. On a file with millions of rows this is the difference between "fits in memory" and "crashes".

## 4. Your turn

```python exercise data=orders.csv
import pandas as pd
import numpy as np

orders = pd.read_csv('orders.csv')
# Without a loop or apply: add a column deal = 'yes' where discount > 0, else 'no'.
# Show orders['deal'].value_counts().
```
```python solution
import pandas as pd
import numpy as np

orders = pd.read_csv('orders.csv')
orders['deal'] = np.where(orders['discount'] > 0, 'yes', 'no')
orders['deal'].value_counts()
```
```python check
assert 'deal' in orders.columns, 'Add a deal column.'
assert (orders['deal'] == np.where(orders['discount'] > 0, 'yes', 'no')).all(), "deal should be 'yes' where discount > 0."
assert int(_.sum()) == len(orders), 'Show the value_counts of deal.'
```
```hint
np.where(condition, value_if_true, value_if_false).
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** a pandas column is a NumPy array: numbers packed side by side in memory. A vectorised operation hands the whole array to compiled C code, which runs through it in one tight loop. A Python loop instead does a slow lookup, type check and object creation for every row:

```math
T_\text{loop} \approx n \cdot (c_\text{python} + c_\text{work}), \qquad T_\text{vector} \approx c_\text{setup} + n \cdot c_\text{work}, \qquad c_\text{python} \gg c_\text{work}
```

**When pandas is too slow** (tens of millions of rows): Polars, DuckDB (SQL on files) or Spark (Data at Scale course) use the same ideas across many cores or machines.
</details>

## 5. Practice

1. Replace `df.apply(lambda r: r.a + r.b, axis=1)`.
2. A loop builds a list of strings with `if`/`elif`/`else`. What do you use instead?
3. Why does `usecols` speed up `read_csv`?

<details>
<summary>Answers</summary>

1. `df['a'] + df['b']`.
2. `np.select([cond1, cond2], [val1, val2], default=val3)`.
3. pandas skips parsing the other columns and never stores them.
</details>

**Try it on your own data:** [[big-o-plotter]] shows how loop costs grow with the number of rows.

**New words:** *vectorised*, *iterrows*, *apply*, *np.where*, *category dtype*, *usecols*.
