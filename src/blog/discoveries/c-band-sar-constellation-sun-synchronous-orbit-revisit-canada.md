---
title: "A next-generation C-band SAR for Canada: the orbit and revisit, checked"
summary: "A 2025 design study proposes three or five C-band radar satellites in a Sentinel-1-like orbit, with revisit under 4 to 6 hours over Canada. We recompute the orbit, the 49.3-minute phasing and the revisit from the ground track."
tools: [satellite-tracker, orbit-elements, link-budget-calculator, rocket-equation]
updated: 2026-11-24
sources:
  - "Zakharov, I., Power, D., McGuire, P., Völker, M., Kim, J.-H., Emanuelli, M., Chamberland, J., Stott, M., Warren, S., Ma, Y. et al. (2025), Next-Generation C-Band SAR Mission: Design Concept for Earth Observation Service Continuity, Remote Sensing 17(22): 3761, doi:10.3390/rs17223761. Licence CC BY 4.0, checked on the MDPI article page, 2026-11-24. Values used here: a near-circular dawn-dusk sun-synchronous reference orbit at 693 km and 98.18° with a period of 98.6 min and a 12-day ground-track repeat; a second satellite 180° away in the same plane, separated by 49.3 min; imaging swaths of 100, 200, 350 and 500 km with a 600 km accessible swath and up to 1000 km in tandem; a 70° inclination option and a polar non-sun-synchronous option whose offset must be a whole multiple of the 98.6-minute revolution; revisit of 1-20 h (three satellites) and 1-10 h (five satellites) depending on latitude, under 4-6 h over most of Canada with four satellites and a 500 km swath; at least 60 % (three satellites) and 100 % (five) of the ice-monitoring area within 12 h; downlink latency 10-30 min with the existing station network and under 10 min via data relay."
  - "Orbit mechanics: the two-body period, the J2 nodal drift and the sun-synchronous condition as implemented in fibub's Satellite tracker (src/lib/sci/satorbit.ts), checked in tests/sci.mjs against standard values."
paper:
  title: "Next-Generation C-Band SAR Mission: Design Concept for Earth Observation Service Continuity"
  authors: "Zakharov I, Power D, McGuire P, Völker M, Kim J-H, Emanuelli M, Chamberland J, Stott M, Warren S, Ma Y et al."
  journal: "Remote Sensing"
  year: 2025
  doi: "10.3390/rs17223761"
  url: "https://www.mdpi.com/2072-4292/17/22/3761"
  licence: "CC BY 4.0"
  reviewed: true
---

Radar satellites see through cloud and darkness, which is why Canada's ice charts, flood maps and ground-motion monitoring depend on them. A 2025 paper in *Remote Sensing* sets out a design concept for the C-band radar mission that would follow today's one: three medium satellites, or five large ones, in a Sentinel-1-like orbit, with revisit times short enough for interferometry a few hours apart. Every one of those claims rests on orbit geometry, and that is something anyone can check: we put the paper's reference orbit into the [[satellite-tracker]] and recomputed the period, the sun-synchronous inclination, the phasing between satellites and the revisit over Canada. To go further, the [[orbit-elements]] explorer shows what each element does, the [[link-budget-calculator]] handles the downlink, and the [[rocket-equation]] the fuel.

## The paper in brief

The study starts from "harmonized user needs" gathered across Canadian government departments: 1 to 5 m resolution, better interferometry, and polarimetric interferometry. It then compares two constellation options on cost, risk and schedule as well as performance:

- **Three medium satellites** (about 1,600 kg dry). Two work together on the sun-synchronous plane as a tandem pair; the third sits 180° away in the same plane, which the paper describes as a separation of **49.3 minutes**. Swaths of 200, 350 and 500 km in ScanSAR and 100 km in stripmap, a **600 km accessible swath**, and up to 1,000 km combined in tandem. Revisit comes out at **1 to 20 h** depending on latitude, with at least 60 % of the ice-monitoring area covered within 12 h.
- **Five large satellites** (about 2,300 kg dry), two in tandem on the sun-synchronous plane and two more on "optimal" orbits: one at **70° inclination** and one polar but not sun-synchronous, acquiring about 5 h later in the day. Revisit falls to **1 to 10 h**, with 100 % of the ice area within 12 h, and the paper states **under 4 to 6 h over most of Canada** for a four-satellite case with a 500 km swath.

All the coverage work uses the **Sentinel-1 reference orbit**: near-circular, dawn-dusk sun-synchronous, **693 km**, **98.18°**, a period of **98.6 min** and a **12-day** ground-track repeat. There is also a neat constraint for the non-sun-synchronous satellite: for coherent (interferometric) pairs, the time offset must be a whole number of revolutions, so ±98.6, ±197.2 or ±295.8 minutes.

## Checked with the tools

The Satellite tracker can be given an orbit by its perigee height, apogee height and inclination, and it then reports the period, the speed, the drift of the orbit plane under Earth's bulge (the J2 effect), the inclination that would make the orbit sun-synchronous, and the ground footprint. We typed in 693 × 693 km at 98.18°.

| Check | Paper | Satellite tracker |
|---|---|---|
| Orbital period | 98.6 min | **98.63 min** |
| Sun-synchronous inclination at this height | 98.18° | **98.16°** |
| Orbit plane drift | dawn-dusk sun-synchronous | **+0.988° a day**, against the 0.9856° a year-round Sun needs |
| Separation of the satellite 180° away | 49.3 min | **49.31 min** (half a period) |
| Orbital speed | not stated | 7.51 km/s |
| Revolutions per day | not stated | 14.601 |
| Revolutions in 12 days | 12-day repeat | **175.21**, not a whole number |
| Period for an exact 175-revolution repeat | — | 98.74 min, which needs **698.6 km** |
| Ground seen at 10° elevation | — | 1,928 km around the point below |
| Ground-track spacing, one day, at the equator | — | 2,745 km (1,372 km at 60° N) |

**The phasing check is exact.** The paper's "49.3 min" for a satellite 180° away in the same plane is half the orbital period, and half of the tool's 98.63 min is 49.31 min. Likewise the paper's requirement that a coherent pair be offset by whole revolutions, ±98.6, ±197.2 and ±295.8 min, is 1, 2 and 3 periods: the tool gives 98.63, 197.26 and 295.89.

**The repeat cycle needs a sharper number than 693 km.** At 693 km above the equatorial radius the period is 98.63 min, so 12 days hold 175.21 revolutions, not 175. For the ground track to repeat exactly after 175 revolutions in 12 days, the period must be 98.74 min, which the tool's maths puts at a height of **698.6 km**. That is not an error in the paper, which gives rounded reference values; it is a warning for anyone who takes 693 km and 98.6 min into a repeat-cycle calculation of their own. A sun-synchronous plane turns with the Sun, so its nodal day is the mean solar day and the sum really is 12 × 1440 ÷ period. Figure 2 shows the two curves, inclination and period against height, that any such design starts from.

<!-- fig:sso -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="Sun-synchronous inclination and orbital period against height for a circular orbit. At 693 km the tool gives 98.16 degrees and 98.63 minutes, against the paper's 98.18 degrees and 98.6 minutes." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Sun-synchronous inclination and period against height</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Sun-synchronous inclination and period against height</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--line)"/><text x="52" y="266" text-anchor="end" style="fill:var(--muted)">94</text><line x1="58" x2="546" y1="214.9" y2="214.9" style="stroke:var(--line)"/><text x="52" y="218.9" text-anchor="end" style="fill:var(--muted)">96</text><line x1="58" x2="546" y1="167.8" y2="167.8" style="stroke:var(--line)"/><text x="52" y="171.8" text-anchor="end" style="fill:var(--muted)">98</text><line x1="58" x2="546" y1="120.7" y2="120.7" style="stroke:var(--line)"/><text x="52" y="124.7" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="73.6" y2="73.6" style="stroke:var(--line)"/><text x="52" y="77.6" text-anchor="end" style="fill:var(--muted)">102</text><line x1="58" x2="58" y1="262" y2="266" style="stroke:var(--muted)"/><text x="58" y="279" text-anchor="middle" style="fill:var(--muted)">500</text><line x1="139.3" x2="139.3" y1="262" y2="266" style="stroke:var(--muted)"/><text x="139.3" y="279" text-anchor="middle" style="fill:var(--muted)">600</text><line x1="220.7" x2="220.7" y1="262" y2="266" style="stroke:var(--muted)"/><text x="220.7" y="279" text-anchor="middle" style="fill:var(--muted)">700</text><line x1="302" x2="302" y1="262" y2="266" style="stroke:var(--muted)"/><text x="302" y="279" text-anchor="middle" style="fill:var(--muted)">800</text><line x1="383.3" x2="383.3" y1="262" y2="266" style="stroke:var(--muted)"/><text x="383.3" y="279" text-anchor="middle" style="fill:var(--muted)">900</text><line x1="464.7" x2="464.7" y1="262" y2="266" style="stroke:var(--muted)"/><text x="464.7" y="279" text-anchor="middle" style="fill:var(--muted)">1e+3</text><line x1="546" x2="546" y1="262" y2="266" style="stroke:var(--muted)"/><text x="546" y="279" text-anchor="middle" style="fill:var(--muted)">1.1e+3</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Circular orbit height (km)</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Inclination (°) / period (min)</text><line x1="58" x2="546" y1="163.5" y2="163.5" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="158.5" text-anchor="end" style="fill:var(--muted)">the paper’s 98.18°</text><line x1="215" x2="215" y1="50" y2="262" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="219" y="76" text-anchor="start" style="fill:var(--muted)">693 km</text><path d="M58 181.9L66.1 181L74.3 180.1L82.4 179.2L90.5 178.3L98.7 177.4L106.8 176.4L114.9 175.6L123.1 174.6L131.2 173.7L139.3 172.8L147.5 171.9L155.6 170.9L163.7 170L171.9 169L180 168.1L188.1 167.2L196.3 166.2L204.4 165.3L212.5 164.3L220.7 163.3L228.8 162.4L236.9 161.4L245.1 160.5L253.2 159.5L261.3 158.5L269.5 157.5L277.6 156.5L285.7 155.6L293.9 154.6L302 153.6L310.1 152.6L318.3 151.6L326.4 150.6L334.5 149.6L342.7 148.6L350.8 147.5L358.9 146.5L367.1 145.5L375.2 144.5L383.3 143.4L391.5 142.4L399.6 141.4L407.7 140.3L415.9 139.3L424 138.2L432.1 137.2L440.3 136.1L448.4 135.1L456.5 134L464.7 132.9L472.8 131.9L480.9 130.8L489.1 129.7L497.2 128.6L505.3 127.5L513.5 126.4L521.6 125.4L529.7 124.2L537.9 123.2L546 122.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 247.5L66.1 242.6L74.3 237.8L82.4 232.9L90.5 228L98.7 223.1L106.8 218.3L114.9 213.4L123.1 208.5L131.2 203.6L139.3 198.7L147.5 193.8L155.6 188.9L163.7 184L171.9 179.1L180 174.2L188.1 169.3L196.3 164.3L204.4 159.4L212.5 154.5L220.7 149.6L228.8 144.6L236.9 139.7L245.1 134.8L253.2 129.8L261.3 124.9L269.5 119.9L277.6 115L285.7 110L293.9 105L302 100.1L310.1 95.1L318.3 90.2L326.4 85.2L334.5 80.2L342.7 75.2L350.8 70.2L358.9 65.2L367.1 60.2L375.2 55.3L383.3 50.3L391.5 45.3L399.6 40.2L407.7 35.3L415.9 30.2L424 25.2L432.1 20.2L440.3 15.2L448.4 10.1L456.5 5.1L464.7 0.1L472.8 -4.9L480.9 -10L489.1 -15L497.2 -20.1L505.3 -25.1L513.5 -30.2L521.6 -35.2L529.7 -40.3L537.9 -45.4L546 -50.4" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Sun-synchronous inclination</text><line x1="278.4" x2="290.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="294.4" y="40" style="fill:var(--muted)">Orbital period (min)</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The sun-synchronous inclination and the orbital period against height, from the same maths. The paper’s 98.18° and 693 km meet on the curve; its stated 98.6-minute period is 0.14 minutes short of the height’s own value.</figcaption></figure>
<!-- /fig:sso -->

**Sun-synchronous, but not exactly.** The tool reports the plane turning **+0.988° a day** for an inclination of 98.18°, where exact synchronism needs 360 ÷ 365.2422 = 0.9856° a day; the inclination for that at this height is 98.16°. The difference, 0.0025° a day, is about 0.9° a year of local-time drift, roughly 3.6 minutes a year. Real missions take that up with small manoeuvres, and it is why an orbit maintenance budget belongs in a design study.

**The revisit claim, from the ground track.** This is the paper's headline operational number, so we rebuilt it. We took one day of the reference orbit's ground track at 10-second steps, and counted each separate approach that came within **300 km** of a target, our stand-in for a side-looking radar that can place a swath anywhere within the 600 km accessible band (**our model**, not the paper's). Averaging over 12 longitudes, because a single point can fall between two tracks, gives:

| Latitude | Approaches a day, one satellite | Mean gap, one | Three satellites | Four satellites |
|---|---|---|---|---|
| 45° N | 0.58 | 41.1 h | 13.7 h | 10.3 h |
| 55° N | 0.75 | 32.0 h | 10.7 h | 8.0 h |
| 65° N | 1.00 | 24.0 h | 8.0 h | 6.0 h |
| 70° N | 1.42 | 16.9 h | 5.6 h | 4.2 h |
| 80° N | 4.83 | 5.0 h | 1.7 h | 1.2 h |

The three-satellite column, **1.7 to 13.7 h**, sits inside the paper's stated 1 to 20 h, and the shape is right: the gap falls steeply above 65° N as the tracks converge. The four-satellite column reaches the paper's 4 to 6 h target above about 65° N but not at 45 to 60° N, where most Canadians live. Widen the reach to the full 600 km on each side, as a radar that can look either way can do, and the three-satellite gap falls to **6.0 h at 45° N, 4.4 h at 60° N and 2.7 h at 70° N**: that is where the paper's "under 4 to 6 h over most of Canada" comes from. The lesson for a reader of the paper is that the headline revisit depends as much on how far off-track the radar may point as on how many satellites there are. Figure 1 shows the whole curve.

<!-- fig:revisit -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="Mean hours between looks against latitude for the reference 693 km sun-synchronous orbit, counting every approach within 300 km of a target, averaged over 12 longitudes, and divided by the number of satellites." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Revisit from one 693 km orbit, 600 km reach</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Revisit from one 693 km orbit, 600 km reach</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--line)"/><text x="52" y="266" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="186.3" y2="186.3" style="stroke:var(--line)"/><text x="52" y="190.3" text-anchor="end" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="110.6" y2="110.6" style="stroke:var(--line)"/><text x="52" y="114.6" text-anchor="end" style="fill:var(--muted)">10</text><line x1="127.7" x2="127.7" y1="262" y2="266" style="stroke:var(--muted)"/><text x="127.7" y="279" text-anchor="middle" style="fill:var(--muted)">50</text><line x1="267.1" x2="267.1" y1="262" y2="266" style="stroke:var(--muted)"/><text x="267.1" y="279" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="406.6" x2="406.6" y1="262" y2="266" style="stroke:var(--muted)"/><text x="406.6" y="279" text-anchor="middle" style="fill:var(--muted)">70</text><line x1="546" x2="546" y1="262" y2="266" style="stroke:var(--muted)"/><text x="546" y="279" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Latitude (°N)</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Mean hours between looks</text><line x1="58" x2="546" y1="171.1" y2="171.1" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="166.1" text-anchor="end" style="fill:var(--muted)">the paper’s 4 to 6 h goal</text><path d="M58 -360.4L127.7 -283.1L197.4 -222.6L267.1 -222.6L336.9 -101.4L406.6 6.1L476.3 93.9L546 186.3" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 54.5L127.7 80.3L197.4 100L267.1 100L336.9 140.9L406.6 177.2L476.3 206L546 236.3" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 106L127.7 125.7L197.4 140.9L267.1 140.9L336.9 171.1L406.6 198.4L476.3 219.6L546 243.8" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">One satellite</text><line x1="177.6" x2="189.6" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="193.6" y="40" style="fill:var(--muted)">Three satellites</text><line x1="318.8" x2="330.8" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="334.8" y="40" style="fill:var(--muted)">Four satellites</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. How often one, three or four satellites in the paper’s reference orbit can look at a target, against latitude, worked out from the Satellite tracker’s ground track. A look counts when the track passes within 300 km, half the paper’s 600 km accessible swath (our model of a side-looking radar’s reach).</figcaption></figure>
<!-- /fig:revisit -->

## How we made the graphs

Both charts and every recomputed number come from `scripts/blog-figures/c-band-sar-constellation-sun-synchronous-orbit-revisit-canada.mjs` in fibub's public code. It uses five functions from `src/lib/sci/satorbit.ts`, the maths behind the [[satellite-tracker]]:

- `fromHeights(name, perigee, apogee, inclination, raan, argp, M0, epoch)` builds the orbital elements from heights above the equatorial radius.
- `orbitInfo` returns the semi-major axis, the period, the speeds at perigee and apogee, and the J2 drift rates of the node, the perigee and the mean anomaly, in degrees a day.
- `ssoInclination(perigee, apogee)` solves the sun-synchronous condition, that the plane turn 360° in a year, for the inclination.
- `groundTrack` steps the orbit forward and returns the latitude, longitude and height below the satellite at each step, which is what the revisit count uses; `footprint(height, minElevation)` gives the half-angle it can see.

From the paper: 693 km, 98.18°, 98.6 min, the 12-day repeat, the 49.3-minute phasing, the 500 km swath and the 600 km accessible swath. **Our own** choices: the 1 January 2026 epoch, a circular orbit (the paper says only "near-circular"), 10-second steps, the 300 km and 600 km reaches, the eight latitudes, the 12 longitudes, and the assumption that satellites in one plane share the ground track so that *n* satellites divide the gap by *n*. The last one is generous: it holds for evenly phased satellites in the same plane, and the paper's five-satellite option deliberately uses other planes instead.

## How we test the maths

`tests/sci.mjs`, which `npm test` runs on every change, pins this orbit code against standard values:

- **Sun-synchronous inclination at 700 km** must be 98.19°, within 0.02°.
- **An ISS-like orbit** (415 × 422 km, 51.64°) must give a period of 92.94 min within 0.02 min and a nodal drift of −4.95° a day within 0.03.
- **A geostationary orbit** must give a period of 1,436.07 min within 0.05 min, and its sub-satellite longitude must not move more than 0.05° in 12 hours.
- **A Molniya orbit** at the critical inclination of 63.4° must hold its perigee still, with the perigee drift rate within 0.01° a day of zero.
- **New with this article**, in `tests/sci-tools/satellite-tracker.mjs`: the paper's reference orbit. 693 km circular at 98.18° must give a period of 98.63 min and 7.508 km/s, half-period phasing of 49.31 min, whole-revolution offsets of 197.26 and 295.89 min, a sun-synchronous inclination of 98.16°, a nodal drift of +0.9881° a day that is above the Sun's 0.9856°, 175.21 revolutions in 12 days with 98.74 min needed for 175, a 698.6 km height for that period, a 1,928 km reach at 10° elevation, and a ground track reaching 81.8° N.
- **The footprint** at 10° elevation from 420 km must be 12.49° of Earth's surface, within 0.02°, and a real ISS two-line element set must parse with correct checksums, epoch, inclination and eccentricity.

Those are the checks that make the 98.63-minute period and the 98.16° inclination in this article worth quoting against a published design.

## Check it yourself

On the [[satellite-tracker]], with *Orbit* on **Design an orbit**:

1. Type *Perigee height (km)* **693**, *Apogee height (km)* **693**, *Inclination (°)* **98.18**, and leave *Ascending node longitude (°)* and *Argument of perigee (°)* at **0**.
2. The headline reads **One orbit every 98.6 minutes, 693 × 693 km up**.
3. The facts below give *Inclination* **98.18°** ("retrograde: it travels against Earth's spin"), *Speed* **7.51 km/s**, *Eccentricity* **0.00000**, *Orbit plane turns* **+0.988° a day** with the note *sun-synchronous: it passes over at the same local time every day*, *Perigee moves* **−3.121° a day**, and *Sees at 10° up* about **1,928 km around the point below it**.
4. Set *Track to draw* to **1 day** and look at the map: 14 and a half ground tracks, spaced about 2,745 km at the equator and closing up towards the poles. That spacing, not the swath, is what sets the revisit.
5. Change *Inclination (°)* to **98.16** and the note stays sun-synchronous while the drift becomes **+0.986° a day**: the exact value.
6. Now change *Apogee height (km)* and *Perigee height (km)* to **698.6**: the headline becomes **One orbit every 98.7 minutes**, the period that repeats its ground track after exactly 175 revolutions in 12 days.
7. Put your own latitude and longitude in the place card and set *Lowest pass height* to **30°** to see how few times a day a single polar satellite comes near you.

## What researchers can use it for

- **Check a mission's stated orbit before you build on it.** Height, inclination, period and sun-synchronism are over-determined: if three of them are given, the fourth is a check, and rounded values can hide several kilometres.
- **Work out phasing for a tandem or coherent pair.** Whole-revolution offsets, half-period spacings and the local-time drift all come out of the same page.
- **Estimate revisit yourself** from the ground track and an off-nadir reach, instead of quoting a number whose swath assumption you cannot see.
- **Sanity-check a repeat cycle.** Solve for the height that makes the revolutions per cycle a whole number, rather than assuming a published height does it.
- **Plan a ground station or a campaign.** The footprint radius and pass list over your own coordinates say how much contact time a polar satellite can give you, which is the first input to the [[link-budget-calculator]].

## The fine print

- Our revisit model is **ours**, not the paper's: separate approaches within a fixed distance of the ground track, averaged over longitude, with *n* satellites dividing the gap by *n*. The paper uses STK with real swath geometry, pointing limits and duty cycles, and its multi-plane options are not equivalent to several satellites in one plane.
- Approaches are not acquisitions. A real radar has a duty cycle (the paper mentions 13 to 30 minutes of power analysis and 20 minutes for very long swaths), a data budget and a tasking queue.
- The orbit code uses Kepler's laws with the main J2 drift terms, not a full SGP4 or precise orbit model. That is more than enough for periods, inclinations and spacings, and not enough to predict a pass a week ahead.
- Heights are above Earth's equatorial radius. A published "altitude" may be above the ellipsoid, the geoid or a mean radius, which is worth a few kilometres.
- Nothing here checks the paper's radar performance, noise-equivalent sigma zero, mass, power or cost work.
