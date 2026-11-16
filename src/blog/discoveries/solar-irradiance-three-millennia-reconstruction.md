---
title: "The Sun's brightness over 3,000 years: how much has it changed?"
summary: "A new reconstruction finds the Sun's total output has changed by only about 1 W/m² between 50-year averages in three millennia. We use fibub's Blackbody calculator and Energy balance model to see what that means for the Sun and for Earth."
tools: [blackbody-calculator, energy-balance-model]
updated: 2026-11-16
sources:
  - "Temaj, D., Krivova, N. A., Solanki, S. K., Usoskin, I. G. and Chatzistergos, T. (2026), Reconstruction of annual solar irradiance over the last three millennia, Astronomy & Astrophysics 710, L24 (Letter), published online 16 June 2026, doi:10.1051/0004-6361/202659432. Licence CC BY 4.0 (checked on the A&A page, 2026-11-16). Value used here, from the abstract: the difference between the highest and lowest 50-year running means of total solar irradiance over the last three millennia, 1.04 (−0.20, +0.14) W/m². Method from the paper's Figure 1 caption: annual sunspot numbers from telescope records and from carbon-14 in tree rings, turned into magnetic flux and then irradiance."
  - "The Sun's effective temperature 5772 K, radius and luminosity 3.828 × 10²⁶ W: IAU 2015 Resolution B3 nominal values, used by the Blackbody calculator. 1 au = 149,597,870.7 km (IAU 2012)."
  - "CO₂ forcing 5.35 ln(C/C₀) W/m²: Myhre, G. et al. (1998), Geophysical Research Letters 25, 2715, used by the Energy balance model. CO₂ of 280 ppm before industry and about 420 ppm in the 2020s: NOAA Global Monitoring Laboratory global means, rounded."
  - "Energy balance model settings (albedo 0.3, emissivity 0.612, feedback 1.2 W/m²/K, 100 m ocean layer): the tool's defaults, our choice."
paper:
  title: "Reconstruction of annual solar irradiance over the last three millennia"
  authors: "Temaj, D.; Krivova, N. A.; Solanki, S. K.; Usoskin, I. G.; Chatzistergos, T."
  journal: "Astronomy & Astrophysics"
  year: 2026
  doi: "10.1051/0004-6361/202659432"
  url: "https://doi.org/10.1051/0004-6361/202659432"
  licence: "CC BY 4.0"
  reviewed: true
---

The Sun is not quite constant. Its total output at Earth's distance, about 1,361 watts on every square metre facing it, rises and falls with the 11-year sunspot cycle and drifts over centuries. Satellites have measured it only since 1978, so how much it changed before then has to be reconstructed. A team has now built a year-by-year record for the last 3,000 years. This article shows how the [[blackbody-calculator]] and the [[energy-balance-model]] turn the paper's headline number into something you can picture.

## The paper in brief

The output the paper studies is the **total solar irradiance** (TSI): all the Sun's light, at every wavelength, arriving at the top of Earth's air at Earth's average distance. Sunspots dim the Sun a little, but bright magnetic patches called faculae brighten it more, so a more active Sun is slightly brighter overall.

The team combined two records of activity: sunspot numbers counted at telescopes since the 1600s, and sunspot numbers worked out from **carbon-14 in tree rings**, which records the cosmic rays that a quiet Sun lets through. They turned these into the Sun's magnetic flux and then into irradiance, at a resolution of one year. Their main result: across three millennia, the highest and lowest **50-year averages** differ by only **1.04 W/m²** (between 0.84 and 1.18), less than a tenth of a percent.

Why it matters: climate models need the Sun's past output as an input. A small long-term range means the Sun's slow changes are a modest player next to other causes of climate change.

## Checked with the tools

We used the paper's 1.04 W/m², the Sun's standard temperature and radius, and the Energy balance model's default settings.

**Step 1: the Sun's output at Earth.** The Blackbody calculator gives a 5,772 K star with the Sun's radius a power of 3.828 × 10²⁶ W. Spread over a sphere 1 au across, that is **1,361.2 W/m²**, the measured TSI. So the blackbody picture is a fair stand-in for the Sun's total output.

**Step 2: what 1.04 W/m² means for the Sun.** It is **0.076%** of the total. Because a blackbody's output goes as the fourth power of its temperature, the same change would come from the Sun's surface being only **1.1 K hotter** (0.9 to 1.25 K over the paper's range), out of 5,772 K (Figure 1). In reality the change comes from magnetic patches on the surface, not from heating the whole Sun, but the comparison shows how small it is.

<!-- fig:sun -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 280" role="img" aria-label="A 1.04 W/m² rise in irradiance is the same as the Sun's surface being 1.10 K hotter." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How much hotter the Sun would have to be</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How much hotter the Sun would have to be</text><rect x="253.2" y="32" width="203" height="202" style="fill:var(--accent-soft)"/><text x="354.7" y="46" text-anchor="middle" style="fill:var(--muted)">paper: 1.04 W/m²</text><line x1="58" x2="546" y1="219.1" y2="219.1" style="stroke:var(--line)"/><text x="52" y="223.1" text-anchor="end" style="fill:var(--muted)">5.77e+3</text><line x1="58" x2="546" y1="151" y2="151" style="stroke:var(--line)"/><text x="52" y="155" text-anchor="end" style="fill:var(--muted)">5.77e+3</text><line x1="58" x2="546" y1="82.9" y2="82.9" style="stroke:var(--line)"/><text x="52" y="86.9" text-anchor="end" style="fill:var(--muted)">5.77e+3</text><line x1="123.8" x2="123.8" y1="234" y2="238" style="stroke:var(--muted)"/><text x="123.8" y="251" text-anchor="middle" style="fill:var(--muted)">1.36e+3</text><line x1="221.4" x2="221.4" y1="234" y2="238" style="stroke:var(--muted)"/><text x="221.4" y="251" text-anchor="middle" style="fill:var(--muted)">1.36e+3</text><line x1="319" x2="319" y1="234" y2="238" style="stroke:var(--muted)"/><text x="319" y="251" text-anchor="middle" style="fill:var(--muted)">1.36e+3</text><line x1="416.6" x2="416.6" y1="234" y2="238" style="stroke:var(--muted)"/><text x="416.6" y="251" text-anchor="middle" style="fill:var(--muted)">1.36e+3</text><line x1="514.2" x2="514.2" y1="234" y2="238" style="stroke:var(--muted)"/><text x="514.2" y="251" text-anchor="middle" style="fill:var(--muted)">1.36e+3</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--muted)"/><text x="302" y="272" text-anchor="middle" style="fill:var(--ink)">Irradiance at 1 au (W/m²)</text><text transform="translate(14 133) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Sun's effective temperature (K)</text><path d="M58 223.2L70.3 218.7L82.4 214.2L94.7 209.6L106.8 205.1L119.1 200.6L131.2 196.1L143.5 191.6L155.6 187.1L167.9 182.6L180 178.1L192.3 173.6L204.4 169L216.7 164.5L228.8 160L241.1 155.5L253.2 151L265.5 146.5L277.6 142L289.9 137.5L302 133L314.3 128.5L326.4 124L338.7 119.4L350.8 114.9L363.1 110.4L375.2 105.9L387.5 101.4L399.6 96.9L411.9 92.4L424 87.9L436.3 83.4L448.4 78.9L460.7 74.4L472.8 69.9L485.1 65.3L497.2 60.8L509.5 56.3L521.6 51.8L533.9 47.3L546 42.8" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/></svg><figcaption>Figure 1. The Sun's effective temperature needed for each irradiance at Earth's distance, from the Blackbody calculator's maths (radius fixed at one solar radius). The shaded band is the paper's largest change between 50-year means.</figcaption></figure>
<!-- /fig:sun -->

**Step 3: what it means for Earth.** Earth is a sphere and reflects about 30% of sunlight, so a 1.04 W/m² change in TSI becomes a global average forcing of 1.04 × 0.7 ÷ 4 = **0.18 W/m²** (0.15 to 0.21). In the Energy balance model, raising the solar constant by 1.04 W/m² lifts Earth's equilibrium temperature from 287.83 to 287.88 K: **0.055 K** with only the extra heat radiated away. With the model's default feedback, which allows for water vapour and other amplifiers, the warming is **0.15 K**, reached within a few decades (the e-folding time is 11 years; Figure 2).

**Step 4: compared with carbon dioxide.** The same model gives the rise in CO₂ from 280 to 420 ppm a forcing of **2.17 W/m²**, about **12 times** the paper's largest 50-year solar change, and an eventual warming of about 1.8 K in this simple model. The Sun's slow drifts are real, but small next to that.

<!-- fig:earth -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="With the Energy balance model's default feedback, the paper's largest solar change warms Earth by 0.15 K; the CO₂ rise since industry by 1.81 K." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Warming from a step in forcing</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Warming from a step in forcing</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="201.5" y2="201.5" style="stroke:var(--line)"/><text x="52" y="205.5" text-anchor="end" style="fill:var(--muted)">0.5</text><line x1="58" x2="546" y1="151" y2="151" style="stroke:var(--line)"/><text x="52" y="155" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="100.5" y2="100.5" style="stroke:var(--line)"/><text x="52" y="104.5" text-anchor="end" style="fill:var(--muted)">1.5</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="180" x2="180" y1="252" y2="256" style="stroke:var(--muted)"/><text x="180" y="269" text-anchor="middle" style="fill:var(--muted)">50</text><line x1="302" x2="302" y1="252" y2="256" style="stroke:var(--muted)"/><text x="302" y="269" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="424" x2="424" y1="252" y2="256" style="stroke:var(--muted)"/><text x="424" y="269" text-anchor="middle" style="fill:var(--muted)">150</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Years after the step</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Warming (K)</text><path d="M58 252L62.9 249.5L67.8 247.3L72.6 245.6L77.5 244.1L82.4 242.9L87.3 241.8L92.2 241L97 240.3L101.9 239.7L106.8 239.2L111.7 238.8L116.6 238.4L121.4 238.1L126.3 237.9L131.2 237.7L136.1 237.5L141 237.4L145.8 237.3L150.7 237.2L155.6 237.1L160.5 237L165.4 237L170.2 236.9L175.1 236.9L180 236.9L184.9 236.8L189.8 236.8L194.6 236.8L199.5 236.8L204.4 236.7L209.3 236.7L214.2 236.7L219 236.7L223.9 236.7L228.8 236.7L233.7 236.7L238.6 236.7L243.4 236.7L248.3 236.7L253.2 236.7L258.1 236.7L263 236.7L267.8 236.7L272.7 236.7L277.6 236.7L282.5 236.7L287.4 236.7L292.2 236.7L297.1 236.7L302 236.7L306.9 236.7L311.8 236.7L316.6 236.7L321.5 236.7L326.4 236.7L331.3 236.7L336.2 236.7L341 236.7L345.9 236.7L350.8 236.7L355.7 236.7L360.6 236.7L365.4 236.7L370.3 236.7L375.2 236.7L380.1 236.7L385 236.7L389.8 236.7L394.7 236.7L399.6 236.7L404.5 236.7L409.4 236.7L414.2 236.7L419.1 236.7L424 236.7L428.9 236.7L433.8 236.7L438.6 236.7L443.5 236.7L448.4 236.7L453.3 236.7L458.2 236.7L463 236.7L467.9 236.7L472.8 236.7L477.7 236.7L482.6 236.7L487.4 236.7L492.3 236.7L497.2 236.7L502.1 236.7L507 236.7L511.8 236.7L516.7 236.7L521.6 236.7L526.5 236.7L531.4 236.7L536.2 236.7L541.1 236.7L546 236.7" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 252L62.9 221.7L67.8 196.5L72.6 175.4L77.5 157.9L82.4 143.2L87.3 131L92.2 120.8L97 112.3L101.9 105.2L106.8 99.2L111.7 94.3L116.6 90.2L121.4 86.7L126.3 83.9L131.2 81.5L136.1 79.5L141 77.8L145.8 76.4L150.7 75.3L155.6 74.3L160.5 73.5L165.4 72.8L170.2 72.3L175.1 71.8L180 71.4L184.9 71.1L189.8 70.8L194.6 70.6L199.5 70.4L204.4 70.2L209.3 70.1L214.2 70L219 69.9L223.9 69.8L228.8 69.7L233.7 69.7L238.6 69.6L243.4 69.6L248.3 69.6L253.2 69.6L258.1 69.5L263 69.5L267.8 69.5L272.7 69.5L277.6 69.5L282.5 69.5L287.4 69.5L292.2 69.5L297.1 69.5L302 69.4L306.9 69.4L311.8 69.4L316.6 69.4L321.5 69.4L326.4 69.4L331.3 69.4L336.2 69.4L341 69.4L345.9 69.4L350.8 69.4L355.7 69.4L360.6 69.4L365.4 69.4L370.3 69.4L375.2 69.4L380.1 69.4L385 69.4L389.8 69.4L394.7 69.4L399.6 69.4L404.5 69.4L409.4 69.4L414.2 69.4L419.1 69.4L424 69.4L428.9 69.4L433.8 69.4L438.6 69.4L443.5 69.4L448.4 69.4L453.3 69.4L458.2 69.4L463 69.4L467.9 69.4L472.8 69.4L477.7 69.4L482.6 69.4L487.4 69.4L492.3 69.4L497.2 69.4L502.1 69.4L507 69.4L511.8 69.4L516.7 69.4L521.6 69.4L526.5 69.4L531.4 69.4L536.2 69.4L541.1 69.4L546 69.4" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Solar, 0.18 W/m²</text><line x1="199.2" x2="211.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="215.2" y="40" style="fill:var(--muted)">CO₂ 280 to 420 ppm, 2.17 W/m²</text></svg><figcaption>Figure 2. Warming after a sudden, lasting change in forcing, from the Energy balance model's linear model with its default feedback (λ = 1.2 W/m²/K) and a 100 m ocean layer. A teaching model, not a climate projection.</figcaption></figure>
<!-- /fig:earth -->

| Check | Paper | Our tool result |
|---|---|---|
| Range of 50-year mean TSI | 1.04 (−0.20, +0.14) W/m² | 0.076% of 1,361.2 W/m² |
| Same change as a hotter Sun | (not in abstract) | 1.1 K (0.9 to 1.25 K) |
| Global forcing on Earth | (not in abstract) | 0.18 W/m² |
| Earth's warming | (not in abstract) | 0.055 K without feedbacks, 0.15 K with |
| Today's CO₂ forcing, for scale | (not in abstract) | 2.17 W/m², 12 times larger |

## How we made the graphs

The charts and every number above come from `scripts/blog-figures/solar-irradiance-three-millennia-reconstruction.mjs` in fibub's public code. It calls the tools' own functions:

- `star` and the solar constants from `src/lib/sci/blackbody.ts`, the maths behind the [[blackbody-calculator]].
- `eqTemp`, `co2Forcing`, `linearStep`, `heatCap` and `efold` from `src/lib/sci/ebm.ts`, the maths behind the [[energy-balance-model]].

Where the inputs come from: 1.04 W/m² and its range are the paper's; the Sun's temperature, radius and luminosity are the IAU's nominal values; the CO₂ amounts are NOAA's, rounded; albedo, emissivity, feedback and ocean depth are the Energy balance model's defaults, which are our choice. Figure 2 shows a sudden, lasting change for clarity; real solar changes rise and fall over decades.

## How we test the maths

On every change to fibub, `tests/sci.mjs` and `tests/sci-tools/energy-balance-model.mjs` check these functions against known answers:

- The blackbody maths must give a 5,772 K star of one solar radius a luminosity of **1 Sun** and an absolute magnitude of 4.82.
- The energy balance model must give an equilibrium of **287.83 K** for S = 1,361 W/m², albedo 0.3 and emissivity 0.612, and **254.58 K** with emissivity 1, from the closed-form answer.
- CO₂ doubling must give **3.708 W/m²**, and 100 m of water must store 418 MJ/m² per kelvin, giving an e-folding time of **11.04 years** at λ = 1.2.

## Check it yourself

**The Sun, on the [[blackbody-calculator]]:** choose *The temperature (K)*, type **5772**, then **1** in *Radius (Suns)*. *Luminosity* reads **1 Sun** (3.828 × 10²⁶ W). Type **5773.1** instead, 1.1 K hotter: it reads about **1.001 Suns**, the 0.076% change of Step 2.

**Earth, on the [[energy-balance-model]]:**

1. Leave *Solar constant S (W/m²)* at **1361**, *Albedo α (ice-free)* at **0.3** and *Effective emissivity ε* at **0.612**.
2. Set *New CO₂ C (ppm)* to **280**, the same as *Starting CO₂ C₀ (ppm)*, so CO₂ does not change. *Equilibrium after the change* reads **14.68 °C** (287.83 K).
3. Change *Solar constant S (W/m²)* to **1362**. It now reads **14.73 °C** (287.88 K): about 0.05 K warmer for 1 W/m² more sunlight, without extra feedbacks.
4. Put the solar constant back to **1361** and set *New CO₂ C (ppm)* to **420**. *CO₂ forcing F* reads **2.17 W/m²**.

## What researchers can use it for

- **Put a forcing in context**: compare a change in solar output with a change in CO₂, in W/m², in one model.
- **Turn irradiance into temperature**, and back, for the Sun or any star, with the Stefan–Boltzmann law.
- **Teach** why a 0.1% change in the Sun matters much less than doubling CO₂, with numbers students can change.
- **Sanity-check a paper's figure**: is a quoted solar or climate number the right size?

## The fine print

- We used only the abstract's headline number; the paper's year-by-year series and its 11-year cycles are not reproduced here.
- The 1.04 W/m² is the range of 50-year averages. Within one 11-year cycle, TSI changes by a similar amount, but that swings up and down too fast for the oceans to follow fully.
- The Energy balance model is a single-number, whole-Earth model for teaching. Its warming figures show sizes, not predictions; real climate sensitivity is uncertain.
- The "hotter Sun" in Step 2 is a comparison only: the Sun's brightness changes come from magnetic regions on its surface.
