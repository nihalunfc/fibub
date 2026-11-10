---
name: Decay heat estimator
num: 679
shelf: science
code: T476
section: nuclear-engineering
title: "Decay heat calculator: reactor heat after shutdown with the Way-Wigner formula, energy released and time to cool"
summary: "Estimate the heat a reactor core still makes after shutdown with the Way-Wigner approximation: a table from seconds to a year, energy released over any interval, and when the heat falls below a level. An approximation, for study. Nothing is uploaded."
status: live
ads: true
order: 679
icon: clock
works: offline
updated: 2026-11-09
related: [point-kinetics, neutron-diffusion, decay-calculator, decay-chain, gamma-shielding, heat-conduction, steam-tables]
sources:
  - "Way-Wigner approximation P/P0 = 0.0622 [t^−0.2 − (t + T)^−0.2] for fission-product decay heat, as given in standard reactor physics and nuclear engineering textbooks (a published formula); its integral worked out by fibub."
  - "Checked against SciPy: the formula at 24 points, the energy integral by adaptive quadrature at 16 intervals (agreement to 1 part in a billion), and the time to fall below a level by brentq, for four operating times."
  - "The 3,000 MW example reactor is a made-up round number."
flow:
  - { icon: pencil, label: "Power, time" }
  - { icon: clock, label: "Shutdown" }
  - { icon: curve, label: "Heat curve" }
  - { icon: table, label: "Energy" }
---

## What it does

When a reactor shuts down, fission stops within seconds, but the fission products in the fuel keep decaying and giving off heat. Straight after shutdown this **decay heat** is several percent of full power, and it falls only slowly: this is why cores need cooling for days and spent fuel for years.

This tool uses the **Way-Wigner approximation**, a simple fit to the decay of the mixture of fission products:

P(t) / P₀ = 0.0622 [ t^−0.2 − (t + T)^−0.2 ]

where t is the time since shutdown and T the time the reactor ran at power P₀ (both in seconds). It gives:

- the heat at times from 1 second to 1 year, in % of P₀ and in MW, with how much water it could boil off each hour;
- the **energy released** over standard intervals and an interval of your own, using the exact integral of the formula;
- **when the heat falls below** a level you choose;
- a log-log chart of the heat (against a very long operating history) and the energy released since shutdown, with a CSV of the curve.

**It is an approximation, for study.** It is usually quoted as fair (within tens of percent) from about 10 seconds to a few months after shutdown. Real decay heat depends on the fuel type, enrichment, burnup and power history, and also includes actinides such as U-239 and Np-239; safety work uses detailed codes and standards.

Follow the individual nuclides with the [[decay-chain|decay chain calculator]], and check how fast the heat leaves the fuel with [[heat-conduction|heat conduction]].

## Worked example

A made-up reactor running at 3,000 MW thermal for 365 days: 10 seconds after shutdown it still makes 111.8 MW, and **1 hour after shutdown 30.37 MW (1.012 % of P₀)**, enough to boil off 48.4 tonnes of water an hour. The heat falls below 1 % after 1.05 hours, and is 13.31 MW (0.4438 %) after a day. In the first day the core releases 435 MWh (1,565 GJ) of heat, and another 1,309 MWh from day 1 to day 7.

Running for only a few hours builds up fewer long-lived fission products, so the heat then dies away much faster; choose **very long** to see the upper limit 0.0622 t^−0.2.

## FAQ

**Why does the heat fall so slowly at first?** It is the sum of hundreds of fission products with half-lives from seconds to years; the short-lived ones fade first.

**Is anything uploaded?** No. Everything runs in your browser and works offline.
