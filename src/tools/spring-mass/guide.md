---
name: Spring combinations
num: 1352
shelf: learn
code: L214
section: school-physics
title: "Spring combinations"
summary: "Hang a mass on one spring, two springs one below the other, or two side by side, and watch it bob. See the combined spring constant, how far it hangs, the period T = 2π√(m/k) and the energy, all with your numbers, and compare series with parallel."
status: live
ads: false
order: 1352
icon: sliders
works: offline
updated: 2026-11-09
related: [shm-circle, pendulum-lab, coupled-oscillators, newtons-laws]
sources:
  - "Hooke's law F = kx, springs in series 1/k = 1/k₁ + 1/k₂ and in parallel k = k₁ + k₂, period of a mass on a light spring T = 2π√(m/k), static stretch x = mg/k, energy ½kA²: standard mechanics."
  - "g = 9.8 m/s² (school value)."
  - "Checked against an independent Python calculation and a step-by-step simulation of two springs in series."
flow:
  - { icon: sliders, label: "Join springs" }
  - { icon: calculator, label: "Combined k" }
  - { icon: clock, label: "Period" }
  - { icon: check, label: "Check" }
---

## What it does

A mass hanging on a spring sinks until the spring's pull balances its weight, then bobs up and down about that resting point if you pull it and let go. This page shows that with **one spring**, with **two springs in series** (one below the other) and with **two springs in parallel** (side by side, holding a bar). It works out the **combined spring constant**, how far the springs stretch at rest (**x = mg/k**), the **period T = 2π√(m/k)** and the energy of the bobbing, with your numbers in every formula.

Joining springs is a common exam question because the answers feel backwards at first: two springs in series are *softer* than either one, and two in parallel are *stiffer*. The picture makes it clear: in series each spring carries the whole weight and the stretches add up; in parallel they share the weight and stretch together.

It serves Class 11 Physics, Oscillations (the spring-mass system, springs in series and parallel, the period of a loaded spring) and Mechanical Properties of Solids (Hooke's law), and the Class 11 practical on finding the spring constant from its stretch and from its period. See [[shm-circle]] for why the motion is simple harmonic, [[pendulum-lab]] for the other classic oscillator, and [[coupled-oscillators]] for several masses joined by springs.

## How to use it

1. Choose **One spring**, **Series** or **Parallel**.
2. Set the **spring constants** k₁ (and k₂): how many newtons it takes to stretch each spring by one metre.
3. Set the **mass** and how far you **pull it down** before letting go (the amplitude).
4. The dashed lines mark the spring's **natural length** and the **rest** position, where the weight is balanced. The picture's stretch is scaled to fit.
5. **Series or parallel?** compares both ways of joining the same two springs.

## Worked example

As the page opens: one spring with k = 20 N/m and a 0.5 kg mass. T = 2π√(0.5 / 20) = **0.9935 s**, and at rest the spring is stretched x = 0.5 × 9.8 / 20 = **24.5 cm**. Pulled down 5 cm, it bobs with energy ½ × 20 × 0.05² = 0.025 J and a top speed of 31.6 cm/s.

Two such springs in **series**: 1/k = 1/20 + 1/20, so k = **10 N/m** and T = **1.405 s**. In **parallel**: k = **40 N/m** and T = **0.7025 s**. The series pair is exactly 2 times slower than the parallel pair.

## Check yourself

Five fresh questions: a series pair, a parallel pair, a period, a resting stretch, and a spring cut into pieces. Answers are checked on the page and the working is shown. Nothing is saved.

## Tips

- For two springs in series, k = k₁k₂ / (k₁ + k₂): "product over sum", like resistors in parallel.
- T does not depend on g or on the amplitude, only on m and k. The same spring bobs at the same rate on the Moon, although it hangs less stretched.
- Because x = mg/k, the period can also be written T = 2π√(x/g): measure how far a mass stretches a spring and you can predict how fast it bobs.

## FAQ

**Why do series springs get softer?** The same force runs through both springs, so each stretches by F/kᵢ. The total stretch is F/k₁ + F/k₂, which is more than either alone, so the pair has a smaller k.

**Why is a cut spring stiffer?** Half a spring stretches half as much under the same force (it is one of two equal springs in series), so its k is doubled.

**What about the mass of the spring?** Real springs have mass, which makes the period a little longer (roughly as if a third of the spring's mass were added to the load). This page treats the springs as light.
