---
name: Autoclave F0 value calculator
num: 196
shelf: science
section: microbiology
title: "Autoclave F0 value calculator: sterilisation lethality from a temperature log, D-value, log reduction and SAL"
summary: "Paste or open an autoclave temperature log (one or more probes) and get the F0 value, the running F0 curve, time at the hold temperature and the equivalent minutes at another temperature. Then type an organism's D- and z-values to see the log reduction, the chance of a survivor and the hold time needed for a target sterility assurance level. Your log stays in your browser."
status: live
ads: false
order: 3
icon: flask
works: offline
updated: 2026-11-09
related: [decay-calculator, media-recipe-scaler, cell-doubling-time, reaction-kinetics-fitter, cfu-counter, thermal-process-calculator, shelf-life-estimator]
sources:
  - "The lethal rate L = 10^((T − Tref) / z), F0 as the time integral of L, D-value shifts D_T = D_ref × 10^((T_ref − T) / z), log reduction = F ÷ D and the sterility assurance level are general sterilisation science, written by fibub."
  - "Checked in the tests against an independent NumPy script on the example log and three random logs with random reference temperatures and z-values (F0 totals, running totals, time at the hold temperature, a second z), against the exact integral of a straight-line ramp, and against hand working for the D-value and hold-time arithmetic."
  - "The example autoclave log and the example organism (D = 1.5 min at 121.1 °C, z = 10 °C) are made up for this tool. All values are editable."
  - "A log you paste or open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: table, label: "Log" }
  - { icon: sliders, label: "Tref and z" }
  - { icon: chart, label: "F0" }
  - { icon: target, label: "Log kill" }
---

## What it does

Heat kills microbes faster the hotter it gets. The **F0 value** puts a whole autoclave cycle, heating up, holding and cooling down, on one scale: the number of minutes at 121.1 °C that would kill as much. This page works it out from your own temperature log:

- **Lethal rate.** Each reading counts as L = 10^((T − Tref) / z) minutes per minute. At the reference temperature (121.1 °C) L is 1; 10 °C hotter it is 10; 10 °C cooler, 0.1. The z-value (10 °C for steam by convention) is how many degrees make the kill ten times faster.
- **F0.** The lethal rates are added up over time, with straight lines between readings (trapezoids) or each reading held until the next, as some loggers do. You see the total and a running F0 curve.
- **Probes.** Every temperature column is a probe. The page shows F0 for each and picks the **coldest** one (lowest F0), because the slowest part of the load decides whether the load is sterile.
- **Hold.** Time at or above the hold temperature, when the hold started and ended, and the F0 gathered during it.
- **Equivalent time** at another temperature, such as 134 °C.
- **Kill of one organism.** Type a D-value (minutes for a 90 % kill at a stated temperature) and the organism's own z. The page works out its log reduction over your cycle, the organisms left per item, whether you reach a target **sterility assurance level** (SAL) and how long a steady hold at any temperature would need.

Count any survivors after a run with the [[cfu-counter|CFU counter]], and work out canning lethality for food in the [[thermal-process-calculator]].

## How to use it

1. **Log.** Paste two or more columns: time, then a temperature for each probe. Minutes, seconds, hours and clock times (10:15:30) all work, and °F is converted. You can also open a CSV or Excel file.
2. **Settings.** Keep 121.1 °C and z = 10 °C for steam, or type your own (dry heat is often worked out with a different reference and z). Set the hold temperature.
3. **Read F0** for each probe, look at the curves and download the CSV.
4. **Organism.** Type the D-value, its temperature and z from your biological indicator's certificate, the starting number per item and the target SAL. Download a PNG, PDF or Word report.

## Worked example

The example is a made-up 45-minute cycle with a reading every minute: a chamber probe and a probe in the centre of the load that heats up more slowly. With Tref = 121.1 °C and z = 10 °C:

- The chamber reaches **F0 = 27.65 min**; the load centre only **22.10 min**, so it is the coldest probe.
- The load centre is at or above 121 °C for **15.45 min**, from 16.60 to 32.05 min, and gathers 16.58 min of F0 there; the rest comes from heating up and cooling down.
- 22.10 min at 121.1 °C kills as much as **1.134 min at 134 °C**.

For the made-up organism (D = 1.5 min at 121.1 °C, z = 10 °C) the load centre gives a **14.73 log reduction**. Starting from 10⁶ organisms per item, a SAL of 10⁻⁶ needs 12 logs, so the cycle meets the target with 2.735 logs to spare and leaves 1.84 × 10⁻⁹ organisms per item. A steady hold for 12 logs would be 18 min at 121.1 °C, or 0.9232 min at 134 °C.

## Tips

- Put the probe where the load heats slowest (the middle of a dense pack or the largest bottle) and judge the cycle by that probe.
- Log at least once a minute; with gaps, F0 is only a straight-line guess and the page warns you.
- F0 assumes saturated steam. Trapped air means the same temperature kills less, so F0 does not replace a Bowie-Dick test or biological indicators.

## FAQ

**Why is F0 above the hold time?** The chamber sat a little above 121.1 °C, and heating up and cooling down add lethality too.

**Which z should I use for the organism?** Its own, from the indicator's certificate. The F0 z (10 °C) is a convention; the organism z changes its log reduction.

**Is this a validation?** No. It is a calculator to check and explain numbers. Follow your own validated procedure and the official standards.
