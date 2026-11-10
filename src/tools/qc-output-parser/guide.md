---
name: QC output reader
num: 839
shelf: science
code: T575
section: computational-chemistry
title: "QC output reader"
summary: "Open a Gaussian .log or ORCA .out file and get the final energy, a plot of the energy at every optimisation step with the convergence criteria, thermochemistry (zero-point energy, enthalpy, Gibbs energy), dipole moment, HOMO, LUMO and all orbital energies, vibrational frequencies with IR intensities, a warning for imaginary frequencies, a broadened IR spectrum with your own scaling factor and band width, and the final geometry as XYZ. Everything stays on your device."
status: live
ads: false
order: 839
icon: chart
works: offline
updated: 2026-11-09
related: [huckel-mo-calculator, ir-band-finder, point-group-finder, thermochemistry-calculator, molecule-viewer, plot-maker]
sources:
  - "File reading, the summary, the Lorentzian spectrum and the XYZ writer are written by fibub from the published layouts of Gaussian 16 and ORCA 5 output. Not affiliated with Gaussian, Inc. or the ORCA developers."
  - "Unit conversions: CODATA 2018 (1 Eh = 27.211386 eV = 2625.4996 kJ/mol; 1 e·a₀ = 2.541746 D)."
  - "The two example files are made up by fibub in those layouts; their numbers are invented, not copied from any calculation."
  - "Checked in the tests against cclib 1.8 on 120 synthetic Gaussian and ORCA files (closed and open shell, optimisations that do and do not converge, transition states, jobs without frequencies or with an error termination) plus the two examples, and the broadened spectrum against NumPy."
flow:
  - { icon: file, label: "Open .log" }
  - { icon: chart, label: "Energies" }
  - { icon: curve, label: "IR" }
  - { icon: download, label: "XYZ, CSV" }
---

## What it does

Quantum chemistry programs write long text files. This page reads a **Gaussian** (.log or .out) or **ORCA** (.out) output file in your browser and pulls out what you usually need:

- **Final energy** in hartree (Eh) and eV, the method line, charge, multiplicity and molecular formula.
- **Energy at each geometry**: a plot of every step of a geometry optimisation relative to the final energy, and a table with the energy change and each convergence criterion (forces, displacements, energy change) marked met or not. The page says whether the optimisation converged.
- **Thermochemistry**: zero-point energy, enthalpy H and Gibbs energy G at the temperature of the calculation, and G − E.
- **Dipole moment** in debye.
- **Orbital energies**: HOMO, LUMO and the gap in eV, the ten orbitals around the gap (α and β for open-shell jobs), and every orbital in a CSV.
- **Vibrational frequencies** with IR intensities, an **imaginary-frequency warning** (one imaginary mode means a transition state, not a minimum), and an **IR spectrum** drawn from the sticks with your own **scaling factor** and **band width**.
- **Final geometry** as an XYZ file, to open in a viewer or start the next job.

Open the final geometry in the [[molecule-viewer|molecule viewer]], and match the computed bands to a measured spectrum with the [[ir-band-finder|IR band finder]].

## How to use it

1. Press **Open an output file**, drop the file on the box, or paste the text. The two example buttons load made-up files that show the layouts.
2. Read the summary: the coloured labels show normal termination, convergence and imaginary frequencies.
3. Under the IR spectrum, type a **scaling factor** for your method (published tables list them; 1 leaves the frequencies unscaled) and a **band width** (full width at half maximum, 10 to 30 cm⁻¹ looks like a solution or solid spectrum).
4. Download the steps, orbitals, frequencies or spectrum as CSV, the geometry as .xyz, or the whole summary as PNG, PDF or Word.

## Worked example

Press **Gaussian: water** (a made-up B3LYP/6-31G(d) optimisation and frequency job). The page reports a final energy of −76.408953 Eh (−2079.1935 eV), normal termination, an optimisation that converged in 3 steps and no imaginary frequencies. The energy plot falls by 7.43 kJ/mol from the first geometry to the last. The HOMO is at −0.29287 Eh (−7.969 eV), the LUMO at 0.06571 Eh (1.788 eV), a gap of 9.757 eV. The dipole is 2.0941 D along z. Three modes at 1712.9, 3726.8 and 3848.6 cm⁻¹ have IR intensities 74.6, 2.1 and 18.4 km/mol; with a scaling factor of 0.96 the bend moves to 1644.4 cm⁻¹. The zero-point energy is 0.021134 Eh (55.49 kJ/mol) and G − E is 0.003492 Eh.

## How the spectrum is drawn

Each mode i with frequency νᵢ and intensity Iᵢ (km/mol) becomes a Lorentzian band centred at s·νᵢ (s the scaling factor) with half-width γ = FWHM/2: Iᵢ·(γ/π)/((ν − s·νᵢ)² + γ²). The area under each band equals its intensity, so the curve has units of km/mol per cm⁻¹. The plot shows the curve and the sticks, each scaled so the tallest reaches 1, with wavenumber falling to the right as IR spectra are usually drawn. Imaginary modes are listed but not drawn.

## Tips

- A job that is still running, or stopped early, has no normal-termination line; the page reads what is there and says so.
- For files with several jobs (Gaussian Link1, ORCA compound jobs) the energies of every geometry are listed and the last orbitals, frequencies and geometry are shown.
- ORCA's FINAL SINGLE POINT ENERGY includes any dispersion correction; that is the energy shown.
- ORCA 4 prints T² instead of km/mol for IR; the relative heights are still right, and the page notes it.

## FAQ

**Which versions work?** Files in the layout of Gaussian 09 and 16 and ORCA 4 to 6. Unusual job types (ONIOM, counterpoise, scans) may show only part of the information.

**Is my output uploaded?** No. The file is read by the page in your browser and never leaves your device.

**Why is my frequency negative?** Programs print imaginary frequencies with a minus sign. One means the structure is a saddle point along that mode.
