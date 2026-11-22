---
title: 'Matrices and determinants: question types and traps'
seoTitle: 'Matrices and determinants JEE questions: types and traps'
summary: 'Every way entrance exams ask about matrices and determinants: orders and counting, products and powers, symmetric and special matrices, determinant properties, adjoint and inverse rules, Cayley-Hamilton, consistency of systems with a parameter, and area or collinearity, each with a method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'A is 3 × 3 with |A| = 2. Then |adj(adj A)| is:'
    choices: ['4', '8', '16', '32']
    ans: 2
    why: '|adj(adj A)| = |A|^((n−1)²) = 2⁴ = 16 for n = 3.'
  - q: 'How many 2 × 2 matrices with entries from {0, 1} are symmetric?'
    choices: ['4', '6', '8', '16']
    ans: 2
    why: 'A symmetric 2 × 2 matrix is fixed by a₁₁, a₁₂ (= a₂₁) and a₂₂: three free entries, 2³ = 8 matrices.'
  - q: 'For which k does kx + y = 0, x + ky = 0 have a non-zero solution?'
    choices: ['k = 0', 'k = ±1', 'k = 2', 'no k']
    ans: 1
    why: 'A homogeneous system has a non-trivial solution when Δ = k² − 1 = 0, so k = ±1.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Matrices and determinants; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 12 · about 26 minutes.** Read [Matrices and determinants](/learn/courses/engineering-entrance/matrices-determinants/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Matrix questions reward knowing a handful of rules cold (|kA|, |adj A|, (AB)ᵀ, Cayley-Hamilton) and doing very little arithmetic. If a question looks like it needs a 3 × 3 inverse worked out in full, there is almost always a rule or a row operation that does it in two lines.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Orders and counting.</b> Possible orders for k entries; number of matrices with given entries or with a property. <i>Trap:</i> symmetric matrices have fewer free entries.</div>
<div class="step"><b>2. Products and powers.</b> Aⁿ by pattern, (I + N)ⁿ with N² = O, trace of a product. <i>Trap:</i> using the binomial theorem when the matrices do not commute.</div>
<div class="step"><b>3. Symmetric, skew and special matrices.</b> Idempotent, nilpotent, involutory, orthogonal. <i>Method:</i> use the defining rule (A² = A and so on) instead of entries.</div>
<div class="step"><b>4. Determinant properties.</b> Evaluate with row operations, factorise, solve det = 0. <i>Trap:</i> |kA| = kⁿ|A|, not k|A|.</div>
<div class="step"><b>5. Adjoint and inverse rules.</b> |adj A|, adj(adj A), |A⁻¹|, inverse of a product. <i>Trap:</i> the order n in every exponent.</div>
<div class="step"><b>6. Cayley-Hamilton and matrix equations.</b> Find A⁻¹ or A⁵ from A² − pA + qI = O.</div>
<div class="step"><b>7. Systems of equations.</b> Unique, none or infinitely many; values of a parameter; homogeneous systems. <i>Trap:</i> stopping at "all Δ = 0" without checking.</div>
<div class="step"><b>8. Geometry.</b> Triangle area, collinearity, equation of a line. <i>Trap:</i> forgetting the ½ and the modulus, or that area k gives det = ±2k.</div>
</div>

## Worked examples

**Example 1 (level 3, rules).** A is 3 × 3 with |A| = 3. Find |3 adj(2A)|. *Solution.* |2A| = 8 × 3 = 24. |adj(2A)| = 24² = 576. |3 adj(2A)| = 3³ × 576 = **15552**.

**Example 2 (level 4, Cayley-Hamilton).** A = [[2, 1], [1, 2]]. Express A⁻¹ in terms of A and I. *Solution.* tr A = 4, |A| = 3, so A² − 4A + 3I = O. Multiply by A⁻¹: A − 4I + 3A⁻¹ = O, giving **A⁻¹ = (4I − A)/3**.

**Example 3 (level 4, nilpotent power).** A = [[1, 2], [0, 1]]. Find A⁵⁰. *Solution.* A = I + N with N = [[0, 2], [0, 0]] and N² = O. I and N commute, so A⁵⁰ = I + 50N = **[[1, 100], [0, 1]]**.

**Example 4 (level 5, parameter system).** For which λ and μ does x + y + z = 6, x + 2y + 3z = 10, x + 2y + λz = μ have (a) no solution, (b) infinitely many? *Solution.* Subtract the second equation from the third: (λ − 3)z = μ − 10. If λ ≠ 3, z is fixed and there is a unique solution. If λ = 3 and μ ≠ 10, the equation reads 0 = nonzero: **no solution**. If λ = 3 and μ = 10, the third equation repeats the second: **infinitely many**.

**Example 5 (level 5, factor theorem).** Show that the determinant with rows (1, a, a²), (1, b, b²), (1, c, c²) equals (a − b)(b − c)(c − a). *Solution.* Putting a = b makes two rows equal, so (a − b) is a factor; likewise (b − c) and (c − a). The determinant has degree 3, so it is k(a − b)(b − c)(c − a). The term bc² from the main diagonal has coefficient +1 on both sides, so **k = 1**.

<div class="myth">

**"If |A| = 0 then A = O."** A singular matrix can have every entry nonzero, like [[1, 2], [2, 4]]. |A| = 0 only means the rows are dependent, so space is squashed flat.

</div>

<div class="meaning">
<dl>
<dt>n</dt><dd>order of the matrix; it appears in every power rule</dd>
<dt>Δ, Δₓ, Δᵧ, Δ_z</dt><dd>coefficient determinant, and the ones with a column replaced by the constants</dd>
<dt>Physical meaning</dt><dd>Δ = 0 means the equations' lines or planes are not independent: they either miss a common point (no solution) or share a whole line of them (infinitely many).</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="matrices-determinants" data-mode="practice"></div>

<div class="keypoints">

- |kA| = kⁿ|A|; |adj A| = |A|ⁿ⁻¹; |adj adj A| = |A|^((n−1)²); |A⁻¹| = 1/|A|.
- (I + N)ⁿ = I + nN when N² = O; check that matrices commute before expanding.
- Cayley-Hamilton (2 × 2): A² − (tr A)A + |A|I = O, then multiply by A⁻¹ or A.
- Evaluate determinants by row operations and the factor theorem, not brute force.
- Parameter systems: eliminate to one equation like (λ − 3)z = μ − 10, then read the cases.
- Area = ½|det|; an area of k means det = ±2k.

</div>
