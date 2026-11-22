---
title: 'Continuity and differentiability: question types and traps'
seoTitle: 'Continuity and differentiability JEE questions: types'
summary: 'Every way entrance exams ask about continuity and differentiability: continuity at a point, types of discontinuity, constants that join pieces, greatest integer and modulus functions, counting points of non-differentiability, implicit, parametric and logarithmic derivatives, second derivatives and functional equations, each with a method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'The number of points in (0, 3) where f(x) = [x] is discontinuous is:'
    choices: ['0', '1', '2', '3']
    ans: 2
    why: '[x] jumps at every integer. Inside the open interval (0, 3) those are x = 1 and x = 2.'
  - q: 'If y = xˣ, then dy/dx at x = 1 is:'
    choices: ['0', '1', 'e', '2']
    ans: 1
    why: 'dy/dx = xˣ(1 + log x). At x = 1: 1 × (1 + 0) = 1.'
  - q: 'f(x) = |x − 1|(x − 1) at x = 1 is:'
    choices: ['not continuous', 'continuous, not differentiable', 'differentiable', 'undefined']
    ans: 2
    why: 'It is |t|t with t = x − 1, whose slope from both sides is 0. The extra factor (x − 1) flattens the corner.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Limit, continuity and differentiability; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 12 · about 26 minutes.** Read [Continuity and differentiability](/learn/courses/engineering-entrance/continuity-differentiability/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Two habits answer most of these questions: at a suspicious point, always compute the left and right values and slopes separately; and before differentiating anything complicated, simplify it (substitute, take logs, or find the pattern).</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Continuity at a point.</b> Compare LHL, RHL and f(a). <i>Trap:</i> checking only one side, or forgetting f(a) itself.</div>
<div class="step"><b>2. Types of discontinuity.</b> Removable, jump or essential. <i>Trap:</i> calling a function discontinuous at a point outside its domain.</div>
<div class="step"><b>3. Finding constants.</b> One equation for continuity, a second for differentiability. <i>Trap:</i> matching slopes without first matching values.</div>
<div class="step"><b>4. Greatest integer and modulus.</b> [x] at integers, [g(x)] where g crosses integers, |g| at simple roots. <i>Method:</i> use n − h and n + h.</div>
<div class="step"><b>5. Counting points of non-differentiability.</b> Corners of |g|, max/min, products with |x − a|. <i>Trap:</i> counting double roots, where there is no corner.</div>
<div class="step"><b>6. Implicit and parametric derivatives.</b> dy/dx at a point; second derivatives. <i>Trap:</i> d²y/dx² ≠ (d²y/dt²)/(d²x/dt²).</div>
<div class="step"><b>7. Logarithmic and inverse-trig derivatives.</b> xˣ, (sin x)^cos x, tan⁻¹ of algebraic fractions. <i>Method:</i> logs, or substitute x = tan θ first.</div>
<div class="step"><b>8. Functional equations and limit-defined functions.</b> f(x + y) = f(x)f(y), f defined by limₙ. <i>Method:</i> f(0) first, then the derivative from the definition.</div>
</div>

## Worked examples

**Example 1 (level 3, constants).** f(x) = (1 − cos 4x)/x² for x ≠ 0 and f(0) = k is continuous at 0. Find k. *Solution.* 1 − cos 4x = 2sin²2x, so f(x) = 2(sin 2x / x)² → 2 × 4 = 8. **k = 8.**

**Example 2 (level 4, counting).** (a) Where is f(x) = max(x², 2 − x²) not differentiable? (b) How many points in (−1, 3) are there where g(x) = |x² − 3x + 2| + |sin x| is not differentiable? *Solution.* (a) The curves cross where x² = 1, at x = ±1, with different slopes: **x = ±1**. (b) x² − 3x + 2 = (x − 1)(x − 2) gives corners at 1 and 2; |sin x| has a corner at x = 0 (a simple root of sin x) within (−1, 3). **3 points.**

**Example 3 (level 4, second derivative).** If y = e^(a sin⁻¹x), show that (1 − x²)y″ − xy′ − a²y = 0. *Solution.* y′ = ay/√(1 − x²), so √(1 − x²)y′ = ay. Square: (1 − x²)y′² = a²y². Differentiate: −2xy′² + 2(1 − x²)y′y″ = 2a²yy′. Divide by 2y′: **(1 − x²)y″ − xy′ − a²y = 0**. Squaring before differentiating removed the square root.

**Example 4 (level 5, functional equation).** f(x + y) = f(x)f(y) for all x, y, f(0) ≠ 0 and f′(0) = 3. Find f′(x)/f(x). *Solution.* x = y = 0 gives f(0) = f(0)², so f(0) = 1. Then f′(x) = lim [f(x)f(h) − f(x)]/h = f(x) lim [f(h) − 1]/h = f(x)f′(0). So **f′(x)/f(x) = 3** and f(x) = e³ˣ.

**Example 5 (level 5, limit-defined).** f(x) = limₙ→∞ 1/(1 + x²ⁿ). Where is f discontinuous? *Solution.* For |x| < 1, x²ⁿ → 0, so f = 1. For |x| > 1, x²ⁿ → ∞, so f = 0. At |x| = 1, f = 1/2. The value jumps at **x = ±1** only.

<div class="myth">

**"Any function containing |x| has a corner at 0."** x|x|, |x|³ and |x| sin x are all differentiable at 0. The corner of |x| is flattened when it is multiplied by something that is also 0 there.

</div>

<div class="meaning">
<dl>
<dt>LHL, RHL</dt><dd>limits of f from the left and right</dd>
<dt>LHD, RHD</dt><dd>slopes from the left and right</dd>
<dt>Simple root</dt><dd>a root where g changes sign (g′ ≠ 0); |g| has a corner there</dd>
<dt>Physical meaning</dt><dd>Continuity asks "do the two sides meet?"; differentiability asks "do they arrive in the same direction?"</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="continuity-differentiability" data-mode="practice"></div>

<div class="keypoints">

- At any join: values first (continuity), slopes second (differentiability).
- [x] is discontinuous at every integer; |g(x)| has corners at simple roots of g.
- Factors that vanish at a point flatten corners: x|x| is differentiable at 0.
- Parametric second derivative: differentiate dy/dx in t, divide by dx/dt.
- Square away roots before differentiating twice; use logs for variable powers.
- Functional equations: put x = y = 0 (or 1), then use the definition of the derivative.

</div>
