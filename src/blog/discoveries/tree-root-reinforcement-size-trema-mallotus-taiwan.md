---
title: "Root reinforcement grows fast with tree size: Trema and Mallotus in Taiwan"
summary: "A 2025 Forests study dug up root systems of two pioneer trees on a Taiwan landslide site and modelled how root strength grows with trunk size. See how root cohesion moves a slope's factor of safety."
tools: [infinite-slope, dem-terrain, slope-stability]
updated: 2026-11-10
sources:
  - "Fan C-C, Chen G-T, Song G-Z (2025), Forests 16: 1175, CC BY, the paper described here."
  - "Infinite slope factor of safety with a water table parallel to the slope: standard soil mechanics."
  - "Soil strengths, depths and root cohesion values in the worked example are made up and rounded by fibub."
paper:
  title: "The Role of Tree Size in Root Reinforcement: A Comparative Study of Trema orientalis and Mallotus paniculatus"
  authors: "Fan C-C, Chen G-T, Song G-Z"
  journal: "Forests"
  year: 2025
  doi: "10.3390/f16071175"
  url: "https://doi.org/10.3390/f16071175"
  licence: "CC BY"
  reviewed: true
---

Planting trees on bare, landslide-scarred hillsides is one of the oldest ways to hold soil in place, but how much does each tree actually help, and how quickly does that help grow as the tree does? A team in Taiwan dug out whole root systems of two fast-growing pioneer trees, *Trema orientalis* and *Mallotus paniculatus*, on a slope that slid during Typhoon Morakot in 2009. Their model says root reinforcement climbs steeply with trunk size, and much more steeply for *Trema*. This page explains the study in plain words and shows, with the [[infinite-slope|infinite slope calculator]], why a few kilopascals of root strength can decide whether a shallow soil layer stays put. Find the steep cells on your own terrain first with the [[dem-terrain|DEM slope tool]].

## What they found

- Root reinforcement, worked out as a pulling force per metre (kN/m) at set distances from the trunk, rose sharply with trunk diameter at breast height (DBH).
- At 1 m from the trunk, a tree with a 30 cm trunk gave roughly ten times the reinforcement of a 10 cm tree for *Mallotus*, and around forty times for *Trema*, by the authors' estimates.
- For 10 cm trunks *Mallotus* came out slightly ahead; from about 20 cm on, *Trema* pulls far ahead, and the gap keeps widening up to the 50 cm trunks the model was run for.
- Roots were lopsided between the upslope and downslope sides of a tree, but not in any consistent direction.

## Why it matters

Engineers who plan "bioengineering" on slopes need to know which species to plant and how long before they work. A tree whose reinforcement multiplies as it grows will protect a slope much better in twenty years than in five. The study also gives modellers species-specific numbers for two pioneer trees that move onto disturbed ground, in a region where shallow landslides after typhoons are common.

## How they did it

The site sits at about 850 m above sea level in northeastern Kaohsiung, on shallow colluvium (loose sand and broken slate that has crept downslope). The team pulled single roots, 2 to 18 mm thick, out of the soil to measure how much force each could take: 14 roots of *Mallotus* and 15 of *Trema*. They then excavated the complete root systems of five small trees, with trunks of about 6 to 8 cm, and recorded every root's diameter, number and length.

They fed this into a root bundle model, which adds up how roots break one after another as the soil moves, rather than assuming they all snap at once. A root distribution model, calibrated on the small trees, then predicted root systems for bigger trunks, up to 50 cm. One large *Trema* with a 39 cm trunk was dug out to check the prediction.

## Check it yourself with fibub

The paper does not compute a factor of safety. The infinite slope calculator lets you see what root strength means for a shallow slide, using **root cohesion** c<sub>r</sub>: extra strength, in kPa, added on the slip surface where roots cross it. All numbers below are **made up by fibub** for a teaching example. They are not the paper's data.

Imagine colluvium with no effective cohesion (c′ = 0 kPa), friction angle φ′ = 34°, unit weight 16 kN/m³ above the water table and 19 kN/m³ saturated, on a 38° slope, with a slip surface 0.8 m deep measured vertically.

1. **No roots.** Type c<sub>r</sub> = 0 and pick **Dry**. FS is about **0.86**: the slope is steeper than the friction angle, so loose soil cannot stand without help. The critical slope angle reads 34.0°, the friction angle itself.
2. **Add modest roots.** Set c<sub>r</sub> = 3 kPa. Dry, FS is about **1.35**. Choose **Partly saturated** and type m = 0.5 (water halfway up the soil): FS is about 1.06. The page gives a critical water table ratio of about **0.62**, and fully saturated FS drops to about 0.82.
3. **Stronger roots.** With c<sub>r</sub> = 6 kPa, FS is about 1.83 dry and about 1.23 even when saturated. The page reports that the slope stays above 1 at every water level.
4. **Read the critical depth.** Back at c<sub>r</sub> = 3 kPa and m = 0.5, the critical depth is about 0.93 m. Below that depth, the same roots no longer hold the column, which is why trees help most where the soil is thin.
5. **Look at the charts.** The FS against slope chart shows the dry, your-m and saturated curves; with cohesion the curves dip below 1 and can rise again at extreme angles, a quirk of the model.

How do you get from kN/m to kPa? One rough way (our assumption, not the paper's) is to spread a lateral force per metre over the depth of the root zone: 1 kN/m over 0.3 m is about 3.3 kPa. The infinite slope model has no sides, though, so this only gives a feel. For curved, deeper slips, try [[slope-stability|slope stability by Bishop's method]].

## The fine print

- Only five root systems were excavated, all from small trees, and the large-tree results come from extrapolation. The one validation tree showed some mismatch.
- A single set of calibration values was used for all distances from the trunk, although the fitted values changed with distance.
- The work is from one site and one soil; root growth depends on soil, water and climate.
- The paper reports reinforcement as force per metre, not as a cohesion for slope models, so converting it needs care.
- The infinite slope calculator is for study. Real slopes need a site investigation and a qualified engineer or engineering geologist.
