---
name: Slope stability
num: 658
shelf: science
code: T455
section: geotechnical-engineering
title: "Slope stability"
summary: "Factor of safety of a simple soil slope on circular slip surfaces by Bishop's simplified method (iterated) and the ordinary method of slices, with one or two soil layers, a pore pressure ratio ru or a water table, a grid search for the critical circle, a drawing and a slice table."
status: live
ads: true
order: 658
icon: mountain
works: offline
updated: 2026-11-09
related: [bearing-capacity, soil-classification, stereonet, infinite-slope, retaining-wall-check, rock-mass-classification, atterberg-compaction]
sources:
  - "Method of slices for circular slip surfaces: Bishop's simplified method (Bishop 1955), FS = Σ[c′b + (W − ub)tan φ′]/m(α) ÷ ΣW sin α with m(α) = cos α + sin α tan φ′/FS, and the ordinary (Fellenius) method: general soil mechanics, written by fibub from the equations."
  - "Pore pressure ratio ru = u/(γh): Bishop and Morgenstern's definition, general soil mechanics."
  - "Example values are made up by fibub for illustration."
flow:
  - { icon: mountain, label: "Slope" }
  - { icon: flask, label: "Soil, water" }
  - { icon: target, label: "Circles" }
  - { icon: check, label: "FS" }
---

## What it does

A soil slope fails by sliding along a curved surface. This page treats that surface as a **circle**, cuts the soil above it into vertical **slices**, and compares the moment that resists sliding with the moment that drives it. The ratio is the **factor of safety (FS)**: below 1 the slope fails.

- **Bishop's simplified method** allows for the side forces between slices (horizontal only), so FS appears on both sides of its equation. The page iterates until the answer stops changing.
- **The ordinary method of slices** (Fellenius) ignores the side forces. It is simpler and usually gives a lower, more cautious FS, especially with high pore pressures.
- A **grid search** tries hundreds of circles to find the **critical circle** with the lowest FS, then refines it.

For a quick check of a long, shallow slope use the [[infinite-slope|infinite slope calculator]], and for a wall holding the slope back try the [[retaining-wall-check]].

## How to use it

1. Give the **slope height** H and **angle** β. The toe sits at height 0, the crest at H, with level ground in front and behind.
2. Give the **soil**: effective cohesion c′, friction angle φ′ and unit weight γ. Choose **two soils** to add a lower layer below a horizontal boundary (a weaker clay under a fill, say).
3. Give the **water**: none, a **pore pressure ratio ru** (u = ru × the weight of soil above the slip surface per unit area), or a **water table** that runs straight from a level at the toe to a level behind the crest.
4. Choose **the critical circle** to search a grid of centres, or **one circle I give** to check a circle from a report or a textbook. "Fit the grid to the slope" sets a sensible grid for the current height and angle.

The result shows both factors of safety, the critical circle drawn on the slope with its slices, and a slice table you can download as CSV.

## Worked example

All numbers are made up. A 10 m high slope at 30° in soil with c′ = 10 kPa, φ′ = 25° and γ = 19 kN/m³, with ru = 0.25. The grid search tries about 1,200 circles and shows **Bishop FS = 1.18 (ordinary 1.11)**. The critical circle passes through the toe with its centre near (1.83, 20.79) m and a radius of 20.87 m, and Bishop's equation settles in 16 iterations. Without water the same slope gives FS ≈ 1.50, which shows how much pore pressure matters.

## Good to know

- Watch the **smallest m(α)**. When a circle exits steeply at the toe, m(α) gets small and Bishop's method gives unreliable answers. The search skips circles with m(α) below 0.2.
- If the best centre is on the **edge of the grid**, the page tells you: widen the grid and run again.
- The search tries circles touching levels down to the **deepest circle bottom**. Put it at a hard layer if there is one; otherwise deep circles may be the critical ones.
- For study and planning, not a substitute for professional judgement. Real slopes need site data, other failure shapes and an engineer's review.

## FAQ

**Why does Bishop give a higher FS than the ordinary method?** The ordinary method's assumption about forces between slices leaves out part of the friction on the slip surface. Bishop's method is closer to more rigorous methods for circular surfaces.

**What FS should I aim for?** Many guides use about 1.3 to 1.5 for permanent slopes and lower values for short-term works, but the right value depends on the consequences of failure and your local code.

**How many slices do I need?** About 30 to 50 is plenty. The answer changes very little beyond that.
