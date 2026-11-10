---
title: "Ball milling cuts waste in hypervalent iodine reactions, review finds"
summary: "A 2026 review compared iodine(III) reactions done by ball milling with the same reactions in solution, and found the milled ones often made over ten times less waste. Here is how to check an E-factor yourself."
tools: [green-chemistry-metrics, reaction-equivalents, equation-balancer]
updated: 2026-11-10
sources:
  - "Öberg P, Doobary S, Olofsson B (2026), Green Chemistry, CC BY 3.0, the review described here."
  - "E-factor = (total mass in - product mass) / product mass (Sheldon); process mass intensity = total mass in / product mass; atom economy (Trost): standard definitions."
paper:
  title: "Reactivity under mechanochemical conditions: a new and more sustainable era for hypervalent iodine?"
  authors: "Öberg P, Doobary S, Olofsson B"
  journal: "Green Chemistry"
  year: 2026
  doi: "10.1039/D6GC00367B"
  url: "https://pubs.rsc.org/en/content/articlelanding/2026/gc/d6gc00367b"
  licence: "CC BY 3.0"
  reviewed: true
---

Hypervalent iodine compounds are iodine atoms holding more bonds than usual, and chemists like them as mild, metal-free oxidants and as reagents that hand an aryl group to another molecule. Most of these reactions are run in a flask full of solvent. A team at Stockholm University reviewed the growing number of cases where the same chemistry is done instead by grinding or ball milling the solids together, with little or no solvent. Their critical review, published in Green Chemistry in 2026 under a CC BY licence, works out how much waste each route makes. This page explains it in our own words, and the [[green-chemistry-metrics]] page lets you run the same kind of waste sums on your own reactions. Before that, the [[equation-balancer]] and [[reaction-equivalents]] pages help you get the formulas and amounts right.

## What they found

Across the examples they could compare, the milled reactions made more than ten times less waste than their solution versions. For aryl transfers with diaryliodonium salts, waste dropped by five to twenty times. For making arylbenziodoxoles, a family of cyclic iodine reagents, the E-factor (kilograms of waste per kilogram of product) was five to nine times lower. In one sulfur-coupling reaction, the solution route's E-factor was about a hundred times higher. A fluorine-adding ring closure needed about eight times less of a costly fluorinated solvent, HFIP, when milled.

Yields were not always better. Some milled reactions gave lower yields than the flask, others similar or higher ones, so the review does not claim that milling wins every time.

## Why it matters

Solvent is usually most of the mass in a lab or plant reaction, and most of the waste. Hypervalent iodine reagents are already seen as a greener choice than toxic heavy-metal oxidants, so removing the solvent as well could make them more attractive still. The review also gives chemists a consistent set of E-factors to compare routes, which the original papers often did not report.

## How they did it

1. They gathered published reactions of iodine(III) reagents run by grinding or milling.
2. For each, they picked the closest solution-phase reaction they could find.
3. They compared yields, rated the solvents with a pharmaceutical company's solvent guide, and worked out E-factors where the papers gave enough data.
4. To keep the comparison fair, they left purification out of the E-factors, because many papers did not say how much solvent the clean-up took.

## Check it yourself with fibub

A classic example of this chemistry is making Koser's reagent, PhI(OH)OTs, from (diacetoxyiodo)benzene and tosic acid. Here is a worked example with **our own invented amounts and yields**, not values from the review.

1. Type the reaction in the reaction box as `C6H5I(O2CCH3)2 + CH3C6H4SO3H·H2O → C6H5I(OH)OSO2C6H4CH3 + CH3COOH`. The tool balances it, giving 2 acetic acid, and the hydrate dot is understood.
2. Keep Koser's reagent as the wanted product. The atom economy is **76.6 %**: the two acetic acids are an unavoidable by-product, whichever route you choose.
3. Type 3.22 g of the diacetate and 1.90 g of tosic acid hydrate (about 10 mmol each).

**Route 1, in solution.** List the extras as `acetonitrile, 15.7` and `diethyl ether, 28.5` (20 mL and 40 mL turned into grams with their densities). With 3.53 g of product isolated, the tool gives a yield of **90.1 %**, an E-factor of **13.0** and a process mass intensity (PMI, total mass in per mass of product) of 14.0.

**Route 2, milled.** No reaction solvent; one short wash, `diethyl ether, 7.1`. With 3.68 g of product: yield **93.9 %**, E-factor **2.32**, PMI 3.32. The milled route makes about 5.6 times less waste here.

Now delete the wash line, as the review did when it left purification out. The E-factor falls to **0.39**. That one choice changes the headline number six-fold, which is why you should always say what your E-factor includes. The table under the results shows each material's share of the total mass, so you can see that the solvents, not the reagents, drive the difference.

## The fine print

- This is a review of other groups' work, not new experiments. Its numbers are only as good as the data in the papers it read.
- E-factors leave out purification and usually the making of the iodine reagent itself, so real waste is higher.
- Most milled reactions were small, lab-scale runs; scaling up mills is still young.
- Some milled reactions still use hazardous liquids as additives, or excess reagent.
- E-factor counts mass, not hazard: a gram of water and a gram of HFIP weigh the same. Read the full review for the comparisons reaction by reaction.
