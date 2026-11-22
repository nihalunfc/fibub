---
title: 'Join pitfalls: duplicates, keys and validate'
summary: 'The join mistakes that silently inflate totals: duplicate keys that multiply rows, keys with different types or spelling, and missing matches. How validate, indicator and row-count checks catch them.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'A product appears twice in the products table. After a left join, what happens to its order lines?'
    choices: ['Nothing', 'Each of its order lines appears twice, so revenue for it doubles', 'They are dropped']
    ans: 1
    why: 'Each left row pairs with every matching right row.'
  - q: "What does validate='many_to_one' do?"
    choices: ['Raises an error if the right-hand key is not unique', 'Removes duplicates', 'Sorts the result']
    ans: 0
    why: 'It checks the assumption that each left row can match at most one right row.'
  - q: "Keys are 101 (number) in one table and '101' (text) in the other. What happens?"
    choices: ['They match', 'pandas raises an error, or nothing matches; convert both to the same type first', 'They are summed']
    ans: 1
    why: 'Keys must be the same type and the same spelling to match.'
---

**Module 5 · about 20 minutes · uses Lesson 5.2.** You'll be able to spot and prevent the join mistakes that inflate or lose rows.

## 1. Duplicate keys multiply rows

<!--anim:join-dupes (table animation, added once the shared tableviz engine is on main)-->

```python
import pandas as pd

orders = pd.DataFrame({'order_id': [1, 2, 3], 'product_id': ['P1', 'P2', 'P1'], 'revenue': [10, 20, 30]})
products = pd.DataFrame({'product_id': ['P1', 'P1', 'P2'], 'category': ['Home', 'Home & Garden', 'Grocery']})
m = orders.merge(products, on='product_id', how='left')
print('rows before', len(orders), 'after', len(m))
print('revenue before', orders['revenue'].sum(), 'after', m['revenue'].sum())
m
```

The lookup table had P1 twice (an old and a new category name), so P1's orders doubled and revenue went from 60 to 100. Nothing raised an error.

## 2. Make pandas check for you

```python error
import pandas as pd

orders = pd.DataFrame({'order_id': [1, 2, 3], 'product_id': ['P1', 'P2', 'P1'], 'revenue': [10, 20, 30]})
products = pd.DataFrame({'product_id': ['P1', 'P1', 'P2'], 'category': ['Home', 'Home & Garden', 'Grocery']})
orders.merge(products, on='product_id', how='left', validate='many_to_one')
```

`validate` takes `'one_to_one'`, `'one_to_many'`, `'many_to_one'` or `'many_to_many'` and raises a clear error when the data doesn't fit. Use it on every join where you expect a lookup to be unique. Then fix the lookup (keep one row per key, Lesson 3.2) and join again.

## 3. Keys that should match but don't

```python
import pandas as pd

a = pd.DataFrame({'store_id': ['S01', 's02 ', 'S03'], 'sales': [5, 6, 7]})
b = pd.DataFrame({'store_id': ['S01', 'S02', 'S03'], 'store': ['Harbourview', 'Maple Ridge', 'Cedar Falls']})
print(a.merge(b, on='store_id', how='left')['store'].isna().sum(), 'unmatched before cleaning')
a['store_id'] = a['store_id'].str.strip().str.upper()
print(a.merge(b, on='store_id', how='left')['store'].isna().sum(), 'unmatched after')
```

Also check **types**: `101` and `'101'` never match. Convert both sides with `astype(str)` (and `str.zfill` for leading zeros) before joining.

## 4. A join checklist

1. Is the key unique where it should be? `products['product_id'].is_unique`
2. Same type and cleaned text on both sides?
3. `validate=` on the merge.
4. Row count before and after (`len`).
5. Unmatched rows with `indicator=True`, and why they didn't match.
6. A total (revenue) before and after; it shouldn't change on a left join to a lookup.

## 5. Your turn

```python exercise
import pandas as pd

orders = pd.DataFrame({'order_id': [1, 2, 3, 4], 'product_id': ['P1', 'P2', 'P1', 'P3'], 'revenue': [10, 20, 30, 40]})
products = pd.DataFrame({'product_id': ['P1', 'P1', 'P2', 'P3'],
                         'category': ['Home', 'Home', 'Grocery', 'Electronics'],
                         'updated': ['2025-01-01', '2026-03-01', '2025-06-01', '2025-02-01']})
# Keep only the latest row per product_id in products, then left-join onto orders with validate='many_to_one'.
# Show the total revenue after the join (it should still be 100).
```
```python solution
import pandas as pd

orders = pd.DataFrame({'order_id': [1, 2, 3, 4], 'product_id': ['P1', 'P2', 'P1', 'P3'], 'revenue': [10, 20, 30, 40]})
products = pd.DataFrame({'product_id': ['P1', 'P1', 'P2', 'P3'],
                         'category': ['Home', 'Home', 'Grocery', 'Electronics'],
                         'updated': ['2025-01-01', '2026-03-01', '2025-06-01', '2025-02-01']})
latest = products.sort_values('updated').drop_duplicates('product_id', keep='last')
m = orders.merge(latest, on='product_id', how='left', validate='many_to_one')
m['revenue'].sum()
```
```python check
assert _ == 100, f'Total after the join is {_}; de-duplicate products first so revenue stays 100.'
```
```hint
products.sort_values('updated').drop_duplicates('product_id', keep='last') gives one row per product; then merge with validate='many_to_one'.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** a join outputs, for each key, (left rows with that key) × (right rows with that key). With `a` copies on the left and `b` on the right, you get `a × b` rows. A lookup table must have `b = 1`, or every matched row repeats `b` times.

**Many-to-many** joins are sometimes right (students × courses through an enrolments table), but almost never when adding details to a fact table. If you see one by accident, totals are wrong.
</details>

## 6. Practice

1. After a left join, the row count rose from 9,717 to 9,940. What's the likely cause?
2. Which `validate` value fits joining order lines to customers?
3. Product codes are `'00123'` in one table and `123` in the other. How do you fix it?

<details>
<summary>Answers</summary>

1. Duplicate keys in the right-hand table; find them with `right[right.duplicated('key', keep=False)]`.
2. `'many_to_one'`: many lines per customer, one row per customer in the lookup.
3. `df['code'] = df['code'].astype(str).str.zfill(5)` on the numeric side.
</details>

**New words:** *duplicate key*, *row explosion*, *validate*, *many-to-one*, *many-to-many*, *key hygiene*.
