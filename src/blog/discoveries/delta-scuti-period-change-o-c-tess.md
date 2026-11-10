---
title: "Period change rates of high-amplitude delta Scuti stars from O−C and TESS"
summary: "A 2025 open-access paper measures how fast four pulsating delta Scuti stars change their periods, using a century of timings plus TESS. Here is how to try the method with fibub."
tools: [period-finder, curve-fitter, variable-star-log, uncertainty-calculator]
updated: 2026-11-10
sources:
  - "Ma, T.-F.; Niu, J.-S.; Xue, H.-F. (2025), Period Variation Rates of Four Radial Single-Mode High-Amplitude Delta Scuti Stars, Universe 11(3), 86, published 6 March 2025. Open access under CC BY 3.0, as shown on the publisher's page, checked 2026-11-10."
  - "O−C method: standard practice in variable star timing; see Sterken (2005), The O−C Diagram: Basic Procedures, ASP Conference Series 335."
paper:
  title: "Period Variation Rates of Four Radial Single-Mode High-Amplitude Delta Scuti Stars"
  authors: "Ma T-F, Niu J-S, Xue H-F"
  journal: "Universe"
  year: 2025
  doi: "10.3390/universe11030086"
  url: "https://www.mdpi.com/2218-1997/11/3/86"
  licence: "CC BY 3.0"
  reviewed: true
---

Some stars breathe. High-amplitude delta Scuti stars swell and shrink every one to three hours, brightening by a tenth of a magnitude or more each cycle. Their rhythm is so steady that a change of a fraction of a second per century can be measured, if you have enough timings spread over enough years. A March 2025 paper in *Universe* does just that for four of these stars, XX Cygni, YZ Bootis, GP Andromedae and ZZ Microscopii, by combining more than a century of published timings with amateur observations and the TESS space telescope. You can try the same two steps, finding the period and then tracking its drift, with the [[period-finder]] and the [[curve-fitter]].

## What they found

For each star the team measured the **period change rate**, written Ṗ/P: how fast the period changes, as a fraction of the period, per year. The values are tiny, of the order of one part in a hundred million per year.

Three stars have periods that are slowly getting longer. For XX Cyg and YZ Boo, the rates fit what models predict for stars that have used up the hydrogen in their cores and are slowly expanding. For YZ Boo, though, a statistical test could not show that the curve in its timing diagram is real, so its change is not confirmed. GP And's rate falls inside the theoretical range, but is clearly lower than some earlier studies found. ZZ Mic is the odd one: its period is getting **shorter**, which the authors link to the star contracting. Its timings also wobble in a way that might come from an unseen companion star pulling it back and forth, but the data do not yet cover a full cycle of that wobble.

## Why it matters

A pulsating star's period depends on its size and density. If the period changes, the star is changing. Measuring Ṗ/P is one of the few ways to watch stellar evolution happen in a human lifetime, and to test models of how stars of 1.5 to 2.5 times the Sun's mass age. It also shows the value of long, patient records: amateur timings from groups like AAVSO and BAV fill gaps between professional studies.

## How they did it

The method is called **O−C**, short for observed minus calculated. You start with an ephemeris, a formula that predicts each time of maximum light: start time plus cycle number times the period. For every observed maximum you subtract the predicted time. If the period were exactly right and fixed, the O−C values would lie on a flat line. A straight sloped line means the period is a little off. A curve, a parabola, means the period is changing.

The authors gathered between about 590 and 900 times of maximum per star. Many came from TESS light curves taken every two minutes. They found each maximum by fitting a small polynomial to the points around the peak, estimated its error by simulation, and then fitted a parabola to each O−C diagram. The curvature of that parabola gives Ṗ/P.

## Check it yourself with fibub

All numbers here are our own, invented for practice, not the paper's data.

**Step 1: find the period.** Here are 24 made-up magnitudes of a pulsating star, eight on each of three nights (time in days, then magnitude):

```
0.0500 11.729
0.0809 11.339
0.1133 11.455
0.1373 11.726
0.1696 11.507
0.1968 11.183
0.2262 11.709
0.2497 11.715
1.0570 11.282
1.0848 11.719
1.1152 11.606
1.1352 11.151
1.1712 11.690
1.1964 11.720
1.2271 11.208
1.2497 11.357
3.0584 11.453
3.0795 11.716
3.1103 11.594
3.1434 11.211
3.1693 11.714
3.1906 11.715
3.2236 11.174
3.2502 11.495
```

Paste them into the [[period-finder]] and leave the period range blank. The strongest peak should sit at about **0.0950 days** (2.28 hours), with a false alarm probability far below one in a million. Two weaker peaks near 0.0868 and 0.1050 days are **aliases**: because we only observed at night, the tool also sees one cycle per day more or fewer (1 ÷ 0.095 = 10.53 cycles a day; 11.53 and 9.53 give the aliases). Fold the data at each peak; the true period gives the tidiest curve.

**Step 2: track the drift.** Now imagine a different star with a period of 0.1 days, timed over about 80 years. Our invented O−C values, with cycle number in thousands:

```
cycles_thousands  O-C_days
0     0.0014
50    0.0010
100   0.0026
150   0.0037
200   0.0068
250   0.0094
300   0.0134
```

Paste this into the [[curve-fitter]] and choose **Quadratic** (a + b·x + c·x²). The curvature should come out near **c = 1.48 × 10⁻⁷** days per (thousand cycles)². To turn that into a rate, divide 2c by the period squared, allow for the thousands, and change days to years:

Ṗ/P = 2 × 1.48 × 10⁻⁷ ÷ (1,000,000 × 0.1²) × 365.25 ≈ **1.1 × 10⁻⁸ per year**.

We built the data with 1.0 × 10⁻⁸, so the fit gets close despite our added scatter. Over 80 years, that change shifts the last maximum by about 19 minutes, even though the period itself changes by less than a hundredth of a second per century. To log your own timings, the [[variable-star-log]] keeps your estimates in one place, and the [[uncertainty-calculator]] helps carry the fitted error of c into Ṗ/P.

## The fine print

- **Old timings are uneven.** Early maxima often have no stated error, so the authors had to assign one from the number of decimal places given. This weights the old data by a guess.
- **Ephemerides from earlier work.** The starting periods come from the literature, not a fresh periodogram.
- **Other causes of curved O−C.** A companion star swinging the pulsator closer and farther changes the light travel time and can mimic a period change. ZZ Mic may be an example.
- **YZ Boo is unconfirmed.** Its parabola did not pass the significance test.
- **Four stars.** The results describe these four, not the whole class.
- Our tables are invented. For the measured timings and rates, read the paper.
