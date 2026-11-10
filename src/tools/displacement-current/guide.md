---
name: Charging capacitor and displacement current
num: 1420
shelf: learn
section: school-physics
title: "Displacement current: charging capacitor, Ampère–Maxwell law and the magnetic field between the plates"
summary: "Charge a round parallel-plate capacitor through a resistor and watch the current fall while the field between the plates grows. See why Maxwell added the displacement current I_d = ε₀ dΦ_E/dt, and why the magnetic field on a loop comes out the same whichever surface you pick."
status: live
ads: false
order: 1420
icon: curve
works: offline
updated: 2026-11-09
related: [em-wave-3d, capacitor-lab, gauss-law, motional-emf]
sources:
  - "ε₀ = 8.8541878188 × 10⁻¹² F/m and µ₀ = 1.25663706127 × 10⁻⁶ N/A² (CODATA 2022, NIST)."
  - "Charging an RC circuit: q = CV(1 − e^(−t/RC)), I = (V/R) e^(−t/RC); displacement current I_d = ε₀ dΦ_E/dt; Ampère–Maxwell law ∮B·dl = µ₀(I + I_d). Standard results found in any physics textbook."
  - "The plates are treated as ideal: uniform field between them and no fringing at the edges. Checked against an independent Python script."
flow:
  - { icon: sliders, label: "Circuit" }
  - { icon: clock, label: "Charge it" }
  - { icon: eye, label: "Pick surface" }
  - { icon: check, label: "Check" }
---

## What it does

Ampère's law says the magnetic field round a closed loop is set by the current passing through any surface bounded by that loop. While a capacitor is charging, this runs into trouble. A flat surface across the wire has the full current going through it, but a bag-shaped surface that dips between the plates has no wire through it at all, and no charge jumps the gap. Same loop, two answers: something is missing.

Maxwell's fix was the **displacement current**, I_d = ε₀ dΦ_E/dt. Between the plates the electric field grows as charge piles up, and that changing electric flux acts just like a current in making a magnetic field. For a parallel-plate capacitor it comes out exactly equal to the current in the wires, so the **Ampère–Maxwell law**, ∮B·dl = µ₀(I + I_d), gives the same field for either surface.

This page charges a round capacitor through a resistor. Pick the flat or the bag surface, drag time along, and the page shows the conduction current, the field between the plates and how fast it grows, the displacement current and the magnetic field on your loop. It follows the electromagnetic waves chapter of Class 12 Physics (displacement current). Count the field lines through a closed surface first in [[gauss-law]], try capacitors on their own in the [[capacitor-lab]], and see how a changing E and a changing B keep each other going as light in [[em-wave-3d]].

## How to use it

1. Set the battery voltage, the resistance, the plate radius and the gap. The page works out the capacitance C = ε₀πa²/d and the time constant τ = RC.
2. Drag the **time** slider (in units of τ), or press **Play** to watch the capacitor fill.
3. Switch between the **flat surface** and the **bag surface**. The text says which current passes through it and gives the same field both ways.
4. Change the **loop radius r**. Inside the plate edge (r < a), only the part of I_d inside the loop counts between the plates, so the field there grows with r.
5. Try the four practice questions. Type numbers like 2.5e-9 or 2.5 × 10^-9.

## Worked example

The page opens with V = 12 V, R = 10 MΩ, plates of radius 10 cm, 1 mm apart, at t = τ.

- C = ε₀ π a² / d = 8.85 × 10⁻¹² × π × 0.1² / 0.001 = **278 pF**.
- τ = RC = 10⁷ × 2.78 × 10⁻¹⁰ = **2.78 ms**. The first current is V/R = **1.2 µA**.
- At t = τ the current has fallen to 1.2 µA × e⁻¹ = **441 nA**, and the plates are 63% full.
- The field between the plates grows at dE/dt = I / (ε₀ A) = 1.59 × 10⁶ V/m per second, so I_d = ε₀ A dE/dt = **441 nA**, the same as the wire.
- On a loop of radius 5 cm round the wire, B = µ₀ I / (2πr) = **1.77 × 10⁻¹² T**. Between the plates at the same radius, only a quarter of I_d is inside the loop, so B = µ₀ I_d r / (2πa²) = **4.41 × 10⁻¹³ T**.

These fields are tiny, which is why nobody noticed the displacement current in experiments before Maxwell predicted it.

## Tips

- I_d is not a flow of charge. It is the rate of change of electric flux, scaled by ε₀.
- Once the capacitor is full, both currents drop to zero and so does the magnetic field.
- A bigger resistor makes the charging slower, so I and I_d are smaller but last longer.

## FAQ

**Why is I_d equal to I?** The charge on the plate is q = ε₀ E A, so dq/dt = ε₀ A dE/dt. The left side is the current in the wire; the right side is the displacement current.

**Do the edges of the plates matter?** Real plates have fringing fields at the edge. The page leaves them out, as school books do.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.
