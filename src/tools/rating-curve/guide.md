---
name: Rating curve fitter
num: 144
shelf: science
section: hydrology-and-water-resources
title: "Rating curve fitter: stage-discharge curve Q = a(h − h0)^b from river gaugings"
summary: "Fit a stage-discharge rating curve to your river gaugings, Q = a (h − h0)^b, with the zero-flow stage fitted or typed and an optional second segment above a break stage. See the scatter, gaugings that sit off the curve, a 95 % range, the discharge for any stage, the stage for any discharge and a rating table to download. Paste or open a file."
status: live
ads: true
order: 5
icon: curve
works: offline
updated: 2026-11-08
related: [manning-weir-calculator, flood-frequency, runoff-calculator, uncertainty-calculator]
sources:
  - "The power-law rating curve Q = a (h − h0)^b fitted by least squares on logarithms, with h0 as the stage of zero flow: standard hydrometric practice, as described for example in the WMO Manual on Stream Gauging (WMO-No. 1044, 2010) and ISO 18320 (equations only; no tables reproduced)."
  - "Confidence ranges from ordinary least-squares regression on the logarithms with Student's t; the zero-flow stage is found by a one-dimensional search that minimises the misfit."
  - "Checked against SciPy curve_fit and linregress in the tests. The example gaugings are made up, drawn at random by fibub."
flow:
  - { icon: table, label: "Gaugings" }
  - { icon: curve, label: "Fit" }
  - { icon: target, label: "Check" }
  - { icon: download, label: "Table" }
---

## What it does

River gauges record the **stage**, the height of the water surface, every few minutes. Discharge, the volume of water passing each second, is measured only now and then, by **gaugings** with a current meter or an acoustic profiler. A **rating curve** links the two, so the stage record can be turned into a flow record.

Most rating curves follow a power law set by the channel's **control** (a riffle, a weir, or the channel itself):

Q = a (h − h0)^b

where h0 is the stage at which flow stops, a scales the curve and b describes the shape of the control (about 1.5 for a rectangular section or a weir, 2.5 for a V shape, about 1.6 to 1.7 for a natural channel).

This tool fits the curve to your gaugings, shows how well they agree, and turns stages into discharges.

## How to use it

1. Paste or open your **gaugings**: stage and discharge per row. Columns named stage, level or gauge height and discharge, flow or Q are found by name; dates and notes are ignored.
2. Type the units for the labels.
3. Leave **h0** blank to fit it, or type a surveyed value (the lowest point of the control).
4. Choose **two segments** if the control changes, for example when the river spills onto its floodplain, and give the break stage. Each segment gets its own curve; the tool shows the step between them at the break so you can move the break until they meet.
5. Set the percentage for **flagging** gaugings that sit far off the curve.
6. Use the last card for the **discharge at a stage**, the **stage for a discharge**, and a **rating table** at any step, ready to download as CSV.

## What the results mean

- **Scatter** gives the range that 95 % of single gaugings fall within around the curve, as a percentage. Good stations manage about ±5 to 10 %.
- **Gaugings off the curve** may be measurement errors, or a sign that the channel has changed (weed growth, a flood that moved the gravel). A run of gaugings all on one side over time means the rating needs a shift or a new curve.
- The **95 % range** in the table is for the mean curve; it widens quickly beyond the gauged range.

## Worked example

The 24 made-up gaugings run from 0.64 m to 3.04 m stage and 1.6 to 62 m³/s. The fit gives **Q = 11.61 (h − 0.3406)^1.681**, with single gaugings within about −7.0 % to +7.5 % of the curve. At 2.5 m the curve gives 42.4 m³/s; 30 m³/s needs a stage of about 2.1 m. Typing a surveyed h0 of 0.30 m instead gives Q = 10.60 (h − 0.30)^1.764.

## FAQ

**Can I extend the curve above my highest gauging?** Only with care. Flow above the gauged range often follows a different control (the floodplain), so extrapolation can be badly wrong. A hydraulic calculation such as the Manning and weir flow calculator can help check it.

**Why fit on logarithms?** Gauging errors are roughly a fixed percentage of the flow, so fitting the logarithms weighs a 5 % error the same at low and high flows.

**Does it handle hysteresis or shifts?** No. Loops from rising and falling floods and gradual shifts need dated gaugings and more advanced methods.
