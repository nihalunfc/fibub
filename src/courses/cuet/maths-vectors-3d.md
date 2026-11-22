---
title: 'Maths: vectors and three-dimensional geometry'
seoTitle: 'Vectors and 3D geometry for CUET Maths'
summary: 'Vectors and their components, dot and cross products with their meaning, direction cosines, and lines in space (equations, angle, shortest distance), with a live cross product area problem.'
minutes: 24
updated: 2026-11-22
quiz:
  - q: 'If a · b = 0 for non-zero vectors, they are:'
    choices: ['perpendicular', 'parallel', 'equal']
    ans: 0
    why: 'a · b = |a||b| cos θ, which is zero only when cos θ = 0, that is θ = 90°.'
  - q: '|a × b| equals:'
    choices: ['the area of the parallelogram with sides a and b', 'the dot product', 'the length of a + b']
    ans: 0
    why: '|a × b| = |a||b| sin θ = base × height of that parallelogram.'
  - q: 'Direction cosines l, m, n of any line satisfy:'
    choices: ['l² + m² + n² = 1', 'l + m + n = 1', 'lmn = 1']
    ans: 0
    why: 'They are the components of a unit vector along the line, and a unit vector has length 1.'
sources:
  - 'NCERT, Mathematics Part II (Class 12), Vector Algebra; Three Dimensional Geometry'
  - 'National Testing Agency, CUET (UG) Mathematics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 8 · about 24 minutes.** By the end you will use dot and cross products and handle lines in space, including the shortest distance between two lines.

<div class="bigidea">A vector is a length with a direction. The dot product measures how much two vectors point the same way; the cross product measures how much they spread apart, and gives a new vector at right angles to both.</div>

**Everyday picture:** pushing a door. Only the part of your push along the door's swing direction does work (dot product). The turning effect, torque, is a cross product: it depends on how far from the hinge you push and at what angle.

## 1. Products

```math
\vec a\cdot\vec b = |\vec a||\vec b|\cos\theta = a_1b_1 + a_2b_2 + a_3b_3 \qquad |\vec a\times\vec b| = |\vec a||\vec b|\sin\theta
```

<div class="meaning">

<dl>
<dt>Projection of a on b</dt><dd>(a · b)/|b|: the shadow of a along b.</dd>
<dt>a × b</dt><dd>computed as a 3 × 3 determinant with î, ĵ, k̂ in the top row. Its direction follows the right-hand rule, and b × a = −(a × b).</dd>
<dt>Areas</dt><dd>parallelogram |a × b|; triangle ½|a × b|.</dd>
</dl>

</div>

<div class="problem" data-problem="cross-area"></div>

## 2. Lines in space

| Idea | Formula |
|---|---|
| Direction cosines | l = cos α, m = cos β, n = cos γ, l² + m² + n² = 1 |
| Line through point a, direction b | r = a + λb, or (x − x₁)/b₁ = (y − y₁)/b₂ = (z − z₁)/b₃ |
| Angle between lines | cos θ = \|b₁ · b₂\| / (\|b₁\|\|b₂\|) |
| Shortest distance, skew lines | \|(a₂ − a₁) · (b₁ × b₂)\| / \|b₁ × b₂\| |
| Distance, parallel lines | \|b × (a₂ − a₁)\| / \|b\| |

<div class="steps" data-title="Shortest distance between two skew lines">
<div class="step"><b>Read off</b> a point and a direction for each line: a₁, b₁ and a₂, b₂.</div>
<div class="step"><b>Cross the directions:</b> b₁ × b₂ is perpendicular to both lines.</div>
<div class="step"><b>Join the points:</b> a₂ − a₁.</div>
<div class="step"><b>Project</b> that join onto the common perpendicular: divide the dot product by |b₁ × b₂|.</div>
<div class="step"><b>Zero distance</b> means the lines actually meet.</div>
</div>

<div class="myth">

**"a × b = b × a, like ordinary multiplication."** Swapping the order flips the direction: b × a = −a × b. The dot product, though, does not care about order.

</div>

## 3. Practice

<div class="qbank" data-bank="entrance-maths" data-topics="vectors,three-d-geometry" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- a · b = |a||b|cos θ; zero means perpendicular.
- |a × b| = area of parallelogram; triangle is half.
- l² + m² + n² = 1.
- Line: r = a + λb; skew distance = |(a₂ − a₁)·(b₁ × b₂)|/|b₁ × b₂|.

</div>
