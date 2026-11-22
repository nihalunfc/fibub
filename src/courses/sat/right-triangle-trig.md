---
title: 'Right-triangle trigonometry and radians'
seoTitle: 'SAT trigonometry: SOH CAH TOA, special triangles, radians'
summary: 'Sine, cosine and tangent as side ratios, the sine and cosine of complementary angles, 30-60-90 and 45-45-90 triangles, and converting degrees to radians.'
minutes: 18
updated: 2026-11-22
quiz:
  - q: 'In a right triangle, opposite = 5, hypotenuse = 13. sin of the angle =?'
    choices: ['5/13', '12/13', '5/12']
    ans: 0
    why: 'Sine = opposite ÷ hypotenuse.'
  - q: 'If sin A = 0.6 and A and B are the two acute angles of a right triangle, cos B =?'
    choices: ['0.6', '0.8', '0.4']
    ans: 0
    why: 'The side opposite A is adjacent to B, so cos B = sin A.'
  - q: '90° in radians is:'
    choices: ['π/2', 'π', '2π']
    ans: 0
    why: '180° = π, so 90° = π/2.'
sources:
  - 'College Board, SAT Math content domains: Geometry and trigonometry, and the reference sheet built into the test (public test specifications) https://satsuite.collegeboard.org/digital'
  - 'fibub SAT question bank, right-triangle trigonometry (original questions) https://fibub.com/learn/courses/sat/right-triangle-trig/'
---

**Module 5 · about 18 minutes · read first: [5.2 Lines, angles and triangles](/learn/courses/sat/lines-angles-triangles/).** By the end you will turn any angle question in a right triangle into a ratio of two sides.

<div class="bigidea">In a right triangle, the angle decides the shape, and the shape decides the ratios of the sides. Sine, cosine and tangent are just names for three of those ratios.</div>

## 1. SOH CAH TOA

Name the sides from the angle you care about: the **opposite** side faces it, the **adjacent** side touches it (and is not the hypotenuse), and the **hypotenuse** faces the right angle.

- **S**ine = **O**pposite ÷ **H**ypotenuse
- **C**osine = **A**djacent ÷ **H**ypotenuse
- **T**angent = **O**pposite ÷ **A**djacent

<figure class="fig" data-fig="trig-triangle"><figcaption>Slide the angle: the ratios change. Slide the size: they do not. A trig ratio belongs to an angle, not to a particular triangle.</figcaption></figure>

## 2. Complementary angles

The two acute angles of a right triangle add to 90°. The side opposite one is adjacent to the other, so sin <i>A</i> = cos <i>B</i>, or sin <i>x</i>° = cos(90 − <i>x</i>)°. The SAT loves this one.

<div class="problem" data-problem="rt-g02"></div>

## 3. Special right triangles

<div class="steps">
<div class="step">Cut a square along its diagonal: two 45-45-90 triangles. With legs of 1, the diagonal is √(1 + 1) = √2. Sides: 1 : 1 : √2.</div>
<div class="step">Cut an equilateral triangle of side 2 down the middle: two 30-60-90 triangles with hypotenuse 2 and short side 1.</div>
<div class="step">The tall side is √(4 − 1) = √3. Sides: 1 : √3 : 2, with the shortest side opposite 30°.</div>
</div>

<div class="problem" data-problem="rt-g03"></div>

<div class="problem" data-problem="rt-g05"></div>

## 4. Radians

A radian measures an angle by arc length: in a circle of radius 1, an angle of 1 radian cuts off an arc of length 1. A full turn is 2π radians, so 180° = π radians. To convert, multiply degrees by π/180.

<div class="problem" data-problem="rt-g04"></div>

<div class="meaning">

<dl>
<dt>Sine of an angle</dt><dd>how tall a ramp of length 1 rises at that angle</dd>
<dt>Cosine</dt><dd>how far along the ground that ramp reaches</dd>
<dt>Tangent</dt><dd>the steepness: rise over run, the same idea as slope</dd>
<dt>Physical meaning</dt><dd>Surveyors find a mountain's height without climbing it: measure the angle to the top and the distance to its base, then height = distance × tan(angle).</dd>
</dl>

</div>

<div class="myth">

**"A bigger triangle has a bigger sine."** Sine is a ratio; scaling both sides leaves it unchanged. Only the angle matters.

</div>

## Practice set

Ten questions on this lesson, from warm-up to hard, in the SAT's own formats (four options or a typed answer). Press New numbers for a fresh set; every question has a full worked solution.

<div class="qbank" data-bank="sat" data-topics="right-triangle-trig" data-exam="sat" data-n="10"></div>

<div class="keypoints">

- SOH CAH TOA, with sides named from the angle you are using.
- sin x° = cos(90 − x)°.
- 45-45-90 sides 1 : 1 : √2; 30-60-90 sides 1 : √3 : 2.
- Degrees × π/180 = radians.

</div>
