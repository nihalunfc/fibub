---
title: Polynomials
seoTitle: 'Polynomials Class 10 notes: zeros and coefficients'
summary: 'Class 10 Polynomials with graphs you can drag: degree, zeros on a graph, linear, quadratic and cubic curves, and the sum and product of zeros of a quadratic.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'The graph of a quadratic polynomial touches the x-axis at exactly one point. How many zeros does it have?'
    choices: ['1', '2', '0', '3']
    ans: 0
    why: 'Zeros are the x-values where the curve meets the x-axis. One meeting point means one zero (the parabola just touches the axis).'
  - q: 'For the polynomial x² − 7x + 12, the sum and product of the zeros are:'
    choices: ['7 and 12', '−7 and 12', '7 and −12', '12 and 7']
    ans: 0
    why: 'Sum = −b/a = −(−7)/1 = 7. Product = c/a = 12/1 = 12. (The zeros are 3 and 4: 3 + 4 = 7 and 3 × 4 = 12.)'
  - q: 'A cubic polynomial can have at most how many zeros?'
    choices: ['3', '2', '1', '4']
    ans: 0
    why: 'A polynomial of degree n has at most n zeros. A cubic has degree 3, so its curve cannot cross the x-axis more than 3 times.'
sources:
  - 'NCERT Class 10 Maths, Chapter 2 “Polynomials” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Viete, formulas relating the roots and coefficients of polynomials (16th century); Bhaskara II, Lilavati and Bijaganita (12th century), for early Indian work on quadratic equations'
---

**Maths · Class 10 · Chapter 2 · about 45 minutes.** By the end you will be able to name a polynomial by its degree, find its value at any number, read its zeros off a graph, and use the neat link between the zeros of a quadratic and its coefficients.

<div class="bigidea">A polynomial is a machine that turns an input x into an output p(x). A zero is an input that gives output 0, which on the graph is a point where the curve meets the x-axis. For a quadratic the two zeros are tied to the coefficients: they add to −b/a and multiply to c/a.</div>

## 1. What is a polynomial?

A **polynomial in x** is a sum of terms of the form (number) × x<sup>whole number</sup>, such as 3x² − 5x + 7. The numbers are the **coefficients**. The highest power of x is the **degree**.

| Name | Degree | General form | Example |
|---|---|---|---|
| Constant | 0 | k | 9 |
| Linear | 1 | ax + b | 2x − 6 |
| Quadratic | 2 | ax² + bx + c | x² − 5x + 6 |
| Cubic | 3 | ax³ + bx² + cx + d | x³ − 2x² − 5x + 6 |

The leading coefficient a must not be 0 (or it would drop to a lower degree). Think of the cost of an auto-rickshaw ride: ₹30 flag-fall plus ₹15 per km is 15x + 30, a linear polynomial in the distance x.

<div class="myth">

**“x² + 1/x is a quadratic polynomial.”** The powers of x in a polynomial must be whole numbers 0, 1, 2, 3… A term like 1/x = x<sup>−1</sup> or √x = x<sup>1/2</sup> is not allowed, so x² + 1/x and x + √x are *not* polynomials.

</div>

**The value of a polynomial.** Replace x by a number. For p(x) = x² − 5x + 6, we get p(1) = 1 − 5 + 6 = 2, and p(2) = 4 − 10 + 6 = 0. Slide the input and watch the output as the height of the curve:

<figure class="fig" data-fig="c10-poly-machine"><figcaption>Pick a polynomial and slide x. The dashed line is the value p(x): the height of the curve above the x-axis. When the point lands on the axis the value is 0, and that x is a <b>zero</b>. One polynomial here (x² + 1) never reaches the axis at all.</figcaption></figure>

<div class="problem" data-problem="c10m-poly-value"></div>

## 2. Zeros of a polynomial

A real number k is a **zero** of p(x) if p(k) = 0. Zeros are the numbers that make the polynomial vanish. For a linear polynomial 2x − 6, set it to 0: x = 3 is its only zero. In general, the zero of ax + b is −b/a.

## 3. Zeros on a graph: the geometrical meaning

Plot the points (x, p(x)). The zeros are exactly the x-values where the graph meets the x-axis, because that is where the height p(x) is 0. The shape depends on the degree:

- **Linear** (ax + b): a straight line. It meets the x-axis at exactly one point.
- **Quadratic** (ax² + bx + c): a U-shaped curve called a **parabola**. It opens upward if a > 0 and downward if a < 0. It can cross the x-axis at two points, touch it at one, or miss it.
- **Cubic**: an S-shaped wave. It can cross the axis once, twice or three times.

In general a polynomial of degree n has **at most n zeros**.

<figure class="fig" data-fig="c10-poly-shapes"><figcaption>Change the degree and drag the coefficient sliders. The green dots are the zeros, where the curve meets the x-axis. A line gives one, a parabola up to two and a cubic up to three. Make a (the first coefficient) negative and the parabola flips upside down.</figcaption></figure>

The next picture is a cricket analogy. A ball is hit up and comes down: its height is a quadratic in time. If it is hit high enough it reaches the ground (two zeros: the moment it left the bat at ground level and the moment it lands). Raise the ground and the ball just grazes it (one zero) or never touches (none).

<figure class="fig" data-fig="c10-poly-shift"><figcaption>Slide the constant c (or press Play). While the parabola dips below the axis there are two zeros; as c rises they come together, touch at c = 4, and vanish. Counting how often a quadratic crosses the axis always gives 0, 1 or 2.</figcaption></figure>

Explore any polynomial with the zeros tool, which lets you drag the curve around:

<!--fig:tool polynomial-zeros-->

Other graphing tools to try are the [Graphing calculator](/science/function-grapher/) for any function you type.

<div class="myth">

**“A quadratic must have two zeros.”** At most two. The curve y = x² + 1 sits above the axis everywhere, so it has none; y = x² touches the axis at x = 0 only, so it has one. Always look at the graph or work out the zeros before claiming a number.

</div>

## 4. Finding the zeros of a quadratic by factorising

To find the zeros, set p(x) = 0 and split the middle term: find two numbers whose **product is ac** and whose **sum is b**. Then group and factorise. Because a product is zero only if one of its factors is, each factor gives a zero.

<div class="steps" data-fig="c10-poly-factor">
<div class="step">Take p(x) = x² − 5x + 6. We want the x that make it zero.</div>
<div class="step">We need two numbers with product 6 and sum −5. Test pairs: −1 and −6 add to −7, but −2 and −3 add to −5.</div>
<div class="step">Split the middle term −5x into −2x − 3x: x² − 2x − 3x + 6.</div>
<div class="step">Group the first two and the last two: x(x − 2) − 3(x − 2) = (x − 2)(x − 3).</div>
<div class="step">A product is 0 only when a factor is 0: x − 2 = 0 or x − 3 = 0, so x = 2 or x = 3.</div>
<div class="step">The graph agrees: the curve crosses the x-axis at x = 2 and x = 3.</div>
</div>

The factorising tool does the same for any quadratic you give it, step by step:

<!--fig:tool factorise-steps-->

<div class="problem" data-problem="c10m-poly-zeros"></div>

## 5. Relationship between zeros and coefficients

Let a quadratic ax² + bx + c have zeros α and β (alpha and beta). Then it can be written as a(x − α)(x − β). Multiply out:

```math
a(x - \alpha)(x - \beta) = ax^2 - a(\alpha + \beta)x + a\alpha\beta
```

Compare with ax² + bx + c, term by term:

```math
\alpha + \beta = -\frac{b}{a}, \qquad \alpha\beta = \frac{c}{a}
```

<div class="meaning">
<dl>
<dt>α, β</dt><dd>the two zeros of the quadratic</dd>
<dt>a, b, c</dt><dd>the coefficients of x², x and the constant term</dd>
<dt>α + β = −b/a</dt><dd>the sum of the zeros is minus the coefficient of x, divided by the coefficient of x²</dd>
<dt>αβ = c/a</dt><dd>the product of the zeros is the constant term divided by the coefficient of x²</dd>
<dt>Physical meaning</dt><dd>The coefficients are not random: they remember where the zeros are. b tells you where the middle of the two zeros is (their sum is −b/a, so the parabola’s axis is at x = −b/2a) and c tells you how they multiply.</dd>
</dl>
</div>

Choose the zeros yourself, and the coefficients fall out:

<figure class="fig" data-fig="c10-poly-zerocoef"><figcaption>Set the two zeros and the multiplier k. The polynomial k(x − α)(x − β) is built and its coefficients a, b, c are computed. The readout shows α + β equal to −b/a and αβ equal to c/a, for every choice.</figcaption></figure>

<div class="steps" data-fig="c10-poly-verify">
<div class="step">Check the relation on 2x² − 8x + 6: here a = 2, b = −8, c = 6.</div>
<div class="step">Factorise: 2(x² − 4x + 3) = 2(x − 1)(x − 3). The zeros are 1 and 3, shown on the graph.</div>
<div class="step">Sum of zeros: 1 + 3 = 4. And −b/a = −(−8)/2 = 4. They match.</div>
<div class="step">Product of zeros: 1 × 3 = 3. And c/a = 6/2 = 3. They match again.</div>
<div class="step">So for every quadratic the zeros add to −b/a and multiply to c/a.</div>
<div class="step">We can also run it backwards: if we know the sum 4 and the product 3, the polynomial is k(x² − 4x + 3).</div>
</div>

<div class="problem" data-problem="c10m-poly-sumprod"></div>

<div class="problem" data-problem="c10m-poly-other"></div>

**Making a quadratic from its zeros.** If the sum of the zeros is S and the product is P, one quadratic with those zeros is

```math
x^2 - Sx + P
```

and any non-zero multiple of it works too. Example: the zeros are 2 and −5. S = −3, P = −10, so the polynomial is x² + 3x − 10 (check: (x − 2)(x + 5) = x² + 3x − 10).

<figure class="fig" data-fig="c10-poly-build"><figcaption>Choose a sum and a product. The polynomial x² − Sx + P is made and drawn. If the curve misses the axis (when S² is smaller than 4P) there are no real zeros with that sum and product: try sum 2, product 5.</figcaption></figure>

<div class="myth">

**“The sum of the zeros is b/a.”** The sign is the catch: the sum is **−b/a**. For x² − 7x + 12 the sum of the zeros is +7 (they are 3 and 4), because b = −7. Always write the minus sign in the formula first, then put in b.

</div>

## 6. A glimpse of the cubic (extension)

For a cubic ax³ + bx² + cx + d with zeros α, β, γ the same idea gives three relations:

```math
\alpha+\beta+\gamma = -\frac{b}{a},\quad \alpha\beta+\beta\gamma+\gamma\alpha = \frac{c}{a},\quad \alpha\beta\gamma = -\frac{d}{a}
```

You do not need these for the Class 10 exam, but trying them confirms the pattern: coefficients always carry the zeros’ sums and products.

<figure class="fig" data-fig="c10-poly-cubic"><figcaption>Pick three zeros of a cubic. The curve passes through all three, and the readout shows the sum, the sum of pairs and the product matching −b/a, c/a and −d/a.</figcaption></figure>

<div class="history">

<ul class="timeline">
<li><b>about 628 CE</b> Brahmagupta gives rules for solving quadratic equations, including negative and zero values.</li>
<li><b>1591</b> François Viète publishes the formulas connecting roots with coefficients, used in this chapter.</li>
<li><b>1637</b> René Descartes shows how to turn algebra into graphs, so zeros become points on the x-axis.</li>
</ul>

</div>

<div class="keypoints">

- A polynomial in x has only whole-number powers; the degree is the highest power. Degree 1 is linear, 2 quadratic, 3 cubic.
- k is a zero of p(x) if p(k) = 0. The zero of ax + b is −b/a.
- Zeros are the x-values where the graph meets the x-axis; a polynomial of degree n has at most n zeros.
- A quadratic graph is a parabola: up if a > 0, down if a < 0, and it meets the x-axis at 0, 1 or 2 points.
- Find the zeros of a quadratic by splitting the middle term (product ac, sum b) and setting each factor to 0.
- For ax² + bx + c with zeros α and β: α + β = −b/a and αβ = c/a. A quadratic with sum S and product P is x² − Sx + P.

</div>
