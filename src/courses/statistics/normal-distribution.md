---
title: The normal distribution and its areas
summary: 'The bell curve: its two numbers μ and σ, the 68-95-99.7 rule, turning any normal value into a z-score and reading probabilities as areas, and why it turns up everywhere averages are taken.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'Daily orders are normal with mean 500 and SD 40. About what share of days have more than 580 orders?'
    choices: ['About 2.5 %', 'About 5 %', 'About 16 %']
    ans: 0
    why: '580 is 2 SDs above the mean. About 95 % of days are within ±2 SD, leaving 5 % outside, half of it above: about 2.5 %.'
  - q: 'What z-values hold exactly the middle 95 % of a normal distribution?'
    choices: ['±1.645', '±1.96', '±2.58']
    ans: 1
    why: '±1.96 holds 95 %. ±1.645 holds 90 % and ±2.58 holds 99 %. These three numbers come back in every confidence interval.'
  - q: 'Why is the normal distribution so common in statistics?'
    choices: ['Most raw business data is normal', 'Averages and totals of many independent pieces tend to be normal, whatever the pieces look like', 'It is the easiest curve to draw']
    ans: 1
    why: 'Raw data is often skewed. But sums and averages of many independent values become normal (the central limit theorem, Lesson 4.3), and tests are about averages.'
---

**Module 3 · about 25 minutes · school maths.** You'll be able to use the 68-95-99.7 rule, convert values to z-scores and read normal probabilities, and find a value for a given percentile.

## 1. The bell curve

The **normal distribution** is the symmetric bell-shaped curve set by two numbers: its mean `$\mu$` (the centre) and standard deviation `$\sigma$` (the width). Written `$X \sim N(\mu, \sigma^2)$`. Its density is

```math
f(x) = \frac{1}{\sigma\sqrt{2\pi}}\, e^{-\frac{(x-\mu)^2}{2\sigma^2}}
```

You'll never need to compute that by hand. What matters is that every normal curve is the same shape, just shifted and stretched, so one table (or one spreadsheet function) of areas serves them all.

## 2. The 68-95-99.7 rule

For any normal distribution:

- about **68 %** of values lie within 1σ of the mean,
- about **95 %** within 2σ (exactly 95 % within 1.96σ),
- about **99.7 %** within 3σ.

<!--fig:normal-area-->

So with daily orders N(500, 40²): two days in three see 460 to 540 orders; one day in 20 falls outside 420 to 580; a day below 380 should happen about once in 2 years.

## 3. Any normal → the standard normal

Convert a value to a z-score (Lesson 1.5):

```math
z = \frac{x - \mu}{\sigma}
```

`$Z$` follows the **standard normal**, N(0, 1). Now any question becomes "area under the standard normal curve":

- **P(X ≤ x)**: area to the left of z. Excel `NORM.S.DIST(z, TRUE)`; Python `scipy.stats.norm.cdf(z)`.
- **The value for a percentile**: find the z with that area to its left (`NORM.S.INV(p)`, `norm.ppf(p)`), then `$x = \mu + z\sigma$`.

Key z-values worth knowing: 1.282 (90th percentile), 1.645 (95th), 1.96 (97.5th), 2.326 (99th).

## 4. Where the normal fits, and where it doesn't

It fits measurement errors, heights, many quality measurements and, most importantly, **averages and totals of many independent values** (Lesson 4.3). Daily totals of a busy shop are often close to normal even though single baskets are skewed.

It fits badly for: money per customer (long right tail, Lesson 3.5), small counts (use the binomial or Poisson), anything with a hard limit nearby, and data with fat tails (big moves far more often than "3σ is rare" suggests). Lesson 3.6 shows how to check.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** every normal curve is the standard normal shifted by `$\mu$` and stretched by `$\sigma$`, so probabilities depend only on the z-score.

**Equations:** `$z = (x - \mu)/\sigma$`; `$P(a \le X \le b) = \Phi\!\left(\frac{b-\mu}{\sigma}\right) - \Phi\!\left(\frac{a-\mu}{\sigma}\right)$`, where `$\Phi$` is the standard normal CDF. Inverse: `$x_p = \mu + z_p\,\sigma$`.

**Analogy:** like converting every currency to dollars before comparing prices: convert every normal to z, then use one table.
</details>

## 5. Worked example

*Made-up numbers.* A packing line fills bags labelled 500 g. Fill weights are normal with μ = 505 g and σ = 4 g.

- **Underweight bags (below 500 g):** z = (500 − 505) ÷ 4 = −1.25. Area left of −1.25 ≈ **10.6 %**. One bag in ten is underweight.
- **To get underweight below 1 %:** need 500 g to sit at z = −2.326. So μ = 500 + 2.326 × 4 ≈ **509.3 g**. Either raise the target by about 4.3 g (giving away product) or reduce σ (better machines).
- **Middle 95 % of bags:** 505 ± 1.96 × 4 = **497.2 g to 512.8 g**.

This trade-off, shift the mean or cut the spread, is the heart of quality control (Lesson 8.6).

## 6. Practice

1. Test scores are N(70, 10²). What share score above 85?
2. Same scores: what score marks the top 10 %?
3. Call lengths are N(6, 1.5²) minutes. What share are between 4.5 and 7.5 minutes?

<details>
<summary>Answers</summary>

1. z = 1.5; area right of 1.5 ≈ 6.7 %.
2. z = 1.282; 70 + 12.82 ≈ 82.8.
3. That's ±1σ: about 68 %.
</details>

**Try it on your own data:** the [[normal-curve-lab]] and [[normal-distribution-lab]] shade any normal probability; the [[distribution-explorer]] compares the normal with other curves.

**New words:** *normal distribution*, *standard normal*, *68-95-99.7 rule*, *Φ (normal CDF)*, *inverse normal*.
