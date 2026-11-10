---
name: Decay chain simulator
num: 945
shelf: science
code: T680
section: nuclear-and-particle-physics
title: "Decay chain calculator: Bateman equations, daughter ingrowth, secular and transient equilibrium"
summary: "Follow a radioactive parent and up to seven daughters through time with the Bateman equations: activity of every member at any time, when each daughter peaks, whether the chain reaches secular or transient equilibrium and how long that takes. Branching, any starting activities, and a chart and CSV of the ingrowth."
status: live
ads: true
order: 1
icon: chart
works: offline
updated: 2026-11-09
related: [decay-calculator, radiometric-age-calculator, reaction-kinetics-fitter, uncertainty-calculator, gamma-shielding, counting-statistics, spectrum-peak-fitter, decay-heat, plot-maker]
sources:
  - "Bateman, H. (1910), Solution of a system of differential equations occurring in the theory of radioactive transformations, Proceedings of the Cambridge Philosophical Society 15, 423 to 427 (the equations; public domain by age)."
  - "Divided differences of the exponential for close decay constants: the Taylor-series approach of McCurdy, A. C., Ng, K. C. and Parlett, B. N. (1984), Mathematics of Computation 43, 501 to 528 (method only)."
  - "Checked against a 60-digit matrix exponential of each chain's rate matrix (mpmath expm) and SciPy's minimiser for the peak time, written for the tests."
  - "Half-lives in the example chains are rounded general values, editable on the page; check current nuclear data (for example NNDC or DDEP) for real work."
flow:
  - { icon: flask, label: "Chain" }
  - { icon: clock, label: "Time" }
  - { icon: chart, label: "Ingrowth" }
  - { icon: target, label: "Equilibrium" }
---

## What it does

Many radioactive nuclides decay into something that is itself radioactive. Molybdenum-99 decays into technetium-99m, radium-226 into radon-222 and then a string of short-lived "progeny". The amount of each daughter depends on how fast it is made (by its parent) and how fast it decays. The **Bateman equations** give the answer exactly for any linear chain A → B → C → …, and this page solves them for a parent and up to seven daughters.

You get the activity and number of atoms of every member at any time, a chart of the ingrowth, the time at which each daughter's activity peaks, and whether the chain settles into **equilibrium** with its parent.

Shield the source you have worked out with the [[gamma-shielding|gamma shielding calculator]], and plan how long to count it with [[counting-statistics|counting statistics]].

## How to use it

1. Pick an **example chain** or edit the members. Each member has a **name**, a **half-life** with its unit, a **starting activity** (what is there at time zero) and a **branching** percentage: the share of its decays that produce the next member. The rest is assumed to go somewhere outside the chain.
2. **Add a daughter** or **remove the last** to change the length (one to eight members).
3. Choose the **activity unit** (Bq to Ci) and the **time unit**, then the **time** at which you want the activities.
4. **Plot up to** sets the length of the chart; leave it blank and the page chooses a span that shows the approach to equilibrium. Switch the activity axis between logarithmic and linear.
5. **Equilibrium within** sets how close (in percent) a daughter's activity ratio must be to its final value before it counts as "in equilibrium".

## What the results mean

- **Secular equilibrium:** the parent lives far longer than the daughter (here, 100 times or more). After several daughter half-lives, the daughter's activity equals the parent's (times the branching).
- **Transient equilibrium:** the parent lives longer, but not hugely longer. The daughter's activity ends up a fixed amount *above* the parent's, λ₂ / (λ₂ − λ₁) times it, and both then fall together with the parent's half-life.
- **No equilibrium:** the daughter lives longer than the parent. The parent dies away and the daughter then decays on its own.
- **Peak time:** for a pure parent with no daughter at the start, the daughter's activity is highest at t = ln(λ₂/λ₁) / (λ₂ − λ₁), the moment the two activity curves cross.

## Worked example

The default chain is a technetium generator: 1,000 MBq of Mo-99 (half-life rounded to 66 h), freshly separated so there is no Tc-99m (6.0 h), with 88 % of Mo-99 decays feeding Tc-99m. After **24 h** the page shows **Mo-99 777.2 MBq and Tc-99m 691.8 MBq**. Tc-99m peaks at **22.83 h**, which is why generators are usually "milked" once a day. The pair is in **transient equilibrium**: Tc-99m ends up at **0.968** times the Mo-99 activity (0.88 × 66 / (66 − 6)), within 1 % after **43.85 h**.

Choose the radium-226 chain and the page shows, at 30 days, Ra-226 almost unchanged at 1,000 MBq and every daughter at 995.6 MBq, within 0.5 % of it: secular equilibrium, with Rn-222 within 1 % of equilibrium after 25.38 days.

## Tips

- After a separation, set the daughter's starting activity to 0. If you start with an old sample, give each member its present activity instead.
- Very short half-lives (microseconds) and very long ones (thousands of years) can sit in the same chain; the maths stays exact.
- The CSV has the activity of every member at 241 times across the chart, for your own plots.

## FAQ

**Can it handle equal half-lives?** Yes. The textbook formula divides by the difference of decay constants, which fails when two are equal; the page uses a form that stays exact.

**Does it work out doses?** No. It is for study and planning, not a substitute for professional judgement, a calibrated instrument or your local radiation safety rules.

**Where do the example half-lives come from?** They are rounded general values. Check current evaluated nuclear data before relying on them.
