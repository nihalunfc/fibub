---
name: Skin depth calculator
num: 912
shelf: science
code: T647
section: electromagnetism
title: "Skin depth calculator: AC resistance of wires, sheets and coax across frequency and material"
summary: "Find how deep alternating current gets into a conductor at any frequency, and what that does to the resistance of a round wire (exact Bessel-function solution), a sheet or shield, and the conductor loss of a coax line. Rounded resistivities for common metals, all editable."
status: live
ads: true
order: 4
icon: curve
works: offline
updated: 2026-11-09
related: [capacitor-inductor-calculator, coil-field-designer, link-budget-calculator, waveguide-modes, pcb-trace-calculator, antenna-calculator, magnetic-circuit]
sources:
  - "Skin depth from the exact attenuation constant of a plane wave in a conducting medium, surface resistance, the AC impedance of a round wire with Bessel functions, a conducting slab and the conductor loss of a coaxial line: standard results, for example Ramo, Whinnery and Van Duzer, Fields and Waves in Communication Electronics, and Pozar, D. M., Microwave Engineering."
  - "Bessel function ratio by its continued fraction, evaluated with the modified Lentz method (Press et al., Numerical Recipes, section 5.2)."
  - "Resistivities and the example permeabilities are rounded, typical room-temperature values, not data from a table; type your own. ε₀ and μ₀ from CODATA 2022."
  - "Checked against SciPy (complex Bessel functions jv, the complex propagation constant, hyperbolic functions) written for the tests, and the textbook low- and high-frequency limits."
flow:
  - { icon: flask, label: "Material" }
  - { icon: sliders, label: "Frequency" }
  - { icon: ruler, label: "Skin depth" }
  - { icon: chart, label: "Loss" }
---

## What it does

Direct current spreads evenly through a wire, but alternating current crowds towards the surface: the changing magnetic field inside the conductor pushes the current outwards. The **skin depth** δ is the depth at which the current has fallen to 1/e (37 %) of its value at the surface. In copper it is about 9.3 mm at 50 Hz, 66 µm at 1 MHz and only 2 µm at 1 GHz. Once a conductor is several skin depths thick, only a thin outer layer carries current, so its resistance rises with frequency.

This calculator gives the skin depth for any material and frequency and then works out:

- **Round wire:** the exact AC resistance and internal inductance per metre, from the Bessel-function solution (not just the thin-shell approximation), so it is right from DC up to microwaves.
- **Sheet or shield:** the resistance per square of a flat conductor fed from one face, such as a ground plane or a foil, and the absorption loss of a shield (8.686 dB per skin depth).
- **Coax line:** the conductor (copper) loss in dB per metre for your inner and outer diameters.

For poor conductors such as sea water, it uses the exact formula, which includes the dielectric behaviour that the simple √(2ρ/ωμ) formula leaves out.

Carry the loss into a transmission line or guide with the [[waveguide-modes|waveguide mode calculator]], or size copper tracks with the [[pcb-trace-calculator]].

## How to use it

1. Pick a material, or type a resistivity, μr and εr. The values offered are rounded, typical figures; magnetic metals are only examples because their μr varies a lot.
2. Type the frequency and choose the unit.
3. Give the wire diameter, sheet thickness and coax sizes you care about.
4. Read the results, the two charts (skin depth against frequency, and resistance ratio against frequency) and the table across frequency. Download the table as CSV or the whole report.

## Worked example

Copper (ρ = 1.72 × 10⁻⁸ Ω m, rounded) at 1 MHz: the page shows **δ = 66 µm** and a surface resistance of 261 µΩ per square. A 1 mm wire has a DC resistance of 21.9 mΩ/m but **88.7 mΩ/m** at 1 MHz, 4.05 times more, because its radius is 7.58 skin depths (close to the thick-wire rule a/2δ + 1/4 = 4.04). A 35 µm copper layer, about half a skin depth, has 495 µΩ per square, only 1.007 times its DC value. A coax with a 0.9 mm inner conductor and a 2.95 mm shield filled with polyethylene (εr 2.25) loses about **1.10 dB per 100 m** in its copper at 1 MHz.

Switch to sea water (ρ about 0.2 Ω m, εr about 80): at 1 MHz δ is 225 mm, which is why submarines need very low frequencies to receive radio.

## Tips

- Litz wire (many thin insulated strands) beats skin effect only while each strand is thinner than about a skin depth.
- Silver plating helps at high frequencies because the current flows only in the outer few micrometres.
- Steel's high μr makes its skin depth tiny at mains frequency, which is why steel is a good low-frequency magnetic shield.

## FAQ

**Why does the table show the wire ratio levelling off as a/2δ?** Once the wire is much thicker than δ, the current flows in a shell of thickness δ around the circumference, so R_ac/R_dc ≈ a/(2δ) + 1/4.

**Does this include the proximity effect?** No. Wires close together push each other's current to one side, raising the resistance further, for example in multi-layer coils.

**Is anything uploaded?** No. Everything is worked out in your browser.
