---
title: "How many photoquadrats and points for coral cover? A bootstrap study"
summary: "A 2026 study resamples Hawaiian reef photomosaics to ask how many photoquadrats and points give reliable coral cover. Here is how to score points and get an honest interval yourself."
tools: [coral-cover-calculator, bootstrap-permutation, field-sampling-planner]
updated: 2026-11-10
sources:
  - "Fukunaga A, Ferreira SB, Pascoe KH, Burns JHR (2026), Frontiers in Marine Science 13: 1846394, CC BY, the paper described here. Title, authors, volume, article number and licence checked on the publisher's page, 2026-11-10."
  - "Wilson score interval: Wilson (1927), Journal of the American Statistical Association 22: 209-212. Bootstrap and BCa intervals: Efron and Tibshirani (1993), An Introduction to the Bootstrap."
paper:
  title: "When is enough enough? Utilizing bootstrap resampling to estimate benthic cover"
  authors: "Fukunaga A, Ferreira SB, Pascoe KH, Burns JHR"
  journal: "Frontiers in Marine Science"
  year: 2026
  doi: "10.3389/fmars.2026.1846394"
  url: "https://www.frontiersin.org/journals/marine-science/articles/10.3389/fmars.2026.1846394/full"
  licence: "CC BY"
  reviewed: true
---

Reef surveys usually report coral cover: the share of the seabed covered by living coral. Divers photograph square patches of reef, called photoquadrats, then mark what lies under a set of points on each picture. Every team must decide how many photos to take and how many points to score on each, and more of either costs hours. A June 2026 methods paper in *Frontiers in Marine Science* tests those choices on Hawaiian reefs. Its message is that adding photos does much more than adding points, and that the interval you report must come from the spread between photos. You can score points on your own quadrat photos with the [[coral-cover-calculator]], then get a photo-level interval with the [[bootstrap-permutation]] tool. Plan the layout before the dive with the [[field-sampling-planner]].

## What they found

Beyond about 50 points per photoquadrat, extra points barely improved the estimates. The number of photoquadrats, and so the share of the reef they cover, mattered far more. On the 50 m² plots at the remote site, about 30 photoquadrats of 1 m² gave intervals that almost always held the true value and were narrow. The larger, patchier plots on the main island needed about 60, again roughly half the plot.

From this the authors suggest a rough "50–50 rule". Sample at least half the plot area in 1 m² photoquadrats, and score at least 50 points on each. They stress it is a starting point, not a fixed standard. They also found that patchiness, not just average cover, decides how much sampling is enough. One more warning: pooling all the points from all photos into one big count gave intervals that looked precise but were often wrong.

## Why it matters

Reef monitoring programmes spend most of their effort on scoring images, often by hand or with machine help that a person must check. Knowing where the effort pays off lets a team survey more sites with the same budget. Honest intervals matter just as much. A falsely narrow interval can make a natural wobble look like a real decline, or hide a real one.

## How they did it

1. Divers photographed eleven reef plots at two places in Hawai'i, a remote island in the north-west of the chain and the main island of Hawai'i, in 2021 and 2022. They swam a lawnmower pattern with heavy overlap between photos.
2. Software stitched each plot into one map-like image, an orthophotomosaic, of 50 m² or 125 m².
3. Each mosaic was cut into a grid of 1 m² virtual photoquadrats. Each one got 1,000 random points, labelled with machine help and every point checked by a person.
4. Labels were grouped into live coral and everything else, and the full set of points gave each plot's "true" cover.
5. The team then drew smaller samples of photoquadrats and points, many times over for each design. They built a bootstrap interval for each sample, resampling whole photoquadrats, and checked how often it held the true cover and how wide it was.

## Check it yourself with fibub

**Our own made-up survey**, not the paper's data: 12 photoquadrats on a patchy reef, each with 25 points in a 5 × 5 stratified random layout. Coral was under 0, 2, 12, 1, 0, 15, 3, 8, 0, 20, 5 and 2 points on the twelve photos.

1. In the coral cover tool, keep **Points** on stratified random with 5 rows and 5 columns, add your photos and label every point. Leave "Shadow or tape" out of cover.
2. Read the pooled cover. Coral was 68 of 300 points, so **cover = 22.7 %, with a 95 % Wilson interval of 18.3 % to 27.7 %.**
3. Now read the per-photo table. Cover runs 0, 8, 48, 4, 0, 60, 12, 32, 0, 80, 20 and 8 %. Some photos are bare and some are thick with coral. The pooled interval treats all 300 points as independent, and they are not: points on the same photo tend to land on the same thing.
4. Copy those twelve percentages into the bootstrap tool as one sample, and choose the mean. With 9,999 resamples and seed 12345, the mean is again 22.7 %, but the **95 % BCa interval is 11.0 % to 40.7 %**, about three times wider. This is the photo-level interval the paper recommends.
5. See why more points would not help. Doubling to 50 points per photo, with the same coral share, makes 136 of 600 points. The pooled Wilson interval shrinks to 19.5 % to 26.2 %. The photo-to-photo spread, which is the real uncertainty, stays just as large. Only more photos would narrow the bootstrap interval.

The coral cover tool's own help says the same thing: for a transect, the spread of the per-photo covers is the more honest error.

## The fine print

- Only one measure, live coral cover, was tested. Rare categories may need more points.
- There were eleven plots from two places, chosen to cover a range of coral cover by eye. Other reef types may behave differently.
- The "true" cover came from points too, 1,000 per square metre, not from tracing every colony.
- On the plot with the lowest cover, many small samples gave no interval at all, because every resample had the same value. A different interval method was suggested but not tested.
- Each site was surveyed once, so the study does not show directly how well each design detects change over time.
- The 50–50 rule is a rule of thumb. Our survey numbers above are made up.
