---
title: 'Two Variables, One Line'
seoTitle: 'Linear Equations in Two Variables Class 9 notes'
summary: 'Class 9 Linear Equations in Two Variables with animations: solutions as points, graphs, lines x = k and y = k, and real-life equations.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'Which of these pairs is a solution of 3x + 2y = 12?'
    choices: ['(2, 3)', '(3, 2)', '(4, 1)', '(1, 4)']
    ans: 0
    why: 'For (2, 3): 3(2) + 2(3) = 6 + 6 = 12. For (3, 2): 9 + 4 = 13. For (4, 1): 12 + 2 = 14. For (1, 4): 3 + 8 = 11.'
  - q: 'The graph of y = 4 is:'
    choices: ['a horizontal line through (0, 4)', 'a vertical line through (4, 0)', 'a line through the origin', 'a single point']
    ans: 0
    why: 'Every point has y = 4 whatever x is, so the points form a horizontal line at height 4.'
  - q: 'The line 2x + y = 8 cuts the y-axis at:'
    choices: ['(0, 8)', '(8, 0)', '(4, 0)', '(0, 4)']
    ans: 0
    why: 'On the y-axis x = 0, so y = 8. The point is (0, 8).'
sources:
  - 'NCERT Class 9 Mathematics (Ganita Manjari), Chapter 13 “Two Variables, One Line” (topic list only; all text, figures and questions here are original fibub work)'
  - 'René Descartes, La Géométrie (1637), for the idea of describing a curve by an equation in x and y. Every worked example was checked by substituting the solutions back.'
---

**Maths · Class 9 · Chapter 13 · about 50 minutes.** By the end you will be able to decide whether a pair of numbers solves an equation in two variables, draw the graph of such an equation, say what x = k and y = k look like, and read a real situation (a fare, a budget) off its line.

<div class="bigidea">An equation like 2x + y = 6 has not one answer but endless pairs (x, y). Plot those pairs as points and they all fall on one straight line. So a straight line is a picture of an equation, and every point on it is an answer.</div>

## 1. One equation, two unknowns

Suppose chai costs ₹ 10 and a samosa ₹ 15, and you have ₹ 60. How many of each can you buy? Let x be the number of chai and y the number of samosas:

```math
10x + 15y = 60
```

This is a **linear equation in two variables**. It is “linear” because x and y appear only to the first power (no x², no xy), and it can always be written as `$ax + by = c$`, where a, b and c are numbers and a and b are not both zero.

One equation with one unknown (like `$2x = 8$`) has one answer. Here there are two unknowns and one equation, so there are many answers: 6 chai and 0 samosas, or 3 chai and 2 samosas, or 0 chai and 4 samosas. Each answer is a **pair**, written (x, y), with x first. The pair (3, 2) is a **solution** because 10(3) + 15(2) = 30 + 30 = 60.

<div class="meaning">
<dl>
<dt>x, y</dt><dd>the two unknown numbers (variables).</dd>
<dt>a, b</dt><dd>the numbers multiplying x and y (coefficients); c is the total on the right.</dd>
<dt>Solution (x, y)</dt><dd>a pair that makes the equation true when put in.</dd>
<dt>Physical meaning</dt><dd>the equation is a rule that links x and y: choose one, and the rule decides the other.</dd>
</dl>
</div>

<div class="myth">

**“(3, 2) and (2, 3) are the same answer.”** They are different pairs. In (x, y) the first number is x. For 10x + 15y = 60, the pair (3, 2) works, but (2, 3) gives 20 + 45 = 65, which does not.

</div>

## 2. How many solutions? Endless, and all on one line

Pick any x you like, put it in, and solve for y. You always get exactly one y. Since you can choose x in endless ways, there are endless solutions. Try it below: change a, b and c, slide x, and watch the point that goes with it. The orange dots are the solutions where both numbers are whole.

<figure class="fig" data-fig="c9-line-solutions"><figcaption>Slide x. The y that goes with it comes from the equation, and the point (x, y) slides along a straight line. Whole-number solutions show as dots. Every solution is on the line, and every point on the line is a solution.</figcaption></figure>

<div class="problem" data-problem="c9m-line-y"></div>

A common exam task is to find a missing number so that a given point is a solution. The idea is always the same: put the point in the equation.

<div class="problem" data-problem="c9m-line-k"></div>

## 3. Drawing the graph

The set of all solutions, drawn on a coordinate plane (each pair (x, y) as a point), is the **graph** of the equation. For `$ax + by = c$` the graph is always a **straight line**. That is why it is called linear.

Two points fix a straight line, so two solutions are enough. We use a **third** point as a check: if the three do not fall on one line, we made an arithmetic mistake. Follow the method for `$x + 2y = 6$`.

<div class="steps" data-fig="c9-line-plot">
<div class="step">Graph x + 2y = 6. We need some solutions: choose a value of x, then work out y.</div>
<div class="step">Choose x = 0. Then 2y = 6, so y = 3. Plot (0, 3).</div>
<div class="step">Choose x = 2. Then 2 + 2y = 6, so y = 2. Plot (2, 2).</div>
<div class="step">Choose x = 4. Then 4 + 2y = 6, so y = 1. Plot (4, 1).</div>
<div class="step">The three points are in a straight line. Join them with a ruler and extend both ends: this is the graph.</div>
<div class="step">Check: (6, 0) is on the line and 6 + 0 = 6 works. (3, 3) is off the line and 3 + 6 = 9, not 6.</div>
</div>

**A smart choice of points.** Choose x = 0 to find where the line crosses the y-axis (the **y-intercept**), and y = 0 to find where it crosses the x-axis (the **x-intercept**). For `$2x + 3y = 12$`: x = 0 gives y = 4, and y = 0 gives x = 6. The line passes through (0, 4) and (6, 0). If the numbers are awkward, pick x values that make y a whole number.

<div class="problem" data-problem="c9m-line-intercept"></div>

**On the line or off it?** A point is on the graph exactly when its coordinates make the equation true. Drag the point T below. It turns green on the line and red off it, and the sum is shown.

<figure class="fig" data-fig="c9-line-onoff"><figcaption>Choose an equation and drag T. The left side is worked out for you. If it equals the right side, T is a solution and sits on the line. If not, T is off the line.</figcaption></figure>

Now draw lines of your own and read their solutions. The line tool below lets you type an equation and see its points.

<!--fig:tool two-variable-line-->

## 4. Lines parallel to the axes: x = k and y = k

What is the graph of `$x = 3$`? As an equation in two variables it is `$x + 0 \cdot y = 3$`. Whatever y is, the pair is a solution as long as x = 3. So (3, −2), (3, 0), (3, 5) all work, and they form a **vertical** line through 3 on the x-axis. In the same way `$y = 2$` is a **horizontal** line through 2 on the y-axis.

In particular, `$x = 0$` is the y-axis itself, and `$y = 0$` is the x-axis.

<figure class="fig" data-fig="c9-line-axes"><figcaption>Choose x = k or y = k and slide k. The vertical line x = k is parallel to the y-axis, and the horizontal line y = k is parallel to the x-axis. At k = 0 each becomes an axis.</figcaption></figure>

<div class="myth">

**“x = 3 is a point.”** On a number line it is one point. But on the plane, with two variables, y is free, so x = 3 is a whole line of points. Always ask: on which picture, a line or a plane?

</div>

<div class="problem" data-problem="c9m-line-rect"></div>

## 5. Equations from real life

Linear equations in two variables are everywhere, because two quantities that grow at a steady rate are linked by one.

- **Auto fare.** A fixed charge of ₹ 30 plus ₹ 15 per km: the fare F and distance d are linked by `$F = 30 + 15d$`. This is `$15d - F = -30$`, a linear equation, so (d, F) points lie on a straight line.
- **Mobile recharge.** A plan with data used and days left, running down steadily.
- **Temperature.** `$F = 1.8C + 32$` links Celsius and Fahrenheit.

<div class="problem" data-problem="c9m-line-fare"></div>

**Careful with real situations.** In the chai and samosa problem, the line has endless points, but only the points with **whole-number** coordinates make sense, because you cannot buy 3.33 samosas. The graph is the full picture, and the situation chooses which points count.

<figure class="fig" data-fig="c9-line-budget"><figcaption>Choose a budget. The line shows every pair satisfying 10x + 15y = budget, but only the marked whole-number points are real purchases. Switch between “Only whole items” and “Every point of the line”.</figcaption></figure>

## 6. A peek ahead: two lines together

One equation gives a line of answers. Two equations together ask for a pair that works in **both**, so we want a point on both lines. Draw them and see where they meet. Two lines can do three things: cross at one point (one common solution), be parallel (no common solution), or be the same line (endless common solutions). You will solve these properly in Class 10; for now, play.

<figure class="fig" data-fig="c9-line-pair"><figcaption>The blue line is x + y = 6. Use the buttons and slider to change the second line. Where the lines cross is the pair that satisfies both. Slide c to see parallel lines glide onto each other and become one line.</figcaption></figure>

<!--fig:tool linear-pair-solver-->

You can also draw any line, or two at once, in the [graphing calculator](/science/function-grapher/) to explore further.

<div class="keypoints">

- A linear equation in two variables has the form `$ax + by = c$` (a and b not both 0). A solution is a pair (x, y), written with x first, that makes it true.
- It has endless solutions: choose x, and y follows.
- Plot the solutions and they form a straight line: the graph. Two points draw it; a third point checks it.
- A point is on the line exactly when its coordinates satisfy the equation.
- `$x = k$` is a vertical line (parallel to the y-axis); `$y = k$` is a horizontal line. `$x = 0$` is the y-axis and `$y = 0$` is the x-axis.
- Setting y = 0 gives the x-intercept and x = 0 gives the y-intercept.
- In a real situation only the points that make sense (such as whole numbers) are real answers.

</div>

Other tools to explore: the [Line solutions tool](/learn/two-variable-line/), the [Linear pairs tool](/learn/linear-pair-solver/) and the [Graphing calculator](/science/function-grapher/). Ready for exam-style questions? Go to [Two Variables, One Line: practice questions](/learn/courses/ncert-class-9-maths/two-variables-one-line-practice/).
