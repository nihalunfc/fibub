---
name: Epidemic model
num: 462
shelf: science
code: T313
section: epidemiology
title: "Epidemic model"
summary: "Simulate an outbreak with the SIR, SEIR or SEIRS model: set R0, the latent and infectious periods, the population, vaccination and contact cuts, and see the curve, the peak day, the peak size and the final size. A teaching model, not a forecast."
status: live
ads: false
order: 2
icon: curve
works: offline
updated: 2026-11-09
related: [sample-size, plot-maker, biodiversity-indices, dose-response, uncertainty-calculator]
sources:
  - "SIR model and final-size equation: Kermack and McKendrick (1927), Proceedings of the Royal Society A 115: 700-721."
  - "SEIR and SEIRS models: Anderson and May (1991), Infectious Diseases of Humans, Oxford University Press; Keeling and Rohani (2008), Modeling Infectious Diseases in Humans and Animals, Princeton University Press."
  - "Example values are made up for teaching."
flow:
  - { icon: sliders, label: "Set disease" }
  - { icon: calendar, label: "Contact cuts" }
  - { icon: curve, label: "Run model" }
  - { icon: download, label: "CSV, report" }
---

## What it does

This simulator runs the classic compartmental models of an infectious disease outbreak. Everyone in the population sits in one box at a time: **S**usceptible, **E**xposed (infected but not yet infectious), **I**nfectious, or **R**ecovered and immune. The tool moves people between the boxes day by day and draws the curves, so you can see how R0, the length of each stage, vaccination and a period of reduced contact change the outbreak.

It is a **teaching model, not a forecast**. Real outbreaks depend on age, contact patterns, place, testing and behaviour, which these simple models leave out. Use it to learn how the ideas fit together, not to predict a real epidemic.

For the vaccine coverage that stops spread, use the [[herd-immunity|herd immunity calculator]]; to draw a real outbreak from onset dates, the [[epi-curve|epidemic curve]] tool.

## How to use it

1. Choose the **model**. SIR has no latent stage. SEIR adds one, which slows the outbreak. SEIRS lets immunity wear off, so the disease can come back in waves and settle at a steady level.
2. Type the **population**, **R0** (how many people one case infects when everyone is susceptible), the **latent period** and the **infectious period** in days. For SEIRS, add how long **immunity lasts**.
3. Set the **initial infectious cases** and the share **vaccinated at the start** (they begin immune).
4. Optionally add **interventions**, one per line: from day, to day, and the per cent cut in contacts. "30, 60, 40" cuts transmission by 40 % from day 30 up to day 60.
5. Read the peak day, peak size and the share infected, and download the daily numbers as CSV or the report as an image, PDF or Word file.

**Show as** switches the charts between numbers of people and per cent of the population.

## The maths

With N people, the transmission rate is β = R0 / D × (1 − cut), where D is the infectious period; σ = 1 / latent period and γ = 1 / D. The SEIR equations are dS/dt = −βSI/N, dE/dt = βSI/N − σE, dI/dt = σE − γI and dR/dt = γI. SIR drops E; SEIRS adds a flow ωR back from R to S, with ω = 1 / immunity duration. The tool solves them with the fourth-order Runge-Kutta method in steps of at most 0.1 day, and finds the peak between steps with a parabola.

Without interventions or waning immunity, the share still susceptible at the end, s∞, solves the **final-size equation** s∞ = s0 · exp(−R0 (1 − v − s∞)), where s0 is the susceptible share at the start and v the vaccinated share (Kermack and McKendrick, 1927). The tool shows it next to the simulated result. The **herd immunity threshold** is 1 − 1/R0, and the **R at the start** is R0 times the susceptible share.

## Worked example

The page opens with a made-up disease: SEIR, 100,000 people, R0 = 2.5, a 3-day latent period, a 5-day infectious period and 10 initial cases. The peak comes on **day 63.9** with **14,386 people infectious** (14.4 %), and **89.3 %** of the population is infected in the 200 days, the same as the final-size equation. The herd immunity threshold is 60 %.

Add the line `30, 60, 40` (a 40 % contact cut from day 30 to day 60): the peak moves to **day 84.1** and falls to **12,563**, and 88.1 % are infected. The cut delays and flattens the curve, but once it ends the outbreak carries on. Switch to SIR and the peak comes much sooner, on day 32.1 with 23,352 infectious.

## Tips

- If the peak day says "still rising at the end", run more days.
- Set the vaccinated share above the herd immunity threshold and cases fall from the start.
- In SEIRS, use a long run (two years or more) to see the waves settle.

## Frequently asked questions

**Is this the same as the R number in the news?** The news usually reports the effective R at a point in time. This tool shows R at the start, R0 times the susceptible share.

**Why are cases never exactly zero?** The equations treat people as a smooth quantity, so tiny fractions of a person remain. Real outbreaks can die out by chance; this model cannot.

**Were these numbers checked?** Yes: the curves match SciPy's solve_ivp to better than one person in ten million, and the final size matches the final-size equation solved with SciPy.

**Is my data stored?** No. Everything runs in your browser and nothing is sent anywhere.

Draw your own figures from the CSV with the [plot maker](/science/plot-maker/).
