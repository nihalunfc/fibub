---
title: 'Circles: arcs, sectors and equations'
seoTitle: 'SAT circles: arc length, sector area, circle equations'
summary: 'Area and circumference, arcs and sectors as fractions of the circle, tangents, and the equation of a circle, including completing the square to find its centre and radius.'
minutes: 18
updated: 2026-11-22
quiz:
  - q: 'A 90° sector of a circle with radius 4 has area:'
    choices: ['4π', '16π', '8π']
    ans: 0
    why: '90/360 = 1/4 of π × 16.'
  - q: 'The circle (x − 2)² + (y + 5)² = 49 has centre:'
    choices: ['(2, −5)', '(−2, 5)', '(2, 5)']
    ans: 0
    why: 'The equation subtracts the centre: y + 5 = y − (−5).'
  - q: 'Its radius is:'
    choices: ['7', '49', '24.5']
    ans: 0
    why: 'The right side is r², so r = √49.'
sources:
  - 'College Board, SAT Math content domains: Geometry and trigonometry (public test specifications) https://satsuite.collegeboard.org/digital'
  - 'fibub SAT question bank, circles (original questions) https://fibub.com/learn/courses/sat/circles/'
---

**Module 5 · about 18 minutes · read first: [3.2 Quadratics](/learn/courses/sat/quadratics/), [5.3 Trigonometry](/learn/courses/sat/right-triangle-trig/).** By the end you will treat any arc or sector as a fraction of a circle and read a circle's centre and radius from its equation.

<div class="bigidea">An arc or sector is a slice of the circle. Its share of the whole is its central angle over 360°. Multiply that fraction by the circumference for an arc, or by the area for a sector.</div>

## 1. Circumference and area

Circumference = 2π<i>r</i> (the distance around). Area = π<i>r</i>² (the space inside). Many SAT answers are written as <i>k</i>π.

<div class="problem" data-problem="ci-g01"></div>

## 2. Arcs and sectors

<figure class="fig" data-fig="sector"><figcaption>Change the angle and radius. The arc and the sector are the same fraction, angle/360, of the circumference and the area.</figcaption></figure>

<div class="problem" data-problem="ci-g02"></div>

<div class="problem" data-problem="ci-g03"></div>

A tangent line touches the circle once and is perpendicular to the radius at that point, which often creates a right triangle for the Pythagorean theorem.

## 3. The equation of a circle

Every point (<i>x</i>, <i>y</i>) on a circle with centre (<i>h</i>, <i>k</i>) and radius <i>r</i> is distance <i>r</i> from the centre. The distance formula gives:

`$(x - h)^2 + (y - k)^2 = r^2$`

## 4. Completing the square

<div class="steps">
<div class="step">x² + y² − 6x + 4y − 12 = 0. Group the x terms and the y terms: (x² − 6x) + (y² + 4y) = 12.</div>
<div class="step">Half of −6 is −3; add 9. Half of 4 is 2; add 4. Add both to the right side too: 12 + 9 + 4 = 25.</div>
<div class="step">(x − 3)² + (y + 2)² = 25: centre (3, −2), radius <b>5</b>.</div>
</div>

<div class="problem" data-problem="ci-g04"></div>

<div class="meaning">

<dl>
<dt>Central angle</dt><dd>an angle with its corner at the centre; its arc is angle/360 of the circle</dd>
<dt>Radian link</dt><dd>arc length = radius × angle in radians, which is why radians are natural for circles</dd>
<dt>Physical meaning</dt><dd>A bicycle wheel of radius 35 cm rolls 2π × 35 ≈ 220 cm each turn: that is how a bike computer turns wheel turns into distance.</dd>
</dl>

</div>

<div class="myth">

**"(x + 3)² means the centre's x is 3."** The equation subtracts the centre, so x + 3 = x − (−3): the centre's x is −3. And the right side is r², not r.

</div>

## Practice set

Ten questions on this lesson, from warm-up to hard, in the SAT's own formats (four options or a typed answer). Press New numbers for a fresh set; every question has a full worked solution.

<div class="qbank" data-bank="sat" data-topics="circles" data-exam="sat" data-n="10"></div>

<div class="keypoints">

- Arc = (angle/360) × 2πr; sector = (angle/360) × πr².
- A tangent is perpendicular to the radius at the point of contact.
- (x − h)² + (y − k)² = r²: centre (h, k), radius r.
- Complete the square in x and y to read the centre and radius.

</div>
