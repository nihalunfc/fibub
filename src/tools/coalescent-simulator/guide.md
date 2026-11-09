---
name: Coalescent simulator
num: 314
shelf: science
section: population-genetics
title: "Coalescent simulator: draw gene genealogies, mutations, TMRCA and Watterson's theta (Kingman coalescent)"
summary: "Simulate the family tree of a sample of gene copies back to their most recent common ancestor under the Kingman coalescent. See the tree with its mutations, then compare thousands of genealogies with the expected time to the common ancestor, total branch length, number of segregating sites and Watterson's estimate of θ. Seeded random numbers, so every tree can be repeated."
status: live
ads: true
order: 314
icon: chart
works: offline
updated: 2026-11-09
related: [tree-viewer, sequence-alignment, vcf-viewer, tree-builder, effective-population-size, allele-frequency-calculator, wright-fisher-simulator, molecular-clock]
sources:
  - "Theory: J. F. C. Kingman (1982), Stoch. Proc. Appl. 13: 235-248 (the coalescent); G. A. Watterson (1975), Theor. Pop. Biol. 7: 256-276 (θ from segregating sites, E[S] = θ Σ 1/i); F. Tajima (1983), Genetics 105: 437-460 (Var[S] = θa + θ²b). Formulas only; no tables are copied."
  - "Checked in the tests: the expectations against exact values for n = 10, and 20,000 simulated genealogies against them. Cross-checked once against msprime 1.4.5 (20,000 genealogies of n = 10, ploidy 1, binary infinite-sites mutations, θ = 5): two-sample Kolmogorov-Smirnov p-values 0.20 for the TMRCA, 0.31 for the total branch length and 0.99 for the number of segregating sites."
  - "All settings and trees are simulated; no real data are used."
flow:
  - { icon: sliders, label: "n and θ" }
  - { icon: link, label: "Genealogy" }
  - { icon: target, label: "Mutations" }
  - { icon: chart, label: "Vs theory" }
---

## What it does

Take a sample of n copies of a gene from a population and follow them back in time. Every so often two copies turn out to come from the same parent copy: their lines **coalesce**. Eventually all of them meet in a single **most recent common ancestor (MRCA)**. The **Kingman coalescent** describes this random family tree for a neutral gene in a population of constant effective size N.

This simulator draws such a genealogy, scatters neutral mutations on its branches, and then repeats the process thousands of times to compare the averages with the textbook formulas.

Pick a realistic population size with the [[effective-population-size|effective population size calculator]], and view the simulated trees in the [[tree-viewer|tree viewer]].

## How to use it

1. **Sample size n**: how many gene copies you sampled (2 to 200).
2. **θ = 4Nμ**: the population mutation rate for the whole locus, with μ the mutation rate per copy per generation. It sets how many mutations fall on the tree: θ/2 per unit of branch length. Use 0 for trees without mutations.
3. **Genealogies to average**: how many independent trees to simulate for the comparison table and histogram.
4. **Seed**: the same seed always gives the same trees. **Next tree** steps to the next seed.
5. **Show times in**: coalescent units (one unit is 2N generations for a diploid population) or generations, after you give N.

## What you get

- The tree: tips at the bottom, the MRCA at the top, mutations as dots, with its TMRCA, total branch length, number of segregating sites S, Watterson's θ = S/a (a = 1 + 1/2 + … + 1/(n − 1)) and the share of the TMRCA spent with only two lineages left.
- A table of expected and simulated means and standard deviations, and a histogram of the TMRCA.
- Downloads: the tree in Newick (open it in the phylogenetic tree viewer), every genealogy's values (CSV), and a report as image, PDF or Word.

## Worked example

The page opens with n = 10, θ = 5 and seed 1. That first tree has a **TMRCA of 2.18** units (expected 2(1 − 1/10) = 1.8), a total branch length of 5.343 (expected 5.658) and **16 segregating sites** (expected θa = 14.14), so Watterson's θ = 16 / 2.829 = 5.656. In this tree the last two lineages took 82 % of the whole time to merge.

Averaged over 10,000 genealogies, the TMRCA is 1.812 (standard deviation 1.095, expected 1.076), S averages 14.19 and Watterson's θ averages 5.014, close to the true 5. The histogram shows how widely single genes vary.

## Tips

- Add samples and watch the TMRCA barely move: going from 10 to 100 copies raises the expected TMRCA only from 1.8 to 1.98, because the extra lineages merge very quickly near the tips.
- The final merger of two lineages takes on average 1 unit, more than half of the total: deep history depends on very few lineages.
- Watterson's θ is unbiased but noisy: one locus gives a rough estimate. Real studies average many loci.

## FAQ

**What does a coalescent unit mean in years?** One unit is 2N generations. For N = 10,000 and a generation time of 25 years, that is 500,000 years.

**Does this include recombination, selection or population growth?** No. It is the standard neutral coalescent with constant size, for learning the basics.

**Is anything sent anywhere?** No. Everything runs in your browser.
