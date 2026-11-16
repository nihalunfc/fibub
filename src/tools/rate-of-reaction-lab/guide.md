---
name: Rate lab
num: 2162
shelf: learn
code: L329
section: school-chemistry
title: "Rate of reaction lab: temperature, concentration, surface area and catalysts"
summary: "Change the temperature, concentration, particle size and catalyst and watch the gas collected over time. See how collision theory explains faster and slower reactions."
status: live
ads: false
order: 2162
icon: sliders
works: offline
updated: 2026-11-16
related: [reaction-kinetics-fitter, le-chatelier, equilibrium-solver, states-of-matter]
sources:
  - "A teaching model: rate constant k = k₀ × concentration × surface area × e^(−Ea/R × (1/T − 1/298)), with Ea about 50 kJ/mol (35 kJ/mol with a catalyst), R = 8.314 J/(mol K) (CODATA). Numbers are illustrative, not measurements of any real reaction."
flow:
  - { icon: sliders, label: "Set" }
  - { icon: curve, label: "Watch" }
  - { icon: check, label: "Check" }
---

## What it does

A reaction goes faster when particles collide more often and more of the collisions have enough energy to react. This lab models a reaction that makes a gas, such as acid on marble chips, and plots the volume of gas against time. You change four things that affect the rate: temperature, concentration, the size of the solid pieces and whether a catalyst is added, and the curve changes straight away.

The model is for teaching: the numbers are illustrative, but the pattern is real. A steeper curve at the start means a faster reaction, and all the curves end at the same volume because the amount of reactant has not changed. To fit real data to a rate law, use [[reaction-kinetics-fitter]], and for reactions that go both ways see [[le-chatelier]] and [[equilibrium-solver]].

## How to use it

1. Set temperature, concentration and the particle size of the solid.
2. Tick the catalyst box to lower the energy barrier.
3. Read the time for 90% of the gas to form, and the starting rate.
4. Press "Keep this curve" to leave it on the graph, then change one setting and compare.
5. Answer the questions at the bottom.

## What each setting does

- **Temperature**: higher temperature gives particles more energy, so more collisions are successful. About 10 °C higher roughly doubles the rate.
- **Concentration**: more particles in the same volume means more collisions per second.
- **Particle size**: powder has more surface area than lumps, so more particles can be hit.
- **Catalyst**: gives the reaction an easier route with a lower activation energy and is not used up.
- **A-level**: shows the rate constant k and activation energy.

## Worked example

With the default settings (25 °C, 1.0 mol/dm³, lumps, no catalyst) the model gives a rate constant of 0.05 per second, so 90% of the gas has formed after ln 10 ÷ 0.05 = 46 s. Doubling the concentration doubles k, so the time halves to 23 s. The curve for the doubled concentration climbs twice as fast, but ends at the same 100 cm³.

## FAQs

**Why do all the curves end at the same height?** The amount of the limiting reactant has not changed, so the total gas is the same. Only how fast it is made differs.

**Does a catalyst change the amount of product?** No. It only helps the reaction reach the same end point faster.

**Why does temperature matter more than concentration?** A small rise in temperature increases both the collision rate and, much more, the fraction of collisions with enough energy, which is why the rate roughly doubles for each 10 °C.

**Is the real world this neat?** No. Real rates depend on the reaction and conditions. This is a model to practise the ideas.
