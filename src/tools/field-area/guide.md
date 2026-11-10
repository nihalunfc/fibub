---
name: Field area by triangles
num: 1283
shelf: learn
section: school-maths
title: "Field area by triangles: split a plot of land, find each part with Heron's formula, check with the shoelace formula"
summary: "Drag the corners of a plot of land on a 10 m grid. The plot is cut into triangles, each one's area is worked out from its three sides with Heron's formula, and the total is given in m², hectares and acres, with the perimeter. At Class 11 level the shoelace formula checks it."
status: live
ads: false
order: 1283
icon: ruler
works: offline
updated: 2026-11-09
related: [herons-formula, section-formula, quadrilateral-explorer, traverse-calculator]
sources:
  - "Heron's formula, the polygon area (shoelace) formula and triangulation by ear clipping are standard mathematics. 1 hectare = 10 000 m² and 1 international acre = 4 046.856 422 4 m² are exact definitions. Written for fibub; the plots are made-up examples."
  - "Checked against sympy's Polygon.area (a five-sided plot 38.5 square units, a dented plot 24) and on 300 random plots with dents, where the Heron triangles always add up to the shoelace area."
flow:
  - { icon: pointer, label: "Corners" }
  - { icon: ruler, label: "Triangles" }
  - { icon: calculator, label: "Heron" }
  - { icon: check, label: "Practise" }
---

## What it does

Real plots of land are rarely rectangles. Surveyors and farmers find their area the way you can at school: **cut the plot into triangles**, measure the three sides of each triangle, and use **Heron's formula**, area = √[s(s − a)(s − b)(s − c)] with s half the perimeter. This page does that live while you drag the corners:

- the plot is drawn on a grid of 10 m squares, with every side's length marked,
- it is cut into triangles T1, T2, ... that stay inside the plot, even when the plot has a dent,
- each triangle's sides, s and Heron area are written out, then added up,
- the total is given in **m²**, **hectares** and **acres**, with the **perimeter** (the fence you would need),
- at the **Class 11** level the corners are given as coordinates and the **shoelace formula** gives the same area in one line.

It follows the Class 9 maths chapter on **perimeter and area** (Heron's formula for triangles and fields), and links to Class 11 coordinate geometry.

For a single triangle, step by step, use [[herons-formula]]; the area of a triangle from its corner coordinates is in the [[section-formula]] tool, and four-sided shapes are explored in the [[quadrilateral-explorer]].

## How to use it

1. Drag any corner. Corners snap to whole metres; the area and the triangles update as you go.
2. **Add a corner** puts a new one in the middle of the longest side; tap a corner to select it, then **Remove a corner**.
3. Try the quick plots: a **five-sided field**, an **L-shaped plot** (with a dent) and a **triangle**.
4. Read **Triangle by triangle** for the full working. Switch to **Class 11** for the coordinates and the shoelace check.
5. If two sides cross, the page says so: a crossed shape does not have a proper inside.

## A worked example

The five-sided field has corners A(10, 10), B(110, 10), C(150, 90), D(70, 140) and E(20, 100), in metres. It splits into 5 − 2 = 3 triangles:

- EAB: area 4 500 m² (sides 90.6, 100 and 127.3 m),
- EBC: area 5 400 m²,
- CDE: area 2 850 m².

Total: 4 500 + 5 400 + 2 850 = **12 750 m²**, which is 1.275 hectares or about 3.15 acres. The perimeter is about 438.4 m. The shoelace formula gives the same 12 750 m².

## Tips

- Any polygon with n straight sides can be cut into n − 2 triangles by lines joining its corners.
- Heron's formula needs only the three side lengths, which is why it suits fields: you can measure sides with a tape, but heights are hard to measure on the ground.
- 1 hectare is a 100 m by 100 m square. An acre is a little over 40 % of a hectare.

## Check yourself

Four fresh questions each time: a Heron triangle, a rectangle with a triangle on top, m² to hectares, and how many triangles a polygon splits into. Nothing is saved.

## FAQ

**Why do the triangle areas sometimes end in long decimals?** Side lengths along a slant are square roots, so the working is rounded for display. The total still matches the exact shoelace area.

**Can I use it for a real plot?** It is a learning tool on a small grid. For real survey data with bearings and distances, use the [[traverse-calculator]].

**Is this from the NCERT book?** It covers the same topic with fibub's own plots. fibub is not part of NCERT.
