---
name: Capacitor inductor calculator
num: 911
shelf: science
code: T646
section: electromagnetism
title: "Capacitor inductor calculator"
summary: "Work out the capacitance or inductance of parallel plates (with one or two dielectric layers), coaxial cable, spheres, twin wires, a wire over a ground plane, solenoids and toroids. Get the charge, stored energy, fields, characteristic impedance and signal speed too."
status: live
ads: true
order: 3
icon: calculator
works: offline
updated: 2026-11-09
related: [field-line-plotter, coil-field-designer, link-budget-calculator, skin-depth-calculator, magnetic-circuit, electrostatics-solver, circuit-simulator, filter-designer]
sources:
  - "Capacitance and inductance of parallel plates, coaxial and twin lines, concentric spheres, a wire over a plane, solenoids and toroids: standard results, for example Griffiths, D. J., Introduction to Electrodynamics, and Ramo, Whinnery and Van Duzer, Fields and Waves in Communication Electronics."
  - "Nagaoka's coefficient for a short single-layer coil: Nagaoka, H. (1909), Journal of the College of Science, Tokyo 27, article 6, in its closed form with complete elliptic integrals."
  - "ε₀ = 8.8541878188 × 10⁻¹² F/m and μ₀ = 1.25663706127 × 10⁻⁶ N/A² (CODATA 2022). Permittivities and permeabilities offered in the menus are rounded typical values, not data from a table; type your own."
  - "Checked against SciPy numerical integration of the magnetic flux in toroids, a Neumann double integral for Nagaoka's coefficient, the image-charge forms of the wire formulas and textbook limits, written for the tests. The examples are made up."
flow:
  - { icon: sliders, label: "Shape" }
  - { icon: ruler, label: "Sizes" }
  - { icon: calculator, label: "C or L" }
  - { icon: chart, label: "Trends" }
---

## What it does

Capacitance and inductance depend only on the shape and size of the conductors and on the material between them. This calculator covers the shapes met in physics courses and on the bench:

- **Parallel plates**, with one or two dielectric layers stacked between them (for example a plastic film on glass, or an air gap above a circuit board).
- **Coaxial cable**: capacitance and inductance per metre, the characteristic impedance Z₀ and the speed of signals along it.
- **Spheres**: a sphere on its own (like a Van de Graaff dome) or inside a larger hollow sphere.
- **Two parallel wires** and **a wire over a ground plane**, with their capacitance, inductance and impedance.
- **Solenoids**, with Nagaoka's correction for short coils, and **toroids** with a rectangular or round cross-section.

For capacitors it also gives the charge and energy at a voltage and the strongest electric field, and warns when that field would break down air (roughly 3 kV/mm). For inductors it gives the energy, flux linkage and flux density at a current, and warns when a core would be near saturation.

Try the part in a working circuit with the [[circuit-simulator]] or the [[filter-designer]], and check high-frequency losses with the [[skin-depth-calculator]].

## How to use it

1. Choose the shape. The boxes change to suit it.
2. Type the sizes in the units shown. Use the **material** menu to fill in a rounded εr for a common dielectric, or the **core** menu for μr; you can type any value.
3. Read the result and the facts below it. The chart shows how C, L or Z₀ changes with the main dimension, with your design marked.
4. Download the report as an image, PDF or Word file.

## Worked example

A made-up capacitor of two 100 cm² plates 1 mm apart in air (εr 1.0006) gives **C = 88.60 pF**. At 100 V it holds 8.860 nC and 443 nJ, with a field of 0.100 kV/mm. Now add a 1 mm FR-4 sheet (εr 4.4) as layer 2, so the gap is 2 mm: the capacitance falls to **72.18 pF**, and the air layer takes 81.5 V of the 100 V (a field of 0.0815 kV/mm against 0.0185 kV/mm in the board).

A made-up coax with a 0.9 mm inner conductor, a 2.95 mm shield and polyethylene (εr 2.25), 1 m long, gives **C = 105.4 pF, L = 237.4 nH, Z₀ = 47.45 Ω**, and signals travel at 0.667 c.

A made-up air-core solenoid of 100 turns, 20 mm across and 50 mm long has **L = 67.10 µH**. Its Nagaoka coefficient of 0.8499 shows that the long-coil formula (78.96 µH) would overestimate it by about a sixth.

## Tips

- Put a high-εr layer in series with air and the air takes most of the voltage, which is why air bubbles in insulation fail first.
- A coax's Z₀ depends only on the ratio of the diameters and on εr: that is why 50 Ω cables of very different thickness exist.
- For toroids, the A_L value (inductance per turn squared) lets you scale to any number of turns.

## FAQ

**Why does the coax inductance mention frequency?** At high frequency the current flows on the surfaces of the conductors and the formula shown is exact. At low frequency, current inside a solid inner wire adds a little more, up to μ₀/8π = 50 nH per metre.

**Can I use the solenoid formula with a ferrite rod?** Only roughly. A rod that does not form a closed path raises L by much less than its μr. For a closed core, use the toroid or the magnetic circuit solver.

**Is anything uploaded?** No. Everything is worked out in your browser.
