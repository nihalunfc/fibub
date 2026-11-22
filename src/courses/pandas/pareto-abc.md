---
title: 'Pareto and ABC analysis'
summary: 'Find the few products that make most of the revenue: sort, take a cumulative share, label A, B and C classes with cut, and draw the Pareto curve that stock planners and category managers use.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'What does the 80/20 rule say, roughly?'
    choices: ['A small share of items (often about 20 %) makes a large share of results (often about 80 %)', 'Exactly 20 % of products make exactly 80 % of revenue', 'Prices should rise 20 %']
    ans: 0
    why: 'It is a pattern to check, not a law. In this shop, 17 of 32 products make 80 %.'
  - q: 'Which steps give each product its cumulative share of revenue?'
    choices: ['Sort revenue high to low, cumsum, divide by the total', 'cumsum, then sort', 'Divide each by the mean']
    ans: 0
    why: 'Sorting first is what makes the running total a Pareto curve.'
  - q: 'Why use the share BEFORE a product when labelling A items?'
    choices: ['So the product that crosses 80 % still counts as A', 'It is faster', 'To skip the first product']
    ans: 0
    why: 'With shift, the item that takes you from 79 % to 81 % is in class A.'
---

**Module 8 · about 15 minutes · uses Lessons 4.1 and 4.5.** You'll be able to rank items by contribution and split them into A, B and C classes.

## 1. Cumulative share

```python data=orders.csv,products.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
products = pd.read_csv('products.csv')
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
by = (orders.groupby('product_id')['revenue'].sum()
            .sort_values(ascending=False)
            .to_frame())
by['share_%'] = (by['revenue'] / by['revenue'].sum() * 100).round(1)
by['cum_%'] = by['share_%'].cumsum().round(1)
by = by.join(products.set_index('product_id')['product'])
by.head(10)
```

Read down the `cum_%` column: the top product alone is about 12 % of revenue, the top 10 together about 61 %.

## 2. A, B and C classes

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
by = orders.groupby('product_id')['revenue'].sum().sort_values(ascending=False).to_frame()
before = by['revenue'].cumsum().shift(fill_value=0) / by['revenue'].sum()   # share before this item
by['class'] = pd.cut(before, bins=[0, 0.80, 0.95, 1], labels=['A', 'B', 'C'], right=False)
by.groupby('class', observed=True)['revenue'].agg(['size', 'sum']).assign(share=lambda d: (d['sum'] / d['sum'].sum()).round(3))
```

- **A**: the items that make the first 80 %. Never let them run out; review them weekly.
- **B**: the next 15 %. Normal care.
- **C**: the last 5 %, often many items. Candidates for a smaller range or ordering less often.

## 3. The Pareto curve

<!--fig:pareto-curve-->

The curve rises fast and then flattens. The more it bows towards the top left, the more concentrated sales are. A straight diagonal would mean every product sells the same.

## 4. Your turn

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
# Units (qty) per customer_id, sorted high to low. How many customers make the first 50% of all units?
# Show that number (an int).
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
u = orders.groupby('customer_id')['qty'].sum().sort_values(ascending=False)
before = u.cumsum().shift(fill_value=0) / u.sum()
int((before < 0.5).sum())
```
```python check
u = orders.groupby('customer_id')['qty'].sum().sort_values(ascending=False)
exp = int(((u.cumsum().shift(fill_value=0) / u.sum()) < 0.5).sum())
assert int(_) in (exp, exp - 1), f'Expected about {exp} customers.'
```
```hint
groupby('customer_id')['qty'].sum().sort_values(ascending=False), then cumsum() / sum(), and count how many are under 0.5.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** sort the items from biggest to smallest and plot the running share of the total against the share of items. That is the **Pareto curve** (a Lorenz curve drawn the other way up):

```math
L(k) = \frac{\sum_{i=1}^{k} x_{(i)}}{\sum_{i=1}^{n} x_i}, \qquad x_{(1)} \ge x_{(2)} \ge \dots
```

The bigger the gap between the curve and the diagonal, the more concentrated the total. Economists turn that gap into the Gini coefficient. The 80/20 shape shows up in many places (sales, customers, defects, web pages) because a few causes often build on themselves, but always measure it; never assume it.
</details>

## 5. Practice

1. ABC by units instead of revenue. Do the classes change?
2. Do the same for customers: what share of customers makes 80 % of revenue?
3. Why might a C product still be worth keeping?

<details>
<summary>Answers</summary>

1. Replace revenue with qty. Cheap items move up, expensive ones down, so yes, some change class.
2. Group by `customer_id`, then the same steps; count the A customers and divide by the number of customers.
3. It may bring people in (a loss leader), complete a basket (batteries with a gadget), or have a high margin.
</details>


**New words:** *Pareto principle*, *cumulative share*, *ABC analysis*, *Lorenz curve*, *concentration*.
