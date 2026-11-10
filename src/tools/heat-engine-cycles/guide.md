---
name: Heat engine cycles
num: 917
shelf: science
code: T652
section: thermodynamics-and-statistical-physics
title: "Heat engine cycle calculator: Carnot, Otto, Diesel, Brayton and Stirling on P-V and T-s diagrams"
summary: "Draw the air-standard Carnot, Otto, Diesel, Brayton and Stirling cycles on pressure-volume and temperature-entropy diagrams, with every state, the heat and work of each process, net work, mean effective pressure and efficiency against the Carnot limit."
status: live
ads: true
order: 2
icon: curve
works: offline
updated: 2026-11-09
related: [real-gas-calculator, thermochemistry-calculator, psychrometric-calculator, steam-tables, heat-exchanger-sizing, heat-conduction]
sources:
  - "Air-standard cycle analysis with an ideal gas of constant heat capacities: standard results found in engineering thermodynamics textbooks (for example Çengel and Boles, Thermodynamics: An Engineering Approach; Moran and Shapiro, Fundamentals of Engineering Thermodynamics). Efficiency formulas for the Otto, Diesel and Brayton cycles are the textbook closed forms."
  - "Gas constants and heat capacity ratios of air, nitrogen, helium and argon: rounded general values."
  - "Checked against an independent SciPy calculation that integrates P dv and the heat along each process numerically, and against the closed-form efficiencies."
  - "The example engine is made up."
flow:
  - { icon: sliders, label: "Cycle" }
  - { icon: table, label: "States" }
  - { icon: chart, label: "P-v and T-s" }
  - { icon: percent, label: "Efficiency" }
---

## What it does

A heat engine takes heat from something hot, turns part of it into work and throws the rest away to something cold. Engineers study engines with idealised **air-standard cycles**: a fixed mass of ideal gas goes through four simple processes and returns to where it started. This tool works out five classic cycles:

- **Carnot**: two isentropic (no heat, no friction) and two isothermal processes. No engine between two temperatures can do better.
- **Otto**: the petrol engine. Compression, heat added at constant volume (the spark), expansion, exhaust at constant volume.
- **Diesel**: like Otto, but the fuel burns at constant pressure while the piston moves (set by the **cut-off ratio**).
- **Brayton**: the gas turbine and jet engine: compressor, combustor at constant pressure, turbine.
- **Stirling**: two isothermal and two constant-volume processes, with a **regenerator** that stores heat between them. With a perfect regenerator it reaches the Carnot efficiency.

For each one you get the pressure, volume, temperature and entropy at all four states, the heat and work of every process, the net work per kilogram, the heat taken in and given out, the **mean effective pressure**, the **efficiency** and the **Carnot limit** between the same hottest and coldest temperatures. The cycle is drawn on a **P-v diagram** (the enclosed area is the work) and a **T-s diagram** (the area under the top is the heat taken in).

Look up steam properties for a Rankine cycle in the [[steam-tables]], and size the boiler or condenser with the [[heat-exchanger-sizing|heat exchanger calculator]].

## How to use it

1. Choose the **cycle** with the buttons at the top. Only the settings that cycle needs are shown.
2. Pick the **gas** (air by default) or type its gas constant R and heat capacity ratio γ.
3. Give the start of compression: **T1** and **P1** (state 1, the coldest point).
4. Set the cycle's own numbers: **compression ratio** r (Otto, Diesel, Stirling), **cut-off ratio** (Diesel), **pressure ratio** (Brayton), **peak temperature** (Carnot, Otto, Brayton, Stirling), **isothermal expansion ratio** (Carnot) or **regenerator effectiveness** (Stirling).

Download the path as CSV, or the report as an image, PDF or Word file.

## Worked example

A made-up Otto engine with air at 300 K and 100 kPa, compression ratio 8 and a peak temperature of 1800 K. Compression heats the air to 689.2 K; the spark takes it to 1800 K and 4800 kPa. The efficiency is **56.5 %** (1 − 1/8^0.4), against a **Carnot limit of 83.3 %**. Each kilogram of air takes in 797 kJ, gives out 346.9 kJ and does **450.1 kJ** of net work, a mean effective pressure of 597.4 kPa.

Switch to **Diesel** with r = 8 and a cut-off ratio of 2: the efficiency falls to 49 %, which is why diesel engines use much higher compression ratios (18 or more). **Brayton** with a pressure ratio of 10 gives 48.2 % and a back work ratio of 32.2 %: a third of the turbine's work goes back into the compressor. **Stirling** with a perfect regenerator matches Carnot at 83.3 %; at 50 % effectiveness it drops to 55.5 %.

## Tips

- Efficiency of the Otto and Brayton cycles depends only on the compression or pressure ratio, not on the peak temperature.
- A **monatomic gas** (helium, argon; γ = 1.667) gives a higher Otto efficiency at the same compression ratio: 75 % at r = 8.
- The Carnot cycle needs enormous pressure ratios to do much work, which is why no real engine uses it.

## FAQ

**Why are real engines much less efficient?** Friction, heat lost through the walls, incomplete combustion, real-gas properties and the time it takes to burn fuel all cost efficiency. Air-standard numbers are upper limits for each cycle shape.

**What is entropy here?** The change from state 1, s − s1 = cv ln(T/T1) + R ln(v/v1), per kilogram. Only differences matter.

**Can I use this for design?** It is for study and planning, not a substitute for professional judgement.
