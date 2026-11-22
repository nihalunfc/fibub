---
title: 'Duplicates'
summary: 'Find exact and partial duplicate rows, decide which copy to keep, and check that a key column really is unique before you join or count.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'What does df.duplicated() return?'
    choices: ['The duplicate rows themselves', 'True for each row that repeats an earlier row, False otherwise', 'The number of duplicates']
    ans: 1
    why: 'It is a mask; the first copy is False and later copies are True (keep="first").'
  - q: 'You want one row per customer, keeping their latest record. How?'
    choices: ["df.sort_values('updated').drop_duplicates('customer_id', keep='last')", 'df.drop_duplicates()', "df.unique('customer_id')"]
    ans: 0
    why: 'Sort so the latest is last, then keep the last copy per customer.'
  - q: 'Why check that a key is unique before a join?'
    choices: ['Joins are faster', 'Duplicate keys multiply rows in the join and inflate totals', 'It is required by pandas']
    ans: 1
    why: 'Each duplicate key matches every row on the other side (Lesson 5.3).'
---

**Module 3 · about 15 minutes · uses Lesson 2.3.** You'll be able to find duplicates, remove the right copies and prove a key is unique.

## 1. Exact duplicates

```python data=orders_messy.csv
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
dup = messy.duplicated()
print(dup.sum(), 'rows repeat an earlier row exactly')
display(messy[messy.duplicated(keep=False)].sort_values('order_id').head(6))   # show both copies
messy = messy.drop_duplicates()
len(messy)
```

`keep=False` marks every copy, which is handy for looking at them side by side.

## 2. Duplicates on some columns

Rows can differ in an unimportant column but still be the same thing. Pass `subset`:

```python
import pandas as pd

customers = pd.DataFrame({
    'customer_id': ['C1', 'C2', 'C1', 'C3', 'C2'],
    'email': ['a@x.ca', 'b@x.ca', 'a@x.ca', 'c@x.ca', 'b2@x.ca'],
    'updated': pd.to_datetime(['2026-01-05', '2026-01-07', '2026-03-01', '2026-02-02', '2026-04-10']),
})
print(customers.duplicated(subset=['customer_id']).sum(), 'repeated customer ids')
latest = customers.sort_values('updated').drop_duplicates(subset=['customer_id'], keep='last')
latest.sort_values('customer_id')
```

Sort first, so the copy you want (the latest, the largest) is in the position `keep` picks.

## 3. Is the key unique?

```python data=customers.csv,orders.csv
import pandas as pd

customers = pd.read_csv('customers.csv')
orders = pd.read_csv('orders.csv')
print('customer_id unique in customers:', customers['customer_id'].is_unique)
print('order_id unique in orders:', orders['order_id'].is_unique)
orders['order_id'].value_counts().head()
```

`order_id` repeats because each row is an order **line**. That's correct for this table, but it means "number of orders" is `orders['order_id'].nunique()`, not `len(orders)`.

## 4. Your turn

```python exercise data=orders_messy.csv
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
# Remove exact duplicate rows. Keep the result in messy and show len(messy).
```
```python solution
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
messy = messy.drop_duplicates()
len(messy)
```
```python check
assert messy.duplicated().sum() == 0, 'There are still duplicates; assign the result of drop_duplicates() back to messy.'
assert _ == 400, f'Show len(messy) on the last line (expected 400, got {_}).'
```
```hint
messy = messy.drop_duplicates(), then len(messy).
```

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
# How many distinct orders are there (not order lines)? Show the number.
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv')
orders['order_id'].nunique()
```
```python check
assert _ == orders['order_id'].nunique(), 'Count distinct order_id values with nunique().'
```
```hint
orders['order_id'].nunique()
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** `duplicated` compares each row with all earlier rows (by hashing their values), so it's fast even on millions of rows. Two rows count as the same only if **every** compared value matches exactly: `'Maple Ridge'` and `' maple ridge'` are different until you clean the text (next lessons). Clean first, then de-duplicate.
</details>

## 5. Practice

1. Mark every copy of a duplicated email, not just the later ones.
2. Keep each product's cheapest offer from a table of offers.
3. Why might `drop_duplicates()` find nothing in a messy file that clearly has repeats?

<details>
<summary>Answers</summary>

1. `df.duplicated(subset=['email'], keep=False)`.
2. `offers.sort_values('price').drop_duplicates('product_id', keep='first')`.
3. The copies differ slightly (spaces, capitals, date formats, a timestamp column); clean those or use `subset`.
</details>

**New words:** *duplicate*, *drop_duplicates*, *subset*, *keep*, *is_unique*, *key*.
