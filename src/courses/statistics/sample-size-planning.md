---
title: How big a sample do you need?
summary: 'Plan a sample from the precision you need: n = (z × σ / margin)² for a mean and z² × p(1−p) / margin² for a proportion. Guessing σ and p, why population size barely matters, and planning for non-response and subgroups.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'You need a percentage to within ±5 points at 95 % confidence and have no idea of the answer. About how many responses?'
    choices: ['100', '385', '1,000']
    ans: 1
    why: 'n = 1.96² × 0.5 × 0.5 ÷ 0.05² = 0.9604 ÷ 0.0025 ≈ 384.2, so 385.'
  - q: 'You need 385 completed surveys and expect a 25 % response rate. How many invitations?'
    choices: ['385', '481', 'About 1,540']
    ans: 2
    why: '385 ÷ 0.25 = 1,540. (And remember non-responders may differ, Lesson 4.2.)'
  - q: 'You want ±5 points for each of 4 regions separately. Roughly how many responses in total?'
    choices: ['385', 'About 1,540 (385 per region)', '96']
    ans: 1
    why: 'Each subgroup needs its own 385 for that precision. Planning only the total leaves subgroups too small.'
sources:
  - 'OpenIntro Statistics, 4th edition (Diez, Cetinkaya-Rundel, Barr), Section 6.1.4 Choosing a sample size when estimating a proportion https://www.openintro.org/book/os/'
  - 'NIST/SEMATECH e-Handbook, 7.2.2.2 Sample sizes required https://www.itl.nist.gov/div898/handbook/prc/section2/prc222.htm'
---

**Module 5 · about 20 minutes · school maths.** You'll be able to work out a sample size for a mean or a proportion, choose sensible guesses for σ and p, and adjust for response rates and subgroups.

<div class="bigidea">Decide how precise the answer must be, then solve the margin-of-error formula backwards for n.</div>

**In everyday terms:** before buying paint you measure the wall. Before a survey you decide how close the answer must be (the margin) and how much people vary (σ or p), and the sample size follows.

## 1. Start from the decision

Before collecting data, ask: **how precise does the answer need to be to make the decision?** A ±10-point answer is enough to tell "most customers want this" from "few do". Setting a price might need ±1 point. Precision is expensive (the square-root law), so don't buy more than the decision needs.

<!--fig:sample-size-curve-->

## 2. The formulas

Turn the margin formula around. For a **proportion** with margin `$m$`:

```math
n = \frac{z^2\, p(1-p)}{m^2}
```

For a **mean**:

```math
n = \left(\frac{z\,\sigma}{m}\right)^2
```

with `$z$` = 1.96 for 95 %. Round up.

**Guessing the inputs.**

- `$p$`: use 0.5 if you have no idea; it gives the largest n, so you're safe. If past data says about 10 %, use 0.1 (much smaller n).
- `$\sigma$`: from past data, a pilot, or range ÷ 4 as a rough guess (about 95 % of normal data lies within ±2σ).

Raise the sample size, then shrink the effect size, and watch the two bells and the shaded areas.

<figure class="fig" data-fig="@data-power-overlap"><figcaption>Notice that alpha comes from the null bell, beta from the real-effect bell, and power is what is left of the real bell beyond the cut-off.</figcaption></figure>


## 3. Adjustments

- **Response rate:** invite n ÷ (expected response rate).
- **Subgroups:** if each region must be reported separately, each needs its own n.
- **Finite population:** if n is more than about 5 % of the population N, the corrected size is `$n' = n / (1 + (n-1)/N)$`. For 385 out of 2,000 employees: 385 ÷ 1.192 ≈ 323.
- **Comparisons between groups** (A/B tests) need a different calculation, with power, in Lesson 7.3. Precision for one number isn't the same as being able to detect a difference.

<div class="meaning">

<dl>
<dt>Margin E</dt><dd>How close you need to be, such as ±$5 or ±3 points.</dd>
<dt>n = (z·σ / E)²</dt><dd>Sample size for a mean.</dd>
<dt>n = z²·p(1 − p) / E²</dt><dd>Sample size for a share; use p = 0.5 if you have no idea (the worst case).</dd>
<dt>Physical meaning</dt><dd>Precision costs in squares: halving the margin needs four times the sample. Population size barely enters, so a national survey and a city survey need about the same n.</dd>
</dl>

</div>

<div class="myth">

**"Survey 10 % of the population."** Rules based on a share of the population waste money on big populations and fall short on small precise questions. Start from the margin you need.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The goal.</b> Average weekly grocery spend to within ±$5, 95 % confidence. Last year σ ≈ $60.</div>
<div class="step"><b>Plug in.</b> n = (1.96 × 60 ÷ 5)² = 23.52² ≈ 553.2.</div>
<div class="step"><b>Round up.</b> 554 completed responses.</div>
<div class="step"><b>Non-response.</b> Past surveys get 20 % replies: invite 554 ÷ 0.2 = 2,770.</div>
<div class="step"><b>Subgroups.</b> Each of 3 provinces to ±$8 needs 217 each, 651 in all. That is the binding need: plan for 651 replies.</div>
</div>

<div class="problem" data-problem="sample-size-mean"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the margin of error is `$z \times \text{SE}$` and SE shrinks like `$1/\sqrt{n}$`, so solving for n gives a square: halving the margin quadruples n.

**Equations:** `$n = z^2 p(1-p)/m^2$`, `$n = (z\sigma/m)^2$`, `$n' = n/(1 + (n-1)/N)$`.

**Handy numbers (95 %, p = 0.5):** ±10 points → 97; ±5 → 385; ±3 → 1,068; ±2 → 2,401; ±1 → 9,604.
</details>

## 4. Worked example

*Made-up numbers.* A grocery chain wants average weekly grocery spend of its loyalty members to within ±$5, 95 % confidence. Last year's data suggests σ ≈ $60.

- n = (1.96 × 60 ÷ 5)² = (23.52)² ≈ 553.2, so **554 members**.
- Response rate to past surveys: 20 %. Invitations: 554 ÷ 0.2 = **2,770**.
- Management also wants each of 3 provinces to ±$8: per province (1.96 × 60 ÷ 8)² ≈ 216.1, so 217, which is 651 in total. That beats 554, so plan for **651 responses** (about 3,255 invitations), spread so each province gets at least 217.

## 5. Practice

1. Proportion, ±4 points, 95 %, p unknown. n?
2. Mean, σ = 15, margin ±2, 95 %. n?
3. Past churn is about 8 %. For ±2 points, how many customers? Compare with the p = 0.5 answer.

<details>
<summary>Answers</summary>

1. 0.9604 ÷ 0.0016 ≈ 600.25, so 601.
2. (1.96 × 15 ÷ 2)² = 14.7² ≈ 216.1, so 217.
3. 3.8416 × 0.08 × 0.92 ÷ 0.0004 ≈ 706.9, so 707. With p = 0.5: 2,401. Knowing p is around 8 % saves about 70 % of the sample.
</details>

**Try it on your own data:** the [[sample-size]] calculator does these sums, including finite populations and response rates.

**New words:** *sample size*, *margin of error*, *pilot study*, *finite population correction*, *response rate*.

<div class="keypoints">

- Start from the decision: what margin of error would change it?
- Mean: n = (z·σ / E)²; share: n = z²·p(1 − p)/E² (p = 0.5 if unknown).
- Halving the margin needs four times the sample.
- Divide by the response rate, and plan for each subgroup you will report.

</div>
