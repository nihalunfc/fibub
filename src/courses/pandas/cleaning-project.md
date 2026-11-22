---
title: 'Cleaning a messy export, start to finish'
summary: 'Put Module 3 together: turn a messy 412-row till export into a clean, checked table with one function, in the order that works: names, duplicates, text, numbers, dates, missing values, rules, then a cleaning log.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'Why clean text before removing duplicates?'
    choices: ['It is faster', 'Rows that differ only in spaces or capitals are not seen as duplicates until the text is cleaned', 'pandas requires it']
    ans: 1
    why: "' Maple Ridge' and 'Maple Ridge' make otherwise identical rows look different."
  - q: 'Why wrap the steps in a function?'
    choices: ['Functions run faster', 'So next month''s file is cleaned exactly the same way with one call', 'To hide the code']
    ans: 1
    why: 'A cleaning function is repeatable and testable; a pile of one-off edits is not.'
  - q: 'What belongs in a cleaning log?'
    choices: ['Nothing', 'How many rows each step removed or changed, and why', 'The raw data']
    ans: 1
    why: 'Readers of your analysis need to know what was dropped and changed to trust the result.'
sources:
  - 'Wickham, H. (2014), Tidy Data, Journal of Statistical Software 59(10) https://doi.org/10.18637/jss.v059.i10'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 3 · about 30 minutes · uses all of Module 3.** You'll turn a messy export into a clean, validated table with a repeatable function and a log of what changed.

<div class="bigidea">Clean a messy export in a fixed order (names, types, text, dates, duplicates, missing, rules) inside one function you can rerun on next month's file.</div>

**In everyday terms:** a car wash runs in a set order: rinse, soap, scrub, rinse, dry. Drying first would be pointless. Cleaning data has the same kind of order.

## 1. The file

```python data=orders_messy.csv
import pandas as pd

raw = pd.read_csv('orders_messy.csv')
raw.info()
raw.sample(8, random_state=7)
```

Problems spotted: awkward column names, exact duplicate rows, store names with spaces and mixed capitals, prices with `$`, discounts as `10%` text, three date formats, missing quantities, discounts and customers, and a few negative quantities.

## 2. The order that works

1. **Names** first, so the rest of the code is readable.
2. **Text** (strip, case), because it affects duplicates.
3. **Duplicates.**
4. **Numbers** (remove symbols, convert).
5. **Dates.**
6. **Missing values**, with a rule per column.
7. **Rules**: drop or flag rows that break them.
8. **Check** with assertions, and **log** every step.

Try each way of handling the three missing values and watch the mean line.

<figure class="fig" data-fig="@data-missing-fill"><figcaption>Notice that every fill changes the picture a little, and zero is the worst because it invents data.</figcaption></figure>


## 3. One cleaning function

```python data=orders_messy.csv
import pandas as pd

def clean_orders(raw):
    log = []
    def note(step, before, after):
        log.append({'step': step, 'rows before': before, 'rows after': after})

    df = raw.copy()
    df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')
    df = df.rename(columns={'store': 'store_name', 'product': 'product_id', 'order_date': 'date_raw'})

    df['store_name'] = df['store_name'].str.strip().str.title()
    n = len(df); df = df.drop_duplicates(); note('drop exact duplicates', n, len(df))

    df['unit_price'] = pd.to_numeric(df['unit_price'].str.replace('$', '', regex=False))
    df['discount'] = pd.to_numeric(df['discount'].str.rstrip('%')) / 100

    raw_date = df.pop('date_raw')
    df['date'] = (pd.to_datetime(raw_date, format='%Y-%m-%d', errors='coerce')
                    .fillna(pd.to_datetime(raw_date, format='%d/%m/%Y', errors='coerce'))
                    .fillna(pd.to_datetime(raw_date, format='%b %d %Y', errors='coerce')))

    df['discount'] = df['discount'].fillna(0)
    df['customer_id'] = df['customer_id'].fillna('GUEST')
    n = len(df); df = df.dropna(subset=['qty']); note('drop missing qty', n, len(df))
    df['is_return'] = df['qty'] < 0
    df['qty'] = df['qty'].astype(int)

    assert df['date'].notna().all(), 'some dates did not parse'
    assert df['unit_price'].gt(0).all(), 'prices must be positive'
    assert df['discount'].between(0, 0.5).all(), 'discount out of range'
    return df.reset_index(drop=True), pd.DataFrame(log)

clean, log = clean_orders(pd.read_csv('orders_messy.csv'))
display(log)
print(clean.dtypes)
clean.head()
```

Every step is in the function, so next month's export is one line: `clean, log = clean_orders(pd.read_csv('next_month.csv'))`.

<div class="meaning">

<dl>
<dt>Column names</dt><dd>Fix first, so every later step can use simple names.</dd>
<dt>Types</dt><dd>Next: numbers, dates and text in the right types.</dd>
<dt>Values</dt><dd>Then text variants, duplicates and gaps.</dd>
<dt>Rules</dt><dd>Last: asserts that the result is fit to use.</dd>
<dt>Physical meaning</dt><dd>Each step relies on the one before: you cannot drop duplicate orders before order IDs are the same type, or fill gaps per store before store names are consistent.</dd>
</dl>

</div>

<div class="myth">

**"Clean it once by hand and save the file."** Next month the same mess comes back. A cleaning function turns an afternoon into one line and makes the cleaning itself reviewable.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Names.</b> 'Customer ID' → customer_id; 'Unit Price' → unit_price.</div>
<div class="step"><b>Types.</b> '$12.50' → 12.5; '10%' → 0.10; three date formats → datetime.</div>
<div class="step"><b>Text.</b> ' harbourview' → 'Harbourview': 7 stores, not 12.</div>
<div class="step"><b>Rows.</b> 12 duplicate lines removed; 22 missing qty filled from the product's median and flagged.</div>
<div class="step"><b>Rules.</b> asserts pass: positive qty, discounts 0 to 0.5, known stores. 400 clean rows.</div>
</div>

<div class="problem" data-problem="pd-clean-rows"></div>

## 4. Your turn: extend the function

```python exercise data=orders_messy.csv
import pandas as pd

raw = pd.read_csv('orders_messy.csv')

def clean_small(raw):
    df = raw.drop_duplicates().copy()
    df['store'] = df['Store'].str.strip().str.title()
    df['price'] = pd.to_numeric(df['Unit Price'].str.replace('$', '', regex=False))
    # Add: drop rows with missing Qty, then add revenue = Qty * price (ignore discounts here).
    return df

clean = clean_small(raw)
round(clean['revenue'].sum(), 2)
```
```python solution
import pandas as pd

raw = pd.read_csv('orders_messy.csv')

def clean_small(raw):
    df = raw.drop_duplicates().copy()
    df['store'] = df['Store'].str.strip().str.title()
    df['price'] = pd.to_numeric(df['Unit Price'].str.replace('$', '', regex=False))
    df = df.dropna(subset=['Qty'])
    df['revenue'] = df['Qty'] * df['price']
    return df

clean = clean_small(raw)
round(clean['revenue'].sum(), 2)
```
```python check
d = raw.drop_duplicates().dropna(subset=['Qty'])
exp = round((d['Qty'] * pd.to_numeric(d['Unit Price'].str.replace('$', '', regex=False))).sum(), 2)
assert 'revenue' in clean.columns, 'Add a revenue column inside the function.'
assert clean['Qty'].notna().all(), 'Drop the rows with missing Qty.'
assert _ == exp, f'Total revenue should be {exp}; you have {_}.'
```
```hint
Inside the function, before return: df = df.dropna(subset=['Qty']) and df['revenue'] = df['Qty'] * df['price'].
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** cleaning is part of the analysis, so it should be code, not manual edits. A function makes it repeatable; assertions make it safe; a log makes it honest.

**Keep the raw file untouched.** Read it, clean a copy, and save the result under a new name (`orders_clean.csv`). If a rule turns out wrong, change the function and rerun from the raw file.

**Returns are a decision:** here negative quantities are kept and flagged (`is_return`), so net sales stay right. Another analysis might separate them. Say which you did.
</details>

## 5. Practice

1. Why use `raw.copy()` at the start?
2. Your log shows the "drop missing qty" step removed 30 % of rows. What do you do?
3. Where would you save the cleaned table, and in what format?

<details>
<summary>Answers</summary>

1. So the function never changes the caller's DataFrame; the raw data stays as read.
2. Stop and investigate: that's too many to drop silently. Find out why quantities are missing (a till fault, a store) before continuing.
3. A new file, such as `orders_clean.csv` (or Parquet for big data), next to the raw file, never over it.
</details>

**New words:** *cleaning function*, *cleaning log*, *pipeline*, *raw vs clean data*.

<div class="keypoints">

- Clean in order: names, types, text, dates, duplicates, missing, rules.
- Wrap the steps in one function and rerun it on each new file.
- Log what each step changed (rows dropped, values filled).
- Finish with asserts so a bad file stops the pipeline.

</div>
