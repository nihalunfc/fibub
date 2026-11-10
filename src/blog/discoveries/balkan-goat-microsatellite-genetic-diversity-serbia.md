---
title: "Balkan goat genetic diversity in Serbia: microsatellites, heterozygosity and Hardy-Weinberg"
summary: "A 2026 study of Serbia's Balkan goat found high diversity and little inbreeding across 13 microsatellite loci. See how to test one locus for Hardy-Weinberg and compare flocks yourself."
tools: [hardy-weinberg-tester, allele-frequency-calculator, effective-population-size]
updated: 2026-11-10
sources:
  - "Dominikovic N, Zorc M, Ristanic M, Dimitrijevic V, Blagojevic J, Glavinic U, Stanimirovic Z (2026), Archives Animal Breeding 69: 143-155, CC BY 4.0, the paper described here."
  - "Hardy-Weinberg proportions, He = 1 − Σp², F = 1 − Ho/He and the Bonferroni correction are standard population genetics."
  - "The genotype counts in the worked example are made up by fibub; they are not the paper's data."
paper:
  title: "Genetic diversity and population structure of Balkan goat populations in Serbia based on microsatellite and mtDNA markers"
  authors: "Dominikovic N, Zorc M, Ristanic M, Dimitrijevic V, Blagojevic J, Glavinic U, Stanimirovic Z"
  journal: "Archives Animal Breeding"
  year: 2026
  doi: "10.5194/aab-69-143-2026"
  url: "https://doi.org/10.5194/aab-69-143-2026"
  licence: "CC BY 4.0"
  reviewed: true
---

The Balkan goat is a hardy local breed kept in small flocks across the hills of Serbia. Like many old breeds, it has lost ground to high-yielding imported goats, and small populations risk losing genetic variety through inbreeding. A research team genotyped goats from five flocks and found that the breed still carries plenty of diversity, with only a slight shortage of heterozygotes. The study appeared in Archives Animal Breeding in March 2026. This page explains the findings and shows how to run the core checks on one locus with the [[hardy-weinberg-tester]], and how to compare flocks with the [[allele-frequency-calculator]].

## What they found

Across 13 microsatellite loci the goats carried 5 to 14 alleles per locus. Mean expected heterozygosity, the chance that two gene copies drawn at random differ, was about 0.76. Observed heterozygosity per locus ranged from about 0.59 to 0.87. The overall inbreeding coefficient was low, about 0.04, and no locus departed from Hardy-Weinberg proportions once the tests were corrected for running many of them. The effective population size, the size of an ideal population that would lose diversity at the same rate, came out at roughly 36 to 60 depending on the filter used. Maternal DNA told the same story: 42 goats carried 23 different mitochondrial types, mostly of haplogroup A, the most common goat lineage worldwide, plus one goat from the rarer haplogroup C.

## Why it matters

Conservation plans for rare breeds need to know whether a breed is genetically healthy and whether its flocks differ. High diversity with little inbreeding means the Balkan goat is not yet in genetic trouble. An effective size in the tens, though, is small enough that careful breeding, such as swapping bucks between flocks, matters. The weak structure between flocks suggests some exchange still happens, so the breed can be managed as one population with local character.

## How they did it

The team drew blood from 72 goats in five flocks and kept 69 with complete genotypes. They typed 14 microsatellites from the panel recommended for goats by international animal genetics bodies, then dropped one locus that showed signs of a null allele (an allele the test cannot see, which makes heterozygotes look like homozygotes). For each locus they counted alleles, computed observed and expected heterozygosity, the inbreeding coefficient FIS and Hardy-Weinberg tests with a Bonferroni correction. They estimated effective size, tested for a past bottleneck, and looked for clusters with STRUCTURE and discriminant analysis. They also sequenced part of the mitochondrial control region.

## Check it yourself with fibub

The counts below are **made up** for one imaginary microsatellite locus in 54 goats. Alleles are named by fragment length in base pairs: 150, 154, 158 and 162.

1. Open the Hardy-Weinberg tester and pick **Three or more**. Paste one genotype per row:
   `150/150 6`, `150/154 12`, `150/158 8`, `150/162 3`, `154/154 5`, `154/158 9`, `154/162 2`, `158/158 4`, `158/162 3`, `162/162 2`.
2. Read the facts. Allele frequencies are 0.324, 0.306, 0.259 and 0.111. Observed heterozygosity Ho is 0.685 (37 of 54 goats) and expected He is 0.722, so F = 1 − Ho/He ≈ 0.051, a slight heterozygote shortage like the paper's overall value.
3. Read the test. Chi-square is about 4.00 on 6 degrees of freedom, p ≈ 0.68: no sign of departure. But the note warns that 5 of the 10 genotypes have expected counts below 5, so this p-value is shaky.
4. Pool alleles to firm it up. Treat 154 as one allele and the rest as the other: 5 goats are 154/154, 23 carry one copy and 26 carry none. Switch to **Two alleles** and type 5, 23 and 26. The exact test gives p = 1, with F close to zero (about −0.004).
5. Correct for many loci. With 13 loci, a Bonferroni threshold is 0.05 ÷ 13 ≈ 0.0038. A locus needs a p-value below that before you call it out of equilibrium.
6. Extend the paper. It did not report FST, the share of diversity that lies between flocks. With two-allele counts per flock you can estimate it. Paste two made-up flocks into the allele frequency calculator, `Hill flock 2 12 16` and `Valley flock 8 13 9`. Weir and Cockerham give FST ≈ 0.079; Nei gives about 0.050. Real data would need every locus and all five flocks.

To see why few breeding males keep effective size low, try the [[effective-population-size]] tool with made-up numbers: a flock of 40 does and 3 bucks has Ne = 4 × 3 × 40 ÷ 43 ≈ 11, and using 6 bucks raises it to about 21.

## The fine print

- Flocks were sampled unevenly, with only five goats from one of them, so flock-level results are rough.
- Thirteen microsatellites are a small window on the genome. SNP chips would give firmer estimates of inbreeding and structure.
- Effective size estimates had wide intervals, and some methods returned an infinite value, which means the data could not bound them.
- The bottleneck test gave a signal under one mutation model and not the other, and the clustering methods disagreed (one or two groups in STRUCTURE, five clusters in the discriminant analysis).
- A few numbers differ slightly between the results and the discussion, so check the tables if you reuse values.
