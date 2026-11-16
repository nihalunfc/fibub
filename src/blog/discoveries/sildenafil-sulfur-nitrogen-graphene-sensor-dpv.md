---
title: "Sildenafil sensor on S,N-doped graphene: detection limit and Laviron check"
summary: "A sulfur- and nitrogen-doped graphene electrode measures sildenafil in tablets down to 0.24 µM by pulse voltammetry. We check its detection limits, recovery and electron transfer with fibub's calibration and voltammetry tools."
tools: [calibration-curve, cyclic-voltammetry]
updated: 2026-11-16
sources:
  - "Man, N. Q., Xuan, N. T. T., Ly, V. T. K., Son, L. V. T., Anh, L. D. et al. (2026), Electrochemical sensing of sildenafil in pharmaceutical formulations using an (S,N)-doped reduced graphene oxide-modified electrode, Beilstein Journal of Nanotechnology 17, 1087-1102, doi:10.3762/bjnano.17.74. Licence: Beilstein-Institut Open Access License, identical to CC BY 4.0, checked on the journal page, 2026-11-16. Values used here: linear ranges 0.25 to 19.61 µM and 0.25 to 4.98 µM; LOD 0.49 and 0.24 µM, LOQ 1.61 and 0.78 µM (3S/b and 10S/b); mean currents 0.9585 µA at 1.0 µM, 1.6990 µA at 2.0 µM and 7.9800 µA at 13.8 µM; tablet sample 1 found 4.07 µM, 5.06 µM after adding 1.00 µM, recovery 98.1 %; scan rates 0.07 to 0.40 V/s; log ip against log v slope 0.49; Ep against pH slope 0.0317 V per pH; Laviron slope 0.0312 V; αn about 0.823."
  - "Detection and quantitation limits, 3.3σ/b and 10σ/b: ICH Q2(R2) Validation of Analytical Procedures (2023). 3σ rule and its worked example (0.67 pg/mL): Miller, J. N. and Miller, J. C., Statistics and Chemometrics for Analytical Chemistry, 6th ed., section 5.7."
  - "Laviron, E. (1979), General expression of the linear potential sweep voltammogram in the case of diffusionless electrochemical systems, J. Electroanal. Chem. 101, 19-28."
paper:
  title: "Electrochemical sensing of sildenafil in pharmaceutical formulations using an (S,N)-doped reduced graphene oxide-modified electrode"
  authors: "Man, N. Q.; Xuan, N. T. T.; Ly, V. T. K.; Son, L. V. T.; Anh, L. D. et al."
  journal: "Beilstein Journal of Nanotechnology"
  year: 2026
  doi: "10.3762/bjnano.17.74"
  url: "https://beilstein-journals.org/bjnano/articles/17/74"
  licence: "CC BY 4.0"
  reviewed: true
---

**Sildenafil** is the active ingredient of several common prescription tablets, and fake or under-dosed versions are a real problem. Checking the dose usually needs liquid chromatography (HPLC). A 2026 study in the *Beilstein Journal of Nanotechnology* builds a cheaper alternative: a carbon electrode coated with **reduced graphene oxide doped with sulfur and nitrogen**, read by **differential pulse voltammetry (DPV)**, a scan that measures the current when the drug is oxidised at the electrode. This article shows how the [[calibration-curve]] tool and the [[cyclic-voltammetry|cyclic voltammetry analyser]] let anyone check its detection limits, its recovery test and what its scan-rate study says about the reaction, and what changes when you use a different detection-limit rule.

## The paper in brief

Graphene oxide was doped with sulfur and nitrogen and then reduced, and a thin film of it was put on a glassy carbon electrode. In a pH 4 buffer, sildenafil gives one oxidation peak whose height rises in a straight line with concentration from **0.25 to 19.61 µM**. The team reports a detection limit (LOD) of **0.49 µM** over the whole range, or **0.24 µM** from the low end alone, using the common "3S/b" rule: three times the scatter of the line (S) divided by its slope (b). Tablet results agreed with HPLC, spiked recoveries were 97.6 to 103.5 %, and the peak's shift with scan rate and pH was used to work out how many electrons and protons the reaction takes.

## Checked with the tools

**Step 1: the calibration line.** The paper gives the mean current at three concentrations (1.0, 2.0 and 13.8 µM). A straight line through them has a slope of **0.542 µA per µM** and an intercept of 0.512 µA. We used that line to simulate ten standards over the paper's full range, with scatter sized to reproduce its 0.49 µM detection limit (Figure 1). This is a **simulation** built from the paper's numbers, not its data.

<!-- fig:cal -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="Ten simulated standards from 0.25 to 19.61 µM on a line of slope 0.540 µA per µM; the 3σ rule gives an LOD of 0.49 µM and an LOQ of 1.63 µM." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Simulated calibration with the paper's LOD built in</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Simulated calibration with the paper's LOD built in</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--line)"/><text x="52" y="236" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="192.4" y2="192.4" style="stroke:var(--line)"/><text x="52" y="196.4" text-anchor="end" style="fill:var(--muted)">2.5</text><line x1="58" x2="546" y1="152.9" y2="152.9" style="stroke:var(--line)"/><text x="52" y="156.9" text-anchor="end" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="113.3" y2="113.3" style="stroke:var(--line)"/><text x="52" y="117.3" text-anchor="end" style="fill:var(--muted)">7.5</text><line x1="58" x2="546" y1="73.7" y2="73.7" style="stroke:var(--line)"/><text x="52" y="77.7" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="58" y1="232" y2="236" style="stroke:var(--muted)"/><text x="58" y="249" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="180" x2="180" y1="232" y2="236" style="stroke:var(--muted)"/><text x="180" y="249" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="302" x2="302" y1="232" y2="236" style="stroke:var(--muted)"/><text x="302" y="249" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="424" x2="424" y1="232" y2="236" style="stroke:var(--muted)"/><text x="424" y="249" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="546" x2="546" y1="232" y2="236" style="stroke:var(--muted)"/><text x="546" y="249" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Sildenafil (µM)</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">DPV peak current (µA)</text><line x1="70" x2="70" y1="50" y2="232" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="74" y="62" text-anchor="start" style="fill:var(--muted)">LOD</text><line x1="97.9" x2="97.9" y1="50" y2="232" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="101.9" y="78" text-anchor="start" style="fill:var(--muted)">LOQ</text><circle cx="64.1" cy="220.9" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="70.2" cy="221.2" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="82.4" cy="214.7" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="106.8" cy="204.8" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="155.6" cy="190.8" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="204.4" cy="172.8" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="253.2" cy="153.8" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="350.8" cy="123.1" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="448.4" cy="86.3" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="536.5" cy="55.9" r="3.5" style="fill:var(--c-blog);opacity:1"/><path d="M58 223.7L546 52.8" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Simulated standards</text><line x1="220.8" x2="232.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="236.8" y="40" style="fill:var(--muted)">Fitted line</text></svg><figcaption>Figure 1. A calibration simulated with the Calibration curve tool's maths: the line runs through the paper's mean currents at 1.0, 2.0 and 13.8 µM, and the scatter is sized to give its 0.49 µM detection limit. Not the paper's data.</figcaption></figure>
<!-- /fig:cal -->

**Step 2: which detection-limit rule?** On the simulated line, the Calibration curve tool gives **LOD 0.49 µM** with the 3σ rule the paper uses, but **0.54 µM** with the ICH Q2 rule of 3.3σ that pharmaceutical method validation follows: 10 % higher, from the same data. Both rules give the same quantitation limit (LOQ, 10σ/b), **1.63 µM**. The tool now offers both rules (see *How we test the maths*), so the number you report matches the rule you name.

**Step 3: are the paper's LOD and LOQ consistent?** If both come from the same σ and slope, LOQ ÷ LOD should be 10 ÷ 3 = 3.33. The paper's pairs give **3.29** (1.61 ÷ 0.49) and **3.25** (0.78 ÷ 0.24): close enough to be rounding, so the limits hang together.

**Step 4: how sure is one tablet reading?** On the simulated line, a single reading equal to tablet sample 1's 4.07 µM comes back with a 95 % confidence interval of **3.67 to 4.47 µM**, about ±10 %. That is the uncertainty from the calibration alone, before weighing and dilution, and it is why replicate readings help.

**Step 5: recovery.** Sample 1 read 4.07 µM, and 5.06 µM after 1.00 µM was added: (5.06 − 4.07) ÷ 1.00 = **99.0 %**, against the paper's stated 98.1 %. The small gap is likely rounding of the found values; the other samples' added amounts are not listed, so they cannot be checked the same way.

**Step 6: what the scan-rate study says.** The slope of log(peak current) against log(scan rate) is **0.49** in the paper; the Cyclic voltammetry analyser reads a slope near 0.5 as a **diffusion-controlled** reaction, where the drug has to travel to the electrode rather than sit on it. For the electron count, the analyser's new **Laviron** step fits the peak potential against ln(scan rate): the paper's slope of 31.2 mV gives **αn = 0.823** (Figure 2), matching the paper. With a transfer coefficient α of 0.5 that means n ≈ **1.6**, which the paper rounds to two electrons.

<!-- fig:lav -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 258" role="img" aria-label="A slope of 31.2 mV per unit of ln v gives αn = 0.823." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Laviron plot: peak potential against ln(scan rate)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Laviron plot: peak potential against ln(scan rate)</text><line x1="58" x2="546" y1="212" y2="212" style="stroke:var(--line)"/><text x="52" y="216" text-anchor="end" style="fill:var(--muted)">0.88</text><line x1="58" x2="546" y1="176" y2="176" style="stroke:var(--line)"/><text x="52" y="180" text-anchor="end" style="fill:var(--muted)">0.9</text><line x1="58" x2="546" y1="140" y2="140" style="stroke:var(--line)"/><text x="52" y="144" text-anchor="end" style="fill:var(--muted)">0.92</text><line x1="58" x2="546" y1="104" y2="104" style="stroke:var(--line)"/><text x="52" y="108" text-anchor="end" style="fill:var(--muted)">0.94</text><line x1="58" x2="546" y1="68" y2="68" style="stroke:var(--line)"/><text x="52" y="72" text-anchor="end" style="fill:var(--muted)">0.96</text><line x1="131.2" x2="131.2" y1="212" y2="216" style="stroke:var(--muted)"/><text x="131.2" y="229" text-anchor="middle" style="fill:var(--muted)">-2.5</text><line x1="253.2" x2="253.2" y1="212" y2="216" style="stroke:var(--muted)"/><text x="253.2" y="229" text-anchor="middle" style="fill:var(--muted)">-2</text><line x1="375.2" x2="375.2" y1="212" y2="216" style="stroke:var(--muted)"/><text x="375.2" y="229" text-anchor="middle" style="fill:var(--muted)">-1.5</text><line x1="497.2" x2="497.2" y1="212" y2="216" style="stroke:var(--muted)"/><text x="497.2" y="229" text-anchor="middle" style="fill:var(--muted)">-1</text><line x1="58" x2="546" y1="212" y2="212" style="stroke:var(--muted)"/><text x="302" y="250" text-anchor="middle" style="fill:var(--ink)">ln(scan rate / (V/s))</text><text transform="translate(14 131) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Peak potential (V)</text><circle cx="92.4" cy="145" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="179.3" cy="124.9" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="278.3" cy="102.2" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="348.6" cy="86" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="403" cy="73.4" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="447.4" cy="63.1" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="485" cy="54.5" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="517.7" cy="47.1" r="3.5" style="fill:var(--c-blog);opacity:1"/><path d="M92.4 145L517.7 46.9" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Simulated peaks</text><line x1="192" x2="204" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="208" y="40" style="fill:var(--muted)">Fit: αn = 0.823</text></svg><figcaption>Figure 2. Peak potentials simulated with the paper's Laviron slope over its 0.07 to 0.40 V/s range, fitted with the new Laviron step in the Cyclic voltammetry analyser. Not the measured peaks.</figcaption></figure>
<!-- /fig:lav -->

**Step 7: protons.** When the same number of protons and electrons take part, the peak moves by 59.16 mV per pH unit at 25 °C. The paper's 31.7 mV per pH is **0.536** of that: about one proton for every two electrons (1.07 protons for 2 electrons).

| Check | Paper | Tool result |
|---|---|---|
| LOD, full range, 3σ rule | 0.49 µM | 0.49 µM (built into the simulation) |
| Same data, ICH 3.3σ rule | (not stated) | 0.54 µM |
| LOQ ÷ LOD | 1.61 ÷ 0.49; 0.78 ÷ 0.24 | 3.29 and 3.25 (expected 3.33) |
| Recovery, sample 1 | 98.1 % | 99.0 % from the found values |
| Diffusion or adsorption | diffusion (slope 0.49) | diffusion controlled |
| αn from Laviron slope 31.2 mV | about 0.823 | 0.823 |
| Protons per electron | (pH slope 31.7 mV) | 0.54 |

## How we made the graphs

Everything above comes from `scripts/blog-figures/sildenafil-sulfur-nitrogen-graphene-sensor-dpv.mjs` in fibub's public code. It calls:

- `calibrate`, `inverse` and `limits` from `src/lib/sci/calibration.ts`, the maths behind the [[calibration-curve]] tool.
- `scanRateStudy` and the new `laviron` from `src/lib/sci/cv.ts`, the maths behind the [[cyclic-voltammetry|cyclic voltammetry analyser]].
- `thermalV` from `src/lib/sci/nernst.ts`, the maths behind the [[nernst-calculator]], for the 59.16 mV per pH slope.

Where the inputs come from: the mean currents, limits, recovery values, scan-rate range and slopes are from the paper. The ten concentration levels, the pattern of scatter, a peak current of 12 µA and a peak potential of 0.95 V at 0.2 V/s are **our assumptions**, so both figures are **simulations** shaped by the paper's numbers.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks these functions against published answers:

- The calibration maths must reproduce Miller and Miller's worked example: slope 1.9304, intercept 1.5179, s(y/x) 0.4328, and a reading of 13.5 back to 6.21 pg/mL.
- **New with this article:** the 3σ rule must give Miller and Miller's detection limit of **0.67 pg/mL** on the same example, and the choice of rule must leave the LOQ unchanged.
- The voltammetry maths must give the Randles–Sevcik constant as 2.69 × 10⁵ and a log–log slope of exactly 0.5 for a simulated diffusing species; **new with this article**, a Laviron slope of 31.2 mV must give αn = 0.8235, for an oxidation or a reduction.

## Check it yourself

**The detection limits, on the [[calibration-curve]] tool:**

1. Paste these simulated standards (concentration in µM, current in µA) into *Concentration and response, one standard per line*:

```
0.25	0.704
0.5	0.6794
1	1.0915
2	1.718
4	2.6037
6	3.7437
8	4.9402
12	6.8811
16	9.2082
19.61	11.1262
```

2. Type **µM** in *Concentration unit*, leave *Weighting* on **None (equal)** and *LOD and LOQ from* on **Residual SD (s y/x)**.
3. Set *LOD rule* to **3 σ / slope (common in sensor papers)**: *LOD* reads **0.49 µM** and *LOQ* **1.63 µM**. Switch to **3.3 σ / slope (ICH Q2)**: LOD reads **0.539 µM**.
4. In *Responses, one sample per line*, type **Tablet 1: 2.722**. It reads back about **4.07 µM**, with a 95 % interval of about 3.67 to 4.47 µM.

**The electron transfer, on the [[cyclic-voltammetry|cyclic voltammetry analyser]]:** in *Scan-rate study*, paste these simulated peaks (scan rate in mV/s, current in µA, potential in V):

```
70	7.174	0.9172
100	8.544	0.9284
150	10.422	0.9410
200	12.000	0.9500
250	13.387	0.9570
300	14.637	0.9627
350	15.786	0.9675
400	16.853	0.9716
```

It reports a *log ip against log v* slope of **0.490** (diffusion controlled) and *Laviron: Ep against ln v* with a slope of about **31.2 mV** and **αn = 0.823**.

## What researchers can use it for

- **Report the limit you mean**: the [[calibration-curve]] tool shows the 3σ and ICH 3.3σ detection limits from the same line, so a sensor paper and a validation report can be compared.
- **Put an interval on every result**: read an unknown back with its 95 % confidence range, not only a single number.
- **Sanity-check a table**: LOQ ÷ LOD should be about 3.3, and a recovery should follow from the found and added amounts.
- **Read a scan-rate study**: the [[cyclic-voltammetry|cyclic voltammetry analyser]] separates diffusion from adsorption and now gives αn from peak shifts.
- **Teach** electroanalysis with realistic numbers, from detection limits to Nernst slopes.

## The fine print

- The calibration and scan-rate data here are **simulated** from the paper's summary numbers; the paper's own regression equations were not used.
- The 3σ and 3.3σ rules are both conventions; neither is "right", but a report should say which it used.
- αn from a Laviron slope assumes an irreversible reaction; the split into α and n needs an assumed α (0.5 here).
- The method was tested on tablets, not on blood or other biological samples, and this article is not medical advice.
