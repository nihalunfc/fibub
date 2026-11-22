---
title: 'Lookups with map and replace'
summary: 'Translate values with map (from a dictionary or a Series, like a VLOOKUP), recode labels with replace, and know when a merge is the better tool.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: "What does s.map({'S01': 'Harbourview'}) give for 'S02'?"
    choices: ["'S02'", 'NaN', 'An error']
    ans: 1
    why: 'map returns NaN for keys not in the dictionary. replace would leave S02 unchanged.'
  - q: 'Which is the pandas version of a VLOOKUP for one column?'
    choices: ["orders['product_id'].map(products.set_index('product_id')['category'])", "orders.lookup('category')", "orders['category'].vlookup()"]
    ans: 0
    why: 'A Series indexed by the key acts as a lookup table for map.'
  - q: 'When is merge better than map?'
    choices: ['When you need several columns from the lookup table, or several keys', 'Never', 'Only for numbers']
    ans: 0
    why: 'map brings one column on one key; merge brings any number of columns and keys.'
sources:
  - 'pandas documentation, User Guide: pandas.Series.map https://pandas.pydata.org/docs/reference/api/pandas.Series.map.html'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 5 · about 15 minutes · uses Lesson 5.2.** You'll be able to translate codes into names and recode values quickly.

<div class="bigidea">map translates each value through a lookup, like VLOOKUP for one column; replace swaps only the values you list and leaves the rest alone.</div>

**In everyday terms:** a phrasebook: look up each word and write its translation. Words not in the book come back blank with map, or unchanged with replace.

## 1. map with a dictionary

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
names = {'S01': 'Harbourview', 'S02': 'Maple Ridge', 'S03': 'Cedar Falls', 'S04': 'Pine Lake',
         'S05': 'Riverside', 'S06': 'Elm Grove', 'WEB': 'Online'}
orders['store'] = orders['store_id'].map(names)
orders[['store_id', 'store']].drop_duplicates().sort_values('store_id')
```

## 2. map with a Series: VLOOKUP

```python data=orders.csv,products.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
products = pd.read_csv('products.csv')
category = products.set_index('product_id')['category']     # key -> value
orders['category'] = orders['product_id'].map(category)
orders['list_price'] = orders['product_id'].map(products.set_index('product_id')['price'])
orders[['product_id', 'category', 'unit_price', 'list_price']].head()
```

If the lookup's key repeats, `map` raises an error (it can't choose), which protects you from the duplicate-key trap in Lesson 5.3.

Pick a join type and press Play (or drag Rows built) to watch the result table being made one row at a time. Compare INNER with LEFT, then with FULL.

<figure class="fig" data-fig="@data-join-types"><figcaption>Notice which rows only some joins keep, and where NULL appears: always on the side that had no partner.</figcaption></figure>


## 3. replace: recode some values, keep the rest

```python
import pandas as pd

s = pd.Series(['email', 'none', 'app', 'e-mail', 'Email'])
s.str.lower().replace({'e-mail': 'email', 'none': 'no contact'})
```

`replace` changes only the values you list. `map` turns anything you don't list into NaN, which makes it the stricter choice for lookups.

<div class="meaning">

<dl>
<dt>s.map(dict)</dt><dd>Each value becomes dict[value]; values not in the dict become NaN.</dd>
<dt>s.map(series)</dt><dd>Uses the Series index as keys: a VLOOKUP from another table.</dd>
<dt>s.replace({...})</dt><dd>Changes only listed values; others stay as they are.</dd>
<dt>merge instead</dt><dd>Better when you need several columns from the lookup table.</dd>
<dt>Physical meaning</dt><dd>map keeps the row count fixed (one answer per row), which makes it safer than a join for a single column. A NaN after map is a missing entry in your lookup, not missing data.</dd>
</dl>

</div>

<div class="myth">

**"map and replace are the same."** map with a dictionary turns every value not in it into NaN; replace leaves those values untouched. Use replace to fix a few labels, map to translate all of them.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Codes.</b> <table class="lk-tbl"><tr><th>order</th><th>store_id</th></tr><tr><td>1</td><td>S01</td></tr><tr><td>2</td><td>S03</td></tr><tr><td>3</td><td>S07</td></tr></table></div>
<div class="step"><b>Lookup.</b> <code>city = {'S01': 'Toronto', 'S03': 'Halifax'}</code></div>
<div class="step"><b>map.</b> <code>df['store_id'].map(city)</code><table class="lk-tbl"><tr><th>order</th><th>store_id</th><th>city</th></tr><tr><td>1</td><td>S01</td><td>Toronto</td></tr><tr><td>2</td><td>S03</td><td>Halifax</td></tr><tr><td>3</td><td>S07</td><td><mark>NaN</mark></td></tr></table></div>
<div class="step"><b>replace instead.</b> S07 would stay as 'S07'.</div>
<div class="step"><b>Find gaps.</b> <code>df.loc[df['city'].isna(), 'store_id'].unique()</code> → ['S07']: add it to the lookup.</div>
</div>

<div class="problem" data-problem="pd-map-sum"></div>

## 4. Your turn

```python exercise data=customers.csv,stores.csv
import pandas as pd

customers = pd.read_csv('customers.csv')
stores = pd.read_csv('stores.csv')
# Add 'province' to customers by mapping home_store through stores (store_id -> province). Show province value_counts().
```
```python solution
import pandas as pd

customers = pd.read_csv('customers.csv')
stores = pd.read_csv('stores.csv')
customers['province'] = customers['home_store'].map(stores.set_index('store_id')['province'])
customers['province'].value_counts()
```
```python check
assert 'province' in customers.columns and customers['province'].notna().all(), 'Every customer should get a province.'
assert _.index[0] == 'Ontario', 'Show province value_counts(); Ontario has the most.'
```
```hint
stores.set_index('store_id')['province'] is the lookup; customers['home_store'].map(...) applies it.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** `map` looks each value up in a table of key → value (a dictionary or a Series index) and returns what it finds. It's a left join that brings back exactly one column, with a guarantee of one match per row.

| Tool | Brings | Unmatched values |
|---|---|---|
| `map` | one column, one key | NaN |
| `replace` | recoded values | unchanged |
| `merge` | any columns, any keys | NaN (left join) |
</details>

## 5. Practice

1. Map `segment` codes `{'R': 'Regular', 'B': 'Bargain', 'P': 'Premium'}`.
2. How do you find values that `map` didn't translate?
3. You need a product's name, category and cost on each order line. map or merge?

<details>
<summary>Answers</summary>

1. `df['segment'] = df['code'].map({'R': 'Regular', 'B': 'Bargain', 'P': 'Premium'})`.
2. `df.loc[df['new'].isna(), 'old'].unique()`.
3. `merge`, because you need three columns.
</details>

**New words:** *map*, *lookup table*, *VLOOKUP*, *replace*, *set_index*.

<div class="keypoints">

- map translates every value; missing keys give NaN.
- map with a Series works like VLOOKUP from another table.
- replace recodes only the values you list.
- Use merge when you need several columns from the lookup.

</div>
