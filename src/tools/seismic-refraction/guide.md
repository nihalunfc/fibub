---
name: Seismic refraction interpreter
num: 882
shelf: science
code: T617
section: geophysics-and-seismology
title: "Seismic refraction: layer speeds and depths from first-arrival picks by intercept-time and crossover methods, dipping layers and travel-time curves"
summary: "Paste first-arrival picks from a forward shot and, if you have one, a reverse shot. The page splits them into 2 or 3 layers, fits each line, and gives speeds, depths by the intercept-time and crossover methods, a dipping-layer solution from the two shots, reciprocal time check and a forward model to compare."
status: live
ads: true
order: 882
icon: chart
works: offline
updated: 2026-11-09
related: [earthquake-locator, gravity-corrections, level-book-reducer, plot-maker, seismogram-viewer, ves-inversion, gpr-viewer, cross-section-profile]
sources:
  - "Straight-line travel times of direct and head waves, the intercept-time and crossover-distance depth formulas and the two-shot dipping-layer solution are standard refraction seismology (for example Telford, Geldart and Sheriff, Applied Geophysics; Kearey, Brooks and Hill, An Introduction to Geophysical Exploration), written by fibub from the formulas."
  - "Checked against first-arrival times found independently by Fermat's principle (SciPy minimisation over the ray path) for flat and dipping layers."
  - "The example picks are made up by fibub from a dipping three-layer model with small errors added."
flow:
  - { icon: table, label: "Picks" }
  - { icon: sliders, label: "Layers" }
  - { icon: chart, label: "Lines" }
  - { icon: ruler, label: "Depths" }
---

## What it does

In a refraction survey you set off a small source (a hammer on a plate, a weight drop or a charge) and record the first arrival at a line of geophones. Near the shot the first wave travels straight through the top layer. Further out, waves that run along the top of a faster layer underneath overtake it. Plotted as time against distance, the picks fall on straight lines, one per layer, and the slopes and intercepts give the speed and depth of each layer. This page does the whole interpretation:

- **Layer breaks.** It splits the picks into 2 or 3 straight lines by trying every split and keeping the best fit in which speeds increase with depth. You can type your own breaks instead.
- **Speeds** from the slopes (speed = 1 ÷ slope), with the direct-wave line forced through zero if you wish.
- **Thicknesses by the intercept-time method**, for flat layers: ti = Σ 2h cos θ / V, solved layer by layer.
- **Thicknesses by the crossover method**, which uses only the speeds and the offsets where the lines cross: for two layers h = (xc/2)√((V2 − V1)/(V2 + V1)).
- **Dipping layer.** With a reverse shot at the far end, the slower apparent speed is shot down-dip and the faster one up-dip. The page gives the true refractor speed, the dip, and the depth under each shot (vertical and at right angles to the layer).
- **Reciprocal times.** The time from one shot to the other should be the same both ways, a good check on picks and on the shot positions.
- **Forward model.** Type speeds and thicknesses of flat layers to get intercepts, critical distances, crossover offsets, the travel-time curve on the plot and its RMS difference from your forward picks.

Pick your first arrivals in the [[seismogram-viewer]], and check the layers against a [[ves-inversion|resistivity sounding]] over the same line.

## How to use it

1. Choose 2 or 3 layers and enter the distance between the shots.
2. Paste or open the forward picks: offset from the shot in metres and time in milliseconds. Add the reverse shot's picks, measured from the reverse shot, if you have them.
3. Check the plot: each pick should sit on its own line. If one is on the wrong line, type the break offsets (the distances between layers), for example 12, 55.
4. Read the speeds, depths and the dipping-layer result. Download the picks with their layers and fitted times as CSV.

## Worked example

The example picks were made from a three-layer model (500, 1800 and 4000 m/s) whose interfaces lie 5 m and 20 m below the forward shot and dip 2° and 3° toward the reverse shot 125 m away, with small timing errors added. The forward shot gives **492, 1631 and 3090 m/s** and layer tops at **5.0 m and 19.3 m**; the reverse shot gives 505, 1997 and 6042 m/s. The different apparent speeds show the layers dip. The dipping-layer solution gives **V2 = 1795 m/s and a dip of 1.67°**, with the first refractor **5.06 m below the forward shot and 9.19 m below the reverse shot** (the model has 5.0 and 9.4 m). The deeper refractor's speed is about **4089 m/s**, and the reciprocal times agree to 0.1 ms.

## Good to know

- The intercept and crossover methods give the same depth when the direct-wave line goes through zero. Untick that box if your trigger time is uncertain; the two methods then differ, which shows how sensitive the depth is to the picks.
- A layer that is slower than the one above it makes no head wave and cannot be seen (a hidden layer); depths below it come out wrong.
- A thin layer may never give first arrivals (a blind zone). Surface checks or boreholes help.
- The dipping solution here is for the first refractor. For a deeper dipping refractor, the average of the two apparent speeds (2·Vf·Vr/(Vf + Vr)) is a fair estimate of its speed for small dips.

## FAQ

**How many picks do I need per layer?** At least two, but four or more give a much steadier line.

**What if the ground is not layered?** Strongly varying ground needs methods such as the generalised reciprocal method or tomography. This page is for layered ground.

**Is my data sent anywhere?** No. Everything is worked out on this page and nothing leaves your device.
