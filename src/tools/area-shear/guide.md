---
name: Shear and area
num: 1251
shelf: learn
section: school-maths
title: "Shear and area: why a parallelogram's area is base × height and a triangle's is half"
summary: "Slide the top of a parallelogram, triangle or trapezium along a square grid and watch the area stay the same. Cut and slide a parallelogram into a rectangle, or add a turned copy to see why a triangle is half and a trapezium is ½(a + b)h."
status: live
ads: false
order: 1251
icon: ruler
works: offline
updated: 2026-11-09
related: [herons-formula, picks-theorem, circle-slices, quadrilateral-explorer]
sources:
  - "Area of a parallelogram, triangle and trapezium, and the shear (Cavalieri) argument, are standard school geometry. Pictures and questions written for fibub."
  - "Checked: the formula areas equal the shoelace area of the drawn corners for 2 000 random shapes (tests/sci-tools/area-shear.mjs) and by hand for the worked examples."
flow:
  - { icon: ruler, label: "Shape" }
  - { icon: pointer, label: "Slide top" }
  - { icon: scissors, label: "Cut, move" }
  - { icon: check, label: "Same area" }
---

## What it does

Take a rectangle and push its top sideways, keeping the top the same height. You get a parallelogram. Did the area change? This page lets you try it on a grid of unit squares:

- **Parallelogram**: drag the round handle (or the **s** slider) to slide the top. The area stays **base × height**, even though the slanted sides get longer.
- **Cut and slide**: cut the triangle off one end and slide it to the other. The parallelogram turns into a rectangle with the same base and height.
- **Triangle**: slide the top corner along a line parallel to the base. The area stays **½ × base × height**. Add a turned copy and two triangles make a parallelogram.
- **Trapezium**: two parallel sides a and b. A turned copy makes a parallelogram with base a + b, so the trapezium's area is **½ × (a + b) × h**.

Sliding a shape like this, with every horizontal strip moving sideways but keeping its length, is called a **shear**. It never changes area.

It follows the Class 8 maths chapter *Area*. Counting area with dots on a grid is in [[picks-theorem|Pick's theorem]], the area of a circle by slicing is in [[circle-slices]], and a triangle from three sides is in [[herons-formula]].

## How to use it

1. Choose **Parallelogram**, **Triangle** or **Trapezium**.
2. Set the base **b**, the height **h** and, for a trapezium, the top side **a**.
3. Drag the round handle sideways, or set **s** (how far along the top starts). The red dashed line is the height.
4. For a parallelogram, move **Cut and slide** to the right. For a triangle or trapezium, tick **Add a turned copy**.
5. Read the area, the formula with your numbers, and the perimeter, which does change.

## A worked example

The page starts with a parallelogram of base 6 and height 4, its top slid 2 squares along.

- Area = 6 × 4 = 24 square units.
- Slide s to 6: the slanted side grows from √(2² + 4²) ≈ 4.47 to √(6² + 4²) ≈ 7.21, the perimeter from 20.94 to 26.42, but the area is still 24.
- Back at s = 2, move **Cut and slide** to the end: the triangle with corners (0, 0), (2, 0), (2, 4) moves 6 along and the shape is a 6 × 4 rectangle.

Switch to **Trapezium** with a = 3, b = 6, h = 4: area = ½ × (3 + 6) × 4 = 18. With the turned copy, the parallelogram has base 9 and area 36, twice the trapezium.

## Tips

- The height is always measured at right angles to the base, never along the slanted side.
- If the top slides more than a whole base length, one cut is not enough, but thin strips still slide across: the area is unchanged.
- Count the whole squares and pair up the half squares to check the formula by eye.

## Check yourself

Four fresh questions: parallelogram and triangle areas, a trapezium, and a height from an area. Nothing is saved.

## FAQ

**Why doesn't the slanted side matter?** Area counts the squares inside. Sliding the top moves every row of squares sideways, but each row keeps its length, so the total stays the same.

**Is this the NCERT book?** No. It covers the same topic with fibub's own pictures and questions. fibub is not part of NCERT.
