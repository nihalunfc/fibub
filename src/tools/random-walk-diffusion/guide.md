---
name: Random walk
num: 922
shelf: science
section: thermodynamics-and-statistical-physics
title: "Random walk"
summary: "Simulate lattice or Gaussian random walks in 1, 2 or 3 dimensions and watch the mean square displacement grow as 2dDt, or paste your own particle tracks to fit the diffusion coefficient, localisation error and anomalous exponent from the time-averaged MSD."
status: live
ads: true
order: 7
icon: chart
works: offline
updated: 2026-11-09
related: [ising-model, partition-function, trend-analyser, plot-maker, heat-conduction, diffusion-calculator, gillespie-simulator, distribution-explorer]
sources:
  - "Random walks, the diffusion equation and MSD = 2dDt: Einstein, A. (1905), Annalen der Physik 17, 549; standard treatment in Berg, H. C., Random Walks in Biology."
  - "MSD analysis of single-particle tracks with a localisation offset and the anomalous exponent: standard practice, for example Michalet, X. (2010), Physical Review E 82, 041914."
  - "Checked against an independent NumPy script (MSD by array differences, numpy.linalg.lstsq and polyfit fits) and simulations against D = a²/(2 d Δt)."
  - "The example tracks are made up: simulated Brownian motion with D = 0.5 µm²/s, 0.1 s frames and 0.03 µm noise."
flow:
  - { icon: sliders, label: "Walk" }
  - { icon: chart, label: "MSD" }
  - { icon: table, label: "Tracks" }
  - { icon: calculator, label: "Fit D" }
---

## What it does

A particle jostled by random kicks wanders off in a **random walk**. It goes nowhere on average, but its **mean square displacement** (MSD) grows steadily with time: MSD = 2·d·D·t in d dimensions, where D is the **diffusion coefficient**. That straight line is how D is measured, from molecules in a cell to pollen grains in water.

The tool has two parts:

- **Simulate**: hundreds of walkers on a line, a plane or in space, with steps of fixed length along the axes (lattice) or random Gaussian steps. You see the first ten paths, the MSD against time next to the theory line 2·d·D·t with D = a²/(2·d·Δt), the fitted D and exponent α, and a histogram of where the walkers ended up compared with the Gaussian the diffusion equation predicts.
- **Fit your tracks**: paste or open particle tracks (track name, time, x, y and optionally z). The tool works out the **time-averaged MSD** over all tracks at each lag, fits **D** over the first lags (with an optional **offset** for localisation error) and the **anomalous exponent α** from the log-log slope.

See the smooth version of the same spreading in the [[heat-conduction|heat conduction solver]], and work out diffusion in solids with the [[diffusion-calculator]].

## How to use it

1. For a simulation, choose the dimensions, step type, number of walkers, steps, step length and time per step. Change the seed for a different random run.
2. For tracks, paste rows like `T1, 0.10, 2.315, 4.017` (or press **Use the example tracks**, or **Open a file**). Choose x only, x-y or x-y-z, and whether the first column is a track name. Set the units for the labels.
3. Choose how many lags to fit (the first few are most reliable) and whether to fit an offset.
4. Download the MSD tables as CSV, or the report as an image, PDF or Word file.

## Worked example

The default simulation: 500 walkers on a 2D lattice, 1000 steps of length 1 each taking 1 time unit (seed 1). Theory gives D = 1²/(2·2·1) = **0.25**; the fit gives **0.2438**, and the MSD after 1000 steps is 951.9 against the expected 1000. The exponent α is 0.9788, close to 1. With 500 walkers the run-to-run scatter is a few per cent; more walkers bring the fit closer.

The **example tracks** are 10 made-up tracks of 100 frames, 0.1 s apart, simulated with D = 0.5 µm²/s and 0.03 µm of position noise. Fitting the first 10 lags with an offset gives **D = 0.4658 µm²/s**, an offset of 0.0163 µm² (position noise of about 0.0638 µm) and α = 0.9695. The estimate is a few per cent below the true 0.5 because ten short tracks only sample a little of the random motion.

## Tips

- The fit error assumes independent points; MSD values at neighbouring lags are strongly correlated, so treat it as a lower bound.
- α well below 1 suggests confinement or crowding; α above 1 suggests flow, drift or active transport.
- A negative offset usually means motion blur during the camera exposure.

## FAQ

**Why only the first lags?** Long lags are averaged over few pairs and are noisy.

**Does the tool upload my tracks?** No: everything is computed in your browser. For study and planning, not a substitute for a full tracking analysis.
