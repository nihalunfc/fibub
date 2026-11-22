---
title: 'Definite integrals and area: question types and traps'
seoTitle: 'Definite integrals JEE questions: types and traps'
summary: 'Every way entrance exams ask about definite integrals and area: the fundamental theorem, King''s rule, even, odd and periodic integrands, modulus and greatest integer, Leibniz rule and limits, integral equations, Wallis formula, limits of sums, estimation, and areas between curves, each with a method and its trap.'
minutes: 27
updated: 2026-11-22
quiz:
  - q: '∫ from 0 to 2 of [x] dx, where [x] is the greatest integer, equals:'
    choices: ['0', '1', '2', '3']
    ans: 1
    why: '[x] = 0 on [0, 1) and 1 on [1, 2). The integral is 0 × 1 + 1 × 1 = 1.'
  - q: 'd/dx ∫ from 0 to x² of sin t dt equals:'
    choices: ['sin x²', '2x sin x²', 'cos x²', '2x cos x²']
    ans: 1
    why: 'Leibniz rule: f(upper) × (upper)′ = sin(x²) × 2x.'
  - q: '∫ from 0 to 10π of |sin x| dx equals:'
    choices: ['0', '10', '20', '2']
    ans: 2
    why: '|sin x| has period π and ∫₀^π |sin x| dx = 2. Ten periods give 20.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Integral calculus; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 12 · about 27 minutes.** Read [Definite integrals and area](/learn/courses/engineering-entrance/definite-integrals/) first. Here are the question types, worked examples and practice.

<div class="bigidea">A definite integral question with "nice" limits (−a to a, 0 to π/2, 0 to nπ) is almost always a property question. Look at the limits before you look at the integrand.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Direct evaluation.</b> Fundamental theorem, substitution with new limits, parts. <i>Trap:</i> keeping the old limits after substituting.</div>
<div class="step"><b>2. King's rule.</b> ∫ₐᵇ f(x) = ∫ₐᵇ f(a + b − x); add the two forms. <i>Signal:</i> x times a symmetric function, or sinⁿ/(sinⁿ + cosⁿ).</div>
<div class="step"><b>3. Even, odd and periodic.</b> Symmetric limits; many periods. <i>Trap:</i> a sum of odd and even parts: only the odd part vanishes.</div>
<div class="step"><b>4. Modulus and greatest integer.</b> Split at sign changes or integer crossings. <i>Trap:</i> missing a break point such as √2 in [x²].</div>
<div class="step"><b>5. Leibniz rule and limits.</b> Derivatives of integrals; 0/0 limits involving integrals. <i>Trap:</i> forgetting the chain-rule factor v′(x).</div>
<div class="step"><b>6. Integral equations and functional equations.</b> ∫ with constant limits is a number k. <i>Method:</i> name it, substitute back, solve for k.</div>
<div class="step"><b>7. Limit of a sum and estimation.</b> Σ(1/n)f(r/n) → ∫₀¹ f; bounds m(b − a) ≤ ∫ ≤ M(b − a). <i>Trap:</i> wrong upper limit when r runs to 2n or 3n.</div>
<div class="step"><b>8. Area.</b> Under a curve, between curves, bounded by lines. <i>Trap:</i> letting negative parts cancel; area must use |f|.</div>
</div>

## Worked examples

**Example 1 (level 3, odd plus even).** ∫ from −1 to 1 of (x⁵ + x² + sin x) dx. *Solution.* x⁵ and sin x are odd and give 0. The even part x² gives 2∫₀¹ x² dx = **2/3**.

**Example 2 (level 4, King's rule with a log).** I = ∫₀^(π/4) log(1 + tan x) dx. *Solution.* Replace x by π/4 − x: 1 + tan(π/4 − x) = 2/(1 + tan x). So I = ∫₀^(π/4) [log 2 − log(1 + tan x)] dx = (π/4)log 2 − I. **I = (π/8) log 2.**

**Example 3 (level 4, integral equation).** f(x) = 3x² + ∫₀¹ t f(t) dt. Find f(1). *Solution.* The integral has constant limits, so it is a number k and f(x) = 3x² + k. Then k = ∫₀¹ (3t³ + kt) dt = 3/4 + k/2, so k = 3/2 and **f(1) = 3 + 3/2 = 9/2**.

**Example 4 (level 5, limit of a sum).** Find L = lim (1/n)[(n + 1)(n + 2)⋯(2n)]^(1/n). *Solution.* Take logs and bring 1/n inside: log L = lim Σ (1/n) log(1 + r/n), r = 1 to n, = ∫₀¹ log(1 + x) dx = 2 log 2 − 1. **L = 4/e.**

**Example 5 (level 5, area).** Find the area enclosed between y = x² and y = 2 − x². *Solution.* They meet where x² = 1. Area = ∫ from −1 to 1 of (2 − 2x²) dx = 2[2x − 2x³/3]₀¹ = **8/3**.

<div class="myth">

**"A limit of a sum always becomes ∫₀¹."** Only when r/n runs over (0, 1]. If r goes from 1 to 2n, the variable x = r/n runs up to 2 and the integral is ∫₀². If the general term is (1/n)f(r/n) with r from n to 2n, the limits are 1 to 2.

</div>

<div class="meaning">
<dl>
<dt>King's rule</dt><dd>x → a + b − x leaves the limits unchanged</dd>
<dt>k</dt><dd>the value of an integral with constant limits, a plain number</dd>
<dt>Leibniz</dt><dd>f(v)v′ − f(u)u′</dd>
<dt>Physical meaning</dt><dd>Properties are ways of moving the same area around: reflecting it, folding it or repeating it, without changing how much there is.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="definite-integrals" data-mode="practice"></div>

<div class="keypoints">

- Check the limits first: symmetric limits mean odd/even; 0 to a means King's rule.
- Only the odd part of an integrand vanishes over [−a, a].
- Split at every break point for |f| and [f]; use periodicity for many periods.
- An integral with constant limits is a constant: name it k and solve.
- Products in limits: take logs to get a sum, then an integral.
- Area: upper − lower between meeting points; never let negative parts cancel.

</div>
