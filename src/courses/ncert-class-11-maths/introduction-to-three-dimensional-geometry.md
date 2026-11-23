---
title: Introduction to Three-dimensional Geometry
seoTitle: '3D Geometry Class 11 notes: distance, section formula'
summary: 'Class 11 Three-dimensional Geometry with animations: coordinate axes and planes, octants, coordinates of a point, the distance formula and the section formula.'
minutes: 70
updated: 2026-11-23
quiz:
  - q: 'The point (−3, 2, −4) lies in octant:'
    choices: ['VI', 'III', 'VII', 'V']
    ans: 0
    why: 'The signs are (−, +, −). Octant VI is (−, +, −); octant III is (−, −, +), octant VII is (−, −, −) and octant V is (+, +, −).'
  - q: 'The distance between (1, 2, 3) and (4, 6, 15) is:'
    choices: ['13', '12', '169', '√13']
    ans: 0
    why: '√((4−1)² + (6−2)² + (15−3)²) = √(9 + 16 + 144) = √169 = 13.'
  - q: 'The point dividing the join of (2, −1, 4) and (8, 5, −2) internally in the ratio 1 : 2 is:'
    choices: ['(4, 1, 2)', '(6, 3, 0)', '(5, 2, 1)', '(3, 0, 3)']
    ans: 0
    why: 'x = (1·8 + 2·2)/3 = 4, y = (1·5 + 2·(−1))/3 = 1, z = (1·(−2) + 2·4)/3 = 2.'
sources:
  - 'NCERT Class 11 Mathematics, Chapter 11 “Introduction to Three-dimensional Geometry” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Descartes, R., La Géométrie (1637), the origin of coordinates; standard distance and section formulae of analytic geometry. Every numerical example was recomputed in code.'
---

**Maths · Class 11 · Chapter 11 · about 70 minutes.** By the end you will be able to place a point in space from its three coordinates, name the octant it is in, find the distance between two points, and find the point that divides a line segment in a given ratio.

<div class="bigidea">On a flat sheet two numbers fix a point. In the room around you a point needs three: how far along, how far across and how high. Everything you know about the plane (distance formula, midpoint, section formula) carries over by adding one more coordinate. The only new work is learning to see the picture in space, and the figures here turn so that you can.</div>

## 1. Why three coordinates?

A fly in your room can be described by three numbers: how many metres from the left wall, how many from the front wall and how many above the floor. Two numbers would not do: a point on a flat map is not enough for an aeroplane, which also has a height.

Draw three lines at right angles at the same point O, the **origin**: the **x-axis**, the **y-axis** and the **z-axis**. (Take the corner of your room where two walls meet the floor: the three edges that meet there are the three axes.) By the usual convention, x runs to the right, y runs away from you (into the screen) and z points up.

Each pair of axes spans a flat sheet, a **coordinate plane**:

- the **XY-plane** contains the x- and y-axes; every point on it has `$z = 0$` (the floor).
- the **YZ-plane** contains the y- and z-axes; every point has `$x = 0$`.
- the **ZX-plane** contains the z- and x-axes; every point has `$y = 0$`.

A point on an axis has two zero coordinates: `$(5, 0, 0)$` is on the x-axis, and `$(0, 0, -2)$` is on the z-axis.

## 2. Coordinates of a point

A point `$P$` has coordinates `$(x, y, z)$`: `$x$` is the signed distance of `$P$` from the YZ-plane, `$y$` from the ZX-plane and `$z$` from the XY-plane. To reach `$P$`, start at the origin, walk `$x$` along the x-axis, then `$y$` parallel to the y-axis, then `$z$` parallel to the z-axis. Move the sliders and watch the dotted box.

<figure class="fig" data-fig="c11m-3d-axes"><figcaption>The point P(x, y, z) in space. The three coloured steps lead from the origin to P; the dotted lines are the box that fixes it. The readout gives the octant, the distances from the three planes and OP.</figcaption></figure>

The distance of `$P(x, y, z)$` from each coordinate plane is the absolute value of the matching coordinate: from the XY-plane it is `$|z|$`, from the YZ-plane `$|x|$` and from the ZX-plane `$|y|$`. Drag the sliders to a point like `$(3, -2, 4)$` and check that these distances match the box.

Mirror images are easy too. The image of `$P(x, y, z)$` in the XY-plane is `$(x, y, -z)$`: only the coordinate that belongs to that plane changes sign. Try each plane here:

<figure class="fig" data-fig="c11m-3d-planes"><figcaption>A coordinate plane shown as a shaded sheet, the point P and its mirror image P′. Choose the plane and move P: only one sign flips.</figcaption></figure>

## 3. The eight octants

The three planes cut space into **eight octants** (just as two axes cut a sheet into four quadrants). Which octant a point is in depends only on the signs of its coordinates. Here is the standard numbering:

| Octant | I | II | III | IV | V | VI | VII | VIII |
|---|---|---|---|---|---|---|---|---|
| Signs of (x, y, z) | `$+,+,+$` | `$-,+,+$` | `$-,-,+$` | `$+,-,+$` | `$+,+,-$` | `$-,+,-$` | `$-,-,-$` | `$+,-,-$` |

Octants I to IV are above the XY-plane (z positive), V to VIII below it, in the same order as the quadrants. Choose an octant to see its corner shaded.

<figure class="fig" data-fig="c11m-3d-octants"><figcaption>The eight octants, one at a time. Turn the view to see the shaded corner from every side.</figcaption></figure>

<div class="problem" data-problem="c11m-3d-octant"></div>

<div class="myth">

**"The point (3, 0, 4) is in some octant."** A point with a zero coordinate lies on a coordinate plane (here the ZX-plane, `$y = 0$`) and belongs to no octant: it is on the boundary between two of them. Octants are for points with all three coordinates non-zero.

</div>

## 4. Distance between two points

On a sheet, the distance between `$(x_1, y_1)$` and `$(x_2, y_2)$` comes from Pythagoras. In space we use Pythagoras twice. Build a box with the two points `$A$` and `$B$` at opposite corners and all its faces parallel to the coordinate planes. Its edges have lengths `$p = |x_2 - x_1|$`, `$q = |y_2 - y_1|$` and `$r = |z_2 - z_1|$`. Play with the six sliders and watch `$AC$` (the diagonal of the floor) and `$AB$` (the diagonal of the box).

<figure class="fig" data-fig="c11m-3d-distance"><figcaption>Two points A and B with the box between them. AC is the floor diagonal (p² + q²), and AB² = AC² + r².</figcaption></figure>

<div class="steps" data-fig="c11m-3d-diststeps">
<div class="step">Find AB for A(x₁, y₁, z₁) and B(x₂, y₂, z₂). Draw the box with AB as its long diagonal.</div>
<div class="step">The edges are the differences of the coordinates: p = |x₂ − x₁|, q = |y₂ − y₁|, r = |z₂ − z₁|.</div>
<div class="step">C is the point on the floor directly below B. AC is the diagonal of a p by q rectangle: AC² = p² + q².</div>
<div class="step">Triangle ACB has a right angle at C, so AB² = AC² + BC² = p² + q² + r².</div>
<div class="step">Take the square root: AB = √((x₂ − x₁)² + (y₂ − y₁)² + (z₂ − z₁)²).</div>
<div class="step">Example: A(1, 2, 3) and B(4, 6, 15) give √(9 + 16 + 144) = √169 = 13.</div>
</div>

```math
AB = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}
```

The distance of `$P(x, y, z)$` from the origin is the special case `$OP = \sqrt{x^2 + y^2 + z^2}$`. The distance of `$P$` from the **x-axis** is the distance to its foot `$(x, 0, 0)$`, which is `$\sqrt{y^2 + z^2}$`: leave out the coordinate along that axis. Likewise `$\sqrt{x^2 + z^2}$` from the y-axis and `$\sqrt{x^2 + y^2}$` from the z-axis.

<div class="meaning">
<dl>
<dt>`$p, q, r$`</dt><dd>the three edges of the box between the points: how far apart they are in x, y and z.</dd>
<dt>`$AB$`</dt><dd>the straight-line distance, the diagonal of that box.</dd>
<dt>Axis distance</dt><dd>for a point `$(x, y, z)$`, the distance from the x-axis is `$\sqrt{y^2 + z^2}$`: drop the coordinate along the axis.</dd>
</dl>
</div>

<div class="problem" data-problem="c11m-3d-dist"></div>

<div class="problem" data-problem="c11m-3d-axis"></div>

**Using the formula.** Three points are **collinear** (on one line) if the largest of the three distances equals the sum of the other two. Check `$A(1, 2, 3)$`, `$B(2, 3, 4)$`, `$C(3, 4, 5)$`: `$AB = BC = \sqrt3$` and `$AC = \sqrt{4 + 4 + 4} = 2\sqrt3$`, and `$\sqrt3 + \sqrt3 = 2\sqrt3$`, so they lie on one line. A triangle is right-angled when the squares of two sides add to the square of the third, just as on a sheet.

<!--fig:tool points-3d-->

For more on directions in space, try the [3D vector lab](/learn/vector-lab-3d/).

## 5. The section formula

A railway station sits one-third of the way along a line from Delhi to Jaipur. How do you find its position from the two end positions? The **section formula** does exactly that. A point `$P$` **divides** the segment `$AB$` **internally in the ratio** `$m : n$` when `$P$` is on the segment and `$AP : PB = m : n$`. Slide `$m$` and `$n$` below.

<figure class="fig" data-fig="c11m-3d-section"><figcaption>P divides AB in the ratio m : n. The lengths AP and PB are printed so that you can check their ratio. Switch to "externally" to put P outside the segment.</figcaption></figure>

Here is the idea behind the formula. Drop perpendiculars from `$A$`, `$P$` and `$B$` to the x-axis. Parallel lines cut every transversal in the same ratio, so the feet divide the x-axis in the same ratio `$m : n$`. Step through the working:

<div class="steps" data-fig="c11m-3d-sectionsteps">
<div class="step">P divides AB internally in the ratio m : n. Drop perpendiculars from A, P and B to the x-axis.</div>
<div class="step">Parallel lines cut every transversal in the same ratio, so on the x-axis: (x − x₁) : (x₂ − x) = m : n.</div>
<div class="step">Cross-multiply: n(x − x₁) = m(x₂ − x), so x(m + n) = mx₂ + nx₁.</div>
<div class="step">The same argument works for y and z, which gives the full section formula.</div>
<div class="step">Special cases: m = n gives the midpoint, and three points give the centroid of a triangle.</div>
<div class="step">Example: A(2, −1, 4), B(8, 5, −2) in the ratio 1 : 2 gives P = (4, 1, 2).</div>
<div class="step">External division (P on line AB but outside the segment, m ≠ n): replace n by −n.</div>
</div>

```math
P = \left(\frac{mx_2 + nx_1}{m + n},\ \frac{my_2 + ny_1}{m + n},\ \frac{mz_2 + nz_1}{m + n}\right)
```

Remember the pattern: each coordinate of the **second** point `$B$` is multiplied by `$m$` and each coordinate of the **first** point `$A$` by `$n$` (the ratio is `$AP : PB$`, so the part nearer `$B$` weighs with `$m$`). If `$m = n$` you get the **midpoint** `$\left(\dfrac{x_1 + x_2}{2}, \dfrac{y_1 + y_2}{2}, \dfrac{z_1 + z_2}{2}\right)$`.

If `$P$` divides `$AB$` **externally** in the ratio `$m : n$` (with `$m \ne n$`), then `$P$` is on the line `$AB$` but outside the segment, and `$n$` becomes `$-n$`: `$x = \dfrac{mx_2 - nx_1}{m - n}$`, and so on. For `$m = n$` there is no such point.

<div class="problem" data-problem="c11m-3d-section"></div>

**The centroid.** The **centroid** of a triangle with vertices `$(x_1, y_1, z_1)$`, `$(x_2, y_2, z_2)$`, `$(x_3, y_3, z_3)$` is the average of the vertices: `$\left(\dfrac{x_1 + x_2 + x_3}{3}, \dfrac{y_1 + y_2 + y_3}{3}, \dfrac{z_1 + z_2 + z_3}{3}\right)$`. It divides every median in the ratio `$2 : 1$` from the vertex, which you can check with the section formula using `$m = 2$`, `$n = 1$` and the midpoint of the opposite side.

<div class="problem" data-problem="c11m-3d-centroid"></div>

**How to find where a plane cuts a segment.** The YZ-plane is `$x = 0$`. To find the ratio in which it divides `$A(-2, 3, 1)$` and `$B(4, -1, 5)$`, put the x-coordinate of the section formula equal to 0: `$\dfrac{4m - 2n}{m + n} = 0$`, so `$m : n = 1 : 2$`. A positive ratio means the division is internal.

<div class="history">

- **c. 300 BCE:** Euclid builds geometry in the plane and in solids with drawings and words only, with no coordinates.
- **1637:** René Descartes publishes the idea of locating points with numbers; his x and y later got a third partner, z.
- **1700s:** Euler, Clairaut and others write surfaces in space as equations in x, y and z.
- **Today:** every GPS fix gives latitude, longitude and height, a point `$(x, y, z)$` on and above the Earth.

</div>

<div class="myth">

**"The distance formula in space is √(x₂ − x₁)² + (y₂ − y₁)² only."** Leaving out the z-difference gives only the distance between the shadows of the two points on the floor. Two points can be directly above one another and still very far apart. All three squares go under the root, and each difference is squared before adding, so the order of subtraction does not matter.

</div>

<div class="keypoints">

- A point in space has three coordinates `$(x, y, z)$`; the three axes meet at right angles at the origin.
- The coordinate planes are `$z = 0$` (XY), `$x = 0$` (YZ) and `$y = 0$` (ZX); they cut space into eight octants named by the signs.
- Distance from a plane = absolute value of the matching coordinate; the mirror image in a plane flips just that sign.
- `$AB = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}$`; `$OP = \sqrt{x^2 + y^2 + z^2}$`; distance from the x-axis `$= \sqrt{y^2 + z^2}$`.
- Section formula (internal, ratio `$m : n$`): `$\left(\frac{mx_2 + nx_1}{m+n}, \dots\right)$`; midpoint is `$m = n$`; centroid is the average of the vertices.
- Beyond the syllabus: equations of lines and planes in space, direction cosines and the angle between lines belong to Class 12.

</div>

Going further for JEE/NEET: [Three-dimensional geometry](/learn/courses/engineering-entrance/three-d-geometry/) has the exam-level problems on lines, planes and distances.
