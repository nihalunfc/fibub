---
title: 'Sorting and top-N'
summary: 'Sort by one or several columns, ascending or descending, find the top or bottom N with nlargest and nsmallest, rank values, and reset the index after sorting.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: "How do you sort by store, then by qty from high to low?"
    choices: ["df.sort_values(['store_id', 'qty'], ascending=[True, False])", "df.sort('store_id', 'qty')", "df.sort_values('store_id').sort_values('qty')"]
    ans: 0
    why: 'Give a list of columns and a matching list of directions.'
  - q: 'What does df.nlargest(5, "qty") return?'
    choices: ['The 5 largest qty values only', 'The 5 rows with the largest qty', 'The 5th largest value']
    ans: 1
    why: 'nlargest returns whole rows, sorted from largest.'
  - q: 'Why use reset_index(drop=True) after sorting?'
    choices: ['To undo the sort', 'To number the rows 0, 1, 2 again in the new order', 'It is required']
    ans: 1
    why: 'Sorting keeps each row''s original label; resetting gives clean positions-as-labels.'
sources:
  - 'pandas documentation, User Guide: Essential basic functionality (sorting) https://pandas.pydata.org/docs/user_guide/basics.html#sorting'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 2 · about 15 minutes · uses Lesson 2.3.** You'll be able to sort tables and pull out top and bottom N.

<div class="bigidea">sort_values puts rows in order by one or more columns, and nlargest and nsmallest jump straight to the top or bottom N.</div>

**In everyday terms:** sorting a deck of cards by suit and then by number within each suit: the first key decides, the second breaks ties.

## 1. sort_values

```python data=products.csv
import pandas as pd

products = pd.read_csv('products.csv')
display(products.sort_values('price', ascending=False).head(5))
products.sort_values(['category', 'price'], ascending=[True, False]).head(8)
```

The second sort orders categories A to Z, and within each category the most expensive first.

## 2. Top and bottom N

```python data=products.csv
import pandas as pd

products = pd.read_csv('products.csv')
display(products.nlargest(3, 'price'))
products.nsmallest(3, 'price')
```

`nlargest` is shorter and faster than sorting the whole table when you only need a few rows.

**Top N within each group** combines sorting with `groupby` (Module 4):

```python data=products.csv
import pandas as pd

products = pd.read_csv('products.csv')
products.sort_values('price', ascending=False).groupby('category').head(1)
```

Step through the chain one link at a time and watch the shape change.

<div class="steps" data-fig="@data-chain-pipeline">
<div class="step">Start: the raw DataFrame.</div>
<div class="step">query: fewer rows, same columns.</div>
<div class="step">assign: one new column, same rows.</div>
<div class="step">groupby and sum: many rows collapse to one per region.</div>
<div class="step">sort_values: same rows, new order.</div>
<div class="step">head: only the top rows are kept.</div>
</div>


## 3. Ranks and a clean index

```python data=products.csv
import pandas as pd

products = pd.read_csv('products.csv')
products['price_rank'] = products['price'].rank(ascending=False, method='min').astype(int)
products.sort_values('price_rank').reset_index(drop=True).head()
```

`method='min'` gives tied values the same (best) rank, like a sports table. `reset_index(drop=True)` renumbers rows 0, 1, 2 in the new order.

<div class="meaning">

<dl>
<dt>sort_values('qty', ascending=False)</dt><dd>Biggest first.</dd>
<dt>sort_values(['store', 'qty'])</dt><dd>By store, then by qty within store.</dd>
<dt>nlargest(5, 'qty')</dt><dd>The 5 biggest rows, quickly.</dd>
<dt>rank()</dt><dd>Each value's place in the order.</dd>
<dt>Physical meaning</dt><dd>Sorting changes the order of rows but keeps their labels. That is why reset_index(drop=True) is often the next step, to number the sorted rows 0, 1, 2 again.</dd>
</dl>

</div>

<div class="myth">

**"Sorting by two columns sorts each one separately."** It sorts by the first, and uses the second only to order rows that tie on the first.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Start.</b> <table class="lk-tbl"><tr><th>store</th><th>qty</th></tr><tr><td>WEB</td><td>2</td></tr><tr><td>S01</td><td>5</td></tr><tr><td>S01</td><td>1</td></tr><tr><td>WEB</td><td>4</td></tr></table></div>
<div class="step"><b>Sort by store.</b> S01, S01, WEB, WEB.</div>
<div class="step"><b>Then by qty, biggest first.</b> <code>sort_values(['store', 'qty'], ascending=[True, False])</code></div>
<div class="step"><b>Result.</b> <table class="lk-tbl"><tr><th>store</th><th>qty</th></tr><tr><td>S01</td><td>5</td></tr><tr><td>S01</td><td>1</td></tr><tr><td>WEB</td><td>4</td></tr><tr><td>WEB</td><td>2</td></tr></table></div>
</div>

<div class="problem" data-problem="pd-rank"></div>

## 4. Your turn

```python exercise data=customers.csv
import pandas as pd

customers = pd.read_csv('customers.csv', parse_dates=['signup_date'])
# Show the 5 customers who signed up most recently.
```
```python solution
import pandas as pd

customers = pd.read_csv('customers.csv', parse_dates=['signup_date'])
customers.nlargest(5, 'signup_date')
```
```python check
assert isinstance(_, pd.DataFrame) and len(_) == 5, 'Show 5 rows.'
assert _['signup_date'].min() >= customers['signup_date'].nlargest(5).min(), 'These should be the 5 latest signup dates.'
```
```hint
Sort signup_date with ascending=False and take head(5), or use nlargest(5, 'signup_date').
```

```python exercise data=products.csv
import pandas as pd

products = pd.read_csv('products.csv')
# Sort by category A to Z, then by cost from low to high. Reset the index (drop=True). Show it.
```
```python solution
import pandas as pd

products = pd.read_csv('products.csv')
products.sort_values(['category', 'cost'], ascending=[True, True]).reset_index(drop=True)
```
```python check
exp = products.sort_values(['category', 'cost']).reset_index(drop=True)
assert isinstance(_, pd.DataFrame), 'Show the sorted table on the last line.'
assert _['product'].tolist() == exp['product'].tolist(), 'Sort by category, then cost (both ascending).'
assert _.index.tolist() == list(range(len(_))), 'Add .reset_index(drop=True).'
```
```hint
sort_values(['category', 'cost']) sorts both ascending; then .reset_index(drop=True).
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** sorting reorders rows but keeps each row's label, so you can always trace a row back. Missing values go last by default (`na_position='first'` to change it).

**Stable sorts:** to sort by A within B, either sort by `[B, A]` in one call, or sort by A then by B with `kind='stable'`, which keeps the earlier order among ties.
</details>

## 5. Practice

1. The 10 cheapest products?
2. Products from most to least margin (price − cost)?
3. What does `rank(method='dense')` do differently from `'min'`?

<details>
<summary>Answers</summary>

1. `products.nsmallest(10, 'price')`.
2. `products.assign(margin=products['price'] - products['cost']).sort_values('margin', ascending=False)`.
3. Dense ranks leave no gaps after ties (1, 2, 2, 3) where `'min'` skips (1, 2, 2, 4).
</details>

**New words:** *sort_values*, *ascending*, *nlargest*, *nsmallest*, *rank*, *reset_index*.

<div class="keypoints">

- sort_values sorts by one or more columns; ascending can be a list.
- nlargest / nsmallest find the top or bottom N fast.
- rank gives positions; method= decides how ties are handled.
- reset_index(drop=True) renumbers rows after sorting.

</div>
