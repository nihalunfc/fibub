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
sources:
  - 'pandas documentation, User Guide: Reshaping and pivot tables https://pandas.pydata.org/docs/user_guide/reshaping.html'
  - 'Wickham, H. (2014), Tidy Data, Journal of Statistical Software 59(10) https://doi.org/10.18637/jss.v059.i10'
---

**Module 6 · about 15 minutes · uses Lesson 6.1.** You'll be able to turn spreadsheet-style wide tables into long ones you can analyse.

<div class="bigidea">melt turns a wide table (one column per month) into a long one (a month column and a value column), the shape pandas groups, filters and plots easily.</div>

**In everyday terms:** unpicking a calendar grid into a diary: instead of one box per day across the page, you write one line per day: "Monday, 3 visits".

## 1. The wide table problem

Budgets and exports often arrive **wide**: one column per month. Easy to read, hard to analyse: "total for Q1", "months above target", "trend per store" all need month as a column.


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

<div class="meaning">

<dl>
<dt>id_vars=</dt><dd>Columns that stay as they are (they identify the row).</dd>
<dt>value_vars=</dt><dd>Columns to unpivot (default: all the others).</dd>
<dt>var_name=, value_name=</dt><dd>Names for the new "which column" and "the value" columns.</dd>
<dt>Rows after melt</dt><dd>rows × number of melted columns.</dd>
<dt>Physical meaning</dt><dd>No number changes: each cell of the wide table becomes one row of the long table, carrying its row label and its column name with it. A 3 × 4 grid of values becomes 12 rows.</dd>
</dl>

</div>

<div class="myth">

**"Wide is tidier because it is shorter."** Short for eyes, awkward for code: to average across months in wide form you must name every month column. Long form needs one groupby.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Wide.</b> <table class="lk-tbl"><tr><th>store</th><th>Jan</th><th>Feb</th><th>Mar</th></tr><tr><td>S01</td><td>3</td><td>4</td><td>6</td></tr><tr><td>S02</td><td>5</td><td>2</td><td>1</td></tr></table></div>
<div class="step"><b>Choose.</b> <code>df.melt(id_vars='store', var_name='month', value_name='qty')</code></div>
<div class="step"><b>Each cell becomes a row.</b> <table class="lk-tbl"><tr><th>store</th><th>month</th><th>qty</th></tr><tr><td>S01</td><td><mark>Jan</mark></td><td>3</td></tr><tr><td>S02</td><td><mark>Jan</mark></td><td>5</td></tr><tr><td>S01</td><td>Feb</td><td>4</td></tr><tr><td>S02</td><td>Feb</td><td>2</td></tr><tr><td>S01</td><td>Mar</td><td>6</td></tr><tr><td>S02</td><td>Mar</td><td>1</td></tr></table></div>
<div class="step"><b>Count.</b> 2 rows × 3 months = 6 rows.</div>
<div class="step"><b>Now analyse.</b> <code>long.groupby('month')['qty'].mean()</code>: one line, any number of months.</div>
</div>

<div class="problem" data-problem="pd-melt-rows"></div>

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

<div class="keypoints">

- melt: id_vars stay, other columns become name/value pairs.
- Rows after melt = rows × melted columns.
- Name the new columns with var_name and value_name.
- Long form is the shape for groupby, filters and charts.

</div>
