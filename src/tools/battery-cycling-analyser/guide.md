---
name: Battery cycling
num: 104
shelf: science
code: T104
section: electrochemistry-and-battery-science
title: "Battery cycling"
summary: "Paste or open per-cycle charge and discharge capacities for first-cycle efficiency, average coulombic efficiency, retention, fade per cycle and cycles to 80 %. Paste one voltage curve for incremental capacity (dQ/dV) and its peaks. Works with exports from any cycler."
status: live
ads: true
order: 4
icon: chart
works: offline
updated: 2026-11-08
related: [cyclic-voltammetry, nernst-calculator, electroplating-calculator, plot-maker]
flow:
  - { icon: table, label: "Cycles" }
  - { icon: percent, label: "Efficiency" }
  - { icon: chart, label: "Retention" }
  - { icon: curve, label: "dQ/dV" }
---

## What it does

A cycling test charges and discharges a cell hundreds of times and records the capacity each way. This page turns that table into the numbers reported in battery papers and test reports.

**Capacity and coulombic efficiency card.** Paste three columns: cycle number, charge capacity and discharge capacity (or open a CSV or Excel export). You get:

- **First-cycle efficiency** and the capacity lost on the first cycle, mostly to forming the solid electrolyte interphase (SEI).
- **Average coulombic efficiency** after the reference cycle. Small differences matter: 99.9 % and 99.99 % sound close, but over 1000 cycles they keep 37 % and 90 % of the cyclable lithium.
- **Retention** on the last cycle compared with the reference cycle, the **fade per cycle** from a straight line, and the **cycles to an end-of-life limit** such as 80 %. If the test stopped earlier, the limit is extrapolated and marked as such.
- **Total irreversible capacity**, the sum of what went in and did not come back.
- Plots of capacity and of coulombic efficiency against cycle.

Coulombic efficiency is discharge ÷ charge for a cathode or a full cell. For an anode tested against lithium metal, the first step is lithiation (discharge), so choose charge ÷ discharge.

**Incremental capacity card.** Paste one charge or discharge curve as capacity and voltage. The tool puts the curve on an even voltage grid, takes a smoothed derivative dQ/dV, and lists its peaks. Each peak marks a plateau, such as a phase change in the cathode or a staging step in graphite. Comparing these plots between early and late cycles shows which electrode is losing active material.

For the electrochemistry behind the capacity fade, look at [[cyclic-voltammetry]] and the [[impedance-fitter|impedance (EIS) fitter]].

## How to use it

1. Export the cycle summary from your cycler (most offer cycle, charge capacity and discharge capacity columns) and paste or open it.
2. Pick the capacity unit. With mAh and the active mass, the specific capacity is shown too.
3. Set the reference cycle, often 1, or the first cycle after formation.
4. For dQ/dV, paste one half-cycle with the voltage recorded often (every few mV). Raise the smoothing if the plot is noisy.

## Worked example

The example is a simulated cathode cycled 200 times. The first charge is 200.2 mAh/g and the first discharge 176.2 mAh/g, so the **first-cycle efficiency is 88.0 %**. After that the coulombic efficiency averages **99.91 %**, retention falls to **78.9 % at cycle 200**, and **80 % is reached at cycle 184**.

The dQ/dV example is a simulated LiMn₂O₄ charge curve. Its two plateaus give **peaks at 4.000 and 4.140 V**, the two steps of lithium removal from the spinel.

## Questions

**Why is my first-cycle efficiency low?** The SEI forms on the anode during the first charge and uses up lithium. Silicon anodes and high-surface carbons lose the most.

**My dQ/dV is noisy. What can I do?** Use a larger voltage step and more smoothing, or record the curve at a slower rate. A low C-rate also gives sharper, better separated peaks.

**Is anything sent anywhere?** No. Your data stays in your browser, and the page works offline once loaded.
