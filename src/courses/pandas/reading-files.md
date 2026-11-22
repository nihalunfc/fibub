---
title: 'Reading CSV and Excel files'
summary: 'Load data with read_csv and read_excel, and use the options that fix the usual problems: separators, header rows, column names, dates, text codes that look like numbers, and missing-value markers.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: "A file uses semicolons between values. Which option reads it?"
    choices: ["sep=';'", "delimiter='tab'", 'header=None']
    ans: 0
    why: "read_csv expects commas unless told otherwise with sep (European exports often use ';')."
  - q: "Postal codes like 01234 lose their leading zero. How do you keep it?"
    choices: ["dtype={'postcode': str}", 'parse_dates=True', 'skiprows=1']
    ans: 0
    why: 'Read the column as text, so pandas does not turn it into the number 1234.'
  - q: 'What does parse_dates=["date"] do?'
    choices: ['Deletes the date column', 'Reads that column as real dates, so you can sort, filter and group by month', 'Formats dates as text']
    ans: 1
    why: 'Without it, dates arrive as text and sort alphabetically.'
---

**Module 1 · about 20 minutes · uses Lesson 1.4.** You'll be able to read CSV and Excel files and fix the common reading problems with options instead of manual edits.

## 1. read_csv

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
print(orders.shape)
orders.head()
```

That's most of reading files. The rest of this lesson is the options for files that aren't so tidy.

## 2. The options you'll need

| Problem | Option |
|---|---|
| Not commas (`;`, tabs) | `sep=';'`, `sep='\t'` |
| Junk lines above the header | `skiprows=3` |
| No header row | `header=None, names=['a', 'b']` |
| Only some columns | `usecols=['date', 'qty']` |
| Dates as text | `parse_dates=['date']` |
| Codes with leading zeros | `dtype={'postcode': str}` |
| Missing written as `-` or `n/a` | `na_values=['-', 'n/a']` |
| Thousands with commas (`1,250`) | `thousands=','` |
| Accents garbled | `encoding='latin-1'` (or `'cp1252'`) |

Try a few on a small "awkward" file. `io.StringIO` lets us pretend a piece of text is a file:

```python
import io
import pandas as pd

raw = '''Export from till system
store;postcode;sales;opened
Harbourview;01234;1,250;2015-04-01
Maple Ridge;n/a;980;2017-09-15
'''
df = pd.read_csv(io.StringIO(raw), sep=';', skiprows=1, dtype={'postcode': str},
                 na_values=['n/a'], thousands=',', parse_dates=['opened'])
print(df.dtypes)
df
```

Remove the options one at a time and run again to see what each fixes.

## 3. Excel files

```py
sales = pd.read_excel('sales.xlsx')                       # first sheet
sales = pd.read_excel('sales.xlsx', sheet_name='2026')    # a named sheet
all_sheets = pd.read_excel('sales.xlsx', sheet_name=None) # every sheet, as a dict of DataFrames
```

`read_excel` takes the same `skiprows`, `usecols`, `dtype` and `na_values` options. On your own computer it needs the `openpyxl` package (`pip install openpyxl`). The in-page Python here doesn't include it, so the course datasets are CSV.

**Writing files** is the mirror image: `df.to_csv('out.csv', index=False)` and `df.to_excel('out.xlsx', index=False)`. `index=False` stops pandas writing the 0, 1, 2 row labels as an extra column.

## 4. Your turn

```python exercise data=orders.csv
import pandas as pd

# Read orders.csv with the date column as real dates, into a DataFrame called orders.
# Then show orders['date'].min() (the first date).
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['date'].min()
```
```python check
assert 'orders' in dir(), 'Read the file into a variable called orders.'
assert str(orders['date'].dtype).startswith('datetime64'), "The date column is still text; add parse_dates=['date']."
assert str(_)[:10] == '2025-01-01', 'Show orders["date"].min() on the last line.'
```
```hint
pd.read_csv('orders.csv', parse_dates=['date']), then orders['date'].min() on the last line.
```

```python exercise data=products.csv
import pandas as pd

# Read only the product and price columns of products.csv (use usecols). Show the first 5 rows.
```
```python solution
import pandas as pd

products = pd.read_csv('products.csv', usecols=['product', 'price'])
products.head()
```
```python check
assert isinstance(_, pd.DataFrame), 'Show a table on the last line.'
assert list(_.columns) == ['product', 'price'], f'Your columns are {list(_.columns)}; read only product and price.'
assert len(_) == 5, 'Show the first 5 rows with .head().'
```
```hint
usecols takes a list of column names: usecols=['product', 'price'].
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** a CSV file is just text. `read_csv` splits each line at the separator, takes the first line as column names, and **guesses** each column's type from its values. Most reading problems are wrong guesses, and each option corrects one.

**Why fix on read, not later:** reading `01234` as a number loses the zero for good; reading dates as text makes every later step awkward. Options on read keep the raw file untouched and the fix repeatable.
</details>

## 5. Practice

1. A file has two title lines before the header. Which option?
2. Missing values appear as `.`. Which option?
3. Why add `index=False` when saving?

<details>
<summary>Answers</summary>

1. `skiprows=2`.
2. `na_values=['.']`.
3. Otherwise the row labels (0, 1, 2, ...) are saved as an extra unnamed column.
</details>

**Try it on your own data:** the [[csv-profiler]] tool shows what's in any CSV (types, missing values, odd entries) before you write the `read_csv` line.

**New words:** *CSV*, *separator*, *header*, *parse dates*, *encoding*, *read_excel*.
