---
name: Hodgkin-Huxley simulator
num: 347
shelf: science
section: neuroscience
title: "Hodgkin-Huxley model simulator: action potentials, gating variables m, h, n, threshold and f-I curve"
summary: "Run the Hodgkin-Huxley (1952) squid giant axon model in your browser. Inject a current step or a pulse train and watch the membrane potential and the m, h and n gates; change the temperature or block Na⁺ and K⁺ channels; find the threshold of a single pulse and draw the firing rate against current (f-I curve). For study and teaching, not for clinical use."
status: live
ads: true
order: 347
icon: curve
works: offline
updated: 2026-11-09
related: [nernst-calculator, plot-maker, reaction-kinetics-fitter, membrane-potential, spike-train-analyser, ode-solver]
sources:
  - "A. L. Hodgkin and A. F. Huxley (1952), J. Physiol. 117: 500-544: the model, its rate equations and constants (g̅Na 120, g̅K 36, g̅L 0.3 mS/cm²; Cm 1 µF/cm²), written in the modern convention with rest at −65 mV (E_Na +50, E_K −77, E_L −54.387 mV). Equations only."
  - "Checked in the tests against SciPy solve_ivp (DOP853, relative tolerance 10⁻¹⁰) on the same equations: spike times agree within 0.1 µs, threshold and firing rates match."
flow:
  - { icon: sliders, label: "Stimulus" }
  - { icon: calculator, label: "Integrate" }
  - { icon: curve, label: "Spikes" }
  - { icon: chart, label: "f–I curve" }
---

## What it does

In 1952 Alan Hodgkin and Andrew Huxley described how a nerve impulse is made, from voltage-clamp recordings in the squid giant axon. Their model has four equations: one for the membrane voltage V, and three for "gates" that open and close with voltage:

- **m**, the fast activation of the sodium channel (three per channel, so m³);
- **h**, the slower inactivation that shuts sodium channels after they open;
- **n**, the slow activation of the potassium channel (n⁴).

This simulator solves those equations step by step (fourth-order Runge-Kutta, 0.01 ms steps) while you inject current, as in a current-clamp experiment.

For study and teaching, not for clinical use.

## How to use it

1. **Stimulus.** A **step** holds a current for a while; a **pulse train** gives short pulses at a set frequency. Amplitudes are in µA/cm² of membrane.
2. **Simulate for** sets the length of the run (up to 1000 ms).
3. **Temperature.** The model was fitted at 6.3 °C. Warmer runs speed every gate by 3 for each 10 °C (Q₁₀ = 3), giving narrower spikes and faster firing.
4. **Conductances** (folded away) let you block channels: g̅Na = 0 is like tetrodotoxin, g̅K = 0 is like TEA.
5. **Find threshold** searches for the smallest single pulse that fires a spike. **Draw f–I curve** runs 500 ms steps at evenly spaced currents and plots the firing rate.

The plots show V, the three gates and the injected current. Download the traces as CSV, or the report as an image, PDF or Word file.

## Worked example

The default run is a 10 µA/cm² step from 5 to 45 ms at 6.3 °C.

- The page shows **3 spikes, first at 6.901 ms, peak 40.3 mV**, then at 21.82 and 36.47 ms.
- The firing rate is 67.6 Hz (mean interval 14.8 ms).
- At 16.3 °C the same step gives 7 spikes, 6.17 ms apart.
- The threshold of a 1 ms pulse is **6.911 µA/cm²**.
- On the f–I curve, 10 µA/cm² fires at 70 Hz and 20 µA/cm² at 87.5 Hz (spikes counted from 100 to 500 ms).

## Things to try

- **Refractory period:** a pulse train at 200 Hz; some pulses fail because h has not recovered.
- **Anode break:** a step of −10 µA/cm²; a spike fires about 6 ms after it ends.
- **Repetitive firing:** the f–I curve jumps from zero to about 50 Hz, the classic type II behaviour of this model.

## FAQ

**Why is rest −65 mV and not 0?** Hodgkin and Huxley measured voltage from rest with the opposite sign. This page uses the modern convention, shifted so rest is −65 mV.

**Does anything leave my device?** No. Everything is worked out in your browser.
