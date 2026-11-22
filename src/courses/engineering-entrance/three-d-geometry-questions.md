---
title: 'Three-dimensional geometry: question types and traps'
seoTitle: '3D geometry JEE questions: types and traps'
summary: 'Every way entrance exams ask about three-dimensional geometry: direction cosines and ratios, equations of lines and planes, intercepts, angles between lines and planes, intersection and shortest distance of lines, distances from planes, feet of perpendiculars, images, families of planes and coplanarity, each with a method and its trap.'
minutes: 27
updated: 2026-11-22
quiz:
  - q: 'A line makes angles 60° and 45° with the x and y axes. The angle it makes with the z-axis is:'
    choices: ['30°', '45°', '60°', '90°']
    ans: 2
    why: 'cos²γ = 1 − cos²60° − cos²45° = 1 − 1/4 − 1/2 = 1/4, so cos γ = ½ and γ = 60° (or 120° for the opposite direction).'
  - q: 'The plane x/2 + y/3 + z/6 = 1 cuts the z-axis at:'
    choices: ['(0, 0, 1)', '(0, 0, 6)', '(0, 0, 1/6)', '(6, 0, 0)']
    ans: 1
    why: 'In intercept form the denominators are the intercepts. Putting x = y = 0 gives z = 6.'
  - q: 'The line (x − 1)/2 = (y + 1)/1 = z/(−2) and the plane 2x + 2y + 3z = 7 are:'
    choices: ['perpendicular', 'parallel (b · n = 0)', 'at 45°', 'the line lies in the plane']
    ans: 1
    why: 'b · n = 4 + 2 − 6 = 0, so the line is parallel to the plane. Its point (1, −1, 0) gives 2 − 2 + 0 = 0 ≠ 7, so it is not in the plane.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Three dimensional geometry; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 12 · about 27 minutes.** Read [Three-dimensional geometry](/learn/courses/engineering-entrance/three-d-geometry/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Two objects do almost all the work: the general point of a line, (x₁ + λb₁, y₁ + λb₂, z₁ + λb₃), and the normal of a plane, (a, b, c). Feet, images, intersections and distances all come from putting the general point into a condition and solving for λ.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Direction cosines and ratios.</b> From angles, from two points, l² + m² + n² = 1. <i>Trap:</i> giving ratios when cosines are asked.</div>
<div class="step"><b>2. Equation of a line.</b> Through two points, parallel to a vector, perpendicular to two lines (direction b₁ × b₂).</div>
<div class="step"><b>3. Equation of a plane and intercepts.</b> Through three points, containing a line, intercept form. <i>Method:</i> find the normal as a cross product.</div>
<div class="step"><b>4. Angles.</b> Line-line and plane-plane with cos; line-plane with sin. <i>Trap:</i> using cos for the line-plane angle.</div>
<div class="step"><b>5. Intersection and shortest distance of lines.</b> Equate general points; d formula for skew and parallel lines. <i>Trap:</i> not checking the third equation.</div>
<div class="step"><b>6. Distances from planes.</b> Point to plane, parallel planes, a parallel line to a plane. <i>Trap:</i> unequal coefficients in the parallel-plane formula.</div>
<div class="step"><b>7. Foot of the perpendicular and images.</b> In a plane (factor 1 or 2), in a line (PQ · b = 0, image 2Q − P).</div>
<div class="step"><b>8. Family of planes and coplanarity.</b> P₁ + kP₂ = 0; (a₂ − a₁) · (b₁ × b₂) = 0.</div>
</div>

## Worked examples

**Example 1 (level 3, image in a plane).** Find the image of (1, 2, 3) in the plane x + y + z = 3. *Solution.* (x − 1)/1 = (y − 2)/1 = (z − 3)/1 = −2(1 + 2 + 3 − 3)/3 = −2. **Image (−1, 0, 1).** Check: the midpoint (0, 1, 2) lies on the plane.

**Example 2 (level 4, do the lines meet?).** (x − 1)/2 = (y − 2)/3 = (z − 3)/4 and (x − 4)/5 = (y − 1)/2 = z/1. *Solution.* General points (1 + 2λ, 2 + 3λ, 3 + 4λ) and (4 + 5μ, 1 + 2μ, μ). From z: μ = 4λ + 3. From x: 2λ − 5(4λ + 3) = 3, so λ = −1 and μ = −1. Check y: 2 − 3 = −1 and 1 − 2 = −1. ✓ **They meet at (−1, −1, −1).**

**Example 3 (level 4, family of planes).** Find the plane through the origin and the line where x + y + z = 1 meets 2x + 3y − z + 4 = 0. *Solution.* (x + y + z − 1) + k(2x + 3y − z + 4) = 0. The origin gives −1 + 4k = 0, k = 1/4. Multiply by 4: **6x + 7y + 3z = 0**.

**Example 4 (level 5, image in a line).** Find the image of P(1, 6, 3) in the line x/1 = (y − 1)/2 = (z − 2)/3. *Solution.* Q = (λ, 1 + 2λ, 2 + 3λ), PQ = (λ − 1, 2λ − 5, 3λ − 1). PQ · (1, 2, 3) = 14λ − 14 = 0, so λ = 1 and the foot is Q(1, 3, 5). **Image = 2Q − P = (1, 0, 7)**; distance from the line = |PQ| = √13.

**Example 5 (level 5, shortest distance).** Lines r = (i + j) + λ(2i − j + k) and r = (2i + j − k) + μ(3i − 5j + 2k). *Solution.* a₂ − a₁ = i − k. b₁ × b₂ = (−2 + 5)i − (4 − 3)j + (−10 + 3)k = 3i − j − 7k, length √59. (a₂ − a₁) · (b₁ × b₂) = 3 + 7 = 10. **d = 10/√59.**

<div class="myth">

**"If two lines are not parallel, they meet."** In a plane, yes. In space, most pairs of non-parallel lines are skew: they pass each other at different heights, like a flyover and the road beneath it. Always check the third equation.

</div>

<div class="meaning">
<dl>
<dt>General point</dt><dd>(x₁ + λb₁, y₁ + λb₂, z₁ + λb₃) on a line</dd>
<dt>Normal</dt><dd>(a, b, c) for the plane ax + by + cz + d = 0</dd>
<dt>Foot and image factors</dt><dd>−(ax₁ + by₁ + cz₁ + d)/(a² + b² + c²), times 1 for the foot and 2 for the image</dd>
<dt>Physical meaning</dt><dd>The shortest path from a point to a plane, or between two skew lines, always meets them at right angles.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="three-d-geometry" data-mode="practice"></div>

<div class="keypoints">

- Use the general point of a line and solve for λ; it handles feet, images and intersections.
- A normal or direction perpendicular to two given directions is their cross product.
- Line-plane angle: sin φ = |b · n|/(|b||n|).
- Check the third equation before saying two lines meet.
- Parallel-plane distance needs identical x, y, z coefficients first.
- Planes through the meeting line of two planes: P₁ + kP₂ = 0.

</div>
