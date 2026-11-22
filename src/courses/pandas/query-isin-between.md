---
title: 'query, isin and between'
summary: 'Three shortcuts that make filters shorter and easier to read: isin for "one of these values", between for ranges, and query for writing conditions like a sentence.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: "Keep rows where store_id is S01, S02 or S05:"
    choices: ["df[df['store_id'].isin(['S01', 'S02', 'S05'])]", "df[df['store_id'] == ['S01', 'S02', 'S05']]", "df.store_id in ['S01']"]
    ans: 0
    why: 'isin tests each value against a list.'
  - q: "In query, how do you use a Python variable called limit?"
    choices: ["df.query('qty > limit')", "df.query('qty > @limit')", "df.query('qty > {limit}')"]
    ans: 1
    why: '@ tells query the name is a Python variable, not a column.'
  - q: "Does s.between(2, 4) include 2 and 4?"
    choices: ['Yes, both ends by default', 'No', 'Only 4']
    ans: 0
    why: "inclusive='both' is the default; use 'left', 'right' or 'neither' to change it."
---

**Module 2 · about 15 minutes · uses Lesson 2.3.** You'll be able to write common filters in fewer, clearer characters.

## 1. isin: one of these

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
ontario = ['S01', 'S02', 'S03']
display(orders[orders['store_id'].isin(ontario)].head(3))
orders[~orders['store_id'].isin(ontario)]['store_id'].value_counts()   # everything else
```

`isin` also takes another column or Series: "orders from customers in this list" is `orders[orders['customer_id'].isin(vip['customer_id'])]`.

## 2. between: a range

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
mid_price = orders[orders['unit_price'].between(10, 20)]
black_friday_week = orders[orders['date'].between('2025-11-24', '2025-11-30')]
print(len(mid_price), len(black_friday_week))
```

## 3. query: conditions as text

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
limit = 3
orders.query("store_id == 'WEB' and qty >= @limit and discount > 0").head()
```

Inside `query` you can write `and`, `or`, `not`, `in`, and refer to columns by name. `@limit` uses the Python variable. Column names with spaces need backticks: `` `order date` > '2025-06-01' ``.

## 4. Your turn

```python exercise data=products.csv
import pandas as pd

products = pd.read_csv('products.csv')
# Keep products in the Home or Personal care categories that cost between 10 and 20 (price). Show them.
```
```python solution
import pandas as pd

products = pd.read_csv('products.csv')
products[products['category'].isin(['Home', 'Personal care']) & products['price'].between(10, 20)]
```
```python check
exp = products[products['category'].isin(['Home', 'Personal care']) & products['price'].between(10, 20)]
assert isinstance(_, pd.DataFrame), 'Show the filtered table on the last line.'
assert sorted(_['product']) == sorted(exp['product']), f'Expected {len(exp)} products; check the categories and the price range.'
```
```hint
Combine products['category'].isin([...]) and products['price'].between(10, 20) with &.
```

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
# Using query, keep lines with qty of 3 or more from store S02. Show how many there are (len).
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv')
len(orders.query("qty >= 3 and store_id == 'S02'"))
```
```python check
assert _ == len(orders[(orders['qty'] >= 3) & (orders['store_id'] == 'S02')]), 'Count lines with qty >= 3 and store_id S02.'
```
```hint
orders.query("qty >= 3 and store_id == 'S02'"), wrapped in len(...). Mind the quotes: double outside, single inside.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** all three build the same True/False mask as Lesson 2.3. `isin` uses a fast lookup set, so it stays quick with thousands of values; `query` parses the text into the same operations.

**When to use which:** brackets and `&` are the most general and work everywhere; `query` reads best for long filters and in method chains; `isin` and `between` replace chains of `|` and pairs of `>=` / `<=`.
</details>

## 5. Practice

1. Rewrite `df[(df.c == 'a') | (df.c == 'b') | (df.c == 'd')]` with `isin`.
2. Write a `query` for revenue over a variable `target`.
3. How would you exclude a list of test customer ids?

<details>
<summary>Answers</summary>

1. `df[df['c'].isin(['a', 'b', 'd'])]`.
2. `df.query('revenue > @target')`.
3. `df[~df['customer_id'].isin(test_ids)]`.
</details>

**New words:** *isin*, *between*, *query*, *@variable*.
