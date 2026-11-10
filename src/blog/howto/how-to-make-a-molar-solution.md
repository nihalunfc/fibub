---
title: "How to make a solution of a given molarity (grams to weigh)"
summary: "Multiply the molarity by the volume in litres and the molar mass to get the grams to weigh. A worked example with a hydrate, and how to check it."
tools: [solution-calculator, molar-mass-calculator, concentration-converter]
updated: 2026-11-10
sources:
  - "Atomic weights: IUPAC/CIAAW standard atomic weights (abridged values)."
---

To make a solution of a set molarity, weigh molarity × volume (in litres) × molar mass grams of the solid, dissolve it in a little less solvent than you need, then top up to the final volume. The [[solution-calculator]] does the sum for you in its "Make a solution" box, and the [[molar-mass-calculator]] gives you the molar mass to type in.

## What you need

- **The formula on your bottle.** Read the label, not the textbook. A salt sold as a hydrate carries water inside its crystals, and that water adds to what you weigh.
- **The concentration you want.** Molarity (M) means moles of solute per litre of finished solution. 1 mM is a thousandth of that.
- **The final volume**, and ideally a volumetric flask of that size so the volume is exact.

## Step by step

The whole job rests on one line:

**mass (g) = c (mol/L) × V (L) × M (g/mol)**

Here c is the molarity you want, V is the final volume in litres and M is the molar mass, the mass of one mole of the substance. Multiplying c by V tells you how many moles the flask must hold, and multiplying by M turns those moles into grams.

1. Open the molar mass calculator and type the formula exactly as the label gives it, including any water after a dot, such as `MgSO4·7H2O`. Note the molar mass in g/mol.
2. Open the dilution calculator. In the first box, set "Work out" to **Mass to weigh**.
3. Type the molar mass. Then type the concentration and pick its unit (M, mM, µM or nM), and the final volume with its unit (L, mL or µL).
4. Read the answer line, which says "Weigh …" in g, mg or µg, whichever reads best. The line below it reminds you to dissolve in less than the final volume first.
5. Weigh the solid, dissolve it in roughly three quarters of the volume, pour it into the flask, rinse the beaker into the flask, and fill to the mark.

The same box runs backwards. Switch "Work out" to **Concentration** and type the mass you actually weighed to see the molarity you really made. Switch it to **Volume** to find what volume a given mass needs.

If your recipe is written as % w/v, mg/mL or ppm, you can type those units straight into the same box (they do not need a molar mass). To turn a molarity into one of those units without weighing anything, use the [[concentration-converter]].

## A worked example

Say you need 100 mL of 50 mM magnesium sulfate, and the jar on the shelf is magnesium sulfate heptahydrate, MgSO₄·7H₂O.

**Molar mass.** Typing `MgSO4·7H2O` into the molar mass calculator gives 246.47 g/mol (246.466 to three decimals). The dry salt, MgSO₄, would be 120.36 g/mol. Seven waters nearly double the mass of each formula unit.

**Moles needed.** 50 mM is 0.050 mol/L, and 100 mL is 0.100 L:

0.050 mol/L × 0.100 L = 0.0050 mol

**Grams to weigh.**

0.0050 mol × 246.466 g/mol = 1.2323 g

With molar mass 246.466, concentration 50 mM and volume 100 mL, the solution calculator says **Weigh 1.232 g**.

If you had typed the dry salt's molar mass instead, you would weigh 0.6018 g of the heptahydrate and end up with about half the concentration you wanted. This is the most common way a home-made solution comes out wrong.

**What you really made.** Suppose the balance settles at 1.200 g instead. Switch "Work out" to Concentration, type 1.2 g and 100 mL, keep the unit on mM, and the answer reads **48.69 mM** (12 g/L).

## Check your answer

- **Round and multiply.** 0.05 × 0.1 is 0.005, and 0.005 × 250 is 1.25. The exact answer, 1.232 g, sits right next to that rough one, so no decimal place has slipped.
- **Scale it.** A litre of the same solution would need ten times as much, 12.32 g. If your litre figure is not ten times your 100 mL figure, a unit is wrong.
- **Work it backwards.** 1.2323 g ÷ 246.466 g/mol = 0.0050 mol, and 0.0050 mol ÷ 0.100 L = 0.050 M. You are back where you started.

## Questions people ask

**Why not just add the solid to 100 mL of water?**
The solid takes up room of its own, so the final volume ends up a little over 100 mL and the solution is a little weaker. Dissolving first and then filling to the mark fixes the volume, which is what molarity is measured against.

**What is the difference between molarity and molality?**
Molarity is moles per litre of finished solution. Molality is moles per kilogram of solvent. For dilute solutions in water they are close, but molality does not change with temperature, which is why it is used for freezing-point work.

**My substance is a liquid. Can I still use this?**
Yes. Work out the grams the same way, then divide by the liquid's density (g/mL) to get the volume to measure. For a reagent that already comes as a concentrated solution, a dilution is easier: see the C1V1 = C2V2 box in the same tool.
