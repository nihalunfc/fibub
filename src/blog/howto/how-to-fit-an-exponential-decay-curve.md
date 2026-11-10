---
title: "How to fit an exponential decay curve to data (with a worked example)"
summary: "Fit y = a·exp(−x/t) + c to measured data by least squares, read the time constant with its uncertainty, and check the fit with residuals and chi-square."
tools: [curve-fitter, graph-digitizer, uncertainty-calculator]
updated: 2026-11-10
sources:
  - "Weighted least squares and the chi-square test of fit: standard methods, for example Bevington, P. R. and Robinson, D. K. (2003), Data Reduction and Error Analysis for the Physical Sciences, 3rd edition, McGraw-Hill."
  - "The cooling data in the example are made up for this article."
---

To fit an exponential decay, choose the model y = a·exp(−x/t) + c and let a least-squares fit find the starting height a, the time constant t and the level c that the data settle towards. The [[curve-fitter]] does this in your browser: paste x and y (and the uncertainty in y if you know it), pick **Exponential decay with offset**, and read each parameter with its uncertainty, the chi-square test and a residual plot.

## What you need

- **Pairs of x and y values**, such as time and temperature, or time and counts. Ten or more points along the whole fall work best.
- **The uncertainty in each y value**, if you have it. A thermometer read to ± 0.5 °C, or √N for counted events, are typical. Without it the fit still runs, but the chi-square test is skipped.
- **A rough idea of the shape.** Does the curve level off above zero? Then you need the offset c. Does it head all the way to zero? Then a plain exponential may do.

If your data exist only as a printed graph, read the points off it first with the [[graph-digitizer|graph digitiser]].

## Step by step

1. Paste your data into the **Data** box: one row per point, columns separated by tabs, commas or spaces, with an optional header row. You can also open a CSV, text or Excel file.
2. Check the **x column**, **y column** and **Uncertainty in y** menus. Choose "None (unweighted)" for the last if you have no uncertainties.
3. Pick **Exponential decay with offset** from the **Model** menu. The formula box fills with `a*exp(-x/t) + c`, and the **Starting values** box gets guesses taken from your data. If a fit goes wrong, press **Guess starting values again** or type better ones.
4. Read the parameter table. **Written** gives each parameter rounded with its uncertainty, ready for a report; the last column gives the 95 % interval.
5. Look at the second plot. The residuals (data minus curve, divided by σ when weighted) should scatter without a pattern, mostly between the dashed lines at ± 2.
6. Download the fitted values and residuals as a CSV, or the report as an image, PDF or Word file.

The fit chooses the parameters that make the weighted sum of squared misses as small as possible:

χ² = Σ [(yᵢ − f(xᵢ)) ÷ σᵢ]²

Here f(x) = a·exp(−x/t) + c is the curve and σᵢ is the uncertainty of point i. With t inside the exponential there is no one-step formula, so the tool searches for the minimum (Levenberg-Marquardt) from the guesses. The **reduced chi-square** is χ² divided by the degrees of freedom (number of points minus number of parameters). It is close to 1 when the model fits and the σ values are honest.

## A worked example

A mug of hot water cools on a desk. Its temperature, read every two minutes and then less often, is (made-up numbers, each ± 0.5 °C):

```
time_min  temp_C  sigma
0   81.3  0.5
2   71.4  0.5
4   64.2  0.5
6   57.9  0.5
8   51.5  0.5
10  47.2  0.5
12  42.6  0.5
14  40.1  0.5
16  36.8  0.5
18  34.2  0.5
20  32.6  0.5
24  29.0  0.5
30  26.1  0.5
```

With **Exponential decay with offset**, the fit gives:

- a = 59.95 ± 0.66 °C (how far above the final level the water started)
- t = 11.90 ± 0.34 min, with a 95 % interval of 11.14 to 12.67 min
- c = 21.20 ± 0.71 °C (the level it is heading for: room temperature)
- χ² = 4.63 with 10 degrees of freedom, reduced χ² = 0.463, p = 0.91

The headline calls this consistent with the uncertainties; a reduced chi-square this far below 1 hints that ± 0.5 °C was generous.

Now switch the model to **Straight line**. The reduced chi-square jumps to 142, and the residuals bend in a clear U shape: a line is simply the wrong model. **Exponential** without the offset does better but still gives a reduced chi-square near 30, because it forces the water to cool towards 0 °C.

The correlation table shows t and c at −0.93: a longer time constant with a lower room temperature fits almost as well. Logging for longer would separate them.

## Check your answer

- **Look at the ends.** At x = 0 the curve should be near a + c: 59.95 + 21.20 = 81.15 °C, close to the first reading of 81.3 °C. Far out it should approach c.
- **Use the time constant.** After one t the excess above c falls to 1/e, about 37 %. At 12 min the excess is 42.6 − 21.2 = 21.4 °C, which is 36 % of 59.95 °C. That matches.
- **Half-life.** If you need it, it is t × ln 2 = 11.90 × 0.693 = 8.25 min.
- **Residuals beat R².** All three models above have R² above 0.88. Only the residual plot and chi-square show which one is right.

## Questions people ask

**Why not just take the log and fit a straight line?** That only works when c is zero or known, and taking logs distorts the uncertainties, so the small values near the end get too much weight. A direct nonlinear fit avoids both problems.

**My fit says it "did not settle". What now?** Give starting values near the truth: a as the drop you see, t as the time to fall about two thirds of the way, c as the final level. Then try again.

**How do I carry t into another formula?** Use t = 11.90 ± 0.34 min as an input with standard uncertainty in the [[uncertainty-calculator]]. If the same formula also uses c, remember the two are correlated, which that calculator does not include.
