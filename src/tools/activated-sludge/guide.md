---
name: Activated sludge sizer
num: 157
shelf: science
code: T157
section: environmental-engineering
title: "Activated sludge sizing: aeration tank volume, F/M ratio, sludge production, oxygen demand and air flow from SRT and MLSS"
summary: "Size an activated sludge aeration tank for BOD removal. Give the flow, influent BOD, sludge age (SRT), MLSS and kinetic coefficients, and see the effluent BOD, tank volume and detention time, F/M ratio, sludge production, oxygen demand, air flow, return and waste sludge flows, and how they all change with sludge age."
status: live
ads: true
order: 3
icon: flask
works: offline
updated: 2026-11-09
related: [detention-pond, water-quality-index, landfill-gas, mass-balance-solver, reactor-design, dissolved-oxygen]
sources:
  - "Steady-state complete-mix activated sludge mass balances (Monod growth with endogenous decay and cell debris, solids retention time, oxygen from the bCOD balance): standard wastewater engineering textbook methods. Written by fibub; no design-manual tables are copied."
  - "Checked in the tests against an independent Python implementation of the same balances, and that the solids in the tank equal the daily sludge production times the sludge age."
  - "The kinetic coefficients and the example plant are illustrative values made up for this tool. Use coefficients for your own wastewater and your design guide or regulator's rules for a real design."
flow:
  - { icon: flask, label: "Wastewater" }
  - { icon: sliders, label: "Kinetics" }
  - { icon: ruler, label: "Tank size" }
  - { icon: chart, label: "O₂ and air" }
---

## What it does

In an **activated sludge** plant, bacteria eat the dissolved organic matter (measured as BOD) in sewage while air is blown through the tank. The bacteria settle out in a clarifier, most are pumped back to the tank (return sludge) and the extra growth is wasted each day. This tool does the classic steady-state design sums for a **complete-mix** tank that removes BOD (carbon) only.

The key design choice is the **sludge age**, or solids retention time (SRT): the average number of days the bacteria stay in the system. From it, Monod growth kinetics give the effluent soluble BOD; the yield and decay rates give how much sludge is made each day; and the sludge made times the SRT is the mass of solids the tank must hold. Divide that by the MLSS you want to run at and you have the tank volume.

For the rest of a treatment works, the [[detention-pond]] sizes stormwater storage, and the [[water-quality-index]] scores what the river looks like downstream.

## How to use it

1. **Wastewater and plant.** Flow in m³/day, BOD after primary settling, influent solids that bacteria cannot break down (non-biodegradable VSS and inert inorganic solids), the sludge age, the MLSS, the return sludge concentration from the clarifier, and the field oxygen transfer efficiency of your diffusers.
2. **Kinetic coefficients.** Yield Y, decay rate kd, debris fraction fd, maximum growth rate µmax, half-saturation constant Ks, VSS/TSS of the biomass and the bCOD/BOD ratio. The defaults are illustrative; change them to suit your wastewater and temperature.
3. Read the results. Every number updates as you type.

## What you get

- **Effluent soluble BOD** from the Monod equation at your sludge age.
- **Tank volume and hydraulic retention time** (HRT).
- **F/M ratio** (food to microorganisms) and the volumetric BOD load.
- **Sludge production** in kg VSS and kg TSS per day, split into new bacteria, cell debris and influent solids, and the observed yield.
- **Oxygen demand** (bCOD removed minus 1.42 times the biomass wasted) and the **air flow** at your transfer efficiency.
- **Return sludge ratio** and **waste sludge flow** from the return line.
- The **washout** sludge age, below which the bacteria cannot stay in the tank.
- Charts and a table of how volume, sludge, oxygen and air change with sludge age, with PNG, PDF, Word and CSV downloads.

## Worked example

The made-up plant treats 4,000 m³/day at 200 mg/L BOD, with 20 mg/L non-biodegradable VSS and 10 mg/L inert solids, run at an 8-day sludge age and 3,000 mg/L MLSS. With Y 0.6, kd 0.1 per day, fd 0.15, µmax 5 per day and Ks 40 mg/L:

- Effluent soluble BOD is **1.88 mg/L**, so 792 kg BOD is removed each day.
- New bacteria are 264 kg VSS/day and cell debris 31.7 kg/day; with the influent solids, sludge production is **376 kg VSS/day** or **468 kg TSS/day** (observed yield 0.474).
- The tank holds 468 × 8 = 3,745 kg of solids, so at 3,000 mg/L it is **1,248 m³**, an HRT of **7.49 hours**. The F/M ratio is 0.266 per day.
- Oxygen demand is **848 kg O₂/day**. At 10 % field transfer that needs **21.1 m³/min** of air.
- With return sludge at 8,000 mg/L, the return ratio is **60 %**, and about **58.5 m³/day** is wasted.
- Washout would happen below a sludge age of 0.25 days, so 8 days is a wide margin.

## FAQs

**Why does a longer sludge age need a bigger tank but make less sludge?** The bacteria live longer, so more of them die and are eaten by others (endogenous decay). Less sludge is wasted each day, but more solids sit in the tank, so at the same MLSS the tank grows. Oxygen use rises because that decay burns oxygen.

**Does it size for ammonia removal (nitrification)?** No. Nitrifying bacteria grow slowly and need a longer sludge age and about 4.6 g of oxygen per g of ammonia. Use this tool for BOD removal only.

**Is the oxygen figure the average or the peak?** The average for steady flow and load. Blowers are sized for peak loads, often well above the average.

**Where do the coefficients come from?** The defaults are illustrative values typical of the textbook range, not copied from any table. Coefficients change with temperature and wastewater, so use measured or design-guide values.

**Does it store my numbers?** No. Everything is calculated in your browser and nothing is sent anywhere.
