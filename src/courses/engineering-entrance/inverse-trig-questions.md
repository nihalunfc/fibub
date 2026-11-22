---
title: 'Inverse trigonometric functions: question types and traps'
seoTitle: 'Inverse trig JEE questions: types and traps'
summary: 'Every way entrance exams ask about inverse trigonometric functions: principal values, domains and ranges, f⁻¹(f(x)) outside the branch, the complement and sum properties, simplification by substitution, equations, inequalities and telescoping sums, each with a method and its trap.'
minutes: 24
updated: 2026-11-22
quiz:
  - q: 'The domain of sin⁻¹(2x − 1) is:'
    choices: ['[−1, 1]', '[0, 1]', '[0, 2]', '[−1, 0]']
    ans: 1
    why: 'Need −1 ≤ 2x − 1 ≤ 1, so 0 ≤ 2x ≤ 2, giving 0 ≤ x ≤ 1.'
  - q: 'cos⁻¹(cos 7π/6) equals:'
    choices: ['7π/6', '5π/6', '−π/6', 'π/6']
    ans: 1
    why: 'cos(7π/6) = cos(2π − 7π/6) = cos(5π/6), and 5π/6 is in [0, π].'
  - q: 'If sin⁻¹x = π/5, then cos⁻¹x is:'
    choices: ['3π/10', '4π/5', 'π/5', '7π/10']
    ans: 0
    why: 'sin⁻¹x + cos⁻¹x = π/2, so cos⁻¹x = π/2 − π/5 = 3π/10.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Inverse trigonometric functions; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 12 · about 24 minutes.** Read [Inverse trigonometric functions](/learn/courses/engineering-entrance/inverse-trig/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Every inverse-trig question checks one thing: do you keep the answer inside the principal range? When a formula needs a condition (ab &lt; 1, x &gt; 0, |x| ≤ 1), the question is usually built so that the condition fails.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Principal values.</b> sin⁻¹(−½), cos⁻¹(−√3/2), sec⁻¹(−2). <i>Trap:</i> giving a negative answer for cos⁻¹, cot⁻¹ or sec⁻¹.</div>
<div class="step"><b>2. Domains.</b> sin⁻¹(g(x)) needs −1 ≤ g(x) ≤ 1; add the domains of any square roots or logs. <i>Trap:</i> forgetting the outer function's own domain.</div>
<div class="step"><b>3. Ranges.</b> Of expressions like sin⁻¹x + 2cos⁻¹x or (tan⁻¹x)² + (cot⁻¹x)². <i>Method:</i> use the π/2 identity to reduce to one variable on its interval.</div>
<div class="step"><b>4. f⁻¹(f(x)) outside the branch.</b> sin⁻¹(sin 10), tan⁻¹(tan 5π/4). <i>Method:</i> shift by multiples of π (or 2π) into range. <i>Trap:</i> writing x back unchanged.</div>
<div class="step"><b>5. Properties.</b> Complement (π/2), negative argument, reciprocal. <i>Trap:</i> cot⁻¹x = tan⁻¹(1/x) fails for x &lt; 0.</div>
<div class="step"><b>6. Sums and double angles.</b> tan⁻¹a + tan⁻¹b, 2tan⁻¹x. <i>Trap:</i> missing the π correction when ab &gt; 1 or |x| &gt; 1.</div>
<div class="step"><b>7. Simplification.</b> Expressions with √(1 − x²), 1 + x², √((1 − x)/(1 + x)). <i>Method:</i> substitute x = sin θ, tan θ or cos 2θ and track the range of θ.</div>
<div class="step"><b>8. Equations, inequalities and telescoping sums.</b> Solve, then test every root; write each term as tan⁻¹A − tan⁻¹B.</div>
</div>

## Worked examples

**Example 1 (level 3, outside the branch).** Find sin⁻¹(sin 10), with 10 in radians. *Solution.* 10/π ≈ 3.18, so the nearest multiple of π is 3π ≈ 9.42. 10 = 3π + (10 − 3π), and sin(3π + φ) = −sin φ. So sin 10 = −sin(10 − 3π) = sin(3π − 10). Since 3π − 10 ≈ −0.58 is in [−π/2, π/2], the answer is **3π − 10**.

**Example 2 (level 4, sum with correction).** Find tan⁻¹1 + tan⁻¹2 + tan⁻¹3. *Solution.* tan⁻¹2 + tan⁻¹3 = π + tan⁻¹(5/(−5)) = π − π/4 = 3π/4 (ab = 6 > 1). Add tan⁻¹1 = π/4: **π**.

**Example 3 (level 4, simplification with a split answer).** Simplify y = cos⁻¹[(1 − x²)/(1 + x²)] for all real x. *Solution.* Put x = tan θ, θ in (−π/2, π/2). Then y = cos⁻¹(cos 2θ). If x ≥ 0, 2θ is in [0, π) and y = 2θ = **2tan⁻¹x**. If x < 0, 2θ is negative, and cos⁻¹(cos 2θ) = −2θ = **−2tan⁻¹x**. So y = 2tan⁻¹|x|.

**Example 4 (level 5, telescoping).** Find the sum to infinity of tan⁻¹[2/(1 + (2k − 1)(2k + 1))] for k = 1, 2, 3, … *Solution.* The numerator 2 is the difference (2k + 1) − (2k − 1), so each term is tan⁻¹(2k + 1) − tan⁻¹(2k − 1). The partial sum is tan⁻¹(2n + 1) − tan⁻¹1 → π/2 − π/4 = **π/4**.

**Example 5 (level 5, equation).** Solve sin⁻¹x + sin⁻¹2x = π/3. *Solution.* sin⁻¹2x = π/3 − sin⁻¹x. Take sine: 2x = (√3/2)√(1 − x²) − x/2, so 5x/2 = (√3/2)√(1 − x²) and 25x² = 3(1 − x²), x² = 3/28. The left side increases with x and is negative for x < 0, so only the positive root works: **x = √(3/28) = ½√(3/7)**.

<div class="myth">

**"Squaring or taking tan of both sides is always safe."** Both can bring in roots that the original equation does not have, because different angles share the same tan or the same square. After solving, put each root back into the original equation, or use the sign of each term to rule roots out.

</div>

<div class="meaning">
<dl>
<dt>Right-half functions</dt><dd>sin⁻¹, tan⁻¹, cosec⁻¹: answers between −π/2 and π/2</dd>
<dt>Upper-half functions</dt><dd>cos⁻¹, cot⁻¹, sec⁻¹: answers between 0 and π</dd>
<dt>Telescoping form</dt><dd>tan⁻¹[(A − B)/(1 + AB)] = tan⁻¹A − tan⁻¹B</dd>
<dt>Physical meaning</dt><dd>An inverse function answers "which angle?", and the principal range is the agreed list of allowed answers. A correct-looking answer outside that list is wrong.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="inverse-trig" data-mode="practice"></div>

<div class="keypoints">

- Learn the six principal ranges; cos⁻¹, cot⁻¹ and sec⁻¹ are never negative.
- Domain of sin⁻¹g(x): solve −1 ≤ g(x) ≤ 1, then add other conditions.
- f⁻¹(f(θ)): shift θ by multiples of π (sin, tan) or 2π (cos) into range.
- tan⁻¹a + tan⁻¹b needs +π when a, b > 0 and ab > 1.
- Substitutions give split answers (like 2tan⁻¹|x|) when θ can leave the range.
- Test every root of an equation; telescope sums as tan⁻¹A − tan⁻¹B.

</div>
