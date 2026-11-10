---
name: Pharmacokinetics simulator (teaching)
num: 473
shelf: science
code: T324
section: pharmacology
title: "Pharmacokinetics simulator: one- and two-compartment concentration-time curves, repeated administration and steady-state accumulation"
summary: "See what a regimen does to an invented drug: one- or two-compartment model, IV bolus, IV infusion or oral absorption, repeated at an interval. Draws the concentration-time curve and gives Cmax and Cmin at steady state, the average level, the accumulation ratio and the half-lives. A teaching tool: it never works out an amount to give."
status: live
ads: false
order: 13
icon: curve
works: offline
updated: 2026-11-09
related: [nca-pk, dose-response, decay-calculator, reaction-kinetics-fitter, enzyme-kinetics-fitter, binding-curve-fitter, plot-maker, drug-release-fitter]
sources:
  - "Models and closed forms: M. Gibaldi and D. Perrier, Pharmacokinetics (2nd ed., Marcel Dekker 1982): one- and two-compartment models, the Bateman function for first-order absorption, superposition and steady state by geometric series; M. Rowland and T. N. Tozer, Clinical Pharmacokinetics and Pharmacodynamics (Lippincott Williams and Wilkins): accumulation ratio and time to steady state. Formulas only; no tables copied."
  - "Calculations written by fibub. Checked in the tests against SciPy solve_ivp (LSODA) on 24 random regimens (agreement to 3 × 10⁻¹¹), against 30-half-life ODE runs for steady state (10⁻⁹), and against the closed forms for one-compartment oral, bolus and infusion and two-compartment bolus steady state."
  - "The three drugs are invented; their numbers are made up for teaching."
flow:
  - { icon: flask, label: "Drug" }
  - { icon: clock, label: "Regimen" }
  - { icon: curve, label: "Curve" }
  - { icon: target, label: "Steady st." }
---

## What it does

This page is a teaching simulator. You describe an **invented drug** with a few pharmacokinetic numbers, type a regimen (how much, how often, by which route, how many times), and it draws the concentration in plasma over time. It shows how levels build up with each administration until they settle into a repeating pattern, the **steady state**, and gives the peak and trough there, the average level and the accumulation ratio.

It is for study and teaching, not medical advice. It only goes one way, from a regimen you enter to the curve it produces for a made-up drug. It has no feature that works out an amount to give, and it must not be used for real patients.

Analyse a measured profile with the [[nca-pk|non-compartmental analysis tool]], and model how a formulation lets the drug out with the [[drug-release-fitter|drug release fitter]].

## How to use it

1. **Start from** one of three made-up drugs, or type your own numbers.
2. Choose the **model**. In a *one-compartment* model the body is one well-mixed space: the level falls with a single half-life, ln 2 × V / CL. In a *two-compartment* model the drug also spreads into tissues (the peripheral compartment, volume V2) at the rate Q, so the curve falls fast at first (α phase, distribution) and then more slowly (β phase, elimination).
3. Set **clearance CL** (litres of plasma cleared per hour) and **volume V** (or the central volume V1).
4. Choose the **route**. An *IV bolus* puts the whole amount in at once. An *IV infusion* runs at a steady rate for the duration you set (at most the interval). *By mouth* uses first-order absorption with rate constant **ka**, and **F** is the fraction that reaches the blood.
5. Set the **amount each time**, the **interval τ** and the **number of administrations**. The curve, the numbers and the dashed steady-state lines update as you type. Switch to a **log** axis to see the phases as straight lines.

## What the numbers mean

- **Cmax and Cmin at steady state**: the highest and lowest level in one interval once the regimen has run long enough. They come from the exact steady-state formula, not from the last interval drawn.
- **Average at steady state** = AUCτ / τ, where AUCτ = F × amount / CL.
- **Accumulation ratio** = AUC over an interval at steady state ÷ AUC over the first interval. For an IV bolus in one compartment it equals 1 / (1 − e^(−kτ)). The **peak ratio** compares the peaks instead.
- **Fluctuation** = (Cmax − Cmin) ÷ average, as a percentage.
- **90 % of steady state** is reached after ln 10 / λ (about 3.3 half-lives of the slowest phase), whatever the interval.

## Worked example

Drug A (made up) has CL 5 L/h, V 50 L, ka 1 /h and F 0.8; the regimen is 250 mg by mouth every 12 h, 10 times. Its half-life is **6.93 h**. The first administration peaks at **3.097 mg/L** after 2.56 h. At steady state the page shows **Cmax 4.612 mg/L** (2.16 h after each administration) and **Cmin 1.916 mg/L**, an average of **3.333 mg/L** (AUCτ 40 mg·h/L), an **accumulation ratio of 1.503**, a peak ratio of 1.489 and a fluctuation of 80.9 %. Ninety per cent of steady state is reached after **23 h**, about 1.9 intervals.

## Tips

- Halve the interval and the amount together: the average stays the same, but the fluctuation shrinks.
- Lengthen the half-life (raise V or lower CL) and watch accumulation and the time to steady state grow.
- In Drug B, switch the axis to log to see the two straight phases of a two-compartment drug.

## FAQ

**Can it tell me what dose to give?** No. It is deliberately one-way: it shows what an entered regimen does to an invented drug, for learning how the curves behave.

**Why is steady state not the last interval drawn?** With few administrations the curve may still be climbing; the steady-state values are what the pattern settles to.

**Is anything sent anywhere?** No. Everything is calculated in this page.
