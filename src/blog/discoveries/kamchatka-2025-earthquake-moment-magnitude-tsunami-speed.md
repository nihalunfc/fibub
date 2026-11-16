---
title: "Kamchatka 2025: how big was the M8.8 earthquake, and how fast did its tsunami travel?"
summary: "Satellite radar, GPS and deep-sea tsunami gauges suggest the July 2025 Kamchatka earthquake slipped less near the trench than first thought. We check its magnitude, slip and tsunami speed with fibub's earthquake and wave tools."
tools: [earthquake-locator, wave-calculator]
updated: 2026-11-16
sources:
  - "Tang, C.-H., Fukushima, Y., Okada, Y. and Mizutani, A. (2026), Lateral extent of coseismic slip and limited shallow rupture during the 29 July 2025 Kamchatka earthquake illuminated by geodetic and tsunami data, Geoscience Letters, published 17 April 2026, doi:10.1186/s40562-026-00471-4. Licence CC BY 4.0, checked on the article PDF, 2026-11-16. Values used here: geodetic seismic moments 2.0 × 10²², 1.7 × 10²² and 1.4 × 10²² N·m for models A, B and C (Mw 8.8, 8.7, 8.7); shear modulus 40 GPa; rupture extending at least 480 km southwest of the mainshock; peak slip about 9 to 11 m; fault model 720 km by 240 km; DART stations 21416 and 21419; band-pass filter 500 to 10,000 s; modelled first peaks at DART 21416 arriving about 90 to 210 s early; GNSS offsets up to about 1.7 m horizontal and 0.2 m subsidence."
  - "Mw 9.0 for the 1952 Kamchatka earthquake: as quoted in the Tohoku University press release on the paper (30 April 2026) and in standard catalogues."
  - "Dispersion seen in the same tsunami by the SWOT satellite: Ruiz-Angulo, A. et al. (2025), SWOT satellite altimetry observations and source model for the tsunami from the 2025 M 8.8 Kamchatka earthquake, The Seismic Record 5(4), 341, doi:10.1785/0320250037 (context only; no values used)."
  - "Moment magnitude formula Mw = (2/3)(log10 M0 − 9.1), M0 in N·m: IASPEI (2013) standard, as used by the Earthquake locator."
paper:
  title: "Lateral extent of coseismic slip and limited shallow rupture during the 29 July 2025 Kamchatka earthquake illuminated by geodetic and tsunami data"
  authors: "Tang, C.-H.; Fukushima, Y.; Okada, Y.; Mizutani, A."
  journal: "Geoscience Letters"
  year: 2026
  doi: "10.1186/s40562-026-00471-4"
  url: "https://geoscienceletters.springeropen.com/articles/10.1186/s40562-026-00471-4"
  licence: "CC BY 4.0"
  reviewed: true
---

On 29 July 2025 the seafloor off Kamchatka, in Russia's far east, slipped in one of the largest earthquakes ever recorded: magnitude 8.8. A tsunami crossed the Pacific, but it was smaller than the first warnings feared. A team from Tohoku University has now used satellite radar, GPS and deep-sea tsunami gauges to map where the fault moved, and found that it moved less close to the trench than some early models said. This article shows how the [[earthquake-locator]] and the [[wave-calculator]] let anyone check the size of the earthquake, the slip it needs and how fast its tsunami travelled.

## The paper in brief

Kamchatka sits where the Pacific plate dives under the Okhotsk plate, at about 84 mm a year. The 2025 earthquake broke the same stretch of plate boundary as a magnitude 9.0 earthquake in 1952. The team combined three kinds of data:

- **Satellite radar (InSAR)** from ALOS-2 and Sentinel-1, which measures how far the ground moved towards or away from the satellite: about a metre.
- **GPS (GNSS) stations** on land, which moved up to about 1.7 m towards the sea and sank about 0.2 m.
- **DART buoys** 21416 and 21419, pressure gauges on the deep seafloor that record the tsunami passing overhead.

They modelled the plate boundary as a curved surface 720 km long and 240 km wide, cut into 108 patches, with a rock stiffness (shear modulus, or rigidity) of 40 GPa. Three slip models fit the land data about equally well. Model A puts the most slip, about 11 m, at 9 to 13 km depth; models B and C put it deeper. The slip runs at least 480 km to the southwest of where the rupture started. The tsunami timing argues against the shallowest model: it sent its first wave to DART 21416 about 3.5 minutes too early. The team's conclusion: **a geodetic magnitude of about Mw 8.7**, with only limited slip near the trench. That matters for hazard planning, because shallow slip near the trench is what lifts the most seawater.

## Checked with the tools

We used the paper's seismic moments, rigidity, rupture length and filter band, and fibub's maths. Everything else (the rupture width, the ocean depth, the example wave) is our own round number and labelled as such.

**Step 1: from seismic moment to magnitude.** The **seismic moment** M0 measures an earthquake's size directly: rigidity × slipped area × average slip, in newton metres. The **moment magnitude** Mw turns it into the familiar scale with Mw = (2/3)(log10 M0 − 9.1). The Earthquake locator's maths gives **Mw 8.80** for model A (2.0 × 10²² N·m), **8.75** for model B and **8.70** for model C (Figure 1). Model B sits exactly on the boundary between 8.7 and 8.8 when rounded. Model A releases 1.43 times the moment of model C, yet the magnitudes differ by only 0.1: the scale is logarithmic, and every step of 1 in Mw means about 32 times the moment.

<!-- fig:mw -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Moment magnitude rises by 2/3 for every tenfold rise in seismic moment. The paper's models A, B and C sit at Mw 8.80, 8.75, 8.70." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Seismic moment and moment magnitude</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Seismic moment and moment magnitude</text><line x1="58" x2="546" y1="256.1" y2="256.1" style="stroke:var(--line)"/><text x="52" y="260.1" text-anchor="end" style="fill:var(--muted)">8</text><line x1="58" x2="546" y1="176.9" y2="176.9" style="stroke:var(--line)"/><text x="52" y="180.9" text-anchor="end" style="fill:var(--muted)">8.5</text><line x1="58" x2="546" y1="97.6" y2="97.6" style="stroke:var(--line)"/><text x="52" y="101.6" text-anchor="end" style="fill:var(--muted)">9</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">1e21</text><line x1="180" x2="180" y1="272" y2="276" style="stroke:var(--muted)"/><text x="180" y="289" text-anchor="middle" style="fill:var(--muted)">3.2e21</text><line x1="302" x2="302" y1="272" y2="276" style="stroke:var(--muted)"/><text x="302" y="289" text-anchor="middle" style="fill:var(--muted)">1e22</text><line x1="424" x2="424" y1="272" y2="276" style="stroke:var(--muted)"/><text x="424" y="289" text-anchor="middle" style="fill:var(--muted)">3.2e22</text><line x1="546" x2="546" y1="272" y2="276" style="stroke:var(--muted)"/><text x="546" y="289" text-anchor="middle" style="fill:var(--muted)">1e23</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Seismic moment M0 (N·m, log scale)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Moment magnitude Mw</text><line x1="58" x2="546" y1="97.6" y2="97.6" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="92.6" text-anchor="end" style="fill:var(--muted)">1952 Kamchatka, Mw 9.0</text><path d="M58 266.8L70.2 261.4L82.4 256.1L94.6 250.9L106.8 245.5L119 240.3L131.2 235.1L143.4 229.7L155.6 224.4L167.8 219.2L180 213.8L192.2 208.6L204.4 203.3L216.6 197.9L228.8 192.7L241 187.5L253.2 182.1L265.4 176.9L277.6 171.6L289.8 166.2L302 161L314.2 155.8L326.4 150.4L338.6 145.1L350.8 139.9L363 134.5L375.2 129.3L387.4 124.1L399.6 118.7L411.8 113.4L424 108.2L436.2 102.8L448.4 97.6L460.6 92.3L472.8 86.9L485 81.7L497.2 76.5L509.4 71.1L521.6 65.9L533.8 60.6L546 55.2" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="375.5" cy="129.1" r="5" style="fill:var(--c-tools);opacity:1"/><circle cx="358.2" cy="136.6" r="5" style="fill:var(--c-tools);opacity:1"/><circle cx="337.7" cy="145.6" r="5" style="fill:var(--c-tools);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Mw = (2/3)(log10 M0 − 9.1)</text><circle cx="276.2" cy="36" r="4" style="fill:var(--c-tools)"/><text x="287.2" y="40" style="fill:var(--muted)">The paper's three slip models</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Moment magnitude from the Earthquake locator's maths, with the three geodetic seismic moments reported in the paper. The 1952 earthquake's Mw 9.0 is the commonly quoted catalogue value.</figcaption></figure>
<!-- /fig:mw -->

**Step 2: how much slip is that?** Turn the formula round. If the slip were spread over the paper's 480 km of length and an assumed 150 km of width (our choice, inside the 240 km model), the average slip would be **6.9 m** for model A, **5.9 m** for B and **4.9 m** for C, using the paper's 40 GPa. That sits comfortably below the paper's peak slip of 9 to 11 m, as an average should. The rigidity matters: with the tool's default of 30 GPa, the same 2.0 × 10²² N·m would need 9.3 m of average slip, and the same slip would give a magnitude **0.083 lower**. That is about as big as the gap between models A and C, so always check which rigidity a paper used before comparing magnitudes.

**Step 3: how fast does the tsunami travel?** A tsunami is a water wave whose length is far greater than the ocean is deep, so it is a "shallow-water" wave even over the abyss. Its speed is then √(g × h), gravity times depth. In an assumed 5,000 m of water that is **221 m/s, or about 800 km/h**: an airliner's speed. Crossing 1,000 km (our round number) takes **75 minutes**.

But that is only exact for the longest waves. Shorter waves go slower, an effect called **dispersion**. The Wave calculator solves the full linear wave equation, so it shows the slowing (Figure 2). In 5,000 m of water:

- a **1,000 s** wave is 221 km long and its energy travels at 219 m/s, about 46 seconds behind the long-wave speed over 1,000 km;
- a **600 s** wave is 132 km long; its energy travels at 215 m/s and falls **about 2 minutes** behind over 1,000 km;
- a **300 s** wave is 64 km long and falls **9 minutes** behind.

<!-- fig:speed -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Below about 300 seconds a tsunami in 5 km of water travels noticeably slower than the long-wave speed of 221 m/s; above 1,000 seconds it is within 1%." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How fast a tsunami travels in 5 km of water</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How fast a tsunami travels in 5 km of water</text><rect x="257.4" y="50" width="288.6" height="222" style="fill:var(--accent-soft)"/><text x="401.7" y="64" text-anchor="middle" style="fill:var(--muted)">periods the paper kept</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="200.4" y2="200.4" style="stroke:var(--line)"/><text x="52" y="204.4" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="128.8" y2="128.8" style="stroke:var(--line)"/><text x="52" y="132.8" text-anchor="end" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="57.2" y2="57.2" style="stroke:var(--line)"/><text x="52" y="61.2" text-anchor="end" style="fill:var(--muted)">100</text><line x1="102.4" x2="102.4" y1="272" y2="276" style="stroke:var(--muted)"/><text x="102.4" y="289" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="208.2" x2="208.2" y1="272" y2="276" style="stroke:var(--muted)"/><text x="208.2" y="289" text-anchor="middle" style="fill:var(--muted)">300</text><line x1="324.2" x2="324.2" y1="272" y2="276" style="stroke:var(--muted)"/><text x="324.2" y="289" text-anchor="middle" style="fill:var(--muted)">1000</text><line x1="430" x2="430" y1="272" y2="276" style="stroke:var(--muted)"/><text x="430" y="289" text-anchor="middle" style="fill:var(--muted)">3000</text><line x1="546" x2="546" y1="272" y2="276" style="stroke:var(--muted)"/><text x="546" y="289" text-anchor="middle" style="fill:var(--muted)">10000</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Wave period (s, log scale)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Speed as % of √(gh)</text><line x1="58" x2="546" y1="57.2" y2="57.2" style="stroke:var(--muted);stroke-dasharray:4 4"/><path d="M58 256L64.7 244.6L71.3 232.6L78 219.8L84.6 206.5L91.3 192.9L97.9 179.4L104.6 166.3L111.2 154L117.9 142.6L124.5 132.2L131.2 122.9L137.9 114.6L144.5 107.3L151.2 100.9L157.8 95.3L164.5 90.4L171.1 86.1L177.8 82.4L184.4 79.1L191.1 76.3L197.7 73.8L204.4 71.7L211.1 69.8L217.7 68.2L224.4 66.7L231 65.5L237.7 64.4L244.3 63.5L251 62.7L257.6 62L264.3 61.3L270.9 60.8L277.6 60.3L284.3 59.9L290.9 59.6L297.6 59.2L304.2 59L310.9 58.7L317.5 58.6L324.2 58.4L330.8 58.2L337.5 58.1L344.1 57.9L350.8 57.8L357.5 57.8L364.1 57.7L370.8 57.6L377.4 57.6L384.1 57.5L390.7 57.4L397.4 57.4L404 57.4L410.7 57.4L417.3 57.3L424 57.3L430.7 57.3L437.3 57.3L444 57.3L450.6 57.2L457.3 57.2L463.9 57.2L470.6 57.2L477.2 57.2L483.9 57.2L490.5 57.2L497.2 57.2L503.9 57.2L510.5 57.2L517.2 57.2L523.8 57.2L530.5 57.2L537.1 57.2L543.8 57.2" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 335.6L64.7 329.7L71.3 323.2L78 315.9L84.6 307.3L91.3 297.3L97.9 285.6L104.6 272.4L111.2 257.9L117.9 242.6L124.5 227L131.2 211.5L137.9 196.5L144.5 182.2L151.2 168.9L157.8 156.7L164.5 145.5L171.1 135.4L177.8 126.2L184.4 118L191.1 110.7L197.7 104.2L204.4 98.4L211.1 93.3L217.7 88.9L224.4 84.9L231 81.4L237.7 78.4L244.3 75.7L251 73.3L257.6 71.3L264.3 69.5L270.9 67.9L277.6 66.5L284.3 65.3L290.9 64.3L297.6 63.4L304.2 62.6L310.9 61.9L317.5 61.3L324.2 60.7L330.8 60.3L337.5 59.9L344.1 59.5L350.8 59.2L357.5 59L364.1 58.7L370.8 58.5L377.4 58.3L384.1 58.2L390.7 58.1L397.4 57.9L404 57.8L410.7 57.8L417.3 57.7L424 57.6L430.7 57.6L437.3 57.5L444 57.4L450.6 57.4L457.3 57.4L463.9 57.4L470.6 57.3L477.2 57.3L483.9 57.3L490.5 57.3L497.2 57.3L503.9 57.2L510.5 57.2L517.2 57.2L523.8 57.2L530.5 57.2L537.1 57.2L543.8 57.2" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Crests (phase speed)</text><line x1="228" x2="240" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="244" y="40" style="fill:var(--muted)">Energy (group speed)</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Tsunami speed against period from the Wave calculator's linear wave maths, in an assumed 5,000 m of water. The shaded band is the range of periods the paper kept when filtering its DART records.</figcaption></figure>
<!-- /fig:speed -->

The paper filtered its DART records to keep periods of 500 to 10,000 seconds, the range where the long-wave speed is within a few per cent. Even so, delays of a minute or two over an ocean crossing are the same size as the 1.5 to 3.5 minute timing misfits the team reports. The paper handles those misfits by shifting the model's start time and does not blame dispersion; we show this only as a reminder that small speed effects add up. The SWOT satellite did see this tsunami spread into a leading wave and a train of shorter ones (Ruiz-Angulo and others, 2025).

**Step 4: why it grows at the coast.** As depth falls, the wave slows and bunches up, so its height rises. For an example wave (600 s period, 0.3 m high in 5,000 m of water, our numbers, not the paper's) the Wave calculator's shoaling maths gives **0.79 m in 100 m of water** and **1.40 m in 10 m of water**, a growth factor of 4.66. The simple rule for long waves, Green's law, (5000 ÷ 10)^¼ = 4.73, agrees to within 2%. Real coasts add refraction, harbour resonance and breaking, which the calculator does not model for tsunamis.

| Check | Paper | Our tool result |
|---|---|---|
| Magnitude, model A | 2.0 × 10²² N·m, Mw 8.8 | Mw 8.80 |
| Magnitude, model B | 1.7 × 10²² N·m, Mw 8.7 | Mw 8.75 |
| Magnitude, model C | 1.4 × 10²² N·m, Mw 8.7 | Mw 8.70 |
| Peak slip | about 9 to 11 m | average 4.9 to 6.9 m over an assumed 480 × 150 km |
| Effect of rigidity 40 vs 30 GPa | 40 GPa used | Mw shifts by 0.083 |
| Long-wave speed, 5 km deep | (not given) | 221 m/s, 797 km/h |
| Energy delay of a 600 s wave over 1,000 km | first peaks misfit by 90 to 210 s | about 128 s (illustration only) |

## How we made the graphs

The charts and every number above come from `scripts/blog-figures/kamchatka-2025-earthquake-moment-magnitude-tsunami-speed.mjs` in fibub's public code. It calls the tools' own functions:

- `momentMagnitude` and `seismicMoment` from `src/lib/sci/quake.ts`, the maths behind the Moment magnitude card of the [[earthquake-locator]].
- `wave` (dispersion, phase and group speed) and `transform` (shoaling) from `src/lib/sci/waves.ts`, the maths behind the [[wave-calculator]].

Inputs from the paper: the three seismic moments, the 40 GPa rigidity, the 480 km rupture length and the 500 to 10,000 s filter band. Our assumptions, labelled in the script: a 150 km slipping width, a 5,000 m ocean, a 1,000 km crossing and a 0.3 m, 600 s example wave. Run the script and it prints every number and redraws both charts.

## How we test the maths

On every change to fibub, the tests check these functions against known answers:

- `tests/sci-tools/earthquake-locator.mjs`: a seismic moment of 10¹⁸ N·m must give Mw 5.93, and a 10 km × 5 km fault with 0.5 m of slip at 30 GPa must give Mw 5.85 (and back again to 7.5 × 10¹⁷ N·m).
- `tests/sci.mjs`: the Wave calculator's wavelength for an 8 s wave in 5 m of water must match SciPy's 53.07145 m to nine decimal places, and in very shallow water the speed must tend to √(g h).
- `tests/sci.mjs`: shoaling a 10 s, 2 m wave from 50 m to 5 m depth must give a shoaling factor of 1.162573, as computed independently in SciPy.

## Check it yourself

**The magnitude, on the [[earthquake-locator]]:**

1. Scroll to the **Moment magnitude Mw** card. Leave *Work from* on **seismic moment M0**.
2. Type **2.0e22** in *Seismic moment M0 (N·m)*. It reads **Mw 8.80**. Try **1.7e22** (8.75) and **1.4e22** (8.70).
3. Switch *Work from* to **fault size and slip**. Type **480** in *Fault length (km)*, **150** in *Fault width (km)*, **6.94** in *Average slip (m)* and **40** in *Rigidity μ (GPa)*. It reads **Mw 8.80** again. Change the rigidity to **30** and it drops to **Mw 8.72**.

**The tsunami speed, on the [[wave-calculator]]:**

1. Type **600** in *Wave period T (s)*, **0.3** in *Wave height H (m)* and **5000** in *Water depth where H is measured (m)*.
2. The headline reads **Wavelength 131622 m, speed 219 m/s in 5000 m of water (shallow water)**: a wave 132 km long. *Group speed Cg* shows about **215 m/s**.
3. Type **10** in *Shallower depth to carry the wave to (m)*. The height there reads **1.40 m**, with shoaling Ks = 4.663. The calculator also says this wave would break in about 2.5 m of water. For a tsunami, treat these coastal numbers as a rough guide only.

## What researchers can use it for

- **Compare magnitudes across papers:** convert each reported seismic moment with the [[earthquake-locator]], and check which rigidity was used before comparing.
- **Sanity-check a slip model:** the fault size and slip mode tells you whether a reported average slip and area really add up to the stated magnitude.
- **Estimate tsunami travel times and dispersion:** the [[wave-calculator]] gives phase and group speeds for any period and depth, so you can see which periods behave as true long waves.
- **Teach** why the magnitude scale is logarithmic and why tsunamis grow near the coast.

## The fine print

- The seismic moments, rigidity, rupture length and filter band are from the paper. The 150 km width, 5,000 m depth, 1,000 km distance and example wave are our assumptions, not measurements.
- Our travel-time delays use linear wave theory on a flat ocean of one depth. Real tsunami models also include the Earth's curvature, the varying seafloor and, in some studies, the stretch of the solid Earth under the water's weight, which also slows tsunamis slightly.
- We did not redo the paper's inversion of the radar, GPS and tsunami data. Our checks confirm the arithmetic linking its numbers, not its slip map.
- This is general science education, not a hazard or evacuation guide. In a real tsunami warning, follow your local authorities.
