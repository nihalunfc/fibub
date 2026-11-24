---
title: "Valencia flash flood of October 2024: peak discharges by Manning's equation"
summary: "A 2025 study rebuilds peak flows of the 29 October 2024 flood near Valencia from field cross-sections. We recheck its Manning and weir numbers with fibub's Manning weir calculator."
tools: [manning-weir-calculator, rating-curve, flood-frequency]
updated: 2026-11-24
sources:
  - "Muñoz, R., Molner, J. V., Campillo-Tamarit, N. and Soria, J. (2025), Estimating Peak Flows in Streams During the Flash Flood Event of 29 October 2024 in Spain: An Empirical Approach, Water 17(21): 3177, doi:10.3390/w17213177. Licence CC BY 3.0, checked on the MDPI article page, 2026-11-24. Values used here: 24-hour rain maxima of 491 mm (Poyo), 406 mm (Turia) and 291 mm (Magro), up to 767 mm in total, about 40 % turned into runoff; at Huerto Mulet on the Júcar (site 14) a wetted area of 603 m², hydraulic radius 7.83 m, slope 1.2 m per km, water level 11.81 m, gauge velocity 2.5 m/s and peak 1500 m³/s, Manning velocity 2.40 m/s and discharge 1448 m³/s, roughness given as 0.18 %; Manning roughness range 0.17 to 0.30 as printed; Torrent (Poyo, site 21) 2271 m² and 5678 m³/s; Carlet (Magro, site 10) 1679 m² and 4198 m³/s; Algemesí (site 11) 243 m² and 608 m³/s; a velocity of 2.5 m/s for most sections; the Poyo gauge (site 18) failing at about 4.5 m with 2280 m³/s logged, and a weir equation giving 3225 m³/s for 5.5 m; Poyo channel narrowing from 110 m to 35 m wide; agreement with Manning R² 0.9905, nRMSE 3.62 %."
  - "Chow, V. T. (1959), Open-Channel Hydraulics, McGraw-Hill (Manning's equation, typical n values, broad-crested weir)."
paper:
  title: "Estimating Peak Flows in Streams During the Flash Flood Event of 29 October 2024 in Spain: An Empirical Approach"
  authors: "Muñoz R, Molner JV, Campillo-Tamarit N, Soria J"
  journal: "Water"
  year: 2025
  doi: "10.3390/w17213177"
  url: "https://www.mdpi.com/2073-4441/17/21/3177"
  licence: "CC BY 3.0"
  reviewed: true
---

On 29 October 2024 a slow-moving storm dropped up to 491 mm of rain in a day on the hills west of Valencia, Spain. The streams that drain them, the Poyo above all, rose so fast that they destroyed the gauges meant to measure them. A 2025 paper in *Water* worked out how much water passed anyway, from the size of the wetted channel measured in the field and a flow speed, and checked one site with **Manning's equation**, the standard formula for flow in an open channel. This article rechecks those numbers with the [[manning-weir-calculator|Manning weir calculator]] and shows how much the answer hangs on one number, the roughness of the channel. For what comes next, a [[rating-curve]] turns gauge levels into flows, and [[flood-frequency]] analysis says how rare a peak is.

## The paper in brief

The storm, a cut-off low (a pool of cold air aloft that drifts away from the main jet stream), dropped 491 mm in 24 hours on the Poyo basin, 406 mm on the Turia and 291 mm on the Magro, and up to 767 mm over the whole event. The authors estimate about 40 % of it became runoff. With the gauge network broken, they surveyed the **wetted cross-section** (the area of channel the water filled, from flood marks) at about 25 sites, borrowed flow speeds from gauges that survived (2.2 to 3.5 m/s), and multiplied: discharge Q = area × velocity.

Their largest estimates are **5678 m³/s in the Poyo at Torrent** (2271 m² at 2.5 m/s) and **4198 m³/s in the Magro at Carlet** (1679 m²), with the Poyo then squeezed from 110 m wide to 35 m as it ran through towns. At one site, Huerto Mulet on the Júcar, a gauge did record the peak (1500 m³/s), and Manning's equation from the measured section gave 1448 m³/s at 2.40 m/s. They report close agreement between methods (R² 0.9905).

**Manning's equation** says the mean velocity V = (1/n) R^(2/3) S^(1/2), where R is the **hydraulic radius** (flow area ÷ wetted perimeter, roughly the mean depth in a wide channel), S the slope and n the **roughness coefficient**: about 0.013 for smooth concrete, 0.03 to 0.04 for a clean natural channel, 0.05 to 0.1 or more for weedy, brushy or debris-laden ones.

## Checked with the tools

The paper gives the Huerto Mulet section only as an area (603 m²) and hydraulic radius (7.83 m). The calculator needs a shape, so we used a **rectangle with exactly that area and hydraulic radius**: 55.14 m wide and 10.94 m deep (**our stand-in**; the stated water level is 11.81 m, so the real section is a bit irregular). Everything below is a **recomputation from values in the paper's text**.

**Step 1: what roughness does 1448 m³/s need?** At a slope of 1.2 m per km, the calculator's Manning maths gives the paper's 1448 m³/s and 2.40 m/s only with **n = 0.057**. That is a sensible value for a river in flood carrying trees, reeds and rubble. The paper prints the roughness as "0.18 %" and a general range of 0.17 to 0.30, which do not fit Manning's n as usually written: n = 0.018 would push **4576 m³/s** through the same section, three times the gauged peak. We think the printed values use a different unit or a typo, and the 0.057 is what the paper's own velocity implies.

| n | Discharge | Velocity |
|---|---|---|
| 0.018 (as printed, read as n) | 4576 m³/s | 7.59 m/s |
| 0.035 (clean natural channel) | 2353 m³/s | 3.90 m/s |
| 0.045 | 1830 m³/s | 3.04 m/s |
| **0.057 (fits the paper)** | **1448 m³/s** | **2.40 m/s** |
| 0.07 | 1177 m³/s | 1.95 m/s |
| 0.1 | 824 m³/s | 1.37 m/s |

Figure 1 shows the whole curve. Discharge falls as 1/n, so a guess of n that is 25 % too low gives a peak 33 % too high. The gauge's 1500 m³/s pins this site; everywhere else, n (or the borrowed velocity) carries most of the uncertainty.

<!-- fig:manning -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 270" role="img" aria-label="Manning discharge through a section with the paper's area, hydraulic radius and slope, for roughness n from 0.015 to 0.11. The paper's 1448 m3/s needs n = 0.057; n = 0.018 would give 4576 m3/s." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Huerto Mulet peak: discharge depends on Manning's n</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Huerto Mulet peak: discharge depends on Manning's n</text><line x1="58" x2="546" y1="224" y2="224" style="stroke:var(--line)"/><text x="52" y="228" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="160" y2="160" style="stroke:var(--line)"/><text x="52" y="164" text-anchor="end" style="fill:var(--muted)">2e+3</text><line x1="58" x2="546" y1="96" y2="96" style="stroke:var(--line)"/><text x="52" y="100" text-anchor="end" style="fill:var(--muted)">4e+3</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">6e+3</text><line x1="83.7" x2="83.7" y1="224" y2="228" style="stroke:var(--muted)"/><text x="83.7" y="241" text-anchor="middle" style="fill:var(--muted)">0.02</text><line x1="186.4" x2="186.4" y1="224" y2="228" style="stroke:var(--muted)"/><text x="186.4" y="241" text-anchor="middle" style="fill:var(--muted)">0.04</text><line x1="289.2" x2="289.2" y1="224" y2="228" style="stroke:var(--muted)"/><text x="289.2" y="241" text-anchor="middle" style="fill:var(--muted)">0.06</text><line x1="391.9" x2="391.9" y1="224" y2="228" style="stroke:var(--muted)"/><text x="391.9" y="241" text-anchor="middle" style="fill:var(--muted)">0.08</text><line x1="494.6" x2="494.6" y1="224" y2="228" style="stroke:var(--muted)"/><text x="494.6" y="241" text-anchor="middle" style="fill:var(--muted)">0.1</text><line x1="58" x2="546" y1="224" y2="224" style="stroke:var(--muted)"/><text x="302" y="262" text-anchor="middle" style="fill:var(--ink)">Manning's n</text><text transform="translate(14 128) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Discharge (m³/s)</text><line x1="58" x2="546" y1="176" y2="176" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="171" text-anchor="end" style="fill:var(--muted)">gauge peak 1500</text><line x1="273.7" x2="273.7" y1="32" y2="224" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="277.7" y="44" text-anchor="start" style="fill:var(--muted)">n = 0.057</text><path d="M58 48.3L63.1 59.3L68.3 69L73.4 77.6L78.5 85.3L83.7 92.2L88.8 98.5L94 104.2L99.1 109.4L104.2 114.2L109.4 118.6L114.5 122.6L119.6 126.4L124.8 129.9L129.9 133.1L135.1 136.1L140.2 139L145.3 141.6L150.5 144.1L155.6 146.5L160.7 148.7L165.9 150.8L171 152.8L176.1 154.6L181.3 156.4L186.4 158.1L191.6 159.7L196.7 161.2L201.8 162.7L207 164.1L212.1 165.4L217.2 166.7L222.4 167.9L227.5 169.1L232.7 170.2L237.8 171.3L242.9 172.3L248.1 173.3L253.2 174.3L258.3 175.2L263.5 176.1L268.6 176.9L273.7 177.8L278.9 178.6L284 179.3L289.2 180.1L294.3 180.8L299.4 181.5L304.6 182.2L309.7 182.8L314.8 183.5L320 184.1L325.1 184.7L330.3 185.2L335.4 185.8L340.5 186.3L345.7 186.9L350.8 187.4L355.9 187.9L361.1 188.4L366.2 188.9L371.3 189.3L376.5 189.8L381.6 190.2L386.8 190.6L391.9 191L397 191.5L402.2 191.9L407.3 192.3L412.4 192.6L417.6 193L422.7 193.3L427.9 193.7L433 194L438.1 194.4L443.3 194.7L448.4 195L453.5 195.4L458.7 195.6L463.8 196L468.9 196.3L474.1 196.5L479.2 196.8L484.4 197.1L489.5 197.4L494.6 197.6L499.8 197.9L504.9 198.1L510 198.4L515.2 198.7L520.3 198.9L525.5 199.1L530.6 199.4L535.7 199.6L540.9 199.8L546 200" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="262" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Manning discharge for a rectangle with the paper's wetted area (603 m²), hydraulic radius (7.83 m) and slope (1.2 m per km) at Huerto Mulet on the Júcar, as the roughness n changes. A recomputation from values in the paper's text; the rectangle is our stand-in for the real section.</figcaption></figure>
<!-- /fig:manning -->

**Step 2: the flow itself.** At n = 0.057 the calculator gives a **Froude number of 0.23** (well below 1: deep, tranquil flow, not a rapid), a specific energy of 11.23 m and an average **bed shear stress of 92 Pa**, enough to move gravel several centimetres across. The gauge's own velocity, 2.5 m/s, times 603 m² gives 1508 m³/s, within 1 % of its recorded peak.

**Step 3: area × velocity elsewhere.** The Torrent, Carlet and Algemesí peaks are exactly area × 2.5 m/s: 5678, 4198 and 608 m³/s. With a velocity of 2.0 or 3.0 m/s instead, Torrent would be 4542 or 6813 m³/s. So the paper's biggest peak is best read as roughly 4500 to 6800 m³/s, with 5700 the central value.

**Step 4: the Poyo weir.** The Poyo gauge logged 2280 m³/s before failing at about 4.5 m, and a weir equation gave 3225 m³/s at 5.5 m. The paper does not give the weir's length or type. A broad-crested weir (discharge coefficient 0.95) would need a crest **154.4 m** long to pass 3225 m³/s at 5.5 m; a sharp-crested one (0.62), 136.6 m (**our assumption** about the weir type). Either way, that same weir at 4.5 m passes **2387 m³/s**, within 5 % of the 2280 the gauge logged (Figure 2). Because both formulas scale as head to the power 1.5, the check does not depend on which type we chose; it says the paper's two Poyo numbers are consistent with each other.

<!-- fig:weir -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="Discharge over a broad-crested weir 154.4 m long (discharge coefficient 0.95), scaled to pass 3225 m3/s at 5.5 m. At 4.5 m it gives 2387 m3/s, near the 2280 m3/s the gauge logged before it failed." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Poyo weir: a rating curve through 3225 m³/s at 5.5 m</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Poyo weir: a rating curve through 3225 m³/s at 5.5 m</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--line)"/><text x="52" y="246" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="191.5" y2="191.5" style="stroke:var(--line)"/><text x="52" y="195.5" text-anchor="end" style="fill:var(--muted)">1e+3</text><line x1="58" x2="546" y1="140.9" y2="140.9" style="stroke:var(--line)"/><text x="52" y="144.9" text-anchor="end" style="fill:var(--muted)">2e+3</text><line x1="58" x2="546" y1="90.4" y2="90.4" style="stroke:var(--line)"/><text x="52" y="94.4" text-anchor="end" style="fill:var(--muted)">3e+3</text><line x1="58" x2="58" y1="242" y2="246" style="stroke:var(--muted)"/><text x="58" y="259" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="139.3" x2="139.3" y1="242" y2="246" style="stroke:var(--muted)"/><text x="139.3" y="259" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="220.7" x2="220.7" y1="242" y2="246" style="stroke:var(--muted)"/><text x="220.7" y="259" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="302" x2="302" y1="242" y2="246" style="stroke:var(--muted)"/><text x="302" y="259" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="383.3" x2="383.3" y1="242" y2="246" style="stroke:var(--muted)"/><text x="383.3" y="259" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="464.7" x2="464.7" y1="242" y2="246" style="stroke:var(--muted)"/><text x="464.7" y="259" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="546" x2="546" y1="242" y2="246" style="stroke:var(--muted)"/><text x="546" y="259" text-anchor="middle" style="fill:var(--muted)">6</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">Head above the crest (m)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Discharge (m³/s)</text><line x1="424" x2="424" y1="50" y2="242" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="420" y="62" text-anchor="end" style="fill:var(--muted)">gauge failed</text><path d="M58 242L66.1 241.6L74.3 240.9L82.4 239.9L90.5 238.8L98.7 237.6L106.8 236.1L114.9 234.6L123.1 233L131.2 231.2L139.3 229.4L147.5 227.4L155.6 225.4L163.7 223.3L171.9 221.1L180 218.8L188.1 216.4L196.3 214L204.4 211.5L212.5 208.9L220.7 206.3L228.8 203.5L236.9 200.8L245.1 197.9L253.2 195L261.3 192.1L269.5 189L277.6 186L285.7 182.8L293.9 179.6L302 176.4L310.1 173L318.3 169.7L326.4 166.3L334.5 162.8L342.7 159.3L350.8 155.7L358.9 152.1L367.1 148.4L375.2 144.7L383.3 140.9L391.5 137.1L399.6 133.3L407.7 129.4L415.9 125.4L424 121.4L432.1 117.4L440.3 113.3L448.4 109.2L456.5 105L464.7 100.8L472.8 96.5L480.9 92.2L489.1 87.8L497.2 83.5L505.3 79.1L513.5 74.6L521.6 70.1L529.7 65.6L537.9 61L546 56.3" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="424" cy="126.8" r="4" style="fill:var(--ink);opacity:1"/><circle cx="505.3" cy="79.1" r="4" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Broad-crested, L 154.4 m</text><circle cx="261.8" cy="36" r="4" style="fill:var(--ink)"/><text x="272.8" y="40" style="fill:var(--muted)">Gauge log and weir estimate</text><text class="fibub-mark" x="546" y="280" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. A broad-crested weir rating curve made to pass the paper's 3225 m³/s at a 5.5 m head on the Poyo (our assumption about the weir type), with the flow the gauge had logged when it failed at about 4.5 m.</figcaption></figure>
<!-- /fig:weir -->

## How we made the graphs

All numbers and both charts come from `scripts/blog-figures/valencia-flash-flood-2024-peak-discharge-manning-equation.mjs` in fibub's public code. It calls `section`, `manningQ` and `flowAt` (Manning's equation, Froude number, specific energy, bed shear) and `broadWeir` and `rectWeir` (weir discharge) from `src/lib/sci/openchannel.ts`, the maths behind the [[manning-weir-calculator|Manning weir calculator]].

From the paper: the area, hydraulic radius, slope, velocities and discharges listed in `sources:`. **Our choices**: the rectangle with the same area and hydraulic radius, the roughness found by matching 1448 m³/s, the ±0.5 m/s velocity range, and the weir type and coefficient.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks the open-channel maths against SciPy:

- A 3 m wide rectangle, 1 m deep, n 0.013, slope 0.001 carries 5.19133 m³/s.
- A full 1 m pipe at n 0.013 and slope 0.002 carries 1.072231 m³/s, and the most a part-full pipe can carry is 1.0757 times that.
- New with this article, in `tests/sci-tools/manning-weir-calculator.mjs`: the Huerto Mulet stand-in carries 1448 m³/s at 2.40 m/s with a Froude number of 0.232 and 92.2 Pa of bed shear; with n 0.018 about 4580 m³/s; and the 154.4 m broad-crested weir passes 3225 m³/s at 5.5 m and 2387 at 4.5 m.

## Check it yourself

On the [[manning-weir-calculator|Manning weir calculator]], *Units* **SI**:

1. Choose *Shape* **Rectangle**, type *Bottom width b* **55.14**, *Bed slope S* **0.0012** and *Manning's n* **0.0569**.
2. Leave *Find* on **Discharge from the depth** and type *Flow depth y* **10.94**. The headline reads **Discharge 1448 m³/s at 10.94 m deep**, with *Velocity* **2.40 m/s**, a hydraulic radius of **7.832 m** and *Froude number* **0.232** (subcritical).
3. Change *Manning's n* to **0.018**: the discharge jumps to about **4580 m³/s**. That is how much rides on the roughness.
4. In the weir card, choose *Weir type* **Broad-crested** (it fills in *Discharge coefficient Cd* 0.95), type *Crest length L* **154.4** and *Head H above the crest* **5.5**: **3225 m³/s**. Change the head to **4.5**: **2387 m³/s**.

## What researchers can use it for

- **Recheck an indirect peak estimate** (slope-area or area-velocity) from a report in a few minutes, and see how far it moves with n ([[manning-weir-calculator|Manning weir calculator]]).
- **Back-calculate roughness** where a gauge did record the peak, then carry it to ungauged sections nearby.
- **Judge flow and scour** from the Froude number and bed shear stress after a flood.
- **Extend a rating curve** above the highest gauging with a Manning section, then fit it with the [[rating-curve]] fitter.
- **Put a peak in context**: feed annual maxima into [[flood-frequency]] analysis to estimate its return period.

## The fine print

- Our rectangle has the paper's area and hydraulic radius, but a real flood section is irregular, with a main channel and floodplains that are better split into parts.
- Manning's equation assumes steady, uniform flow. A flash flood is neither, and bridges, debris jams and narrowing towns cause backwater, which is the paper's main point.
- The printed roughness values (0.18 %, 0.17 to 0.30) could not be matched to Manning's n; we used the n that fits the paper's own velocity.
- The weir type and coefficient are our assumption; only the ratio of the two Poyo flows is tested.
