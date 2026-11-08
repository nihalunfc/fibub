---
name: Traverse calculator
num: 132
shelf: science
section: geodesy-and-surveying
title: "Traverse closure and area calculator: misclosure, precision, Bowditch and transit adjustment, coordinate geometry"
summary: "Paste or open a survey traverse as bearings and distances or as angles and distances. Get the angular and linear misclosure, the precision ratio, Bowditch or transit adjusted coordinates, the area inside a loop, and the bearing and distance between points and where two lines or two distances meet."
status: live
ads: true
order: 1
icon: compass
works: offline
updated: 2026-11-08
related: [sky-coordinates, stereonet, darcy-flow-calculator, uncertainty-calculator]
sources:
  - "Traverse closure, the Bowditch (compass) and transit rules, angular misclosure and the shoelace area formula: standard plane surveying, written by fibub from first principles."
  - "Gon: 400 gons to a full circle, by definition."
  - "The example traverse and its errors are made up by fibub for illustration."
flow:
  - { icon: table, label: "Legs" }
  - { icon: compass, label: "Bearings" }
  - { icon: target, label: "Closure" }
  - { icon: ruler, label: "Adjust" }
---

## What it does

A **traverse** is a chain of survey lines: from each station you measure the direction and distance to the next. If the chain comes back to where it started (a **closed loop**), or ends on a point whose coordinates you already know (a **link traverse**), the sum of all the lines should close exactly. It never quite does. The gap is the **misclosure**, and its size compared with the length of the traverse tells you how good the work was.

This tool works out the misclosure and the precision, spreads the error back through the traverse by the Bowditch or transit rule, gives adjusted coordinates and bearings, and finds the area inside a loop. A second card does everyday coordinate geometry: the bearing and distance between two points, and where two bearings or two distances meet.

## How to use it

1. Choose what you measured: **bearings and distances**, or **angles and distances** around a closed loop.
2. Paste or open one leg per row: station name (optional), bearing or angle, distance. Angles can be degrees, minutes and seconds (33 01 48, 33°01′48″ or 33-01-48), decimal degrees, quadrant bearings such as N 45 30 E, or gons.
3. Give the start coordinates (easting and northing). For a link traverse, give the known end. In angle mode, give the azimuth of the first leg.
4. Pick the adjustment rule. Read the results, the plan and the table, and download them as PNG, PDF or Word.

## The settings

- **Angles turned clockwise** at each station are measured from the station behind to the station ahead. Walking anticlockwise round a loop gives interior angles, which should add up to (n − 2) × 180°; walking clockwise gives exterior angles, (n + 2) × 180°. Any angular misclosure is shared equally among the angles before anything else.
- **Bowditch (compass) rule**: each leg's correction is in proportion to its length. It suits traverses where angles and distances are equally good.
- **Transit rule**: eastings and northings are corrected in proportion to each leg's ΔE and ΔN. It suits work where angles are better than distances.
- **Precision** = total length ÷ linear misclosure, written 1 : 10,000 and so on.

## Worked example

The example is made up: a five-station loop starting at E 5000, N 5000, about 945 m round. As bearings and distances, the end misses the start by **0.015 m**, a precision of **1 : 61,500**. The Bowditch rule shares out the error, and the area inside the adjusted loop is **60,622 m² (6.06 ha)**. Switch to angle mode to see the same loop measured as exterior angles: they add up to 1260° 00′ 13″ against 1260°, so 2.6″ comes off each angle.

## Good to know

- This is plane surveying on a flat grid. It applies no grid scale factor, height reduction or earth curvature, which matter on long lines or map projections.
- Least-squares adjustment is the more rigorous method for networks; the Bowditch and transit rules are the classic hand methods for single traverses.
- Required precision depends on the job and the place (for example 1 : 5,000 for rough work, much better for boundary or control surveys). Check the standard that applies to you.

## FAQ

**Can I use feet?** Yes. Pick feet; the area then shows in square feet and acres.

**What if my bearings are quadrant bearings?** Type them as N 45 30 E or S 12°10′ W. They are turned into azimuths for you.

**Why does the plot show an arrow so large?** The misclosure is usually tiny, so it is drawn enlarged (the legend says how many times) to show its direction.
