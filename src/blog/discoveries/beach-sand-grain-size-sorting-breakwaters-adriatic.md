---
title: "Beach sand grain size and sorting behind breakwaters, northern Adriatic"
summary: "A 2025 sieve study of 63 sand samples from two Italian beaches finds the berm is the best place to monitor human-modified beaches. Here is how to work out mean, sorting and skewness yourself."
tools: [grain-size-stats, ternary-plot-maker, strat-column]
updated: 2026-11-10
sources:
  - "Martini I et al. (2025), Journal of Marine Science and Engineering 13(12): 2230, CC BY, the paper described here. Title, authors, volume and licence checked on the publisher's page, 2026-11-10."
  - "Phi scale φ = −log2(d in mm): Krumbein (1934). Graphic measures: Folk RL and Ward WC (1957), Journal of Sedimentary Petrology 27: 3-26. Moment measures as used in GRADISTAT: Blott SJ and Pye K (2001), Earth Surface Processes and Landforms 26: 1237-1248."
paper:
  title: "Assessing Grain-Size and Sedimentological Variations in Human-Modified Beaches: Insights from the Northern Adriatic Coast (Italy)"
  authors: "Martini I, Canapini L, Terzi L, Burgassi A"
  journal: "Journal of Marine Science and Engineering"
  year: 2025
  doi: "10.3390/jmse13122230"
  url: "https://www.mdpi.com/2077-1312/13/12/2230"
  licence: "CC BY"
  reviewed: true
---

Where on a busy holiday beach should a geologist take a sand sample, if the goal is to follow how the coast changes? A November 2025 paper in the *Journal of Marine Science and Engineering* tested this on two heavily used beaches in Emilia-Romagna, on Italy's northern Adriatic coast. The answer: the fair-weather berm (the low ridge of sand left at the top of the beach by ordinary waves) and the zones seaward of it. Landward of the berm, raking, levelling and sand nourishment scramble the natural signal. The study rests on sieve analysis and grain-size statistics, which the [[grain-size-stats]] tool works out from your own sieve masses. To show sand, silt and clay shares on a triangle, use the [[ternary-plot-maker]]; to place samples in a logged section, the [[strat-column]] tool.

## What they found

The two beaches had fine sand overall, and their median grain size did not differ significantly. The differences showed up between parts of the beach and between seasons.

- **The berm** was coarser and better sorted in winter than in summer, as storms winnow out the finer grains.
- **The step**, a small drop at the foot of the swash zone where waves break, held the most poorly sorted sand. The authors report its sorting at about 0.72 to 0.78 φ, against about 0.42 to 0.44 φ on the shoreface.
- **Behind detached breakwaters**, the step sand was finer and more strongly skewed towards the coarse tail than on the partly protected beach.
- **On the foreshore**, the median size could shift by up to about 0.8 φ in a single summer survey, which makes it a noisy place to sample.

## Why it matters

Many Mediterranean beaches are now partly artificial. They are topped up with dredged sand, protected by breakwaters and cleaned by machines. If sampling ignores that, a monitoring programme may record the bulldozer instead of the sea. A clear rule about which zone to sample makes surveys from different years and different beaches comparable, and helps judge whether nourishment sand behaves like the native sand.

## How they did it

1. Sand was collected in September 2022 and March 2023: 63 samples from the berm, step, foreshore and shoreface at 0.5 m water depth.
2. Samples were washed through a 63 µm sieve to remove mud, dried, and shaken through a stack of sieves from 2 mm down to 63 µm at quarter-phi steps.
3. The mass on each sieve gave a cumulative curve. The median (D50) was read from it, and mean, sorting and skewness were calculated by the method of moments in GRADISTAT software.
4. The authors then compared zones, seasons and the two beaches with statistical tests.

## Check it yourself with fibub

The tool takes the same sieve data. Here is an example with **made-up masses**, one berm sample and one step sample of 100 g each, on quarter-phi sieves from 1.0 φ (0.50 mm) to 3.5 φ (0.088 mm), plus the pan.

| Sieve (φ) | 1.0 | 1.25 | 1.5 | 1.75 | 2.0 | 2.25 | 2.5 | 2.75 | 3.0 | 3.25 | 3.5 | pan |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Berm (g) | 0.4 | 1.2 | 3.5 | 9.8 | 18.6 | 24.3 | 20.1 | 12.4 | 6.0 | 2.6 | 0.8 | 0.3 |
| Step (g) | 3.2 | 6.1 | 8.4 | 10.2 | 12.5 | 14.8 | 15.6 | 12.9 | 8.3 | 4.6 | 2.1 | 1.3 |

1. Paste the table with one row per sieve and a header row (sieve, Berm, Step) and set **Sieve sizes in** to φ. Write pan in the last row.
2. Set both open-class widths to 0.25, to match the quarter-phi spacing of the stack.
3. Read the summary table.

With these numbers the two samples have almost the same median: 2.17 φ and 2.16 φ, about 0.22 mm, fine sand. The difference is in the spread. By moments (the logarithmic, φ version):

- berm: mean 2.18 φ, sorting 0.44 φ (well sorted), skewness 0.14;
- step: mean 2.14 φ, sorting 0.62 φ (moderately well sorted), skewness −0.01.

The Folk and Ward graphic measures tell the same story: sorting 0.43 φ against 0.64 φ. A survey that kept only D50 would call these samples identical. Sorting is what tells them apart, which is why the paper's choice of zone matters. Pick each sample in **Details for** to see its percentiles and Wentworth class shares, then download the statistics as CSV to compare seasons.

## The fine print

The study covers two beaches on one stretch of coast, sampled in one summer and one winter. Its conclusions about the best zone are likely to travel to other sandy, nourished beaches, but not necessarily to gravel or tide-dominated shores. Moment statistics are sensitive to the open ends of the curve (the coarsest sieve and the pan), so results depend a little on how those classes are handled; the tool lets you change their widths to see how much. Mean sizes for each zone are in the paper's supplementary tables rather than the main text.
