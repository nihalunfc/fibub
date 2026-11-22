---
title: 'A first look: head, info, describe'
summary: 'The five commands to run on every new table: head and sample to see rows, info for types and missing values, describe for numbers, value_counts for categories, and nunique for keys.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'Which command shows the number of non-missing values and the type of every column?'
    choices: ['df.head()', 'df.info()', 'df.describe()']
    ans: 1
    why: 'info() lists each column with its non-null count and dtype, plus memory use.'
  - q: "describe() shows a qty column with min -3. What should you do?"
    choices: ['Ignore it', 'Investigate: negative quantities might be returns, or errors', 'Delete the column']
    ans: 1
    why: 'A first look is for spotting surprises. Ask what they mean before cleaning.'
  - q: 'How do you check whether order_id is unique per row?'
    choices: ["df['order_id'].nunique() == len(df)", 'df.info()', "df['order_id'].sum()"]
    ans: 0
    why: 'If the number of distinct values equals the number of rows, each row has its own id.'
sources:
  - 'pandas documentation, User Guide: Essential basic functionality (descriptive statistics) https://pandas.pydata.org/docs/user_guide/basics.html'
  - 'NIST/SEMATECH e-Handbook, 1.1 EDA Introduction https://www.itl.nist.gov/div898/handbook/eda/section1/eda1.htm'
---

**Module 1 · about 15 minutes · uses Lesson 1.5.** You'll have a routine for the first five minutes with any new dataset.

<div class="bigidea">Before any analysis, spend two minutes looking: a few rows, the types and gaps, the ranges, and the most common values.</div>

**In everyday terms:** a mechanic walks round a car before opening the bonnet: tyres, lights, dents. info, describe and value_counts are that walk round, and they catch most problems early.

## 1. See some rows

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
display(orders.head(3))      # the first rows
display(orders.tail(3))      # the last rows
orders.sample(3, random_state=1)  # random rows, often more telling
```

`display()` shows a table mid-box; the last line is shown anyway.

## 2. Types and missing values: info

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders.info()
```

Check: is each column the type you expect (dates as `datetime64`, amounts as numbers)? Does any column have fewer non-null values than there are rows?

Drag the number of bins from 3 to 40, then switch to equal-count edges.

<figure class="fig" data-fig="@data-hist-bins"><figcaption>Notice that the same data can look like one hump or two depending on the bins you choose.</figcaption></figure>


## 3. Numbers: describe

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders[['qty', 'unit_price', 'discount']].describe().round(2)
```

Read the min and max for impossible values, and compare mean with median (50 %) for skew (Statistics Lesson 1.2).

## 4. Categories and keys

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
print(orders['store_id'].value_counts())
print('distinct orders:', orders['order_id'].nunique(), 'rows:', len(orders))
print(orders.nunique())
```

There are more rows than distinct order ids, so a row is an **order line** (one product within an order), not an order. Knowing what one row means (the **grain**) prevents double counting later.

<div class="meaning">

<dl>
<dt>head(), sample()</dt><dd>See real rows.</dd>
<dt>info()</dt><dd>Column types and non-missing counts.</dd>
<dt>describe()</dt><dd>Count, mean, SD, min, quartiles, max for numbers.</dd>
<dt>nunique(), value_counts()</dt><dd>How many distinct values, and which are most common.</dd>
<dt>Physical meaning</dt><dd>Each summary answers a "could this be wrong?" question: a negative quantity, a price of 9,999, a store that appears once, a date in 1970. Spotting them now saves wrong conclusions later.</dd>
</dl>

</div>

<div class="myth">

**"describe() covers everything."** It skips text columns by default and says nothing about duplicates or keys. Add <code>describe(include='object')</code>, <code>duplicated().sum()</code> and <code>value_counts()</code> on the key columns.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Rows.</b> <code>orders.head()</code>: the columns look as expected.</div>
<div class="step"><b>Types and gaps.</b> <code>orders.info()</code>: 9,717 rows, qty int64, date datetime, no missing values.</div>
<div class="step"><b>Ranges.</b> <code>orders.describe()</code>: qty from 1 to a small maximum, discount from 0 to 0.3. Nothing impossible.</div>
<div class="step"><b>Keys.</b> <code>orders['store_id'].value_counts()</code>: 7 stores, none tiny.</div>
<div class="step"><b>Note it.</b> Write one line: "9,717 lines, Jan 2025 to Jun 2026, 7 stores, no gaps." That line opens your report.</div>
</div>

<div class="problem" data-problem="pd-describe-mean"></div>

## 5. Your turn

```python exercise data=customers.csv
import pandas as pd

customers = pd.read_csv('customers.csv')
# Show how many customers are in each segment, using value_counts.
```
```python solution
import pandas as pd

customers = pd.read_csv('customers.csv')
customers['segment'].value_counts()
```
```python check
assert isinstance(_, pd.Series), "Show customers['segment'].value_counts() on the last line."
assert set(_.index) == {'Regular', 'Bargain', 'Premium'} and _.sum() == 1200, 'Count the segment column.'
```
```hint
Pick the column with customers['segment'] and add .value_counts().
```

```python exercise data=customers.csv
import pandas as pd

customers = pd.read_csv('customers.csv')
# Is customer_id unique? Show True or False by comparing nunique() with len(customers).
```
```python solution
import pandas as pd

customers = pd.read_csv('customers.csv')
customers['customer_id'].nunique() == len(customers)
```
```python check
assert _ is True or str(_) == 'True', 'Show the comparison (it should be True) on the last line.'
```
```hint
customers['customer_id'].nunique() == len(customers)
```

<details class="maths" open>
<summary>How it works: the first-look checklist</summary>

1. `df.shape`: as many rows and columns as you expected?
2. `df.head()`, `df.sample(5)`: what does one row mean (the grain)?
3. `df.info()`: right types? missing values?
4. `df.describe()`: impossible or extreme numbers?
5. `df[col].value_counts()` and `df.nunique()`: odd categories, spelling variants, unique keys?

Write down what surprises you; each surprise is a question for the data owner or a cleaning step (Module 3).
</details>

## 6. Practice

1. Suppose `info()` said `discount` had 9,000 non-null values out of 9,717 rows. What does that tell you?
2. Why use `sample()` as well as `head()`?
3. What is the grain of `orders.csv`?

<details>
<summary>Answers</summary>

1. 717 rows have no discount recorded: missing values to understand (zero discount? not recorded?).
2. The first rows are often unusual (sorted by date, test rows). A random sample is more typical.
3. One order line: one product in one order (an order can have several rows).
</details>

**Try it on your own data:** [[csv-profiler]] runs this whole checklist on a CSV in one go.

**New words:** *head*, *tail*, *sample*, *info*, *describe*, *value_counts*, *nunique*, *grain*.

<div class="keypoints">

- head/sample for rows; info for types and gaps; describe for ranges.
- value_counts and nunique for categories and keys.
- Look for impossible values, odd types, rare categories and duplicates.
- Write down what you found before analysing.

</div>
