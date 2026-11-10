---
title: "Length-weight relationships of fishes in the Kezilesu River, Tarim Basin"
summary: "A 2026 study gives the first length-weight figures for five endemic fishes of a desert river in western China. Here is how to fit W = aL^b and test b against 3 for your own fish."
tools: [fish-length-weight, von-bertalanffy-fitter, cpue-trend]
updated: 2026-11-10
sources:
  - "Tao M et al. (2026), Frontiers in Ecology and Evolution 14: 1887717, CC BY, the paper described here. Title, authors, volume and licence checked on the publisher's page, 2026-11-10."
  - "W = aL^b fitted on log scales and relative condition Kn: Le Cren (1951), Journal of Animal Ecology 20: 201-219. Fulton's K = 100 W / L^3: standard formula."
paper:
  title: "Length-weight and length-length relationships of 20 fish species from the Kezilesu River, China"
  authors: "Tao M, Song J, Li M, Ding Y, Zhang D, Li H"
  journal: "Frontiers in Ecology and Evolution"
  year: 2026
  doi: "10.3389/fevo.2026.1887717"
  url: "https://www.frontiersin.org/journals/ecology-and-evolution/articles/10.3389/fevo.2026.1887717/full"
  licence: "CC BY 4.0"
  reviewed: true
---

How heavy is a fish of a given length? For many rivers nobody has written it down, and without that simple link, scientists cannot turn length surveys into biomass or judge whether fish are in good shape. A July 2026 paper in *Frontiers in Ecology and Evolution* fills that gap for the Kezilesu River. This is a tributary of the Tarim River in Xinjiang, western China, flowing through one of the driest regions on Earth. It reports length-weight relationships for the river's fishes, including what the authors describe as the first ones for five endemic species. The [[fish-length-weight]] tool fits the same relationship to your own measurements and tests the growth pattern. Pair it with the [[von-bertalanffy-fitter]] for growth with age, or with the [[cpue-trend]] tool to track catches over the years.

## What they found

Every fish measured followed the familiar rule that weight rises roughly with the cube of length, written W = aL^b. In the paper's tables the exponent b ranged from about 2.84, for the endemic *Schizothorax biddulphi*, to about 3.25 for the northern pike, *Esox lucius*. When b is close to 3, a fish keeps the same shape as it grows. Above 3 it gets relatively stouter, and below 3 relatively slimmer.

The headline is the new baseline. The authors claim first length-weight records for five endemic species. Those are three *Schizothorax* species, which are mountain carps, and two *Triplophysa* loaches. The authors also report new maximum lengths for them. The study adds length-length conversions too, for example from standard length (snout to the base of the tail) to total length.

## Why it matters

Endemic fishes of the Tarim Basin are under pressure from water taken for farming, dams, introduced species and fishing. Many of them are poorly studied. A length-weight relationship is one of the most basic tools for managing a fishery. With it, a survey that only measures lengths can estimate total weight, and a fish's weight can be compared with what is normal for its length. A first baseline means future surveys can tell whether condition is changing.

## How they did it

1. Fish were caught at ten sites along the river between January 2020 and December 2024, with gill nets of several mesh sizes and cage nets.
2. Each fish was measured for total length and standard length, and weighed.
3. For each species, log weight was regressed on log length. The slope of that straight line is b, and the intercept gives a.
4. Length-length relationships were fitted with ordinary straight-line regression.

## Check it yourself with fibub

**Our own made-up sample** of ten fish, not from the paper. Lengths are in cm and weights in g:

```
fish	length (cm)	weight (g)
1	9.0	7.1
2	11.5	15.6
3	13.0	21.0
4	15.5	38.2
5	17.0	49.5
6	19.5	76.0
7	22.0	106.0
8	25.0	163.0
9	27.5	212.0
10	30.0	284.0
```

1. Paste the table into the fish box. The header row tells the tool which column is length and which is weight.
2. Keep the units on cm and g, the bias correction on, and the confidence at 95 %.
3. Read the headline: **W = 0.008811 × L^3.048**, labelled positive allometric. The fit is very tight, with R² = 0.9996 on the log scale.
4. Read the test of b against 3: b = 3.048 ± 0.021, with a 95 % interval of 3.001 to 3.096, and t = 2.35 on 8 degrees of freedom, p = 0.047. This is a borderline case. The interval only just leaves out 3, so a few more fish could change the label. Report the interval, not just the word.
5. Look at condition. Mean Fulton's K is about 1.01. Then set **Kn from** to "My own a and b" and type a = 0.008811 and b = 3.048. A new 20 cm fish weighing 90 g is expected to weigh 81.4 g for its length, so its Kn is 90 ÷ 81.4 = 1.105, about 10 % heavier than average. Its Fulton's K is 100 × 90 ÷ 20³ = 1.125.

That last step is how a baseline gets used. Put a published a and b for your species into the Kn boxes, and every fish in a new sample is scored against it.

## The fine print

- The "first record" claim is not airtight: the paper's own introduction cites earlier length-weight values for three of the five species.
- The text and tables do not fully agree. The text speaks of 20 species and 2,184 fish. The tables list 18 species, and their counts add up to roughly half that. The numbers of species called positive or negative allometric also differ between sections.
- Some species had small samples, as few as 10 fish for one loach, so their b values are uncertain.
- Nets catch some sizes better than others, which can narrow the length range and bend b.
- Fish from five years and all seasons were pooled. Condition changes with season and spawning, and the links the authors draw to water use and climate are not tested.
- Use the paper's tables for the species values. Our numbers above are made up.
