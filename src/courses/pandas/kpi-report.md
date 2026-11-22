---
title: 'A KPI summary table'
summary: 'Build the KPI table a manager asks for: revenue, orders, customers, average order value and units per order for each store and month, with this year against last year and a total row.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'How do you compute average order value (AOV) correctly?'
    choices: ['Total revenue / number of distinct orders', 'Mean of the revenue column on order lines', 'Revenue / customers']
    ans: 0
    why: 'Order lines are not orders. Count orders with nunique on order_id.'
  - q: 'Why must ratios in a total row be recalculated, not summed or averaged?'
    choices: ['A ratio of totals is not the mean of the ratios', 'Totals are always wrong', 'pandas cannot sum ratios']
    ans: 0
    why: 'Total AOV = total revenue / total orders, the same rule as DAX measures.'
  - q: 'Which KPI is NOT additive across stores?'
    choices: ['Distinct customers', 'Revenue', 'Units']
    ans: 0
    why: 'A customer who shopped in two stores is counted once in the total.'
---

**Module 8 · about 20 minutes · uses Modules 4 and 7.** You'll be able to produce a correct KPI summary from order lines.

## 1. The KPIs from order lines

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
kpi = orders.groupby('store_id').agg(
    revenue=('revenue', 'sum'),
    orders=('order_id', 'nunique'),
    customers=('customer_id', 'nunique'),
    units=('qty', 'sum'),
)
kpi['aov'] = kpi['revenue'] / kpi['orders']
kpi['units_per_order'] = kpi['units'] / kpi['orders']
kpi.round(2).sort_values('revenue', ascending=False)
```

The table has one row per order **line**. An order with three products has three lines, so `orders` must be `nunique` on `order_id`, not a count of rows.

## 2. The total row, done right

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])

def kpis(d):
    r, n = d['revenue'].sum(), d['order_id'].nunique()
    return pd.Series({'revenue': r, 'orders': n, 'customers': d['customer_id'].nunique(), 'aov': r / n})

table = orders.groupby('store_id')[['revenue', 'order_id', 'customer_id']].apply(kpis)
table.loc['All stores'] = kpis(orders)
print('sum of store customers:', int(table['customers'].iloc[:-1].sum()))
table.round(2)
```

The **All stores** row is computed from all the rows again. Its customer count is smaller than the sum of the stores (people shop in more than one store), and its AOV is not the average of the store AOVs.

## 3. This year against last year

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
h1 = orders[orders['date'].dt.month <= 6]                        # Jan-Jun in both years
by = h1.groupby(['store_id', h1['date'].dt.year])['revenue'].sum().unstack()
by['change_%'] = ((by[2026] / by[2025] - 1) * 100).round(1)
by.round(0).sort_values('change_%')
```

Only January to June exists for 2026, so both years are cut to the same months: like with like (Lesson 7.4).

## 4. Your turn

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
# Make monthly: one row per month ('MS') with revenue (sum), orders (distinct order_id) and aov = revenue / orders.
# Show monthly rounded to 2 decimals.
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
monthly = orders.resample('MS', on='date').agg(revenue=('revenue', 'sum'), orders=('order_id', 'nunique'))
monthly['aov'] = monthly['revenue'] / monthly['orders']
monthly.round(2)
```
```python check
assert isinstance(_, pd.DataFrame) and len(_) == 18, f'Expected 18 months, got {len(_)}.'
assert {'revenue', 'orders', 'aov'} <= set(_.columns), 'Columns revenue, orders and aov are needed.'
assert int(_['orders'].sum()) == orders['order_id'].nunique(), 'Count distinct order_id per month (nunique), not rows.'
assert abs((_['revenue'] / _['orders'] - _['aov']).abs().max()) < 0.02, 'aov should be revenue / orders.'
```
```hint
orders.resample('MS', on='date').agg(revenue=('revenue', 'sum'), orders=('order_id', 'nunique')), then add aov.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** KPIs come in three kinds. **Additive** ones (revenue, units) can be summed over any split. **Semi-additive** or **distinct** ones (customers, stock levels) cannot be summed across some splits. **Ratios** (AOV, conversion, margin %) must be rebuilt from their parts at every level:

```math
\text{AOV}_\text{all} = \frac{\sum_s \text{revenue}_s}{\sum_s \text{orders}_s} \neq \frac{1}{S}\sum_s \text{AOV}_s
```

This is exactly why DAX uses measures instead of summed columns (Power BI course), and why `pivot_table(margins=True)` can mislead for ratios.
</details>

## 5. Practice

1. Gross margin % per category (needs products.csv for cost).
2. Why is "average revenue per line" not AOV?
3. Which is the better headline: AOV or revenue per customer? It depends on what question?

<details>
<summary>Answers</summary>

1. Merge cost in, then `margin = (revenue - qty * cost)`; margin % = sum of margin / sum of revenue per category.
2. An order has 1.65 lines on average here, so per-line revenue is smaller and changes when basket size changes.
3. AOV answers "how big is a basket?"; revenue per customer answers "how much is a customer worth over the period?", which also grows with visit frequency.
</details>

**Try it on your own data:** [[csv-profiler]] gives a quick first look at any table before you build KPIs.

**New words:** *KPI*, *AOV*, *additive*, *distinct count*, *total row*, *like for like*.
