---
name: Bearings and friction
num: 3018
shelf: learn
code: L384
section: school-physics
title: "Bearings and friction: plain, ball and roller bearings, lubrication and why bearings fail"
summary: "See why a ball bearing lets a flywheel coast for hours while a dry bush stops it in two minutes. Learn sliding and rolling friction, plain, ball and roller bearings, what grease does, why bearings fail and the warning signs, then name the parts of a ball bearing."
status: live
ads: false
order: 3018
icon: target
works: offline
updated: 2026-11-16
related: [shaft-bearing-life, friction-ramp, belts-and-pulleys, levers-in-tools, simple-machines, moment-of-inertia]
sources:
  - "Friction torque T = μ F r, moment of inertia of a solid disc I = ½ m R², constant deceleration α = T ÷ I and kinetic energy ½ I ω²: standard physics found in any textbook. g = 9.8 m/s² (rounded)."
  - "Friction coefficients are typical values: dry and oiled plain bushes from engineering friction tables; ball (about 0.0015) and cylindrical roller (about 0.0011) from the constant-coefficient estimate in rolling bearing makers' catalogues. Real values change with speed, load, grease, seals and temperature. Drawings are fibub's own."
flow:
  - { icon: pointer, label: "Pick bearing" }
  - { icon: play, label: "Spin, coast" }
  - { icon: check, label: "Name parts" }
---

## What it does

Every turning shaft sits in bearings, and bearings are among the parts a millwright checks and changes most. This lesson explains the physics: sliding friction versus rolling friction, how plain (bush) bearings and ball and roller bearings work, what lubrication does, why bearings fail and the warning signs before they do. Six illustrated idea cards cover the ideas. In the sim you spin a 40 cm steel flywheel on a 25 mm shaft, choose a dry bush, an oiled bush, a ball bearing or a roller bearing, and watch it coast to a stop. Friction torque T = μ × F × r slows it, and the spin energy becomes heat in the bearing, shown as a glow. A table compares all four bearing types. You can then tap the parts of a ball bearing and take a short quiz.

It is lesson 4 of the free **How machines work** course, after [[belts-and-pulleys]]. For a real bearing's rated life use [[shaft-bearing-life|the bearing life tool]], and for friction on a slope try the [[friction-ramp]].

## How to use it

1. Read the **Stay safe** box. The lesson explains physics; it is not training to work on machines.
2. Work through the idea cards, ticking **Done** as you go (kept only if you tick **Remember my ticks on this device**).
3. In **Try it**, pick a bearing and press **Spin and let go**. Time runs faster than real life so slow coasts fit in about 15 seconds; the line under the picture says how much faster.
4. Change the start speed, the flywheel mass and the extra side load (like the pull of a belt). The table updates for all four bearings.
5. Tap the parts of the ball bearing, press **Test me**, then take the quiz.

## What each bearing type means

- **Dry plain bush (μ about 0.15):** metal rubbing on metal or plastic. Cheap and simple, but it wears and makes heat.
- **Oiled plain bush (μ about 0.02):** an oil film keeps the surfaces mostly apart. At high speed a full film can make friction even lower.
- **Ball bearing (μ about 0.0015):** balls roll between two rings. Low friction, good for high speeds and moderate loads.
- **Roller bearing (μ about 0.0011):** cylinders roll instead of balls. Line contact carries heavier loads.

## Worked example

The 20 kg flywheel spins at 1,000 rpm on a dry bush. Its weight is 20 × 9.8 = 196 N. Friction torque: 0.15 × 196 × 0.0125 = **0.37 N·m**. The disc's moment of inertia is ½ × 20 × 0.2² = 0.4 kg·m², so it slows by 0.37 ÷ 0.4 = 0.92 rad/s every second. Its start speed is 2π × 1,000 ÷ 60 = 104.7 rad/s, so it stops after 104.7 ÷ 0.92 = **114 s**, about two minutes. On ball bearings μ is 100 times smaller, so it would coast 100 times longer, over 3 hours, if nothing else slowed it. Either way all 2,190 J of spin energy ends up as heat. At the start the dry bush makes 0.37 × 104.7 = **38 W** of heat in a small spot, which is why dry bushes get hot.

## FAQs

**Does a real flywheel on ball bearings coast for three hours?** No. Air drag and rubbing seals slow it much sooner. The sim leaves them out so you can compare the bearings themselves.

**Why does more side load make the bearing hotter?** Friction torque is μ × F × r, so doubling the load F doubles the friction and the heat. An over-tight belt does exactly this to motor bearings.

**Is more grease better?** No. Too much grease churns and overheats the bearing. Makers say how much to use and how often.

**What is L10 life?** The number of hours (or turns) that 90 % of a batch of identical bearings will reach under a given load. The [[shaft-bearing-life]] tool works it out from the catalogue rating.
