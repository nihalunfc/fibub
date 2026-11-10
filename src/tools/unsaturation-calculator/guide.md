---
name: Unsaturation
num: 836
shelf: science
section: organic-chemistry
title: "Unsaturation"
summary: "Type a molecular formula (C8H10N4O2, C5H6N+) or paste a SMILES string and get the rings plus double bonds (double bond equivalents), whether the formula has an even number of electrons, the nitrogen rule, the monoisotopic, nominal and average masses, and every combination of rings, double and triple bonds that fits. Handles halogens, N, P, S, O, Si, B, charges and isotope labels."
status: live
ads: true
order: 836
icon: flask
works: offline
updated: 2026-11-09
related: [molar-mass-calculator, ir-band-finder, nmr-impurity-checker, isotope-pattern-calculator, periodic-table, adduct-calculator]
sources:
  - "Method: the standard degree-of-unsaturation formula, 1 + ½ Σ nᵢ(vᵢ − 2), as taught in organic chemistry and mass spectrometry courses. Formula and SMILES reading, the ion rules and the combinations are written by fibub."
  - "Atomic masses: fibub's element table (IUPAC/CIAAW standard atomic weights; isotope masses from NIST/IUPAC data via the MIT-licensed chemical-elements package)."
  - "Checked in the tests against RDKit 2026.09 on 622 SMILES strings of 164 molecules (each written several ways): formulas, charges, exact masses, ring counts and rings plus π bonds, 4,930 checks."
  - "SMILES syntax follows the OpenSMILES specification (open, community-maintained)."
flow:
  - { icon: pencil, label: "Formula" }
  - { icon: calculator, label: "Rings + π" }
  - { icon: check, label: "Check" }
  - { icon: table, label: "Options" }
---

## What it does

The **degree of unsaturation** (also called rings plus double bonds, RDB, or double bond equivalents, DBE) tells you how many rings and π bonds a molecule must have. A saturated, open-chain compound has 0. Each ring adds 1, each double bond (C=C, C=O, C=N) adds 1 and each triple bond adds 2, so a benzene ring is worth 4. It is the first thing to work out when you have a formula from a combustion analysis or a high-resolution mass spectrum and want to draw a structure.

This page works it out from:

- a **molecular formula**, such as C8H10N4O2, C6H5Cl, C5H6N+ or SO4^2-, including brackets and isotope labels ([13C], D); or
- a **SMILES string**, such as `CC(=O)Oc1ccccc1C(=O)O` for aspirin. The page's own SMILES reader handles branches, ring numbers (including %10), aromatic lower-case atoms, bracket atoms with charges, isotopes and hydrogen counts, and adds the missing hydrogens. From SMILES it also counts the rings in the drawing and the double, triple and aromatic bonds as written.

It then checks the formula:

- **Electron count.** A neutral molecule with the usual valences must have an even number of electrons; an odd count (a value like 4.5) means a radical or a wrong hydrogen count.
- **Nitrogen rule.** A neutral molecule (or the M⁺• ion from electron ionisation) has an odd nominal mass exactly when it has an odd number of nitrogens; for [M+H]⁺ and [M−H]⁻ the parity flips.
- **Masses**: monoisotopic (for high-resolution mass spectrometry, with the electrons of the charge taken off), nominal and average.

Finally it lists **every combination** of rings, double bonds and triple bonds that adds up to the value, such as 1 ring + 3 double bonds for a benzene ring.

Get the formula's isotope peaks with the [[isotope-pattern-calculator]], then match the rings and double bonds to the spectrum with the [[ir-band-finder|IR band finder]].

## How to use it

1. Choose **Formula** or **SMILES** and type or paste. The examples fill the box.
2. Read the value at the top, and the coloured labels: green means the formula is fine as written, red means it cannot be a neutral, closed-shell molecule.
3. If your molecule has a sulfone, sulfoxide, sulfate or phosphate group, set **Count sulfur as** or **Count phosphorus as** to count the S=O or P=O bonds.
4. Look through the table of combinations to see what structures are possible. Download the report or the combinations as a CSV.

## The formula

Rings + double bonds = 1 + ½ Σ nᵢ(vᵢ − 2), where nᵢ is the number of atoms of each element and vᵢ the number of bonds it usually makes. With C, H, N, O and halogens (X) this is the familiar **C − H/2 − X/2 + N/2 + 1**. Oxygen and sulfur (2 bonds) do not change it; silicon counts like carbon, phosphorus like nitrogen.

**Ions.** For a charged formula the page shows the value for the formula as written (ending in .5 for an even-electron ion) and then two readings: if the charge sits on N, O, S or P (pyridinium, an alkoxide) add half the charge; if it sits on carbon (a carbocation or carbanion) take off half its size.

## Worked example

Caffeine, **C8H10N4O2**: 1 + ½(8×2 − 10×1 + 4×1 + 2×0) = 1 + ½(16 − 10 + 4) = **6**. Valence electrons 74, even: a valid formula. Four nitrogens (even), so the nominal mass is even: 194. Monoisotopic mass 194.08038 u. From the SMILES the page finds 2 rings, so there are 4 π bonds (two C=O and two in the rings). Pyridinium, **C5H6N+**, gives 3.5 for the formula; with the charge on nitrogen that is 4 (1 ring + 3 π bonds), as in pyridine.

## Tips

- In SMILES, write pyrrole-type NH as `[nH]` (c1cc[nH]c1). A plain `n` in a five-membered ring has no hydrogen.
- Several parts separated by a dot (a salt, a mixture) are added into one formula. The value then counts the parts as one molecule, so it is lower by one for each extra part.
- Metals and other elements without a fixed number of bonds are not covered; the page says which element it cannot handle.

## FAQ

**Why is my value negative?** There are more hydrogens or halogens than the other atoms can hold. Check the formula.

**Why does a sulfone come out as 0?** Sulfur is counted with 2 bonds by default, the usual textbook rule. Choose 6 bonds to count both S=O bonds.

**Is my structure sent anywhere?** No. Everything is worked out in the page.
