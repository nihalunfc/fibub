---
name: Dia, para and ferro magnetism
num: 1410
shelf: learn
section: school-physics
title: "Diamagnetic, paramagnetic and ferromagnetic materials: dipoles, domains, Curie's law and the hysteresis loop"
summary: "Put a diamagnetic, paramagnetic or ferromagnetic sample in a field and watch its tiny magnets: induced moments against the field, jiggling dipoles that line up a little, or whole domains that flip. Change the temperature, see Curie's law and the Curie temperature, and trace a hysteresis loop with its remanence and coercivity."
status: live
ads: false
order: 1410
icon: compass
works: offline
updated: 2026-11-09
related: [magnetic-field-mapper, electromagnet-builder, biot-savart, magnetic-circuit]
sources:
  - "M = χ H, B = μ₀ (H + M), μᵣ = 1 + χ, Curie's law χ = C / T, the Curie–Weiss law above the Curie temperature, and the Langevin function for the alignment of free dipoles: standard physics results."
  - "Hysteresis from a Preisach model: 360 small two-state 'hysterons' with Gaussian-weighted switching fields, which gives remanence, coercivity and minor loops."
  - "μ₀ = 1.25663706127 × 10⁻⁶ N/A² (CODATA 2022); the Curie temperature of iron (1043 K) is a general physical fact. All other material numbers (susceptibilities, Curie constant, coercivities, the temperature fit) are rounded, made-up teaching values."
  - "Checked by hand (χ = −1.7 × 10⁻⁴ at 1 T: M = −135 A/m, B inside 0.99983 T), against Curie's law (χ T constant) and the model's symmetry (remanence and coercivity the same on both sides of the loop, M = 0 for a demagnetised sample)."
flow:
  - { icon: sliders, label: "Pick sample" }
  - { icon: compass, label: "Apply B₀" }
  - { icon: curve, label: "Trace loop" }
  - { icon: check, label: "Check" }
---

## What it does

Every material reacts to a magnetic field, but in three very different ways:

- **Diamagnetic** materials (bismuth, copper, water) have no magnetic atoms. A field makes a tiny moment in each atom that points **against** the field, so the material is weakly pushed out of strong fields. χ is small and negative and does not depend on temperature.
- **Paramagnetic** materials (aluminium, oxygen) have atoms that are tiny magnets pointing every which way. A field lines a few of them up, so the material is weakly pulled in. Heat jiggles them out of line, so χ falls as the temperature rises: **Curie's law**, χ = C / T.
- **Ferromagnetic** materials (iron, nickel, cobalt) have **domains**, regions where all the atoms already point the same way. A small field makes whole domains flip, so the magnetisation is huge, and it does not all go away when the field is removed. That gives the **hysteresis loop**. Above the **Curie temperature** (1043 K for iron) the domains break up and the material is only paramagnetic.

The picture shows the sample with its arrows (induced moments, dipoles or domains) and the field lines bending around or into it. The graph below plots the magnetisation M against the applied field B₀: a straight line for dia and para, the loop for a ferromagnet, traced as you move the slider.

It follows the Class 12 Physics chapter on magnetism and matter (magnetisation and magnetic intensity, susceptibility, dia-, para- and ferromagnetism, the Curie law, hysteresis). See the fields themselves with the [[magnetic-field-mapper]] and use a soft-iron core in the [[electromagnet-builder]].

## How to use it

1. Choose **Diamagnetic**, **Paramagnetic**, **Soft iron** or **Hard steel**.
2. Slide the applied field **B₀** (positive to the right). The slider's range suits each material: up to 2 T for dia and para, a few millitesla for soft iron, 40 mT for hard steel.
3. Slide the **temperature** from 50 K to 1500 K.
4. For the ferromagnets, **Run a full loop** sweeps B₀ up, down and up again. **Demagnetise** starts again with the domains mixed up.

## Worked example

Soft iron at 300 K starts demagnetised: M = 0. Slide B₀ to 2.50 mT and every domain lines up: M = **88.5%** of the low-temperature saturation (at 300 K iron keeps 88.5% of it in this model). Slide back to 0: M stays at **77.9%**, the remanence. To bring it to zero you have to push B₀ to about **−0.456 mT**, the coercivity. Hard steel needs about 9.12 mT, twenty times more.

A diamagnetic rod with χ = −1.7 × 10⁻⁴ in B₀ = 1 T has H = B₀/μ₀ = 7.96 × 10⁵ A/m and M = χH = **−135 A/m**; the field inside is (1 + χ)B₀ = 0.99983 T.

## Tips

- Soft magnetic materials (thin, easily flipped loops) suit transformer cores and electromagnets; hard ones (fat loops) suit permanent magnets.
- The area of the loop is the energy lost as heat in each cycle.
- Paramagnetic alignment in the picture is hugely exaggerated so that you can see it; at room temperature only about one dipole in a thousand lines up.

## FAQ

**Why is the loop not exactly the same each time?** It depends on where you turned round. Turning back before saturating draws a smaller "minor" loop, just as in real iron.

**Are these real material numbers?** The Curie temperature of iron is real; the other values are rounded teaching values chosen to be about the right size.

**Is this an official NCERT resource?** No. fibub is independent; the page follows the topics in the syllabus in its own words.
