---
title: 'Selecting columns'
summary: 'Pick one column or several, reorder them, drop the ones you do not need, rename them, and choose columns by type, so every later step works on a smaller, clearer table.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: "How do you keep only the date and qty columns?"
    choices: ["df['date', 'qty']", "df[['date', 'qty']]", "df.date.qty"]
    ans: 1
    why: 'A list of names inside the brackets: two pairs of brackets.'
  - q: "How do you rename 'qty' to 'units'?"
    choices: ["df.rename(columns={'qty': 'units'})", "df['qty'] = 'units'", "df.columns = 'units'"]
    ans: 0
    why: 'rename takes a dictionary of old name to new name and returns a new DataFrame.'
  - q: "After df.drop(columns=['discount']), is the column gone from df?"
    choices: ['Yes', 'No: drop returns a new DataFrame; assign it back (df = df.drop(...)) to keep the change', 'Only for numbers']
    ans: 1
    why: 'Most pandas methods return a new object and leave the original alone.'
sources:
  - 'pandas documentation, User Guide: Indexing and selecting data https://pandas.pydata.org/docs/user_guide/indexing.html'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 2 · about 15 minutes · uses Lesson 1.4.** You'll be able to pick, drop, reorder and rename columns.

<div class="bigidea">Choose the columns you need by name, drop the rest, and rename them so the table reads well.</div>

**In everyday terms:** packing for a trip: take out only what you need, leave the rest, and label the bags so you can find things.

## 1. One, several, reordered

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
qty = orders['qty']                                   # one column: a Series
small = orders[['date', 'store_id', 'qty']]           # several: a DataFrame, in the order you list
small.head()
```

## 2. Drop and rename

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
orders = orders.drop(columns=['discount'])
orders = orders.rename(columns={'qty': 'units', 'unit_price': 'price'})
orders.head(3)
```

Methods like `drop` and `rename` **return a new DataFrame**; assigning it back (`orders = ...`) keeps the change.

**Tidy names** make code easier: lower case, underscores, no spaces. One line cleans all of them:

```python
import pandas as pd

df = pd.DataFrame(columns=['Order ID', ' Store Name', 'Unit Price ($)'])
df.columns = df.columns.str.strip().str.lower().str.replace(r'[^a-z0-9]+', '_', regex=True).str.strip('_')
list(df.columns)
```

Choose two conditions and a combiner and read the True/False columns row by row.

<figure class="fig" data-fig="@data-mask-filter"><figcaption>Notice that the filter keeps rows where the final mask is True, and that the original index stays attached.</figcaption></figure>


## 3. By type or by pattern

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
display(orders.select_dtypes('number').head(3))       # only numeric columns
orders.filter(like='_id').head(3)                     # names containing '_id'
```

<div class="meaning">

<dl>
<dt>df[['a', 'b']]</dt><dd>Keep these columns, in this order.</dd>
<dt>drop(columns=[...])</dt><dd>Remove columns.</dd>
<dt>rename(columns={'old': 'new'})</dt><dd>Change names.</dd>
<dt>select_dtypes / filter(like=...)</dt><dd>Choose by type or by part of the name.</dd>
<dt>Physical meaning</dt><dd>Narrow tables are faster, easier to read and harder to misuse. Selecting columns is deciding which facts the analysis is about.</dd>
</dl>

</div>

<div class="myth">

**"rename changes the table."** Like most pandas methods, it returns a new table. Write <code>df = df.rename(...)</code> to keep the result.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Start.</b> 8 columns: order_id, date, customer_id, store_id, product_id, qty, unit_price, discount.</div>
<div class="step"><b>Keep four.</b> <code>orders[['date', 'store_id', 'qty', 'unit_price']]</code></div>
<div class="step"><b>Rename.</b> <code>.rename(columns={'unit_price': 'price'})</code></div>
<div class="step"><b>Result.</b> <table class="lk-tbl"><tr><th>date</th><th>store_id</th><th>qty</th><th>price</th></tr><tr><td>2025-01-01</td><td>S04</td><td>2</td><td>19.99</td></tr><tr><td>2025-01-01</td><td>S01</td><td>1</td><td>4.29</td></tr></table></div>
</div>

<div class="problem" data-problem="pd-columns-count"></div>

## 4. Your turn

```python exercise data=products.csv
import pandas as pd

products = pd.read_csv('products.csv')
# Make a DataFrame called view with only product, category and price, in that order. Show it.
```
```python solution
import pandas as pd

products = pd.read_csv('products.csv')
view = products[['product', 'category', 'price']]
view
```
```python check
assert 'view' in dir(), 'Make a variable called view.'
assert list(view.columns) == ['product', 'category', 'price'], f'view has {list(view.columns)}.'
```
```hint
Use a list of names in the brackets: products[['product', 'category', 'price']].
```

```python exercise data=products.csv
import pandas as pd

products = pd.read_csv('products.csv')
# Rename price to list_price and drop cost. Keep the result in products and show it.
```
```python solution
import pandas as pd

products = pd.read_csv('products.csv')
products = products.rename(columns={'price': 'list_price'}).drop(columns=['cost'])
products
```
```python check
assert 'list_price' in products.columns and 'price' not in products.columns, 'Rename price to list_price, and assign the result back to products.'
assert 'cost' not in products.columns, "Drop the cost column (drop(columns=['cost']))."
```
```hint
products = products.rename(columns={'price': 'list_price'}).drop(columns=['cost'])
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** `df[...]` with a string selects a column; with a list it selects columns; with a True/False Series it selects rows (next lessons). The brackets mean different things depending on what you put in them, which is why `loc` (Lesson 2.2) exists: it's explicit.

**Chaining:** methods that return a DataFrame can be chained, one step per line inside brackets, which reads like a recipe (Lesson 8.1):

```python data=orders.csv
import pandas as pd

(pd.read_csv('orders.csv')
   .drop(columns=['discount'])
   .rename(columns={'qty': 'units'})
   .head(3))
```
</details>

## 5. Practice

1. Write the code to keep `customer_id` and `segment` from `customers`.
2. Why does `orders.drop(columns=['qty'])` on its own seem to do nothing?
3. How do you get only the text columns?

<details>
<summary>Answers</summary>

1. `customers[['customer_id', 'segment']]`.
2. It returns a new DataFrame that wasn't stored. Use `orders = orders.drop(columns=['qty'])`.
3. `df.select_dtypes('str')` in pandas 3 (or `'object'` in older versions).
</details>

**New words:** *select*, *drop*, *rename*, *select_dtypes*, *method chaining*.

<div class="keypoints">

- Double brackets select several columns in the order you list.
- drop(columns=...) removes; rename(columns={...}) renames.
- select_dtypes and filter choose columns by type or name pattern.
- Assign the result back; methods return new tables.

</div>
