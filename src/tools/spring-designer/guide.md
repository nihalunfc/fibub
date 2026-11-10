---
name: Spring designer
num: 644
shelf: science
code: T441
section: mechanical-engineering
title: "Spring calculator: helical compression, extension and torsion spring rate, stress, solid height and buckling"
summary: "Design a round-wire helical spring. Compression: rate, Wahl-corrected shear stress, solid height and force for four end types, buckling limit and surge frequency. Extension: initial tension, hook bending and torsion stresses. Torsion: rate per turn and per degree, bending stress and the coil diameter under load. You enter the material values; examples are labelled."
status: live
ads: true
order: 644
icon: curve
works: offline
updated: 2026-11-09
related: [bolt-torque-calculator, beam-calculator, gear-train-calculator, shaft-bearing-life, tolerance-stackup, fatigue-sn-calculator, stress-strain-analyser, coupled-oscillators]
sources:
  - "Helical spring rate G d⁴ / (8 D³ Na), the Wahl and Bergsträsser stress factors, end-type formulas for total coils and solid height, the steel buckling criterion L0 < 2.63 D / α, surge frequency, extension-spring active coils Nb + G/E and hook stress factors, and torsion-spring rate d⁴E / (10.8 D Na) with leg allowance and inner-fibre factor: Shigley's Mechanical Engineering Design (Budynas and Nisbett), chapter on mechanical springs, and Wahl, Mechanical Springs (equations only)."
  - "Material values (G 79 GPa, E 200 GPa, density 7850 kg/m³) are rounded general figures for carbon steel; the allowed stresses are placeholders chosen by fibub, labelled, and not copied from any table. The example springs are made up."
  - "Checked against an independent NumPy/SciPy calculation: rates from Castigliano's theorem (strain energy of the wire integrated along its length) and the surge frequency from the active-coil mass."
flow:
  - { icon: curve, label: "Spring" }
  - { icon: ruler, label: "Size" }
  - { icon: calculator, label: "Rate" }
  - { icon: check, label: "Stress" }
---

## What it does

This tool sizes the three common kinds of coiled wire spring and checks them:

- **Compression springs** (pushed shorter): rate, shear stress with the Wahl correction, length at the working load, solid height and the force and stress when closed solid, a buckling check and the lowest surge (natural) frequency.
- **Extension springs** (pulled longer, with hooks): initial tension, rate, body stress, and the bending and torsion stresses in the hooks, where these springs usually break.
- **Torsion springs** (twisted by legs): rate per turn and per degree, the angle for a moment, bending stress, and how much the coils tighten.

You enter the material: shear modulus G, Young's modulus E, the allowed stresses and the density. Example values for carbon spring steel are filled in and labelled; the allowed stresses in particular depend on the wire grade and size, so use your wire maker's figures.

Check how long the spring lasts under repeated loads with the [[fatigue-sn-calculator]], and see how springs and masses vibrate in the [[coupled-oscillators]].

## How to use it

1. Pick **Compression**, **Extension** or **Torsion**.
2. Give the **wire diameter d** and the **mean coil diameter D** (outside diameter minus d). The ratio C = D/d, the spring index, is best between about 4 and 12.
3. For a compression spring give the **active coils**, the **end type**, the **free length** and the working **force** or **deflection**, and how the ends are held (for buckling).
4. For an extension spring give the **body coils**, the **initial tension**, the **working force** and the small **hook bend radius r2**.
5. For a torsion spring give the **body coils**, the two **leg lengths** and the **moment** (force × distance from the coil axis).
6. Check the stress factors against your allowed stresses. A factor below 1 means overstressed.

## Worked example

The example springs are made up.

**Compression:** 2 mm wire, 20 mm mean diameter (C = 10), 8 active coils, squared and ground ends, 50 mm free, G = 79 GPa. The rate is 79 000 × 2⁴ / (8 × 20³ × 8) = **2.469 N/mm**, so 30 N compresses it 12.15 mm. The Wahl factor is 1.145 and the shear stress 218.6 MPa. With 10 total coils it goes solid at 20 mm under 74.06 N, where the stress is 539.8 MPa, a factor of 1.11 on the 600 MPa placeholder, so it can safely close solid. The free length is well under the buckling limit of 105.2 mm, and the surge frequency is 223.1 Hz.

**Extension:** 1.5 mm wire, 12 mm mean diameter, 20 body coils, 5 N initial tension, 25 N working force, r2 = 4 mm. Active coils are 20 + 79/200 = 20.39, the rate is 1.419 N/mm and the spring stretches 14.1 mm. The body stress is 268 MPa, but the hook bending stress at A is 513.3 MPa: the hook is the critical spot.

**Torsion:** 2 mm wire, 16 mm mean diameter, 6 body coils, legs of 20 and 25 mm, E = 200 GPa. The rate is 2940 N·mm per turn (8.167 N·mm per degree), so 500 N·mm turns it 61.22°, with a bending stress of 702 MPa at the inside of the coil.

## Tips

- Stress goes with 1/d³ and rate with d⁴: a slightly thicker wire makes a much stiffer, lower-stressed spring.
- Making a compression spring able to close solid without damage protects it from being overloaded in service.
- A spring that may buckle can be guided in a tube or over a rod; leave clearance for the coils to grow in diameter as they compress.

## FAQ

**Why are no material tables included?** Allowed stresses depend on the wire grade, its diameter, surface treatment and whether the load cycles. A single table would be misleading, so you enter the values from your supplier.

**What is the Wahl factor?** It raises the simple shear stress to allow for the coil's curvature and the direct shear from the load, both of which raise the stress on the inside of the coil.

**Is this a substitute for a spring maker's check?** No. It is for study and planning, not a substitute for professional judgement.
