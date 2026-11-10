---
title: "Si-doped β-Ga2O3 sputtered films: Hall mobility, oxygen flow and annealing"
summary: "A 2025 study sputtered silicon-doped gallium oxide films and tracked their carriers with Hall measurements. Here is what it reports, and how to check Hall numbers for consistency yourself."
tools: [hall-effect, uncertainty-calculator]
updated: 2026-11-10
sources:
  - "Kim, H., Kubota, Y., Matsushita, N., Lee, G. and Hong, J. (2025), Structural and Electrical Properties of Si-Doped β-Ga2O3 Thin Films Deposited by RF Sputtering: Effects of Oxygen Flow Ratio and Post-Annealing Temperature, Coatings 15(10), 1181, published 9 October 2025. Open access under a Creative Commons Attribution (CC BY) licence. Details checked on the publisher's page, 2026-11-10."
  - "Van der Pauw, L. J. (1958), Philips Research Reports 13, 1 to 9 (sheet resistance of a flat sample of any shape). Hall coefficient, carrier density, mobility and ρ = 1 / (n e μ): standard solid-state physics."
  - "Resistivity of copper, about 1.7 × 10⁻⁶ Ω·cm at room temperature: standard handbook value."
paper:
  title: "Structural and Electrical Properties of Si-Doped β-Ga2O3 Thin Films Deposited by RF Sputtering: Effects of Oxygen Flow Ratio and Post-Annealing Temperature"
  authors: "Kim H, Kubota Y, Matsushita N, Lee G, Hong J"
  journal: "Coatings"
  year: 2025
  doi: "10.3390/coatings15101181"
  url: "https://www.mdpi.com/2079-6412/15/10/1181"
  licence: "CC BY"
  reviewed: true
---

Gallium oxide in its β form is one of the most talked-about materials for power electronics, because its very wide band gap lets a device hold off high voltages. Getting it to conduct well, by adding silicon atoms as donors, is the hard part. A 2025 open-access study in *Coatings* sputtered silicon-doped β-Ga₂O₃ films onto silicon wafers and followed how the amount of oxygen in the chamber and the annealing temperature changed their carriers. Hall measurements were the main test, and the [[hall-effect|Hall effect analyser]] lets you work through the same kind of readings, with the [[uncertainty-calculator]] to carry the errors along.

## What they found

Films grown at room temperature were amorphous, with no crystal order. They became nanocrystalline once annealed at 600 °C or more, with crystallites of about 7 to 8 nanometres. Adding oxygen to the argon during sputtering lowered the number of free carriers at 600 and 700 °C, and the biggest drop came with the very first sccm of oxygen.

The authors also used X-ray photoelectron spectroscopy (XPS) to estimate oxygen vacancies near the surface. That fraction fell from about 42 % before annealing to about 9 % after 700 °C, but it did not track the carrier numbers. They read this as a sign that oxygen vacancies in Ga₂O₃ are deep donors that give up few free electrons at room temperature, so the silicon does most of the doping. The abstract reports mobilities of 50 to 115 cm²/(V·s) and resistivities near 1 × 10⁻⁶ Ω·cm; cracks, blamed on the mismatch with the silicon wafer, appeared in crystallised films.

## Why it matters

A Hall measurement gives three linked numbers. The sideways Hall voltage in a magnetic field gives the carrier density n and its sign (electrons or holes). The sheet resistance from a van der Pauw measurement gives the resistivity ρ. Put together, they give the Hall mobility μ, how easily the carriers move. Because the three are tied by ρ = 1 / (n e μ), where e is the charge on one electron, any reported set can be checked against itself in a few seconds.

## How they did it

The films were made by radio-frequency magnetron sputtering from a gallium oxide target mixed with 1 % by weight of silicon dioxide, with oxygen flows from zero to 4 sccm alongside argon. They were then annealed at 600, 700 or 800 °C. The Hall setup used four titanium-gold contacts in the van der Pauw arrangement, a 20 mA current and a 0.53 tesla permanent magnet, with readings taken in both current directions and both field directions.

## Check it yourself with fibub

The readings below are **our own made-up numbers** for an imaginary 300 nm oxide film. They are not from the paper.

1. Open the [[hall-effect]] tool. Type **300** nm for the film thickness.
2. For R_A, type two readings, **41.8, 42.2** Ω, and for R_B **33.9, 34.1** Ω. The reciprocity check shows a spread of about 0.5 %, inside 5 %, so the contacts look sound.
3. Keep *One field, +B and −B*. Set the current to **20** mA and the field to **0.53** T.
4. Type a Hall voltage of **−3.70** mV at +B and **3.50** mV at −B. The page averages them to −3.60 mV and removes a small offset of −0.10 mV from slightly misaligned contacts.
5. The results read **n-type**, a sheet resistance of about **171.6 Ω/□** (correction factor f = 0.996), a sheet density of about **1.84 × 10¹⁵ cm⁻²**, a carrier density of about **6.13 × 10¹⁹ cm⁻³**, a Hall mobility of about **19.8 cm²/(V·s)** and a resistivity of about **0.00515 Ω·cm**.
6. Check the result by hand: 1 ÷ (6.13 × 10¹⁹ × 1.602 × 10⁻¹⁹ × 19.8) ≈ 0.00515 Ω·cm. It matches, as it must.

Now try the thickness. Halve it to 150 nm and the density doubles to about 1.23 × 10²⁰ cm⁻³ while the mobility stays the same. The thickness only enters the bulk values, so a poorly known film thickness goes straight into n and ρ.

The same relation is a quick check on any paper. Take the ranges the authors give in their abstract: a mobility of 115 cm²/(V·s) with a resistivity of 1 × 10⁻⁶ Ω·cm needs about 5.4 × 10²² carriers per cm³. That is the size of the "above 5 × 10²²" figure in the abstract, so the headline numbers hang together. It is also worth noticing what they mean: a resistivity a little below copper's, and a carrier density more than half the number of atoms in the film. Results that far beyond the usual range for doped gallium oxide deserve a careful look at the full tables, the film thickness and whether the silicon wafer underneath carries any of the current.

## The fine print

- **One doping level.** Only one silicon content in the target was tried; the authors plan to vary it.
- **The text gives two ranges.** The abstract says carrier densities above 5 × 10²² cm⁻³, while the results section says above 10²² cm⁻³; resistivities also differ slightly between the two. Read the paper's own tables for the exact values.
- **Small differences.** The authors say the changes in resistivity and sheet resistance between conditions were not statistically significant.
- **Surface chemistry only.** XPS looked at the top few nanometres, without depth profiling.
- **Room-temperature Hall only.** Temperature-dependent Hall measurements, which would separate scattering and trapping, are planned.
- Our tool assumes one type of carrier and a uniform film. A conducting substrate or a second layer makes the Hall density and mobility a weighted mix. Our numbers are made up; for the study's measured values, read the paper itself.
