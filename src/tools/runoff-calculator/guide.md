---
name: Rainfall runoff calculator
num: 141
shelf: science
code: T141
section: hydrology-and-water-resources
title: "Rational method and SCS curve number calculator: storm runoff, peak flow and time of concentration"
summary: "Estimate the peak flow from a small catchment with the rational method (Q = CiA, Kirpich time of concentration, your own rainfall intensity curve) and the runoff depth, volume and triangular hydrograph from the SCS (NRCS) curve number method, with dry, average and wet ground. Area-weighted C and CN for mixed land use. SI or US units."
status: live
ads: true
order: 2
icon: chart
works: offline
updated: 2026-11-08
related: [manning-weir-calculator, trend-analyser, koppen-climate, darcy-flow-calculator]
sources:
  - "Rational method (Q = CiA), Kirpich (1940) time of concentration and intensity-duration curves of the form i = a/(t + b)^c: standard hydrology, for example Chow, V. T., Maidment, D. R. and Mays, L. W. (1988), Applied Hydrology (equations only)."
  - "SCS curve number method, the dry and wet condition conversions and the triangular unit hydrograph: USDA Natural Resources Conservation Service, National Engineering Handbook Part 630 Hydrology and Technical Release 55 (public domain), and Chow, Maidment and Mays (1988). The 0.05 initial abstraction option uses the S conversion factor 1.42 from Hawkins and others (2002)."
  - "Typical C and CN values for each land use are rounded, general figures chosen by fibub for a first estimate, not copied from any table. The return period factors are the commonly quoted round numbers."
  - "Checked against an independent Python calculation written for the tests. The example catchment and its rainfall curve are made up."
flow:
  - { icon: mountain, label: "Catchment" }
  - { icon: clock, label: "Time to peak" }
  - { icon: calculator, label: "Peak flow" }
  - { icon: chart, label: "Runoff" }
---

## What it does

When rain falls on a catchment, some soaks in and some runs off to the nearest ditch, drain or stream. This tool gives two everyday estimates of how much runs off:

- The **rational method**, Q = C × i × A, gives the **peak flow** from a small catchment, used to size gutters, pipes, culverts and ditches.
- The **SCS curve number method** (now the NRCS method) gives the **depth and volume** of runoff from a whole storm, used to size ponds and to compare land uses, and a simple triangular hydrograph shows when the flow peaks.

Both start from the same catchment: split it into parts by land use, give each an area, a runoff coefficient C and a curve number CN, and the tool works out the area-weighted values.

For the flow a channel can carry, use the [[manning-weir-calculator]]; for a full hydrograph over time, the [[unit-hydrograph]].

## How to use it

1. Choose **SI** (hectares, millimetres, metres) or **US** (acres, inches, feet).
2. Fill in up to four **parts** of the catchment. The **Typical** list fills C and CN with rounded starting values for a medium soil; change them for your soil and local guidance. Empty rows are skipped.
3. Give the **longest flow path** and its average **slope** to get the **time of concentration** by the Kirpich formula, the time water takes to travel from the far edge to the outlet. If you know it from elsewhere, type it instead.
4. For the rational method, give a rainfall **intensity**, or the three constants of your local **intensity-duration-frequency** curve, i = a / (t + b)^c, so the tool reads the intensity at the time of concentration. Pick a **return period adjustment** for rare storms.
5. For the curve number method, give the storm **rainfall** and **duration**, the state of the ground before the storm, and the initial abstraction ratio.

## What the results mean

- **C** is the share of the rain falling at the peak that leaves as flow: about 0.9 for roofs and paving, under 0.3 for grass and woods.
- **CN** runs from about 30 (deep sand under forest, almost nothing runs off) to 98 (paving). The **potential retention** S is the most the ground could hold, and the **initial abstraction** Ia is the rain held on leaves, in hollows and in the soil before any runs off.
- **Dry and wet ground** (conditions I and III) change CN a lot: a field after a week of rain behaves very differently from the same field in a drought.
- The **triangular hydrograph** spreads the runoff over time: it rises to its peak at Tp = D/2 + 0.6 tc and ends at 2.67 Tp.

## Worked example

A made-up 20 ha catchment: 12 ha of houses with gardens (C 0.45, CN 75) and 8 ha of pasture (C 0.25, CN 61). The area-weighted C is 0.37 and CN 69.4. The longest flow path is 600 m at a slope of 0.02, so Kirpich gives a time of concentration of 12.1 minutes. With a made-up rainfall curve a = 1500, b = 12, c = 0.8, the intensity at 12.1 minutes is 118 mm/h and the **peak flow is 2.42 m³/s**.

For an 80 mm storm lasting an hour on average ground, S = 112 mm and Ia = 22.4 mm, so **19.6 mm runs off** (24.5 %), a volume of 3,913 m³. The triangular hydrograph peaks at 1.31 m³/s, 0.62 hours after the rain starts.

## FAQ

**Why do the two methods give different peaks?** They answer different questions. The rational method assumes the most intense burst of rain lasting exactly the time of concentration; the curve number hydrograph spreads a whole storm's runoff over time. Design manuals say which one to use for which job.

**How big a catchment can I use?** The rational method is meant for small areas, under about 80 ha (200 acres). The curve number method works for larger catchments, but the single triangle is crude for long storms or long, thin catchments; a full unit hydrograph model does better.

**Is this good enough for a design?** It is a first estimate and a sense check. Real drainage design follows local rules, local rainfall data and a qualified engineer's judgement.
