---
title: "How to do a meta-analysis: pooling studies, I² and forest plots"
summary: "How fixed-effect and random-effects meta-analysis combine studies, what Q, I², tau² and the prediction interval tell you, and a worked example with four made-up school studies."
tools: [meta-analysis, sample-size, survival-analysis, uncertainty-calculator]
updated: 2026-11-10
sources:
  - "Inverse-variance pooling and the DerSimonian-Laird estimate of tau²: DerSimonian and Laird (1986), Controlled Clinical Trials 7: 177-188."
  - "I² and its rough low, moderate and high bands: Higgins, Thompson, Deeks and Altman (2003), BMJ 327: 557-560. Prediction interval: Higgins, Thompson and Spiegelhalter (2009), JRSS A 172: 137-159."
  - "Egger's regression test: Egger, Davey Smith, Schneider and Minder (1997), BMJ 315: 629-634."
  - "The four school studies in the worked example are made up; the numbers come from the tool's own code."
---

The meta-analysis tool takes the results of several studies that asked the same question and combines them into one overall answer, with a forest plot, a funnel plot and the usual checks on how much the studies disagree. It accepts event counts, group means, or an effect with its standard error or confidence interval, so you can feed it numbers straight from published papers. It is for students, researchers and anyone reading systematic reviews who wants to see where the pooled number comes from. It is for study and teaching, not medical advice. To plan how big your own study should be, use the [[sample-size]] calculator; for studies that report time to an event, start with [[survival-analysis]]; and to see how errors carry through a calculation, open the [[uncertainty-calculator]].

## What it is

Each study gives an **effect** y (for example, a difference in mean scores) and a **variance** v, the square of its standard error (SE). A small variance means a precise study.

The **fixed-effect** model assumes every study measures the same true effect. It weights each study by w = 1 / v and takes the weighted mean:

pooled = Σ w y / Σ w, with SE = 1 / √(Σ w)

The **random-effects** model allows each study's true effect to differ. The spread of those true effects has a variance called **tau²**. Weights become 1 / (v + tau²), which shares weight out more evenly. The tool estimates tau² by DerSimonian-Laird, REML (restricted maximum likelihood) or Paule-Mandel.

To judge disagreement it reports:

- **Q**: the weighted sum of squared distances from the fixed-effect mean. If the studies agree apart from chance, Q is about equal to its degrees of freedom (the number of studies minus 1).
- **I²**: (Q − df) / Q, the share of the spread that is real disagreement rather than chance.
- **Prediction interval**: the range where the true effect of a new, similar study would probably fall. It is wider than the confidence interval whenever tau² is above zero.
- **Egger's test**: a check for a lopsided funnel plot, where small studies show bigger effects than large ones.

## How to use it

1. Pick what each study gives you with the buttons at the top: **Events**, **Means**, **Effect + SE** or **Effect + CI**.
2. Paste your rows into the box, study name first, or load a CSV or Excel file.
3. Set the **Measure** for that input (odds ratio, risk ratio or risk difference for events; mean difference or Hedges' g for means). For Effect + CI, choose the interval level used in the papers and tick the ratio box if the effects are ratios.
4. Under **Model**, choose the **Main result** (random or fixed), the **Between-study variance** method and the **Level**. Edit the labels either side of the line of no effect if you like.
5. Read the pooled result and facts, then the forest plot, funnel plot and study table with each study's weights.
6. Download the table as CSV, or the full report as an image, PDF or Word file.

## A worked example

Four made-up schools tried an after-school reading club. Each reports the mean test score (out of 100) for club pupils and for a comparison group. Choose **Means** with the **Mean difference**:

| School | Club mean, SD, n | Comparison mean, SD, n |
|---|---|---|
| A | 72, 10, 40 | 66, 11, 40 |
| B | 68, 12, 25 | 67, 12, 25 |
| C | 75, 9, 60 | 69, 10, 58 |
| D | 70, 14, 30 | 71, 13, 32 |

**Each study.** School A's difference is 72 − 66 = **6 points**, with variance 10²/40 + 11²/40 = **5.525**, so SE = **2.35 points**. Likewise B is **1 point** (SE 3.39), C is **6 points** (SE 1.75) and D is **−1 point** (SE 3.44).

**Fixed effect.** The weights 1/v give School C the most say (48.0 %), then A (26.7 %), B (12.8 %) and D (12.5 %). The pooled difference is **4.485 points**, 95 % CI **2.105 to 6.866**, p < 0.001.

**Disagreement.** Q = **4.763** on 3 df (p = 0.190), so I² = (4.763 − 3) ÷ 4.763 = **37.0 %**, moderate. DerSimonian-Laird gives tau² = **3.904 points²**.

**Random effects.** With tau² added, the weights even out (C 37.9 %, A 28.1 %, B 17.2 %, D 16.8 %). The pooled difference is **3.963 points**, 95 % CI **0.775 to 7.152**, p = 0.015. The 95 % prediction interval runs from **−7.049 to 14.975 points**: a new school could see anything from a small loss to a big gain.

**Egger's test** gives an intercept of −3.592, p = 0.083, so the tool flags the funnel as lopsided. With only four studies the test is weak, so treat that as a reason to look harder, not as proof of bias.

## Where it is used

- **Medicine and public health.** Systematic reviews pool trials of a treatment into one best estimate.
- **Education.** Reviews of teaching methods combine many small classroom studies, often with Hedges' g because tests differ.
- **Ecology and agriculture.** Field trials from many sites and years are pooled the same way.

## Common mistakes

- **Pooling apples and oranges.** Combine only studies that ask the same question in similar groups, with the same direction of effect.
- **Quoting only the confidence interval.** When I² is not small, report the prediction interval too; it shows what to expect in a new setting.
- **Averaging ratios directly.** Odds and risk ratios must be pooled as logs. Use the ratio measures or tick the ratio box, and the tool does this for you.
- **Reading too much into Egger's test.** With fewer than about 10 studies its p-value is unreliable either way.

## Questions people ask

**Fixed or random effects: which should I report?** Random effects is the usual main choice because real studies differ. Showing the fixed-effect result alongside helps readers see how much the choice matters.

**Why did the random-effects answer move towards the small studies?** Adding tau² to every variance shrinks the gap between big and small studies' weights, so the small ones count for more.
