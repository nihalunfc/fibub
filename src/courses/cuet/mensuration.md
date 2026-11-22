---
title: 'Mensuration: areas and volumes'
seoTitle: 'Mensuration formulas for CUET General Test'
summary: 'Areas of triangles, rectangles, circles and trapeziums, and volumes and surface areas of cuboids, cylinders, cones and spheres, with an interactive solid, what each formula means and practice.'
minutes: 16
updated: 2026-11-22
quiz:
  - q: 'The area of a circle of radius 7 cm (π = 22/7) is:'
    choices: ['154 cm²', '44 cm²', '308 cm²']
    ans: 0
    why: πr² = 22/7 × 49 = 154. 44 cm is the circumference.
  - q: 'If the radius of a sphere doubles, its volume becomes:'
    choices: ['8 times', '4 times', '2 times']
    ans: 0
    why: Volume grows with r³, and 2³ = 8.
  - q: 'A cone and a cylinder have the same base and height. The cone''s volume is:'
    choices: ['one third of the cylinder''s', 'half the cylinder''s', 'the same']
    ans: 0
    why: Cone = ⅓πr²h, cylinder = πr²h.
sources:
  - 'National Testing Agency, CUET (UG) syllabus for the General Test (numerical ability) https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 3 · about 16 minutes.** By the end you will know every formula CUET uses, what it means, and how areas and volumes scale.

<div class="bigidea">Area is measured in squares and volume in cubes, so if every length is multiplied by k, area grows k² times and volume k³ times. That one idea answers many questions without any formula.</div>

## 1. Flat shapes

| Shape | Area | Perimeter |
|---|---|---|
| Rectangle | l × b | 2(l + b) |
| Triangle | ½ × base × height | sum of sides |
| Circle | πr² | 2πr |
| Trapezium | ½ × (sum of parallel sides) × height | sum of sides |
| Square | a² (or ½ × diagonal²) | 4a |

## 2. Solids

<figure class="fig" data-fig="shapes"><figcaption>Pick a solid and change its size. The formula and the result update together.</figcaption></figure>

<div class="problem" data-problem="cylinder-volume"></div>

<div class="meaning">

<dl>
<dt>V = πr²h (cylinder)</dt><dd>area of the circular base × height: a stack of coins</dd>
<dt>V = ⅓πr²h (cone)</dt><dd>exactly one third of the cylinder with the same base and height</dd>
<dt>V = 4/3 πr³ (sphere)</dt><dd>two thirds of the cylinder that just holds it</dd>
<dt>Physical meaning</dt><dd>doubling every length makes surfaces 4 times bigger (paint, wrapping) and volumes 8 times bigger (water, metal).</dd>
</dl>

</div>

<div class="steps" data-title="Melting and recasting">
<div class="step">A metal sphere of radius 6 cm is melted into small spheres of radius 2 cm. How many?</div>
<div class="step">Volume is conserved: the total volume stays the same.</div>
<div class="step">Number = (6/2)³ = 27. The 4/3 π cancels, so never compute it.</div>
</div>

<div class="myth">

**"Doubling the radius doubles the volume."** Volume depends on r³ for a sphere and r² for a cylinder of fixed height, so doubling the radius multiplies them by 8 and 4.

</div>

## 3. Practice

<div class="qbank" data-bank="cuet-general-test" data-topics="mensuration" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Areas scale with k², volumes with k³.
- Cylinder πr²h, cone ⅓πr²h, sphere 4/3πr³.
- Melting and recasting keeps volume the same: ratios of cubes.
- With π = 22/7, radii in multiples of 7 give whole-number answers.

</div>
