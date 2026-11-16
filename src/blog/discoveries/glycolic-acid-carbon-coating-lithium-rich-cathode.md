---
title: "Glycolic acid carbon coating for lithium-rich manganese cathodes"
summary: "A mild glycolic acid wash plus a thin carbon skin lifts the first-cycle efficiency of a lithium-rich cathode from 83.5 to 89.9 %. We check the capacities, fade and impedance with fibub's battery and EIS tools."
tools: [battery-cycling-analyser, impedance-fitter]
updated: 2026-11-16
sources:
  - "Yang, X., Miao, J., Chen, Y., Fang, Y., Wang, H., Peng, G. (2026), Glycolic Acid-Induced Surface Reconstruction and In Situ Carbon Coating for High-Electrochemical-Performance Lithium-Rich Manganese-Based Cathodes, Batteries 12(2), 70, doi:10.3390/batteries12020070. Licence CC BY, checked on the journal page, 2026-11-16. Values used here: first-cycle efficiency 83.5 % (untreated) and 89.9 % (treated) with first discharge 259.2 and 285.8 mAh/g at 0.1 C; discharge capacities at 0.1, 0.2, 0.5, 1, 2 and 3 C; 1 C cycling from 253.9 and 239.2 mAh/g with 81 % and 76 % kept after 100 cycles (main text); Re and Rct before (7.167 and 174.0 Ω; 3.673 and 149.5 Ω) and after cycling (11.96 and 338.4 Ω; 8.476 and 150.7 Ω); lithium diffusion coefficients 4.65 × 10⁻¹⁷ and 2.47 × 10⁻¹⁶ cm²/s; electrode area 1.44 cm²; impedance from 100 kHz to 10 mHz at 25 °C."
  - "Exchange current density from charge-transfer resistance, i₀ = RT/(nF·Rct): Bard, A. J. and Faulkner, L. R., Electrochemical Methods, 2nd ed. (2001), chapter 3."
paper:
  title: "Glycolic Acid-Induced Surface Reconstruction and In Situ Carbon Coating for High-Electrochemical-Performance Lithium-Rich Manganese-Based Cathodes"
  authors: "Yang, X.; Miao, J.; Chen, Y.; Fang, Y.; Wang, H.; Peng, G."
  journal: "Batteries"
  year: 2026
  doi: "10.3390/batteries12020070"
  url: "https://www.mdpi.com/2313-0105/12/2/70"
  licence: "CC BY"
  reviewed: true
---

**Lithium-rich manganese oxides** are among the highest-capacity cathode materials for lithium-ion batteries, storing well over 250 mAh of charge per gram. Two problems hold them back: a lot of lithium is lost in the very first charge, and the voltage and capacity sag as the cell is cycled. A 2026 study in *Batteries* treats the cathode powder with a mild glycolic acid wash and a short bake, which rebuilds its surface and leaves a carbon skin a few nanometres thick. This article shows how the [[battery-cycling-analyser]] and the [[impedance-fitter]] let anyone check the paper's efficiencies, fade and resistances, and where the numbers tell a more mixed story than the headline.

## The paper in brief

The team made a lithium-rich cathode (Li-, Mn-, Ni- and Co-based layered oxide) and stirred it in ethanol with 3, 5 or 7 % glycolic acid, then baked it at 450 °C. The acid takes some lithium and oxygen from the surface, which turns the outermost layer into a spinel-like structure that lets lithium in and out more easily; the leftover organic acid turns into a thin carbon coat. The 5 % sample (called LRM-G5) worked best.

They report a higher first-cycle efficiency (89.9 % against 83.5 %), more capacity at every rate in their rate test, slower voltage decay (1.7 against 3.5 mV per cycle), a lower charge-transfer resistance, and a lithium diffusion coefficient about five times higher, measured by impedance.

## Checked with the tools

**Step 1: the first cycle.** A cathode's first-cycle efficiency is the discharge capacity divided by the charge capacity. Working back from the paper's efficiency and first discharge, the Battery cycling analyser gives a first charge of **310.4 mAh/g** for the untreated cathode and **317.9 mAh/g** for the treated one. So the untreated cathode loses **51.2 mAh/g** for good in the first cycle and the treated one only **32.1 mAh/g**: about 37 % less lithium wasted. That is the clearest gain in the paper.

**Step 2: rate capability.** Dividing each discharge capacity in the paper's rate test by the 0.1 C value gives the share kept at each rate (Figure 1). At 3 C (a full discharge in 20 minutes) the treated cathode keeps **64.5 %** against **60.5 %**, and gives 183.9 against 160.2 mAh/g. At 1 C, though, the shares are close (77.4 against 79.1 %): the treated cathode gives more capacity because it starts higher, not because it holds up better at that rate.

<!-- fig:rate -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="At 3 C the treated cathode keeps 64.5 % of its 0.1 C capacity and the untreated one 60.5 %." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Rate capability: share of the 0.1 C capacity kept</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Rate capability: share of the 0.1 C capacity kept</text><line x1="58" x2="546" y1="212.2" y2="212.2" style="stroke:var(--line)"/><text x="52" y="216.2" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="172.7" y2="172.7" style="stroke:var(--line)"/><text x="52" y="176.7" text-anchor="end" style="fill:var(--muted)">70</text><line x1="58" x2="546" y1="133.1" y2="133.1" style="stroke:var(--line)"/><text x="52" y="137.1" text-anchor="end" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="93.5" y2="93.5" style="stroke:var(--line)"/><text x="52" y="97.5" text-anchor="end" style="fill:var(--muted)">90</text><line x1="58" x2="546" y1="54" y2="54" style="stroke:var(--line)"/><text x="52" y="58" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="58" y1="232" y2="236" style="stroke:var(--muted)"/><text x="58" y="249" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="215.4" x2="215.4" y1="232" y2="236" style="stroke:var(--muted)"/><text x="215.4" y="249" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="372.8" x2="372.8" y1="232" y2="236" style="stroke:var(--muted)"/><text x="372.8" y="249" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="530.3" x2="530.3" y1="232" y2="236" style="stroke:var(--muted)"/><text x="530.3" y="249" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">C-rate</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Capacity kept (%)</text><path d="M73.7 54L89.5 81.3L136.7 109.3L215.4 143.4L372.8 170.3L530.3 194.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M73.7 54L89.5 86L136.7 114.9L215.4 136.6L372.8 173.4L530.3 210.2" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="73.7" cy="54" r="2.2" style="fill:var(--c-blog);opacity:1"/><circle cx="89.5" cy="81.3" r="2.2" style="fill:var(--c-blog);opacity:1"/><circle cx="136.7" cy="109.3" r="2.2" style="fill:var(--c-blog);opacity:1"/><circle cx="215.4" cy="143.4" r="2.2" style="fill:var(--c-blog);opacity:1"/><circle cx="372.8" cy="170.3" r="2.2" style="fill:var(--c-blog);opacity:1"/><circle cx="530.3" cy="194.4" r="2.2" style="fill:var(--c-blog);opacity:1"/><circle cx="73.7" cy="54" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="89.5" cy="86" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="136.7" cy="114.9" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="215.4" cy="136.6" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="372.8" cy="173.4" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="530.3" cy="210.2" r="2.2" style="fill:var(--c-tools);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Glycolic-acid treated (G5)</text><line x1="271.2" x2="283.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="287.2" y="40" style="fill:var(--muted)">Untreated</text></svg><figcaption>Figure 1. Share of the 0.1 C capacity each cathode keeps at higher rates, worked out from the discharge capacities in the paper's rate test.</figcaption></figure>
<!-- /fig:rate -->

**Step 3: fade at 1 C.** The paper's main text gives the untreated cathode 81 % of its capacity after 100 cycles at 1 C and the treated one 76 %, from first capacities of 253.9 and 239.2 mAh/g. We simulated 100 cycles with a straight-line fade between those points and ran them through the analyser: **0.192 %** per cycle untreated, **0.242 %** per cycle treated, and 80 % reached at about cycle **84** for the treated cathode (about cycle **105**, extrapolated, for the untreated one). The paper's abstract says 81 % for the *treated* cathode, and the text says it keeps about 10 percentage points more after 200 cycles, so the 100-cycle numbers in the text and the abstract do not agree. Our check cannot settle which is right; it shows why readers should look at the cycling plot itself and not one number.

**Step 4: impedance.** The paper fits its impedance spectra with a solution resistance Re and a charge-transfer resistance Rct. We built spectra with the Impedance fitter's Randles circuit from those values (Figure 2) and fitted them back: the fitter recovers every value exactly, as it should for clean data. With the 1.44 cm² electrode, the fitter's **exchange current density** (how fast lithium crosses the surface at rest, i₀ = RT/(nF·Rct·A)) is **1.03 × 10⁻⁴ A/cm²** for the fresh untreated cathode and **1.19 × 10⁻⁴ A/cm²** for the treated one. After cycling, the untreated cathode's Rct rises by **94 %** (i₀ halves to 5.3 × 10⁻⁵ A/cm²), while the treated one's rises by under **1 %**. That is the strongest sign that the new surface protects the cathode.

<!-- fig:eis -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="Simulated Nyquist plots: after cycling the untreated cathode's arc roughly doubles, the treated one barely changes." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Impedance after cycling (simulated from the paper's fitted values)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Impedance after cycling (simulated from the paper's fitted values)</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--line)"/><text x="52" y="246" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="168.2" y2="168.2" style="stroke:var(--line)"/><text x="52" y="172.2" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="94.3" y2="94.3" style="stroke:var(--line)"/><text x="52" y="98.3" text-anchor="end" style="fill:var(--muted)">200</text><line x1="58" x2="58" y1="242" y2="246" style="stroke:var(--muted)"/><text x="58" y="259" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="151.8" x2="151.8" y1="242" y2="246" style="stroke:var(--muted)"/><text x="151.8" y="259" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="245.7" x2="245.7" y1="242" y2="246" style="stroke:var(--muted)"/><text x="245.7" y="259" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="339.5" x2="339.5" y1="242" y2="246" style="stroke:var(--muted)"/><text x="339.5" y="259" text-anchor="middle" style="fill:var(--muted)">300</text><line x1="433.4" x2="433.4" y1="242" y2="246" style="stroke:var(--muted)"/><text x="433.4" y="259" text-anchor="middle" style="fill:var(--muted)">400</text><line x1="527.2" x2="527.2" y1="242" y2="246" style="stroke:var(--muted)"/><text x="527.2" y="259" text-anchor="middle" style="fill:var(--muted)">500</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">Z′ (Ω)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">−Z″ (Ω)</text><path d="M66.1 241.6L66.2 241.4L66.2 241.3L66.3 241L66.4 240.7L66.5 240.3L66.7 239.8L67 239L67.3 238.1L67.9 236.9L68.5 235.3L69.5 233.2L71 230.6L73.3 227.3L76.4 223.2L81 218.4L87.6 212.9L96.6 207.2L108.3 202L122.6 198.2L138.2 196.5L153.9 197.2L168.3 200L180.4 203.9L190 208L197.8 211.9L204.1 214.9L209.4 217L214.1 218.3L218.6 218.5L223.1 217.9L227.9 216.4L233.1 214.1L239 210.8L245.7 206.7L253.5 201.5L262.5 195L273 187.3L285.3 178L299.7 167L316.6 154L336.5 138.5L360 120.3L387.6 98.7L420.2 73.3L458.4 43.2L503.6 7.8" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M69.4 241.6L69.4 241.4L69.4 241.3L69.5 241L69.6 240.7L69.7 240.3L69.9 239.7L70.2 239L70.5 238.1L71 236.8L71.6 235.1L72.5 233L73.6 230.2L75.3 226.5L77.7 221.8L81.2 215.7L86.2 208.1L93.6 198.7L104.2 187.6L119.3 175.2L139.8 162.2L166.5 150.4L198.6 141.6L233.8 137.3L269 138L301.4 142.7L329.5 149.6L353.1 156.9L372.7 163.1L389.5 167.6L404.7 169.6L419.2 169.3L433.9 166.6L449.3 161.3L466.2 153.4L485.2 142.7L506.9 129.1L531.7 112.2" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M64.9 241.6L64.9 241.4L64.9 241.3L65 241L65.1 240.7L65.3 240.3L65.5 239.8L65.7 239L66.1 238.1L66.5 236.9L67.3 235.3L68.2 233.2L69.6 230.5L71.7 227.1L74.7 222.9L79 217.7L85.2 211.6L93.9 205.1L105.6 198.4L120.2 192.6L137.4 188.5L155.6 186.8L173.5 187.4L189.9 189.6L204 192.5L216.2 195.3L226.8 197.2L236.4 198.1L245.5 197.7L254.7 195.8L264.3 192.5L274.8 187.6L286.5 181.2L299.7 172.9L315 162.6L332.8 150.1L353.3 135L377.5 116.9L405.7 95.4L438.8 69.9L477.8 39.8L523.7 4.1" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round;stroke-dasharray:4 3"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Treated, cycled</text><line x1="192" x2="204" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="208" y="40" style="fill:var(--muted)">Untreated, cycled</text><line x1="340.4" x2="352.4" y1="36" y2="36" style="stroke:var(--muted);stroke-width:2;stroke-dasharray:4 3"/><text x="356.4" y="40" style="fill:var(--muted)">Untreated, fresh</text></svg><figcaption>Figure 2. Nyquist plots simulated with the Impedance fitter's Randles circuit, using the paper's fitted Re and Rct and our assumed double-layer and Warburg values. An illustration, not the measured spectra.</figcaption></figure>
<!-- /fig:eis -->

**Step 5: diffusion.** The paper's two diffusion coefficients differ by a factor of **5.3** (2.47 × 10⁻¹⁶ ÷ 4.65 × 10⁻¹⁷), which the paper calls about an order of magnitude. Because the Warburg coefficient σ goes as 1/√D, the treated cathode's low-frequency tail in our simulation is 2.3 times less steep for the same assumed electrode.

| Check | Paper | Tool result |
|---|---|---|
| First charge, untreated / treated | (from efficiency and discharge) | 310.4 / 317.9 mAh/g |
| Lithium lost in cycle 1 | (not stated) | 51.2 / 32.1 mAh/g |
| Share kept at 3 C | (from the rate test) | 60.5 / 64.5 % |
| Fade at 1 C, 100 cycles (main text) | 81 % / 76 % kept | 0.192 / 0.242 % per cycle |
| Rct rise after cycling | 174.0 → 338.4 Ω; 149.5 → 150.7 Ω | +94 % / +0.8 % |
| i₀, fresh electrodes (1.44 cm²) | (not stated) | 1.03 / 1.19 × 10⁻⁴ A/cm² |
| Diffusion coefficient ratio | "about one order of magnitude" | 5.3 times |

## How we made the graphs

Everything above comes from `scripts/blog-figures/glycolic-acid-carbon-coating-lithium-rich-cathode.mjs` in fibub's public code. It calls:

- `cycling` and `cyclesTo` from `src/lib/sci/battery.ts`, the maths behind the [[battery-cycling-analyser]], for the first-cycle loss, the fade per cycle and the cycle at which 80 % is reached.
- `MODELS` (the Randles circuit), `fitEIS` and `exchangeCurrent` from `src/lib/sci/eis.ts`, the maths behind the [[impedance-fitter]].

Where the inputs come from: the efficiencies, capacities, Re, Rct, diffusion coefficients, electrode area and frequency range are from the paper. The straight-line fade, a coulombic efficiency of 99.6 % in the simulated cycles, the double-layer values (Q = 2 × 10⁻⁵, α = 0.85) and a Warburg coefficient of 300 Ω·s^−½ for the untreated cathode are **our assumptions**. Figure 1 is worked out from the paper's capacities; Figure 2 and the 100-cycle fade are **simulations**, not the measured data.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks these functions against known answers:

- A straight-line set of cycles losing 1 % per cycle must give a fade of exactly 1 % per cycle and reach 80 % at cycle 21; the built-in example must give a first-cycle efficiency of 88 % and reach 80 % at cycle 184.
- Every circuit in the impedance fitter, including the Randles circuit with Rs 20 Ω, Rct 100 Ω, α 0.9 and σ 30 Ω·s^−½, must be fitted back to its exact values, and a two-arc circuit must be flagged as unreliable on one-arc data.
- The exchange current density for 1 Ω·cm² at 25 °C must be 0.025693 A/cm² (RT/F).

## Check it yourself

**The first cycle, on the [[battery-cycling-analyser]]:**

1. In *Cycle number, charge capacity and discharge capacity, one cycle per line*, type two lines: **1 317.9 285.8** and **100 182.5 181.8** (the treated cathode's first cycle at 0.1 C, and our simulated cycle 100 at 1 C; the retention it shows mixes two rates, so read only the first-cycle line here).
2. Set *Capacity unit* to **mAh/g**, *Coulombic efficiency is* to **discharge ÷ charge (cathode, full cell)** and *Reference cycle for retention* to **1**.
3. *First cycle* reads a first-cycle efficiency of **89.9 %** with **32.1 mAh/g** lost. Change the first line to **1 310.4 259.2** for the untreated cathode: **83.5 %** and **51.2 mAh/g**.

**The impedance, on the [[impedance-fitter]]:**

1. Paste this simulated spectrum of the cycled, untreated cathode (frequency in Hz, Z′ and Z″ in Ω) into *Frequency and impedance, three columns, one frequency per line*:

```
100000	12.1	-0.5728
31600	12.33	-1.522
10000	12.98	-4.034
3160	14.87	-10.62
1000	20.96	-27.4
316	43.03	-65.81
100	115.6	-124
31.6	242.7	-138.2
10	335.3	-106.8
3.16	392.6	-99.84
1	455.2	-134.5
0.316	552.9	-219.6
0.1	720.6	-381.5
0.0316	1016	-674.2
0.01	1540	-1197
```

2. Leave *Columns are* on **f, Z′, Z″** and *Equivalent circuit* on the **R(Q(RW))** Randles circuit.
3. Type **1.44** in *Electrode area (cm², optional)*, **1** in *Electrons n* and **25** in *Temperature (°C)*.
4. The fit reads Rs about **11.96 Ω**, Rct about **338.4 Ω**, *Rct × area* about **487 Ω·cm²** and *Exchange current density i₀* about **52.7 µA/cm²**.

## What researchers can use it for

- **Turn efficiencies into lost capacity**: the [[battery-cycling-analyser]] shows how many mAh/g a coating saves in the first cycle, which matters more for a full cell than the percentage.
- **Compare fade fairly**: paste cycling data from two cells and read fade per cycle and cycles to 80 % on the same terms.
- **Re-fit impedance** with several circuits in the [[impedance-fitter]] and see which values the data can really pin down.
- **Turn Rct into i₀** so cells with different electrode areas can be compared.
- **Teach** why the first cycle of a lithium-rich cathode loses so much lithium, and what a growing impedance arc means.

## The fine print

- The fade in Step 3 is a straight line between two stated points; real cells fade unevenly, and the paper's 200- and 400-cycle tests are not modelled here.
- The text and abstract disagree on the 100-cycle retention; we used the text's values and say so.
- i₀ from Rct assumes one simple charge-transfer step near equilibrium; a real cathode surface has several processes in the arc.
- The double-layer and Warburg values in Figure 2 are assumed, so only the arc widths (Re and Rct) follow the paper.
