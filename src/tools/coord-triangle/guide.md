---
name: Triangle type from coordinates
num: 1317
shelf: learn
section: school-maths
title: "Triangle type from coordinates: collinear points, isosceles, equilateral, right, acute or obtuse"
summary: "Drag three points on a grid or type their coordinates. See whether they are collinear, the three side lengths by the distance formula, the area, and whether the triangle is scalene, isosceles or equilateral and right, acute or obtuse, with every step shown."
status: live
ads: false
order: 1317
icon: target
works: offline
updated: 2026-11-09
related: [section-formula, pythagoras-proofs, herons-formula]
sources:
  - "Standard coordinate geometry: the distance formula, the area of a triangle from its vertices, the converse of Pythagoras' theorem and slopes of perpendicular lines. Written for fibub."
  - "Checked against hand-worked cases ((1, 1), (5, 1), (1, 4): sides 4, 3, 5, area 6, right angle at A) and on 2000 random triangles against angles from the law of cosines."
flow:
  - { icon: pointer, label: "Drag points" }
  - { icon: ruler, label: "Side lengths" }
  - { icon: calculator, label: "Area" }
  - { icon: check, label: "Its type" }
---

## What it does

Give three points and this page tells you what they make:

- **Collinear or not.** If the area of the triangle is 0, the three points lie on one straight line and there is no triangle. It also says which point lies between the other two.
- **The three sides**, each worked with the distance formula and written as a simple surd (such as 2√5) where it is one.
- **The area**, from ½ |x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|.
- **The type by sides**: scalene (no equal sides), isosceles (two equal, marked in green with a tick) or equilateral (all three equal).
- **The type by angles**: compare the square of the longest side with the sum of the squares of the other two. Equal means **right-angled** (the converse of Pythagoras' theorem), bigger means **obtuse**, smaller means **acute**. The right angle is marked on the picture.

At the **Class 11** level it also shows the slope of each side: collinear points share one slope, and two perpendicular sides have slopes that multiply to −1.

It follows the Class 10 Maths chapter *coordinate geometry* (distance formula, collinearity and area) and the Class 11 chapter on straight lines (slopes).

Work out midpoints and section points in [[section-formula]], see why the squares add up in [[pythagoras-proofs]], and find a triangle's area from its sides alone with [[herons-formula]].

## How to use it

1. **Drag A, B or C** on the grid. They snap to whole numbers from −6 to 6.
2. Or **type a point** as x, y in its box, such as `2, -3` or `1, √3`. Typed points can be anywhere from −50 to 50 and need not be whole.
3. Read the **verdict** under the boxes, then the full working in the next card.
4. Switch **Level** to Class 11 to add the slopes of the three sides.

## Worked example

The page opens with A(1, 1), B(5, 1) and C(1, 4).

- AB² = (5 − 1)² + (1 − 1)² = 16, so AB = 4. BC² = (1 − 5)² + (4 − 1)² = 25, so BC = 5. CA² = 9, so CA = 3.
- Area = ½ |1(1 − 4) + 5(4 − 1) + 1(1 − 1)| = ½ |−3 + 15 + 0| = **6 square units**, not 0, so it is a real triangle.
- No two sides are equal: **scalene**.
- The longest side squared is BC² = 25 and the other two add to 16 + 9 = 25. They are equal, so the angle opposite BC, at **A**, is **90°**.

Now type C as 9, 1. The area becomes 0 and the verdict says the points are **collinear**, with B between A and C: 4 + 4 = 8.

## Tips

- Compare squared lengths, not rounded lengths: 25 = 16 + 9 is exact, but 5.00 ≈ 4.00 + ... is not how the test works.
- To show three points are collinear you can use the area (it is 0) or the distances (the two short ones add to the long one).
- An equilateral triangle can never have all three corners on whole-number grid points. Its height always brings in √3.

## FAQ

**Why does my equilateral triangle say isosceles?** Typed decimals such as 1.732 are not exactly √3, so the sides differ slightly. Type `√3` instead (for example A 0, 0; B 2, 0; C 1, √3).

**What if two points are the same?** Then there is no triangle, and the page says so.

**Is this from the textbook?** No. The examples are made up for practice and follow the syllabus topics; fibub is not part of NCERT.

**Is anything saved?** No. Everything is worked out in your browser and nothing is stored or sent.
