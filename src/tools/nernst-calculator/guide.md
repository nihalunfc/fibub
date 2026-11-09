---
name: Nernst and cell potential calculator
num: 96
shelf: science
section: electrochemistry-and-battery-science
title: "Nernst equation and cell potential calculator with a standard reduction potential table"
summary: "Electrode potentials at any concentration, pH and temperature by the Nernst equation, and full galvanic cells: E°cell, Ecell, the balanced cell reaction, cell notation, ΔG, K and Q. Pick from 44 standard half-reactions or type your own, and convert potentials between SHE, SCE, Ag/AgCl and RHE."
status: live
ads: true
order: 2
icon: calculator
works: offline
updated: 2026-11-08
related: [cyclic-voltammetry, equilibrium-solver, thermochemistry-calculator, titration-curve]
sources:
  - "Atomic weights: IUPAC/CIAAW standard atomic weights (abridged values)."
  - "Standard reduction potentials: the CRC Handbook electrochemical series and Bard, Parsons and Jordan, Standard Potentials in Aqueous Solution, which you can type over."
  - "Physical constants: CODATA recommended values (NIST)."
flow:
  - { icon: flask, label: "Electrodes" }
  - { icon: sliders, label: "Conc. and pH" }
  - { icon: calculator, label: "E, ΔG, K" }
  - { icon: chart, label: "E vs Q" }
---

## What it does

The voltage of a battery, the potential of an electrode in a corroding pipe and the point where a redox titration turns all come from one equation. The Nernst equation corrects a standard potential E° for the real concentrations:

E = E° − (RT / nF) ln Q

At 25 °C that is E° − (0.05916 / n) log₁₀ Q, so the potential moves by 59.16 mV divided by the number of electrons for every tenfold change in Q.

The tool works in two ways:

- **Cell (two electrodes).** Pick the cathode (where reduction happens, the + terminal) and the anode (where oxidation happens, the − terminal). You get E°cell = E°cathode − E°anode, the cell voltage at your concentrations, the balanced overall reaction, the cell in line notation, ΔG = −nFE, the equilibrium constant K and the reaction quotient Q. A negative voltage means the cell would need power to run as written, and the tool suggests swapping the electrodes.
- **One electrode.** The potential of a single half-cell against the standard hydrogen electrode, also given against Ag/AgCl and SCE, with the Nernst slope and how far it has moved from E°.

A plot shows the voltage against log₁₀ Q with your conditions marked. A second card converts any potential between SHE, SCE, Ag/AgCl (saturated or 3 M KCl) and the reversible hydrogen electrode at your pH.

To compare with a measured voltammogram, use the [[cyclic-voltammetry]]; for the equilibrium behind the potential, the [[equilibrium-solver]].

## How to use it

1. Choose the half-reactions from the lists. Each is written as a reduction with its standard potential at 25 °C. For a couple that is not in the table, choose "Your own half-reaction" and type E°, the number of electrons and Q.
2. Type the concentrations in the table that appears: ions in mol/L, gases in bar, and H⁺ or OH⁻ as a pH. Solids, liquids and water have an activity of 1 and do not need a value.
3. Change the temperature if you need to. The Nernst slope follows the temperature; E° stays at its 25 °C value.
4. Read the result, check the plot, and download a PNG, PDF or Word report.

## Worked example: a Daniell cell

Zinc in 1.0 M Zn²⁺ is joined by a salt bridge to copper in 0.010 M Cu²⁺.

- E°cell = +0.3419 − (−0.7618) = **+1.1037 V**.
- Cell reaction: Cu²⁺(aq) + Zn(s) → Cu(s) + Zn²⁺(aq), n = 2, written Zn(s) | Zn²⁺(aq) ‖ Cu²⁺(aq) | Cu(s).
- Q = [Zn²⁺]/[Cu²⁺] = 100, so Ecell = 1.1037 − (0.05916/2) × 2 = **+1.0445 V**.
- ΔG° = −2 × 96485 × 1.1037 = −213.0 kJ/mol and K ≈ 2 × 10³⁷: copper is plated out essentially completely.

For the oxygen electrode in neutral water open to air (pH 7, 0.21 bar O₂), E = 1.229 − 0.05916 × 7 − (0.05916/4) log(1/0.21) = **+0.805 V**, which is why oxygen corrodes iron so readily.

## Questions

**Why does the anode list show reductions?** Tables of standard potentials are always written as reductions. The tool reverses the anode half-reaction for you and multiplies both halves so the electrons cancel. Do not multiply E° by these factors: potentials are intensive.

**What about activity?** Strictly, Q uses activities. Concentration is a good stand-in in dilute solutions; at 0.1 M and above, activity coefficients can shift the result by 10 mV or more.

**Which reference values are used?** SCE +0.241 V, Ag/AgCl in saturated KCl +0.197 V and in 3 M KCl +0.210 V, against SHE at 25 °C. RHE moves with pH: E(RHE) = E(SHE) + 0.05916 × pH.

**Is anything sent anywhere?** No. It all runs in your browser and works offline once the page has loaded.
