---
name: Retaining wall stability
num: 653
shelf: science
section: civil-and-structural-engineering
title: "Retaining wall stability calculator: sliding, overturning and bearing with Rankine or Coulomb earth pressure"
summary: "Check a cantilever or gravity retaining wall for sliding, overturning and bearing: Rankine or Coulomb active pressure, sloping backfill, surcharge, water and uplift, optional passive resistance, eccentricity and toe and heel pressures, with a drawing of the wall, the earth pressure and the bearing pressure."
status: live
ads: true
order: 653
icon: mountain
works: offline
updated: 2026-11-09
related: [column-buckling, load-combination-helper, concrete-mix-design, darcy-flow-calculator, rebar-calculator, soil-classification, bearing-capacity, slope-stability, atterberg-compaction]
sources:
  - "Rankine active and passive earth pressure (including sloping backfill), Coulomb active pressure with wall friction, and the sliding, overturning and bearing (middle-third) checks: standard soil mechanics and foundation engineering, for example Craig's Soil Mechanics, and Das, B. M., Principles of Foundation Engineering (formulas and methods only)."
  - "No design-code tables or factors are used. Soil properties, base friction, allowable bearing pressure and target factors of safety are user inputs; the starting values and both example walls are made up."
  - "Checked against an independent Python calculation written for the tests: Coulomb coefficients by trial-wedge maximisation (scipy.optimize), pressures integrated with scipy.integrate.quad, and weights and lever arms from polygon areas and centroids."
flow:
  - { icon: ruler, label: "Wall" }
  - { icon: mountain, label: "Backfill" }
  - { icon: calculator, label: "Forces" }
  - { icon: check, label: "Checks" }
---

## What it does

A retaining wall holds back soil. Before sizing the concrete and steel, an engineer checks that the wall as a whole is **stable**: that the soil pushing on it cannot slide it forward, tip it over, or press its base into the ground harder than the ground can take. This calculator does those three checks for one metre run of a cantilever or gravity wall:

- **Earth pressure** on the back by **Rankine** (allowing a sloping backfill) or **Coulomb** (allowing friction between wall and soil), calculated on a vertical plane through the end of the heel. The soil above the heel then moves with the wall and adds to its weight.
- A uniform **surcharge** (traffic, a stockpile, a building) on the backfill, and **water** behind the wall, with the soil below the water at its submerged weight plus full water pressure, and **uplift** under the base if you tick it.
- **Sliding**: friction on the base, μ × the downward force, plus passive resistance in front if you choose to count it, divided by the horizontal push.
- **Overturning**: the moments that hold the wall down about the toe, divided by the moments that tip it.
- **Bearing**: where the resultant meets the base (the **eccentricity** e), and the soil pressure under the toe and heel. Within the middle third (e ≤ B/6) the whole base presses on the soil; outside it, only part does, and the toe pressure rises fast.

For study and planning, not a substitute for professional judgement. Check your local code and a qualified engineer. This tool does not design the stem or base for bending, and does not check the overall stability of the slope.

Classify the backfill with the [[soil-classification|soil classification tool]], and check the ground under the footing with the [[bearing-capacity|bearing capacity calculator]].

## How to use it

1. Type the **wall geometry**: total height from the underside of the base, stem thickness at top and bottom, base thickness, toe and heel lengths. For a **gravity wall**, set the base, toe and heel to 0 and give the top and bottom widths. The example menu fills in two made-up walls.
2. Type the **backfill**: unit weight, saturated unit weight, friction angle φ and slope β. Choose Rankine or Coulomb; for Coulomb give the wall friction δ.
3. Add any **surcharge** and the **water** height above the underside of the base.
4. Type the **base friction coefficient** μ, the **soil depth in front** of the wall, the **allowable bearing pressure** and your **target factors**, all from your soil report and code.

## Worked example

The made-up cantilever wall the page opens with is 4 m high with a 0.3 m stem (0.4 m at the bottom), a 0.5 m base, a 0.8 m toe and a 1.8 m heel (B = 3 m), in concrete at 24 kN/m³. The backfill is level, 18 kN/m³, φ = 32°, with a 10 kPa surcharge, dry.

- Rankine Ka = (1 − sin 32°) / (1 + sin 32°) = **0.3073**. Earth thrust ½ × 0.3073 × 18 × 4² = 44.25 kN at 1.33 m; surcharge thrust 0.3073 × 10 × 4 = 12.29 kN at 2 m; 56.54 kN in all.
- The wall and the soil over the heel weigh 178.8 kN, so sliding gives 0.5 × 178.8 ÷ 56.54 = **1.58**.
- Resisting moment 322.2 kN·m, overturning moment 83.57 kN·m: overturning factor **3.86**.
- With the 18 kN surcharge on the heel, R = 196.8 kN acts 1.405 m from the toe, so e = 0.095 m, inside B/6 = 0.5 m. Toe pressure **78.1 kPa**, heel 53.1 kPa.

## FAQ

**Rankine or Coulomb?** Rankine ignores friction on the wall and is the usual choice for a cantilever wall checked on the plane through the heel. Coulomb allows wall friction δ, which lowers the push and tilts it downward; it suits gravity walls where the soil bears on the wall itself.

**Why is the surcharge on the heel only used for bearing?** It pushes the wall down and helps against sliding and overturning, but it may not always be there, so it is safer to leave it out of those checks while keeping it in the bearing pressure.

**What about clay backfill?** This tool is for free-draining, cohesionless backfill. Clay backfills swell and creep and need other methods.
