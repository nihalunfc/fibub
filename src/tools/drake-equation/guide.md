---
name: Drake equation calculator
num: 353
shelf: science
section: astrobiology
title: "Drake equation calculator: ranges for every factor and a Monte Carlo distribution of N"
summary: "Play with the Drake equation, N = R* × fp × ne × fl × fi × fc × L. Give a low and a high value for each factor and see the whole spread of N from up to a million random draws: the median, the 90 % range, the chance N is below 1, and which factor drives the uncertainty. Starting ranges are made-up illustrations, not published estimates."
status: live
ads: true
order: 353
icon: telescope
works: offline
updated: 2026-11-09
related: [habitable-zone-calculator, planet-data-explorer, exoplanet-mass-calculator, radio-telescope-calculator, distribution-explorer, radial-velocity-fitter, transit-light-curve-fitter]
sources:
  - "The equation: F. Drake (1961), as described in many textbooks. Treating each factor as log-uniform over a range follows the general approach of A. Sandberg, E. Drexler and T. Ord (2018), arXiv:1806.02404 (method only; none of their numbers are used). Exact distribution of a sum of independent uniform variables for log₁₀ N. Formulas only; no tables are copied."
  - "Checked in the tests against NumPy: the distribution of log₁₀ N by numerical convolution of the seven uniform densities and by a 2-million-draw Monte Carlo, for all three starting presets."
  - "The three starting presets (very uncertain, hopeful, cautious) are made up for illustration. They are not taken from any published estimate."
flow:
  - { icon: sliders, label: "Ranges" }
  - { icon: calculator, label: "Draw N" }
  - { icon: chart, label: "Spread" }
  - { icon: target, label: "Key factor" }
---

## What it does

The **Drake equation** multiplies seven factors to estimate N, the number of civilisations in our galaxy whose signals we could detect now:

N = R* × fp × ne × fl × fi × fc × L

- **R***: new stars formed in the galaxy per year
- **fp**: share of stars that have planets
- **ne**: planets per planetary system where life could exist
- **fl**: share of those where life actually starts
- **fi**: share of life that becomes intelligent
- **fc**: share of intelligent species that send detectable signals
- **L**: how many years such a civilisation keeps signalling

Nobody knows most of these, some not even to within a factor of a million. So instead of one number per factor, this page takes a **low and a high value** for each, draws every factor at random between them many times, and shows the **whole distribution** of N.

Look at the planets we have already found with the [[planet-data-explorer]], and check which could hold liquid water with the [[habitable-zone-calculator]].

## How to use it

1. **Start from** one of three made-up presets (very uncertain, hopeful, cautious), or type your own. They are illustrations for learning, not anyone's published estimates.
2. For each factor type a **low** and **high** value. Fractions (fp, fl, fi, fc) must be between 0 and 1; type tiny numbers as 1e-9. Set low = high to fix a factor.
3. **Random draws and seed**: more draws give a smoother histogram; the same seed always gives the same draws.

Each draw is **log-uniform**: every factor of ten between low and high is equally likely. That suits factors whose order of magnitude is unknown. The page also gives exact values (from the sum of uniform variables on the log scale) next to the Monte Carlo ones, so you can see the random error.

## What you get

- The middle estimate (each factor at the middle of its range on a log scale), the median N, the range covering 90 % of draws, the chance N is below 1 and the chance it is at least 1,000.
- A histogram of log₁₀ N, and a table showing each factor's **share of the spread**.
- Downloads: the factor table, summary and histogram (CSV), and a report as image, PDF or Word.

## Worked example

With the made-up **very uncertain** preset, 100,000 draws and seed 1, the median is **N = 0.0044**, and 90 % of draws fall between 1.6 × 10⁻⁷ and 130. The chance of fewer than one civilisation is **79.9 %** (exact: 80 %), and the chance of 1,000 or more is 2.11 % (exact: 2.09 %). The mean of log₁₀ N is −2.348 against the exact −2.349. The factor table shows that fl (where life starts, ranging over six factors of ten) causes 42 % of the spread and L 29 %.

Switch to the **hopeful** preset and the median rises to about 1,000, with N below 1 in only 0.023 % of draws.

## Tips

- The middle estimate and the median can differ a lot from the plain average of N, which is dominated by the rare huge draws. That is why the page works on the log scale.
- To see how much a factor matters, fix it (low = high) and watch the spread shrink.
- A wide range on a single factor, such as fl, can make "we are alone" likely even when the other factors look hopeful.

## FAQ

**Are these real estimates?** No. The presets are invented to show how the maths behaves. Use your own ranges, and look up current research for real values.

**Why log-uniform?** When you do not know whether a factor is 0.001 or 0.1, treating each factor of ten as equally likely is a common, simple choice. A plain uniform range would put almost all draws near the top value.

**Is anything sent anywhere?** No. Everything runs in your browser.
