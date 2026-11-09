---
name: Manning and weir flow calculator
num: 140
shelf: science
section: hydrology-and-water-resources
title: "Manning's equation calculator: channel and part-full pipe flow, normal and critical depth, plus weir discharge"
summary: "Work out the discharge or normal depth in a rectangular, trapezoidal or triangular channel or a part-full pipe with Manning's equation, with velocity, Froude number, critical depth, specific energy, bed shear and a rating curve; and the flow over sharp-crested, V-notch, broad-crested or Cipolletti weirs, or the head for a given flow. SI or US units."
status: live
ads: true
order: 1
icon: ruler
works: offline
updated: 2026-11-08
related: [wave-calculator, darcy-flow-calculator, trend-analyser, uncertainty-calculator]
sources:
  - "Manning's equation, critical flow, specific energy and bed shear stress: standard open-channel hydraulics, for example Chow, V. T. (1959), Open-Channel Hydraulics, and Chanson, H. (2004), The Hydraulics of Open Channel Flow (equations only)."
  - "Weir equations: the sharp-crested rectangular weir with Francis's (1883) end contraction, the triangular (V-notch) weir, the broad-crested weir with critical depth on the crest, and the Cipolletti weir, as given in hydraulics textbooks and the US Bureau of Reclamation Water Measurement Manual (public domain)."
  - "Typical Manning's n values are rounded, general figures chosen by fibub for a first estimate, not copied from any table."
  - "Checked against an independent SciPy calculation written for the tests. The example channel and weir are made up."
flow:
  - { icon: ruler, label: "Channel" }
  - { icon: calculator, label: "Manning" }
  - { icon: curve, label: "Rating" }
  - { icon: chart, label: "Weir" }
---

## What it does

**Manning's equation** is the everyday formula for water flowing steadily down a ditch, canal, river reach, culvert or part-full sewer:

Q = (k / n) × A × R^(2/3) × √S

where A is the flow area, R the hydraulic radius (area ÷ wetted perimeter), S the bed slope, n the roughness and k = 1 in SI units or 1.486 in US units. This tool solves it either way: the **discharge** for a known depth, or the **normal depth** that carries a given discharge. It also gives the velocity, the **Froude number** and flow regime, the **critical depth**, specific energy and the average bed shear stress, draws the cross-section and a rating curve.

The second card handles **weirs**, the simple structures used to measure flow in channels and streams: give the head over the crest to get the discharge, or the discharge to find the head.

To fit flows to measured levels instead, use the [[rating-curve]]; for the peak flow arriving from the catchment, the [[runoff-calculator]].

## How to use it

1. Choose **SI** (metres, m³/s) or **US** (feet, ft³/s).
2. Pick the **shape** and its sizes. Side slope z is horizontal distance per 1 vertical (2 means 2 : 1). For a pipe give the diameter.
3. Give the **bed slope** as a fraction (0.001 is 1 in 1,000, or 1 m drop per km) and **Manning's n**. The typical values in the list are rounded starting points: clean concrete about 0.013, a clean earth channel about 0.022, a natural stream 0.035 or more.
4. Choose whether to find the **discharge** or the **normal depth**.
5. For a weir, pick the type, size and coefficient, and type the head or the discharge.

## What the results mean

- **Froude number** below 1 is calm (subcritical) flow, typical of rivers and gentle channels; above 1 is fast, shallow (supercritical) flow, as on spillways. Near 1 the surface is wavy and unstable.
- **Critical depth** is where the flow has the least specific energy for its discharge. If the normal depth is above it, the slope is "mild"; below it, "steep".
- **Part-full pipes:** a circular pipe carries the most at about 94 % full, a little more than when flowing full, because the last few percent adds lots of wetted perimeter and little area.
- **Bed shear stress** helps check whether a lining or soil will scour.

## Worked example

A made-up earth canal: trapezoid with a 2 m bottom and 2 : 1 side slopes, n = 0.025, slope 0.0005, flowing 1.2 m deep. Area = 2 × 1.2 + 2 × 1.2² = 5.28 m², wetted perimeter = 2 + 2 × 1.2 × √5 = 7.37 m, R = 0.717 m. Manning gives **Q = 3.78 m³/s** at 0.716 m/s. The Froude number is 0.26 (subcritical) and the critical depth 0.584 m, so the slope is mild. A sharp-crested rectangular weir 2 m long with two end contractions and Cd = 0.62 passes **0.889 m³/s** at a 0.4 m head.

## FAQ

**Is the flow really uniform?** Manning assumes steady, uniform flow, with depth parallel to the bed. Near bridges, bends, gates and changes in slope the depth differs; that needs a backwater calculation.

**Can I use it for a full pipe under pressure?** No. A pressurised pipe needs a pipe friction formula such as Darcy-Weisbach or Hazen-Williams.

**Can I design a culvert or sewer with it?** Use it for a first estimate and a sense check. Real designs need inlet and outlet losses, backwater, local rules and a check by a qualified engineer with a full hydraulic model.
