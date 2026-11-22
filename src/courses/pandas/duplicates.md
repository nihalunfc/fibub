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
sources:
  - 'pandas documentation, User Guide: Duplicate labels and drop_duplicates https://pandas.pydata.org/docs/user_guide/duplicates.html'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 3 · about 15 minutes · uses Lesson 2.3.** You'll be able to find duplicates, remove the right copies and prove a key is unique.

<div class="bigidea">Duplicates double-count: find exact repeats, repeats on the key columns, and check that every ID that should be unique really is.</div>

**In everyday terms:** a guest list where someone signed in twice. Count heads from the list and you order an extra meal; the fix is to know which column (the name, the ticket number) should be unique.

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

Switch between the four operations and add ids to either list to see how duplicates are handled.

<figure class="fig" data-fig="@data-set-ops"><figcaption>Notice that UNION removes duplicates, UNION ALL keeps them, and EXCEPT depends on which list comes first.</figcaption></figure>


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

<div class="meaning">

<dl>
<dt>duplicated()</dt><dd>True for each row that repeats an earlier one.</dd>
<dt>duplicated(subset=[...])</dt><dd>Repeats only on chosen columns.</dd>
<dt>drop_duplicates(keep=...)</dt><dd>Remove repeats, keeping the first or last.</dd>
<dt>is_unique</dt><dd>True if a column has no repeats: the test for a key.</dd>
<dt>Physical meaning</dt><dd>A duplicate row makes one real event count twice: revenue, customers and averages all drift. A repeated key in a lookup table also multiplies rows when you join (Lesson 5.3).</dd>
</dl>

</div>

<div class="myth">

**"drop_duplicates() is always safe."** Two genuine orders of the same product by the same customer on the same day look identical if order_id is missing. Decide which columns define "the same thing" first.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The data.</b> <table class="lk-tbl"><tr><th>order_id</th><th>product</th><th>qty</th></tr><tr><td>50001</td><td>P101</td><td>2</td></tr><tr><td>50002</td><td>P105</td><td>1</td></tr><tr><td><mark>50001</mark></td><td><mark>P101</mark></td><td><mark>2</mark></td></tr><tr><td>50003</td><td>P101</td><td>2</td></tr></table></div>
<div class="step"><b>Exact repeats.</b> <code>df.duplicated().sum()</code> → 1 (row 2 repeats row 0).</div>
<div class="step"><b>Key check.</b> <code>df['order_id'].is_unique</code> → False.</div>
<div class="step"><b>Look before deleting.</b> Row 2 is a double export of 50001; row 3 is a different order, so keep it.</div>
<div class="step"><b>Remove.</b> <code>df.drop_duplicates()</code> → 3 rows.</div>
</div>

<div class="problem" data-problem="pd-dupes"></div>

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

<div class="keypoints">

- duplicated() flags repeats; .sum() counts them.
- Use subset= to check the columns that define "the same thing".
- Check keys with is_unique before joining.
- Look at duplicates before deleting them.

</div>
