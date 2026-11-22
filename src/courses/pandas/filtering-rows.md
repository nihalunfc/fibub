---
title: 'Filtering rows with conditions'
summary: 'Keep the rows you need with conditions: comparisons, & for and, | for or, ~ for not, brackets around each part, and filters on text and dates.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: "Which keeps rows where qty is at least 2 AND store_id is 'S01'?"
    choices: ["df[df.qty >= 2 and df.store_id == 'S01']", "df[(df['qty'] >= 2) & (df['store_id'] == 'S01')]", "df[df['qty'] >= 2 & df['store_id'] == 'S01']"]
    ans: 1
    why: 'Use & (not and) between conditions, and put each condition in brackets, because & binds tighter than >=.'
  - q: 'What does ~ do in df[~mask]?'
    choices: ['Nothing', 'Flips True and False, keeping the rows that do NOT match', 'Rounds the values']
    ans: 1
    why: '~ is "not" for a whole True/False Series.'
  - q: "How do you keep the orders from 2026 when date is a datetime column?"
    choices: ["df[df['date'] >= '2026-01-01']", "df[df['date'] == 2026]", "df['2026']"]
    ans: 0
    why: "Datetime columns compare with date strings directly. df['date'].dt.year == 2026 works too."
---

**Module 2 · about 20 minutes · uses Lesson 1.3.** You'll be able to filter rows with one or many conditions, on numbers, text and dates.

## 1. One condition

A condition makes a True/False Series (a **mask**); putting it in the brackets keeps the True rows.

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
mask = orders['qty'] >= 3
print(mask.head())
print(mask.sum(), 'of', len(orders), 'lines have 3 or more items')
orders[mask].head()
```

Comparisons: `==`, `!=`, `>`, `>=`, `<`, `<=`.

## 2. Combining conditions

`&` and, `|` or, `~` not. **Wrap each condition in brackets.**

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
web_big = orders[(orders['store_id'] == 'WEB') & (orders['qty'] >= 3)]
discounted_or_big = orders[(orders['discount'] > 0) | (orders['qty'] >= 3)]
full_price = orders[~(orders['discount'] > 0)]
print(len(web_big), len(discounted_or_big), len(full_price))
web_big.head(3)
```

Long filters read better as named masks: `is_web = ...`, `is_big = ...`, then `orders[is_web & is_big]`.

## 3. Text and dates

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
december = orders[orders['date'].dt.month == 12]
y2026 = orders[orders['date'] >= '2026-01-01']
s0 = orders[orders['store_id'].str.startswith('S0')]       # text tests use .str
print(len(december), len(y2026), len(s0))
orders[orders['date'].between('2025-11-24', '2025-11-30')].head(3)
```

## 4. Your turn

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
# Keep the order lines from store S05 with a discount of 0.2 or more. Call it deals and show it.
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
deals = orders[(orders['store_id'] == 'S05') & (orders['discount'] >= 0.2)]
deals
```
```python check
want = orders[(orders['store_id'] == 'S05') & (orders['discount'] >= 0.2)]
assert 'deals' in dir(), 'Make a variable called deals.'
assert len(deals) == len(want), f'deals has {len(deals)} rows; it should have {len(want)}. Check both conditions and the brackets.'
```
```hint
Two conditions, each in brackets, joined with &: (orders['store_id'] == 'S05') & (orders['discount'] >= 0.2).
```

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
# How many order lines are NOT from the web store (store_id 'WEB')? Show the number.
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
len(orders[orders['store_id'] != 'WEB'])
```
```python check
assert _ == int((orders['store_id'] != 'WEB').sum()), 'Count the rows where store_id is not WEB.'
```
```hint
orders['store_id'] != 'WEB' is the mask; len(orders[mask]) or mask.sum() counts it.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** a filter is two steps: build a mask (one True/False per row), then index with it. Because masks are Series, you can store, combine, count (`mask.sum()`) and average them (`mask.mean()` is the share of True).

**Why the brackets:** in Python `&` is evaluated before `>=`, so `df.qty >= 2 & df.store == 'S01'` is read as `df.qty >= (2 & df.store) == 'S01'` and fails. Brackets make the order explicit.

**Why not `and`:** `and` asks "is this whole Series true?", which has no single answer, so pandas raises *"The truth value of a Series is ambiguous"*.
</details>

## 5. Practice

1. Write a filter for qty between 2 and 4, inclusive.
2. What share of lines have a discount? (One expression.)
3. What does the error *"The truth value of a Series is ambiguous"* usually mean?

<details>
<summary>Answers</summary>

1. `df[(df['qty'] >= 2) & (df['qty'] <= 4)]` or `df[df['qty'].between(2, 4)]`.
2. `(df['discount'] > 0).mean()`.
3. You used `and`/`or` (or `if`) with a Series; use `&` / `|` with brackets.
</details>

**New words:** *mask*, *boolean indexing*, *and (&)*, *or (|)*, *not (~)*.
