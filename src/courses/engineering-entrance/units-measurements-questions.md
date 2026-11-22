---
title: 'Units, dimensions and errors: question types and traps'
seoTitle: 'Units and dimensions questions for JEE and NEET'
summary: 'Every way entrance exams ask about units, dimensions and errors, from same-dimension pairs to finding the dimensions of constants in strange formulae, error propagation and vernier readings, each with a worked method and the trap it sets. Then practise.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'In v = at + b/(t + c), v is a velocity and t a time. The dimensions of b are:'
    choices: ['[L]', '[LT⁻¹]', '[LT⁻²]', '[T]']
    ans: 0
    why: 'c is added to t, so [c] = [T]. b/(t + c) is a velocity, so [b] = [LT⁻¹][T] = [L].'
  - q: 'Which pair has different dimensions?'
    choices: ['Planck constant and angular momentum', 'Impulse and momentum', 'Moment of inertia and moment of force', 'Stress and pressure']
    ans: 2
    why: 'Moment of inertia is [ML²]; moment of force (torque) is [ML²T⁻²]. The other pairs match.'
  - q: 'A cube''s side is measured with 2% error. The maximum error in its volume is:'
    choices: ['2%', '4%', '6%', '8%']
    ans: 2
    why: 'V = a³, so the percentage error is 3 × 2% = 6%.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Units and measurements; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 11 · about 25 minutes.** Read the lesson [Units, dimensions and errors](/learn/courses/engineering-entrance/units-measurements/) first. Here you meet every question type, with a worked example and the trap, then practise from the bank.

<div class="bigidea">Almost every question in this chapter is one of eight types. Learn the method for each, and the chapter becomes some of the fastest marks in the paper.</div>

## The eight question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Same or different dimensions.</b> "Which pair has the same dimensions?" <i>Method:</i> reduce each to [M L T A] using a defining formula. <i>Trap:</i> look-alike pairs: moment of inertia [ML²] vs torque [ML²T⁻²], surface tension [MT⁻²] vs surface energy per area (same!), stress vs strain (strain is dimensionless).</div>
<div class="step"><b>2. Dimensions of a constant in a formula.</b> "In P = a/b · e^(−bx/kT) find [a]." <i>Method:</i> exponents, angles and logs are dimensionless; added terms have equal dimensions. Fix the constants from the inside out.</div>
<div class="step"><b>3. Check or choose a formula.</b> "Which could be the speed of a wave on a string?" <i>Method:</i> test each option's dimensions. <i>Trap:</i> two options may pass; the question then needs physics (a heavier string carries slower waves).</div>
<div class="step"><b>4. Derive a relation.</b> "If time depends on G, h and c, find the expression." <i>Method:</i> T = k G^a h^b c^c, match powers of M, L, T. Gives Planck time ∝ √(Gh/c⁵).</div>
<div class="step"><b>5. New system of units.</b> "If force, length and time are the base units, what are the dimensions of mass?" or "the unit of energy becomes ...". <i>Method:</i> write the old base quantities in terms of the new ones and substitute.</div>
<div class="step"><b>6. Significant figures and rounding.</b> <i>Method:</i> least significant figures for × and ÷, least decimal places for + and −. <i>Trap:</i> trailing zeros without a decimal point.</div>
<div class="step"><b>7. Error propagation.</b> <i>Method:</i> powers multiply percentage errors; everything adds. <i>Trap:</i> square roots halve the error; subtraction still adds absolute errors; a constant (π, 4) has no error.</div>
<div class="step"><b>8. Instrument readings.</b> Vernier, screw gauge, least count, zero error, and "which instrument gives the least error". <i>Trap:</i> the sign of the zero error; counting circular divisions below the line.</div>
</div>

## Worked examples

**Example 1 (level 2, same dimensions).** Which has the same dimensions as `$\dfrac{1}{2}\varepsilon_0 E^2$` (ε₀ permittivity, E electric field)? (a) force (b) pressure (c) power (d) momentum.

*Solution.* `$\tfrac12 \varepsilon_0 E^2$` is the energy stored per unit volume of an electric field, and energy/volume = `$[ML^2T^{-2}]/[L^3] = [ML^{-1}T^{-2}]$`, the dimensions of pressure. **Answer (b).** *Trap:* trying to multiply out ε₀ and E from scratch wastes a minute; recognise energy density.

**Example 2 (level 3, constants in a formula).** The van der Waals equation is `$\left(P + \dfrac{a}{V^2}\right)(V - b) = RT$`. Find the dimensions of a/b.

*Solution.* b is subtracted from V, so `$[b] = [L^3]$`. `$a/V^2$` is added to P, so `$[a] = [P][V^2] = [ML^{-1}T^{-2}][L^6] = [ML^5T^{-2}]$`. Then `$[a/b] = [ML^2T^{-2}]$`, the dimensions of energy. **Answer: [ML²T⁻²].**

**Example 3 (level 3, assertion-reason).** A: A dimensionally correct equation is always physically correct. R: Dimensional analysis cannot find dimensionless constants.

*Solution.* A is false (`$s = ut + at^2$` is dimensionally correct but wrong; the ½ is missing). R is true. **Answer: A false, R true.**

**Example 4 (level 4, new units).** If the speed of light c, the Planck constant h and the gravitational constant G are taken as base units, what are the dimensions of mass?

*Solution.* Let `$M = c^x h^y G^z$`. Dimensions: `$[LT^{-1}]^x [ML^2T^{-1}]^y [M^{-1}L^3T^{-2}]^z$`. M: y − z = 1. L: x + 2y + 3z = 0. T: −x − y − 2z = 0. Solving: y = z + 1, then x = −y − 2z = −3z − 1, and L gives −3z − 1 + 2z + 2 + 3z = 0, so z = −½, y = ½, x = ½. **Mass ∝ √(ch/G)**, the Planck mass.

**Example 5 (level 3, errors with a square root).** The period of a pendulum is `$T = 2\pi\sqrt{L/g}$`. L has 2% error and g is known exactly. What is the error in T?

*Solution.* `$T \propto L^{1/2}$`, so the error is ½ × 2% = **1%**. *Trap:* answering 2% or 4%.

**Example 6 (level 4, screw gauge with zero error).** A screw gauge has pitch 0.5 mm and 50 circular divisions. With the jaws closed, the 3rd division is on the reference line, with the circular zero below the line. A wire reads 2 main-scale divisions (of 0.5 mm) and 27 circular divisions. Find the diameter.

*Solution.* Least count = 0.5/50 = 0.01 mm. Zero error is positive: +3 × 0.01 = +0.03 mm. Reading = 2 × 0.5 + 27 × 0.01 = 1.27 mm. Diameter = 1.27 − 0.03 = **1.24 mm**. *Trap:* adding the zero error instead of subtracting it.

<div class="myth">

**"If the units on both sides match, I can stop checking."** Matching dimensions only rules wrong formulae out; it never rules a formula in. When two options pass, use a limiting case: what happens if a mass is zero, an angle is 90°, or a length is very large?

</div>

<div class="meaning">
<dl>
<dt>Inside-out rule</dt><dd>first make exponents, sines and logs dimensionless, then match the terms that are added</dd>
<dt>Error rule</dt><dd>percentage error of A^p B^q / C^r = p(%A) + q(%B) + r(%C)</dd>
<dt>Physical meaning</dt><dd>Units are a built-in check that nature gives you for free; every question in this chapter is a way of using that check.</dd>
</dl>
</div>

## Practise

The set below starts at level 1 and climbs to level 5. It includes every format: single answer, multi-correct, numerical, assertion-reason, statements, matching lists and passages. Number questions marked as templates give new values each time you press "New numbers".

<div class="qbank" data-bank="entrance-physics" data-topics="units-measurements" data-mode="practice"></div>

<div class="keypoints">

- Eight types: same dimensions, constants in a formula, checking formulae, deriving relations, new unit systems, significant figures, error propagation, instrument readings.
- Work inside-out: exponents and logs are dimensionless; added terms share dimensions.
- Dimensional correctness is necessary, never sufficient.
- Powers multiply percentage errors; square roots halve them; everything adds.
- Zero error: positive when the circular zero is below the line; subtract it from the reading.

</div>
