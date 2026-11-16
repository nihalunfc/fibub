---
name: Belts and pulleys
num: 3017
shelf: learn
code: L383
section: school-physics
title: "Belts and pulleys: pulley speed ratio, torque, belt length, wrap angle and alignment explained"
summary: "Learn how a belt drive changes speed and torque (n1 × d1 = n2 × d2), how long a belt must be, why the small pulley slips first and why alignment and tension matter. Spin two pulleys at the right speeds, change their sizes and spacing, and see chains and sprockets too."
status: live
ads: false
order: 3017
icon: orbit
works: offline
updated: 2026-11-16
related: [simple-machines, gear-train-calculator, levers-in-tools, bearings-and-friction, shaft-bearing-life]
sources:
  - "Speed ratio n1 d1 = n2 d2, torque T = P ÷ ω, belt speed v = π d n ÷ 60, the open belt length approximation L ≈ 2C + π(D + d)/2 + (D − d)²/4C and the exact form with sin β = (D − d)/2C, and the wrap angle 180° − 2 asin((D − d)/2C): standard machine design formulas found in engineering textbooks and belt makers' design manuals."
  - "The 120° least wrap angle and about 30 m/s top speed for ordinary V-belts are common rules of thumb in belt makers' manuals; real limits depend on the belt, so check the maker's data. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Set pulleys" }
  - { icon: orbit, label: "Watch spin" }
  - { icon: calculator, label: "Speed, belt" }
---

## What it does

A belt or chain carries turning from one shaft to another, and by using pulleys of different sizes it can make the second shaft turn slower and stronger, or faster and weaker. This lesson explains the physics a millwright uses every day on belt drives. Seven illustrated idea cards cover the speed rule **n1 × d1 = n2 × d2**, why torque goes the other way, belt length, wrap angle, tension, alignment, and chains and sprockets. In the sim you set the size of the motor pulley and the driven pulley, the distance between them, the motor speed and its power, and watch both pulleys turn at the right speeds (slowed down so you can see them). The table shows the driven speed, the torque on each shaft, the belt speed, the belt length and the wrap angle on the small pulley. A short quiz checks it all.

It is lesson 3 of the free **How machines work** course, after [[levers-in-tools]]. For a real belt or gear drive use the [[gear-train-calculator|gear trains tool]], and see why belt pull matters to the shafts in [[bearings-and-friction]].

## How to use it

1. Read the **Stay safe** box. The lesson explains physics; it is not training to work on belts or machines.
2. Work through the idea cards, ticking **Done** as you go (kept only if you tick **Remember my ticks on this device**).
3. In **Try it**, move the sliders. The motor pulley is blue and the driven pulley orange. Press **Pause** to stop the animation.
4. Read the driven speed and the table. A warning shows if the wrap angle drops below 120° or the belt speed goes above about 30 m/s.
5. Take the quiz, then press **New questions** for another set.

## What each number means

- **Speed ratio:** d2 ÷ d1. A ratio of 2 : 1 means the driven pulley turns at half the motor speed.
- **Motor torque T1:** the motor's twisting force, from its power and speed: T = P ÷ ω, with ω = 2π × rpm ÷ 60.
- **Driven torque T2:** T1 × d2 ÷ d1, ignoring the few per cent a real belt loses.
- **Belt speed:** how fast the belt itself moves, π × d1 × n1 ÷ 60.
- **Belt length:** the formula L ≈ 2C + π(D + d)/2 + (D − d)²/4C, and the exact length for comparison. They agree to a millimetre or so unless the pulleys are very different and close together.
- **Wrap angle:** how much of the small pulley the belt touches. Less wrap means less grip.

## Worked example

A motor runs at 1,450 rpm with a 100 mm pulley, driving a 200 mm pulley 500 mm away. Driven speed: 1,450 × 100 ÷ 200 = **725 rpm**. The motor is 1.5 kW, so its torque is 1,500 ÷ (2π × 1,450 ÷ 60) = 9.88 N·m, and the driven shaft gets 9.88 × 200 ÷ 100 = **19.8 N·m**. Belt length: 2 × 500 + π × 300 ÷ 2 + 100² ÷ (4 × 500) = 1,000 + 471.2 + 5 = **1,476 mm**. Wrap on the small pulley: 180° − 2 × asin(100 ÷ 1,000) = 180° − 11.5° = **168.5°**, plenty of grip.

## FAQs

**Which diameter do I use, outside or pitch?** For speeds and belt lengths, the pitch diameter: where the belt's load-carrying cords run. It is a little less than the outside of a V-belt pulley. Makers list it.

**Why does the driven pulley run a little slower than the rule says?** Belts creep and slip slightly, usually 1 to 2 %. Toothed (timing) belts and chains do not.

**Can I just fit a bigger pulley to make a machine faster?** No. Blades, fans, grinding wheels and pumps have speed limits, and the motor may be overloaded. That is a job for a qualified technician.

**What does a crossed belt do?** It makes the driven pulley turn the other way. It is rare now; the [[gear-train-calculator]] can work one out.
