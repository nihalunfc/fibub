---
title: 'pandas for SQL, Excel and DAX users'
summary: 'Translate what you already know: SQL SELECT, WHERE, GROUP BY, JOIN and window functions, Excel filters, VLOOKUP, SUMIFS and pivot tables, and DAX CALCULATE and measures, each with its pandas line side by side.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: "Which pandas line matches SQL's GROUP BY store_id HAVING SUM(qty) > 1000?"
    choices: ["s = df.groupby('store_id')['qty'].sum(); s[s > 1000]", "df[df.qty > 1000].groupby('store_id')", "df.query('qty > 1000')"]
    ans: 0
    why: 'Filter AFTER grouping, like HAVING. Filtering before is WHERE.'
  - q: "Excel's VLOOKUP is closest to..."
    choices: ['merge (or map for one column)', 'concat', 'groupby']
    ans: 0
    why: 'Look up a key in another table and bring a column back.'
  - q: "What is the pandas version of SUM(qty) OVER (PARTITION BY store_id)?"
    choices: ["df.groupby('store_id')['qty'].transform('sum')", "df.groupby('store_id')['qty'].sum()", "df['qty'].cumsum()"]
    ans: 0
    why: 'transform keeps every row, like a window function.'
sources:
  - 'pandas documentation, User Guide: Comparison with SQL https://pandas.pydata.org/docs/getting_started/comparison/comparison_with_sql.html'
  - 'pandas documentation, User Guide: Comparison with spreadsheets https://pandas.pydata.org/docs/getting_started/comparison/comparison_with_spreadsheets.html'
---

**Module 8 · about 20 minutes · uses Modules 2 to 6.** You'll be able to move between SQL, Excel, DAX and pandas without relearning the ideas.

<div class="bigidea">SQL, Excel, DAX and pandas share the same few ideas: filter, group, summarise, join, reshape. Learn the mapping once and you can move between them.</div>

**In everyday terms:** the same recipe written in four languages: "boil water" is the same step whatever the words.

## 1. SQL to pandas

| SQL | pandas |
|---|---|
| `SELECT a, b FROM t` | `t[['a', 'b']]` |
| `WHERE qty > 2 AND store_id = 'S01'` | `t.query("qty > 2 and store_id == 'S01'")` |
| `ORDER BY qty DESC LIMIT 5` | `t.nlargest(5, 'qty')` |
| `GROUP BY store_id` + `SUM(qty)` | `t.groupby('store_id')['qty'].sum()` |
| `HAVING SUM(qty) > 1000` | filter the grouped result |
| `COUNT(DISTINCT customer_id)` | `.nunique()` |
| `LEFT JOIN p ON t.pid = p.pid` | `t.merge(p, on='pid', how='left')` |
| `UNION ALL` | `pd.concat([t1, t2])` |
| `CASE WHEN ... END` | `np.select(...)` or `np.where(...)` |
| `ROW_NUMBER() OVER (PARTITION BY c ORDER BY d)` | `t.sort_values('d').groupby('c').cumcount() + 1` |
| `SUM(x) OVER (PARTITION BY c)` | `t.groupby('c')['x'].transform('sum')` |
| `LAG(x) OVER (PARTITION BY c ORDER BY d)` | `t.sort_values('d').groupby('c')['x'].shift(1)` |

```python data=orders.csv,products.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
products = pd.read_csv('products.csv')
# SELECT category, SUM(qty) AS units FROM orders JOIN products USING (product_id)
# WHERE date >= '2026-01-01' GROUP BY category HAVING SUM(qty) > 500 ORDER BY units DESC
units = (orders.query("date >= '2026-01-01'")
               .merge(products, on='product_id')
               .groupby('category')['qty'].sum()
               .rename('units'))
units[units > 500].sort_values(ascending=False)
```

## 2. Excel to pandas

| Excel | pandas |
|---|---|
| Filter button | `df[df['store_id'] == 'S01']` |
| VLOOKUP / XLOOKUP | `df.merge(lookup, on='key', how='left')` or `df['key'].map(...)` |
| SUMIFS(qty, store, "S01", month, 3) | `df.loc[(df.store_id == 'S01') & (df.date.dt.month == 3), 'qty'].sum()` |
| COUNTIFS | the same with `.size` or `(mask).sum()` |
| Pivot table | `df.pivot_table(index=..., columns=..., values=..., aggfunc=...)` |
| Fill down | `df['col'].ffill()` |
| Remove duplicates | `df.drop_duplicates()` |
| IFERROR | `pd.to_numeric(df.x, errors='coerce').fillna(0)` |

The big difference: Excel formulas run cell by cell; pandas runs a whole column at once, and every step is written down, so it can be rerun next month.

Pick a join type and press Play (or drag Rows built) to watch the result table being made one row at a time. Compare INNER with LEFT, then with FULL.

<figure class="fig" data-fig="@data-join-types"><figcaption>Notice which rows only some joins keep, and where NULL appears: always on the side that had no partner.</figcaption></figure>


## 3. DAX to pandas

| DAX | pandas |
|---|---|
| A measure `Revenue = SUM(orders[revenue])` | a function of a filtered table: `def revenue(d): return d['revenue'].sum()` |
| `CALCULATE([Revenue], stores[province] = "Ontario")` | `revenue(df[df.province == 'Ontario'])` |
| A visual sliced by month | `df.groupby('month').apply(revenue)` |
| `DIVIDE([Revenue], [Orders])` | build ratios from totals, after grouping (Lesson 8.2) |
| `SAMEPERIODLASTYEAR` | `shift(12)` on a monthly series, or a merge on month − 12 |
| `ALL(stores)` (ignore a filter) | compute on the unfiltered table and join it back |

```python data=orders.csv,stores.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date']).merge(pd.read_csv('stores.csv'), on='store_id')
orders['revenue'] = orders['qty'] * orders['unit_price'] * (1 - orders['discount'])

def revenue(d): return d['revenue'].sum()
def aov(d): return revenue(d) / d['order_id'].nunique()      # a "measure": recomputed for any slice

by_prov = orders.groupby('province')[['revenue', 'order_id']].apply(lambda d: pd.Series({'revenue': revenue(d), 'aov': aov(d)}))
by_prov['share_of_all_%'] = (by_prov['revenue'] / revenue(orders) * 100).round(1)   # like ALL()
by_prov.round(2)
```

<div class="meaning">

<dl>
<dt>WHERE / filter</dt><dd>df[cond] or df.query(...).</dd>
<dt>GROUP BY + SUM / pivot / SUMMARIZE</dt><dd>groupby(...).agg(...) or pivot_table.</dd>
<dt>HAVING</dt><dd>A filter after the groupby.</dd>
<dt>JOIN / XLOOKUP / RELATED</dt><dd>merge or map.</dd>
<dt>Physical meaning</dt><dd>The order of steps matters the same way everywhere: WHERE filters rows before grouping, HAVING filters groups after. Swap them and you answer a different question.</dd>
</dl>

</div>

<div class="myth">

**"pandas does things differently, so I have to relearn analysis."** The thinking is identical; only the syntax changes. Write the SQL in a comment, then translate it line by line.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The SQL.</b> <code>SELECT store, SUM(qty) AS units FROM orders WHERE price > 5 GROUP BY store HAVING SUM(qty) > 3</code></div>
<div class="step"><b>WHERE.</b> <code>orders[orders.price > 5]</code></div>
<div class="step"><b>GROUP BY + SUM.</b> <code>.groupby('store', as_index=False).agg(units=('qty', 'sum'))</code></div>
<div class="step"><b>HAVING.</b> <code>.query('units > 3')</code></div>
<div class="step"><b>Result.</b> <table class="lk-tbl"><tr><th>store</th><th>units</th></tr><tr><td>S01</td><td>7</td></tr><tr><td>WEB</td><td>5</td></tr></table> Same answer as the database.</div>
</div>

<div class="problem" data-problem="pd-having-count"></div>

## 4. Your turn

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
# SQL: SELECT *, SUM(qty) OVER (PARTITION BY customer_id) AS customer_units FROM orders
# Add the customer_units column to orders (keep every row), then show orders.head().
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['customer_units'] = orders.groupby('customer_id')['qty'].transform('sum')
orders.head()
```
```python check
assert 'customer_units' in orders.columns and len(orders) == 9717, 'Keep all 9,717 rows and add customer_units.'
exp = orders.groupby('customer_id')['qty'].transform('sum')
assert (orders['customer_units'] == exp).all(), "Use groupby('customer_id')['qty'].transform('sum')."
```
```hint
A window function keeps every row: that is transform, not sum.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** SQL, Excel, DAX and pandas all do the same few things to tables: **filter** rows, **choose** columns, **group and aggregate**, **join**, **reshape**, and **compute along a window**. Only the spelling differs. Learn the six ideas once and each new tool is a new dictionary, not a new subject.

**One real difference:** a DAX measure is evaluated again for every cell of a visual under its filters, while a pandas result is computed once. To get measure-like behaviour in pandas, write the measure as a function of a table and apply it per group.
</details>

## 5. Practice

1. SQL `SELECT store_id, COUNT(*) FROM orders GROUP BY store_id` in pandas.
2. Excel COUNTIFS(store, "WEB", qty, ">3").
3. Why does `HAVING` become a filter after `groupby`?

<details>
<summary>Answers</summary>

1. `orders.groupby('store_id').size()` (or `orders['store_id'].value_counts()`).
2. `((orders.store_id == 'WEB') & (orders.qty > 3)).sum()`.
3. HAVING filters groups by their aggregate, which exists only after grouping.
</details>

**New words:** *window function*, *transform*, *SUMIFS*, *measure*, *filter context*.

<div class="keypoints">

- WHERE = filter rows; HAVING = filter after groupby.
- GROUP BY / pivot / SUMMARIZE = groupby().agg() or pivot_table.
- JOIN / XLOOKUP / RELATED = merge or map.
- Translate step by step, keeping the order.

</div>
