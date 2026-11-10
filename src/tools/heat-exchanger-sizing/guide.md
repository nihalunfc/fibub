---
name: Heat exchanger sizing
num: 647
shelf: science
code: T444
section: mechanical-engineering
title: "Heat exchanger calculator: LMTD with F correction and effectiveness-NTU, area for a duty or outlets for an area"
summary: "Size or rate a heat exchanger: counterflow, parallel flow, shell and tube with 1 to 8 shell passes, or crossflow with either fluid mixed or unmixed. Get the duty, outlet temperatures, effectiveness, NTU, LMTD, the 1-2 shell-and-tube F factor and the area from U, with effectiveness-NTU curves and temperature profiles."
status: live
ads: true
order: 647
icon: flask
works: offline
updated: 2026-11-09
related: [shaft-bearing-life, gear-train-calculator, heat-conduction, steam-tables, psychrometric-calculator, mass-balance-solver, dimensionless-numbers, pump-system-curve, hvac-room-load]
sources:
  - "Log-mean temperature difference, the F correction factor for one shell pass and an even number of tube passes (Bowman, Mueller and Nagle, 1940), and the effectiveness-NTU relations for parallel flow, counterflow, shell and tube (one and n shell passes) and crossflow with one fluid mixed, as in Incropera et al., Fundamentals of Heat and Mass Transfer, and Kays and London, Compact Heat Exchangers (equations only)."
  - "Crossflow with both fluids unmixed uses the exact series solution (Mason, 1954); the common approximation is used only as a check."
  - "Specific heats and the overall coefficient U on the page are rounded examples chosen by fibub and labelled; the example oil cooler is made up."
  - "Checked against an independent SciPy numerical integration of the stream energy balances for every arrangement (solve_bvp and solve_ivp, and a fine cell grid for crossflow)."
flow:
  - { icon: flask, label: "Streams" }
  - { icon: sliders, label: "Layout" }
  - { icon: calculator, label: "ε-NTU" }
  - { icon: ruler, label: "Area" }
---

## What it does

A heat exchanger passes heat from a hot stream to a cold one through a wall. This tool answers the two everyday questions:

- **Sizing:** how much area do I need to cool (or heat) a stream to a given temperature?
- **Rating:** with this much area, what temperatures will come out and how much heat moves?

It uses both classic methods and shows they agree:

- **LMTD:** Q = U A F ΔT_lm, with the log-mean temperature difference ΔT_lm and, for a shell-and-tube unit, the correction factor F from the 1-2 formula.
- **Effectiveness-NTU:** ε = Q / Qmax depends only on NTU = UA / Cmin, the capacity ratio Cr = Cmin / Cmax and the flow arrangement. It works for every arrangement, including crossflow, and needs no iteration for rating.

Balance the flows and heat duty first with the [[mass-balance-solver|mass and energy balance solver]], and look up water and steam properties in the [[steam-tables]].

## How to use it

1. Give each stream's **inlet temperature**, **mass flow** and **specific heat** cp. The capacity rate C = m cp says how much the stream's temperature changes for each kilowatt.
2. Choose the **arrangement**. For shell and tube, give the number of shell passes (each shell has 2, 4 or more tube passes).
3. Give the **overall coefficient U** for your design (the example 500 W/m²·K is only a placeholder).
4. For **sizing**, give one outlet temperature; the other comes from the energy balance. For **rating**, give the area.

## Worked example

A made-up oil cooler: 2 kg/s of oil (cp 2.1 kJ/kg·K) at 120 °C is cooled to 60 °C by 1.5 kg/s of water (cp 4.18) entering at 20 °C, with U = 500 W/m²·K in a shell-and-tube unit with one shell pass.

The duty is 4.2 kW/K × 60 K = **252 kW**, and the water leaves at 60.19 °C. Cmin is the oil's 4.2 kW/K, Cr = 0.67 and ε = 252 / 420 = 0.6. The effectiveness-NTU relation for one shell pass needs NTU = 1.521, so the area is 1.521 × 4200 / 500 = **12.77 m²**.

The LMTD route gives the same answer: the counterflow ends are 59.81 and 40 K, so ΔT_lm = 49.24 K; with P = 0.402 and R = 1.49 the 1-2 formula gives F = 0.8013, and A = 252 000 / (500 × 0.8013 × 49.24) = 12.77 m². A pure counterflow unit would need 10.24 m². The water leaves slightly hotter than the oil (a temperature cross), which a single shell can just manage but parallel flow never could: the tool says so if you pick it.

Rating the same unit with 20 m² gives 278.3 kW, with the oil leaving at 53.75 °C and the water at 64.38 °C.

## Tips

- If F falls below about 0.75, add a shell pass or move towards counterflow: the design is sensitive and may not reach its duty.
- Counterflow always needs the least area for a given duty; parallel flow the most, and it can never heat the cold stream above the hot outlet.
- When one stream boils or condenses its C is effectively infinite, Cr = 0 and every arrangement gives ε = 1 − e^−NTU.

## FAQ

**Where do I get U?** From film coefficients for each side plus wall and fouling resistances, or from a similar exchanger's test data. The tool does not estimate it.

**Why does crossflow have three options?** Whether each fluid can mix sideways changes how the temperature spreads. Finned-tube coils are usually both unmixed; a gas flowing over a bare tube bank is mixed on the gas side.

**Is this enough for a real design?** It is for study and planning, not a substitute for professional judgement. Pressure drop, fouling margins, vibration and code requirements need checking too.
