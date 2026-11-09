---
name: Tanabe–Sugano diagram calculator
num: 837
shelf: science
section: inorganic-and-coordination-chemistry
title: "Tanabe–Sugano diagram calculator: d² to d⁸ octahedral energy levels, spin crossover and Δ and B from a spectrum"
summary: "Draws the Tanabe–Sugano diagram for any d² to d⁸ octahedral ion at the C/B ratio you choose, worked out from the electron repulsion and ligand field rather than read off a printed chart. Tap to read every state's energy, see where high spin turns to low spin, list the free-ion terms, and get Δ and the Racah B from two absorption bands of a d³ or d⁸ complex."
status: live
ads: true
order: 837
icon: flask
works: offline
updated: 2026-11-09
related: [crystal-field-calculator, electron-count-calculator, beer-lambert-calculator, point-group-finder, huckel-mo-calculator]
sources:
  - "Method: Tanabe and Sugano (1954, J. Phys. Soc. Japan 9, 753 and 766); Slater–Condon rules and Racah parameters B = F2 − 5F4, C = 35F4 (Condon and Shortley, The Theory of Atomic Spectra; Griffith, The Theory of Transition-Metal Ions). fibub's code is its own and builds the diagram from the Slater determinants; it is checked in the tests against an independent NumPy calculation and the textbook free-ion term energies and d³/d⁸ band formulas."
  - "The ion list and C/B = 4.5 are general textbook facts. The example bands (17000 and 24000 cm⁻¹) and B = 700 cm⁻¹ are made up. Nothing you type is sent or stored."
flow:
  - { icon: flask, label: "dⁿ ion" }
  - { icon: sliders, label: "C/B" }
  - { icon: chart, label: "Diagram" }
  - { icon: pointer, label: "Read Δ, B" }
---

## What it does

A Tanabe–Sugano diagram shows how the electronic states of a transition-metal ion move apart as the ligand field grows. The x axis is the field strength Δ (also called 10Dq) divided by the Racah parameter B; the y axis is the energy of each state above the ground state, also divided by B. Chemists use these diagrams to assign the bands of a d–d absorption spectrum, to work out Δ and B for a complex, and to see where an ion switches from high spin to low spin.

Printed diagrams are drawn for one C/B ratio and are hard to read accurately. This page calculates the whole diagram for you:

- **From first principles.** Every way of placing n electrons in the five d orbitals (a Slater determinant) is a starting state. The repulsion between the electrons is set by B and C, the octahedral field puts the t2g orbitals at −4Dq and the eg orbitals at +6Dq, and the energy matrix is solved for each spin. The states are named by their octahedral symmetry (A₁g, A₂g, Eg, T₁g, T₂g), their spin (the raised number, 2S + 1) and the free-ion term they come from, such as ⁴T₁g(F).
- **Any C/B.** The textbook diagrams use about 4.5; you can see how the picture changes for your own value.
- **High spin to low spin.** For d⁴ to d⁷ the ground state changes at a critical Δ/B; the page finds it exactly and marks it. At C/B = 4.5 it is about 18.9 for d⁶, 21.2 for d⁷, 26.8 for d⁴ and 28.4 for d⁵.
- **Read any point.** Tap or click the diagram, or type a Δ/B, to list every state with its energy in units of B, and, given B, in cm⁻¹ and nm.
- **Δ and B from a spectrum** for d³ (Cr³⁺) and d⁸ (Ni²⁺) complexes, with the third band predicted and the nephelauxetic ratio β if you know the free-ion B.
- **Free-ion terms** (Δ = 0) with their energies, so you can see where each line starts.

## How to use it

1. Choose the number of d electrons. The examples (Cr³⁺ for d³ and so on) are common ions with that count.
2. Leave C/B at 4.5 unless you have a better value for your ion.
3. Look at the diagram. Coloured lines have the same spin as the ground state: these are the spin-allowed transitions that give the strong bands. Grey dashed lines are spin-forbidden and give weak, sharp bands. Choose "spin-allowed only" to hide the grey ones.
4. Tap the diagram where your complex sits, or type Δ/B. The table lists the states at that point; a tick marks the spin-allowed ones. Type your B to get wavenumbers and wavelengths.
5. For a d³ or d⁸ complex, type the two lowest band positions under "Δ and B from a spectrum", then press "Read the diagram at this fit".

## Worked example

Choose d³ with C/B = 4.5 and read at Δ/B = 20. The ground state is ⁴A₂g(F). The table shows ⁴T₂g(F) at 20.00 B (this band is always exactly Δ for d³), then the spin-forbidden ²Eg(G) at 20.71 B and ²T₁g(G) at 21.63 B, and the next spin-allowed state ⁴T₁g(F) at 29.36 B. With the example B of 700 cm⁻¹ these are 14000, 14500, 15141 and 20552 cm⁻¹.

Now the fit: made-up bands at 17000 and 24000 cm⁻¹ give Δ = 17000 cm⁻¹ (203.4 kJ/mol), B = 707.1 cm⁻¹ and Δ/B = 24.04, with the third band, ⁴A₂g → ⁴T₁g(P), predicted at 37606 cm⁻¹ (266 nm). Typing a free-ion B (here a made-up 900 cm⁻¹) gives the nephelauxetic ratio β = 0.786.

## Tips

- Only the spin-allowed bands are strong enough to fit reliably. For d³ and d⁸ the lowest band is Δ itself.
- For d⁴ to d⁷ the diagram breaks where the ground state changes: to the right of the break, energies are measured from the new low-spin ground state, so every line jumps. That is how the printed diagrams are drawn too.
- d⁴ and d⁶ are not mirror images in this diagram (their high-spin ground states are ⁵Eg and ⁵T₂g), and neither are d³ and d⁷, even though they share free-ion terms.
- C barely matters for the spin-allowed bands of d³ and d⁸ (they depend only on B) but moves the spin-forbidden states and the spin crossover a lot.

## FAQ

**Why are the numbers slightly different from my textbook's diagram?** Printed diagrams use slightly different C/B values (often 4.5 to 4.8) and are read by eye. The values here are exact for the C/B you set.

**Does it include spin–orbit coupling or distortion?** No. It is the pure octahedral model with electron repulsion, as in the original Tanabe–Sugano diagrams. Jahn–Teller distortion and spin–orbit coupling split some states further in real spectra.

**What about d¹ and d⁹?** They have a single excited state at exactly Δ, so a diagram adds nothing: the band position is Δ.

**Why is the third band often missing?** It sits in the ultraviolet, where much stronger charge-transfer bands hide it.
