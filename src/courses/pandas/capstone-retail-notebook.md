---
title: 'Capstone: a retail analysis notebook'
summary: 'Answer a real business question end to end with pandas: check and join four tables, compare the first half of 2026 with 2025 by store, category, product and customer, test what discounts really do, and publish the notebook on GitHub as a portfolio piece.'
seoTitle: 'pandas capstone: a retail sales analysis notebook'
minutes: 120
updated: 2026-11-22
quiz:
  - q: 'What should the first cell under the title of your notebook say?'
    choices: ['The answer: three findings with numbers', 'The imports', 'How pandas works']
    ans: 0
    why: 'A hiring manager reads the top and decides whether to scroll. Lead with the answer.'
  - q: 'Revenue is up 10 %, but two stores fell. What makes this a useful finding?'
    choices: ['It names where to act, with the size of the change and a likely reason to check', 'It shows the code works', 'It uses many charts']
    ans: 0
    why: 'Analysis is useful when it points to a decision.'
  - q: 'Discounted lines sell 1.58 units on average against 1.56 without a discount, at a 30 % margin instead of 40 %. A fair first conclusion?'
    choices: ['Discounts barely change units here but cost about 10 margin points, so test smaller or fewer discounts', 'Discounts work', 'Remove all discounts tomorrow']
    ans: 0
    why: 'This is a comparison, not an experiment, so suggest a test rather than a final verdict.'
sources:
  - 'Knaflic, C. N. (2015), Storytelling with Data, Wiley'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 9 · about 2 hours · uses all of the course.** You'll write a complete analysis notebook and publish it on GitHub, the piece employers ask to see when they say "show me some Python".

<div class="bigidea">A portfolio notebook answers a business question end to end: check the data, join it safely, give the headline, find where it comes from, and say what to do.</div>

**In everyday terms:** a doctor's report: tests checked, the main finding first, the evidence for it, and a clear next step, not a list of every measurement taken.

## 1. The brief

*Made-up chain, made-up data.* A retail chain has six stores in four provinces and a web shop. The head of retail asks:

> "Revenue is up in the first half of 2026, but not in every store. Where is the growth coming from, where are we slipping, and what should we do in the second half?"

**Download:** the [starter notebook](/data/courses/pandas/retail-capstone.ipynb) and the four tables: [orders.csv](/data/courses/pandas/orders.csv) (9,717 order lines, Jan 2025 to Jun 2026), [products.csv](/data/courses/pandas/products.csv), [stores.csv](/data/courses/pandas/stores.csv), [customers.csv](/data/courses/pandas/customers.csv). Open the notebook in Jupyter, VS Code or Google Colab, or work in the boxes on this page.

## 2. Check, then join

```python data=orders.csv,products.csv,stores.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
products = pd.read_csv('products.csv')
stores = pd.read_csv('stores.csv')
print('rows', len(orders), '| duplicate lines', orders.duplicated().sum(), '| missing', int(orders.isna().sum().sum()))
print('dates', orders['date'].min().date(), 'to', orders['date'].max().date())
full = (orders
        .merge(products[['product_id', 'category', 'cost']], on='product_id', how='left', validate='many_to_one')
        .merge(stores[['store_id', 'store', 'province']], on='store_id', how='left', validate='many_to_one'))
assert len(full) == len(orders), 'a join added rows'
full['revenue'] = full['qty'] * full['unit_price'] * (1 - full['discount'])
full['margin'] = full['revenue'] - full['qty'] * full['cost']
full.head()
```

`validate='many_to_one'` makes pandas stop if a lookup table has a repeated key (Lesson 5.3). The `assert` is your safety net.

## 3. The headline

```python data=orders.csv,products.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
full = orders.merge(pd.read_csv('products.csv')[['product_id', 'category', 'cost']], on='product_id')
full['revenue'] = full['qty'] * full['unit_price'] * (1 - full['discount'])
full['margin'] = full['revenue'] - full['qty'] * full['cost']
h1 = full[full['date'].dt.month <= 6].assign(year=lambda d: d['date'].dt.year)       # Jan-Jun, like for like
k = h1.groupby('year').agg(revenue=('revenue', 'sum'), orders=('order_id', 'nunique'),
                           customers=('customer_id', 'nunique'), margin=('margin', 'sum'))
k['aov'] = k['revenue'] / k['orders']
k['margin_%'] = k['margin'] / k['revenue'] * 100
k.loc['change_%'] = (k.loc[2026] / k.loc[2025] - 1) * 100
k.round(1)
```

Revenue is up about 10 %, driven by **more orders and more customers**, while the average order got slightly smaller. That is already a sentence for the top of the notebook.

<div class="meaning">

<dl>
<dt>Brief</dt><dd>The question and who will read the answer.</dd>
<dt>Checks</dt><dd>Row counts, keys, totals reconciled before any chart.</dd>
<dt>Headline</dt><dd>One sentence with a number: "Revenue grew 12 %, mostly from WEB".</dd>
<dt>Drill-down</dt><dd>Which store, product or segment drives it.</dd>
<dt>Physical meaning</dt><dd>Growth splits into parts that add up: each store's change in revenue sums to the total change. Showing those parts is what turns "revenue grew" into "here is where to invest".</dd>
</dl>

</div>

<div class="myth">

**"More charts make a better notebook."** Reviewers read the first screen. One headline, three supporting charts and a recommendation beat twenty unexplained plots.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Check.</b> Lines 12,480; order_id unique per line; revenue reconciles with finance.</div>
<div class="step"><b>Join.</b> Stores and products with <code>validate='many_to_one'</code>; row count unchanged.</div>
<div class="step"><b>Headline.</b> Revenue up from 410k to 460k: +12.2 %.</div>
<div class="step"><b>Where?</b> <table class="lk-tbl"><tr><th>store</th><th>last year</th><th>this year</th><th>change</th></tr><tr><td>S01</td><td>150</td><td>152</td><td>2</td></tr><tr><td>S02</td><td>140</td><td>138</td><td>-2</td></tr><tr><td>WEB</td><td>120</td><td>170</td><td><mark>50</mark></td></tr></table> (thousands)</div>
<div class="step"><b>Recommendation.</b> WEB makes all of the growth: invest there, and find out why S02 slipped.</div>
</div>

<div class="problem" data-problem="pd-growth-share"></div>

## 4. Your turn: where is the growth?

```python exercise data=orders.csv,stores.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date']).merge(pd.read_csv('stores.csv'), on='store_id')
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
# Make t: revenue per store (the store name column) for Jan-Jun 2025 and Jan-Jun 2026 as two columns (2025, 2026),
# plus change_% = (2026 / 2025 - 1) * 100. Show t sorted by change_%, rounded to 1 decimal.
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date']).merge(pd.read_csv('stores.csv'), on='store_id')
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
h1 = orders[orders['date'].dt.month <= 6]
t = h1.groupby(['store', h1['date'].dt.year])['revenue'].sum().unstack()
t['change_%'] = (t[2026] / t[2025] - 1) * 100
t.sort_values('change_%').round(1)
```
```python check
assert isinstance(_, pd.DataFrame) and len(_) == 7, 'One row per store (7 including Online).'
assert 'change_%' in _.columns, 'Add a change_% column.'
assert list(_.index[:2]) == ['Harbourview', 'Online'], 'The two stores that shrank should come first.'
```
```hint
Keep months 1 to 6, group by ['store', h1['date'].dt.year], sum revenue, unstack(), then add change_%.
```

Two stores shrank (Harbourview, the biggest store, and Online) while Cedar Falls grew by more than a third. Your notebook should ask **why**: product mix, fewer customers, smaller baskets? Split each store's change into customers × orders per customer × AOV to find out.

## 5. Your turn: what do discounts do?

```python exercise data=orders.csv,products.csv
import pandas as pd

full = pd.read_csv('orders.csv').merge(pd.read_csv('products.csv')[['product_id', 'cost']], on='product_id')
full['revenue'] = full['qty'] * full['unit_price'] * (1 - full['discount'])
full['margin'] = full['revenue'] - full['qty'] * full['cost']
# Make d: one row for discounted lines (discount > 0) and one for full price, with avg_qty (mean qty)
# and margin_% (sum of margin / sum of revenue * 100). Show d rounded to 2 decimals.
```
```python solution
import pandas as pd

full = pd.read_csv('orders.csv').merge(pd.read_csv('products.csv')[['product_id', 'cost']], on='product_id')
full['revenue'] = full['qty'] * full['unit_price'] * (1 - full['discount'])
full['margin'] = full['revenue'] - full['qty'] * full['cost']
g = full.groupby(full['discount'] > 0)
d = pd.DataFrame({'avg_qty': g['qty'].mean(), 'margin_%': g['margin'].sum() / g['revenue'].sum() * 100})
d.round(2)
```
```python check
assert isinstance(_, pd.DataFrame) and len(_) == 2 and {'avg_qty', 'margin_%'} <= set(_.columns), 'Two rows, with avg_qty and margin_%.'
m = sorted(_['margin_%'].tolist())
assert 29 < m[0] < 31 and 39 < m[1] < 41, 'margin_% is total margin / total revenue in each group (about 30 and 40).'
```
```hint
Group by full['discount'] > 0. margin_% must be sum of margin / sum of revenue, not the mean of per-line margins.
```

## 6. The rest of the notebook

The starter notebook walks you through the remaining steps. Each has a lesson behind it:

1. **Monthly trend** with year over year growth: season or real change? (Lesson 7.4)
2. **Products:** Pareto and ABC; is any A product shrinking? (Lesson 8.3)
3. **Customers:** RFM segments and how much revenue sits in At risk; a retention table (Lessons 8.4 and 8.5).
4. **Recommendations:** three actions, each with the number behind it, what it could be worth and how to test it (an A/B test, Statistics course Module 7).
5. **Limits:** what this data cannot say (no footfall, no competitor prices, made-up data).

## 7. Publish it on GitHub

1. Make a repository called `retail-analysis-pandas` with `data/`, the notebook, and a `README.md`.
2. Run the notebook top to bottom (Kernel > Restart and run all) so every output is fresh, then commit it. GitHub shows notebooks with their charts.
3. The README in five lines: the question, the answer (three bullets with numbers), the methods used, how to run it, and "data is made up, from the fibub pandas course".
4. Pin the repository on your GitHub profile and link it from your CV under Projects.

**What a strong notebook shows:** the answer first; checks before results; one clean table built with checked joins; like-for-like comparisons; ratios rebuilt from totals; a few clear charts with titles that state the finding; short markdown between code cells; and recommendations that someone could act on on Monday.

<details class="maths" open>
<summary>How it works</summary>

**Principle:** most business questions break into **where** (stores, regions), **what** (products, categories), **who** (customers) and **when** (trend, season). Splitting a change into its parts tells you where to look:

```math
\text{revenue} = \text{customers} \times \frac{\text{orders}}{\text{customer}} \times \frac{\text{revenue}}{\text{order}}
```

If revenue rose 10 % with 12 % more customers and a 2 % smaller basket, the growth is reach, not spending, and the actions are different from the other way round.
</details>

## 8. Practice

1. Split the chain's H1 change into customers, orders per customer and AOV.
2. Which category grew fastest? Is it a high or low margin category?
3. Write the three-bullet answer for the top of the notebook.

<details>
<summary>Answers</summary>

1. From section 3: customers 855 → 961 (+12.4 %), orders per customer 2.00 → 2.01 (about the same), AOV 39.5 → 38.6 (−2.4 %).
2. Grocery, about +35 %. Merge `cost` and compare margin % by category; groceries usually carry thinner margins.
3. For example: "Revenue +10 % (H1 2026 vs 2025), from 12 % more customers; baskets 2 % smaller. Harbourview (−4 %) and Online (−1 %) shrank while Cedar Falls grew 38 %. Discounted lines sell about the same number of units at 10 points less margin: test smaller discounts."
</details>

**Try it on your own data:** [[csv-profiler]] for the first look and [[merge-csv]] to join two files without code.

**New words:** *notebook*, *like for like*, *revenue decomposition*, *README*, *portfolio piece*.

<div class="keypoints">

- Start with the brief and the checks, not the charts.
- Lead with one headline number.
- Split the change into parts that add up.
- End with what to do and what to check next.

</div>
