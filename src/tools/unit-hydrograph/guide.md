---
name: Unit hydrograph builder
num: 149
shelf: science
code: T149
section: hydrology-and-water-resources
title: "Unit hydrograph builder: synthetic SCS-type and Nash unit hydrographs, storm hydrographs, and unit hydrographs from observed storms"
summary: "Build a unit hydrograph for a catchment from its area and time of concentration (a gamma curve with a peak rate factor, as in the SCS method, or a Nash cascade). Turn a series of excess rain into a storm hydrograph by convolution. Or derive the unit hydrograph from a storm you measured, with baseflow separation, a φ-index loss and a non-negative least-squares fit."
status: live
ads: true
order: 6
icon: chart
works: offline
updated: 2026-11-09
related: [runoff-calculator, flood-frequency, rating-curve, manning-weir-calculator]
sources:
  - "Unit hydrograph theory (linearity, time invariance, convolution, S-curve) and the φ-index: standard hydrology textbook methods."
  - "Gamma-shaped unit hydrograph with a peak rate factor: the closed-form gamma equation often used to stand in for the SCS/NRCS dimensionless unit hydrograph (PRF 484 at shape m ≈ 3.7). fibub computes it from the formula; no published table of ordinates is copied. Tp = D/2 + 0.6 tc is the usual SCS lag relation."
  - "Nash cascade: the instantaneous unit hydrograph of n equal linear reservoirs (Nash, 1957), a gamma distribution, used through its S-curve."
  - "Non-negative least squares: the Lawson–Hanson algorithm, checked in the tests against SciPy. The example storm is made up by fibub."
flow:
  - { icon: mountain, label: "Catchment" }
  - { icon: curve, label: "Unit graph" }
  - { icon: calculator, label: "Convolve" }
  - { icon: chart, label: "Storm flow" }
---

## What it does

A **unit hydrograph** describes how a catchment responds to rain. It is the flow at the outlet caused by 1 mm of runoff falling evenly over the catchment in one rain step. Once you have it, the flow from any storm is just a sum of copies, shifted in time and scaled by each step's excess rain. That sum is called **convolution**. It is how engineers turn a design storm into a design flood for culverts, bridges, ponds and spillways.

This tool does three things:

1. **Builds a synthetic unit hydrograph** for a catchment with no flow records.
2. **Turns excess rain into a storm hydrograph.**
3. **Derives the unit hydrograph from a storm you measured**, so you can see how your own catchment really responds.

For a quick peak flow without a hydrograph, use the [[runoff-calculator]]; to store the flood, the [[detention-pond]].

## How to use it

**Catchment and unit hydrograph.** Give the catchment area and the rain step D. Then choose a shape:

- **Gamma curve (SCS type).** Give the time of concentration tc and a peak rate factor. The peak comes at Tp = D/2 + 0.6 tc. A peak rate factor of 484 is the usual value. Lower values (about 300) give a flatter, slower response, suited to flat or swampy land. Higher values (up to about 600) give a sharper one, for steep land.
- **Nash cascade.** The runoff passes through n equal reservoirs, each with storage constant k. The average delay is n·k.

Either way, the curve is scaled so that it holds exactly 1 mm over the catchment.

**Storm hydrograph.** Type the excess rain for each step, in mm. This is the rain left after losses; the Runoff calculator can estimate it with a curve number. Add the baseflow. The tool shows the flow at the outlet, its peak and its time, and lets you download a CSV of both hydrographs.

**From an observed storm.** Paste or open a table with one row per rain step, holding the rain (mm) and the flow (m³/s). Start before the rain and run until the river is back near baseflow. The tool then:

1. separates the baseflow, with a straight line or a constant;
2. finds the runoff depth from the volume above the baseflow and the area;
3. sets a **φ-index**, a constant loss per step, so that the excess rain equals that depth;
4. finds the **non-negative unit hydrograph** that best rebuilds the flow.

It reports the Nash–Sutcliffe efficiency of the fit and checks that the result holds 1 mm.

## Worked example

Use the defaults: 50 km², a 1 h step, tc = 4 h and a peak rate factor of 484.

- **Unit hydrograph:** Tp = 0.5 + 2.4 = 2.9 h, and the gamma shape is m = 3.70. The curve peaks at **3.58 m³/s per mm at 3 h**.
- **Storm:** excess rain of 0, 5, 12, 8 and 2 mm (27 mm in all) on top of 3 m³/s baseflow gives a **peak of 84.9 m³/s at 5 h**.

The observed storm in the example is made up:

- **Runoff depth:** 30 hours of flow from 40 mm of rain give 27.1 mm of runoff above a straight-line baseflow.
- **Losses:** the φ-index is 2.48 mm per hour.
- **Derived unit hydrograph:** it peaks at 2.90 m³/s per mm at 3 h.
- **Fit:** it rebuilds the flow with a Nash–Sutcliffe efficiency of 1.000 and holds 1.000 mm, as it should.

## FAQs

**Why can my derived unit hydrograph look bumpy?** Measurement noise, rain that was not even over the catchment, or losses that changed during the storm all show up in it. Use several storms and compare, or shorten the length.

**Which rain step should I use?** About a fifth to a third of the time to peak is common. The step for the storm must match the step of the unit hydrograph.

**Is the gamma curve the same as the SCS table?** It is a close fit to it, widely used in place of the table. It is not a copy of the table.

**Is my data uploaded?** No. Files open and stay in your browser.
