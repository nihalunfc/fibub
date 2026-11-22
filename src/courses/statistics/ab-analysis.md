---
title: Analysing an A/B test
summary: 'Read a finished test the right way round: check the split first, then the difference and its confidence interval, then the p-value, then the guardrails, and turn it into a decision a manager can act on.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'A: 410 of 10,000 converted. B: 482 of 10,050. What is the absolute lift?'
    choices: ['+0.70 percentage points', '+17 percentage points', '+72 conversions']
    ans: 0
    why: '4.80 % − 4.10 % = 0.70 points. The relative lift is 0.70 ÷ 4.10 ≈ +17 %. Always say which one you mean.'
  - q: 'The 95 % CI for the lift is +0.13 to +1.27 points. What does it tell a manager?'
    choices: ['B is certainly 0.70 points better', 'B is better, by somewhere between a small and a large amount; zero is not a plausible value', 'Nothing, only the p-value matters']
    ans: 1
    why: 'The interval gives both the direction (above zero) and the range of plausible sizes, which is what a business case needs.'
  - q: 'What should you check before reading the lift?'
    choices: ['That B won', 'That the split between groups matches the plan (no sample ratio mismatch)', 'That the p-value is small']
    ans: 1
    why: 'If visitors went missing from one group, every number after that is biased. Check the split first (Lesson 7.6).'
sources:
  - 'Kohavi, R., Tang, D. and Xu, Y. (2020), Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing, Cambridge University Press, Chapters 3 and 17'
  - 'OpenIntro Statistics, 4th edition (Diez, Cetinkaya-Rundel, Barr), Section 6.2 Difference of two proportions https://www.openintro.org/book/os/'
---

**Module 7 · about 25 minutes · uses Lessons 5.2 and 6.3.** You'll be able to read a finished conversion test in the right order, report it with an interval, and write the decision.

<div class="bigidea">Read a finished test in order: check the split, then the size of the difference and its interval, then the p-value, then the guardrails, then decide by the rule you wrote.</div>

**In everyday terms:** a pilot's checklist. Instruments first (is the data sound?), then position (how big is the effect?), then the go/no-go call. Skipping straight to "did we win?" is how accidents happen.

## 1. Read it in this order

1. **The split.** Did each group get the share of users you planned? If not, stop (next lesson).
2. **The rates and the difference**, with confidence intervals.
3. **The p-value**, as a check on the interval, not as the headline.
4. **Guardrails** (Lesson 7.2): did anything that must not get worse, get worse?
5. **The decision**, using the rule you wrote before the test (Lesson 7.1).

<!--fig:ab-readout-->

Change the numbers to your own test. Try making B's visitors 10,300 while A stays at 10,000: the readout refuses to give a verdict, because a split that far from 50/50 means the groups are no longer comparable.

## 2. Absolute and relative lift

- **Absolute lift**: `$p_B - p_A$`, in percentage points. 4.10 % → 4.80 % is **+0.70 points**.
- **Relative lift**: `$(p_B - p_A)/p_A$`. Here +17 %.

Relative lifts sound bigger and are what most dashboards show. Absolute lifts turn straight into money: 0.70 points × 50,000 monthly visitors ≈ 350 extra orders a month. Report both, and label them.

## 3. The test and the interval

For conversion rates the standard tool is the **two-proportion z-test** (Lesson 6.3 did the same for means). It answers: if A and B truly converted at the same rate, how often would a gap this big appear by chance?

The **confidence interval for the difference** answers the more useful question: how big could the true lift plausibly be? An interval of +0.13 to +1.27 points says B is better, but the true gain might be small. A manager deciding whether a costly redesign pays off needs that range, not just "significant".

**Small samples or rare events** (fewer than about 10 conversions in a group): use Fisher's exact test ([[crosstab-chi-square]] gives both).

**Means** (revenue per user): Welch's t-test or a bootstrap by user (Lesson 4.5), not the proportion test.

<div class="meaning">

<dl>
<dt>Split check</dt><dd>Are the group sizes what the design promised? (Lesson 7.6)</dd>
<dt>Absolute lift</dt><dd>p_B − p_A, in percentage points.</dd>
<dt>Relative lift</dt><dd>(p_B − p_A) ÷ p_A, in %.</dd>
<dt>CI for the lift</dt><dd>Lift ± 1.96 × √(p_A(1 − p_A)/n_A + p_B(1 − p_B)/n_B).</dd>
<dt>Physical meaning</dt><dd>The interval is the honest answer: "the new form adds between 0.1 and 1.3 orders per 100 visitors". The p-value only says whether that range includes zero.</dd>
</dl>

</div>

<div class="myth">

**"Relative lift sounds bigger, so lead with it."** +17 % relative and +0.7 points are the same result. Give both, and the absolute numbers behind them, so readers can judge the real-world size.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The data.</b> A: 410 orders from 10,000 visitors (4.10 %). B: 482 from 10,050 (4.80 %).</div>
<div class="step"><b>Split.</b> 10,000 against 10,050 is fine for a 50/50 design (p ≈ 0.72).</div>
<div class="step"><b>Lift.</b> +0.70 points, or +17 % relative.</div>
<div class="step"><b>Interval.</b> SE ≈ 0.29 points; 95 % CI about +0.13 to +1.27 points: above zero.</div>
<div class="step"><b>Decide.</b> Guardrails fine, so by the written rule: ship. Expected value: about 7 extra orders per 1,000 visitors.</div>
</div>

<div class="problem" data-problem="ab-ci-lift"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** under "no difference" both groups share one rate, so the test pools them; the interval does not assume that, so it uses each group's own rate.

**Test statistic** (pooled rate `$\hat p = (x_A + x_B)/(n_A + n_B)$`):

```math
z = \frac{\hat p_B - \hat p_A}{\sqrt{\hat p(1-\hat p)\left(\frac{1}{n_A} + \frac{1}{n_B}\right)}}
```

**95 % interval for the difference** (unpooled):

```math
(\hat p_B - \hat p_A) \pm 1.96\sqrt{\frac{\hat p_A(1-\hat p_A)}{n_A} + \frac{\hat p_B(1-\hat p_B)}{n_B}}
```

**Check with the starting numbers:** pooled rate 4.45 %, z = 2.39, two-sided p = 0.017; interval +0.13 to +1.27 points (tests/stats.mjs checks the same formulas against scipy).
</details>

## 4. Worked example

*Made-up test:* a shorter checkout form, two full weeks, decision rule "ship if the 95 % CI for the lift is above 0 and no guardrail is worse at p < 0.05".

| | A (old form) | B (short form) |
|---|---|---|
| Visitors | 10,000 | 10,050 |
| Orders | 410 | 482 |
| Rate (95 % Wilson CI) | 4.10 % (3.73 to 4.51) | 4.80 % (4.40 to 5.23) |

- **Split:** 10,000 vs 10,050, p = 0.72 for 50/50. Fine.
- **Lift:** +0.70 points (95 % CI +0.13 to +1.27), or +17 % relative (roughly +3 % to +31 %).
- **Test:** z = 2.39, p = 0.017.
- **Guardrails:** refund requests 1.1 % vs 1.2 % (p = 0.5); page errors unchanged.
- **Decision:** ship the short form. Expect somewhere between a small and a large gain; the best single guess is +0.7 points.

Notice the two groups' own intervals overlap (4.51 vs 4.40) even though the difference is significant. Overlapping group intervals do **not** mean "no difference"; always test the difference itself.

## 5. Practice

1. A: 200 of 5,000. B: 230 of 5,000. Absolute and relative lift?
2. The CI for a lift is −0.2 to +1.4 points. Ship?
3. Why report the interval rather than just "p = 0.03"?

<details>
<summary>Answers</summary>

1. 4.0 % → 4.6 %: +0.6 points absolute, +15 % relative.
2. Not by a rule that needs the CI above 0: a small loss is still plausible. Report it as inconclusive, and consider whether a bigger test or a bolder change is worth it.
3. The interval shows the size and the uncertainty, which drive the business decision; the p-value only says whether zero is ruled out.
</details>

**Try it on your own data:** the [[hypothesis-tests]] tool runs the two-proportion test and t-tests on your numbers; [[crosstab-chi-square]] handles 2 × 2 tables with Fisher's exact test; [[bayesian-ab-test]] gives the Bayesian reading (Lesson 7.7).

**New words:** *absolute lift*, *relative lift*, *two-proportion z-test*, *pooled rate*, *readout*.

<div class="keypoints">

- Check the split and data quality before any result.
- Report absolute and relative lift with a 95 % CI.
- Then the p-value, then guardrails.
- Decide by the rule written before the test, and translate the lift into money or orders.

</div>
