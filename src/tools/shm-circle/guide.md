---
name: SHM circle
num: 1062
shelf: learn
code: L26
section: school-physics
title: "SHM circle"
summary: "A point goes round a circle at a steady speed; its shadow moves in simple harmonic motion. Change the amplitude, period and phase, watch the x, v and a graphs and the energy bars, and turn the same motion into a mass on a spring or a pendulum."
status: live
ads: false
order: 1062
icon: orbit
works: offline
updated: 2026-11-09
related: [pendulum-analyser, coupled-oscillators, sound-wave-visualiser]
sources:
  - "Simple harmonic motion as the projection of uniform circular motion, x = A cos(ωt + φ), v = −Aω sin(ωt + φ), a = −ω²x, energy ½kA² with k = mω², spring-mass period 2π√(m/k), small-swing pendulum period 2π√(L/g): standard physics."
  - "g = 9.8 m/s² (school value); Moon about 1.62 m/s² and Mars about 3.71 m/s² are rounded general values."
  - "Checked against an independent Python calculation and a step-by-step numerical solution of m x″ = −k x written for the tests."
flow:
  - { icon: orbit, label: "Circle" }
  - { icon: eye, label: "Shadow" }
  - { icon: curve, label: "Graphs" }
  - { icon: check, label: "Check" }
---

## What it does

Shine a light from above onto a ball going round a circle at a steady speed, and its shadow on the floor slides back and forth: fast in the middle, slowing to a stop at each end, then back again. That back-and-forth motion is **simple harmonic motion (SHM)**, the motion of a mass on a spring and of a pendulum making small swings. This page shows the circle and its shadow side by side, draws the **position, velocity and acceleration** graphs with a line at the present moment, and shows how the **energy** swaps between kinetic and potential while the total stays the same.

It follows the school topic of oscillations: Class 11 Physics, Oscillations (periodic motion, SHM and uniform circular motion, velocity and acceleration in SHM, force law, energy, the spring-mass system and the simple pendulum). Use [[pendulum-analyser]] to time a real pendulum, [[coupled-oscillators]] to see several springs together, and [[sound-wave-visualiser]] to see SHM passed along as a wave.

## How to use it

1. Choose what moves: **Circle** (just the point and its shadow), **Spring** (a block on a spring) or **Pendulum** (a bob on a string).
2. Set the **amplitude A**: the radius of the circle, which is how far the shadow goes either side of the middle.
3. Set the **starting phase φ**: where on the circle the point starts at t = 0. At 0° it starts at the right end; at 90° it starts in the middle, moving left.
4. On **Circle**, set the time for one turn (the period T). On **Spring**, set the **mass m** and the **spring constant k**; on **Pendulum**, set the **string length L** and the planet. The period is worked out with the numbers filled in.
5. The **mass** also sets the energy: E = ½ k A², with k = mω².
6. **Pause**, **Back to t = 0** and **Slow motion** help you stop at a moment and read x, v and a in the line under the picture.

## Worked example

With the page as it opens (Circle, A = 10 cm, T = 2 s, φ = 0°, m = 0.5 kg): ω = 2π / 2 = 3.142 rad/s. The top speed is Aω = 10 × 3.142 = 31.42 cm/s, in the middle. The biggest acceleration is Aω² = 0.1 × 3.142² = 0.987 m/s², at the ends. The spring constant that gives this motion is k = mω² = 4.935 N/m and the total energy is ½ k A² = 0.02467 J.

Switch to **Spring** with m = 0.5 kg and k = 20 N/m: T = 2π√(0.5 / 20) = 0.9935 s. Switch to **Pendulum** with L = 1 m on Earth: T = 2π√(1 / 9.8) = 2.007 s.

## Check yourself

Five questions with fresh numbers: a spring's period, a pendulum's period, the greatest speed and greatest acceleration from the amplitude and period, and where in the swing the speed, acceleration or potential energy is largest. Answers are checked on the page and the working is shown. Nothing is saved.

## Tips

- The period of SHM does not depend on the amplitude. Double A and the block goes twice as far, twice as fast, in the same time.
- The minus sign in a = −ω²x is the key to SHM: the push is always back towards the middle and grows with the distance from it.
- The pendulum formula holds for small swings (up to about 10°). Big swings take a little longer.

## FAQ

**Why a circle?** Because the side-to-side part of steady circular motion is exactly x = A cos(ωt + φ). The angle ωt + φ on the circle is the phase.

**Why is velocity ahead of position?** The velocity curve reaches its peak a quarter of a period before the position does: −sin θ = cos(θ + 90°).

**Is this from NCERT?** No. It is an independent study aid that follows the same school topics, with its own pictures and numbers.
