---
name: Soil classification
num: 655
shelf: science
code: T452
section: geotechnical-engineering
title: "Soil classification"
summary: "Classify a soil from lab data. Paste a grading curve or type the key percentages, add the liquid and plastic limits, and get the USCS group symbol and name with every step explained, the AASHTO group and group index, D10, D30, D60, Cu and Cc, a grading curve and a plasticity chart."
status: live
ads: true
order: 655
icon: mountain
works: offline
updated: 2026-11-09
related: [darcy-flow-calculator, graph-digitizer, atterberg-compaction, bearing-capacity, grain-size-stats, soil-texture-triangle, consolidation-settlement]
sources:
  - "Unified Soil Classification System decision logic (as in ASTM D2487) and the AASHTO system (as in AASHTO M 145): group boundaries and the group index formula GI = (F − 35)[0.2 + 0.005(LL − 40)] + 0.01(F − 15)(PI − 10), written out by fibub in its own words; no tables or figures are copied. Check the current standards."
  - "Casagrande's plasticity chart lines: A-line PI = 0.73 (LL − 20) and U-line PI = 0.9 (LL − 8), general soil mechanics."
  - "D10, D30, D60 by interpolation on a log size scale; Cu = D60/D10 and Cc = D30²/(D10·D60): standard definitions."
  - "Example data are made up by fibub for illustration."
flow:
  - { icon: chart, label: "Grading" }
  - { icon: flask, label: "Limits" }
  - { icon: check, label: "USCS" }
  - { icon: table, label: "AASHTO" }
---

## What it does

Engineers sort soils into groups so that a two- or three-letter code tells you how the ground will behave: whether it drains, how strong it is when wet, and whether it will make a good road base. This page does the two systems most people meet:

- **USCS** (the Unified Soil Classification System, used for foundations, dams and most site investigation reports) gives a **group symbol** such as SW, SC, CL or GP-GM and a **group name** such as "clayey sand with gravel". The page shows each decision on the way, so you can follow and check it.
- **AASHTO** (used for roads and highway subgrades) gives a **group** from A-1-a to A-7-6 and a **group index**, a number that ranks subgrade quality within a group (0 is best).

It also works out **D10, D30 and D60**, the **coefficient of uniformity Cu** and the **coefficient of curvature Cc**, and draws the **grading curve** and the **plasticity chart** with the A-line and U-line.

Work out the liquid and plastic limits first with the [[atterberg-compaction|Atterberg limits tool]], then use the class to choose soil values for the [[bearing-capacity|bearing capacity calculator]].

## How to use it

1. In **Grading**, paste or open your sieve (and hydrometer) results: size in mm, then percent passing. The page reads the percent passing 4.75 mm, 2 mm, 0.425 mm and 0.075 mm, and D10, D30 and D60, by drawing straight lines between your points on a log size scale. If you only have the key percentages, switch to **typed percentages** and add D10, D30 and D60 if fines are below 12 %.
2. In **Plasticity**, type the liquid limit and plastic limit, or tick **Non-plastic** for clean sand and gravel. If you tested an oven-dried sample too, type its liquid limit: for a fine-grained soil a ratio below 0.75 means organic soil (OL or OH).
3. Read the result: the USCS symbol and name, each step that led there, the AASHTO group and the group index sum written out. Download the results as CSV, or the whole report as an image, PDF or Word file.

## What each part means

- **Gravel, sand, fines**: the parts coarser than 4.75 mm, between 4.75 and 0.075 mm, and finer than 0.075 mm.
- **Cu = D60/D10**: how spread out the sizes are. **Cc = D30²/(D10·D60)**: the shape of the curve. A gravel is well graded when Cu ≥ 4 and Cc is 1 to 3; a sand needs Cu ≥ 6.
- **PI = LL − PL**: the range of water content over which the soil is plastic. Clays plot above the A-line, silts below it.
- With 5 to 12 % fines, USCS uses a **dual symbol** such as SP-SM: the grading, then whether the fines are silty or clayey.

## Worked example

The made-up example curve has 18 % gravel, 58 % sand and 24 % fines, with LL = 34 and PL = 19, so PI = 15. The page shows **USCS SC, AASHTO A-2-6 (0)**: a clayey sand with gravel. Fines are below 50 %, so the soil is coarse-grained; sand is the larger coarse part, so S; the fines plot above the A-line (10.2 at LL 34) with PI above 7, so they are lean clay and the symbol is SC; gravel is 15 % or more, so "with gravel" is added. For AASHTO, 24 % passing 0.075 mm makes it granular, it fails the A-1 and A-3 tests, and LL 34 with PI 15 gives A-2-6. Only the PI part of the group index counts for A-2-6: 0.01 × (24 − 15) × (15 − 10) = 0.45, reported as 0.

## Tips

- The plasticity chart point should sit below the U-line. If it is above, check the limits: natural soils almost never plot there.
- If your curve does not reach 10 % passing, D10 cannot be read; with less than 12 % fines you then need a finer sieve or a hydrometer test.
- This page gives the group, not a design value. For study and planning; check the current standard and a qualified engineer.

## FAQ

**Why can my USCS and AASHTO groups look so different?** They were built for different jobs. USCS splits gravel from sand at 4.75 mm and fines at 0.075 mm with a 50 % rule; AASHTO calls a soil granular only when 35 % or less passes 0.075 mm, and judges it as road subgrade.

**What about peat?** Highly organic soils (Pt) are identified by eye and smell, not by these tests, so the page does not assign Pt.

**Why is the group index rounded?** The standard reports it as a whole number, and any negative value as 0. The unrounded value is in the CSV.
