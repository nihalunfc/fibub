---
title: 'Vectors: question types and traps'
seoTitle: 'Vectors JEE questions: types and traps'
summary: 'Every way entrance exams ask about vectors: magnitudes and unit vectors, section formula and collinearity, dot product with angles, projections and work, cross product with areas, scalar triple product with volumes and coplanarity, vector triple product, vector equations and reciprocal systems, each with a method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'If |a| = 3, |b| = 4 and a · b = 6, the angle between them is:'
    choices: ['30°', '45°', '60°', '90°']
    ans: 2
    why: 'cos θ = 6/(3 × 4) = 1/2, so θ = 60°.'
  - q: '[i j k] equals:'
    choices: ['0', '1', '−1', '3']
    ans: 1
    why: 'i · (j × k) = i · i = 1: the unit cube has volume 1.'
  - q: 'If |a × b| = 4 and a · b = 3, then |a||b| is:'
    choices: ['5', '7', '12', '25']
    ans: 0
    why: 'Lagrange: |a|²|b|² = 16 + 9 = 25, so |a||b| = 5.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Vector algebra; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 12 · about 26 minutes.** Read [Vectors](/learn/courses/engineering-entrance/vectors/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Vector questions reward working with the vectors as whole objects: expand |a + b|², use [a b c] properties, apply "bac minus cab". Breaking everything into components is always possible but often three times longer.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Magnitude, unit vectors, direction cosines.</b> <i>Trap:</i> a vector of length 5 along a means 5â, not 5a.</div>
<div class="step"><b>2. Section formula, collinear points, medians.</b> <i>Trap:</i> mixing up which ratio part goes with which end.</div>
<div class="step"><b>3. Dot product.</b> Angles, perpendicularity, |a ± b|² expansions. <i>Method:</i> square the magnitude and expand.</div>
<div class="step"><b>4. Projection and work.</b> (a · b)/|a|; F · d. <i>Trap:</i> projecting the wrong vector onto the wrong one.</div>
<div class="step"><b>5. Cross product and area.</b> Triangle ½|AB × AC|, parallelogram from diagonals ½|d₁ × d₂|, unit normal. <i>Trap:</i> forgetting the ½ for triangles.</div>
<div class="step"><b>6. Scalar triple product.</b> Volume, coplanarity, a parameter that makes vectors coplanar. <i>Method:</i> the 3 × 3 determinant.</div>
<div class="step"><b>7. Vector triple product and Lagrange identity.</b> "bac minus cab"; |a × b|² + (a · b)² = |a|²|b|². <i>Trap:</i> moving the brackets.</div>
<div class="step"><b>8. Vector equations and reciprocal systems.</b> Solve for r by dotting or crossing with known vectors. <i>Trap:</i> cancelling a vector.</div>
</div>

## Worked examples

**Example 1 (level 3, expansion).** |a| = 3, |b| = 4 and |a + b| = 5. Find |a − b|. *Solution.* 25 = 9 + 16 + 2a · b, so a · b = 0. Then |a − b|² = 9 + 16 − 0 = 25: **|a − b| = 5**.

**Example 2 (level 3, area).** Find the area of the triangle with vertices A(1, 1, 1), B(2, 3, 1), C(1, 2, 3). *Solution.* AB = i + 2j, AC = j + 2k. AB × AC = 4i − 2j + k, with length √21. **Area = √21/2.**

**Example 3 (level 4, coplanarity).** For which λ are i + j + k, i + 2j + 3k and 2i + λj + 4k coplanar? *Solution.* The determinant with rows (1, 1, 1), (1, 2, 3), (2, λ, 4) is 1(8 − 3λ) − 1(4 − 6) + 1(λ − 4) = 6 − 2λ. Set it to 0: **λ = 3**.

**Example 4 (level 5, triple product).** a, b, c are unit vectors, b and c are not parallel, and a × (b × c) = ½ b. Find the angles a makes with b and c. *Solution.* (a · c)b − (a · b)c = ½ b. Since b and c are independent, compare coefficients: a · c = ½ and a · b = 0. **a ⟂ b, and a makes 60° with c.**

**Example 5 (level 5, vector equation).** Find r if r × b = c × b and r · a = 0, where a = i + j + 2k, b = i + k, c = 2i − j. *Solution.* (r − c) × b = 0, so r = c + tb. Dot with a: c · a + t(b · a) = 0, that is 1 + 3t = 0 and t = −1/3. **r = (5i − 3j − k)/3.** Check: r · a = 5/3 − 1 − 2/3 = 0.

<div class="myth">

**"[a b c] = 0 means one of the vectors is zero."** It means the three arrows lie in one plane, so the box they span is flat. Three nonzero vectors such as i, j and i + j have a zero triple product.

</div>

<div class="meaning">
<dl>
<dt>[a b c]</dt><dd>a · (b × c), the signed volume</dd>
<dt>bac − cab</dt><dd>a × (b × c) = b(a · c) − c(a · b)</dd>
<dt>Lagrange</dt><dd>|a × b|² + (a · b)² = |a|²|b|²</dd>
<dt>Physical meaning</dt><dd>Dot: how aligned. Cross: how spread, as an area with a direction. Triple: how much space three arrows enclose.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="vectors" data-mode="practice"></div>

<div class="keypoints">

- Expand |a ± b|² = |a|² + |b|² ± 2a · b instead of finding components.
- Triangle area ½|AB × AC|; parallelogram from diagonals ½|d₁ × d₂|.
- Coplanar or linearly dependent: [a b c] = 0; tetrahedron volume = |[a b c]|/6.
- a × (b × c) = (a · c)b − (a · b)c; then compare coefficients of independent vectors.
- Vector equations: rewrite as (r − c) × b = 0 ⇒ r = c + tb, then use the other condition.
- Lagrange identity links |a × b| and a · b without the angle.

</div>
