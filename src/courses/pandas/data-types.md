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
sources:
  - 'pandas documentation, User Guide: Essential basic functionality (dtypes) https://pandas.pydata.org/docs/user_guide/basics.html#dtypes'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 3 · about 20 minutes · uses Lesson 1.6.** You'll be able to fix columns that were read with the wrong type.

<div class="bigidea">Each column has a type (number, text, date, category, True/False), and the wrong type silently breaks sums, sorting and filters.</div>

**In everyday terms:** numbers stored as text are like prices written on paper tags: you can read them, but the till cannot add them. Converting the type is typing them into the till.

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

<div class="meaning">

<dl>
<dt>int64 / float64</dt><dd>Whole numbers / decimals.</dd>
<dt>object or string</dt><dd>Text.</dd>
<dt>datetime64</dt><dd>Dates and times.</dd>
<dt>category</dt><dd>Text with few repeated values, stored compactly.</dd>
<dt>pd.to_numeric(errors='coerce')</dt><dd>Convert text to numbers; anything unreadable becomes NaN for you to inspect.</dd>
<dt>Physical meaning</dt><dd>The type decides what operations mean. "10" + "5" is "105" as text and 15 as numbers; "10" sorts before "9" as text. Fix types right after reading.</dd>
</dl>

</div>

<div class="myth">

**"If it looks like a number, pandas treats it as one."** One "$" or "n/a" in a column turns the whole column into text. info() shows object instead of float64: that is your clue.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The column.</b> price = ['$4.50', '$12', 'n/a', '$7.25'] (object).</div>
<div class="step"><b>Strip symbols.</b> <code>.str.replace('$', '')</code> → ['4.50', '12', 'n/a', '7.25'].</div>
<div class="step"><b>Convert.</b> <code>pd.to_numeric(..., errors='coerce')</code> → 4.5, 12.0, NaN, 7.25 (float64).</div>
<div class="step"><b>Inspect what failed.</b> The NaN came from 'n/a': a real gap, not a typo.</div>
<div class="step"><b>Now maths works.</b> Sum = 23.75.</div>
</div>

<div class="problem" data-problem="pd-text-sum"></div>

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

<div class="keypoints">

- Check dtypes with info() after reading.
- Clean symbols, then pd.to_numeric(errors='coerce') and inspect new NaN.
- Use astype for safe conversions; category for repeated text; bool for flags.
- Text numbers add and sort as text: "10" + "5" = "105".

</div>
