---
name: Tree basal area
num: 334
shelf: science
code: T249
section: forestry
title: "Tree basal area"
summary: "Work out a tree's height from clinometer readings in degrees or percent, on level or sloping ground, by the tangent method or the laser sine method. Then get basal area from trunk diameters: for one tree, per hectare or acre from a fixed-area plot, or from a prism (angle-gauge) sweep with any basal area factor."
status: live
ads: true
order: 334
icon: ruler
works: offline
updated: 2026-11-09
related: [tree-carbon, biodiversity-indices, field-sampling-planner, forest-inventory-summary, log-scale-calculator, canopy-gap-analyser, quadrat-transect-analyser]
sources:
  - "Tangent and sine height methods, basal area (π·DBH²/4, 0.005454·DBH² ft²), fixed-area plot expansion and Bitterlich angle-count (prism) sampling with basal area factors and tree factors: standard forest mensuration, as in Husch, Beers and Kershaw, Forest Mensuration, and Avery and Burkhart, Forest Measurements. Sine method: M. J. Larjavaara and H. C. Muller-Landau (2013), Methods in Ecology and Evolution 4: 793-801. Method only; no tables copied."
  - "Checked in the tests against an independent NumPy calculation. The example readings, trees and prism counts are made up."
flow:
  - { icon: compass, label: "Angles" }
  - { icon: ruler, label: "Height" }
  - { icon: target, label: "DBH" }
  - { icon: calculator, label: "Basal area" }
---

## What it does

Two everyday forest measurements in one place.

**Tree height.** A clinometer measures the angle from your eye to the top and to the base of the tree. With the distance to the trunk, simple trigonometry gives the height:

- **Tangent method**: height = horizontal distance × (tan of the top reading − tan of the base reading). Readings below eye level are negative, so the part of the tree below your eye is added. If you taped the distance along a slope, give the slope reading to the trunk; the tool turns the slope distance into a horizontal one (× cos of the slope).
- **Level ground with eye height**: on flat ground you can skip the base reading and add your eye height instead.
- **Sine method**: with a laser rangefinder, measure the straight-line distance and angle to the top and to the base. Height = distance to top × sin(top angle) − distance to base × sin(base angle). No horizontal distance is assumed, so it copes with slopes and with tops that are not straight above the base (leaning trees, wide crowns), which make the tangent method overestimate.

**Basal area** is the cross-section of the trunk at breast height (1.3 m, or 4.5 ft): π × DBH² / 4. Added up and scaled to one hectare (or acre), it is the standard measure of how stocked a stand is. The tool gives it:

- for **one tree**;
- for a **fixed-area plot**: all the trees' basal areas, times 10,000 ÷ plot area in m² (or 43,560 ÷ plot area in ft²), plus stems per hectare and the quadratic mean diameter;
- from a **prism or angle-gauge sweep** (Bitterlich sampling): each tree counted "in" stands for one basal area factor (BAF) of basal area per hectare, whatever its size. With several points you also get the standard error.

Add up a whole plot's trees in the [[forest-inventory-summary]], and turn tree sizes into stored carbon with the [[tree-carbon|tree carbon calculator]].

## How to use it

1. Choose **units** (metric or imperial) and whether your clinometer reads in **degrees or percent** (100 % = 45°).
2. **Height**: pick the method and type your readings. Above eye level is positive, below is negative.
3. **Basal area**: pick one tree, a plot or a prism sweep. For a plot, paste or open the DBH list and give the plot area or the radius of a circular plot. For a prism, give the BAF and one row per point with the number of trees counted in (borderline trees count as half), or the DBH of each in tree to also get stems per hectare from their tree factors (BAF ÷ the tree's basal area).
4. The **borderline check** gives the limiting distance for a tree of a given DBH: if its centre is nearer than this, it is in.

## Worked example (made-up readings)

Standing **20 m** from the trunk on level ground, the top reads **52°** and the base **−4°**. Height = 20 × (tan 52° − tan(−4°)) = 20 × (1.2799 + 0.0699) = **27.0 m**: 25.6 m above eye level and 1.4 m below. In percent the same readings are about 128 % and −7 %.

A 400 m² plot holds ten trees from 9.8 to 40.2 cm DBH. Their basal areas add to 0.4241 m², so basal area is **10.6 m²/ha**, with **250 stems per hectare** and a quadratic mean diameter of **23.2 cm**.

A prism with BAF 2 m²/ha at five points counts 7, 9.5, 6, 11 and 8 trees in. Basal area is 2 × 8.3 = **16.6 m²/ha**, standard error ± 1.78 m²/ha. A 30 cm tree is in if it stands within **10.6 m** of the point.

## Tips

- Stand about one to one-and-a-half tree heights away, where you can see both the top and the base; very steep top angles magnify small errors.
- For broad-crowned trees the "top" you see from the side is often in front of the stem, so the tangent method reads too high. The sine method avoids this.
- Measure DBH at 1.3 m on the uphill side, and check borderline prism trees with the limiting distance rather than guessing.

## FAQs

**Which BAF should I use?** One that counts roughly 5 to 12 trees per point in your stand. Common metric factors are 1, 2 and 4 m²/ha; imperial factors 10, 20 and 40 ft²/acre.

**Why count borderline trees as half?** On average, half of the trees that look exactly borderline are really in. Measuring the distance with the borderline check is better.

**Is my data uploaded?** No. Everything runs in your browser.
