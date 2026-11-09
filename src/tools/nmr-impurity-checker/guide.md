---
name: NMR solvent and impurity peak checker
num: 106
shelf: science
section: analytical-chemistry
title: "NMR impurity checker: match your ¹H or ¹³C peaks to residual solvents, water and grease in 10 deuterated solvents"
summary: "Paste a peak list (even a journal-style one) and see which peaks are residual solvent, water, grease or common lab solvents such as ethyl acetate, DCM and ether, in CDCl₃, DMSO-d₆, CD₃OD, D₂O and six more, for ¹H and ¹³C."
status: live
ads: true
order: 11
icon: search
works: offline
updated: 2026-11-08
related: [isotope-pattern-calculator, molar-mass-calculator, reaction-equivalents, tlc-rf-calculator]
sources:
  - "Solvent and impurity positions: approximate values rounded by fibub to 0.05 ppm (¹H) and 0.5 ppm (¹³C), consistent with the widely used published tables. Not a copy of any table."
flow:
  - { icon: flask, label: "Solvent" }
  - { icon: table, label: "Peaks" }
  - { icon: search, label: "Match" }
  - { icon: check, label: "Impurities" }
---

## What it does

Almost every NMR spectrum of a freshly made compound has a few peaks that do not belong to it: the residual signal of the deuterated solvent, water, a trace of the column solvents, grease from a joint. Their positions are well known but depend on the solvent, so chemists keep a printed table by the spectrometer. This tool is that table with a search built in.

Pick the NMR solvent and the nucleus, then paste your peaks. Every peak is compared with:

- the **residual solvent** signals of the 10 deuterated solvents (CDCl₃, DMSO-d₆, CD₃OD, acetone-d₆, C₆D₆, CD₃CN, D₂O, CD₂Cl₂, THF-d₈ and toluene-d₈);
- **45 common impurities**: water, the usual reaction and column solvents (ethyl acetate, hexane, pentane, diethyl ether, dichloromethane, chloroform, THF, toluene, acetone, methanol, ethanol, 2-propanol, acetonitrile, DMF, DMSO, dioxane, pyridine, triethylamine, acetic acid and others), silicone and hydrocarbon grease, and small gases such as H₂, CO₂, methane and ethylene.

The **Likely impurities** table ranks each compound by how many of its signals appear in your list, and lists the ones still missing, so you can tell whether a peak at 1.26 ppm is really ethyl acetate (look for 2.05 and 4.12 too) or grease. **Peak by peak** shows every match within the tolerance; peaks with no match are most likely your own compound.

The second card lists all signals for the chosen solvent, sorted by shift, with a search by name or by shift.

Check the same compound's IR bands with the [[ir-band-finder]], and its exact mass with the [[isotope-pattern-calculator]].

## How to use it

1. Choose the solvent and ¹H or ¹³C.
2. Paste the peak positions in ppm, one per line, or copy the characterisation line from your notebook or paper (such as "7.26 (d, J = 8.0 Hz, 2H), 3.80 (s, 3H)"): the parts in brackets are skipped. You can also open a CSV or Excel peak list with ppm in the first column.
3. Adjust the tolerance: ±0.03 ppm suits ¹H and ±0.3 ppm suits ¹³C, because the listed positions are rounded. Widen it if your spectrum was referenced differently.

## Worked example

The example is an anisole-type product in CDCl₃ with nine peaks. The tool flags 7.26 as the residual CHCl₃, 1.56 as water and 0.07 as silicone grease, and finds all three ethyl acetate signals (near 4.10, 2.05 and 1.25), so the sample still holds ethyl acetate from the column. The peak at 3.80 has no match and belongs to the compound. So do 7.31 and 6.88: each is close to one signal of pyridine or pyrrole, but the table shows the other signals of those compounds are missing.

## Questions

**Why does the water peak not match?** Water moves with temperature, concentration and hydrogen bonding, by up to a few tenths of a ppm. The same goes for OH and NH peaks.

**How exact are the positions?** They are approximate, rounded to 0.05 ppm for ¹H and 0.5 ppm for ¹³C. Real peaks shift slightly with concentration, temperature and water content, so treat a match as a strong hint and confirm it with the other signals of the same compound.

**Is anything sent anywhere?** No. Your peaks stay in your browser, and the page works offline once loaded.
