---
title: 'Readable pandas: method chaining and assign'
summary: 'Write pandas as one readable recipe: chain steps with dots, add columns with assign and lambda, filter with query, and use pipe for your own functions, so each analysis reads top to bottom.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'What does assign() return?'
    choices: ['A new DataFrame with the extra columns; the original is unchanged', 'Nothing; it changes the table in place', 'A Series']
    ans: 0
    why: 'Because it returns a table, the next method can follow straight after it.'
  - q: "Inside a chain, why write assign(revenue=lambda d: d['qty'] * d['unit_price'])?"
    choices: ['The lambda gets the table as it is at that step, including columns made earlier in the chain', 'Lambdas are faster', 'assign needs a function']
    ans: 0
    why: 'Naming the outer variable would use the table from before the chain.'
  - q: 'What is pipe(f) for?'
    choices: ['Calling your own function on the table inside a chain', 'Reading files', 'Joining two tables']
    ans: 0
    why: 'df.pipe(f) is the same as f(df), but it keeps the chain reading top to bottom.'
sources:
  - 'Augspurger, T. (2016), Modern Pandas: Method Chaining https://tomaugspurger.net/posts/method-chaining/'
  - 'pandas documentation, User Guide: pandas.DataFrame.pipe https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.pipe.html'
---

**Module 8 · about 15 minutes · uses Modules 2 to 4.** You'll be able to write an analysis as a single readable chain.

<div class="bigidea">A chain writes the analysis as one recipe, top to bottom: each line takes the table from the line above, does one thing, and passes it on.</div>

**In everyday terms:** a recipe card: "sift, add eggs, whisk, bake". You do not name every bowl along the way; you follow the steps in order.

## 1. Many lines, many names

Step by step code makes a new name, or overwrites the same one, at every step:

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
df = orders[orders['date'] >= '2026-01-01']
df['revenue'] = df['qty'] * df['unit_price'] * (1 - df['discount'])
df = df.groupby('store_id')['revenue'].sum()
df = df.sort_values(ascending=False)
df.round(0)
```

It works, but you must read every line to know what `df` holds now.

## 2. The same as one recipe

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
(orders
 .query("date >= '2026-01-01'")
 .assign(revenue=lambda d: d['qty'] * d['unit_price'] * (1 - d['discount']))
 .groupby('store_id')['revenue'].sum()
 .sort_values(ascending=False)
 .round(0))
```

Read it like a recipe: take the orders, keep 2026, add revenue, total per store, sort, round. The brackets let the chain spread over many lines, one step per line, so you can comment out a step to see the table before it.

Step through the chain one link at a time and watch the shape change.

<div class="steps" data-fig="@data-chain-pipeline">
<div class="step">Start: the raw DataFrame.</div>
<div class="step">query: fewer rows, same columns.</div>
<div class="step">assign: one new column, same rows.</div>
<div class="step">groupby and sum: many rows collapse to one per region.</div>
<div class="step">sort_values: same rows, new order.</div>
<div class="step">head: only the top rows are kept.</div>
</div>


## 3. pipe for your own steps

```python data=orders.csv
import pandas as pd

def add_revenue(d):
    return d.assign(revenue=d['qty'] * d['unit_price'] * (1 - d['discount']))

def top(d, col, n=3):
    return d.nlargest(n, col)

(pd.read_csv('orders.csv', parse_dates=['date'])
 .pipe(add_revenue)
 .groupby('customer_id', as_index=False)['revenue'].sum()
 .pipe(top, 'revenue', n=5)
 .round(2))
```

Small named functions plus `pipe` make a chain that a teammate can read and reuse.

<div class="meaning">

<dl>
<dt>( ... ) around the chain</dt><dd>Lets each step sit on its own line.</dd>
<dt>.assign(new=lambda d: ...)</dt><dd>Adds a column inside the chain.</dd>
<dt>.query('...')</dt><dd>Filters inside the chain.</dd>
<dt>.pipe(my_function)</dt><dd>Runs your own step as part of the chain.</dd>
<dt>Physical meaning</dt><dd>A chain does exactly what the separate lines did, in the same order; it just leaves no half-finished tables lying around to be reused by mistake. Comment out one line to see the table at that step.</dd>
</dl>

</div>

<div class="myth">

**"Chaining is faster."** It runs at the same speed. Its value is that it reads in order, with no temporary names like df2 and df_final that go stale.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Start.</b> <table class="lk-tbl"><tr><th>store</th><th>qty</th><th>price</th></tr><tr><td>S01</td><td>2</td><td>5</td></tr><tr><td>S02</td><td>1</td><td>8</td></tr><tr><td>S01</td><td>4</td><td>5</td></tr><tr><td>S02</td><td>3</td><td>4</td></tr></table></div>
<div class="step"><b>.query('qty >= 2').</b> Drops the S02 row with qty 1: 3 rows left.</div>
<div class="step"><b>.assign(revenue=lambda d: d.qty * d.price).</b> 10, 20, 12.</div>
<div class="step"><b>.groupby('store')['revenue'].sum().</b> <table class="lk-tbl"><tr><th>store</th><th>revenue</th></tr><tr><td>S01</td><td><mark>30</mark></td></tr><tr><td>S02</td><td><mark>12</mark></td></tr></table></div>
<div class="step"><b>.sort_values(ascending=False).</b> S01 first. Four steps, one readable block.</div>
</div>

<div class="problem" data-problem="pd-chain-result"></div>

## 4. Your turn

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
# One chain: keep store WEB, add revenue (qty * unit_price * (1 - discount)) with assign,
# then total revenue per month ('MS') with resample on date, rounded to 0. Show it.
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
(orders
 .query("store_id == 'WEB'")
 .assign(revenue=lambda d: d['qty'] * d['unit_price'] * (1 - d['discount']))
 .resample('MS', on='date')['revenue'].sum()
 .round(0))
```
```python check
w = orders[orders['store_id'] == 'WEB']
exp = (w['qty'] * w['unit_price'] * (1 - w['discount'])).groupby(w['date'].dt.to_period('M')).sum().round(0)
assert isinstance(_, pd.Series) and len(_) == 18, f'Expected 18 months, got {len(_)}.'
assert abs(_.sum() - exp.sum()) < 20, 'The months should add up to all WEB revenue.'
assert 'revenue' not in orders.columns, 'Use assign, so orders itself is not changed.'
```
```hint
Start with (orders .query("store_id == 'WEB'") then .assign(revenue=lambda d: ...) then .resample('MS', on='date')['revenue'].sum() and .round(0)).
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** every method returns a **new** table, so `a.f().g()` means "do f, then do g to the result". That is function composition, the same idea as `g(f(a))` in maths, written left to right so it reads in the order things happen.

**No in-place changes:** `assign` leaves the original alone, so you can rerun a cell without breaking it. Section 1 writes a column into a filtered slice: older pandas warned about that ("SettingWithCopyWarning"), and pandas 3 quietly makes a copy. A chain never has the question at all.

**Debugging a chain:** put `.pipe(lambda d: print(d.shape) or d)` between steps to print the size at that point.
</details>

## 5. Practice

1. Rewrite `df = df[df.qty > 2]; df = df.sort_values('qty')` as a chain.
2. Why does `assign(x=orders['qty'] * 2)` go wrong after a `query` in the same chain?
3. Write a function `clean(d)` and use it with `pipe`.

<details>
<summary>Answers</summary>

1. `df.query('qty > 2').sort_values('qty')`.
2. It uses the full, unfiltered `orders`; pandas lines rows up by index, so it works by luck or fills NaN. Use `lambda d: d['qty'] * 2`.
3. `def clean(d): return d.dropna().drop_duplicates()` then `orders.pipe(clean)`.
</details>

**New words:** *method chaining*, *assign*, *lambda*, *query*, *pipe*, *in place*.

<div class="keypoints">

- Wrap the chain in brackets, one step per line.
- assign with lambda d: adds columns from the table at that step.
- pipe runs your own function as a step.
- Debug by commenting out lines from the bottom.

</div>
