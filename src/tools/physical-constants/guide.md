---
name: Physical constants
num: 977
shelf: science
section: general-physics-lab-helpers
title: "Physical constants: CODATA 2022 and 2018 values with uncertainties, units and copy buttons"
summary: "Look up the fundamental physical constants (speed of light, Planck, Boltzmann, Avogadro, electron and proton masses, fine-structure constant and 60 more) as recommended by CODATA in 2022 and 2018, with their units, standard uncertainties and one-tap copy, all working offline."
status: live
ads: true
order: 13
icon: book
works: offline
updated: 2026-11-09
related: [uncertainty-calculator, sig-fig-checker, curve-fitter, dimensional-analysis, unit-converter, periodic-table, scientific-notation-formatter]
sources:
  - "CODATA Recommended Values of the Fundamental Physical Constants: 2018 (Tiesinga, E. et al., Rev. Mod. Phys. 93, 025010, 2021) and 2022 (Mohr, P. J. et al., 2024), published by NIST (public domain, physics.nist.gov/constants)."
  - "Every value and uncertainty was compared with the CODATA 2018 and 2022 tables in scipy.constants (no differences), and the tests check the published values against the relations that link them (α, a₀, R∞, E_h, K_J, R_K, σ and more)."
flow:
  - { icon: search, label: "Search" }
  - { icon: book, label: "Constant" }
  - { icon: copy, label: "Copy" }
---

## What it does

This is a quick, offline reference for the fundamental physical constants: the **CODATA recommended values**, the internationally agreed set published by NIST and used in textbooks, papers and software. It lists 70 of the most used constants in five groups: universal (c, h, ħ, G, μ₀, ε₀), electromagnetic (e, flux and conductance quanta, Josephson and von Klitzing constants, magnetons), atomic and nuclear (α, R∞, a₀, particle masses in kg, MeV and u, g factors), physico-chemical (N_A, k, R, F, σ, Wien and radiation constants) and adopted values (g_n, atm, eV).

You can switch between the **2022** adjustment (the current one) and the **2018** adjustment, which many textbooks, lab manuals and older papers use. Constants whose value changed are marked "updated since 2018".

Check that a formula with these constants balances with the [[dimensional-analysis|dimensional analysis checker]], and convert your results with the [[unit-converter|unit converter]].

## How to use it

1. Type part of a name, a symbol or a unit in **Search**: "planck", "m_e", "eV", "boltzmann eV". Several words must all match.
2. Narrow by **group** if you like.
3. Press **Copy** next to a constant to put its value on the clipboard as a plain number such as 6.62607015e-34, which pastes straight into a calculator, a spreadsheet or code. Choose "number, uncertainty and unit" to copy text like `6.67430e-11 ± 0.00015e-11 m³ kg⁻¹ s⁻²` instead.
4. Download the constants on screen as CSV, or as an image, PDF or Word table.

## Reading the values

- **Exact** constants were fixed in 2019 when the SI was redefined: the speed of light, the Planck constant, the elementary charge, the Boltzmann constant, the Avogadro constant, the caesium frequency and the luminous efficacy, and everything worked out from them only (ħ, R, F, σ, K_J, R_K and so on). A value ending in … goes on for ever and is shown to the digits CODATA publishes.
- **Measured** constants have a **standard uncertainty**, written in brackets on the last digits: 6.674 30(15) × 10⁻¹¹ means 6.674 30 × 10⁻¹¹ with a standard uncertainty of 0.000 15 × 10⁻¹¹. The relative uncertainty is shown under each value.
- Since 2019, μ₀ and ε₀ are measured (they depend on the fine-structure constant) rather than exact.

## Worked example

Search for "gravitation": the page shows the **Newtonian constant of gravitation G = 6.674 30(15) × 10⁻¹¹ m³ kg⁻¹ s⁻²**, relative uncertainty 2.2 × 10⁻⁵, the least well known of the constants. Copy puts 6.67430e-11 on the clipboard. Search "electron mass" with CODATA 2022 and the first result is **9.109 383 7139(28) × 10⁻³¹ kg**, marked "updated since 2018"; switch to 2018 and it reads 9.109 383 7015(28) × 10⁻³¹ kg.

## FAQ

**Which edition should I use?** The latest (2022) unless your course, journal or software is fixed to 2018. The differences are far below everyday lab precision.

**Is anything downloaded when I use this?** No. The values are part of the page, so it works offline.

**Where are the other constants?** NIST lists more than 350; this page keeps the ones used most often. The full list is free at the NIST constants website.
