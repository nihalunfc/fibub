---
title: 'A Square and a Cube'
seoTitle: 'A Square and a Cube Class 8 notes and examples'
summary: 'Class 8 Maths: squares, square roots, cubes and cube roots with animations, tile and cube builders, prime-factor methods, patterns and 1729.'
minutes: 55
updated: 2026-11-23
quiz:
  - q: 'How many natural numbers lie between 15² and 16²?'
    choices: ['30', '31', '29', '15']
    ans: 0
    why: 'Between n² and (n + 1)² there are 2n numbers. For n = 15 that is 30. (16² − 15² = 31, and we leave out the 31st end number.)'
  - q: 'By which smallest number must 72 be multiplied to make a perfect square?'
    choices: ['2', '3', '6', '4']
    ans: 0
    why: '72 = 2 × 2 × 2 × 3 × 3. The primes 3 are paired, but one 2 is alone. Multiply by 2: 144 = 12².'
  - q: 'The cube root of 1728 is:'
    choices: ['12', '14', '18', '24']
    ans: 0
    why: '1728 = 2 × 2 × 2 × 2 × 2 × 2 × 3 × 3 × 3. Groups of three give 2 × 2 × 3 = 12, and 12 × 12 × 12 = 1728.'
sources:
  - 'NCERT Class 8 Mathematics (Ganita Prakash), Chapter 1 “A Square and a Cube” (topic list only; all text, figures and questions here are original fibub work)'
  - 'The taxicab story of 1729 is told in G. H. Hardy, A Mathematician’s Apology (1940). Every number in this lesson was checked by multiplication.'
---

**Maths · Class 8 · Chapter 1 · about 55 minutes.** By the end you will be able to spot a perfect square or cube, find square and cube roots by three different methods, and use the patterns hidden inside square numbers.

<div class="bigidea">A square number is a square of tiles; a cube number is a cube of blocks. Every rule in this chapter comes from counting those tiles and blocks cleverly.</div>

## 1. Square numbers: tiles in a square

Look at the floor of a temple courtyard laid with square tiles, 5 rows of 5 tiles. It uses 5 × 5 = 25 tiles. The number 25 is a **square number** (or **perfect square**) because it is a whole number multiplied by itself. We write it `$5^2 = 25$`, and say “5 squared”.

The first few squares are 1, 4, 9, 16, 25, 36, 49, 64, 81, 100. Slide the side below and watch the block grow. Notice the coloured L-shaped border that makes each new square from the last one.

<figure class="fig" data-fig="c8-sq-tiles"><figcaption>An n by n block of tiles. Each colour is a new L-shaped layer: 1 tile, then 3, then 5, then 7 … Count the tiles in the last layer and compare with 2n − 1.</figcaption></figure>

The L-shape gives us the first pattern: to go from `$n^2$` to `$(n+1)^2$` we add the next odd number, `$2n + 1$`. So

```math
1 + 3 + 5 + \dots + (2n - 1) = n^2 .
```

The sum of the first n odd numbers is `$n^2$`. For example 1 + 3 + 5 + 7 + 9 = 25 = 5².

<div class="problem" data-problem="c8m-sq-sumodd"></div>

**How many numbers lie between two squares?** The next square after `$n^2$` is `$(n+1)^2 = n^2 + 2n + 1$`. So the gap is `$2n + 1$`, and the numbers strictly between them are `$2n$` in all. Between 9² = 81 and 10² = 100 there are 18 numbers, and none of them is a perfect square.

<div class="meaning">
<dl>
<dt>n²</dt><dd>n multiplied by itself; the area of a square of side n.</dd>
<dt>perfect square</dt><dd>a whole number that is the square of a whole number.</dd>
<dt>2n + 1</dt><dd>how many tiles the next L-layer adds.</dd>
<dt>Physical meaning</dt><dd>square numbers are areas: a bigger side makes the area grow faster than the side.</dd>
</dl>
</div>

### Spotting squares: last digits and zeros

Look at the last digit of the squares: 1, 4, 9, 6, 5, 6, 9, 4, 1, 0. Only the digits 0, 1, 4, 5, 6 and 9 appear. Try more squares below.

<figure class="fig" data-fig="c8-sq-lastdigit"><figcaption>Count the last digits of n² as you raise the number of squares. The digits 2, 3, 7 and 8 never show up.</figcaption></figure>

So **a number ending in 2, 3, 7 or 8 is never a perfect square.** Other quick facts:

- A square ending in 0 has an **even number of zeros**: 30² = 900 (two zeros), 300² = 90000 (four).
- The square of an even number is even; the square of an odd number is odd.
- A number ending in 5 squares nicely: `$(10a + 5)^2 = 100a(a+1) + 25$`. So 35² = 3 × 4 followed by 25 = 1225, and 85² = 8 × 9 followed by 25 = 7225.

<div class="myth">

**“A number that ends in 1, 4, 5, 6 or 9 must be a square.”** No. The last digit only rules numbers out. 14 ends in 4 but 3² = 9 and 4² = 16, so 14 is not a square. To be sure, check against the neighbouring squares or use prime factors.

</div>

### Pythagorean triplets

Three numbers a, b, c with `$a^2 + b^2 = c^2$` form a **Pythagorean triplet**, like 3, 4, 5 (9 + 16 = 25). For any natural number m greater than 1, the numbers `$2m$`, `$m^2 - 1$`, `$m^2 + 1$` form one. For m = 4: 8, 15, 17, and 64 + 225 = 289 = 17². Where does this come from? Because `$(m^2+1)^2 - (m^2-1)^2 = 4m^2 = (2m)^2$`. (Chapter 9 of this book uses triplets to study right triangles.)

<div class="problem" data-problem="c8m-sq-triplet"></div>

## 2. Square roots: undoing a square

The **square root** undoes squaring. Since 7² = 49, the square root of 49 is 7, written `$\sqrt{49} = 7$`. We take the positive root here. The sign `$\sqrt{\ }$` is called the radical.

Finding the root of a perfect square can be done in three ways. Try the first: subtracting odd numbers. A square is the sum of the first n odd numbers, so we can take them away one by one, and count until we reach zero.

<div class="steps" data-fig="c8-sq-rootsub">
<div class="step">Start with 36. We subtract 1, 3, 5, 7 … and count the subtractions.</div>
<div class="step">36 − 1 = 35. One subtraction.</div>
<div class="step">35 − 3 = 32. Two subtractions.</div>
<div class="step">32 − 5 = 27. Three subtractions.</div>
<div class="step">27 − 7 = 20. Four subtractions.</div>
<div class="step">20 − 9 = 11. Five subtractions.</div>
<div class="step">11 − 11 = 0 after six subtractions, so √36 = 6. If we had skipped zero, the number would not be a perfect square.</div>
</div>

This method is slow for big numbers but needs no division at all. The second method, **prime factorisation**, is the one to use for large numbers. Break the number into primes and make pairs.

<div class="steps" data-fig="c8-sq-factor">
<div class="step">Start with 1764 and divide it by small primes: 2, 3, 7 …</div>
<div class="step">The primes are 2, 2, 3, 3, 7, 7.</div>
<div class="step">Pair equal primes: (2 2) (3 3) (7 7). Every prime is paired.</div>
<div class="step">Take one prime from each pair: 2, 3, 7.</div>
<div class="step">Multiply them: 2 × 3 × 7 = 42. So √1764 = 42.</div>
</div>

If one prime is left without a partner, the number is **not** a perfect square. To make it one, multiply (or divide) by the lonely primes. For 72 = 2 × 2 × 2 × 3 × 3 the extra 2 is alone: 72 × 2 = 144 = 12². Or divide by 2 to get 36 = 6².

<div class="problem" data-problem="c8m-sq-mult"></div>

The third method is **estimating**, for numbers that are not perfect squares. To find √40, see that 6² = 36 and 7² = 49, so √40 lies between 6 and 7. Since 40 is closer to 36 than to 49, it is a little above 6: about 6.3. Check: 6.3² = 39.69.

Practise with the square root finder, then use the squares and cubes tool to see the tiles.

<!--fig:tool square-root-finder-->

<div class="problem" data-problem="c8m-sq-root"></div>

<div class="myth">

**“√(a + b) = √a + √b.”** Test it: √(9 + 16) = √25 = 5, but √9 + √16 = 3 + 4 = 7. Roots do not split over addition. They do split over multiplication: √(9 × 16) = √9 × √16 = 3 × 4 = 12.

</div>

## 3. Cubes: blocks in a cube

A box with equal length, breadth and height is a cube. A cube of side 3 cm holds 3 × 3 × 3 = 27 unit blocks. The number 27 is a **cube number** (perfect cube), written `$3^3 = 27$`. A Rubik’s cube has 3 × 3 × 3 small cubes, and a 4 × 4 × 4 has 64.

<figure class="fig" data-fig="c8-sq-cube"><figcaption>A cube of side n built layer by layer. Each layer is an n by n square, so n layers give n × n × n unit cubes. Slide the side, then slide the layers.</figcaption></figure>

The first cubes are 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000. Look at their last digits: a cube can end in any digit, and the last digit of the cube tells the last digit of the number: 1 → 1, 8 → 2, 7 → 3, 4 → 4, 5 → 5, 6 → 6, 3 → 7, 2 → 8, 9 → 9. For example the cube root of 4913 ends in 7 (since 4913 ends in 3).

Cubes of even numbers are even, and cubes of odd numbers are odd. Cubes also grow very fast: 10³ = 1000, 20³ = 8000, 100³ = 1,000,000.

<div class="history">

**The taxicab number 1729.** The mathematician Srinivasa Ramanujan, from Tamil Nadu, was once visited by G. H. Hardy, who said his taxi number, 1729, was “rather dull”. Ramanujan answered that it is very interesting: it is the smallest number that can be written as the sum of two cubes in two different ways. 1729 = 1³ + 12³ = 9³ + 10³. Check it: 1 + 1728 = 1729 and 729 + 1000 = 1729. Numbers like this are called Hardy–Ramanujan numbers.

</div>

## 4. Cube roots: undoing a cube

The **cube root** undoes cubing. Since 4³ = 64, the cube root of 64 is 4, written `$\sqrt[3]{64} = 4$`. Again prime factors help, but now we make **groups of three**.

<div class="steps" data-fig="c8-sq-cuberoot">
<div class="step">Start with 1728 and divide it by small primes.</div>
<div class="step">The primes are 2 six times and 3 three times.</div>
<div class="step">Group equal primes in threes: (2 2 2) (2 2 2) (3 3 3). No prime is left over.</div>
<div class="step">Take one prime from each group: 2, 2 and 3.</div>
<div class="step">Multiply: 2 × 2 × 3 = 12. So ∛1728 = 12, and 12 × 12 × 12 = 1728.</div>
</div>

If a prime does not fill its last group of three, the number is not a perfect cube. To fix that, multiply by the missing primes. For 54 = 2 × 3 × 3 × 3, the three 3’s make a group but 2 is alone: we need two more 2’s, so multiply by 4 to get 216 = 6³.

<div class="problem" data-problem="c8m-sq-cuberoot"></div>

The checker below shows pairs and triples for a few numbers, and the smallest multiplier that makes a number a perfect square or a perfect cube.

<figure class="fig" data-fig="c8-sq-cubecheck"><figcaption>Pick a number. Its prime factors are laid out with how many are left over when you make pairs (for squares) and triples (for cubes). Zero left over means a perfect square or cube.</figcaption></figure>

<div class="problem" data-problem="c8m-sq-cubemult"></div>

For more prime-factor work, try the [number theory toolkit](/science/number-theory-toolkit/).

<!--fig:tool square-cube-builder-->

<div class="myth">

**“A cube root is divided by 3.”** The cube root of 27 is 3, not 9. Squares and cubes are repeated multiplication, and roots undo that, not division by 2 or 3. To check any root, multiply it out.

</div>

<div class="keypoints">

- A square number is `$n \times n$`; a cube number is `$n \times n \times n$`. Squares end only in 0, 1, 4, 5, 6, 9.
- The sum of the first n odd numbers is `$n^2$`; there are `$2n$` numbers between `$n^2$` and `$(n+1)^2$`.
- Square root by subtracting odd numbers, by pairing prime factors, or by estimating between two squares.
- Cube root: group prime factors in threes and take one from each group.
- `$2m,\ m^2 - 1,\ m^2 + 1$` is a Pythagorean triplet. 1729 = 1³ + 12³ = 9³ + 10³.

</div>
