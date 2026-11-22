---
title: 'Wide to long with melt'
summary: 'Turn wide tables (one column per month, per year or per question) into long, tidy tables with melt: id columns stay, the other column names become values in one column, and their numbers go in another.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'A sheet has columns store, Jan, Feb, Mar. What does melt(id_vars="store") give?'
    choices: ['One row per store and month, with columns store, variable, value', 'One row per store', 'A pivot table']
    ans: 0
    why: 'Each month column becomes rows; its name goes into "variable" and its number into "value".'
  - q: 'Why melt before plotting or grouping by month?'
    choices: ['Because month is then a column you can group, filter and sort by', 'It is faster', 'Charts need wide data']
    ans: 0
    why: 'In the wide table, month is spread across column names, which groupby cannot see.'
  - q: 'Which options name the new columns?'
    choices: ["var_name='month', value_name='sales'", "columns=['month', 'sales']", "rename=True"]
    ans: 0
    why: 'var_name names the column of former headers; value_name the numbers.'
---

**Module 6 · about 15 minutes · uses Lesson 6.1.** You'll be able to turn spreadsheet-style wide tables into long ones you can analyse.

## 1. The wide table problem

Budgets and exports often arrive **wide**: one column per month. Easy to read, hard to analyse: "total for Q1", "months above target", "trend per store" all need month as a column.

<!--anim:melt-anim (table animation, added once the shared tableviz engine is on main)-->

```python
import pandas as pd

wide = pd.DataFrame({'store': ['S01', 'S02', 'S03'],
                     'Jan': [520, 380, 210], 'Feb': [490, 410, 230], 'Mar': [560, 395, 250]})
long = wide.melt(id_vars='store', var_name='month', value_name='sales')
display(wide)
long
```

3 stores × 3 months = 9 rows. `id_vars` are kept on every row; every other column is "melted".

## 2. Then analyse

```python
import pandas as pd

wide = pd.DataFrame({'store': ['S01', 'S02', 'S03'],
                     'Jan': [520, 380, 210], 'Feb': [490, 410, 230], 'Mar': [560, 395, 250]})
long = wide.melt(id_vars='store', var_name='month', value_name='sales')
long['month'] = pd.Categorical(long['month'], ['Jan', 'Feb', 'Mar'], ordered=True)
display(long.groupby('month', observed=True)['sales'].sum())
long[long['sales'] >= 400].sort_values(['store', 'month'])
```

## 3. Headers that hold two things

When column names combine two facts (`sales_2025`, `sales_2026`, `units_2025`...), melt, then split the name:

```python
import pandas as pd

wide = pd.DataFrame({'store': ['S01', 'S02'], 'sales_2025': [9100, 7200], 'sales_2026': [8800, 7300],
                     'units_2025': [610, 480], 'units_2026': [590, 505]})
long = wide.melt(id_vars='store', var_name='key', value_name='value')
long[['measure', 'year']] = long['key'].str.split('_', expand=True)
long.pivot_table(index=['store', 'year'], columns='measure', values='value').reset_index()
```

That's a melt followed by a pivot: the measures end up as columns and the years as rows, the most useful shape here.

## 4. Your turn

```python exercise
import pandas as pd

survey = pd.DataFrame({'respondent': [1, 2, 3], 'q1': [4, 5, 3], 'q2': [2, 4, 4], 'q3': [5, 5, 4]})
# Melt to columns respondent, question, score. Then show the average score per question.
```
```python solution
import pandas as pd

survey = pd.DataFrame({'respondent': [1, 2, 3], 'q1': [4, 5, 3], 'q2': [2, 4, 4], 'q3': [5, 5, 4]})
long = survey.melt(id_vars='respondent', var_name='question', value_name='score')
long.groupby('question')['score'].mean()
```
```python check
assert 'long' in dir() and list(long.columns) == ['respondent', 'question', 'score'], 'Make long with columns respondent, question, score.'
assert [round(x, 3) for x in _.tolist()] == [4.0, 3.333, 4.667], 'Show the mean score per question.'
```
```hint
survey.melt(id_vars='respondent', var_name='question', value_name='score'), then groupby('question')['score'].mean().
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** melt is the reverse of pivot. A wide table with `k` measured columns and `n` rows becomes a long table with `n × k` rows: each (row, column) cell becomes a row of its own, keeping the id columns.

**Excel:** Power Query calls this "Unpivot columns". **SQL:** `UNPIVOT`, or a `UNION ALL` of one select per column.
</details>

## 5. Practice

1. A table has `product` and one column per store. Melt it to `product, store, units`.
2. Why does `groupby('month')` fail on the wide table?
3. Which method undoes a melt?

<details>
<summary>Answers</summary>

1. `df.melt(id_vars='product', var_name='store', value_name='units')`.
2. There is no month column; months are column names.
3. `pivot` or `pivot_table` (next lesson), with the melted names as columns.
</details>

**New words:** *wide*, *long*, *melt*, *id_vars*, *var_name*, *value_name*, *unpivot*.
