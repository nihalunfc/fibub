---
name: Heron's formula explorer
num: 1164
shelf: learn
code: L81
section: school-maths
title: "Heron's formula explorer: area of a triangle from three sides, step by step"
summary: "Slide three side lengths (or drag a corner) and see the triangle drawn, or why the sides can't make one. The area by Heron's formula is worked step by step and checked against ½ × base × height."
status: live
ads: false
order: 1164
icon: ruler
works: offline
updated: 2026-11-09
related: [pythagoras-proofs, similar-triangles, trig-ratios]
sources:
  - "Heron's formula, the triangle inequality and ½ × base × height are standard geometry. The numerically stable ordering of the formula follows W. Kahan's well-known note on triangle areas. Written for fibub."
  - "Checked against Python for ten triangles with whole-number areas (13-14-15 → 84, 5-12-13 → 30, ...) and against ½ × base × height for 300 random triangles."
flow:
  - { icon: sliders, label: "Three sides" }
  - { icon: ruler, label: "Triangle" }
  - { icon: calculator, label: "Heron" }
  - { icon: check, label: "Practise" }
---

## What it does

If you know the base and height of a triangle, its area is ½ × base × height. But often you only know the three sides, and finding the height is awkward. **Heron's formula** gives the area straight from the sides a, b and c:

- first the **semi-perimeter** s = (a + b + c)/2,
- then **area = √[s(s − a)(s − b)(s − c)]**.

This page draws the triangle for any three sides you choose (or tells you, with a picture, when the sides cannot meet), works out the formula step by step, names the kind of triangle (equilateral, isosceles or scalene; acute, right or obtuse), and checks the answer against ½ × base × height using the height it draws.

It follows the Class 9 chapter *Heron's formula*, which many state boards still teach.

For right triangles there is the quicker ½ × leg × leg, which you can explore with [[pythagoras-proofs]]. Triangles with the same shape but different sizes are in [[similar-triangles]], and the height on a side is a sine away in [[trig-ratios]].

## How to use it

1. Move the sliders for **a**, **b** and **c**, or type exact values. Side c is drawn as the base, from A to B; a is BC and b is CA.
2. Or **drag the top corner C**. The base stays fixed and a and b change.
3. Read the steps: s, the three brackets, their product and its square root.
4. Under the steps, the same area comes out of ½ × base × height.
5. If a red picture says the sides can't make a triangle, one side is as long as (or longer than) the other two put together.

## A worked example

The page starts with a = 13, b = 15 and c = 14.

- s = (13 + 15 + 14)/2 = 21.
- s − a = 8, s − b = 6, s − c = 7.
- s(s − a)(s − b)(s − c) = 21 × 8 × 6 × 7 = 7 056.
- Area = √7 056 = 84 square units.
- Check: the height on the base 14 is 2 × 84 / 14 = 12, and ½ × 14 × 12 = 84.

Try 10, 10, 10: s = 15 and the area is √(15 × 5 × 5 × 5) ≈ 43.30, the same as (√3/4) × 10².

## Tips

- Always check the triangle rule first: each side must be shorter than the sum of the other two.
- With whole-number sides, the product under the square root is often a perfect square in textbook questions. Factorise it to take the root without a calculator.

## Check yourself

Four fresh questions each time: an area from three sides, an equilateral triangle, sides in a ratio with a given perimeter, and whether three lengths make a triangle. Type the answer, press **Check**, and open the worked answer if you need it. Nothing is saved.

## FAQ

**Who was Heron?** Heron of Alexandria, a Greek mathematician and engineer of the first century, wrote the formula down in his book *Metrica*.

**Is this from the NCERT book?** It covers the same topic with fibub's own examples. fibub is not part of NCERT.
