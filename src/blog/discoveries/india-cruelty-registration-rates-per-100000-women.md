---
title: "India's cruelty-case rate per 100,000 women, rebuilt with confidence intervals"
summary: "A 2026 review tracks registered Section 498A cruelty cases in India from 2005 to 2023. We rebuild its rates, add exact Poisson intervals and test the year-to-year changes with fibub's crime rate calculator."
tools: [crime-rate-calculator, trend-analyser, rate-standardisation, survey-weighting]
updated: 2026-11-24
sources:
  - "Susmitha K. and Balamurugan J. (2026), Registered cruelty and reported spousal violence in India after the Protection of Women from Domestic Violence Act, 2005: a descriptive trend review, 2005-2023, Frontiers in Sociology 11: 1901370, doi:10.3389/fsoc.2026.1901370. Licence CC BY 4.0, checked on the Frontiers article page and in the Crossref record (licence 'vor', 2026-11-23), 2026-11-24; no correction or retraction notice. Values used here, all stated in the paper's running text: registered Section 498A cases 58,319 (2005), 122,877 (2014), 140,019 (2022) and 133,676 (2023); rates per 100,000 women 10.9, 20.5, 20.9 and 19.7 for the same years; West Bengal 16,951 cases in 2019; fitted annual percent change 7.1 % (95 % CI 6.1 to 8.2) for 2005-2014, 0.8 % (-1.6 to 3.3) for 2014-2023 and 2.6 % (1.5 to 3.7) overall; National Family Health Survey lifetime physical-or-sexual violence 37.2 %, 30.9 % and 29.2 % and past-year 23.9 %, 23.7 % and 24.0 % across rounds 3 to 5; state Spearman correlation 0.28 (p = 0.15)."
  - "Interval and test methods: exact (Garwood 1936) Poisson interval from the chi-square distribution; exact conditional rate-ratio test and its interval (as in Breslow and Day 1987). These are the methods the fibub crime rate calculator uses, checked in our tests against SciPy."
paper:
  title: "Registered cruelty and reported spousal violence in India after the Protection of Women from Domestic Violence Act, 2005: a descriptive trend review, 2005-2023"
  authors: "Susmitha K, Balamurugan J"
  journal: "Frontiers in Sociology"
  year: 2026
  doi: "10.3389/fsoc.2026.1901370"
  url: "https://www.frontiersin.org/articles/10.3389/fsoc.2026.1901370/full"
  licence: "CC BY 4.0"
  reviewed: true
---

Official crime counts are often read as if they measured how much harm happened. A 2026 review in *Frontiers in Sociology* takes India's registered **cruelty by a husband or his relatives** cases (Section 498A of the penal code) from 2005 to 2023 and sets them beside what women themselves report in the National Family Health Survey. The two move in opposite directions: registrations per 100,000 women roughly doubled, while survey-reported lifetime violence fell. This article rebuilds the paper's rates with the [[crime-rate-calculator]], adds the confidence intervals it does not print, and tests each change with an exact test. For the next steps, fit the trend itself with the [[trend-analyser]] and compare places with different age mixes using [[rate-standardisation]].

## The paper in brief

The authors pull yearly case counts from the National Crime Records Bureau, divide them by the mid-year female population, and follow the rate per 100,000 women from 2005 (the year the Protection of Women from Domestic Violence Act came in) to 2023. They then compare those registrations with three rounds of the National Family Health Survey, a household survey that asks women directly about violence.

The headline numbers: registrations rose steeply in the first decade, with a fitted annual change of **7.1 %** a year from 2005 to 2014, and then flattened, **0.8 %** a year to 2023 with an interval straddling zero. Over the same years, survey-reported lifetime physical or sexual violence fell from **37.2 %** to **29.2 %**, while past-year violence barely moved (23.9 % to 24.0 %). Across states, the registration rate and the survey prevalence are essentially unrelated (Spearman 0.28, p = 0.15, and 21 larger states give −0.05). The paper's conclusion is that the registration series measures reporting, policing and local practice, not the amount of violence.

## Checked with the tools

The paper prints case counts for four years (2005, 2014, 2022 and 2023) and rates for many more, but never the female population it divided by. So we recovered each denominator as count ÷ rate × 100,000 (**our back-calculation**; because the rates are rounded to 0.1, each denominator is good to about ±0.5 %). That gives about 535 million women in 2005 and 679 million in 2023, which is the right size for India's female population. Everything below is then a **recomputation from the paper's own stated values**, not new data.

**Step 1: the rates and their intervals.** The calculator returns 10.900, 20.500, 20.900 and 19.700 per 100,000 women, which is the paper's series exactly, as it must be. What it adds is the **exact Poisson 95 % interval**: 10.81 to 10.99 in 2005, and 19.60 to 19.81 in 2023. In relative terms that is ±0.8 % and ±0.5 % (Figure 1). With tens of thousands of cases, sampling noise is not what moves this series.

<!-- fig:rates -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 250" role="img" aria-label="Registered cruelty rate per 100,000 women in India for 2005, 2014, 2022 and 2023, with 95 per cent exact Poisson intervals that are narrower than the plotted points." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Registered cruelty cases per 100,000 women</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Registered cruelty cases per 100,000 women</text><line x1="58" x2="546" y1="181.1" y2="181.1" style="stroke:var(--line)"/><text x="52" y="185.1" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="123.7" y2="123.7" style="stroke:var(--line)"/><text x="52" y="127.7" text-anchor="end" style="fill:var(--muted)">15</text><line x1="58" x2="546" y1="66.4" y2="66.4" style="stroke:var(--line)"/><text x="52" y="70.4" text-anchor="end" style="fill:var(--muted)">20</text><line x1="102.4" x2="102.4" y1="204" y2="208" style="stroke:var(--muted)"/><text x="102.4" y="221" text-anchor="middle" style="fill:var(--muted)">2005</text><line x1="213.3" x2="213.3" y1="204" y2="208" style="stroke:var(--muted)"/><text x="213.3" y="221" text-anchor="middle" style="fill:var(--muted)">2010</text><line x1="324.2" x2="324.2" y1="204" y2="208" style="stroke:var(--muted)"/><text x="324.2" y="221" text-anchor="middle" style="fill:var(--muted)">2015</text><line x1="435.1" x2="435.1" y1="204" y2="208" style="stroke:var(--muted)"/><text x="435.1" y="221" text-anchor="middle" style="fill:var(--muted)">2020</text><line x1="546" x2="546" y1="204" y2="208" style="stroke:var(--muted)"/><text x="546" y="221" text-anchor="middle" style="fill:var(--muted)">2025</text><line x1="58" x2="546" y1="204" y2="204" style="stroke:var(--muted)"/><text x="302" y="242" text-anchor="middle" style="fill:var(--ink)">Year</text><text transform="translate(14 118) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Rate per 100,000 women</text><circle cx="102.4" cy="170.7" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="302" cy="60.7" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="479.5" cy="56.1" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="501.6" cy="69.8" r="4" style="fill:var(--c-blog);opacity:1"/><line x1="102.4" x2="102.4" y1="171.8" y2="169.7" style="stroke:var(--c-blog)"/><line x1="302" x2="302" y1="62" y2="59.4" style="stroke:var(--c-blog)"/><line x1="479.5" x2="479.5" y1="57.3" y2="54.8" style="stroke:var(--c-blog)"/><line x1="501.6" x2="501.6" y1="71.1" y2="68.6" style="stroke:var(--c-blog)"/><path d="M102.4 170.7L302 60.7L479.5 56.1L501.6 69.8" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round;stroke-dasharray:4 4"/><text class="fibub-mark" x="546" y="242" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The registered-cruelty rate per 100,000 women for the four years whose case counts the paper states, worked out again with the Crime rate calculator's maths. The 95 % exact Poisson intervals are drawn, but they are narrower than the dots: with more than 58,000 cases, chance is not what moves these numbers.</figcaption></figure>
<!-- /fig:rates -->

**Step 2: is each change real?** The exact conditional rate-ratio test answers that in one line per pair.

| Comparison | Rate ratio (tool) | 95 % exact interval | p | Percent change |
|---|---|---|---|---|
| 2014 vs 2005 | 1.881 | 1.862 to 1.899 | < 10⁻³⁰⁰ | +88.1 % (86.2 to 89.9) |
| 2022 vs 2014 | 1.020 | 1.012 to 1.027 | 7.7 × 10⁻⁷ | +2.0 % (1.2 to 2.7) |
| 2023 vs 2022 | 0.943 | 0.936 to 0.950 | 6.0 × 10⁻⁵⁴ | −5.7 % (−6.4 to −5.0) |
| 2023 vs 2005 | 1.807 | 1.790 to 1.825 | < 10⁻³⁰⁰ | +80.7 % (79.0 to 82.5) |

The one-year dip from 2022 to 2023 is a good lesson in what a p value means here. It is overwhelming on paper (p ≈ 6 × 10⁻⁵⁴) because 140,019 and 133,676 are huge counts, yet it is only 5.7 % and nobody should read it as 5.7 % less violence. When counts are this large, the interesting uncertainty is in the denominator, the recording practice and the year's police workload, none of which a Poisson interval knows about.

**Step 3: the paper's annual percent change, checked a cruder way.** Taking only the end years, the compound annual change is **7.27 %** for 2005-2014 (the paper's log-linear fit over every year: 7.1 %, CI 6.1 to 8.2) and **−0.44 %** for 2014-2023 (the paper: +0.8 %, CI −1.6 to 3.3). Over the whole period the end-year calculation gives 3.34 % against the paper's fitted 2.6 %. Two end points and a fitted line are not the same thing, and the gap is exactly the size of the wobble in the middle years, so the paper's fitted values are the ones to quote. The agreement is good enough to say its trend arithmetic holds.

**Step 4: where the intervals start to matter.** Figure 2 runs the same interval maths over the whole range of counts. At 140,019 cases the 95 % interval is ±0.5 % of the rate; at West Bengal's 16,951 cases in 2019 it is ±1.5 %; for a made-up small district with 12 cases among 180,000 women (**our own example**) the rate is 6.67 per 100,000 with an interval of 3.44 to 11.65, a factor of three. The paper reports a roughly 41-fold spread between states in how many registrations there are per unit of survey-reported violence. For the big states that spread is real; for the smallest ones, a tool-made interval is the quickest way to see how much of it could be luck.

<!-- fig:width -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 250" role="img" aria-label="The half-width of the exact Poisson 95 per cent interval, as a percentage of the rate, falls from about 60 per cent at 12 cases to 0.5 per cent at 140,000 cases." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How many cases a rate needs before it is steady</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How many cases a rate needs before it is steady</text><line x1="58" x2="546" y1="204" y2="204" style="stroke:var(--line)"/><text x="52" y="208" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="161" y2="161" style="stroke:var(--line)"/><text x="52" y="165" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="118" y2="118" style="stroke:var(--line)"/><text x="52" y="122" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="75" y2="75" style="stroke:var(--line)"/><text x="52" y="79" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">80</text><line x1="110.9" x2="110.9" y1="204" y2="208" style="stroke:var(--muted)"/><text x="110.9" y="221" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="212.1" x2="212.1" y1="204" y2="208" style="stroke:var(--muted)"/><text x="212.1" y="221" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="313.2" x2="313.2" y1="204" y2="208" style="stroke:var(--muted)"/><text x="313.2" y="221" text-anchor="middle" style="fill:var(--muted)">1,000</text><line x1="414.4" x2="414.4" y1="204" y2="208" style="stroke:var(--muted)"/><text x="414.4" y="221" text-anchor="middle" style="fill:var(--muted)">10,000</text><line x1="515.5" x2="515.5" y1="204" y2="208" style="stroke:var(--muted)"/><text x="515.5" y="221" text-anchor="middle" style="fill:var(--muted)">100,000</text><line x1="58" x2="546" y1="204" y2="204" style="stroke:var(--muted)"/><text x="302" y="242" text-anchor="middle" style="fill:var(--ink)">Cases counted (log scale)</text><text transform="translate(14 118) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">95 % interval, ± % of the rate</text><line x1="118.9" x2="118.9" y1="32" y2="204" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="122.9" y="44" text-anchor="start" style="fill:var(--muted)">12</text><line x1="437.6" x2="437.6" y1="32" y2="204" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="441.6" y="58" text-anchor="start" style="fill:var(--muted)">16,951</text><line x1="530.3" x2="530.3" y1="32" y2="204" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="526.3" y="72" text-anchor="end" style="fill:var(--muted)">140,019</text><path d="M58 -88L70.6 -42L80.4 -12L88.5 9.5L95.2 25.7L101.1 38.6L106.3 49.1L110.9 57.9L115.1 65.3L118.9 71.8L122.4 77.4L125.7 82.4L128.7 86.9L131.5 90.9L134.2 94.5L136.7 97.8L141.3 103.6L143.5 106.2L147.5 110.8L149.4 112.9L152.9 116.7L156.1 120.1L159.2 123.1L163.4 127L165.9 129.4L169.5 132.5L172.9 135.3L176 137.8L178.9 140L181.6 142.1L185 144.5L188.1 146.7L191.8 149.1L194.5 150.8L197.6 152.7L201.1 154.8L204.4 156.7L207.4 158.3L210.7 160L213.8 161.6L217 163.2L220.1 164.6L223.2 166L226.5 167.4L229.6 168.7L232.7 170L235.9 171.2L239.1 172.4L242.3 173.6L245.5 174.7L248.7 175.7L251.8 176.7L255 177.7L258.2 178.7L261.3 179.6L264.5 180.5L267.7 181.3L270.8 182.1L274 182.9L277.3 183.7L280.4 184.4L283.6 185.1L286.8 185.8L290 186.4L293.1 187.1L296.3 187.7L299.5 188.3L302.6 188.8L305.8 189.4L309 189.9L312.2 190.4L315.4 190.9L318.6 191.4L321.7 191.8L324.9 192.2L328.1 192.7L331.2 193.1L334.4 193.5L337.6 193.8L340.8 194.2L344 194.6L347.1 194.9L350.3 195.2L353.5 195.5L356.7 195.8L359.8 196.1L363 196.4L366.2 196.7L369.4 196.9L372.6 197.2L375.7 197.4L378.9 197.7L382.1 197.9L385.3 198.1L388.4 198.3L391.6 198.5L394.8 198.7L398 198.9L401.2 199.1L404.3 199.3L407.5 199.4L410.7 199.6L413.9 199.7L417 199.9L420.2 200L423.4 200.2L426.6 200.3L429.8 200.5L432.9 200.6L436.1 200.7L439.3 200.8L442.5 200.9L445.6 201L448.8 201.1L452 201.2L455.2 201.3L458.3 201.4L461.5 201.5L464.7 201.6L467.9 201.7L471.1 201.8L474.2 201.9L477.4 201.9L480.6 202L483.8 202.1L486.9 202.2L490.1 202.2L493.3 202.3L496.5 202.3L499.7 202.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="118.9" cy="71.8" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="437.6" cy="200.8" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="530.3" cy="202.9" r="4" style="fill:var(--c-tools);opacity:1"/><text class="fibub-mark" x="546" y="242" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The same interval maths across the whole range of counts. The marked points are a small district with 12 cases (our own example), West Bengal's 16,951 cases in 2019 and India's 133,676 in 2023.</figcaption></figure>
<!-- /fig:width -->

**Step 5: the scale gap the paper is really about.** Put the two measures in the same units. A rate of 19.7 per 100,000 women is 0.0197 % of women a year. Past-year physical or sexual violence in the survey is 24 %. That is **about 1,200 women reporting violence in a survey for every one case registered** (0.24 ÷ 0.000197). No confidence interval closes a gap of that size; it is a difference in what is being counted.

| Check | Paper | Our tool result |
|---|---|---|
| Rate per 100,000 women, 2023 | 19.7 | 19.700 (95 % CI 19.60 to 19.81) |
| Change 2005 to 2014 | APC 7.1 % a year | rate ratio 1.881, +88.1 % (86.2 to 89.9) |
| Change 2014 to 2023 | APC 0.8 % a year (CI crosses 0) | end-year compound −0.44 %; 2023 vs 2022 ratio 0.943 |
| State spread, smallest areas | about 41-fold | a 12-case area alone spans 3.4 to 11.7 per 100,000 |

## How we made the graphs

Both charts and every number above come from `scripts/blog-figures/india-cruelty-registration-rates-per-100000-women.mjs` in fibub's public code. It calls `crudeRate`, `rateRatio` and `poissonExact` from `src/lib/sci/crimerate.ts`, the maths behind the [[crime-rate-calculator]].

The case counts, the published rates, the survey percentages and the paper's fitted annual changes are **stated in the paper's text** (listed in `sources:`). The female populations are **our back-calculation** from count ÷ rate. The 12-case district is **our own made-up example**. No table or figure from the paper is reproduced here.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/crime-rate-calculator.mjs`, which pins this maths against SciPy on made-up counts:

- The exact Poisson 95 % interval for 0, 1, 5, 37, 412 and 10,000 cases must match SciPy's `chi2.ppf` limits (for 37 cases: 26.051 to 51.000), and the 90 % and 99 % versions too.
- A rate of 412 cases in 185,000 people must come out as 222.703 per 100,000 with interval limits scaled from those Poisson limits, and the rate ratio against 356 in 181,000 must be 1.13228 with the exact conditional interval 0.98017 to 1.30851 and p = 0.08984, as SciPy's `binomtest` gives.
- Direct age standardisation must match a hand calculation with the Fay-Feuer gamma interval.
- New with this article: the four years used here must reproduce rates of 10.900, 20.500, 20.900 and 19.700 per 100,000 women from the recovered denominators, with a 2014-versus-2005 rate ratio of 1.88073 (exact interval 1.86227 to 1.89939).

## Check it yourself

On the [[crime-rate-calculator]]:

1. Leave **What do you want?** on *One rate*, set **Rate per** to *100,000 people*, **Confidence** to *95 %* and **Interval** to *Exact Poisson*.
2. Type **133676** in *Number of offences (count)* and **678558376** in *Population*. It reads **19.70 per 100,000**, with the interval **19.59 to 19.81**.
3. Switch **What do you want?** to *Compare areas or years* and paste these rows (name, count, population):
   **2005, 58319, 535036697**; **2014, 122877, 599400000**; **2022, 140019, 669947368**; **2023, 133676, 678558376**.
4. Set **Compare each row with** to *2005*. The 2014 row shows a rate ratio of **1.88**, a percent change of **+88.1 %** and a p value far below 0.001; the 2023 row shows **1.81** and **+80.7 %**.
5. Change the reference to *2022* and the 2023 row becomes a rate ratio of **0.94**, a change of **−5.7 %** with an interval of −6.4 % to −5.0 %: a fall far outside chance, and far too small to mean less violence.
6. For the small-area lesson, go back to *One rate* and enter **12** cases in a population of **180000**: the rate is **6.67** with an interval of **3.44 to 11.65**.

## What researchers can use it for

- **Add the intervals a source table leaves out.** Official crime tables almost never carry them; paste count and population and you have an exact Poisson interval in seconds.
- **Test a year-on-year change properly** with the exact conditional rate ratio, instead of eyeballing two rates, and report the percent change with its interval.
- **See when a small-area rate is not worth ranking.** Districts or wards with a handful of cases have intervals wide enough to cover most of the league table.
- **Compare places with different age structures** by moving the same counts into *Age-standardised* mode, or into [[rate-standardisation]] for a fuller treatment, before claiming one area is worse than another.
- **Keep survey and administrative numbers apart**, and when survey estimates come with weights, get their uncertainty right with [[survey-weighting]].

## The fine print

- The female denominators are **our back-calculation** from the paper's rounded rates, not published figures; a ±0.5 % error in a denominator moves a rate by ±0.5 % and barely touches the rate ratios.
- A Poisson interval covers counting noise only. It says nothing about under-reporting, police recording practice, duplicate first information reports or a state that failed to send its data, all of which the paper discusses.
- Registered cases are events in a year; the survey's lifetime prevalence is a stock of people. They are not two measurements of one thing, which is the paper's point.
- The paper's annual percent change comes from a log-linear fit over every year; our end-year compound rates are a rougher check, not a replacement.
