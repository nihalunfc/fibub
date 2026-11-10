---
name: Point kinetics
num: 677
shelf: science
section: nuclear-engineering
title: "Point kinetics"
summary: "Simulate how a reactor's power responds to a step or ramp of reactivity with the six-group point kinetics equations, solved with a stiff implicit method. See the prompt jump, the stable period from the inhour equation, and scrams. For study. Nothing is uploaded."
status: live
ads: true
order: 677
icon: curve
works: offline
updated: 2026-11-09
related: [decay-calculator, radiometric-age-calculator, neutron-diffusion, decay-heat, decay-chain, ode-solver, counting-statistics]
sources:
  - "Point kinetics equations, prompt-jump approximation and inhour equation as given in standard reactor physics textbooks (general physics)."
  - "Delayed-neutron data: rounded six-group values for thermal fission of U-235 (β = 0.0065) as printed in common textbooks, rounded and editable; physical constants, not a copied data table."
  - "Checked against SciPy solve_ivp (Radau, rtol 1e-11) for seven transients including a ramp, a scram and a prompt-critical step (agreement better than 1 part in a million), and the inhour roots against NumPy polynomial roots."
flow:
  - { icon: sliders, label: "Reactivity" }
  - { icon: orbit, label: "Neutrons" }
  - { icon: curve, label: "Power" }
  - { icon: clock, label: "Period" }
---

## What it does

The point kinetics equations describe how the neutron population, and so the power, of a reactor changes when its reactivity changes, treating the whole core as one point. They include the **delayed neutrons**: about 0.65 % of the neutrons from U-235 fission come out seconds to minutes later, from the decay of fission products (the precursors). Those few neutrons are what make a reactor controllable.

dn/dt = (ρ − β)/Λ · n + Σ λᵢCᵢ    dCᵢ/dt = βᵢ/Λ · n − λᵢCᵢ

This simulator:

- solves the six-group equations with a **3-stage Radau IIA** implicit method (order 5, made for stiff equations like these, where the prompt neutrons change thousands of times faster than the precursors), with automatic step control;
- takes a **step** or a **ramp** of reactivity in dollars, cents, pcm or Δk/k, with an optional **scram**;
- shows the **prompt jump** β/(β − ρ), the **stable period** and doubling time from the **inhour equation** (all seven roots), and the power at chosen times;
- plots power (log or linear) and reactivity, and downloads the time series as CSV.

It is educational: there is no temperature feedback, spatial effect or decay heat, so it shows the bare kinetics only.

Find the core size that makes the reactor critical with [[neutron-diffusion|neutron diffusion]], and follow the heat left after shutdown with the [[decay-heat|decay heat calculator]].

## How to use it

1. Pick the units and a step size, or a ramp rate and a value to hold at. Positive reactivity raises the power; negative lowers it.
2. Tick **Scram** to drop the rods (a large negative step) at a chosen time.
3. Leave the delayed-neutron groups at the rounded U-235 values, or type your own (β fraction and decay constant per group). Λ is the prompt neutron generation time.

## Worked example

With the rounded U-235 data (β = 0.0065) and Λ = 10⁻⁴ s, a step of **+0.1 $** gives a prompt jump of × 1.111, then a stable period of **98.72 s** (doubling every 68.43 s). After 60 s the power is 2.342 times the start. A step of +0.5 $ jumps × 2 and settles to a 5.8 s period: 83,554 times the start after 60 s. A step of −1 $ drops the power to half at once and then to 0.06451 after 60 s, with a period of −83.9 s: a reactor can never shut down faster than its longest-lived precursor allows (about 80 s here). At +1 $ or more the reactor is **prompt critical** and the power rises on the prompt-neutron time scale alone.

## FAQ

**Why the jump and then a slow rise?** The prompt neutrons settle in milliseconds (the jump); after that the growth is paced by the delayed neutrons.

**Is anything uploaded?** No. Everything runs in your browser and works offline.
