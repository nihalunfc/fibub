---
title: Conic Sections
seoTitle: 'Conic Sections Class 11 notes: parabola, ellipse'
summary: 'Class 11 Conic Sections with animations: slicing a cone, circle, parabola, ellipse and hyperbola, focus and directrix, eccentricity and latus rectum.'
minutes: 90
updated: 2026-11-23
quiz:
  - q: 'The parabola y² = 16x has its focus at:'
    choices: ['(4, 0)', '(16, 0)', '(8, 0)', '(0, 4)']
    ans: 0
    why: 'Compare with y² = 4ax: 4a = 16, so a = 4 and the focus is (a, 0) = (4, 0).'
  - q: 'For the ellipse x²/25 + y²/9 = 1 the distance between the two foci is:'
    choices: ['8', '4', '10', '6']
    ans: 0
    why: 'c² = a² − b² = 25 − 9 = 16, so c = 4. The foci are (±4, 0), which are 2c = 8 apart.'
  - q: 'A conic with eccentricity e = 1 is a:'
    choices: ['parabola', 'ellipse', 'hyperbola', 'circle']
    ans: 0
    why: 'e < 1 is an ellipse (e = 0 a circle), e = 1 a parabola, e > 1 a hyperbola.'
sources:
  - 'NCERT Class 11 Mathematics, Chapter 10 “Conic Sections” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Apollonius of Perga, Conics (c. 200 BCE); standard definitions of the conics by focus and directrix, as in any analytic geometry text (e.g. Thomas, G. B., Calculus, Pearson); every numerical example was recomputed in code.'
  - 'Kepler, J., Astronomia Nova (1609) for the elliptical orbits of planets.'
---

**Maths · Class 11 · Chapter 10 · about 90 minutes.** By the end you will be able to name a conic from its equation, write the equation of a circle, parabola, ellipse or hyperbola from its parts, and find the foci, vertices, eccentricity and latus rectum from an equation.

<div class="bigidea">One idea makes four curves. Take a point (the focus) and a line (the directrix) and keep every point whose distance from the focus is a fixed multiple e of its distance from the line. Make e smaller than 1 and you get an ellipse, exactly 1 a parabola, bigger than 1 a hyperbola. A circle is the special case where the focus is the centre. The same curves also appear when you slice a cone, which is why they are called conic sections.</div>

## 1. Slicing a cone

Imagine a cone of ice cream standing on its tip, and a second cone standing on top, tip to tip: a double cone. Cut it with a flat knife. What you get depends only on the tilt of the cut.

- Cut straight across (at right angles to the axis): a **circle**.
- Tilt a little: an **ellipse**, a stretched circle.
- Tilt until the knife is parallel to the slanting side: a **parabola**, which never closes.
- Tilt more, so that the knife cuts both cones: a **hyperbola** with two separate branches.

Turn the cone below and tilt the plane to see all four.

<figure class="fig" data-fig="@math-cone-slice"><figcaption>A double cone cut by a plane. Drag to turn it, and change the tilt to move from circle to ellipse to parabola to hyperbola.</figcaption></figure>

For the rest of the chapter we forget the cone and study each curve on a coordinate plane, with its centre or vertex at the origin so that the equations stay simple.

## 2. The circle

A **circle** is the set of all points in a plane at a fixed distance `$r$` (the **radius**) from a fixed point (the **centre**). If the centre is `$(h, k)$` and `$P(x, y)$` is on the circle, the distance formula gives `$\sqrt{(x-h)^2 + (y-k)^2} = r$`. Squaring:

```math
(x - h)^2 + (y - k)^2 = r^2
```

If the centre is the origin this becomes `$x^2 + y^2 = r^2$`. Drag the centre, the radius handle and the test point to see the equation change, and notice how the test point is inside when its distance from the centre is less than `$r$`.

<figure class="fig" data-fig="c11m-conic-circle"><figcaption>A circle with a draggable centre, radius and test point. The equation updates, and the test point is called inside, on or outside by comparing its distance with r.</figcaption></figure>

Multiplying out the brackets gives the **general form** `$x^2 + y^2 + 2gx + 2fy + c = 0$`. Comparing, the centre is `$(-g, -f)$` and `$r^2 = g^2 + f^2 - c$`. If `$g^2 + f^2 - c$` is zero the "circle" is a single point; if it is negative there is no circle at all.

<div class="meaning">
<dl>
<dt>`$(h, k)$`</dt><dd>the centre of the circle.</dd>
<dt>`$r$`</dt><dd>the radius, the same for every point of the circle.</dd>
<dt>`$g, f, c$`</dt><dd>numbers in `$x^2 + y^2 + 2gx + 2fy + c = 0$`; the centre is `$(-g, -f)$`. Notice the sign flip.</dd>
</dl>
</div>

**Worked example.** Find the centre and radius of `$x^2 + y^2 - 4x + 6y - 12 = 0$`. Here `$2g = -4$` so `$g = -2$`, and `$2f = 6$` so `$f = 3$`, `$c = -12$`. The centre is `$(2, -3)$` and `$r^2 = 4 + 9 + 12 = 25$`, so `$r = 5$`.

<div class="problem" data-problem="c11m-conic-circle"></div>

<div class="myth">

**"The centre of `$x^2 + y^2 - 6x + 4y = 0$` is `$(-6, 4)$`."** The coefficients are `$2g$` and `$2f$`, not `$g$` and `$f$`, and the centre has the opposite signs. Here `$2g = -6$`, `$2f = 4$`, so the centre is `$(3, -2)$`. A good check: put the centre back into the left side. The answer must equal `$c - g^2 - f^2$`, which is `$-r^2$`.

</div>

## 3. One idea behind the other three: focus, directrix and eccentricity

A cricket fielder stands at point F and a boundary rope runs along a straight line. Suppose you mark every spot on the ground that is exactly half as far from the fielder as from the rope. You get a closed oval. Now mark the spots exactly as far from the fielder as from the rope: the curve opens out and never closes. Mark the spots twice as far from the fielder as from the rope: the curve splits into two arms.

Those are the three non-circular conics. The fixed point is the **focus**, the fixed line is the **directrix** and the fixed ratio is the **eccentricity** `$e$`:

```math
PF = e \cdot PD
```

where `$PD$` is the perpendicular distance from `$P$` to the directrix. Slide `$e$` below and watch the shape change. The ratio `$PF \div PD$` printed under the figure never changes as `$P$` moves.

<figure class="fig" data-fig="c11m-conic-focus"><figcaption>Every point P of the curve has PF = e × PD. Change e: below 1 the curve is an ellipse, at exactly 1 a parabola, above 1 a hyperbola.</figcaption></figure>

- `$0 < e < 1$`: **ellipse** (and `$e = 0$` is the circle, where the directrix has gone infinitely far away).
- `$e = 1$`: **parabola**.
- `$e > 1$`: **hyperbola**.

## 4. The parabola

A **parabola** is the set of points equally far from a fixed point (the focus) and a fixed line (the directrix), so `$e = 1$`. The line through the focus perpendicular to the directrix is the **axis**; the point of the curve halfway between focus and directrix is the **vertex**.

Put the vertex at the origin, the focus at `$(a, 0)$` and the directrix at `$x = -a$`. Step through the derivation:

<div class="steps" data-fig="c11m-conic-parasteps">
<div class="step">Put the focus at F(a, 0) and the directrix at x = −a. P(x, y) is on the parabola when PF = PD.</div>
<div class="step">PF = √((x − a)² + y²) and PD = x + a.</div>
<div class="step">Set PF = PD and square both sides: (x − a)² + y² = (x + a)².</div>
<div class="step">Expand both brackets: x² − 2ax + a² + y² = x² + 2ax + a².</div>
<div class="step">Cancel x² and a² and collect the x terms: y² = 4ax.</div>
<div class="step">That is the standard equation. The latus rectum is the chord through F: put x = a to get y = ±2a, so its length is 4a.</div>
</div>

The **latus rectum** is the chord through the focus perpendicular to the axis. Its length `$4a$` tells you how wide the parabola is at the focus.

There are four standard positions. Which way a parabola opens depends on which variable is squared and on the sign.

| Equation | Opens | Focus | Directrix | Latus rectum |
|---|---|---|---|---|
| `$y^2 = 4ax$` | right | `$(a, 0)$` | `$x = -a$` | `$4a$` |
| `$y^2 = -4ax$` | left | `$(-a, 0)$` | `$x = a$` | `$4a$` |
| `$x^2 = 4ay$` | up | `$(0, a)$` | `$y = -a$` | `$4a$` |
| `$x^2 = -4ay$` | down | `$(0, -a)$` | `$y = a$` | `$4a$` |

(Here `$a > 0$`.) Try each of the four in the explorer below and watch the focus, directrix and latus rectum move.

<figure class="fig" data-fig="c11m-conic-standard"><figcaption>The four standard conics with their parts. Choose Parabola and pick which way it opens, or switch to the circle, ellipse and hyperbola.</figcaption></figure>

<div class="problem" data-problem="c11m-conic-focal"></div>

**Where it is used.** A satellite dish and a torch reflector are parabolas: all rays arriving parallel to the axis bounce to the focus (or, in a torch, leave the focus and go out parallel). The cable of a suspension bridge with a flat deck hangs in a parabola. Try the dish below and move the receiver.

<!--fig:tool parabolic-dish-->

<div class="problem" data-problem="c11m-conic-parabolalr"></div>

## 5. The ellipse

An **ellipse** is the set of points in a plane whose distances from two fixed points (the **foci**) add up to a constant. Draw it yourself: push two pins into a board, tie a loop of string loosely round them and pull the loop tight with a pencil. As you move the pencil it traces an ellipse, because the two string lengths add to a fixed number. The farther apart the pins, the flatter the ellipse; if the pins are on top of each other you get a circle.

<figure class="fig" data-fig="c11m-conic-string"><figcaption>The pins-and-string ellipse: the sum PF₁ + PF₂ stays equal to 2a all the way round. Switch to Hyperbola to see the difference version.</figcaption></figure>

Let the foci be `$F_1(-c, 0)$` and `$F_2(c, 0)$` and the constant sum be `$2a$`, with `$a > c$`. The derivation takes a few algebra steps, because a square root has to be removed twice.

<div class="steps" data-fig="c11m-conic-ellipsesteps">
<div class="step">Foci F₁(−c, 0) and F₂(c, 0). P(x, y) is on the ellipse when PF₁ + PF₂ = 2a, with a &gt; c.</div>
<div class="step">Isolate one root: √((x + c)² + y²) = 2a − √((x − c)² + y²).</div>
<div class="step">Square, expand and cancel: 4cx = 4a² − 4a√((x − c)² + y²).</div>
<div class="step">Divide by 4 and square again: a²((x − c)² + y²) = (a² − cx)².</div>
<div class="step">Expand and collect: (a² − c²)x² + a²y² = a²(a² − c²).</div>
<div class="step">Write b² = a² − c² and divide by a²b²: x²/a² + y²/b² = 1.</div>
<div class="step">So c² = a² − b² and e = c/a &lt; 1. The semi-major axis is a, the semi-minor axis is b.</div>
</div>

```math
\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1, \qquad c^2 = a^2 - b^2, \qquad e = \frac{c}{a}, \qquad \text{latus rectum} = \frac{2b^2}{a}
```

<div class="meaning">
<dl>
<dt>`$a$`</dt><dd>the **semi-major axis**: the longest distance from the centre (half of the major axis, which is `$2a$` long). The vertices are `$(\pm a, 0)$`.</dd>
<dt>`$b$`</dt><dd>the **semi-minor axis**: half of the shortest width. Its ends are `$(0, \pm b)$`.</dd>
<dt>`$c$`</dt><dd>the distance from the centre to each focus. The foci are `$(\pm c, 0)$`.</dd>
<dt>`$e$`</dt><dd>eccentricity `$c/a$`, always between 0 and 1: near 0 it is almost a circle, near 1 it is a thin cigar.</dd>
</dl>
</div>

If the larger denominator is under `$y^2$`, the major axis lies along the y-axis: swap the roles, so the foci are `$(0, \pm c)$` with `$c^2 = b^2 - a^2$` (where `$b > a$` now). The rule is simple: the **larger** denominator is `$a^2$`, and the foci lie along that axis.

**Worked example.** For `$\dfrac{x^2}{25} + \dfrac{y^2}{9} = 1$`: `$a = 5$`, `$b = 3$`, `$c = \sqrt{25 - 9} = 4$`. Foci `$(\pm 4, 0)$`, vertices `$(\pm 5, 0)$`, `$e = 4/5$`, latus rectum `$2 \times 9 / 5 = 18/5$`. Use the standard-forms figure above with Ellipse selected, and set a to 5 and b to 3 to check each number.

<div class="problem" data-problem="c11m-conic-ellipse"></div>

**Where it is used.** Each planet moves in an ellipse with the Sun at one focus (Kepler, 1609). Earth's orbit has `$e \approx 0.017$`, almost a circle; Halley's comet has `$e \approx 0.97$`. A whispering gallery shaped like an ellipse carries a whisper from one focus to the other, because every path from F₁ to the wall to F₂ has the same length.

<!--fig:tool conic-explorer-->

## 6. The hyperbola

A **hyperbola** is the set of points whose distances from two fixed points (the foci) differ by a constant: `$|PF_1 - PF_2| = 2a$`. Flip the figure above to Hyperbola: the string version uses a difference where the ellipse uses a sum.

With foci `$(\pm c, 0)$` and `$c > a$` the algebra mirrors the ellipse and gives:

```math
\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1, \qquad c^2 = a^2 + b^2, \qquad e = \frac{c}{a} > 1, \qquad \text{latus rectum} = \frac{2b^2}{a}
```

Compare carefully with the ellipse: there is a minus between the terms, and `$c^2 = a^2 + b^2$` (plus, not minus). The curve has two branches with vertices `$(\pm a, 0)$`. It never crosses the y-axis, because putting `$x = 0$` would need `$y^2 = -b^2$`.

Far from the centre each branch straightens out towards two lines through the centre, the **asymptotes** `$y = \pm\dfrac{b}{a}x$`. A quick way to draw a hyperbola: draw the box of half-width `$a$` and half-height `$b$`, draw its diagonals (the asymptotes) and sketch the branches from the vertices hugging the diagonals.

<div class="meaning">
<dl>
<dt>`$a$`</dt><dd>half the **transverse axis**, the segment joining the two vertices `$(\pm a, 0)$`.</dd>
<dt>`$b$`</dt><dd>half the **conjugate axis**. It need not be smaller than `$a$` (a hyperbola has no "major" and "minor" order).</dd>
<dt>`$c$`</dt><dd>centre to focus, `$c = \sqrt{a^2 + b^2}$`, always larger than `$a$`.</dd>
<dt>`$e$`</dt><dd>`$c/a$`, always larger than 1.</dd>
</dl>
</div>

The hyperbola `$\dfrac{y^2}{a^2} - \dfrac{x^2}{b^2} = 1$` has its transverse axis along the y-axis: the foci are `$(0, \pm c)$`. The variable with the **positive** sign tells you the direction the branches open.

**Worked example.** For `$\dfrac{x^2}{16} - \dfrac{y^2}{9} = 1$`: `$a = 4$`, `$b = 3$`, `$c = \sqrt{16 + 9} = 5$`. Foci `$(\pm 5, 0)$`, vertices `$(\pm 4, 0)$`, `$e = 5/4$`, latus rectum `$2 \times 9 / 4 = 9/2$`, asymptotes `$y = \pm \dfrac34 x$`.

<div class="problem" data-problem="c11m-conic-hyper"></div>

**Where it is used.** Old ship-navigation systems (LORAN) found position from the **difference** in arrival times of two radio signals: that difference fixes the ship on a hyperbola with the two transmitters as foci. Cooling towers in power stations are shaped like a hyperbola turned about its axis, which is strong and uses little concrete. A sonic boom from a fast aircraft reaches the ground along a hyperbola.

Watch how a ray leaving one focus is bounced by each curve (the law of reflection):

<figure class="fig" data-fig="@math-conic-reflect"><figcaption>A ray from a focus reflects off an ellipse (to the other focus), a parabola (parallel to the axis) and a hyperbola (as if from the other focus).</figcaption></figure>

## 7. Which conic is it? A summary

| | Circle | Parabola | Ellipse | Hyperbola |
|---|---|---|---|---|
| Standard equation | `$x^2 + y^2 = r^2$` | `$y^2 = 4ax$` | `$\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$` | `$\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$` |
| Eccentricity | 0 | 1 | between 0 and 1 | more than 1 |
| Rule | constant distance from the centre | `$PF = PD$` | `$PF_1 + PF_2 = 2a$` | `$\lvert PF_1 - PF_2\rvert = 2a$` |
| Relation | none | none | `$c^2 = a^2 - b^2$` | `$c^2 = a^2 + b^2$` |
| Latus rectum | none | `$4a$` | `$2b^2/a$` | `$2b^2/a$` |

To tell the curves apart from an equation: if both `$x^2$` and `$y^2$` appear with the same positive coefficient it is a circle; with different positive coefficients an ellipse; with opposite signs a hyperbola; if only one of them is squared it is a parabola.

<div class="history">

- **c. 200 BCE:** Apollonius of Perga names the ellipse, parabola and hyperbola in his book *Conics*.
- **1609:** Johannes Kepler shows that Mars (and every planet) moves in an ellipse with the Sun at one focus.
- **1637:** Descartes and Fermat give each curve an equation, which is what you used in this chapter.
- **1687:** Newton proves that gravity makes orbits conic sections: ellipses for planets, parabolas or hyperbolas for comets that escape.

</div>

<div class="myth">

**"The ellipse and hyperbola use the same relation between a, b, c."** They do not. For an ellipse `$c^2 = a^2 - b^2$`, so `$c < a$`. For a hyperbola `$c^2 = a^2 + b^2$`, so `$c > a$`. If your `$c$` for a hyperbola comes out smaller than `$a$`, you used the ellipse rule. Another trap: in an ellipse `$a$` is always the **larger** semi-axis, even when it sits under `$y^2$`.

</div>

<div class="keypoints">

- A conic is the set of points with `$PF = e \cdot PD$`: ellipse `$e < 1$`, parabola `$e = 1$`, hyperbola `$e > 1$`. The circle has `$e = 0$`.
- Circle: `$(x-h)^2 + (y-k)^2 = r^2$`; general form `$x^2 + y^2 + 2gx + 2fy + c = 0$`, centre `$(-g, -f)$`, `$r^2 = g^2 + f^2 - c$`.
- Parabola `$y^2 = 4ax$`: focus `$(a, 0)$`, directrix `$x = -a$`, latus rectum `$4a$`; the other three turns swap or flip the variables.
- Ellipse `$\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$` (`$a > b$`): `$c^2 = a^2 - b^2$`, `$e = c/a$`, latus rectum `$2b^2/a$`, sum of focal distances `$2a$`.
- Hyperbola `$\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$`: `$c^2 = a^2 + b^2$`, `$e = c/a$`, latus rectum `$2b^2/a$`, asymptotes `$y = \pm \frac{b}{a}x$`, difference of focal distances `$2a$`.
- Beyond the syllabus: the general second-degree equation, rotated conics and tangents to conics are for later classes.

</div>

Going further for JEE/NEET: [Parabola, ellipse and hyperbola](/learn/courses/engineering-entrance/conic-sections/) has tangents, normals, chords and the exam-level problems.
