---
name: Bearings
num: 2278
shelf: learn
code: L354
section: school-maths
title: "Bearings: three-figure bearings, back bearings and journeys"
summary: "Drag two points on a map to see the three-figure bearing of B from A, the back bearing and the distance, then walk a journey of legs and find the bearing and distance back to the start."
status: live
ads: false
order: 2278
icon: compass
works: offline
updated: 2026-11-16
related: [vector-adder, sine-cosine-law, trig-ratios]
sources:
  - "Bearings are standard school geometry and trigonometry: measured clockwise from north, written with three figures. Serves GCSE maths (ratio, proportion and geometry: bearings), Ontario MTH1W and MPM2D (trigonometry applications) and Common Core HSG-SRT.C.8. The distance back uses Pythagoras, the cosine rule c² = a² + b² − 2ab cos C, or east and north components. Checked against hand-worked values in tests/curr-maths.mjs. Pictures are fibub's own."
flow:
  - { icon: pointer, label: "Drag" }
  - { icon: compass, label: "Bearing" }
  - { icon: ruler, label: "Journey" }
  - { icon: check, label: "Quiz" }
---

## What it does

A bearing tells you which way to go: the angle measured **clockwise from north**, always written with three figures. North is 000°, east is 090°, south is 180° and west is 270°. A bearing of 45° is written 045° so nobody mistakes it for part of a longer number.

Drag points A and B on the map. At each point there is a dashed north line, and the page draws the angle from north round to the line between them. You get the bearing of B from A, the **back bearing** (the bearing of A from B, always 180° different) and the distance on the scale of the map. Journey mode walks several legs and shows the straight way home. To work out distances and angles in the triangles that appear, use [[sine-cosine-law]] and [[trig-ratios]], and [[vector-adder]] to add the legs as vectors.

## How to use it

1. In Two points mode, drag A and B, or use the bearing and distance sliders to place B from A.
2. Read the bearing, the back bearing and the distance. The coloured arcs on the map show the two angles.
3. Switch to Journey, type a bearing and a distance for each leg, and add or remove legs.
4. Read the bearing and distance that bring you back to the start. Grade 11 to 12 shows the cosine rule or the east and north components.
5. Answer the quiz. The numbers change every time.

## What each setting does

- **Bearing slider:** where B is as seen from A, measured from north.
- **Distance slider:** how far B is from A. One square on the map is 1 km.
- **Journey legs:** each leg is walked in order; the dashed line is the way back.
- **Grade 11 to 12:** shows the working with tan, the cosine rule and components.

## Worked example

Walk 4 km on a bearing of 090° (east), then 3 km on 180° (south). You are now 4 km east and 3 km south of the start, so the way back is a 3-4-5 triangle: the distance is 5 km. The back bearing is 360° − tan⁻¹(4 ÷ 3) = 360° − 53.1° = 306.9°, so about 307°.

## FAQs

**Why three figures?** It keeps bearings clear: 045° and 270° can never be confused with other numbers.

**How do I find a back bearing?** Add 180° if the bearing is under 180°, and subtract 180° if it is 180° or more.

**Is the angle always clockwise?** Yes, and always from north, never from east or the previous leg.
