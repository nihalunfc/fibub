---
name: Internal resistance
num: 1411
shelf: learn
code: L265
section: school-physics
title: "Internal resistance"
summary: "A virtual cell with an emf and an internal resistance drives a rheostat, with an ammeter and a voltmeter. See why the terminal voltage drops as the current grows, plot V against I, find the load that takes the most power, and record readings to work out E and r from a straight-line fit."
status: live
ads: false
order: 1411
icon: chart
works: offline
updated: 2026-11-09
related: [ohms-law-lab, kirchhoff-solver, series-parallel]
sources:
  - "Terminal voltage V = E − I r with I = E / (R + r), the power E² R / (R + r)² in the load and its maximum E² / (4 r) at R = r: standard circuit results."
  - "Least-squares straight line through the recorded (I, V) readings: intercept E, slope −r."
  - "Checked by hand (1.5 V, 0.5 Ω, 2.5 Ω: 0.5 A, 1.25 V, 0.625 W; maximum 1.125 W at 0.5 Ω), by numerically scanning R for the power peak, and by fitting exact readings back to E and r."
flow:
  - { icon: sliders, label: "Set E, r" }
  - { icon: pointer, label: "Change R" }
  - { icon: chart, label: "Plot V–I" }
  - { icon: check, label: "Find E, r" }
---

## What it does

A real cell is not a perfect source of voltage. Inside it there is some resistance, the **internal resistance r**. When a current I flows, a voltage I r is "lost" inside the cell, so the voltage at its terminals is less than its emf:

**V = E − I r**, with **I = E / (R + r)** for a load R.

This page shows a cell (the dashed box: an ideal emf E with r beside it) driving a rheostat, with an ammeter and a voltmeter across the cell. Change E, r and R and the meters, the formula with your numbers and the facts update at once. The graph shows either **V against I**, a straight line that falls from E with slope −r, or the **power in the load against R**, which peaks when R = r (maximum power transfer). In the last part you can record readings like a real practical and let the page find E and r from the best straight line.

It follows the Class 12 Physics chapter on current electricity (emf, internal resistance, terminal voltage, cells in circuits) and the practical on finding a cell's internal resistance. Start with the [[ohms-law-lab]]; for circuits with several cells use the [[kirchhoff-solver]], and to combine loads, [[series-parallel]].

## How to use it

1. Set the cell's **emf E** and **internal resistance r**.
2. Change the **load resistance R**. **Open the switch** to see the open-circuit voltage; **Short circuit** sets R to 0.
3. Pick the graph: **V against I** or **Power against R**. The red dot is where you are now.
4. Press **Record this reading** at three or more loads, then read the fitted E and r below the table. Changing E or r clears the table, because it is then a different cell.

## Worked example

A 1.5 V cell with r = 0.5 Ω drives a 2.5 Ω load. Then I = 1.5 / (2.5 + 0.5) = **0.5 A**, the voltage lost inside is 0.5 × 0.5 = 0.25 V and the terminal voltage is V = 1.5 − 0.25 = **1.25 V**. The load takes 0.625 W and the cell wastes 0.125 W, so the efficiency is 1.25 / 1.5 = 83.3%. The most power any load could take is E² / 4r = 1.125 W, with R = 0.5 Ω.

Record readings at R = 2.5 Ω (0.5 A, 1.25 V) and R = 1 Ω (1 A, 1 V): the line through them meets the V axis at 1.5 V and has slope −0.5 Ω, which gives back E and r.

## Tips

- A voltmeter across a cell on open circuit reads (very nearly) the emf, because no current flows.
- At maximum power transfer only half the energy reaches the load; power stations and batteries aim for high efficiency instead, with R much bigger than r.
- Old or cold cells have a bigger internal resistance, so their voltage sags more under load.

## FAQ

**Why does a car's headlights dim when it starts?** The starter motor draws a huge current, so I r is large and the battery's terminal voltage drops.

**Can the terminal voltage be more than the emf?** Yes, while the cell is being charged: the current flows in backwards and V = E + I r. The [[kirchhoff-solver]] shows a cell being charged.

**Is this an official NCERT resource?** No. fibub is independent; the page follows the topics in the syllabus in its own words.
