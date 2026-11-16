---
title: "Long-term wave power off Gran Canaria: buoy against ERA5 and machine learning"
summary: "A Canary Islands study corrects ERA5 reanalysis wave power with a few years of buoy data. We recompute the wave power from its mean heights and periods with fibub's Wave calculator."
tools: [wave-calculator, distribution-explorer, wind-energy-yield]
updated: 2026-11-16
sources:
  - "Pérez-Molina, M. J. and Carta, J. A. (2025), Use of Machine-Learning Techniques to Estimate Long-Term Wave Power at a Target Site Where Short-Term Data Are Available, Journal of Marine Science and Engineering 13(6), 1194, doi:10.3390/jmse13061194. Licence CC BY (stated on the journal page), checked 2026-11-16. Values used here: Puertos del Estado buoy 2442 moored in 780 m of water off north-west Gran Canaria; nearest ERA5 point 28.5° N, 16° W; wave power P = ρ g² Hs² Te / (64 π) with ρ = 1025 kg/m³ and g = 9.81 m/s²; mean Hs 1.67 m (buoy) and 1.64 m (ERA5); mean Te 5.49 s (buoy) and 8.33 s (ERA5); mean wave power 8.9 kW/m (buoy) and 12.5 kW/m (ERA5); correlation of power 0.83; raw ERA5 against the buoy MAE 4.38 kW/m and RMSE 7.10 kW/m; corrected by multiple linear regression MAE 2.56 kW/m and RMSE 4.49 kW/m."
  - "Linear wave theory, shoaling and the sea-state energy flux: as in the US Army Corps of Engineers Coastal Engineering Manual (EM 1110-2-1100), Part II, chapter 1."
paper:
  title: "Use of Machine-Learning Techniques to Estimate Long-Term Wave Power at a Target Site Where Short-Term Data Are Available"
  authors: "Pérez-Molina MJ, Carta JA"
  journal: "Journal of Marine Science and Engineering"
  year: 2025
  doi: "10.3390/jmse13061194"
  url: "https://www.mdpi.com/2077-1312/13/6/1194"
  licence: "CC BY"
  reviewed: true
---

Before anyone moors a wave energy machine, they need to know how much power the sea delivers there, averaged over many years. A buoy measures waves well but often only for a few years; a **reanalysis** such as ERA5, a computer reconstruction of past weather, covers decades but can be off at a given spot. A study from the University of Las Palmas de Gran Canaria uses a few years of buoy data to correct ERA5 with machine learning, so the long record can be trusted at the buoy's site. This article shows how the [[wave-calculator]] recomputes wave power from a sea's height and period, and why averages need care; for the spread of heights behind an average see [[distribution-explorer]], and for the same long-term-resource question with wind, [[wind-energy-yield]].

## The paper in brief

The buoy, run by Spain's Puertos del Estado, floats over 780 m of water off north-west Gran Canaria. The nearest ERA5 grid point is about 35 km away. Both give the **significant wave height** Hs (roughly the average height of the highest third of the waves) and the **energy period** Te (the period of a single wave carrying the same energy as the whole jumble of waves). Wave power per metre of wave crest follows from P = ρg²Hs²Te / 64π.

The two agree well on height (mean Hs 1.67 m at the buoy, 1.64 m in ERA5) but not on period (5.49 s against 8.33 s), so ERA5 overstates the mean power: **12.5 kW/m** against the buoy's **8.9 kW/m**. Raw ERA5 misses the hourly buoy power by 4.38 kW/m on average. The authors then trained several models, from multiple linear regression to support vector regression and neural networks, on the overlapping years. The simplest, linear regression, did as well as any and cut the average error to **2.56 kW/m**, so they chose it.

## Checked with the tools

The Wave calculator works with one **regular** wave: height H, period T and water depth. A real sea of significant height Hs carries the same energy as a regular wave of height Hs/√2 (the root-mean-square height of a typical sea), so typing Hs/√2 into the tool gives the sea's power. We checked that this reproduces the paper's formula exactly in deep water.

**Step 1: deep water?** In 780 m, waves of 5.49 s are 47 m long and waves of 8.33 s 108 m long: both are **deep-water** waves (the depth is far more than half a wavelength), so the seabed plays no part at the buoy.

**Step 2: power at the mean sea state.** For Hs 1.67 m and Te 5.49 s the tool gives **7.51 kW/m**; for ERA5's 1.64 m and 8.33 s, **10.98 kW/m**. The 64π formula gives the same to within 0.1 % (the tool uses g = 9.80665 m/s², the paper 9.81).

**Step 3: why the paper's means are higher.** The paper's mean powers, 8.9 and 12.5 kW/m, are 19 % and 14 % above our values (Figure 1). That is expected, not an error: power goes with the **square** of the height, and the average of squared heights is always larger than the square of the average height when heights vary. A stormy week counts for far more than its share. So a long-term power average must be worked hour by hour, then averaged, exactly as the paper does.

<!-- fig:power -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="At the mean height and period, the buoy's sea gives 7.5 kW/m and ERA5's 11.0 kW/m; the paper's mean powers, 8.9 and 12.5 kW/m, sit above the curves because the average of a squared height is larger than the square of the average height." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Wave power from Hs and Te in 780 m of water</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Wave power from Hs and Te in 780 m of water</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="188.9" y2="188.9" style="stroke:var(--line)"/><text x="52" y="192.9" text-anchor="end" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="125.8" y2="125.8" style="stroke:var(--line)"/><text x="52" y="129.8" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="62.6" y2="62.6" style="stroke:var(--line)"/><text x="52" y="66.6" text-anchor="end" style="fill:var(--muted)">15</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="139.3" x2="139.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="139.3" y="269" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="220.7" x2="220.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="220.7" y="269" text-anchor="middle" style="fill:var(--muted)">6</text><line x1="302" x2="302" y1="252" y2="256" style="stroke:var(--muted)"/><text x="302" y="269" text-anchor="middle" style="fill:var(--muted)">7</text><line x1="383.3" x2="383.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="383.3" y="269" text-anchor="middle" style="fill:var(--muted)">8</text><line x1="464.7" x2="464.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="464.7" y="269" text-anchor="middle" style="fill:var(--muted)">9</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Energy period Te (s)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Wave power (kW per m of crest)</text><path d="M58 183L67.8 180.9L77.5 178.8L87.3 176.7L97 174.7L106.8 172.6L116.6 170.5L126.3 168.4L136.1 166.4L145.8 164.3L155.6 162.2L165.4 160.2L175.1 158.1L184.9 156L194.6 154L204.4 151.9L214.2 149.8L223.9 147.7L233.7 145.7L243.4 143.6L253.2 141.5L263 139.4L272.7 137.4L282.5 135.3L292.2 133.2L302 131.2L311.8 129.1L321.5 127L331.3 125L341 122.9L350.8 120.8L360.6 118.7L370.3 116.7L380.1 114.6L389.8 112.5L399.6 110.4L409.4 108.4L419.1 106.3L428.9 104.2L438.6 102.2L448.4 100.1L458.2 98L467.9 95.9L477.7 93.9L487.4 91.8L497.2 89.7L507 87.7L516.7 85.6L526.5 83.5L536.2 81.4L546 79.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 185.4L67.8 183.4L77.5 181.4L87.3 179.4L97 177.4L106.8 175.4L116.6 173.4L126.3 171.4L136.1 169.4L145.8 167.4L155.6 165.4L165.4 163.4L175.1 161.4L184.9 159.4L194.6 157.4L204.4 155.4L214.2 153.4L223.9 151.4L233.7 149.4L243.4 147.5L253.2 145.5L263 143.5L272.7 141.5L282.5 139.5L292.2 137.5L302 135.5L311.8 133.5L321.5 131.5L331.3 129.5L341 127.5L350.8 125.5L360.6 123.5L370.3 121.5L380.1 119.5L389.8 117.5L399.6 115.5L409.4 113.5L419.1 111.5L428.9 109.5L438.6 107.5L448.4 105.5L458.2 103.5L467.9 101.5L477.7 99.5L487.4 97.5L497.2 95.5L507 93.5L516.7 91.5L526.5 89.5L536.2 87.5L546 85.5" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:4 3"/><circle cx="179.2" cy="139.6" r="4.5" style="fill:var(--ink);opacity:1"/><circle cx="410.2" cy="94.2" r="4.5" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Hs 1.67 m (buoy mean)</text><line x1="235.2" x2="247.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:4 3"/><text x="251.2" y="40" style="fill:var(--muted)">Hs 1.64 m (ERA5 mean)</text><circle cx="417.4" cy="36" r="4" style="fill:var(--ink)"/><text x="428.4" y="40" style="fill:var(--muted)">Paper's mean power</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Wave power from the Wave calculator's linear-wave maths for a sea state (regular-wave height Hs/√2) at the buoy's 780 m depth, with the paper's mean powers as dots. Our recomputation from the paper's stated means.</figcaption></figure>
<!-- /fig:power -->

**Step 4: what the period error does.** With the heights so close, the ERA5 overestimate comes almost entirely from the period: 8.33 ÷ 5.49 = 1.52, so the power at the mean state rises by about half. The paper's correction mainly has to pull ERA5's periods back to the buoy's.

**Step 5: carrying the sea inshore.** Wave energy test sites near Gran Canaria lie in 30 to 600 m of water. Figure 2 uses the tool's shoaling maths to carry a 1.64 m sea towards the coast, head-on, with no friction. Long 8.33 s waves start to feel the bottom at about 60 m and the height first dips by about 9 % near 15-20 m, where the energy travels fastest, before growing again. Shorter 5.49 s waves are untouched until about 25 m. Without losses the power per metre does not change, 10.98 kW/m all the way; real seabeds take some of it.

<!-- fig:shoal -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="A sea of 1.64 m carried inshore first dips by about 9 % where the group speed peaks, then grows again in shallow water; the longer 8.33 s waves feel the bottom from about 60 m, the 5.49 s waves only from about 25 m. Power per metre stays the same without losses." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>The ERA5 mean sea carried shoreward (head-on, no losses)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">The ERA5 mean sea carried shoreward (head-on, no losses)</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">1.4</text><line x1="58" x2="546" y1="201.5" y2="201.5" style="stroke:var(--line)"/><text x="52" y="205.5" text-anchor="end" style="fill:var(--muted)">1.5</text><line x1="58" x2="546" y1="151" y2="151" style="stroke:var(--line)"/><text x="52" y="155" text-anchor="end" style="fill:var(--muted)">1.6</text><line x1="58" x2="546" y1="100.5" y2="100.5" style="stroke:var(--line)"/><text x="52" y="104.5" text-anchor="end" style="fill:var(--muted)">1.7</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">1.8</text><line x1="81.6" x2="81.6" y1="252" y2="256" style="stroke:var(--muted)"/><text x="81.6" y="269" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="198.1" x2="198.1" y1="252" y2="256" style="stroke:var(--muted)"/><text x="198.1" y="269" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="325.6" x2="325.6" y1="252" y2="256" style="stroke:var(--muted)"/><text x="325.6" y="269" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="442.1" x2="442.1" y1="252" y2="256" style="stroke:var(--muted)"/><text x="442.1" y="269" text-anchor="middle" style="fill:var(--muted)">300</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Water depth (m, log scale)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Significant height Hs (m)</text><path d="M543.3 130.8L472.6 130.8L399.1 130.8L325.6 130.8L287.9 132.3L252.2 142.4L228.6 156.6L198.1 179.3L178.7 191.9L155.1 201L124.6 201.5L101 192.9L81.6 180.8L58 160.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M543.3 130.8L472.6 130.8L399.1 130.8L325.6 130.8L287.9 130.8L252.2 130.8L228.6 130.8L198.1 132.8L178.7 136.4L155.1 147L124.6 168.2L101 185.3L81.6 195.9L58 202.5" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:4 3"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Hs, Te 8.33 s</text><line x1="177.6" x2="189.6" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:4 3"/><text x="193.6" y="40" style="fill:var(--muted)">Hs, Te 5.49 s</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The mean sea state carried from 780 m towards the coast with the Wave calculator's shoaling maths, waves arriving head-on over straight contours with no friction or breaking. A simulation for illustration, not data.</figcaption></figure>
<!-- /fig:shoal -->

| Check | Paper | Our tool result |
|---|---|---|
| Buoy: power at mean Hs, Te | mean of hourly power 8.9 kW/m | 7.51 kW/m at the mean state |
| ERA5: power at mean Hs, Te | mean of hourly power 12.5 kW/m | 10.98 kW/m at the mean state |
| Sea-state formula against the tool | P = ρg²Hs²Te/64π | same to 0.1 % with H = Hs/√2 |
| ERA5 against buoy, period ratio | 8.33 s against 5.49 s | 1.52, most of the power gap |
| Depth class at the buoy (780 m) | deep water | deep for both periods |

These are **recomputations from the paper's stated means**; we did not have the hourly buoy or ERA5 records.

## How we made the graphs

The charts and numbers come from `scripts/blog-figures/gran-canaria-wave-power-buoy-era5-machine-learning.mjs` in fibub's public code. It calls `wave` (wavelength, group speed, energy and power) and `transform` (shoaling and refraction) from `src/lib/sci/waves.ts`, the maths behind the [[wave-calculator]]. The depth (780 m), mean heights, periods and powers are from the paper; the Hs/√2 equivalence is the standard one for a sea with Rayleigh-distributed heights; the head-on approach and lossless seabed in Figure 2 are our simplifying assumptions.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks the wave maths against SciPy: the wavelength of an 8 s wave in 5 m of water must be **53.07145 m**, of a 12 s wave in 100 m **223.1468 m**, and the group speed of a 6 s wave in 2 m **3.955186 m/s**. A new file for this article, `tests/sci-tools/wave-calculator.mjs`, adds:

- A sea of Hs 1.67 m and Te 5.49 s in 780 m must give **7.507 kW/m**, both through the tool and through the 64π formula.
- A regular wave of height Hs must carry exactly **twice** the sea-state power.
- Power after shoaling from 780 m to 20 m must equal the power at 780 m.

## Check it yourself

On the [[wave-calculator]]:

1. Set *Units* to **metres** and *Water* to **Sea water (1,025 kg/m³)**.
2. Type **5.49** in *Wave period T (s)*, **1.67** in *Wave height H (m)* and **780** in *Water depth where H is measured (m)*.
3. *Water depth class* reads **deep**, *Wavelength L* about **47.0 m**, and *Wave power* about **15.0 kW per m of crest**. That is a regular wave of height 1.67 m; the sea state carries half of it, **7.5 kW/m**, as the tool's note says.
4. Change *Wave height H (m)* to **1.18** (1.67 ÷ √2): *Wave power* now reads about **7.5 kW per m**, the sea-state value directly.
5. Change *Wave period T (s)* to **8.33** and *Wave height H (m)* to **1.16** (1.64 ÷ √2): about **11.0 kW per m**, the ERA5 mean state.
6. Type **20** in *Shallower depth to carry the wave to (m)*: the height there reads about **1.06 m**, a little less than at sea, as in Figure 2.

## What researchers can use it for

- **Recompute wave power** from a buoy's or model's Hs and Te in any depth, as a first check on a resource table, with the [[wave-calculator]].
- **See whether a site is deep or shallow** for the waves that matter, before choosing between deep-water and finite-depth formulas.
- **Estimate how a sea changes inshore** (shoaling, refraction, breaking depth) when moving a test site or a sensor.
- **Explore why skewed spreads lift averages** (Rayleigh, Weibull, lognormal) with the [[distribution-explorer]], and work the wind-energy cousin of this problem with [[wind-energy-yield]].
- **Teach** why power averages must be taken over hours, not from average heights.

## The fine print

- Real seas mix swell and wind waves from different directions; one Hs and Te describe them only roughly.
- The Hs/√2 rule assumes wave heights follow a Rayleigh distribution, a good fit in deep water but not in the surf zone.
- Figure 2 leaves out friction, breaking and the islands' shape, which all change the waves inshore.
