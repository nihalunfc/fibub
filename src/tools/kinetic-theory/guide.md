---
name: Kinetic theory
num: 1066
shelf: learn
code: L30
section: school-physics
title: "Kinetic theory"
summary: "Watch gas particles bounce around a box. The pressure is counted from their hits on the walls and compared with the gas law; a live histogram shows the speeds settle into the Maxwell shape. Then see the rms speed and average energy of real gases at any temperature."
status: live
ads: false
order: 1066
icon: chart
works: offline
updated: 2026-11-09
related: [states-of-matter, heating-curve, real-gas-calculator, random-walk-diffusion]
sources:
  - "Kinetic theory of an ideal gas: pressure from molecular collisions, PV = nRT, average kinetic energy (3/2)kT, v_rms = √(3RT/M), mean speed √(8RT/πM), most probable speed √(2RT/M), the Maxwell distribution and its two-dimensional (Rayleigh) form, hard-disc second virial coefficient πσ²/2: standard physics."
  - "R = 8.314462618 J/(mol K) and k = 1.380649 × 10⁻²³ J/K (SI, exact); molar masses from standard atomic weights."
  - "Checked against an independent Python calculation; the disc model is tested for energy conservation, its counted wall pressure against the 2D gas law with the hard-disc correction (within 3%), and its speeds against the 2D Maxwell shape."
flow:
  - { icon: sliders, label: "Heat, squash" }
  - { icon: eye, label: "Watch hits" }
  - { icon: chart, label: "Speeds" }
  - { icon: check, label: "Check" }
---

## What it does

A gas is a huge number of tiny particles flying about and bouncing off each other and off the walls. Every bounce gives the wall a small push; billions of pushes each second add up to the steady **pressure** you measure. This page puts a few dozen particles in a box with a movable piston. It really counts the push from every wall hit and compares the result with the **gas law**: more particles, a smaller box or a higher temperature all mean more and harder hits. A live **histogram** shows the particles' speeds: they all start equal, then collisions spread them into the **Maxwell** shape. A second card gives the **rms speed** and **average kinetic energy** of real gases at the same temperature.

It follows the school topics on gases: Class 11 Physics, Kinetic Theory (molecular nature of matter, behaviour of gases, kinetic theory of an ideal gas, pressure of an ideal gas, kinetic interpretation of temperature, rms speed), and Class 11 Chemistry, States of Matter (gas laws and the kinetic molecular theory). Before this, see [[states-of-matter]] and [[heating-curve]]; afterwards, [[real-gas-calculator]] shows when real gases stop obeying the ideal law, and [[random-walk-diffusion]] follows one particle's zig-zag path.

## How to use it

1. Set the **temperature** in kelvin. Heating makes every particle move faster (speed ∝ √T).
2. Set the **number of particles** and push the **piston** in or out with the box width slider.
3. Read the **pressure from wall hits** (averaged over the last few seconds) and the **ideal-gas value**, both relative to the starting box (300 K, 60 particles, full width). Give the count a few seconds to settle after a change.
4. Watch the **speed histogram**. **Start again** gives every particle the same speed so you can watch the spread grow.
5. In the second card, pick a **gas** to see its rms, average and most likely speeds and the average energy per molecule at the same temperature.

## Worked example

For nitrogen (M = 0.02801 kg/mol) at 300 K: v_rms = √(3 × 8.314 × 300 / 0.02801) = 516.8 m/s, about 1,861 km/h. The average speed is √(8RT/πM) = 476.2 m/s and the most likely speed √(2RT/M) = 422 m/s. The average kinetic energy per molecule is (3/2)kT = 6.213 × 10⁻²¹ J, the same for every gas at 300 K. One mole of any ideal gas in 22.4 L at 300 K has a pressure of 111.4 kPa. Helium at the same temperature has v_rms = 1,367 m/s, because its molecules are 7 times lighter.

In the box, set 1,200 K: the ideal value becomes 4.00 times the start, and the counted pressure follows it. Halve the width at 300 K and it becomes 2.00.

## Check yourself

Five questions, fresh each time: the rms speed of a gas, how the rms speed changes with temperature, the average kinetic energy of a molecule, the pressure from PV = nRT, and what happens to the pressure when you halve the volume. Nothing is saved.

## Tips

- Temperature is a measure of the average kinetic energy of the particles: (3/2)kT per molecule, whatever the gas.
- The counted pressure comes out a few percent above the ideal value because the discs take up some of the box. Real molecules do the same at high pressure; that is the b in the van der Waals equation.
- The box is flat (two-dimensional) to keep it simple, so its Maxwell curve is the 2D shape; the real-gas numbers use the full 3D formulas.

## FAQ

**Why do the speeds spread out if every particle starts the same?** In a collision one particle usually speeds up and the other slows down, while their total energy stays the same. After many collisions the speeds settle into the Maxwell shape.

**Why is pressure ∝ T and not √T?** Faster particles hit the walls both harder and more often; each is ∝ √T, so together ∝ T.

**Is this from NCERT?** No. It is an independent study aid that follows the same school topics, with its own pictures and numbers.
