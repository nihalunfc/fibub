---
title: Straight lines
seoTitle: 'Straight lines: JEE maths'
summary: 'Coordinates, distance and section formulae, the centres of a triangle and its area, slope and the angle between lines, every form of the equation of a line, distance from a point and between parallel lines, foot of the perpendicular and image, angle bisectors, families of lines and concurrency, locus, shifting the origin and pairs of straight lines.'
minutes: 38
updated: 2026-11-22
quiz:
  - q: 'The slope of the line 3x − 4y + 7 = 0 is:'
    choices: ['3/4', '−3/4', '4/3', '−4/3']
    ans: 0
    why: 'For ax + by + c = 0 the slope is −a/b = −3/(−4) = 3/4. (Rewrite as y = (3/4)x + 7/4 to check.)'
  - q: 'The distance between the parallel lines 3x + 4y = 5 and 3x + 4y = 15 is:'
    choices: ['2', '10', '4', '1']
    ans: 0
    why: '|c₁ − c₂|/√(a² + b²) = |15 − 5|/5 = 2. Both lines must have the same a and b before you use the formula.'
  - q: 'The centroid of the triangle with vertices (1, 2), (3, −4) and (5, 8) is:'
    choices: ['(3, 2)', '(9, 6)', '(3, 3)', '(2, 3)']
    ans: 0
    why: 'Average the coordinates: ((1 + 3 + 5)/3, (2 − 4 + 8)/3) = (3, 2).'
sources:
  - 'NCERT Mathematics Class 11 (Straight lines) and Class 10 (Coordinate geometry): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Coordinate geometry'
---

**Maths · Class 11 · about 38 minutes.** By the end you will be able to find the centres and area of a triangle from its vertices, write a line in whatever form a question needs, find distances, feet of perpendiculars and images, use families of lines, and handle locus and pair-of-lines questions.

<div class="bigidea">A straight line is fixed by two facts: a point and a direction, or two points. Its equation ax + by + c = 0 is a test. Put in a point: zero means the point is on the line, and the sign and size of the answer say which side the point is on and how far away it is.</div>

## 1. Points: distance, section and area

```math
PQ = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}, \qquad \text{point dividing } PQ \text{ in } m:n = \left(\frac{mx_2 + nx_1}{m+n},\ \frac{my_2 + ny_1}{m+n}\right)
```

For external division, replace n by −n. The midpoint is the case m = n.

**Area of a triangle** with vertices (x₁, y₁), (x₂, y₂), (x₃, y₃):

```math
\Delta = \tfrac12\left|x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)\right|
```

Three points are collinear exactly when this area is zero.

**Centres of a triangle.**

| Centre | Where it is | Coordinates |
|---|---|---|
| Centroid G | where the medians meet | average of the three vertices |
| Incentre I | where the angle bisectors meet | `$\left(\frac{ax_1+bx_2+cx_3}{a+b+c}, \frac{ay_1+by_2+cy_3}{a+b+c}\right)$`, a, b, c the opposite sides |
| Circumcentre O | equidistant from the vertices | solve OA = OB = OC |
| Orthocentre H | where the altitudes meet | intersect two altitudes |

G divides OH in the ratio 1 : 2 (they lie on the Euler line). In a right triangle, H is the right-angle vertex and O is the midpoint of the hypotenuse; in an equilateral triangle all four centres coincide.

## 2. Slope and angles

The slope of a line is `$m = \tan\theta$`, where θ is the angle it makes with the positive x-axis. Through two points, `$m = \dfrac{y_2-y_1}{x_2-x_1}$`. For ax + by + c = 0, m = −a/b.

```math
\tan\phi = \left|\frac{m_1 - m_2}{1 + m_1m_2}\right| \quad \text{(acute angle between two lines)}
```

Parallel lines have m₁ = m₂. Perpendicular lines have m₁m₂ = −1 (or one is vertical and the other horizontal).

<div class="problem" data-problem="sl-angle"></div>

## 3. Forms of the equation

| Form | Equation | Use it when you know |
|---|---|---|
| Slope-intercept | y = mx + c | slope and y-intercept |
| Point-slope | y − y₁ = m(x − x₁) | a point and the slope |
| Two-point | (y − y₁)(x₂ − x₁) = (y₂ − y₁)(x − x₁) | two points |
| Intercept | x/a + y/b = 1 | the intercepts on the axes |
| Normal | x cos α + y sin α = p | the perpendicular from the origin: length p, angle α |
| General | ax + by + c = 0 | anything; every line has this form |

A line parallel to ax + by + c = 0 is ax + by + k = 0; a perpendicular one is bx − ay + k = 0. Then use the given point to find k.

<figure class="fig" data-fig="line-distance"><figcaption>Set the line by its angle and y-intercept, and move the point P. The perpendicular from P meets the line at the foot; the dashed segment continues to the image of P.</figcaption></figure>

## 4. Distances, feet and images

```math
d = \frac{|ax_1 + by_1 + c|}{\sqrt{a^2+b^2}}, \qquad d_{\parallel} = \frac{|c_1 - c_2|}{\sqrt{a^2+b^2}}
```

<div class="meaning">
<dl>
<dt>a, b</dt><dd>the coefficients of x and y; the arrow (a, b) is perpendicular to the line (its normal)</dd>
<dt>c</dt><dd>the constant term; for parallel lines, write both with the same a and b first</dd>
<dt>(x₁, y₁)</dt><dd>the point whose distance is wanted</dd>
<dt>Physical meaning</dt><dd>ax₁ + by₁ + c measures how far the point is from the line, but in units of the normal's length. Dividing by √(a² + b²) turns it into true distance. Its sign tells you the side: points giving the same sign are on the same side.</dd>
</dl>
</div>

<div class="problem" data-problem="sl-dist"></div>

**Foot and image.** The foot (h, k) of the perpendicular from (x₁, y₁) and the image (h′, k′) satisfy

```math
\frac{h - x_1}{a} = \frac{k - y_1}{b} = -\frac{ax_1+by_1+c}{a^2+b^2}, \qquad \frac{h' - x_1}{a} = \frac{k' - y_1}{b} = -\frac{2(ax_1+by_1+c)}{a^2+b^2}
```

<div class="problem" data-problem="sl-image"></div>

**Angle bisectors.** The bisectors of the angles between `$a_1x + b_1y + c_1 = 0$` and `$a_2x + b_2y + c_2 = 0$` are the points equally far from both:

```math
\frac{a_1x + b_1y + c_1}{\sqrt{a_1^2+b_1^2}} = \pm\frac{a_2x + b_2y + c_2}{\sqrt{a_2^2+b_2^2}}
```

With both constants c₁, c₂ made positive, the + sign gives the bisector of the angle containing the origin.

<div class="myth">

**"The distance formula works for 3x + 4y = 5 and 6x + 8y = 30 directly: |30 − 5|/5 = 5."** The lines must have the same a and b first. Halve the second: 3x + 4y = 15. Then the distance is |15 − 5|/5 = 2.

</div>

## 5. Families of lines and concurrency

`$L_1 + \lambda L_2 = 0$` is every line (except L₂ itself) through the intersection of L₁ = 0 and L₂ = 0. Use it to find a line through an intersection without finding the point. A family like (2 + k)x + (1 − k)y = 3 + 4k passes through a **fixed point**: collect k, so 2x + y − 3 + k(x − y − 4) = 0, and solve 2x + y = 3, x − y = 4.

Three lines are **concurrent** (meet at one point) when

```math
\begin{vmatrix} a_1 & b_1 & c_1 \\ a_2 & b_2 & c_2 \\ a_3 & b_3 & c_3 \end{vmatrix} = 0
```

and no two of them are parallel.

## 6. Locus, shifting the origin and pairs of lines (JEE Advanced)

**Locus.** Call the moving point (h, k), write the given condition as an equation in h and k, remove any extra parameter, then replace h, k by x, y.

**Shifting the origin** to (α, β): put x = X + α, y = Y + β. Distances and angles do not change; only the equation does.

**Pair of lines through the origin.** `$ax^2 + 2hxy + by^2 = 0$` is two lines through the origin when `$h^2 \ge ab$`. If their slopes are m₁, m₂, then `$m_1 + m_2 = -2h/b$` and `$m_1m_2 = a/b$`; the angle between them has `$\tan\phi = \dfrac{2\sqrt{h^2-ab}}{|a+b|}$`. They are perpendicular when a + b = 0. The general second-degree equation is a pair of lines when `$abc + 2fgh - af^2 - bg^2 - ch^2 = 0$`.

**Worked example.** Find the locus of the midpoint of the part of a line between the axes, if the line always passes through (2, 3). Let the line meet the axes at (2h, 0) and (0, 2k), so the midpoint is (h, k). The line is x/2h + y/2k = 1, and (2, 3) is on it: 1/h + 3/(2k) = 1. Clearing, the locus is **3x + 2y = 2xy**.

<div class="keypoints">

- Section formula (mx₂ + nx₁)/(m + n); external division uses −n. Area zero means collinear.
- Centroid = average of vertices; incentre weights by opposite sides; G divides OH as 1 : 2.
- tan φ = |(m₁ − m₂)/(1 + m₁m₂)|; parallel m₁ = m₂, perpendicular m₁m₂ = −1.
- Distance |ax₁ + by₁ + c|/√(a² + b²); parallel lines need equal a and b first.
- Foot and image from (h − x₁)/a = (k − y₁)/b = −(1 or 2)(ax₁ + by₁ + c)/(a² + b²).
- L₁ + λL₂ = 0 is the family through an intersection; ax² + 2hxy + by² = 0 is a pair of lines with m₁ + m₂ = −2h/b, m₁m₂ = a/b.

</div>
