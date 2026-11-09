---
name: Agent-based model playground
num: 587
shelf: science
section: complex-systems-and-network-science
title: "Agent-based model playground: boids flocking, Schelling segregation and an SIR epidemic, in your browser"
summary: "Watch simple local rules make large patterns: boids that flock, Schelling's model of segregation and an epidemic spreading on a grid. Change the parameters, set a seed to repeat a run exactly, step or run, and chart what happens over time."
status: live
ads: true
order: 587
icon: eye
works: offline
updated: 2026-11-09
related: [cellular-automata, network-metrics, ode-solver, queueing-calculator, plot-maker]
sources:
  - "Models: Reynolds' boids (1987), Schelling's segregation model (1971) and the SIR epidemic model on a lattice, written for fibub from their published descriptions."
  - "Checked against an independent Python implementation of the Schelling and grid-SIR rules fed the same random number stream (identical grids after every test run), and by deterministic unit tests of each rule."
flow:
  - { icon: sliders, label: "Rules" }
  - { icon: target, label: "Seed" }
  - { icon: eye, label: "Run" }
  - { icon: chart, label: "Over time" }
---

## What it does

An agent-based model gives each individual, a bird, a household or a person, a few simple rules and lets them all act at once. Patterns that nobody planned appear at the level of the whole group. This playground has three classic models:

- **Boids**: birds that steer away from neighbours that are too close (**separation**), turn towards their neighbours' average heading (**alignment**) and move towards their neighbours' centre (**cohesion**). Flocks form from these three rules alone. The chart shows the **polarisation**, from about 0 when the birds head every which way to 1 when they all fly the same way.
- **Schelling segregation**: two groups on a grid. An agent is unhappy if fewer than a set share of its neighbours belong to its own group, and unhappy agents move to random empty cells. The chart shows the average share of alike neighbours and the share of unhappy agents.
- **SIR epidemic on a grid**: every cell is a person who is susceptible, infected or recovered. Infected people infect each susceptible neighbour with chance β per step, and recover with chance γ per step. The chart shows the three groups over time.

## How to use it

1. Choose a model and set its parameters. The description under the model choice explains what each rule does.
2. Pick a **seed**. The same seed and parameters always give exactly the same run, so you can share or repeat an experiment. Change the seed to see another random start.
3. Press **Step** to advance one step at a time, or **Run** to animate (choose the speed). **Reset** starts again. Changing a parameter also resets.
4. Download the time series as CSV, or a report with the picture and chart as an image, PDF or Word file.

## Worked examples

**Schelling** with the defaults (a 50 × 50 grid, 10 % empty, two equal groups, each agent wanting at least 40 % alike, seed 1): at the start agents have on average 49.5 % alike neighbours and 30.8 % are unhappy. After 26 steps of moving nobody is unhappy, and the average share of alike neighbours has risen to **83.2 %**. A mild wish not to be in a small minority produces strongly separated areas, the model's famous lesson.

**Boids** with the defaults (150 birds, seed 1): polarisation starts at 0.10 and reaches 0.72 after 300 steps and 0.86 after 600 as flocks line up.

**SIR** with the defaults (80 × 80 people, β = 0.25, γ = 0.1, 5 first infected, 4 neighbours): the infection spreads as growing rings, peaks at 1,047 people infected (16.4 %) at step 46, and dies out after 183 steps, by which time 6,383 of 6,400 have had it.

## Things to know

- Steps are synchronous for boids and SIR (everyone looks at the same moment, then everyone changes). In Schelling, the unhappy agents are found first, then they move one at a time in random order.
- Unlike the classic SIR equations, people here only meet their grid neighbours, so the epidemic spreads as fronts and is slower than in a well-mixed population.
- This is a playground for teaching and exploring, not a forecasting tool.

## Frequently asked questions

**Why does a run look the same each time?** Because the seed is the same. Change it for a different random start.

**Is anything stored or sent?** No. The models run in your browser and nothing is stored.
