---
title: "Age-based maximal heart rate equations: accuracy across fitness levels"
summary: "A 2025 PLOS ONE study tested seven HRmax equations against treadmill tests in 230 adults. Typical errors were 7 to 10 beats/min, whatever the person's fitness. Here is how to check it."
tools: [heart-rate-zones, bland-altman, vo2max-estimator]
updated: 2026-11-10
sources:
  - "Martin J, Lindsey B, Gerrity C, Ambegaonkar J (2025), Exploratory analysis of the accuracy of age-based maximal heart rate equations across cardiorespiratory fitness levels, PLOS ONE 20(10): e0335842. Open access under a Creative Commons Attribution licence, as stated on the article page, checked 2026-11-10."
  - "Tanaka H, Monahan KD, Seals DR (2001), J Am Coll Cardiol 37: 153-156 (208 − 0.7 × age)."
  - "Bland JM and Altman DG (1986), The Lancet 327: 307-310 (limits of agreement)."
paper:
  title: "Exploratory analysis of the accuracy of age-based maximal heart rate equations across cardiorespiratory fitness levels"
  authors: "Martin J, Lindsey B, Gerrity C, Ambegaonkar J"
  journal: "PLOS ONE"
  year: 2025
  doi: "10.1371/journal.pone.0335842"
  url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12574831"
  licence: "CC BY"
  reviewed: true
---

Most heart rate training zones start from one number: your maximum heart rate (HRmax), usually guessed from your age. A 2025 study in *PLOS ONE* asked whether fitter people are guessed worse than less fit people. Testing seven popular equations against maximal treadmill tests, the authors found the typical miss was 7 to 10 beats per minute for everyone, and fitness made little practical difference. You can see what a miss of that size does to your zones with the [[heart-rate-zones]] tool, and test any equation against measured values with the [[bland-altman]] tool.

## What they found

None of the seven equations was accurate enough for an individual. Across the whole group, the mean absolute error (the average miss, ignoring its sign) ran from about 7.4 beats/min for the Tanaka equation to about 8.6 for the Nes equation. The 95% limits of agreement (the range that covers most people's errors) were roughly 18 to 24 beats/min either side of the bias for every equation.

Tanaka, Gellish and Arena had the smallest errors. The old 220 − age rule (Fox) was the only one with no proportional bias, meaning its error did not drift as heart rates got higher, and it had the highest intraclass correlation (0.64). Most of the other equations read too low for people with high measured maxima.

Fitness itself, measured as VO2max (maximal oxygen uptake), barely mattered. It explained at most about 6% of the variation in the errors. Some equations got slightly worse with higher fitness in men, but not in women.

## Why it matters

A miss of 10 beats/min moves every zone. For coaches, researchers and anyone setting exercise targets, it is a reason to measure when it matters and to treat equations as a rough start. And being very fit or quite unfit does not explain most of the error.

## How they did it

The team looked back at records of 230 healthy adults aged 18 to 68 (174 men and 56 women) who did a maximal treadmill test between 2019 and 2024. The grade rose by 2% every 2 minutes up to 10%, then the speed went up, aiming for exhaustion in about 8 to 12 minutes. A chest strap recorded heart rate and a metabolic cart measured gas exchange. HRmax was the highest heart rate reached.

Each person's seven predictions were compared with the measured value using Bland-Altman analysis, error measures and intraclass correlation, plus mixed-effects models that asked whether VO2max changed the error.

## Check it yourself with fibub

The ten people below are **our own invented example**, not data from the paper. Ages are in years and measured maxima in beats/min.

| Person | Age | Measured HRmax | Tanaka (208 − 0.7 × age) |
|---|---|---|---|
| 1 | 22 | 201 | 192.6 |
| 2 | 27 | 188 | 189.1 |
| 3 | 31 | 196 | 186.3 |
| 4 | 35 | 182 | 183.5 |
| 5 | 38 | 190 | 181.4 |
| 6 | 42 | 171 | 178.6 |
| 7 | 46 | 184 | 175.8 |
| 8 | 51 | 165 | 172.3 |
| 9 | 57 | 170 | 168.1 |
| 10 | 63 | 152 | 163.9 |

1. Open the heart rate zones tool and type an age. The panel lists the maximum from each of its four equations (Tanaka, Gellish, Nes and 220 − age) side by side, which is how we filled the last column.
2. Open the Bland-Altman tool. Paste the predictions as method A and the measured values as method B, one person per line. Set the unit to `beats/min` and keep *Difference (A − B)* and 95% limits.
3. Read the result for Tanaka. The bias is only **−0.74 beats/min**, so on average the equation is close. But the SD of the differences is 7.89, which gives limits of agreement of **−16.2 to +14.7 beats/min**. A small average hides big misses for single people.
4. Look at the proportional bias line: slope **−0.51**, p = 0.009. In our made-up group the equation reads low for people with high maxima and high for people with low maxima, the same pattern the paper describes for most equations.
5. Swap in the 220 − age predictions (198, 193, 189, 185, 182, 178, 174, 169, 163, 157). The bias is −1.10, the limits narrow to −13.9 to +11.7 and the slope is no longer significant (p = 0.38). Ten people are far too few to rank equations; the point is how to read the numbers.
6. Now see what the error does to training zones. Back in the heart rate zones tool, pick *% of reserve (Karvonen)* and type a resting heart rate of 60. For person 7 (age 46), choose *My measured maximum* and type 184: the 60 to 70% zone is **134 to 147 beats/min**. With Tanaka's 176, the same zone becomes **130 to 141**. The person would train about 5 beats/min lower than intended.

To compare fitness itself, the [[vo2max-estimator]] turns field tests such as a 12-minute run into an estimated VO2max, which is the variable the paper used to split people by fitness.

## The fine print

- The study looked back at existing records and had no planned sample size, so small effects could be missed. The authors call it exploratory.
- About three quarters of the group were men, so results for women are less certain.
- Some people may have stopped the uphill treadmill test because of leg fatigue before reaching their true maximum, which would make measured values too low.
- This is general education about exercise testing, not medical or training advice. Anyone with a heart condition should ask a qualified professional before a maximal test.
