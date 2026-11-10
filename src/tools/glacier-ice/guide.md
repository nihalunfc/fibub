---
name: Glacier mass balance
num: 828
shelf: science
code: T564
section: glaciology-and-cryosphere
title: "Glacier mass balance"
summary: "Turn stake readings and elevation bands into a glacier's mass balance, equilibrium-line altitude and accumulation-area ratio; work out basal shear stress and the speed through the ice with Glen's flow law; and estimate permafrost active-layer depth with Stefan's equation."
status: live
ads: true
order: 828
icon: mountain
works: offline
updated: 2026-11-09
related: [koppen-climate, trend-analyser, walter-lieth, snow-slope-tools, insolation-calculator, energy-balance-model, dem-terrain]
sources:
  - "Formulas (written into code by fibub, no tables copied): point and glacier-wide balance and the ELA and AAR as defined in Cogley, J. G. et al. (2011), Glossary of Glacier Mass Balance and Related Terms, IHP-VII Technical Documents in Hydrology No. 86, UNESCO-IHP, Paris."
  - "Glen, J. W. (1955), The creep of polycrystalline ice, Proceedings of the Royal Society A 228, 519–538 (the flow law); Nye, J. F. (1952), The mechanics of glacier flow, Journal of Glaciology 2, 82–93 (laminar flow of a slab and basal shear stress)."
  - "Stefan's thaw-depth equation as given in permafrost textbooks, e.g. French, H. M., The Periglacial Environment, and Cuffey, K. M. and Paterson, W. S. B. (2010), The Physics of Glaciers, 4th ed. (for the flow-law relations)."
  - "Checked 2026-11-09 against NumPy and SciPy (polyfit, interp1d, quad, brentq, solve_ivp) on hundreds of random cases."
  - "The stakes, bands and monthly temperatures in the example are made up by fibub; they are not a real glacier or site. The starting rate factor A is a rounded typical value; replace it with your own."
flow:
  - { icon: ruler, label: "Stakes" }
  - { icon: mountain, label: "Bands" }
  - { icon: chart, label: "Balance" }
  - { icon: curve, label: "Ice flow" }
---

## What it does

This page does three everyday calculations of glacier and permafrost field work, each in its own tab:

- **Mass balance** from a stake network. Each stake's height change becomes a **point balance** in metres of water equivalent (m w.e.). The stakes give a **balance profile** (balance against elevation), which is averaged over each **elevation band** of the glacier and weighted by the band's area to give the **glacier-wide balance**, the **volume change**, the **equilibrium-line altitude** (ELA, where the balance is zero) and the **accumulation-area ratio** (AAR, the share of the glacier with a positive balance).
- **Ice flow** with **Glen's flow law** (strain rate = A τⁿ) for ice flowing down an even slope: the **basal shear stress** τb = f ρ g H sin α, the **speed at every depth** from the bed to the surface, the column-mean speed and the ice flux.
- **Active-layer depth** with **Stefan's equation**: how deep the ground above permafrost thaws in summer, from the thawing index (degree days above 0 °C), the soil's thermal conductivity and its water content.

Work out how much water the snowpack holds with the [[snow-slope-tools|snow water tools]], and see the longer climate trend with the [[trend-analyser]].

## How to use it

1. **Mass balance**: paste or open your stakes (name, elevation, surface height change in metres, density in kg/m³) and your elevation bands (bottom, top, area in km²). Use minus for melt. For snow or firn left at the end of the year, give its measured density; a blank density counts as ice (900 kg/m³). If you already have point balances in m w.e., switch **Stake values are** to *Balance in m w.e.*
2. Choose the **balance profile**: *Join the stakes* (straight lines between neighbouring stakes, carried on past the end stakes) or a *Straight-line fit* through all stakes. The band balance is the profile's exact average over the band.
3. **Ice flow**: type the ice thickness, the surface slope, and the flow-law values. The rate factor A depends strongly on ice temperature, so replace the rounded starting value with one for your ice. Add sliding at the bed if you know it.
4. **Active layer**: type 12 monthly mean air temperatures (or a thawing index you already have), the n-factor, the thawed soil's conductivity and its water content.
5. Download the band and stake tables or the velocity profile as CSV, or all three parts as an image, PDF or Word report.

## Worked example

The made-up example glacier has 10 stakes from 2,480 to 3,330 m and 9 bands of 100 m from 2,450 to 3,350 m, 6.94 km² in all. Stake S1 lost 3.6 m of ice: 3.6 × 900 ÷ 1000 = **−3.24 m w.e.** With the stakes joined, the page shows a glacier-wide balance of **−0.73 m w.e.**, a volume change of **−5.08 million m³ of water**, an **ELA of 2,980 m**, an **AAR of 34 %** and a balance gradient of **0.57 m w.e. per 100 m** (r² 0.978). With the straight-line fit instead, the balance is −0.81 m w.e. and the ELA 3,030 m: the choice of profile matters, so report it.

In the flow tab, 200 m of ice on a 3° slope (ρ 917 kg/m³, A 2 × 10⁻²⁴ Pa⁻³ s⁻¹, n 3) has a basal shear stress of **94.16 kPa**, a surface speed of **5.269 m/yr**, a column-mean speed of **4.215 m/yr** and an ice flux of **843.1 m² per year** per metre of width.

In the active-layer tab, the made-up monthly means give a thawing index of **859 °C·days**. With k = 1.2 W/m/K and θ = 0.3, Stefan's equation gives an active layer about **1.33 m** deep.

## The formulas

- Point balance: b = Δh × ρ ÷ 1000. Glacier-wide balance: B = Σ bᵢAᵢ ÷ ΣAᵢ.
- Velocity at height z above the bed: u(z) = u_b + 2A/(n+1) × (f ρ g sin α)ⁿ × (Hⁿ⁺¹ − (H − z)ⁿ⁺¹). The column-mean deformation speed is (n+1)/(n+2) of the surface value.
- Stefan: Z = √(2 k nₜ I × 86,400 ÷ (1000 × 333,550 × θ)), with I in °C·days.

## FAQ

**Why is my ELA "none"?** If every band has a negative balance, the equilibrium line lies above the glacier (a year of loss everywhere); if every band is positive, it lies below. The page says which.

**Is the laminar-flow speed realistic?** It is the textbook slab model: it ignores longitudinal stresses, changes in thickness and temperature with depth, and water at the bed. Use it for orders of magnitude, teaching and checks, not as a full ice-flow model.

**Why is Stefan's depth larger than what I measure?** The equation leaves out the heat used to warm the soil and assumes all the summer heat goes into melting ground ice, so it is an upper estimate. Snow, moss and soil moisture change the n-factor and the conductivity a lot; calibrate with a measured site if you can.
