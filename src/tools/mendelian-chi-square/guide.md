---
name: Mendelian chi-square test
num: 203
shelf: science
code: T203
section: genetics
title: "Chi-square test for Mendelian ratios: 3:1, 1:2:1, 9:3:3:1, 9:3:4, 12:3:1, 15:1 and your own, with an exact test"
summary: "Check whether the offspring of a cross fit a Mendelian ratio such as 3:1, 1:2:1, 9:3:3:1, 9:3:4, 12:3:1, 15:1, 1:1, 1:1:1:1 or your own. Get expected counts, chi-square, degrees of freedom, the p-value, which classes drive the result, a warning for small expected counts, and an exact binomial or multinomial test."
status: live
ads: true
order: 2
icon: check
works: offline
updated: 2026-11-09
related: [sample-size, sequence-tools, reliability-analysis, punnett-square, hypothesis-tests, linkage-map-calculator, hardy-weinberg-tester, crosstab-chi-square]
sources:
  - "Pearson's chi-square goodness-of-fit test (K. Pearson 1900) and the exact multinomial test (the probability of every outcome no more likely than the one observed). Classic ratios from Mendelian genetics and gene interaction (epistasis), general textbook facts. Formulas only; no tables are copied."
  - "Checked in the tests against SciPy: scipy.stats.chisquare for the statistic and p-value in nine crosses, scipy.stats.binomtest for two classes, and an independent Python enumeration of every multinomial outcome for three or four classes (agreement to 1e-8)."
  - "The example counts are made up."
flow:
  - { icon: table, label: "Counts" }
  - { icon: percent, label: "Ratio" }
  - { icon: sigma, label: "Chi-square" }
  - { icon: check, label: "Fits?" }
---

## What it does

After a genetic cross you count the offspring in each class, for example round-yellow, round-green, wrinkled-yellow and wrinkled-green. Mendel's laws predict a ratio, such as 9:3:3:1 for two independent genes. Real counts never match a ratio exactly, so the question is whether the difference is small enough to be chance. This page answers it with the **chi-square goodness-of-fit test** and, if you like, an **exact test**.

Work out the expected ratio first with the [[punnett-square|Punnett square]], and when two genes break the 9:3:3:1 ratio, map them with the [[linkage-map-calculator]].

## How to use it

1. **Expected ratio**: pick one of the classic ratios:
   - 3:1 (one gene, dominant)
   - 1:2:1 (incomplete dominance)
   - 1:1 (test cross)
   - 9:3:3:1 (two genes)
   - 1:1:1:1 (two-gene test cross)
   - 9:3:4 (recessive epistasis)
   - 12:3:1 (dominant epistasis)
   - 9:7 (complementary genes)
   - 15:1 (duplicate genes)

   Or type **your own** in the Ratio box. Any positive parts work, such as 2:1 for a lethal allele.
2. **Class names**: fill in automatically for each ratio; rename them to your phenotypes.
3. **Observed counts**: one count per class, in the same order as the ratio.
4. **Significance level**: usually 0.05. A p-value below it means the ratio does not fit.
5. **Exact test**: a binomial test for two classes or a multinomial test for more. It needs no large-sample approximation. It is skipped automatically when there are more than 40 million possible outcomes; at that size chi-square is reliable anyway.

## What you get

- χ², the degrees of freedom (classes − 1), the p-value, the critical value and the exact-test p-value.
- A table for each class: expected count, O − E, its contribution (O − E)²/E, its **share of χ²** and the residual (O − E)/√E. Together these show which classes drive the result.
- A warning when an expected count is below 5, the usual limit for trusting the chi-square p-value.
- A bar chart of observed against expected counts, and downloads: CSV, plus a report as image, PDF or Word.

## Worked example

The made-up dihybrid cross has 290, 102, 95 and 33 offspring (520 in all). For 9:3:3:1 the expected counts are 292.5, 97.5, 97.5 and 32.5. That gives **χ² = 0.301 with 3 degrees of freedom and p = 0.960**, well under the critical value of 7.81, so the counts fit 9:3:3:1. The exact multinomial test agrees (p = 0.955). The biggest contributor is A_bb (4.5 more than expected), with 69 % of χ².

Now type 15:1 with counts 70 and 10. Then χ² = 5.33 and p = 0.0209, which rejects the ratio at 0.05. But the exact binomial test gives p = 0.033: still significant, but less extreme, because 5 expected recessives is a small count.

## Tips

- Use counts, never percentages: the test depends on how many individuals you counted.
- If a class has an expected count below 5, trust the exact test, or merge it with a similar class and use a ratio with fewer classes.
- A p-value far above 0.05 does not prove the ratio. It only means these counts cannot tell it apart from the truth; another ratio may fit too.

## FAQ

**Why classes − 1 degrees of freedom?** Once the total is fixed, the last class follows from the others. The ratio itself is given in advance, not estimated from the data.

**What about genotype counts in a natural population?** For Hardy-Weinberg proportions, where the allele frequency is estimated from the same data, use a Hardy-Weinberg test (1 degree of freedom for two alleles).

**Is anything uploaded?** No. Everything runs in your browser.
