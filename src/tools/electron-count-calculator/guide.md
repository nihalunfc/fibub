---
name: 18-electron rule
num: 107
shelf: science
section: inorganic-and-coordination-chemistry
title: "18-electron rule"
summary: "Pick the metal, the charge and the ligands (CO, phosphines, halides, Cp, arenes, allyl, hydride, oxo and more) to get the valence electron count, the metal's oxidation state, its dⁿ count and the L/X bond classification, with both the covalent and ionic counts and 15 textbook examples."
status: live
ads: true
order: 2
icon: calculator
works: offline
updated: 2026-11-08
related: [crystal-field-calculator, molar-mass-calculator, huckel-mo-calculator, nernst-calculator]
sources:
  - "Electron counting: Green's covalent bond classification (L and X ligands), as in standard textbooks."
flow:
  - { icon: flask, label: "Metal" }
  - { icon: table, label: "Ligands" }
  - { icon: sigma, label: "Count" }
  - { icon: check, label: "18 or 16" }
---

## What it does

Most stable organometallic and coordination complexes of the d-block hold 18 valence electrons around the metal, the same number as the next noble gas. Square-planar d⁸ complexes such as Wilkinson's catalyst and cisplatin are the main exception at 16. Counting the electrons tells you whether a complex is saturated, whether it can bind another ligand, and what oxidation state the metal is in.

This tool uses the **covalent (neutral ligand) method** with Green's covalent bond classification:

- An **L ligand** gives two electrons and carries no charge: CO, phosphines, amines, water, alkenes, H₂.
- An **X ligand** gives one electron and takes one away from the metal's oxidation state: halides, hydride, alkyl, cyanide.
- Bigger ligands are combinations: η⁵-Cp is L₂X, η³-allyl and acac are LX, η⁶-benzene is L₃, oxo is X₂ and nitrido X₃.

Valence electrons = group number of the metal + 2 × L + X + metal–metal bonds − charge. Oxidation state = charge + X. The d-electron count is the group number minus the oxidation state.

The page also shows the **ionic count** (each X ligand as an anion giving two electrons), so you can see that both methods give the same answer, the **[MLₗXₓ] classification** and the **ligand bond number**.

To see the d-electrons split by the ligands, use the [[crystal-field-calculator]]; for the molecule's symmetry, the [[point-group-finder]].

## How to use it

1. Pick a worked example, or choose the metal and type the overall charge of the complex ion (0 for a neutral molecule).
2. Add the ligands and how many of each. Count a chelating ligand such as en or acac once per ligand, and a ring once per ring with its hapticity.
3. For a metal–metal bonded dimer, count one metal with its own ligands and add its metal–metal bonds.

## Worked examples

- **Ferrocene**, Cp₂Fe: 8 + 2 × (4 + 1) = **18 electrons, Fe(II), d⁶**.
- **Wilkinson's catalyst**, RhCl(PPh₃)₃: 9 + 6 + 1 = **16, Rh(I), d⁸**, square planar.
- **[Co(NH₃)₆]³⁺**: 9 + 12 − 3 = **18, Co(III), d⁶**.
- **Mn₂(CO)₁₀**: each Mn has 7 + 10 + 1 (Mn–Mn) = **18, Mn(0)**.
- **Titanocene dichloride**: 4 + 10 + 2 = **16, Ti(IV), d⁰**.
- **Cobaltocene**: 19 electrons, which is why it is so easily oxidised to the 18-electron cobaltocenium ion.

## Questions

**Why do some books give different numbers?** Older texts count NO, carbenes and some rings differently, and the ionic method can give a different oxidation state for ligands such as NO. The total count does not change. This tool leaves NO out because its linear and bent forms count differently.

**Does every complex obey the rule?** No. Early metals (d⁰ to d²), bulky ligands, square-planar d⁸ complexes and many simple Werner complexes such as [Ni(H₂O)₆]²⁺ (20 electrons) do not.

**Is anything sent anywhere?** No. Everything is calculated in your browser, and the page works offline once loaded.
