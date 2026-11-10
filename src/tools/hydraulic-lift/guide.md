---
name: Hydraulic lift
num: 1341
shelf: learn
code: L190
section: school-physics
title: "Hydraulic lift simulator: Pascal's law, small and big pistons, force multiplied and distance divided, with the pressure and work"
summary: "Push the small piston of a hydraulic lift and watch the big one raise a car. Change the piston sizes and the load to see the force needed, the pressure in the oil, how far the load rises and why the work in equals the work out."
status: live
ads: false
order: 1341
icon: sliders
works: offline
updated: 2026-11-09
related: [simple-machines, bernoulli-flow, buoyancy-lab, stress-strain-test]
sources:
  - "Pressure p = F/A, Pascal's law (an extra pressure applied to an enclosed liquid reaches every part of it), F₂/F₁ = A₂/A₁ for a hydraulic lift and A₁x₁ = A₂x₂ for an incompressible liquid: standard school physics found in any textbook. g = 9.8 m/s²; 1 atmosphere = 101 325 Pa."
  - "The preset sizes and loads are made-up, round examples, not the specification of any real lift, jack or press."
  - "Checked by hand: 1200 kg on a 40 cm piston needs 117.6 N on a 4 cm piston at 93.58 kPa; work in equals work out to 1 part in 10⁹ on 500 random cases."
flow:
  - { icon: pointer, label: "Push" }
  - { icon: sliders, label: "Pistons" }
  - { icon: calculator, label: "Force out" }
  - { icon: check, label: "Check" }
---

## What it does

A hydraulic lift lets one person hold up a car. A small piston and a big piston sit in two cylinders joined by a pipe full of oil. Push the small one and the pressure you make spreads through the oil to every part of it (**Pascal's law**). The big piston has a much larger area, so the same pressure gives it a much larger force.

This tool draws the lift and lets you push the small piston down. Change the width of each piston and the load on the big one, and read the force you need, the pressure in the oil, how far the load rises, and the work done on each side. It shows the catch too: the force is multiplied by the area ratio, but the distance is divided by the same number, so the work in equals the work out.

It follows the school topics on pressure and Pascal's law, hydraulic machines and pressure in liquids (Class 11 Physics, mechanical properties of fluids; Class 8 Science, pressure). For levers and pulleys, the other force multipliers, see [[simple-machines]]; for liquids that flow see [[bernoulli-flow]], and for the upward push of a liquid [[buoyancy-lab]].

## How to use it

1. Pick a preset (garage car lift, bottle jack or hydraulic press) or set your own sizes.
2. Drag the **small piston** down in the picture or with the slider.
3. Change the **diameters** of the pistons and the **load**. The facts update at once.
4. Read the force needed, the area ratio, the pressure, how far the load rises, the work on both sides and the number of 10 cm strokes needed to lift it by a metre.

## Worked example

Open the page: the garage car lift, with a small piston **4 cm** across, a big piston **40 cm** across and a **1200 kg** car. The car weighs 1200 × 9.8 = 11 760 N. The big piston is 10 times as wide, so its area is 10² = **100 times** bigger, and the force needed on the small piston is 11 760 ÷ 100 = **117.6 N**: like holding a 12 kg bag. The pressure in the oil is 117.6 N ÷ 0.001257 m² = **93.58 kPa**, a little less than the air pressure around us.

Push the small piston down **20 cm** and the car goes up only 20 ÷ 100 = **2 mm**. The work in is 117.6 N × 0.2 m = **23.52 J**, and the work out is 11 760 N × 0.002 m = 23.52 J too. To raise the car by 1 m you need **1000** strokes of 10 cm, which is why real lifts use a motor-driven pump.

## Tips

- Doubling a piston's width multiplies its area, and so its force, by four.
- Real oil squashes a tiny bit and the seals rub, so a real lift gives a little less than this.
- Car brakes use the same idea to carry the push of your foot to all four wheels.

## FAQ

**Why oil and not air?** Air squashes, so pushing the small piston would mostly squeeze the air instead of lifting the load.

**Does the shape of the pipe matter?** No. Pascal's law says the extra pressure is the same everywhere in the liquid, whatever the shape.

**Is anything stored?** No. It all runs in your browser.
