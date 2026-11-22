---
title: 'Missing values: find, fill or drop'
summary: 'Find missing values with isna, decide what each gap means, then drop rows, fill with a fixed value, a group average or the previous value, and keep a record of what you changed.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'How do you count missing values in every column?'
    choices: ['df.isna().sum()', 'df.count()', 'df.missing()']
    ans: 0
    why: 'isna() marks each missing cell True; sum() counts the Trues per column.'
  - q: 'A missing discount most likely means "no discount". What should you do?'
    choices: ['Drop those rows', 'Fill with 0, and note that you did', 'Fill with the average discount']
    ans: 1
    why: 'Fill with the value the gap stands for. Averages would invent discounts; dropping would lose real sales.'
  - q: 'Why is filling missing incomes with the overall mean risky?'
    choices: ['It is slow', 'It shrinks the spread and can hide that the missing people differ from the rest', 'pandas cannot do it']
    ans: 1
    why: 'Filled values all sit at the centre, so variance falls and any pattern in who is missing is erased.'
sources:
  - 'pandas documentation, User Guide: Working with missing data https://pandas.pydata.org/docs/user_guide/missing_data.html'
  - 'Little, R. J. A. and Rubin, D. B. (2019), Statistical Analysis with Missing Data, 3rd edition, Wiley'
---

**Module 3 · about 20 minutes · uses Lesson 1.6.** You'll be able to find missing values, choose a sensible fix for each column, and apply it.

<div class="bigidea">A missing value is a question before it is a problem: find out why it is missing, then drop it, fill it, or keep it and say so.</div>

**In everyday terms:** a gap in a till receipt could be a smudge (unknown), an item the customer did not buy (zero) or a till fault (needs fixing). Treating all three the same gives wrong totals.

## 1. Find them

```python data=orders_messy.csv
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
print(messy.isna().sum())
print('rows with any gap:', messy.isna().any(axis=1).sum())
messy[messy['Qty'].isna()].head()
```

pandas marks missing values as `NaN` (numbers), `NaT` (dates) or `<NA>`. Empty cells in a CSV become missing automatically; other markers (`-`, `n/a`, `?`) need `na_values` when reading (Lesson 1.5).

## 2. Decide what each gap means

Before touching anything, ask **why** it's missing:

| Column | Likely meaning | Sensible action |
|---|---|---|
| Discount | no discount entered | fill with 0 |
| Qty | not recorded | drop the line (can't compute revenue), or ask the source |
| Customer ID | guest checkout | fill with `'GUEST'`, keep the sale |

Try each way of handling the three missing values and watch the mean line.

<figure class="fig" data-fig="@data-missing-fill"><figcaption>Notice that every fill changes the picture a little, and zero is the worst because it invents data.</figcaption></figure>


## 3. Drop or fill

```python data=orders_messy.csv
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
clean = messy.copy()
clean['Discount'] = clean['Discount'].fillna('0%')
clean['Customer ID'] = clean['Customer ID'].fillna('GUEST')
before = len(clean)
clean = clean.dropna(subset=['Qty'])
print('dropped', before - len(clean), 'lines with no quantity')
clean.isna().sum()
```

`dropna(subset=[...])` drops rows missing those columns only; plain `dropna()` drops a row if **anything** is missing, which often throws away far too much.

## 4. Smarter fills

```python
import pandas as pd

df = pd.DataFrame({
    'store': ['A', 'A', 'A', 'B', 'B', 'B'],
    'day': [1, 2, 3, 1, 2, 3],
    'price': [10.0, None, 12.0, 20.0, 21.0, None],
})
df['ffill'] = df.groupby('store')['price'].ffill()                                     # carry the last known value forward
df['store_mean'] = df['price'].fillna(df.groupby('store')['price'].transform('mean'))   # each store's own average
df['interp'] = df.groupby('store')['price'].transform(lambda s: s.interpolate())       # straight line between neighbours
df
```

- **Forward fill** suits values that persist until changed (a price, a status).
- **Group mean or median** beats the overall mean when groups differ.
- **Interpolation** suits smooth measurements over time.
- Add a flag column (`df['price_was_missing'] = df['price'].isna()`) before filling, so the change is traceable.

<div class="meaning">

<dl>
<dt>NaN / None / NaT</dt><dd>pandas markers for "no value" in numbers, objects and dates.</dd>
<dt>isna().sum()</dt><dd>Missing count per column.</dd>
<dt>dropna(subset=[...])</dt><dd>Remove rows missing in those columns.</dd>
<dt>fillna(value)</dt><dd>Replace gaps with a value, or with group values via transform.</dd>
<dt>Physical meaning</dt><dd>A gap is information: "not recorded" is different from "zero". Sums skip NaN, so an unfilled gap quietly lowers totals; a gap filled with 0 states that nothing happened. Pick the one that is true.</dd>
</dl>

</div>

<div class="myth">

**"Fill every gap with 0 so the maths works."** If qty was not recorded, 0 claims the customer bought nothing and drags averages down. Fill with 0 only when "nothing" is the true meaning; otherwise drop, fill from a sensible group value, or keep and flag.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The data.</b> <table class="lk-tbl"><tr><th>order</th><th>store</th><th>qty</th></tr><tr><td>1</td><td>S01</td><td>2</td></tr><tr><td>2</td><td>S01</td><td><mark>NaN</mark></td></tr><tr><td>3</td><td>S02</td><td>4</td></tr><tr><td>4</td><td>S02</td><td><mark>NaN</mark></td></tr><tr><td>5</td><td>S02</td><td>6</td></tr></table></div>
<div class="step"><b>Count.</b> <code>df['qty'].isna().sum()</code> → 2.</div>
<div class="step"><b>Why?</b> The till export dropped qty on two lines; the orders did happen.</div>
<div class="step"><b>Fill from the store's median.</b> <code>df['qty'].fillna(df.groupby('store')['qty'].transform('median'))</code></div>
<div class="step"><b>Result.</b> <table class="lk-tbl"><tr><th>order</th><th>store</th><th>qty</th></tr><tr><td>1</td><td>S01</td><td>2</td></tr><tr><td>2</td><td>S01</td><td><mark>2</mark></td></tr><tr><td>3</td><td>S02</td><td>4</td></tr><tr><td>4</td><td>S02</td><td><mark>5</mark></td></tr><tr><td>5</td><td>S02</td><td>6</td></tr></table> Flag the filled rows in a column so readers know.</div>
</div>

<div class="problem" data-problem="pd-missing-mean"></div>

## 5. Your turn

```python exercise data=orders_messy.csv
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
# Drop the rows where Qty is missing (only those). Keep the result in messy and show messy['Qty'].isna().sum().
```
```python solution
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
messy = messy.dropna(subset=['Qty'])
messy['Qty'].isna().sum()
```
```python check
assert messy['Qty'].isna().sum() == 0, 'Qty still has missing values; use dropna(subset=["Qty"]) and assign it back.'
assert len(messy) == 390, f'messy has {len(messy)} rows; only drop rows missing Qty (expected 390).'
```
```hint
messy = messy.dropna(subset=['Qty']). Plain dropna() would also drop rows missing other columns.
```

```python exercise
import pandas as pd

df = pd.DataFrame({'region': ['N', 'N', 'S', 'S', 'S'], 'sales': [100.0, None, 50.0, None, 70.0]})
# Fill each missing sales value with the median of its own region. Show df.
```
```python solution
import pandas as pd

df = pd.DataFrame({'region': ['N', 'N', 'S', 'S', 'S'], 'sales': [100.0, None, 50.0, None, 70.0]})
df['sales'] = df['sales'].fillna(df.groupby('region')['sales'].transform('median'))
df
```
```python check
assert df['sales'].tolist() == [100.0, 100.0, 50.0, 60.0, 70.0], f"Got {df['sales'].tolist()}; N's median is 100 and S's is 60."
```
```hint
df.groupby('region')['sales'].transform('median') gives each row its region's median; pass it to fillna.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** missing data is only harmless when it's **missing at random**. If gaps cluster in one group (one store's till didn't record quantities, unhappy customers skip surveys), any fill or drop can bias the result. Always look at *who* is missing: `df[df['x'].isna()]['store'].value_counts()`.

**Effect of mean filling:** with `k` of `n` values filled at the mean, the sample variance shrinks by roughly the factor `$(n-k)/n$`, so standard errors and tests become too optimistic.
</details>

## 6. Practice

1. Count missing values in one column, `df['email']`.
2. Which is safer for a missing price: overall mean or that product's last known price?
3. Write a line that keeps only rows with no missing values in `date` and `amount`.

<details>
<summary>Answers</summary>

1. `df['email'].isna().sum()`.
2. The product's last known price (a group-wise forward fill): prices persist and differ by product.
3. `df.dropna(subset=['date', 'amount'])`.
</details>

**Try it on your own data:** [[csv-profiler]] counts missing values per column in any CSV.

**New words:** *NaN*, *isna*, *dropna*, *fillna*, *forward fill*, *interpolate*, *missing at random*.

<div class="keypoints">

- Find gaps with isna().sum() before analysing.
- Decide what each gap means: unknown, zero, or an error.
- Drop, fill with a fixed value, fill from a group (transform), or keep and flag.
- Sums and means skip NaN, so gaps change results silently.

</div>
