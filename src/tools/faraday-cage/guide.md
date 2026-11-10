---
name: Faraday cage and shielding
num: 1404
shelf: learn
section: school-physics
title: "Faraday cage: why the electric field inside a conductor is zero (electrostatic shielding)"
summary: "Put a metal tube in an electric field and watch the free charges move to its surface so that the field inside is exactly zero. Probe the field anywhere, turn the outside field, take the tube away, or put a charge inside and see why a cage must be earthed to hide it."
status: live
ads: false
order: 1404
icon: lock
works: offline
updated: 2026-11-09
related: [gauss-law, potential-map, electrostatics-solver, capacitor-lab]
sources:
  - "Conducting cylinder in a uniform field: φ = −E₀ (r − a²/r) cos θ outside and constant inside, surface charge σ = 2ε₀E₀ cos θ; field of a line charge E = λ/(2πε₀r); field just outside a conductor E = σ/ε₀. Standard electrostatics results. ε₀ = 8.8541878188 × 10⁻¹² F/m (CODATA 2022, NIST)."
  - "Checked against an independent NumPy script: the field is the negative gradient of the potential, the potential is the same all round the surface, and the field there is at right angles to it."
flow:
  - { icon: target, label: "Field" }
  - { icon: lock, label: "Add metal" }
  - { icon: pointer, label: "Probe" }
  - { icon: check, label: "Check" }
---

## What it does

A conductor is full of electrons that are free to move. Put it in an electric field and they drift until the charges they pile up on the surface exactly cancel the field inside. When everything has settled (in far less than a microsecond) the field **inside the metal is zero**, and so is the field in any empty space the metal surrounds. This is **electrostatic shielding**, and a metal box used this way is called a **Faraday cage**.

This page shows a long metal tube seen end-on, so it looks like a ring. In **Field from outside**, a uniform field crosses the board. The field lines bend to meet the metal at right angles, + and − marks show where the induced charges sit, and the probe reads zero anywhere inside. Untick **Metal tube in place** and the field goes straight through again. In **Charge inside**, a charged wire sits in the middle of the tube. The field stops in the metal, but the outer surface gets an equal charge, so the outside still feels it, until you **earth the tube**.

It follows the electrostatic potential and capacitance chapter of Class 12 Physics (electrostatics of conductors, electrostatic shielding), and uses Gauss's law from the chapter before. Count flux through a closed surface first with [[gauss-law]], then see conductors held at set voltages in the [[electrostatics-solver]] and the [[potential-map]].

## How to use it

1. Choose **Field from outside** or **Charge inside**.
2. Tap anywhere on the board to move the probe (the ring) and read the field there and whether it is inside the hollow, in the metal or outside.
3. Tick or untick **Metal tube in place** to compare with and without the metal.
4. For a field from outside, set its strength (1 to 10 kV/m) and its direction (0° to 90°).
5. For a charge inside, set it (1 to 10 nC per metre of wire) and try **Earth the tube**.

## Worked example

The page opens with a 5 kV/m field from left to right and the probe at the centre of the tube. The probe reads **E = 0 V/m**.

Tap the top of the board, 10 cm above the centre (the metal's outer radius is 7.5 cm). The field there is E₀ (1 − a²/r²) = 5000 × (1 − 0.5625) = **2190 V/m**, weaker than E₀ because the tube bends lines away. Tap 10 cm to the left instead and it is E₀ (1 + a²/r²) = **7810 V/m**: lines crowd onto the metal where the induced charge is. Untick the tube and the probe reads 5000 V/m everywhere.

## Tips

- This is why you are safe inside a car in a lightning storm, and why a phone loses signal in a lift: the metal body acts as a cage.
- A cage does not need to be solid. A mesh works as long as its holes are much smaller than the wavelength of the waves it must stop.
- The charge on a conductor always sits on its outer surface, and the field just outside is σ/ε₀, at right angles to the surface.

## FAQ

**Why a tube and not a box?** A long round tube has an exact formula, so every number on the page is exact. A box of any shape shields its inside the same way.

**Does the field inside build up gradually?** Only for a tiny moment. In a good conductor the charges rearrange almost instantly, so for steady fields the inside is always zero.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.
