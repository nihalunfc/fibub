---
title: 'Straight lines: question types and traps'
seoTitle: 'Straight lines JEE questions: types and traps'
summary: 'Every way entrance exams test straight lines: section formula and centres of a triangle, area and collinearity, slopes and angles, forms of a line, distances, foot and image, reflection of a line, angle bisectors, families and fixed points, concurrency, locus and pairs of lines, each with its method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'The orthocentre of the triangle with vertices (0, 0), (6, 0) and (0, 8) is:'
    choices: ['(0, 0)', '(3, 4)', '(2, 8/3)', '(2, 2)']
    ans: 0
    why: 'The triangle has a right angle at the origin, and in a right triangle the altitudes meet at the right-angle vertex.'
  - q: 'For every k, the line (1 + k)x + (2 − k)y = 3 passes through:'
    choices: ['(1, 1)', '(2, 1)', '(1, 2)', '(3, 0)']
    ans: 0
    why: 'Collect k: (x + 2y − 3) + k(x − y) = 0. Both brackets vanish when x = y and x + 2y = 3, so at (1, 1).'
  - q: 'The lines given by x² − 5xy + 6y² = 0 have slopes:'
    choices: ['1/2 and 1/3', '2 and 3', '−2 and −3', '5 and 6']
    ans: 0
    why: 'Factor: (x − 2y)(x − 3y) = 0, so the lines are y = x/2 and y = x/3, with slopes 1/2 and 1/3.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Coordinate geometry; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 11 · about 26 minutes.** Read [Straight lines](/learn/courses/engineering-entrance/straight-lines/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Straight-line questions reward a sketch and the right form of the equation. Draw the points, guess the answer from the picture, then pick the form (point-slope, intercept, normal, family) that makes the algebra shortest.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Section, centroid and other centres.</b> Average for the centroid; side-weighted average for the incentre. <i>Trap:</i> weighting the incentre by the adjacent sides instead of the opposite ones.</div>
<div class="step"><b>2. Area and collinearity.</b> The shoelace formula; zero area means collinear. <i>Trap:</i> forgetting the half or the absolute value.</div>
<div class="step"><b>3. Slope and angle.</b> tan φ = |(m₁ − m₂)/(1 + m₁m₂)|. <i>Trap:</i> a vertical line has no slope; handle it separately.</div>
<div class="step"><b>4. Equation of a line.</b> Choose the form that uses the given data. <i>Trap:</i> intercept form fails for a line through the origin.</div>
<div class="step"><b>5. Distances.</b> Point to line; parallel lines after matching a and b. <i>Trap:</i> not normalising before subtracting constants.</div>
<div class="step"><b>6. Foot, image and reflection of a line.</b> The ratio formula; reflect two points of a line to reflect the line. <i>Trap:</i> the factor 2 belongs to the image, not the foot.</div>
<div class="step"><b>7. Angle bisectors.</b> Equal normalised distances, ±. <i>Trap:</i> picking the wrong sign for the acute or obtuse bisector; test with a point.</div>
<div class="step"><b>8. Families and fixed points.</b> L₁ + λL₂ = 0; collect the parameter. <i>Trap:</i> L₂ itself is not in the family L₁ + λL₂.</div>
<div class="step"><b>9. Locus.</b> Point (h, k), condition, eliminate the parameter. <i>Trap:</i> keeping parts of the curve the moving point can never reach.</div>
<div class="step"><b>10. Pair of lines.</b> ax² + 2hxy + by² = 0; a + b = 0 means perpendicular. <i>Trap:</i> sum of slopes is −2h/b, not −h/b.</div>
</div>

## Worked examples

**Example 1 (level 3, incentre).** Find the incentre of the triangle with vertices A(0, 0), B(4, 0), C(0, 3). *Solution.* The sides opposite A, B, C are a = BC = 5, b = CA = 3, c = AB = 4. Incentre = (5·0 + 3·4 + 4·0, 5·0 + 3·0 + 4·3)/12 = **(1, 1)**. Check: the inradius of a 3-4-5 triangle is 1, and the incircle touches both axes.

**Example 2 (level 4, reflection of a line).** Reflect the line x − 2y + 3 = 0 in the line y = x. *Solution.* Reflecting in y = x swaps x and y. So the image is **y − 2x + 3 = 0**, that is 2x − y − 3 = 0. For a general mirror, find where the two lines meet (that point stays fixed) and reflect one other point, then join them.

**Example 3 (level 4, distance from a family).** Find the greatest distance from the origin to a line of the family (1 + k)x + (2 − k)y = 3. *Solution.* Every line passes through the fixed point P(1, 1). The distance from O to a line through P is at most OP, reached by the line perpendicular to OP. **Greatest distance √2.**

**Example 4 (level 5, pair of lines).** Find the angle between the lines 2x² + 5xy + 2y² = 0. *Solution.* a = 2, h = 5/2, b = 2. tan φ = 2√(h² − ab)/|a + b| = 2√(25/4 − 4)/4 = 2 × (3/2)/4 = 3/4. **φ = tan⁻¹(3/4).** (Factor to check: (2x + y)(x + 2y) = 0, slopes −2 and −1/2.)

<div class="myth">

**"The farthest line of a family from a point is the one with the largest constant term."** Changing the parameter turns the line about the fixed point; nothing slides away. The greatest distance is the distance to the fixed point, reached when the line is perpendicular to the segment joining them.

</div>

<div class="meaning">
<dl>
<dt>Normal (a, b)</dt><dd>the direction perpendicular to ax + by + c = 0</dd>
<dt>Fixed point</dt><dd>the point every line of a one-parameter family passes through</dd>
<dt>Physical meaning</dt><dd>A one-parameter family of lines is usually a line turning about a pin. Find the pin, and questions about the farthest line, or the line through another point, become easy.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="straight-lines" data-mode="practice"></div>

<div class="keypoints">

- Incentre weights the vertices by the lengths of the opposite sides.
- Right triangle: orthocentre at the right angle, circumcentre at the midpoint of the hypotenuse.
- Normalise both lines before using the parallel-lines distance or the bisector formula.
- Image factor 2; foot factor 1.
- A family L₁ + λL₂ = 0 turns about a fixed point; greatest distance is to that point.
- Pair of lines: m₁ + m₂ = −2h/b, m₁m₂ = a/b, tan φ = 2√(h² − ab)/|a + b|.

</div>
