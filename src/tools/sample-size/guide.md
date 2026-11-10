---
name: Sample size
num: 32
shelf: science
code: T32
section: statistics
title: "Sample size"
summary: "How many subjects, samples or survey responses do you need? Sample size for comparing two means, paired data, two proportions, or a survey's margin of error, with power curves. Matches R and G*Power."
status: live
ads: true
order: 10
icon: sigma
works: offline
updated: 2026-11-08
related: [uncertainty-calculator, plot-maker, dose-response]
sources:
  - "Methods: as in R's power.t.test and power.prop.test."
flow:
  - { icon: sliders, label: "Effect" }
  - { icon: target, label: "α and power" }
  - { icon: chart, label: "n and curve" }
---

## What it does

Too few subjects and a real effect is missed. Too many wastes money and, in animal or patient studies, is unethical. Ethics boards and grant reviewers ask for a power calculation. This tool works out the sample size for the common designs and draws the power curve, so you can show how the answer changes if the effect is smaller or larger than you hoped.

- **Two group means:** an unpaired t test, for example treatment against control.
- **Paired means:** the same subjects before and after, or matched pairs.
- **One mean** against a fixed value.
- **Two proportions:** percentages such as cure rates.
- **Survey:** how many responses give a percentage within a chosen margin of error.

Once the data are in, put error bars on the results with the [[uncertainty-calculator]], and draw them with the [[plot-maker]].

## How to use it

1. Choose what you are comparing.
2. For means, type the **smallest difference worth detecting** and the **standard deviation**, from a pilot study or published data. Their ratio is the effect size d. Cohen's rough guide: 0.2 is small, 0.5 medium and 0.8 large.
3. For proportions, type the expected percentage in each group.
4. Choose the **significance level α** (usually 0.05) and the **power**, the chance of detecting the effect if it is real (0.8 or 0.9).
5. Add the expected **dropout**, so the number recruited still leaves enough at the end.

The **power curves** show power against sample size for your effect, and for effects 25 % smaller and larger.

## The methods

Means use the exact noncentral t distribution for a two-sided test, the same method as R's power.t.test and G*Power. Proportions use the normal approximation of R's power.prop.test. Surveys use n = z²p(1 − p)/E², with the finite population correction when you give a population size. Results are rounded up to whole subjects.

## Worked example

To detect a difference of 5 units when the SD is 10 (d = 0.5), at α = 0.05 with 80 % power, you need 64 per group (63.77 before rounding), as R's power.t.test gives. Comparing 50 % with 75 % at 90 % power needs 77 per group (R: 76.7). A survey with a ±5 % margin at 95 % confidence needs 385 responses. If only 1000 people could answer, 278 are enough.

## Frequently asked questions

**Where do I get the standard deviation?** From a pilot study, earlier work, or published papers in your field. If unsure, use a larger value: it is safer.

**Is my data stored?** No. Nothing is stored or sent anywhere.

Draw your results with the [publication plot maker](/science/plot-maker/).
