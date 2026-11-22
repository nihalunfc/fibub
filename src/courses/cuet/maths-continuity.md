---
title: 'Maths: continuity and differentiability'
seoTitle: 'Continuity and differentiability for CUET Maths'
summary: 'What continuity means at a point, making piecewise functions continuous, differentiability, the chain rule, implicit, logarithmic and parametric differentiation, and second derivatives, with a live problem.'
minutes: 22
updated: 2026-11-22
quiz:
  - q: 'f(x) = |x| at x = 0 is:'
    choices: ['continuous but not differentiable', 'differentiable but not continuous', 'neither']
    ans: 0
    why: 'The graph has no break, but a sharp corner: the left slope is −1 and the right slope is +1.'
  - q: 'd/dx of sin(x²) is:'
    choices: ['2x cos(x²)', 'cos(x²)', '2x sin(x²)']
    ans: 0
    why: 'Chain rule: the derivative of the outside (cos of the inside) times the derivative of the inside (2x).'
  - q: 'If x = at², y = 2at, then dy/dx is:'
    choices: ['1/t', 't', '2t']
    ans: 0
    why: 'dy/dx = (dy/dt)/(dx/dt) = 2a/(2at) = 1/t.'
sources:
  - 'NCERT, Mathematics Part I (Class 12), Continuity and Differentiability'
  - 'National Testing Agency, CUET (UG) Mathematics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 8 · about 22 minutes.** By the end you will test continuity and differentiability and differentiate any function CUET gives you.

<div class="bigidea">Continuous means you can draw the graph without lifting your pen. Differentiable means the graph is also smooth there, with no corner, so it has one clear slope. Every differentiable function is continuous, but not the other way round.</div>

**Everyday picture:** a car's speedometer. Distance travelled is continuous (the car cannot teleport). Speed is its derivative; if the car suddenly hit a wall, the distance graph would get a sharp corner and the speed would jump.

## 1. Continuity at a point

f is continuous at x = a when the left limit, the right limit and f(a) all exist and are equal. For a piecewise function, set the two pieces equal at the joining point and solve for the unknown constant.

<div class="problem" data-problem="piecewise-k"></div>

**Try it:** Shrink the interval around the point.

<figure class="fig" data-fig="@math-delta-limit"><figcaption>A limit asks what the values approach, not what happens at the point.</figcaption></figure>

## 2. Differentiation rules

| Rule | Formula |
|---|---|
| Chain | d/dx f(g(x)) = f′(g(x)) · g′(x) |
| Product | (uv)′ = u′v + uv′ |
| Quotient | (u/v)′ = (u′v − uv′)/v² |
| Inverse trig | (sin⁻¹x)′ = 1/√(1 − x²), (tan⁻¹x)′ = 1/(1 + x²) |
| Exponential, log | (eˣ)′ = eˣ, (ln x)′ = 1/x, (aˣ)′ = aˣ ln a |

<div class="steps" data-title="Three special techniques">
<div class="step"><b>Implicit:</b> for x² + y² = 25, differentiate both sides treating y as a function of x: 2x + 2y y′ = 0, so y′ = −x/y.</div>
<div class="step"><b>Logarithmic:</b> for y = xˣ, take ln: ln y = x ln x. Differentiate: y′/y = ln x + 1, so y′ = xˣ(1 + ln x).</div>
<div class="step"><b>Parametric:</b> if x and y both depend on t, dy/dx = (dy/dt) ÷ (dx/dt).</div>
<div class="step"><b>Second derivative:</b> differentiate again. For parametric curves, d²y/dx² = d/dt(dy/dx) ÷ (dx/dt), not (d²y/dt²)/(d²x/dt²).</div>
</div>

<div class="meaning">

<dl>
<dt>f′(a)</dt><dd>the slope of the tangent at x = a, or the instant rate of change.</dd>
<dt>Left and right derivatives</dt><dd>slopes approached from each side. Differentiable only if they agree.</dd>
<dt>Physical meaning</dt><dd>position → velocity → acceleration are first and second derivatives.</dd>
</dl>

</div>

<div class="myth">

**"If a function is continuous, it is differentiable."** |x| at 0, and any graph with a corner or a vertical tangent, is continuous but not differentiable.

</div>

## 3. Practice

<div class="qbank" data-bank="entrance-maths" data-topics="continuity-differentiability" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Continuous at a: LHL = RHL = f(a).
- Differentiable ⇒ continuous; corners break differentiability.
- Chain rule: outside′(inside) × inside′.
- Implicit, logarithmic (for xˣ), parametric dy/dx = ẏ/ẋ.

</div>
