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
sources:
  - 'pandas documentation, User Guide: Intro to data structures https://pandas.pydata.org/docs/user_guide/dsintro.html'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 1 · about 15 minutes · uses Lesson 1.2.** You'll be able to create a Series, do column maths, and summarise it.

<div class="bigidea">A Series is one column of values with a label on every row, and maths on it happens to the whole column at once.</div>

**In everyday terms:** a column in a spreadsheet where the row numbers can be names (store IDs, dates). Typing "× 2" once doubles every cell, with no formula to drag down.

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

Drag the row count up, then tap columns to switch them to a smaller dtype.

<figure class="fig" data-fig="@data-dtype-memory"><figcaption>Notice that number columns shrink a little but text columns shrink a lot when they become category or datetime.</figcaption></figure>


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

<div class="meaning">

<dl>
<dt>values</dt><dd>The data, all of one type.</dd>
<dt>index</dt><dd>The labels of the rows (0, 1, 2... by default).</dd>
<dt>s * 2, s + t</dt><dd>Whole-column maths; two Series line up by index label, not by position.</dd>
<dt>Physical meaning</dt><dd>The index is how pandas knows which value belongs to which thing. Adding two Series matches labels like matching name tags, so a value never lands on the wrong store even if the order differs.</dd>
</dl>

</div>

<div class="myth">

**"Adding two columns adds them row by row in order."** pandas adds them by index label. If one Series has S01, S02 and the other S02, S03, you get NaN for S01 and S03. Check the labels when results look half empty.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>A Series.</b> <table class="lk-tbl"><tr><th>index</th><th>value</th></tr><tr><td>S01</td><td>120</td></tr><tr><td>S02</td><td>95</td></tr><tr><td>WEB</td><td>140</td></tr></table></div>
<div class="step"><b>Whole-column maths.</b> <code>s * 1.1</code> multiplies every value: 132, 104.5, 154.</div>
<div class="step"><b>Summary.</b> <code>s.sum()</code> → 355; <code>s.mean()</code> → 118.33.</div>
<div class="step"><b>Line up by label.</b> Add a Series with S02 and WEB only: S01 becomes NaN because it has no partner.<table class="lk-tbl"><tr><th>index</th><th>s + t</th></tr><tr><td>S01</td><td><mark>NaN</mark></td></tr><tr><td>S02</td><td>100</td></tr><tr><td>WEB</td><td>150</td></tr></table></div>
</div>

<div class="problem" data-problem="pd-series-mean"></div>

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

<div class="keypoints">

- A Series = values + index labels.
- Arithmetic applies to every value at once.
- Two Series combine by matching labels, not positions.
- sum, mean, min, max, count and describe summarise a Series.

</div>
