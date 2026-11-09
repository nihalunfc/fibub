---
name: Infinite slope factor of safety
num: 891
shelf: science
section: geomorphology
title: "Infinite slope factor of safety calculator: landslide FS with water table, cohesion and root cohesion (free)"
summary: "Work out the infinite slope factor of safety for a shallow landslide, dry, partly saturated or saturated with seepage parallel to the slope, with cohesion and root cohesion. Get the critical slope angle, water table and depth, and see FS plotted against slope and water. For study, not a slope stability assessment."
status: live
ads: true
order: 891
icon: mountain
works: offline
updated: 2026-11-09
related: [apparent-dip, slope-stability, dem-terrain, soil-classification, snow-slope-tools, atterberg-compaction]
sources:
  - "Formula: the standard infinite slope model with a water table parallel to the slope (as in soil mechanics and geomorphology textbooks)."
  - "Example soil and slope values: made up and rounded by fibub."
flow:
  - { icon: mountain, label: "Slope, soil" }
  - { icon: sliders, label: "Water m" }
  - { icon: calculator, label: "FS" }
  - { icon: chart, label: "Sensitivity" }
---

## What it does

The infinite slope model is the classic first look at shallow landslides: a layer of soil sliding on a surface parallel to the ground, much longer than it is deep. This calculator gives its **factor of safety (FS)**, the strength of the soil on the slip surface divided by the shear stress pulling it downhill. Above 1 the model slope stands; below 1 it slides. It handles **dry** soil, a **water table at any height** above the slip surface with water seeping parallel to the slope, and soil **saturated to the surface**, with **effective cohesion** and **root cohesion**.

**For study, not a slope stability assessment.** Real slopes need site investigation, laboratory strength tests and a qualified engineer or engineering geologist.

Find the steepest slopes on a map with the [[dem-terrain|DEM slope tool]], and for deeper, curved slips use [[slope-stability|slope stability by Bishop's method]].

## How to use it

1. Type the **slope angle** and the **depth of the slip surface**, measured vertically or square to the slope.
2. Type the soil's **effective cohesion c′**, **root cohesion c<sub>r</sub>** (the extra strength from roots crossing the slip surface; 0 below the roots) and **friction angle φ′**.
3. Type the **unit weights**: above the water table, saturated, and of water (9.81 kN/m³ for fresh water).
4. Pick the **water** condition. For partly saturated soil, type **m**: the height of the water table above the slip surface divided by the depth, from 0 (dry) to 1 (water at the ground).
5. Read FS, the stresses, and the **critical** slope angle, water table ratio and depth, then look at the two charts.

## The formula

FS = [c′ + c<sub>r</sub> + ((1 − m)γ + m(γ<sub>sat</sub> − γ<sub>w</sub>)) z cos²β tan φ′] / [((1 − m)γ + m γ<sub>sat</sub>) z sin β cos β]

Without cohesion and dry this is just tan φ′ / tan β, so the critical slope angle equals the friction angle. Saturated with seepage parallel to the slope, the friction part is cut by about half (γ′/γ<sub>sat</sub>). With cohesion, FS also depends on depth: thin soils on steep slopes can stand because cohesion is a larger share of the strength.

## Worked example

The made-up example: a 32° slope, a slip surface 2 m deep, c′ = 3 kPa, root cohesion 2 kPa, φ′ = 32°, γ = 17 and γ<sub>sat</sub> = 20 kN/m³, and the water table 0.4 of the way up (m = 0.4). The page gives **FS = 1.09**. Dry the same slope has FS 1.33; saturated, 0.79. FS reaches 1 when m rises to **0.567**, when the slope steepens to **34.7°**, or when the slip surface is **2.84 m** deep.

## Tips

- The FS against m chart shows how much a wet season matters; the FS against slope chart compares dry, your m, and saturated.
- Root cohesion only helps where roots reach the slip surface. On deep slides it is close to zero.
- Results are only as good as the strength values; small changes in φ′ move FS a lot.

## Frequently asked questions

**Why does FS go up again on very steep slopes?** With cohesion, the model's soil column carries less weight per area of slip surface as the slope steepens, so cohesion is a larger share. Real steep slopes rarely keep a thick soil.

**Why "seepage parallel to the slope"?** It is the usual assumption for a water table parallel to the ground; it sets the pore pressure on the slip surface to γ<sub>w</sub> m z cos²β.

**Is anything sent anywhere?** No. Everything runs in your browser and nothing leaves your device.
