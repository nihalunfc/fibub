---
title: 'Bins and bands with cut and qcut'
summary: 'Turn numbers into bands: pd.cut for fixed edges you choose (price bands, age groups), pd.qcut for equal-sized groups (quartiles, deciles), then summarise by band.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'Which makes four groups with the same number of customers each?'
    choices: ['pd.qcut(spend, 4)', 'pd.cut(spend, 4)', 'spend.round(4)']
    ans: 0
    why: 'qcut uses quantiles, so each bin holds about a quarter of the rows. cut(…, 4) makes four equal-width ranges.'
  - q: "pd.cut(price, [0, 10, 20, 100]) puts a price of exactly 10 in which bin?"
    choices: ['(0, 10]', '(10, 20]', 'Neither']
    ans: 0
    why: 'Bins include the right edge by default; right=False flips that.'
  - q: 'Why use labels= in cut?'
    choices: ['To make the output readable, like "budget", "mid", "premium"', 'It is required', 'To sort the bins']
    ans: 0
    why: 'Labels replace interval notation with names people understand.'
sources:
  - 'pandas documentation, User Guide: Reshaping (cut, qcut) https://pandas.pydata.org/docs/user_guide/reshaping.html'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 4 · about 15 minutes · uses Lesson 4.1.** You'll be able to group numbers into bands and summarise by band.

<div class="bigidea">cut puts numbers into bands with edges you choose; qcut makes bands that each hold about the same number of rows.</div>

**In everyday terms:** postage: parcels go into weight bands (0-1 kg, 1-5 kg, over 5 kg) with fixed edges, like cut. A teacher splitting a class into four equal-sized reading groups by score is qcut.

## 1. cut: your own edges

```python data=products.csv
import pandas as pd

products = pd.read_csv('products.csv')
products['band'] = pd.cut(products['price'], bins=[0, 10, 20, 100], labels=['under $10', '$10-20', 'over $20'])
display(products['band'].value_counts().sort_index())
products.groupby('band', observed=True).agg(n=('product', 'count'), avg_price=('price', 'mean')).round(2)
```

The result is an **ordered category**, so bands sort low to high. `observed=True` leaves out empty bands.

## 2. qcut: equal-sized groups

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
spend = orders.groupby('customer_id')['revenue'].sum()
quartile = pd.qcut(spend, 4, labels=['Q1 low', 'Q2', 'Q3', 'Q4 high'])
summary = spend.groupby(quartile, observed=True).agg(['count', 'min', 'max', 'sum']).round(0)
summary['share_of_revenue'] = (summary['sum'] / summary['sum'].sum() * 100).round(1)
summary
```

Quartiles and deciles of customer spend are the starting point for segmentation (Lesson 8.4): how much revenue comes from the top quarter?

<div class="meaning">

<dl>
<dt>pd.cut(x, bins=[0, 10, 50, 1000])</dt><dd>Bands with your edges; (10, 50] means above 10 up to 50.</dd>
<dt>labels=[...]</dt><dd>Names for the bands.</dd>
<dt>pd.qcut(x, 4)</dt><dd>Quartile bands: about a quarter of rows each.</dd>
<dt>right=False</dt><dd>Include the left edge instead: [10, 50).</dd>
<dt>Physical meaning</dt><dd>Bands turn a continuous number into a category you can group and chart. cut keeps the meaning of the edges (price points); qcut keeps the group sizes equal (fair comparisons, RFM scores).</dd>
</dl>

</div>

<div class="myth">

**"A value on the edge goes in the higher band."** With the default right=True, 10 falls in (0, 10], the lower band. Check the edges against what the business means by "under $10".

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Prices.</b> 4.5, 10, 18, 49, 120.</div>
<div class="step"><b>Edges.</b> <code>pd.cut(prices, [0, 10, 50, 1000], labels=['budget', 'mid', 'premium'])</code></div>
<div class="step"><b>10.</b> Falls in (0, 10]: budget.</div>
<div class="step"><b>Result.</b> <table class="lk-tbl"><tr><th>price</th><th>band</th></tr><tr><td>4.5</td><td>budget</td></tr><tr><td>10</td><td><mark>budget</mark></td></tr><tr><td>18</td><td>mid</td></tr><tr><td>49</td><td>mid</td></tr><tr><td>120</td><td>premium</td></tr></table></div>
</div>

<div class="problem" data-problem="pd-cut-band"></div>

## 3. Your turn

```python exercise data=customers.csv
import pandas as pd

customers = pd.read_csv('customers.csv', parse_dates=['signup_date'])
customers['days'] = (pd.Timestamp('2026-06-30') - customers['signup_date']).dt.days
# Band 'days' into: 'new' (0-180], 'recent' (180-365], 'established' (365-2000]. Show the count per band.
```
```python solution
import pandas as pd

customers = pd.read_csv('customers.csv', parse_dates=['signup_date'])
customers['days'] = (pd.Timestamp('2026-06-30') - customers['signup_date']).dt.days
customers['tenure'] = pd.cut(customers['days'], [0, 180, 365, 2000], labels=['new', 'recent', 'established'])
customers['tenure'].value_counts().sort_index()
```
```python check
exp = pd.cut(customers['days'], [0, 180, 365, 2000], labels=['new', 'recent', 'established']).value_counts()
assert isinstance(_, pd.Series) and set(map(str, _.index)) == {'new', 'recent', 'established'}, 'Show the counts per band.'
assert _.sum() == exp.sum() and int(_['established']) == int(exp['established']), 'Use pd.cut with edges [0, 180, 365, 2000] and the three labels.'
```
```hint
pd.cut(customers['days'], [0, 180, 365, 2000], labels=['new', 'recent', 'established']), then value_counts().
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** `cut` asks "which range does this value fall in?" with edges you set; `qcut` first finds the quantiles (Statistics Lesson 1.5) and uses them as edges, so each bin holds about the same number of rows.

**When to use which:** `cut` for bands that mean something to the business (price points, age groups, delivery distance); `qcut` for relative groups (top 25 % of spenders). With skewed data, equal-width `cut(x, 4)` puts nearly everyone in the first bin.
</details>

## 4. Practice

1. Split order revenue into deciles.
2. Edges `[0, 18, 35, 65, 120]` for ages: which bin is age 35 in?
3. Why might `qcut` fail with "Bin edges must be unique"?

<details>
<summary>Answers</summary>

1. `pd.qcut(revenue, 10, labels=False)` (0 to 9) or with labels.
2. (18, 35], because the right edge is included.
3. Many repeated values (such as lots of zeros) make two quantiles equal. Use `duplicates='drop'` or rank first.
</details>

**Try it on your own data:** [[histogram-builder]] shows how your numbers spread before you choose edges.

**New words:** *bin*, *cut*, *qcut*, *quantile bins*, *band*, *observed*.

<div class="keypoints">

- cut: fixed edges you choose; qcut: equal-sized groups.
- Default bands include the right edge: (a, b].
- Name the bands with labels=.
- Group by the band to compare segments.

</div>
