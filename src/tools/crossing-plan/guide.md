---
name: Crossing plan and pedigree tracker
num: 388
shelf: science
section: horticulture-and-plant-breeding
title: "Crossing plan and pedigree tracker: inbreeding coefficient and coancestry calculator with a pedigree drawing"
summary: "Enter plants and their parents, and planned crosses. The tool checks the pedigree for loops and mistakes, works out every plant's inbreeding coefficient and the coancestry of any two plants (the inbreeding their offspring would have), draws the pedigree, and saves a crossing plan as CSV. Nothing is uploaded."
status: live
ads: false
order: 388
icon: link
works: offline
updated: 2026-11-09
related: [tree-viewer, sample-size]
sources:
  - "Tabular method for the relationship matrix (Emik and Terrill 1949; Henderson 1976) and Wright's inbreeding and coancestry coefficients, as in Falconer and Mackay, Introduction to Quantitative Genetics (4th ed.), chapter 5."
  - "Checked against textbook values (selfing 1/2 then 3/4, full-sib 1/4, half-sib 1/8, backcross 1/4, repeated selfing and full-sib recurrences) and an independent Python implementation (recursive coancestry with networkx ordering) on the example and five random 40-plant pedigrees: all 8,382 values agree exactly."
  - "The example pedigree and crosses are made up."
flow:
  - { icon: pencil, label: "Pedigree" }
  - { icon: check, label: "Check" }
  - { icon: calculator, label: "Inbreeding" }
  - { icon: table, label: "Cross plan" }
---

## What it does

Breeders keep track of which plant came from which cross, because crossing relatives raises inbreeding: more of the offspring's genes are identical copies inherited from one ancestor, which can reduce vigour (inbreeding depression) or, in a line you want to fix, is exactly the goal. This tool takes a pedigree and:

- **Checks it**: finds loops (a plant listed as its own ancestor), a plant listed twice with different parents, and parents that are not listed (they are added as founders). It can also flag plants used as both female and male, for species with separate sexes.
- **Works out the inbreeding coefficient F** of every plant, by the tabular method: the relationship matrix is built in pedigree order, parents before offspring.
- **Gives the coancestry of any two plants** (also called the coefficient of parentage), which is the inbreeding coefficient their offspring would have.
- **Rates planned crosses**: list the crosses you are thinking of, and see the expected inbreeding of each, sorted from least to most related.
- **Draws the pedigree**, generation by generation, with female parents as solid lines and male parents as dashed lines. Inbred plants have an orange edge.

Predict the gain from selection with the [[breeders-equation|breeder's equation calculator]], and lay out the offspring in a [[field-trial-designer|field trial]].

## How to use it

1. Enter one plant per line: its name, the female (seed) parent and the male (pollen) parent. Use - or leave blank for an unknown parent. A selfed plant has the same parent twice. Paste from a spreadsheet, or press **Open a file**.
2. For a founder you can add a fourth column with its inbreeding: 0 for an outbred plant (the default), 1 for a pure line or a fully inbred line.
3. Enter planned crosses, one per line: female, male, and an optional name.
4. Pick two plants to see their coancestry, and pick a plant to draw just its ancestry. Download the crossing plan, the inbreeding table or the full coancestry matrix as CSV, or the report as an image, PDF or Word file.

## Worked example

Press **Use the example**. Four made-up founder lines, P1 to P4, are crossed and the offspring mated in different ways. The page shows "13 plants, 4 founders, 4 generations". F2a is a self of F1a, so F = 0.5; selfing again gives S2 with F = 0.75. X1 is a cross between the full sibs F1a and F1c, so F = 0.25; X2 is a cross between the half sibs F1a and F1b (sharing the male parent P2), so F = 0.125; the backcross BC1 = F1a × P1 also has F = 0.25.

In the planned crosses, P4 × P3 is unrelated (0), S2 × X3 has coancestry 0.15625, X1 × X2 0.25 and BC1 × F2a 0.375, the closest.

## Tips

- Use the same spelling for a plant everywhere; "P1" and "p1" are different plants.
- If founders are inbred lines, give them F = 1; otherwise the inbreeding of their descendants is underestimated.
- The pedigree only knows what you enter: plants with unknown parents count as unrelated.

## FAQ

**What is the difference between coancestry and relationship?** The additive relationship is twice the coancestry. Full sibs from unrelated, non-inbred parents have a coancestry of 0.25 and a relationship of 0.5.

**How big a pedigree?** Up to 2,500 plants. The coancestry matrix download is for pedigrees of up to 400 plants.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
