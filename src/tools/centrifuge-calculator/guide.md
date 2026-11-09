---
name: Centrifuge calculator
num: 115
shelf: science
section: molecular-biology
title: "Centrifuge calculator: rpm to × g (RCF) and back, rotor k-factor and pelleting time"
summary: "Convert rotor speed to relative centrifugal force (× g) and back for any radius, find a rotor's k-factor and how long particles of a given sedimentation coefficient take to pellet, and work out the run time when you move a protocol to a different rotor."
status: live
ads: true
order: 9
icon: orbit
works: offline
updated: 2026-11-08
related: [buffer-recipe-calculator, solution-calculator, pcr-master-mix, hemocytometer]
sources:
  - "RCF and k-factor: standard physics of circular motion and sedimentation (RCF = ω²r/g; k = ln(rmax/rmin)·10¹³ / (3600·ω²))."
  - "Standard gravity 9.80665 m/s²: an exact defined value (CGPM)."
  - "Sedimentation coefficients: rough, rounded orientation values; ribosome names are their S values by definition."
flow:
  - { icon: orbit, label: "Speed" }
  - { icon: ruler, label: "Radius" }
  - { icon: calculator, label: "× g" }
  - { icon: clock, label: "Run time" }
---

## What it does

A centrifuge protocol should give the force in multiples of gravity (× g, also called relative centrifugal force or RCF), because the same rpm gives very different forces in different rotors. This tool converts in both directions:

**RCF = ω²r / g = 1.118 × 10⁻⁵ × r (cm) × rpm²**

It also does two things that are hard to do by hand.

- **k-factor and pelleting time.** The k-factor sums up how quickly a rotor pellets at a given speed. The time in hours to pellet particles with a sedimentation coefficient S, in svedbergs, is roughly k / S. It applies to particles that start spread through the tube and must travel from the minimum radius to the maximum.
- **Moving a protocol to another rotor.** If a protocol says "60 min in rotor A", the same separation in rotor B takes 60 × kB / kA minutes. This is more accurate than matching × g, because it also counts how far the particles must travel.

Make up the buffers for the run with the [[buffer-recipe-calculator]], and count the cells in the pellet afterwards with the [[hemocytometer]].

## How to use it

1. **rpm and × g.** Enter the radius and choose its unit. Type a speed to get the force, or type a force to get the speed. Use the maximum radius (to the tube bottom) unless a protocol names another. The facts show the speed that gives the same force on a 7 cm and a 15 cm rotor.
2. **Rotor k-factor.** Enter the minimum and maximum radius of the rotor (the rotor manual lists both), the speed, and a sedimentation coefficient, or pick a particle from the list. You get the k-factor, the force at the minimum, average and maximum radius, the time to pellet, and a chart of pelleting time against speed.
3. **Same run in another rotor.** Enter the protocol time and its rotor's k-factor, then your rotor's radii and speed. The k-factor from the card above is filled in until you type your own.

Always stay within the rotor's and the tubes' rated speed and force, and balance the rotor.

## Worked example

A microcentrifuge with a 9.5 cm radius at 13,000 rpm gives **17,953 × g**. The same force needs 15,145 rpm on a 7 cm rotor and 10,346 rpm on a 15 cm rotor.

An ultracentrifuge rotor with radii from 4.0 to 8.5 cm, at 40,000 rpm, has a **k-factor of 119.3**. The force is 71,568 × g at the minimum radius and 152,081 × g at the maximum. Bacterial 70S ribosomes pellet in about 102 minutes.

A protocol written for that rotor says 60 min. A rotor with radii from 3.5 to 7.5 cm, at 45,000 rpm, has k = 95.3, so the same separation takes about **48 min**.

## Questions

**Why does the k-factor time differ from what my protocol says?** k / S assumes water at 20 °C and particles that start evenly spread through the tube. Dense sucrose or glycerol, cold runs, and part-filled tubes all change the real time. Use it to compare rotors, not as an exact time.

**Which radius should I use?** For pelleting, use the maximum radius, since that is where the pellet forms. Some protocols quote the average radius instead. The rotor card shows all three.

**Is anything sent anywhere?** No. Everything is worked out in your browser, and the page works offline once loaded.
