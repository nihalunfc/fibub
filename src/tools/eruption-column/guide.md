---
name: Eruption column height and mass eruption rate
num: 886
shelf: science
section: volcanology
title: "Eruption column height to mass eruption rate calculator: power law and plume theory, erupted mass and DRE volume (free)"
summary: "Turn a volcanic column height into a mass eruption rate, or the other way round, with an editable power law (Mastin et al. 2009 by default) and with Morton-Taylor-Turner buoyant plume theory. Get the erupted mass over a duration and its dense-rock-equivalent volume."
status: live
ads: true
order: 886
icon: mountain
works: offline
updated: 2026-11-09
related: []
sources:
  - "Power law form H = a·V^b with default coefficients a = 2.00, b = 0.241 from Mastin, L. G. et al. (2009), A multidisciplinary effort to assign realistic source parameters to models of volcanic ash-cloud transport and dispersion during eruptions, Journal of Volcanology and Geothermal Research 186, 10-21 (two coefficients quoted with credit, editable)."
  - "Plume theory: Morton, B. R., Taylor, G. I. and Turner, J. S. (1956), Turbulent gravitational convection from maintained and instantaneous sources, Proceedings of the Royal Society A 234, 1-23; equations integrated by fibub."
  - "Heat capacities, temperatures, air density, buoyancy frequency, entrainment coefficient and densities: round textbook values chosen by fibub, editable."
flow:
  - { icon: mountain, label: "Height" }
  - { icon: curve, label: "Scaling" }
  - { icon: calculator, label: "Rate, mass" }
  - { icon: chart, label: "Chart" }
---

## What it does

The height of an eruption column is one of the few things you can see during an eruption, and it rises with the mass of magma erupted per second. This calculator converts **column height ↔ mass eruption rate** in two independent ways, then turns the rate into the **erupted mass** over a duration and its **dense-rock-equivalent (DRE) volume**:

- an **empirical power law** H = a · V<sup>b</sup>, H in km above the vent and V the DRE volume flux in m³/s. The default a = 2.00, b = 0.241 is the widely used fit of Mastin et al. (2009); both numbers are editable, so you can use another fit written in the same form;
- **buoyant plume theory** (Morton, Taylor and Turner 1956): a turbulent plume that entrains air as it rises through stably layered air stops at H = C · α<sup>−1/2</sup> F₀<sup>1/4</sup> N<sup>−3/4</sup>.

## How to use it

1. Choose whether you know the **column height** (km above the vent) or the **mass eruption rate** (kg/s), and type it.
2. Type the **vent elevation**, to get heights above sea level, and the **dense-rock density** of the magma.
3. Change the power-law coefficients or the plume theory values if you want: the **entrainment coefficient α**, the air's **buoyancy frequency N** (about 0.01 per second in the troposphere), and the heat values that give the **buoyancy flux** F₀ = g Q c<sub>p</sub> ΔT / (ρ<sub>a</sub> c<sub>a</sub> T<sub>a</sub>).
4. Type the **duration** and, if you like, a deposit **bulk density** to compare with a mapped tephra volume.
5. Read both answers, see them on the chart of height against rate, and download the report or the curves.

## How the plume theory part works

The page integrates the three top-hat plume equations for volume, momentum and buoyancy flux from a point source, upwards until the plume's momentum runs out. In scaled units the top is at 1.819 and the level of neutral buoyancy (where the plume spreads) at 1.382, about 0.76 of the top. With the buoyancy flux written as the physical flux F₀ in m⁴/s³, that gives C = 1.366. Because every quantity enters as a power, height grows only as the fourth root of the rate: doubling the column height takes 16 times the rate.

## Worked example

A **15 km** column above the vent with the defaults:

- Power law: V = (15/2.00)<sup>1/0.241</sup> = 4,275 m³/s DRE, so **1.07 × 10⁷ kg/s** at 2,500 kg/m³.
- Plume theory: F₀ = 1.45 × 10⁸ m⁴/s³, so **3.68 × 10⁶ kg/s**, with neutral buoyancy at 11.4 km.
- Over **3 hours** the power law rate erupts 1.15 × 10¹¹ kg, **4.62 × 10⁷ m³ DRE** (0.0462 km³).

Going the other way, 1 × 10⁷ kg/s gives 14.8 km by the power law and 19.3 km by plume theory. The two differ because the simple plume leaves out wind, moisture and the jet near the vent; real eruptions scatter widely around any fit.

## Frequently asked questions

**Which answer should I use?** The power law is fitted to real eruptions and is the usual first estimate. The plume theory shows how the result depends on the atmosphere and on the physics. Treat both as order-of-magnitude estimates.

**Does wind matter?** Yes: strong wind bends plumes over and lowers them, so a bent-over plume gives a too-low rate from either relation.

**Is anything sent anywhere?** No. Everything runs in your browser and nothing leaves your device.
