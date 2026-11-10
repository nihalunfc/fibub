---
name: Pressure buildup analyser
num: 688
shelf: science
code: T484
section: petroleum-engineering
title: "Pressure buildup test analysis: Horner plot, MDH, permeability, skin, p* and Bourdet derivative"
summary: "Paste or open shut-in pressures from a buildup test and get permeability, skin, p*, the pressure drop from skin and the radius of investigation from a Horner or MDH straight line (picked automatically or by you), with a log-log Bourdet derivative plot to spot wellbore storage, radial flow and boundaries."
status: live
ads: true
order: 688
icon: chart
works: offline
updated: 2026-11-09
related: [decline-curve, pvt-correlations, pump-test-analyser, slug-test-analyser, darcy-flow-calculator, well-field-drawdown]
sources:
  - "Horner, D. R. (1951), Pressure build-up in wells, Proceedings of the Third World Petroleum Congress; Miller, C. C., Dyes, A. B. and Hutchinson, C. A. (1950), Journal of Petroleum Technology 2(4): the semi-log buildup methods, with the standard oilfield-unit constants (162.6, 1.1513, 3.2275, 0.029) as given in petroleum engineering textbooks."
  - "Bourdet, D., Ayoub, J. A. and Pirard, Y. M. (1989), Use of pressure derivative in well-test interpretation, SPE Formation Evaluation 4(2): the derivative and its smoothing window."
  - "Example data made up by fibub from the line-source (exponential integral) solution with skin and an image well for a sealing fault; checked against an independent SciPy/NumPy script, no code copied."
flow:
  - { icon: table, label: "Pressures" }
  - { icon: ruler, label: "Line" }
  - { icon: sigma, label: "k and skin" }
  - { icon: curve, label: "Derivative" }
---

## What it does

When a producing oil well is shut in, the bottomhole pressure rises back towards the reservoir pressure. How fast it rises tells you how permeable the rock is, whether the near-wellbore zone is damaged or stimulated (**skin**), and what the average reservoir pressure is heading for. This tool does the classic **pressure buildup** analysis:

- The **Horner plot** (pressure against log of (tp + Δt)/Δt) and the **MDH plot** (pressure against log Δt), with a semi-log straight line through the radial-flow points, picked automatically or over a range you choose.
- From the slope m: **permeability-thickness kh = 162.6 qBµ/m** and permeability k.
- **Skin** s = 1.1513 [(p1hr − pwf)/m − log(k/φµct rw²) + 3.2275], the **pressure drop due to skin** 0.869 m s and the flow efficiency.
- **p\***, the Horner line extrapolated to infinite shut-in time, and the **radius of investigation** 0.029 √(kΔt/φµct).
- The **Bourdet derivative** on a log-log plot, the standard diagnostic for wellbore storage, radial flow and boundaries.

Get the oil viscosity and formation volume factor from the [[pvt-correlations]] first, and forecast the well's production with the [[decline-curve|decline curve analysis]].

## How to use it

1. **Paste or open your data**: shut-in time in hours and pressure in psia. Include the row at Δt = 0 (the flowing pressure just before shut-in), or type pwf.
2. **Enter the well and fluid data**: the stabilised rate before shut-in, the producing time tp, Bo, viscosity, net thickness, porosity, total compressibility and wellbore radius.
3. **Look at the log-log plot first.** Radial flow is where the derivative is flat. The automatic choice takes the longest flat stretch; type "Line from" and "to" to choose it yourself.
4. Switch between Horner and MDH; MDH is fine when the shut-in is short compared with tp, but it gives no p*.

## Worked example

The made-up example is built from the line-source solution for a well with k = 35 md and skin +3, 350 ft from a sealing fault (q = 250 STB/d, tp = 480 h, Bo 1.2, µ 0.9 cP, h 40 ft, φ 0.18, ct 1.2 × 10⁻⁵ 1/psi, rw 0.35 ft), with a little noise. The derivative is flat at about 13.6 psi from the start until about 10 hours, then rises as the fault is felt, heading for double that level.

The automatic line uses 30 points from 0.0126 to 10 h. The Horner slope is **m = 31.32 psi/cycle**, so kh = 1402 md·ft and **k = 35.04 md**. With pwf = 3846.71 psia and p1hr = 4083.21 psia, the **skin is +3.006**, a pressure drop of 81.81 psi from skin and a flow efficiency of 74.5 %. **p\* = 4167.21 psia**; it is below the true initial 4200 psia because the fault has already lowered the pressure near the well. At 100 h the radius of investigation is 1231 ft.

## Tips

- Points before the derivative flattens are affected by wellbore storage and the near-well zone; points after it changes are affected by boundaries or other wells. Leave both out of the straight line.
- A derivative level that disagrees with m/ln 10 (shown under "Derivative check") means the line is not on radial flow.
- Producing time: if the rate varied, use the Horner approximation tp = 24 × cumulative production ÷ last rate.

## FAQ

**Can I use it for gas wells?** Not directly: gas needs pseudo-pressure. For a rough look at low-pressure gas, the equations here are not right.

**Why no wellbore storage model or type-curve match?** This tool covers the straight-line methods and the derivative diagnostic. Full model matching is a job for dedicated well-test software.

**Is my test data uploaded?** No. Everything runs in your browser and works offline.
