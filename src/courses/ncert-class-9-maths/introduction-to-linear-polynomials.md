---
title: Introduction to Linear Polynomials
seoTitle: 'Linear Polynomials Class 9 notes: degree, zeros, graph'
summary: 'Class 9 Linear Polynomials with interactive figures: what a polynomial is, degree, the zero of ax + b, straight-line graphs, slope and intercept.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'Which of these is a polynomial in x?'
    choices: ['3x² − 2x + 7', '3/x + 2', '√x + 1', 'x^(−1) + 4']
    ans: 0
    why: 'In a polynomial every power of x is a whole number (0, 1, 2, …). 3/x, √x and x⁻¹ have powers −1 or ½, so they are not polynomials.'
  - q: 'The zero of the linear polynomial 4x − 10 is:'
    choices: ['5/2', '−5/2', '10', '−10']
    ans: 0
    why: 'Set 4x − 10 = 0, so 4x = 10 and x = 10/4 = 5/2. In general the zero of ax + b is −b/a = −(−10)/4 = 5/2.'
  - q: 'The graph of y = 3x − 2 cuts the y-axis at:'
    choices: ['(0, −2)', '(0, 3)', '(−2, 0)', '(2/3, 0)']
    ans: 0
    why: 'The y-axis is where x = 0, so y = 3(0) − 2 = −2. The point (2/3, 0) is where the line meets the x-axis (the zero).'
sources:
  - 'NCERT Class 9 Mathematics (Ganita Manjari), Chapter 2 “Introduction to Linear Polynomials” (topic list only; all text, figures and questions here are original fibub work)'
  - 'François Viète, In artem analyticem isagoge (1591), for the use of letters in algebra; René Descartes, La Géométrie (1637), for the graph of an equation'
---

**Maths · Class 9 · Chapter 2 · about 45 minutes.** By the end you will be able to say whether an expression is a polynomial, state its degree, find the zero of a linear polynomial, and draw and read the straight-line graph of ax + b, including its slope and intercept.

<div class="bigidea">A linear polynomial ax + b is a machine: put in x, get out a x + b. Its zero is the one input that gives 0, and its graph is a straight line that cuts the x-axis at that zero. The number a tilts the line (slope); the number b lifts it (intercept).</div>

## 1. Polynomials: building blocks of algebra

You already know expressions such as 3x + 2 or 5x² − 7x + 1. A **polynomial in x** is a sum of terms, each term being a number times a **whole-number power of x**: x⁰ (= 1), x¹, x², x³ and so on. The numbers in front are the **coefficients**. A term with no x is the **constant term**.

Everyday polynomials are everywhere. An auto-rickshaw fare of ₹30 plus ₹15 per km is 15x + 30. The area of a square field of side x metres is x². A mobile plan of ₹199 plus ₹2 per extra minute is 2x + 199.

What is *not* allowed? Anything with x in the bottom of a fraction, under a root, or with a fractional power, because then the power of x is not a whole number.

<figure class="fig" data-fig="c9-lin-types"><figcaption>Choose an expression. Every term shows its power of x, green if the power is a whole number and red if not. The verdict and the degree appear underneath. Try 4/x + 1 and √x + 3 to see why they fail.</figcaption></figure>

<div class="myth">

**“Any expression with x in it is a polynomial.”** Only those whose powers of x are whole numbers (0, 1, 2, 3…). 1/x is x to the power −1, and √x is x to the power ½, so neither is allowed. A single number such as 7 *is* a polynomial: the constant polynomial.

</div>

## 2. The degree of a polynomial

The **degree** is the highest power of x that appears (with a coefficient that is not zero).

| Name | Degree | General form | Example |
|---|---|---|---|
| Constant | 0 | k (k ≠ 0) | 7 |
| Linear | 1 | ax + b, a ≠ 0 | 3x − 5 |
| Quadratic | 2 | ax² + bx + c, a ≠ 0 | x² − 4x + 3 |
| Cubic | 3 | ax³ + bx² + cx + d, a ≠ 0 | x³ − x |

The number zero, written as a polynomial, is the **zero polynomial** and has no degree. Notice that we always insist the **leading coefficient** (the one next to the highest power) is not zero. Otherwise the term would vanish and the degree would drop.

<figure class="fig" data-fig="c9-lin-degree"><figcaption>Set the four coefficients with the sliders. The highest term with a non-zero coefficient is outlined: that power is the degree. Set the x³ coefficient to 0 and the degree drops to 2; set x² to 0 as well and it drops to 1.</figcaption></figure>

<div class="problem" data-problem="c9m-lin-degree"></div>

This chapter is about the **linear** polynomials, of degree 1, because they are the simplest ones whose graph is more than a dot. In Class 10 you will meet the curved graphs of quadratic and cubic polynomials, and try the [Polynomial zeros tool](/learn/polynomial-zeros/) on them.

## 3. A linear polynomial is a number machine

A linear polynomial is p(x) = ax + b, where a and b are fixed numbers and a ≠ 0. Think of a machine with two buttons: **multiply by a**, then **add b**. Drop in an input x and out comes **p(x)**, the **value** of the polynomial at x.

<figure class="fig" data-fig="c9-lin-machine"><figcaption>Choose a, b and the input x. The four boxes at the top are the machine: input, multiply by a, add b, output. Below, the dot (x, p(x)) sits on a graph. Slide x and the dot walks along a straight line. Slide a to tilt that line and b to lift it.</figcaption></figure>

<div class="meaning">
<dl>
<dt>p(x)</dt><dd>read “p of x”: the output of the machine when the input is x</dd>
<dt>a</dt><dd>the coefficient of x: how many units the output goes up for each 1 increase in the input</dd>
<dt>b</dt><dd>the constant term: what the machine gives when the input is 0</dd>
<dt>Physical meaning</dt><dd>In the auto fare 15x + 30, a = 15 is the rate per kilometre and b = 30 is the starting fare. Every extra kilometre adds exactly ₹15, no matter how far you have already gone: that constant rate is what “linear” means.</dd>
</dl>
</div>

<div class="problem" data-problem="c9m-lin-value"></div>

## 4. The zero of a linear polynomial

A number k is a **zero** of p(x) if p(k) = 0. For a linear polynomial we can find it directly. Set ax + b = 0:

```math
ax + b = 0 \;\Longrightarrow\; ax = -b \;\Longrightarrow\; x = -\frac{b}{a}
```

A linear polynomial has **exactly one zero**. Here is the method on a balance. In the real world a balance is the same as an equation: whatever you do to one side you must do to the other.

<div class="steps" data-fig="c9-lin-solve">
<div class="step">We want the zero of 2x − 6. On the left pan are two boxes, each holding x, and six “−1” coins: that is 2x − 6. The right pan is empty, since we want the total to be 0.</div>
<div class="step">Write the condition: 2x − 6 = 0. Which x makes the pans balance?</div>
<div class="step">Add 6 to both sides. On the left the −6 cancels; on the right appear six +1 coins. Now 2x = 6.</div>
<div class="step">Split both pans into two equal halves. One x-box balances three coins: x = 3.</div>
<div class="step">Check by putting 3 back: 2(3) − 6 = 0. The polynomial vanishes, so 3 is its zero.</div>
<div class="step">On the graph of y = 2x − 6 the zero is the point where the line meets the x-axis: x = 3.</div>
</div>

Slide a and b in the next picture and watch the zero −b/a move along the x-axis. Make a = 0 and see what breaks.

<figure class="fig" data-fig="c9-lin-zero"><figcaption>The green dot is the zero. Change b and the line shifts up or down, so the zero slides. Change a and the line tilts about the point where it cuts the y-axis. With a = 0 the line is flat: a constant polynomial that is never zero (unless it is the zero polynomial itself).</figcaption></figure>

<div class="myth">

**“The zero of ax + b is b/a.”** The sign is the trap: it is **−b/a**. For 2x − 6, b = −6, so the zero is −(−6)/2 = 3. Always solve ax + b = 0 in two lines instead of trusting memory.

</div>

<div class="problem" data-problem="c9m-lin-zero"></div>

<div class="problem" data-problem="c9m-lin-k"></div>

## 5. The graph of a linear polynomial

The **graph** of p(x) is the set of all points (x, p(x)), drawn using the coordinates from Chapter 1. To draw it, make a table of values, plot the points and join them.

<div class="steps" data-fig="c9-lin-table">
<div class="step">Take p(x) = 2x + 1. Choose some inputs for x, such as −2, −1, 0, 1, 2, 3, and write them in a table.</div>
<div class="step">Work out each output: 2(−2) + 1 = −3, 2(−1) + 1 = −1, 2(0) + 1 = 1, and so on.</div>
<div class="step">Pair each input with its output as an ordered pair (x, y): (−2, −3), (−1, −1), (0, 1), (1, 3), (2, 5), (3, 7).</div>
<div class="step">Plot all six points on the Cartesian plane, x first and then y.</div>
<div class="step">Join them. They fall exactly on one straight line, which is why the polynomial is called linear. Two points would have been enough to draw it; the third checks your arithmetic.</div>
<div class="step">Every other input lands on the same line too: for example x = 0.5 gives y = 2. The line holds infinitely many points.</div>
</div>

**The graph is a straight line.** Every point (x, y) on this line has y = 2x + 1, and every point with y = 2x + 1 is on the line. So you can test whether a point is on the line by putting its x into the polynomial and comparing with its y.

<figure class="fig" data-fig="c9-lin-on"><figcaption>Click any grid point. The page works out p(x) for that x and compares it with the y you clicked. Green means the point is on the line, red means it is not and tells you where the line actually passes. Change a and b to move the line.</figcaption></figure>

Explore any line with the linear explorer, where you can drag two points and read the polynomial:

<!--fig:tool linear-explorer-->

## 6. Slope and intercept

The line y = ax + b has two numbers worth knowing.

- The **y-intercept b**: the point where the line cuts the y-axis. At x = 0 the machine gives b, so the point is (0, b).
- The **slope a**: how much y changes when x goes up by 1. If a = 2 the line climbs 2 for every step right; if a = −3 it falls 3 for every step right; if a = 0 it is flat.

<figure class="fig" data-fig="c9-lin-slope"><figcaption>The green step is one unit of run; the orange step is the rise, which equals a. Use the sliders, or press <b>Sweep the slope</b> to watch the line rotate about its intercept: positive slopes climb, negative slopes fall, and 0 is flat.</figcaption></figure>

<div class="problem" data-problem="c9m-lin-slope"></div>

Slope also explains **steepness**. A hill road with slope 0.1 rises 1 m for every 10 m you go across; a ramp with a = 0.5 is five times steeper. Cyclists and road engineers think in exactly these numbers.

## 7. Using linear polynomials: fares and plans

Real choices often come down to comparing two linear polynomials. Plan A has a high fixed charge but a low rate per unit; plan B has a low fixed charge but a high rate. Which is cheaper depends on how much you use. The point where their graphs cross is where the two cost the same.

<figure class="fig" data-fig="c9-lin-plans"><figcaption>Set the fixed charge and the rate for each plan and the number of units you use. The two lines are the two cost polynomials. The highlighted dot (when the lines cross) marks the usage at which the plans cost the same; to its left one plan is cheaper and to its right the other is.</figcaption></figure>

<div class="problem" data-problem="c9m-lin-fare"></div>

<div class="problem" data-problem="c9m-lin-plans"></div>

In Chapter 13 you will use exactly this crossing point to solve linear equations in two variables. Try other functions yourself with the [Graphing calculator](/science/function-grapher/), and the [Polynomial zeros tool](/learn/polynomial-zeros/) shows zeros as points on the axis.

<!--fig:tool polynomial-zeros-->

<div class="history">

<ul class="timeline">
<li><b>about 1650 BCE</b> The Rhind papyrus of Egypt solves “heap” problems such as one number plus a seventh of it, early linear equations.</li>
<li><b>628 CE</b> Brahmagupta, in the Brahmasphutasiddhanta, gives general rules for solving linear equations with negative numbers and zero.</li>
<li><b>1591</b> François Viète uses letters for unknowns and known numbers, the style of algebra used today.</li>
<li><b>1637</b> René Descartes joins algebra and graphs, so a polynomial becomes a line or curve.</li>
</ul>

</div>

<div class="keypoints">

- A polynomial in x is a sum of terms (number × x to a whole-number power). Powers such as x⁻¹ or x^(1/2) are not allowed.
- The degree is the highest power of x with a non-zero coefficient. Degree 0 is constant, 1 is linear, 2 quadratic, 3 cubic.
- A linear polynomial is ax + b with a ≠ 0; p(k) is its value at x = k.
- k is a zero of p if p(k) = 0. The zero of ax + b is −b/a, and a linear polynomial has exactly one zero.
- The graph of a linear polynomial is a straight line; the zero is where it meets the x-axis.
- In y = ax + b the slope a is the change in y for each 1 step in x, and the intercept b is where the line cuts the y-axis.
- A point lies on the line when its coordinates satisfy y = ax + b.

</div>
