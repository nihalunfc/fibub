---
title: "Acute:chronic workload ratio and injury risk in pro soccer: GPS running loads by ROC"
summary: "A 2025 study of 40 Greek professional footballers found that weekly load ratios for 15-20 km/h running and sprinting separated injured from uninjured players best. Here is how to test a load ratio with a ROC curve."
tools: [roc-curve, training-load]
updated: 2026-11-10
sources:
  - "Fousekis A, Fousekis K, Fousekis G et al. (2025), Week-by-Week Predictive Value of External Load Ratios on Injury Risk in Professional Soccer: A Logistic Regression and ROC Curve Analysis Approach, Medicina 61(11): 1954. Open access under a CC BY licence, as stated on the publisher's article page, checked 2026-11-10."
  - "Gabbett TJ (2016), The training-injury prevention paradox, Br J Sports Med 50: 273-280 (acute:chronic workload ratio)."
  - "DeLong ER, DeLong DM, Clarke-Pearson DL (1988), Biometrics 44: 837-845 (comparing areas under ROC curves)."
paper:
  title: "Week-by-Week Predictive Value of External Load Ratios on Injury Risk in Professional Soccer: A Logistic Regression and ROC Curve Analysis Approach"
  authors: "Fousekis A, Fousekis K, Fousekis G, Bizas G, Vino S, Paraskevopoulos G, Gounelas G, Konomaras P, Michailidis Y, Stafylidis A, Mandroukas A, Koutlianos N, Gavriilidis I, Metaxas T"
  journal: "Medicina"
  year: 2025
  doi: "10.3390/medicina61111954"
  url: "https://www.mdpi.com/1648-9144/61/11/1954"
  licence: "CC BY"
  reviewed: true
---

Footballers often get hurt when their running load jumps suddenly compared with what they are used to. A 2025 study in *Medicina* followed professional players in Greece and asked which kind of running, measured by GPS, best flags that risk in the weeks before a non-contact injury. Ratios built from running at 15 to 20 km/h and from sprinting did best, while total distance did poorly. The [[roc-curve]] tool lets you test any such ratio in the same way, and the [[training-load]] tracker works out the ratio day by day from session ratings if you have no GPS.

## What they found

The acute:chronic workload ratio (ACWR) divides a player's load this week (acute) by their usual weekly load over the weeks before (chronic). A value of 1.0 means "the same as usual"; 1.5 means 50% more.

Of six GPS measures tested in each of the four weeks before injury, the ratio for distance covered at 15 to 20 km/h was the strongest marker. Three weeks before injury it reached an area under the ROC curve (AUC) of about 0.81. The AUC is the chance that a randomly chosen injured player had a higher ratio than a randomly chosen uninjured one, so 0.5 is a coin toss and 1.0 is perfect. The sprint ratio (above 25 km/h) was useful in all four weeks, with AUCs of about 0.71 to 0.76. Ratios for accelerations and decelerations looked promising at first but did not survive a correction for testing many models at once. Total distance was weak.

## Why it matters

Clubs collect huge amounts of GPS data. If the faster running bands carry more warning than total distance, staff can watch a few lines instead of dozens. The study also shows the warning signs may appear weeks ahead, not only in the injury week itself, which gives time to adjust training.

## How they did it

The team compared 20 players who had a non-contact, time-loss injury (one that cost at least one session or match, confirmed by the team doctor) with 20 uninjured players matched by position and point in the season. The players were young professionals, about 21 years old on average, from the top two Greek leagues. They wore 10 Hz GPS units in training and matches.

For each player and each of the four weeks before injury, the authors worked out load ratios for total distance, three speed bands, accelerations and decelerations. They fitted 24 logistic regression models (six measures by four weeks), corrected for multiple testing with the false discovery rate, then used ROC curves to see how well each ratio separated injured from uninjured players. Models adjusted for age and position gave the same picture for the two leading measures.

## Check it yourself with fibub

The twelve players below are **our own invented numbers**, not the paper's data. For each we made up sprint distance (metres) and total distance (km) for three ordinary weeks and one test week, then worked out ratio = test week ÷ average of the three weeks before. For example, player 1 sprinted 180, 200 and 190 m, an average of 190 m, then 310 m: 310 ÷ 190 = 1.63.

1. Open the ROC curve tool and paste one row per player: outcome (1 = injured, 0 = not), sprint ratio, total distance ratio.

```
Injured	Sprint ACWR	Distance ACWR
1	1.63	1.13
1	1.56	1.13
1	1.45	1.04
1	1.42	1.19
1	1.10	0.92
1	1.50	1.00
0	1.02	1.08
0	1.06	1.09
0	1.18	1.05
0	0.91	1.12
0	1.28	0.96
0	0.93	1.13
```

2. Set *Has the condition* to 1 and keep *Higher values*, since a bigger jump in load is the suspected risk.
3. Read the sprint ratio: AUC **0.944** (95% interval 0.816 to 1.000). The Youden cut-off, the point that gives the best sensitivity plus specificity, is a ratio of **1.42 or more**. It catches 5 of the 6 injured players (sensitivity 0.833) and none of the uninjured ones (specificity 1.000).
4. Read the distance ratio: AUC **0.528**, with an interval from 0.136 to 0.920 that spans 0.5. In this made-up squad, total distance tells you almost nothing.
5. Look at the paired comparison of the two markers: the difference in AUC is **0.417** (95% interval 0.047 to 0.787, p = 0.027). With only twelve players the intervals are wide, which is exactly why a real study needs many more injuries.

If your team logs sessions by rating rather than GPS, enter each session's minutes and RPE (rating of perceived effort, 0 to 10) in the training load tracker. It gives a daily ACWR on rolling 7- and 28-day windows and an EWMA version (an exponentially weighted moving average, which counts recent days more), so you can make the same kind of table from session-RPE loads.

## The fine print

- The sample is small: 40 players and 20 injuries, with about 60% power by the authors' own calculation, so the AUC values are uncertain.
- It looks like one club's data, men only, so results may not carry over to other teams or to women's football.
- The paper's text has some inconsistencies, such as the speed band limits (14.4 to 19.8 km/h in one place, 15 to 20 km/h in another), injury severity classes and the number of seasons. Read the methods closely.
- The way chronic load was averaged is not fully clear, and the exploratory "low load" risk zone is not backed by the in-season data.
- A ratio that separates groups after the fact is not proven to prevent injuries. Treat the findings as ideas to test in larger, multi-club studies. This is general education, not medical or coaching advice.
