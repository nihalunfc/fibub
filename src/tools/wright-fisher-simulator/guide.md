---
name: Wright-Fisher simulator
num: 310
shelf: science
section: evolutionary-biology-and-phylogenetics
title: "Wright-Fisher simulator: genetic drift and natural selection with dominance, fixation probability against Kimura's formula"
summary: "Simulate genetic drift and selection at one gene in a population of N individuals, in up to 10,000 replicate lines at once. Set the selection coefficient s and dominance h, watch the allele frequency wander, and compare the share of lines where the allele fixed with Kimura's fixation probability. Seeded random numbers, so every run can be repeated."
status: live
ads: true
order: 310
icon: curve
works: offline
updated: 2026-11-09
related: [tree-viewer, sample-size, biodiversity-indices]
sources:
  - "Model: the Wright-Fisher model (Fisher 1930, Wright 1931) with genotype fitnesses 1 + s, 1 + hs and 1, selection then binomial sampling of 2N gene copies. Fixation probability: M. Kimura (1962), Genetics 47: 713-719, u(p) = ∫₀ᵖG / ∫₀¹G with G(x) = exp(−4Ns(hx + (1 − 2h)x²/2)). Neutral mean times to fixation and loss: Kimura and Ohta (1969). Binomial draws by W. Hörmann's (1993) BTRS method. Formulas only; no tables are copied."
  - "Checked in the tests against SciPy: Kimura's integral by scipy.integrate.quad for additive, recessive, dominant, partial and harmful alleles (agreement to 1e-7), and the simulated share fixed against the exact Wright-Fisher fixation probability from solving the absorbing Markov chain (scipy.stats.binom and scipy.linalg.solve) for N = 20. The binomial sampler is checked against the exact binomial distribution by a chi-square test."
  - "The example settings are made up."
flow:
  - { icon: sliders, label: "N, s, h" }
  - { icon: curve, label: "Simulate" }
  - { icon: chart, label: "Fixed share" }
  - { icon: check, label: "Vs Kimura" }
---

## What it does

The Wright-Fisher model is the textbook picture of how allele frequencies change in a finite population. Each generation, natural selection nudges the frequency of allele **A** up or down, and then the next generation is formed by drawing 2N gene copies at random from the parents (N diploid individuals). That random draw is **genetic drift**: even a helpful allele is often lost by chance while it is rare, and a useless one sometimes takes over.

This simulator runs many independent populations ("lines") side by side from the same start, so you can see the spread of outcomes. It counts how many lines end with A **fixed** (frequency 1) or **lost** (frequency 0), and compares the fixed share with **Kimura's fixation probability**, the classic diffusion-theory prediction.

## How to use it

1. **Population size N**: the number of diploid individuals. There are 2N copies of the gene. Smaller N means stronger drift.
2. **Start**: either a starting frequency of A, or "one new copy", a single new mutation (frequency 1/2N).
3. **Selection s and dominance h**: fitness is 1 + s for AA, 1 + hs for Aa and 1 for aa. A positive s favours A; a negative s works against it; s = 0 is pure drift. h = 0.5 is additive (the heterozygote is halfway), h = 0 makes A recessive (only AA benefits), h = 1 makes A fully dominant. Values outside 0 to 1 give over- or underdominance.
4. **Generations and lines**: how long to run and how many replicate populations. Tick **Keep going until every line is fixed or lost** to compare with Kimura properly: otherwise lines still drifting at the end are not counted as fixed.
5. **Seed**: the same seed and settings always give exactly the same run, so you can share or repeat a result. "New seed" draws a fresh one.

## What you get

- The number and share of lines fixed and lost, with a 95 % Wilson interval for the fixed share, Kimura's prediction and the neutral expectation (with no selection the fixation probability is simply the starting frequency).
- Mean times to fixation and to loss among the lines that got there; for s = 0 the neutral theory values of Kimura and Ohta are shown beside them.
- A plot of the frequency in up to 50 lines with the mean of all lines, and a plot of the share fixed and lost by each generation.
- Downloads: the mean, shares and drawn lines per generation (CSV), each line's final frequency (CSV), and a report as image, PDF or Word.

## Worked example

The page opens with N = 50, a starting frequency of 0.1 (10 of 100 copies), s = 0.02, h = 0.5, 1,000 lines and seed 1, running until every line is done. A was fixed in **200 of 1,000 lines (20.0 %)**, with a 95 % interval of 17.6 % to 22.6 %. Kimura's formula gives **21.0 %**, inside that interval, and twice the neutral 10 %: here 4Ns = 4, so selection matters but drift still loses most copies. All lines finished by generation 786; lines that fixed took 176 generations on average, and lost ones 48.

Set s to 0 and the share fixed falls to 8.9 % (near the neutral 10 %), with a mean fixation time of 200 generations against the neutral theory's 190.

## Tips

- Kimura's formula is a diffusion approximation. It is very close when N is in the tens or more and s is small; for tiny N or large s expect small differences.
- The interval shows how much of a gap is just chance: with 1,000 lines, a few percentage points either way is normal. Use more lines for a sharper comparison.
- Try "one new copy" with s = 0.01 and N = 1,000: the chance of fixation is only about 2hs = 1 %, even though the allele is helpful (Haldane's rule of thumb: twice the heterozygote's advantage).

## FAQ

**Why do helpful alleles get lost?** While a new allele has only a few copies, whether those individuals happen to leave offspring matters far more than a small fitness edge.

**What is "4Ns"?** The strength of selection relative to drift. Well below 1, the allele behaves almost neutrally; well above 1, selection dominates.

**Is this N the effective population size?** The model population is ideal, so its effective size equals N. Real populations are usually smaller in effect; see an effective-size calculator to estimate it.

**Is anything sent anywhere?** No. The simulation runs in your browser.
