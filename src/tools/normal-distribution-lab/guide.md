---
name: Normal lab
num: 2163
shelf: learn
code: L338
section: school-maths
title: "Normal distribution lab: probabilities, z-scores and inverse normal"
summary: "Set the mean and standard deviation, shade the area you want and read the probability. Also works backwards to find the value for a given probability."
status: live
ads: false
order: 2163
icon: sliders
works: offline
updated: 2026-11-16
related: [distribution-explorer, random-variable, hypothesis-tests, spread-explorer]
sources:
  - "Normal distribution probabilities from the standard normal cumulative function (the same values as printed A-level tables). Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Set" }
  - { icon: curve, label: "Shade" }
  - { icon: check, label: "Check" }
---

## What it does

Many measurements, such as heights, test marks or the mass of packets, follow a bell-shaped normal distribution described by a mean (μ) and a standard deviation (σ). The probability of landing in a range is the area under the curve over that range. This lab draws the curve for any μ and σ, shades the part you choose and gives the probability, the z-score, and the percentage of values in the range.

You can also work backwards: choose a probability and the lab finds the value that has that much of the distribution below it, which is the inverse normal calculation. After this, use [[hypothesis-tests]] to test a claim about a mean, or [[distribution-explorer]] to compare other shapes. [[random-variable]] covers the ideas of expectation and variance behind it.

## How to use it

1. Set the mean and standard deviation.
2. Choose what to shade: below a value, above a value, or between two values.
3. Move the value sliders and read the probability.
4. To work backwards, use the inverse box: type a probability and read off the value.
5. Answer the questions at the bottom.

## What each setting does

- **Mean μ**: the centre of the curve.
- **Standard deviation σ**: how spread out it is. About 68% of values lie within one σ of the mean and 95% within two.
- **Shade**: below a, above a, or between a and b.
- **z-score**: how many standard deviations a value is from the mean, z = (x − μ) ÷ σ.
- **Inverse**: the value x such that P(X < x) equals the probability you give.

## Worked example

Adult heights are modelled as N(170, 8²), a mean of 170 cm and a standard deviation of 8 cm. The probability of a height under 180 cm has z = (180 − 170) ÷ 8 = 1.25 and P = 0.894, so about 89.4% of people are shorter. The probability between 162 and 178 is within one standard deviation each side, about 0.683.

## FAQs

**Why is P(X = a) zero?** A continuous variable can take any value in a range, so the chance of exactly one value is zero. Only ranges have probabilities.

**What does the 68-95-99.7 rule mean?** About 68% of values lie within one standard deviation of the mean, about 95% within two and about 99.7% within three.

**Should I use σ or variance?** N(μ, σ²) is written with the variance, so N(170, 8²) has standard deviation 8. The sliders here use the standard deviation.

**Can I use this in exams?** Check your own exam board's rules for calculators. This is for understanding and practice.
