---
title: Three-dimensional geometry
seoTitle: 'Three-dimensional geometry: JEE maths'
summary: 'Coordinates and distance in space, direction cosines and ratios, the equation of a line in vector and symmetric form, angle between lines, intersecting and skew lines with the shortest distance, every form of the plane equation, angles and distances involving planes, the family of planes through a line, foot of the perpendicular, images in a plane or a line, and coplanarity.'
minutes: 38
updated: 2026-11-22
quiz:
  - q: 'The direction cosines of the line joining (0, 0, 0) and (2, 1, 2) are:'
    choices: ['2, 1, 2', '2/3, 1/3, 2/3', '2/5, 1/5, 2/5', '1, 1/2, 1']
    ans: 1
    why: 'The length is √(4 + 1 + 4) = 3, so divide the direction ratios 2, 1, 2 by 3.'
  - q: 'The distance of (1, 2, 3) from the plane 2x − y + 2z − 3 = 0 is:'
    choices: ['1', '2', '3', '5/3']
    ans: 0
    why: '|2 − 2 + 6 − 3|/√(4 + 1 + 4) = 3/3 = 1.'
  - q: 'The planes x + 2y + 3z = 4 and 2x + 4y + 6z = 5 are:'
    choices: ['perpendicular', 'parallel', 'the same plane', 'meeting at 45°']
    ans: 1
    why: 'Their normals (1, 2, 3) and (2, 4, 6) are parallel, but 4 ≠ 5/2 after scaling, so the planes are parallel and different.'
sources:
  - 'NCERT Mathematics Class 11 (Introduction to three-dimensional geometry) and Class 12 (Three dimensional geometry): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Three dimensional geometry'
---

**Maths · Class 12 · about 38 minutes.** By the end you will be able to write lines and planes in every form, find angles and distances between them, compute the shortest distance between skew lines, find feet of perpendiculars and images, and use the family of planes through a line.

<div class="bigidea">In space, a line is fixed by a point and a direction, and a plane is fixed by a point and a normal (the direction sticking straight out of it). Nearly every 3D question turns into a vector question about those directions: parallel directions, perpendicular directions, or the projection of one vector on another.</div>

## 1. Points, distance and direction

The distance between (x₁, y₁, z₁) and (x₂, y₂, z₂) is `$\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}$`. The section formula works coordinate by coordinate, as in two dimensions.

**Direction cosines** l, m, n of a line are the cosines of the angles it makes with the x, y, z axes; always l² + m² + n² = 1. **Direction ratios** a, b, c are any numbers in proportion to them: for the segment from P to Q they are the coordinate differences. To turn ratios into cosines, divide by √(a² + b² + c²).

**Projection of a segment** PQ on a line with direction cosines l, m, n: |l(x₂ − x₁) + m(y₂ − y₁) + n(z₂ − z₁)|.

## 2. The line

Through the point A (position a) with direction b:

```math
\vec r = \vec a + \lambda\vec b, \qquad \frac{x - x_1}{b_1} = \frac{y - y_1}{b_2} = \frac{z - z_1}{b_3}
```

<div class="meaning">
<dl>
<dt>a, (x₁, y₁, z₁)</dt><dd>any one point on the line</dd>
<dt>b, (b₁, b₂, b₃)</dt><dd>direction ratios of the line; a zero in a denominator just means that coordinate stays constant</dd>
<dt>λ</dt><dd>a parameter: each value gives one point; set each fraction equal to λ to get a general point (x₁ + λb₁, y₁ + λb₂, z₁ + λb₃)</dd>
<dt>Physical meaning</dt><dd>Start at a point and walk in a fixed direction; λ says how far you walked.</dd>
</dl>
</div>

The **angle between two lines** is the angle between their directions: `$\cos\theta = \dfrac{|\vec b_1 \cdot \vec b_2|}{|\vec b_1||\vec b_2|}$`. They are perpendicular when b₁ · b₂ = 0 and parallel when b₁ and b₂ are proportional.

**Do two lines meet?** Write a general point on each, equate the coordinates, solve two of the equations for λ and μ, and check the third. If it fails, the lines are **skew** (not parallel and not meeting).

## 3. Shortest distance between lines

```math
d = \frac{|(\vec a_2 - \vec a_1)\cdot(\vec b_1 \times \vec b_2)|}{|\vec b_1 \times \vec b_2|} \quad \text{(skew)}, \qquad d = \frac{|(\vec a_2 - \vec a_1) \times \vec b|}{|\vec b|} \quad \text{(parallel)}
```

b₁ × b₂ is the direction of the common perpendicular; d is the projection of the joining vector a₂ − a₁ onto it. The lines meet exactly when d = 0, that is when (a₂ − a₁) · (b₁ × b₂) = 0, which is also the **coplanarity** condition for two lines.

<figure class="fig" data-fig="td-skew"><figcaption>Two skew lines and the segment that meets both at right angles. Turn the view to see that it really is perpendicular to both; set the angle to 0 for parallel lines, or the gap to 0 for lines that meet.</figcaption></figure>

<div class="problem" data-problem="td-skew"></div>

## 4. The plane

| Given | Equation |
|---|---|
| normal n = (a, b, c) and a point (x₁, y₁, z₁) | a(x − x₁) + b(y − y₁) + c(z − z₁) = 0 |
| general form | ax + by + cz + d = 0, normal (a, b, c) |
| intercepts p, q, r on the axes | x/p + y/q + z/r = 1 |
| normal form: unit normal (l, m, n), distance p from origin | lx + my + nz = p |
| three points A, B, C | normal = AB × AC, or a 3 × 3 determinant = 0 |
| containing a line and a point, or two lines | normal = cross product of two directions in the plane |

**Angle between planes** = angle between normals: `$\cos\theta = \dfrac{|\vec n_1\cdot\vec n_2|}{|\vec n_1||\vec n_2|}$`. **Angle between a line and a plane** uses the sine, since the line is measured from the plane, not from the normal: `$\sin\phi = \dfrac{|\vec b\cdot\vec n|}{|\vec b||\vec n|}$`.

<div class="myth">

**"The angle between a line and a plane is found with cos, like two lines."** Using cos with the normal gives the angle between the line and the **normal**, which is 90° minus the answer. A line lying in the plane is perpendicular to the normal, so b · n = 0 gives φ = 0 with the sine formula.

</div>

## 5. Distances involving planes

```math
\text{Point to plane: } \frac{|ax_1 + by_1 + cz_1 + d|}{\sqrt{a^2 + b^2 + c^2}}, \qquad \text{parallel planes: } \frac{|d_1 - d_2|}{\sqrt{a^2 + b^2 + c^2}}
```

For the parallel-plane formula, first make the x, y, z coefficients identical in both equations. A line is parallel to a plane when b · n = 0, and then its distance from the plane is the distance of any one of its points.

<div class="problem" data-problem="td-plane-dist"></div>

## 6. Foot of the perpendicular and images

**In a plane.** From P(x₁, y₁, z₁) to ax + by + cz + d = 0, the foot F and the image P′ are

```math
\frac{x - x_1}{a} = \frac{y - y_1}{b} = \frac{z - z_1}{c} = -\frac{ax_1 + by_1 + cz_1 + d}{a^2 + b^2 + c^2} \times \begin{cases} 1 & \text{foot} \\ 2 & \text{image} \end{cases}
```

The image is twice as far along the normal as the foot, because the plane bisects PP′.

**In a line.** Write the general point Q = a + λb, make PQ perpendicular to b (PQ · b = 0) to find λ: that Q is the foot. The image is 2Q − P. The distance from the point to the line is |PQ|.

## 7. JEE Advanced level: family of planes and lines as intersections

- **Family of planes through a line.** Any plane through the line where P₁ = 0 and P₂ = 0 meet is P₁ + kP₂ = 0. One more condition (passes through a point, parallel to a line, perpendicular to a plane) fixes k.
- **Line of intersection of two planes.** Its direction is n₁ × n₂; for a point, put z = 0 (or any convenient value) and solve the two equations.
- **Coplanar lines.** Two lines are coplanar when (a₂ − a₁) · (b₁ × b₂) = 0; the plane containing them has normal b₁ × b₂.
- **Planes equidistant or bisecting.** The planes bisecting the angles between two planes are (a₁x + b₁y + c₁z + d₁)/|n₁| = ±(a₂x + b₂y + c₂z + d₂)/|n₂|.

<div class="problem" data-problem="td-planes-angle"></div>

Next: [Three-dimensional geometry: question types and traps](/learn/courses/engineering-entrance/three-d-geometry-questions/).

<div class="keypoints">

- Direction cosines: divide direction ratios by their length; l² + m² + n² = 1.
- Line: r = a + λb, or (x − x₁)/b₁ = (y − y₁)/b₂ = (z − z₁)/b₃; use the general point.
- Skew lines: d = |(a₂ − a₁) · (b₁ × b₂)|/|b₁ × b₂|; d = 0 means they meet.
- Plane: a(x − x₁) + b(y − y₁) + c(z − z₁) = 0 with normal (a, b, c); intercept form x/p + y/q + z/r = 1.
- Angle between planes uses cos with normals; line and plane uses sin.
- Point to plane |ax₁ + by₁ + cz₁ + d|/√(a² + b² + c²); image goes twice as far as the foot.
- Planes through the meeting line of P₁ = 0 and P₂ = 0: P₁ + kP₂ = 0.

</div>
