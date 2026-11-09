---
name: Anthropometric indices
num: 762
shelf: science
section: anthropology
title: "Anthropometric index calculator: BMI, cephalic, nasal, Cormic, intermembral and crural index (free)"
summary: "Body and skeletal indices from your measurements: BMI, waist-to-hip and waist-to-height ratios, cephalic and nasal index, Cormic and skelic index, and the intermembral, brachial, crural and humerofemoral indices. One person or a whole table, with summary statistics."
status: live
ads: false
order: 762
icon: ruler
works: offline
updated: 2026-11-09
related: [data-cleaner, plot-maker, sample-size, body-measures, reference-interval, body-mass-estimator, field-note-organiser, hypothesis-tests]
sources:
  - "Formulas: standard anthropometric and osteometric ratios as given in introductory physical anthropology texts. BMI bands for adults as published by the World Health Organization (general knowledge)."
  - "Example data: made up."
flow:
  - { icon: ruler, label: "Measure" }
  - { icon: calculator, label: "Indices" }
  - { icon: table, label: "Summary" }
  - { icon: download, label: "Report" }
---

## What it does

Physical anthropologists, human biologists and osteology students describe body and skeleton shape with simple ratios of two measurements. This page works out the common ones, shows the formula for each, and handles one person (or skeleton) at a time or a whole table:

| Index | Formula |
|---|---|
| Body mass index (BMI) | weight (kg) ÷ height (m)² |
| Waist-to-hip ratio | waist ÷ hip |
| Waist-to-height ratio | waist ÷ height |
| Cephalic index | 100 × head breadth ÷ head length |
| Nasal index | 100 × nasal breadth ÷ nasal height |
| Cormic index (relative sitting height) | 100 × sitting height ÷ stature |
| Skelic index (Manouvrier) | 100 × (stature − sitting height) ÷ sitting height |
| Intermembral index | 100 × (humerus + radius) ÷ (femur + tibia) |
| Brachial index | 100 × radius ÷ humerus |
| Crural index | 100 × tibia ÷ femur |
| Humerofemoral index | 100 × humerus ÷ femur |

Class names are given only where they are standard textbook knowledge: the adult **BMI** bands (below 18.5 underweight, 18.5 to 24.9 healthy weight range, 25 to 29.9 overweight, 30 and above obesity) and the three classic **cephalic index** bands (below 75 dolichocephalic, 75 to 79.9 mesocephalic, 80 and above brachycephalic). Other indices are shown as plain values, because their older class names and cut-offs differ from book to book.

This page is for study and teaching. It is **not a medical or growth assessment**: it has no growth charts or z-scores for children, and BMI bands apply to adults only.

Compare against clinical cut-offs with the [[body-measures|body measures calculator]], and test differences between groups with [[hypothesis-tests|hypothesis tests]].

## How to use it

1. **One person or skeleton:** type the measurements you have. Each index appears as soon as both (or all four) of its measurements are filled in. Lengths for the head and face are in mm, body measurements in cm and weight in kg. Long bones can be in any unit, as long as all four use the same one.
2. **A table (batch):** paste or open a CSV, TSV or Excel file with one row per person and a header row. Columns are recognised by name (Weight (kg), Height or Stature, Waist, Hip, Head length, Head breadth, Nasal height, Nasal breadth, Sitting height, Humerus, Radius, Femur, Tibia); the page lists how it read each column. A text column such as an ID labels the rows. Blank cells are fine.
3. The batch result gives each index's n, mean, standard deviation, minimum, quartiles, median and maximum, the counts in each BMI and cephalic class, and every row's values. Download the rows as CSV, or everything as an image, PDF or Word file.

## Worked example

The one-person example is made up: 68 kg, 172 cm, waist 81 cm, hip 96 cm, sitting height 90 cm, head 190 × 150 mm and nose 52 × 36 mm. It gives BMI 23.0 (healthy weight range), waist-to-hip 0.84, waist-to-height 0.47, cephalic index 78.9 (mesocephalic), nasal index 69.2, Cormic index 52.3 and skelic index 91.1.

The batch example is 12 made-up adults (one waist left blank). Their mean BMI is 22.75 (SD 3.14) and mean cephalic index 78.71.

## Tips

- Measure twice and use the mean; small errors in short lengths such as nasal breadth change the index a lot.
- The Cormic and skelic index describe the same thing (trunk against leg length) from two sides.
- The intermembral, brachial and crural indices are widely used in primate and fossil comparisons. Use maximum lengths and the same side of the body.

## A note on history

Indices such as the cephalic and nasal index were once used to sort people into supposed races. That work is discredited: these indices vary within every population, change with growth, health and even cradle-boarding, and say nothing about ancestry, intelligence or worth. Today they are used to describe shape, for example in clinical head-shape assessment, forensic work and comparative anatomy.

## FAQ

**Is my data sent anywhere?** No. All calculations run in this page and nothing is saved; close the page and the numbers are gone.

**Can I use inches and pounds?** Not for BMI, which needs kg and cm here. The other ratios work in any unit as long as both measurements use the same one.
