---
title: 'RFM customer segmentation'
summary: 'Score every customer on recency, frequency and money spent with groupby and qcut, turn the scores into named segments such as Champions and At risk with np.select, and say what each segment should get.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'What does R in RFM measure?'
    choices: ['Days since the last purchase (smaller is better)', 'Total revenue', 'Number of returns']
    ans: 0
    why: 'Recency, Frequency (number of orders), Monetary (money spent).'
  - q: 'Why rank frequency before qcut?'
    choices: ['Many customers share the same order count, so the bin edges would repeat', 'Ranking makes it faster', 'qcut only takes ranks']
    ans: 0
    why: "rank(method='first') breaks ties so qcut can make 5 equal groups."
  - q: 'A customer with R = 1 and F = 5 is best described as...'
    choices: ['At risk: used to buy often, has not been back for a long time', 'A champion', 'New']
    ans: 0
    why: 'High past value but not recent: the group a win-back offer is for.'
sources:
  - 'Hughes, A. M. (1994), Strategic Database Marketing, Probus (RFM)'
  - 'pandas documentation, User Guide: pandas.qcut https://pandas.pydata.org/docs/reference/api/pandas.qcut.html'
---

**Module 8 · about 20 minutes · uses Lessons 4.2 and 4.5.** You'll be able to segment customers by behaviour, the classic CRM analysis.

<div class="bigidea">RFM describes each customer by three numbers: how recently they bought, how often, and how much. Scored 1 to 5 against other customers, they turn into segments you can act on.</div>

**In everyday terms:** a café regular: the barista knows who came this morning (recency), who comes every day (frequency) and who orders for the whole office (money).

## 1. One row per customer

Move from the order line grain to the **customer** grain (Lesson 6.5):

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
snapshot = pd.Timestamp('2026-07-01')            # the day after the data ends
rfm = orders.groupby('customer_id').agg(
    last=('date', 'max'),
    frequency=('order_id', 'nunique'),
    monetary=('revenue', 'sum'),
)
rfm['recency'] = (snapshot - rfm['last']).dt.days
rfm = rfm.drop(columns='last').round(2)
rfm.describe().round(1)
```

The **snapshot** date is "today" for the analysis. Fix it, so the numbers don't change each day you rerun.

## 2. Scores from 1 to 5

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
snapshot = pd.Timestamp('2026-07-01')
rfm = orders.groupby('customer_id').agg(last=('date', 'max'), frequency=('order_id', 'nunique'), monetary=('revenue', 'sum'))
rfm['recency'] = (snapshot - rfm['last']).dt.days
rfm['R'] = pd.qcut(rfm['recency'], 5, labels=[5, 4, 3, 2, 1]).astype(int)            # recent = 5
rfm['F'] = pd.qcut(rfm['frequency'].rank(method='first'), 5, labels=[1, 2, 3, 4, 5]).astype(int)
rfm['M'] = pd.qcut(rfm['monetary'], 5, labels=[1, 2, 3, 4, 5]).astype(int)
rfm[['recency', 'frequency', 'monetary', 'R', 'F', 'M']].head(8)
```

`qcut` makes 5 groups of equal size (quintiles). Recency is reversed: fewer days since the last order is better, so it gets 5.

Step through the four stages, then change the aggregate and raise the HAVING bar.

<div class="steps" data-fig="@data-groupby-buckets">
<div class="step">Start with the plain table: ten rows, each with a region and an amount.</div>
<div class="step">Split: every row slides into the bucket for its region.</div>
<div class="step">Apply: the aggregate is worked out inside each bucket on its own.</div>
<div class="step">Combine: each bucket collapses to one result row. HAVING now removes whole groups.</div>
</div>


## 3. Named segments

```python data=orders.csv
import pandas as pd
import numpy as np

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
snapshot = pd.Timestamp('2026-07-01')
rfm = orders.groupby('customer_id').agg(last=('date', 'max'), frequency=('order_id', 'nunique'), monetary=('revenue', 'sum'))
rfm['R'] = pd.qcut((snapshot - rfm['last']).dt.days, 5, labels=[5, 4, 3, 2, 1]).astype(int)
rfm['F'] = pd.qcut(rfm['frequency'].rank(method='first'), 5, labels=[1, 2, 3, 4, 5]).astype(int)
rules = [
    (rfm['R'] >= 4) & (rfm['F'] >= 4),
    (rfm['R'] >= 3) & (rfm['F'] >= 3),
    rfm['R'] >= 4,
    rfm['F'] >= 3,
]
rfm['segment'] = np.select(rules, ['Champions', 'Loyal', 'New or returning', 'At risk'], default='Lapsed')
rfm.groupby('segment').agg(customers=('monetary', 'size'), avg_spend=('monetary', 'mean'), total=('monetary', 'sum')).round(0).sort_values('total', ascending=False)
```

`np.select` checks the rules in order and takes the first that is true, like `CASE WHEN` in SQL. It works on whole columns at once (Lesson 8.8), so it is much faster than `apply` with an `if`.

What each segment gets:

| Segment | Meaning | Action |
|---|---|---|
| Champions | Recent and frequent | Thank, early access, ask for reviews |
| Loyal | Fairly recent and frequent | Loyalty rewards, cross-sell |
| New or returning | Recent, not yet frequent | Welcome series, second-purchase offer |
| At risk | Used to buy often, not lately | Win-back offer, ask why |
| Lapsed | Neither | Low-cost reminders only |

<div class="meaning">

<dl>
<dt>Recency</dt><dd>Days from the last order to a snapshot date. Lower is better.</dd>
<dt>Frequency</dt><dd>Number of distinct orders.</dd>
<dt>Monetary</dt><dd>Total spend.</dd>
<dt>qcut(x, 5, labels=[1..5])</dt><dd>Quintile scores: each score holds a fifth of customers.</dd>
<dt>Physical meaning</dt><dd>Scores are relative to this shop: a 5 means "top fifth here", not a fixed amount. Recency is reversed so 5 is best, and frequency is ranked first because many customers share the same order count.</dd>
</dl>

</div>

<div class="myth">

**"RFM predicts who will buy."** It describes past behaviour. It is a strong first segmentation, but test any action (a voucher to At risk customers) before claiming it works.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>One row per customer.</b> <code>groupby('customer').agg(last=('date', 'max'), frequency=('order_id', 'nunique'), monetary=('revenue', 'sum'))</code></div>
<div class="step"><b>Recency.</b> <code>(snapshot - rfm['last']).dt.days</code></div>
<div class="step"><b>Scores.</b> <table class="lk-tbl"><tr><th>customer</th><th>recency</th><th>freq</th><th>money</th><th>R</th><th>F</th><th>M</th></tr><tr><td>C1</td><td>3</td><td>9</td><td>820</td><td><mark>5</mark></td><td><mark>5</mark></td><td><mark>5</mark></td></tr><tr><td>C2</td><td>40</td><td>4</td><td>260</td><td>3</td><td>3</td><td>3</td></tr><tr><td>C3</td><td>200</td><td>1</td><td>35</td><td>1</td><td>1</td><td>1</td></tr></table></div>
<div class="step"><b>Segments.</b> <code>np.select</code>: R ≥ 4 and F ≥ 4 → Champions; R ≤ 2 and F ≥ 3 → At risk.</div>
<div class="step"><b>Act.</b> Thank Champions; win back At risk; do not spend on one-off bargain hunters.</div>
</div>

<div class="problem" data-problem="pd-rfm-score"></div>

## 4. Your turn

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
# Make rfm: one row per customer_id with recency (days from 2026-07-01 to the last order date),
# frequency (distinct order_id) and monetary (sum of revenue). Show the median recency (a number).
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
rfm = orders.groupby('customer_id').agg(last=('date', 'max'), frequency=('order_id', 'nunique'), monetary=('revenue', 'sum'))
rfm['recency'] = (pd.Timestamp('2026-07-01') - rfm['last']).dt.days
rfm['recency'].median()
```
```python check
assert 'rfm' in dir() and len(rfm) == orders['customer_id'].nunique(), 'rfm should have one row per customer.'
assert {'recency', 'frequency', 'monetary'} <= set(rfm.columns), 'rfm needs recency, frequency and monetary.'
exp = (pd.Timestamp('2026-07-01') - orders.groupby('customer_id')['date'].max()).dt.days.median()
assert float(_) == float(exp), f'Expected a median recency of {exp} days.'
```
```hint
agg(last=('date', 'max'), ...), then (pd.Timestamp('2026-07-01') - rfm['last']).dt.days.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** past behaviour predicts future behaviour. Someone who bought recently and often is the most likely to buy again; that idea is decades older than machine learning and still beats many fancy models as a first cut.

**Quintiles:** `qcut(x, 5)` cuts at the 20th, 40th, 60th and 80th percentiles, so each score holds a fifth of customers. Scores are relative: a "5" means "top fifth of this shop", not a fixed amount.

**Beyond RFM:** the same table is the starting point for customer lifetime value models and churn models (ML foundations course), where recency and frequency are usually the strongest features.
</details>

## 5. Practice

1. Make an RFM "cell" like "545" with string joining.
2. Why fix the snapshot date instead of using today's date?
3. How would you check that Champions really buy more afterwards?

<details>
<summary>Answers</summary>

1. `rfm['cell'] = rfm['R'].astype(str) + rfm['F'].astype(str) + rfm['M'].astype(str)`.
2. So the analysis gives the same answer every time and matches the period the data covers.
3. Score customers on data up to a cut-off date, then compare their spending in the months after it (a holdout period).
</details>

**New words:** *RFM*, *recency*, *frequency*, *monetary*, *snapshot date*, *quintile*, *np.select*.

<div class="keypoints">

- One row per customer: last date, order count, total spend.
- qcut into 5 groups; reverse recency so 5 is best.
- Rank frequency (method='first') before qcut to break ties.
- Name segments with np.select and say what to do for each.

</div>
