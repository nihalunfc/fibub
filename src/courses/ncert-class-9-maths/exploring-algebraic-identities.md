---
title: Exploring Algebraic Identities
seoTitle: 'Algebraic Identities Class 9 notes and factorisation'
summary: 'Class 9 Algebraic Identities with area tiles and a cube you can pull apart: (a+b)², (a−b)², a²−b², (x+a)(x+b), (a+b+c)², cubes and factorising.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'Expand (x + 4)²:'
    choices: ['x² + 8x + 16', 'x² + 16', 'x² + 4x + 16', 'x² + 8x + 8']
    ans: 0
    why: '(a + b)² = a² + 2ab + b² with a = x and b = 4: x² + 2(x)(4) + 16 = x² + 8x + 16. The middle term 2ab is the one people forget.'
  - q: 'The value of 102 × 98 using an identity is:'
    choices: ['9996', '10004', '9996.5', '10000']
    ans: 0
    why: '102 × 98 = (100 + 2)(100 − 2) = 100² − 2² = 10000 − 4 = 9996.'
  - q: 'Factorise x² − 49:'
    choices: ['(x + 7)(x − 7)', '(x − 7)²', '(x + 7)²', '(x − 49)(x + 1)']
    ans: 0
    why: 'x² − 49 = x² − 7², a difference of two squares, so it is (x + 7)(x − 7).'
sources:
  - 'NCERT Class 9 Mathematics (Ganita Manjari), Chapter 4 “Exploring Algebraic Identities” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Al-Khwarizmi, Al-Jabr wa al-Muqabala (about 820 CE), for the geometric completing of squares; Brahmagupta, Brahmasphutasiddhanta (628 CE), for early algebraic identities'
---

**Maths · Class 9 · Chapter 4 · about 55 minutes.** By the end you will be able to expand and use the standard identities, see them as areas and volumes, use them for fast mental arithmetic and to factorise expressions, and so be ready for quadratic equations in Class 10.

<div class="bigidea">An identity is a statement that is true for every value of the letters. (a + b)² = a² + 2ab + b² is true for all a and b because it is just counting area: a square of side a + b is made of one a-square, one b-square and two a-by-b rectangles. Learn the pictures and the formulas follow.</div>

## 1. What is an identity?

An **equation** such as 2x + 1 = 7 is true only for some values of x (here x = 3). An **identity** is true for **every** value. For example, a(b + c) = ab + ac is true whatever numbers a, b and c are, so it is an identity. Check with a = 2, b = 3, c = 4: 2 × 7 = 14 and 6 + 8 = 14.

The standard identities of this chapter let us expand brackets quickly and, read backwards, **factorise**: write an expression as a product. Multiplying out and factorising are the same fact read in opposite directions.

## 2. The square of a sum: (a + b)²

Imagine a square courtyard in a Kerala house where each side is a + b metres: a metres of tiled floor and b metres of garden. Cut the square along those two lengths and you get four pieces.

<div class="steps" data-fig="c9-iden-plus">
<div class="step">Draw a square with side a + b (here a = 5 and b = 3). Its area is (a + b)².</div>
<div class="step">Mark a along each side and b along the rest, then cut across both ways. The square splits into four pieces.</div>
<div class="step">The big piece is a square with side a: its area is a × a = a².</div>
<div class="step">Two pieces are rectangles a by b. Together: ab + ab = 2ab.</div>
<div class="step">The small corner is a square with side b: area b².</div>
<div class="step">Add the four pieces: (a + b)² = a² + 2ab + b². With the numbers: 64 = 25 + 15 + 15 + 9.</div>
</div>

```math
(a + b)^2 = a^2 + 2ab + b^2
```

<div class="meaning">
<dl>
<dt>a, b</dt><dd>any two numbers or expressions (lengths in the picture)</dd>
<dt>a²</dt><dd>the area of a square of side a</dd>
<dt>2ab</dt><dd>the area of the two rectangles a by b: this is the “cross term”</dd>
<dt>Physical meaning</dt><dd>When two lengths join, the square on the whole is not just the sum of the squares on the parts. The two rectangles in between are the extra bit, and they are exactly what students forget when they write (a + b)² = a² + b².</dd>
</dl>
</div>

<div class="myth">

**“(a + b)² = a² + b².”** Try a = 3, b = 4: (3 + 4)² = 49 but 3² + 4² = 25. The two missing rectangles are worth 2 × 12 = 24. In the picture they are the two green pieces.

</div>

**Example.** (2x + 5)² = (2x)² + 2(2x)(5) + 5² = 4x² + 20x + 25.

<div class="problem" data-problem="c9m-iden-sumsq"></div>

## 3. The square of a difference: (a − b)²

Start with a square of side a. A square of side a − b is what is left after cutting a strip of width b off two sides. Cut off the right strip (area ab), then the top strip, which measures b by (a − b), so its area is ab − b².

<div class="steps" data-fig="c9-iden-minus">
<div class="step">Start with a square of side a. Its area is a². (Here a = 5 and b = 2.)</div>
<div class="step">Cut off a strip of width b from the right side. It is a by b, so we take away ab.</div>
<div class="step">Cut off a strip of width b from the top of what is left. It measures (a − b) by b: area ab − b². Take that away too.</div>
<div class="step">What remains is a square of side a − b: area (a − b)².</div>
<div class="step">So (a − b)² = a² − ab − (ab − b²) = a² − 2ab + b². Check: 9 = 25 − 20 + 4.</div>
<div class="step">Another way to see it: taking away two strips of area ab removed the small b-by-b corner twice, so add b² back once.</div>
</div>

```math
(a - b)^2 = a^2 - 2ab + b^2
```

Notice the only difference from (a + b)²: the middle sign. And since (−b)² = b², the second identity is the first with b replaced by −b.

<div class="problem" data-problem="c9m-iden-diffsq"></div>

**Fast squares near 100.** 103² = (100 + 3)² = 10000 + 600 + 9 = 10609. And 97² = (100 − 3)² = 10000 − 600 + 9 = 9409. Try more:

<figure class="fig" data-fig="c9-iden-mental"><figcaption>Pick (100 + d)², (100 − d)² or (100 + d)(100 − d) and slide d. The bars show the pieces of the identity; the total matches the direct multiplication every time.</figcaption></figure>

<div class="problem" data-problem="c9m-iden-mental"></div>

## 4. The product (a + b)(a − b)

This one gives the difference of two squares. Start with a square of side a. Cut a small b-by-b square out of one corner. The L-shape that remains has area a² − b². Now cut the L into two rectangles and turn one so the two fit side by side.

<div class="steps" data-fig="c9-iden-diff">
<div class="step">A square of side a (a = 5): area a².</div>
<div class="step">Cut out a small square of side b (b = 3) from the top-right corner: area b².</div>
<div class="step">What is left is an L-shape with area a² − b².</div>
<div class="step">Cut the L into two rectangles: a long one a by (a − b) at the bottom, and a short one (a − b) by b above the left side.</div>
<div class="step">Turn the short piece through a right angle and slide it beside the long one. The pieces form one big rectangle.</div>
<div class="step">It is (a + b) long and (a − b) wide, so its area is (a + b)(a − b), and it came from a² − b²: (a + b)(a − b) = a² − b². With numbers 8 × 2 = 16 = 25 − 9.</div>
</div>

```math
(a + b)(a - b) = a^2 - b^2
```

This is the identity behind rationalising a denominator (Chapter 3): (√5 + √3)(√5 − √3) = 5 − 3 = 2. And 101 × 99 = (100 + 1)(100 − 1) = 10000 − 1 = 9999.

<div class="problem" data-problem="c9m-iden-pair"></div>

## 5. The product (x + a)(x + b)

When the two factors share x but have different numbers, such as (x + 3)(x + 2), draw a rectangle (x + 3) wide and (x + 2) high. It splits into an x-by-x square, two strips and a little a-by-b rectangle.

<figure class="fig" data-fig="c9-iden-xab"><figcaption>Slide a and b. The four pieces are x², a strip ax, a strip bx and a small ab. The two strips add up to (a + b)x. So (x + a)(x + b) = x² + (a + b)x + ab: the middle coefficient is the sum a + b and the constant is the product ab.</figcaption></figure>

```math
(x + a)(x + b) = x^2 + (a + b)x + ab
```

Numbers a and b can be negative as well: (x + 7)(x − 3) = x² + (7 − 3)x + (7)(−3) = x² + 4x − 21. This identity includes the first three as special cases: put a = b to get (x + a)², or b = −a to get x² − a².

<div class="problem" data-problem="c9m-iden-xab"></div>

Explore these identities with your own numbers on the tile board:

<!--fig:tool identity-tiles-->

## 6. The square of a trinomial: (a + b + c)²

Three lengths joined end to end give a big square cut into a 3 × 3 grid of nine pieces: three squares on the diagonal (a², b², c²) and six rectangles, two of each kind (ab, bc, ca).

<figure class="fig" data-fig="c9-iden-trin"><figcaption>Slide a, b and c. The diagonal squares are a², b² and c². Each pair of letters makes two matching rectangles, one on each side of the diagonal. The readout adds the nine areas and checks they match (a + b + c)².</figcaption></figure>

```math
(a + b + c)^2 = a^2 + b^2 + c^2 + 2ab + 2bc + 2ca
```

<div class="problem" data-problem="c9m-iden-trin"></div>

## 7. Cubes: (a + b)³ and (a − b)³

A cube of side a + b has volume (a + b)³. Cut each edge at a and at b and the cube separates into **8 blocks**: one cube of side a, one cube of side b, three flat slabs a × a × b and three rods a × b × b. Pull them apart and count.

<figure class="fig" data-fig="c9-iden-cube"><figcaption>Choose a and b and use the <b>Pull apart</b> slider to separate the eight blocks. Use the Show buttons to light one kind at a time: a³ (1 block), a²b (3 blocks), ab² (3 blocks) and b³ (1 block). The readout adds their volumes and compares them with (a + b)³.</figcaption></figure>

```math
(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3
```

Replace b by −b to get the second one:

```math
(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3
```

Worked example: 11³ = (10 + 1)³ = 1000 + 300 + 30 + 1 = 1331. A useful rearrangement is a³ + b³ = (a + b)³ − 3ab(a + b). If a + b = 10 and ab = 21, then a³ + b³ = 1000 − 3(21)(10) = 370.

<div class="myth">

**“(a + b)³ = a³ + b³.”** The eight blocks tell the truth: besides the two cubes there are six more blocks (3a²b and 3ab²). Test with a = b = 1: (1 + 1)³ = 8 but 1³ + 1³ = 2.

</div>

<div class="problem" data-problem="c9m-iden-cube"></div>

## 8. The identity for a³ + b³ + c³ − 3abc

One more, a little magical:

```math
a^3 + b^3 + c^3 - 3abc = (a + b + c)\left(a^2 + b^2 + c^2 - ab - bc - ca\right)
```

Its best use: **if a + b + c = 0, then a³ + b³ + c³ = 3abc**, because the right side is zero. For example, take a = 2, b = 3, c = −5 (they add to 0): 8 + 27 − 125 = −90 and 3(2)(3)(−5) = −90.

<figure class="fig" data-fig="c9-iden-abc"><figcaption>Choose a, b and c. Bars compare a³ + b³ + c³ with 3abc, and the two sides of the identity. When a + b + c = 0 the first two bars have the same length, and the right-hand side is 0.</figcaption></figure>

<div class="problem" data-problem="c9m-iden-abc"></div>

## 9. Factorising with identities

Every identity read from right to left is a factorisation. Spot which pattern you have:

| Pattern | Factors |
|---|---|
| a² + 2ab + b² | (a + b)² |
| a² − 2ab + b² | (a − b)² |
| a² − b² | (a + b)(a − b) |
| x² + (a + b)x + ab | (x + a)(x + b) |
| a³ + b³ (extension) | (a + b)(a² − ab + b²) |
| a³ − b³ (extension) | (a − b)(a² + ab + b²) |

<div class="steps" data-fig="c9-iden-factsteps">
<div class="step">Factorise 4x² − 25. Look for a pattern: two terms, a minus sign between squares? It could be a difference of two squares.</div>
<div class="step">Write each term as a square: 4x² = (2x)² and 25 = 5². So a = 2x and b = 5.</div>
<div class="step">Use a² − b² = (a + b)(a − b).</div>
<div class="step">So 4x² − 25 = (2x + 5)(2x − 5).</div>
<div class="step">Check by multiplying out: (2x + 5)(2x − 5) = 4x² − 25. It works.</div>
<div class="step">Next, x² + 10x + 25. Three terms, first and last are squares (x² and 5²), middle is 2 × x × 5. So a = x, b = 5.</div>
<div class="step">It is a perfect square: x² + 10x + 25 = (x + 5)².</div>
</div>

**Factorising x² + bx + c by matching tiles.** Use x² + 5x + 6. Tiles: one x-square, five x-strips and six unit squares. Arrange them into a rectangle: the unit squares must form a block p by q with p × q = 6 and the strips must supply (p + q)x with p + q = 5. The pairs of 6 are 1 × 6 (sum 7), 2 × 3 (sum 5 ✓). So the rectangle is (x + 2)(x + 3).

<figure class="fig" data-fig="c9-iden-match"><figcaption>Choose a polynomial and try different values of p. If p does not divide the constant the unit tiles cannot be arranged. If it does, the page compares p + q with the middle coefficient: only the pair that matches makes a perfect rectangle.</figcaption></figure>

<div class="problem" data-problem="c9m-iden-factor"></div>

Now factorise anything you like and watch the working in the tool, which finds common factors and the patterns above:

<!--fig:tool factorise-steps-->

You can also check any algebra with the [Symbolic algebra tool](/learn/symbolic-algebra/). In Class 10 you will use factorising to solve quadratic equations, and the [Rationalise denominator tool](/learn/rationalise-denominator/) uses (a + b)(a − b) too.

<div class="history">

<ul class="timeline">
<li><b>about 1800 BCE</b> Babylonian scribes solve problems that are equivalent to (a + b)² = a² + 2ab + b², using clay tablets.</li>
<li><b>628 CE</b> Brahmagupta states algebraic identities and rules for quadratic equations in the Brahmasphutasiddhanta.</li>
<li><b>about 820 CE</b> Al-Khwarizmi, in Baghdad, solves quadratics by cutting and completing squares: the same area pictures used above.</li>
<li><b>1300s</b> Madhava’s school in Kerala works with the expansion of powers of binomials in its series for π and the sine.</li>
</ul>

</div>

<div class="keypoints">

- An identity is true for all values of its letters. Expanding and factorising are the same identity read in two directions.
- (a + b)² = a² + 2ab + b²; (a − b)² = a² − 2ab + b²; (a + b)(a − b) = a² − b².
- (x + a)(x + b) = x² + (a + b)x + ab: the middle coefficient is the sum, the constant is the product.
- (a + b + c)² = a² + b² + c² + 2ab + 2bc + 2ca.
- (a + b)³ = a³ + 3a²b + 3ab² + b³ and (a − b)³ = a³ − 3a²b + 3ab² − b³; the cube of side a + b splits into 8 blocks.
- a³ + b³ + c³ − 3abc = (a + b + c)(a² + b² + c² − ab − bc − ca); if a + b + c = 0 then a³ + b³ + c³ = 3abc.
- To factorise, spot the pattern, name a and b, write the factors and check by expanding.

</div>
