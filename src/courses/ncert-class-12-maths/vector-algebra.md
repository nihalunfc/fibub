---
title: Vector Algebra
seoTitle: 'Vector Algebra Class 12 notes: dot and cross product'
summary: 'Class 12 Vector Algebra with animations: vectors, components, magnitude, direction cosines, section formula, dot product, projection, cross product and area.'
minutes: 90
updated: 2026-11-22
quiz:
  - q: 'For a = 3i + 4j + 12k, the unit vector along a is:'
    choices: ['(3i + 4j + 12k)/13', '(3i + 4j + 12k)/19', '(3i + 4j + 12k)/5', '3i + 4j + 12k']
    ans: 0
    why: '|a| = √(9 + 16 + 144) = √169 = 13. A unit vector is a divided by its magnitude.'
  - q: 'If a·b = 0 and neither a nor b is the zero vector, then a and b are:'
    choices: ['parallel', 'perpendicular', 'equal', 'opposite']
    ans: 1
    why: 'a·b = |a||b|cos θ. With non-zero lengths, cos θ = 0, so θ = 90°.'
  - q: 'The area of the parallelogram with adjacent sides a = i + j and b = j + k is:'
    choices: ['√3', '2', '1', '√2']
    ans: 0
    why: 'a × b = (1·1 − 0·1)i − (1·1 − 0·0)j + (1·1 − 1·0)k = i − j + k, and |a × b| = √3.'
sources:
  - 'NCERT Class 12 Mathematics, Chapter 10 “Vector Algebra” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Vector notation and the dot and cross products in their modern form: Gibbs, J. W., Elements of Vector Analysis (privately printed, New Haven, 1881 and 1884), and Heaviside, O., Electromagnetic Theory (1893).'
  - 'Lagrange’s identity |a × b|² = |a|²|b|² − (a·b)²: standard result in any linear algebra text, e.g. Strang, G., Introduction to Linear Algebra, 5th ed. (Wellesley-Cambridge Press, 2016), chapter 1; every worked example here was recomputed a second way (components against lengths and angles).'
---

**Maths · Class 12 · Chapter 10 · about 90 minutes.** By the end you will be able to add, subtract and scale vectors, work with components and position vectors in space, find magnitude, unit vectors and direction cosines, use the section formula, find the angle between two vectors with the dot product and the area of a parallelogram or triangle with the cross product.

<div class="bigidea">Some quantities need a direction as well as a size: the pull of a rope, a train's velocity, the wind. A vector is an arrow that carries both. Arrows add head to tail, stretch when multiplied by a number, and split into three parts along the axes. Two special products turn two arrows into something new: the dot product gives a plain number that measures how much they point the same way, and the cross product gives a new arrow at right angles to both whose length is the area they span.</div>

## 1. Scalars, vectors and the basic ideas

A **scalar** has only a size: 40 litres, ₹250, 36 °C. A **vector** has a size and a direction: a cricket ball leaving the bat at 30 m/s towards long-on, or a force of 50 N pulling a cart along the road. We draw a vector as an arrow from its **initial point** (tail) A to its **terminal point** (head) B and write `$\overrightarrow{AB}$` or a bold **a**. Its **magnitude** is the length, written `$|\vec{a}|$`.

<div class="meaning">

<dl>
<dt>Position vector</dt><dd>The vector `$\overrightarrow{OP}$` from the origin O to a point P(x, y, z): `$\vec r = x\hat i + y\hat j + z\hat k$`. Every point has exactly one.</dd>
<dt>î, ĵ, k̂</dt><dd>Unit vectors (length 1) along the x, y and z axes.</dd>
<dt>Magnitude</dt><dd>`$|\vec r| = \sqrt{x^2 + y^2 + z^2}$`, from Pythagoras applied twice.</dd>
<dt>Unit vector</dt><dd>A vector of length 1 in the direction of `$\vec a$`: `$\hat a = \vec a / |\vec a|$`.</dd>
<dt>Physical meaning</dt><dd>The components say how far to walk east, north and up. The magnitude is the straight-line distance, the way a crow flies.</dd>
</dl>

</div>

Slide the three components below, turn the picture with the slider (or drag with a mouse), and watch the length and the **direction cosines** `$l = \cos\alpha,\ m = \cos\beta,\ n = \cos\gamma$`, the cosines of the angles the vector makes with the x, y and z axes. They are `$x/|\vec r|,\ y/|\vec r|,\ z/|\vec r|$`, so `$l^2 + m^2 + n^2 = 1$` always, and `$(l, m, n)$` is the unit vector.

<figure class="fig" data-fig="c12m-vec-comp"><figcaption>A vector r = x i + y j + z k. The dashed box shows the three steps along the axes. The readout gives its length, its direction cosines and their angles, and confirms l² + m² + n² = 1.</figcaption></figure>

<div class="problem" data-problem="c12m-vec-mag"></div>

### Types of vectors

- **Zero vector** 0: magnitude 0, no direction. **Unit vector**: magnitude 1.
- **Equal vectors**: same magnitude and same direction, wherever they are drawn. A vector can slide about without changing (a **free vector**).
- **Negative** of **a**: same length, opposite direction, written −**a**.
- **Collinear (parallel) vectors**: along the same line or parallel lines; one is a scalar multiple of the other, `$\vec b = \lambda\vec a$`.
- **Co-initial vectors**: start at the same point.

<div class="myth">

**“Two vectors with the same length are equal.”** Equal vectors need the same length AND direction. A bus going north at 40 km/h and one going south at 40 km/h have equal speeds but different velocities.

</div>

### The vector between two points

For points A and B, `$\overrightarrow{AB} = \overrightarrow{OB} - \overrightarrow{OA}$`: head minus tail. Here is the method, with a worked example:

<div class="steps" data-fig="c12m-vec-unit">
<div class="step">We have A(2, −1, 3) and B(4, 1, 2). Write their position vectors.</div>
<div class="step">Head minus tail: AB = OB − OA = (4 − 2)i + (1 + 1)j + (2 − 3)k = 2i + 2j − k.</div>
<div class="step">Magnitude: |AB| = √(4 + 4 + 1) = 3.</div>
<div class="step">Divide by the magnitude to get the unit vector: (2/3)i + (2/3)j − (1/3)k.</div>
<div class="step">To get a vector of length 6 in this direction, multiply the unit vector by 6: 4i + 4j − 2k. Check: its length is √36 = 6.</div>
</div>

## 2. Adding and scaling vectors

**Triangle law.** Place the tail of **b** at the head of **a**. Then `$\vec a + \vec b$` goes from the start of **a** to the head of **b**. **Parallelogram law:** draw both from the same point; the diagonal is the sum. Either way, in components you just add:

```math
(a_1\hat i + a_2\hat j + a_3\hat k) + (b_1\hat i + b_2\hat j + b_3\hat k) = (a_1 + b_1)\hat i + (a_2 + b_2)\hat j + (a_3 + b_3)\hat k
```

Subtraction is adding the reverse: `$\vec a - \vec b = \vec a + (-\vec b)$`. Multiplying by a scalar `$\lambda$` stretches the vector by `$|\lambda|$` and reverses it when `$\lambda < 0$`: `$\lambda\vec a = (\lambda a_1)\hat i + (\lambda a_2)\hat j + (\lambda a_3)\hat k$`.

Drag the tips of **a** and **b** below. Try making them parallel, or opposite. Notice that `$|\vec a + \vec b|$` is never more than `$|\vec a| + |\vec b|$`: this is the **triangle inequality**, because one side of a triangle is never longer than the other two together.

<figure class="fig" data-fig="c12m-vec-add"><figcaption>Drag the two dots. Switch between a + b (triangle and parallelogram), a − b and k a. The readout shows the components and lengths.</figcaption></figure>

**Everyday picture.** A boat crosses a river: its own velocity across plus the current's velocity along the bank gives the real path, a vector sum. Walking 3 km east then 4 km north gives a displacement of 5 km, not 7.

<div class="history">

- **1840s:** Hamilton in Dublin invents quaternions and coins the word “vector”.
- **1880s:** Gibbs in America and Heaviside in England cut quaternions down to the dot and cross products we use today.
- **Now:** every physics engine, game and rocket guidance system works with vectors.

</div>

### Section formula

If P divides AB in the ratio `$m : n$`, the position vector of P is

```math
\vec p = \frac{n\vec a + m\vec b}{m + n}\ \text{(internally)}, \qquad \vec p = \frac{m\vec b - n\vec a}{m - n}\ \text{(externally)}
```

The mid-point is `$m = n = 1$`: `$(\vec a + \vec b)/2$`. Why does it work? P is the fraction `$m/(m+n)$` of the way from A to B, so `$\vec p = \vec a + \frac{m}{m+n}(\vec b - \vec a)$`, which simplifies to the formula. Move A and B, change the ratio, and flip between internal and external:

<figure class="fig" data-fig="c12m-vec-section"><figcaption>P divides AB in the ratio m : n. Internally P is between A and B; externally it lies on the line AB outside the segment, on the side of the bigger number.</figcaption></figure>

<div class="problem" data-problem="c12m-vec-section"></div>

<div class="myth">

**“The ratio m : n gives (m a + n b)/(m + n).”** The weights are crossed: the point closer to B (larger m) uses m on **b**, so `$\vec p = (n\vec a + m\vec b)/(m+n)$`. Test with m = 3, n = 1: P should be 3/4 of the way to B.

</div>

## 3. The scalar (dot) product

The **dot product** of two vectors with angle `$\theta$` between them (0° ≤ θ ≤ 180°, tails together) is a number:

```math
\vec a\cdot\vec b = |\vec a||\vec b|\cos\theta = a_1b_1 + a_2b_2 + a_3b_3
```

The first form is the definition; the second follows because `$\hat i\cdot\hat i = 1$` and `$\hat i\cdot\hat j = 0$` and so on. Rules: it is commutative, `$\vec a\cdot\vec a = |\vec a|^2$`, `$\vec a\cdot(\vec b + \vec c) = \vec a\cdot\vec b + \vec a\cdot\vec c$`, and **`$\vec a\cdot\vec b = 0$` exactly when the vectors are perpendicular** (neither being zero).

<div class="meaning">

<dl>
<dt>a·b</dt><dd>A single number, positive when the angle is acute, zero at 90°, negative when obtuse.</dd>
<dt>|a| cos θ</dt><dd>The **projection** (shadow) of **a** on the direction of **b**.</dd>
<dt>Physical meaning</dt><dd>Work. Only the part of the force along the motion does work: W = F·d = F d cos θ.</dd>
</dl>

</div>

The angle between two vectors comes from rearranging the definition. Here is the method on a worked example:

<div class="steps" data-fig="c12m-vec-angle">
<div class="step">Take a = 2i + j + 2k and b = i − 2j + 2k.</div>
<div class="step">Dot product: 2×1 + 1×(−2) + 2×2 = 4.</div>
<div class="step">Lengths: |a| = √9 = 3, |b| = √9 = 3.</div>
<div class="step">cos θ = 4/(3 × 3) = 4/9.</div>
<div class="step">θ = cos⁻¹(4/9) ≈ 63.6°. A positive dot product gives an acute angle, as it should.</div>
</div>

Pull a cart with a rope held at different angles and see why a perpendicular pull does no work (a porter carrying a bag on level ground does no work on it against gravity):

<figure class="fig" data-fig="c12m-vec-work"><figcaption>Work F·d = F d cos θ. At 0° all the force helps, at 90° none does, beyond 90° the force opposes the motion and the work is negative. The curve is cos θ.</figcaption></figure>

<div class="problem" data-problem="c12m-vec-dot"></div>

### Projection of a vector on another

The component of **a** along **b** is a number, and the part itself is a vector:

```math
\text{scalar projection} = \frac{\vec a\cdot\vec b}{|\vec b|},\qquad \text{vector projection} = \frac{\vec a\cdot\vec b}{|\vec b|^2}\,\vec b
```

<figure class="fig" data-fig="@math-vec-projection"><figcaption>Drag a and b. The shadow of a on b has length |a| cos θ. What is left over is perpendicular to b, and the dot product equals |b| times the shadow.</figcaption></figure>

<div class="problem" data-problem="c12m-vec-proj"></div>

<div class="myth">

**“The dot product of two vectors is a vector.”** It is a scalar (a plain number). That is why it is also called the scalar product. Likewise, `$\vec a\cdot\vec b\cdot\vec c$` has no meaning.

</div>

## 4. The vector (cross) product

The **cross product** of **a** and **b** is a vector:

```math
\vec a\times\vec b = |\vec a||\vec b|\sin\theta\ \hat n
```

where `$\hat n$` is the unit vector perpendicular to both, pointing by the **right-hand rule**: curl the fingers of your right hand from **a** towards **b** and your thumb points along `$\vec a\times\vec b$`. In components it is the determinant

```math
\vec a\times\vec b = \begin{vmatrix}\hat i & \hat j & \hat k\\ a_1 & a_2 & a_3\\ b_1 & b_2 & b_3\end{vmatrix}
```

<div class="meaning">

<dl>
<dt>|a × b|</dt><dd>The **area of the parallelogram** with adjacent sides **a** and **b**. Half of it is the area of the triangle.</dd>
<dt>Direction</dt><dd>Perpendicular to the plane of **a** and **b**: the way a screw advances when turned from **a** to **b**.</dd>
<dt>Order</dt><dd>`$\vec b\times\vec a = -\,\vec a\times\vec b$`: swapping reverses the arrow (the cross product is **not** commutative). Parallel vectors give `$\vec 0$`.</dd>
</dl>

</div>

Drag the tips of **a** and **b** below: the area changes with the angle, vanishes when they line up, and the symbol shows whether **a × b** points out of or into the page (anticlockwise turn from a to b means out).

<figure class="fig" data-fig="c12m-vec-cross"><figcaption>The shaded parallelogram (or triangle) has area |a × b|. A dot means the cross product points out of the page, a cross means into the page. Make a and b parallel and the area shrinks to 0.</figcaption></figure>

The determinant is the method everyone uses. See it worked through with the “cover a column” trick:

<div class="steps" data-fig="c12m-vec-crossdet">
<div class="step">For a = 2i − j + 3k and b = i + 4j − 2k, write the 3 × 3 determinant: row 1 is i, j, k; row 2 is a; row 3 is b.</div>
<div class="step">Cover the i column. The leftover 2 × 2 is (−1)(−2) − (3)(4) = −10. So the i part is −10.</div>
<div class="step">Cover the j column: (2)(−2) − (3)(1) = −7. The middle term takes a minus sign, giving +7 for j.</div>
<div class="step">Cover the k column: (2)(4) − (−1)(1) = 9. So the k part is +9.</div>
<div class="step">a × b = −10i + 7j + 9k. Check: dotting with a gives −20 − 7 + 27 = 0 and with b gives −10 + 28 − 18 = 0: it is perpendicular to both.</div>
</div>

<div class="problem" data-problem="c12m-vec-cross"></div>

**Areas.** Parallelogram `$= |\vec a\times\vec b|$`. Triangle with sides **a**, **b** from one corner `$= \tfrac12|\vec a\times\vec b|$`. For a triangle ABC: `$\tfrac12|\overrightarrow{AB}\times\overrightarrow{AC}|$`. **Lagrange's identity** links the two products: `$|\vec a\times\vec b|^2 = |\vec a|^2|\vec b|^2 - (\vec a\cdot\vec b)^2$`, which is just `$\sin^2\theta + \cos^2\theta = 1$` multiplied out. A useful check on any answer.

<div class="problem" data-problem="c12m-vec-tri"></div>

Everything in one place, with a free playground (try the dot and cross products, projections and angles with your own numbers):

<!--fig:tool vector-lab-3d-->

Other tools for this chapter: [Vector adder](/learn/vector-adder/) and the [Vector lab in 3D](/learn/vector-lab-3d/).

### Beyond the syllabus

The scalar triple product `$\vec a\cdot(\vec b\times\vec c)$` (the volume of the parallelepiped on three vectors) and the vector triple product were part of older editions; the 2023 rationalised book does not ask them. They appear in the JEE lesson linked at the end.

<div class="keypoints">

- Vector = magnitude + direction. Position vector `$\vec r = x\hat i + y\hat j + z\hat k$`, `$|\vec r| = \sqrt{x^2+y^2+z^2}$`. `$\overrightarrow{AB} = \overrightarrow{OB} - \overrightarrow{OA}$` (head minus tail).
- Unit vector `$\hat a = \vec a/|\vec a|$`. Direction cosines `$l, m, n = x/r,\ y/r,\ z/r$` with `$l^2 + m^2 + n^2 = 1$`.
- Triangle and parallelogram laws; in components add (or scale) each part. `$|\vec a + \vec b| \le |\vec a| + |\vec b|$`.
- Section formula: internal `$(n\vec a + m\vec b)/(m+n)$`, external `$(m\vec b - n\vec a)/(m-n)$`; mid-point `$(\vec a + \vec b)/2$`.
- Dot product `$a_1b_1 + a_2b_2 + a_3b_3 = |\vec a||\vec b|\cos\theta$` (a number). Zero means perpendicular. Projection of **a** on **b** is `$\vec a\cdot\vec b/|\vec b|$`. Work `$= \vec F\cdot\vec d$`.
- Cross product is a vector, perpendicular to both (right-hand rule); `$|\vec a\times\vec b| = |\vec a||\vec b|\sin\theta$` = parallelogram area; `$\vec b\times\vec a = -\vec a\times\vec b$`; parallel vectors give 0.

</div>

Going further for JEE/NEET: the exam-level problems (collinear and coplanar points, vector equations, triple products, linear independence) are in [Vectors (JEE)](/learn/courses/engineering-entrance/vectors/).
