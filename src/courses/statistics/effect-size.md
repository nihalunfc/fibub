---
title: 'Effect size: significant is not the same as important'
summary: 'A p-value says whether an effect is distinguishable from noise; an effect size says how big it is. Raw differences, relative lift, Cohen''s d, and the practical question every readout must answer: is it big enough to matter?'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'With 2 million users per group, a test finds a 0.02-point conversion lift with p < 0.001. What is the right reading?'
    choices: ['A big win', 'A real but tiny effect; whether it matters depends on its value against the cost', 'A false positive']
    ans: 1
    why: 'Huge samples detect tiny effects. The significance is real; the business value is a separate question.'
  - q: 'Two groups differ by $4 and the pooled SD is $20. What is Cohen''s d?'
    choices: ['0.2', '4', '5']
    ans: 0
    why: 'd = difference ÷ SD = 4 ÷ 20 = 0.2, conventionally a "small" effect.'
  - q: 'Which is the most useful single line in an A/B readout?'
    choices: ['p = 0.03', 'Lift +1.2 points (95 % CI +0.3 to +2.1), worth about $40k a year at the low end', 'Significant']
    ans: 1
    why: 'It gives the size, the uncertainty and the business meaning. The p-value adds little beyond that.'
sources:
  - 'Sullivan, G. M. and Feinn, R. (2012), Using Effect Size - or Why the P Value Is Not Enough, Journal of Graduate Medical Education 4(3), 279-282 https://doi.org/10.4300/JGME-D-12-00156.1'
  - 'Cohen, J. (1988), Statistical Power Analysis for the Behavioral Sciences, 2nd edition, Routledge'
---

**Module 6 · about 20 minutes · school maths.** You'll be able to report effect sizes (absolute, relative and standardised), tell statistical from practical significance, and write readouts that lead with size.

<div class="bigidea">A p-value says whether an effect stands out from noise; the effect size says how big it is, and only the size tells you whether it matters.</div>

**In everyday terms:** a scale accurate to a gram can prove you gained 3 grams this week. It is certainly real and certainly unimportant. With enough data, every tiny difference becomes "significant".

## 1. Two separate questions

1. **Is there an effect?** (Could the result be noise?) → p-value, confidence interval.
2. **How big is it, and does it matter?** → effect size, its interval, and its value to the business.

With enough data, any non-zero effect becomes "significant". With too little, important effects don't. So significance alone can't tell you what to do.

<!--fig:effect-size-->

Fix a 50-cent difference and slide the sample size. The p-value falls through 0.05 and keeps falling; the effect size stays at 0.02 SD the whole time.

## 2. Ways to state size

- **Absolute difference** in natural units: +$1.80 per order, +0.6 conversion points, −2.3 minutes. Best for business decisions.
- **Relative lift:** (B − A) ÷ A. +0.6 points on a 4 % base is +15 %. Popular, but say which: "+0.6 points (+15 %)". Relative numbers on small bases sound dramatic.
- **Standardised (Cohen's d):** difference ÷ pooled SD. Unit-free, useful for comparing across metrics and for power planning. Conventions: 0.2 small, 0.5 medium, 0.8 large, though in product analytics, d = 0.05 can be worth millions.
- **For categories:** risk ratio, odds ratio or Cramér's V (Lesson 6.5). **For relationships:** r or R² (Module 8).
- **Number needed to treat:** 1 ÷ (difference in rates). A retention email lifting renewal from 70 % to 72 % needs 50 emails per extra renewal.

## 3. Practical significance

Before the test, agree on the **smallest effect worth acting on** (from cost, risk and value). Then read the interval against it:

| Interval | Reading |
|---|---|
| Entirely above the minimum | Real and worth it |
| Above zero, but includes values below the minimum | Real, maybe not worth it; more data or a judgement call |
| Includes zero and the minimum | Inconclusive; underpowered |
| Entirely below the minimum, around zero | Probably no worthwhile effect, a useful result in itself |

<div class="meaning">

<dl>
<dt>Raw difference</dt><dd>In the metric's own units: +$0.35 a week, +0.8 points.</dd>
<dt>Relative lift</dt><dd>Difference ÷ baseline: +0.67 %.</dd>
<dt>Cohen's d</dt><dd>Difference ÷ SD: size compared with how much individuals vary (0.2 small, 0.5 medium, 0.8 large).</dd>
<dt>Physical meaning</dt><dd>Size times reach is value. A d of 0.009 is invisible for one customer, yet across 1.5 million customers a week it can be worth hundreds of thousands. Judge importance in money or time, not in p-values.</dd>
</dl>

</div>

<div class="myth">

**"p = 0.001 means a big effect."** A tiny p can come from a tiny effect measured on a huge sample. Always put the estimate and its interval next to the p-value, and translate it into business value.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The test.</b> 200,000 users per group. Weekly spend: A $52.40, B $52.75, SD $40.</div>
<div class="step"><b>Size.</b> +$0.35 (+0.67 %); Cohen's d = 0.35 ÷ 40 ≈ 0.009: tiny per person.</div>
<div class="step"><b>Certainty.</b> SE ≈ 0.126, z ≈ 2.77, p ≈ 0.006; CI +$0.10 to +$0.60.</div>
<div class="step"><b>Scale up.</b> 1.5 million users × $0.10 to $0.60 = $150k to $900k a week.</div>
<div class="step"><b>Decide.</b> Tiny per user, large in total: ship if the new search is cheap to run.</div>
</div>

<div class="problem" data-problem="cohens-d"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** effect sizes describe the data's message; p-values describe the evidence's strength. Report both, but lead with size.

**Equations:** Cohen's `$d = (\bar{x}_B - \bar{x}_A)/s_p$`, with pooled `$s_p = \sqrt{\frac{(n_A-1)s_A^2 + (n_B-1)s_B^2}{n_A+n_B-2}}$`. Relative lift `$(\bar{x}_B - \bar{x}_A)/\bar{x}_A$`. Number needed to treat `$1/(p_B - p_A)$`.

**Why big n makes everything significant:** the test statistic is roughly `$d\sqrt{n/2}$`, which grows without limit as `$n$` grows for any `$d \ne 0$`.
</details>

## 4. Worked example

*Made-up numbers.* A grocery app tests a new search. 200,000 users per group. Average weekly spend: A $52.40, B $52.75; SD $40 in both.

- Difference **+$0.35** (+0.67 %); SE = 40 × √(2/200,000) ≈ 0.126; z ≈ 2.77; **p ≈ 0.006**. 95 % CI: **+$0.10 to +$0.60**.
- Cohen's d = 0.35 ÷ 40 ≈ **0.009**: tiny.
- Business value: 1.5 million weekly users × $0.10 to $0.60 = **$150k to $900k a week** in extra spend (before margin).

Tiny per user, large in total. If the new search costs little to run, ship it. The point isn't that small effects are unimportant; it's that you judge importance from the size, not from the p-value.

## 5. Practice

1. Conversion 5.0 % → 5.5 %. State the absolute and relative lift.
2. Means 64 and 70, pooled SD 12. Cohen's d?
3. A test is "not significant" with CI −1 % to +6 %. The minimum worthwhile lift is 2 %. What do you tell the team?

<details>
<summary>Answers</summary>

1. +0.5 points; +10 %.
2. 6 ÷ 12 = 0.5 (medium).
3. Inconclusive: the data fits anything from a small loss to a large gain, including the 2 % you care about. The test needs more data before deciding.
</details>

**Try it on your own data:** the [[hypothesis-tests]] tool reports Cohen's d and confidence intervals with every test; the [[bayesian-ab-test]] tool shows the chance that a lift beats your minimum worthwhile size.

**New words:** *effect size*, *absolute difference*, *relative lift*, *Cohen's d*, *practical significance*, *minimum worthwhile effect*, *number needed to treat*.

<div class="keypoints">

- Report the effect in real units, with its interval, every time.
- Cohen's d = difference ÷ SD compares effects across metrics.
- Large samples make tiny effects significant; small samples hide large ones.
- Importance = size × reach × value per unit, compared with cost.

</div>
