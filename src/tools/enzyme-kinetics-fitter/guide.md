---
name: Enzyme kinetics fitter
num: 112
shelf: science
section: biochemistry
title: "Enzyme kinetics fitter: Michaelis–Menten Km and Vmax, inhibition type and Ki"
summary: "Paste substrate concentrations and initial rates, with or without an inhibitor, and fit Michaelis–Menten, substrate inhibition, Hill, or competitive, uncompetitive, non-competitive and mixed inhibition by non-linear least squares. Get Km, Vmax, Ki, kcat and kcat/Km with errors, a model comparison by AICc, and the Lineweaver–Burk, Eadie–Hofstee and Hanes–Woolf values side by side."
status: live
ads: true
order: 1
icon: curve
works: offline
updated: 2026-11-08
related: [reaction-kinetics-fitter, dose-response, calibration-curve, plot-maker]
sources:
  - "Rate equations: the standard Michaelis–Menten, substrate inhibition, Hill and reversible inhibition equations found in any biochemistry textbook."
  - "Model comparison: the small-sample Akaike information criterion (AICc) and Akaike weights, standard statistics."
  - "Example data: simulated by fibub (Vmax 100, Km 20, Ki 10, about 2 % noise)."
flow:
  - { icon: table, label: "Rates" }
  - { icon: curve, label: "Fit" }
  - { icon: sigma, label: "Compare" }
  - { icon: chart, label: "Plots" }
---

## What it does

Enzyme assays measure the initial rate v at a range of substrate concentrations [S]. The rate rises and levels off at **Vmax**. The substrate concentration that gives half of Vmax is **Km**. This tool fits those numbers straight to your rates by non-linear least squares, which is far more reliable than drawing a line through a double-reciprocal plot.

It fits seven models:

- **Michaelis–Menten:** v = Vmax·S / (Km + S).
- **Substrate inhibition:** the rate falls again at high substrate, with a constant Ksi.
- **Hill:** a sigmoid curve for cooperative enzymes, with K₀.₅ and the Hill coefficient h. h above 1 means positive cooperativity.
- **Competitive inhibition:** the inhibitor raises the apparent Km. Vmax is unchanged.
- **Uncompetitive inhibition:** the inhibitor binds only the enzyme–substrate complex, lowering both Vmax and Km.
- **Non-competitive inhibition:** the inhibitor lowers Vmax and leaves Km alone.
- **Mixed inhibition:** two constants, Ki for the free enzyme and Ki′ for the complex.

With a third column for the inhibitor concentration, every inhibitor level is fitted at once (a global fit), so Ki comes from all of your data, not from one line per level.

For ordinary chemical reactions, use the [[reaction-kinetics-fitter]]; for ligand binding with Kd and Bmax, the [[binding-curve-fitter]].

## How to use it

1. Paste two columns (substrate, rate) or three columns (substrate, inhibitor, rate), or open a CSV, TSV or Excel file. A header row is fine.
2. Type your units. They only label the results.
3. Leave the model on **Best supported by the data**, or choose one yourself. The best choice is the simplest model within 2 AICc units of the lowest score, because a model with more values always fits a little better.
4. **Errors** sets the weighting. Choose "about the same % of each rate" if your small rates are measured more precisely than your large ones.
5. Enter the enzyme concentration in the same unit as the substrate to get the turnover number kcat and the catalytic efficiency kcat/Km.

## Worked example

The example is a simulated competitive inhibitor study with Vmax 100 µM/min, Km 20 µM and Ki 10 µM. It has seven substrate levels from 2.5 to 160 µM at 0, 10 and 30 µM inhibitor, with about 2 % noise. The fit picks **competitive inhibition** with Vmax 98.1 ± 0.4 µM/min, Km 19.2 ± 0.2 µM and Ki 9.8 ± 0.2 µM. Mixed inhibition fits almost as well, but its Ki′ comes out at about 1600 µM with a huge error, which says the inhibitor barely binds the complex. That is competitive inhibition. Uncompetitive and non-competitive are ruled out by more than 100 AICc units.

With 0.01 µM enzyme, kcat is about 9800 per minute (164 per second), and kcat/Km is about 8.5 per µM per second.

Using only the rows without inhibitor, the Lineweaver–Burk line gives Vmax 102 and Km 20.8, Eadie–Hofstee 99.1 and 19.8, and Hanes–Woolf 98.7 and 19.6. Lineweaver–Burk drifts furthest, because taking 1/v magnifies the errors of the smallest rates.

## Questions

**My Km has a huge error.** Your substrate range probably stops below Km, or never gets close to it. Aim for concentrations from about 0.2 × Km to 5 × Km. The tool warns when the top substrate is below twice Km.

**Why not just use the Lineweaver–Burk plot?** It is still useful to see the pattern of lines for each inhibitor level. But the reciprocal stretches the least accurate points the most, so its numbers are biased. The fitted values are the ones to report.

**What does the Akaike weight mean?** It is the share of support each model gets from your data, relative to the others in the table. A weight near 100 % means the data clearly favour that model.

**Is anything sent anywhere?** No. Your data stays in your browser, and the page works offline once loaded.
