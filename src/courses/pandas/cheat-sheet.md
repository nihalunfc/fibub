---
title: 'pandas cheat sheet'
summary: 'Every pandas command from the course on one page: reading files, selecting and filtering, cleaning, groupby, merge, pivot and melt, dates, rolling windows, growth rates and speed tips, each with a one-line example. Print it or keep it open.'
seoTitle: 'pandas cheat sheet for data analysts'
minutes: 10
updated: 2026-11-22
quiz:
  - q: 'Which keeps one row per group?'
    choices: ["groupby('k')['x'].sum()", "groupby('k')['x'].transform('sum')", "df['x'].cumsum()"]
    ans: 0
    why: 'transform keeps every row; sum (and agg) gives one row per group.'
  - q: 'Which makes a wide table long?'
    choices: ['melt', 'pivot', 'unstack']
    ans: 0
    why: 'melt turns column names into values of a new column.'
  - q: 'Which selects by position?'
    choices: ['iloc', 'loc', 'at']
    ans: 0
    why: 'iloc = integer location.'
---

**Module 9 · reference.** One line per command, using the course data. Press Ctrl+P (⌘+P on a Mac) to print it.

## Read and look

| Task | Code |
|---|---|
| Read a CSV | `df = pd.read_csv('orders.csv', parse_dates=['date'])` |
| Read Excel | `pd.read_excel('file.xlsx', sheet_name='Sales')` |
| Size, types | `df.shape`, `df.info()`, `df.dtypes` |
| First rows, summary | `df.head()`, `df.describe()` |
| Missing per column | `df.isna().sum()` |
| Distinct values | `df['store_id'].nunique()`, `df['store_id'].value_counts()` |
| Save | `df.to_csv('out.csv', index=False)` |

## Select and filter

| Task | Code |
|---|---|
| Columns | `df['qty']`, `df[['qty', 'unit_price']]` |
| By label / position | `df.loc[5, 'qty']`, `df.iloc[0:5, 0:3]` |
| Condition | `df[df['qty'] > 2]` |
| Several conditions | `df[(df.qty > 2) & (df.store_id == 'S01')]` |
| Readable filter | `df.query("qty > 2 and store_id == 'S01'")` |
| In a list / range | `df[df.store_id.isin(['S01', 'S02'])]`, `df[df.qty.between(2, 4)]` |
| Sort, top N | `df.sort_values('qty', ascending=False)`, `df.nlargest(5, 'qty')` |
| New column | `df['revenue'] = df.qty * df.unit_price * (1 - df.discount)` |
| In a chain | `df.assign(revenue=lambda d: d.qty * d.unit_price)` |
| If / else | `np.where(df.qty >= 3, 'multi', 'single')`, `np.select([c1, c2], [v1, v2], default=v3)` |

## Clean

| Task | Code |
|---|---|
| Drop / fill missing | `df.dropna(subset=['qty'])`, `df['qty'].fillna(0)` |
| Fill with group median | `df['qty'].fillna(df.groupby('store_id')['qty'].transform('median'))` |
| Duplicates | `df.duplicated().sum()`, `df.drop_duplicates(subset=['order_id'], keep='last')` |
| To number | `pd.to_numeric(df.price.str.replace('$', ''), errors='coerce')` |
| Text | `df.store.str.strip().str.title()`, `.str.contains('kg')`, `.str.split(' ', expand=True)` |
| Dates | `pd.to_datetime(df.date, format='mixed')` |
| Rename / change type | `df.rename(columns={'Qty': 'qty'})`, `df.astype({'qty': 'int64'})` |
| Check | `assert df['qty'].ge(0).all()` |

## Group

| Task | Code |
|---|---|
| One summary | `df.groupby('store_id')['qty'].sum()` |
| Named summaries | `df.groupby('store_id').agg(units=('qty', 'sum'), orders=('order_id', 'nunique'))` |
| On every row | `df.groupby('store_id')['qty'].transform('sum')` |
| Keep some groups | `df.groupby('customer_id').filter(lambda g: len(g) >= 10)` |
| Counts by two keys | `pd.crosstab(df.store_id, df.segment)` |
| Bands | `pd.cut(df.unit_price, [0, 10, 50, 1000])`, `pd.qcut(df.revenue, 5)` |

## Combine and reshape

| Task | Code |
|---|---|
| Stack tables | `pd.concat([a, b], ignore_index=True)` |
| Join | `orders.merge(products, on='product_id', how='left', validate='many_to_one')` |
| Find unmatched | `a.merge(b, on='k', how='outer', indicator=True)` |
| Lookup one column | `df.product_id.map(products.set_index('product_id')['category'])` |
| Pivot table | `df.pivot_table(index='store_id', columns='category', values='qty', aggfunc='sum', margins=True)` |
| Wide to long | `wide.melt(id_vars='store', var_name='quarter', value_name='budget')` |
| Long to wide | `long.pivot(index='store', columns='quarter', values='budget')` |
| Index levels | `s.unstack('store_id')`, `wide.stack()`, `df.reset_index()` |

## Dates and time

| Task | Code |
|---|---|
| Parts of a date | `df.date.dt.year`, `.dt.month`, `.dt.day_name()`, `.dt.dayofweek`, `.dt.to_period('M')` |
| Select dates | `daily.loc['2026-03']`, `daily.loc['2025-11-24':'2025-11-30']` |
| Every day present | `daily.reindex(pd.date_range(start, end, freq='D'), fill_value=0)` |
| Change frequency | `df.resample('MS', on='date')['qty'].sum()` |
| Date bucket in groupby | `df.groupby(['store_id', pd.Grouper(key='date', freq='QS')])` |
| Rolling, running | `daily.rolling(7).mean()`, `rolling('7D')`, `expanding().sum()`, `cumsum()` |
| Growth | `m.pct_change()`, `m.pct_change(12)`, `m.shift(1)`, `m.diff()` |
| Fiscal quarters | `df.date.dt.to_period('Q-MAR')` |

## Speed

| Do | Instead of |
|---|---|
| `df.a * df.b` | `for` loops, `iterrows()` |
| `np.where`, `np.select` | `apply(lambda r: ..., axis=1)` |
| `map`, `merge` | looking up values in a loop |
| `usecols=`, `dtype={'store_id': 'category'}` | reading every column as text |

<details class="maths" open>
<summary>How it works</summary>

**Principle:** nearly every pandas task is one of six moves: **look**, **select or filter**, **clean**, **group and summarise**, **combine or reshape**, and **order in time**. When you are stuck, name the move first; the command follows.
</details>

**Next:** test yourself with the [interview questions](/learn/courses/pandas/interview-questions/), or open [Module 1](/learn/courses/pandas/why-pandas/) to start again from the top.

**New words:** none, this page collects the course's words.
