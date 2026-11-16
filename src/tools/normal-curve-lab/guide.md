---
name: Normal curve lab
num: 2230
shelf: learn
code: L330
section: school-maths
title: "Normal curve lab: z-scores and the 68-95-99.7 rule"
summary: "Set a mean and a standard deviation, slide a value along the bell curve and see its z-score, the share of values below it, and how much of the data lies within 1, 2 and 3 standard deviations."
status: live
ads: false
order: 2230
icon: chart
works: offline
updated: 2026-11-16
related: [spread-explorer, margin-of-error-sim, hypothesis-tests]
sources:
  - "The normal distribution, z-scores and the empirical (68-95-99.7) rule are standard statistics, covered by Common Core HS-S-ID.4. The share below a value uses the normal cumulative distribution from the error function, checked against published tables in tests/sci.mjs. The pictures and examples are fibub's own."
flow:
  - { icon: sliders, label: "Mean, SD" }
  - { icon: pointer, label: "Slide x" }
  - { icon: chart, label: "Shade" }
  - { icon: check, label: "Quiz" }
---

## What it does

Many things pile up in a bell shape: test scores, adult heights, the small errors in a measurement. The **normal curve** describes that shape with just two numbers, the **mean** (the middle) and the **standard deviation** (SD, how spread out the values are). This page draws the curve and lets you move a value x along it. It shows the value's **z-score**, which says how many standard deviations x is above or below the mean, and the share of all values that lie below x.

Switch to the band buttons and the curve shades the part within 1, 2 or 3 SDs of the mean. Whatever mean and SD you pick, about 68%, 95% and 99.7% of values fall in those bands, the famous empirical rule. Once you have played with the shape, [[margin-of-error-sim]] shows how the same curve describes poll results and [[hypothesis-tests]] uses it to judge whether a difference is real.

## How to use it

1. Set the mean and the standard deviation with the first two sliders.
2. Slide x to the value you care about, such as a test score of 85.
3. Read the sentence under the picture for the z-score and the share below.
4. Press "Within 1 SD", "Within 2 SD" or "Within 3 SD" to shade the middle part.
5. Answer the three questions at the bottom. They change each time.

## What each setting does

- **Mean:** where the middle of the bell sits. Moving it slides the whole curve left or right.
- **Standard deviation:** how wide the bell is. A bigger SD makes it wider and flatter.
- **Value x:** the point whose z-score and share below you want.
- **Shade below x / Within k SD:** which area is coloured.

## Worked example

Scores have a mean of 70 and an SD of 10. Set x to 85. The z-score is (85 − 70) ÷ 10 = 1.5, and about 93.3% of scores are below 85. Now press "Within 2 SD": the shaded part runs from 50 to 90 and holds about 95% of scores.

## FAQs

**Is a z-score the same as a percentage?** No. A z-score counts SDs from the mean. The page converts it to the share of values below it.

**Do all data follow a normal curve?** No. Incomes and waiting times are skewed. The rule only works for roughly bell-shaped data.

**Why is the share below the mean exactly 50%?** The curve is symmetric, so half the area lies on each side of the mean.
