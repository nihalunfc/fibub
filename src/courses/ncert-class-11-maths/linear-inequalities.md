---
title: Linear Inequalities
seoTitle: 'Linear Inequalities Class 11 notes and examples'
summary: 'Class 11 Linear Inequalities with animations: number lines, the sign-flip rule, double inequalities, half-planes and systems in two variables.'
minutes: 70
updated: 2026-11-23
quiz:
  - q: 'Solving −3x + 4 ≥ 13 gives:'
    choices: ['x ≤ −3', 'x ≥ −3', 'x ≤ 3', 'x ≥ 3']
    ans: 0
    why: 'Subtract 4: −3x ≥ 9. Divide by −3 and flip the sign: x ≤ −3.'
  - q: 'The graph of 2x + y < 6 has a dashed boundary line because:'
    choices: ['the sign is strict, so points on the line are not solutions', 'the line has a negative slope', 'the inequality has two variables', 'the origin lies on the line']
    ans: 0
    why: 'With < the equal sign is not allowed, so the line itself is left out; a dashed line says so.'
  - q: 'Which point lies in the region x + y ≤ 5, x ≥ 0, y ≥ 0?'
    choices: ['(2, 3)', '(4, 3)', '(−1, 2)', '(0, 6)']
    ans: 0
    why: '(2, 3): 2 + 3 = 5 ≤ 5 and both are non-negative. (4, 3) gives 7 > 5; (−1, 2) has x < 0; (0, 6) gives 6 > 5.'
sources:
  - 'NCERT Class 11 Mathematics, Chapter 5 “Linear Inequalities” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard properties of order on the real numbers and the half-plane test (see e.g. Stewart, J., Precalculus, any edition, chapter on inequalities); every worked example was recomputed in code.'
---

**Maths · Class 11 · Chapter 5 · about 70 minutes.** By the end you will be able to solve a linear inequality in one variable and show it on the number line, handle the "flip the sign" rule and double inequalities, and shade the solution of one or several linear inequalities in two variables.

<div class="bigidea">An equation pins down a few exact values. An inequality describes a whole <em>range</em> of values that are allowed: "at most ₹500", "more than 40 marks". You solve it almost exactly like an equation, doing the same thing to both sides. There is one trap: multiplying or dividing by a negative number turns the sign around. In two variables the allowed values fill a region of the plane, bounded by a line.</div>

## 1. Inequalities in everyday life

A train ticket booking allows **at most 6 passengers**. A scooter is legal for the highway only if its speed is **below 80 km/h**. To pass you need **at least 33 marks**. None of these says "exactly". Each gives a limit, and every value on the allowed side is fine.

We write them with four signs:

| Sign | Read as | Example | Includes the end value? |
|---|---|---|---|
| `$<$` | is less than | `$x < 5$` | no (strict) |
| `$\le$` | is less than or equal to | `$x \le 5$` | yes |
| `$>$` | is greater than | `$x > 5$` | no (strict) |
| `$\ge$` | is greater than or equal to | `$x \ge 5$` | yes |

A **linear inequality** in one variable has the form `$ax + b < 0$` (or with `$\le$`, `$>$`, `$\ge$`) with `$a \ne 0$`. A **solution** is any number that makes it true; the **solution set** is the collection of all of them. For `$x < 5$` that is infinitely many numbers: 4, 0, −7, 4.99, and so on.

Often the question restricts the allowed values: **x is a natural number** (1, 2, 3, ...), **a whole number** (0, 1, 2, ...), **an integer** (..., −1, 0, 1, ...) or **a real number**. The same inequality can have different solution sets for different restrictions. For `$x < 3$`: natural numbers give {1, 2}; integers give {..., 0, 1, 2}; real numbers give the entire ray to the left of 3.

## 2. The number line

The picture of a solution set in one variable is a shaded part of the number line. The **dot** at the end tells whether the end value is in: a **filled** dot for `$\le$` and `$\ge$`, a **hollow** dot for `$<$` and `$>$`. Move the sliders, then drag or slide the test point and see when it counts as a solution.

<figure class="fig" data-fig="c11m-ineq-numberline"><figcaption>The solutions of x &lt; a, x ≤ a, x &gt; a, x ≥ a. A hollow dot leaves the end value out, a filled dot keeps it. The test point is a solution only on the shaded side.</figcaption></figure>

<div class="problem" data-problem="c11m-ineq-greatest"></div>

## 3. Solving: do the same to both sides

Think of the inequality as a seesaw that is tilted. Adding the same amount to both sides, or taking the same amount from both, keeps the tilt. So does multiplying or dividing both sides by the same **positive** number. These are the rules:

```math
a < b \;\Rightarrow\; a + c < b + c, \qquad a - c < b - c
```

```math
a < b \text{ and } c > 0 \;\Rightarrow\; ac < bc \text{ and } \tfrac{a}{c} < \tfrac{b}{c}
```

```math
a < b \text{ and } c < 0 \;\Rightarrow\; ac > bc \text{ and } \tfrac{a}{c} > \tfrac{b}{c}
```

The last rule is the one people forget. See why it is true: take `$2 < 5$`, and multiply both sides by `$k$`. With a positive `$k$` the two points stay in order. With a negative `$k$` they jump to the other side of 0 and swap places.

<figure class="fig" data-fig="c11m-ineq-flip"><figcaption>Start with 2 &lt; 5. Multiplying both sides by a negative k swaps the order, so the sign must flip. Adding the same number to both sides never changes the sign.</figcaption></figure>

<div class="myth">

**"I can divide by −2 and keep the same sign."** Take the true statement `$-4 < 6$`. Divide both sides by `$-2$` and you get `$2$` and `$-3$`. Is `$2 < -3$`? No: `$2 > -3$`. The sign **must** flip. A good habit: whenever you multiply or divide by a negative number, write the new sign at once, before you do anything else. The same thing happens when you take reciprocals of positive numbers: `$2 < 5$` but `$\tfrac12 > \tfrac15$`.

</div>

### 3.1 A worked example, step by step

Solve `$3x - 5 \le 7 + x$` and show the solution on the number line (x is a real number).

<div class="steps" data-fig="c11m-ineq-steps">
<div class="step">We want all the x terms on one side. Start with 3x − 5 ≤ 7 + x.</div>
<div class="step">Subtract x from both sides (the sign does not change): 2x − 5 ≤ 7.</div>
<div class="step">Add 5 to both sides: 2x ≤ 12.</div>
<div class="step">Divide both sides by 2, a positive number, so no flip: x ≤ 6. The solution set is the whole ray up to and including 6.</div>
</div>

You can **check** a solution by trying a number from the solution set and one outside it. Try `$x = 0$`: `$-5 \le 7$` is true. Try `$x = 7$`: `$16 \le 14$` is false. Good.

<div class="problem" data-problem="c11m-ineq-negative"></div>

### 3.2 When the unknown has a negative coefficient

Solve `$-2x + 3 > 9$`. Subtract 3: `$-2x > 6$`. Divide both sides by `$-2$` and flip: `$x < -3$`. If you dislike dividing by a negative, move the `$x$` term instead: add `$2x$` to both sides to get `$3 > 9 + 2x$`, then `$-6 > 2x$`, so `$-3 > x$`, which is the same as `$x < -3$`. No flip needed, same answer.

### 3.3 Word problems

Turn the story into one inequality in one unknown, then solve and answer in words. A tea stall owner sells chai at ₹10 a cup and wants to earn at least ₹600 after paying ₹150 for the day's milk and sugar. If `$x$` is the number of cups: `$10x - 150 \ge 600$`, so `$10x \ge 750$`, `$x \ge 75$`. She must sell **at least 75 cups**. Because cups are whole numbers, 75, 76, 77, ... all work.

<div class="problem" data-problem="c11m-ineq-average"></div>

## 4. Double inequalities and "and" / "or"

Sometimes two conditions apply to the same `$x$`. A roller-coaster may need a rider to be **taller than 120 cm and at most 195 cm**. In maths that is a **double inequality** `$120 < x \le 195$`. The solution is where *both* conditions hold: the **overlap** of two rays.

To solve one, do the same operation on **all three parts**:

```math
-3 \le 2x + 1 < 9 \;\Rightarrow\; -4 \le 2x < 8 \;\Rightarrow\; -2 \le x < 4
```

Notice the filled end at −2 and the hollow end at 4 in the answer. If a rule needs a flip (multiplying by a negative), flip *both* signs, and the order of the end values reverses too: `$-6 < -2x \le 4$` becomes `$3 > x \ge -2$`, which you read as `$-2 \le x < 3$`.

The word **or** means the *union*: the set of numbers that satisfy at least one condition, such as `$x < -1$` or `$x > 3$`. Play with both below.

<figure class="fig" data-fig="c11m-ineq-compound"><figcaption>Two conditions on one number line. AND keeps only the overlap (it can be empty, meaning no solution). OR keeps everything shaded by either.</figcaption></figure>

<div class="problem" data-problem="c11m-ineq-count"></div>

## 5. Linear inequalities in two variables

An inequality such as `$2x + 3y \le 12$` has two unknowns, so its solutions are **pairs** `$(x, y)$`, that is, points of the plane. A railway-station chai stall may spend at most ₹12 on `$x$` kettles of tea at ₹2 and `$y$` plates of snacks at ₹3 for a small test batch: every pair of quantities that fits in the budget is a solution.

The line `$2x + 3y = 12$`, the **boundary**, divides the plane into two **half-planes**. One side has `$2x + 3y < 12$`, the other has `$2x + 3y > 12$`. The points on the line satisfy the equal sign. To graph an inequality, find which side to shade.

<figure class="fig" data-fig="c11m-ineq-halfplane"><figcaption>Change a, b, c and the sign. The line is solid when the sign includes "=" and dashed when it does not. Drag the point P: it is green when it is a solution.</figcaption></figure>

### 5.1 The four-step method

<div class="steps" data-fig="c11m-ineq-halfsteps">
<div class="step">Step 1. Replace the sign by "=" and draw the line. Two points are enough: put x = 0 to get (0, 4) and y = 0 to get (6, 0).</div>
<div class="step">Step 2. Solid or dashed? The sign here is ≤, which allows "=", so the line is solid. For &lt; or &gt; it would be dashed.</div>
<div class="step">Step 3. Test a point not on the line. The origin O is the easiest: 2(0) + 3(0) = 0 ≤ 12 is true.</div>
<div class="step">Step 4. The test is true, so shade the side that contains O. Every point there, and on the line, is a solution.</div>
</div>

If the line passes through the origin, test another point such as `$(1, 0)$`. Two special cases: `$x > 3$` in the plane is everything to the right of the vertical line `$x = 3$`; `$y \le -1$` is everything on or below the horizontal line `$y = -1$`.

<div class="myth">

**"The region is always the side away from the origin."** The origin is only a convenient test point. For `$2x + 3y \ge 12$` the origin gives `$0 \ge 12$`, false, so you shade the <em>other</em> side. Always test, never assume.

</div>

<!--fig:tool inequality-shader-->

You can also draw the boundary lines with the [Function grapher](/science/function-grapher/) and shade by hand.

<div class="problem" data-problem="c11m-ineq-lattice"></div>

## 6. Systems of linear inequalities

A **system** is several inequalities that must hold *together*. The solution is the **overlap** of all the half-planes: the **solution region** (the *feasible region*, when it comes from a real-life problem). It may be a triangle, a four-sided figure, an unbounded strip, or **empty** (no solution) when the half-planes do not overlap.

The usual real-life conditions `$x \ge 0$` and `$y \ge 0$` just say the quantities cannot be negative. They keep the region in the first quadrant.

<figure class="fig" data-fig="c11m-ineq-system"><figcaption>Three systems. The darkest area is where every inequality is true. Drag P and read which inequalities it breaks. The last system has no solution at all.</figcaption></figure>

**Worked example.** A potter makes `$x$` small pots and `$y$` big pots a day. Small pots need 1 kg of clay and big ones 2 kg, and she has 8 kg. Each day she makes at most 5 pots in all.

```math
x + 2y \le 8, \quad x + y \le 5, \quad x \ge 0, \quad y \ge 0
```

Graph each boundary (`$x + 2y = 8$` through (8, 0) and (0, 4); `$x + y = 5$` through (5, 0) and (0, 5)). Both give the side with the origin, and the quadrant conditions keep you in the first quadrant. The solution region is the four-sided figure with corners `$(0,0)$`, `$(5,0)$`, `$(2,3)$` and `$(0,4)$`. Corner `$(2,3)$` is where the two lines meet: subtract the equations to get `$y = 3$`, then `$x = 2$`.

<!--fig:tool lp-solver-->

Finding the best corner of such a region is the idea of *linear programming*, which comes in Class 12. For now, practise recognising and shading the region.

<div class="keypoints">

- An inequality gives a range of allowed values. `$<$` and `$>$` leave out the end value (hollow dot); `$\le$` and `$\ge$` keep it (filled dot).
- Adding or subtracting the same number, or multiplying or dividing by a **positive** number, keeps the sign.
- Multiplying or dividing both sides by a **negative** number **flips** the sign.
- A double inequality is solved by working on all three parts at once. "And" means overlap, "or" means union.
- In two variables, draw the boundary line (dashed for `$<$`, `$>$`; solid for `$\le$`, `$\ge$`), test a point, shade the true side.
- A system's solution region is the overlap of all its half-planes. It can be empty.
- Always check the answer with one point inside and one outside the solution set.

</div>

Going further for JEE/NEET: [Quadratic equations and inequalities](/learn/courses/engineering-entrance/quadratic-equations/) and [Linear programming](/learn/courses/engineering-entrance/linear-programming/). Also useful here: [Inequality shader](/learn/inequality-shader/), [Function grapher](/science/function-grapher/) and [LP solver](/science/lp-solver/).
