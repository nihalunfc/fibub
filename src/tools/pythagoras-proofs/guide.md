---
name: Pythagoras proof playground
num: 1152
shelf: learn
code: L69
section: school-maths
title: "Pythagoras theorem playground: drag a right triangle, see four proofs and make Pythagorean triples"
summary: "Drag a right triangle and watch the squares on its sides add up. Slide through four visual proofs (rearrangement, Bhaskara, similar triangles, Baudhayana) with your own side lengths, and list Pythagorean triples."
status: live
ads: false
order: 1152
icon: ruler
works: offline
updated: 2026-11-09
related: [quadratic-explorer, geometry-construction, number-theory-toolkit]
sources:
  - "Pythagoras' theorem and its classic proofs (rearrangement, Bhaskara II's figure, similar triangles, the square-doubling rule of the Baudhayana Sulba Sutra) are standard mathematics. Pictures and wording are fibub's own."
  - "Triples come from Euclid's formula; checked by brute force against every triple with hypotenuse up to 100 (16 primitive). Proof figures checked by their areas."
flow:
  - { icon: pointer, label: "Drag" }
  - { icon: ruler, label: "Squares" }
  - { icon: book, label: "Proofs" }
  - { icon: table, label: "Triples" }
---

## What it does

Pythagoras' theorem says that in a right triangle the square on the hypotenuse equals the sum of the squares on the other two sides: a² + b² = c². This playground lets you **see** that. Drag the corners of a right triangle and the three squares on its sides grow and shrink with their areas written inside, so you can check the sum for any shape you like.

Then it shows **why** it is true with four short visual proofs that use your own side lengths, and it lists **Pythagorean triples**, whole numbers such as 3, 4, 5 that fit the rule. It fits the Class 8 topic on squares and square roots (Pythagorean triples), the Class 7 and Class 10 work on right triangles and similar triangles, and is useful for the right-triangle problems in Class 10 trigonometry.

Next, solve quadratics that come out of right-triangle problems with the [[quadratic-explorer]], draw your own constructions with [[geometry-construction]], or explore the number patterns behind triples in the [[number-theory-toolkit]].

## How to use it

1. **Drag the blue corners** (or use the a and b sliders, or type exact values). The right angle stays fixed.
2. Read the three areas: a² in one colour, b² in another and c² on the hypotenuse. The line under the picture adds them for you and gives c as a square root.
3. Pick a proof: **Rearrange**, **Bhaskara**, **Similar triangles** or **Baudhayana**. Each draws its own figure for your a and b and lists the steps with your numbers in them. In Rearrange, slide **t** to move the triangles.
4. In **Pythagorean triples**, choose the largest hypotenuse to list, tick **Primitive triples only** to hide multiples, and try the Class 8 rule 2m, m² − 1, m² + 1. Tap a row to draw that triangle.

## The four proofs in one line each

- **Rearrange**: the same four triangles in the same big square leave either one square c² or two squares a² and b² empty, so the two must be equal.
- **Bhaskara**: four triangles and a small square of side b − a fill the square on c, so c² = 2ab + (b − a)² = a² + b².
- **Similar triangles**: the height to the hypotenuse makes two smaller triangles similar to the big one, which gives a² = cp and b² = cq.
- **Baudhayana**: the square on the diagonal of a square has twice its area. The Sulba Sutra rule for altar building states the general case for rectangles too.

## A worked example

Start with the page's example, a = 3 and b = 4.

- a² = 9 and b² = 16, so c² = 25 and c = 5: a whole number, so (3, 4, 5) is a triple.
- Rearrange: the big square has side 7 and area 49. Four triangles of area 6 each cover 24, leaving 25 = c².
- Bhaskara: the small square has side 1, so c² = 4 × 6 + 1 = 25.
- Similar triangles: the height cuts the hypotenuse into p = 1.8 and q = 3.2, and 5 × 1.8 = 9 = a², 5 × 3.2 = 16 = b².

Now type a = 6, b = 7: c² = 85 and c = √85 ≈ 9.22, not a whole number, so (6, 7, c) is not a triple even though the theorem still holds.

## Check yourself

Four fresh questions each time: a hypotenuse, a ladder against a wall, the diagonal of a rectangle and a triple from the Class 8 rule. Type a number, press **Check**, and open the worked answer if you need it. Nothing is saved.

## FAQ

**Does it work for triangles without a right angle?** No. For other triangles a² + b² is bigger or smaller than c², which is how you can test whether a triangle is right-angled (the converse of the theorem).

**What is a primitive triple?** One whose three numbers share no common factor, like 5, 12, 13. Doubling it gives 10, 24, 26, which is a triple but not primitive.

**Is this from the NCERT book?** It covers the same ideas but the pictures, examples and questions are fibub's own. fibub is not part of NCERT.
