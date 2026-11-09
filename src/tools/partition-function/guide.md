---
name: Partition function explorer
num: 919
shelf: science
section: thermodynamics-and-statistical-physics
title: "Partition function calculator: populations, mean energy, entropy and heat capacity from energy levels"
summary: "Type or paste energy levels with their degeneracies, or make oscillator, rigid-rotor or two-level ladders, and get the partition function, Boltzmann populations, mean energy, entropy, Helmholtz energy and heat capacity at any temperature, with charts against temperature."
status: live
ads: true
order: 4
icon: sigma
works: offline
updated: 2026-11-09
related: [ising-model, diatomic-spectroscopy, thermochemistry-calculator]
sources:
  - "Canonical ensemble formulas (Z = Σ g e^(−E/kT), U, S, F, Cv from Z): standard statistical mechanics, for example McQuarrie, Statistical Mechanics."
  - "Constants: CODATA 2018 exact values of h, c, kB, NA and e."
  - "Checked against an independent NumPy script (direct sums, heat capacity by numerical differentiation of U) and the Schottky and Einstein closed forms."
  - "The example levels are made up."
flow:
  - { icon: pencil, label: "Levels" }
  - { icon: sigma, label: "Sum Z" }
  - { icon: table, label: "Populations" }
  - { icon: chart, label: "Cv and S" }
---

## What it does

Everything about a system in thermal equilibrium follows from its **partition function**, Z = Σ g e^(−E/kT): a sum over its energy levels E, each counted g times (its **degeneracy**), weighted by the Boltzmann factor. Z counts roughly how many states are within reach at temperature T.

Give this explorer a list of levels and a temperature and it works out:

- **Populations**: the fraction of particles in each level, g e^(−E/kT)/Z, and per individual state.
- **Mean energy** U, **entropy** S, **Helmholtz energy** F = −kT ln Z and **heat capacity** Cv, per particle (in your energy unit and in units of kB) and per mole.
- Charts of the populations, of Cv against temperature (look for the **Schottky bump** of a two-level system), and of S, U and ln Z against temperature.

## How to use it

1. Choose the **energy unit**: cm⁻¹ (spectroscopy), meV, eV, kelvin (E/kB), kJ/mol or zJ.
2. Type one level per line, **energy, degeneracy**. A missing degeneracy counts as 1. You can paste from a spreadsheet or **open a file** (CSV, TSV, TXT or Excel).
3. Or **make levels from a formula**: a harmonic oscillator ((n + ½) × spacing), a rigid rotor (B J(J+1) with g = 2J + 1) or a two-level system, then press **Fill in the levels**.
4. Set the **temperature**, and the range for the charts (drawn on a log scale).

If the highest level you gave still holds more than 0.1 % of the particles, you will be warned: a truncated list of levels makes Z, S and Cv too small.

## Worked example

The made-up four levels at 0 (g = 1), 120 (g = 3), 450 (g = 5) and 900 cm⁻¹ (g = 1), at **300 K** where kT = 208.5 cm⁻¹. The partition function is **Z = 3.278**. The ground level holds 30.5 % of the particles, the triply degenerate 120 cm⁻¹ level **51.5 %** (more than the ground level, because it has three states), the 450 cm⁻¹ level 17.6 % and the top level 0.41 %, so a warning appears. The mean energy is 144.7 cm⁻¹ (1.731 kJ/mol), the entropy 1.881 kB (15.64 J/(mol·K)) and the heat capacity **0.5853 kB** (4.867 J/(mol·K)).

Now make a **rigid rotor** with B = 10 cm⁻¹ and 40 levels: at 300 K, Z = 21.19 and Cv = 1.000 kB, the classical value for a linear rotor.

## Tips

- An oscillator with a 1000 cm⁻¹ quantum is almost frozen at 300 K (Cv = 0.19 kB); heat it to 2000 K to reach nearly 1 kB.
- Energies only matter relative to each other for populations, S and Cv; U and F shift with the zero you choose.
- Use enough levels: for a rotor you need levels well above kT.

## FAQ

**Is the translational motion included?** No: this is for the levels you give (internal states, spins, a defect, one molecule). For an ideal gas, add the translational part separately.

**Indistinguishable particles?** The per-particle values here assume independent particles; for a gas the N! correction changes F and S but not U or Cv.

**What are the limits?** Up to 20,000 levels, computed in your browser. For study and planning.
