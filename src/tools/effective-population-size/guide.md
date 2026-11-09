---
name: Effective population size calculator
num: 313
shelf: science
section: population-genetics
title: "Effective population size (Ne) calculator: sex ratio, harmonic mean, family size variance and the temporal method"
summary: "Estimate the effective population size Ne four ways: from the numbers of breeding males and females, from a population whose size changes over generations (harmonic mean), from the variance in family size, or from how much allele frequencies changed between two samples (Nei and Tajima's Fc with Waples's correction and confidence interval)."
status: live
ads: true
order: 313
icon: calculator
works: offline
updated: 2026-11-09
related: [biodiversity-indices, sample-size, vcf-viewer, wright-fisher-simulator, coalescent-simulator, breeders-equation]
sources:
  - "Formulas: S. Wright (1931), Genetics 16: 97-159 (sex ratio and harmonic mean); J. F. Crow and M. Kimura (1970), An Introduction to Population Genetics Theory (Ne = (4N − 2)/(Vk + 2)); M. Nei and F. Tajima (1981), Genetics 98: 625-640 (Fc); R. S. Waples (1989), Genetics 121: 379-391 (sampling correction, plans I and II, chi-square interval). Formulas only; no tables are copied."
  - "Checked in the tests against an independent numpy and SciPy calculation (scipy.stats.hmean, numpy.var, scipy.stats.chi2.ppf), including a locus with three alleles and sampling plan II. A Python simulation of drift with a true Ne of 100 (200 loci, 200 runs) gave a median temporal estimate of 103, as expected for this slightly biased method."
  - "The example numbers are made up."
flow:
  - { icon: sliders, label: "Estimator" }
  - { icon: table, label: "Numbers" }
  - { icon: calculator, label: "Ne" }
  - { icon: chart, label: "Interval" }
---

## What it does

The **effective population size**, Ne, is the size of an ideal population that would lose genetic diversity by drift as fast as the real one does. It is almost always smaller than the number of animals or plants you can count, because not all of them breed, the sexes are unequal, numbers go up and down, and some parents leave far more young than others. Ne matters in conservation (a common rule of thumb is to keep it well above 50 in the short term) and in breeding programmes.

This calculator gives the four classic estimators.

## How to use it

Pick an **estimator** with the buttons:

- **Sex ratio**: type the numbers of breeding males and females. Ne = 4NmNf / (Nm + Nf).
- **Changing size**: type the breeding population size in each generation. Ne is their **harmonic mean**, so a single bottleneck pulls it down hard.
- **Family size**: either type the number of parents N and the variance in their number of offspring Vk, or list each parent's number of offspring that survived to breed. Ne = (4N − 2)/(Vk + 2). Random breeding success gives Vk ≈ 2 and Ne ≈ N.
- **Temporal**: paste allele frequencies from two samples taken t generations apart, one row per locus (or one row per allele, sharing the locus name before a space). Set the numbers of individuals sampled, S₀ and Sₜ, and the **sampling plan**: plan I if individuals were sampled after breeding or put back, plan II if they were taken before breeding and removed (then give the census size N). Choose a 90, 95 or 99 % interval. You can also open a CSV, TXT or Excel file.

## Worked example

- Sex ratio: 10 males and 90 females give **Ne = 36**, only 0.36 of the 100 breeders.
- Changing size: 500, 40, 600, 800 and 1,000 give **Ne = 161.7**, though the plain average is 588: the one generation of 40 dominates.
- Family size: N = 100 parents with Vk = 6 give **Ne = 49.75**. The made-up list of 12 parents (0, 1, 1, 2, 2, 2, 3, 3, 4, 6, 0, 2 offspring) has Vk = 2.639 and Ne = 9.916.
- Temporal: the made-up data have 10 two-allele loci and one three-allele locus (n′ = 12 independent alleles). Fc = 0.0294, of which 0.01 is expected from sampling 100 individuals twice, so with t = 5, **Ne = 128.9** with a 95 % interval of 35.65 to 488.4. With plan II and N = 500 it is 116.8.

## Tips

- The temporal method needs real change: if Fc is no bigger than the sampling part, Ne is reported as infinite (too large to measure with these samples). Sample more individuals, more loci, or wait more generations.
- Leave out loci where the rare allele is very rare (below about 0.05) in both samples; they add noise.
- The family-size formula assumes a stable population (2 offspring per parent on average); the page warns if your list's mean is far from 2.

## FAQ

**Which estimator should I use?** The first three need demographic data (counts of breeders and offspring); the temporal method needs genetic data from two times. Effects combine, so Ne from demography is usually an upper bound.

**Why is the interval so wide?** The temporal method's precision depends on the number of independent alleles n′; with a dozen it is wide. Hundreds of SNPs narrow it a lot.

**Is anything uploaded?** No. All calculations run in your browser.
