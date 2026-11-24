---
title: "Steel studs in an insulated wall: a clip worth 145 mm of glass wool"
summary: "A 2024 Buildings study measures a drywall wall with thermal-break clips at U 0.370 instead of 0.520 W/m2K. We rebuild the layers, add the bridge back and find where the heat really goes."
tools: [heat-conduction, hvac-room-load, degree-days]
updated: 2026-11-24
sources:
  - "Song, J.-H. and Kim, H.-W. (2024), Performance Evaluation of Low Thermal Bridging Drywall System with Separating Clips for C-Studs, Buildings 14(9): 3032, doi:10.3390/buildings14093032. Licence CC BY, checked on the MDPI article page, 2026-11-24. Values used here: glass wool 150 mm at 0.034 W/mK; gypsum board 0.18 W/mK; conventional C-stud 150-45-11 mm, 0.8 mm thick, 63.0 W/mK; proposed pair of 50-45-6 mm C-studs, 0.8 mm thick; studs at 450 mm centres; reinforced plastic separating clip 2 mm high, 3 mm thick, 0.17 W/mK, at 600, 750 or 1000 mm; design U-value with no studs 0.207 W/m2K; measured U-value 0.520 W/m2K (conventional) and 0.370 W/m2K (proposed), 28.8 % lower; linear thermal transmittance 0.117 and 0.061 W/mK, 47.9 % lower; THERM boundary temperatures 25 and -15 degrees C; annual heating load 22.917 falling to 21.803 kWh/m2 (4.86 % lower) with cooling rising 1.49 % and the total falling 2.45 %, and a 5.85 % heating reduction at 1.5 air changes per hour of infiltration."
  - "Surface resistances and the linear-thermal-transmittance sum: ISO 6946 (Rsi 0.11 and Rse 0.04 m2K/W for a vertical wall) and EN ISO 14683 (U = U_1D + sum of psi x length / area), general standard formulas."
paper:
  title: "Performance Evaluation of Low Thermal Bridging Drywall System with Separating Clips for C-Studs"
  authors: "Song J-H, Kim H-W"
  journal: "Buildings"
  year: 2024
  doi: "10.3390/buildings14093032"
  url: "https://www.mdpi.com/2075-5309/14/9/3032"
  licence: "CC BY"
  reviewed: true
---

A light steel stud is a strip of 0.8 mm steel running from the inside face of a wall to the outside one. Steel conducts heat about 1800 times better than the glass wool packed around it, so that strip quietly undoes much of the insulation. A 2024 paper in *Buildings* replaces one deep C-stud with two shallow ones held apart by a small plastic clip, and measures the wall's U-value falling from 0.520 to 0.370 W/m²K. This article rebuilds that wall layer by layer with the [[heat-conduction]] solver, puts the bridge back by hand, and shows what the clip is worth in millimetres of insulation. To carry the answer into a room's load or a year's heating, see [[hvac-room-load]] and [[degree-days]].

## The paper in brief

The wall is ordinary: gypsum board, 150 mm of glass wool at 0.034 W/mK, gypsum board, with light steel C-studs at **450 mm centres**. The conventional stud is 150 mm deep, so a single piece of steel spans the whole insulation layer. The authors replace it with **two 50 mm C-studs**, one near each face, separated by a **reinforced plastic clip 2 mm high and 3 mm thick** at 0.17 W/mK — about 370 times less conductive than the steel it interrupts.

Their results, from a mock-up wall and from THERM simulations:

- Design U-value with no studs at all: **0.207 W/m²K**.
- Measured U-value with the conventional stud: **0.520 W/m²K** — two and a half times the design figure.
- Measured U-value with the clipped pair: **0.370 W/m²K**, **28.8 % lower**.
- Linear thermal transmittance of the stud line (the extra heat flow per metre of stud, per degree): **0.117** falling to **0.061 W/mK**, **47.9 % lower**.
- Over a year, in their building model: heating load **22.917 → 21.803 kWh/m²** (4.86 % less), cooling up 1.49 %, total down 2.45 %, rising to 5.85 % of heating at 1.5 air changes per hour of infiltration.

The paper also checked the clip structurally and for fire and acoustics, which no fibub tool can help with. The thermal chain is the part we can rebuild.

## Checked with the tools

**Step 1: the plain wall, with no steel in it.** The tool's Wall mode adds the resistances of each layer plus the two surface films. Our one assumption is the board thickness, which the paper does not state: **two 12.5 mm boards on each face**, and the ISO 6946 surface resistances for a vertical wall (0.11 inside, 0.04 outside). With glass wool 150 mm at 0.034 W/mK and gypsum at 0.18 W/mK, the tool's maths gives:

| Layer | Resistance (m²K/W) |
|---|---|
| Inside surface film | 0.110 |
| Gypsum board, 25 mm | 0.139 |
| Glass wool, 150 mm | 4.412 |
| Gypsum board, 25 mm | 0.139 |
| Outside surface film | 0.040 |
| **Total** | **4.840** |

That is **U = 0.2066 W/m²K**, against the paper's design value of **0.207**. Two decimal places of agreement, which tells us the build-up and the board thickness are right.

**Step 2: put the steel back.** Standard practice (EN ISO 14683) adds a thermal bridge as a length term: U = U₁D + Σψ·L/A. One stud line per 450 mm is 1/0.45 = **2.222 m of stud per m² of wall**, so the paper's own ψ values add 0.117 × 2.222 = **0.260** or 0.061 × 2.222 = **0.136 W/m²K**. (This sum is our arithmetic; the tool supplies U₁D.)

| | Paper measured | Tool U₁D + paper ψ | Difference |
|---|---|---|---|
| Conventional C-stud | 0.520 W/m²K | **0.467** | −10.3 % |
| Two small studs + clips | 0.370 W/m²K | **0.342** | −7.5 % |
| Reduction from one to the other | 28.8 % | **26.7 %** | — |

The two chains agree to about a tenth. Both predictions sit a little low, which is what you would expect: the mock-up has edges, fixings, track at head and base and the clip itself, none of which the single ψ figure carries. The **reduction**, the number the paper is really claiming, comes out at 26.7 % against the measured 28.8 %.

**Step 3: the bridge is a floor you cannot insulate past.** Figure 1 sweeps the glass wool from 50 to 300 mm. The one-dimensional line keeps falling; the two bridged lines flatten. Even with infinitely thick insulation the conventional wall cannot go below **0.260 W/m²K** — the ψ term alone — while the clipped wall's floor is **0.136**.

<!-- fig:uvalue -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="U-value against glass wool thickness for the plain layered wall and for the same wall with a conventional steel stud or the small studs and clips at 450 mm centres. Both bridged lines flatten out well above the plain one." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>U-value against insulation thickness</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">U-value against insulation thickness</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--line)"/><text x="52" y="266" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="217.4" y2="217.4" style="stroke:var(--line)"/><text x="52" y="221.4" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="172.7" y2="172.7" style="stroke:var(--line)"/><text x="52" y="176.7" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="128.1" y2="128.1" style="stroke:var(--line)"/><text x="52" y="132.1" text-anchor="end" style="fill:var(--muted)">0.6</text><line x1="58" x2="546" y1="83.5" y2="83.5" style="stroke:var(--line)"/><text x="52" y="87.5" text-anchor="end" style="fill:var(--muted)">0.8</text><line x1="58" x2="58" y1="262" y2="266" style="stroke:var(--muted)"/><text x="58" y="279" text-anchor="middle" style="fill:var(--muted)">50</text><line x1="155.6" x2="155.6" y1="262" y2="266" style="stroke:var(--muted)"/><text x="155.6" y="279" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="253.2" x2="253.2" y1="262" y2="266" style="stroke:var(--muted)"/><text x="253.2" y="279" text-anchor="middle" style="fill:var(--muted)">150</text><line x1="350.8" x2="350.8" y1="262" y2="266" style="stroke:var(--muted)"/><text x="350.8" y="279" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="448.4" x2="448.4" y1="262" y2="266" style="stroke:var(--muted)"/><text x="448.4" y="279" text-anchor="middle" style="fill:var(--muted)">250</text><line x1="546" x2="546" y1="262" y2="266" style="stroke:var(--muted)"/><text x="546" y="279" text-anchor="middle" style="fill:var(--muted)">300</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Glass wool thickness (mm)</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">U-value (W/m²K)</text><line x1="58" x2="546" y1="146" y2="146" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="141" text-anchor="end" style="fill:var(--muted)">measured 0.520</text><line x1="58" x2="546" y1="179.4" y2="179.4" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="174.4" text-anchor="end" style="fill:var(--muted)">measured 0.370</text><line x1="253.2" x2="253.2" y1="50" y2="262" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="249.2" y="62" text-anchor="end" style="fill:var(--muted)">150 mm</text><path d="M58 86.4L67.8 94.9L77.5 102.2L87.3 108.6L97 114.2L106.8 119.2L116.6 123.7L126.3 127.7L136.1 131.4L145.8 134.7L155.6 137.7L165.4 140.5L175.1 143.1L184.9 145.4L194.6 147.6L204.4 149.6L214.2 151.5L223.9 153.2L233.7 154.9L243.4 156.4L253.2 157.9L263 159.2L272.7 160.5L282.5 161.7L292.2 162.9L302 163.9L311.8 165L321.5 166L331.3 166.9L341 167.8L350.8 168.6L360.6 169.4L370.3 170.2L380.1 170.9L389.8 171.6L399.6 172.3L409.4 173L419.1 173.6L428.9 174.2L438.6 174.7L448.4 175.3L458.2 175.8L467.9 176.4L477.7 176.8L487.4 177.3L497.2 177.8L507 178.2L516.7 178.7L526.5 179.1L536.2 179.5L546 179.9" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 114.2L67.8 122.6L77.5 130L87.3 136.4L97 142L106.8 147L116.6 151.5L126.3 155.5L136.1 159.2L145.8 162.5L155.6 165.5L165.4 168.3L175.1 170.8L184.9 173.2L194.6 175.3L204.4 177.4L214.2 179.3L223.9 181L233.7 182.6L243.4 184.2L253.2 185.6L263 187L272.7 188.3L282.5 189.5L292.2 190.6L302 191.7L311.8 192.8L321.5 193.7L331.3 194.7L341 195.5L350.8 196.4L360.6 197.2L370.3 198L380.1 198.7L389.8 199.4L399.6 200.1L409.4 200.7L419.1 201.3L428.9 201.9L438.6 202.5L448.4 203.1L458.2 203.6L467.9 204.1L477.7 204.6L487.4 205.1L497.2 205.5L507 206L516.7 206.4L526.5 206.8L536.2 207.2L546 207.6" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 144.4L67.8 152.9L77.5 160.2L87.3 166.6L97 172.2L106.8 177.3L116.6 181.8L126.3 185.8L136.1 189.4L145.8 192.7L155.6 195.8L165.4 198.5L175.1 201.1L184.9 203.4L194.6 205.6L204.4 207.6L214.2 209.5L223.9 211.3L233.7 212.9L243.4 214.4L253.2 215.9L263 217.3L272.7 218.5L282.5 219.7L292.2 220.9L302 222L311.8 223L321.5 224L331.3 224.9L341 225.8L350.8 226.6L360.6 227.4L370.3 228.2L380.1 229L389.8 229.6L399.6 230.3L409.4 231L419.1 231.6L428.9 232.2L438.6 232.8L448.4 233.3L458.2 233.9L467.9 234.4L477.7 234.9L487.4 235.3L497.2 235.8L507 236.2L516.7 236.7L526.5 237.1L536.2 237.5L546 237.9" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Conventional stud</text><line x1="206.4" x2="218.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="222.4" y="40" style="fill:var(--muted)">Small studs + clips</text><line x1="369.2" x2="381.2" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="385.2" y="40" style="fill:var(--muted)">No studs (one-dimensional)</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The U-value of the paper's wall against insulation thickness. The lowest line is the layered wall worked out by the Heat conduction solver's maths; the two above it add the paper's measured linear thermal transmittance for one stud line per 450 mm. Dashed lines are the paper's two measured U-values. The 25 mm of gypsum board each side and the surface resistances are our assumptions.</figcaption></figure>
<!-- /fig:uvalue -->

That gives the clip a price in insulation. To bring a conventional-stud wall down to the clipped wall's measured 0.370 W/m²K you would need **295 mm of glass wool instead of 150** — the clip is worth about **145 mm of extra insulation**, or a wall nearly twice as thick.

**Step 4: how much of the wall is stud?** Dividing the bridge term by the total, the stud line carries **55.7 %** of the conventional wall's heat flow and **39.6 %** of the clipped one. Figure 2 sweeps the stud spacing: widen the studs to 600 mm and the conventional share drops to about 49 %, which is a cheaper change than buying clips, if the structure allows it.

<!-- fig:share -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="The share of the wall total heat flow carried by the stud line, against stud spacing from 300 to 900 mm. At 450 mm the conventional stud carries about 56 per cent and the clipped pair about 40 per cent." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Share of the heat flow that goes through the studs</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Share of the heat flow that goes through the studs</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="178.5" y2="178.5" style="stroke:var(--line)"/><text x="52" y="182.5" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="105.1" y2="105.1" style="stroke:var(--line)"/><text x="52" y="109.1" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">300</text><line x1="139.3" x2="139.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="139.3" y="269" text-anchor="middle" style="fill:var(--muted)">400</text><line x1="220.7" x2="220.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="220.7" y="269" text-anchor="middle" style="fill:var(--muted)">500</text><line x1="302" x2="302" y1="252" y2="256" style="stroke:var(--muted)"/><text x="302" y="269" text-anchor="middle" style="fill:var(--muted)">600</text><line x1="383.3" x2="383.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="383.3" y="269" text-anchor="middle" style="fill:var(--muted)">700</text><line x1="464.7" x2="464.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="464.7" y="269" text-anchor="middle" style="fill:var(--muted)">800</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">900</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Stud spacing (mm)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Share of total heat flow (%)</text><line x1="180" x2="180" y1="50" y2="252" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="184" y="62" text-anchor="start" style="fill:var(--muted)">450 mm centres</text><path d="M58 85.4L66.1 88.1L74.3 90.8L82.4 93.4L90.5 96L98.7 98.5L106.8 100.9L114.9 103.3L123.1 105.7L131.2 108L139.3 110.2L147.5 112.4L155.6 114.6L163.7 116.7L171.9 118.8L180 120.8L188.1 122.8L196.3 124.8L204.4 126.7L212.5 128.6L220.7 130.4L228.8 132.2L236.9 134L245.1 135.8L253.2 137.4L261.3 139.1L269.5 140.8L277.6 142.4L285.7 144L293.9 145.6L302 147.1L310.1 148.6L318.3 150.2L326.4 151.6L334.5 153.1L342.7 154.5L350.8 155.8L358.9 157.2L367.1 158.6L375.2 159.9L383.3 161.2L391.5 162.5L399.6 163.8L407.7 165L415.9 166.2L424 167.5L432.1 168.7L440.3 169.8L448.4 171L456.5 172.1L464.7 173.3L472.8 174.4L480.9 175.4L489.1 176.5L497.2 177.6L505.3 178.6L513.5 179.6L521.6 180.7L529.7 181.7L537.9 182.7L546 183.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 143.3L66.1 146.3L74.3 149.2L82.4 152L90.5 154.8L98.7 157.4L106.8 160L114.9 162.5L123.1 164.9L131.2 167.2L139.3 169.5L147.5 171.7L155.6 173.8L163.7 175.9L171.9 178L180 180L188.1 181.9L196.3 183.8L204.4 185.6L212.5 187.4L220.7 189.1L228.8 190.8L236.9 192.5L245.1 194.1L253.2 195.6L261.3 197.2L269.5 198.7L277.6 200.1L285.7 201.6L293.9 203L302 204.3L310.1 205.7L318.3 207L326.4 208.3L334.5 209.5L342.7 210.8L350.8 211.9L358.9 213.1L367.1 214.3L375.2 215.4L383.3 216.5L391.5 217.6L399.6 218.7L407.7 219.7L415.9 220.7L424 221.7L432.1 222.7L440.3 223.7L448.4 224.6L456.5 225.6L464.7 226.5L472.8 227.4L480.9 228.2L489.1 229.1L497.2 229.9L505.3 230.8L513.5 231.6L521.6 232.4L529.7 233.2L537.9 234L546 234.7" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Conventional stud</text><line x1="206.4" x2="218.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="222.4" y="40" style="fill:var(--muted)">Small studs + clips</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. How much of the wall's heat flow the stud line carries, against stud spacing, using the paper's measured linear thermal transmittances and the one-dimensional U-value from the tool.</figcaption></figure>
<!-- /fig:share -->

**Step 5: what it is worth per square metre.** At the paper's THERM boundary conditions, 25 °C inside and −15 °C outside, the tool puts the heat flow through the plain wall at **8.3 W/m²**. The conventional wall loses **20.8 W/m²** and the clipped wall **14.8**, so the clip saves 6 W/m² at a 40 K difference. The inside surface sits at **24.09 °C** on the plain wall, 23.37 on the clipped one and **22.71** on the conventional one — not cold enough to condense here, but the gap is a reminder that the stud line itself will be colder than the average.

## How we made the graphs

Both charts and every number above come from `scripts/blog-figures/steel-stud-wall-thermal-break-clips-u-value-layers.mjs` in fibub's public code. It calls `wall` from `src/lib/sci/phconduct.ts`, the maths behind [[heat-conduction]]'s Wall mode: the series of layer resistances L/k plus the two film resistances 1/h, the total U, the heat flow and the temperature at every interface.

From the paper: the glass wool thickness and conductivity, the gypsum conductivity, the 450 mm stud spacing, the design and measured U-values, both linear thermal transmittances and the 25 / −15 °C boundaries. **Our assumptions:** 25 mm of gypsum board on each face (the paper gives only its conductivity), the ISO 6946 surface resistances, and the ISO 14683 way of adding the bridge. The 295 mm figure in Step 3 is found by solving the tool's own wall equation for thickness.

## How we test the maths

`tests/sci-tools/heat-conduction.mjs` runs inside `tests/sci.mjs` on every change to fibub:

- A three-layer wall's total resistance must equal the hand sum of 1/hᵢ + ΣL/k + 1/hₒ, and its interface temperatures must fall linearly inside each layer with the same heat flow through all of them.
- The transient slab, 2D plate, fin and insulated-pipe modes are pinned against analytic series solutions and against an independent Python implementation.
- New with this article: the paper's build-up — 25 mm gypsum at 0.18, 150 mm glass wool at 0.034, 25 mm gypsum, with films 1/0.11 and 1/0.04 — must give a total resistance of 4.83954248366013 m²K/W, U = 0.20663110270781282 W/m²K, a heat flow of 8.265244108312514 W/m² between 25 and −15 °C, and an inside surface at 24.090823148085622 °C.

## Check it yourself

On the [[heat-conduction]] tool page, with **Wall** selected:

1. Replace the *Layers, inside to outside* box with three lines: **Gypsum board, 25, 0.18**, **Glass wool, 150, 0.034**, **Gypsum board, 25, 0.18**.
2. Set *Inside air (°C)* to **25** and *Outside air (°C)* to **−15**.
3. Set *Inside film h (W/m²·K)* to **9.09** (that is 1/0.11) and *Outside film h (W/m²·K)* to **25** (1/0.04).
4. Leave *Wall area (m²)* at **10**.
5. The results read a U-value of about **0.207 W/m²K**, a total resistance of **4.84 m²K/W**, a heat flow near **8.27 W/m²** (82.7 W over the 10 m²), and an inside surface temperature of **24.1 °C**. The layer chart shows almost the whole temperature drop happening inside the glass wool.
6. Now change the glass wool to **295** mm and watch U fall to about **0.110**. Add 0.260 W/m²K for a conventional stud line and you are back at the clipped wall's 0.370: Step 3 by hand.

## What researchers can use it for

- **Check a published design U-value** before trusting the rest of a paper: if the layers do not reproduce it, something is unstated, as the board thickness was here.
- **Separate the one-dimensional wall from its bridges**, so a measured U-value can be split into the part insulation can fix and the part only detailing can.
- **Price a detail in insulation thickness**, as in Step 3, which is a fairer comparison than a percentage.
- **Find the surface temperature** at design conditions and compare it with the room's dew point from [[psychrometric-calculator]] before worrying about mould.
- **Carry a U-value into a load or a season** with [[hvac-room-load]] and [[degree-days]], instead of stopping at W/m²K.

## The fine print

- The 25 mm of gypsum board each side is **our assumption**, chosen because it reproduces the paper's stated design U-value. A thinner board would need slightly more insulation to match.
- Adding a thermal bridge as ψ·L/A is a standard simplification. The real flow around a steel stud is two-dimensional, which is why the paper used THERM and a mock-up, and why our predictions sit 7 to 10 % below the measurements.
- The paper's own text is inconsistent in two places: it quotes the proposed wall as 0.370 W/m²K in the abstract and conclusions but 0.307 in one section, and it gives the clip spacing as 750 mm in one place and 500 or 1000 mm in others. We used 0.370 and 450 mm stud centres, the values the percentages in the abstract are built on.
- Measured U-values depend on the test method and the mock-up's edges. Treat the 10 % gap as a reminder of that, not as an error in either calculation.
- The annual heating figures in the paper come from its own building energy model, not from this wall alone, and we have not reproduced them.
