---
name: Population growth models
num: 303
shelf: science
section: ecology
title: "Population growth calculator: exponential, logistic and Leslie matrix (eigenvalue, stable age distribution)"
summary: "Compare exponential and logistic growth from a starting size, growth rate r and carrying capacity K, or project an age-structured population with a Leslie matrix and get λ, the stable age distribution, reproductive values, R₀ and generation time."
status: live
ads: true
order: 303
icon: curve
works: offline
updated: 2026-11-09
related: [biodiversity-indices, decay-calculator, plot-maker, trend-analyser, lotka-volterra-simulator, epidemic-model, ode-solver, yield-per-recruit, mark-recapture]
sources:
  - "Methods: P. H. Leslie (1945) matrix model; H. Caswell, Matrix Population Models (2nd ed. 2001) for the characteristic equation, stable distribution, reproductive value, R₀ and generation time; Verhulst's logistic equation. Formulas only; no tables are copied."
  - "Checked in the tests against NumPy 2.x (numpy.linalg.eig of the matrix and its transpose, and matrix powers) and Python's math module."
  - "The examples are made up."
flow:
  - { icon: sliders, label: "Rates" }
  - { icon: table, label: "Classes" }
  - { icon: curve, label: "Project" }
  - { icon: chart, label: "λ and ages" }
---

## What it does

This calculator covers the three population growth models taught in every ecology course, and used in wildlife management and conservation:

- **Exponential growth**: N(t) = N₀ e^(rt). With no limits, a population grows by the same proportion every time unit.
- **Logistic growth**: N(t) = K / (1 + ((K − N₀)/N₀) e^(−rt)). Growth slows as the population approaches the carrying capacity K, giving the familiar S-shaped curve.
- **Leslie matrix**: an age- or stage-structured population, where each class has its own fecundity and survival. The tool projects the numbers forward and finds the long-run growth rate λ (the dominant eigenvalue), the stable age distribution and the reproductive value of each class.

Estimate the starting population with the [[mark-recapture|mark-recapture estimator]], and add a predator or a competitor in the [[lotka-volterra-simulator|Lotka-Volterra simulator]].

## How to use it

1. Pick **Exponential and logistic** or **Leslie matrix**.
2. For the first, enter the **starting size N₀**, the **growth rate r** per time unit, the **carrying capacity K** and how long to run. Optionally give a size to reach, and the page says when each model gets there.
3. For a Leslie matrix, paste one row per class: **name, fecundity F, survival P, starting number**. F is the number of offspring each individual in the class adds to the first class at the next census. P is the chance of surviving into the next class. The survival on the last row is the chance of staying in the last class (a "plus group"); leave it at 0 for a classic Leslie matrix. You can also open a CSV or Excel file.
4. Set the **time steps** to project. Download the projection as CSV, or the report as an image, PDF or Word file.

## What each result means

- **λ = eʳ** is the factor the population is multiplied by each time unit. **Doubling time** is ln 2 ÷ r.
- **Fastest logistic growth** is rK/4, reached when N = K/2.
- **λ** for a Leslie matrix comes from its characteristic (Euler-Lotka) equation, so it is exact even for matrices where only one class breeds, which defeat simple power iteration.
- **Stable %** is the share of each class once the population has settled into steady growth. **Reproductive value** is how much an individual in each class contributes to future growth, relative to a newborn.
- **R₀** is the expected lifetime offspring of a newborn; above 1 means growth. **Generation time** is ln R₀ ÷ ln λ.

## Worked example

The growth curves example is made up: N₀ = 20, r = 0.3, K = 500, run for 30 time units. The page shows **At t = 30: exponential 162,062, logistic 498.5**. λ = e^0.3 = 1.3499, so a growing population adds 35 % per time unit while it is small, and doubles every 2.310 units. Logistic growth is fastest, at 37.50 per time unit, when N = 250 at t = 10.59; exponential growth would have reached 250 by t = 8.419.

The Leslie example is a made-up animal with four age classes: fecundities 0, 1.2, 2.0 and 1.5, survivals 0.5, 0.6 and 0.4, and 100, 50, 30 and 10 animals to start. The page shows **λ = 1.1283: the population grows 12.8 % per time step in the long run**, with r = 0.1207, a doubling time of 5.741 steps, R₀ = 1.380 and a generation time of 2.668. The stable age distribution is 56.74 %, 25.14 %, 13.37 % and 4.74 %, and an age-1 animal is worth 2.257 newborns in reproductive value. After 20 steps the 190 animals have become 2192.

## Tips

- Match the census to the fecundity: in a post-breeding census, F already includes the survival of the newborns to the next census.
- A matrix with λ below 1 is declining even if numbers rise for a few steps at first; the early wiggles are the population settling towards its stable distribution.
- Use the same time unit for r and the run length (years, days or generations).

## Frequently asked questions

**Why does my projection not grow by exactly λ each step at first?** The starting numbers are not in the stable distribution. The ratio between steps converges to λ; the "last step" fact shows how close it is.

**Can I use stage classes (Lefkovitch matrices)?** Use the plus group for a stage that animals stay in. Matrices where animals can stay in several stages, or skip stages, are not covered here.

**Is anything sent anywhere?** No. Everything is worked out in your browser, and the page works offline once loaded.
