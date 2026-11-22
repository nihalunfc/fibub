---
title: 'Exponential growth and decay'
seoTitle: 'SAT exponential functions: growth, decay, percent'
summary: 'Tell linear from exponential change, read the growth or decay rate from a·bᵗ, work with half-lives, doubling and compound interest, and handle exponents like 2t and t/3.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'What does the 0.92 mean in V = 500(0.92)ᵗ?'
    choices: ['V falls by 8% each step', 'V falls by 92% each step', 'V falls by 0.92 each step']
    ans: 0
    why: '0.92 = 1 − 0.08: each step keeps 92%, so it loses 8%.'
  - q: 'A quantity grows by $5 each month. Which model is it?'
    choices: ['Linear', 'Exponential', 'Quadratic']
    ans: 0
    why: 'Same amount each step is linear. Same percent each step would be exponential.'
  - q: 'A drug halves every 4 hours. Starting at 80 mg, how much is left after 12 hours?'
    choices: ['10 mg', '20 mg', '40 mg']
    ans: 0
    why: '12 hours is 3 half-lives: 80 → 40 → 20 → 10.'
sources:
  - 'College Board, SAT Math content domains: Advanced Math (public test specifications) https://satsuite.collegeboard.org/digital'
  - 'fibub SAT question bank, exponential functions (original questions) https://fibub.com/learn/courses/sat/exponential-functions/'
---

**Module 3 · about 20 minutes · read first: [2.5](/learn/courses/sat/linear-models/), [3.6](/learn/courses/sat/radicals-exponents/).** By the end you will build and read exponential models and never mix them up with linear ones.

<div class="bigidea">Linear change adds the same amount each step. Exponential change multiplies by the same number each step, which is the same as changing by the same percent. That small difference grows into a huge one.</div>

## 1. Adding versus multiplying

Two jobs: one raises your pay by $10 every year, the other by 10% every year, both starting at $100 a day. At first they look alike. Move the slider and look at year 10.

<figure class="fig" data-fig="graph" data-mode="exp"><figcaption>Solid: the same percent each step (exponential). Dashed: the same amount each step (linear). Switch to decay to see the exponential curve level off instead of hitting zero.</figcaption></figure>

```math
y = a \cdot b^{\,t} \qquad b = 1 + r \text{ (growth)}, \; b = 1 - r \text{ (decay)}
```

<div class="meaning">

<dl>
<dt>a</dt><dd>the starting amount (the value when t = 0)</dd>
<dt>b</dt><dd>the multiplier each step: above 1 grows, between 0 and 1 shrinks</dd>
<dt>r</dt><dd>the percent change per step, as a decimal (7% → 0.07)</dd>
<dt>t</dt><dd>the number of steps (years, hours, ...)</dd>
<dt>Physical meaning</dt><dd>Exponential growth feeds on itself: interest earns interest, bacteria make more bacteria. That is why it starts slow and then shoots up.</dd>
</dl>

</div>

## 2. Reading the rate

| Model | Multiplier | Change per step |
|---|---|---|
| 300(1.04)ᵗ | 1.04 | grows 4% |
| 300(0.85)ᵗ | 0.85 | shrinks 15% |
| 300(2)ᵗ | 2 | doubles (grows 100%) |
| 300(1/2)ᵗ | 0.5 | halves |

<div class="problem" data-problem="ex-g01"></div>

## 3. Half-life and doubling

When something halves every h hours, after t hours it has halved t/h times: amount = a(1/2)<sup>t/h</sup>.

<div class="steps">
<div class="step">Bacteria double every 20 minutes. Start: 300. <b>How many after 2 hours?</b></div>
<div class="step">2 hours = 120 minutes = 120 ÷ 20 = 6 doublings.</div>
<div class="step">300 × 2⁶ = 300 × 64.</div>
<div class="step"><b>19,200</b> bacteria. Model: N = 300 · 2<sup>t/20</sup> with t in minutes.</div>
</div>

<div class="problem" data-problem="ex-g02"></div>

<div class="problem" data-problem="ex-g04"></div>

## 4. When the exponent is not just t

P = 1,000(1.03)<sup>4t</sup> with t in years means 1.03 is applied 4 times a year: 3% per quarter. Per year it is 1.03⁴ ≈ 1.1255, about 12.6%, not 12%. To switch forms, use the power rules: (1.03)<sup>4t</sup> = (1.03⁴)ᵗ.

<div class="problem" data-problem="ex-g05"></div>

<div class="myth">

**"Losing 20% then gaining 20% gets you back to where you started."** 100 × 0.8 = 80, then 80 × 1.2 = 96. Percent changes multiply, they do not cancel.

</div>

## 5. How the SAT asks it

- Linear or exponential? (Same amount or same percent?)
- What does a number in a·bᵗ mean? (Start, or percent change per step.)
- Value after t steps, or the number of doublings or half-lives.
- Which equivalent form shows the rate per month, per quarter, or per 10 years?

<div class="keypoints">

- y = a·bᵗ: a is the start, b is the multiplier per step; b = 1 + r grows, b = 1 − r decays.
- Same amount per step is linear; same percent per step is exponential.
- Halving every h: a(1/2)<sup>t/h</sup>; doubling every d: a·2<sup>t/d</sup>.
- Percent changes multiply; use power rules to change the time unit.

</div>
