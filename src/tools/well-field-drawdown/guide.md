---
name: Well field drawdown
num: 129
shelf: science
section: hydrogeology
title: "Well field drawdown calculator: Theis superposition for several wells, boundaries by image wells, and capture zones"
summary: "Add up the drawdown from several pumping or injection wells that start at different times, with an optional river or no-flow boundary. Draw a contour map at any day, follow one point over time, and find the capture zone of a well in regional flow."
status: live
ads: true
order: 5
icon: target
works: offline
updated: 2026-11-08
related: [pump-test-analyser, darcy-flow-calculator, slug-test-analyser, piper-diagram]
sources:
  - "Theis solution, superposition in space and time, and the method of image wells for straight boundaries: standard hydrogeology, written by fibub from the equations."
  - "Capture zone of one well in uniform flow (stagnation point Q/(2πBq), width Q/(Bq)): the classic analytical solution, written from the stream function."
  - "Example data are made up by fibub for illustration."
flow:
  - { icon: table, label: "Wells" }
  - { icon: calculator, label: "Superpose" }
  - { icon: target, label: "Contour map" }
  - { icon: compass, label: "Capture zone" }
---

## What it does

When several wells pump from the same aquifer, their **cones of depression** overlap and the drawdowns add up. A town well field, a dewatering scheme on a building site or a farm with a few boreholes all work this way. This tool adds up the **Theis** drawdown from each well. Each well can start on a different day, and an injection well is simply a negative rate.

It can also include one straight **boundary**:

- A **no-flow** boundary, such as a rock wall or a sealed fault, makes the drawdown larger.
- A **constant-head** boundary, such as a river or a lake that feeds the aquifer, makes it smaller and lets it level off.

The boundary is handled the classic way, with a mirror-image well on the other side of the line.

The second card draws the **capture zone** of one well in a regional flow: the area whose water ends up in the well. That matters for protecting a drinking-water well, or for designing a pump-and-treat clean-up.

Get T and S for each well from the [[pump-test-analyser]], and the groundwater flow between wells from the [[darcy-flow-calculator]].

## How to use it

1. Enter the aquifer's transmissivity T (m²/day), storativity S and the well radius.
2. Paste or open the wells: name, x (east) and y (north) in metres, the pumping rate in m³/day and the day each starts.
3. Optional: add a boundary along a north–south or east–west line.
4. Choose the day for the map and an observation point to follow over time.
5. For the capture zone, enter the well's rate, the aquifer thickness, K and the regional gradient.

## Worked example

All numbers are made up. In an aquifer with T = 500 m²/day and S = 0.0001, PW1 pumps 800 m³/day from day 0. PW2 starts at 500 m³/day on day 10, and PW3 at 300 m³/day on day 20. On day 30 the drawdown at the point (200, 100) is **2.17 m**. Add a river along x = −300 m as a constant-head boundary, and it falls to **0.749 m**, because the river feeds the aquifer.

For the capture zone, a well pumping 800 m³/day from a 20 m thick aquifer with K = 25 m/day and a gradient of 0.002 gives a Darcy flux of 0.05 m/day. Its **stagnation point is 127 m downstream** and the zone is **800 m wide** far upstream.

## Good to know

- Theis assumes a confined aquifer of even thickness. For an unconfined aquifer the answers are fair while the drawdown stays small compared with the saturated thickness.
- Drawdown right at a pumping well also depends on well losses, which this tool leaves out.
- Real capture zones are shaped by recharge, layering and changing flow, so treat these as first estimates.

## FAQ

**Can I model recovery when a pump stops?** Yes. Add the same well again with a negative rate starting on the day it stops.

**How many wells?** Up to 50. The map is computed on a 70 × 70 grid, so it stays quick.
