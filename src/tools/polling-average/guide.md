---
name: Polling average
num: 753
shelf: science
section: political-science
title: "Poll average and margin of error calculator, with lead MoE and trend line (free)"
summary: "Paste opinion polls and get a weighted average by sample size and recency, the margin of error of every poll and of the lead between two parties, and a LOESS or exponential trend with a sampling band, plus a plain account of what the margin of error leaves out."
status: live
ads: true
order: 753
icon: chart
works: offline
updated: 2026-11-09
related: [sample-size, trend-analyser, uncertainty-calculator, plot-maker, voting-systems, power-indices, survey-weighting, time-series-analyser]
sources:
  - "Formulas only: binomial and multinomial sampling variance, Kish design effect, Cleveland (1979) LOESS. Example polls are made up."
flow:
  - { icon: table, label: "Paste polls" }
  - { icon: sliders, label: "Weights" }
  - { icon: chart, label: "Trend" }
  - { icon: download, label: "Report" }
---

## What it does

Single polls bounce around. This tool pools them. Paste a table of polls and it gives you:

- a **weighted average** for each party on any date, where each poll counts by its sample size (or √n, or equally) and fades with age by a **half-life** you choose;
- the **margin of error (MoE)** of every poll at 50 %, and the MoE of the **lead** between two parties in the same poll, which is close to twice as wide as the MoE of one share;
- a **trend line** through the polls, either LOESS (a straight line fitted around each day) or an exponential average, with a dashed band for sampling error;
- a short explanation of what the MoE covers and, more importantly, what it does not.

Nothing is uploaded; the page works offline.

Weight a poll's sample to the population with [[survey-weighting]], and see how the votes turn into a winner with [[voting-systems|voting systems compared]].

## How to use it

1. Paste a table with a header row: **Date** (YYYY-MM-DD), an optional **Pollster**, **n** (sample size), then one column per party with its share in % (fractions work too). You can also open a CSV or Excel file.
2. Choose how polls are weighted and the **half-life** in days. With 14, a two-week-old poll counts half as much as a new one; 0 turns fading off.
3. Pick the **trend** and, for LOESS, its **span** (the share of polls each point looks at; larger is smoother).
4. Set the **confidence level** and the **design effect**: 1 for a simple random sample, more if the pollster's weighting inflates variance.
5. Choose the two parties for the **lead**. Polls whose lead is larger than its own MoE are shown in bold.
6. Download the daily trend and the poll table as CSV, or the report as an image, PDF or Word file.

## The formulas

- MoE of one share: z·√(deff·p(1 − p)/n). At p = 50 %, n = 1,000 and 95 %, that is ± 3.1 points.
- MoE of a lead within one poll: z·√(deff·(p₁ + p₂ − (p₁ − p₂)²)/n), because the two shares come from the same people and move in opposite directions.
- Weighted average: Σ wᵢpᵢ / Σ wᵢ with wᵢ = (size weight) × 0.5^(age ÷ half-life). Its standard error is √(Σ wᵢ²·deff·p(1 − p)/nᵢ) / Σ wᵢ.
- LOESS: weighted least squares line with tricube weights (1 − u³)³ × poll weights; its band uses the same sampling variances.

## Worked example

The made-up example has 12 polls from three made-up pollsters between 6 January and 24 March 2026. Weighted by n with a 14-day half-life, the average on 24 March is Party A 34.0 % (± 1.1), Party B 36.7 % (± 1.2), Party C 16.3 % and Others 13.1 %, so **Party B leads Party A by 2.7 points (± 2.0)**. The last poll alone (n = 1,100) has a headline MoE of ± 3.0 points and a lead MoE of ± 5.0, so its 5-point lead is only just outside its margin. Only 2 of the 12 polls show a lead outside their own margin, yet the trend shows a clear swing from A to B.

## Frequently asked questions

**Why is the average's band so narrow?** It pools thousands of interviews, so pure sampling error is small. But polls share biases (who answers, how they are weighted) that pooling does not remove. Treat the band as a lower limit on the real uncertainty.

**What is the "effective number of polls"?** (Σw)² / Σw²: how many equally weighted polls the average is worth after fading and size weighting.

**Can it correct for house effects?** No. A pollster that always leans one way shifts the average by its share of the weight; you can see this by comparing pollsters in the table.
