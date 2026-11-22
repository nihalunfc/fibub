---
title: Which distribution fits your data
summary: 'A short guide to picking a distribution from what the data is (a count, a yes/no, a time, money) and checking the fit with a histogram, a Q-Q plot and the mean-variance check, plus what to do when nothing fits.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'On a normal Q-Q plot, the points bend sharply upward at the right end. What does that mean?'
    choices: ['The data is close to normal', 'The data has a long right tail: the biggest values are larger than a normal curve allows', 'There are too few values']
    ans: 1
    why: 'The top data values sit above where a normal would put them, which is the signature of right skew.'
  - q: 'Which is the best first model for the number of support tickets per day?'
    choices: ['Normal', 'Poisson (checking for overdispersion)', 'Log-normal']
    ans: 1
    why: 'It is a count of events in a fixed window, so the Poisson is the natural start; then check whether the variance is much larger than the mean.'
  - q: 'What does a normality test (like Shapiro-Wilk) tend to do on 100,000 rows?'
    choices: ['Always says normal', 'Rejects normality for even tiny, harmless departures', 'Cannot run on that much data']
    ans: 1
    why: 'With huge samples, tests detect trivial departures. Look at the plot and ask whether the departure matters for your question.'
sources:
  - 'NIST/SEMATECH e-Handbook, 1.3.3.24 Normal Probability Plot and 1.3.6 Probability Distributions https://www.itl.nist.gov/div898/handbook/eda/section3/eda36.htm'
  - 'OpenIntro Statistics, 4th edition (Diez, Cetinkaya-Rundel, Barr), Section 4.2 Evaluating the normal approximation https://www.openintro.org/book/os/'
---

**Module 3 · about 20 minutes · no new maths.** You'll be able to pick a sensible distribution from the type of data, check it with plots, and know what to do when nothing fits.

<div class="bigidea">Pick a distribution from what the data is (a yes/no, a count, a time, an amount), then check it against the data with a picture.</div>

**In everyday terms:** a doctor guesses from the symptoms first, then orders a test to check. The type of data is the symptom; the histogram and Q-Q plot are the test.

## 1. Start from what the data is

| The data is... | Try first | Example |
|---|---|---|
| Yes/no per item, counted out of n | Binomial | 37 of 500 visitors bought |
| Count of events in a window | Poisson | Orders per hour |
| Time between events | Exponential | Minutes between calls |
| Money, sizes, durations with a long tail | Log-normal | Order values, claim sizes |
| Measurements, or averages of many things | Normal | Fill weights, daily totals of a busy store |
| Anything, when unsure | No model: use percentiles, the bootstrap (Lesson 4.5) or rank tests (Lesson 6.7) | |

This table gets you a sensible starting point most of the time. Then check.

## 2. Check with pictures

1. **Histogram:** is it symmetric? One peak? A floor at zero? A long tail?
2. **Q-Q plot:** sort the data and plot it against where the same percentiles would fall on the candidate distribution. A straight line means a good fit; curves show where it fails.

<!--fig:qq-plot-->

Reading a normal Q-Q plot:

- **Straight:** normal is fine.
- **Bends up at the right:** long right tail. Try logs or a log-normal.
- **S-shape, steep at both ends:** heavy tails, more extremes than normal. Normal-based risk numbers will be too optimistic.
- **Flattened S:** light tails, values bounded on both sides.
- **Steps:** the data is rounded or discrete.

## 3. Check with numbers

- **Counts:** compare the variance with the mean (Poisson expects them equal).
- **Normal:** about 68 % within 1 SD and 95 % within 2 SD? Mean close to median?
- **Log-normal:** take logs and check those for normality.

Formal tests exist (Shapiro-Wilk, Kolmogorov-Smirnov, chi-square goodness of fit in Lesson 6.5), but with large samples they reject tiny, harmless departures, and with small samples they miss big ones. Use them alongside the plot, never instead of it.

## 4. Does it matter?

Often less than you'd think. Tests on **averages** of large samples are protected by the central limit theorem (Lesson 4.3), so a skewed raw distribution is fine when n is in the hundreds. The shape matters most when you:

- predict **individual** values or tails (risk, service promises, stock-outs);
- have **small** samples;
- care about **extremes** (fraud, outages, big claims).

<div class="meaning">

<dl>
<dt>Yes/no per try</dt><dd>Binomial (Lesson 3.2).</dd>
<dt>Count in a window</dt><dd>Poisson (Lesson 3.3), or a more spread-out count model if variance ≫ mean.</dd>
<dt>Time between events</dt><dd>Exponential (Lesson 3.5).</dd>
<dt>Money, sizes</dt><dd>Log-normal (Lesson 3.5).</dd>
<dt>Averages, sums, measurement error</dt><dd>Normal (Lesson 3.4).</dd>
<dt>Physical meaning</dt><dd>A distribution is a claim about how the data were made. Arrivals that do not know about each other are Poisson; amounts built up by many multiplying factors are log-normal. If the story does not fit the process, the distribution will not fit the data.</dd>
</dl>

</div>

<div class="myth">

**"A formal test said p > 0.05, so the data is normal."** With small samples such tests rarely object; with big ones they object to tiny, harmless differences. A Q-Q plot and the question "does the difference change my answer?" are more useful.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The data.</b> 90 days of "minutes until the first order after opening".</div>
<div class="step"><b>What is it?</b> A waiting time for independent customers: guess exponential.</div>
<div class="step"><b>Picture.</b> Histogram: floor at 0, peak at 3 to 5 minutes, long right tail. Fits the guess.</div>
<div class="step"><b>Numbers.</b> Mean 7.9, median 5.6. An exponential with mean 7.9 has median 0.693 × 7.9 ≈ 5.5. Close. ✓</div>
<div class="step"><b>Q-Q plot.</b> Straight, except two days over 40 minutes: both public holidays. Model ordinary days; report holidays separately.</div>
</div>

<div class="problem" data-problem="dist-mean-variance"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a distribution is a model, and every model is wrong somewhere. The question is whether it is wrong in a way that changes your answer.

**Q-Q plot:** for sorted data `$x_{(1)} \le \cdots \le x_{(n)}$`, plot each `$x_{(i)}$` against the candidate's quantile at `$p_i = (i - 0.5)/n$`, such as `$\Phi^{-1}(p_i)$` for the normal. If the data came from that distribution, the points lie near a straight line.

**In code:** Python `scipy.stats.probplot(x, dist="norm", plot=plt)`; pandas `df["col"].plot.hist()` for the histogram.
</details>

## 5. Worked example

*Made-up numbers.* An analyst has 90 days of "minutes until first order after opening".

- The histogram has a floor at 0, a peak at 3–5 minutes and a tail out to 40: right-skewed.
- Mean 7.9, median 5.6: mean well above median.
- Arrivals are customers walking in independently, so an exponential is a natural guess. Its median would be 0.693 × 7.9 ≈ 5.5, close to the observed 5.6. ✓
- The exponential Q-Q plot is straight except two days at 40+ minutes, both public holidays.

Conclusion: model ordinary days as exponential with mean about 8 minutes, and treat holidays separately. "On a normal day, there's a 1 in 3 chance (`$e^{-8.5/7.9}$` ≈ 0.34) of waiting more than 8.5 minutes for the first order."

## 6. Practice

1. Pick a first distribution for: (a) defects per 100 m of cable, (b) customer lifetime value, (c) how many of 20 sampled invoices have errors.
2. A Q-Q plot against the normal shows an S-shape steep at both ends. Name a business risk this creates.
3. Why might you skip worrying about normality when comparing mean basket value between two groups of 5,000 customers?

<details>
<summary>Answers</summary>

1. (a) Poisson. (b) Log-normal (positive, long tail). (c) Binomial with n = 20.
2. Extremes are more common than normal predicts, so "a 3σ day" (a huge loss, a demand spike) will happen far more often than once in a few years. Stock, cash and staffing buffers set from normal maths will be too small.
3. With thousands per group, the sample means are close to normal whatever the baskets look like (central limit theorem, Lesson 4.3).
</details>

**Try it on your own data:** the [[histogram-builder]] shows the shape of a column, and the [[distribution-explorer]] overlays candidate curves.

**New words:** *Q-Q plot*, *heavy tails*, *goodness of fit*, *normality test*.

<div class="keypoints">

- Start from the data type: yes/no → binomial, count → Poisson, wait → exponential, money → log-normal, averages → normal.
- Check with a histogram and a Q-Q plot (straight line = good fit).
- Quick number checks: Poisson mean ≈ variance; exponential median ≈ 0.69 × mean.
- If nothing fits, use methods that need no distribution: the bootstrap (Lesson 4.5) and rank tests (Lesson 6.7).

</div>
