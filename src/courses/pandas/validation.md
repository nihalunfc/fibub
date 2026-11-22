---
title: 'Checking data: ranges, rules and outliers'
summary: 'Write checks that prove a table is right before you analyse it: allowed ranges, allowed values, keys that must match another table, totals that must reconcile, and outliers worth a second look.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'Which check catches order lines for products that do not exist?'
    choices: ["orders['product_id'].isin(products['product_id'])", "orders['qty'] > 0", 'orders.duplicated()']
    ans: 0
    why: 'Every foreign key should find a match in its lookup table; the False rows are orphans.'
  - q: 'You find quantities of −1. What is the best first step?'
    choices: ['Delete them', 'Find out what they mean (returns? errors?) and decide a rule with the data owner', 'Change them to 1']
    ans: 1
    why: 'Negative quantities are often returns, which matter for net sales. Ask before you change.'
  - q: 'What is assert good for in a cleaning script?'
    choices: ['Nothing', 'It stops the script with a message if a rule is broken, so bad data cannot slip through silently', 'It fixes the data']
    ans: 1
    why: 'Assertions turn your expectations into checks that run every time the data changes.'
sources:
  - 'pandas documentation, User Guide: Indexing and selecting data (boolean indexing) https://pandas.pydata.org/docs/user_guide/indexing.html'
  - 'Breck, E. et al. (2019), Data Validation for Machine Learning, MLSys 2019 https://mlsys.org/Conferences/2019/doc/2019/167.pdf'
---

**Module 3 · about 20 minutes · uses Lessons 2.3 and 3.1.** You'll be able to write the checks that catch bad data before it reaches a report.

<div class="bigidea">Write the rules your data must follow as code, so every run checks them and a broken file stops the analysis instead of fooling it.</div>

**In everyday terms:** a pilot's pre-flight checklist. Each item is quick and boring, and the one time a check fails it saves the flight.

## 1. Rules as masks

Every rule is a filter for the rows that **break** it:

```python data=orders_messy.csv,products.csv
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
products = pd.read_csv('products.csv')
problems = {
    'qty missing': messy['Qty'].isna(),
    'qty not positive': messy['Qty'] <= 0,
    'unknown product': ~messy['product'].isin(products['product_id']),
    'customer missing': messy['Customer ID'].isna(),
    'duplicate row': messy.duplicated(),
}
pd.Series({name: int(mask.sum()) for name, mask in problems.items()}, name='rows')
```

A table like this, run every time a new file arrives, is a simple **data quality report**.

## 2. Assert the rules that must hold

`assert condition, message` stops with the message when the condition is False. Put them after cleaning:

```python error data=orders.csv,products.csv,customers.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
products = pd.read_csv('products.csv')
customers = pd.read_csv('customers.csv')
assert orders['qty'].gt(0).all(), 'quantities must be positive'
assert orders['discount'].between(0, 0.5).all(), 'discounts must be 0 to 50 %'
assert orders['product_id'].isin(products['product_id']).all(), 'unknown products'
assert orders['customer_id'].isin(customers['customer_id']).all(), 'unknown customers'
assert orders['date'].between('2025-01-01', '2026-06-30').all(), 'dates out of range'
assert orders['unit_price'].lt(50).all(), 'a price of $50 or more needs checking'
print('all checks passed')
```

The last rule fails on purpose: it shows what a failed check looks like. Change `50` to `100` and run again.

Press Run the checks, then switch checks off and lower the stop threshold.

<figure class="fig" data-fig="@data-dq-gate"><figcaption>Notice which bad rows slip through when a check is off, and when the gate stops the whole load.</figcaption></figure>


## 3. Outliers: flag, don't delete

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])
q1, q3 = orders['revenue'].quantile([0.25, 0.75])
fence = q3 + 1.5 * (q3 - q1)
orders['high_flag'] = orders['revenue'] > fence
print(f'upper fence ${fence:.2f}; {orders.high_flag.sum()} lines above it')
orders[orders['high_flag']].nlargest(5, 'revenue')
```

These are real sales of expensive items, not errors. An outlier rule finds rows to **look at**; whether to cap, keep or remove them is a decision you state (Statistics Lesson 1.4).

## 4. Reconcile totals

Compare your total with a number from the source system (a finance report, the till summary). If revenue from your cleaned table differs, find out why before going further: dropped rows, double-counted lines after a join, or a filter that was too strict.

<div class="meaning">

<dl>
<dt>Mask rule</dt><dd>df['qty'] <= 0 flags rows that break "quantity is positive".</dd>
<dt>assert cond, msg</dt><dd>Stop with a message if a rule that must hold does not.</dd>
<dt>Outlier flag</dt><dd>Mark unusual values for review rather than deleting them.</dd>
<dt>Reconcile</dt><dd>Check totals against a trusted source (the finance figure).</dd>
<dt>Physical meaning</dt><dd>A validation rule is a promise the data makes. When a promise breaks, everything built on it is suspect, so the code should shout, not carry on quietly.</dd>
</dl>

</div>

<div class="myth">

**"The data came from our own system, so it is correct."** Exports change, joins duplicate, test orders slip in. Rules catch the change the day it happens, not the day a manager spots a strange number.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Rules.</b> qty > 0; discount between 0 and 0.5; every store_id in stores.csv.</div>
<div class="step"><b>Check.</b> <code>bad = orders[(orders.qty <= 0) | ~orders.discount.between(0, 0.5)]</code> → 0 rows.</div>
<div class="step"><b>Must hold.</b> <code>assert orders.store_id.isin(stores.store_id).all(), 'unknown store'</code></div>
<div class="step"><b>Reconcile.</b> Total revenue against finance's figure: within 0.1 %.</div>
<div class="step"><b>Outliers.</b> Lines over the 99.9th percentile are flagged, read, and kept: real large orders.</div>
</div>

<div class="problem" data-problem="pd-rule-share"></div>

## 5. Your turn

```python exercise data=orders_messy.csv,products.csv
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
products = pd.read_csv('products.csv')
# Count the rows whose product is NOT in products['product_id']. Show the count.
```
```python solution
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
products = pd.read_csv('products.csv')
(~messy['product'].isin(products['product_id'])).sum()
```
```python check
assert _ == (~messy['product'].isin(products['product_id'])).sum(), 'Use ~ and isin, then sum the True values.'
```
```hint
messy['product'].isin(products['product_id']) is True for known products; ~ flips it; .sum() counts.
```

```python exercise data=orders_messy.csv
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
# Show the rows where Qty is negative (possible returns).
```
```python solution
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
messy[messy['Qty'] < 0]
```
```python check
assert isinstance(_, pd.DataFrame) and len(_) == (messy['Qty'] < 0).sum() and len(_) > 0, 'Filter messy for Qty < 0.'
```
```hint
messy[messy['Qty'] < 0]
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** analysis can only be as right as its inputs. Validation turns what you *believe* about the data ("every order has a customer") into checks that run every time. The cheapest time to find a problem is before anyone has seen a chart.

**Kinds of rule:** type (dates are dates), range (0 ≤ discount ≤ 0.5), allowed values (store in the store list), uniqueness (one row per key), reference (every key matches a lookup table), and reconciliation (totals match the source).
</details>

## 6. Practice

1. Write a rule for "email must contain @".
2. What does `orders['customer_id'].isin(customers['customer_id']).all()` check?
3. Why flag outliers rather than delete them?

<details>
<summary>Answers</summary>

1. `df['email'].str.contains('@', na=False)`; rows where it's False break the rule.
2. That every order's customer exists in the customer table (no orphan orders).
3. They may be real and important (big customers, expensive items); deleting them changes totals and hides information. Decide case by case and document it.
</details>

**Try it on your own data:** [[csv-profiler]] shows ranges, missing counts and odd values per column.

**New words:** *validation*, *data quality report*, *assert*, *orphan key*, *outlier flag*, *reconciliation*.

<div class="keypoints">

- Express rules as masks; count and inspect violations.
- assert stops the run when a must-hold rule breaks.
- Flag outliers for review; do not delete real values.
- Reconcile key totals with a trusted source.

</div>
