---
name: Rock mass classification (Q, RMR, RQD)
num: 514
shelf: science
section: mining-and-economic-geology
title: "Rock mass classification calculator: RQD from core, Q-system, RMR sum, RMR–Q correlation and GSI estimate"
summary: "Work out RQD from core piece lengths (Deere), Barton's Q = (RQD/Jn)(Jr/Ja)(Jw/SRF) and Bieniawski's RMR as a sum of the ratings you read from the published tables, then compare them with an editable RMR = A ln Q + B correlation and get GSI estimates. Arithmetic only: no rating tables are bundled."
status: live
ads: true
order: 514
icon: mountain
works: offline
updated: 2026-11-09
related: [drill-hole-composites, stereonet, infinite-slope, slope-stability, phone-clinometer, bearing-capacity, grade-tonnage-calculator]
sources:
  - "Deere (1964), Deere and Deere (1988): rock quality designation, RQD = sum of sound core pieces 10 cm or longer ÷ run length × 100 (definition only)."
  - "Barton, Lien and Lunde (1974), Engineering classification of rock masses for the design of tunnel support, Rock Mechanics 6: the Q formula (the rating tables are not reproduced; use the published tables)."
  - "Bieniawski (1989), Engineering Rock Mass Classifications, Wiley: RMR as the sum of five ratings and an orientation adjustment (tables not reproduced). Bieniawski (1976) for the correlation RMR = 9 ln Q + 44."
  - "Hoek, Kaiser and Bawden (1995), Support of Underground Excavations in Hard Rock: GSI ≈ RMR89′ − 5 and GSI ≈ 9 ln Q′ + 44."
  - "Example core run and ratings made up by fibub."
flow:
  - { icon: ruler, label: "Core pieces" }
  - { icon: calculator, label: "Q and RMR" }
  - { icon: curve, label: "Correlate" }
  - { icon: download, label: "Report" }
---

## What it does

Rock mass classifications put numbers on how blocky, rough, weathered, wet and stressed a rock mass is. This page does the arithmetic for the three most used ones, with **ratings that you read from the published tables**:

- **RQD from a core run** (Deere): type the run length and the lengths of the core pieces in order. The page adds up the sound pieces 10 cm or longer (you can change the cut-off), gives RQD as a percentage of the run, the core recovery, and a drawing of the run with counted pieces dark, short ones light and lost core dashed.
- **Q-system** (Barton and others): Q = (RQD/J<sub>n</sub>) × (J<sub>r</sub>/J<sub>a</sub>) × (J<sub>w</sub>/SRF). The three quotients stand for relative block size, shear strength between blocks and active stress. RQD can come from the core run or be typed; below 10 it is taken as 10, as Barton advises (you can switch that off). Q′ (without the water and stress terms) is shown too.
- **RMR** (Bieniawski 1989): the sum of five ratings (intact rock strength, RQD, joint spacing, joint condition, groundwater) plus an orientation adjustment that is zero or negative.
- **Correlation and GSI**: RMR = A ln Q + B with A and B you can change (Bieniawski's 9 and 44 to start), both ways, with a chart; GSI ≈ RMR89 with dry groundwater − 5, and GSI ≈ A ln Q′ + B.

**The rating tables are not included.** Each input has a one-line reminder of what it describes; take the value from the original papers or a rock mechanics textbook. This page is arithmetic, not a design.

Measure joint orientations with the [[phone-clinometer|phone clinometer]] and plot them on the [[stereonet|stereonet]], then check a cut with the [[slope-stability|slope stability tool]].

## How to use it

1. Type the core run length and the piece lengths (commas, spaces or new lines). Measure along the centre line and leave out breaks made by drilling.
2. Type J<sub>n</sub>, J<sub>r</sub>, J<sub>a</sub>, J<sub>w</sub> and SRF from the Q tables.
3. Type the five RMR ratings and the orientation adjustment from the RMR tables.
4. Compare: if RMR and Q disagree a lot, recheck the ratings, or fit your own A and B for the site.
5. Download a CSV of the results, or a PNG, PDF or Word report.

## Worked example (made-up numbers)

A 150 cm run with pieces 25, 8, 12, 4, 30, 6, 18, 9, 11, 3 and 14 cm: six pieces are 10 cm or longer, 110 cm in all, so **RQD = 73.3 %**; the 140 cm of core is a 93.3 % recovery.

With J<sub>n</sub> = 9, J<sub>r</sub> = 1.5, J<sub>a</sub> = 2, J<sub>w</sub> = 1 and SRF = 1: RQD/J<sub>n</sub> = 8.15, J<sub>r</sub>/J<sub>a</sub> = 0.75, J<sub>w</sub>/SRF = 1, so **Q = 6.11**.

Made-up RMR ratings 7 + 13 + 10 + 20 + 10 = 60, with a −5 orientation adjustment: **RMR = 55**. The correlation gives RMR 60.3 from Q (5.3 more than measured) and Q 3.39 from RMR. GSI from RMR89 (groundwater set to 15, dry) is 60, and from Q′ about 60.3.

## Tips

- Log RQD for each run, not each hole: one average hides weak zones.
- Q spans about 0.001 to 1000, so compare it on a log scale.
- The RMR–Q correlations scatter widely; treat them as a check, not a conversion.

## FAQ

**Why are there no rating tables?** The tables belong to their authors' publications; please use them from the source. The page checks only simple limits (RQD 0 to 100 %, J<sub>w</sub> at most 1, RMR at most 100).

**Can I use RQD from a scanline or Jv?** Yes: switch "RQD from" to a typed value.
