---
title: 'Cleaning text with .str'
summary: 'Tidy messy text columns with the .str methods: strip spaces, fix capitals, replace characters, split one column into several, extract patterns with regular expressions, and standardise spelling variants.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: "'Maple Ridge', ' maple ridge' and 'MAPLE RIDGE' should be one store. Which fixes it?"
    choices: ["s.str.strip().str.title()", "s.unique()", "s.str.len()"]
    ans: 0
    why: 'Remove the outer spaces, then make the capitals consistent.'
  - q: "How do you split 'Toronto, ON' into city and province columns?"
    choices: ["df['place'].str.split(', ', expand=True)", "df['place'].split(',')", "df.split('place')"]
    ans: 0
    why: 'expand=True returns a DataFrame with one column per part.'
  - q: 'What does str.extract(r"(\d+)") do?'
    choices: ['Deletes digits', 'Pulls the first run of digits out of each value into a new column', 'Counts digits']
    ans: 1
    why: 'extract returns what the bracketed part of the pattern matched.'
---

**Module 3 · about 20 minutes · uses Lesson 3.3.** You'll be able to clean and split text columns so that the same thing is always written the same way.

## 1. Spaces and capitals

```python data=orders_messy.csv
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
print(messy['Store'].nunique(), 'different spellings before')
messy['store'] = messy['Store'].str.strip().str.title()
print(messy['store'].nunique(), 'after')
messy['store'].value_counts()
```

Every `.str` method works on the whole column: `strip`, `lower`, `upper`, `title`, `replace`, `startswith`, `contains`, `len`, `split`, `extract`. Missing values stay missing.

## 2. Replace, split and extract

```python
import pandas as pd

df = pd.DataFrame({'place': ['Toronto, ON', 'Montreal, QC', 'Calgary, AB'],
                   'sku': ['SKU-0042-BLK', 'SKU-0107-RED', 'SKU-0009-BLK'],
                   'phone': ['(905) 555-0142', '905.555.0199', '905 555 0175']})
df[['city', 'province']] = df['place'].str.split(', ', expand=True)
df['item_no'] = df['sku'].str.extract(r'SKU-(\d+)-')[0].astype(int)
df['colour'] = df['sku'].str[-3:]
df['phone_digits'] = df['phone'].str.replace(r'\D', '', regex=True)    # \D = anything not a digit
df
```

**Regular expressions** (`regex=True`, or always in `extract` and `contains`) describe patterns: `\d` a digit, `\D` a non-digit, `+` one or more, `^` start, `$` end, brackets capture a part. You only need a handful; look up the rest when you need them.

## 3. Standardise variants with a mapping

When cleaning leaves known variants (abbreviations, old names), map them to one form:

```python
import pandas as pd

s = pd.Series(['Online', 'Web', 'website', 'Harbourview', 'Harbour View'])
fix = {'web': 'Online', 'website': 'Online', 'online': 'Online', 'harbour view': 'Harbourview'}
clean = s.str.lower().map(fix).fillna(s)
clean.value_counts()
```

`map(fix)` gives NaN for anything not in the dictionary, and `fillna(s)` keeps the original for those.

## 4. Your turn

```python exercise data=orders_messy.csv
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
# Make a clean column 'store' from 'Store': no outer spaces, title case. Show messy['store'].nunique().
```
```python solution
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
messy['store'] = messy['Store'].str.strip().str.title()
messy['store'].nunique()
```
```python check
assert 'store' in messy.columns, "Make a column called 'store'."
assert _ == 7, f'There should be 7 stores after cleaning; you have {_}. Strip spaces and use title case.'
```
```hint
messy['Store'].str.strip().str.title()
```

```python exercise
import pandas as pd

codes = pd.Series(['ORD-2025-00017', 'ORD-2026-00342', 'ORD-2025-01999'])
# Extract the year (the 4 digits after 'ORD-') as whole numbers. Show the result.
```
```python solution
import pandas as pd

codes = pd.Series(['ORD-2025-00017', 'ORD-2026-00342', 'ORD-2025-01999'])
codes.str.extract(r'ORD-(\d{4})-')[0].astype(int)
```
```python check
assert list(_) == [2025, 2026, 2025], f'Got {list(_)}; capture the 4 digits after ORD- and convert to int.'
```
```hint
codes.str.extract(r'ORD-(\d{4})-') returns a table; take column [0] and .astype(int).
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** computers compare text character by character, so `'Maple Ridge'`, `' Maple Ridge'` and `'maple ridge'` are three different values. Every count, group and join treats them as separate. Clean text **before** grouping or joining, then check with `value_counts()` that the variants are gone.

**Order of steps:** strip → case → replace characters → map known variants → check.
</details>

## 5. Practice

1. Find all product names containing "oil", ignoring case.
2. Keep only the first word of each name.
3. Remove everything except digits from `'$1,299.00'` style text, then divide by 100.

<details>
<summary>Answers</summary>

1. `df[df['product'].str.contains('oil', case=False)]`.
2. `df['name'].str.split().str[0]`.
3. `s.str.replace(r'\D', '', regex=True).astype(int) / 100`.
</details>

**New words:** *.str accessor*, *strip*, *title case*, *split*, *extract*, *regular expression*, *mapping*.
