---
title: 'Indefinite integrals: question types and traps'
seoTitle: 'Indefinite integrals JEE questions: types and traps'
summary: 'Every way entrance exams ask about indefinite integrals: standard forms, substitution, trigonometric integrals, the x² ± a² family, integration by parts and the eˣ shortcut, partial fractions, constants in a given answer, and finding f or a curve from its derivative, each with a method and its trap.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: '∫ sec²x / tan x dx equals:'
    choices: ['log|tan x| + C', 'tan²x/2 + C', 'log|sec x| + C', 'sec x + C']
    ans: 0
    why: 'The top is the derivative of the bottom: ∫ f′/f dx = log|f| + C with f = tan x.'
  - q: '∫ dx/(x² + 6x + 13) equals:'
    choices: ['½ tan⁻¹((x + 3)/2) + C', 'tan⁻¹(x + 3) + C', '¼ log|x + 3| + C', '½ tan⁻¹(x/2) + C']
    ans: 0
    why: 'x² + 6x + 13 = (x + 3)² + 2², so the integral is (1/2) tan⁻¹((x + 3)/2) + C.'
  - q: 'In ∫ x² log x dx by parts, the best choice of u (the part to differentiate) is:'
    choices: ['x²', 'log x', 'either works the same', 'x² log x']
    ans: 1
    why: 'ILATE puts the logarithm before the algebraic term. Differentiating log x gives 1/x, which makes the new integral a simple power.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Integral calculus; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 12 · about 25 minutes.** Read [Indefinite integrals](/learn/courses/engineering-entrance/indefinite-integrals/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Integration is recognition. Before writing anything, ask: is the derivative of some part sitting next to it (substitution)? Is it a product of different kinds (parts)? Is it a fraction of polynomials (partial fractions)? Is there a square to complete? The method follows from the look of the integrand.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Standard forms and concepts.</b> Direct use of the table; ∫ f(ax + b). <i>Trap:</i> dropping the modulus in log answers or the 1/a factor.</div>
<div class="step"><b>2. Substitution.</b> f′/f, f′/√f, f(g)g′. <i>Method:</i> look for a function whose derivative is also present.</div>
<div class="step"><b>3. Trigonometric integrals.</b> Powers of sin and cos, 1/(a + b cos x). <i>Method:</i> half-angle identities, odd-power split, t = tan(x/2).</div>
<div class="step"><b>4. The x² ± a² family.</b> Complete the square, then the right standard form. <i>Trap:</i> mixing up tan⁻¹ (plus) and log (minus) forms.</div>
<div class="step"><b>5. Integration by parts.</b> ILATE; repeating integrals (eˣ sin x); the eˣ[f + f′] shortcut. <i>Trap:</i> choosing u so that the new integral is harder.</div>
<div class="step"><b>6. Partial fractions.</b> Coefficients by cover-up; repeated and quadratic factors. <i>Trap:</i> forgetting to divide an improper fraction first.</div>
<div class="step"><b>7. Constants in a given answer.</b> ∫ f = A g + B h + C: find A, B. <i>Method:</i> differentiate the answer and compare.</div>
<div class="step"><b>8. Finding f or a curve.</b> From f′ (or f″) and given values; motion from velocity. <i>Trap:</i> one constant per integration.</div>
</div>

## Worked examples

**Example 1 (level 3, linear over quadratic).** ∫ (2x + 5)/(x² + 2x + 5) dx. *Solution.* 2x + 5 = (2x + 2) + 3. The first part gives log(x² + 2x + 5). The second: 3∫ dx/((x + 1)² + 4) = (3/2)tan⁻¹((x + 1)/2). **Answer: log(x² + 2x + 5) + (3/2)tan⁻¹((x + 1)/2) + C.**

**Example 2 (level 4, eˣ shortcut).** ∫ eˣ (x − 1)/x² dx. *Solution.* Split the fraction: eˣ(1/x − 1/x²). With f = 1/x, f′ = −1/x², so it is eˣ[f + f′]. **Answer: eˣ/x + C.**

**Example 3 (level 4, finding constants).** If ∫ (3 sin x + 2 cos x)/(sin x + cos x) dx = Ax + B log|sin x + cos x| + C. Find A and B. *Solution.* Write the top as p(sin x + cos x) + q(cos x − sin x): p − q = 3 and p + q = 2, so p = 5/2 and q = −1/2. The integral is (5/2)x − (1/2)log|sin x + cos x| + C. **A = 5/2, B = −1/2.**

**Example 4 (level 5, symmetric form).** ∫ (x² − 1)/(x⁴ + 1) dx. *Solution.* Divide by x²: (1 − 1/x²)/((x + 1/x)² − 2). Put t = x + 1/x, dt = (1 − 1/x²)dx: ∫ dt/(t² − 2) = (1/(2√2))log|(t − √2)/(t + √2)|. **Answer: (1/(2√2)) log|(x² − √2x + 1)/(x² + √2x + 1)| + C.**

**Example 5 (level 5, curve from a slope).** A curve through (0, 1) has slope eˣ(x + 1) at every point. Find y at x = 1. *Solution.* y = ∫ eˣ(x + 1) dx = x eˣ + C (eˣ[f + f′] with f = x). At (0, 1), C = 1. **y(1) = e + 1.**

<div class="myth">

**"Integration by parts always works if you keep going."** If you choose u badly, each step gives a harder integral. In ∫ x eˣ dx, taking u = eˣ raises the power of x forever. Pick u so that differentiating it simplifies the problem.

</div>

<div class="meaning">
<dl>
<dt>ILATE</dt><dd>Inverse trig, Log, Algebraic, Trig, Exponential: pick u from the left</dd>
<dt>Cover-up</dt><dd>A for (x − a): hide that factor, put x = a in the rest</dd>
<dt>Top = p(bottom) + q(bottom′)</dt><dd>splits a fraction into a plain term and an f′/f term</dd>
<dt>Physical meaning</dt><dd>Each answer is a family of curves; given values choose the member, so they must be used after integrating.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="indefinite-integrals" data-mode="practice"></div>

<div class="keypoints">

- Look first: derivative present (substitute), product of kinds (parts), polynomial fraction (partial fractions).
- Complete the square for any quadratic in the bottom.
- eˣ[f + f′] integrates to eˣf; spot f in the bracket.
- Top = p(bottom) + q(bottom′) handles trig and linear-over-quadratic fractions.
- Divide x⁴ + 1 forms by x² and substitute x ± 1/x.
- Use given values after integrating, one constant each time.

</div>
