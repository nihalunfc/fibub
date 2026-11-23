---
title: We Distribute, Yet Things Multiply
seoTitle: 'Distributive property and identities Class 8 notes'
summary: 'Class 8 distributive property and algebraic identities with area models: a(b+c), (a+b)², (a−b)², (a+b)(a−b), (x+a)(x+b), mental maths and factorising.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'Which is equal to 13 × 102?'
    choices: ['13 × 100 + 13 × 2', '13 × 100 + 2', '13 + 102', '(13 × 100) × 2']
    ans: 0
    why: 'Split 102 = 100 + 2 and distribute: 13 × 102 = 13 × 100 + 13 × 2 = 1300 + 26 = 1326.'
  - q: 'Expand (x + 5)²:'
    choices: ['x² + 10x + 25', 'x² + 25', 'x² + 5x + 25', 'x² + 10x + 10']
    ans: 0
    why: '(a + b)² = a² + 2ab + b². With a = x and b = 5 the middle term is 2 × x × 5 = 10x.'
  - q: 'The value of 48 × 52 using an identity is:'
    choices: ['2496', '2504', '2500', '2400']
    ans: 0
    why: '48 × 52 = (50 − 2)(50 + 2) = 50² − 2² = 2500 − 4 = 2496.'
sources:
  - 'NCERT Class 8 Mathematics (Ganita Prakash), Chapter 6 “We Distribute, Yet Things Multiply” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Euclid, Elements Book II (geometric algebra of rectangles and squares); Brahmagupta, Brahmasphutasiddhanta (628 CE); Al-Khwarizmi, Al-Jabr (about 820 CE)'
---

**Maths · Class 8 · Chapter 6 · about 50 minutes.** By the end you will be able to use the distributive property to multiply quickly, expand and factorise simple expressions, use the identities (a + b)², (a − b)², (a + b)(a − b) and (x + a)(x + b), and explain number tricks with algebra.

<div class="bigidea">A rectangle can be cut into pieces, and its area is the sum of the areas of the pieces. That one fact is the distributive property. Write it with letters, cut squares in the same way, and you have the identities. Nothing here needs memory: draw the pieces and the formula shows up.</div>

## 1. The distributive property

Suppose a bakery sells packets with 4 samosas. A school orders 5 packets for Monday and 3 packets for Tuesday. The number of samosas is 4 × 5 + 4 × 3 = 32. Or order 8 packets together: 4 × (5 + 3) = 32. The same answer, so

```math
a(b + c) = ab + ac
```

This is the **distributive property**: multiplying a sum is the same as multiplying each part and adding. In a rectangle it is the cut: a rectangle a high and b + c wide is made of two rectangles, a by b and a by c.

<figure class="fig" data-fig="c8-dist-area"><figcaption>Slide a, b and c. The whole rectangle and its two parts always give the same area, which is why a(b + c) = ab + ac for every choice of numbers.</figcaption></figure>

<div class="meaning">
<dl>
<dt>a(b + c)</dt><dd>a is the multiplier outside the bracket. It acts on every term inside.</dd>
<dt>ab + ac</dt><dd>the expanded form: the multiplier is "distributed" to each term.</dd>
<dt>Reading right to left</dt><dd>ab + ac = a(b + c) is called taking out a **common factor**. It is how you factorise.</dd>
</dl>
</div>

It works with subtraction too: a(b − c) = ab − ac. For example 7 × 98 = 7 × (100 − 2) = 700 − 14 = 686.

<div class="problem" data-problem="c8m-dist-near"></div>

<div class="myth">

**“3(x + 4) = 3x + 4.”** The 3 must multiply every term: 3(x + 4) = 3x + 12. A way to check: put x = 1. Left side 3 × 5 = 15, right side 3 + 4 = 7. They differ, so it is wrong. 3x + 12 gives 15, which is right.

</div>

## 2. Multiplying big numbers in pieces

To work out 23 × 14, split each number into tens and units: 23 = 20 + 3 and 14 = 10 + 4. Then every part of one number multiplies every part of the other.

<div class="steps" data-fig="c8-dist-mult">
<div class="step">23 × 14 is the area of a rectangle 23 units wide and 14 high.</div>
<div class="step">Split the width: 23 = 20 + 3.</div>
<div class="step">Split the height: 14 = 10 + 4. Now there are four pieces.</div>
<div class="step">The biggest piece: 20 × 10 = 200.</div>
<div class="step">The other three: 20 × 4 = 80, 3 × 10 = 30 and 3 × 4 = 12.</div>
<div class="step">Add all four: 200 + 80 + 30 + 12 = 322. So 23 × 14 = 322.</div>
</div>

In letters, (a + b)(c + d) = ac + ad + bc + bd: four pieces. This is how the school method of long multiplication works inside. Compare it with the grid in the multiplication tool:

<!--fig:tool multiplication-area-->

<div class="problem" data-problem="c8m-dist-cube9"></div>

## 3. Expanding and factorising expressions

**Expanding** removes brackets using the distributive property: 5(2x + 3) = 10x + 15. With two brackets: (x + 2)(x + 3) = x·x + x·3 + 2·x + 2·3 = x² + 5x + 6.

**Factorising** is the reverse: put back a common factor. 12x + 18 = 6(2x + 3), because 6 divides both terms. Always check by multiplying back. If you can still take out a number or letter, keep going: 6x² + 9x = 3x(2x + 3).

## 4. The squares (a + b)² and (a − b)²

Imagine a square courtyard whose side is a + b metres, with a metres of floor and b metres of garden. Cut it where the floor ends. You get four pieces: a square a by a, two rectangles a by b, and a small square b by b. Adding the areas:

```math
(a + b)^2 = a^2 + 2ab + b^2
```

<figure class="fig" data-fig="c8-dist-square"><figcaption>Slide a and b and switch between (a + b)² and (a − b)². In the plus case the big square splits into a², ab, ab and b². In the minus case the a-square is cut into (a − b)², two strips b(a − b) and a corner b².</figcaption></figure>

For the difference, start from the a-square and remove two strips of width b. The small b-by-b corner is removed twice, so add it back once:

```math
(a - b)^2 = a^2 - 2ab + b^2
```

<div class="meaning">
<dl>
<dt>a², b²</dt><dd>areas of the squares on the two lengths</dd>
<dt>2ab</dt><dd>the two rectangles in between, called the "cross term"</dd>
<dt>Only the sign changes</dt><dd>(a − b)² is (a + b)² with b replaced by −b, so the middle term becomes −2ab; b² stays positive.</dd>
</dl>
</div>

**Examples.** (x + 4)² = x² + 8x + 16. (3a − 2b)² = 9a² − 12ab + 4b². And 51² = (50 + 1)² = 2500 + 100 + 1 = 2601.

<div class="myth">

**“(a + b)² = a² + b².”** Try a = 3 and b = 4: (3 + 4)² = 49 but 3² + 4² = 25. The missing 24 is the two rectangles 2ab = 2 × 12.

</div>

<div class="problem" data-problem="c8m-dist-sq"></div>

<div class="problem" data-problem="c8m-dist-cross"></div>

## 5. The product (a + b)(a − b)

Take a square of side a = 6 and cut a 2 × 2 corner off (b = 2). The L-shaped piece left has area a² − b² = 36 − 4 = 32. Cut it into two rectangles, turn one and slide it beside the other: you get a rectangle (a + b) long and (a − b) wide.

<div class="steps" data-fig="c8-dist-diff">
<div class="step">A square of side a = 6: area 36.</div>
<div class="step">Cut away a corner square of side b = 2: area 4.</div>
<div class="step">An L-shape is left. Its area is a² − b² = 36 − 4 = 32.</div>
<div class="step">Cut the L into a 6 by 4 rectangle and a 4 by 2 rectangle.</div>
<div class="step">Turn the small rectangle upright and slide it next to the big one.</div>
<div class="step">One rectangle 8 long and 4 wide. Area 8 × 4 = 32. So (a + b)(a − b) = a² − b².</div>
</div>

```math
(a + b)(a - b) = a^2 - b^2
```

Do you see the cross terms? Multiply out: a·a − a·b + b·a − b·b. The −ab and +ba cancel. That is why only a² − b² is left.

## 6. Fast calculations with identities

If two numbers are the same distance from a middle number, the product is "middle squared minus distance squared". 47 × 53 = (50 − 3)(50 + 3) = 2500 − 9 = 2491. And 99 × 101 = 10000 − 1 = 9999.

<figure class="fig" data-fig="c8-dist-trick"><figcaption>Choose a middle number m and a distance d. The long bar is m², the short one is d², and the product (m − d)(m + d) is the difference. The readout checks it against direct multiplication.</figcaption></figure>

<div class="problem" data-problem="c8m-dist-diff"></div>

## 7. The product (x + a)(x + b)

When two brackets start with the same letter, such as (x + 3)(x + 5), the four pieces are x², 5x, 3x and 15. The two middle pieces add up:

```math
(x + a)(x + b) = x^2 + (a + b)x + ab
```

The coefficient of x is the **sum** of the two numbers and the constant is their **product**. Numbers can be negative: (x − 2)(x + 7) = x² + (−2 + 7)x + (−2)(7) = x² + 5x − 14. This also lets you factorise: for x² + 8x + 15 find two numbers with product 15 and sum 8, which are 3 and 5, so it is (x + 3)(x + 5).

<div class="problem" data-problem="c8m-dist-xab"></div>

Play with all these identities on movable tiles:

<!--fig:tool identity-tiles-->

## 8. Why number tricks work

Open a calendar and draw a 2 × 2 square around any four dates, such as 9, 10, 16, 17. Add them: 52. Try 15, 16, 22, 23: 76. Both are 4 × (the top-left date + 4). Algebra says why. If the top-left date is x, then the next date is x + 1 and the dates below are x + 7 and x + 8 (a week is 7 days). The total is

```math
x + (x + 1) + (x + 7) + (x + 8) = 4x + 16 = 4(x + 4)
```

<figure class="fig" data-fig="c8-dist-calendar"><figcaption>Slide the top-left date x. The shaded block is a 2 × 2 block of dates. Its sum is always 4x + 16, so you can tell the answer before adding. (Blocks that would wrap past Sunday are moved one date left.)</figcaption></figure>

<div class="problem" data-problem="c8m-dist-cal"></div>

**Think of a number.** Pick a number n, double it, add 6, halve it, subtract the number you thought of. The result is always 3. Check with algebra: 2n + 6, half is n + 3, minus n is 3. Letters let you prove a trick works for **every** number, not just the ones you tried.

<div class="history">

<ul class="timeline">
<li><b>about 300 BCE</b> Euclid proves the square of a sum using areas of squares and rectangles in Book II of the Elements.</li>
<li><b>628 CE</b> Brahmagupta, working in Bhinmal in Rajasthan, writes rules for working with algebraic expressions.</li>
<li><b>about 820 CE</b> Al-Khwarizmi uses the same cutting and moving of squares to solve equations.</li>
</ul>

</div>

Check your algebra step by step with the [Symbolic algebra tool](/learn/symbolic-algebra/).

<div class="keypoints">

- a(b + c) = ab + ac. Read backwards it is taking out a common factor.
- (a + b)(c + d) = ac + ad + bc + bd: every term meets every term.
- (a + b)² = a² + 2ab + b² and (a − b)² = a² − 2ab + b². Never forget the middle term.
- (a + b)(a − b) = a² − b²: the middle terms cancel.
- (x + a)(x + b) = x² + (a + b)x + ab: sum in the middle, product at the end.
- Test a rule by putting in a small number such as x = 1.
- Letters prove a number trick for every number, not only for the ones you tried.

</div>
