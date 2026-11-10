---
name: Earthquake locator
num: 878
shelf: science
code: T613
section: geophysics-and-seismology
title: "Earthquake locator"
summary: "Paste P and S arrival times from three or more seismic stations. Get each station's S−P distance, the epicentre and origin time by least squares (Geiger's method, on a flat map or the globe), optional depth, error estimates, a map with distance circles, local magnitude ML from amplitudes, and Mw from seismic moment or fault size."
status: live
ads: true
order: 878
icon: target
works: offline
updated: 2026-11-09
related: [stereonet, uncertainty-calculator, traverse-calculator, seismogram-viewer, phone-seismometer, seismic-refraction, utm-converter]
sources:
  - "S−P distance, straight-ray travel times in a uniform half-space and Geiger's (1910) least-squares location with Marquardt damping are standard seismology, written by fibub and checked against SciPy's least_squares on the same data."
  - "Local magnitude: Hutton and Boore (1987), as adopted in the IASPEI (2013) magnitude standards: ML = log10 A + 1.11 log10 R + 0.00189 R − 2.09 (A in nm)."
  - "Moment magnitude: IASPEI (2013) standard Mw = (2/3)(log10 M0 − 9.1), with M0 = μ A D (Aki 1966). The default rigidity of 30 GPa is a rounded typical value; change it to suit your rocks."
  - "The example earthquake, stations, times and amplitudes are made up by fibub."
flow:
  - { icon: table, label: "Arrivals" }
  - { icon: sliders, label: "Speeds" }
  - { icon: target, label: "Epicentre" }
  - { icon: chart, label: "Magnitude" }
---

## What it does

When an earthquake happens, the fast P wave reaches each seismometer first and the slower S wave follows. The gap between them, the **S−P time**, grows with distance, so one station tells you how far away the earthquake was, and three or more stations tell you where it was. This page does the whole classroom-to-observatory routine in your browser:

- **S−P distance** for every station: d = Δt × Vp × Vs ÷ (Vp − Vs).
- **Epicentre, origin time and depth** by least squares. Starting from a guess, it repeatedly adjusts the position and origin time to make the predicted P and S arrival times match all the picks as closely as possible (Geiger's method, with Marquardt damping so it does not overshoot). Depth can be held fixed or solved for.
- **Error estimates** (one standard error) for the epicentre in km east and north, the origin time and the depth, from the scatter of the residuals, plus the **azimuthal gap**: the largest angle between stations as seen from the epicentre.
- **A map** with each station, a dashed circle at its S−P distance, and the located epicentre. The circles should cross near the diamond.
- **Local magnitude ML** for every station that has an amplitude, using its distance from the located earthquake, and the network mean.
- **Moment magnitude Mw** from a seismic moment, or from the fault length, width, slip and rock rigidity.

Pick the P and S arrival times in the [[seismogram-viewer]] first, and compare the fault plane with your field measurements on the [[stereonet]].

## How to use it

1. Choose how station positions are given: **latitude and longitude** (distances along the Earth's surface, best for regional networks) or **x and y in km** on a flat local grid.
2. Enter the **P speed** and either the **Vp/Vs ratio** (about 1.73 for many crustal rocks) or the S speed. Switching between them converts the number for you.
3. Enter a **depth**. Tick *Solve for depth too* to let the fit find it; the number then becomes the starting guess.
4. Paste or open a table: station name, the two position columns, P time, S time and, if you have it, the amplitude. Times can be seconds (12.35) or clock times (12:00:09.79). Leave a time blank or put "-" if that phase was not picked.
5. Read the location, the errors and the table of residuals. A residual is the observed minus the predicted time; large ones point to a mis-pick or a wrong speed.

## Magnitudes

**ML** uses the Hutton and Boore (1987) distance correction that IASPEI adopted as its standard: ML = log10 A + 1.11 log10 R + 0.00189 R − 2.09, where A is the zero-to-peak amplitude of the Wood-Anderson record converted to ground displacement in nanometres and R is the distance from the hypocentre in km. If you measured the amplitude on a Wood-Anderson trace in millimetres, keep the default unit and the page divides by the standard magnification of 2080 for you. The scale was set up for distances of about 10 to 600 km; local networks often add their own station corrections.

**Mw** comes from the seismic moment M0 in newton metres: Mw = (2/3)(log10 M0 − 9.1). M0 itself is the rigidity of the rock times the fault area times the average slip.

## Worked example

The page opens with a made-up earthquake recorded at six stations, with small timing errors added. With Vp 6.0 km/s, Vp/Vs 1.73 and the depth fixed at 10 km, the fit gives the epicentre at **45.0824° N, 10.2189° E**, origin time **12:00:04.99** ± 0.01 s, an RMS residual of **0.032 s** and an epicentre error of about ± 0.07 km. Station STA1, with S−P = 3.51 s, is 28.8 km from the hypocentre. The amplitudes give **ML 3.4** (station values 3.32 to 3.43). Tick *Solve for depth too* and the depth comes out at 9.8 ± 0.60 km.

For Mw, a moment of 1.5 × 10¹⁵ N·m gives **Mw 4.05**. A 10 km × 5 km fault that slipped 0.5 m in rock of rigidity 30 GPa has M0 = 7.5 × 10¹⁷ N·m and **Mw 5.85**.

## Good to know

- One uniform layer with straight rays is a simplification. Real crust gets faster with depth, so distant stations are reached sooner than this model expects. For local events within a network it works well; for anything serious, use your network's velocity model.
- Depth is only well fixed when the nearest station is closer than about the depth. Otherwise depth and origin time trade off, and the error grows.
- With only three stations and P times alone there is exactly one answer and no spare data, so no error estimate is possible. Add S times or stations.
- Small circles that miss each other usually mean the Vp/Vs ratio is off.

## FAQ

**Why do the circles not meet exactly?** Picks have errors, and the speeds are only estimates. The least-squares epicentre is the best compromise between all of them.

**Can I use it for teleseismic (distant) earthquakes?** No. Over thousands of kilometres rays curve deep through the mantle, and you need travel-time tables. This page is for local and regional events.

**Is my data sent anywhere?** No. Everything is worked out on this page and nothing leaves your device.
