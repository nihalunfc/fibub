---
title: "Chrysin slows lung and cervical cancer cells in the dish: fitting the dose-response curves"
summary: "A plant flavone, chrysin, lowered telomerase and pushed two cancer cell lines into senescence. We fit the viability numbers with the Dose-response fitter and check the molecule with the Drug-likeness tool."
tools: [dose-response, smiles-checker]
updated: 2026-11-16
sources:
  - "Porika, M., Tippani, R., Kalam, S., Banothu, D., Rekulapally, S., Poonuru, R. R., Abbagani, S. and Saretzki, G. C. (2026), Chrysin Inhibits Telomerase and Induces Senescence in Two Cancer Cell Lines: Insights from In Vitro Analysis, Molecular Docking, DFT, and ADMET, International Journal of Molecular Sciences 27(22), 10282, published 16 November 2026. Licence CC BY 3.0, checked on the journal page, 2026-11-16. Values used here, from the results text: MTT viability (% of control) at 10, 30 and 60 µM after 24, 48 and 72 h for A549 and HeLa cells; haemolysis 0.6, 1.3, 2.2 and 4.0% at 5, 10, 30 and 60 µM; log P 2.27 (XLOGP3 3.52) and polar surface area 70.67 Å² from the ADMET section."
  - "Haemolysis bands (under 2% non-haemolytic, 2 to 5% slightly haemolytic, over 5% haemolytic): ASTM F756, Standard Practice for Assessment of Hemolytic Properties of Materials."
  - "Rule of five: Lipinski, C. A. et al. (1997), Advanced Drug Delivery Reviews 23, 3-25. Rotatable bond and polar surface area rules: Veber, D. F. et al. (2002), Journal of Medicinal Chemistry 45, 2615-2623."
paper:
  title: "Chrysin Inhibits Telomerase and Induces Senescence in Two Cancer Cell Lines: Insights from In Vitro Analysis, Molecular Docking, DFT, and ADMET"
  authors: "Porika, M.; Tippani, R.; Kalam, S.; Banothu, D.; Rekulapally, S.; Poonuru, R. R.; Abbagani, S.; Saretzki, G. C."
  journal: "International Journal of Molecular Sciences"
  year: 2026
  doi: "10.3390/ijms272210282"
  url: "https://www.mdpi.com/1422-0067/27/22/10282"
  licence: "CC BY 3.0"
  reviewed: true
---

Every time a normal cell divides, the caps on the ends of its chromosomes, called **telomeres**, get a little shorter. When they are too short, the cell stops dividing for good. This resting state is called **senescence**. Most cancer cells escape it by switching on **telomerase**, an enzyme that rebuilds the caps. A new lab study tested whether chrysin, a flavone (a plant pigment found in passionflower, honey and propolis), can switch telomerase down in two human cancer cell lines. This article shows how the [[dose-response]] fitter turns the paper's viability numbers into half-way doses, and how the [[smiles-checker|Drug-likeness tool]] checks the molecule itself. This is lab biology in dishes of cells, not a treatment: chrysin is not an approved cancer medicine.

## The paper in brief

The team grew two cancer cell lines: **A549**, from a lung tumour, and **HeLa**, from a cervical tumour. They added chrysin from 5 to 60 micromolar (µM, millionths of a mole per litre) and measured how many cells were still alive after 24, 48 and 72 hours with the **MTT test**, a dye that living cells turn purple. Viability fell with both dose and time. Normal lung cells (WI-38 fibroblasts) stayed healthy up to 60 µM over 48 hours. Telomerase activity dropped at the higher doses in both lines. A week after treatment, many cells showed the blue stain of senescence (SA β-gal), and the effect grew with dose. Chrysin broke open very few red blood cells: 4% at the top dose. Computer work rounded the study off: docking chrysin into a telomerase structure, quantum chemistry of the molecule, and predicted absorption and safety (ADMET).

Why it matters: telomerase is switched on in most cancers but in few adult tissues, so molecules that block it are worth studying. A cheap natural flavone that does so in dishes is a starting point for chemists, not an answer for patients.

## Checked with the tools

The paper's text gives the viability at 10, 30 and 60 µM for each cell line and time. The **IC50**, the dose that leaves half the cells alive, sits in a table we did not copy. So we worked out our own IC50s from the text's numbers with the Dose-response fitter's maths, and compared them with what the text says.

**Step 1: the A549 curves.** A dose-response curve is usually S-shaped on a log dose axis. The fitter uses the **four-parameter logistic** (4PL) curve: a top, a bottom, the IC50 and the **Hill slope**, which says how steep the S is. Here we only have three doses and the untreated control, so we fixed the top at 100% (the control, by definition) and the bottom at 0% (our assumption: enough chrysin would kill every cell). That leaves two numbers to fit. At 24 hours the A549 IC50 comes out at **50 µM**; at 48 hours, **29 µM**; at 72 hours, **13 µM** (Figure 1). The curve slides to the left as time goes on.

<!-- fig:a549 -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Fitted dose-response curves for A549 cells after 24, 48 and 72 hours of chrysin. The curve moves left with time: the half-way dose falls from about 50 to 29 to 13 micromolar." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>A549 lung cancer cells: viability falls with dose and time</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">A549 lung cancer cells: viability falls with dose and time</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="227.6" y2="227.6" style="stroke:var(--line)"/><text x="52" y="231.6" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="183.2" y2="183.2" style="stroke:var(--line)"/><text x="52" y="187.2" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="138.8" y2="138.8" style="stroke:var(--line)"/><text x="52" y="142.8" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="94.4" y2="94.4" style="stroke:var(--line)"/><text x="52" y="98.4" text-anchor="end" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">100</text><line x1="210.5" x2="210.5" y1="272" y2="276" style="stroke:var(--muted)"/><text x="210.5" y="289" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="356" x2="356" y1="272" y2="276" style="stroke:var(--muted)"/><text x="356" y="289" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="515.5" x2="515.5" y1="272" y2="276" style="stroke:var(--muted)"/><text x="515.5" y="289" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Chrysin (µM, log scale)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Viable cells (% of control)</text><line x1="58" x2="546" y1="161" y2="161" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="156" text-anchor="end" style="fill:var(--muted)">50%</text><path d="M58 67.6L66.2 68.5L74.2 69.4L82.4 70.4L90.6 71.5L98.6 72.6L106.8 73.7L115 74.9L123 76.1L131.2 77.4L139.4 78.7L147.4 80.1L155.6 81.6L163.8 83.1L171.8 84.6L180 86.3L188.2 87.9L196.2 89.7L204.4 91.5L212.6 93.4L220.6 95.3L228.8 97.3L237 99.4L245 101.5L253.2 103.7L261.4 106L269.4 108.3L277.6 110.7L285.8 113.1L293.8 115.6L302 118.2L310.2 120.8L318.2 123.4L326.4 126.1L334.6 128.9L342.6 131.7L350.8 134.5L359 137.4L367 140.3L375.2 143.2L383.4 146.2L391.4 149.2L399.6 152.2L407.8 155.2L415.8 158.2L424 161.3L432.2 164.3L440.2 167.3L448.4 170.3L456.6 173.4L464.6 176.3L472.8 179.3L481 182.2L489 185.2L497.2 188L505.4 190.8L513.4 193.6L521.6 196.4L529.8 199.1L537.8 201.7L546 204.3" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="210.5" cy="93" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="356" cy="136.1" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="447.8" cy="170.3" r="4" style="fill:var(--c-blog);opacity:1"/><path d="M58 89.1L66.2 90.5L74.2 91.9L82.4 93.4L90.6 94.9L98.6 96.5L106.8 98.1L115 99.7L123 101.3L131.2 103.1L139.4 104.8L147.4 106.6L155.6 108.4L163.8 110.3L171.8 112.2L180 114.1L188.2 116.1L196.2 118.1L204.4 120.1L212.6 122.2L220.6 124.3L228.8 126.4L237 128.6L245 130.8L253.2 133L261.4 135.2L269.4 137.5L277.6 139.8L285.8 142.1L293.8 144.4L302 146.7L310.2 149.1L318.2 151.4L326.4 153.8L334.6 156.2L342.6 158.5L350.8 160.9L359 163.3L367 165.7L375.2 168L383.4 170.4L391.4 172.7L399.6 175.1L407.8 177.4L415.8 179.7L424 182L432.2 184.3L440.2 186.6L448.4 188.8L456.6 191L464.6 193.2L472.8 195.4L481 197.5L489 199.6L497.2 201.7L505.4 203.8L513.4 205.8L521.6 207.7L529.8 209.7L537.8 211.6L546 213.4" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="210.5" cy="122" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="356" cy="161.6" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="447.8" cy="189.2" r="4" style="fill:var(--c-tools);opacity:1"/><path d="M58 115.4L66.2 117.1L74.2 118.9L82.4 120.8L90.6 122.6L98.6 124.5L106.8 126.4L115 128.3L123 130.3L131.2 132.2L139.4 134.2L147.4 136.2L155.6 138.2L163.8 140.3L171.8 142.3L180 144.4L188.2 146.5L196.2 148.5L204.4 150.7L212.6 152.7L220.6 154.9L228.8 157L237 159.1L245 161.2L253.2 163.3L261.4 165.4L269.4 167.5L277.6 169.7L285.8 171.8L293.8 173.9L302 175.9L310.2 178L318.2 180.1L326.4 182.1L334.6 184.2L342.6 186.2L350.8 188.2L359 190.2L367 192.1L375.2 194.1L383.4 196L391.4 197.9L399.6 199.8L407.8 201.6L415.8 203.4L424 205.2L432.2 207L440.2 208.7L448.4 210.4L456.6 212.1L464.6 213.8L472.8 215.4L481 217L489 218.6L497.2 220.1L505.4 221.6L513.4 223.1L521.6 224.5L529.8 225.9L537.8 227.3L546 228.6" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><circle cx="210.5" cy="153.8" r="4" style="fill:var(--ink);opacity:1"/><circle cx="356" cy="185.1" r="4" style="fill:var(--ink);opacity:1"/><circle cx="447.8" cy="213.4" r="4" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">24 h (IC50 50 µM)</text><line x1="206.4" x2="218.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="222.4" y="40" style="fill:var(--muted)">48 h (IC50 29 µM)</text><line x1="354.8" x2="366.8" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="370.8" y="40" style="fill:var(--muted)">72 h (IC50 13 µM)</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Dose-response curves fitted with the Dose-response fitter's maths to the A549 viability values given in the paper's text (dots). Top fixed at 100% and Bottom at 0% (our assumption); untreated controls not drawn on the log axis.</figcaption></figure>
<!-- /fig:a549 -->

**Step 2: both cell lines.** HeLa follows the same pattern a little lower: **41, 21 and 11 µM** at 24, 48 and 72 hours (Figure 2). That matches the paper's statement that HeLa cells were slightly more sensitive. In both lines the IC50 falls about **3.9 times** between 24 and 72 hours, which fits a compound that stops cells dividing rather than killing them at once: the longer you wait, the more the gap grows between treated and untreated wells.

<!-- fig:ic50 -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="IC50 fitted with the Dose-response fitter maths falls for both cell lines as exposure gets longer; HeLa sits a little below A549 at every time." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>The half-way dose (IC50) falls with longer exposure</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">The half-way dose (IC50) falls with longer exposure</text><line x1="58" x2="546" y1="211.8" y2="211.8" style="stroke:var(--line)"/><text x="52" y="215.8" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="150.9" y2="150.9" style="stroke:var(--line)"/><text x="52" y="154.9" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="115.3" y2="115.3" style="stroke:var(--line)"/><text x="52" y="119.3" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="70.4" y2="70.4" style="stroke:var(--line)"/><text x="52" y="74.4" text-anchor="end" style="fill:var(--muted)">50</text><line x1="92.9" x2="92.9" y1="232" y2="236" style="stroke:var(--muted)"/><text x="92.9" y="249" text-anchor="middle" style="fill:var(--muted)">24</text><line x1="302" x2="302" y1="232" y2="236" style="stroke:var(--muted)"/><text x="302" y="249" text-anchor="middle" style="fill:var(--muted)">48</text><line x1="511.1" x2="511.1" y1="232" y2="236" style="stroke:var(--muted)"/><text x="511.1" y="249" text-anchor="middle" style="fill:var(--muted)">72</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Exposure time (hours)</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">IC50 (µM, log scale)</text><path d="M92.9 70.7L302 118.6L511.1 189.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="92.9" cy="70.7" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="302" cy="118.6" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="511.1" cy="189.4" r="4" style="fill:var(--c-blog);opacity:1"/><path d="M92.9 87.8L302 147L511.1 207.1" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="92.9" cy="87.8" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="302" cy="147" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="511.1" cy="207.1" r="4" style="fill:var(--c-tools);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">A549</text><line x1="112.8" x2="124.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="128.8" y="40" style="fill:var(--muted)">HeLa</text><text class="fibub-mark" x="546" y="270" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. IC50 from our fits for each cell line and exposure time. Our estimates from three mean values per curve, not the paper's own IC50 table.</figcaption></figure>
<!-- /fig:ic50 -->

**Step 3: the slope.** All six Hill slopes are shallow, between **−0.6 and −0.9**. A slope of −1 is the textbook curve for one drug binding one target; shallower curves are common when cells in a dish respond unevenly, or when a drug acts through slow effects such as senescence. It is a reminder that "IC50" alone hides how gently these curves fall: at 48 hours, going from 10 to 60 µM only takes A549 viability from 68% to 37%.

**Step 4: the molecule.** We typed chrysin's structure into the Drug-likeness tool as a SMILES string (a one-line text code for a molecule). It reads **C15H10O4, 254.24 g/mol**, with 2 hydrogen-bond donors (the two OH groups), 4 acceptors (the oxygens), 1 rotatable bond and 3 rings. With the paper's log P of 2.27 and polar surface area of 70.67 Å², it passes **Lipinski's rule of five** with nothing broken and passes **Veber's rules**. These rules flag molecules that are unlikely to be absorbed when swallowed. Passing them does not make chrysin a good medicine: in people it is known to be broken down quickly in the gut and liver, which the rules cannot see.

**Step 5: the red blood cells.** The haemolysis numbers (0.6% to 4.0%) are under 5% at every dose, the line the ASTM F756 standard uses for "haemolytic". On that standard's scale, the top two doses (2.2% and 4.0%) count as slightly haemolytic, the lower two as non-haemolytic.

| Check | Paper | Our tool result |
|---|---|---|
| A549 IC50 at 48 h | text says close to an earlier report of 20 µM | 29 µM (95% interval 27.5 to 30.4) |
| HeLa vs A549 | HeLa slightly more sensitive | HeLa IC50 lower at every time (41, 21, 11 vs 50, 29, 13 µM) |
| Time effect | viability falls from 24 to 72 h | IC50 falls about 3.9 times in both lines |
| Formula and mass | chrysin, C15H10O4 | C15H10O4, 254.24 g/mol |
| Rule of five | ADMET section: log P 2.27, polar surface area 70.67 Å² | passes Lipinski (0 broken) and Veber |

Our A549 48-hour IC50 is a little higher than the 20 µM the text mentions. Ours comes from three mean values and two fixed ends; the paper fitted its full set of doses and wells, so its own table is the one to trust.

## How we made the graphs

Both charts and every number above come from `scripts/blog-figures/chrysin-telomerase-senescence-a549-hela-ic50.mjs` in fibub's public code. It calls the tools' own functions:

- `fitDose` from `src/lib/sci/dose.ts`, the 4PL fit (Levenberg-Marquardt on log IC50) behind the [[dose-response]] fitter, with Bottom fixed at 0 and Top at 100, exactly as the tool's *Fix at 0* and *Fix at 100* options do.
- `check` from `src/lib/sci/druglike.ts`, which reads the SMILES and applies the Lipinski and Veber rules in the [[smiles-checker|Drug-likeness tool]].

Where the inputs come from: the viability percentages, haemolysis values, log P and polar surface area are the paper's (results text and ADMET section). The fixed top and bottom, and treating each mean as a single point, are our assumptions. The chrysin SMILES we wrote ourselves from its well-known structure (5,7-dihydroxyflavone). Nothing is simulated.

## How we test the maths

On every change to fibub, `npm test` runs checks that pin these functions to published answers:

- In `tests/sci.mjs`, the 4PL fit on the classic ryegrass herbicide data (from the R package drc) must give an EC50 of **3.058**, a Hill slope of **−2.982**, a bottom of 0.481 and a top of 7.793, each to within 0.002, with the standard error of the Hill slope at 0.458.
- In `tests/sci-tools/smiles-checker.mjs`, aspirin must read **C9H8O4, 180.159 g/mol**, 1 donor, 4 acceptors and 3 rotatable bonds; caffeine **C8H10N4O2, 194.19 g/mol** with 0 donors and 6 acceptors.
- The same file checks the rule limits: a molecule of exactly 500 g/mol, 5 donors and 10 acceptors still passes, one broken Lipinski rule still passes, and 11 rotatable bonds fails Veber.

## Check it yourself

**The A549 48-hour IC50, on the [[dose-response]] fitter:**

1. Clear the example in the *Dose or concentration, then one or more response columns* box and type four lines, dose then response, separated by a tab or a space: **0 100**, **10 67.55**, **30 49.71**, **60 37.3**.
2. Set *Dose unit* to **µM** and *Response name* to **Viability (%)**.
3. Set *Bottom* to **Fix at 0** and *Top* to **Fix at 100**. Leave *Weighting* on **None**.
4. It reads **IC50 = 28.91 µM**, with a 95% interval of **27.5 to 30.4 µM** and a Hill slope of about **−0.698**.
5. Swap in the 24-hour numbers (80.61, 61.2, 45.82) to get about **49.8 µM**, or the HeLa 48-hour numbers (60.5, 45.23, 34.53) to get about **20.9 µM**.

With only one value per dose the interval is too narrow: real replicate wells would widen it. Paste your own replicates as extra columns and the tool uses every one.

**The molecule, on the [[smiles-checker|Drug-likeness tool]]:**

1. Type **O=C1C=C(c2ccccc2)Oc2cc(O)cc(O)c12** in *SMILES* and **Chrysin** in *Name (optional)*.
2. Open *Options* and type **2.27** in *Your logP (optional)* and **70.67** in *Your polar surface area, Å² (optional)*.
3. The heading reads **Chrysin: C₁₅H₁₀O₄, 254.24 g/mol**, *H-bond donors* 2, *H-bond acceptors* 4, *Rotatable bonds* 1, and both **Lipinski pass: 0 of 4 broken** and **Veber pass: 0 of 2 broken**.

## What researchers can use it for

- **Get an IC50 from a viability plate** in a minute, with its 95% interval and Hill slope, in the [[dose-response]] fitter; nothing leaves your computer.
- **Compare time points or cell lines** by fitting each curve with the same fixed top and bottom, as we did here.
- **Sanity-check a paper's IC50 table** against the viability numbers it quotes in the text.
- **Screen a list of plant compounds** for size, donors, acceptors and flexibility before ordering them, with the batch box in the [[smiles-checker|Drug-likeness tool]].
- **Teach** how dose, time and slope shape a cytotoxicity curve, and why an IC50 depends on when you measure.

## The fine print

- The viability values are the means in the paper's text; the paper's own IC50s are in a table we did not copy. Our IC50s are estimates from three points each and differ a little from what the paper reports.
- Fixing the bottom at 0% assumes high doses would kill every cell. If chrysin only ever stops some cells, a free bottom would give a different IC50.
- These are cancer cells in dishes. Results in cells often do not carry over to animals or people. Nothing here is medical advice; for health questions, ask a doctor.
- The Lipinski and Veber rules are rough filters for swallowed drugs, not predictions of how well a compound works.
