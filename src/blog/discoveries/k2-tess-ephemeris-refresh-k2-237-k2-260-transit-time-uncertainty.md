---
title: "K2 planet ephemerides refreshed with TESS: transit-time uncertainty by 2030"
summary: "Many K2 planets would be lost by 2030: their transit times blur by hours. A 2023 AJ paper refreshes them with TESS. We rework the 3σ windows with fibub's transit planner."
tools: [transit-planner, transit-light-curve-fitter, period-finder, object-altitude]
updated: 2026-11-24
sources:
  - "Thygesen, E., Ranshaw, J. A., Rodriguez, J. E. et al. (2023), The K2 and TESS Synergy. II. Revisiting 26 Systems in the TESS Primary Mission, The Astronomical Journal, doi:10.3847/1538-3881/acaf03; arXiv:2301.01306. Licence CC BY 4.0, checked on the publisher's page (IOP Publishing), 2026-11-24. Values used here (text and ephemeris table, read 2026-11-24): K2-237 b discovery ephemeris P = 2.18056 ± 0.00002 d, Tc = 2457684.8101 ± 0.0001 BJD, updated P = 2.18053332 ± 0.00000054 d, T0 = 2457706.61618 ± 0.00003 BJD; K2-260 b discovery P = 2.6266657 ± 0.0000018 d, Tc = 2457820.738135 ± 0.00009 BJD, updated P = 2.62669762 ± 0.00000066 d; K2-182 b discovery P = 4.7369683 ± 0.0000023 d, Tc = 2457719.11517 ± 0.00028 BJD; 3σ uncertainties by 2030 of 3.2 h and 5 min (K2-237 b), 14 and 5 min (K2-260 b), 10 and 8 min (K2-182 b); average 3σ by 2030 for the 13 systems seen again by TESS 26.7 h before, 0.35 h after."
  - "K2-237 position (RA 16h 55m 04.52s, Dec −28° 42′ 38.1″) and transit duration 2.93 h: NASA Exoplanet Archive overview page for K2-237, read 2026-11-24."
  - "Propagating a linear ephemeris: σ(Tn)² = σ(T0)² + n²σ(P)², standard error propagation for Tn = T0 + nP with independent errors (for example, Kokori, A. et al. (2023), ExoClock Project III, ApJS 265, 4)."
paper:
  title: "The K2 and TESS Synergy. II. Revisiting 26 Systems in the TESS Primary Mission"
  authors: "Thygesen E, Ranshaw JA, Rodriguez JE, Vanderburg A, Quinn SN, Eastman JD, Bieryla A, Latham DW, Vanderspek RK, Jenkins JM et al."
  journal: "The Astronomical Journal"
  year: 2023
  doi: "10.3847/1538-3881/acaf03"
  url: "https://doi.org/10.3847/1538-3881/acaf03"
  licence: "CC BY 4.0"
  reviewed: true
---

A transiting planet is only useful to the next telescope if you know when it will cross its star. The **ephemeris** (a reference mid-transit time T₀ and the orbital period P) lets you count forward, but every tiny error in the period adds up orbit after orbit. Planets found by NASA's K2 mission were often watched for only about 80 days, so their periods were short on precision. A paper in *The Astronomical Journal* by Erica Thygesen and colleagues went back to 26 K2 systems with data from the TESS satellite and refreshed their ephemerides. Their headline: for the 13 systems TESS saw again, the average 3σ uncertainty on a transit time in 2030 falls from **26.7 hours to 0.35 hours**. This article reworks that sum with the [[transit-planner]], the tool that turns an ephemeris into a list of transits you can observe. To time a transit you have recorded, use the [[transit-light-curve-fitter]]; to find a period from your own timings, the [[period-finder]].

## The paper in brief

The team took planets discovered in K2's campaigns (2014 to 2018) and searched the TESS primary mission (2018 to 2020) for new transits. Where TESS caught them, the time between the K2 and TESS transits, several hundred orbits, pins the period far better than K2 alone could. They refit each system with the EXOFASTv2 code, combining the light curves with radial velocities and the star's own properties.

Their tables list each planet's original (discovery) ephemeris, the updated one, and the 3σ uncertainty on its transit time "by 2030" for both. Most K2 planets, they write, would have had uncertainties of more than 4 hours within a decade, which is too wide to book time on a large telescope. For systems with only K2 data the gain is small (an average of 43.2 to 35.6 hours, leaving out K2-181), so TESS really is what rescues them.

## Checked with the tools

The transit planner works out the timing uncertainty of every transit it lists. It treats the transit time as Tₙ = T₀ + n·P, where n counts orbits from T₀, and adds the two errors in quadrature: σ(Tₙ) = √(σ(T₀)² + (n·σ(P))²). That is the same propagation the paper uses. We fed it the ephemerides from the paper's text and table and read the uncertainty at the first transit after **1 January 2030** (**our assumption**: the paper does not say which day of 2030).

| Planet and ephemeris | Paper: 3σ by 2030 | Tool: transit number | Tool: 3σ |
|---|---|---|---|
| K2-237 b, discovery | 3.2 h | 2,210 | 190.9 min = 3.18 h |
| K2-237 b, K2 + TESS | 5 min | 2,200 | 5.1 min |
| K2-260 b, discovery | 14 min | 1,783 | 13.9 min |
| K2-182 b, discovery | 10 min | 1,010 | 10.1 min |

All four agree with the paper to the rounding it prints. Two things stand out. First, after 2,000 orbits the period error does almost all the work: for K2-237 b, 2,210 × 0.00002 days is 64 minutes, against 0.14 minutes from T₀. Second, the new ephemeris is not just tighter; it moves the transit.

<!-- fig:sigma -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="The 3-sigma uncertainty on K2-237 b's transit time grows from minutes to 190.9 minutes by 2030 with the discovery ephemeris, but stays near 5.13 minutes with the updated one." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>K2-237 b: how far the 3σ timing window spreads</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">K2-237 b: how far the 3σ timing window spreads</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--line)"/><text x="52" y="236" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="162" y2="162" style="stroke:var(--line)"/><text x="52" y="166" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="92" y2="92" style="stroke:var(--line)"/><text x="52" y="96" text-anchor="end" style="fill:var(--muted)">200</text><line x1="139.3" x2="139.3" y1="232" y2="236" style="stroke:var(--muted)"/><text x="139.3" y="249" text-anchor="middle" style="fill:var(--muted)">2.02e+3</text><line x1="274.9" x2="274.9" y1="232" y2="236" style="stroke:var(--muted)"/><text x="274.9" y="249" text-anchor="middle" style="fill:var(--muted)">2.03e+3</text><line x1="410.4" x2="410.4" y1="232" y2="236" style="stroke:var(--muted)"/><text x="410.4" y="249" text-anchor="middle" style="fill:var(--muted)">2.03e+3</text><line x1="546" x2="546" y1="232" y2="236" style="stroke:var(--muted)"/><text x="546" y="249" text-anchor="middle" style="fill:var(--muted)">2.04e+3</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Year (first transit after 1 January)</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">3σ uncertainty (minutes)</text><line x1="58" x2="546" y1="190" y2="190" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="185" text-anchor="end" style="fill:var(--muted)">1 hour</text><path d="M58 230L85.1 219.9L112.2 209.8L139.3 199.7L166.4 189.5L193.6 179.4L220.7 169.3L247.8 159.1L274.9 149.1L302 138.8L329.1 128.8L356.2 118.6L383.3 108.5L410.4 98.4L437.6 88.2L464.7 78.1L491.8 67.9L518.9 57.8L546 47.7" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 231.9L85.1 231.7L112.2 231.4L139.3 231.1L166.4 230.9L193.6 230.6L220.7 230.3L247.8 230L274.9 229.8L302 229.5L329.1 229.2L356.2 229L383.3 228.7L410.4 228.4L437.6 228.1L464.7 227.9L491.8 227.6L518.9 227.3L546 227" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Discovery ephemeris</text><line x1="220.8" x2="232.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="236.8" y="40" style="fill:var(--muted)">Updated with TESS</text><text class="fibub-mark" x="546" y="270" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The 3σ uncertainty on the mid-time of K2-237 b's first transit of each year, from the discovery ephemeris and from the K2 + TESS update in the paper, worked out with the Transit planner's maths.</figcaption></figure>
<!-- /fig:sigma -->

**The discovery period was a little long.** The updated period of K2-237 b is 2.18053332 days, 0.0000267 days (2.3 seconds) shorter than the discovery value. The tool puts the same transit 0.2 minutes apart in 2017, **58.1 minutes apart in January 2026** and **83.8 minutes apart by 2030**, with the old ephemeris always predicting it later (Figure 2). An observer trusting the discovery numbers today would start their run an hour late and could miss the first half of a 2.9-hour transit. The drift stays inside the old 3σ window (190.9 minutes by 2030), so the discovery paper was honest about its uncertainty. That window was simply too wide to be useful. For K2-260 b the paper notes that the new period differs from the old by well over 3σ, a reminder that quoted errors can also be too small.

<!-- fig:drift -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="With the discovery period the transit is predicted 83.8 minutes away from the updated prediction by 2030: well inside the old 3-sigma window, which is why the window was so wide." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>K2-237 b: discovery prediction minus updated prediction</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">K2-237 b: discovery prediction minus updated prediction</text><line x1="58" x2="546" y1="211" y2="211" style="stroke:var(--line)"/><text x="52" y="215" text-anchor="end" style="fill:var(--muted)">-200</text><line x1="58" x2="546" y1="141" y2="141" style="stroke:var(--line)"/><text x="52" y="145" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="71" y2="71" style="stroke:var(--line)"/><text x="52" y="75" text-anchor="end" style="fill:var(--muted)">200</text><line x1="139.3" x2="139.3" y1="232" y2="236" style="stroke:var(--muted)"/><text x="139.3" y="249" text-anchor="middle" style="fill:var(--muted)">2.02e+3</text><line x1="274.9" x2="274.9" y1="232" y2="236" style="stroke:var(--muted)"/><text x="274.9" y="249" text-anchor="middle" style="fill:var(--muted)">2.03e+3</text><line x1="410.4" x2="410.4" y1="232" y2="236" style="stroke:var(--muted)"/><text x="410.4" y="249" text-anchor="middle" style="fill:var(--muted)">2.03e+3</text><line x1="546" x2="546" y1="232" y2="236" style="stroke:var(--muted)"/><text x="546" y="249" text-anchor="middle" style="fill:var(--muted)">2.04e+3</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Year (first transit after 1 January)</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Minutes</text><line x1="58" x2="546" y1="141" y2="141" style="stroke:var(--muted);stroke-dasharray:4 4"/><path d="M58 140.9L85.1 138.7L112.2 136.5L139.3 134.2L166.4 131.9L193.6 129.7L220.7 127.4L247.8 125.2L274.9 122.9L302 120.7L329.1 118.4L356.2 116.2L383.3 113.9L410.4 111.7L437.6 109.4L464.7 107.2L491.8 104.9L518.9 102.6L546 100.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 140L85.1 134.9L112.2 129.9L139.3 124.8L166.4 119.8L193.6 114.7L220.7 109.6L247.8 104.6L274.9 99.5L302 94.4L329.1 89.4L356.2 84.3L383.3 79.3L410.4 74.2L437.6 69.1L464.7 64L491.8 59L518.9 53.9L546 48.8" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><path d="M58 142L85.1 147.1L112.2 152.1L139.3 157.2L166.4 162.2L193.6 167.3L220.7 172.4L247.8 177.4L274.9 182.5L302 187.6L329.1 192.6L356.2 197.7L383.3 202.7L410.4 207.8L437.6 212.9L464.7 218L491.8 223L518.9 228.1L546 233.2" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Difference in mid-time</text><line x1="242.4" x2="254.4" y1="36" y2="36" style="stroke:var(--muted);stroke-width:2;stroke-dasharray:5 4"/><text x="258.4" y="40" style="fill:var(--muted)">Discovery 3σ window</text><text class="fibub-mark" x="546" y="270" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. How far apart the two ephemerides put the same transit of K2-237 b (solid), against the discovery ephemeris's own 3σ window (dashed). The gap grows by about 2.3 seconds every orbit.</figcaption></figure>
<!-- /fig:drift -->

## How we made the graphs

The table and both charts come from `scripts/blog-figures/k2-tess-ephemeris-refresh-k2-237-k2-260-transit-time-uncertainty.mjs` in fibub's public code. It calls `transitWindows` from `src/lib/astro/transits.ts`, the maths behind the [[transit-planner]], which converts barycentric Julian dates to UTC, counts transit numbers and returns each transit's middle and its σ in minutes.

The ephemerides come from the paper. The position and duration of K2-237 come from the NASA Exoplanet Archive. The positions we gave K2-260 and K2-182 are rough (**our assumption**): they shift the conversion to UTC by seconds and do not touch the uncertainty. The updated T₀ of K2-237 b comes from a table we read in a garbled text copy, so we checked it: with it the tool gives the paper's 5 minutes, and the old and new ephemerides agree to 0.7 minutes ten orbits after the old T₀, as two fits of the same K2 data should.

## How we test the maths

On every change, `tests/sci.mjs` runs the transit planner's checks:

- A round trip from a barycentric Julian date to UTC and back must return 2461000.25 to better than 10⁻⁹ days, and HD 189733 b must show 4 or 5 transits in 10 days, spaced by its 2.21857567-day period.
- New with this article, in `tests/sci-tools/transit-planner.mjs`: at the first transit after 1 January 2030, the 3σ uncertainty must be 3.2 hours (K2-237 b, discovery), 5 minutes (K2-237 b, updated), 14 minutes (K2-260 b) and 10 minutes (K2-182 b), as the paper prints them.

## Check it yourself

On the [[transit-planner]], in the *Planet* card:

1. Type *Right ascension* **16 55 04.5** and *Declination* **-28 42 38**.
2. Type *Mid-transit time T₀ (BJD_TDB)* **2457684.8101**, *Period (days)* **2.18056**, *Transit duration (hours)* **2.93**, *T₀ uncertainty* **0.0001** and *Period uncertainty* **0.00002**. This is the discovery ephemeris.
3. Tick *Also list transits I can't see* and set *Look ahead* to **A year**. Each row's ± is the 1σ uncertainty: about **± 49 min** for the first transit after 24 November 2026, rising to about **± 53 min** a year later. Three times that is the paper's 3σ.
4. Now type the updated ephemeris: T₀ **2457706.61618**, period **2.18053332**, T₀ uncertainty **0.00003**, period uncertainty **0.00000054**. The ± drops to about **± 1.3 min**, and the same transit moves about **64 minutes earlier**.
5. Change the period uncertainty back to **0.00002** with the new T₀ and watch the ± jump again: the period error, not T₀, drives the blur.

## What researchers can use it for

- **Check an ephemeris before booking telescope time:** type the archive values into the [[transit-planner]] and see the ± for your night; if it is close to the transit length, you need a fresher ephemeris.
- **Plan the follow-up that rescues an old planet:** list transits that are dark and high from your site, and pick nights with baseline on both sides. Then use the [[object-altitude|target altitude planner]] for the whole night.
- **Refresh a period from your own timings:** fit each light curve's mid-time with the [[transit-light-curve-fitter]], then fit a line through the times against transit number, or look for a period in the raw photometry with the [[period-finder]].
- **Teach error propagation:** the two terms in σ(Tₙ) make a clear class example of why a long time baseline beats more points packed into a short one.

## The fine print

- The tool and the paper use a linear ephemeris. Planets whose orbits decay or that are tugged by a neighbour (transit-timing variations) drift in ways no linear ephemeris predicts.
- σ(T₀) and σ(P) are treated as independent. A full fit gives them a covariance, which can make the true window a little smaller; the paper's 3σ values match the simple sum, so we did the same.
- The tool's ± is 1σ; multiply by 3 to compare with the paper.
- "By 2030" is our reading. Taken at the end of 2030 instead of the start, the K2-237 b discovery window grows from 3.18 to about 3.4 hours.
