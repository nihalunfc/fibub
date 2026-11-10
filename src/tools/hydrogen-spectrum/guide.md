---
name: Hydrogen spectrum
num: 1068
shelf: learn
section: school-physics
title: "Hydrogen spectrum"
summary: "Tap two energy levels of the hydrogen atom to make the electron jump. See the photon's energy, wavelength and colour, which series it belongs to, and where it sits in the spectrum, with the Rydberg formula filled in."
status: live
ads: false
order: 1068
icon: star
works: offline
updated: 2026-11-09
related: [photoelectric-lab, spectral-line-identifier, hydrogen-orbitals]
sources:
  - "Bohr model of hydrogen: Eₙ = −hcR_H/n², the Rydberg formula 1/λ = R_H(1/n₁² − 1/n₂²), series of Lyman, Balmer, Paschen, Brackett and Pfund, orbit radius n²a₀ and speed αc/n: standard physics."
  - "R∞ = 10,973,731.568160 m⁻¹, proton–electron mass ratio 1,836.15267343, Bohr radius a₀ = 0.0529177210903 nm (CODATA 2018); h, e and c exact SI values. Wavelengths are vacuum values from the Bohr model (real lines are split very slightly by fine structure)."
  - "Checked against an independent Python calculation and the well-known values (Lyman alpha 121.57 nm, H-alpha 656.47 nm in vacuum, Balmer limit 364.7 nm)."
flow:
  - { icon: pointer, label: "Tap levels" }
  - { icon: star, label: "Photon" }
  - { icon: ruler, label: "Wavelength" }
  - { icon: check, label: "Check" }
---

## What it does

Heat hydrogen gas, or pass a spark through it, and it glows with a few sharp colours instead of a rainbow. Niels Bohr explained why: the electron in a hydrogen atom can only have certain energies, the **energy levels** n = 1, 2, 3 …. When it drops from a higher level to a lower one, the atom gives out one **photon** whose energy is exactly the difference. This page draws the levels; tap two of them to make a jump and see the photon's **energy**, **wavelength**, **frequency** and **colour**, which **series** it belongs to (all jumps down to n = 1 are the Lyman series, to n = 2 Balmer, to n = 3 Paschen), and where it sits among the other lines of its series.

It follows the school topics on atoms: Class 11 Chemistry, Structure of Atom (line spectrum of hydrogen, Bohr's model for the hydrogen atom), and Class 12 Physics, Atoms (atomic spectra, Bohr model, energy levels, the line spectra of hydrogen). Before this, try [[photoelectric-lab]] to see light acting as photons; afterwards, [[spectral-line-identifier]] matches lines in real spectra and [[hydrogen-orbitals]] shows the quantum picture of where the electron is.

## How to use it

1. Tap the level the electron **starts** on, then the level it **ends** on. Or pick them in the two boxes.
2. A jump **down** gives out a photon; a jump **up** needs a photon of the same energy to be taken in.
3. Read the photon's wavelength and colour, and the working from the Rydberg formula and the energy levels.
4. The second card shows every line of that **series**, crowding towards the **series limit** (a jump from ∞).
5. Switch the **Level** to **Class 12** to add the orbit radius, the electron's speed and the energy needed to ionise the atom from the lower level.

## Worked example

The page opens with a jump from n = 3 to n = 2, the red **H-alpha** line of the Balmer series. With R_H = 1.0968 × 10⁷ m⁻¹: 1/λ = R_H (1/2² − 1/3²) = 1,523,300 m⁻¹, so λ = 656.47 nm. The energy levels give the same answer: E₃ − E₂ = −1.511 − (−3.4) = 1.889 eV, and λ = 1,239.84 / 1.889 = 656.5 nm.

A jump from n = 4 to n = 1 is a Lyman line at 97.25 nm, deep ultraviolet. A jump from 4 to 3 is a Paschen line at 1,876 nm, infrared. On the Class 12 level, the n = 2 orbit has radius 4 × 0.0529 = 0.2117 nm, the electron moves at 1,094 km/s, and 3.4 eV removes it from the atom.

## Check yourself

Five questions, fresh each time: the energy of a level, the energy of a photon from a jump, a wavelength from the Rydberg formula, the energy to ionise the atom from a level, and which level a series ends on. They use the school values 13.6 eV and R = 1.097 × 10⁷ m⁻¹. Nothing is saved.

## Tips

- Energies are negative because the electron is bound: you need to give it energy to free it. Zero is the free electron at n = ∞.
- Only the Balmer series has visible lines: 656 nm (red), 486 nm (blue-green), 434 nm (blue) and 410 nm (violet).
- The levels get closer together as n grows, so the lines of a series crowd together near the limit.

## FAQ

**Why does the page use 13.598 eV and not 13.6 eV?** The nucleus moves a little as the electron goes round it. Allowing for this gives R_H, slightly smaller than R∞; the Check yourself questions use the rounded school values.

**Is the Bohr model right?** It gets hydrogen's energy levels right, but electrons do not really travel in circular orbits. The quantum model replaces orbits with orbitals.

**Is this from NCERT?** No. It is an independent study aid that follows the same school topics, with its own pictures and numbers.
