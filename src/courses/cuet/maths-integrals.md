---
title: 'Maths: integrals'
seoTitle: 'Integrals for CUET Maths: substitution, parts, definite'
summary: 'Integration as reverse differentiation, the standard formulas, substitution, partial fractions, integration by parts, definite integrals as area, and the properties that turn hard definite integrals into easy ones, with a live problem.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: '∫ x eˣ dx equals:'
    choices: ['eˣ(x − 1) + C', 'x eˣ + C', 'eˣ(x + 1) + C']
    ans: 0
    why: 'By parts with u = x, dv = eˣdx: x eˣ − ∫eˣdx = eˣ(x − 1) + C. Check by differentiating.'
  - q: '∫ from −a to a of an odd function is:'
    choices: ['0', '2∫₀ᵃ f(x)dx', 'a']
    ans: 0
    why: 'The area to the left of 0 is the negative of the area to the right, so they cancel.'
  - q: '∫ 1/(1 + x²) dx equals:'
    choices: ['tan⁻¹x + C', 'ln(1 + x²) + C', 'sin⁻¹x + C']
    ans: 0
    why: 'Because the derivative of tan⁻¹x is 1/(1 + x²).'
sources:
  - 'NCERT, Mathematics Part II (Class 12), Integrals'
  - 'National Testing Agency, CUET (UG) Mathematics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 8 · about 26 minutes.** The biggest maths chapter. By the end you will choose the right technique for any integral and evaluate definite integrals with their properties. Read first: [continuity and differentiability](/learn/courses/cuet/maths-continuity/), because integration runs differentiation backwards.

<div class="bigidea">Integration answers "what did I differentiate to get this?" and, for a definite integral, "how much area is under this curve?" The fundamental theorem says those two questions have the same answer.</div>

**Everyday picture:** a car's speed graph. The area under it between 2 pm and 3 pm is the distance covered in that hour. Integrating speed gives distance, just as differentiating distance gave speed.

## 1. Choosing a technique

<div class="steps" data-title="Which method?">
<div class="step"><b>Standard form?</b> Use the table: ∫xⁿ = xⁿ⁺¹/(n + 1), ∫1/x = ln|x|, ∫eˣ = eˣ, ∫sin x = −cos x, ∫1/√(1 − x²) = sin⁻¹x.</div>
<div class="step"><b>A function and its derivative together?</b> Substitute: ∫2x cos(x²)dx, put t = x².</div>
<div class="step"><b>A rational function?</b> Split into partial fractions: 1/((x − 1)(x + 2)) = (1/3)[1/(x − 1) − 1/(x + 2)].</div>
<div class="step"><b>A product of two different kinds</b> (x eˣ, x sin x, ln x)? By parts: ∫u dv = uv − ∫v du. Pick u by ILATE: Inverse trig, Log, Algebraic, Trig, Exponential.</div>
<div class="step"><b>eˣ[f(x) + f′(x)]?</b> The answer is eˣf(x) + C at once.</div>
</div>

## 2. Definite integrals

```math
\int_a^b f(x)\,dx = F(b) - F(a) \qquad \int_0^a f(x)\,dx = \int_0^a f(a - x)\,dx
```

| Property | Use it when |
|---|---|
| ∫₋ₐᵃ f = 0 if f is odd; 2∫₀ᵃ f if even | limits are symmetric |
| ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a − x)dx | adding the two forms cancels the hard part (e.g. ∫₀^(π/2) sin x/(sin x + cos x) = π/4) |
| ∫ₐᵇ = ∫ₐᶜ + ∫ᶜᵇ | splitting at a point where \|x\| or a piecewise rule changes |

<div class="problem" data-problem="definite-poly"></div>

<div class="myth">

**"A definite integral is always a positive area."** Area below the x-axis counts as negative. To find the actual area, split where the curve crosses the axis and add the absolute values.

</div>

## 3. Practice

<div class="qbank" data-bank="entrance-maths" data-topics="indefinite-integrals,definite-integrals" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Learn the standard table; check any answer by differentiating.
- Substitution when a function and its derivative appear together.
- By parts with ILATE; eˣ(f + f′) → eˣf.
- Definite: F(b) − F(a); odd function on [−a, a] gives 0; use f(a − x).

</div>
