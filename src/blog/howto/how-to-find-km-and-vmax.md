---
title: "How to find Km and Vmax from a Michaelis-Menten plot"
summary: "Fit the curve v = Vmax·S / (Km + S) straight to your initial rates instead of reading it off a Lineweaver-Burk line. A worked example with seven substrate levels."
tools: [enzyme-kinetics-fitter, reaction-kinetics-fitter, plot-maker]
updated: 2026-11-10
sources:
  - "Michaelis-Menten equation and the Lineweaver-Burk, Eadie-Hofstee and Hanes-Woolf rearrangements: standard enzyme kinetics, in any biochemistry textbook."
  - "Worked example rates: made up for this article."
---

Vmax is the plateau your initial rates level off at, and Km is the substrate concentration that gives half of that plateau. The most reliable way to get both is to fit the Michaelis-Menten curve directly to your rates by least squares, which the [[enzyme-kinetics-fitter]] does as soon as you paste two columns.

## What you need

- **Initial rates.** For each substrate concentration [S], the rate v from the early, straight part of the progress curve, minus the no-enzyme blank.
- **At least five or six substrate levels**, spread from well below Km to several times above it. If you have no idea where Km lies, space them by factors of 2 (5, 10, 25, 50, 100, 200 and so on).
- **Consistent units**, such as µM and µM/min.
- **Optional: the enzyme concentration**, in the same unit as [S], if you also want the turnover number kcat.

## Step by step

The model behind the curve is the Michaelis-Menten equation:

**v = Vmax × [S] / (Km + [S])**

Here v is the initial rate, [S] the substrate concentration, Vmax the rate when every enzyme molecule is busy, and Km the [S] where v is exactly Vmax ÷ 2. A small Km means the enzyme reaches half speed at low substrate.

The curve only approaches Vmax and never touches it, so reading it by eye is guesswork. Straight-line versions (1/v against 1/[S]) blow up the errors in your smallest rates; a non-linear fit keeps each rate on its own scale.

With the tool:

1. Paste your data into the **Initial rates** box: substrate in the first column, rate in the second. A header line is fine, or open a CSV, TSV or Excel file.
2. Set the **Concentration unit** and **Rate unit** boxes to match your data.
3. Leave **Model** on "Best supported by the data (AICc)". It fits Michaelis-Menten, substrate inhibition and Hill, and keeps the simplest one that fits about as well as the best.
4. Under **Errors**, pick "About the same % of each rate" if bigger rates carry bigger errors.
5. Type the enzyme concentration if you know it, or clear the box.
6. Read the fitted values with standard errors, the curve, and the "Compare models" and "Straight-line plots" tables.

## A worked example

An assay of a dehydrogenase at seven substrate levels gives these initial rates (made-up numbers):

| [S] (µM) | 5 | 10 | 25 | 50 | 100 | 200 | 400 |
|---|---|---|---|---|---|---|---|
| v (µM/min) | 0.42 | 0.79 | 1.52 | 2.18 | 2.91 | 3.42 | 3.66 |

Pasted into the fitter with µM and µM/min, the page picks **Michaelis-Menten** and reports **Vmax 4.09 ± 0.039 µM/min** and **Km 42.3 ± 1.3 µM**, with R² 0.9994.

The model table explains that choice. Substrate inhibition scores 1.5 AICc units worse, so the data cannot really tell the two apart, and the page takes the one with fewer values. Its inhibition constant comes out near 8,000 µM, far above the range, so there is no real inhibition. The Hill fit gives a Hill coefficient of 1.02, essentially 1, so there is no sign of cooperativity either.

The straight-line table shows how the classic plots compare on the same rates:

- Lineweaver-Burk: Vmax 4.22, Km 44.9
- Eadie-Hofstee: Vmax 4.11, Km 43.0
- Hanes-Woolf: Vmax 4.06, Km 41.5

Lineweaver-Burk already drifts furthest from the fit, and the gap grows with noisier low-substrate rates.

With 0.005 µM enzyme in the box, kcat is 4.09 ÷ 0.005 = about **819 per minute**, and kcat/Km is about 19.4 per µM per minute, which the page also gives as 0.323 per µM per second.

## Check your answer

- **Half of Vmax should fall near Km.** Put [S] = 42.3 µM into the equation: 4.09 × 42.3 ÷ 84.6 = 2.05 µM/min, which sits between the measured rates at 25 and 50 µM. Good.
- **The top rate should be below Vmax.** At 400 µM the curve predicts 4.09 × 400 ÷ 442.3 = 3.70 µM/min; you measured 3.66. A measured rate well above the fitted Vmax means a bad point or the wrong model.
- **Your range should bracket Km.** Here the lowest [S] is about 0.12 × Km and the highest about 9 × Km, which pins down both values. If your top concentration is below about 2 × Km, the page adds a warning because Vmax and Km then trade off against each other.

To make a figure for a report, export the rates and fitted curve to the [[plot-maker]]. For a plain chemical reaction rather than an enzyme, use the [[reaction-kinetics-fitter]] to get the rate order and rate constant instead.

## Questions people ask

**Can Km be read straight off my graph?** Roughly. Estimate the plateau, halve it, and read across to the curve and down to the x axis. The answer depends on where you think the plateau is, so the fitted value is the one to report.

**Why do my Vmax and Km have such large errors?** Usually the substrate range is too narrow. Rates that all sit on the steep early part, or all on the plateau, cannot separate the two values. Add concentrations on the side that is missing.

**Does Km measure how tightly the substrate binds?** Only when the chemical step is much slower than unbinding. Otherwise it is an apparent constant for your pH, temperature and buffer, so quote those with it.
