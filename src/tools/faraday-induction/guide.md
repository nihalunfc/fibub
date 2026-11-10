---
name: Faraday induction
num: 1045
shelf: learn
code: L20
section: school-physics
title: "Faraday induction"
summary: "Push a bar magnet into a coil and pull it out, and watch the galvanometer swing and the emf graph. See why only a changing flux makes a current, which way the current flows (Lenz's law), and how an AC generator coil makes a sine-wave emf, with its peak and rms values."
status: live
ads: false
order: 1045
icon: curve
works: offline
updated: 2026-11-09
related: [magnetic-field-mapper, fleming-rule, coil-field-designer]
sources:
  - "Faraday's law ε = −N dΦ/dt, Lenz's law, the flux of a magnetic dipole through a coaxial circular coil Φ = μ₀ m a² / (2 (a² + z²)^1.5), and the AC generator ε = N B A ω sin ωt with rms value ε₀/√2: standard physics results."
  - "μ₀ = 1.25663706127 × 10⁻⁶ N/A² (CODATA 2022 recommended value). The magnet's strength (1 A m²) is a made-up teaching value."
  - "Checked against an independent NumPy script: the dipole flux formula against a direct numerical integral of the dipole field over the coil's area, dΦ/dz against a finite difference, and the generator peak and rms values against hand calculation."
flow:
  - { icon: pointer, label: "Move magnet" }
  - { icon: eye, label: "Galvanometer" }
  - { icon: curve, label: "emf graph" }
  - { icon: orbit, label: "Generator" }
---

## What it does

Michael Faraday found that a magnet moving near a coil makes a current flow in it, but a magnet standing still does not. This page lets you try it. Drag a bar magnet towards a coil of wire, or use **Push in** and **Pull out**, and watch the centre-zero **galvanometer** swing one way and then the other. A graph traces the **emf** (the push that drives the current) and the **flux** through the coil over the last four seconds, so you can see that the emf appears only while the flux is changing, and is biggest where the flux changes fastest.

Under the picture, **Lenz's law** is spelled out for what you are doing right now: which way the current goes round the coil, which magnetic pole the near face of the coil becomes, and how that pushes back against your hand.

The second part is an **AC generator**: a coil turning in a magnetic field. Its flux goes up and down like a cosine, and its emf like a sine, so the current reverses twice in every turn.

It follows the Class 10 Science topics on the magnetic effects of electric current (electromagnetic induction, the galvanometer, the electric generator, AC and DC) and the Class 12 Physics topics on electromagnetic induction (Faraday's and Lenz's laws, motional emf, AC generator) and alternating current (peak and rms values). Before this, see the field of a magnet and a coil in the [[magnetic-field-mapper]] and the force on a current in [[fleming-rule]].

## How to use it

1. Pick a **level**. Class 12 adds ε = −N dΦ/dt with the live value of dΦ/dx and the speed, and the rms value of the generator.
2. Choose the **speed** and the number of **turns** on the coil.
3. Tap **Push in** (the magnet moves to the middle of the coil), **Pull out** (back to 15 cm away) or **Flip the magnet**. You can also drag the magnet with your finger or mouse.
4. Read the emf, the flux linkage, the largest emf of the last move and the Lenz's law sentence.
5. In the generator, set the **field**, the **turning speed** in revolutions per minute and the **turns**. Pause it and slide the **coil angle** to see the flux and emf at any point of a turn.

## Worked example

With 100 turns and the medium speed of 0.2 m/s, tap Push in. The magnet moves from 15 cm away to the middle of the coil. The flux through each turn grows from almost nothing to Φ = μ₀ m / (2a) = 1.2566 × 10⁻⁶ × 1 / 0.04 = 3.14 × 10⁻⁵ Wb, so the flux linkage NΦ reaches 3.14 mWb. The flux changes fastest when the magnet is half a coil radius (1 cm) from the centre, where dΦ/dx = 1.35 × 10⁻³ Wb/m per turn, so the largest emf is 100 × 1.35 × 10⁻³ × 0.2 = 27.0 mV. Once the magnet stops in the middle, the emf drops to zero even though the flux is at its biggest.

For the generator, 100 turns of area 100 cm² in a 0.20 T field turning at 1500 rpm (25 Hz, ω = 157 rad/s) give a peak emf N B A ω = 100 × 0.20 × 0.01 × 157.1 = 31.4 V and an rms value of 22.2 V.

## Tips

- A bigger emf comes from a stronger magnet, more turns or faster movement.
- The current always opposes the change that makes it. If it helped instead, the magnet would speed up by itself and make energy from nothing.
- A generator's emf is zero when the coil faces the field (flux largest) and biggest when the coil lies along the field (flux zero but changing fastest).

## FAQ

**Is the magnet a real one?** No. It is a small teaching magnet of strength 1 A m², treated as a point dipole, which gives the right shape of flux and emf.

**Why does the generator turn so slowly on screen?** Real generators turn many times a second. The picture is slowed down so you can follow it; the numbers are for the real speed.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.
