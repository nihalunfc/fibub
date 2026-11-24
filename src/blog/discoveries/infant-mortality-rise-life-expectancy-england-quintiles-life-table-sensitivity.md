---
title: "How much did rising infant deaths cut life expectancy in England?"
summary: "A 2025 paper finds that a rise in infant deaths after 2014 explains little of England's stalled life expectancy. Life tables show each extra death per 1,000 births costs about 30 days, matching the paper's 15 to 28 day gains."
tools: [life-table, cohort-component-projection, fertility-rates]
updated: 2026-11-24
sources:
  - "Norman, P., Esan, O., McHale, P. and Taylor-Robinson, D. (2025), The Influence of Rising Infant Mortality on falling/stalling Life Expectancy (brief report), Applied Spatial Analysis and Policy 18: 135, doi:10.1007/s12061-025-09739-2. Licence CC BY 4.0, from the Crossref record (api.crossref.org/works, checked 2026-11-24, no update-to or correction) and the licence line on the Springer page. The paper's Table 2 was not readable here, so only numbers stated in its text are used."
  - "Method: abridged period life table from age-specific death rates with a0 and 4a1 from the Coale-Demeny West formulas, as in Preston, Heuveline and Guillot (2001), Demography, chapter 3."
paper:
  title: "The Influence of Rising Infant Mortality on falling/stalling Life Expectancy (brief report)"
  authors: "Norman P, Esan O, McHale P, Taylor-Robinson D"
  journal: "Applied Spatial Analysis and Policy"
  year: 2025
  doi: "10.1007/s12061-025-09739-2"
  url: "https://link.springer.com/article/10.1007/s12061-025-09739-2"
  licence: "CC BY 4.0"
  reviewed: true
---

After 2011 life expectancy in England stopped climbing, and from 2014 infant mortality, which had fallen for years, began to rise. Did the second cause the first? A short 2025 report asks exactly that, using abridged life tables. A life table turns a set of death rates by age into a life expectancy, and that is what the [[life-table]] does, so we can check the idea ourselves. For where births and population counts come from, see the [[fertility-rates]] and [[cohort-component-projection]].

## The paper in brief

The authors split England's small areas into five groups by deprivation (the 2015 income deprivation index) and build an abridged life table for each group and year from 2000 to 2019. They then change **only the infant death rate** (deaths before age one) in three ways and watch life expectancy at birth. In one scenario the 2014 infant death rate is held constant to 2019; in another the fall seen before 2014 continues, with a logistic curve fitted to 2000-2014. Their numbers: England's infant mortality rate was 4.87 per 1,000 in 2000 and 3.35 in 2014, then rose; life expectancy at birth was 81.29 years in 2011 and 81.04 in 2019; and in 2019 it was 76.89 years in the most deprived fifth and 84.24 in the least deprived. Under the trend scenario life expectancy would have been 28 days higher in the most deprived fifth and 15 days higher in the least deprived, with 1,392 extra infant deaths in 2014 to 2019, over 40 % of them in the most deprived areas. They conclude the change was not statistically significant.

## Checked with the tools

The paper's Table 2 is not readable to us, so we cannot rebuild its life tables. We can check something more basic: **how many days of life expectancy one extra infant death costs**, and whether the paper's 15 to 28 days is the size you would expect.

**Our assumptions**, none of which the text of the paper gives: a smooth adult death-rate curve, an infant death rate of 3.9 per 1,000 for the starting table, and 640,000 births a year. We adjusted the adult curve until the tool's life expectancy at birth was 81.04 years, then raised the infant death probability by 1 per 1,000 births. Life expectancy fell by **29.7 days**.

The result is easy to see by hand. A baby who dies in infancy loses about all the years the survivors go on to live, which is roughly the life expectancy at age one, 80.4 years in our table. One extra death in 1,000 births therefore lowers the average by 80.4 ÷ 1,000 years, which is 29.3 days. The tool gives 29.7 days because of the small effect of the age of death inside the first year.

<!-- fig:sens -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Three nearly straight lines, about 30 days of life expectancy at birth lost for each extra infant death per 1,000 births, for baselines of 76.89, 81.04 and 84.24 years. The paper's 15 and 28 day gains correspond to about 0.5 and 0.9 extra deaths per 1,000." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Life expectancy lost to extra infant deaths</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Life expectancy lost to extra infant deaths</text><line x1="58" x2="546" y1="260.1" y2="260.1" style="stroke:var(--line)"/><text x="52" y="264.1" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="174.5" y2="174.5" style="stroke:var(--line)"/><text x="52" y="178.5" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="88.8" y2="88.8" style="stroke:var(--line)"/><text x="52" y="92.8" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="139.3" x2="139.3" y1="272" y2="276" style="stroke:var(--muted)"/><text x="139.3" y="289" text-anchor="middle" style="fill:var(--muted)">0.25</text><line x1="220.7" x2="220.7" y1="272" y2="276" style="stroke:var(--muted)"/><text x="220.7" y="289" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="302" x2="302" y1="272" y2="276" style="stroke:var(--muted)"/><text x="302" y="289" text-anchor="middle" style="fill:var(--muted)">0.75</text><line x1="383.3" x2="383.3" y1="272" y2="276" style="stroke:var(--muted)"/><text x="383.3" y="289" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="464.7" x2="464.7" y1="272" y2="276" style="stroke:var(--muted)"/><text x="464.7" y="289" text-anchor="middle" style="fill:var(--muted)">1.25</text><line x1="546" x2="546" y1="272" y2="276" style="stroke:var(--muted)"/><text x="546" y="289" text-anchor="middle" style="fill:var(--muted)">1.5</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Extra infant deaths per 1,000 births</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Days of life expectancy at birth lost</text><line x1="58" x2="546" y1="195.9" y2="195.9" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="190.9" text-anchor="end" style="fill:var(--muted)">paper's 15 days</text><line x1="58" x2="546" y1="140.2" y2="140.2" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="135.2" text-anchor="end" style="fill:var(--muted)">paper's 28 days</text><line x1="175.1" x2="175.1" y1="50" y2="272" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="179.1" y="62" text-anchor="start" style="fill:var(--muted)">six-year average</text><line x1="292.2" x2="292.2" y1="50" y2="272" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="296.2" y="76" text-anchor="start" style="fill:var(--muted)">2019 peak (our ramp)</text><path d="M58 260.1L90.5 248L123.1 236L155.6 223.9L188.1 211.9L220.7 199.8L253.2 187.7L285.7 175.7L318.3 163.6L350.8 151.6L383.3 139.5L415.9 127.4L448.4 115.4L480.9 103.3L513.5 91.3L546 79.2" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 260.1L90.5 247.4L123.1 234.7L155.6 222L188.1 209.3L220.7 196.5L253.2 183.8L285.7 171.1L318.3 158.4L350.8 145.7L383.3 133L415.9 120.3L448.4 107.6L480.9 94.9L513.5 82.1L546 69.4" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 260.1L90.5 246.9L123.1 233.7L155.6 220.5L188.1 207.2L220.7 194L253.2 180.8L285.7 167.6L318.3 154.4L350.8 141.2L383.3 128L415.9 114.7L448.4 101.5L480.9 88.3L513.5 75.1L546 61.9" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">e0 76.89</text><line x1="141.6" x2="153.6" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="157.6" y="40" style="fill:var(--muted)">e0 81.04</text><line x1="225.2" x2="237.2" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="241.2" y="40" style="fill:var(--muted)">e0 84.24</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Our life tables: the loss in life expectancy at birth is almost proportional to the extra infant deaths, whatever the starting level of life expectancy.</figcaption></figure>
<!-- /fig:sens -->

The answer hardly depends on the baseline. For life expectancies of 76.89, 81.04 and 84.24 years (the paper's most deprived, all-England and least deprived values) the loss per extra death per 1,000 is 28.2, 29.7 and 30.9 days. Making the adult death rates 30 % lower or higher moves it only between 28.5 and 31.6 days.

Turning the paper's gains around, 28 days in the most deprived fifth means about **1.0 extra infant death per 1,000 births** compared with the trend scenario, and 15 days in the least deprived means about **0.5 per 1,000**. Both are plausible: the deprived fifth had higher infant mortality to begin with.

The England-wide count gives a second check. The 1,392 extra deaths in six years, on our 640,000 births a year, is 0.36 extra deaths per 1,000 births on average, about **10.8 days**. If the excess had grown in a straight line from 2014 to a peak in 2019 (**our assumption**), the 2019 figure would be 0.73 per 1,000, or **21.5 days**, which falls inside the paper's 15 to 28 day range for the fifths. Compared with the 91-day stall between 2011 and 2019 (81.29 to 81.04 years), that is about **a quarter** of the stall at its most, and 12 % on the six-year average. So rising infant mortality is a real but minor part of the story, which agrees with the paper's conclusion.

## How we made the graphs

The chart and numbers come from `scripts/blog-figures/infant-mortality-rise-life-expectancy-england-quintiles-life-table-sensitivity.mjs`. It calls `lifeTable` from `src/lib/sci/lifetable.ts`, the maths behind the [[life-table]], with the Coale-Demeny option and female rates. Inputs from the paper are the life expectancies (76.89, 81.04, 84.24, 81.29), the gains of 28 and 15 days and the 1,392 deaths. The adult death-rate curve, the 3.9 per 1,000 infant rate and the 640,000 births are ours. Each point is found by solving for the infant death rate that raises q0 by the stated amount, then comparing life expectancy at birth.

## How we test the maths

`tests/sci-tools/life-table.mjs` runs on every change to fibub:

- A made-up 19-group abridged table must match NumPy for every column, with the identities Tx/lx = ex and the sum of deaths equal to the radix.
- A complete table from made-up rates must give e0 = 74.4318 and e65 = 15.2414.
- New with this article: the 19-group table in *Check it yourself* must give e0 = 81.04 years, and raising only the infant death rate to 0.004908 must lower it by 29.7 days.

## Check it yourself

On the [[life-table]], in the *Deaths and population by age* card:

1. Replace the text with two columns, `Age` and `Mx`, one row per group: `0 0.0039`, `1-4 0.00015`, `5-9 0.000152`, `10-14 0.000183`, `15-19 0.000234`, `20-24 0.000315`, `25-29 0.000446`, `30-34 0.000657`, `35-39 0.000995`, `40-44 0.001539`, `45-49 0.002415`, `50-54 0.003822`, `55-59 0.006085`, `60-64 0.009724`, `65-69 0.015576`, `70-74 0.024985`, `75-79 0.040116`, `80-84 0.064446`, `85+ 0.103569`.
2. Keep *nax* on **Coale-Demeny**, *Sex* on **Female**, rates **per Person** and *Radix* at 100000. The heading shows **Life expectancy at birth: 81.04 years**.
3. Change only the first rate from `0.0039` to `0.004908`. The heading now shows **80.96 years**, which is 29.7 days lower, for 1 extra infant death per 1,000 births.
4. Look at the table: life expectancy at age 1 is **80.36**, which times 365 and divided by 1,000 is the same loss.

## What researchers can use it for

- **Size an effect before modelling it**: one extra infant death per 1,000 births costs about 30 days, so a rise of 0.4 per 1,000 is worth about 12 days.
- **Sanity-check a decomposition**: if a paper says a scenario moved life expectancy by 20 days, convert to extra deaths per 1,000 and see whether the numbers fit.
- **Compare groups fairly**: the loss per death is nearly the same at any starting level, so the deprived fifth's larger gain comes from its larger infant-death gap.
- **Teach** how a life table works, using the tool's age-by-age columns.
- **Plan scenarios** with the [[cohort-component-projection]] when you need to see how births and deaths feed a population.

## The fine print

- We did not rebuild the authors' tables, and our England numbers rest on an invented adult death-rate curve; they show size and shape, not a re-estimate.
- The 1,392 excess deaths and the day gains are the authors' scenario results (a trend scenario), which we only compare with ours.
- The 640,000 births a year and the straight-line rise to 2019 are our assumptions; changing the births to 600,000 or 700,000 changes the 2019 figure to about 23 or 20 days.
- Life expectancy here is a period measure: it describes 2019 death rates, not a baby's actual future.
- We did not check the authors' claim of no statistical significance, which needs their confidence intervals.
