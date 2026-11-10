---
name: 3D point plotter
num: 1379
shelf: learn
code: L224
section: school-maths
title: "3D coordinates: plot points in space, find the octant and use the distance formula in 3D"
summary: "Turn a set of x, y and z axes round with your finger, place two points and see the dashed box that shows each coordinate. The octant of each point and the 3D distance formula are worked with your numbers, and the section formula puts a third point between them."
status: live
ads: false
order: 1379
icon: orbit
works: offline
updated: 2026-11-09
related: [section-formula, vector-lab-3d, line-forms]
sources:
  - "Standard three-dimensional coordinate geometry: the three axes and coordinate planes, the eight octants (I to VIII in the usual school order), the distance formula √[(x₂ − x₁)² + (y₂ − y₁)² + (z₂ − z₁)²] and the section formula. Written for fibub."
  - "Checked on hand-worked examples (computed again in Python) and on 300 random cases: the turning view keeps every distance, and R lies on PQ with PR : RQ = m : n."
flow:
  - { icon: sliders, label: "Place P, Q" }
  - { icon: orbit, label: "Turn axes" }
  - { icon: ruler, label: "Distance" }
  - { icon: check, label: "Practise" }
---

## What it does

In space a point needs three numbers: how far along x, along y and up z. Drawings of 3D axes on flat paper are hard to read, so this page lets you **turn the axes round** with your finger and watch where a point really is.

- Place two points **P** and **Q** with the x, y and z sliders. The dashed **coordinate box** behind each point shows its three coordinates as edges: walk x along the x axis, y across, then z up.
- The page names the **octant** of each point from the signs of its coordinates. The three coordinate planes cut space into eight octants, numbered I to VIII: I is (+, +, +), II (−, +, +), III (−, −, +), IV (+, −, +), and V to VIII are the same four below the xy plane. A point with a zero coordinate lies on a plane or an axis and is in no octant.
- The **distance formula** in 3D is worked with your numbers: PQ = √[(x₂ − x₁)² + (y₂ − y₁)² + (z₂ − z₁)²], and so is the distance from the origin.
- Tick the box for the **section formula**: R divides PQ in the ratio m : n, and the page checks PR : RQ for you.

It follows the Class 11 chapter *introduction to three-dimensional geometry* and gets you ready for Class 12 vectors and lines in space.

The flat version of all this is [[section-formula]]; in Class 12 the same points become vectors in [[vector-lab-3d]], and straight lines in the plane are in [[line-forms]].

## How to use it

1. Pick **P** or **Q** under "Move", then set x, y and z with the sliders (whole numbers from −6 to 6).
2. Drag the picture to turn it, or tap **Slanted**, **Front (yz)** or **Top (xy)** for a standard view. In the top view you see the floor plan: x and y only.
3. Untick the coordinate box if the picture gets busy.
4. Tick the section formula box and set m and n to place R on PQ.

## A worked example

The page starts with P(3, −2, 4) and Q(−1, 2, 2).

- P has signs (+, −, +), so it is in octant IV. Q has signs (−, +, +): octant II.
- PQ = √[(−4)² + 4² + (−2)²] = √(16 + 16 + 4) = √36 = **6**.
- P is √(9 + 4 + 16) = √29 ≈ 5.3852 from the origin.
- With the section formula on and m : n = 1 : 1, R is the midpoint (1, 0, 3), and PR = RQ = 3.

## Tips

- The 3D distance formula is Pythagoras twice: first across the floor, then up the height.
- Flipping the sign of z moves a point between octants I and V, II and VI, and so on.
- Points on the x axis look like (a, 0, 0); points in the yz plane look like (0, b, c).

## Check yourself

Four fresh questions: a distance between two points (always a whole number), the octant of a point (type 1 to 8), a midpoint, and a distance from the origin. Nothing is saved.

## FAQ

**Why is x pointing towards me?** That is the usual way 3D axes are drawn in school books: x out of the page, y to the right, z up. Turn the picture to see it any other way.

**Is this from the NCERT book?** It covers the same topics with fibub's own examples. fibub is not part of NCERT.
