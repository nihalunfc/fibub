---
name: Diatomic spectroscopy calculator
num: 94
shelf: science
code: T94
section: physical-chemistry
title: "Diatomic spectroscopy calculator: IR P and R branches, bond length, Morse potential and isotope shifts"
summary: "Vibrational and rotational spectroscopy of diatomic molecules (HCl, CO, H₂, N₂, O₂, HF, I₂ or your own constants): fundamental and overtones, force constant, bond length, the simulated IR spectrum with P and R branches at any temperature, the Morse potential with its levels, isotope substitution, and a fit of ωe and ωexe."
status: live
ads: true
order: 7
icon: curve
works: offline
updated: 2026-11-08
related: [beer-lambert-calculator, huckel-mo-calculator, spectral-line-identifier, isotope-pattern-calculator]
sources:
  - "Spectroscopic constants: Huber and Herzberg (1979) as given in the NIST Chemistry WebBook."
  - "Isotope masses and abundances: the chemical-elements data set by cheminfo (MIT licence), compiled from NIST and IUPAC data."
  - "Physical constants: CODATA recommended values (NIST)."
flow:
  - { icon: flask, label: "Molecule" }
  - { icon: curve, label: "Vibration" }
  - { icon: chart, label: "IR spectrum" }
  - { icon: ruler, label: "Bond length" }
---

## What it does

The infrared spectrum of a gas such as HCl or CO is a comb of lines either side of a gap. Each line is a change of vibration plus a change of rotation, and from their positions you can read the bond's stiffness, its length and how it breaks. This tool goes the other way too: from the standard spectroscopic constants it predicts the spectrum, the energy levels and the potential curve.

- **Vibration**: levels G(v) = ωe(v + ½) − ωexe(v + ½)², the fundamental and overtones, the zero-point energy and the force constant k = μ(2πcωe)².
- **Morse potential**: well depth De = ωe²/4ωexe, D0, the number of bound levels and a plot of the curve with its levels between the classical turning points, beside the harmonic parabola.
- **Rotation**: B for v = 0 and v = 1, the bond length from Be, the line spacing, the most populated J at your temperature, and the first pure rotational line in cm⁻¹ and GHz.
- **IR spectrum**: P and R branch line positions with Boltzmann intensities at any temperature, as a picture and a table. The missing line at the centre (no Q branch) and the closing-up of the R branch come out naturally.
- **Isotopes**: type 2H, 37Cl or 13C and the constants are rescaled with the reduced mass, so you can see the shift from HCl to DCl.
- **Fit**: paste band origins (fundamental and overtones) to get ωe and ωexe with their standard errors and a Birge–Sponer estimate of the dissociation energy.

For absorbance and concentration from the same spectrum, use the [[beer-lambert-calculator]]; to match lines against known ones, the [[spectral-line-identifier]].

## How to use it

1. Choose a molecule. The constants (Huber and Herzberg, via the NIST Chemistry WebBook) fill in.
2. Change an atom to another isotope if you want, or type your own constants.
3. Set the temperature for the line intensities.
4. Read the results, the spectrum, the line table and the potential curve. Download them as a PNG, PDF or Word file.

## Worked example

For H³⁵Cl (μ = 0.97959 u), ωe = 2990.95 and ωexe = 52.82 cm⁻¹ give a fundamental at 2885.3 cm⁻¹ (measured: 2886.0) and a force constant of 516 N/m. Be = 10.5934 cm⁻¹ gives a bond length of 1.2746 Å. At 298 K the strongest lines come from J = 3, and R(0) and P(1) sit at 2905.6 and 2864.4 cm⁻¹. Changing ¹H to ²H moves the fundamental to 2090.8 cm⁻¹, close to the ratio √(μ/μ′) ≈ 0.72.

The four measured HCl bands 2885.9, 5668.0, 8346.8 and 10923.1 cm⁻¹ fit to ωe = 2989.2 and ωexe = 51.71 cm⁻¹.

## Questions

**Why is the Morse D0 larger than the measured one?** A Morse curve is only an approximation; real levels crowd together faster near dissociation. The tool shows both where the measured value is known.

**Why does the calculated line differ from the measured one by about 1 cm⁻¹?** Only the first anharmonic and rotation–vibration terms are used. That is enough for teaching and for assigning lines, not for high-resolution work.

**Is anything sent anywhere?** No. Everything is worked out in your browser.
