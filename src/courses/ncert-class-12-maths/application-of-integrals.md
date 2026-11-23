---
title: Application of Integrals
seoTitle: 'Application of Integrals Class 12 notes: area under curves'
summary: 'Class 12 Application of Integrals with animations: area under a curve, area using horizontal strips, area between two curves, circle and ellipse, signed areas.'
minutes: 80
updated: 2026-11-22
quiz:
  - q: 'The area bounded by y = x², the x-axis and the lines x = 0 and x = 3 is:'
    choices: ['3 square units', '6 square units', '9 square units', '27 square units']
    ans: 2
    why: 'A = ∫₀³ x² dx = [x³/3]₀³ = 27/3 = 9.'
  - q: 'The area between y = x and y = x² is found by integrating:'
    choices: ['x² − x from 0 to 1', 'x − x² from 0 to 1', 'x − x² from 0 to 2', 'x + x² from 0 to 1']
    ans: 1
    why: 'The curves meet where x = x², so at x = 0 and x = 1. Between them the line is on top, so the strip height is (top − bottom) = x − x².'
  - q: 'The value of ∫ from 0 to 2π of sin x dx is 0, but the area between the sine curve and the x-axis over 0 to 2π is:'
    choices: ['0', '2', '4', '2π']
    ans: 2
    why: 'The part above the axis has area 2 and the part below also has area 2. The integral subtracts them, but the true area adds them: 4.'
sources:
  - 'NCERT Class 12 Mathematics, Chapter 8 “Application of Integrals” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Area by integration and the use of horizontal and vertical elements: Stewart, J., Calculus (Cengage), chapter 6; Thomas, G. B., Calculus (Pearson), chapter 5'
  - 'Area of an ellipse by integration (πab): Apostol, T. M., Calculus, Volume 1 (Wiley, 1967), section 2.8'
---

**Maths · Class 12 · Chapter 8 · about 80 minutes.** By the end you will be able to find the area under a curve, the area using horizontal strips, the area between two curves, the area of a circle or an ellipse, and the true area where a curve crosses the axis.

<div class="bigidea">A curved shape has no formula like "length times breadth". But a very thin strip of it is almost a rectangle. Add up the areas of all the thin strips and you get the whole area. That addition is an integral. The whole chapter is learning to draw one typical strip, name its height and its width, and add.</div>

## 1. Area under a curve

Take `$y = f(x)$` above the x-axis between `$x = a$` and `$x = b$`. Slice the region into vertical strips. A strip at position `$x$` has height `$y = f(x)$` and a tiny width `$dx$`, so its area is `$y\,dx$`. The total is

```math
A = \int_a^b y\,dx = \int_a^b f(x)\,dx
```

<figure class="fig" data-fig="c12m-aoi-strips"><figcaption>Thin vertical strips under a curve. Drag the two limit handles (or use the sliders), switch the curve, and raise the number of strips: the strip sum settles on the exact area from the integral.</figcaption></figure>

<div class="meaning">

<dl>
<dt>y dx</dt><dd>area of one thin strip: height y times width dx</dd>
<dt>a, b</dt><dd>where the region starts and stops along the x-axis</dd>
<dt>Physical meaning</dt><dd>A farmer measuring a curved plot walks along a straight road and measures the distance to the field's edge every metre. Each reading times 1 m is a strip; the total is the area. The integral is the same idea with infinitely many readings.</dd>
</dl>

</div>

**Worked example.** The area under `$y = x^2$` from 0 to 2 is `$\int_0^2 x^2dx = [x^3/3]_0^2 = 8/3$` square units. Compare with the rectangle `$2 \times 4 = 8$`: the curve takes up exactly one third of it, which you can check with the strips.

<div class="problem" data-problem="c12m-aoi-under"></div>

<!--fig:tool riemann-sums-->

### Area from a speed graph

The same idea appears in everyday life. If a train's speed `$v$` is plotted against time `$t$`, a strip of width `$dt$` is the distance covered in that instant, `$v\,dt$`. So the area under a speed-time graph is the distance travelled.

<figure class="fig" data-fig="c12m-aoi-distance"><figcaption>A train speeds up, cruises and brakes. Press Play, or slide the clock: the shaded area is the distance covered so far, and it reaches 600 m at the end.</figcaption></figure>

<div class="problem" data-problem="c12m-aoi-train"></div>

## 2. Area with respect to the y-axis (horizontal strips)

Sometimes the region is easier to describe as "x in terms of y". Then use **horizontal strips**: a strip at height `$y$` has length `$x$` and thickness `$dy$`, so

```math
A = \int_c^d x\,dy = \int_c^d g(y)\,dy
```

where the region lies between `$y = c$` and `$y = d$` and `$x = g(y)$` is its right-hand edge (measured from the y-axis).

The region between the y-axis, the parabola `$y = x^2$` and the line `$y = h$` shows why this matters. With vertical strips we must subtract: height `$h - x^2$`. With horizontal strips the length is just `$\sqrt y$`.

<figure class="fig" data-fig="c12m-aoi-yaxis"><figcaption>The same region counted with vertical strips and with horizontal strips. Both give (2/3)h^(3/2). Move the line and switch the strip direction to see which integral is shorter.</figcaption></figure>

**Which strip?** Take the direction in which one strip goes from one fixed curve to one fixed curve all along the region. If the top (or right) boundary changes its formula partway, either split the region or switch direction.

<div class="myth">

**"A strip's width is always dx."** The width is the small step in the variable you are integrating over. A horizontal strip has thickness `$dy$` and length `$x$`. Mixing the two (writing `$\int y\,dy$` for the area) is the most common error.

</div>

## 3. Area between two curves

If `$f(x) \ge g(x)$` on `$[a, b]$`, a vertical strip runs from the lower curve `$g$` to the upper curve `$f$`, so its height is **top minus bottom**:

```math
A = \int_a^b \big[f(x) - g(x)\big]\,dx
```

The limits `$a$` and `$b$` are usually the **intersection points**, found by solving `$f(x) = g(x)$`.

<div class="steps" data-fig="c12m-aoi-steps">
<div class="step">Sketch both curves. Here the parabola y = x² and the line y = x + 2. A rough sketch tells you which curve is on top.</div>
<div class="step">Find where they meet: set x² = x + 2, so x² − x − 2 = 0, which factorises as (x − 2)(x + 1) = 0. The points are (−1, 1) and (2, 4), and the limits are x = −1 and x = 2.</div>
<div class="step">Draw one thin strip. Its top is on the line, y = x + 2, and its bottom is on the parabola, y = x². Its height is top − bottom = (x + 2) − x².</div>
<div class="step">Write the area as an integral: A = ∫ from −1 to 2 of [(x + 2) − x²] dx.</div>
<div class="step">Integrate: [x²/2 + 2x − x³/3] from −1 to 2 = (2 + 4 − 8/3) − (1/2 − 2 + 1/3) = 10/3 + 7/6 = 9/2.</div>
<div class="step">The area is 9/2 = 4.5 square units. Check with a quick estimate: the region is about 3 wide and 3 high on average at its middle, so about 4 to 5 is sensible.</div>
</div>

<figure class="fig" data-fig="c12m-aoi-between"><figcaption>Drag the two limits. While the curves do not cross, the signed integral of (f − g) equals the true area. Push a limit past a crossing: the curves swap, the signed total shrinks, and you must split the integral at the crossing point.</figcaption></figure>

<figure class="fig" data-fig="@math-area-between"><figcaption>More pairs of curves, with the strip sum against the exact integral.</figcaption></figure>

<div class="problem" data-problem="c12m-aoi-between"></div>

**Horizontal strips for the same job.** The region between `$y^2 = 4x$` and `$y = x$` is easier to count with horizontal strips: at height `$y$` the strip runs from the parabola `$x = y^2/4$` (left) to the line `$x = y$` (right), so its length is `$y - y^2/4$`.

<div class="steps" data-fig="c12m-aoi-horizontal">
<div class="step">Sketch y² = 4x (a parabola opening to the right) and the line y = x.</div>
<div class="step">Where they meet: y² = 4y (replace x by y), so y(y − 4) = 0 and the points are (0, 0) and (4, 4).</div>
<div class="step">Rewrite both with x in terms of y: the parabola is x = y²/4 and the line is x = y.</div>
<div class="step">A horizontal strip at height y goes from the parabola (left) to the line (right): length = right − left = y − y²/4, thickness dy.</div>
<div class="step">Integrate over y from 0 to 4: A = ∫₀⁴ (y − y²/4) dy = [y²/2 − y³/12]₀⁴ = 8 − 16/3.</div>
<div class="step">A = 8/3 ≈ 2.67 square units. With vertical strips you would need the upper half of the parabola, y = 2√x, and subtract the line: possible, but longer.</div>
</div>

## 4. Area of a circle and an ellipse

The circle `$x^2 + y^2 = a^2$` is symmetric about both axes, so its area is four times the first-quadrant area, which lies under `$y = \sqrt{a^2 - x^2}$`:

```math
A = 4\int_0^a \sqrt{a^2 - x^2}\,dx = 4\left[\frac x2\sqrt{a^2 - x^2} + \frac{a^2}{2}\sin^{-1}\frac xa\right]_0^a = 4\cdot\frac{a^2}{2}\cdot\frac\pi2 = \pi a^2
```

For the ellipse `$\dfrac{x^2}{a^2} + \dfrac{y^2}{b^2} = 1$`, the first-quadrant curve is `$y = \dfrac ba\sqrt{a^2 - x^2}$`, which is the circle's curve stretched by the factor `$b/a$`. So the area is `$\pi a b$`. When `$b = a$`, it is the circle.

<figure class="fig" data-fig="c12m-aoi-circle"><figcaption>Slide the semi-axes a and b and the number of strips. Four times the first-quadrant strips reaches πab. Make a equal to b to get the circle.</figcaption></figure>

<div class="problem" data-problem="c12m-aoi-ellipse"></div>

## 5. Area where the curve crosses the axis

The integral gives a **signed** area: strips below the x-axis have negative height and are subtracted. The true area counts every piece as positive, so split the integral at each point where the curve crosses the axis and add the absolute values.

<figure class="fig" data-fig="c12m-aoi-sign"><figcaption>Blue strips are above the axis, orange are below. Slide the right limit past a zero of the curve: the signed integral falls, but the true area keeps growing.</figcaption></figure>

**Worked example.** For `$y = \sin x$` from 0 to `$2\pi$`: `$\int_0^{2\pi}\sin x\,dx = [-\cos x]_0^{2\pi} = 0$`, but the area is `$2 + 2 = 4$`.

<div class="problem" data-problem="c12m-aoi-axis"></div>

<div class="myth">

**"Area = the integral, always."** If part of the region is below the x-axis, the integral gives a smaller (or even zero) number. Sketch first, and find where the curve crosses the axis. Area is never negative: if your answer is negative, you integrated a region that lies below the axis. Take the absolute value of each piece.

</div>

### Modulus functions

For `$y = |x - 2|$` the rule changes at `$x = 2$`, so the integral must be split there into two straight-line pieces.

<div class="steps" data-fig="c12m-aoi-modulus">
<div class="step">Draw y = |x − 2|: a V-shape with its corner at (2, 0).</div>
<div class="step">The rule changes at x = 2: |x − 2| = 2 − x for x < 2 and x − 2 for x ≥ 2.</div>
<div class="step">Left piece (x from 0 to 2): ∫₀² (2 − x) dx = [2x − x²/2]₀² = 4 − 2 = 2.</div>
<div class="step">Right piece (x from 2 to 5): ∫₂⁵ (x − 2) dx = [x²/2 − 2x]₂⁵ = (12.5 − 10) − (2 − 4) = 4.5.</div>
<div class="step">Add: 2 + 4.5 = 6.5 square units. Both pieces are above the axis, so we add.</div>
</div>

### Parabola cut by a line

The parabola `$y^2 = 4ax$` and the line `$x = h$` enclose an area symmetric about the x-axis, so the area is twice the upper half:

```math
A = 2\int_0^h 2\sqrt{a}\,\sqrt x\,dx = \frac{8}{3}\sqrt a\,h^{3/2}
```

For the famous special case `$h = a$` (the line through the focus, called the latus rectum), `$A = \tfrac83 a^2$`.

<div class="problem" data-problem="c12m-aoi-latus"></div>

## 6. A checklist for any area question

1. **Sketch** the curves and shade the region. Even a rough sketch decides which is on top.
2. **Intersection points:** solve the curve equations together for the limits.
3. **Strip:** draw one typical strip, vertical (height top − bottom, width dx) or horizontal (length right − left, thickness dy).
4. **Integrate** and substitute the limits. Split the integral wherever the top or bottom curve changes, or the curve crosses the axis.
5. **Sense check:** the answer must be positive and about the size of the region on your sketch. The units are square units.

<div class="history">

**Beyond the syllabus (not examined in the Class 12 board paper).** Areas in polar form (`$\tfrac12\int r^2 d\theta$`), volumes of solids of revolution and the length of a curve use the same "slice and add" idea. They are university or JEE topics: our [Definite integrals and area (JEE)](/learn/courses/engineering-entrance/definite-integrals/) lesson takes you further. Check the current CBSE syllabus for what is asked this year.

</div>

<div class="keypoints">

- Area under y = f(x) from a to b: A = ∫ₐᵇ y dx (vertical strips of height y, width dx). Area under x = g(y) from c to d: A = ∫ x dy (horizontal strips).
- Area between two curves: A = ∫ₐᵇ (top − bottom) dx; the limits come from solving f(x) = g(x). Choose the strip direction that keeps top and bottom fixed.
- Circle πa², ellipse πab (4 times the first-quadrant integral). Parabola y² = 4ax cut by x = h: (8/3)√a h^(3/2).
- The integral is signed. Split at the points where the curve crosses the axis (or where |f| changes rule) and add the absolute values for true area.
- Speed-time graph: area = distance. Always sketch first and check the sign and size of your answer.

</div>

Going further for JEE/NEET: areas bounded by several curves, with parameters, with modulus and greatest integer functions, and area functions are in [Definite integrals and area (JEE)](/learn/courses/engineering-entrance/definite-integrals/).
