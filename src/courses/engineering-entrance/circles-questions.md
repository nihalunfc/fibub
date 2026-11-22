---
title: 'Circles: question types and traps'
seoTitle: 'Circles JEE questions: types and traps'
summary: 'Every way entrance exams test circles: centre and radius, diameter form, circles touching the axes, chord length, tangents at and from a point, tangent length, chord of contact and chord with a midpoint, angle between tangents, director circle, nearest and farthest points, common tangents, orthogonal circles, radical axis and locus, each with its method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'The length of the tangent from (5, 1) to x² + y² + 6x − 4y − 3 = 0 is:'
    choices: ['7', '√56', '√72', '8']
    ans: 0
    why: 'S₁ = 25 + 1 + 6(5) − 4(1) − 3 = 49, and the tangent length is √S₁ = 7.'
  - q: 'The circles x² + y² + 2x + 2ky + 6 = 0 and x² + y² + 2ky + k = 0 cut orthogonally when k is:'
    choices: ['2 or −3/2', '−2 or 3/2', '1 or 6', '0']
    ans: 0
    why: '2g₁g₂ + 2f₁f₂ = c₁ + c₂ with g₁ = 1, f₁ = k, c₁ = 6, g₂ = 0, f₂ = k, c₂ = k: 2k² = 6 + k, so 2k² − k − 6 = 0, k = 2 or −3/2.'
  - q: 'The chord of x² + y² = 25 with midpoint (1, 2) lies on the line:'
    choices: ['x + 2y = 5', '2x + y = 4', 'x − 2y = 0', 'x + 2y = 25']
    ans: 0
    why: 'T = S₁: x(1) + y(2) − 25 = 1 + 4 − 25, so x + 2y = 5.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Coordinate geometry (circles); question patterns studied from published papers (no questions copied)'
---

**Maths · Class 11 · about 26 minutes.** Read [Circles](/learn/courses/engineering-entrance/circles/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Turn every circle condition into a distance from the centre and compare it with the radius. Tangent: distance equals r. Chord: use the right triangle of r, p and half the chord. Two circles: compare the distance between centres with the sum and difference of radii.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Centre and radius.</b> Divide by the x² coefficient, then (−g, −f) and √(g² + f² − c). <i>Trap:</i> reading g as the coefficient of x instead of half of it.</div>
<div class="step"><b>2. Circle from conditions.</b> Diameter form, three points, touching axes, centre on a line. <i>Trap:</i> "touches the x-axis" means |k| = r, so there are often two answers.</div>
<div class="step"><b>3. Chord length and intercepts.</b> 2√(r² − p²); axis intercepts 2√(g² − c) and 2√(f² − c). <i>Trap:</i> forgetting the factor 2.</div>
<div class="step"><b>4. Tangent conditions.</b> Distance from the centre equals r; c² = a²(1 + m²). <i>Trap:</i> missing a vertical tangent, which has no slope.</div>
<div class="step"><b>5. Tangents from a point and their length.</b> √S₁. <i>Trap:</i> using S₁ before dividing the equation by the x² coefficient.</div>
<div class="step"><b>6. Chord of contact and chord with a midpoint.</b> T = 0 and T = S₁. <i>Trap:</i> swapping the two.</div>
<div class="step"><b>7. Angle between tangents and director circle.</b> tan(θ/2) = r/√S₁; x² + y² = 2a². <i>Trap:</i> using θ instead of θ/2.</div>
<div class="step"><b>8. Nearest and farthest points.</b> Along the line through the centre: d − r and d + r. <i>Trap:</i> |d − r| when P is inside.</div>
<div class="step"><b>9. Two circles.</b> Common tangents from d versus r₁ ± r₂; orthogonality; radical axis S₁ − S₂ = 0. <i>Trap:</i> both equations must be in standard form before subtracting.</div>
<div class="step"><b>10. Families and locus.</b> S + λL = 0, S₁ + λS₂ = 0; locus of a moving centre or midpoint. <i>Trap:</i> the family S₁ + λS₂ never gives S₂ itself.</div>
</div>

## Worked examples

**Example 1 (level 3, touching axes).** Find the circles of radius 3 that touch both axes and have centre in the fourth quadrant. *Solution.* Centre (3, −3): **(x − 3)² + (y + 3)² = 9**. Without the quadrant there would be four such circles.

**Example 2 (level 4, locus of a midpoint).** Find the locus of the midpoints of chords of x² + y² = a² that pass through the fixed point (p, q). *Solution.* For midpoint (h, k), the chord is T = S₁: hx + ky = h² + k². It passes through (p, q): hp + kq = h² + k². **Locus x² + y² − px − qy = 0**, a circle on the segment from the origin to (p, q) as diameter.

**Example 3 (level 4, angle between tangents).** From a point on x² + y² = 4, tangents are drawn to x² + y² = 1. Find the angle between them. *Solution.* S₁ = 4 − 1 = 3, so tan(θ/2) = r/√S₁ = 1/√3, θ/2 = 30°. **θ = 60°.** Every point of the outer circle sees the inner circle under the same angle.

**Example 4 (level 5, common tangents and radical axis).** For S₁: x² + y² − 4x − 6y + 9 = 0 and S₂: x² + y² + 2x + 2y − 7 = 0, decide their position and find their common chord. *Solution.* Centres (2, 3) and (−1, −1), radii 2 and 3, d = 5 = r₁ + r₂. They **touch externally** (3 common tangents). S₁ − S₂ = 0 gives −6x − 8y + 16 = 0, that is **3x + 4y = 8**: here the radical axis is the common tangent at the point of contact.

<div class="myth">

**"Subtracting two circle equations always gives their common chord."** Only when the circles meet in two points. If they touch, it gives the common tangent at the contact point; if they do not meet, it is still the radical axis, a line of equal tangent lengths that the circles never reach.

</div>

<div class="meaning">
<dl>
<dt>d</dt><dd>distance between the centres of two circles</dd>
<dt>S₁ − S₂ = 0</dt><dd>radical axis: points with equal tangent lengths to both circles</dd>
<dt>Physical meaning</dt><dd>Two circles are just two distances. Compare d with r₁ + r₂ and |r₁ − r₂| and you know how they sit, how many tangents they share and whether they meet.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="circles" data-mode="practice"></div>

<div class="keypoints">

- Standard form first (x² and y² coefficient 1), then read g, f, c.
- Tangent ⇔ distance from centre = r; chord = 2√(r² − p²).
- T = 0: tangent at a point on the circle, chord of contact from outside. T = S₁: chord with given midpoint.
- tan(θ/2) = r/√S₁ for the angle between tangents; director circle x² + y² = 2a².
- Common tangents 4, 3, 2, 1, 0 as d moves from apart to inside.
- Locus of chord midpoints through a fixed point: a circle on the segment to the centre as diameter.

</div>
