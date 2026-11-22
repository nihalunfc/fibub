---
title: Confidence intervals for a mean
summary: 'Turn a sample mean into a range for the true mean: estimate ± multiplier × standard error. Why small samples use the t distribution instead of 1.96, how to compute and report an interval, and what makes it narrower.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'A sample of 25 deliveries has mean 32 minutes and s = 10. Which is the 95 % interval? (t for 24 degrees of freedom is 2.064)'
    choices: ['32 ± 1.96', '32 ± 4.13', '32 ± 20.6']
    ans: 1
    why: 'SE = 10 ÷ √25 = 2. Margin = 2.064 × 2 ≈ 4.13. Interval about 27.9 to 36.1 minutes.'
  - q: 'Why use t instead of z (1.96) for small samples?'
    choices: ['t is easier to look up', 'Because s is only an estimate of σ, which adds uncertainty, so the multiplier must be a bit bigger', 'Because small samples are biased']
    ans: 1
    why: 'With few values, s itself wobbles. The t distribution has fatter tails to allow for that. With large n, t and z are almost the same.'
  - q: 'Which change makes a confidence interval narrower?'
    choices: ['Raising the confidence level from 95 % to 99 %', 'Collecting more data', 'Using the sample SD instead of the population SD']
    ans: 1
    why: 'More data shrinks the standard error. A higher confidence level makes the interval wider, not narrower.'
---

**Module 5 · about 25 minutes · school maths.** You'll be able to compute a t confidence interval for a mean, explain where its parts come from, and report it clearly.

## 1. From a number to a range

"Average delivery time is 32 minutes" sounds precise, but it came from one sample. A **confidence interval (CI)** says how far the truth could reasonably be from it: "32 minutes (95 % CI 28 to 36)". Every CI has the same shape:

```math
\text{estimate} \;\pm\; \text{multiplier} \times \text{standard error}
```

The **margin of error** is the part after the ±.

## 2. The interval for a mean

From Lesson 4.3, `$\bar{x}$` is roughly normal around `$\mu$` with SE `$s/\sqrt{n}$`. About 95 % of the time it lands within 1.96 SEs of `$\mu$`, so `$\mu$` is within 1.96 SEs of `$\bar{x}$`. One correction: we used `$s$`, an estimate, in place of `$\sigma$`. For that, use **Student's t distribution** with `$n - 1$` **degrees of freedom**:

```math
\bar{x} \;\pm\; t_{n-1} \times \frac{s}{\sqrt{n}}
```

The t multiplier is bigger than 1.96 for small samples and settles to 1.96 as `$n$` grows:

| n | 5 | 10 | 20 | 30 | 60 | 120 | ∞ |
|---|---|---|---|---|---|---|---|
| t for 95 % | 2.776 | 2.262 | 2.093 | 2.045 | 2.001 | 1.980 | 1.960 |

<!--fig:ci-mean-->

Move n and the level. Three things set the width: **spread** (s), **sample size** (n, through √n) and **confidence level** (the multiplier).

## 3. Reporting

- Give the estimate, the interval and the level: "Mean 32.4 min (95 % CI 28.3 to 36.5, n = 25)."
- Round sensibly: an interval of ±4 doesn't need two decimals.
- For skewed data, consider a CI for the median via the bootstrap (Lesson 4.5), or work on log values.
- Assumptions: a random (or at least representative) sample of independent values; with small n, data that isn't wildly skewed.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a CI inverts the sampling distribution. If the estimate is usually within k SEs of the truth, then the truth is usually within k SEs of the estimate.

**Equations:** `$\bar{x} \pm t_{\alpha/2,\,n-1}\, s/\sqrt{n}$`. For 90 %, 95 % and 99 % with large n: multipliers 1.645, 1.96, 2.576.

**In code:** Excel `=CONFIDENCE.T(0.05, s, n)` gives the margin; Python `scipy.stats.t.interval(0.95, n-1, loc=xbar, scale=s/np.sqrt(n))`.

**Why "degrees of freedom" n − 1:** once the mean is fixed, only n − 1 values are free to vary; the last is decided. The same n − 1 as in the sample SD.
</details>

## 4. Worked example

*Made-up numbers.* 12 stores tried a new display. Weekly sales lift (%): 4.1, −1.2, 6.3, 2.8, 3.5, 0.4, 5.9, 2.2, −0.6, 3.8, 4.4, 1.6.

- n = 12, mean `$\bar{x}$` = 33.2 ÷ 12 ≈ **2.77 %**.
- Sample SD s ≈ **2.39 %** (from the squared gaps; a spreadsheet does this in one step).
- SE = 2.39 ÷ √12 ≈ 2.39 ÷ 3.464 ≈ **0.69 %**.
- t for 11 degrees of freedom, 95 %: **2.201**.
- Margin = 2.201 × 0.69 ≈ **1.52**. CI: 2.77 ± 1.52 = **1.25 % to 4.28 %**.

Report: "The display lifted weekly sales by about 2.8 % (95 % CI 1.2 % to 4.3 %, 12 stores)." The interval is entirely above 0, so a real lift is likely, though it could be as small as 1.2 %. (Were stores randomly chosen? If managers volunteered, Lesson 4.2 applies.)

## 5. Practice

1. n = 100, mean 50, s = 20. Find the 95 % CI (use 1.98).
2. Same data, 99 % CI (use 2.63). Wider or narrower?
3. How many values would halve the width of the interval in question 1?

<details>
<summary>Answers</summary>

1. SE = 2; margin 3.96; CI 46.0 to 54.0.
2. Margin 5.26; CI 44.7 to 55.3. Wider: more confidence costs width.
3. About 400 (four times as many).
</details>

**Try it on your own data:** the [[hypothesis-tests]] tool gives t intervals for a column of numbers; the [[bootstrap-permutation]] tool gives bootstrap intervals for skewed data.

**New words:** *confidence interval*, *margin of error*, *confidence level*, *Student's t distribution*, *degrees of freedom*.
