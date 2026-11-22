---
title: Quadratic Equations
seoTitle: 'Quadratic Equations Class 10 notes and examples'
summary: 'Class 10 Quadratic Equations with animations: forming equations, factorisation, the quadratic formula, nature of roots and word problems, with practice.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'Which of these is a quadratic equation?'
    choices: ['x(x + 1) = x² + 7', 'x(x + 1) = 7', 'x³ + x = 7', '2x + 1 = 7']
    ans: 1
    why: 'x(x + 1) = 7 becomes x² + x − 7 = 0, with x² as the highest power. In the first choice the x² terms cancel, leaving the linear equation x = 7.'
  - q: 'The discriminant of 2x² − 4x + 5 = 0 is:'
    choices: ['−24', '16', '56', '0']
    ans: 0
    why: 'D = b² − 4ac = (−4)² − 4(2)(5) = 16 − 40 = −24. It is negative, so the equation has no real roots.'
  - q: 'The roots of x² − 8x + 15 = 0 are:'
    choices: ['3 and 5', '−3 and −5', '2 and 6', '1 and 15']
    ans: 0
    why: 'We need two numbers with product 15 and sum −8: they are −3 and −5, so (x − 3)(x − 5) = 0 and x = 3 or x = 5.'
sources:
  - 'NCERT Class 10 Mathematics, Chapter 4 “Quadratic Equations” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard school algebra: the quadratic formula, discriminant and completing the square. Written for fibub; examples checked by substituting the roots back.'
---

**Maths · Class 10 · Chapter 4 · about 50 minutes.** By the end you will be able to recognise a quadratic equation, turn a word problem into one, solve it by factorisation and by the quadratic formula, and say how many real roots it has before solving it.

<div class="bigidea">A quadratic equation is one where the unknown appears squared. Its graph is a parabola, and the answers (the roots) are the places where that curve crosses the x-axis. There can be two, one or none, and a single number, the discriminant, tells you which.</div>

## 1. What is a quadratic equation?

An equation of the form

```math
ax^2 + bx + c = 0, \qquad a \neq 0
```

is a **quadratic equation** in the unknown `$x$`. The numbers `$a$`, `$b$`, `$c$` are the **coefficients**. The word *quadratic* comes from *quadratus*, Latin for a square, because of the `$x^2$`.

Think of a cricket ball thrown up: its height is not just proportional to time, it has a `$t^2$` in it, because gravity keeps changing its speed. Anything that involves an area (length times breadth), a falling or thrown object, or a product of two changing things leads to a quadratic.

<div class="meaning">
<dl>
<dt>a</dt><dd>the number multiplying x². It can never be 0, or the x² disappears and the equation is just a straight-line (linear) equation.</dd>
<dt>b</dt><dd>the number multiplying x. It can be 0 (as in x² − 9 = 0).</dd>
<dt>c</dt><dd>the constant term. It can be 0 (as in x² + 5x = 0).</dd>
<dt>Root</dt><dd>a value of x that makes the equation true. Also called a solution or a zero. On the graph it is where the curve meets the x-axis.</dd>
</dl>
</div>

**Getting to standard form.** Many equations are quadratic in disguise. Expand brackets, bring every term to one side, and collect like terms. For example `$x(x+3) = 10$` becomes `$x^2 + 3x - 10 = 0$`, with `$a=1$`, `$b=3$`, `$c=-10$`.

<div class="myth">

**“Anything with an x² in it is quadratic.”** Expand first. `$(x+1)^2 = x^2 - 5$` looks quadratic, but it becomes `$x^2 + 2x + 1 = x^2 - 5$`; the `$x^2$` cancels and you are left with `$2x = -6$`, a linear equation with one root.

</div>

The graph is the best way to *see* what a root is. Move `a`, `b` and `c` below and watch the curve. The points where it crosses the x-axis are the roots of `$ax^2 + bx + c = 0$`; the number under the picture is the discriminant, which we meet in section 5.

<figure class="fig" data-fig="c10-quad-parabola"><figcaption>The graph of y = ax² + bx + c is a parabola. When a is positive it opens upward like a bowl, when negative it opens downward like a hill. A root is where the curve meets y = 0. Try to make it miss the axis completely, or just touch it.</figcaption></figure>

Now explore with the full explorer, which also shows completing the square and splitting the middle term for any numbers you type:

<!--fig:tool quadratic-explorer-->

## 2. From a story to an equation

Many problems in this chapter begin as a sentence. The recipe is always the same:

1. **Name the unknown.** Write "Let the breadth be `$x$` metres."
2. **Express everything else using it.** Length is `$x+3$`.
3. **Write the fact that is given** as an equation: area `$= x(x+3) = 40$`.
4. **Bring to standard form** and solve: `$x^2 + 3x - 40 = 0$`.
5. **Reject answers that make no sense** (a negative length) and **check**.

Slide the breadth below. The plot's area `$x(x+3)$` is drawn on the graph; the target is a horizontal line. Where the curve meets the line, the story is solved.

<figure class="fig" data-fig="c10-quad-garden"><figcaption>A plot 3 m longer than it is wide. The area x(x + 3) climbs as you widen the plot. The positive root of x² + 3x − T = 0 is exactly the breadth where the area hits the target T.</figcaption></figure>

<div class="problem" data-problem="c10m-quad-plot"></div>

<div class="problem" data-problem="c10m-quad-consec"></div>

A longer example with a train. Watch how each sentence of the story becomes one line of algebra:

<div class="steps" data-fig="c10-quad-train">
<div class="step">A passenger train runs 300 km. If it ran 10 km/h faster, it would arrive 1 hour earlier. Find its usual speed.</div>
<div class="step">Name the unknown: usual speed is x km/h, so the faster speed is x + 10 km/h.</div>
<div class="step">Time = distance ÷ speed. The usual time is 300/x hours and the faster time is 300/(x + 10) hours.</div>
<div class="step">The faster train saves 1 hour, so the difference of the two times is 1.</div>
<div class="step">Multiply both sides by x(x + 10) to clear the fractions. The left side becomes 300(x + 10) − 300x = 3000, so x(x + 10) = 3000, which is x² + 10x − 3000 = 0.</div>
<div class="step">Factorise: the numbers with product −3000 and sum 10 are 60 and −50, so (x + 60)(x − 50) = 0.</div>
<div class="step">x = −60 is impossible for a speed. So the usual speed is 50 km/h. Check: 300/50 = 6 h and 300/60 = 5 h, one hour less.</div>
</div>

## 3. Solving by factorisation

The idea rests on one fact: **if two numbers multiply to give 0, one of them must be 0.** So if `$(x-3)(x-4) = 0$`, then `$x - 3 = 0$` or `$x - 4 = 0$`.

To use it we must write `$ax^2 + bx + c$` as a product of two brackets. When `$a = 1$` we look for two numbers with **product `$c$`** and **sum `$b$`**. For `$x^2 - 7x + 12$`, the numbers `$-3$` and `$-4$` multiply to 12 and add to `$-7$`, so it is `$(x-3)(x-4)$`.

When `$a \neq 1$` we use the **splitting the middle term** method: find two numbers with **product `$a \times c$`** and **sum `$b$`**, use them to split the `$bx$` term, then group. The picture below does it with tiles, where a big square has area `$x^2$`, a strip has area `$x$` and a small tile has area 1. Factorising means packing the tiles into one rectangle: its two sides are the two factors.

<div class="steps" data-fig="c10-quad-split">
<div class="step">Solve 2x² + 7x + 3 = 0. The expression is 2 big squares, 7 strips and 3 small tiles.</div>
<div class="step">Multiply a and c: 2 × 3 = 6. Look for two numbers with product 6 and sum 7 (the middle coefficient). The pair 6 and 1 works: 6 × 1 = 6 and 6 + 1 = 7.</div>
<div class="step">Split 7x as 6x + x. Now we have six strips of one kind and one strip of another.</div>
<div class="step">Pack the tiles: 2 squares stacked, six strips beside them, one strip below, and the three small tiles fill the corner. It forms a perfect rectangle.</div>
<div class="step">The sides are (x + 3) and (2x + 1), so 2x² + 7x + 3 = (2x + 1)(x + 3) = 0, giving x = −½ or x = −3. In algebra: 2x² + 6x + x + 3 = 2x(x + 3) + 1(x + 3) = (2x + 1)(x + 3).</div>
</div>

<div class="problem" data-problem="c10m-quad-factor"></div>

**Method in one line.** (1) Standard form. (2) Find the pair with product `$ac$` and sum `$b$`. (3) Split, group, take out the common bracket. (4) Put each bracket equal to 0. (5) Check by substituting.

**Special cases that are quick.** If `$b = 0$` (like `$x^2 - 16 = 0$`) then `$x^2 = 16$` and `$x = \pm 4$`. If `$c = 0$` (like `$x^2 + 5x = 0$`) take out `$x$`: `$x(x+5) = 0$`, so `$x = 0$` or `$x = -5$`.

<div class="myth">

**“Divide both sides by x to simplify.”** From `$x^2 = 5x$` students often divide by `$x$` and get only `$x = 5$`. They lose the root `$x = 0$`. Move everything to one side and factorise: `$x(x-5) = 0$`.

</div>

## 4. The quadratic formula

Many quadratics do not factorise neatly, like `$x^2 - 3x - 2 = 0$`. There is a method that always works. It comes from a trick called **completing the square**, which we can see with areas. To solve `$x^2 + 6x = 7$`, start with a square of side `$x$` and a strip of area `$6x$`:

<div class="steps" data-fig="c10-quad-complete">
<div class="step">x² + 6x = 7. We have a square of area x² and a strip of area 6x. We want to turn this into one bigger perfect square.</div>
<div class="step">Cut the strip into two strips, each 3 wide and x long, so each has area 3x.</div>
<div class="step">Place one strip on top of the square and the other beside it.</div>
<div class="step">A corner is missing: it is 3 by 3, area 9. Add 9 to the left side, and to the right side too, to keep the equation balanced: x² + 6x + 9 = 7 + 9.</div>
<div class="step">The left side is a complete square of side (x + 3), so (x + 3)² = 16. Then x + 3 = 4 or x + 3 = −4, so x = 1 or x = −7.</div>
</div>

Doing the same steps with letters instead of numbers gives the formula for every quadratic:

<div class="steps" data-fig="c10-quad-formula">
<div class="step">Start with any quadratic ax² + bx + c = 0, where a is not 0.</div>
<div class="step">Divide every term by a so that the x² has coefficient 1.</div>
<div class="step">Move the constant c/a to the right side.</div>
<div class="step">Complete the square: add (b/2a)², the square of half the x-coefficient, to both sides. (In the tile picture, half of 6 was 3, and 3² = 9.)</div>
<div class="step">The left side is now (x + b/2a)². On the right, put everything over the common denominator 4a².</div>
<div class="step">Take the square root of both sides, remembering the ± sign (both a positive and a negative number square to the same value).</div>
<div class="step">Subtract b/2a from both sides. This is the quadratic formula.</div>
</div>

```math
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
```

<div class="meaning">
<dl>
<dt>−b / 2a</dt><dd>the centre of the parabola: the x-value halfway between the two roots (where the curve is lowest or highest).</dd>
<dt>√(b² − 4ac) / 2a</dt><dd>how far each root sits to the left and right of that centre. Bigger D, wider the gap.</dd>
<dt>±</dt><dd>one root with a plus, one with a minus.</dd>
</dl>
</div>

**Worked example.** Solve `$x^2 - 3x - 2 = 0$`. Here `$a=1$`, `$b=-3$`, `$c=-2$`.

```math
x = \frac{3 \pm \sqrt{9 + 8}}{2} = \frac{3 \pm \sqrt{17}}{2} \approx 3.56 \text{ or } -0.56
```

<div class="problem" data-problem="c10m-quad-formula"></div>

<div class="myth">

**“The formula has `$+b$` at the front.”** It is `$-b$`. If `$b = -3$`, then `$-b = +3$`. Always write `$a$`, `$b$`, `$c$` with their signs before you substitute, and put brackets round negative numbers: `$(-3)^2 = 9$`, not `$-9$`.

</div>

<div class="history">

<ul class="timeline">
<li><b>about 1800 BCE</b> Babylonian clay tablets solve area problems that are quadratic equations, using steps like completing the square.</li>
<li><b>628 CE</b> Brahmagupta, in his Brahmasphutasiddhanta, gives a general rule for solving quadratics and accepts negative and zero solutions.</li>
<li><b>about 825 CE</b> Al-Khwarizmi writes the book from whose title the word “algebra” comes, with geometric completing-the-square proofs.</li>
<li><b>about 900 CE</b> The Indian mathematician Sridhara is credited with the rule for solving a quadratic by completing the square; the formula is often called his rule in Indian books.</li>
</ul>

</div>

## 5. Nature of roots: how many answers?

Look at the part under the root sign in the formula, `$b^2 - 4ac$`. It is called the **discriminant** and is written `$D$`, because it *discriminates* (tells apart) the kinds of roots. You can read it before solving.

| Discriminant | Roots | Parabola |
|---|---|---|
| `$D > 0$` | two different real roots | crosses the x-axis twice |
| `$D = 0$` | two equal real roots (one repeated root, `$x = -b/2a$`) | touches the x-axis once |
| `$D < 0$` | no real roots | floats above or below the axis |

Why? A square root of a negative number is not a real number, so with `$D<0$` the formula gives nothing real. With `$D=0$` the `$\pm$` part vanishes, so both roots are the same.

Here `a = 1` and `b = −4` stay fixed while `c` moves. Press Play and watch two roots slide together, meet, and vanish:

<figure class="fig" data-fig="c10-quad-nature"><figcaption>As c grows, the parabola y = x² − 4x + c lifts. D = 16 − 4c shrinks from positive to zero (the curve just touches the axis at x = 2) and then goes negative (the curve is off the axis).</figcaption></figure>

<div class="problem" data-problem="c10m-quad-disc"></div>

**Finding an unknown constant.** A very common question: “For what value of `$k$` does `$x^2 + 8x + k = 0$` have equal roots?” Put `$D = 0$`: `$64 - 4k = 0$`, so `$k = 16$`. Always write `$a$`, `$b$`, `$c$` first, and then set `$D$` to 0 (equal roots), `$>0$` (distinct roots) or `$<0$` (no real roots).

<div class="problem" data-problem="c10m-quad-equal"></div>

## 6. Real situations with two roots

Quadratics do not only describe plots and trains. Throw a ball straight up at 20 m/s. Its height after `$t$` seconds is about `$h = 20t - 5t^2$` metres. When is it 15 m high? Solve `$5t^2 - 20t + 15 = 0$`: the roots are `$t = 1$` and `$t = 3$`. Both are valid! The ball passes 15 m once on the way up and once on the way down. Slide the height line below. When the line touches the top of the curve there is only one answer; above the top there are none, because the ball never gets that high.

<figure class="fig" data-fig="c10-quad-ball"><figcaption>Height against time for a ball thrown up at 20 m/s (g taken as 10 m/s²). The two roots are the two times the ball is at the chosen height. D = 0 happens exactly at the highest point.</figcaption></figure>

This is why checking the roots against the story matters. For a length or a speed we reject the negative root. For the ball, both roots mean something.

<div class="keypoints">

- A quadratic equation is `$ax^2 + bx + c = 0$` with `$a \neq 0$`. Expand and simplify first; the `$x^2$` must survive.
- The roots are the x-intercepts of the parabola `$y = ax^2 + bx + c$`.
- For word problems: name the unknown, write the facts as an equation, solve, then reject answers that do not fit the story.
- Factorisation: if `$pq = 0$` then `$p = 0$` or `$q = 0$`. Split the middle term using a pair with product `$ac$` and sum `$b$`.
- Never divide by an expression containing `$x$`; factorise instead, or you lose a root.
- Quadratic formula: `$x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$`, from completing the square.
- Discriminant `$D = b^2 - 4ac$`: `$D>0$` two distinct real roots, `$D=0$` two equal roots, `$D<0$` no real roots.

</div>

Ready for exam-style questions? Go to [Quadratic Equations: practice questions](/learn/courses/ncert-class-10-maths/quadratic-equations-practice/).
