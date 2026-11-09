---
name: Molecular clock calculator
num: 309
shelf: science
section: evolutionary-biology-and-phylogenetics
title: "Molecular clock calculator: divergence time from genetic distance and rate (T = d/2r), with Jukes-Cantor, K2P and a relative rate test"
summary: "Estimate when two species or genes split from their genetic distance and a substitution rate (T = d / 2r), or work out the rate from a known split. Distances from two aligned sequences or site counts with Jukes-Cantor or Kimura 2-parameter correction, error ranges, and Tajima's relative rate test with an outgroup. Runs in your browser."
status: live
ads: true
order: 309
icon: clock
works: offline
updated: 2026-11-09
related: [sequence-alignment, tree-viewer, sequence-tools, radiometric-age-calculator]
sources:
  - "Methods: Zuckerkandl and Pauling (1965) for the molecular clock; Jukes and Cantor (1969) and Kimura (1980) for the distances and their variances, as given in Nei and Kumar, Molecular Evolution and Phylogenetics (2000); Tajima (1993) for the relative rate test."
  - "Code written by fibub. Checked in the tests against Python: the distances, their standard errors by an independent numerical delta method, Tajima's counts, and SciPy 1.18's chi-square p-value."
  - "The example sequences and rate are made up."
flow:
  - { icon: file, label: "Sequences" }
  - { icon: sigma, label: "Distance" }
  - { icon: clock, label: "Date split" }
  - { icon: chart, label: "Range" }
---

## What it does

If DNA changes at a roughly steady rate, the number of differences between two species tells you how long ago they shared an ancestor. That is the **molecular clock**. Since both lineages change after the split, they drift apart at twice the rate of one lineage, so the time since the split is

**T = d / 2r**

where **d** is the genetic distance (substitutions per site) and **r** is the substitution rate per lineage (substitutions per site per unit of time). This calculator works it out either way round:

- **When they split**, from a distance and a rate.
- **The rate**, from a distance and a split dated some other way (a fossil, a dated island, a known event): r = d / 2T.

It gets the distance from two aligned sequences, from site counts, or from a number you type, corrects it for sites that changed more than once, and gives an error range. Add a third sequence as an outgroup and it also runs **Tajima's relative rate test**, a quick check of whether the two lineages really changed at the same rate. Nothing is uploaded.

## How to use it

1. **Distance from**: paste two aligned sequences in FASTA format, enter the number of sites compared with the numbers of transitions and transversions, or type a distance (and its standard error) you already have, for example from a tree.
2. **Correction**: the p-distance is the plain share of sites that differ. It underestimates older splits because a site can change twice and look unchanged. **Jukes-Cantor** corrects for that, treating every change alike. **Kimura 2-parameter** also lets transitions (A↔G, C↔T) happen more often than transversions, which is usual in real DNA.
3. **Work out**: the time, or the rate.
4. **Time unit** and **Rate given as**: a rate per lineage uses T = d / 2r. A pairwise divergence rate (for example "2 % per million years" for some mitochondrial genes) already counts both lineages, so T = d / r. Mixing these up doubles or halves the answer.
5. Enter the **rate** or the **calibration time**, each with a standard error if you know it.

## What you get

- The **time** (or **rate**) with a standard error and an approximate 95 % range. The error combines the sampling error of the distance (from the number of sites) with the error of the rate or calibration, by first-order error propagation.
- A chart of the clock line with your estimate on it.
- With three sequences: the **relative rate test**. It counts sites where only the first sequence differs from the other two (m1) and where only the second does (m2). If both lineages changed at the same rate, m1 and m2 should be about equal; χ² = (m1 − m2)² / (m1 + m2) with 1 degree of freedom.
- CSV, image, PDF and Word downloads.

## Worked example

The made-up example has three sequences of 150 bases and a made-up rate of 0.01 ± 0.002 substitutions per site per million years per lineage.

- Species A and B differ at 18 of 150 sites: 14 transitions and 4 transversions. The p-distance is 0.12; the Kimura 2-parameter distance is **0.1337 ± 0.0331**.
- T = 0.1337 / (2 × 0.01) = **6.68 ± 2.13 million years**, with an approximate 95 % range of 2.51 to 10.9 million years. Most of the uncertainty comes from the short sequences: with ten times as many sites the distance error would shrink about three-fold.
- The relative rate test finds 6 changes only in Species A and 11 only in Species B: χ² = 1.47, p = 0.225, so no evidence that their rates differ.
- Switching to **the rate**, with a calibration of 5 ± 0.5 million years, gives r = 0.0134 ± 0.0036 substitutions per site per million years per lineage.

## Tips and limits

- A clock is only as good as its rate. Use a rate published for your group of organisms and your gene, and check whether it is per lineage or pairwise.
- Rates differ between genes, codon positions and lineages; a failed relative rate test means one clock does not fit.
- Very different sequences become saturated: the correction blows up and no clock can date them. The page tells you when that happens.
- The error range here is approximate. For publication, dating methods with relaxed clocks and several calibrations (such as Bayesian dating software) are the standard.

## Frequently asked questions

**Why divide by 2?** After the split, each lineage changes on its own. Both sets of changes show up as differences between them, so the distance grows at twice the per-lineage rate.

**What are the units?** The distance is in substitutions per site. If the rate is per site per million years, the time comes out in millions of years.

**Is my data sent anywhere?** No. Everything runs in your browser and keeps working offline once the page has loaded.
