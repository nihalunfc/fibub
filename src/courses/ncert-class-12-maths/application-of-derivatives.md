---
title: Application of Derivatives
seoTitle: 'Application of Derivatives Class 12 notes'
summary: 'Class 12 Application of Derivatives with animations: rates of change, increasing and decreasing functions, maxima, minima and everyday optimisation.'
minutes: 100
updated: 2026-11-23
quiz:
  - q: 'The radius of a circular puddle grows at 2 cm/s. When r = 10 cm, its area grows at:'
    choices: ['40π cm²/s', '20π cm²/s', '100π cm²/s', '4π cm²/s']
    ans: 0
    why: 'A = πr², so dA/dt = 2πr dr/dt = 2π × 10 × 2 = 40π cm²/s.'
  - q: 'f(x) = x³ − 12x is decreasing on the interval:'
    choices: ['(−2, 2)', '(2, ∞)', '(−∞, −2)', '(−2, ∞)']
    ans: 0
    why: 'f′(x) = 3x² − 12 = 3(x − 2)(x + 2), which is negative between −2 and 2.'
  - q: 'The greatest value of f(x) = 6x − x² is:'
    choices: ['9', '6', '3', '36']
    ans: 0
    why: 'f′ = 6 − 2x = 0 at x = 3, f″ = −2 < 0 (maximum), f(3) = 18 − 9 = 9.'
sources:
  - 'NCERT Class 12 Mathematics, Chapter 6 “Application of Derivatives” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Fermat, P. de (c. 1636), Methodus ad disquirendam maximam et minimam; standard calculus, e.g. Stewart, Calculus, chapter 4.'
  - 'Every worked example and live problem was recomputed with a numerical derivative or a numerical search for the extreme value.'
---

**Maths · Class 12 · Chapter 6 · about 100 minutes.** By the end you will be able to find the rate at which one quantity changes when another does, decide where a function increases or decreases, find local and absolute maxima and minima by the first and second derivative tests, and solve everyday maximum-and-minimum problems.

<div class="bigidea">A derivative is a rate of change. Once you can measure how fast something is changing, you can answer practical questions: how fast is the puddle growing, where does a graph climb or fall, and what size of box or tin gives the most room for the least material. The turning points are exactly where the rate of change is zero.</div>

## 1. Rate of change of quantities

If `$y = f(x)$`, then `$\dfrac{dy}{dx}$` is the rate at which `$y$` changes per unit change in `$x$`: a speedometer reading for any pair of linked quantities. If the quantities also depend on time, the chain rule links their rates:

```math
\frac{dy}{dt} = \frac{dy}{dx}\cdot\frac{dx}{dt}
```

<div class="meaning">

<dl>
<dt>`$\dfrac{dy}{dx}$`</dt><dd>how many units y changes per unit of x, at this moment.</dd>
<dt>`$\dfrac{dx}{dt}$`</dt><dd>how fast x itself changes with time t (a speed if x is a length).</dd>
<dt>Positive or negative</dt><dd>positive means the quantity is growing; negative means shrinking.</dd>
<dt>Physical meaning</dt><dd>the rate of change is the slope of the graph at that instant: steep means fast change.</dd>
</dl>

</div>

### The method for “related rates” stories

<div class="steps" data-fig="c12m-appd-balloon">
<div class="step">A balloon is being filled with air at a steady rate. Draw it and name the changing quantities: the volume V and the radius r. Both change with time t.</div>
<div class="step">Write an equation linking them that is always true: V = (4/3)πr³.</div>
<div class="step">Differentiate both sides with respect to t (not r), using the chain rule: dV/dt = 4πr² · dr/dt.</div>
<div class="step">Only now put in the numbers for the moment asked: dV/dt is the given steady rate, and r is the current radius.</div>
<div class="step">Solve for the unknown rate: dr/dt = (dV/dt) ÷ (4πr²). The bigger the balloon, the slower the radius grows, even though the air pours in at the same speed.</div>
</div>

A common slip is to put the numbers in **before** differentiating, which kills the very thing that changes. Always differentiate first, substitute last.

<div class="problem" data-problem="c12m-appd-balloon"></div>

A raindrop on a puddle during the monsoon makes ripples. The radius grows steadily but the area does not: each new ring is bigger than the last.

<figure class="fig" data-fig="c12m-appd-ripple"><figcaption>A ripple whose radius grows at a steady speed. The area’s rate dA/dt = 2πr·dr/dt grows as the ripple grows: the straight line below shows it. Press play.</figcaption></figure>

<div class="problem" data-problem="c12m-appd-ripple"></div>

Another classic: a ladder sliding down a wall. The foot slides out at a constant speed, yet the top comes down slowly at first and then faster and faster.

<figure class="fig" data-fig="c12m-appd-ladder"><figcaption>A 10 m ladder with its foot pulled out at a steady speed. From x² + y² = 100, dy/dt = −(x/y)·dx/dt. Watch the arrow at the top grow as the ladder becomes more horizontal.</figcaption></figure>

<div class="problem" data-problem="c12m-appd-ladder"></div>

Play more stories (a ladder, a balloon and a cone-shaped tank filling) in the tool below and change the numbers.

<!--fig:tool related-rates-->

<div class="myth">

**“If dV/dt is steady, dr/dt is steady too.”** Not unless the shape stays the same: a balloon gets slower in radius as it grows, and a ladder’s top gets faster. Each rate is tied to the others by the equation between the quantities, and that equation, not the story, decides.

</div>

## 2. Increasing and decreasing functions

A function is **increasing** on an interval if the graph climbs as you move right, and **decreasing** if it falls. The slope of the tangent is `$f'(x)$`, so the sign of the derivative decides:

- `$f'(x) > 0$` for all `$x$` in the interval: `$f$` is **increasing**.
- `$f'(x) < 0$` for all `$x$` in the interval: `$f$` is **decreasing**.
- `$f'(x) = 0$` at a point: the tangent is flat there (a **stationary point**).

Think of a trek in the Western Ghats: when the path slope is positive you climb, when negative you descend, and at the top of a ridge the path is level for a moment.

<figure class="fig" data-fig="c12m-appd-monotone"><figcaption>Top: f, shaded green where it rises and orange where it falls. Bottom: its derivative f′, filled above or below zero. Slide the point: the tangent’s direction and the sign of f′ always agree.</figcaption></figure>

**To find the intervals:** differentiate, solve `$f'(x) = 0$`, and test the sign of `$f'$` between the solutions. Example: `$f(x) = x^3 - 12x$` has `$f'(x) = 3(x-2)(x+2)$`. For `$x < -2$` both factors are negative (product positive, increasing); for `$-2 < x < 2$` the product is negative (decreasing); for `$x > 2$` it is positive again (increasing).

<div class="problem" data-problem="c12m-appd-turn"></div>

<div class="myth">

**“Increasing means f(x) is positive.”** A function can be negative and still increasing: `$f(x) = x - 10$` is below zero for `$x < 10$` but it climbs everywhere. The sign of `$f'$`, not of `$f$`, decides.

</div>

See `$f$`, `$f'$` and `$f''$` stacked on top of one another and slide a line along them to read off rising, falling and bending together.

<figure class="fig" data-fig="@math-fdd-stack"><figcaption>f, f′ and f″ one above the other. Where f′ crosses zero, f turns. The sign of f″ tells whether it bends like a cup (minimum) or a cap (maximum).</figcaption></figure>

## 3. Maxima and minima

A **local maximum** is a point higher than all its neighbours; a **local minimum** is lower than all its neighbours. Both occur where the tangent is level (`$f'(x) = 0$`) or where `$f'$` does not exist. A point where `$f'(c) = 0$` is called a **critical point**. At a critical point there are three possibilities: a top, a bottom, or neither (like the middle of `$x^3$`, which flattens but keeps climbing).

### The first derivative test

Walk along the graph with the pencil. At a critical point `$c$`:

- `$f'$` changes from **+ to −**: you went up then down, a **local maximum**;
- `$f'$` changes from **− to +**: you went down then up, a **local minimum**;
- `$f'$` does **not change sign**: neither (a flat shoulder).

<div class="steps" data-fig="c12m-appd-firsttest">
<div class="step">Here is f(x) = 2x³ − 9x² + 12x + 1. We want every local maximum and minimum.</div>
<div class="step">Differentiate: f′(x) = 6x² − 18x + 12, which factorises as 6(x − 1)(x − 2).</div>
<div class="step">Solve f′(x) = 0 for the critical points: x = 1 and x = 2.</div>
<div class="step">Test the sign of f′ in the three parts: for x &lt; 1 it is positive (both factors negative), for 1 &lt; x &lt; 2 negative, for x &gt; 2 positive.</div>
<div class="step">At x = 1 the sign goes + to −: a local maximum, f(1) = 6. At x = 2 it goes − to +: a local minimum, f(2) = 5. Notice that the local maximum (6) is higher than the local minimum (5) only by a little: local does not mean greatest.</div>
</div>

### The second derivative test

Find `$f''(c)$` at the critical point. If it is negative, the curve bends like a cap (a frown), so the point is a **maximum**; if positive, it bends like a cup (a smile), so the point is a **minimum**. If `$f''(c) = 0$` the test says nothing; go back to the first derivative test.

| at a critical point c | conclusion |
|---|---|
| `$f''(c) < 0$` | local **maximum** |
| `$f''(c) > 0$` | local **minimum** |
| `$f''(c) = 0$` | test fails: use the first derivative test |

For the example above, `$f''(x) = 12x - 18$`, so `$f''(1) = -6 < 0$` (maximum) and `$f''(2) = 6 > 0$` (minimum): the same answer, with less sign-testing.

<div class="problem" data-problem="c12m-appd-localmin"></div>

Check any function with all three graphs and every test worked out in the tool below.

<!--fig:tool maxima-minima-->

For a typed-in derivative with each rule named, try [Derivative steps](/learn/derivative-steps/); to see a slope become a derivative try [Derivative slope](/learn/derivative-slope/).

## 4. Absolute maximum and minimum on an interval

A local maximum is the best among its neighbours; the **absolute (global) maximum** is the greatest value of `$f$` on the whole interval. If `$f$` is continuous on a closed interval `$[a, b]$`, it always has both an absolute maximum and an absolute minimum, and they can only be at:

1. the **end points** `$a$` and `$b$`, or
2. a **critical point** inside the interval.

So the method is a short list: find the critical points inside, work out `$f$` at them and at both ends, and pick the largest and smallest. Think of the tallest and lowest points of a trek route that starts and ends at given villages: the extremes are either at the villages or on a ridge or valley in between.

<figure class="fig" data-fig="c12m-appd-interval"><figcaption>f(x) = x³ − 6x² + 9x + 1 with critical points at x = 1 and x = 3. Slide the ends a and b. Only the points inside [a, b] and the two ends are candidates; the greatest and smallest values are labelled.</figcaption></figure>

<div class="myth">

**“The absolute maximum is always at a critical point.”** Not so: on `$[0, 5]$` the function above is largest at the right end point (x = 5, f = 21), where the slope is not zero. Always check the ends.

</div>

## 5. Everyday maxima and minima problems

The same plan solves a whole family of “best” problems: a farmer’s field, a box, a tin, a cheapest route. The plan:

1. Draw the thing and name the quantity to **maximise or minimise** (area, volume, cost, surface area).
2. Write it in terms of the variables; use the given condition to make it a function of **one** variable.
3. Differentiate, set it to 0, solve, and reject values that make no physical sense (a negative length).
4. Confirm with the second derivative (or the ends of the allowed range) and give the answer **with units**.

**Open box.** A sheet of side 18 cm has equal squares of side `$x$` cut from the corners, and the sides are folded up. The volume is `$V = x(18-2x)^2$` and `$V' = 12(x-3)(x-9)$`. The only sensible critical point is `$x = 3$` (at `$x = 9$` no base is left), where `$V'' = 24x - 144 < 0$`: the greatest box has volume 432 cm³.

<div class="steps" data-fig="c12m-appd-box">
<div class="step">The box. Cut a square of side x from each corner of the 18 cm sheet and fold up the flaps. The slider shows any cut you like; start at x = 1.5 cm.</div>
<div class="step">Write the volume with one variable: base side 18 − 2x, height x, so V = x(18 − 2x)². The curve below is this V against x.</div>
<div class="step">Differentiate: V′ = (18 − 2x)² − 4x(18 − 2x) = (18 − 2x)(18 − 6x) = 12(x − 3)(x − 9). Set V′ = 0: x = 3 or x = 9.</div>
<div class="step">x = 9 leaves no base, so reject it. At x = 3 the second derivative V″ = 24x − 144 = −72 is negative: a maximum. The picture jumps to x = 3.</div>
<div class="step">The greatest volume is V(3) = 3 × 12² = 432 cm³. Slide the cut either way and the volume drops.</div>
</div>

<div class="problem" data-problem="c12m-appd-box"></div>

**A tin of fixed size.** A closed cylindrical ghee tin must hold 1000 cm³. Which radius uses the least metal? With `$h = \dfrac{1000}{\pi r^2}$`, the surface area is `$S = 2\pi r^2 + \dfrac{2000}{r}$`. Then `$S' = 4\pi r - \dfrac{2000}{r^2} = 0$` gives `$r^3 = \dfrac{500}{\pi}$`, `$r \approx 5.42$` cm and `$h = 2r$`. The best tin is as tall as it is wide.

<figure class="fig" data-fig="c12m-appd-can"><figcaption>Fixed volume 1000 cm³: a thin tall tin and a wide flat tin both waste metal. The surface area is least when the height equals the diameter (r ≈ 5.42 cm).</figcaption></figure>

**A fence on a river bank.** With `$F$` metres of fence and a river as one side, a field with two sides `$x$` and a third side `$F - 2x$` has area `$x(F-2x)$`, greatest when `$x = F/4$`, giving `$F^2/8$`.

<div class="problem" data-problem="c12m-appd-fence"></div>

<div class="history">

**Timeline**

<ul class="timeline">
<li><b>~1636</b> Pierre de Fermat finds maxima and minima by looking for where a curve’s tangent is level.</li>
<li><b>1665 and 1675</b> Newton and Leibniz build calculus; Newton calls rates of change “fluxions”.</li>
<li><b>1750s</b> Lagrange and Euler use maxima and minima to study motion and shapes (the calculus of variations).</li>
<li><b>1947</b> Dantzig’s simplex method brings “best choice” problems with many conditions to industry.</li>
</ul>

</div>

<div class="history">

**Beyond the syllabus (not examined in the Class 12 board paper).** The rationalised book no longer asks for equations of **tangents and normals**, **approximations** with differentials (for instance √25.3 ≈ 5.03) or the full Newton-Raphson method. They are useful extensions: the tangent line at `$x = a$` is `$y - f(a) = f'(a)(x - a)$`, and `$f(a+h) \approx f(a) + h f'(a)$` for small `$h$`. The shared figure below shows Newton’s tangent steps on four equations. Check the current CBSE syllabus for what is asked this year.

</div>

<figure class="fig" data-fig="@math-newton-steps"><figcaption>Newton’s method: follow the tangent down to the x-axis and repeat. A tangent-line approximation used again and again.</figcaption></figure>

<div class="keypoints">

- Rates: `$\dfrac{dy}{dt} = \dfrac{dy}{dx}\dfrac{dx}{dt}$`. Related rates: write the link equation, differentiate with respect to `$t$` first, substitute the numbers last.
- `$f' > 0$`: increasing. `$f' < 0$`: decreasing. Stationary point: `$f' = 0$`. Do not confuse “increasing” with “positive”.
- First derivative test: sign of `$f'$` changes + to − (local max), − to + (local min), no change (neither).
- Second derivative test: `$f'' < 0$` at a critical point is a max, `$f'' > 0$` a min, `$f'' = 0$` is inconclusive.
- Absolute max and min on `$[a, b]$`: compare `$f$` at the ends and at critical points inside.
- Word problems: one variable, differentiate, reject impossible values, check, give units. Fixed-volume tin: `$h = 2r$`. Open box from a square sheet: cut `$s/6$`.

</div>

Going further for JEE/NEET: rates, monotonicity, maxima and minima with parameters, Newton and the full tangent and normal toolkit are in [Applications of derivatives (JEE)](/learn/courses/engineering-entrance/applications-derivatives/).
