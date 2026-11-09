---
name: Gillespie stochastic simulator
num: 988
shelf: science
section: systems-biology
title: "Gillespie stochastic simulation (SSA) for small reaction networks: many runs, mean and spread vs the ODE, noise and Fano factor"
summary: "Simulate small reaction networks one molecule at a time with Gillespie's exact stochastic algorithm. Run many times to see the mean, the spread and single runs against the deterministic ODE, and the distribution of counts at the end against a Poisson distribution, with the Fano factor."
status: live
ads: true
order: 3
icon: chart
works: offline
updated: 2026-11-09
related: [pathway-ode-builder, gene-network-viewer]
sources:
  - "Gillespie, D. T. (1977), Exact stochastic simulation of coupled chemical reactions, J. Phys. Chem. 81, 2340 to 2361 (the direct method); the two-stage gene expression noise result of Thattai, M. and van Oudenaarden, A. (2001), PNAS 98, 8614 to 8619: used as methods, written by fibub."
  - "Checked against exact results: the Poisson stationary distribution of the birth-death process (chi-square test with SciPy's Poisson and chi-square functions), the binomial distribution of first-order decay, the mean and Fano factor of the two-stage gene expression model, and the ODE mean of a linear model. Example rates are made up."
flow:
  - { icon: pencil, label: "Reactions" }
  - { icon: sliders, label: "Runs" }
  - { icon: curve, label: "Simulate" }
  - { icon: chart, label: "Spread" }
---

## What it does

Inside a cell many molecules exist in tens or hundreds of copies, not in moles. At such small numbers, reactions happen at random moments and two identical cells drift apart. An ODE model gives only the average. **Gillespie's stochastic simulation algorithm (SSA)** follows the counts one reaction at a time, so each run is one possible history of one cell.

This page runs the SSA many times and shows:

- **Single runs**, to see how jumpy one cell is.
- The **mean** of all runs and a band of **± 1 standard deviation**, with the **ODE** curve for comparison.
- The **distribution of counts at the end** of the runs, next to a **Poisson distribution** with the same mean.
- The **Fano factor** (variance ÷ mean): 1 for a Poisson distribution, above 1 for bursty noise.

Everything runs in your browser.

## How to use it

1. Pick a starting model or write your own in the same reaction language as the pathway ODE builder: `A + B -> C : k`, `A <-> B : kf, kr`, `-> A : k0` (made at a constant rate), `A -> : kd` (removed), `MM(Vmax, Km)` and `Hill(Vmax, K, n)`.
2. Give rate constants and **whole-number starting counts** (molecules). Species not given start at 0.
3. Set the **end time**, the number of **runs** (more runs give smoother averages but take longer), the **species** to show, how many **single runs** to draw, and the **random seed**. Untick the ODE if you do not want its curve.
4. Read the result, and download the mean and spread over time or the final count of every run as CSV, or the report as an image, PDF or Word file.

For a reaction using two molecules of the same kind (`2 A -> B : k`) the propensity is k·n(n − 1), so that for large counts it matches the ODE rate k·n².

## Worked example

The starting model is birth and death: X is made at k0 = 10 per unit time and each molecule is lost at kd = 1. The ODE settles at k0/kd = 10, and theory says the counts settle into a **Poisson distribution** with mean 10, so the variance is 10 too.

With 200 runs to t = 10 and seed 1, the page shows **X at t = 10: mean 9.99, SD 3.05**, a Fano factor of 0.932 and runs between 5 and 15 for 90 % of the cells (lowest 4, highest 18). The histogram follows the Poisson curve, and the ODE value is 10. More runs bring the Fano factor closer to 1.

Switch to **Gene expression**: mRNA M is made and lost, and each mRNA makes protein P. The protein mean approaches km·kp/(dm·dp) = 100, but the Fano factor is far above 1 (theory: 1 + kp/(dm + dp) ≈ 7.7), because proteins come in bursts from each mRNA.

**Toggle with positive feedback** shows where the ODE misleads: X switches on its own production (a Hill law with n = 4). The ODE stays in the low state (1.02 at t = 30), but random bursts push some runs over the threshold into a high state, so the end counts split into two groups and the mean of the runs (13 with seed 1) is far from the ODE.

## Tips

- Simulation time grows with the number of reactions fired. Large counts or fast rates make it slow; the page stops at 5 million reactions.
- For linear models (only first-order and constant reactions) the mean of the runs follows the ODE exactly; for others, such as dimerisation or feedback, they can differ.
- Change the seed to check a pattern is not chance.

## FAQ

**Is this the exact SSA?** Yes, the direct method: the waiting time to the next reaction is drawn from an exponential distribution with the total propensity, and the reaction is picked in proportion to its propensity.

**What about Michaelis–Menten and Hill steps?** They use the same rate law on molecule counts, a common shortcut for enzyme or regulation steps; it is an approximation, not an exact model of binding.

**Is anything sent anywhere?** No. It all runs on this page, also offline. For study and planning, not a substitute for professional judgement.
