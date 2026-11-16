---
title: "Wind potential at Whittlesea, South Africa: Weibull from mean speed and power"
summary: "A year of hourly winds in the Eastern Cape gives a mean of 3.88 m/s and 67 W/m² at 10 m. We back out the Weibull curve, correct for the thin air at 1,100 m and size a small turbine with fibub's wind energy tool."
tools: [wind-energy-yield, solar-pv-yield]
updated: 2026-11-16
sources:
  - "Shambira, N., Luvatsha, L. and Mukumba, P. (2025), Comparative Analysis of Five Numerical Methods and the Whale Optimization Algorithm for Wind Potential Assessment: A Case Study in Whittlesea, Eastern Cape, South Africa, Processes 13(5), 1344, doi:10.3390/pr13051344. Licence CC BY, checked on the journal page, 2026-11-16. Values used here: hourly wind speeds for January to December 2022 at 10 m above ground (South African Weather Service, Queenstown station); site elevation 1,100 m; mean speed 3.88 m/s (winter mean 4.87 m/s); wind power density 67.29 W/m² with an air density of 1.225 kg/m³."
  - "Air density from the International Standard Atmosphere (ISO 2533:1975), as used by the Wind energy yield tool."
  - "Wind power classes (class 1 below 100 W/m² at 10 m): Elliott, D. L. et al. (1986), Wind Energy Resource Atlas of the United States, Pacific Northwest Laboratory, DOE/CH 10093-4."
  - "Our assumptions, not from the paper: mean air temperature 15 °C; power-law shear exponent 0.143 (1/7, open land); a made-up 10 kW turbine with an 8 m rotor, power coefficient 0.4, cut-in 3 m/s and cut-out 25 m/s."
paper:
  title: "Comparative Analysis of Five Numerical Methods and the Whale Optimization Algorithm for Wind Potential Assessment: A Case Study in Whittlesea, Eastern Cape, South Africa"
  authors: "Shambira, N.; Luvatsha, L.; Mukumba, P."
  journal: "Processes"
  year: 2025
  doi: "10.3390/pr13051344"
  url: "https://www.mdpi.com/2227-9717/13/5/1344"
  licence: "CC BY"
  reviewed: true
---

Before anyone puts up a wind turbine, they need to know how often each wind speed blows. Engineers describe that with a **Weibull distribution**, a curve set by two numbers: a **shape k** (how spread out the speeds are) and a **scale c** (roughly, a typical speed). A 2025 study in *Processes* compares six ways of finding k and c from a year of hourly winds at Whittlesea in South Africa's Eastern Cape, a rural area looking at small turbines for local power. This article shows how the [[wind-energy-yield]] tool turns the paper's two headline numbers back into a Weibull curve, fixes the air density for a high site, and estimates what a small turbine would make. For the same site's sunshine, the [[solar-pv-yield]] tool does the solar side.

## The paper in brief

The authors took one year (2022) of hourly mean wind speeds measured 10 m above the ground near Whittlesea, at about 1,100 m above sea level. They fitted the Weibull curve six ways: five classic numerical methods (such as the method of moments and maximum likelihood) and a newer search method, the whale optimisation algorithm, then compared how well each matched the data. The site's mean wind speed is **3.88 m/s**, rising to **4.87 m/s** in winter, and its **wind power density** (the wind's power through each square metre facing it) is **67.29 W/m²**, worked out with the standard sea-level air density of 1.225 kg/m³. That is a low-wind site, suited to small turbines rather than wind farms.

## Checked with the tools

We started from only the paper's mean speed and power density, plus its site elevation. Everything here is a **recomputation** with the tool's maths and our stated assumptions, not a fit to the paper's hourly data.

**Step 1: back to the Weibull curve.** For a Weibull curve, the ratio of the power density to ½ρv̄³ (ρ is the air density, v̄ the mean speed), called the **energy pattern factor**, depends only on k. The paper's numbers give 1.881, which fixes **k = 2.03**; the mean then gives **c = 4.38 m/s**. Fed back into the tool's formulas, these return the paper's 3.88 m/s and 67.29 W/m² exactly (Figure 1). A k near 2 is typical of inland sites.

<!-- fig:weibull -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="A Weibull distribution with k 2.03 and c 4.38 m/s reproduces the paper's mean speed and power density; at 30 m the scale rises to 5.12 m/s." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How often each wind speed blows (Weibull, recomputed)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How often each wind speed blows (Weibull, recomputed)</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--line)"/><text x="52" y="266" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="213.8" y2="213.8" style="stroke:var(--line)"/><text x="52" y="217.8" text-anchor="end" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="165.6" y2="165.6" style="stroke:var(--line)"/><text x="52" y="169.6" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="117.5" y2="117.5" style="stroke:var(--line)"/><text x="52" y="121.5" text-anchor="end" style="fill:var(--muted)">15</text><line x1="58" x2="546" y1="69.3" y2="69.3" style="stroke:var(--line)"/><text x="52" y="73.3" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="58" y1="262" y2="266" style="stroke:var(--muted)"/><text x="58" y="279" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="210.5" x2="210.5" y1="262" y2="266" style="stroke:var(--muted)"/><text x="210.5" y="279" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="363" x2="363" y1="262" y2="266" style="stroke:var(--muted)"/><text x="363" y="279" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="515.5" x2="515.5" y1="262" y2="266" style="stroke:var(--muted)"/><text x="515.5" y="279" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Wind speed (m/s)</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Share of hours per m/s (%)</text><line x1="149.5" x2="149.5" y1="50" y2="262" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="153.5" y="62" text-anchor="start" style="fill:var(--muted)">cut-in 3 m/s</text><path d="M58 262L64.1 243.5L70.2 224.4L76.3 205.4L82.4 186.9L88.5 169.3L94.6 152.5L100.7 137L106.8 122.9L112.9 110.4L119 99.5L125.1 90.4L131.2 83L137.3 77.5L143.4 73.7L149.5 71.7L155.6 71.4L161.7 72.6L167.8 75.4L173.9 79.6L180 84.8L186.1 91.1L192.2 98.4L198.3 106.3L204.4 114.8L210.5 123.6L216.6 132.7L222.7 141.9L228.8 151.2L234.9 160.2L241 169.1L247.1 177.7L253.2 185.9L259.3 193.7L265.4 200.9L271.5 207.7L277.6 214.1L283.7 219.9L289.8 225.2L295.9 229.9L302 234.2L308.1 238.1L314.2 241.6L320.3 244.6L326.4 247.2L332.5 249.5L338.6 251.5L344.7 253.2L350.8 254.7L356.9 255.9L363 257L369.1 258L375.2 258.7L381.3 259.3L387.4 259.8L393.5 260.3L399.6 260.6L405.7 260.8L411.8 261.1L417.9 261.3L424 261.4L430.1 261.6L436.2 261.7L442.3 261.7L448.4 261.8L454.5 261.8L460.6 261.9L466.7 261.9L472.8 261.9L478.9 261.9L485 262L491.1 262L497.2 262L503.3 262L509.4 262L515.5 262L521.6 262L527.7 262L533.8 262L539.9 262L546 262" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 262L64.1 248.5L70.2 234.6L76.3 220.7L82.4 207L88.5 193.7L94.6 180.9L100.7 168.7L106.8 157.3L112.9 146.7L119 137.1L125.1 128.5L131.2 120.9L137.3 114.6L143.4 109.2L149.5 105L155.6 101.9L161.7 100L167.8 99.1L173.9 99.2L180 100.4L186.1 102.4L192.2 105.3L198.3 108.9L204.4 113.2L210.5 118.1L216.6 123.6L222.7 129.4L228.8 135.7L234.9 142L241 148.7L247.1 155.4L253.2 162.2L259.3 168.8L265.4 175.5L271.5 181.9L277.6 188.3L283.7 194.4L289.8 200.1L295.9 205.7L302 210.9L308.1 215.8L314.2 220.5L320.3 224.8L326.4 228.8L332.5 232.4L338.6 235.8L344.7 238.9L350.8 241.7L356.9 244.2L363 246.4L369.1 248.4L375.2 250.2L381.3 251.9L387.4 253.2L393.5 254.5L399.6 255.6L405.7 256.5L411.8 257.4L417.9 258L424 258.7L430.1 259.2L436.2 259.7L442.3 260.1L448.4 260.4L454.5 260.7L460.6 260.9L466.7 261.1L472.8 261.2L478.9 261.4L485 261.5L491.1 261.6L497.2 261.7L503.3 261.7L509.4 261.8L515.5 261.8L521.6 261.9L527.7 261.9L533.8 261.9L539.9 261.9L546 261.9" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">At 10 m (from the paper's mean and power density)</text><line x1="436.8" x2="448.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:5 4"/><text x="452.8" y="40" style="fill:var(--muted)">At 30 m (shear α 0.143)</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The Weibull distribution that matches the paper's 10 m mean speed and power density (our recomputation, not the paper's fitted curves), and the same wind carried up to 30 m with the 1/7 power law.</figcaption></figure>
<!-- /fig:weibull -->

**Step 2: thin air.** At 1,100 m and an assumed 15 °C, the tool's standard-atmosphere maths gives an air density of **1.073 kg/m³**, about 12% below the 1.225 the paper used. Wind power scales with density, so the site's real power density at 10 m is about **59 W/m²**, not 67 (Figure 2). Both values are below 100 W/m², the bottom wind class on the classic scale.

<!-- fig:density -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="At the site's elevation the air is about 12 % thinner than standard, so the power density at 10 m is 59 W/m², not 67 W/m²." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Wind power density with height</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Wind power density with height</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="201.5" y2="201.5" style="stroke:var(--line)"/><text x="52" y="205.5" text-anchor="end" style="fill:var(--muted)">50</text><line x1="58" x2="546" y1="151" y2="151" style="stroke:var(--line)"/><text x="52" y="155" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="100.5" y2="100.5" style="stroke:var(--line)"/><text x="52" y="104.5" text-anchor="end" style="fill:var(--muted)">150</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">200</text><line x1="119" x2="119" y1="252" y2="256" style="stroke:var(--muted)"/><text x="119" y="269" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="241" x2="241" y1="252" y2="256" style="stroke:var(--muted)"/><text x="241" y="269" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="363" x2="363" y1="252" y2="256" style="stroke:var(--muted)"/><text x="363" y="269" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="485" x2="485" y1="252" y2="256" style="stroke:var(--muted)"/><text x="485" y="269" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Height above ground (m)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Power density (W/m²)</text><line x1="58" x2="546" y1="151" y2="151" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="146" text-anchor="end" style="fill:var(--muted)">100 W/m²: poor</text><path d="M58 184L70.2 178.5L82.4 173.5L94.6 168.9L106.8 164.5L119 160.5L131.2 156.7L143.4 153L155.6 149.6L167.8 146.3L180 143.1L192.2 140.1L204.4 137.1L216.6 134.2L228.8 131.5L241 128.8L253.2 126.3L265.4 123.6L277.6 121.2L289.8 118.8L302 116.5L314.2 114.1L326.4 111.9L338.6 109.7L350.8 107.6L363 105.4L375.2 103.3L387.4 101.3L399.6 99.3L411.8 97.4L424 95.3L436.2 93.5L448.4 91.6L460.6 89.8L472.8 88L485 86.2L497.2 84.4L509.4 82.6L521.6 80.9L533.8 79.2L546 77.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 192.4L70.2 187.6L82.4 183.2L94.6 179.2L106.8 175.3L119 171.8L131.2 168.5L143.4 165.3L155.6 162.3L167.8 159.4L180 156.6L192.2 153.9L204.4 151.3L216.6 148.8L228.8 146.4L241 144L253.2 141.8L265.4 139.6L277.6 137.4L289.8 135.2L302 133.2L314.2 131.2L326.4 129.2L338.6 127.3L350.8 125.4L363 123.5L375.2 121.7L387.4 119.9L399.6 118.2L411.8 116.5L424 114.7L436.2 113.1L448.4 111.4L460.6 109.8L472.8 108.3L485 106.7L497.2 105.1L509.4 103.6L521.6 102.1L533.8 100.6L546 99.2" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Standard air, 1.225 kg/m³</text><line x1="264" x2="276" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="280" y="40" style="fill:var(--muted)">Site air at 1,100 m, 1.073 kg/m³</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Wind power density against height from the Wind energy yield tool's maths, at the standard air density the paper used and at the thinner air of a 1,100 m site at 15 °C (our assumption).</figcaption></figure>
<!-- /fig:density -->

**Step 3: higher up, and a small turbine.** Wind is faster away from the ground. With the usual 1/7 power law, the mean rises to **4.54 m/s at 30 m** and the power density to **94 W/m²** (site air). A made-up 10 kW turbine with an 8 m rotor would make, before losses:

| Hub height | Mean speed | Power density (site air) | Energy a year | Capacity factor |
|---|---|---|---|---|
| 10 m | 3.88 m/s | 59 W/m² | 9,979 kWh | 11.4% |
| 20 m | 4.28 m/s | 79 W/m² | 13,244 kWh | 15.1% |
| 30 m | 4.54 m/s | 94 W/m² | 15,486 kWh | 17.7% |
| 50 m | 4.88 m/s | 118 W/m² | 18,649 kWh | 21.3% |

Raising the hub from 10 to 30 m adds about 55% more energy: at a low-wind site, height matters more than almost anything else.

## How we made the graphs

Both charts and the table come from `scripts/blog-figures/whittlesea-wind-weibull-power-density.mjs` in fibub's public code. It calls `gamma`, `cFromMean`, `powerDensity`, `weibullPdf`, `shear`, `genericCurve` and `aep` from `src/lib/sci/eng-wind.ts`, and `atmosphere` from `src/lib/sci/eng-atmos.ts`: the maths behind the [[wind-energy-yield]] tool. The mean speed, power density, measuring height and elevation come from the paper. The temperature, the shear exponent and the turbine are our assumptions, and the turbine's yearly energy is a **model estimate**, not a result from the paper. The paper's six fitted k and c pairs are in its tables; ours is a single back-calculation that matches its two summary numbers.

## How we test the maths

On every change to fibub, `tests/sci-tools/wind-energy-yield.mjs` (run by `tests/sci.mjs`) checks the tool against SciPy:

- The maximum-likelihood Weibull fit of a fixed example year must give **k 2.10163 and c 7.17262 m/s**, matching an exact solve with SciPy's brentq.
- The annual energy of a generic 2 MW turbine on that wind must be **10,308,664 kWh** at 1.225 kg/m³ and **9,925,074 kWh** at 1.1 kg/m³, matching SciPy's quad integration.
- New with this article: k 2.0312 and c 4.3792 m/s must give back a mean of **3.88 m/s** and a power density of **67.29 W/m²**.

## Check it yourself

On the [[wind-energy-yield]] tool:

1. Choose **Weibull k and c** in *Wind from*. Type **2.03** in *Shape k* and **4.38** in *Scale c (m/s)*.
2. Type **10** in *Measured at height (m)* and **10** in *Hub height (m)*. Leave *Site elevation (m)* on **0** and *Mean air temperature (°C)* on **15**.
3. It reads a *Mean speed at hub* of about **3.88 m/s** and a *Wind power density* of about **67 W/m²**: the paper's numbers.
4. Now type **1100** in *Site elevation (m)*: *Air density* drops to about **1.073 kg/m³** and the power density to about **59 W/m²**.
5. Type **30** in *Hub height (m)* (leave *Shear exponent α* at **0.143**). With *Power curve* on **A generic made-up curve**, type **10** in *Rated power (kW)*, **8** in *Rotor diameter (m)*, **0.4** in *Power coefficient Cp*, **3** in *Cut-in speed (m/s)* and **25** in *Cut-out speed (m/s)*; set *Availability (%)* to **100** and *Other losses (%)* to **0**. It reads about **15,500 kWh a year, capacity factor 17.7 %**.

## What researchers can use it for

- **Rebuild a Weibull curve** from the mean speed and power density a paper reports, to compare sites that were fitted with different methods.
- **Correct for air density** at high or hot sites, a common gap in published resource studies that use 1.225 kg/m³.
- **Fit your own data**: paste a year of hourly speeds and the tool finds k and c by maximum likelihood, the method the paper's comparison includes.
- **Screen hub heights and turbines** for small-scale projects before a full study, with the maker's power curve pasted in.
- **Teach** why a mean speed alone is not enough: two sites with the same mean but different k have different power.

## The fine print

- One year of data at one station; wind varies from year to year by several per cent, and the station is some distance from the village.
- The 1/7 shear law is a rule of thumb; real shear depends on the ground, trees and buildings, and on the time of day.
- The turbine is made up, and the energy is before availability and other losses, which usually take 10 to 20% off.
- Our k and c match the paper's summary numbers but are not any of its six fitted pairs.
