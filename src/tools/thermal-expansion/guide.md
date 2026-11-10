---
name: Thermal expansion
num: 1347
shelf: learn
section: school-physics
title: "Thermal expansion"
summary: "Warm a railway track or a bridge and watch the gaps between the pieces shrink, then close and make the rail bow. See ΔL = α L ΔT with your numbers, the gap to leave, and at Class 11 the stress in a welded rail and how area and volume grow."
status: live
ads: false
order: 1347
icon: ruler
works: offline
updated: 2026-11-09
related: [temperature-scales, heating-curve, stress-strain-analyser, thermal-mismatch-stress]
sources:
  - "Linear expansion ΔL = α L ΔT, area β ≈ 2α and volume γ ≈ 3α, thermal stress σ = Y α ΔT: standard physics."
  - "Expansion coefficients (steel and concrete about 12×10⁻⁶ /°C, aluminium 23×10⁻⁶, copper 17×10⁻⁶, brass 19×10⁻⁶, ordinary glass 9×10⁻⁶, invar about 1.2×10⁻⁶) and Young's moduli are rounded typical values for teaching, not data for design."
  - "A rail cross-section of about 77 cm² is a rounded illustrative size."
  - "Checked against an independent Python calculation, including an exact circular-arc solution for the bowed rail."
flow:
  - { icon: sliders, label: "Warm it" }
  - { icon: ruler, label: "Gap shrinks" }
  - { icon: calculator, label: "ΔL = αLΔT" }
  - { icon: check, label: "Check" }
---

## What it does

Most solids grow a little when they warm. A 13 m steel rail grows only a few millimetres on a hot afternoon, but if there is no room for those millimetres the rail pushes on its neighbour with a huge force and the track can bend out of line. That is why old railway tracks have small gaps between rails and why bridges have joints at their ends.

This page shows three lengths of rail (or two spans of a bridge) with gaps between them. Slide the **temperature** up and the pieces grow and the gaps shrink, with the change in length worked out as **ΔL = α L ΔT** using your numbers. Keep warming and the gap closes: the page tells you the temperature at which that happens, and shows the rail bowing. At **Class 11** it also works out the **stress** in a welded rail that is not allowed to grow, σ = Y α ΔT, and shows that a sheet's area grows by about 2αΔT and a block's volume by about 3αΔT.

It serves Class 7 and 8 Science (heat: expansion of solids) and Class 11 Physics, Thermal Properties of Matter (thermal expansion, coefficients of linear, area and volume expansion) with a link to Mechanical Properties of Solids (stress and Young's modulus). Start with [[temperature-scales]] if the scales are new, and go on to [[stress-strain-analyser]] for stress and strain in general.

## How to use it

1. **Level**: *Class 8–10* shows the gaps and ΔL. *Class 11* adds the welded-rail stress and the area and volume card.
2. Choose **Railway track** (13 m steel rails to start) or **Bridge** (40 m concrete spans).
3. **Temperature now** is the temperature of the metal. **Laid at** is the temperature when the gap was set.
4. **Length of each piece** and **Gap left when laid** set the size of the job.
5. **Material** changes α, the fraction by which the material grows per degree. Values are rounded typical ones.

The picture is not to scale: the pieces are drawn short and the gaps magnified so that millimetres can be seen.

## Worked example

As the page opens: steel rails 13 m long, laid at 20 °C with a 5 mm gap, now at 45 °C.

ΔL = 12×10⁻⁶ /°C × 13 m × 25 °C = **3.9 mm**, so the gap left is 5 − 3.9 = **1.1 mm**. The gap closes when α L ΔT = 5 mm, at ΔT = 0.005 / (12×10⁻⁶ × 13) = 32.05 °C, so at **52.05 °C**. To survive 50 °C the gap must be at least 12×10⁻⁶ × 13 × 30 = **4.68 mm**.

Class 11: a welded steel rail (Y = 200 GPa) warmed by 25 °C has stress 200×10⁹ × 12×10⁻⁶ × 25 = **60 MPa**. On a rail of about 77 cm² that is a push of about **462 kN**, the weight of some 47 tonnes.

## Check yourself

Five fresh questions: the growth of a rail, the gap for a bridge joint, the new length of a rod, the stress in a welded rail, and a question on materials or area expansion. Answers are checked on the page and the working is shown. Nothing is saved.

## Tips

- ΔL is proportional to the length: a 100 m bridge grows ten times as much as a 10 m one.
- α is tiny (millionths per degree), so write it as 12 × 10⁻⁶ /°C and keep the powers of ten straight.
- A change of 1 °C is a change of 1 K, so α per °C and per K are the same number.

## FAQ

**Why do modern railways have no gaps?** Long welded rails are laid at a chosen "neutral" temperature and clamped to heavy sleepers. They are not allowed to grow, so they carry the thermal stress instead. On very hot days tracks are watched for buckling.

**Why is the bowing so large?** Fixed ends turn a tiny extra length into a much larger sideways bend: a 13 m rail only 1 mm too long would rise by about 7 cm if it bent into an arc.

**Does anything shrink when it warms?** Water between 0 °C and 4 °C does, which is why ice forms on top of ponds.
