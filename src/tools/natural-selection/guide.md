---
name: Natural selection with peppered moths
num: 1126
shelf: learn
section: school-biology
title: "Natural selection simulator: peppered moths on light and dark bark, allele frequency over generations"
summary: "Birds eat the moths they can see. Turn the bark dark with soot or light with clean air and watch dark and light moths rise and fall over 60 generations, with chance (drift) in small populations and, at Class 12 level, p, q and a Hardy-Weinberg check."
status: live
ads: false
order: 1126
icon: chart
works: offline
updated: 2026-11-09
related: [mendel-peas, hardy-weinberg-tester, allele-frequency-calculator, population-growth-models]
sources:
  - "The selection model (dark allele dominant, survival 1 − s for the moth that does not match the bark, random mating) is standard population genetics, written by fibub and checked in the tests against a separate genotype-by-genotype Python version over 40 generations."
  - "The Hardy-Weinberg chi-square p-value (1 degree of freedom) was checked against Python's math.erfc."
  - "Survival numbers, start frequencies and the generation when soot arrives are made-up teaching values, not data from real moth studies. Drawings are fibub's own. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: sliders, label: "Set up" }
  - { icon: eye, label: "Watch" }
  - { icon: chart, label: "Graph" }
  - { icon: check, label: "Check" }
---

## What it does

Peppered moths rest on tree trunks by day. Most used to be pale and speckled, hidden against pale bark covered in lichen. When factory smoke blackened the trees, a dark form became common, because birds found the pale moths more easily on the dark bark. When the air was cleaned, pale moths came back. This simulator lets you replay that story and change it:

- **Tree bark**: always light, always dark, *soot comes* (bark turns dark at generation 10) or *clean air* (bark turns light at generation 10).
- **Birds**: the share of visible moths eaten each generation.
- **Dark allele at the start**: the dark form comes from one dominant allele, C. Light moths are cc.
- **Moths**: 50, 500 or 5000 moths (the default), or *no chance* (the average path). In small populations luck matters too: that is **genetic drift**.
- **Mutation**: the chance, each generation, that a light allele c is miscopied into a dark allele C (off, 1 in 100,000, 1 in 10,000 as the default, or 1 in 1,000). It keeps a trickle of new dark moths appearing, as happened in real moth populations.

While the bark is still light, birds eat most of the few dark moths. In a small population the last dark allele can then be lost by pure chance before the soot arrives; that is genetic drift, and the page says so when it happens. With mutation off, a lost allele never comes back, so selection has nothing to work on. With 5000 moths and a little mutation this almost never happens. To see drift on its own, with many populations side by side, use the [[wright-fisher-simulator]].

The trunk picture shows the moths of one generation, with the eaten ones crossed out; slide **Generation** or press **Play** to move through time. The graph shows the share of dark moths over 60 generations. It fits **Class 10 Science: heredity and evolution** (variation, natural selection) and **Class 12 Biology: evolution** (natural selection, the Hardy-Weinberg principle, gene flow and genetic drift). The moth colour gene works like Mendel's tall and short peas in [[mendel-peas]]; check real genotype counts with [[hardy-weinberg-tester]], work out p and q from data with [[allele-frequency-calculator]], and see how populations grow in [[population-growth-models]].

## How to use it

1. **Pick the level.** *Class 10* shows the moths, the eaten ones and the % dark. *Class 12* adds genotypes CC, Cc and cc, the allele frequencies p and q, and a Hardy-Weinberg check of the newborns.
2. **Pick the bark** and set how hard the **birds** hunt.
3. **Set the dark allele at the start.** The label shows what share of moths that makes dark (1 − q²).
4. **Pick the number of moths and the mutation rate.** Press **New run** to see a fresh run with the same settings; with 50 moths no two runs look alike.
5. **Slide the generation** or **Play**. Download every generation as a CSV file, or the picture and graph as an image, PDF or Word file.
6. **Check yourself** gives fresh questions each time.

## Worked example

Open the page: soot comes at generation 10, birds catch 30 % of the moths they can see, and the dark allele starts at 5 % (so about 9.8 % of moths are dark, because CC and Cc moths are both dark: 1 − 0.95² = 0.0975). With *no chance* and the default mutation rate of 1 in 10,000, dark moths fall while the bark is still light (to 0.4 % by generation 10), then rise once the bark turns dark: about 74 % of moths are dark by generation 30 and 98.9 % by generation 60. With 5000 moths a run follows much the same path. At Class 12 level with 500 moths, the facts show p = (2 × CC + Cc) ÷ (2 × 500) for the newborns and the Hardy-Weinberg expectation p² : 2pq : q², which the newborns fit because they come from random mating.

## Tips

- Selection only works on variation that is already there. If the dark allele starts at 0 %, nothing can happen: try 1 %.
- Light moths come back slowly after clean air because the c allele hides in dark Cc moths, where birds cannot "see" it.
- Set the birds to 0 % and use 50 moths to see drift on its own.
- Try *soot comes* with 500 or 50 moths and mutation off, and press **New run** a few times: often the dark allele is lost before the soot arrives, and the dark moths never come back.

## FAQ

**Is the dark colour caused by the soot?** No. The moths do not change colour. Dark moths are born dark because of the allele they inherit; soot only changes which moths the birds find.

**Why do the newborns fit Hardy-Weinberg if selection is happening?** Random mating rebuilds p², 2pq, q² every generation. Selection changes p between generations, so the population is not in balance over time.

**Are these real survival numbers?** No, they are teaching values you can change.
