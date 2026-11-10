---
name: Population growth
num: 1452
shelf: learn
code: L281
section: school-biology
title: "Population growth: exponential and logistic curves, r and K, dN/dt and age pyramids"
summary: "Slide the growth rate r and the carrying capacity K and watch a J-shaped exponential curve race away while the S-shaped logistic curve levels off at K. See dN/dt against N, the doubling time, where growth is fastest, and expanding, stable and declining age pyramids."
status: live
ads: false
order: 1452
icon: curve
works: offline
updated: 2026-11-09
related: [population-growth-models, predator-prey, population-pyramid, food-web-builder]
sources:
  - "Standard population ecology: exponential growth N = N₀e^(rt), logistic (Verhulst-Pearl) growth dN/dt = rN(1 − N/K), doubling time ln 2 / r, and age pyramids. Written for fibub; no textbook text, figures or exercises are used."
  - "Story numbers and the three pyramid shapes are made up for teaching."
  - "Checked against scipy.integrate.solve_ivp (rtol 1e-12) and scipy.optimize.brentq for the curves and the time to K/2."
flow:
  - { icon: sliders, label: "r and K" }
  - { icon: curve, label: "J and S" }
  - { icon: chart, label: "dN/dt" }
  - { icon: check, label: "Check" }
---

## What it shows

A population with plenty of food and space grows **exponentially**: the more individuals there are, the more babies they have, so the curve bends up into a **J** and never stops. Real places run short of food and space, so growth slows down and stops at the **carrying capacity K**, the most the place can support. That is **logistic** growth, an **S**-shaped curve.

This page draws both curves from three sliders: the start size N₀, the **intrinsic rate of natural increase r**, and K. A second graph plots the **growth rate dN/dt against N**: a straight line for exponential growth, an upside-down U for logistic growth, highest at N = K/2. A third card shows the three **age pyramid** shapes: expanding, stable and declining.

It fits **Class 12 Biology: organisms and populations** (population attributes, age pyramids, exponential and logistic growth). For age-structured models with a Leslie matrix see [[population-growth-models]]; what happens when one population eats another is in [[predator-prey]], and you can draw a real pyramid from your own numbers in [[population-pyramid]].

## How to use it

1. Pick a **story** (bacteria in a flask, deer on an island, fish in a pond) or slide your own numbers.
2. Slide **time t** to move the dots along the curves. The facts show both values of N.
3. Use **Show** to see just one curve.
4. Look at the **dN/dt** graph: the dot shows how fast the logistic population is growing right now.
5. Tap **Expanding**, **Stable** or **Declining** to compare age pyramids.

## Worked example

Bacteria story: N₀ = 10, r = 0.5 per hour, K = 1000. After t = 10 hours:

- exponential: N = 10 × e^(0.5 × 10) = 10 × e⁵ ≈ **1484.1**;
- logistic: N = 1000 / (1 + 99 e^(−5)) ≈ **599.9**, about 60 % of K;
- the doubling time of exponential growth is ln 2 / 0.5 ≈ **1.39** hours;
- logistic growth is fastest at N = K/2 = 500, where dN/dt = rK/4 = **125** per hour, reached at t ≈ **9.19** hours.

## What the options mean

- **r**: births minus deaths per individual per unit time, when nothing is short.
- **K**: the carrying capacity. Above K, deaths beat births and N falls back.
- **Age pyramids**: bars show the share of people in each 10-year age group. A wide base means many young people (expanding); straight sides mean steady (stable); a narrow base means shrinking (declining). The shapes here are made up.

## Check yourself

Five fresh questions: exponential growth after a time, logistic dN/dt, where growth is fastest, a doubling time, and naming a pyramid shape. Nothing is saved.

## FAQ

**Why do real populations not grow exponentially for long?** Food, space, water and nesting places run out, and disease and predators increase. These limits are what K stands for.

**Is the logistic curve exact for real animals?** No; it is a simple model. Real populations wobble around K, overshoot, or crash, but the S shape is a useful first picture.

**Is this from my textbook?** It covers the standard school topic with its own examples. It is an independent study aid.
