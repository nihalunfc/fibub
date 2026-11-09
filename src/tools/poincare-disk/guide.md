---
name: Hyperbolic geometry drawer
num: 555
shelf: science
section: geometry-and-topology
title: "Hyperbolic geometry drawer: Poincaré disk lines, distances, triangles, circles and {p,q} tilings"
summary: "Place points in the Poincaré disk and draw hyperbolic segments, lines, circles and triangles, with true hyperbolic lengths, angles and areas, or draw regular {p, q} tilings such as {7, 3} and walk around them. PNG, SVG and CSV downloads."
status: live
ads: true
order: 555
icon: compass
works: offline
updated: 2026-11-09
related: [function-grapher]
sources:
  - "Standard hyperbolic geometry (Poincaré disk distance, disk isometries, Gauss–Bonnet, right-triangle trigonometry); no outside data."
  - "Checked against Python mpmath at 30 digits: distances, triangle angles by the hyperbolic law of cosines, circle centres and radii, and the side, radii and area of {7,3} and {4,5} tiles."
flow:
  - { icon: pointer, label: "Place points" }
  - { icon: compass, label: "Draw shapes" }
  - { icon: ruler, label: "Measure" }
  - { icon: download, label: "PNG/SVG" }
---

## What it does

Hyperbolic geometry is the geometry of a surface that curves away from itself at every point, like a saddle everywhere. Through a point off a line there are infinitely many lines that never meet it, triangles have angle sums below 180°, and the area of a circle grows exponentially with its radius.

The **Poincaré disk** draws the whole infinite hyperbolic plane inside a circle. Straight lines (geodesics) appear as arcs that meet the rim at right angles, or as diameters. Angles on the picture are the true angles, but lengths shrink towards the rim, which is infinitely far away. This page lets you draw in it and measures everything in true hyperbolic terms (curvature −1).

## How to use it

**Draw mode**

1. Tap inside the disk to add a point (up to 12, named A to L). Drag a point to move it, or type its x and y in the table.
2. **Add a shape** and choose what it is:
   - **Segment** from one point to another: its hyperbolic length, its length on the picture, and its hyperbolic midpoint.
   - **Line** through two points: the whole geodesic, out to the rim, and the two angles where it meets the rim (its "ideal points").
   - **Triangle**: its three sides, three angles, angle sum and area. By the Gauss–Bonnet theorem, the area is exactly π minus the angle sum.
   - **Circle** with a centre point and a hyperbolic radius: its circumference 2π sinh r and area 4π sinh²(r/2). A hyperbolic circle is drawn as an ordinary circle, but its Euclidean centre is nearer the rim than its true centre.
3. Change any shape's points from its menus. Every measurement updates as you drag.

**Tiling mode**

Choose p (the number of sides of each tile) and q (how many tiles meet at each corner). The tiling is hyperbolic when (p − 2)(q − 2) is more than 4: {7, 3}, {4, 5}, {5, 4}, {3, 7}, {8, 3} and so on. The page lists the tile's corner angle, side length, centre-to-corner and centre-to-side distances, and area, and draws thousands of tiles by reflecting the first one across its sides. Drag to walk across the tiling: every tile is the same size, and the one under your finger slides towards the centre.

## Worked example

The example has A (−0.5, −0.2), B (0.6, 0.1) and C (0.1, 0.6). Triangle ABC has sides BC = 1.93065, CA = 2.3842 and AB = 2.6065, angles 21.381°, 35.53° and 46.722°, an angle sum of 103.63° and area 1.33285. The circle at C with radius 1 has circumference 7.38401 and area 3.41228, and is drawn as a Euclidean circle with centre (0.085392, 0.51235) and radius 0.31611.

For the tiling {7, 3}, each heptagon has corners of 120°, sides of 0.566256 and area π/3 = 1.0472.

## Good to know

- Points must be inside the unit circle. The rim itself is at infinite distance and is not part of the plane.
- Lengths use curvature −1, the usual choice in textbooks. For curvature −k², divide lengths by k and areas by k².
- The tool shows the disk model only, not the upper half-plane or the hyperboloid.

## Frequently asked questions

**Why do the tiles near the edge look tiny?** They are all the same hyperbolic size. The disk squeezes an infinite plane into a finite circle, so distances near the rim are drawn very small.

**Is anything sent anywhere?** No. It all runs in your browser and works offline once loaded.
