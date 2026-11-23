---
title: Relations and Functions
seoTitle: 'Relations and Functions Class 11 notes'
summary: 'Class 11 Relations and Functions with animations: Cartesian product, relations, functions, domain and range, special functions and algebra of functions.'
minutes: 85
updated: 2026-11-23
quiz:
  - q: 'A has 3 elements and B has 4. How many elements does A × B have?'
    choices: ['12', '7', '81', '64']
    ans: 0
    why: 'Every one of the 3 choices from A pairs with every one of the 4 from B: 3 × 4 = 12.'
  - q: 'Which relation from {1, 2} to {a, b, c} is NOT a function?'
    choices: ['{(1, a), (1, b), (2, c)}', '{(1, a), (2, a)}', '{(1, c), (2, b)}', '{(1, b), (2, b)}']
    ans: 0
    why: 'The input 1 has two outputs, a and b. A function gives every input exactly one output.'
  - q: 'The domain of f(x) = √(x − 1) / (x − 4) is:'
    choices: ['[1, 4) ∪ (4, ∞)', '[1, ∞)', 'all real x except 4', '(1, ∞)']
    ans: 0
    why: 'The square root needs x ≥ 1, and the denominator needs x ≠ 4. Both rules together give [1, 4) ∪ (4, ∞).'
sources:
  - 'NCERT Class 11 Mathematics, Chapter 2 “Relations and Functions” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard definitions of relation and function (e.g. Courant & Robbins, What Is Mathematics?, Oxford University Press); every graph and count in the figures was recomputed in code.'
---

**Maths · Class 11 · Chapter 2 · about 85 minutes.** By the end you will be able to form ordered pairs and Cartesian products, say when a relation is a function, find domain and range from a rule or a graph, recognise the standard special functions, and add, multiply and divide functions.

<div class="bigidea">A relation links things from one set to things in another. A function is the best-behaved kind of relation: each input has exactly one output, like a vending machine where one button always gives one snack. Almost everything you graph, measure or calculate later (speed against time, rupees against kilograms, temperature against hour) is a function.</div>

## 1. Ordered pairs and the Cartesian product

Two numbers written as `$(a, b)$` with a definite order form an **ordered pair**. The pair `$(3, 5)$` is not the same as `$(5, 3)$`, just as "seat 3, row 5" is not "seat 5, row 3" in a cinema. Two ordered pairs are equal only when both entries match: `$(a, b) = (c, d)$` means `$a = c$` and `$b = d$`.

The **Cartesian product** `$A \times B$` is the set of all ordered pairs whose first entry is from A and second from B. If A has m elements and B has n, then `$A \times B$` has `$m \times n$` pairs, because every choice from A can be matched with every choice from B (a menu with 3 mains and 4 drinks gives 12 meals). Also `$A \times B \ne B \times A$` unless the sets are equal or empty. Set the sizes with the sliders below and flip between `$A \times B$` and `$B \times A$`.

<figure class="fig" data-fig="c11m-rel-cartesian"><figcaption>All pairs (a, b) of A × B as a grid. Tap cells to choose a relation R: a part of the grid. Flip to B × A: the same cells with the entries swapped.</figcaption></figure>

## 2. Relations

A **relation** `$R$` from A to B is any subset of `$A \times B$`: you choose which pairs "go together". We write `$a\,R\,b$` or `$(a, b) \in R$`. For example, with A = {1, 2, 3} and B = {2, 4, 6, 8}, the rule "b is double a" gives R = {(1, 2), (2, 4), (3, 6)}: only the pairs the rule allows.

- The **domain** is the set of all first entries that actually appear.
- The **codomain** is the whole set B (where the second entries are *allowed* to live).
- The **range** is the set of second entries that actually appear. So range ⊆ codomain.

Because every subset of `$A \times B$` is a relation, there are `$2^{mn}$` relations from A to B. The figure below shows how fast that grows, and how few of those relations are functions.

<figure class="fig" data-fig="c11m-rel-count"><figcaption>With n(A) = m and n(B) = n there are mn pairs, 2^(mn) relations, but only n^m functions. Slide the set sizes (log scale).</figcaption></figure>

<div class="problem" data-problem="c11m-rel-relations"></div>

<div class="myth">

**"The range is the same as the codomain."** The codomain is the set you *announce* (all marks from 0 to 100); the range is only what is *actually produced* (the marks students scored). Range ⊆ codomain, and they are equal only when every codomain element is hit.

</div>

## 3. Functions

A relation `$f$` from A to B is a **function** when every element of A has **exactly one** partner in B. Write `$f: A \to B$` and `$y = f(x)$`; `$y$` is the **image** of `$x$`. The test has two parts:

1. **Nobody left out:** every element of A has an arrow leaving it.
2. **Nobody with two:** no element of A has two or more arrows.

Elements of B may be left unused, and two inputs may share an output. A function with all outputs different is **one-one**; one with repeated outputs is **many-one**. Build your own arrow diagram below: tap an A number, then B numbers, and watch the verdict. Try the preset buttons.

<figure class="fig" data-fig="c11m-rel-arrows"><figcaption>Tap a number of A, then numbers of B, to draw or erase arrows. The verdict says whether it is a function, its range, and whether it is one-one or many-one. Red marks the problem.</figcaption></figure>

<!--fig:tool relation-checker-->

A graph gives the same test: the **vertical line test**. A curve is the graph of a function exactly when no vertical line meets it twice (one input x, one output y). Slide the line along each curve.

<figure class="fig" data-fig="c11m-rel-vertical"><figcaption>Move the vertical line across a curve and count crossings. The circle and the sideways parabola fail: some x gives two y.</figcaption></figure>

<div class="problem" data-problem="c11m-rel-difference"></div>

## 4. Domain and range of a real function

For a **real function** both sets are made of real numbers. When a function is given only by a formula, its **domain** is the largest set of x where the formula works. Two things break a formula:

- a **square root of a negative** number, so the inside must be ≥ 0;
- **division by zero**, so the denominator must be ≠ 0.

The **range** is then all the values y that the formula really produces. On a graph, the domain is the shadow on the x-axis and the range is the shadow on the y-axis. Pick a function and slide x.

<figure class="fig" data-fig="c11m-rel-domain"><figcaption>The blue shadow along the x-axis is the domain, the green shadow along the y-axis is the range. Slide x to turn one input into one output.</figcaption></figure>

Finding a domain with two troubles at once is a step-by-step method. Follow it for `$f(x) = \dfrac{\sqrt{x - 2}}{x - 5}$`.

<div class="steps" data-fig="c11m-rel-domainsteps">
<div class="step">Look for the two trouble spots: a root of a negative number and a division by zero.</div>
<div class="step">Rule 1: the square root needs x − 2 ≥ 0, so x ≥ 2. Draw the allowed values on a number line.</div>
<div class="step">Rule 2: the denominator needs x − 5 ≠ 0, so x ≠ 5. Allowed: everything except one point.</div>
<div class="step">A value must obey both rules, so keep only the overlap of the two lines.</div>
<div class="step">Domain = [2, 5) ∪ (5, ∞). Test: x = 1 fails the root, x = 5 fails the division, x = 6 gives 2/1 = 2.</div>
</div>

<div class="problem" data-problem="c11m-rel-domain"></div>

To find a range, one useful method is to complete the square for a quadratic, `$x^2 + bx + c = (x + b/2)^2 + c - b^2/4$`. The square is never negative, so the smallest value is `$c - b^2/4$`.

<div class="problem" data-problem="c11m-rel-least"></div>

## 5. Some special functions

Several real functions appear so often that they have names. Choose each one and slide x to see its output; the readout gives its domain and range.

<figure class="fig" data-fig="c11m-rel-special"><figcaption>Identity, constant, modulus, signum, greatest integer, reciprocal and a cubic polynomial. Open circles show values a jump skips.</figcaption></figure>

- **Identity** `$f(x) = x$`: outputs its input. Domain and range are R.
- **Constant** `$f(x) = c$`: the same output for every input; the range is just {c}.
- **Polynomial** `$f(x) = a_0 + a_1x + \dots + a_nx^n$`: domain R.
- **Rational** `$f(x) = p(x)/q(x)$` with `$q(x) \ne 0$`: for example 1/x with domain R − {0}.
- **Modulus** `$f(x) = |x|$`: x if x ≥ 0 and −x if x < 0; range [0, ∞).
- **Signum** `$\operatorname{sgn}(x)$`: 1, 0 or −1 for positive, zero or negative x.
- **Greatest integer** `$\lfloor x \rfloor$`: the largest integer not above x, so `$\lfloor 2.7 \rfloor = 2$` but `$\lfloor -2.7 \rfloor = -3$`.

<div class="myth">

**"⌊−2.7⌋ = −2."** The greatest integer function rounds **down**, toward the left on the number line, not toward zero. So `$\lfloor -2.7 \rfloor = -3$`.

</div>

<div class="problem" data-problem="c11m-rel-floor"></div>

<!--fig:tool function-gallery-->

See more in [Function types](/learn/function-type/) and plot any rule in the [Graphing calculator](/science/function-grapher/).

## 6. Algebra of real functions

For two functions with domains that overlap, you can combine them point by point: `$(f + g)(x) = f(x) + g(x)$`, `$(f - g)(x) = f(x) - g(x)$`, `$(f \cdot g)(x) = f(x)\,g(x)$`, `$(cf)(x) = c\,f(x)$` and `$(f/g)(x) = f(x)/g(x)$` **only where** `$g(x) \ne 0$`. The new function lives on the part of the domain common to both. Try the pairs below and read one value by hand.

<figure class="fig" data-fig="c11m-rel-algebra"><figcaption>The orange curve is made from the blue and green curves at each x. Slide x and check one value yourself. For f/g, the points where g is zero are dropped.</figcaption></figure>

<div class="problem" data-problem="c11m-rel-quotient"></div>

<div class="history">

- **1637:** René Descartes pairs numbers with points: the Cartesian product is named after him.
- **1734:** Leonhard Euler introduces the notation f(x) for "a function of x".
- **1837:** Peter Dirichlet gives the modern definition: one output for each input, no formula needed.
- **Today:** a spreadsheet column, a sensor reading and an app's price list are all functions.

</div>

<div class="keypoints">

- A × B is all ordered pairs (a, b); n(A × B) = n(A) · n(B); A × B ≠ B × A in general.
- A relation is any subset of A × B; there are 2^(mn) of them. Range ⊆ codomain.
- A function gives every element of the domain exactly one image. Vertical line test on graphs.
- There are n^m functions from an m-element set to an n-element set.
- Domain of a formula: inside of a square root ≥ 0, denominator ≠ 0.
- Special functions: identity, constant, polynomial, rational, modulus, signum, greatest integer (rounds down).
- (f + g)(x), (f − g)(x), (fg)(x) work point by point; (f/g)(x) needs g(x) ≠ 0.

</div>

Going further for JEE/NEET: [Sets, relations and functions](/learn/courses/engineering-entrance/sets-relations-functions/) has the exam-level domain, range and composition problems.
