---
title: "Rating curve uncertainty across 173 Quebec river gauges"
summary: "A 2025 HESS study fitted power-law rating curves to 10,087 gaugings at 173 Quebec stations and measured how uncertain the flows are. See how to fit and test your own."
tools: [rating-curve, trend-analyser, flood-frequency]
updated: 2026-11-10
sources:
  - "Mailhot A, Talbot G, Bolduc S, Fortier C (2025), Hydrology and Earth System Sciences 29: 3615-3627, CC BY 4.0, the paper described here."
  - "Power-law rating curve Q = a (h − h0)^b and the Pettitt change-point test (Pettitt 1979, Applied Statistics 28: 126-135): standard hydrometry and statistics."
  - "The gaugings and residuals in the worked example are made up by fibub."
paper:
  title: "Assessment of uncertainties in stage–discharge rating curves: a large-scale application to Quebec hydrometric network"
  authors: "Mailhot A, Talbot G, Bolduc S, Fortier C"
  journal: "Hydrology and Earth System Sciences"
  year: 2025
  doi: "10.5194/hess-29-3615-2025"
  url: "https://hess.copernicus.org/articles/29/3615/2025/"
  licence: "CC BY 4.0"
  reviewed: true
---

Most river flow records are not measured directly. A gauge logs the water level, and a rating curve turns each level into a flow. So how much should we trust those flows? A Quebec team fitted rating curves to more than ten thousand field measurements at 173 stations, and put a number on the error of each curve. They published the study in Hydrology and Earth System Sciences in August 2025. Here is what they did, and how to fit and stress-test your own curve with the [[rating-curve|rating curve fitter]], then look for a channel shift with the [[trend-analyser]].

## What they found

The stations are run by Quebec's environment ministry. Together they had 10,087 open-water gaugings, about 58 per station, collected over 3 to 98 years. A gauging is a field visit that measures the flow by hand and notes the water level at that moment.

- **Channels change.** Only 96 stations (55.5 %) could keep one curve for their whole history. The rest needed two or more, because the river bed or banks had shifted. In all, the team fitted 348 curves, about two per station (16 were set aside, leaving 332 for the error analysis).
- **Most curves are simple.** About 90 % were a single power law. The rest needed two pieces joined at a level where the control changes.
- **The typical error is modest.** For three curves in four, the spread of gaugings around the curve stayed the same at every level, with a standard deviation of about 6.5 %.
- **Low flows are the weak spot.** For about a quarter of the curves, the spread grew as the water dropped, and at the lowest levels it went past 20 % for some of them.
- **Floods are rarely gauged.** At 52 % of stations, the highest gauging sits below the level of a 5-year flood. So every bigger flood in those records comes from stretching the curve past the data.

The authors also flagged odd exponents. The power in the curve ranged from 1.1 to 18.8, with a mean of 2.5 (one section of the paper says the typical single-curve exponent is close to 2). About 18 % of single curves went past 8/3, a value the authors treat as suspicious.

## Why it matters

Flood maps, drought plans and dam rules all start from flow records. If the high flows are an extrapolation, the 100-year flood built on them inherits that guess. The study gives a method an agency can run on a whole network, not one showcase gauge.

## How they did it

Each curve has the form Q = a (h − h0)^b. Here Q is the flow, h is the water level (the stage), h0 is the stage at which flow stops, and b is the exponent. The team found a, h0 and b by minimising the squared relative error. To spot a change in the channel, they ran a Pettitt test on the gaugings' errors in time order and split the record at any break. A runs test then checked whether the errors wandered with stage. If they did, a two-piece curve replaced the single one. Last, they fitted several error models (normal or logistic, with a spread that is constant or changes with stage) and kept the best by an information criterion.

## Check it yourself with fibub

The fitter takes stage and discharge pairs and fits the same power law. One difference: it fits by least squares on the logarithms, which treats a 5 % error the same at every flow, close in spirit to the paper's relative-error fit. Here is a made-up example.

1. Open the [[rating-curve]] and paste ten invented gaugings, one per row as stage then flow: stages 0.45, 0.60, 0.75, 0.90, 1.05, 1.25, 1.45, 1.70, 1.95 and 2.20 m, with flows 0.80, 1.85, 2.95, 4.60, 6.10, 8.90, 11.6, 15.9, 19.5 and 24.8 m³/s.
2. Leave h0 blank so it is fitted. The tool gives about Q = 8.42 (h − 0.224)^1.58, with single gaugings scattering from −4.9 % to +5.2 % (95 % range). The exponent sits well inside the range the authors treat as normal.
3. In "Discharge at stage", type 3.5 m. That is far above the top gauging at 2.20 m, and the tool flags it as outside the gauged range. It gives about 54.9 m³/s.
4. Now type a surveyed h0 of 0.20 m instead. The fit becomes about Q = 8.03 (h − 0.20)^1.64. At 1.2 m the flow barely moves (8.10 versus 8.03 m³/s). At 3.5 m it rises to about 57.0 m³/s, roughly 4 % higher. That is the paper's warning in small: choices that do not matter inside the data matter a lot beyond it.
5. To look for a shift in the channel, paste your gaugings in date order and set the flag threshold to 0.1 %, so every gauging is listed with its percentage off the curve. Copy those into the [[trend-analyser]]. With made-up errors of 1.5, −2.0, 0.8, −1.2, 2.1, −0.5, 0.3, −1.6, then 6.5, 8.1, 5.2, 7.4, 9.0 and 6.1 %, the Pettitt test puts the break after the eighth gauging (K = 48, p ≈ 0.02). Refit the curve to each part, as the authors did.
6. If you then build a flood record from the curve, test it with the [[flood-frequency|flood frequency tool]], and keep in mind which peaks lie above your highest gauging.

## The fine print

The study covers open-water gaugings only, so ice-affected winter flows are outside it. The error models describe the scatter of gaugings around a curve. They do not include the error of each gauging itself, or the extra doubt that comes with extrapolation. The authors also note that the paper gives two different shares for the two most common error models in different sections, so treat those two figures with care. Rivers with sandy, shifting beds may behave differently.
