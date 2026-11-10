---
name: Energy skate track
num: 1025
shelf: learn
code: L12
section: school-physics
title: "Kinetic and potential energy on a track: shape the track, watch KE, PE and heat swap, friction, and loop the loop"
summary: "Shape a track with your finger, let a ball roll and watch kinetic energy, potential energy and heat trade places while the total stays the same; add friction and see it turn into heat; then find the lowest start that gets a ball round a loop."
status: live
ads: false
order: 1025
icon: curve
works: offline
updated: 2026-11-09
related: [newtons-laws, friction-ramp, pendulum-analyser]
sources:
  - "Kinetic energy ½mv², potential energy mgh, conservation of mechanical energy, the work-energy theorem and the loop-the-loop condition (v² ≥ gr at the top, h ≥ 2.5r): standard school physics found in any textbook. g = 9.8 m/s² (rounded)."
  - "The energy-based motion was checked against an independent force-based (velocity Verlet) integration along the same track, against v = √(2gΔh), and the loop results against hand-worked values. The track shape and friction values are made up."
flow:
  - { icon: pencil, label: "Shape track" }
  - { icon: curve, label: "Roll ball" }
  - { icon: chart, label: "KE, PE, heat" }
  - { icon: target, label: "Loop" }
---

## What it does

A ball rolls along a track that you shape yourself. Four bars show its energy as it goes: **kinetic energy** (KE, from its speed), **potential energy** (PE, from its height), **heat** made by friction, and the **total**. Watch KE and PE swap places: high up the ball is slow and has lots of PE; at the bottom it is fast and has lots of KE. With no friction the total never changes and the ball always climbs back to the dashed line at its starting height. Turn friction up and the heat bar grows until the ball stops.

The **Loop the loop** mode sends a ball down a smooth ramp into a vertical loop. Change the starting height and the loop size to find out whether it gets round, falls off part-way (and where), or just rolls back.

It follows the school topics on energy: kinetic and potential energy and the conservation of energy (Class 9 Science, work and energy), and the work-energy theorem, conservative forces and motion in a vertical circle (Class 11 Physics, work, energy and power). Friction itself is explored on a slope in [[friction-ramp]] and forces on a trolley in [[newtons-laws]]; a real pendulum swaps the same energies in [[pendulum-analyser]].

## How to use it

1. Pick a **Level**. Class 9 shows the energy bars and the KE + PE + heat sum with your numbers. Class 11 adds the work done by friction (the work-energy theorem) and, in Loop the loop, where and why the ball leaves the track.
2. **Shape a track**: drag the five round handles up and down. Tap anywhere on the track to put the ball there (it starts at rest).
3. Press **Play**. Press it again to pause, and **Reset** to put the ball back.
4. Set **friction** (0 is perfectly smooth) and the **mass**. The mass changes every energy in joules but not the way the ball moves.
5. **Loop the loop**: set the starting height h and the loop radius r and press Play.

## Worked example

Open the page: a **2 kg** ball starts at rest **6 m** up on the left. Its energy is all potential: 2 × 9.8 × 6 = **117.6 J**. As it rolls down, the PE bar shrinks and the KE bar grows, and the total stays **117.6 J**. Near the lowest point (0.5 m high) its speed is √(2 × 9.8 × 5.5) ≈ **10.4 m/s**. It bounces off the right wall and comes back up to 6 m again.

In **Loop the loop** with r = **2 m**: from h = **6 m** the ball reaches the bottom at **10.84 m/s** and gets round with 6.26 m/s at the top (it needs at least √(9.8 × 2) = 4.43 m/s). The lowest start that works is **5 m** (2.5 × r). From 4 m it falls off the loop **3.33 m** up, 131.8° of the way round.

## Tips

- Energy is never lost, only changed into other forms. Friction turns it into heat (and a little sound).
- The speed at a given height does not depend on the shape of the track in between, only on how far below the start it is (without friction).
- The mass cancels from every speed: a heavy and a light ball roll in exactly the same way.

## FAQ

**Is the ball rolling or sliding?** The model treats it as a small sliding bead, so all its kinetic energy is in moving along. A real rolling ball also stores some energy in its spin and so goes a little slower.

**Why does it need 2.5 times the radius, not 2?** At the top it must still be moving fast enough for gravity alone to keep it on its circle, so it needs some kinetic energy left over: half a radius' worth of height.

**Is anything stored?** No. Everything runs in your browser and nothing is saved or sent.
