---
title: "A qPCR test for a passion fruit virus: checking the standard curve and the primers"
summary: "A new SYBR Green qPCR finds East Asian Passiflora virus in passion fruit leaves 1,000 times more sensitively than ordinary PCR. We check its efficiency, primers and copy numbers with the qPCR analyser and Primer checker."
tools: [qpcr-analyser, primer-checker]
updated: 2026-11-16
sources:
  - "Zhou, H., Zhang, J., Li, Y., Gao, Z., Aslam, M. Q., Xu, J. and Chen, Y. (2026), Establishment and application of a real-time fluorescence quantitative PCR assay for detecting EAPV in Passiflora edulis, PLOS ONE, doi:10.1371/journal.pone.0356266, published 8 September 2026. Licence CC BY 4.0, stated on the article page, checked 2026-11-16. Values used here: primers qEAPVF and qEAPVR; standard curve Ct = −3.562 log(copies) + 42.834, R² 0.992, efficiency 90.9%; range and detection limit 11.41 × 10² to 11.41 × 10⁹ copies/µL; conventional PCR limit 11.41 × 10⁵ copies/µL; melt peak about 81 °C; mean Ct and reported copies for inoculated and upper leaves at 3 to 28 days; negative control Ct 39.30; 120 of 120 field samples positive by qPCR and 117 by RT-PCR."
  - "Acceptable qPCR efficiency (90 to 110%, slope about −3.1 to −3.6) and reporting rules: Bustin, S. A. et al. (2009), The MIQE guidelines, Clinical Chemistry 55, 611-622."
  - "Primer rules of thumb (18 to 30 bases, 40 to 60% GC, a G or C near the 3′ end, no long runs or 3′ dimers): standard primer design guidance, as summarised in the Primer checker's guide."
paper:
  title: "Establishment and application of a real-time fluorescence quantitative PCR assay for detecting EAPV in Passiflora edulis"
  authors: "Zhou, H.; Zhang, J.; Li, Y.; Gao, Z.; Aslam, M. Q.; Xu, J.; Chen, Y."
  journal: "PLOS ONE"
  year: 2026
  doi: "10.1371/journal.pone.0356266"
  url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0356266"
  licence: "CC BY 4.0"
  reviewed: true
---

Passion fruit growers in southern China lose crops to **East Asian Passiflora virus** (EAPV), which mottles and twists the leaves and spoils the fruit. To catch it early, a team built a **qPCR** test: a PCR that measures how much viral genetic material is in a sample while it copies it. This article shows how the [[qpcr-analyser]] checks the test's standard curve and copy numbers, and how the [[primer-checker]] looks over its two primers. To compare the virus sequence with other strains before designing primers, use [[sequence-alignment]].

## The paper in brief

The test targets the virus's **coat protein gene**, the gene for the protein shell around its RNA. It uses **SYBR Green**, a dye that glows when it binds double-stranded DNA, so no separate probe is needed. To check that only the right product was made, the team heated the finished reaction and watched it melt: a single peak near **81 °C** showed one product.

A **standard curve** links the cycle at which the glow crosses a threshold (the **Ct**) to the starting number of copies. The team's curve ran over seven ten-fold steps, from about 1,141 to 11.4 billion copies per µL, with a slope of −3.562, an R² of 0.992 and an **efficiency of 90.9%**. Efficiency says how close each cycle comes to doubling the DNA: 100% is a perfect doubling. The qPCR found the virus down to 1,141 copies per µL, a **1,000 times** lower amount than ordinary PCR could see. In 120 field samples from Yunnan, qPCR found the virus in all 120 and ordinary RT-PCR in 117. In infected plants, the virus peaked in the inoculated leaves 3 days after infection and then spread to the upper leaves.

## Checked with the tools

**Step 1: efficiency from the slope.** If every cycle exactly doubled the DNA, ten times more copies would cross the threshold 3.32 cycles sooner, giving a slope of −3.322. The qPCR analyser turns a slope into efficiency with E = 10^(−1/slope) − 1. For −3.562 that gives **90.87%**, matching the paper's 90.9%. That is just inside the 90 to 110% range the MIQE guidelines (the standard rules for reporting qPCR) call acceptable. The same slope says the 1,000-fold sensitivity gain is worth about **10.7 cycles**.

**Step 2: where the samples sit on the curve.** We rebuilt the curve's eight ten-fold standards from the published equation (exact points on the line, so our R² is 1 rather than the paper's 0.992) and read each sample's mean Ct off it. The lowest standard, 1,141 copies/µL, sits at **Ct 31.9**; the highest at Ct 7.0 (Figure 1). The inoculated leaves at 3 days, at Ct 26.49, work out at about **38,700 copies/µL**. But the inoculated leaves from 7 to 28 days have Ct values of 34 to 35, above the lowest standard's Ct. That puts them **below the lowest standard**, at about 130 to 300 copies/µL by the equation, where the curve has not been tested. The negative control, at Ct 39.3, would read about 10 copies/µL, which is why the paper rightly treats it as background.

<!-- fig:curve -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="The standard curve falls from Ct 32 at the lowest standard to Ct 7 at the highest. Four of the inoculated-leaf samples have Ct values above 33, which places them below the lowest standard." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>The published standard curve and the leaf samples</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">The published standard curve and the leaf samples</text><rect x="58" y="50" width="60.7" height="222" style="fill:var(--accent-soft)"/><text x="88.4" y="64" text-anchor="middle" style="fill:var(--muted)">below lowest standard</text><line x1="58" x2="546" y1="240.3" y2="240.3" style="stroke:var(--line)"/><text x="52" y="244.3" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="176.9" y2="176.9" style="stroke:var(--line)"/><text x="52" y="180.9" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="113.4" y2="113.4" style="stroke:var(--line)"/><text x="52" y="117.4" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">10^2</text><line x1="172.8" x2="172.8" y1="272" y2="276" style="stroke:var(--muted)"/><text x="172.8" y="289" text-anchor="middle" style="fill:var(--muted)">10^4</text><line x1="287.6" x2="287.6" y1="272" y2="276" style="stroke:var(--muted)"/><text x="287.6" y="289" text-anchor="middle" style="fill:var(--muted)">10^6</text><line x1="402.5" x2="402.5" y1="272" y2="276" style="stroke:var(--muted)"/><text x="402.5" y="289" text-anchor="middle" style="fill:var(--muted)">10^8</text><line x1="517.3" x2="517.3" y1="272" y2="276" style="stroke:var(--muted)"/><text x="517.3" y="289" text-anchor="middle" style="fill:var(--muted)">10^10</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Copies per µL (log scale)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Ct (cycle threshold)</text><line x1="58" x2="546" y1="54.4" y2="54.4" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="49.4" text-anchor="end" style="fill:var(--muted)">negative control 39.3</text><path d="M86.7 88.5L546 269.3" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="206.6" cy="135.7" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="85.7" cy="88.1" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="64.9" cy="79.9" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="70.6" cy="82.2" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="78" cy="85.1" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="136.8" cy="108.2" r="4" style="fill:var(--ink);opacity:1"/><circle cx="171.6" cy="121.9" r="4" style="fill:var(--ink);opacity:1"/><circle cx="142.9" cy="110.6" r="4" style="fill:var(--ink);opacity:1"/><circle cx="131.1" cy="106" r="4" style="fill:var(--ink);opacity:1"/><circle cx="160" cy="117.4" r="4" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Published line</text><circle cx="189.8" cy="36" r="4" style="fill:var(--c-tools)"/><text x="200.8" y="40" style="fill:var(--muted)">Inoculated leaves</text><circle cx="338.2" cy="36" r="4" style="fill:var(--ink)"/><text x="349.2" y="40" style="fill:var(--muted)">Upper leaves</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The paper's standard curve (Ct = −3.562 × log copies + 42.834) and the mean Ct of the leaf samples, placed on it with the qPCR analyser's maths. Shaded: below the lowest standard of 1,141 copies/µL.</figcaption></figure>
<!-- /fig:curve -->

**Step 3: the copy numbers.** The copies the paper reports are higher than the equation gives for the same Ct (Figure 2). The gap is not random: about **10 times** for every inoculated-leaf sample and about **22 to 25 times** for every upper-leaf sample. A steady ratio within each set points to a conversion step, such as a dilution or extraction factor, that is not described in the text. It is not necessarily an error, but a reader cannot rebuild the numbers without it. This is the kind of question to put to the authors, and why the MIQE guidelines ask for every step from sample to copy number to be reported.

<!-- fig:compare -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Every reported copy number sits above the equal line: the paper reports 9 to 25 times more copies than its own standard curve equation gives for the same Ct." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Copies per µL: reported against recalculated</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Copies per µL: reported against recalculated</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">10^2</text><line x1="58" x2="546" y1="216.5" y2="216.5" style="stroke:var(--line)"/><text x="52" y="220.5" text-anchor="end" style="fill:var(--muted)">10^3</text><line x1="58" x2="546" y1="161" y2="161" style="stroke:var(--line)"/><text x="52" y="165" text-anchor="end" style="fill:var(--muted)">10^4</text><line x1="58" x2="546" y1="105.5" y2="105.5" style="stroke:var(--line)"/><text x="52" y="109.5" text-anchor="end" style="fill:var(--muted)">10^5</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">10^6</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">10^2</text><line x1="180" x2="180" y1="272" y2="276" style="stroke:var(--muted)"/><text x="180" y="289" text-anchor="middle" style="fill:var(--muted)">10^3</text><line x1="302" x2="302" y1="272" y2="276" style="stroke:var(--muted)"/><text x="302" y="289" text-anchor="middle" style="fill:var(--muted)">10^4</text><line x1="424" x2="424" y1="272" y2="276" style="stroke:var(--muted)"/><text x="424" y="289" text-anchor="middle" style="fill:var(--muted)">10^5</text><line x1="546" x2="546" y1="272" y2="276" style="stroke:var(--muted)"/><text x="546" y="289" text-anchor="middle" style="fill:var(--muted)">10^6</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Recalculated from the equation (log scale)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Reported in the paper (log scale)</text><path d="M58 272L546 50" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round;stroke-dasharray:4 4"/><circle cx="373.7" cy="76" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="116.8" cy="189.2" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="72.6" cy="208.4" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="84.7" cy="203.7" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="100.5" cy="196.4" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="225.4" cy="118.7" r="4" style="fill:var(--ink);opacity:1"/><circle cx="299.4" cy="87.6" r="4" style="fill:var(--ink);opacity:1"/><circle cx="238.4" cy="113.1" r="4" style="fill:var(--ink);opacity:1"/><circle cx="213.4" cy="123.7" r="4" style="fill:var(--ink);opacity:1"/><circle cx="274.8" cy="97.4" r="4" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--muted);stroke-width:2;stroke-dasharray:4 4"/><text x="74" y="40" style="fill:var(--muted)">Equal</text><circle cx="125" cy="36" r="4" style="fill:var(--c-tools)"/><text x="136" y="40" style="fill:var(--muted)">Inoculated leaves</text><circle cx="273.4" cy="36" r="4" style="fill:var(--ink)"/><text x="284.4" y="40" style="fill:var(--muted)">Upper leaves</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Copy numbers the paper reports for each leaf sample against the copies its own equation gives for the same Ct (qPCR analyser maths). Points on the dashed line would agree.</figcaption></figure>
<!-- /fig:compare -->

**Step 4: the primers.** Both primers are 20 bases long with **50% and 55% GC** (the share of G and C bases, which bind more strongly), and each has 2 G or C bases in its last five, a healthy 3′ end. The Primer checker flags two things to look at. The forward primer can fold back on itself into a hairpin with a **4-base stem**, and the two primers can pair at the forward primer's 3′ end over **3 bases** (a cross-dimer). Short 3′ pairings like this are a common source of **primer-dimer**, a small extra product that SYBR Green also lights up. The single melt peak near 81 °C is the paper's evidence that it did not happen in practice.

**Step 5: the annealing temperature.** The checker's basic formula puts the primers' melting temperatures at **51.8 and 53.8 °C**, and suggests starting annealing 5 °C below the lower one, at 46.8 °C. The paper annealed at **60 °C**. Simple formulas like this one often read several degrees low for qPCR buffers, and the team tuned the temperature by experiment, which is the right final test. The gap is a reminder that a formula's Tm is a starting point.

| Check | Paper | Our tool result |
|---|---|---|
| Efficiency from slope −3.562 | 90.9% | 90.87% |
| Ct at the lowest standard (1,141 copies/µL) | (on its curve) | 31.9 |
| Inoculated leaves, day 3 (Ct 26.49) | 3.4 × 10⁵ copies/µL | 3.87 × 10⁴ copies/µL from the equation |
| Inoculated leaves, days 7 to 28 (Ct 34 to 35) | 1.4 to 3.1 × 10³ copies/µL | 130 to 300 copies/µL, below the lowest standard |
| Primer GC and length | 20 bases each | 50% and 55% GC; hairpin and 3′ cross-dimer flagged |
| Sensitivity gain over PCR | 1,000 times | about 10.7 cycles on this curve |

## How we made the graphs

Both charts and every number above come from `scripts/blog-figures/eapv-passion-fruit-virus-sybr-qpcr-standard-curve.mjs` in fibub's public code. It calls the tools' own functions:

- `stdCurve` and `quantify` from `src/lib/sci/qpcr.ts`, the standard-curve maths of the [[qpcr-analyser]].
- `gcCount`, `tmBasic`, `tmSalt`, `tmWallace`, `clamp`, `hairpin` and `dimer` from `src/lib/sci/primer.ts`, the checks in the [[primer-checker]].

Where the inputs come from: the slope, intercept, efficiency, range, primers, mean Ct values, reported copy numbers and negative control are the paper's. The eight standard points are our reconstruction from the published equation (the paper's raw standard Ct values are not used). Nothing is simulated.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks these functions against independent calculations:

- A ten-point standard curve (100 to 1,000,000 copies, in duplicate) must give a slope of **−3.3705**, an intercept of **35.4** and an efficiency of **98.01%**, matching SciPy's linear regression, and an unknown at Ct 20 must read **37,073** copies.
- The ΔΔCq method on a made-up drug experiment must give a ΔΔCq of −2.167 and a **4.49-fold** rise, with the efficiency-corrected (Pfaffl) version giving 4.27-fold, both matching a separate NumPy calculation.
- The primer maths must match Biopython 1.88: for the primer ACTCACATCGGTGTCACCTG, a Wallace Tm of **62 °C**, a basic Tm of **53.83 °C** and a salt-adjusted Tm of **48.70 °C** at 50 mM sodium; known hairpins (stems of 6 and 8) and dimers must be found as a brute-force search finds them.

## Check it yourself

**The standard curve, on the [[qpcr-analyser]]:**

1. In *Gene, quantity and Cq of a dilution series; leave the quantity blank for an unknown*, clear the example and type one standard per line as gene, quantity, Cq: **EAPV,1141,31.94**, **EAPV,11410,28.38**, **EAPV,114100,24.82**, **EAPV,1141000,21.26**, **EAPV,11410000,17.70**, **EAPV,114100000,14.13**, **EAPV,1141000000,10.57**, **EAPV,11410000000,7.01**.
2. Add two unknowns with the quantity left blank: **EAPV,,26.49** and **EAPV,,33.99**.
3. The *Standard curves* card reads **EAPV: efficiency 90.9 %, R² 1.0000**, with a slope of **−3.562** and an intercept of **42.83** in the table.
4. Under *Unknowns*, Ct 26.49 gives **38736** copies/µL and Ct 33.99 gives **303.7 (outside the curve)**.

**The primers, on the [[primer-checker]]:**

1. Type **GCTCAGCCAACATTGAGACA** in *Forward primer (5′→3′)* and **GTGCTACCGCTTCTCTTGCT** in *Reverse primer (5′→3′, optional)*. Leave *Sodium (mM)* at **50**.
2. It reads **2 things to check; Tm 51.8 / 53.8 °C**: a hairpin with a 4 bp stem in the forward primer, and a cross-dimer of 4 bp with 3 at a 3′ end.
3. *Suggested annealing start* reads **46.8 °C**; compare it with the paper's tested 60 °C.

## What researchers can use it for

- **Check a standard curve** in the [[qpcr-analyser]]: efficiency, R² and whether it falls inside 90 to 110%, from the dilution series alone.
- **Flag unknowns outside the curve** before reporting copy numbers that were extrapolated.
- **Rebuild a paper's copy numbers** from its equation and Ct values, to find missing dilution or extraction steps.
- **Screen primer pairs** in the [[primer-checker]] for GC, 3′ ends, hairpins and dimers before ordering them, then confirm with a melt curve.
- **Teach** how slope, efficiency and Ct connect, with a real plant-virus assay.

## The fine print

- The paper was published in September 2026; it is peer-reviewed and open access under CC BY 4.0.
- Our standard points lie exactly on the published line. The paper's real points scatter a little, so its curve and ours agree in slope and intercept but not in R².
- The copy-number gap may well come from a sample-preparation factor the paper applied but did not spell out; we report the gap, not a cause.
- Simple Tm formulas ignore the buffer's magnesium and the neighbouring bases; the paper's tested 60 °C is the value that counts for its assay.
- The Methods give a dilution series down to 11.41 × 10¹ copies/µL, while the Results and abstract put the range and detection limit at 11.41 × 10²; we used the Results.
