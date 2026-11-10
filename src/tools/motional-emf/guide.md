---
name: Motional emf
num: 1414
shelf: learn
code: L255
section: school-physics
title: "Motional emf"
summary: "Slide a metal rod along two rails through a magnetic field and see the motional emf ε = Bℓv, the current and its direction, the magnetic drag force and the power. Push it at a steady speed, give it a push and let go, or pull it with a steady force and watch it reach a top speed."
status: live
ads: false
order: 1414
icon: ruler
works: offline
updated: 2026-11-09
related: [faraday-induction, fleming-rule, inductance-lab, transformer-calculator]
sources:
  - "Motional emf ε = Bℓv, current I = ε/R, force F = BIℓ = B²ℓ²v/R, power Fv = I²R, and the rod's speed v = v_t + (v₀ − v_t) e^(−t/τ) with τ = mR/(B²ℓ²) and v_t = FR/(B²ℓ²). Standard physics results (Newton's second law with the magnetic drag)."
  - "Checked against an independent Python script that steps Newton's law numerically (fourth-order Runge-Kutta)."
flow:
  - { icon: sliders, label: "Set B, ℓ, R" }
  - { icon: ruler, label: "Slide rod" }
  - { icon: chart, label: "Speed" }
  - { icon: check, label: "Check" }
---

## What it does

When a metal rod moves through a magnetic field, the free charges in it move with it, and the field pushes them along the rod. That push is an emf, the **motional emf**: ε = B ℓ v, where B is the field, ℓ the length of the rod across the field, and v its speed. You can also see it as Faraday's law: as the rod slides, the loop of rails, rod and resistor encloses more and more flux, at a rate of B ℓ v webers per second.

If the rails are joined by a resistor, a current I = ε/R flows. Now the field pushes on that current with a force F = B I ℓ, and (by Lenz's law) always **against** the motion. So keeping the rod moving takes work, and that work turns into heat in the resistor.

This page shows the rod sliding through a field into the page, with the current and the drag force drawn as arrows. It has three ways to move the rod: at a **steady speed** (you push), **push and let go** (it slows down and stops), and a **steady pull** (it speeds up to a top speed where the drag equals the pull). A graph shows the speed against time.

It follows the electromagnetic induction chapter of Class 12 Physics (motional electromotive force, energy consideration, Lenz's law). Before this, see a magnet and coil in [[faraday-induction]] and the force on a current in [[fleming-rule]]; after it, try coils that induce emfs in each other in the [[inductance-lab]].

## How to use it

1. Choose how the rod moves: **Steady speed**, **Push and let go** or **Steady pull**.
2. Set the field B (0.1 to 1 T), the rod length ℓ (10 to 100 cm) and the resistance R (1 to 10 Ω).
3. Set the speed v (steady speed and push), the rod's mass m (push and pull) or the pulling force (pull).
4. Press **Start** to run the motion, **Reset** to go back to the start. Read the emf, current, force and power as it moves.

## Worked example

The page opens with B = 0.5 T, ℓ = 50 cm, R = 2 Ω and the rod moving at a steady 4 m/s.

- ε = B ℓ v = 0.5 × 0.5 × 4 = **1 V**.
- I = ε / R = 1 / 2 = **0.5 A**, anticlockwise round the circuit.
- The drag force is F = B I ℓ = 0.5 × 0.5 × 0.5 = **0.125 N**, so you must push with 0.125 N.
- The power you supply is F v = 0.5 W, and the heat in the resistor is I²R = 0.5 W: the same.

Choose **Push and let go** with m = 0.2 kg: the time constant is τ = mR / (B²ℓ²) = 0.2 × 2 / (0.25 × 0.25) = 6.4 s, and the 1.6 J of kinetic energy ends up as heat. With a **Steady pull** of 0.5 N the top speed is FR / (B²ℓ²) = 16 m/s.

## Tips

- If the circuit is open (no resistor), the emf is still there but no current flows, so there is no drag.
- The drag grows with speed, which is why the rod never speeds up without limit under a steady pull.
- Eddy-current brakes in trains and some exercise bikes use exactly this drag.

## FAQ

**Which way does the current go?** Use the right-hand rule, or Lenz's law: the loop's area and flux are growing, so the current flows to make a field that opposes the increase, which here means anticlockwise.

**Is friction included?** No. The rails are frictionless, so all the slowing comes from the magnetic drag.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.
