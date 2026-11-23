---
title: 'Mechanical Properties of Solids: practice questions'
seoTitle: 'Mechanical Properties of Solids Class 11 questions answers'
summary: 'Board-style practice for Class 11 Mechanical Properties of Solids: 1 to 5 mark questions, a case study and assertion-reason questions with worked answers.'
minutes: 55
updated: 2026-11-23
quiz:
  - q: 'Two wires of the same material have lengths in the ratio 1 : 2 and radii in the ratio 2 : 1. Under the same load the ratio of their extensions is:'
    choices: ['1 : 8', '1 : 4', '2 : 1', '8 : 1']
    ans: 0
    why: 'ΔL ∝ L/r². Ratio = (1/4) : (2/1) = 1/4 : 2 = 1 : 8.'
  - q: 'The bulk modulus of a liquid is large. This means the liquid is:'
    choices: ['easily compressed', 'hard to compress', 'easy to shear', 'a gas']
    ans: 1
    why: 'B = −ΔP/(ΔV/V): a large B means a large pressure is needed for a small volume change.'
  - q: 'Which quantity has the same unit as stress?'
    choices: ['strain', 'Young’s modulus', 'force', 'energy']
    ans: 1
    why: 'Y = stress/strain and strain has no unit, so Y is in pascal like stress.'
sources:
  - 'CBSE Class 11 Physics sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Physics · Chapter 8.** Read the chapter lesson, [Mechanical Properties of Solids](/learn/courses/ncert-class-11-physics/mechanical-properties-of-solids/), first. Try each question on paper before opening the answer.

<div class="bigidea">Most problems reduce to three steps: find the stress F/A (area in m²), find the strain from the modulus, then use strain = ΔL/L (or the shear or volume version). Keep every length in metres and every area in m².</div>

## How to set out a numerical

1. Write the given data in SI units (mm to m, mm² to m², GPa to Pa).
2. Write the formula in symbols: ΔL = FL/(AY), U = ½FΔL, and so on.
3. Substitute with units and give the answer with its unit.

<div class="problem" data-problem="c11p-solid-young"></div>

<div class="problem" data-problem="c11p-solid-bulk"></div>

## 1-mark questions

1. State Hooke’s law.

<details><summary>Answer</summary>Within the elastic limit, stress is directly proportional to strain.</details>

2. What is the SI unit of Young’s modulus?

<details><summary>Answer</summary>Pascal (N/m²).</details>

3. Which modulus is meaningful for a liquid?

<details><summary>Answer</summary>Only the bulk modulus (a liquid cannot support shear).</details>

4. Name one brittle material.

<details><summary>Answer</summary>Glass (or cast iron).</details>

## 2- and 3-mark questions

5. (2) Why are the cables of lifts made of many thin strands instead of one thick rod?

<details><summary>Answer</summary>A bundle of thin wires is flexible and can be wound on a drum, while having the same total cross-section and breaking force as a rod. If one strand has a flaw, the others still carry the load.</details>

6. (2) Define the elastic limit.

<details><summary>Answer</summary>The largest stress up to which a body returns to its original size and shape when the load is removed.</details>

7. (3) A steel wire of length 2 m and cross-section 1 mm² carries a load of 100 N. Find the extension. (Y = 2 × 10¹¹ Pa.)

<details><summary>Answer</summary>

ΔL = FL/(AY) = 100 × 2 / (1 × 10⁻⁶ × 2 × 10¹¹) = 200 / (2 × 10⁵) = 1 × 10⁻³ m = **1 mm**.

</details>

8. (3) Why is a deep, narrow beam used to span a gap rather than a wide, flat one of the same material and cross-section?

<details><summary>Answer</summary>

The depression of a loaded beam is `$\delta = \dfrac{Wl^3}{4bd^3Y}$`. It varies as 1/d³, so increasing the depth d reduces the bending far more than increasing the breadth b does.

</details>

## 5-mark questions

9. (5) Derive an expression for the elastic potential energy stored in a stretched wire and the energy per unit volume.

<details><summary>Answer</summary>

When the wire is stretched by l the tension is `$F = \dfrac{YA}{L}l$`. The work for a further stretch dl is F dl. Total work from 0 to ΔL:

`$U = \int_0^{\Delta L}\dfrac{YA}{L}l\,dl = \dfrac{YA}{2L}\Delta L^2 = \tfrac12 F\Delta L$`.

Dividing by the volume AL: `$u = \tfrac12\dfrac{F}{A}\dfrac{\Delta L}{L} = \tfrac12\,\text{stress}\times\text{strain} = \tfrac12 Y\,(\text{strain})^2$`.

</details>

10. (5) Draw the stress-strain curve for a ductile metal and explain its regions. Why does a metal wire that has been stretched past its yield point stay longer?

<details><summary>Answer</summary>

Sketch: a straight line from O to the proportional limit; a slightly curved part to the elastic limit; the yield point after which the strain increases with little extra stress; a rise (strain hardening) to the ultimate strength; then a fall to the fracture point (necking).

Up to the elastic limit the atoms move only slightly and return. Beyond it layers of atoms slip over one another into new positions, so when the load is removed they do not go back: a permanent set (plastic deformation) remains. The unloading line is parallel to the original straight part.

</details>

## Case-based question

A crane lifts steel girders with a cable made of 19 strands. Each strand has diameter 3 mm and breaks at a stress of 5 × 10⁸ Pa. The crane’s rule is a safety factor of 5. Take g = 10 m/s².

(a) Find the cross-section area of one strand. (b) Find the breaking force of the whole cable. (c) Find the safe load in kg. (d) Why does the rule keep the working stress far below the breaking stress?

<details><summary>Answer</summary>

(a) A = π(1.5 × 10⁻³)² = 7.07 × 10⁻⁶ m².

(b) Total area = 19 × 7.07 × 10⁻⁶ = 1.34 × 10⁻⁴ m²; breaking force = 5 × 10⁸ × 1.34 × 10⁻⁴ = 6.7 × 10⁴ N.

(c) Safe force = 6.7 × 10⁴ / 5 = 1.34 × 10⁴ N, so the mass = 1340 kg.

(d) The working stress must stay in the elastic region, so that the cable returns to its length each time, does not slowly stretch, and tolerates shocks, rust and flaws.

</details>

## Assertion and reason

Choose: (a) both true and R explains A; (b) both true, R does not explain A; (c) A true, R false; (d) A false, R true.

11. **A:** Steel is more elastic than rubber. **R:** For a given stress, steel has the smaller strain.

<details><summary>Answer</summary>(a). A high Young’s modulus (small strain for a given stress) is how elasticity is measured in physics.</details>

12. **A:** Water cannot be sheared steadily. **R:** The shear modulus of a liquid is zero.

<details><summary>Answer</summary>(a). A liquid flows under any shear stress, so it has no shear modulus.</details>

13. **A:** The stress in a wire is the same everywhere along its length when it is hanging with a load and its own weight is negligible. **R:** Stress depends on the length of the wire.

<details><summary>Answer</summary>(c). A is true (same F and A). R is false: stress = F/A does not depend on length.</details>

<div class="qbank" data-bank="ncert-class-11-physics" data-topics="mechanical-properties-of-solids" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- ΔL = FL/(AY): longer and thinner wires stretch more, stiffer material less.
- Elastic energy: U = ½FΔL, u = ½ × stress × strain.
- Safe load = (breaking stress × area) / safety factor.
- Liquids have only a bulk modulus.

</div>
