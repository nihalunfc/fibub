---
name: Hardy-Weinberg tester
num: 206
shelf: science
code: T206
section: genetics
title: "Hardy-Weinberg equilibrium test: chi-square, exact test, inbreeding coefficient F and de Finetti diagram"
summary: "Test whether one sample's genotype counts fit Hardy-Weinberg proportions. Gives allele frequencies, observed and expected heterozygosity, the inbreeding coefficient F, chi-square with optional continuity correction, and the exact test (two-sided and one-sided), with a de Finetti diagram. Also handles three or more alleles by chi-square."
status: live
ads: true
order: 5
icon: check
works: offline
updated: 2026-11-09
related: [vcf-viewer, sample-size, sequence-tools, allele-frequency-calculator, punnett-square, mendelian-chi-square, ternary-plot-maker, effective-population-size, wright-fisher-simulator]
sources:
  - "Hardy-Weinberg principle (G. H. Hardy 1908; W. Weinberg 1908). Exact test: J. E. Wigginton, D. J. Cutler and G. R. Abecasis (2005), Am. J. Hum. Genet. 76: 887-893. Continuity correction: F. Yates (1934). de Finetti diagram: B. de Finetti (1926). Formulas only; no tables are copied."
  - "Checked in the tests: two-sided and one-sided exact p-values against a full enumeration with exact fractions in Python; Yates-corrected chi-square against NumPy and scipy.stats.chi2; three-allele chi-square, He and F against an independent NumPy calculation."
  - "The example counts are made up."
flow:
  - { icon: table, label: "Genotypes" }
  - { icon: percent, label: "p and q" }
  - { icon: check, label: "HWE test" }
  - { icon: chart, label: "Diagram" }
---

## What it does

In a large population with random mating and no selection, migration or mutation at a gene, genotype shares settle at **p², 2pq and q²**, where p and q are the two allele frequencies. This is **Hardy-Weinberg equilibrium (HWE)**. Testing it is a classic teaching exercise. It is also a routine quality check for genotyping: a SNP far out of HWE in healthy samples often means a genotyping error.

This page tests one sample at one gene (locus). It gives the allele frequencies, the expected counts, the **chi-square test** (with Yates's continuity correction if you want it), the **exact test** of Wigginton and others (two-sided, plus one-sided for a heterozygote deficit or excess), the **inbreeding coefficient F = 1 − Ho/He**, and a **de Finetti diagram**.

Find allele frequencies across several populations with the [[allele-frequency-calculator]], and watch them drift over generations in the [[wright-fisher-simulator]].

## How to use it

1. **Two alleles**: type the counts of the three genotypes, such as AA, AB and BB. You can rename the alleles; the labels follow.
2. **Three or more**: one row per genotype, written with a slash (A/B), then its count. Genotypes you leave out count as zero. Paste from a spreadsheet or open a CSV or Excel file. This mode uses chi-square with k(k − 1)/2 degrees of freedom; the exact test and the diagram are for two alleles.
3. **Continuity correction**: subtracts ½ from each |O − E| before squaring. This makes the chi-square test more cautious in small samples. The exact test does not need it.

## Reading the de Finetti diagram

The triangle's corners are the three genotypes. Each sample is one point, placed so that its distances to the sides are its genotype shares. The curve is the Hardy-Weinberg parabola: every possible population in equilibrium. Points below the curve have too few heterozygotes, as from inbreeding or mixing populations; points above it have too many. The second chart shows the exact test itself: the probability of each possible heterozygote count, given the allele counts.

## Worked example

The made-up sample has 12 AA, 70 AB and 18 BB, so p(A) = 0.47 and Hardy-Weinberg expects 22.09, 49.82 and 28.09. There are 70 heterozygotes where 49.82 are expected: Ho = 0.7 against He = 0.4982, so **F = −0.4051**, a heterozygote excess. Chi-square is 16.41 (p = 5.11 × 10⁻⁵), or 15.21 with the continuity correction. The **exact test gives p = 0.000109** two-sided. The one-sided test for too many heterozygotes gives p = 5.67 × 10⁻⁵, and the one for too few gives p = 1.00. The point sits well above the curve in the diagram.

In **Three or more**, the made-up three-allele sample gives chi-square 4.254 with 3 degrees of freedom, p = 0.235, and F = 0.1179.

## This tool or the allele frequency calculator?

Use this **Hardy-Weinberg tester** for one sample at one locus: learning HWE, checking a SNP's genotype calls, one-sided tests, the continuity correction, more than two alleles, and the de Finetti picture. Use the **allele frequency calculator** when you have several populations and want to compare them with F-statistics (FIS, FST, FIT, by Weir and Cockerham or Nei).

## FAQ

**Why only 1 degree of freedom for 3 genotypes?** One is lost to the fixed total and one to the allele frequency, which is estimated from the same data.

**Which p-value should I report?** The exact test: it is valid at every sample size. Use the one-sided versions only if you decided the direction before looking.

**Is my data uploaded?** No. Everything runs in your browser.
