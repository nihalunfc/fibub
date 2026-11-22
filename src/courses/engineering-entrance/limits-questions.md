---
title: 'Limits: question types and traps'
seoTitle: 'Limits JEE questions: types and traps'
summary: 'Every way entrance exams test limits: existence and one-sided limits, greatest integer and modulus, factorising and rationalising, standard limits, limits at infinity, bounded functions and the squeeze rule, series expansions, finding constants, and 1^∞ forms, each with its method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'The limit as x → 0 of (1 − cos 4x)/x² is:'
    choices: ['8', '4', '16', '2']
    ans: 0
    why: '(1 − cos 4x)/x² = 16 × (1 − cos 4x)/(4x)² → 16 × 1/2 = 8.'
  - q: 'The limit as x → ∞ of (1 + 2/x)^x is:'
    choices: ['e²', 'e', '1', '2']
    ans: 0
    why: 'A 1^∞ form: e^(lim x × 2/x) = e². Answering 1 because "the base tends to 1" is the trap.'
  - q: 'The limit as x → 0 of x sin(1/x) is:'
    choices: ['0', '1', 'it does not exist', '∞']
    ans: 0
    why: '|x sin(1/x)| ≤ |x| → 0, so by the squeeze rule the limit is 0, even though sin(1/x) alone has no limit.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Limit, continuity and differentiability; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 11 · about 26 minutes.** Read [Limits](/learn/courses/engineering-entrance/limits/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Substitute first. If you get a number, you are done. If you get an indeterminate form, name it (0/0, ∞/∞, 1^∞, ∞ − ∞, 0 × ∞) and use the tool for that form. Most mistakes come from using the wrong tool, not from hard algebra.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Existence and one-sided limits.</b> Compute LHL and RHL separately. <i>Trap:</i> e^{1/x} near 0 goes to ∞ from the right but 0 from the left.</div>
<div class="step"><b>2. Greatest integer, fractional part, modulus.</b> Write the function on each side. <i>Trap:</i> [x²] and [x]² behave differently near 0 and near integers.</div>
<div class="step"><b>3. Factorise or rationalise.</b> Cancel (x − a); conjugates for roots. <i>Trap:</i> rationalising only the top when the bottom has the root.</div>
<div class="step"><b>4. Standard limits.</b> Match the inner and outer argument. <i>Trap:</i> degrees instead of radians: sin x°/x → π/180.</div>
<div class="step"><b>5. Limits at infinity.</b> Divide by the highest power; rationalise ∞ − ∞. <i>Trap:</i> √(x²) = −x when x → −∞.</div>
<div class="step"><b>6. Bounded functions.</b> Squeeze between two limits. <i>Trap:</i> claiming no limit just because sin(1/x) oscillates.</div>
<div class="step"><b>7. Series expansions.</b> Expand to the power of the denominator. <i>Trap:</i> stopping too early when terms cancel.</div>
<div class="step"><b>8. Finding constants.</b> Make the lower-power terms on top vanish, then read the limit. <i>Trap:</i> forgetting the condition that the limit is finite.</div>
<div class="step"><b>9. 1^∞ forms.</b> e^(lim g(f − 1)). <i>Trap:</i> answering 1.</div>
<div class="step"><b>10. Sums and products as limits.</b> Telescoping or Riemann sums: (1/n)Σ f(k/n) → ∫₀¹ f. <i>Trap:</i> wrong limits of integration.</div>
</div>

## Worked examples

**Example 1 (level 3, rationalise).** Find `$\lim_{x\to0}\dfrac{\sqrt{1+x} - \sqrt{1-x}}{x}$`. *Solution.* Multiply top and bottom by √(1 + x) + √(1 − x): the top becomes 2x, so the expression is 2/(√(1 + x) + √(1 − x)) → 2/2 = **1**.

**Example 2 (level 4, one-sided).** Find the limit as x → 0 of `$\dfrac{1}{1 + e^{1/x}}$`, if it exists. *Solution.* As x → 0⁺, 1/x → +∞ and e^{1/x} → ∞, so the expression → 0. As x → 0⁻, 1/x → −∞ and e^{1/x} → 0, so the expression → 1. LHL ≠ RHL: **the limit does not exist.**

**Example 3 (level 4, series and constants).** Find a and b if `$\lim_{x\to0}\dfrac{x(1 + a\cos x) - b\sin x}{x^3} = 1$`. *Solution.* Expand: the top is x + ax(1 − x²/2) − b(x − x³/6) + … = (1 + a − b)x + (−a/2 + b/6)x³ + …. For a finite limit, 1 + a − b = 0. For the limit to be 1, −a/2 + b/6 = 1. Solving: **a = −5/2, b = −3/2**.

**Example 4 (level 5, sum as an integral).** Find `$\lim_{n\to\infty}\left(\dfrac1{n+1} + \dfrac1{n+2} + \cdots + \dfrac1{2n}\right)$`. *Solution.* Each term is (1/n) × 1/(1 + k/n) for k = 1 to n. This is a Riemann sum for ∫₀¹ dx/(1 + x) = **ln 2**.

<div class="myth">

**"If f(a) is defined, the limit is f(a)."** Only for continuous functions. For [x] at x = 1, f(1) = 1 but the left limit is 0, so the limit does not exist. A limit never looks at the value at a; it looks only at nearby values.

</div>

<div class="meaning">
<dl>
<dt>Indeterminate form</dt><dd>a shape that needs more work before it gives an answer</dd>
<dt>Squeeze</dt><dd>trapping f between two functions that share a limit</dd>
<dt>Physical meaning</dt><dd>Every method for 0/0 is a way to cancel the factor that is going to zero in both top and bottom, so the part that is left can be substituted.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="limits" data-mode="practice"></div>

<div class="keypoints">

- Substitute first; name the form; pick the tool.
- One-sided limits for [x], {x}, |x|, e^{1/x} and piecewise rules.
- Standard limits need matching arguments and radians.
- √(x²) = |x|: watch the sign as x → −∞.
- For "find a, b": lower-power terms vanish, then match the limit.
- 1^∞: e^(lim g(f − 1)); sums like (1/n)Σ f(k/n) become ∫₀¹ f(x) dx.

</div>
