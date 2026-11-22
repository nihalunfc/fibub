---
title: Vectors
seoTitle: 'Vectors: JEE maths'
summary: 'Vectors and their components, magnitude, unit vectors and direction cosines, the section formula, collinear and coplanar points, the dot product with angle, projection and work, the cross product with area, scalar and vector triple products, Lagrange identity, linear independence, angle bisectors and vector equations.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'For a = i + 2j + 2k, the magnitude |a| is:'
    choices: ['5', '3', '√5', '9']
    ans: 1
    why: '|a| = √(1 + 4 + 4) = √9 = 3.'
  - q: 'If a · b = 0 and neither vector is zero, then:'
    choices: ['a is parallel to b', 'a is perpendicular to b', 'a = b', 'a × b = 0']
    ans: 1
    why: 'a · b = |a||b|cos θ = 0 with nonzero lengths forces cos θ = 0, so θ = 90°.'
  - q: 'The area of the parallelogram with sides a and b is:'
    choices: ['a · b', '|a × b|', '½|a × b|', '|a||b|']
    ans: 1
    why: '|a × b| = |a||b|sin θ, which is base × height for the parallelogram. Half of it is the triangle.'
sources:
  - 'NCERT Mathematics Class 12 (Vector algebra): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Vector algebra'
---

**Maths · Class 12 · about 36 minutes.** By the end you will be able to work with vectors in components, use the section formula, compute and interpret dot and cross products, find areas, volumes, projections and angles, and simplify triple products, up to the vector-equation questions of JEE Advanced.

<div class="bigidea">A vector is an arrow: a size and a direction. The dot product asks "how much do two arrows point the same way?" and gives a number. The cross product asks "how much do they spread apart?" and gives a new arrow at right angles to both, whose length is the area they span. Almost every vector question is one of these two questions in disguise.</div>

## 1. Components, magnitude and direction

With unit vectors i, j, k along the axes, a = a₁i + a₂j + a₃k and `$|\vec a| = \sqrt{a_1^2 + a_2^2 + a_3^2}$`. The **unit vector** along a is â = a/|a|. The position vector of B relative to A is AB = (position of B) − (position of A).

**Direction cosines** are l = a₁/|a|, m = a₂/|a|, n = a₃/|a|, the cosines of the angles a makes with the axes, and l² + m² + n² = 1. Any multiples (a₁, a₂, a₃) are **direction ratios**.

Two vectors are **parallel** when one is a multiple of the other (components in the same ratio).

## 2. Section formula, collinear and coplanar

The point dividing AB in the ratio m : n has position vector

```math
\vec r = \frac{m\vec b + n\vec a}{m + n} \ \text{(internal)}, \qquad \vec r = \frac{m\vec b - n\vec a}{m - n} \ \text{(external)}
```

The midpoint is (a + b)/2 and the centroid of a triangle is (a + b + c)/3. Three points A, B, C are **collinear** when AB is parallel to AC. Four points are **coplanar** when the three edge vectors from one of them have a zero scalar triple product (section 5).

**Angle bisector.** The internal bisector of the angle between a and b points along â + b̂ (the sum of the unit vectors); the external along â − b̂.

## 3. The dot product

```math
\vec a \cdot \vec b = |\vec a||\vec b|\cos\theta = a_1b_1 + a_2b_2 + a_3b_3
```

<div class="meaning">
<dl>
<dt>θ</dt><dd>the angle between a and b when placed tail to tail, from 0 to π</dd>
<dt>a · b &gt; 0, = 0, &lt; 0</dt><dd>acute, perpendicular, obtuse</dd>
<dt>Projection of b on a</dt><dd>(a · b)/|a|: the signed length of b's shadow along a; the vector projection is ((a · b)/|a|²) a</dd>
<dt>a · a</dt><dd>|a|²</dd>
<dt>Physical meaning</dt><dd>The dot product measures how much one arrow helps the other. Work done by a force F over a displacement d is F · d: only the part of the force along the motion does work.</dd>
</dl>
</div>

Useful expansions: |a + b|² = |a|² + |b|² + 2a · b. If |a + b| = |a − b|, then a · b = 0. The triangle inequality |a + b| ≤ |a| + |b| holds, with equality only when a and b point the same way.

Drag the tips of a and b, then press 'Make perpendicular'.

<figure class="fig" data-fig="@math-vec-projection"><figcaption>Notice that the shadow of a on b has length |a|cos θ, that a·b = |b| times that shadow, and that the leftover part is perpendicular to b.</figcaption></figure>

<figure class="fig" data-fig="vec-products"><figcaption>The thick bar along a is the projection of b on a; a · b is |a| times it. The shaded parallelogram has area |a × b|. One shrinks as the other grows.</figcaption></figure>

<div class="problem" data-problem="vec-angle"></div>

## 4. The cross product

```math
\vec a \times \vec b = |\vec a||\vec b|\sin\theta\,\hat n = \begin{vmatrix} \hat i & \hat j & \hat k \\ a_1 & a_2 & a_3 \\ b_1 & b_2 & b_3 \end{vmatrix}
```

n̂ is perpendicular to both a and b, in the direction a right-hand screw moves when turned from a to b. Properties: a × b = −(b × a), a × a = 0, and a × b = 0 exactly when a and b are parallel. i × j = k, j × k = i, k × i = j.

- Area of a parallelogram with sides a, b: |a × b|. With diagonals d₁, d₂: ½|d₁ × d₂|.
- Area of triangle ABC: ½|AB × AC|.
- A unit vector perpendicular to both a and b: ±(a × b)/|a × b|.

**Lagrange identity**: `$|\vec a \times \vec b|^2 + (\vec a \cdot \vec b)^2 = |\vec a|^2|\vec b|^2$`, which is just sin²θ + cos²θ = 1. The figure's readout checks it live.

<div class="myth">

**"a × b = a × c means b = c."** It only means a × (b − c) = 0, so b − c is parallel to a. Likewise a · b = a · c only says b − c is perpendicular to a. You cannot cancel a vector from a product. If both a · b = a · c and a × b = a × c hold (with a ≠ 0), then b = c.

</div>

## 5. Scalar triple product

```math
[\vec a\ \vec b\ \vec c] = \vec a \cdot (\vec b \times \vec c) = \begin{vmatrix} a_1 & a_2 & a_3 \\ b_1 & b_2 & b_3 \\ c_1 & c_2 & c_3 \end{vmatrix}
```

Its absolute value is the **volume of the parallelepiped** with edges a, b, c; a tetrahedron is one sixth of that. It is unchanged by a cyclic shift ([a b c] = [b c a] = [c a b]), changes sign when two vectors swap, and is zero when two vectors are equal or when all three are **coplanar**. Three vectors are linearly independent exactly when [a b c] ≠ 0, and then every vector is a combination xa + yb + zc.

Results to know: [a + b, b + c, c + a] = 2[a b c]; [a × b, b × c, c × a] = [a b c]².

<div class="problem" data-problem="vec-volume"></div>

## 6. Vector triple product

```math
\vec a \times (\vec b \times \vec c) = (\vec a \cdot \vec c)\,\vec b - (\vec a \cdot \vec b)\,\vec c
```

Memory aid: "bac minus cab" (b(a · c) − c(a · b)). The answer lies in the plane of b and c. The bracket matters: (a × b) × c is generally different, and lies in the plane of a and b.

<div class="problem" data-problem="vec-proj"></div>

## 7. JEE Advanced level: vector equations and reciprocal systems

**Solving for an unknown vector.** For r × a = b × a, write (r − b) × a = 0, so r = b + ta. If also r · c = 0, fix t: t = −(b · c)/(a · c). Strategy: take the dot or cross of the given equation with a well-chosen known vector to kill unknown terms.

**Reciprocal system.** For non-coplanar a, b, c, define a′ = (b × c)/[a b c] and similarly b′, c′. Then a · a′ = 1 and a · b′ = 0, and [a′ b′ c′] = 1/[a b c].

**Gram determinant.** [a b c]² equals the determinant of the 3 × 3 matrix of all dot products (a · a, a · b, …). It gives the volume when only lengths and angles are known.

**Minimum distance and skew lines.** The shortest distance between the lines r = a₁ + λb₁ and r = a₂ + μb₂ is |(a₂ − a₁) · (b₁ × b₂)|/|b₁ × b₂|: project the joining vector onto the common perpendicular. More on this in three-dimensional geometry.

Next: [Vectors: question types and traps](/learn/courses/engineering-entrance/vectors-questions/).

<div class="keypoints">

- |a| = √(a₁² + a₂² + a₃²); â = a/|a|; direction cosines satisfy l² + m² + n² = 1.
- Section formula (mb + na)/(m + n); centroid (a + b + c)/3; bisector along â + b̂.
- a · b = |a||b|cos θ = Σaᵢbᵢ; zero means perpendicular; projection of b on a = a · b/|a|.
- |a × b| = |a||b|sin θ = parallelogram area; zero means parallel; triangle = half.
- [a b c] = determinant = signed volume; zero means coplanar; tetrahedron = 1/6 of it.
- a × (b × c) = (a · c)b − (a · b)c.
- Never cancel a vector from a dot or cross product.

</div>
