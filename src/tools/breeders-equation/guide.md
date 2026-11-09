---
name: Breeder's equation calculator
num: 389
shelf: science
section: horticulture-and-plant-breeding
title: "Breeder's equation calculator: response to selection R = h²S, selection intensity, gain per year and heritability"
summary: "Predict the response to selection from heritability and the selection differential, or from the proportion selected (selection intensity) and the phenotypic standard deviation, per generation and per year. Estimate heritability from parent-offspring pairs or from families, lines or clones. Nothing is uploaded."
status: live
ads: false
order: 389
icon: curve
works: offline
updated: 2026-11-09
related: [crossing-plan, sample-size, reliability-analysis, field-trial-designer, yield-trial-anova]
sources:
  - "Breeder's equation, selection intensity for truncation selection, parent-offspring regression and variance-component heritability as in Falconer and Mackay, Introduction to Quantitative Genetics (4th ed.), chapters 10 and 11; n0 for unequal group sizes from the one-way analysis of variance (Snedecor and Cochran)."
  - "Checked against scipy (selection intensity norm.pdf(norm.ppf(1 − p))/p for p from 0.1 % to 90 %; linregress for the regression slope, its standard error and p-value) and statsmodels anova_lm for the unbalanced variance-component example."
  - "The example population, parent-offspring pairs and line heights are made up."
flow:
  - { icon: percent, label: "Select" }
  - { icon: sigma, label: "h² × S" }
  - { icon: curve, label: "Response" }
  - { icon: table, label: "h² data" }
---

## What it does

The breeder's equation predicts how much a population changes in one generation of selection:

**R = h² × S**

R is the response (how far the offspring mean moves), h² the narrow-sense heritability (the share of the variation passed on through additive genes), and S the selection differential (how far the selected parents' mean is above the population mean).

If you know what share of the population you keep rather than S, the tool works S out for you: **S = i × σP**, where σP is the phenotypic standard deviation and i the **selection intensity**. For a trait with a normal distribution and the best proportion p kept, i = φ(z) ÷ p, where z is the point that cuts off the top p and φ is the height of the normal curve there. Keeping the best 10 % gives i = 1.755; keeping 1 % gives 2.665.

The tool also gives the **response per year** (R ÷ the generation interval in years), which is how breeding programmes with different cycle lengths are compared, and, if you give the mean, the new mean and the gain as a percentage.

The second card estimates heritability from your own data:

- **Offspring on parent regression**: the slope b of offspring values on mid-parent values is h²; on one parent, h² = 2b. You get the standard error, a 95 % interval and a p-value.
- **Variance components**: plants measured in groups. For lines or clones the between-group variance is genetic, giving broad-sense H² (on a single-plant and a line-mean basis). Half-sib families give h² = 4σ²f ÷ σ²P; full-sib families give 2σ²f ÷ σ²P, an upper limit.

## How to use it

1. Enter h², and either the proportion selected and σP, or S directly.
2. Pick **Both parents** if you choose plants before they flower and cross only among them; **One parent only** if you choose seed parents after open pollination (the response is halved, because the pollen is unselected).
3. Enter the generation interval and, if you like, the population mean.
4. For heritability, pick a method and paste or open your data. **Use this h² above** copies the estimate into the first card.

## Worked example

Press **Use the example**: h² = 0.4, the best 10 % selected from a made-up population with mean 100 and σP = 8, both parents selected, 2 years per generation. The page shows i = 1.7550, z = 1.282, S = 14.040 and **R = 5.616 per generation**, which is 2.808 per year; the offspring mean is 105.616, a gain of 5.62 %.

The example parent-offspring data (20 made-up mid-parent and offspring plant heights) give a slope of 0.4461 ± 0.1665, so h² = 0.446, with a 95 % interval of 0.096 to 0.796 and p = 0.015. Switch the method to lines or clones and the six made-up inbred lines give H² = 0.844 on a single-plant basis and 0.954 on a line-mean basis.

## FAQ

**Why is my h² above 1?** Sampling error with few families, or groups that are not the relatives you chose. Heritability cannot be above 1; collect more data.

**Does the response stay the same every generation?** Only roughly, over a few generations. Selection uses up variation and changes gene frequencies, and h² is specific to one population and environment.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
