---
name: Predator and prey
num: 1453
shelf: learn
code: L282
section: school-biology
title: "Predator and prey"
summary: "Watch hares and lynx rise and fall in turn. Slide the prey birth rate, catch rate, predator gain and death rate and see both populations over time, the loop in the phase plot, the still point and how a prey limit damps the swings. Then sort every species interaction by its + / − / 0 signs."
status: live
ads: false
order: 1453
icon: orbit
works: offline
updated: 2026-11-09
related: [population-growth, food-web-builder, lotka-volterra-simulator, natural-selection]
sources:
  - "Standard Lotka-Volterra predator-prey equations (Lotka 1925, Volterra 1926), with an optional logistic limit on the prey. Written for fibub; no textbook text, figures or exercises are used. The hares-and-lynx numbers are made up for teaching."
  - "Checked against scipy.integrate.solve_ivp (rtol 1e-11) and scipy.signal.find_peaks: populations at times 10, 25 and 50, the peak times, the cycle length and the largest numbers; the model's conserved quantity is also checked."
flow:
  - { icon: sliders, label: "Rates" }
  - { icon: curve, label: "Over time" }
  - { icon: orbit, label: "Phase plot" }
  - { icon: check, label: "Check" }
---

## What it shows

When there are lots of prey, predators eat well and have more young. More predators eat more prey, so the prey become scarce. Then the predators go hungry and their numbers fall, which lets the prey recover, and the whole thing starts again. The two populations **cycle**, with the predator peak coming a little after the prey peak.

The **Lotka-Volterra model** turns that story into two equations:

- prey: dH/dt = aH − bHP (births, minus those caught);
- predators: dP/dt = cHP − dP (births from prey eaten, minus deaths).

This page solves them step by step and draws both populations against time, plus a **phase plot** (predators against prey) where a cycle becomes a closed loop around the **still point** H* = d/c, P* = a/b. A second model gives the prey a **carrying capacity K**, and then the swings die down.

A last card sorts **all the ways two species can interact** by their signs (+ gains, − loses, 0 no effect): mutualism (+, +), competition (−, −), predation and parasitism (+, −), commensalism (+, 0) and amensalism (−, 0), each with an example.

It fits **Class 12 Biology: organisms and populations** (population interactions: predation, competition, parasitism, commensalism and mutualism, and how predators keep prey numbers in check). Each population on its own grows as in [[population-growth]]; who eats whom in a whole community is in [[food-web-builder]], and the full research version with competition and stability is the [[lotka-volterra-simulator]].

This is a **teaching model** with made-up numbers. Real populations are also shaped by weather, disease and other species.

## How to use it

1. Leave the starting values or slide the four rates and the start numbers. The graphs update at once.
2. Press **Play**, or drag **Time**, to move the dots along both graphs together.
3. Read the facts: the still point, the cycle length, the most prey and predators, and how long after the prey the predators peak.
4. Switch to **Prey has a limit K** and slide K.
5. In the last card, choose + , − or 0 for each species to name the interaction.

## Worked example

With a = 1, b = 0.02, c = 0.01, d = 0.8, 40 hares and 10 lynx at the start:

- still point: H* = 0.8 / 0.01 = **80** hares and P* = 1 / 0.02 = **50** lynx;
- the hares peak first at about **275.2** (time 2.71), the lynx about **1** time unit later, at most about **154.7**;
- a full cycle takes about **8.34** time units (small cycles near the still point take 2π/√(ad) ≈ 7.02);
- with a prey limit K = 300, the swings shrink and the populations settle near 80 hares and 36.7 lynx.

## What the sliders mean

- **a**: how fast hares breed when there are no lynx.
- **b**: how often a lynx meets and catches a hare.
- **c**: how many new lynx each hare eaten makes possible.
- **d**: how fast lynx die when there is no food.

## Check yourself

Five fresh questions: the still point's prey and predators, dH/dt at given numbers, naming an interaction from its signs, and what a prey limit does. Nothing is saved.

## FAQ

**Why does the plain model never settle?** Nothing in it limits the prey except predators, so every cycle repeats exactly. A prey limit, hiding places or other food sources damp the swings.

**Is this from my textbook?** It covers the standard school topic with its own examples. It is an independent study aid.
