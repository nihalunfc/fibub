---
name: Interactive geometry construction
num: 553
shelf: science
section: geometry-and-topology
title: "Geometry construction tool: points, lines, circles, bisectors and measurements that update as you drag"
summary: "Build ruler-and-compass constructions: points, segments, lines, circles, midpoints, perpendiculars, parallels, bisectors and intersections, with distances, angles and areas that update live when you drag a point. Download SVG, PNG or CSV. Runs in your browser."
status: live
ads: true
order: 553
icon: compass
works: offline
updated: 2026-11-09
related: [poincare-disk, function-grapher, polyhedron-viewer, knot-braid-drawer, symbolic-algebra]
sources:
  - "Standard coordinate geometry (line and circle intersections, shoelace area); no outside data."
  - "Checked against Python sympy: circumcentre, circumradius, incentre, area, angle and perimeter of a triangle, line–circle and circle–circle intersections, and the foot of a perpendicular."
flow:
  - { icon: pointer, label: "Place points" }
  - { icon: compass, label: "Construct" }
  - { icon: ruler, label: "Measure" }
  - { icon: download, label: "SVG/PNG" }
---

## What it does

This is a small dynamic geometry sketchpad, the kind used to explore school and university geometry. You place points and build on them: segments, lines, circles, midpoints, perpendiculars, parallels, perpendicular bisectors, angle bisectors and intersections. Every object remembers how it was made, so when you **drag a point**, everything built on it moves too and every measurement updates. That is how you see that a property holds for every triangle, not just the one you drew.

Step into curved space with the [[poincare-disk|hyperbolic geometry drawer]], and graph the equations behind your shapes in the [[function-grapher|graphing calculator]].

## How to use it

1. Pick a tool. The line under the tools says what to tap next.
2. Tap on the drawing. Where a tool needs a point, tap an existing point or an empty spot (which makes a new point there). Where it needs a line or circle, tap on it.
3. Drag any **free point** (a filled dot) to move it, in any tool. Points made by a construction, such as midpoints and crossings, are hollow and move only when what they depend on moves.
4. The **Objects and measurements** table lists everything with its value: points as coordinates, lines as equations y = mx + c, circles with centre, radius and area, polygons with area and perimeter. Type new coordinates for a free point to place it exactly. The × removes an object and everything built on it. **Undo** steps back.

**Tools**

- **Segment**, **Line** (infinite), **Circle** (centre, then a point on it), **Midpoint**.
- **Perpendicular** and **Parallel**: tap a line or segment and a point, in either order.
- **Perpendicular bisector** of two points, and **Angle bisector** (a point on one arm, the corner, a point on the other arm).
- **Intersect**: tap two lines or circles. A line and a circle, or two circles, can cross twice, so both crossings are made; one that does not exist at the moment is listed as "does not exist now" and appears when the shapes meet.
- **Distance**, **Angle** (0° to 180°) and **Polygon** (tap the corners, then the first corner again) for measurements.

**Grid** shows the coordinate grid. **Snap to the grid** puts new and dragged points on the nearest half unit.

## Worked example

The opening example draws the triangle A (−4, −2), B (3, −3), C (1, 4), the perpendicular bisectors of AB and BC, and their crossing D, the circumcentre, at (−0.159574, −0.117021). The circle centred at D through A has radius 4.2772, and the three distances d1 = DA, d2 = DB and d3 = DC are all 4.2772: drag any corner and they stay equal. The angle ABC is 65.9245°.

The "Incircle" example uses two angle bisectors to find the incentre D (0.0623325, −0.438), drops a perpendicular to AB to find where the incircle touches it, and shows the inradius 2.1208, which equals the area 23.5 divided by half the perimeter. "Midpoints of a quadrilateral" shows Varignon's theorem: joining the midpoints of any quadrilateral's sides gives a parallelogram with exactly half the area (63 and 31.5 in the example).

## Good to know

Angles are measured between 0° and 180°. Points cannot yet be tied to lie on a line or circle, and there are no locus or transformation tools. Lengths are in grid units.

## Frequently asked questions

**Is my work saved?** No. Nothing is stored or sent anywhere; download an SVG or CSV to keep it.

**Can I use it on a phone?** Yes. Tap to place and drag with one finger. The drawing does not scroll the page, so scroll beside it.
