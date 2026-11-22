---
title: 'Series: one column of data'
summary: 'A Series is one column with an index: make one, do maths on the whole column at once, use summary methods like sum, mean and value_counts, and see how missing values behave.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'What does s * 2 do to a Series s?'
    choices: ['Repeats the Series twice', 'Doubles every value', 'Raises an error']
    ans: 1
    why: 'Maths on a Series applies to every value at once (vectorised). A Python list would be repeated instead.'
  - q: 'What does s.mean() do with missing values (NaN)?'
    choices: ['Returns NaN', 'Skips them and averages the rest', 'Counts them as 0']
    ans: 1
    why: 'pandas summaries skip missing values by default. Counting them as zero would be a different (usually wrong) answer.'
  - q: 'What is the index of a Series?'
    choices: ['Its largest value', 'The labels for each value (0, 1, 2, ... unless you set others)', 'The column name']
    ans: 1
    why: 'Every value has a label. Operations between two Series line up on these labels.'
---

**Module 1 · about 15 minutes · uses Lesson 1.2.** You'll be able to create a Series, do column maths, and summarise it.

## 1. A labelled column

A **Series** is one column of values plus an **index** of labels. Each column of a DataFrame is a Series.

```python
import pandas as pd

sales = pd.Series([120, 95, 143, 88], index=['Mon', 'Tue', 'Wed', 'Thu'], name='sales')
sales
```

The left column is the index (labels), the right the values. Below, pandas notes the **dtype**: `int64` means whole numbers.

## 2. Whole-column maths

Operations apply to every value at once. No loops.

```python
import pandas as pd

sales = pd.Series([120, 95, 143, 88], index=['Mon', 'Tue', 'Wed', 'Thu'])
print(sales * 1.13)          # add 13 % tax to every day
print(sales > 100)           # True/False for every day
sales[sales > 100]           # keep only the days over 100
```

The last line is **filtering**: a True/False Series inside the brackets keeps the True rows. You'll use it constantly (Lesson 2.3).

## 3. Summaries

```python
import pandas as pd

sales = pd.Series([120, 95, 143, 88, None], index=['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
print('total', sales.sum(), '| mean', sales.mean(), '| max day', sales.idxmax())
print('values', sales.count(), 'of', len(sales), '| missing', sales.isna().sum())
sales.describe()
```

`None` became **NaN** ("not a number"), pandas' mark for missing, and the whole Series turned into decimals (`float64`), because NaN is a float. Summaries skip NaN: the mean is over 4 days, not 5.

**For text,** `value_counts()` counts each value:

```python
import pandas as pd

pay = pd.Series(['card', 'cash', 'card', 'app', 'card', 'cash'])
pay.value_counts()
```

## 4. Your turn

```python exercise
import pandas as pd

visits = pd.Series([340, 290, 410, 385, 520, 610, 450],
                   index=['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
# Make busy: only the days with more than 400 visits. Show it.
```
```python solution
import pandas as pd

visits = pd.Series([340, 290, 410, 385, 520, 610, 450],
                   index=['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
busy = visits[visits > 400]
busy
```
```python check
assert 'busy' in dir(), 'Make a variable called busy.'
assert list(busy.index) == ['Wed', 'Fri', 'Sat', 'Sun'], f'busy has {list(busy.index)}; keep the days over 400.'
```
```hint
visits > 400 gives True/False for each day; put it inside visits[ ... ] to keep the True days.
```

```python exercise
import pandas as pd

prices = pd.Series([18.99, 12.49, 2.29, 6.99, 7.49])
# Show the average price after a 20 % discount, rounded to 2 decimals.
```
```python solution
import pandas as pd

prices = pd.Series([18.99, 12.49, 2.29, 6.99, 7.49])
round((prices * 0.8).mean(), 2)
```
```python check
assert _ is not None and abs(float(_) - 7.72) < 0.006, f'Got {_}; take 80 % of each price, then the mean, then round.'
```
```hint
prices * 0.8 is every price after the discount; add .mean() and wrap it in round(..., 2).
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** a Series is a NumPy array of one type plus an index. Maths runs on the whole array in compiled code (**vectorised**), which is why `s * 2` on a million values takes milliseconds.

**Alignment:** when you combine two Series, pandas matches labels, not positions. Index labels missing on one side give NaN:

```python
import pandas as pd

this_week = pd.Series({'Mon': 120, 'Tue': 95, 'Wed': 143})
last_week = pd.Series({'Tue': 90, 'Wed': 150, 'Thu': 101})
this_week - last_week
```
</details>

## 5. Practice

1. What dtype is `pd.Series([1, 2, None])`, and why?
2. How do you count the missing values in `s`?
3. `s = pd.Series([5, 10, 15])`. What does `s[s >= 10].sum()` give?

<details>
<summary>Answers</summary>

1. `float64`: missing values are NaN, which is a float, so the whole column becomes floats.
2. `s.isna().sum()` (True counts as 1).
3. 25.
</details>

**New words:** *Series*, *index*, *dtype*, *vectorised*, *NaN*, *boolean mask*, *alignment*.
