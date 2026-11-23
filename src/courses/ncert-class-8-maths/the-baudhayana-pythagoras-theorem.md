---
title: The Baudhayana-Pythagoras Theorem
seoTitle: 'Pythagoras Theorem Class 8 notes, proof and triples'
summary: 'Class 8 Baudhayana-Pythagoras theorem: the rope trick, a rearrangement proof, finding sides, Pythagorean triples, the converse and distances, with live figures.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'The legs of a right triangle are 6 cm and 8 cm. The hypotenuse is:'
    choices: ['10 cm', '14 cm', '12 cm', '100 cm']
    ans: 0
    why: 'c² = 6² + 8² = 36 + 64 = 100, so c = 10 cm.'
  - q: 'Which set of sides makes a right triangle?'
    choices: ['8, 15, 17', '6, 7, 8', '9, 10, 12', '5, 7, 9']
    ans: 0
    why: '8² + 15² = 64 + 225 = 289 = 17². The other sets fail the test.'
  - q: 'A 10 m ladder has its foot 6 m from a wall. How high up the wall does it reach?'
    choices: ['8 m', '4 m', '16 m', '7 m']
    ans: 0
    why: 'The ladder is the hypotenuse. Height² = 10² − 6² = 100 − 36 = 64, so the height is 8 m.'
sources:
  - 'NCERT Class 8 Mathematics (Ganita Prakash), Chapter 9 “The Baudhayana-Pythagoras Theorem” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Baudhayana Sulba Sutra (about 800 BCE), the statement for a rectangle and its diagonal; Euclid, Elements Book I, Proposition 47 and its converse 48'
---

**Maths · Class 8 · Chapter 9 · about 50 minutes.** By the end you will be able to state the theorem, see why it is true in a picture, use it to find a missing side, recognise Pythagorean triples, use its converse to test for a right angle, and find distances.

<div class="bigidea">In a right triangle, the square drawn on the longest side has exactly the same area as the two squares on the other sides added together. Long before Pythagoras was born in Greece, Indian rope-stretchers used this rule to mark right angles for fire altars and buildings. Baudhayana wrote it down about 800 BCE.</div>

## 1. The rope-stretchers' right angle

To build an altar or a house, you need square corners. Without a set-square, the priests who built Vedic altars used a rope with knots tied at equal gaps. They took a rope with 12 equal gaps, pegged it with one peg at a knot, and stretched it into a triangle with 3 gaps, 4 gaps and 5 gaps along the sides. The corner between the 3 side and the 4 side was always a perfect right angle.

<figure class="fig" data-fig="c8-pyth-rope"><figcaption>Choose a rope: 3-4-5, 6-8-10, 5-12-13 or 4-5-6. The knots are the equal gaps. The 3-4-5 rope, and the others except 4-5-6, make exactly 90° at the peg; 4-5-6 makes about 83°.</figcaption></figure>

Why does it work? Because 3² + 4² = 9 + 16 = 25 = 5². That is the Baudhayana-Pythagoras theorem in its simplest case.

## 2. The theorem

In a triangle with a right angle, the side opposite the right angle is the longest side and is called the **hypotenuse**. The other two sides are the **legs**.

```math
a^2 + b^2 = c^2
```

<div class="meaning">
<dl>
<dt>a, b</dt><dd>the two legs, the sides that meet at the right angle</dd>
<dt>c</dt><dd>the hypotenuse, opposite the right angle (always the longest side)</dd>
<dt>Meaning</dt><dd>The area of the square on the hypotenuse equals the sum of the areas of the squares on the legs. It is a statement about areas, not about lengths adding up (3 + 4 is not 5).</dd>
</dl>
</div>

<figure class="fig" data-fig="c8-pyth-explore"><figcaption>Slide the two legs. The squares on the legs and the square on the hypotenuse change, but the two small areas always add up to the big one. The readout says when c comes out as a whole number.</figcaption></figure>

<div class="myth">

**“a + b = c.”** In a 3-4-5 triangle 3 + 4 = 7, not 5. The theorem is about the squares: 9 + 16 = 25. Also c must be the **longest** side. Do not put the hypotenuse on the wrong side: c² = a² + b², never a² = b² + c² unless a is the hypotenuse.

</div>

## 3. Why is it true? A proof by rearranging

Take four copies of a right triangle with legs a = 3 and b = 4 (hypotenuse c = 5) and arrange them inside a square of side a + b = 7 in two ways.

<div class="steps" data-fig="c8-pyth-proof">
<div class="step">A big square of side a + b = 3 + 4 = 7. Its area is 49 whichever way we fill it.</div>
<div class="step">Place four copies of the triangle in the four corners, each with its long side facing in.</div>
<div class="step">The gap in the middle is a tilted square with side c = 5, so its area is c² = 25.</div>
<div class="step">Now take the same four triangles and slide them into different places in the same big square.</div>
<div class="step">This time the gaps are two squares: a 4 by 4 square (b² = 16) and a 3 by 3 square (a² = 9).</div>
<div class="step">The big square minus the same four triangles is left over both times, so c² = a² + b². Check: 25 = 9 + 16.</div>
</div>

With letters: the big square has area (a + b)². The four triangles have a total area of 4 × ½ab = 2ab. The leftover in the first arrangement is c², so (a + b)² = 2ab + c². Expand (a + b)² = a² + 2ab + b² and cancel 2ab: a² + b² = c². (This uses the identity from the chapter *We Distribute, Yet Things Multiply*.)

<div class="problem" data-problem="c8m-pyth-hyp"></div>

<div class="problem" data-problem="c8m-pyth-leg"></div>

Explore several different proofs of the theorem, including old Indian and Chinese ones:

<!--fig:tool pythagoras-proofs-->

## 4. Using the theorem

**Find the hypotenuse.** Legs 6 cm and 8 cm: c² = 36 + 64 = 100, so c = 10 cm.

**Find a leg.** Hypotenuse 13 m and one leg 5 m: b² = 169 − 25 = 144, so b = 12 m. (Subtract the leg's square from the hypotenuse's square.)

**A ladder.** A 10 m ladder leans on a wall with its foot 6 m from the wall. The ladder, the wall and the ground make a right triangle with the ladder as the hypotenuse. Height² = 100 − 36 = 64 so the ladder reaches 8 m.

**The diagonal of a rectangle.** A field is 12 m long and 5 m wide. The diagonal cuts it into two right triangles: d² = 144 + 25 = 169, so d = 13 m. For a square of side s the diagonal is s√2.

<div class="problem" data-problem="c8m-pyth-ladder"></div>

<div class="problem" data-problem="c8m-pyth-diag"></div>

**Square roots that are not whole.** Legs 1 and 1 give c² = 2, so c = √2 ≈ 1.414. Not every right triangle has whole-number sides, and that is fine.

## 5. Pythagorean triples

Three whole numbers a, b, c with a² + b² = c² are a **Pythagorean triple**. The best known are 3-4-5, 5-12-13, 8-15-17, 7-24-25. If you multiply every number of a triple by the same whole number you get another triple: 3-4-5 gives 6-8-10, 9-12-15, 30-40-50.

There is a recipe that makes triples. Take any whole numbers m > n and let

```math
a = m^2 - n^2,\quad b = 2mn,\quad c = m^2 + n^2
```

For m = 2, n = 1: a = 3, b = 4, c = 5. For m = 3, n = 2: a = 5, b = 12, c = 13. Why does it work? (m² − n²)² + (2mn)² = m⁴ − 2m²n² + n⁴ + 4m²n² = m⁴ + 2m²n² + n⁴ = (m² + n²)².

<figure class="fig" data-fig="c8-pyth-triples"><figcaption>Choose m and n. The triangle is drawn to scale with its three sides labelled, and the readout checks that a² + b² = c². Try m = 4, n = 1 and m = 5, n = 2.</figcaption></figure>

<div class="problem" data-problem="c8m-pyth-gen"></div>

## 6. The converse: is it a right angle?

The converse of a statement swaps "if" and "then". If a triangle has sides a, b, c and a² + b² = c², then the angle opposite c is a right angle. This is what the rope trick uses. It goes further:

| Test (c the longest side) | The angle opposite c is |
|---|---|
| a² + b² = c² | exactly 90°, a right triangle |
| a² + b² > c² | less than 90°, so the triangle is acute |
| a² + b² < c² | more than 90°, so the triangle is obtuse |

<figure class="fig" data-fig="c8-pyth-converse"><figcaption>Slide the three sides. The triangle is drawn from them, and the readout compares a² + b² with c². If the two shorter sides cannot reach each other (a + b ≤ c) there is no triangle.</figcaption></figure>

Test 2, 3, 4: 4 + 9 = 13 and 4² = 16. So 13 < 16: obtuse, not right. Test 7, 24, 25: 49 + 576 = 625 = 25². Right.

## 7. Distance on a grid

On a map or a game screen, a point is described by how far across and how far up it is. To find the straight-line distance between two points, make a right triangle with the across-step and the up-step as legs. The distance is the hypotenuse:

```math
d = \sqrt{(\Delta x)^2 + (\Delta y)^2}
```

<figure class="fig" data-fig="c8-pyth-grid"><figcaption>Drag points A and B (a touch or a mouse) to any grid corner. The green lines are the legs and the orange line is the distance. Try to land on a whole-number distance.</figcaption></figure>

From (1, 1) to (6, 5): across 5, up 4, d = √41 ≈ 6.4.

<div class="problem" data-problem="c8m-pyth-grid"></div>

<div class="problem" data-problem="c8m-pyth-area"></div>

<div class="history">

<ul class="timeline">
<li><b>about 1800 BCE</b> A Babylonian clay tablet (Plimpton 322) lists many Pythagorean triples.</li>
<li><b>about 800 BCE</b> Baudhayana's Sulba Sutra states the rule for the diagonal of a rectangle and uses 3-4-5 and 5-12-13 ropes to set out altars.</li>
<li><b>about 500 BCE</b> Pythagoras and his school in Greece study the theorem and its proof.</li>
<li><b>about 300 BCE</b> Euclid gives a proof and the converse in Book I of the Elements.</li>
<li><b>about 500 CE</b> Aryabhata and later Indian mathematicians use the theorem for chords and shadows.</li>
</ul>

</div>

<div class="keypoints">

- In a right triangle, a² + b² = c², where c is the hypotenuse, the longest side opposite the right angle.
- It is a statement about areas of squares on the sides, not about lengths adding up.
- Find the hypotenuse by adding the squares and taking the root; find a leg by subtracting.
- A Pythagorean triple is whole numbers with a² + b² = c²: 3-4-5, 5-12-13, 8-15-17, 7-24-25. Multiples of a triple are triples.
- The recipe m² − n², 2mn, m² + n² makes a triple for any m > n.
- Converse: if a² + b² = c² the angle opposite c is 90°; bigger sum means acute, smaller means obtuse.
- Distance between two points = √((across)² + (up)²).

</div>
