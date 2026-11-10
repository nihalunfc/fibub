---
name: Floating and buoyancy
num: 1345
shelf: learn
code: L194
section: school-physics
title: "Buoyancy and Archimedes' principle simulator: why things float or sink, upthrust, how much floats under water, apparent weight and relative density"
summary: "Drop a cube of cork, wood, wax, ice, aluminium or iron into water, sea water, kerosene, glycerine or mercury. See whether it floats and how much of it sits under the surface, push it down to feel the extra upthrust, or hang a sinking block on a spring balance and read its apparent weight and relative density."
status: live
ads: false
order: 1345
icon: target
works: offline
updated: 2026-11-09
related: [hydraulic-lift, capillary-rise, stokes-terminal-velocity, bernoulli-flow]
sources:
  - "Archimedes' principle (the upthrust equals the weight of the fluid displaced), the law of flotation (a floating body displaces its own weight of liquid, so the fraction under is ρ_body/ρ_liquid), apparent weight and relative density: standard school physics found in any textbook. g = 9.8 m/s²."
  - "Densities are rounded, typical values (cork 240, pine 500, wax 900, ice 920, aluminium 2700, iron 7900; fresh water 1000, sea water 1025, kerosene 800, glycerine 1260, mercury 13 600 kg/m³), not data for any particular sample."
  - "Checked by hand (10 cm pine cube in water: 4.9 N, half under; 10 cm iron cube: balance reads 67.62 N) and on 300 random cases: the forces on the block always balance."
flow:
  - { icon: pointer, label: "Pick block" }
  - { icon: target, label: "Float?" }
  - { icon: calculator, label: "Upthrust" }
  - { icon: check, label: "Check" }
---

## What it does

Why does a huge iron ship float while a small iron nail sinks? Any liquid pushes up on whatever is in it with a force called the **upthrust** (or buoyant force). **Archimedes' principle** says how big it is: the weight of the liquid the object pushes aside. A block floats when it can push aside its own weight of liquid before it is fully under, which happens when it is less dense than the liquid.

This tool drops a cube into a tank and shows the weight and upthrust as arrows. A floating block settles with just the right part under the surface; push it down with your finger and you feel the extra upthrust. A block that sinks hangs from a **spring balance**, which reads less than in air by exactly the weight of the liquid it displaces: from the two readings you get its **relative density**.

It follows the school topics on thrust, pressure and buoyancy, Archimedes' principle and relative density (Class 9 Science and Class 8 Science on pressure and forces), and the related ideas in Class 11 Physics on fluids. For pressure passed on through a liquid see [[hydraulic-lift]], and for a body falling through a liquid [[stokes-terminal-velocity]].

## How to use it

1. Pick a **block** and a **liquid**. The pill says whether it floats or sinks and why.
2. Change the **side of the cube**. Bigger blocks have more weight and more upthrust in the same ratio.
3. For a floating block, drag it down in the picture or use the **push** slider to hold more of it under, and read the extra push needed.
4. For a sinking block, read the spring balance, the loss of weight and the relative density.

## Worked example

Open the page: a **10 cm** cube of **pine** (500 kg/m³) in **fresh water**. Its volume is 0.001 m³, its mass 0.5 kg and its weight **4.9 N**. It floats with 500 ÷ 1000 = **50 %** under the surface, pushing aside **500 mL** of water, whose weight is 4.9 N: the upthrust equals the weight. Push it right under and the upthrust becomes 9.8 N, so you need a push of **4.9 N** to hold it there.

Pick **iron** (7900 kg/m³): the cube weighs **77.42 N** in air. Fully under water the upthrust is 9.8 N, so the spring balance reads 77.42 − 9.8 = **67.62 N**, and the relative density is 77.42 ÷ 9.8 = **7.9**. Put **ice** in **sea water** and **89.76 %** of it is under the surface: the tip of the iceberg really is about a tenth.

## Tips

- Floating or sinking depends on density, not on weight: a big log floats, a small pebble sinks.
- A ship floats because its hull holds air, so the ship as a whole is less dense than water.
- A floating body sinks deeper in a less dense liquid; this is how a hydrometer measures density.

## FAQ

**Why does the upthrust not depend on depth?** The liquid pushes harder lower down, but once the block is fully under, the difference between the push on its bottom and its top stays the same.

**Is the relative density the same as density?** It is the density divided by the density of water, so it has no unit.

**Is anything stored?** No. It all runs in your browser.
