---
title: 'Maths: areas and differential equations'
seoTitle: 'Area under curves and differential equations for CUET'
summary: 'Areas bounded by curves and lines using definite integrals, then the order and degree of a differential equation and how to solve variable separable, homogeneous and linear first-order equations, with a live area animation.'
minutes: 24
updated: 2026-11-22
quiz:
  - q: 'The order and degree of (d²y/dx²)³ + (dy/dx)⁴ + y = 0 are:'
    choices: ['order 2, degree 3', 'order 3, degree 2', 'order 2, degree 4']
    ans: 0
    why: 'Order is the highest derivative (second); degree is the power of that highest derivative (3).'
  - q: 'The integrating factor of dy/dx + y/x = x² is:'
    choices: ['x', 'eˣ', '1/x']
    ans: 0
    why: 'IF = e^(∫P dx) = e^(∫1/x dx) = e^(ln x) = x.'
  - q: 'The area between y = x² and y = x is:'
    choices: ['1/6', '1/3', '1/2']
    ans: 0
    why: 'They meet at 0 and 1; ∫₀¹ (x − x²) dx = 1/2 − 1/3 = 1/6.'
sources:
  - 'NCERT, Mathematics Part II (Class 12), Application of Integrals; Differential Equations'
  - 'National Testing Agency, CUET (UG) Mathematics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 8 · about 24 minutes.** By the end you will find areas between curves and solve the three kinds of first-order differential equation CUET asks. Read first: [integrals](/learn/courses/cuet/maths-integrals/).

<div class="bigidea">An area is a sum of thin strips: top curve minus bottom curve, times a tiny width, added up by an integral. A differential equation is a rule about how something changes, and solving it means finding the quantity itself.</div>

**Everyday picture:** a cup of tea cools faster when it is very hot and slower as it nears room temperature. "The rate of cooling is proportional to the temperature difference" is a differential equation; its solution is the exponential cooling curve.

## 1. Area between curves

<figure class="fig" data-fig="area-between"><figcaption>Each strip has height (line − parabola). Add them up from x = 0 to x = k and you get k³/6.</figcaption></figure>

<div class="steps" data-title="The area recipe">
<div class="step"><b>Sketch</b> both curves and shade the region.</div>
<div class="step"><b>Find where they meet</b> by setting them equal; these are the limits.</div>
<div class="step"><b>Integrate (top − bottom)</b> between the limits. Use (right − left) with dy strips if that is simpler.</div>
<div class="step"><b>Use symmetry:</b> a circle x² + y² = a² has area 4 × ∫₀ᵃ √(a² − x²)dx = πa².</div>
</div>

<div class="problem" data-problem="area-parabola-line"></div>

## 2. Differential equations

| Type | Looks like | Method |
|---|---|---|
| Variable separable | dy/dx = f(x)g(y) | ∫dy/g(y) = ∫f(x)dx |
| Homogeneous | dy/dx = F(y/x) | put y = vx, then separate v and x |
| Linear | dy/dx + Py = Q | IF = e^(∫P dx); y·IF = ∫Q·IF dx + C |

<div class="meaning">

<dl>
<dt>Order</dt><dd>the highest derivative present. The general solution has that many arbitrary constants.</dd>
<dt>Degree</dt><dd>the power of the highest derivative once the equation is a polynomial in derivatives (not defined if a derivative sits inside sin or a root that cannot be cleared).</dd>
<dt>Particular solution</dt><dd>use a given condition, like y(0) = 1, to fix the constant.</dd>
</dl>

</div>

<div class="myth">

**"Degree is the highest power of any derivative in the equation."** It is the power of the highest-order derivative only. In (y″)² + (y′)⁵ = 0 the degree is 2, not 5.

</div>

## 3. Practice

<div class="qbank" data-bank="entrance-maths" data-topics="definite-integrals,differential-equations" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Area = ∫(top − bottom)dx between meeting points.
- Order = highest derivative; degree = its power.
- Separable: split and integrate; homogeneous: y = vx.
- Linear: IF = e^(∫P dx), y·IF = ∫Q·IF dx + C.

</div>
