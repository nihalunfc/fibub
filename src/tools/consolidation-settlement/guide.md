---
name: Consolidation settlement and time
num: 657
shelf: science
section: geotechnical-engineering
title: "Consolidation settlement calculator: layered clay with Cc, Cr and preconsolidation pressure, and time to 50 % or 90 % by Terzaghi"
summary: "Primary consolidation settlement of layered clay under a wide fill or a footing, for normally and over-consolidated layers, and how long it takes: Terzaghi's degree of consolidation from its series, time to any percent, a settlement-time curve, isochrones and cv from a lab t50 or t90."
status: live
ads: true
order: 657
icon: clock
works: offline
updated: 2026-11-09
related: [bearing-capacity, soil-classification, atterberg-compaction, darcy-flow-calculator, graph-digitizer, load-combination-helper]
sources:
  - "Primary consolidation settlement S = Cc·H/(1 + e0)·log(σ′f/σ′0), with Cr below the preconsolidation pressure: one-dimensional consolidation theory, general soil mechanics."
  - "Terzaghi's one-dimensional consolidation theory: U = 1 − Σ 2/M² exp(−M²Tv), M = π(2m + 1)/2, Tv = cv·t/Hdr², and the isochrone series; Casagrande's log-time and Taylor's root-time methods for cv (Tv at 50 % and 90 % computed from the series)."
  - "The 2:1 stress spread under a footing: a common approximate rule in soil mechanics texts."
  - "Example values are made up by fibub for illustration."
flow:
  - { icon: table, label: "Layers" }
  - { icon: ruler, label: "Load" }
  - { icon: calculator, label: "Settlement" }
  - { icon: clock, label: "Time" }
---

## What it does

When you load saturated clay, water has to squeeze out of its tiny pores before the soil can compress, so the ground settles slowly, over months or years. This page answers both questions engineers ask: **how much** will it settle, and **how long** will it take?

- **How much**: for each layer, the page finds the effective stress at mid-depth before (σ′0) and after (σ′f) loading, compares it with the **preconsolidation pressure σ′p**, and uses the **compression index Cc** (normally consolidated), the **recompression index Cr** (over-consolidated) or both (over-consolidated clay pushed past σ′p).
- **How long**: Terzaghi's theory gives the average **degree of consolidation U** from the **time factor Tv = cv·t/Hdr²**. The page sums the series exactly, finds the time to any U, and draws the settlement against time and the **isochrones** (how the excess pore pressure dies away through the clay).
- **cv from a lab test**: from Casagrande's t50 or Taylor's t90 on an oedometer curve.

Check the footing will not fail first with the [[bearing-capacity|bearing capacity calculator]], and read a lab oedometer curve off a scanned figure with the [[graph-digitizer]].

## How to use it

1. Paste or open the layers from the top down: name (optional), thickness, bulk unit weight γ, initial void ratio e0, Cc, Cr and σ′p. Put Cc = Cr = 0 for a sand layer that only adds weight, and σ′p = 0 for normally consolidated clay.
2. Set the **water table depth** (the page uses γ − 9.81 below it) and, for thick layers, **split each layer into sublayers**.
3. Choose the **load**: a wide fill adds the same stress at every depth; a footing spreads by the 2:1 rule.
4. Give **cv** and the **drainage**: sand above and below the clay means it drains both ways, so the drainage path Hdr is half the clay thickness.

## Worked example

All numbers are made up. Under 2 m of sand fill lie Clay A (3 m, e0 = 1.10, Cc = 0.45, Cr = 0.06, σ′p = 80 kPa) and Clay B (4 m, e0 = 0.85, Cc = 0.30, Cr = 0.04, σ′p = 95 kPa), with the water table at 1.5 m. A wide fill adds 60 kPa. At the middle of Clay A, σ′0 = 42.6 kPa rises to 102.6 kPa, passing σ′p, so both Cr and Cc apply: 93.0 mm. Clay B adds 102.3 mm. The page shows **Settlement 195 mm; 90 % after 4.16 years** for cv = 2.5 m²/year with drainage top and bottom (Hdr = 3.5 m). Half the settlement happens in the first 11.6 months.

In the lab box, a 19 mm sample drained both ways with t50 = 4.5 minutes gives cv = 2.08 m²/year.

## Good to know

- Over-consolidated clay settles far less until the load passes σ′p. Getting σ′p right matters more than anything else.
- Real clay often has sand seams that shorten the drainage path a lot, so field consolidation is often faster than lab cv predicts.
- Secondary compression (creep) continues after primary consolidation ends and is not included here.
- For study and planning, not a substitute for professional judgement.

## FAQ

**Why mid-layer stresses?** The log of stress is curved, so one point per thick layer slightly misjudges the settlement. Splitting into sublayers fixes that; the table still lists the mid-layer stresses.

**What if σ′p is below σ′0?** The clay is under-consolidated (still settling under its own weight). The page treats it as normally consolidated and says so, but such a site needs special care.

**Why does U start like a square root?** Early on, U ≈ √(4Tv/π), so settlement plotted against log time has the S-shape Casagrande used to find t50.
