---
title: 'Data types and converting them'
summary: 'Check each column''s type and fix the wrong ones: text to numbers with to_numeric (stripping $ and %), numbers to text for codes, categories for repeated labels, and booleans.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: "Prices arrive as text like '$12.50'. How do you make them numbers?"
    choices: ["pd.to_numeric(s.str.replace('$', '', regex=False))", "s.astype(int)", "s * 1"]
    ans: 0
    why: 'Remove the symbol first, then convert.'
  - q: "What does errors='coerce' do in pd.to_numeric?"
    choices: ['Raises an error', 'Turns values it cannot read into NaN, so you can find and inspect them', 'Deletes the column']
    ans: 1
    why: 'Coercing lets the conversion finish; then isna() shows which values were bad.'
  - q: 'Why store a column like store size (small/medium/large) as category?'
    choices: ['It saves memory and can keep a meaningful order for sorting', 'It is required for groupby', 'It makes text upper case']
    ans: 0
    why: 'Ordered categories sort small < medium < large instead of alphabetically.'
---

**Module 3 · about 20 minutes · uses Lesson 1.6.** You'll be able to fix columns that were read with the wrong type.

## 1. Spot the wrong types

```python data=orders_messy.csv
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
print(messy.dtypes)
messy[['Unit Price', 'Discount']].head()
```

`Unit Price` and `Discount` should be numbers but are text (`str`), because some cells contain `$` or `%`. You can't sum or average them until they're converted.

## 2. Text to numbers

```python data=orders_messy.csv
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
messy['price'] = pd.to_numeric(messy['Unit Price'].str.replace('$', '', regex=False))
messy['discount'] = pd.to_numeric(messy['Discount'].str.rstrip('%')) / 100
print(messy[['price', 'discount']].dtypes)
messy[['Unit Price', 'price', 'Discount', 'discount']].head()
```

If some values can't be read, `errors='coerce'` turns them into NaN, and you can see which:

```python
import pandas as pd

s = pd.Series(['12.5', '7', 'seven', '1,200', ''])
nums = pd.to_numeric(s.str.replace(',', '', regex=False), errors='coerce')
print(s[nums.isna()].tolist())      # the values that failed
nums
```

## 3. Numbers to text, categories and booleans

```python
import pandas as pd

df = pd.DataFrame({'postcode': [1234, 56789], 'size': ['large', 'small'], 'member': ['yes', 'no']})
df['postcode'] = df['postcode'].astype(str).str.zfill(5)          # back to 5-digit codes
df['size'] = pd.Categorical(df['size'], categories=['small', 'medium', 'large'], ordered=True)
df['member'] = df['member'].map({'yes': True, 'no': False})
print(df.dtypes)
df.sort_values('size')
```

- `astype(str)` for codes you'll never do maths on (ids, postcodes, phone numbers).
- An **ordered category** sorts in a meaningful order and saves memory on repeated labels.
- `map` with a dictionary turns labels into True/False (or any values).
- `astype(int)` fails if the column has NaN; use `astype('Int64')` (capital I), which allows missing whole numbers.

## 4. Your turn

```python exercise data=orders_messy.csv
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
# Make a numeric column 'price' from 'Unit Price' (remove the $ first). Show messy['price'].mean() rounded to 2 decimals.
```
```python solution
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
messy['price'] = pd.to_numeric(messy['Unit Price'].str.replace('$', '', regex=False))
round(messy['price'].mean(), 2)
```
```python check
assert 'price' in messy.columns and str(messy['price'].dtype).startswith('float'), "Make a numeric column called 'price'."
exp = round(pd.to_numeric(messy['Unit Price'].str.replace('$', '', regex=False)).mean(), 2)
assert _ == exp, f'Show round(messy["price"].mean(), 2); expected {exp}.'
```
```hint
messy['Unit Price'].str.replace('$', '', regex=False) removes the symbol; wrap it in pd.to_numeric(...).
```

```python exercise
import pandas as pd

s = pd.Series(['15%', '0%', '25%', None, '10%'])
# Convert s to decimals (15% -> 0.15), keeping the missing value as NaN. Show the result.
```
```python solution
import pandas as pd

s = pd.Series(['15%', '0%', '25%', None, '10%'])
pd.to_numeric(s.str.rstrip('%')) / 100
```
```python check
vals = _.tolist()
assert len(vals) == 5 and vals[0] == 0.15 and vals[2] == 0.25 and pd.isna(vals[3]), f'Got {vals}; strip the % then divide by 100.'
```
```hint
s.str.rstrip('%') removes the % sign (and leaves the missing value missing); then pd.to_numeric and / 100.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** a pandas column holds one type. If even one value can't be read as a number, `read_csv` keeps the whole column as text. Converting is deliberate: you decide how to treat the odd values instead of pandas guessing.

**Types you'll meet:** `int64`, `float64` (numbers), `bool`, `str` (text, pandas 3), `datetime64[ns]` (dates, next lessons), `category`, and the nullable `Int64`, `boolean`.
</details>

## 5. Practice

1. Convert `'1,250.50'` style text to numbers.
2. Why keep customer ids as text even if they look like numbers?
3. What does `astype('Int64')` allow that `astype(int)` doesn't?

<details>
<summary>Answers</summary>

1. `pd.to_numeric(s.str.replace(',', '', regex=False))`.
2. You never add them up, leading zeros matter, and some systems mix letters in later.
3. Missing values (shown as `<NA>`) in a whole-number column.
</details>

**New words:** *dtype*, *to_numeric*, *coerce*, *astype*, *category*, *ordered category*, *nullable integer*.
