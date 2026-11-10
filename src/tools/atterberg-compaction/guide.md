---
name: Atterberg limits
num: 659
shelf: science
code: T456
section: geotechnical-engineering
title: "Atterberg limits"
summary: "Liquid limit from a Casagrande flow curve or the one-point method, plastic limit, plasticity, liquidity and consistency indices and activity; and the Proctor compaction curve: dry density, a fitted curve with maximum dry density and optimum water content, zero-air-voids and air-voids lines and relative compaction."
status: live
ads: true
order: 659
icon: flask
works: offline
updated: 2026-11-09
related: [soil-classification, consolidation-settlement, slope-stability, bearing-capacity, grain-size-stats, graph-digitizer]
sources:
  - "Casagrande liquid limit flow curve (water content against log blows, read at 25 blows), flow and toughness indices, liquidity and consistency indices, and Skempton's activity PI / clay fraction: general soil mechanics."
  - "One-point liquid limit LL = wN (N/25)^0.121: the commonly used exponent from the general literature; the page lets you change it."
  - "Compaction: ρd = ρ/(1 + w), zero-air-voids and air-voids lines ρd = Gs ρw (1 − Av)/(1 + w Gs), degree of saturation S = w Gs / e: soil phase relations."
  - "Example data are made up by fibub for illustration."
flow:
  - { icon: flask, label: "Cup trials" }
  - { icon: curve, label: "Flow curve" }
  - { icon: table, label: "Proctor" }
  - { icon: chart, label: "Optimum" }
---

## What it does

Two everyday soil lab tests in one place.

**Atterberg limits** describe how a fine soil changes as it gets wetter: from solid, to plastic (it can be rolled into threads), to liquid. The page works out:

- the **liquid limit LL** from several Casagrande cup trials (a straight **flow curve** of water content against the log of the blow count, read at 25 blows), or from a single trial by the **one-point** formula LL = wN (N/25)^0.121;
- the **plasticity index PI = LL − PL**, the **flow index** and **toughness index**, where the soil plots on the plasticity chart (CL, ML, CH or MH);
- with the natural water content, the **liquidity index** and **consistency index**; with the clay fraction, the **activity**.

**The compaction (Proctor) curve** shows how dense a soil gets when compacted at different water contents. The page turns each bulk density into a **dry density**, fits a smooth curve, and reads the **maximum dry density** and the **optimum water content** at its peak. It draws the **zero-air-voids** line and the 5 % and 10 % air-voids lines from Gs, and gives the **relative compaction** of a field test.

Put the limits straight into the [[soil-classification]], and add the sieve results with the [[grain-size-stats|grain size statistics]] tool.

## How to use it

1. Paste or open the cup trials: blows, then water content in %. Use the one-point method only for a single trial between 20 and 30 blows.
2. Type the plastic limit, and if you have them, the natural water content and the percent finer than 2 µm.
3. Paste or open the compaction points: water content in %, then bulk density. Choose the unit (Mg/m³, kg/m³ or kN/m³), Gs and the curve shape. A parabola suits four to six points around the peak; a cubic can follow a lopsided curve when you have more points.
4. Optionally type a field dry density to get the relative compaction.

## Worked example

All numbers are made up. Four cup trials at 34, 27, 21 and 15 blows with water contents of 41.2, 43.0, 44.9 and 47.3 % give **LL = 43.5 %**, a flow index of 17.15, and with PL = 22.4 %, **PI = 21.1 %**, which plots as CL. At a natural water content of 35 % the liquidity index is 0.60 (plastic), and with 28 % clay the activity is 0.75 (normal).

Five Proctor points from 10.2 to 19.1 % water, with Gs = 2.70, give **Maximum dry density 1.816 Mg/m³ at 14.5 % water**. At the optimum the soil is 81 % saturated with 6.4 % air voids. A field dry density of 1.74 Mg/m³ is a relative compaction of 95.8 %.

## Good to know

- The flow curve is only straight over a modest range: keep trials between about 15 and 35 blows.
- A compaction point above the zero-air-voids line is impossible, so it means a wrong Gs or a mistake in the data. The page counts such points.
- If the fitted curve has no peak between your points, you need points on both sides of the optimum.
- For study and planning. Test methods and the compaction specified differ between standards; check your local code.

## FAQ

**Why is LL read at 25 blows?** By definition: the liquid limit is the water content at which the groove closes after 25 blows of the cup.

**Parabola or cubic?** A parabola is symmetric about the peak and is the usual choice. A cubic can follow a curve that falls faster on the wet side, but it can also wiggle with few points.

**What is activity?** PI divided by the percent of clay-size particles. It says how much the clay minerals themselves swell and shrink: high activity hints at minerals such as smectite.
