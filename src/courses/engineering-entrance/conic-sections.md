---
title: Parabola, ellipse and hyperbola
seoTitle: 'Parabola, ellipse and hyperbola: JEE maths'
summary: 'The focus-directrix definition and eccentricity, the standard parabola, ellipse and hyperbola with their foci, directrices, latus rectum and parametric forms, focal distances and focal chords, tangents and the tangency condition, normals, asymptotes, the rectangular hyperbola xy = c², and conics with shifted centres.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: 'The focus of the parabola y² = 12x is:'
    choices: ['(3, 0)', '(12, 0)', '(0, 3)', '(−3, 0)']
    ans: 0
    why: 'y² = 4ax with 4a = 12, so a = 3 and the focus is (a, 0) = (3, 0). The directrix is x = −3.'
  - q: 'The eccentricity of x²/25 + y²/9 = 1 is:'
    choices: ['4/5', '3/5', '5/4', '3/4']
    ans: 0
    why: 'b² = a²(1 − e²): 9 = 25(1 − e²), so e² = 16/25 and e = 4/5.'
  - q: 'The asymptotes of x²/16 − y²/9 = 1 are:'
    choices: ['y = ±(3/4)x', 'y = ±(4/3)x', 'y = ±(9/16)x', 'y = ±x']
    ans: 0
    why: 'For x²/a² − y²/b² = 1 the asymptotes are y = ±(b/a)x. Here b/a = 3/4.'
sources:
  - 'NCERT Mathematics Class 11 (Conic sections): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Coordinate geometry (conic sections)'
---

**Maths · Class 11 · about 40 minutes.** By the end you will be able to find the focus, directrix, eccentricity and latus rectum of any standard conic, use focal distances and parametric points, write tangents and normals, and solve the tangency and focal-chord questions that make up most of the JEE marks here.

<div class="bigidea">All three curves come from one rule: a point moves so that its distance from a fixed point (the focus) is e times its distance from a fixed line (the directrix). If e = 1 it is a parabola, if e is less than 1 an ellipse, if more than 1 a hyperbola. Remembering this rule saves more time than any list of formulae.</div>

## 1. One definition, three curves

```math
PS = e \cdot PM
```

<div class="meaning">
<dl>
<dt>S</dt><dd>the focus, a fixed point</dd>
<dt>M</dt><dd>the foot of the perpendicular from P to the directrix, a fixed line</dd>
<dt>e</dt><dd>the eccentricity: how "stretched" the curve is (0 for a circle, below 1 ellipse, 1 parabola, above 1 hyperbola)</dd>
<dt>a, b</dt><dd>the semi-axes of an ellipse or hyperbola; for a parabola, a is the distance from vertex to focus</dd>
<dt>Latus rectum</dt><dd>the chord through a focus perpendicular to the axis</dd>
<dt>Physical meaning</dt><dd>Any distance to a focus can be swapped for e times the distance to the directrix. That swap turns square roots into straight lines, and it is the key to focal-distance questions.</dd>
</dl>
</div>

<figure class="fig" data-fig="conic-focus"><figcaption>One focus S and one directrix. Change e and the same rule draws an ellipse, a parabola or a hyperbola. Move P and check that PS/PM stays equal to e.</figcaption></figure>

## 2. The parabola y² = 4ax

| Feature | Value |
|---|---|
| Vertex, focus | (0, 0), (a, 0) |
| Directrix, axis | x = −a, y = 0 |
| Latus rectum | length 4a, ends (a, ±2a) |
| Parametric point | (at², 2at) |
| Focal distance of (x₁, y₁) | x₁ + a |

The other three standard parabolas (y² = −4ax, x² = 4ay, x² = −4ay) just turn the picture. For a shifted parabola such as (y − k)² = 4a(x − h), move the origin to (h, k) and read everything as before.

**Focal chord.** If the ends of a chord through the focus have parameters t₁ and t₂, then `$t_1t_2 = -1$`. The length of a focal chord with one end at t is `$a\left(t + \tfrac1t\right)^2$`, and its shortest value is the latus rectum, 4a. The harmonic mean of the two parts of a focal chord is 2a, the semi-latus rectum.

<div class="problem" data-problem="con-focal"></div>

**Tangents and normals to y² = 4ax.**

- At (x₁, y₁): `$yy_1 = 2a(x + x_1)$`. At t: `$ty = x + at^2$`.
- With slope m: `$y = mx + \tfrac{a}{m}$` (the tangency condition is c = a/m).
- Normal at t: `$y = -tx + 2at + at^3$`. In slope form `$y = mx - 2am - am^3$`: a cubic in m, so up to three normals pass through a point. Their feet satisfy `$t_1 + t_2 + t_3 = 0$`.
- Tangents at t₁ and t₂ meet at `$(at_1t_2,\ a(t_1 + t_2))$`. Tangents at the ends of a focal chord meet on the directrix at right angles.

<div class="myth">

**"For x² = 4ay, the focus is (a, 0)."** The squared variable tells you the axis. In x² = 4ay, x is squared, so the parabola opens along the y-axis and the focus is (0, a). Always find the axis first.

</div>

## 3. The ellipse x²/a² + y²/b² = 1 (a > b)

```math
b^2 = a^2(1 - e^2), \qquad \text{foci } (\pm ae, 0), \qquad \text{directrices } x = \pm\frac ae, \qquad \text{latus rectum } \frac{2b^2}{a}
```

The parametric point is (a cos θ, b sin θ). The **focal distances** of a point P(x₁, y₁) are `$a - ex_1$` and `$a + ex_1$`, so

```math
PS_1 + PS_2 = 2a
```

That is the "string and two pins" definition of an ellipse. If b > a in the equation, the major axis is along y: swap the roles, with `$a^2 = b^2(1 - e^2)$` and foci on the y-axis.

**Tangents.** At (x₁, y₁): `$\tfrac{xx_1}{a^2} + \tfrac{yy_1}{b^2} = 1$`. At θ: `$\tfrac{x\cos\theta}{a} + \tfrac{y\sin\theta}{b} = 1$`. With slope m: `$y = mx \pm\sqrt{a^2m^2 + b^2}$`, so the condition is

```math
c^2 = a^2m^2 + b^2
```

<div class="problem" data-problem="con-tangent"></div>

The point of the ellipse farthest from or nearest to a line is where the tangent is parallel to that line. Greatest and least values of expressions like x + y on the ellipse come from the parametric point: `$a\cos\theta + b\sin\theta$` ranges over `$\pm\sqrt{a^2 + b^2}$`. The **director circle** (perpendicular tangents) is `$x^2 + y^2 = a^2 + b^2$`.

## 4. The hyperbola x²/a² − y²/b² = 1

```math
b^2 = a^2(e^2 - 1), \qquad \text{foci } (\pm ae, 0), \qquad \text{directrices } x = \pm\frac ae, \qquad |PS_1 - PS_2| = 2a
```

The latus rectum is again 2b²/a, and the parametric point is (a sec θ, b tan θ). Tangent at (x₁, y₁): `$\tfrac{xx_1}{a^2} - \tfrac{yy_1}{b^2} = 1$`; with slope m the condition is `$c^2 = a^2m^2 - b^2$`.

**Asymptotes** are the lines the hyperbola approaches far away: `$y = \pm\tfrac bax$`. Write them by replacing the 1 with 0: x²/a² − y²/b² = 0. The **conjugate hyperbola** x²/a² − y²/b² = −1 has the same asymptotes, and if e₁, e₂ are the two eccentricities, `$\tfrac1{e_1^2} + \tfrac1{e_2^2} = 1$`.

**Rectangular hyperbola.** When a = b the asymptotes are perpendicular and `$e = \sqrt2$`. Turned through 45°, it becomes `$xy = c^2$`, with parametric point `$(ct, c/t)$` and tangent at t: `$x + t^2y = 2ct$`.

<div class="myth">

**"A line with the slope of an asymptote must be a tangent somewhere."** A line parallel to an asymptote meets the hyperbola only once but is not a tangent; that is why c² = a²m² − b² gives no tangent when m = ±b/a. Tangents exist only for slopes with |m| > b/a.

</div>

## 5. Quick comparison

| | Parabola y² = 4ax | Ellipse x²/a² + y²/b² = 1 | Hyperbola x²/a² − y²/b² = 1 |
|---|---|---|---|
| e | 1 | `$\sqrt{1 - b^2/a^2}$` | `$\sqrt{1 + b^2/a^2}$` |
| Focus | (a, 0) | (±ae, 0) | (±ae, 0) |
| Latus rectum | 4a | 2b²/a | 2b²/a |
| Tangency for y = mx + c | c = a/m | c² = a²m² + b² | c² = a²m² − b² |
| Focal property | PS = PM | PS₁ + PS₂ = 2a | \|PS₁ − PS₂\| = 2a |

**Worked example.** Find the equation of the ellipse with foci (±3, 0) and eccentricity 1/2. ae = 3 gives a = 6, and b² = a²(1 − e²) = 36 × 3/4 = 27. So **x²/36 + y²/27 = 1**.

<div class="keypoints">

- PS = e·PM: e = 1 parabola, e < 1 ellipse, e > 1 hyperbola.
- y² = 4ax: focus (a, 0), directrix x = −a, latus rectum 4a, point (at², 2at), focal distance x + a.
- Focal chord of a parabola: t₁t₂ = −1; tangents at its ends meet at right angles on the directrix.
- Ellipse: b² = a²(1 − e²), PS₁ + PS₂ = 2a; hyperbola: b² = a²(e² − 1), |PS₁ − PS₂| = 2a.
- Tangency: c = a/m, c² = a²m² + b², c² = a²m² − b².
- Asymptotes y = ±(b/a)x; rectangular hyperbola e = √2, xy = c², point (ct, c/t).

</div>
