---
title: "Yo-Yo endurance test VO2max: estimated vs measured in soccer players"
summary: "A 2025 study measured oxygen uptake during the Yo-Yo endurance test in 17 professional soccer players and found the standard equation underestimated VO2max and missed most of the season's gain. Here is how to check that kind of claim."
tools: [bland-altman, vo2max-estimator]
updated: 2026-11-10
sources:
  - "Buglione A, Pompa D, Beato M et al. (2025), Measured vs. Estimated VO2max in the Yo-Yo Endurance Test: An Exploratory Study in Professional Soccer Players, Sports 13(12): 424. Open access under a CC BY licence, as linked on the publisher's article page, checked 2026-11-10."
  - "Bangsbo J (1994), Fitness Training in Football: A Scientific Approach (the Yo-Yo tests)."
  - "Bland JM and Altman DG (1986), The Lancet 327: 307-310 (limits of agreement)."
paper:
  title: "Measured vs. Estimated V˙O2max in the Yo-Yo Endurance Test: An Exploratory Study in Professional Soccer Players"
  authors: "Buglione A, Pompa D, Beato M et al."
  journal: "Sports"
  year: 2025
  doi: "10.3390/sports13120424"
  url: "https://www.mdpi.com/2075-4663/13/12/424"
  licence: "CC BY"
  reviewed: true
---

How far can you trust a fitness score worked out from how long someone lasts in a running test? A 2025 study in *Sports* fitted professional soccer players with a portable gas analyser during the Yo-Yo endurance test and compared their measured maximal oxygen uptake (VO2max) with the value from the test's usual equation. The equation read low, and the gap grew as the season went on. Comparing an estimate with a measurement is a job for the [[bland-altman]] tool, and the [[vo2max-estimator]] shows how other field tests turn a distance or time into a VO2max.

## What they found

The authors tested 17 players from an Italian third-division club before the season and again six months later. Before the season, the equation underestimated VO2max by about 2.3 mL·kg⁻¹·min⁻¹ on average (millilitres of oxygen per kilogram of body mass per minute). By mid-season the bias had grown to about 7.0 mL·kg⁻¹·min⁻¹, with 95% limits of agreement running from roughly −15.5 to +1.5.

The equation also failed to track change. Measured VO2max rose by about 14% over the six months, but the estimate rose by only about 5%, and the two sets of changes were only loosely linked (r = 0.48, not statistically significant). The authors conclude that the standard equation is not good enough to follow an individual player's aerobic fitness through a season.

## Why it matters

Field tests are popular because they need only cones, a speaker and a pitch, and a whole squad can run at once. If the estimate is off by a fixed amount, a coach can live with it. If it is off by different amounts at different times of year, then a player who looks unchanged on paper may in fact be much fitter, and training decisions based on the score could be wrong.

## How they did it

The Yo-Yo endurance test (level 1) has players run 20 m out and 20 m back, again and again, to beeps that speed up in set stages. The test ends when a player can no longer keep pace. Bangsbo's original equation turns the stage reached into an estimated VO2max with a simple straight-line formula.

Here, every player also wore a portable breath-by-breath gas analyser during the test itself, so the reference value came from the same run on the same pitch, not from a treadmill test on another day. The two values were compared with Bland-Altman analysis, which looks at each player's difference (estimate minus measurement), its average (the bias) and its spread (the limits of agreement).

## Check it yourself with fibub

The numbers below are **our own invented values** for 10 players, not the paper's data. All are in mL·kg⁻¹·min⁻¹.

| Player | Measured, pre | Estimated, pre | Measured, mid | Estimated, mid |
|---|---|---|---|---|
| 1 | 52.1 | 52.4 | 59.0 | 53.9 |
| 2 | 55.4 | 51.0 | 62.1 | 53.5 |
| 3 | 58.9 | 54.9 | 66.3 | 57.4 |
| 4 | 50.3 | 49.6 | 57.8 | 51.8 |
| 5 | 61.2 | 53.8 | 68.9 | 56.9 |
| 6 | 56.8 | 55.1 | 64.0 | 57.0 |
| 7 | 54.0 | 50.2 | 61.5 | 52.9 |
| 8 | 59.7 | 52.7 | 67.2 | 55.6 |
| 9 | 57.5 | 54.6 | 65.1 | 57.3 |
| 10 | 63.4 | 55.0 | 70.4 | 57.9 |

1. Open the Bland-Altman tool. Paste the pre-season columns with the estimate first (method A) and the measurement second (method B). Type `mL/kg/min` as the unit and keep *Difference (A − B)*, *Mean of A and B* and 95% limits.
2. Read the result. The bias is **−4.00** (95% CI −6.08 to −1.92), so the estimate reads clearly low. The SD of the differences is 2.91, giving limits of agreement of **−9.70 to +1.70**.
3. Look at the proportional bias line. Its slope is **−0.74** (p = 0.016): the fitter the player, the more the estimate falls short. That is typical when an equation squeezes everyone towards the average.
4. Note Lin's concordance coefficient: **0.32**, even though the plain correlation is 0.74. A strong correlation does not mean two methods give the same numbers.
5. Now paste the mid-season columns. The bias widens to **−8.81**, with limits of **−13.77 to −3.85**.
6. Work out the change by hand. Measured VO2max rose by an average of **7.3** (about 12.8%), but the estimate rose by only **2.5** (about 4.7%). In this made-up squad, the field score would hide most of the gain.

The VO2max estimator does not include the Yo-Yo endurance test, but it puts six other field tests side by side, such as the Cooper 12-minute run and the 20 m beep test, so you can see how much estimates from different tests disagree for one person.

## The fine print

- The study is small (17 players from one team) and the authors call it exploratory, with no planned sample size.
- Several players left between the two test days and were replaced, so the full squad was not the same.
- Weather, wind and pitch surface could not be fully controlled outdoors.
- The reference came from a portable analyser during the field test, not from a lab treadmill test, so it may not equal a true laboratory VO2max.
- Some R² values in the results do not match those in the abstract; check the tables. This is general education about fitness testing, not training or medical advice.
