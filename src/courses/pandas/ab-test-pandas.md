---
title: 'Analysing an A/B test in pandas'
summary: 'Read a real-shaped A/B test file, check the split, compute conversion and revenue per visitor for each group, the lift with a 95 % confidence interval and a p-value using only pandas and NumPy, and look at segments without fooling yourself.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'What should you check before looking at any result?'
    choices: ['That the groups are the size the design promised (sample ratio)', 'Which group won', 'The p-value']
    ans: 0
    why: 'A broken split (Statistics Lesson 7.6) makes every later number untrustworthy.'
  - q: "Why is groupby('group')['converted'].mean() the conversion rate?"
    choices: ['converted is 1 or 0, so the mean is the share of 1s', 'mean always gives rates', 'It is not']
    ans: 0
    why: 'The mean of a 0/1 column is a proportion.'
  - q: 'You split by 6 segments and one shows p = 0.03. What do you conclude?'
    choices: ['Treat it as an idea to test, because with 6 looks one small p-value is likely by chance', 'Ship it for that segment', 'The test failed']
    ans: 0
    why: 'Multiple comparisons (Statistics Lesson 6.8).'
sources:
  - 'Kohavi, R., Tang, D. and Xu, Y. (2020), Trustworthy Online Controlled Experiments, Cambridge University Press'
  - 'McKinney, W. (2022), Python for Data Analysis, 3rd edition, O''Reilly (open access) https://wesmckinney.com/book/'
---

**Module 8 · about 25 minutes · uses Statistics Module 7.** You'll be able to go from a raw experiment file to a readout, in code.

<div class="bigidea">An A/B readout in pandas is four steps: check the split, compute each group's rate, measure the difference with its uncertainty, then check guardrails before you call it.</div>

**In everyday terms:** a fair taste test: first check both groups really had the same number of tasters, then count who preferred each cup, then ask whether the gap could be chance.

This lesson uses the experiment file from the Statistics course: 24,000 visitors split between the old checkout (A) and a new one (B). The ideas behind each number are in [Statistics Lesson 7.5](/learn/courses/statistics/ab-analysis/); here we do it in pandas.

## 1. Look and check the split

```python data=statistics/checkout-test.csv
import pandas as pd
from math import erf, sqrt

ab = pd.read_csv('checkout-test.csv')
display(ab.head())
n = ab['group'].value_counts()
z = (n['A'] - n.sum() / 2) / sqrt(n.sum() / 4)          # planned 50/50
p_srm = 1 - erf(abs(z) / sqrt(2))                         # two-sided
print(n.to_dict(), 'SRM p-value:', round(p_srm, 3))
```

A p-value well above 0.01 means the split looks healthy. Each row is one visitor: `converted` is 1 if they bought.

## 2. The headline numbers

```python data=statistics/checkout-test.csv
import pandas as pd
import numpy as np
from math import erf, sqrt

ab = pd.read_csv('checkout-test.csv')
g = ab.groupby('group').agg(visitors=('user_id', 'size'), buyers=('converted', 'sum'),
                            conv=('converted', 'mean'), rev_per_visitor=('revenue', 'mean'))
a, b = g.loc['A'], g.loc['B']
lift = b['conv'] - a['conv']
se = np.sqrt(a['conv'] * (1 - a['conv']) / a['visitors'] + b['conv'] * (1 - b['conv']) / b['visitors'])
p_pool = g['buyers'].sum() / g['visitors'].sum()
z = lift / np.sqrt(p_pool * (1 - p_pool) * (1 / a['visitors'] + 1 / b['visitors']))
p_value = 1 - erf(abs(z) / sqrt(2))
display(g.round(4))
print(f'lift {lift * 100:+.2f} points, 95% CI {(lift - 1.96 * se) * 100:+.2f} to {(lift + 1.96 * se) * 100:+.2f}, p = {p_value:.3f}')
```

These match the Statistics capstone: about +0.75 points, CI from about +0.23 to +1.28, p ≈ 0.005. Everything came from one `groupby`; the rest is arithmetic on two rows.

Set equal rates and press Run 300 tests, then give B a real lift and run again.

<figure class="fig" data-fig="@data-ab-sim"><figcaption>Notice the share of significant results: about 5% when nothing is going on, and the power when a real lift exists.</figcaption></figure>


## 3. Guardrails and segments

```python data=statistics/checkout-test.csv
import pandas as pd

ab = pd.read_csv('checkout-test.csv')
display(ab.groupby('group')[['page_load_ms', 'refunded']].mean().round(3))     # guardrails
seg = ab.pivot_table(index='device', columns='group', values='converted', aggfunc='mean')
seg['lift_pts'] = ((seg['B'] - seg['A']) * 100).round(2)
seg.round(4)
```

- **Guardrails**: B is about 46 ms slower to load. Is that acceptable? A decision for the team, written in the readout.
- **Segments**: B wins on both phones and computers, which makes the overall result more believable. If one segment flipped, treat it as a question for a new test, not a finding.

<div class="meaning">

<dl>
<dt>Sample ratio check</dt><dd>Users per group should match the planned split (Statistics Lesson 7.5).</dd>
<dt>groupby('group').agg(users=..., conv=...)</dt><dd>One row per group.</dd>
<dt>rate = conv ÷ users</dt><dd>Conversion per group.</dd>
<dt>Lift</dt><dd>Difference in rates, in percentage points, with a confidence interval.</dd>
<dt>Physical meaning</dt><dd>The lift is a difference between two proportions, each with sampling noise. Its standard error shrinks with more users, so the same 0.5-point lift can be convincing with 50,000 users and pure noise with 2,000.</dd>
</dl>

</div>

<div class="myth">

**"B won, it has the higher rate."** Every test has a winner by chance. Report the lift with its interval and p-value, and check the split and guardrails first.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Raw file: one row per user.</b> <table class="lk-tbl"><tr><th>user</th><th>group</th><th>converted</th></tr><tr><td>1</td><td>A</td><td>0</td></tr><tr><td>2</td><td>B</td><td>1</td></tr><tr><td>3</td><td>A</td><td>1</td></tr><tr><td>...</td><td>...</td><td>...</td></tr></table></div>
<div class="step"><b>Split check.</b> <code>value_counts()</code> → A 5,012, B 4,988: close to 50/50.</div>
<div class="step"><b>Rates.</b> <code>groupby('group')['converted'].agg(['size', 'sum', 'mean'])</code><table class="lk-tbl"><tr><th>group</th><th>users</th><th>conv</th><th>rate</th></tr><tr><td>A</td><td>5012</td><td>501</td><td>10.0 %</td></tr><tr><td>B</td><td>4988</td><td>549</td><td><mark>11.0 %</mark></td></tr></table></div>
<div class="step"><b>Lift.</b> 11.0 − 10.0 = +1.0 point; SE ≈ 0.61 points; 95 % CI about −0.2 to +2.2.</div>
<div class="step"><b>Readout.</b> Promising but not conclusive at this size.</div>
</div>

<div class="problem" data-problem="pd-ab-lift"></div>

## 4. Your turn

```python exercise data=statistics/checkout-test.csv
import pandas as pd

ab = pd.read_csv('checkout-test.csv')
# Revenue per visitor by group: show a Series with the mean revenue for A and B, rounded to 3 decimals.
```
```python solution
import pandas as pd

ab = pd.read_csv('checkout-test.csv')
ab.groupby('group')['revenue'].mean().round(3)
```
```python check
exp = ab.groupby('group')['revenue'].mean().round(3)
assert isinstance(_, pd.Series) and list(_.index) == ['A', 'B'], 'Group by group, so the index is A and B.'
assert (abs(_ - exp) < 0.001).all(), 'Take the mean of revenue over ALL visitors (buyers and non-buyers).'
```
```hint
ab.groupby('group')['revenue'].mean() averages over every visitor, including the zeros.
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** an A/B readout is a comparison of two means with an honest error bar. For conversion:

```math
\hat\Delta = \hat p_B - \hat p_A, \qquad SE = \sqrt{\frac{\hat p_A(1-\hat p_A)}{n_A} + \frac{\hat p_B(1-\hat p_B)}{n_B}}, \qquad 95\%\ \text{CI} = \hat\Delta \pm 1.96\, SE
```

The p-value uses the **pooled** rate, because under "no difference" both groups share one rate. `erf` turns a z-score into a normal tail area, so no extra library is needed.

**Revenue per visitor** is very skewed (most visitors spend 0). The mean is still the right number to compare, but use a bootstrap or Welch's t-test for its interval (Statistics Lessons 4.5 and 6.3).
</details>

## 5. Practice

1. Conversion by day of the test: is B ahead every day?
2. Why compare revenue per visitor, not revenue per buyer?
3. Add a 95 % CI for the conversion of group A alone.

<details>
<summary>Answers</summary>

1. `ab.pivot_table(index='day', columns='group', values='converted', aggfunc='mean')`; expect it to wobble day to day.
2. Per buyer ignores how many people bought; B could make fewer, bigger orders and look better while earning less.
3. `p ± 1.96 * sqrt(p * (1 - p) / n)` with A's `p` and `n`.
</details>

**Try it on your own data:** [[bayesian-ab-test]] and [[sample-size]] check a result or plan the next test.

**New words:** *readout*, *sample ratio*, *lift*, *pooled rate*, *guardrail metric*, *segment*.

<div class="keypoints">

- Check the sample ratio before any result.
- One groupby gives users, conversions and rate per group.
- Report the lift in points with a confidence interval.
- Check guardrail metrics and pre-planned segments only.

</div>
