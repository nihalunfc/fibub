---
title: "Rhodiola rosea HPLC-UV method: checking LOD, LOQ and calibration for salidroside and rosavin"
summary: "A greener HPLC-UV method measures five marker compounds in Rhodiola rosea. We check its detection limits and show why weighting and low-level standards matter, with fibub's calibration tool."
tools: [calibration-curve, method-validation, non-detects]
updated: 2026-11-16
sources:
  - "Stabl, A., Reich, K., Wittmann, I., Wittmann, S., Özmutlu Karslioglu, Ö. and Grüner, S. (2026), A Simplified and Solvent-Reduced HPLC-UV/Vis Method for the Simultaneous Determination of Major Marker Compounds in Rhodiola rosea L., Molecules 31(20): 3734, doi:10.3390/molecules31203734. Licence CC BY 4.0, checked on the journal page, 2026-11-16. Values used here, from the Results: working range 2.5 to 200 µg/mL; LOD and LOQ (µg/mL) salidroside 0.164 and 0.497, tyrosol 0.100 and 0.302, rosarin 0.158 and 0.477, rosavin 0.049 and 0.148, rosin 0.063 and 0.189; R² 0.9908, 0.9990, 1.0000, 0.9977 and 0.9995; limits from standards at 0.01 to 0.5 µg/mL in triplicate with LOD = 3.3 SD / slope and LOQ = 10 SD / slope."
  - "ICH Q2(R2), Validation of Analytical Procedures (2023): LOD = 3.3 σ / S and LOQ = 10 σ / S."
  - "Miller, J. N. and Miller, J. C., Statistics and Chemometrics for Analytical Chemistry, 6th ed., sections 5.3 to 5.10 (calibration and weighted regression)."
paper:
  title: "A Simplified and Solvent-Reduced HPLC-UV/Vis Method for the Simultaneous Determination of Major Marker Compounds in Rhodiola rosea L."
  authors: "Stabl A, Reich K, Wittmann I, Wittmann S, Özmutlu Karslioglu Ö, Grüner S"
  journal: "Molecules"
  year: 2026
  doi: "10.3390/molecules31203734"
  url: "https://www.mdpi.com/1420-3049/31/20/3734"
  licence: "CC BY 4.0"
  reviewed: true
---

*Rhodiola rosea*, or roseroot, is a cold-climate plant whose root is sold in herbal products. Its quality is judged by a handful of marker compounds, above all **salidroside** and the **rosavins**. A team has published a simpler liquid chromatography method that measures five of them in one run with less solvent. Every such method rests on a **calibration curve** and on two numbers: the **limit of detection** (LOD), the smallest amount you can tell apart from nothing, and the **limit of quantitation** (LOQ), the smallest amount you can measure with useful precision. This article shows how the [[calibration-curve]] tool lets anyone check numbers like these, and what choices change them. The [[method-validation]] tool takes the next step (precision and recovery), and [[non-detects]] handles results that fall below the LOD.

## The paper in brief

The method uses **HPLC-UV**: the plant extract is pushed through a packed column, each compound leaves the column at its own time, and a UV detector measures how much light it absorbs. The size of each peak is turned into a concentration with a calibration line made from pure standards. The team cut the solvent use and simplified the extraction, and still separated salidroside, tyrosol, rosarin, rosavin and rosin.

They calibrated from **2.5 to 200 µg/mL** (micrograms per millilitre), with R² from 0.9908 (salidroside) to 1.0000 (rosarin). For the limits, they ran separate standards at **0.01 to 0.5 µg/mL** in triplicate and used the standard formulas, LOD = 3.3 × SD ÷ slope and LOQ = 10 × SD ÷ slope. The LODs run from **0.049 µg/mL** (rosavin) to **0.164 µg/mL** (salidroside): far below the working range, so the method can also see small amounts.

## Checked with the tools

We used the paper's reported limits and R² values and the Calibration curve tool's maths. We did not have the raw peak areas, so Steps 2 and 3 use **simulated** standards, labelled as such.

**Step 1: are the limits consistent?** If both limits use the same SD and slope, LOQ ÷ LOD must equal 10 ÷ 3.3 = **3.03**. For the five compounds it is 3.03, 3.02, 3.02, 3.02 and 3.00. The last differs only because 0.063 and 0.189 are rounded. The table is internally consistent.

**Step 2: why weighting matters over a wide range.** In HPLC-UV the scatter of peak areas usually grows with concentration. We simulated triplicate standards at 2.5, 5, 10, 25, 50, 100 and 200 µg/mL with 2% scatter and fitted them two ways (Figure 1). Unweighted, the line looks perfect (R² = 0.99986), but it reads the 2.5 µg/mL standard back **8.9% too high**: the big standards dominate the fit. With **1/x² weighting**, every level comes back within **1.3%**. A high R² does not show that the low end is right; back-calculated standards do.

<!-- fig:weights -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="On a simulated 2.5 to 200 µg/mL calibration with 2% scatter, the unweighted line reads the lowest standard back with a large error; the 1/x² weighted line keeps every level within a few per cent." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Back-calculated standards: unweighted vs 1/x² (simulated)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Back-calculated standards: unweighted vs 1/x² (simulated)</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">-20</text><line x1="58" x2="546" y1="216.5" y2="216.5" style="stroke:var(--line)"/><text x="52" y="220.5" text-anchor="end" style="fill:var(--muted)">-10</text><line x1="58" x2="546" y1="161" y2="161" style="stroke:var(--line)"/><text x="52" y="165" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="105.5" y2="105.5" style="stroke:var(--line)"/><text x="52" y="109.5" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">2.5</text><line x1="135.2" x2="135.2" y1="272" y2="276" style="stroke:var(--muted)"/><text x="135.2" y="289" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="212.4" x2="212.4" y1="272" y2="276" style="stroke:var(--muted)"/><text x="212.4" y="289" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="314.4" x2="314.4" y1="272" y2="276" style="stroke:var(--muted)"/><text x="314.4" y="289" text-anchor="middle" style="fill:var(--muted)">25</text><line x1="391.6" x2="391.6" y1="272" y2="276" style="stroke:var(--muted)"/><text x="391.6" y="289" text-anchor="middle" style="fill:var(--muted)">50</text><line x1="468.8" x2="468.8" y1="272" y2="276" style="stroke:var(--muted)"/><text x="468.8" y="289" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Concentration (µg/mL, log scale)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Error of read-back (%)</text><line x1="58" x2="546" y1="161" y2="161" style="stroke:var(--muted);stroke-dasharray:4 4"/><line x1="58" x2="546" y1="77.8" y2="77.8" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="72.8" text-anchor="end" style="fill:var(--muted)">±15%</text><line x1="58" x2="546" y1="244.3" y2="244.3" style="stroke:var(--muted);stroke-dasharray:4 4"/><path d="M58 111.4L135.2 146.9L212.4 149.3L314.4 166.6L391.6 160.5L468.8 164.9L546 160" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="58" cy="111.4" r="2.2" style="fill:var(--c-blog);opacity:1"/><circle cx="135.2" cy="146.9" r="2.2" style="fill:var(--c-blog);opacity:1"/><circle cx="212.4" cy="149.3" r="2.2" style="fill:var(--c-blog);opacity:1"/><circle cx="314.4" cy="166.6" r="2.2" style="fill:var(--c-blog);opacity:1"/><circle cx="391.6" cy="160.5" r="2.2" style="fill:var(--c-blog);opacity:1"/><circle cx="468.8" cy="164.9" r="2.2" style="fill:var(--c-blog);opacity:1"/><circle cx="546" cy="160" r="2.2" style="fill:var(--c-blog);opacity:1"/><path d="M58 157.9L135.2 167.9L212.4 157.6L314.4 167.3L391.6 158.5L468.8 161.7L546 156.1" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="58" cy="157.9" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="135.2" cy="167.9" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="212.4" cy="157.6" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="314.4" cy="167.3" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="391.6" cy="158.5" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="468.8" cy="161.7" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="546" cy="156.1" r="2.2" style="fill:var(--c-tools);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">No weighting</text><line x1="170.4" x2="182.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="186.4" y="40" style="fill:var(--muted)">1/x² weighting</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Read-back error of each standard on a simulated 2.5 to 200 µg/mL calibration with 2% scatter, fitted with the Calibration curve tool's maths without weighting and with 1/x² weighting. Simulated, not the paper's data.</figcaption></figure>
<!-- /fig:weights -->

**Step 3: why the limits need their own low standards.** From that simulated wide-range fit, the residual SD gives an LOD of **2.76 µg/mL**: higher than the lowest standard. The scatter of 200 µg/mL standards says nothing about noise near zero. That is why the paper measured its limits from standards at 0.01 to 0.5 µg/mL. We simulated such a set with constant noise (Figure 2). The tool gives LOD **0.121 µg/mL** and LOQ **0.367 µg/mL** from the residual SD, in the same range as the paper's values.

<!-- fig:limits -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Fifteen simulated low-level standards; the fitted line's residual standard deviation gives an LOD of 0.121 and an LOQ of 0.367 µg/mL." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Low-level standards and the limits (simulated)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Low-level standards and the limits (simulated)</text><line x1="58" x2="546" y1="243.6" y2="243.6" style="stroke:var(--line)"/><text x="52" y="247.6" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="168.2" y2="168.2" style="stroke:var(--line)"/><text x="52" y="172.2" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="92.8" y2="92.8" style="stroke:var(--line)"/><text x="52" y="96.8" text-anchor="end" style="fill:var(--muted)">4</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="151.8" x2="151.8" y1="272" y2="276" style="stroke:var(--muted)"/><text x="151.8" y="289" text-anchor="middle" style="fill:var(--muted)">0.1</text><line x1="245.7" x2="245.7" y1="272" y2="276" style="stroke:var(--muted)"/><text x="245.7" y="289" text-anchor="middle" style="fill:var(--muted)">0.2</text><line x1="339.5" x2="339.5" y1="272" y2="276" style="stroke:var(--muted)"/><text x="339.5" y="289" text-anchor="middle" style="fill:var(--muted)">0.3</text><line x1="433.4" x2="433.4" y1="272" y2="276" style="stroke:var(--muted)"/><text x="433.4" y="289" text-anchor="middle" style="fill:var(--muted)">0.4</text><line x1="527.2" x2="527.2" y1="272" y2="276" style="stroke:var(--muted)"/><text x="527.2" y="289" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Concentration (µg/mL)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Peak area (arbitrary units)</text><line x1="171.6" x2="171.6" y1="50" y2="272" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="167.6" y="62" text-anchor="end" style="fill:var(--muted)">LOD 0.12</text><line x1="402.1" x2="402.1" y1="50" y2="272" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="398.1" y="62" text-anchor="end" style="fill:var(--muted)">LOQ 0.37</text><circle cx="67.4" cy="246.5" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="67.4" cy="260.1" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="67.4" cy="231.2" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="104.9" cy="217" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="104.9" cy="239.7" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="104.9" cy="209.6" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="151.8" cy="194.9" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="151.8" cy="211.3" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="151.8" cy="229.7" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="292.6" cy="176.8" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="292.6" cy="147.4" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="292.6" cy="157.5" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="527.2" cy="61.9" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="527.2" cy="73.1" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="527.2" cy="63.4" r="3" style="fill:var(--c-blog);opacity:1"/><path d="M58 246.5L527.2 67.6" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Standards</text><line x1="148.8" x2="160.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="164.8" y="40" style="fill:var(--muted)">Fitted line</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Simulated low-level standards (0.01 to 0.5 µg/mL, triplicates) with the line, LOD and LOQ from the Calibration curve tool's maths. Simulated, not the paper's data.</figcaption></figure>
<!-- /fig:limits -->

**Step 4: which SD?** ICH Q2 allows either the **residual SD** of the line or the **SD of its intercept**. The paper says "the standard deviation of the regression analysis", which most likely means the residual SD. On our simulated low-level set the choice changes the answer by almost three times: LOD 0.121 µg/mL from the residual SD, **0.045 µg/mL** from the intercept SD. When you compare limits between papers, check which SD they used.

| Check | Paper | Tool result |
|---|---|---|
| LOQ ÷ LOD (should be 3.03) | 0.497 ÷ 0.164 for salidroside | 3.03; 3.00 to 3.03 for all five |
| Lowest standard read back, unweighted | (not reported) | +8.9% (simulated) |
| Same, 1/x² weighting | (not reported) | +0.6% (simulated) |
| LOD from low-level standards | 0.049 to 0.164 µg/mL | 0.121 µg/mL (simulated, residual SD) |
| LOD, intercept SD instead | (not stated) | 0.045 µg/mL (same simulated data) |

## How we made the graphs

The charts and every number above come from `scripts/blog-figures/rhodiola-rosea-hplc-uv-salidroside-rosavin-lod-loq.mjs` in fibub's public code. It calls the functions behind the [[calibration-curve]] tool, from `src/lib/sci/calibration.ts`:

- `calibrate` fits the line, with no weighting or with 1/x or 1/x² weighting;
- `inverse` reads a response back to a concentration with its confidence interval;
- `limits` gives LOD and LOQ by ICH Q2, from the residual SD or the intercept SD.

From the paper: the five LODs, LOQs and R² values, the 2.5 to 200 µg/mL range and the 0.01 to 0.5 µg/mL limit standards. Our assumptions, labelled in the script: seven wide-range levels in triplicate, a slope of 10 area units per µg/mL, 2% proportional scatter for the wide range, and constant noise of 0.5 area units for the low-level set.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks the calibration maths against the worked examples in Miller and Miller's *Statistics and Chemometrics for Analytical Chemistry*:

- The textbook's seven standards must give a slope of **1.9304**, an intercept of **1.5179**, a residual SD of **0.4328** and r = **0.9989**.
- A response of 13.5 must read back as **6.21** with a standard error of **0.24**, and a response of 2.9 as **0.72** (SE 0.26).
- The LOD must equal 3.3 × 0.4328 ÷ 1.9304.

## Check it yourself

On the [[calibration-curve]] tool, with our simulated low-level standards:

1. In the box under *Concentration and response, one standard per line*, replace the example with the 15 rows below.
2. Type **µg/mL** in *Concentration unit* and **Peak area** in *Response name*. Leave *Weighting* on **None (equal)** and *LOD and LOQ from* on **Residual SD (s y/x)**.
3. The facts read **R² 0.96475**, **LOD 0.121 µg/mL** and **LOQ 0.367 µg/mL**.
4. Switch *LOD and LOQ from* to **SD of the intercept**: LOD drops to about **0.045 µg/mL**.
5. To check a paper's own limits, paste its low-level standards if they are published; otherwise use Step 1's ratio test by hand.

```
0.01	-0.075
0.01	-0.437
0.01	0.331
0.05	0.706
0.05	0.104
0.05	0.902
0.1	1.292
0.1	0.859
0.1	0.369
0.25	1.773
0.25	2.552
0.25	2.286
0.5	4.821
0.5	4.525
0.5	4.781
```

## What researchers can use it for

- **Sanity-check a validation table:** test LOQ ÷ LOD, then refit published standards in the [[calibration-curve]] tool.
- **Choose a weighting** for a wide range by comparing back-calculated standards with none, 1/x and 1/x².
- **Report limits clearly:** say which SD you used, and show both if reviewers ask.
- **Finish the validation:** the [[method-validation]] tool works out repeatability, intermediate precision and recovery from replicate results.
- **Handle values below the LOD** in survey data with [[non-detects]], instead of replacing them with half the limit.

## The fine print

- The limits, R² values and ranges come from the paper's Results. Our standards in Figures 1 and 2 are **simulated**; they show how the maths behaves, not the paper's data.
- The paper does not give its slopes or peak areas, so we could not refit its own lines.
- Our 2% scatter and the noise level in the low-level set are assumptions; real detectors and columns vary.
- This article is about the statistics of the method only. It says nothing about the health effects of *Rhodiola* products.
