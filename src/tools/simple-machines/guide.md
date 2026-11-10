---
name: Simple machines lab
num: 1026
shelf: learn
code: L13
section: school-physics
title: "Simple machines: levers (class 1, 2, 3), pulleys, inclined plane, wheel and axle; mechanical advantage, velocity ratio and efficiency"
summary: "Lift a load with a lever, a pulley system of 1 to 4 strands, a ramp or a wheel and axle; see the effort you need, the mechanical advantage, the velocity ratio and the efficiency, and check that work out is never more than work in."
status: live
ads: false
order: 1026
icon: ruler
works: offline
updated: 2026-11-09
related: [energy-track, newtons-laws, friction-ramp, gear-train-calculator]
sources:
  - "The principle of moments, mechanical advantage (load ÷ effort), velocity ratio (effort distance ÷ load distance), efficiency (MA ÷ VR) and the work principle for levers, pulleys, the inclined plane and the wheel and axle: standard school physics found in any textbook. g = 9.8 m/s² (rounded)."
  - "Checked against the principle of moments and the work principle on 500 random machines and against hand-worked examples. The masses and friction values are made-up examples."
flow:
  - { icon: sliders, label: "Pick machine" }
  - { icon: pointer, label: "Pull" }
  - { icon: calculator, label: "MA, VR" }
  - { icon: percent, label: "Efficiency" }
---

## What it does

Machines do not give you free work, but they let you swap a big force over a short distance for a small force over a long one. This lab has four of them. Pick one, set the load, and the page shows the **effort** you need, the **mechanical advantage** (MA = load ÷ effort), the **velocity ratio** (VR = how far the effort moves ÷ how far the load rises) and the **efficiency** (MA ÷ VR). Drag sideways on the picture, or move the **Pull** slider, to work the machine: the load rises while the effort moves, and the work in and work out are added up.

- **Lever:** choose class 1 (fulcrum in the middle), class 2 (load in the middle) or class 3 (effort in the middle) and move the fulcrum, load or effort along a 2 m beam.
- **Pulleys:** 1 to 4 strands holding the load, with the weight of the moving pulleys and some friction.
- **Ramp:** push a load up a slope of any length and height, with friction.
- **Wheel and axle:** turn a big wheel to wind a rope on a small axle, like a well winch.

It follows the school topics on simple machines, mechanical advantage, velocity ratio and efficiency, alongside work and energy (Class 9 Science, work, energy and simple machines). The energy side is in [[energy-track]], the forces in [[newtons-laws]] and the ramp with friction in [[friction-ramp]]; for gears, see [[gear-train-calculator]].

## How to use it

1. Choose a machine with the buttons at the top.
2. Set the **load mass**. Its weight in newtons is mass × 9.8.
3. Change the machine's own settings: lever class and position, number of strands, ramp length and height, or wheel and axle sizes.
4. Add **friction** (or lower the efficiency) to see why real machines need more effort than the ideal.
5. Drag across the picture or use the **Pull** slider to move the effort and watch the load rise.

## Worked example

Open the page: a **class 1 lever** with a **60 kg** load (588 N) at the end, the fulcrum **0.5 m** from the load and the effort at the other end, **1.5 m** from the fulcrum. Moments: effort × 1.5 = 588 × 0.5, so the effort is **196 N**. MA = 588 ÷ 196 = **3**, VR = 1.5 ÷ 0.5 = **3**, efficiency **100 %** (no friction at the pivot).

Switch to **Pulleys** with **2 strands**, 2 kg of moving pulleys and 5 % friction. The load and pulleys weigh 588 + 19.6 = 607.6 N, shared by two strands: 303.8 N, plus friction gives an effort of **319.8 N**. MA = 588 ÷ 319.8 = **1.84**, VR = **2**, efficiency **91.9 %**.

On the **Ramp** (5 m long, 1 m high, μ 0.1) the effort is **175.2 N** instead of lifting 588 N: VR 5, efficiency **67.1 %**.

## Tips

- MA can never beat VR in a real machine, because some work always goes into friction or lifting the machine's own parts.
- A class 3 lever has MA below 1, yet it is useful: your hand moves a little and the far end moves a lot, fast.
- More pulley strands means less effort but more rope to pull: four strands, four metres of rope for each metre the load rises.

## FAQ

**Why is a single fixed pulley useful if MA is 1?** It changes the direction of the force: you can pull down, using your own weight, to lift something up.

**What is the difference between MA and VR?** VR comes from the shape of the machine (distances) and does not change with friction. MA comes from the actual forces, so friction lowers it.

**Is anything saved?** No. Everything is worked out in your browser.
