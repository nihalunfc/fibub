---
name: Allele frequency calculator
num: 312
shelf: science
code: T227
section: population-genetics
title: "Allele frequency and Hardy-Weinberg calculator: genotype counts, chi-square and exact test, FIS, FST and FIT"
summary: "Type or paste genotype counts (AA, AB, BB) for one or more populations. Get allele and genotype frequencies, expected Hardy-Weinberg counts, the chi-square test and the exact test, observed and expected heterozygosity, and F-statistics (FIS, FST, FIT) by Weir and Cockerham or Nei."
status: live
ads: true
order: 312
icon: sigma
works: offline
updated: 2026-11-09
related: [vcf-viewer, biodiversity-indices, sample-size, sequence-tools, hardy-weinberg-tester, effective-population-size, punnett-square, coalescent-simulator, wright-fisher-simulator, carrier-risk]
sources:
  - "Hardy-Weinberg exact test: J. E. Wigginton, D. J. Cutler and G. R. Abecasis (2005), Am. J. Hum. Genet. 76: 887-893 (the algorithm). F-statistics: B. S. Weir and C. C. Cockerham (1984), Evolution 38: 1358-1370; M. Nei (1977), Ann. Hum. Genet. 41: 225-233. Formulas only; no tables are copied."
  - "Checked in the tests: exact-test p-values against a full enumeration of every heterozygote count with exact fractions in Python (8 cases, including tiny samples and a p-value of 5.6 × 10⁻¹⁹); chi-square against scipy.stats.chi2; Weir and Cockerham's θ, F, f and variance components against scikit-allel 1.3.13 (weir_cockerham_fst); Nei's FIS, FST and FIT against an independent numpy calculation."
  - "The example counts are made up."
flow:
  - { icon: table, label: "Counts" }
  - { icon: percent, label: "Frequencies" }
  - { icon: check, label: "HWE test" }
  - { icon: sigma, label: "F-stats" }
---

## What it does

For a gene with two alleles, say A and B, every individual is AA, AB or BB. From the numbers of each, this calculator works out the **allele frequencies** p (of A) and q (of B), the **genotype frequencies**, and the counts that **Hardy-Weinberg equilibrium** predicts: p²n, 2pqn and q²n. It tests whether the observed counts differ from those by the classic **chi-square test** and by the **exact test**, which stays correct for small samples and rare alleles.

With several populations it also gives **F-statistics**: FIS (the heterozygote shortage inside populations, as from inbreeding), FST (how different the populations' allele frequencies are) and FIT (the total).

Test whether the counts fit Hardy-Weinberg proportions with the [[hardy-weinberg-tester|Hardy-Weinberg tester]], and watch frequencies drift over generations in the [[wright-fisher-simulator|Wright-Fisher simulator]].

## How to use it

1. **Genotype counts**: one row per population, with a name and the counts of AA, AB and BB. A header row is fine. Paste from a spreadsheet or open a CSV, TXT or Excel file.
2. **F-statistics**: choose **Weir and Cockerham (1984)**, the standard for real data, which corrects for the number of populations and unequal sample sizes; or **Nei (1977)**, which is built from heterozygosities: HI (mean observed), HS (mean expected within populations) and HT (expected from the overall allele frequency), with each population counting equally.
3. **Allele names**: change "A, B" to your alleles (for example "C, T"); only the labels change.

## What you get

- For each population: n, p, q, observed and expected genotype counts, observed heterozygosity Ho, expected He = 2pq, FIS = 1 − Ho/He, chi-square with 1 degree of freedom and its p-value, and the exact-test p-value.
- A row for all populations pooled, which shows the **Wahlund effect**: mixing populations with different frequencies makes heterozygotes look scarce.
- The F-statistics, a plot of observed heterozygosity against the 2pq curve, and downloads (CSV table; image, PDF or Word report).

## Worked example

The made-up example has three populations of 50. **North meadow** (30 AA, 5 AB, 15 BB) has p(A) = 0.65, so Hardy-Weinberg expects 22.8 heterozygotes but only 5 were seen: Ho = 0.1 against He = 0.455, FIS = 0.7802, chi-square 30.4 and exact p = 2.16 × 10⁻⁸. **River bank** fits Hardy-Weinberg (exact p = 0.57); **Coast dunes** fits too (exact p = 1), but one expected count is 3.92, so the page tells you to rely on the exact test there.

Across the three, Weir and Cockerham give **FST = 0.124**, FIS = 0.2287 and FIT = 0.3243. Switch to Nei and FST = 0.0941, FIS = 0.2191 and FIT = 0.2925; Nei's values always satisfy (1 − FIT) = (1 − FIS)(1 − FST). Pooled together, the 150 individuals fail the exact test (p = 0.000326), partly because the populations differ.

## Tips

- Use the exact test when any expected count is below 5; the chi-square p-value is then unreliable.
- FST from Weir and Cockerham can be slightly negative when populations hardly differ; read it as about zero.
- One gene says little about a whole genome. Repeat for several loci, or average many with dedicated software.

## FAQ

**Which p-value should I report?** The exact test. It is correct at every sample size; chi-square is an approximation that is fine for large samples.

**Why does pooling fail Hardy-Weinberg when each population passes?** That is the Wahlund effect: a mixture of groups with different p always has fewer heterozygotes than 2p̄q̄.

**Does it handle more than two alleles?** No, this page is for one gene with two alleles (such as a SNP).

**Is my data uploaded?** No. Everything is calculated in your browser.
