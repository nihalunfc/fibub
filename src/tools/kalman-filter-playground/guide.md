---
name: Kalman filter playground
num: 639
shelf: science
section: control-and-robotics
title: "Kalman filter playground: tune Q and R on a noisy sensor and see the estimate, innovations and covariance"
summary: "Try a Kalman filter in your browser. Simulate a noisy sensor with a repeatable seed or paste your own measurements, pick a constant-level or constant-velocity model, move the Q and R sliders, and watch the estimate against the truth, the innovations, the uncertainty and the gain. Download every step as CSV."
status: live
ads: true
order: 639
icon: chart
works: offline
updated: 2026-11-09
related: [trend-analyser, uncertainty-calculator, pid-simulator, pole-placement, path-planner, digital-filter-designer, gps-track-analyser, time-series-analyser]
sources:
  - "Kalman filter equations (predict x = Fx, P = FPFᵀ + Q; update K = PHᵀ(HPHᵀ + R)⁻¹, x += K(z − Hx), P = (I − KH)P): Kalman (1960) and standard estimation texts."
  - "Constant-velocity process noise for white acceleration of spectral density q: Q = q·[[Δt³/3, Δt²/2], [Δt²/2, Δt]], standard tracking practice."
  - "Normalised innovation squared as a consistency check: standard estimation practice."
  - "Simulated data come from fibub's own seeded random number generator; the example table is made up."
flow:
  - { icon: chart, label: "Measure" }
  - { icon: sliders, label: "Q and R" }
  - { icon: curve, label: "Estimate" }
  - { icon: check, label: "Check" }
---

## What it does

A **Kalman filter** combines a model of how something moves with noisy measurements of it, and gives the best estimate it can at each step, together with how sure it is. It is used everywhere from phone GPS to aircraft autopilots. This page lets you see how it behaves.

- **Two models**: a **constant level** (the value wanders slowly, a random walk) or **constant velocity** (the value moves at a speed that changes slowly). The constant-velocity filter also estimates the speed.
- **Two kinds of data**: a **simulated sensor** with a known truth and a **random seed**, so the same noise comes back every time, or **your own measurements** (time and value, and optionally the true value).
- **Two knobs**: **Q**, how much the filter expects the state to wander between steps, and **R**, the variance of the sensor noise.

Feed the estimate to a controller in the [[pid-simulator|PID tuning simulator]], or compare it with a plain smoothing filter from the [[digital-filter-designer|FIR/IIR filter designer]].

## How to use it

1. Leave **Simulate a noisy sensor** selected, or switch to **My own measurements** and paste or open a file.
2. Move the **Q** and **R** sliders, or type values in the boxes. The sliders cover a wide range on a log scale.
3. Watch the **estimate** chart: grey truth, open circles for the measurements, the estimate and its ± 2σ band.
4. Check the **innovations** (each measurement minus what the filter predicted). For a well-tuned filter they look like random noise and about 95 % fall inside the ± 2√S band.
5. Press **Set Q and R to the true values** to see the filter tuned to the simulation, or **New noise** for a fresh seed.

## What the numbers mean

- **Mean normalised innovation²** (NIS) should be close to 1. Well above 1 means the filter trusts its model or the sensor too much; well below 1 means it is too cautious.
- **Gain K** is the share of each surprise that goes into the estimate. It settles to a steady value when Q, R and the time step stay the same; the constant model shows that **steady-state gain**.
- **RMS error** against the truth shows how much the filter improved on the raw sensor.

## Worked example

The default simulation has 100 steps of 0.5 s, a true process noise of 0.05, sensor noise σ = 2 and seed 1, with the constant-velocity model and Q = 0.05, R = 4 (the true values). The page shows **RMS error 0.946 filtered against 2.02 raw**: the filter more than halves the error. The mean NIS is 0.988, 99 % of the truth lies inside the ± 2σ band, and the last velocity estimate is 2.02 ± 0.815 per second. Raise Q to 5 and the estimate follows the noise more, so the RMS error rises to 1.41. Drop R to 0.1 and the filter is badly overconfident: NIS jumps to 33.

## FAQ

**How do I choose R?** Measure the sensor noise: hold the quantity still and take the variance of the readings. R is that variance (σ²), not σ.

**How do I choose Q?** It is harder: it describes how much the real thing changes that the model does not explain. Start small, then raise it until the innovations look like noise and NIS is near 1.

**Are my measurements sent anywhere?** No. Everything runs in your browser, and nothing is stored.
