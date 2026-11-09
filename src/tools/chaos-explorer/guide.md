---
name: Chaos explorer
num: 552
shelf: science
section: applied-mathematics
title: "Chaos explorer: logistic map cobweb and bifurcation diagram, Lorenz attractor in 3D, Hénon map, Lyapunov exponents"
summary: "Explore chaos in your browser: the logistic map (or any typed map) with cobweb, orbit diagram, Lyapunov exponent and Feigenbaum period-doubling points; the Lorenz and Rössler attractors in a 3D view you can turn, with their Lyapunov spectrum; and the Hénon map."
status: live
ads: true
order: 552
icon: orbit
works: offline
updated: 2026-11-09
related: [ode-solver, period-finder, plot-maker, fractal-explorer, coupled-oscillators, cellular-automata, fourier-visualiser, population-growth-models]
sources:
  - "Methods: Lyapunov exponents of maps as the mean of ln|f′|; Benettin et al. (1980) and Shimada and Nagashima (1979) for flow spectra; period-doubling points solved from f^p(x) = x and (f^p)′(x) = −1. The systems and their classic parameter values are standard textbook mathematics."
flow:
  - { icon: sliders, label: "Choose r" }
  - { icon: curve, label: "Cobweb" }
  - { icon: chart, label: "Diagram" }
  - { icon: sigma, label: "Lyapunov" }
---

## What it does

Chaos means a simple, fully determined rule whose future still cannot be predicted in practice, because tiny differences in the start grow exponentially. This tool lets you see it in three classic systems and measure it with the **Lyapunov exponent**, the average rate at which nearby starts separate.

- **Logistic map**, x → r·x·(1 − x), or any map you type in x and r. You get the **cobweb diagram**, the orbit step by step, the **orbit (bifurcation) diagram** over a range of r, the Lyapunov exponent against r, and the **period-doubling points** with the ratios that tend to Feigenbaum's constant δ = 4.6692.
- **Lorenz and Rössler systems**, the famous strange attractors, drawn in a 3D view you can turn by dragging. A button works out all three Lyapunov exponents.
- **Hénon map**, a two-dimensional map with a fractal attractor, and both of its exponents.

Draw the fractal sets behind it with the [[fractal-explorer]], and solve your own equations of motion with the [[ode-solver|ODE solver]].

## How to use it

1. **Logistic map:** type r or move the slider. The big line says whether the orbit settles, cycles (with its period) or is chaotic. The orbit diagram and the λ curve show the whole range of r at once, with your r marked by a dashed line. Change "r from" and "r to" to zoom in, for example 3.54 to 3.58 to see the doublings crowd together.
2. **Lorenz and Rössler:** pick the system and its three parameters. The path is solved with fourth-order Runge-Kutta. Drag the picture or use the Turn and Tilt sliders. Press **Work out the exponents** for the Lyapunov spectrum.
3. **Hénon map:** change a and b; up to 200,000 points are drawn.

Each part has a CSV download, and the report (image, PDF or Word) holds every part you have opened.

## Worked example

At r = 3.7 the logistic map is chaotic: the page shows λ = 0.3528 (averaged over 20,000 steps; longer runs give 0.3535). At r = 3.5 it settles on a cycle of period 4 with λ = −0.8725, and at r = 4 the exponent is ln 2 = 0.6931, the exact answer. Over r = 2.5 to 4 the tool finds seven period doublings: r = 3, 3.449489743 (= 1 + √6), 3.544090360, 3.564407266, 3.568759420, 3.569691610 and 3.569891259. The ratios of the gaps are 4.7514, 4.6563, 4.6682, 4.6687 and 4.6691, closing in on δ = 4.6692, and the cascade ends near r∞ ≈ 3.569946.

For the Lorenz system with σ = 10, ρ = 28, β = 8/3, averaging over 1000 time units gives λ₁ = 0.9069, λ₂ = −0.0007 and λ₃ = −14.573, close to the known 0.9056, 0, −14.5723. Their sum is −13.667 = −(σ + 1 + β), as it must be, and the Kaplan-Yorke dimension is about 2.06. The Hénon map with a = 1.4, b = 0.3 gives λ₁ = 0.41801 and λ₂ = −1.6220 from 100,000 steps (a million steps give 0.4195 and −1.6235), always summing to ln 0.3 = −1.2040; the Kaplan-Yorke dimension is 1.258.

## How the maths was checked

The map exponents, period-doubling points and Hénon exponents were compared with independent NumPy and SciPy code (exact derivatives, fsolve and QR), agreeing to 10⁻⁷ or better; the Lorenz and Rössler spectra with SciPy's solve_ivp and NumPy QR, and with the known published values.

## Good to know

- A finite average is an estimate: the Lorenz λ₁ wobbles by about ±0.01 for 1000 time units. λ₂ of a flow should be 0; how close it gets shows the accuracy.
- The period is found by checking when the orbit repeats to 10⁻⁷, after 5000 steps, up to period 64. Right at a bifurcation the orbit settles very slowly and the period can be misread.
- The 3D view is a plain projection, so depth is shown by turning it, not by perspective.

## Frequently asked questions

**Is anything uploaded?** No. Everything is worked out in your browser and nothing is stored.

**What does a negative λ mean?** Nearby starts come together, so the motion is predictable: a fixed point or a cycle. Positive λ is chaos.

**Can I study another map?** Yes: type any formula in x and r, such as r*sin(pi*x). The period-doubling search works for any smooth map with one hump.
