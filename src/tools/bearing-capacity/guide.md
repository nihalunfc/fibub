---
name: Bearing capacity calculator
num: 656
shelf: science
section: geotechnical-engineering
title: "Bearing capacity calculator: Terzaghi, Meyerhof and Hansen for strip, square, circular and rectangular footings"
summary: "Ultimate and allowable bearing capacity of a shallow footing by Terzaghi, Meyerhof and Hansen, with the factors Nc, Nq and Nγ from their formulas, shape and depth factors, a water table correction, gross or net factor of safety and the allowable load, plus a side-by-side comparison."
status: live
ads: true
order: 656
icon: calculator
works: offline
updated: 2026-11-09
related: [soil-classification, darcy-flow-calculator]
sources:
  - "Terzaghi's bearing capacity equation and factors Nq = a²/(2cos²(45° + φ/2)), a = e^((0.75π − φ/2)tanφ), Nc = (Nq − 1)cot φ, with shape factors 1.3/0.8 (square) and 1.3/0.6 (circle): general soil mechanics."
  - "Nγ for Terzaghi from the closed-form approximation 2(Nq + 1)tan φ/(1 + 0.4 sin 4φ) given by Coduto (Foundation Design), since Terzaghi published Nγ only as a chart."
  - "Meyerhof (1963) and Hansen (1970) factors, shape and depth factors, as given in general foundation engineering texts; formulas only, no tables copied."
  - "Water table correction (three cases by depth below the base): general soil mechanics."
  - "Example values are made up by fibub for illustration."
flow:
  - { icon: ruler, label: "Footing" }
  - { icon: mountain, label: "Soil" }
  - { icon: calculator, label: "Factors" }
  - { icon: check, label: "Allowable" }
---

## What it does

A footing spreads a building's weight into the ground. If the pressure is too high, the soil underneath shears and the footing sinks or tilts. The **bearing capacity** is the pressure at which that happens. This page works it out by the three classic methods and divides by a factor of safety to give an **allowable bearing pressure** and an **allowable load**.

- **Terzaghi (1943)**: the original equation, with fixed shape factors for square and circular footings and no credit for the soil above the base. A **local shear** option reduces c′ and tan φ′ to two thirds for loose sand or soft clay.
- **Meyerhof (1963)** and **Hansen (1970)**: the same idea with the Prandtl–Reissner Nq and Nc, their own Nγ, and shape and depth factors that grow with B/L and Df/B.

All three use qu = c′·Nc·sc·dc + q·Nq·sq·dq + ½·γ·B·Nγ·sγ·dγ, where q is the effective overburden pressure at the footing base.

## How to use it

1. Pick the **method** and the **footing shape**. For a circle, B is the diameter; for a rectangle, also give the length L (at least B). A strip footing is worked per metre of its length.
2. Type the **depth to the base** Df, the soil strength **c′** and **φ′**, and the unit weights above and below the water table.
3. Type the **water table depth** below the ground surface, or leave it blank if it is deep. The page picks the right case: above the base (q and the Nγ term use the submerged weight γ′ = γsat − 9.81), within B below the base (the Nγ term uses a weight between γ′ and γ), or deeper (no effect).
4. Choose the **factor of safety** (3 is common for bearing) and whether it applies to the gross pressure qu or to the net pressure qu − q.

The result shows qu, the net value, both allowable pressures, every factor, and a table comparing the three methods. The chart shows how steeply the factors rise with φ′, which is why a small error in φ′ matters so much.

## Worked example

All numbers are made up. A 2 m square footing sits 1.2 m deep in soil with c′ = 10 kPa, φ′ = 30°, γ = 18 kN/m³ and γsat = 20 kN/m³, with the water table 2 m below the ground, so 0.8 m below the base. By **Meyerhof**, Nc = 30.1, Nq = 18.4 and Nγ = 15.7. The overburden is q = 18 × 1.2 = 21.6 kPa, and because the water is within B of the base, the Nγ term uses γ = 13.3 kN/m³. The three terms are 582 + 570 + 299, so **qu = 1452 kPa**. With a factor of safety of 3 on the gross pressure, the page shows **Allowable 484 kPa, load 1936 kN**. Terzaghi gives qu = 1182 kPa and Hansen 1422 kPa for the same footing.

## Good to know

- These equations assume a vertical, central load on level ground. Inclined or eccentric loads and sloping ground need further factors.
- For clay just after construction, use the undrained strength as c with φ = 0. Nq is then 1 and Nγ is 0.
- Settlement, not bearing failure, often decides the footing size on clay and loose sand. Check it separately.
- For study and planning, not a substitute for professional judgement. Check your local code and a qualified engineer.

## FAQ

**Why do the methods disagree?** They make different assumptions about the failure wedge under the footing, especially for Nγ, and Meyerhof and Hansen add depth factors that Terzaghi leaves out. Differences of 10 to 30 % are normal.

**Gross or net?** The gross value is the total pressure under the footing. The net value subtracts the soil that was dug out, which was already pressing on that level. Codes and textbooks use both, so the page shows both.

**Where does Terzaghi's Nγ come from?** Terzaghi gave it only as a curve. The page uses a widely used closed-form fit, so values can differ slightly from tables in books.
