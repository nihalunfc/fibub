---
name: Decomposition rate
num: 1458
shelf: learn
code: L300
section: school-biology
title: "Decomposition rate: how temperature, moisture and toughness change how fast dead leaves break down"
summary: "Leave a bag of dead leaves or wood in a rainforest, desert, tundra or bog and watch it disappear year by year. Slide the temperature and moisture, see the rate, half-life and time to 95 % gone, and follow the five steps from fragmentation to mineralisation. A teaching model."
status: live
ads: false
order: 1458
icon: curve
works: offline
updated: 2026-11-09
related: [food-web-builder, population-growth, photosynthesis-lab]
sources:
  - "Standard school ecology: the steps of decomposition (fragmentation, leaching, catabolism, humification, mineralisation) and the factors that control its rate (temperature, moisture and oxygen, lignin and chitin content). The exponential litter-bag model M = M₀e^(−kt) and a Q10 of 2 are standard simple models. Written for fibub; no textbook text, figures or exercises are used."
  - "The rate at 25 °C, the moisture curve, the toughness factors and the climates of the six places are round, made-up teaching values."
  - "Checked against a separate Python version (rates and half-lives) and scipy.integrate.solve_ivp for the mass left after 3 years."
flow:
  - { icon: sliders, label: "Climate" }
  - { icon: curve, label: "Mass left" }
  - { icon: clock, label: "Half-life" }
  - { icon: check, label: "Check" }
---

## What it shows

Dead leaves, wood, dead animals and droppings (together called **detritus**) are broken down by **decomposers**: bacteria, fungi and small animals called detritivores. Decomposition returns nutrients to the soil, so it keeps an ecosystem running. How fast it goes depends mostly on the **climate** and on **what the dead matter is made of**.

Ecologists measure it with **litter bags**: mesh bags of leaves left on the ground and weighed every few months. The mass left usually falls exponentially: **M = M₀ e^(−kt)**, where k is the decomposition rate. This page works out k from three things:

- **temperature**: decomposers work about twice as fast for every 10 °C warmer (Q10 = 2), and stop when frozen;
- **moisture**: too dry and they cannot work; waterlogged soil is short of oxygen, so they slow down again;
- **toughness**: lignin (in wood) and chitin resist breakdown; leaves rich in nitrogen and sugars go fast.

It fits **Class 12 Biology: ecosystem** (decomposition and the factors affecting it, and nutrient cycling). Who feeds on whom, decomposers included, is in [[food-web-builder]]; the same exponential maths runs backwards in [[population-growth]], and the plants that will take up the released nutrients are in [[photosynthesis-lab]].

## How to use it

1. Pick a **place** (rainforest, temperate forest, grassland, desert, tundra, bog) or slide your own temperature and moisture.
2. Pick what is **in the bag**: soft leaves, tough leaves or wood.
3. Slide **Years** to watch the bag empty. The facts show the mass left, k, the half-life and the time until 95 % is gone; the graph compares your bag with the same bag in the other places (grey).

## Worked example

Soft leaves in a temperate forest (12 °C, moisture 0.6): k = 1.2 × 2^((12 − 25)/10) × 1 × 1 ≈ **0.487 per year**. After one year e^(−0.487) ≈ **61.4 %** is left. The half-life is ln 2 / k ≈ **1.42 years**, and 95 % is gone after ln 20 / k ≈ **6.1 years**. The same leaves in a tropical rainforest (27 °C, moisture 0.7) have a half-life of about **7 months**, nearly six times shorter than in the tundra. Wood in the temperate forest takes about **11.9 years** to lose half.

## Check yourself

Five fresh questions: a half-life from k, the effect of Q10 on the rate, grams left after some years, naming a step, and where decomposition is fastest. Nothing is saved.

## FAQ

**Why do bogs make peat?** Waterlogged soil has very little oxygen, so decomposers work very slowly and dead plants pile up faster than they rot.

**Why is rainforest soil poor, if decomposition is fast?** Nutrients are released quickly and taken straight back up by plants, or washed away by heavy rain, so little stays in the soil.

**Is this from my textbook?** It covers the standard school topic with its own model and examples. It is an independent study aid.
