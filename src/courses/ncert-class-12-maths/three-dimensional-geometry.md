---
title: Three Dimensional Geometry
seoTitle: 'Three Dimensional Geometry Class 12 notes: lines'
summary: 'Class 12 3D Geometry with animations: direction cosines and ratios, equation of a line, angle between lines, skew lines, shortest distance, and planes.'
minutes: 90
updated: 2026-11-22
quiz:
  - q: 'The direction cosines of a line with direction ratios 2, 3, 6 are:'
    choices: ['2/7, 3/7, 6/7', '2/11, 3/11, 6/11', '2, 3, 6', '1/7, 1/7, 1/7']
    ans: 0
    why: 'Divide each ratio by √(4 + 9 + 36) = 7. The squares 4/49 + 9/49 + 36/49 add to 1.'
  - q: 'Lines with direction ratios (1, 2, 2) and (2, 1, −2) are:'
    choices: ['parallel', 'perpendicular', 'neither parallel nor perpendicular', 'the same line']
    ans: 1
    why: 'a₁a₂ + b₁b₂ + c₁c₂ = 2 + 2 − 4 = 0, so they are perpendicular.'
  - q: 'The shortest distance between the lines r = (1, 0, 0) + λ(0, 1, 1) and r = (0, 1, 2) + μ(1, 0, 1) is:'
    choices: ['2/√3', '√3', '2', '1/√3']
    ans: 0
    why: 'b₁ × b₂ = (1, 1, −1), |·| = √3, (a₂ − a₁)·(b₁ × b₂) = (−1, 1, 2)·(1, 1, −1) = −2, so d = 2/√3.'
sources:
  - 'NCERT Class 12 Mathematics, Chapter 11 “Three Dimensional Geometry” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Analytic geometry in three dimensions from coordinates: Descartes, La Géométrie (1637); the distance between skew lines by the vector method as in any university text, e.g. Stewart, J., Calculus: Early Transcendentals (Cengage), section on lines and planes in space.'
  - 'Every worked example was recomputed a second way (the closest points found by solving the two normal equations, then measuring their distance).'
---

**Maths · Class 12 · Chapter 11 · about 90 minutes.** By the end you will be able to describe a direction in space by direction ratios and cosines, write the equation of a line in vector and Cartesian form, find the angle between two lines, tell skew lines from intersecting or parallel ones, find the shortest distance between two lines, and handle the basic facts about planes.

<div class="bigidea">A line in space is fixed by one point on it and a direction. A direction needs three numbers, the direction ratios. Angles between lines are angles between their directions, so the dot product does the job. And the shortest distance between two lines that never meet is measured along the one direction perpendicular to both, which is the cross product of their directions.</div>

## 1. Direction cosines and direction ratios

A line through the origin makes angles `$\alpha, \beta, \gamma$` with the x, y and z axes. The cosines `$l = \cos\alpha,\ m = \cos\beta,\ n = \cos\gamma$` are its **direction cosines**. If `$P(x, y, z)$` is a point on the line at distance r from O, then `$l = x/r,\ m = y/r,\ n = z/r$`, so

```math
l^2 + m^2 + n^2 = 1
```

Any three numbers `$a, b, c$` in the same proportion as `$l, m, n$` are **direction ratios** (DR). They are not unique: `$(1, 2, 2)$` and `$(2, 4, 4)$` describe the same direction. To get the direction cosines, divide by `$\sqrt{a^2 + b^2 + c^2}$`:

```math
l = \frac{a}{\sqrt{a^2+b^2+c^2}},\quad m = \frac{b}{\sqrt{a^2+b^2+c^2}},\quad n = \frac{c}{\sqrt{a^2+b^2+c^2}}
```

Reversing the line gives `$(-l, -m, -n)$`, so a line has two sets of direction cosines, one for each way along it.

<div class="meaning">

<dl>
<dt>(a, b, c)</dt><dd>Direction ratios: how far the line moves in x, y, z in the same stretch. Think of climbing stairs: “3 steps forward, 4 sideways, 12 up”.</dd>
<dt>(l, m, n)</dt><dd>Direction cosines: the same direction rescaled so the step has length 1. They are the components of the unit vector along the line.</dd>
<dt>Physical meaning</dt><dd>A drone flying along the line changes its x, y, z by amounts in the ratio a : b : c. The direction cosines are the fractions of its speed along each axis.</dd>
</dl>

</div>

Change the direction ratios, multiply them by 2 or 3 and reverse the direction. See which numbers change and which stay put:

<figure class="fig" data-fig="c12m-3d-dc"><figcaption>A line through the origin. The ratios (a, b, c) can be scaled freely, but the direction cosines never change when you scale; only reversing flips all three signs. l² + m² + n² stays 1.</figcaption></figure>

For the line through two points `$P(x_1, y_1, z_1)$` and `$Q(x_2, y_2, z_2)$`, the direction ratios are `$x_2 - x_1,\ y_2 - y_1,\ z_2 - z_1$`: end minus start. Worked example:

<div class="steps" data-fig="c12m-3d-twopoints">
<div class="step">The line passes through P(2, 1, −3) and Q(5, 5, 9).</div>
<div class="step">Subtract: a = 5 − 2 = 3, b = 5 − 1 = 4, c = 9 + 3 = 12.</div>
<div class="step">r = √(9 + 16 + 144) = √169 = 13.</div>
<div class="step">Direction cosines: 3/13, 4/13, 12/13.</div>
<div class="step">Check: 9/169 + 16/169 + 144/169 = 1.</div>
</div>

<div class="problem" data-problem="c12m-3d-dc"></div>

<div class="myth">

**“The direction cosines of a line are unique.”** Direction RATIOS can be any multiple, and the direction cosines come in two sets, `$(l, m, n)$` and `$(-l, -m, -n)$`, depending on which way you point along the line. What is fixed is the line itself.

</div>

## 2. Equation of a line in space

### Vector form

A line through the point A (position vector `$\vec a$`) parallel to the vector `$\vec b$` consists of every point

```math
\vec r = \vec a + \lambda\vec b,\qquad \lambda\in\mathbb R
```

Every real number `$\lambda$` gives one point of the line: `$\lambda = 0$` is A itself, `$\lambda = 1$` is a step of one whole `$\vec b$` further, negative `$\lambda$` goes the other way. Slide it and watch.

### Cartesian form

Write `$\vec a = x_1\hat i + y_1\hat j + z_1\hat k$` and `$\vec b = p\hat i + q\hat j + r\hat k$`. The three coordinates are `$x = x_1 + \lambda p$` and so on. Solve each for `$\lambda$`:

```math
\frac{x - x_1}{p} = \frac{y - y_1}{q} = \frac{z - z_1}{r}\ (= \lambda)
```

Here `$p, q, r$` are the direction ratios. If one of them is 0, say `$q = 0$`, the equation is written `$\frac{x - x_1}{p} = \frac{z - z_1}{r},\ y = y_1$`: that coordinate does not change along the line.

<figure class="fig" data-fig="c12m-3d-line"><figcaption>The line r = a + λb. Slide λ to move the point P along it; change b to turn the line. The readout writes the point and the Cartesian form.</figcaption></figure>

### Line through two points

Use A as the point and `$\vec b = \overrightarrow{AB}$` as the direction (any multiple will do):

<div class="steps" data-fig="c12m-3d-linesteps">
<div class="step">A line is fixed by a point and a direction. Here the line goes through A(1, −2, 3) and B(3, 0, 7).</div>
<div class="step">Direction = B − A = (2, 2, 4), or the shorter (1, 1, 2).</div>
<div class="step">Vector form: r = (i − 2j + 3k) + λ(i + j + 2k).</div>
<div class="step">Cartesian form: (x − 1)/1 = (y + 2)/1 = (z − 3)/2.</div>
<div class="step">Check B with λ = 2: (3, 0, 7). So the line passes through B as well.</div>
</div>

<div class="problem" data-problem="c12m-3d-point"></div>

## 3. Angle between two lines

The angle between two lines is the angle between their directions. If the direction ratios are `$(a_1, b_1, c_1)$` and `$(a_2, b_2, c_2)$`, the dot product gives

```math
\cos\theta = \frac{|a_1a_2 + b_1b_2 + c_1c_2|}{\sqrt{a_1^2+b_1^2+c_1^2}\ \sqrt{a_2^2+b_2^2+c_2^2}}
```

The absolute value is there because two lines meet at a pair of angles `$\theta$` and `$180° - \theta$`, and we quote the acute one. For direction cosines the formula becomes `$\cos\theta = |l_1l_2 + m_1m_2 + n_1n_2|$`. Two special cases:

- **Perpendicular:** `$a_1a_2 + b_1b_2 + c_1c_2 = 0$`.
- **Parallel:** `$\frac{a_1}{a_2} = \frac{b_1}{b_2} = \frac{c_1}{c_2}$` (ratios in proportion).

<figure class="fig" data-fig="c12m-3d-angle"><figcaption>Line 1 is fixed with ratios (1, 2, 2). Change the ratios of line 2 and read cos θ. Try (2, 1, −2), which is perpendicular, and (2, 4, 4), which is parallel.</figcaption></figure>

<div class="problem" data-problem="c12m-3d-angle"></div>

<div class="problem" data-problem="c12m-3d-perp"></div>

## 4. Skew lines and the shortest distance

Two lines in space can be:

1. **Intersecting:** they meet at a point (they lie in one plane).
2. **Parallel:** the same direction, never meet.
3. **Skew:** not parallel and never meet; they do not lie in any one plane. Picture a flyover crossing over a road at an angle: the road and the flyover's edge never touch and never run parallel.

For two lines, the **shortest distance** is the length of the segment perpendicular to both. For skew lines `$\vec r = \vec a_1 + \lambda\vec b_1$` and `$\vec r = \vec a_2 + \mu\vec b_2$`:

```math
d = \frac{\left|(\vec a_2 - \vec a_1)\cdot(\vec b_1\times\vec b_2)\right|}{|\vec b_1\times\vec b_2|}
```

<div class="meaning">

<dl>
<dt>b₁ × b₂</dt><dd>A vector perpendicular to both lines: the direction of the common perpendicular.</dd>
<dt>a₂ − a₁</dt><dd>Any vector from a point of line 1 to a point of line 2.</dd>
<dt>The dot product</dt><dd>Projects that joining vector on the common perpendicular direction: the length of the shadow is the distance between the lines.</dd>
<dt>Physical meaning</dt><dd>Two crossing power cables: the gap between them is the shortest wire you could run from one to the other, at right angles to both.</dd>
</dl>

</div>

Turn the view and change the height, the angle and the tilt of the second line. The orange segment is the shortest connection:

<figure class="fig" data-fig="c12m-3d-skew"><figcaption>Line 1 is along the x-axis. Line 2 passes through (1, 1.5, h) and its direction turns with the sliders. The orange segment is the common perpendicular; its length is the shortest distance, checked by the formula in the readout. Make the lines meet and the distance becomes 0.</figcaption></figure>

<div class="steps" data-fig="c12m-3d-skewsteps">
<div class="step">L₁: r = (1, 0, 0) + λ(0, 1, 1) and L₂: r = (0, 1, 2) + μ(1, 0, 1). Read off a₁, b₁, a₂, b₂.</div>
<div class="step">b₁ × b₂ = (1·1 − 1·0, 1·1 − 0·1, 0·0 − 1·1) = (1, 1, −1). Its length is √3.</div>
<div class="step">a₂ − a₁ = (0 − 1, 1 − 0, 2 − 0) = (−1, 1, 2).</div>
<div class="step">(a₂ − a₁)·(b₁ × b₂) = −1 + 1 − 2 = −2.</div>
<div class="step">d = |−2|/√3 = 2/√3 ≈ 1.155. It is not 0, so the lines do not meet: they are skew.</div>
</div>

<div class="problem" data-problem="c12m-3d-skew"></div>

**Parallel lines.** If `$\vec b_1 = \vec b_2 = \vec b$` the cross product is 0 and the formula above fails. The distance is then

```math
d = \frac{|(\vec a_2 - \vec a_1)\times\vec b|}{|\vec b|}
```

which is the area of the parallelogram divided by its base, giving its height.

<div class="problem" data-problem="c12m-3d-parallel"></div>

<div class="myth">

**“If the shortest-distance formula gives 0 the lines are parallel.”** No: parallel lines make the denominator 0 (you cannot use the formula). A zero **answer** means the lines meet, so they are intersecting lines.

</div>

In Cartesian form, with lines `$\frac{x - x_1}{a_1} = \frac{y - y_1}{b_1} = \frac{z - z_1}{c_1}$` and `$\frac{x - x_2}{a_2} = \frac{y - y_2}{b_2} = \frac{z - z_2}{c_2}$`, the same distance is

```math
d = \frac{\begin{vmatrix} x_2 - x_1 & y_2 - y_1 & z_2 - z_1\\ a_1 & b_1 & c_1\\ a_2 & b_2 & c_2\end{vmatrix}}{\sqrt{(b_1c_2 - b_2c_1)^2 + (c_1a_2 - c_2a_1)^2 + (a_1b_2 - a_2b_1)^2}}
```

(absolute value on the top). The top is the dot product written as a determinant.

## 5. Planes: the main facts

The board syllabus also asks the basics of planes, so here are the core results.

- A plane is fixed by a point `$\vec a$` and a **normal** vector `$\vec n$` (perpendicular to it): `$(\vec r - \vec a)\cdot\vec n = 0$`. In Cartesian form `$ax + by + cz = d$`, where `$(a, b, c)$` are the direction ratios of the normal.
- **Distance of a point** `$P(x_1, y_1, z_1)$` from the plane `$ax + by + cz = d$`: `$\dfrac{|ax_1 + by_1 + cz_1 - d|}{\sqrt{a^2+b^2+c^2}}$`.
- **Angle between two planes** = angle between their normals: `$\cos\theta = \dfrac{|\vec n_1\cdot\vec n_2|}{|\vec n_1||\vec n_2|}$`.
- **Angle between a line and a plane**: if the line has direction `$\vec b$` and the plane has normal `$\vec n$`, then `$\sin\varphi = \dfrac{|\vec b\cdot\vec n|}{|\vec b||\vec n|}$` (the sine, because the normal is 90° away from the plane).

<figure class="fig" data-fig="@math-plane-line-3d"><figcaption>A line and a plane in 3D (drag to turn). The readout shows the angle between them, where the line meets the plane, and the distance of a point from the plane, all from the numbers.</figcaption></figure>

Check with your own school and board which parts of planes they ask; the line material above is the heart of the chapter.

Try your own vectors in the 3D lab (turn the axes, move points, see the angles):

<!--fig:tool vector-lab-3d-->

<div class="keypoints">

- Direction cosines `$l, m, n$` (cosines of the angles with the axes): `$l^2 + m^2 + n^2 = 1$`. Direction ratios `$a, b, c$`: any numbers in proportion; `$l = a/\sqrt{a^2+b^2+c^2}$` etc. Line through P and Q: ratios Q − P.
- Line: vector `$\vec r = \vec a + \lambda\vec b$`; Cartesian `$\frac{x-x_1}{p} = \frac{y-y_1}{q} = \frac{z-z_1}{r}$`.
- Angle between lines: `$\cos\theta = \frac{|a_1a_2 + b_1b_2 + c_1c_2|}{|\vec b_1||\vec b_2|}$`. Perpendicular: dot = 0. Parallel: ratios proportional.
- Skew lines do not meet and are not parallel. Shortest distance `$d = \frac{|(\vec a_2 - \vec a_1)\cdot(\vec b_1\times\vec b_2)|}{|\vec b_1\times\vec b_2|}$`; for parallel lines `$d = \frac{|(\vec a_2 - \vec a_1)\times\vec b|}{|\vec b|}$`. Answer 0 means the lines meet.
- Plane `$ax + by + cz = d$` has normal `$(a, b, c)$`; point-to-plane distance `$\frac{|ax_1 + by_1 + cz_1 - d|}{\sqrt{a^2+b^2+c^2}}$`; angle between planes = angle between normals.

</div>

Going further for JEE/NEET: planes in depth, coplanarity, line-plane intersections and exam-level distance problems are in [Three-dimensional geometry (JEE)](/learn/courses/engineering-entrance/three-d-geometry/).
