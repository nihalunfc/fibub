---
title: 'Time series: trend, seasonality and moving averages'
summary: 'Break a daily or monthly KPI into trend, seasonal pattern and noise; smooth it with a moving average of the right length; compare like with like (week over week, year over year); and avoid the traps of autocorrelation.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'Daily sales have a strong weekly pattern. Which moving average shows the trend most cleanly?'
    choices: ['3 days', '7 days', '10 days']
    ans: 1
    why: 'A window of exactly one cycle holds every weekday once, so the weekly pattern cancels out.'
  - q: 'December sales are 40 % above November. What is the fairest comparison to judge growth?'
    choices: ['December vs November', 'December this year vs December last year', 'December vs the yearly average']
    ans: 1
    why: 'Year over year compares the same season, so the holiday pattern cancels and what remains is growth (plus noise).'
  - q: 'Why can a standard t-test mislead on daily KPI data?'
    choices: ['Days are too few', 'Neighbouring days are correlated (autocorrelation), so there is less independent information than the count of days suggests', 'Daily data is always normal']
    ans: 1
    why: 'With autocorrelation, 30 days might carry the information of far fewer independent ones, so standard errors come out too small.'
sources:
  - 'Hyndman, R. J. and Athanasopoulos, G. (2021), Forecasting: Principles and Practice, 3rd edition, OTexts, Chapters 2-3 https://otexts.com/fpp3/'
  - 'NIST/SEMATECH e-Handbook, 6.4 Introduction to Time Series Analysis https://www.itl.nist.gov/div898/handbook/pmc/section4/pmc4.htm'
---

**Module 8 · about 20 minutes · no new maths.** You'll be able to describe a KPI series in terms of trend, seasonality and noise, smooth it properly, and make fair period-to-period comparisons.

<div class="bigidea">A KPI over time is trend plus seasonal pattern plus noise; compare like with like and smooth with a window as long as the pattern.</div>

**In everyday terms:** your heart rate over a day: a slow drift (trend), a daily rhythm (season: low at night, high in the afternoon), and beat-to-beat jitter (noise). Comparing 3 a.m. with 3 p.m. tells you about the rhythm, not about your fitness.

## 1. Three parts of a series

Most business series are a mix of:

- **Trend:** the slow, long-run direction (growth, decline).
- **Seasonality:** a pattern that repeats on a fixed cycle (weekends, months, holidays, hours of the day).
- **Noise:** everything else, day to day.

Plus occasional **events** (a promotion, an outage) and **level shifts** (a price change).

<!--fig:ts-decompose-->

Weekend dots (orange) sit high every week. Set the moving average to 7 and the line rises smoothly with the trend; set it to 5 or 10 and it ripples, because each window holds a different number of weekend days.

## 2. Smoothing

A **moving average** of k periods replaces each point with the mean of the last k. Rules:

- Make k one full **cycle** (7 for daily data with a weekly pattern, 12 for monthly with a yearly pattern).
- A trailing average **lags**: it reacts to a change about k/2 periods late. A centred one doesn't lag but needs future data, so it's for history only.
- **Exponential smoothing** weights recent values more and reacts faster (next lesson).

## 3. Fair comparisons

- **Week over week, same weekday:** this Tuesday vs last Tuesday.
- **Year over year:** this December vs last December. Watch for moving holidays (Easter, Diwali, Black Friday), and compare the same number of weekends.
- **Seasonally adjusted** series remove the typical seasonal effect; most official statistics are published this way.
- **Calendar effects:** months have different numbers of days and weekends; daily averages are fairer than monthly totals.

## 4. Autocorrelation

Tomorrow is usually like today. That **autocorrelation** means 30 daily values hold less independent information than 30 random draws, so standard tests (which assume independence) give intervals that are too narrow. For time-based questions, compare whole weeks, use methods built for time series, or, best of all, run an experiment with a control group running at the same time.

<div class="meaning">

<dl>
<dt>Trend</dt><dd>The slow long-run direction.</dd>
<dt>Seasonality</dt><dd>A pattern that repeats every week, month or year.</dd>
<dt>Moving average of k</dt><dd>Average of the last k points; with k = the season length, the pattern cancels.</dd>
<dt>Year over year</dt><dd>Compare with the same period last year: the season cancels.</dd>
<dt>Physical meaning</dt><dd>A 7-day average contains exactly one of each weekday, so the weekly rhythm cancels out and only trend and noise remain. Day-to-day changes compare different parts of the rhythm and mostly show the rhythm itself.</dd>
</dl>

</div>

<div class="myth">

**"Saturday is up 45 % on Friday: great news."** If every Saturday beats Friday by that much, it is the weekly pattern. Compare with last Saturday, or look at the 7-day average.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The dashboard.</b> "Saturday +45 % vs Friday; Monday −30 % vs Sunday."</div>
<div class="step"><b>Pattern check.</b> Same weekday last week: Saturday +3 %, Monday +2 %.</div>
<div class="step"><b>Smooth.</b> 7-day average: 252 → 260, about +3 %.</div>
<div class="step"><b>Year over year.</b> Same week last year: +11 %.</div>
<div class="step"><b>Report.</b> "Steady growth of about 3 % a week; nothing unusual." Put the 7-day average on the dashboard.</div>
</div>

<div class="problem" data-problem="moving-average"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** averaging over exactly one cycle removes a fixed seasonal pattern, because each seasonal effect appears once and the effects sum to zero.

**Additive model:**

```math
y_t = T_t + S_t + \varepsilon_t, \qquad \sum_{j=1}^{m} S_j = 0
```

**Moving average over one cycle of length m:** `$\frac{1}{m}\sum_{j=0}^{m-1} y_{t-j} \approx T_{t-(m-1)/2} + \text{(noise averaged)}$`, so it shows the trend from half a cycle ago, with noise shrunk by about `$1/\sqrt{m}$`.

**Multiplicative model** `$y_t = T_t \times S_t \times \varepsilon_t$` fits when the seasonal swing grows with the level (December is +40 % whatever the size of the business); take logs to make it additive.
</details>

## 5. Worked example

*Made-up dashboard.* A manager sees "Saturday sales +45 % vs Friday!" and "Monday −30 % vs Sunday!".

- Both are the weekly pattern, not news. Compare with the same weekday last week: Saturday +3 %, Monday +2 %.
- The 7-day average rose from 252 to 260 over the week: about +3 %, matching.
- Year over year (same week last year, same holiday timing): +11 %.
- Report: "Steady growth of about 3 % a week; nothing unusual this week." Put the 7-day average and year-over-year line on the dashboard instead of day-to-day changes.

## 6. Practice

1. Monthly data with a yearly pattern. Moving average length?
2. Why can comparing this Black Friday week with the same calendar week last year mislead?
3. A 7-day trailing average turns down 3 days after a price change. When did the real change happen?

<details>
<summary>Answers</summary>

1. 12 months.
2. Black Friday moves: the same calendar week may include it one year and not the other. Align on the event, not the date.
3. Around the day of the price change or just after; a trailing average lags, and by day 3 only 3 of the 7 days in the window reflect the new price.
</details>

**Try it on your own data:** the [[time-series-analyser]] tool splits your own series into trend, seasonal pattern and remainder and shows its autocorrelation; [[grouped-data-stats]] gives totals and means by weekday or month.

**New words:** *time series*, *trend*, *seasonality*, *moving average*, *lag*, *year over year*, *seasonal adjustment*, *autocorrelation*.

<div class="keypoints">

- Series = trend + seasonality + noise.
- Compare like with like: same weekday, same month last year.
- Moving averages over one full season cancel the pattern.
- Day-to-day changes in seasonal data mostly show the season.

</div>
