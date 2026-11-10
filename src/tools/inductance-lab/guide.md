---
name: Inductance lab
num: 1415
shelf: learn
code: L256
section: school-physics
title: "Inductance lab"
summary: "Put one solenoid inside another and work out the self-inductance of each and their mutual inductance from the turns, radii and length. Ramp the current in the inner coil up and down and see the self-induced emf in it and the emf it induces in the outer coil, with the coupling and the stored energy."
status: live
ads: false
order: 1415
icon: orbit
works: offline
updated: 2026-11-09
related: [faraday-induction, motional-emf, transformer-calculator, capacitor-inductor-calculator]
sources:
  - "Long solenoid: B = µ₀nI, L = µ₀N²A/ℓ; coaxial solenoids: M = µ₀N₁N₂πr₁²/ℓ; emf = −L dI/dt and −M dI/dt; energy ½LI². Standard physics results. µ₀ = 1.25663706127 × 10⁻⁶ N/A², the CODATA 2022 recommended value (NIST)."
  - "The iron core uses a relative permeability of 1000, a round illustrative figure; real iron varies widely and depends on the field."
  - "Checked against an independent Python script, and the coupling k = r₁/r₂ for an air core checked as an exact result."
flow:
  - { icon: sliders, label: "Set coils" }
  - { icon: orbit, label: "L and M" }
  - { icon: chart, label: "Ramp I" }
  - { icon: check, label: "Check" }
---

## What it does

A current in a coil makes a magnetic field, and so a flux through the coil itself. If the current changes, that flux changes, and the coil induces an emf in itself that fights the change. The **self-inductance** L says how strongly: ε = −L dI/dt. For a long solenoid, L = µ₀N²A/ℓ, where N is the number of turns, A the area and ℓ the length.

Put a second coil around the first and some of that changing flux passes through it too, so an emf appears in the second coil as well: ε₂ = −M dI₁/dt. M is the **mutual inductance**. For a coil wound round a long solenoid, M = µ₀N₁N₂πr₁²/ℓ: only the area of the inner coil counts, because outside it the inner coil's field is (almost) zero.

This page draws an inner coil inside an outer coil and works out L₁, L₂, M, the coupling k = M/√(L₁L₂), the field in the inner coil and the energy it stores. In the second card the current in the inner coil ramps up and down, and a graph shows the self-induced emf in coil 1 and the emf in coil 2 flipping each time the ramp turns round.

It follows the electromagnetic induction chapter of Class 12 Physics (inductance, mutual inductance, self-inductance, energy stored in an inductor). Before this, see induction by a moving magnet in [[faraday-induction]] and a moving rod in [[motional-emf]]; after it, the [[transformer-calculator]] uses mutual inductance to change voltages.

## How to use it

1. Set the turns of the inner coil N₁ and the outer coil N₂, the length ℓ, and the radii r₁ and r₂ (r₂ is kept at least r₁).
2. Choose an **air core** or an **iron core**.
3. Read L₁ and M with the working, and the facts: L₂, the coupling k, the field and the energy.
4. In the second card, set the top current I₀ and the time it takes to ramp up. Read the emfs and watch the graph.

## Worked example

The page opens with N₁ = 500, N₂ = 200, ℓ = 25 cm, r₁ = 2 cm, r₂ = 3 cm, air core.

- L₁ = µ₀N₁²πr₁²/ℓ = 1.26 × 10⁻⁶ × 500² × π × 0.02² / 0.25 = **1.58 mH**.
- M = µ₀N₁N₂πr₁²/ℓ = **632 µH**, and L₂ = 568 µH, so k = 0.632 / √(1.58 × 0.568) = 0.667 (which is r₁/r₂).
- Ramping the current from 0 to 2 A in 0.5 s means dI/dt = 4 A/s, so coil 1 has a self-induced emf of 1.58 mH × 4 = **6.32 mV** and coil 2 has **2.53 mV**.
- At 2 A the field inside coil 1 is µ₀nI = 5.03 mT and it stores ½LI² = 3.16 mJ.

## Tips

- L grows with N², M with N₁N₂. Doubling the turns on one coil doubles M.
- M is the same both ways: a changing current in coil 2 induces the same M dI/dt in coil 1.
- The emf depends on how fast the current changes, not on how big it is. A steady current, however large, induces nothing.

## FAQ

**Why does the iron core multiply everything by 1000?** Iron is easily magnetised and adds its own field, so the flux is much larger. The page uses 1000 as a round typical value.

**Are the formulas exact?** They are for long solenoids; near the ends the field spreads out, so real short coils have a little less inductance.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.
