---
name: River crossing boat
num: 1337
shelf: learn
section: school-physics
title: "River crossing and relative velocity: time to cross, drift downstream, and the heading to land straight opposite"
summary: "Point a boat across a flowing river and watch where it lands. See the boat's velocity, the river's velocity and the velocity over the ground added as arrows, the time to cross, the drift, and the headings for the fastest crossing and for landing straight opposite."
status: live
ads: false
order: 1337
icon: compass
works: offline
updated: 2026-11-09
related: [vector-adder, projectile-launcher, equations-of-motion]
sources:
  - "Relative velocity in two dimensions: velocity over the ground = velocity through the water + velocity of the water; the river-crossing results t = d / (vb cos θ), shortest time when heading straight across, and no drift when vb sin θ = vr. Standard school physics found in any textbook."
  - "Checked against hand-worked cases and, for a river faster than the boat, against a 0.001° scan of every heading for the least drift."
flow:
  - { icon: compass, label: "Aim boat" }
  - { icon: sliders, label: "Speeds" }
  - { icon: pointer, label: "Cross" }
  - { icon: target, label: "Landing" }
---

## What it does

A boat on a river is moved by two things at once: its own engine (or oars) pushing it **through the water**, and the water itself carrying it **downstream**. Its velocity over the ground is the vector sum of the two. That is **relative velocity**: the boat's speed depends on what you measure it against.

Choose the boat's speed through still water, the river's speed and width, and the direction the boat points, measured from straight across (upstream positive). The page draws the river from above with three arrows at the start: the boat's own velocity (blue), the river's (grey) and the resultant over the ground (red), and a dashed line to where the boat lands. Press **Cross** to watch it go.

It works out the **time to cross**, the **drift** downstream, the speed and direction over the ground, and two special headings: **straight across**, which is the fastest crossing, and the **upstream angle that lands straight opposite** (or, if the river is faster than the boat, the heading that drifts least).

It follows Class 11 Physics, motion in a plane (relative velocity in two dimensions), and the same idea explains why rain seems to fall at a slant when you run. The arrows add exactly as in [[vector-adder]]; each part on its own is steady motion in a line, as in [[equations-of-motion]]; and splitting a velocity into across and along parts is also the key to [[projectile-launcher]].

## How to use it

1. Set the **boat speed**, the **river speed** and the **river width**.
2. Set **where the boat points** with the slider: 0 is straight across, positive angles aim upstream, negative angles downstream.
3. Press **Cross** to animate it, or use the two buttons to jump to the **fastest crossing** or to the heading that **lands straight opposite**.
4. Read the working: the velocity split into the part across the river and the part along it.

## Worked example

Open the page: a boat that does **4 m/s** in still water, a river flowing at **3 m/s**, **100 m** wide, boat pointing straight across.

- Across: 4 m/s, so it crosses in 100 ÷ 4 = **25 s**.
- Along: the river carries it 3 × 25 = **75 m** downstream.
- Over the ground it moves at √(4² + 3²) = **5 m/s**, 36.9° downstream of straight across.

To land straight opposite, aim upstream so that 4 sin θ = 3: θ = **48.6°**. Now only 4 cos 48.6° = 2.65 m/s is left for crossing, and the trip takes 100 ÷ √7 = **37.8 s**.

## Tips

- The time to cross depends only on the part of the velocity across the river. The current changes where you land, not when.
- Landing opposite always takes longer than the fastest crossing.
- A swimmer in a fast river should swim at an angle upstream, but if the river is faster than they are, they cannot avoid drifting.

## FAQ

**Why is straight across the fastest, even though the boat drifts?** All of the boat's own speed goes into crossing. Any upstream angle "spends" part of it fighting the current.

**What if the boat is slower than the river?** It cannot land opposite. The least drift comes from pointing upstream at sin θ = boat speed ÷ river speed; the page shows that heading instead.

**Is anything stored?** No. Everything is worked out in your browser and nothing is saved or sent.
