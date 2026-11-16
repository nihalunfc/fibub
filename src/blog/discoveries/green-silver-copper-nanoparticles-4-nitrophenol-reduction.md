---
title: "Plant-made silver and copper nanoparticles reduce 4-nitrophenol"
summary: "Silver and copper nanoparticles made with a plant extract convert 90 and 93.5 % of the pollutant 4-nitrophenol. The paper gives no rate constant, so we work out what its numbers imply with fibub's kinetics and Beer–Lambert tools."
tools: [reaction-kinetics-fitter, beer-lambert-calculator]
updated: 2026-11-16
sources:
  - "Joseph Ignacy, J. B., Sinnappan, S. J. X., Ganesan, S., Pal, A., S., S. et al. (2026), Eco-friendly synthesis of nanosized Ag and Cu for the catalytic disintegration of 4-nitrophenol, Frontiers in Materials 13, 1741476, doi:10.3389/fmats.2026.1741476. Licence CC BY, checked on the journal page, 2026-11-16. Values used here: 1 mM 4-nitrophenol (300 µL) in 2 mL water, 0.1 M NaBH4 (100 µL), 0.5 mg catalyst in 1 mL water; monitored at 400 nm; conversion 90 % (silver) and 93.5 % (copper); copper finished within 50 min; pseudo-first-order model; particle sizes 9.8 nm (silver) and 3.6 nm (copper) by TEM; five reuse cycles."
  - "Molar absorptivity of 4-nitrophenolate, 18 380 L/(mol·cm) near 400 nm: Bowers, G. N. Jr. et al. (1980), High-purity 4-nitrophenol: purification, characterization, and specifications for use as a spectrophotometric reference material, Clinical Chemistry 26, 724-729."
paper:
  title: "Eco-friendly synthesis of nanosized Ag and Cu for the catalytic disintegration of 4-nitrophenol"
  authors: "Joseph Ignacy, J. B.; Sinnappan, S. J. X.; Ganesan, S.; Pal, A.; S., S. et al."
  journal: "Frontiers in Materials"
  year: 2026
  doi: "10.3389/fmats.2026.1741476"
  url: "https://www.frontiersin.org/journals/materials/articles/10.3389/fmats.2026.1741476"
  licence: "CC BY 4.0"
  reviewed: true
---

**4-Nitrophenol** is a toxic by-product of dyes, drugs and pesticides that turns up in industrial waste water. With sodium borohydride (NaBH₄) and a metal catalyst it turns into 4-aminophenol, which is far less harmful and useful in its own right. The reaction is also the standard test bench for new nanoparticle catalysts, because its yellow colour fades as it goes and is easy to follow with a spectrometer. A 2026 study in *Frontiers in Materials* makes silver and copper nanoparticles with a plant extract and a microwave oven, and tests them on this reaction. This article shows how the [[reaction-kinetics-fitter]] and the [[beer-lambert-calculator]] help a researcher plan such a test and turn conversions into the rate constants that let catalysts be compared.

## The paper in brief

The team reduced silver nitrate and copper sulfate with a plant extract in a household-style microwave, giving silver particles about 10 nm across and copper particles about 4 nm across (by electron microscopy). In the test, 4-nitrophenol and an excess of NaBH₄ were mixed with 0.5 mg of catalyst, and the yellow band at **400 nm** was followed until it faded. Silver converted **90 %** of the 4-nitrophenol and copper **93.5 %**, copper finishing within **50 minutes**, and the copper particles kept about 95 % conversion after five reuses. The paper fits its data with a pseudo-first-order model but does not give a value for the rate constant, the number most papers use to compare catalysts.

## Checked with the tools

**Step 1: is the starting absorbance in range?** From the stated amounts, if everything is mixed in one cuvette (3.4 mL in total, our reading of the method), the 4-nitrophenol is at **88.2 µM**. With a molar absorptivity of 18 380 L/(mol·cm), the Beer–Lambert calculator gives a starting absorbance of **1.62** in a 1 cm cell. The tool flags that as **high**: under 3 % of the light gets through, where stray light starts to bend the line. Halving the 4-nitrophenol would put the start near 0.8, in the most accurate range.

**Step 2: is "pseudo-first-order" justified?** The method has 10 µmol of NaBH₄ for 0.3 µmol of 4-nitrophenol: **33 times** as many molecules, or **44 times** what the reaction strictly needs (each 4-nitrophenol takes six electrons; each borohydride gives eight). With that excess, the borohydride hardly changes during the run, so the rate depends on 4-nitrophenol alone and a first-order fit is fair.

**Step 3: what rate constant do the numbers imply?** For a first-order reaction, a conversion X after time t means k = −ln(1 − X)/t. If copper reached 93.5 % at 50 minutes, k = **0.0547 per minute** (9.1 × 10⁻⁴ per second), a half-life of **12.7 minutes**. Per milligram of catalyst that is 0.109 per minute per mg. For silver, the paper gives no time, so the k behind its 90 % could be anything from **0.115** per minute (if it took 20 minutes) to **0.026** (if 90 minutes). Figure 2 shows why: the same conversion means a very different catalyst depending on how long it took.

**Step 4: fitting a run.** We simulated a copper run, readings every 5 minutes with a little scatter, and gave it to the Reaction kinetics fitter (Figure 1). It recovers **k = 0.0547 ± 0.0002 per minute**, and the Akaike weights (how strongly the data prefer each model) put essentially all the support on **first order** (R² 0.9999), against 0.92 for zero order and 0.95 for second order. Real runs often start with an **induction period**, a few minutes before the colour starts to fade; fit only the part after it.

<!-- fig:run -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="Simulated absorbance falls from 1.62 to about 0.1 in 50 minutes; the first-order fit gives k = 0.0547 per minute." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Absorbance at 400 nm, copper catalyst (simulated)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Absorbance at 400 nm, copper catalyst (simulated)</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--line)"/><text x="52" y="236" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="181.4" y2="181.4" style="stroke:var(--line)"/><text x="52" y="185.4" text-anchor="end" style="fill:var(--muted)">0.5</text><line x1="58" x2="546" y1="130.9" y2="130.9" style="stroke:var(--line)"/><text x="52" y="134.9" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="80.3" y2="80.3" style="stroke:var(--line)"/><text x="52" y="84.3" text-anchor="end" style="fill:var(--muted)">1.5</text><line x1="58" x2="58" y1="232" y2="236" style="stroke:var(--muted)"/><text x="58" y="249" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="155.6" x2="155.6" y1="232" y2="236" style="stroke:var(--muted)"/><text x="155.6" y="249" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="253.2" x2="253.2" y1="232" y2="236" style="stroke:var(--muted)"/><text x="253.2" y="249" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="350.8" x2="350.8" y1="232" y2="236" style="stroke:var(--muted)"/><text x="350.8" y="249" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="448.4" x2="448.4" y1="232" y2="236" style="stroke:var(--muted)"/><text x="448.4" y="249" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="546" x2="546" y1="232" y2="236" style="stroke:var(--muted)"/><text x="546" y="249" text-anchor="middle" style="fill:var(--muted)">50</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Time (min)</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Absorbance at 400 nm</text><circle cx="58" cy="67.6" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="106.8" cy="107.8" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="155.6" cy="136.6" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="204.4" cy="160" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="253.2" cy="176.4" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="302" cy="190.7" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="350.8" cy="200.1" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="399.6" cy="207.5" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="448.4" cy="214" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="497.2" cy="217.8" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="546" cy="221.4" r="3.5" style="fill:var(--c-blog);opacity:1"/><path d="M58 67.9L67.8 76.6L77.5 84.9L87.3 92.7L97 100.1L106.8 107.1L116.6 113.8L126.3 120.1L136.1 126L145.8 131.7L155.6 137L165.4 142.1L175.1 146.9L184.9 151.4L194.6 155.7L204.4 159.7L214.2 163.6L223.9 167.2L233.7 170.7L243.4 173.9L253.2 177L263 180L272.7 182.7L282.5 185.4L292.2 187.8L302 190.2L311.8 192.4L321.5 194.5L331.3 196.5L341 198.4L350.8 200.2L360.6 201.9L370.3 203.5L380.1 205L389.8 206.4L399.6 207.8L409.4 209.1L419.1 210.3L428.9 211.5L438.6 212.6L448.4 213.6L458.2 214.6L467.9 215.5L477.7 216.4L487.4 217.2L497.2 218L507 218.7L516.7 219.5L526.5 220.1L536.2 220.7L546 221.3" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 92.8L67.8 96.3L77.5 99.8L87.3 103.2L97 106.7L106.8 110.2L116.6 113.7L126.3 117.1L136.1 120.6L145.8 124.1L155.6 127.6L165.4 131L175.1 134.5L184.9 138L194.6 141.5L204.4 144.9L214.2 148.4L223.9 151.9L233.7 155.4L243.4 158.8L253.2 162.3L263 165.8L272.7 169.3L282.5 172.7L292.2 176.2L302 179.7L311.8 183.2L321.5 186.6L331.3 190.1L341 193.6L350.8 197L360.6 200.5L370.3 204L380.1 207.5L389.8 210.9L399.6 214.4L409.4 217.9L419.1 221.4L428.9 224.8L438.6 228.3L448.4 231.8L458.2 232L467.9 232L477.7 232L487.4 232L497.2 232L507 232L516.7 232L526.5 232L536.2 232L546 232" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round;stroke-dasharray:4 3"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Simulated readings</text><line x1="213.6" x2="225.6" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="229.6" y="40" style="fill:var(--muted)">First order, k = 0.0547 /min</text><line x1="441.2" x2="453.2" y1="36" y2="36" style="stroke:var(--muted);stroke-width:2;stroke-dasharray:4 3"/><text x="457.2" y="40" style="fill:var(--muted)">Zero order</text></svg><figcaption>Figure 1. A run simulated with the Reaction kinetics fitter's maths: the starting absorbance from the Beer–Lambert law and the paper's amounts, then a first-order fall that reaches 93.5 % conversion at 50 minutes, with a little added scatter. Not the paper's data.</figcaption></figure>
<!-- /fig:run -->

<!-- fig:kt -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 268" role="img" aria-label="The first-order rate constant behind a fixed conversion falls as the assumed reaction time grows; without the time, k cannot be known." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Rate constant implied by a conversion, for any reaction time</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Rate constant implied by a conversion, for any reaction time</text><line x1="58" x2="546" y1="222" y2="222" style="stroke:var(--line)"/><text x="52" y="226" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="164.7" y2="164.7" style="stroke:var(--line)"/><text x="52" y="168.7" text-anchor="end" style="fill:var(--muted)">0.1</text><line x1="58" x2="546" y1="107.3" y2="107.3" style="stroke:var(--line)"/><text x="52" y="111.3" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">0.3</text><line x1="98.7" x2="98.7" y1="222" y2="226" style="stroke:var(--muted)"/><text x="98.7" y="239" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="180" x2="180" y1="222" y2="226" style="stroke:var(--muted)"/><text x="180" y="239" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="261.3" x2="261.3" y1="222" y2="226" style="stroke:var(--muted)"/><text x="261.3" y="239" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="342.7" x2="342.7" y1="222" y2="226" style="stroke:var(--muted)"/><text x="342.7" y="239" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="424" x2="424" y1="222" y2="226" style="stroke:var(--muted)"/><text x="424" y="239" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="505.3" x2="505.3" y1="222" y2="226" style="stroke:var(--muted)"/><text x="505.3" y="239" text-anchor="middle" style="fill:var(--muted)">120</text><line x1="58" x2="546" y1="222" y2="222" style="stroke:var(--muted)"/><text x="302" y="260" text-anchor="middle" style="fill:var(--ink)">Time to reach the conversion (min)</text><text transform="translate(14 136) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">k (per minute)</text><line x1="220.7" x2="220.7" y1="50" y2="222" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="224.7" y="62" text-anchor="start" style="fill:var(--muted)">50 min</text><path d="M58 65.3L64.1 85.7L70.2 101.4L76.3 113.9L82.4 124.1L88.5 132.4L94.6 139.5L100.7 145.6L106.8 150.8L112.9 155.3L119 159.3L125.1 162.9L131.2 166L137.3 168.9L143.4 171.4L149.5 173.8L155.6 175.9L161.7 177.9L167.8 179.6L173.9 181.3L180 182.8L186.1 184.2L192.2 185.5L198.3 186.8L204.4 187.9L210.5 189L216.6 190L222.7 191L228.8 191.8L234.9 192.7L241 193.5L247.1 194.3L253.2 195L259.3 195.7L265.4 196.3L271.5 196.9L277.6 197.5L283.7 198.1L289.8 198.6L295.9 199.1L302 199.6L308.1 200.1L314.2 200.6L320.3 201L326.4 201.4L332.5 201.8L338.6 202.2L344.7 202.5L350.8 202.9L356.9 203.3L363 203.5L369.1 203.9L375.2 204.2L381.3 204.5L387.4 204.8L393.5 205.1L399.6 205.3L405.7 205.6L411.8 205.8L417.9 206.1L424 206.3L430.1 206.6L436.2 206.8L442.3 207L448.4 207.2L454.5 207.4L460.6 207.6L466.7 207.8L472.8 208L478.9 208.2L485 208.4L491.1 208.5L497.2 208.7L503.3 208.9L509.4 209L515.5 209.2L521.6 209.4L527.7 209.5L533.8 209.7L539.9 209.8L546 210" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 90L64.1 107.2L70.2 120.5L76.3 131L82.4 139.5L88.5 146.5L94.6 152.5L100.7 157.6L106.8 162L112.9 165.8L119 169.2L125.1 172.2L131.2 174.9L137.3 177.2L143.4 179.4L149.5 181.4L155.6 183.2L161.7 184.8L167.8 186.3L173.9 187.7L180 189L186.1 190.2L192.2 191.3L198.3 192.4L204.4 193.3L210.5 194.2L216.6 195.1L222.7 195.9L228.8 196.6L234.9 197.3L241 198L247.1 198.6L253.2 199.2L259.3 199.8L265.4 200.4L271.5 200.9L277.6 201.4L283.7 201.8L289.8 202.3L295.9 202.7L302 203.1L308.1 203.5L314.2 203.9L320.3 204.3L326.4 204.6L332.5 205L338.6 205.3L344.7 205.6L350.8 205.9L356.9 206.2L363 206.5L369.1 206.7L375.2 207L381.3 207.3L387.4 207.5L393.5 207.7L399.6 208L405.7 208.2L411.8 208.4L417.9 208.6L424 208.8L430.1 209L436.2 209.2L442.3 209.4L448.4 209.6L454.5 209.7L460.6 209.9L466.7 210.1L472.8 210.2L478.9 210.4L485 210.5L491.1 210.6L497.2 210.8L503.3 210.9L509.4 211.1L515.5 211.2L521.6 211.3L527.7 211.5L533.8 211.6L539.9 211.7L546 211.9" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">93.5 % (copper)</text><line x1="192" x2="204" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="208" y="40" style="fill:var(--muted)">90 % (silver)</text></svg><figcaption>Figure 2. The first-order rate constant that a stated conversion implies, for each possible reaction time: k = −ln(1 − X)/t.</figcaption></figure>
<!-- /fig:kt -->

| Check | Paper | Tool result |
|---|---|---|
| 4-Nitrophenol in the cuvette | 300 µL of 1 mM (total volume not stated) | 88.2 µM if 3.4 mL in total |
| Starting absorbance at 400 nm | (not stated) | 1.62: high, dilute if you can |
| Borohydride excess | "excess" | 33 times (44 times what is needed) |
| Copper rate constant | not given | 0.0547 per minute if 93.5 % at 50 min |
| Copper half-life | not given | 12.7 minutes |
| Silver rate constant | not given | 0.026 to 0.115 per minute for 90 to 20 min |

## How we made the graphs

Everything above comes from `scripts/blog-figures/green-silver-copper-nanoparticles-4-nitrophenol-reduction.mjs` in fibub's public code. It calls:

- `solveBL` and `absQuality` from `src/lib/sci/beer.ts`, the maths behind the [[beer-lambert-calculator]].
- `conc`, `fitOrders` and `akaikeWeights` from `src/lib/sci/kinetics.ts`, the maths behind the [[reaction-kinetics-fitter]].

Where the inputs come from: the amounts, wavelength, conversions and the 50-minute time are from the paper; the molar absorptivity is from Bowers and colleagues (1980). That the 93.5 % was reached at exactly 50 minutes, that all solutions share one 3.4 mL cuvette, and the scatter in Figure 1 are **our assumptions**. Figure 1 is a **simulation**, not the paper's measurements.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks these functions against known answers:

- Exact zero-, first- and second-order data must give back their rate constants, and the Akaike weights must pick the right order each time; a first-order k of 0.01 must give a half-life of 69.31.
- A simulated N₂O₅ decomposition must return its rate constant of 6.2 × 10⁻⁴ per second, and the textbook methyl isonitrile data must give an activation energy of about 160 kJ/mol.
- The Beer–Lambert maths must turn an absorbance of 0.622 for NADH (ε 6220 L/(mol·cm)) into 0.100 mM, and 10 % transmittance into an absorbance of exactly 1.

## Check it yourself

**The starting absorbance, on the [[beer-lambert-calculator]]:**

1. Type **18380** in *ε, molar absorptivity (L/(mol·cm))* and **1** in *Path length (cm)*.
2. Type **88.2** in *Concentration* and choose **µmol/L**; leave the absorbance empty.
3. It gives an absorbance of about **1.62**, with the note that the value is high and to dilute if you can.

**The rate constant, on the [[reaction-kinetics-fitter]]:**

1. Set *Time unit* to **min**, then paste these simulated readings (time in minutes, absorbance at 400 nm, which is proportional to concentration) into *Time and concentration, one pair per line*:

```
0	1.6258
5	1.2279
10	0.9438
15	0.7123
20	0.5494
25	0.4085
30	0.3156
35	0.2423
40	0.1781
45	0.1406
50	0.1044
```

2. It reads **First order fits best**, with k about **0.0547 ± 0.0002** per minute and a half-life of about **12.7 min**.
3. Switch the plot to **ln [A]**: the points fall on a straight line, the usual check in catalysis papers.

## What researchers can use it for

- **Plan the test**: check in the [[beer-lambert-calculator]] that the starting absorbance sits below 1 before running the reaction.
- **Report a rate constant, not only a conversion**: the [[reaction-kinetics-fitter]] gives k with its error and the half-life, so catalysts from different papers can be compared.
- **Test the model**: the fitter weighs zero, first and second order against each other, which shows whether "pseudo-first-order" really fits.
- **Compare catalysts fairly**: divide k by the catalyst mass (or surface area) used.
- **Find the activation energy**: run the reaction at three or four temperatures and use the fitter's Arrhenius section.

## The fine print

- The paper gives no rate constant; every k here is **worked out from the stated conversions and our assumed times**, not taken from the paper.
- The total volume in the cuvette is our reading of the method; a different volume changes the starting absorbance in proportion.
- Absorbance at 400 nm also includes a little light scattered by the particles; a blank with catalyst but no 4-nitrophenol corrects it.
- Copper nanoparticles can oxidise in air, which may change their activity over time.
