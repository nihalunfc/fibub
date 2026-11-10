---
title: "Asaoka vs hyperbolic settlement prediction: soft ground after dynamic compaction"
summary: "A 2026 Technologies case study tested Asaoka, exponential and hyperbolic methods on a year of settlement at a Yangtze river port. Fit all three yourself in a browser."
tools: [consolidation-settlement, curve-fitter, graph-digitizer]
updated: 2026-11-10
sources:
  - "Yang W, Ouyang J, Wang Z, Xie Y, Meng J, Zhang C (2026), Technologies 14(9): 590, the paper described here."
  - "Asaoka (1978) observational method; the hyperbolic settlement method; Terzaghi's one-dimensional consolidation theory: standard soil mechanics."
  - "The settlement readings and clay layer in the worked example are made up by fibub, not taken from the paper."
paper:
  title: "Post-Construction Settlement Prediction of Deep Lacustrine-Fluvial Soft Ground Improved by Vacuum Wellpoint Dewatering and Dynamic Compaction: An Engineering Case Study"
  authors: "Yang W, Ouyang J, Wang Z, Xie Y, Meng J, Zhang C"
  journal: "Technologies"
  year: 2026
  doi: "10.3390/technologies14090590"
  url: "https://www.mdpi.com/2227-7080/14/9/590"
  licence: "CC BY"
  reviewed: true
---

Once a soft site has been improved and built on, the owner wants to know one number: how much more will it settle? Engineers usually answer by fitting a curve to the first months of survey readings and extending it. A team in China compared three such curves on a year of readings at a river port terminal in Hunan, in a paper in Technologies in September 2026. The Asaoka method tracked the withheld readings best, the exponential was close, and the hyperbolic ran high. This page explains the study and shows how to fit all three with the [[curve-fitter]], then link the result to Terzaghi's theory with the [[consolidation-settlement]] calculator.

## What they found

At the end of 360 days the ground had settled 108.84 mm. Each method was fitted to readings up to day 180, 240 or 300, then asked to predict the rest. Asaoka's predictions for day 360 were 108.82 to 108.86 mm, with a mean error of about 0.02 mm on the held-back readings. The exponential gave 108.38 to 108.79 mm (about 0.19 mm), and the hyperbolic 109.23 to 110.05 mm (about 0.59 mm), drifting high. A COMSOL computer model of the site matched the measurements to within a few hundredths of a millimetre.

The authors are careful: the survey itself is only good to about ±1 mm, so the gap between Asaoka and the exponential is smaller than the measurement can resolve. They do not claim one is truly better.

## Why it matters

Ports, roads and warehouses on soft river and lake deposits can keep sinking for years, cracking slabs and tilting cranes. Deciding when to pave, or how much surcharge to leave on, depends on trusting the predicted final settlement. The hyperbolic method is popular because it is easy, so evidence that it can overpredict on improved ground is useful, as is the reminder to compare any method against the survey's own accuracy.

## How they did it

The site, about 200,000 m² on the Yangtze alluvial plain, has fill over layers of silty clay, mucky clay, clay and silt. It was treated first by **vacuum wellpoint dewatering** (wells 4 m deep on a 4 by 5 m grid, about 70 kPa of vacuum for 30 days) to draw water out, then by **dynamic compaction**: a heavy weight dropped in six passes of rising energy, 1,200 to 2,200 kJ, and a final lighter "ironing" pass. Each pass waited until most of the excess pore water pressure had gone. Fifteen settlement plates were levelled every 30 days, and piezometers sat at 5, 10 and 15 m. One full 360-day series of 12 readings was kept for the analysis.

## Check it yourself with fibub

We use **made-up readings**, not the paper's: settlements of 40, 63, 78, 87, 92 and 95 mm at days 30, 60, 90, 120, 150 and 180. If you want to work from a published plot instead, read its points off with the [[graph-digitizer]].

1. **Exponential.** In the curve fitter paste day and settlement and choose **Exponential decay with offset**, y = a·exp(−x/t) + c. It converges at c = **100.4 mm** (the final settlement), a = −99.2 mm and a time constant t = 60.7 days, with R² 0.9998 and a residual spread of 0.39 mm. It predicts 100.1 mm at day 360.
2. **Hyperbolic.** Pick **My own formula** and type x/(a + b*x), starting from a = 0.5 and b = 0.008. The fit gives a = 0.495 and b = 0.00758, so the final settlement 1/b is **132 mm**, and day 360 comes out at 111.7 mm, well above the exponential. R² is 0.995 with a spread of 1.6 mm: a good-looking fit that still overshoots, which is the pattern the paper reports.
3. **Asaoka.** Make pairs of each reading against the one before (40 then 63, 63 then 78, and so on, five pairs) and fit a **Straight line**. The intercept is 38.8 mm and the slope 0.614, so the final settlement is 38.8 / (1 − 0.614) = **100.5 mm**, agreeing with the exponential to 0.1 mm.
4. **Back-figure cv.** Late in consolidation, Terzaghi's theory makes settlement close to an exponential with time constant 4·Hdr²/(π²·cv), where Hdr is the drainage path. For a made-up 4 m clay layer drained top and bottom (Hdr = 2 m) and t = 60.7 days, cv is about **9.8 m²/year**.
5. **Check with Terzaghi.** In the consolidation settlement calculator enter one layer: Clay, 4 m, γ = 17.5 kN/m³, e0 = 1.0, Cc = 0.15, Cr = 0.03, σ′p = 0, water table 1 m, wide fill 30 kPa, cv 9.8 m²/year, drainage top and bottom. It gives about **102 mm**, 50 % in about 29 days and 90 % in about 126 days, close to our curve fits.

## The fine print

- One site and one complete 360-day series, though 15 points were surveyed.
- The day-360 reading is used as the reference, not a proven final settlement; creep may continue.
- Differences between Asaoka and exponential are below the ±1 mm levelling accuracy.
- Raw pore pressure and groundwater records were not kept, so the model's hydraulic side could not be checked.
- There was no mesh sensitivity study, no comparison with other treatments, and no cost or carbon data.
- Real designs need site investigation and a qualified geotechnical engineer.
