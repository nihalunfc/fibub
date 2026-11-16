---
name: Capacitor network reducer
num: 1403
shelf: learn
code: L258
section: school-physics
title: "Capacitors in series and parallel: reduce a network step by step, then find each charge and voltage"
summary: "Pick a capacitor network, set each capacitor and the battery, and reduce it one series or parallel group at a time to a single equivalent capacitance, with the working for every step. Then see the charge, voltage and energy on each capacitor, worked back out from the battery."
status: live
ads: false
order: 1403
icon: sigma
works: offline
updated: 2026-11-16
related: [capacitor-lab, series-parallel, potential-map, capacitor-inductor-calculator]
sources:
  - "Capacitors in parallel: C = C₁ + C₂ + …; in series: 1/C = 1/C₁ + 1/C₂ + …; Q = CV and U = ½CV². Standard physics results."
  - "Checked against an independent Python script using exact fractions for every network, and by checking that the energies add up to ½CV² for the whole network."
  - "Typed-number calculator: same formulas as above, with the unknown-capacitor case solved by rearranging them (checked by hand and by code against the reducer's own examples)."
flow:
  - { icon: sliders, label: "Set values" }
  - { icon: sigma, label: "Reduce" }
  - { icon: table, label: "Share out" }
  - { icon: check, label: "Check" }
---

## What it does

Many textbook problems give a network of capacitors joined to a battery and ask for the total capacitance, then the charge and voltage on each one. The method is always the same: find a group that is simply in **series** or simply in **parallel**, replace it with one capacitor, and repeat until only one is left. Then work backwards: the battery charges that one equivalent capacitor, and its charge and voltage are shared back out to the capacitors it replaced.

- In **parallel**, capacitors share the same voltage, and the capacitances add: C = C₁ + C₂.
- In **series**, capacitors carry the same charge, and the reciprocals add: 1/C = 1/C₁ + 1/C₂. The total is smaller than the smallest one.

This page does it with you, one step at a time. The circuit diagram colours the group being reduced, and each step is written out with the numbers. When the network is down to one capacitor, a table gives the charge, voltage and stored energy on every capacitor.

It follows the electrostatic potential and capacitance chapter of Class 12 Physics (combination of capacitors in series and in parallel, energy stored in a capacitor). Try a single capacitor with a dielectric first in the [[capacitor-lab]], compare with resistors in [[series-parallel]], and for capacitors of real shapes use the [[capacitor-inductor-calculator]].

## Solve your own numbers

The first card is a quick calculator for the numbers in your own problem. Choose how the capacitors are joined (all in series, all in parallel, C₁ in series with a parallel pair, or C₁ in parallel with a series pair), type C₁, C₂ and optionally C₃, and pick the unit for each (µF, nF, pF, mF or F). The answer sits at the top in one sentence, with the working under it: the reciprocals or the sum, then the result. Type a **battery voltage** as well and it adds the charge, voltage and energy on every capacitor, with the check that series capacitors hold equal charge and parallel ones share one voltage. Switch **Find** to *Unknown capacitor C₁* to work backwards from a given total. Six worked examples can be chosen from the Example list. For bigger networks, such as the ladder, use the step-by-step reducer below.

## How to use it

1. Choose a **network**: two in series, two in parallel, three in series, one in series with a parallel pair, two parallel pairs in series, or a small ladder.
2. Set each capacitor (1 to 12 µF) with its box, and the **battery** (1 to 24 V) with the slider.
3. Press **Back** and **Next step** to go through the reduction one group at a time, or **Show all steps**.
4. When the last step is shown, read the equivalent capacitance, the battery's charge and energy, and the table for each capacitor.

## Worked example

The page opens with C₁ = 4 µF in series with a parallel pair, C₂ = 2 µF and C₃ = 6 µF, on a 12 V battery.

1. C₂ and C₃ are in parallel: 2 + 6 = 8 µF. Call it C₂₃.
2. C₁ and C₂₃ are in series: 1/C = 1/4 + 1/8, giving **2.67 µF**.

The battery supplies Q = 2.67 × 12 = 32 µC. C₁ carries all of it, so V₁ = 32 / 4 = 8 V. That leaves 4 V across the pair: C₂ holds 2 × 4 = 8 µC and C₃ holds 6 × 4 = 24 µC, which add back up to 32 µC. The energies are 128, 16 and 48 µJ, which add up to ½ × 2.67 × 12² = 192 µJ.

## Tips

- For two in series, C = C₁C₂ / (C₁ + C₂) is quicker than reciprocals.
- In series, the smallest capacitor gets the largest share of the voltage, because V = Q/C and Q is the same for each.
- Always reduce the innermost group first, just like brackets in arithmetic.

## FAQ

**What is the equivalent capacitance of two capacitors in series?** C = C₁C₂ / (C₁ + C₂), always smaller than the smallest; in parallel it is simply C₁ + C₂.

**What is the most common mistake?** Using the resistor rules: for capacitors the series rule needs reciprocals, and the parallel rule is the plain sum. Also check that µF, nF and pF are converted (1 µF = 10⁻⁶ F).

**What about networks that are neither series nor parallel?** Some, like a bridge, cannot be reduced this way. They need Kirchhoff's rules (or a symmetry trick) and are not covered here.

**Are the capacitors charged from zero?** Yes: the values are for the network charged from a battery with all capacitors starting empty.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.
