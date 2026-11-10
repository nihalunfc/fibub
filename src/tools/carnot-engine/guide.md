---
name: Carnot engine
num: 1348
shelf: learn
section: school-physics
title: "Carnot engine"
summary: "Set the hot and cold temperatures and see the best possible engine's efficiency, with heat and work arrows drawn to scale. Run it backwards as a refrigerator or heat pump for the COP, watch the cycle go round on a p–V diagram, and test an inventor's claim against the second law."
status: live
ads: false
order: 1348
icon: chart
works: offline
updated: 2026-11-09
related: [heat-engine-cycles, temperature-scales, kinetic-theory, heating-curve]
sources:
  - "Carnot efficiency η = 1 − T₂/T₁, refrigerator COP = T₂/(T₁ − T₂), heat pump COP = T₁/(T₁ − T₂), Q₂/Q₁ = T₂/T₁: standard thermodynamics."
  - "Ideal-gas Carnot cycle: isotherms pV = nRT, adiabats pV^γ = constant with γ = 1.4 for air; gas constant R = 8.314462618 J/(mol K) (CODATA 2018)."
  - "Checked against an independent Python calculation, including a numerical integration of p dV round the cycle."
flow:
  - { icon: sliders, label: "Set T₁, T₂" }
  - { icon: chart, label: "Energy flow" }
  - { icon: curve, label: "p–V cycle" }
  - { icon: check, label: "Check" }
---

## What it does

A heat engine takes heat from something hot, turns part of it into work, and dumps the rest into something cold. In 1824 Sadi Carnot showed that the best any engine can do depends only on the two temperatures: **η = 1 − T₂/T₁**, with both in kelvin. This page draws the energy flowing through such an ideal engine, with arrow widths to scale, fills in the formula with your temperatures, and shows the ideal-gas **Carnot cycle** on a p–V diagram with a dot going round it.

Switch to **Refrigerator** or **Heat pump** and the same machine runs backwards: work goes in and heat is pumped from cold to hot. The page gives the best possible **coefficient of performance (COP)**. A claim checker tells you whether an inventor's engine or fridge is possible, or whether it breaks the **second law of thermodynamics**.

It serves Class 11 Physics, Thermodynamics (heat engines, refrigerators and heat pumps, the second law, reversible processes and the Carnot engine), building on Class 11 Kinetic Theory. Use [[temperature-scales]] if you need to turn °C into kelvin, [[kinetic-theory]] for what temperature means for the gas, and [[heat-engine-cycles]] for real cycles such as Otto and Diesel.

## How to use it

1. Choose **Engine**, **Refrigerator** or **Heat pump**.
2. Set the **hot side T₁** and **cold side T₂** in kelvin; °C is shown beside each. The cold side must be colder than the hot.
3. The third slider is the heat per cycle: heat taken in (engine), heat pulled out of the cold side (refrigerator) or heat delivered to the warm side (heat pump).
4. The p–V diagram shows a small amount of air doubling its volume at T₁. The four steps are named as the dot goes round; the shaded area is the work per cycle.
5. Type a claimed efficiency (or COP) into **Check an inventor's claim**.

## Worked example

With the page as it opens: T₁ = 500 K (226.85 °C), T₂ = 300 K, Q₁ = 1000 J.

η = 1 − 300/500 = **0.4 = 40 %**. W = 0.4 × 1000 = **400 J** of work, and Q₂ = 1000 − 400 = **600 J** goes to the cold side. Notice Q₂/Q₁ = 600/1000 = T₂/T₁.

As a refrigerator between the same temperatures, COP = 300 / (500 − 300) = **1.5**; as a heat pump, COP = 500 / 200 = **2.5**. The gas on the p–V diagram is 347 mmol of air, and the area of its loop is 400 J, the same work.

A claim of 45 % between 500 K and 300 K is **impossible**: it beats 40 %.

## Check yourself

Five fresh questions: the efficiency from temperatures in °C, the work per cycle, a refrigerator's COP, the hot temperature needed for a target efficiency, and an inventor's claim. Answers are checked on the page and the working is shown. Nothing is saved.

## Tips

- Always turn temperatures into kelvin first. 1 − 27/127 (in °C) is wrong; 1 − 300/400 is right.
- Efficiency can only reach 100 % if T₂ = 0 K, which can never be reached. So every engine wastes some heat.
- A refrigerator's COP is often bigger than 1. That is not free energy: it moves heat, it does not make it.

## FAQ

**Why can't a real engine reach the Carnot value?** The Carnot cycle has to run infinitely slowly with no friction and heat flowing across tiny temperature differences. Real engines run fast, have friction and leak heat, so they always do worse.

**Why does a heat pump have COP one more than a fridge?** The heat delivered to the warm side is the heat taken from the cold side plus the work: Q₁ = Q₂ + W, so Q₁/W = Q₂/W + 1.

**What does the shaded area mean?** On a p–V diagram the area under a path is the work done by the gas. Going round the loop, the gas does more work expanding than is done on it while it is squeezed; the difference is the area inside.
