---
title: Circles
seoTitle: 'Circles: JEE maths'
summary: 'Standard, general, diameter and parametric forms of a circle, circles touching the axes, position of a point and of a line, chord length, tangents at a point and from a point, tangent length, chord of contact and chord with a given midpoint, director circle, nearest and farthest points, two circles and their common tangents, orthogonal circles, radical axis and families of circles.'
minutes: 38
updated: 2026-11-22
quiz:
  - q: 'The centre and radius of x² + y² − 6x + 8y = 0 are:'
    choices: ['(3, −4) and 5', '(−3, 4) and 5', '(3, −4) and 25', '(6, −8) and 10']
    ans: 0
    why: 'Here 2g = −6 and 2f = 8, so the centre is (−g, −f) = (3, −4) and r = √(9 + 16 − 0) = 5. The circle passes through the origin because c = 0.'
  - q: 'The line y = x + c touches x² + y² = 8 when c is:'
    choices: ['±4', '±2', '±8', '±2√2']
    ans: 0
    why: 'Tangency condition for y = mx + c and x² + y² = a²: c² = a²(1 + m²) = 8 × 2 = 16, so c = ±4.'
  - q: 'How many common tangents do the circles x² + y² = 1 and (x − 4)² + y² = 4 have?'
    choices: ['4', '3', '2', '1']
    ans: 0
    why: 'The distance between centres is 4, which is more than r₁ + r₂ = 3. The circles are apart, so there are 4 common tangents (2 direct, 2 transverse).'
sources:
  - 'NCERT Mathematics Class 11 (Conic sections: circle): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Coordinate geometry (circles)'
---

**Maths · Class 11 · about 38 minutes.** By the end you will be able to read the centre and radius from any circle equation, find chords and tangents in all their forms, decide how two circles sit relative to each other and count their common tangents, and use the radical axis and families of circles.

<div class="bigidea">A circle is every point at a fixed distance r from a centre. So nearly every circle question turns into a distance from the centre: compare it with r to decide inside or outside, meet or miss, touch or cut. The algebra (S, S₁, T) is just this comparison written in coordinates.</div>

## 1. Equations of a circle

```math
(x-h)^2 + (y-k)^2 = r^2, \qquad x^2 + y^2 + 2gx + 2fy + c = 0 \;\text{ with centre } (-g, -f),\ r = \sqrt{g^2 + f^2 - c}
```

<div class="meaning">
<dl>
<dt>(h, k), r</dt><dd>centre and radius</dd>
<dt>g, f, c</dt><dd>the coefficients in the general form; the equation is a real circle only when g² + f² − c > 0</dd>
<dt>S</dt><dd>shorthand for the left side x² + y² + 2gx + 2fy + c</dd>
<dt>S₁</dt><dd>S with a point (x₁, y₁) put in; it equals (distance to centre)² − r²</dd>
<dt>T</dt><dd>xx₁ + yy₁ + g(x + x₁) + f(y + y₁) + c: the "half-substituted" form used for tangents and chords</dd>
<dt>Physical meaning</dt><dd>S₁ compares the point's distance from the centre with the radius: negative inside, zero on the circle, positive outside, where it is also the square of the tangent length.</dd>
</dl>
</div>

An equation `$ax^2 + ay^2 + \cdots = 0$` is a circle only if the x² and y² coefficients are equal and there is no xy term. Divide by a before reading g, f and c.

<div class="problem" data-problem="cir-radius"></div>

**Other forms.**

- **Diameter form.** With ends of a diameter (x₁, y₁) and (x₂, y₂): `$(x-x_1)(x-x_2) + (y-y_1)(y-y_2) = 0$`. It says the angle in a semicircle is a right angle.
- **Parametric form.** x = h + r cos θ, y = k + r sin θ.
- **Touching the axes.** Touching the x-axis means |k| = r; touching both axes means |h| = |k| = r. The circle cuts an intercept of `$2\sqrt{g^2 - c}$` on the x-axis and `$2\sqrt{f^2 - c}$` on the y-axis.

## 2. A point and a line

**Point.** S₁ < 0 inside, S₁ = 0 on, S₁ > 0 outside. The nearest and farthest points of the circle from P lie on the line through P and the centre, at distances |d − r| and d + r, where d is the distance from P to the centre.

**Line.** Let p be the distance from the centre to the line. If p > r the line misses the circle, p = r it touches, p < r it cuts a chord of length

```math
\text{chord} = 2\sqrt{r^2 - p^2}
```

<div class="problem" data-problem="cir-chord"></div>

## 3. Tangents

- **At a point (x₁, y₁) on the circle:** T = 0. For x² + y² = a², that is `$xx_1 + yy_1 = a^2$`.
- **With slope m** to x² + y² = a²: `$y = mx \pm a\sqrt{1+m^2}$`. So y = mx + c touches when `$c^2 = a^2(1+m^2)$`.
- **From an outside point P:** two tangents of length `$\sqrt{S_1}$`. To find them, write a line through P with slope m and set its distance from the centre equal to r. If only one m comes out, the other tangent is vertical.

<figure class="fig" data-fig="circle-tangent"><figcaption>Move P. Inside, S₁ is negative and no tangent exists; on the circle there is one; outside there are two of equal length √S₁, and the dashed chord joining their points of contact is the chord of contact T = 0.</figcaption></figure>

<div class="problem" data-problem="cir-tangent"></div>

**Chord of contact** from an outside point P: T = 0, the same equation as the tangent at P, but now P is outside. **Chord with a given midpoint** M(x₁, y₁): T = S₁. Its slope is perpendicular to the line from the centre to M.

**Angle between the tangents** from P: if θ is that angle, then `$\tan\tfrac\theta2 = \dfrac{r}{\sqrt{S_1}}$`. The **director circle** is the set of points from which the two tangents are perpendicular: for x² + y² = a² it is x² + y² = 2a².

<div class="myth">

**"T = 0 is always a tangent."** T = 0 is the tangent only when (x₁, y₁) is on the circle. For an outside point the same equation is the chord of contact, and for an inside point it is a line that misses the circle (the polar). Check where the point is first.

</div>

## 4. Two circles

Let d be the distance between the centres and r₁, r₂ the radii.

| Position | Condition | Common tangents |
|---|---|---|
| one outside the other | d > r₁ + r₂ | 4 |
| touching from outside | d = r₁ + r₂ | 3 |
| cutting in two points | \|r₁ − r₂\| < d < r₁ + r₂ | 2 |
| touching from inside | d = \|r₁ − r₂\| | 1 |
| one inside the other | d < \|r₁ − r₂\| | 0 |

**Orthogonal circles** cut at right angles, so the radii to a common point are perpendicular and d² = r₁² + r₂². In terms of the general forms:

```math
2g_1g_2 + 2f_1f_2 = c_1 + c_2
```

**Radical axis.** S₁ − S₂ = 0 (with both equations in standard form, x² and y² coefficient 1). It is the line of points with equal tangent lengths to both circles; when the circles cut, it is their common chord. It is perpendicular to the line of centres. The radical axes of three circles taken in pairs meet at the **radical centre**.

## 5. Families of circles

- **Through the meeting points of S = 0 and the line L = 0:** S + λL = 0.
- **Through the meeting points of two circles:** S₁ + λS₂ = 0 (λ ≠ −1), or S₁ + λ(S₁ − S₂) = 0.
- **Touching a line L = 0 at a point P:** (circle of radius 0 at P) + λL = 0.

Find λ from the extra condition (passing through a point, centre on a line, and so on).

**Worked example.** Find the circle through the points where x² + y² = 9 meets x + y = 1, and through the origin. Family: x² + y² − 9 + λ(x + y − 1) = 0. The origin gives −9 − λ = 0, so λ = −9: **x² + y² − 9x − 9y = 0**.

<div class="keypoints">

- Centre (−g, −f), r = √(g² + f² − c); divide by the x² coefficient first.
- S₁ < 0, = 0, > 0: inside, on, outside; tangent length √S₁.
- Chord length 2√(r² − p²); y = mx + c touches x² + y² = a² when c² = a²(1 + m²).
- Tangent at a point and chord of contact: T = 0. Chord with midpoint: T = S₁.
- Two circles: compare d with r₁ + r₂ and |r₁ − r₂| to count common tangents (4, 3, 2, 1, 0).
- Orthogonal: 2g₁g₂ + 2f₁f₂ = c₁ + c₂. Radical axis S₁ − S₂ = 0. Families: S + λL = 0, S₁ + λS₂ = 0.

</div>
