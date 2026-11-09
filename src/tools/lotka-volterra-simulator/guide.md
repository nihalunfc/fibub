---
name: Lotka-Volterra simulator
num: 304
shelf: science
section: ecology
title: "Lotka-Volterra simulator: predator-prey and competition models with phase plane and equilibria"
summary: "Simulate the Lotka-Volterra predator-prey model (with an optional prey carrying capacity) or two-species competition. See both populations over time, the phase plane with nullclines, every equilibrium with its eigenvalues and stability, and the predicted outcome."
status: live
ads: true
order: 304
icon: orbit
works: offline
updated: 2026-11-09
related: [biodiversity-indices, reaction-kinetics-fitter, plot-maker, decay-calculator, ode-solver, chaos-explorer, agent-based-models, population-growth-models, epidemic-model]
sources:
  - "Models: A. J. Lotka (1925) and V. Volterra (1926); G. F. Gause (1934) for competition; the logistic prey term as in standard ecology texts (e.g. N. J. Gotelli, A Primer of Ecology, 4th ed. 2008). Numerical method: classic fourth-order Runge-Kutta. Formulas only; no tables are copied."
  - "Checked in the tests against SciPy 1.x solve_ivp (RK45 with tolerances of 1e-12), numpy.linalg.eigvals for the equilibria and scipy.signal.find_peaks for the cycle period, plus the conserved quantity of the classic model."
  - "The parameter values are made up."
flow:
  - { icon: sliders, label: "Rates" }
  - { icon: curve, label: "Simulate" }
  - { icon: orbit, label: "Phase plane" }
  - { icon: target, label: "Equilibria" }
---

## What it does

The Lotka-Volterra equations are the starting point for how two interacting species change in number. This simulator solves them step by step and shows what happens:

- **Predator-prey**: prey x grow at rate α and are eaten at rate βxy; predators y gain δxy from eating and die at rate γ. Without a prey limit the populations cycle for ever. Add a **carrying capacity K** for the prey and the cycles shrink towards a steady state.
- **Competition**: two species each grow logistically towards their own carrying capacity, and each counts against the other's capacity through the competition coefficients α₁₂ and α₂₁. Depending on these, one species wins, they coexist, or the winner depends on who starts ahead.

For each model you get the populations over time, the **phase plane** (one population against the other) with the **nullclines** where each stops changing, and every **equilibrium** with the eigenvalues of the Jacobian that say whether it attracts or repels.

Start with a single species in the [[population-growth-models|population growth models]], and solve your own equations with the [[ode-solver|ODE solver]].

## How to use it

1. Pick **Predator-prey** or **Competition**.
2. Enter the rates and the starting numbers. Every option has a one-line explanation on the page.
3. Set how long to run and the **time step**. The default of 0.01 is accurate for rates around 1; use a smaller step if rates are large. Up to 200,000 steps are allowed.
4. Download the simulated numbers as CSV (up to about 2,000 rows), or the report as an image, PDF or Word file.

## Worked example

The predator-prey example is made up: α = 1, β = 0.1, δ = 0.075, γ = 1.5, starting with 10 prey and 5 predators, run for 50 time units. The page shows **At t = 50: prey 15.02, predators 3.359**. The coexistence point is (20, 10), where γ/δ = 20 prey just feed the predators and α/β = 10 predators just hold the prey in check. It is a **centre** with eigenvalues 0 ± 1.225i, so the populations circle it for ever. Small cycles would last 2π/√(αγ) = 5.130 time units; this run's large cycle takes 5.480, with 9 prey peaks. Set K to 200 and the coexistence point moves to (20, 9) and becomes a stable spiral, eigenvalues −0.05 ± 1.161i.

The competition example (also made up) uses r₁ = 0.8, r₂ = 0.6, K₁ = 500, K₂ = 400, α₁₂ = 0.6, α₂₁ = 0.7, starting from 20 of each. Because α₁₂K₂ = 240 is below K₁ and α₂₁K₁ = 350 is below K₂, each species limits itself more than the other: they coexist at (448.3, 86.21), a stable node. The page shows **At t = 50: species 1 447, species 2 88.14**, still closing in on the coexistence point.

## Tips

- In the classic model, the size of the cycle is set by where you start, not by the parameters. Starting exactly at the coexistence point gives no cycle at all.
- If the path spirals outwards or the numbers blow up, the time step is too large for the rates.
- The model has no randomness, so populations never quite reach zero; in real life a deep trough can mean extinction.

## Frequently asked questions

**Why is the predator peak after the prey peak?** Predators need prey to breed, so their numbers rise while prey are plentiful and keep rising for a while after the prey start to fall.

**Can I fit these models to my field data?** Not here; this is a simulator for exploring how the parameters shape the dynamics.

**Is anything sent anywhere?** No. Everything is worked out in your browser, and the page works offline once loaded.
