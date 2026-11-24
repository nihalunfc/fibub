---
title: "Reading a websterite's pyroxenes: Wo-En-Fs, Mg# and the ferric-iron trap"
summary: "A 2025 paper describes a cumulate websterite from Cameroon by its pyroxene and plagioclase end-members. We rebuild those minerals with fibub's formula calculator and show how one weight per cent of SiO2 can shift the published Mg#."
tools: [mineral-formula, ternary-plot-maker, cipw-norm, mineral-id-key, point-counter]
updated: 2026-11-24
sources:
  - "Kagarabi, P. M., Ntaflos, T., Tamen, J., Nkouathio, D. G. and Tumba, K. (2025), A phlogopite-amphibole-plagioclase bearing websterite from Guinadji volcano (Adamawa Plateau, Northern Cameroon): evidence of a cumulate origin and crustal event, Mineralogia 56, doi:10.2478/mipo-2025-0011. Licence CC BY 4.0, checked in Crossref and on the publisher's article page, 2026-11-24. No retraction or correction notice. Values used here: diopside En 43.88-45.13, Wo 45.90-46.91, Fs 8.92-9.28, Mg# 0.83-0.85; enstatite En 75.98-76.65, Wo 1.21-1.76, Fs 21.74-22.45, Mg# 0.77-0.79; plagioclase (labradorite) An 58.30-61.47; amphibole (edenite) Mg# 0.82-0.83 with about 2 wt% K2O and 2 wt% TiO2; phlogopite Mg# 0.86 with about 10 wt% K2O, 4 wt% TiO2 and over 1.20 wt% F; equilibration at about 1195 to 1208 degrees C and 4.7 to 5.9 kbar; the rock is olivine-free with cumulus pyroxenes and intercumulus plagioclase. Only the article's abstract and front matter were readable from here, not its microprobe tables."
  - "Droop, G. T. R. (1987), A general equation for estimating Fe3+ concentrations in ferromagnesian silicates and oxides from microprobe analyses, using stoichiometric criteria, Mineralogical Magazine 51: 431-435."
  - "Morimoto, N. (1988), Nomenclature of pyroxenes, Mineralogical Magazine 52: 535-550 (Wo-En-Fs with total iron and manganese in Fs)."
paper:
  title: "A phlogopite-amphibole-plagioclase bearing websterite from Guinadji volcano (Adamawa Plateau, Northern Cameroon): evidence of a cumulate origin and crustal event"
  authors: "Kagarabi PM, Ntaflos T, Tamen J, Nkouathio DG, Tumba K"
  journal: "Mineralogia"
  year: 2025
  doi: "10.2478/mipo-2025-0011"
  url: "https://doi.org/10.2478/mipo-2025-0011"
  licence: "CC BY 4.0"
  reviewed: true
---

A websterite is a rock made almost entirely of the two pyroxenes, and it usually means that crystals settled out of a magma rather than melted from a rock. A 2025 paper in *Mineralogia* describes one such xenolith carried up by Guinadji volcano on the Adamawa Plateau in northern Cameroon, with cumulus diopside and enstatite, intercumulus plagioclase, and later phlogopite and amphibole rich in potassium, titanium and fluorine. Almost every claim in that story is carried by **end-member numbers**: Wo-En-Fs for the pyroxenes, An for the feldspar, and Mg# for everything. This article shows how the [[mineral-formula]] calculator produces those numbers from microprobe oxide analyses, and uses the paper's own published values to expose a trap that catches many mineralogy tables: the Mg# you report depends on a decision about ferric iron that the analysis itself cannot make. For what comes next, plot the pyroxenes on the [[ternary-plot-maker]] and take the whole rock to the [[cipw-norm]].

## The paper in brief

The authors studied an olivine-free websterite xenolith: two pyroxenes as the cumulus phases, plagioclase filling the gaps between them, and metasomatic phlogopite and amphibole added later. Their mineral chemistry, as the abstract gives it:

| Mineral | End-members | Mg# |
|---|---|---|
| Diopside (clinopyroxene) | Wo 45.90-46.91, En 43.88-45.13, Fs 8.92-9.28 | 0.83-0.85 |
| Enstatite (orthopyroxene) | Wo 1.21-1.76, En 75.98-76.65, Fs 21.74-22.45 | 0.77-0.79 |
| Labradorite (plagioclase) | An 58.30-61.47 | — |
| Edenite (amphibole) | — | 0.82-0.83 |
| Phlogopite | — | 0.86 |

They put equilibration at about 1195 to 1208 °C and 4.7 to 5.9 kbar, read that as a plume-related high temperature at shallow depth, and interpret the potassium- and fluorine-rich phlogopite and amphibole as the mark of a later crustal fluid or melt.

Only the abstract and front matter could be read from here, so the paper's microprobe tables are not reproduced below. What follows works from the published end-members outwards.

## Checked with the tools

**Step 1: do the published numbers hang together?** For a pyroxene, Morimoto's nomenclature puts all the iron and the manganese into Fs, so En/(En + Fs) is a magnesium number that counts ferric iron as if it were ferrous. Using the mid-points of the paper's ranges:

- diopside: 44.51 / (44.51 + 9.10) = **83.0**
- enstatite: 76.31 / (76.31 + 22.09) = **77.6**

Both land at the bottom of the paper's own Mg# ranges (0.83-0.85 and 0.77-0.79). That is exactly what should happen: Mg# in the usual sense counts only Fe²⁺, so it is always at least as high as En/(En + Fs), and the two agree when there is almost no ferric iron. The paper's two sets of numbers are consistent, and they say in passing that its pyroxenes carry little Fe³⁺.

**Step 2: rebuild the minerals.** We wrote three analyses (ours, not the paper's) that are exactly stoichiometric — cations 4.000 and charge 12 on 6 oxygens for the pyroxenes, cations 5.000 and charge 16 on 8 oxygens for the feldspar — and chosen to land on the mid-points of the paper's ranges. Fed to the tool they give back:

| Our analysis (wt%) | Tool result |
|---|---|
| Diopside: SiO₂ 52.48, TiO₂ 0.72, Al₂O₃ 2.54, Cr₂O₃ 0.34, FeO 5.33, MnO 0.32, MgO 15.50, CaO 22.49, Na₂O 0.28 | cations 4.000 on 6 O, Fe³⁺ 0.000, **Wo 46.4, En 44.5, Fs 9.1, Mg# 83.8** |
| Enstatite: SiO₂ 54.61, TiO₂ 0.37, Al₂O₃ 1.42, Cr₂O₃ 0.18, FeO 14.17, MnO 0.40, MgO 28.09, CaO 0.77 | cations 4.000 on 6 O, Fe³⁺ 0.000, **Wo 1.5, En 76.3, Fs 22.2, Mg# 77.9** |
| Labradorite: SiO₂ 53.02, Al₂O₃ 29.99, CaO 12.35, Na₂O 4.44, K₂O 0.19 | cations 5.000 on 8 O, **An 59.9, Ab 39.0, Or 1.1** |

All three Mg# values sit inside the paper's ranges, and the charge-balance (Droop) option finds no ferric iron to assign, because by construction there is none. This is a round trip, not an independent measurement: it shows the tool's end-member and apfu maths reproduces the convention the paper used, and it gives anyone a worked set of numbers to type in.

**Step 3: how much ferric iron could the paper's diopside have?** Take the reconstructed diopside and move iron from Fe²⁺ to Fe³⁺ without changing anything else. Mg# climbs, because the denominator shrinks (Figure 1). The paper's upper bound of 0.85 is reached at a ferric share of **8.4 %**; a third of the iron as Fe³⁺ would give Mg# 0.886, far outside what the paper reports. So the published Mg# range is itself a statement that these pyroxenes are nearly all ferrous — useful, because it means the paper's thermometry and its Mg# are not resting on a hidden oxidation assumption.

<!-- fig:ferric -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 275" role="img" aria-label="Mg# of the reconstructed diopside against the share of its iron treated as ferric. The paper's range of 0.83 to 0.85 is met only for a ferric share below about 8.4 per cent." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Diopside Mg# depends on the ferric guess</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Diopside Mg# depends on the ferric guess</text><line x1="58" x2="546" y1="229" y2="229" style="stroke:var(--line)"/><text x="52" y="233" text-anchor="end" style="fill:var(--muted)">82</text><line x1="58" x2="546" y1="189.6" y2="189.6" style="stroke:var(--line)"/><text x="52" y="193.6" text-anchor="end" style="fill:var(--muted)">84</text><line x1="58" x2="546" y1="150.2" y2="150.2" style="stroke:var(--line)"/><text x="52" y="154.2" text-anchor="end" style="fill:var(--muted)">86</text><line x1="58" x2="546" y1="110.8" y2="110.8" style="stroke:var(--line)"/><text x="52" y="114.8" text-anchor="end" style="fill:var(--muted)">88</text><line x1="58" x2="546" y1="71.4" y2="71.4" style="stroke:var(--line)"/><text x="52" y="75.4" text-anchor="end" style="fill:var(--muted)">90</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">92</text><line x1="58" x2="58" y1="229" y2="233" style="stroke:var(--muted)"/><text x="58" y="246" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="155.6" x2="155.6" y1="229" y2="233" style="stroke:var(--muted)"/><text x="155.6" y="246" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="253.2" x2="253.2" y1="229" y2="233" style="stroke:var(--muted)"/><text x="253.2" y="246" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="350.8" x2="350.8" y1="229" y2="233" style="stroke:var(--muted)"/><text x="350.8" y="246" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="448.4" x2="448.4" y1="229" y2="233" style="stroke:var(--muted)"/><text x="448.4" y="246" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="546" x2="546" y1="229" y2="233" style="stroke:var(--muted)"/><text x="546" y="246" text-anchor="middle" style="fill:var(--muted)">50</text><line x1="58" x2="546" y1="229" y2="229" style="stroke:var(--muted)"/><text x="302" y="267" text-anchor="middle" style="fill:var(--ink)">Share of iron taken as Fe³⁺ (%)</text><text transform="translate(14 130.5) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Mg# = 100 Mg/(Mg + Fe²⁺)</text><line x1="58" x2="546" y1="209.3" y2="209.3" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="204.3" text-anchor="end" style="fill:var(--muted)">paper: Mg# 0.83</text><line x1="58" x2="546" y1="169.9" y2="169.9" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="164.9" text-anchor="end" style="fill:var(--muted)">paper: Mg# 0.85</text><line x1="140" x2="140" y1="32" y2="229" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="144" y="72" text-anchor="start" style="fill:var(--muted)">8.4 %</text><path d="M58 192.7L62.9 191.4L67.8 190.1L72.6 188.7L77.5 187.4L82.4 186L87.3 184.7L92.2 183.3L97 182L101.9 180.6L106.8 179.3L111.7 177.9L116.6 176.6L121.4 175.2L126.3 173.8L131.2 172.5L136.1 171.1L141 169.7L145.8 168.3L150.7 167L155.6 165.6L160.5 164.2L165.4 162.8L170.2 161.4L175.1 160.1L180 158.7L184.9 157.3L189.8 155.9L194.6 154.5L199.5 153.1L204.4 151.7L209.3 150.3L214.2 148.9L219 147.5L223.9 146.1L228.8 144.7L233.7 143.2L238.6 141.8L243.4 140.4L248.3 139L253.2 137.6L258.1 136.1L263 134.7L267.8 133.3L272.7 131.8L277.6 130.4L282.5 129L287.4 127.5L292.2 126.1L297.1 124.6L302 123.2L306.9 121.8L311.8 120.3L316.6 118.8L321.5 117.4L326.4 115.9L331.3 114.5L336.2 113L341 111.5L345.9 110.1L350.8 108.6L355.7 107.1L360.6 105.6L365.4 104.1L370.3 102.7L375.2 101.2L380.1 99.7L385 98.2L389.8 96.7L394.7 95.2L399.6 93.7L404.5 92.2L409.4 90.7L414.2 89.2L419.1 87.7L424 86.2L428.9 84.7L433.8 83.2L438.6 81.6L443.5 80.1L448.4 78.6L453.3 77.1L458.2 75.5L463 74L467.9 72.5L472.8 70.9L477.7 69.4L482.6 67.9L487.4 66.3L492.3 64.8L497.2 63.2L502.1 61.6L507 60.1L511.8 58.5L516.7 57L521.6 55.4L526.5 53.8L531.4 52.3L536.2 50.7L541.1 49.1L546 47.5" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="267" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Mg# of the reconstructed diopside as more of its iron is called ferric. The paper's stated Mg# of 0.83 to 0.85 is reached only while the ferric share stays under about 8.4 per cent, so its analyses cannot have carried much Fe³⁺.</figcaption></figure>
<!-- /fig:ferric -->

**Step 4: the trap.** Charge balance is the standard way to get Fe³⁺ from a microprobe analysis (Droop 1987): if the cations come to more than the ideal number for the oxygen basis, the excess charge is made up by turning some Fe²⁺ into Fe³⁺. It works, but it turns **every analytical error into ferric iron**. We changed only the SiO₂ figure of our diopside and left the other eight oxides alone:

| SiO₂ (wt%) | Cations on 6 O (all Fe as Fe²⁺) | Fe³⁺ share from charge balance | Mg# | Fs |
|---|---|---|---|---|
| 51.50 | 4.0121 | 21.9 % | 86.9 | 9.11 |
| 52.00 | 4.0059 | 10.7 % | 85.3 | 9.11 |
| 52.48 (balanced) | 4.0000 | 0 % | 83.8 | 9.11 |
| 53.00 | 3.9936 | 0 % | 83.8 | 9.11 |

A one weight per cent shortfall in SiO₂, well inside what a poorly calibrated session or an unpolished grain can produce, invents ferric iron for a fifth of the total iron and raises Mg# by **three points** — enough to carry the mineral out of the paper's stated range. Meanwhile **Fs does not move at all**, because Morimoto's Fs counts total iron. The lesson is practical: report Wo-En-Fs if you want a number that survives small analytical errors, and always say how Fe³⁺ was handled when you report Mg#. Note the asymmetry in the table too: an SiO₂ *excess* leaves the cation sum below 4 and the method simply assigns no ferric iron, so the error hides instead of showing up.

<!-- fig:sierror -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="Changing only the SiO2 figure of the reconstructed diopside. Below the balanced value the charge-balance method invents ferric iron and Mg# climbs; Fs, which counts all the iron, does not move." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>A 1 wt% SiO₂ error moves Mg#, not Wo-En-Fs</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">A 1 wt% SiO₂ error moves Mg#, not Wo-En-Fs</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--line)"/><text x="52" y="266" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="215.9" y2="215.9" style="stroke:var(--line)"/><text x="52" y="219.9" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="169.8" y2="169.8" style="stroke:var(--line)"/><text x="52" y="173.8" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="123.7" y2="123.7" style="stroke:var(--line)"/><text x="52" y="127.7" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="77.7" y2="77.7" style="stroke:var(--line)"/><text x="52" y="81.7" text-anchor="end" style="fill:var(--muted)">80</text><line x1="58" x2="58" y1="262" y2="266" style="stroke:var(--muted)"/><text x="58" y="279" text-anchor="middle" style="fill:var(--muted)">51.5</text><line x1="180" x2="180" y1="262" y2="266" style="stroke:var(--muted)"/><text x="180" y="279" text-anchor="middle" style="fill:var(--muted)">52</text><line x1="302" x2="302" y1="262" y2="266" style="stroke:var(--muted)"/><text x="302" y="279" text-anchor="middle" style="fill:var(--muted)">52.5</text><line x1="424" x2="424" y1="262" y2="266" style="stroke:var(--muted)"/><text x="424" y="279" text-anchor="middle" style="fill:var(--muted)">53</text><line x1="546" x2="546" y1="262" y2="266" style="stroke:var(--muted)"/><text x="546" y="279" text-anchor="middle" style="fill:var(--muted)">53.5</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">SiO₂ in the analysis (wt%)</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Per cent</text><line x1="297.1" x2="297.1" y1="50" y2="262" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="293.1" y="62" text-anchor="end" style="fill:var(--muted)">balanced analysis</text><path d="M58 211.6L64.1 212.8L70.2 214.1L76.3 215.4L82.4 216.7L88.5 218L94.6 219.3L100.7 220.6L106.8 221.9L112.9 223.2L119 224.5L125.1 225.8L131.2 227.1L137.3 228.4L143.4 229.6L149.5 230.9L155.6 232.2L161.7 233.5L167.8 234.8L173.9 236.1L180 237.4L186.1 238.7L192.2 240L198.3 241.3L204.4 242.6L210.5 243.9L216.6 245.2L222.7 246.5L228.8 247.7L234.9 249L241 250.3L247.1 251.6L253.2 252.9L259.3 254.2L265.4 255.5L271.5 256.8L277.6 258.1L283.7 259.4L289.8 260.7L295.9 262L302 262L308.1 262L314.2 262L320.3 262L326.4 262L332.5 262L338.6 262L344.7 262L350.8 262L356.9 262L363 262L369.1 262L375.2 262L381.3 262L387.4 262L393.5 262L399.6 262L405.7 262L411.8 262L417.9 262L424 262L430.1 262L436.2 262L442.3 262L448.4 262L454.5 262L460.6 262L466.7 262L472.8 262L478.9 262L485 262L491.1 262L497.2 262L503.3 262L509.4 262L515.5 262L521.6 262L527.7 262L533.8 262L539.9 262L546 262" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 61.7L64.1 61.9L70.2 62.1L76.3 62.3L82.4 62.5L88.5 62.7L94.6 62.9L100.7 63L106.8 63.2L112.9 63.4L119 63.6L125.1 63.8L131.2 64L137.3 64.2L143.4 64.3L149.5 64.5L155.6 64.7L161.7 64.9L167.8 65.1L173.9 65.3L180 65.4L186.1 65.6L192.2 65.8L198.3 66L204.4 66.2L210.5 66.3L216.6 66.5L222.7 66.7L228.8 66.9L234.9 67.1L241 67.2L247.1 67.4L253.2 67.6L259.3 67.8L265.4 67.9L271.5 68.1L277.6 68.3L283.7 68.5L289.8 68.6L295.9 68.8L302 68.8L308.1 68.8L314.2 68.8L320.3 68.8L326.4 68.8L332.5 68.8L338.6 68.8L344.7 68.8L350.8 68.8L356.9 68.8L363 68.8L369.1 68.8L375.2 68.8L381.3 68.8L387.4 68.8L393.5 68.8L399.6 68.8L405.7 68.8L411.8 68.8L417.9 68.8L424 68.8L430.1 68.8L436.2 68.8L442.3 68.8L448.4 68.8L454.5 68.8L460.6 68.8L466.7 68.8L472.8 68.8L478.9 68.8L485 68.8L491.1 68.8L497.2 68.8L503.3 68.8L509.4 68.8L515.5 68.8L521.6 68.8L527.7 68.8L533.8 68.8L539.9 68.8L546 68.8" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 241L64.1 241L70.2 241L76.3 241L82.4 241L88.5 241L94.6 241L100.7 241L106.8 241L112.9 241L119 241L125.1 241L131.2 241L137.3 241L143.4 241L149.5 241L155.6 241L161.7 241L167.8 241L173.9 241L180 241L186.1 241L192.2 241L198.3 241L204.4 241L210.5 241L216.6 241L222.7 241L228.8 241L234.9 241L241 241L247.1 241L253.2 241L259.3 241L265.4 241L271.5 241L277.6 241L283.7 241L289.8 241L295.9 241L302 241L308.1 241L314.2 241L320.3 241L326.4 241L332.5 241L338.6 241L344.7 241L350.8 241L356.9 241L363 241L369.1 241L375.2 241L381.3 241L387.4 241L393.5 241L399.6 241L405.7 241L411.8 241L417.9 241L424 241L430.1 241L436.2 241L442.3 241L448.4 241L454.5 241L460.6 241L466.7 241L472.8 241L478.9 241L485 241L491.1 241L497.2 241L503.3 241L509.4 241L515.5 241L521.6 241L527.7 241L533.8 241L539.9 241L546 241" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Fe³⁺ share of iron (charge balance)</text><line x1="336" x2="348" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="352" y="40" style="fill:var(--muted)">Mg#</text><line x1="383.6" x2="395.6" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="399.6" y="40" style="fill:var(--muted)">Fs (Wo-En-Fs)</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The same analysis with only its SiO₂ figure changed. One weight per cent of SiO₂ either way is enough to make the charge-balance method assign a fifth of the iron to Fe³⁺ and push Mg# up by three points, while the Wo-En-Fs triple, which counts total iron, stays put.</figcaption></figure>
<!-- /fig:sierror -->

## How we made the graphs

The charts and every number come from `scripts/blog-figures/guinadji-websterite-pyroxene-end-members-mg-number.mjs` in fibub's public code. It calls `formula`, `BY_KEY` and `molarMass` from `src/lib/sci/mineral.ts`, the maths behind the [[mineral-formula]] calculator, so what the article says and what the tool page shows cannot drift apart.

Where each input comes from:

- The end-member ranges, the Mg# ranges, and the temperature and pressure: **the paper's abstract**.
- The three oxide analyses: **ours**. They are built from cations per formula unit chosen to be exactly stoichiometric and to land on the mid-points of the paper's ranges, then converted to weight per cent. They are **not the paper's measurements**, and the minor oxides (TiO₂, Al₂O₃, Cr₂O₃, Na₂O, MnO) are plausible values we picked.
- The oxygen bases (6 for pyroxene, 8 for feldspar), the ideal cation totals (4 and 5), the Droop method and the Wo-En-Fs and An-Ab-Or definitions: **the standard conventions**, built into the tool.
- The SiO₂ scan from 51.5 to 53.5 wt% and the ferric scan from 0 to 50 %: **our assumptions**, chosen to span realistic analytical error and realistic oxidation states.

## How we test the maths

Every change to fibub runs `tests/sci.mjs`, which loads `tests/sci-tools/mineral-formula.mjs`. It pins the calculator against an independent NumPy script and against textbook stoichiometry:

- Pure forsterite, diopside, anorthite and almandine analyses must return their ideal cations per formula unit and their ideal end-members (Fo 100, Wo 50 En 50, An 100) to within rounding.
- Droop's equation F = 2X(1 − T/S) must give the same Fe³⁺ and the same recalculated FeO and Fe₂O₃ weight per cents as the NumPy implementation, on pyroxene, garnet and spinel analyses.
- Reading a table must handle oxide names in either direction (down the first column or across the top), the `FeOt` and `FeO*` spellings for total iron, and `n.d.` and below-detection entries.
- New with this article: our three reconstructed Guinadji analyses must give cation sums of 4.0000, 4.0000 and 5.0000 on their oxygen bases with zero charge-balance Fe³⁺; Wo-En-Fs of 46.4/44.5/9.1 and 1.5/76.3/22.2; An 59.9; and Mg# 83.83 and 77.94. And the SiO₂ scan must reproduce the trap: at SiO₂ 51.50 wt% the charge-balance method must put 21.9 % of the iron in the ferric state and raise Mg# to 86.91, while Fs stays at 9.11.

## Check it yourself

On the [[mineral-formula]] page:

1. Set *Mineral* to **Pyroxene**. *Oxygens per formula unit* fills in as **6** and *Ideal cations (for Fe³⁺)* as **4**; leave *Iron* on **estimate Fe³⁺ by charge balance (Droop)**.
2. Clear *Your analyses (oxide wt%)* and paste these two rows, tab- or comma-separated:

   ```
   Sample, SiO2, TiO2, Al2O3, Cr2O3, FeO, MnO, MgO, CaO, Na2O
   Di-Guinadji, 52.48, 0.72, 2.54, 0.34, 5.33, 0.32, 15.50, 22.49, 0.28
   En-Guinadji, 54.61, 0.37, 1.42, 0.18, 14.17, 0.40, 28.09, 0.77, 0
   ```

3. The *Formulae* table reads **Wo 46.4, En 44.5, Fs 9.1, Mg# 83.8** for the diopside and **Wo 1.5, En 76.3, Fs 22.2, Mg# 77.9** for the enstatite, both with a cation sum of **4.000** and **no Fe³⁺**: the paper's two mid-range pyroxenes.
4. Change the diopside's SiO₂ from **52.48** to **51.50** and nothing else. Fe³⁺ appears, taking about **22 %** of the iron, and Mg# jumps to **86.9**, while Fs stays at **9.11**. That one keystroke is the whole argument of Step 4.
5. Switch *Iron* to **all iron as Fe²⁺** and Mg# falls back to **83.8** even with the wrong SiO₂: the difference between the two settings is a good warning light for an analysis that does not add up.
6. Now set *Mineral* to **Feldspar** (8 oxygens, 5 cations) and paste

   ```
   Sample, SiO2, Al2O3, CaO, Na2O, K2O
   Pl-Guinadji, 53.02, 29.99, 12.35, 4.44, 0.19
   ```

   It reads **An 59.9, Ab 39.0, Or 1.1**, a labradorite in the middle of the paper's An 58.30 to 61.47.

## What researchers can use it for

- **Recompute a published mineral table** in the browser, on the same oxygen basis, and see whether the printed end-members follow from the printed oxides. Disagreements usually come from a different iron treatment or a different oxygen basis.
- **Screen a microprobe session for drift.** Run every analysis with charge balance and with all iron ferrous. Grains where the two Mg# values differ by more than a point or two are telling you the analysis does not close, not that the mineral is oxidised.
- **Bound the oxidation state from a published Mg#**, as in Step 3: if a paper gives both Wo-En-Fs and Mg#, the gap between En/(En + Fs) and Mg# is its ferric iron, whether the authors said so or not.
- **Prepare numbers for a thermometer.** Two-pyroxene and pyroxene-liquid thermometers want cations per formula unit on a stated basis; get them here first, then carry them into your thermometry.
- **Teach the formula calculation** with a stoichiometric analysis you built yourself, as we did, so students see the cation sum come out at exactly 4.000 before they meet real data that never does.
- **Classify the rock as well as the minerals** by sending the modal counts to the [[point-counter]] and the hand-specimen properties to the [[mineral-id-key]].

## The fine print

- Only the paper's abstract was readable from here. The three analyses in this article are **ours**, reconstructed to the paper's published end-members; they are not its microprobe data, and the minor oxides are our own plausible choices.
- Because the analyses are built to be exactly stoichiometric, the round trip in Step 2 cannot fail. Its value is that it shows which convention the tool uses and gives a reproducible worked example, not that it confirms the paper's measurements.
- Mg# is defined here as 100 Mg/(Mg + Fe²⁺), as the paper's values imply. Some authors use total iron, which gives a lower number; the two differ by exactly the effect in Figure 1.
- Fs follows Morimoto (1988) and counts Fe²⁺, Fe³⁺ and Mn together. Papers that leave Mn out of Fs will differ by a few tenths.
- The paper's temperatures and pressures come from thermobarometers that fibub does not implement, so nothing here checks the 1195 to 1208 °C or the 4.7 to 5.9 kbar.
- The charge-balance method assumes the mineral is anhydrous and fully analysed. For amphibole and mica, where hydrogen, fluorine and site vacancies all matter, treat its Fe³⁺ as an indication only.
