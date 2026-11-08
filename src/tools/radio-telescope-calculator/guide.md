---
name: Radio telescope calculator
num: 60
shelf: science
section: radio-astronomy
title: "Radio telescope calculator: beam width, K/Jy gain, SEFD and the radiometer equation"
summary: "Find what a radio dish or array can detect: beam width, collecting area, gain in K/Jy, system equivalent flux density, noise after any integration, a source's signal-to-noise and how long you need to detect it."
status: live
ads: true
order: 10
icon: telescope
works: offline
updated: 2026-11-08
related: [link-budget-calculator, magnitude-flux-converter, redshift-calculator, telescope-calculator]
sources:
  - "Physical constants: CODATA recommended values (NIST)."
flow:
  - { icon: telescope, label: "Dish" }
  - { icon: clock, label: "Integrate" }
  - { icon: chart, label: "Sensitivity" }
---

## What it does

A radio telescope measures faint noise from the sky on top of louder noise from its own receiver. Whether you can detect a source depends on the dish size, the receiver, the bandwidth and how long you integrate. This calculator works through the standard sums. It gives the beam width, the effective collecting area, the gain in kelvin per jansky, the system equivalent flux density (SEFD) and the noise after your integration time (the radiometer equation). Add a source's brightness and it gives the signal-to-noise and how long you need to reach a detection. It works for a backyard satellite dish, a research dish or an interferometer array.

## How to use it

1. Pick an **example** or type your own: the **frequency**, the **dish diameter**, the **aperture efficiency**, the **system temperature** and the **number of dishes**.
2. Choose one or two **polarisations**. Receivers that record both halve the observing time for the same noise.
3. Type the **bandwidth** and the **integration time**. For a spectral line such as hydrogen at 21 cm, use the width of one channel.
4. Optionally type the **source's flux density** in janskys and the **signal-to-noise** you want: 5 is a safe detection.

## How it is worked out

- **Beam**: about 1.2 λ/D for a typical dish, the smallest detail it can tell apart.
- **Gain**: G = A_eff / (2k) in K/Jy, where A_eff is the dish area times the efficiency.
- **SEFD**: T_sys / G, the source brightness that would equal the system noise.
- **Radiometer equation**: noise = SEFD / √(n_pol × Δν × t) for one dish. For N dishes correlated together, the N(N − 1)/2 pairs add, giving SEFD / √(n_pol × N(N − 1) × Δν × t).
- **Time for a detection**: t = (SNR × SEFD / S)² / (n_pol × Δν), shown when you type a source.

## Worked example

A 3 m dish with 50 % efficiency and a 100 K system, observing the 21 cm hydrogen line over 2.4 MHz with one polarisation, has a beam 4.8° wide and a gain of 0.00128 K/Jy. Its SEFD is about 78,000 Jy. After one minute the noise is 6.5 Jy, so Cygnus A, about 1590 Jy at this frequency, shows with a signal-to-noise of 244 and raises the antenna temperature by 2 K. A 100 m dish with 70 % efficiency and a 20 K receiver has a gain near 2 K/Jy and an SEFD near 10 Jy, close to what the largest single dishes quote.

## Frequently asked questions

**What limits a backyard dish?** Mostly the system temperature and the narrow bandwidth of cheap receivers. A good low-noise amplifier at the feed helps more than a bigger dish.

**Why is my real noise higher?** Radio interference, gain drifts and confusion from fainter sources in the beam all add noise the radiometer equation does not include. Treat the result as the best case.

**Is anything sent anywhere?** No. Everything runs in your browser and works offline.
