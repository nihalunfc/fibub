---
name: Drug synergy
num: 472
shelf: science
code: T323
section: pharmacology
title: "Drug synergy"
summary: "Paste a checkerboard dose matrix of % inhibition for two drugs. Get the excess over Bliss independence, the highest single agent and Loewe additivity as heatmaps, single-drug Hill fits, the Chou-Talalay combination index for every well and summary synergy scores."
status: live
ads: false
order: 12
icon: chart
works: offline
updated: 2026-11-09
related: [dose-response, nca-pk, pk-simulator, binding-curve-fitter, enzyme-kinetics-fitter, lc50-probit, plot-maker]
sources:
  - "Bliss independence: C. I. Bliss, Ann. Appl. Biol. 26 (1939) 585. Loewe additivity: S. Loewe and H. Muischnek, Arch. Exp. Pathol. Pharmakol. 114 (1926) 313. Combination index: T.-C. Chou and P. Talalay, Adv. Enzyme Regul. 22 (1984) 27; M. C. Berenbaum, Pharmacol. Rev. 41 (1989) 93. Single-drug wells for Bliss and HSA as in SynergyFinder: A. Ianevski et al., Bioinformatics 33 (2017) 2413. Formulas only; no data or tables copied."
  - "Calculations written by fibub. Checked in the tests against an independent Python implementation (SciPy curve_fit Hill fits with several starts, brentq for the Loewe surface) on the example and 20 random matrices: Hill parameters agree to 3 × 10⁻⁵, every well to 3 × 10⁻⁴ % points; also against sham combinations (a drug with itself gives CI = 1)."
  - "The example matrix is made up."
flow:
  - { icon: table, label: "Matrix" }
  - { icon: curve, label: "Hill fits" }
  - { icon: chart, label: "Heatmap" }
  - { icon: target, label: "Scores" }
---

## What it does

When two drugs are given together, the combined effect can be more than expected (**synergy**), about as expected (**additivity**) or less (**antagonism**). "Expected" needs a reference model, and the field uses several. This page takes a checkerboard experiment (a dose matrix of two drugs, each well's response as % inhibition) and compares every combination well with three reference models, draws the differences as a heatmap and gives summary scores.

It is for study and teaching, not medical advice. It analyses data from an experiment; it does not suggest doses.

Fit each drug's own curve first with the [[dose-response|dose-response fitter]], and measure how each binds its target with the [[binding-curve-fitter|binding curve fitter]].

## How to use it

1. **Paste the matrix.** The first row holds drug B's doses after a corner cell; each following row starts with a drug A dose, then the responses at each drug B dose. Both drugs need a dose of 0, so the matrix includes each drug alone. Up to 20 × 20 wells. Or use **Open a file**.
2. Responses must be **% inhibition**: 0 means no effect and 100 a full effect. If you measured viability, use 100 − % viability.
3. Name the drugs and their **units** for the labels.
4. Choose the **top of the single-drug curves**. *Fixed at 100 %* is the median-effect model of Chou and Talalay. *Fitted* lets each drug level off lower; if a curve does not level off within your doses, the top is set back to 100 % and the page says so.
5. Pick the **heatmap**: excess over Bliss, HSA or Loewe, the combination index (CI), or the observed matrix.

## The models

- **Bliss independence**: the drugs act independently, so the expected inhibition is EA + EB − EA·EB, using the measured single-drug wells.
- **Highest single agent (HSA)**: the combination should beat the better of the two drugs alone at those doses.
- **Loewe additivity**: each drug behaves like a dilution of the other. The expected effect E solves a / DxA(E) + b / DxB(E) = 1, where DxA and DxB come from Hill curves fitted to each drug alone: E = top × dʰ / (EC50ʰ + dʰ).
- **Combination index**: CI = a / DxA + b / DxB at the observed effect. Below 1 is synergy, 1 additivity, above 1 antagonism. It is not defined when the observed effect is beyond a curve's top.

The **excess** of a well is observed − expected in % points. Scores are averaged over the combination wells (both doses above 0); the CI summary is a geometric mean.

## Worked example

The example is a made-up 6 × 6 matrix. With the top fixed at 100 %, drug A's curve has an EC50 of **0.8164 µM** (Hill slope 1.20) and drug B's **13.34 nM** (slope 0.884). The page shows a **mean excess over Bliss of +2.31** (highest **+6.23** at 0.3 µM and 1 nM), a mean HSA excess of +9.20, a mean **Loewe excess of +5.28** and a **combination index of 0.643**, with 22 of the 24 wells below 0.9. In the well at 0.3 µM and 3 nM the observed inhibition is 43.8 %, Bliss expects 39.5 % and Loewe 36.6 %, and the CI is 0.75. So the drugs look mildly synergistic by Loewe and CI, and close to additive by Bliss.

## Tips

- The models answer different questions and often disagree, as here. Report which one you used.
- Use replicate plates and average them before pasting; a single noisy well can make a strong-looking spot.
- Doses should bracket each drug's EC50 so the single-drug curves are well defined.

## FAQ

**Is ZIP included?** Not yet; Bliss, HSA, Loewe and CI are.

**Why are the single-drug wells 0 on the Bliss map?** Bliss uses them as its reference, so they match by definition.

**Is my data uploaded?** No. Everything runs in this page.
