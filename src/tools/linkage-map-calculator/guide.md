---
name: Linkage map calculator
num: 204
shelf: science
section: genetics
title: "Linkage map calculator: recombination frequency to cM (Haldane, Kosambi), gene order from RFs, and three-point testcross"
summary: "Convert recombination frequencies to map distances with the Haldane and Kosambi mapping functions (and back), order loci and draw a linkage map from a table of pairwise recombination frequencies, and solve a three-point testcross: gene order, recombination frequencies, coefficient of coincidence and interference. Runs in your browser."
status: live
ads: true
order: 3
icon: ruler
works: offline
updated: 2026-11-09
related: [sequence-tools, sample-size, tree-viewer, plot-maker, mendelian-chi-square, punnett-square, crossing-plan]
sources:
  - "Methods: Haldane (1919) and Kosambi (1944) mapping functions; Sturtevant (1913) and standard genetics textbooks for three-point mapping, coincidence and interference; ordering by the sum of adjacent recombination frequencies (SARF) as used in linkage mapping software."
  - "Code written by fibub. Checked in the tests against an independent Python implementation (the mapping functions and their inverses, every order of the 5-locus example scored by SARF and by summed Haldane distances, and the three-point classes counted again) and a made-up textbook-style testcross worked by hand."
  - "All example data are made up."
flow:
  - { icon: calculator, label: "RF to cM" }
  - { icon: table, label: "Pair RFs" }
  - { icon: ruler, label: "Order loci" }
  - { icon: sigma, label: "3-point" }
---

## What it does

Genes that sit close together on a chromosome tend to be inherited together. Crossing over at meiosis separates them now and then, and the share of offspring in which this happens is the **recombination frequency (RF)**. Since crossovers are more likely between genes that are far apart, RF can be used to build a **linkage map**: the order of the genes and the distances between them, in **centimorgans (cM)**. This calculator does three common jobs, each in its own panel:

1. **Convert** between recombination frequency and map distance with the **Haldane** or **Kosambi** mapping function, or back.
2. **Order loci and draw a map** from a table of recombination frequencies between pairs of loci.
3. **Solve a three-point testcross** from the counts of the 8 progeny classes: gene order, the two recombination frequencies, map distances, the **coefficient of coincidence** and **interference**.

Nothing is uploaded: everything is worked out in your browser.

## Mapping functions

RF never goes above 0.5 (50 %), because a second crossover between two genes can undo the first. So RF only matches map distance for short intervals. Mapping functions correct for this:

- **Haldane**: d = −½ ln(1 − 2r). It assumes crossovers happen independently of each other (no interference).
- **Kosambi**: d = ¼ ln[(1 + 2r) / (1 − 2r)]. It allows for interference, where one crossover makes another nearby less likely, which fits most real chromosomes better.
- **No mapping function**: 1 % recombination = 1 cM. This is how textbook three-point problems are usually worked.

Type a frequency as a fraction (0.2) or a percentage (20 %). A frequency of 0.5 or more means the loci are unlinked and have no map distance.

## Ordering loci from pairwise frequencies

Enter one row per pair of loci, with the recombination frequency between them, or open a CSV or Excel file. The tool compares every possible order for up to 9 loci and keeps the one with the smallest **sum of adjacent recombination frequencies (SARF)**, or the smallest sum of adjacent map distances if you choose that. With 10 to 20 loci it starts from each locus in turn, adds the nearest remaining locus, then improves the order by reversing stretches (2-opt). This is fast and usually finds the best order, but it is not guaranteed to. Positions are then built up from the adjacent intervals with the mapping function you pick. Pairs you did not measure count as unlinked while ordering. If two such loci end up side by side, the page asks for that frequency.

## Three-point testcross

Cross a fly or plant heterozygous for three genes with a tester that is recessive for all three, and count the 8 classes of progeny. Type each class as three alleles (with + for wild type), always in the same gene order, followed by the count. The tool then:

- takes the two largest classes as **parental** and works out which classes are **single crossovers** in each interval and which are **double crossovers**. The gene whose alleles swap between the parental and double-crossover classes is in the **middle**;
- finds each **recombination frequency** as (single crossovers in that interval + double crossovers) ÷ total;
- adds the two intervals to get the distance between the outer genes. The direct RF between the outer genes is smaller, because it misses the double crossovers;
- works out the expected number of double crossovers (RF₁ × RF₂ × total), the **coefficient of coincidence** (observed ÷ expected) and **interference** (1 − coincidence).

## Worked example

**Mapping functions.** RF 0.2 is 25.54 cM by Haldane and 21.18 cM by Kosambi. Going the other way, 25 cM is RF 0.1967 by Haldane and 0.2311 by Kosambi.

**Map from pairs.** The made-up example has 5 loci, A to E, and all 10 pairwise frequencies. All 60 orders are compared, and the best is **A – D – B – E – C**, with SARF 0.41 (the next best is 0.48). With Kosambi distances the map is 41.7 cM long: A at 0, D at 12.2, B at 20.3, E at 33.6 and C at 41.7 cM.

**Three-point testcross.** The made-up example has 1,000 progeny. The parental classes are + + + (366) and a b c (356). The double crossovers are + + c (9) and a b + (11), so **c is in the middle** and the order is **a – c – b**.

- RF a–c = (68 + 72 + 20) / 1,000 = 0.16, so 16.0 cM.
- RF c–b = (61 + 57 + 20) / 1,000 = 0.138, so 13.8 cM.
- a to b: 16.0 + 13.8 = 29.8 cM. The direct RF of 0.258 misses the double crossovers.
- Expected double crossovers: 0.16 × 0.138 × 1,000 = 22.08. Observed: 20. **Coefficient of coincidence 0.906, interference 0.094.**

## Frequently asked questions

**Which mapping function should I use?** Kosambi is the usual choice for plants and animals, because it allows for interference. Haldane is common when interference is low or unknown. For short distances (under about 10 cM) they hardly differ.

**What does negative interference mean?** It means more double crossovers than expected (coincidence above 1). It happens by chance with small counts, and in a few organisms.

**Does this give LOD scores?** No. It works from recombination frequencies you already have. Use dedicated mapping software for raw genotype data and LOD-based grouping.

**Is my data sent anywhere?** No. Everything runs in your browser and keeps working offline once the page has loaded.
