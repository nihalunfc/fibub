---
title: "Checking a published Fick table: oxygen uptake, cardiac output and the a–v difference"
summary: "A 2025 study profiled cardiac output after bariatric surgery with the Fick principle. We put its three columns through fibub's Fick cardiac output calculator and show why medians of linked variables do not add up."
tools: [fick-cardiac-output, respirometry-calculator, vo2max-estimator]
updated: 2026-11-24
sources:
  - "Chwiedź, A., Minarowski, Ł., Mróz, R. M. and Hady, H. R. (2025), Beyond VO2 Peak: Hemodynamic Profiling After Bariatric Surgery Using the Fick Principle, Applied Sciences 15(21): 11502, doi:10.3390/app152111502. Licence CC BY (Creative Commons Attribution), checked on the MDPI article page, 2026-11-24. Values used here: 24 patients enrolled and 14 completed; medians before surgery, at 3 months and at 6 months for body weight 144.0, 121.95 and 112.3 kg; V̇O₂ at rest 0.26, 0.25 and 0.24 L/min; V̇O₂ peak 2.24, 1.29 and 1.44 L/min (16, 10.15 and 14.3 mL/min/kg); cardiac output at rest 7.2, 6.3 and 6.0 L/min and at peak 18.2, 15.5 and 14.1 L/min; arteriovenous O₂ difference at rest 19.0, 26.0 and 25.5 and at peak 50.5, 46.0 and 52.0 mL O₂/dL; oxygen uptake measured breath by breath and cardiac output by inert-gas rebreathing."
  - "Oxygen content of blood = 1.34 × Hb × saturation + 0.0031 × PO₂ (Hüfner factor 1.34 to 1.39 mL O₂ per g of haemoglobin; O₂ solubility about 0.003 mL/dL per mmHg), the standard textbook form; see any respiratory physiology text. The Fick principle: A. Fick (1870). Formulas only."
paper:
  title: "Beyond VO2 Peak: Hemodynamic Profiling After Bariatric Surgery Using the Fick Principle"
  authors: "Chwiedź A, Minarowski Ł, Mróz RM, Hady HR"
  journal: "Applied Sciences"
  year: 2025
  doi: "10.3390/app152111502"
  url: "https://www.mdpi.com/2076-3417/15/21/11502"
  licence: "CC BY 4.0"
  reviewed: true
---

The Fick principle is one line of arithmetic: the oxygen a body takes up each minute equals the blood flow through the lungs times the oxygen each unit of blood picks up. Because it is an identity, any table that reports all three quantities can be checked against itself in seconds. A 2025 study in *Applied Sciences* did exactly that kind of profiling in people before and after bariatric surgery, reporting oxygen uptake, cardiac output and the arteriovenous oxygen difference side by side. We ran its three columns through the [[fick-cardiac-output]] calculator, and the check turns into a short lesson about what happens when you take the median of each column separately. Measure the oxygen uptake that feeds the calculation with the [[respirometry-calculator]], and put a peak uptake in context with the [[vo2max-estimator]].

## The paper in brief

Fourteen patients (of 24 enrolled) did a cardiopulmonary exercise test before bariatric surgery and again at 3 and 6 months. Oxygen uptake was measured breath by breath, and cardiac output by inert-gas rebreathing, at rest and at peak exercise. Median body weight fell from **144.0 kg** to **121.95** and then **112.3 kg**, with body fat down from 51.2 % to about 35 %.

The headline hemodynamic result is that cardiac output fell as weight came off: **7.2 → 6.3 → 6.0 L/min at rest** and **18.2 → 15.5 → 14.1 L/min at peak**. Peak oxygen uptake dipped at 3 months (**2.24 → 1.29 → 1.44 L/min**) and had not recovered to baseline at 6 months. The authors' point is a good one: peak oxygen uptake alone hides what the heart is doing, and the Fick components tell a fuller story. They also report an arteriovenous oxygen difference, rising at rest from **19.0 to about 25.5 mL O₂/dL** and sitting near **46 to 52 mL O₂/dL** at peak.

## Checked with the tools

The Fick cardiac output calculator does two things we need. It works out the **oxygen content of blood** from haemoglobin, saturation and PO₂, and it applies the Fick principle to give cardiac output, stroke volume, oxygen delivery and extraction. Both directions are useful here, because the paper gives all three Fick quantities and so over-determines its own table.

**Step 1: the ceiling on an a–v difference.** Arterial blood cannot give up more oxygen than it carries. At a haemoglobin of **14 g/dL** (**our assumption**; the paper reports no haemoglobin) with 98 % saturation at a PO₂ of 95 mmHg, the tool gives an arterial content of **18.68 mL O₂/dL**. Even at 16 g/dL fully saturated at 100 mmHg it is **21.75 mL/dL**. So an arteriovenous difference of 46 to 52 mL O₂/dL is not possible in those units: it is more than twice the whole oxygen cargo of the blood.

**Step 2: what the paper's own numbers imply.** Dividing the reported oxygen uptake by the reported cardiac output gives the a–v difference the Fick identity demands:

| Visit | V̇O₂ (L/min) | Cardiac output (L/min) | a–v difference reported | a–v difference from V̇O₂ ÷ output |
|---|---|---|---|---|
| Before surgery, rest | 0.26 | 7.2 | 19.0 mL/dL | **3.61 mL/dL** |
| Before surgery, peak | 2.24 | 18.2 | 50.5 mL/dL | **12.31 mL/dL** |
| 3 months, rest | 0.25 | 6.3 | 26.0 mL/dL | **3.97 mL/dL** |
| 3 months, peak | 1.29 | 15.5 | 46.0 mL/dL | **8.32 mL/dL** |
| 6 months, rest | 0.24 | 6.0 | 25.5 mL/dL | **4.00 mL/dL** |
| 6 months, peak | 1.44 | 14.1 | 52.0 mL/dL | **10.21 mL/dL** |

<!-- fig:avdiff -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="The arteriovenous oxygen differences the paper reports, against the values that follow from its own oxygen uptake and cardiac output. The reported peak values sit well above the total oxygen content of arterial blood." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Reported a–v O₂ difference against what Fick allows</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Reported a–v O₂ difference against what Fick allows</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--line)"/><text x="52" y="266" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="186.3" y2="186.3" style="stroke:var(--line)"/><text x="52" y="190.3" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="110.6" y2="110.6" style="stroke:var(--line)"/><text x="52" y="114.6" text-anchor="end" style="fill:var(--muted)">40</text><line x1="98.7" x2="98.7" y1="262" y2="266" style="stroke:var(--muted)"/><text x="98.7" y="279" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="302" x2="302" y1="262" y2="266" style="stroke:var(--muted)"/><text x="302" y="279" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="505.3" x2="505.3" y1="262" y2="266" style="stroke:var(--muted)"/><text x="505.3" y="279" text-anchor="middle" style="fill:var(--muted)">6</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Months after surgery</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">a–v O₂ difference (mL O₂/dL)</text><line x1="58" x2="546" y1="191.3" y2="191.3" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="186.3" text-anchor="end" style="fill:var(--muted)">arterial content 18.7 mL/dL (Hb 14)</text><circle cx="98.7" cy="70.8" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="302" cy="87.9" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="505.3" cy="65.1" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="98.7" cy="190.1" r="5" style="fill:var(--c-tools);opacity:1"/><circle cx="302" cy="163.6" r="5" style="fill:var(--c-tools);opacity:1"/><circle cx="505.3" cy="165.5" r="5" style="fill:var(--c-tools);opacity:1"/><circle cx="98.7" cy="215.4" r="5" style="fill:var(--ink);opacity:1"/><circle cx="302" cy="230.5" r="5" style="fill:var(--ink);opacity:1"/><circle cx="505.3" cy="223.3" r="5" style="fill:var(--ink);opacity:1"/><circle cx="98.7" cy="248.3" r="5" style="fill:var(--muted);opacity:1"/><circle cx="302" cy="247" r="5" style="fill:var(--muted);opacity:1"/><circle cx="505.3" cy="246.9" r="5" style="fill:var(--muted);opacity:1"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Reported, peak</text><circle cx="189.8" cy="36" r="4" style="fill:var(--c-tools)"/><text x="200.8" y="40" style="fill:var(--muted)">Reported, rest</text><circle cx="316.6" cy="36" r="4" style="fill:var(--ink)"/><text x="327.6" y="40" style="fill:var(--muted)">V̇O₂ ÷ output, peak</text><circle cx="479.4" cy="36" r="4" style="fill:var(--muted)"/><text x="490.4" y="40" style="fill:var(--muted)">V̇O₂ ÷ output, rest</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. For each visit, the arteriovenous oxygen difference the paper reports (coloured) and the value that follows from dividing its own oxygen uptake by its own cardiac output (grey and black). The dashed line is the total oxygen carried by arterial blood at a haemoglobin of 14 g/dL, worked out by the Fick cardiac output calculator: no a-v difference can be larger.</figcaption></figure>
<!-- /fig:avdiff -->

The reported values are 4.1 to 6.6 times the implied ones, and the factor is not constant, so this is not one slipped unit. One detail is worth noting without reading too much into it: at baseline the resting value of 19.0 is very close to the **oxygen extraction in per cent** that the tool gives for that row (19.3 %), but the other visits do not match that pattern (21.2 % against 26.0, 21.4 % against 25.5), so the resemblance is probably coincidence.

**Step 3: the uptake and output columns are consistent with each other.** This is the reassuring half. Taking the implied a–v differences and asking the tool what mixed venous saturation they correspond to (haemoglobin 14 g/dL, arterial 98 % at 95 mmHg, mixed venous PO₂ 40 mmHg at rest and 20 mmHg at peak, all **our assumptions**) gives **79.7 % at rest and 33.6 % at peak before surgery**, and 77.8 / 54.9 % and 77.6 / 44.8 % at the later visits. Those are believable numbers: a high resting saturation fits the high resting cardiac output that severe obesity produces, and a peak value in the thirties fits a maximal effort. The 3-month peak value of 54.9 % is high for a peak test, which agrees with the paper's own finding that fitness had dropped at that visit.

<!-- fig:svo2 -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="The mixed venous oxygen saturation implied by the reported oxygen uptake and cardiac output, at rest and at peak exercise, with haemoglobin assumed at 14 g per dL." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Mixed venous saturation the numbers imply</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Mixed venous saturation the numbers imply</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--line)"/><text x="52" y="266" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="219.6" y2="219.6" style="stroke:var(--line)"/><text x="52" y="223.6" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="177.2" y2="177.2" style="stroke:var(--line)"/><text x="52" y="181.2" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="134.8" y2="134.8" style="stroke:var(--line)"/><text x="52" y="138.8" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="92.4" y2="92.4" style="stroke:var(--line)"/><text x="52" y="96.4" text-anchor="end" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">100</text><line x1="98.7" x2="98.7" y1="262" y2="266" style="stroke:var(--muted)"/><text x="98.7" y="279" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="302" x2="302" y1="262" y2="266" style="stroke:var(--muted)"/><text x="302" y="279" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="505.3" x2="505.3" y1="262" y2="266" style="stroke:var(--muted)"/><text x="505.3" y="279" text-anchor="middle" style="fill:var(--muted)">6</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Months after surgery</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Implied S̄vO₂ (%)</text><line x1="58" x2="546" y1="103" y2="103" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="98" text-anchor="end" style="fill:var(--muted)">usual resting value, 75 %</text><line x1="58" x2="546" y1="198.4" y2="198.4" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="193.4" text-anchor="end" style="fill:var(--muted)">usual peak-exercise value, 30 %</text><circle cx="98.7" cy="93" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="302" cy="97.1" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="505.3" cy="97.5" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="98.7" cy="190.8" r="5" style="fill:var(--c-tools);opacity:1"/><circle cx="302" cy="145.6" r="5" style="fill:var(--c-tools);opacity:1"/><circle cx="505.3" cy="167" r="5" style="fill:var(--c-tools);opacity:1"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">At rest</text><circle cx="139.4" cy="36" r="4" style="fill:var(--c-tools)"/><text x="150.4" y="40" style="fill:var(--muted)">At peak exercise</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The mixed venous saturation that the reported oxygen uptake and cardiac output imply, with haemoglobin assumed at 14 g/dL. Both sit in a believable range, which is why the oxygen uptake and output columns look mutually consistent.</figcaption></figure>
<!-- /fig:svo2 -->

**Step 4: the medians explain it.** A median is not linear, so the median of V̇O₂ divided by the median of cardiac output is not the median of the individual ratios. The paper's own mass-specific column shows the same effect: median peak V̇O₂ divided by median weight gives **15.56, 10.58 and 12.82 mL/min/kg**, while the paper reports **16, 10.15 and 14.3**. Those gaps are small, a few per cent, because weight varies little between patients. The a–v difference is the ratio of two quantities that each vary a lot between patients, so taking its median separately can land far from the ratio of the medians. That, plus a probable unit or definition mismatch, is the most likely reading.

| Check | Paper | Tool |
|---|---|---|
| Largest possible a–v difference | — | 18.68 mL O₂/dL at Hb 14, 21.75 at Hb 16 |
| Peak a–v difference, before surgery | 50.5 mL/dL | 12.31 mL/dL from the paper's own V̇O₂ and output |
| Implied mixed venous saturation, peak | not reported | 33.6 % (plausible) |
| Peak V̇O₂ per kg, before surgery | 16 mL/min/kg | 15.56 from median V̇O₂ ÷ median weight |
| Cardiac output at rest with textbook blood values | 7.2 L/min | 5.80 L/min at S̄vO₂ 75 %, so 7.2 needs about 80 % |

None of this touches the paper's main message, which rests on the oxygen uptake and cardiac output columns, and those two agree with each other. It does mean that a reader should not quote the a–v difference column as mL O₂/dL, and that a table of Fick quantities is worth running through the identity before it is published.

## How we made the graphs

Both figures and every number above come from `scripts/blog-figures/fick-principle-check-bariatric-surgery-cardiac-output.mjs` in fibub's public code. It imports `o2Content`, `fick` and the oxygen solubility constant `O2_SOL` from `src/lib/sci/fickco.ts`, the maths behind the [[fick-cardiac-output]] calculator.

- `o2Content(14, 0.98, 95)` gives the arterial content and so the ceiling line in Figure 1.
- The implied a–v differences are the paper's V̇O₂ in mL/min divided by its cardiac output in dL/min, which is the Fick identity rearranged; `fick()` is used the other way round for the last table row, to get cardiac output from a V̇O₂ and two blood oxygen contents.
- Figure 2 inverts the content equation: mixed venous saturation = (arterial content − a–v difference − 0.0031 × PO₂) ÷ (1.34 × Hb).
- From the paper: the body weights, oxygen uptakes, cardiac outputs, a–v differences and mass-specific values, all medians. **Our assumptions:** haemoglobin 14 g/dL, arterial saturation 98 % at 95 mmHg, mixed venous PO₂ 40 mmHg at rest and 20 mmHg at peak, Hüfner factor 1.34, and a resting mixed venous saturation of 75 % for the last table row.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/fick-cardiac-output.mjs`, which pins the formulas against a Python rewrite and, for the flow calculator on the same page, against a SciPy integration:

- Arterial and venous content for Hb 15 g/dL at 98 % / 95 mmHg and 75 % / 40 mmHg must be 19.9925 and 15.199 mL/dL.
- A V̇O₂ of 250 mL/min with those contents, a heart rate of 70 and a body surface area of 1.9 m² must give cardiac output 5.215395849 L/min, stroke volume 74.50565498 mL, cardiac index 2.744945183, oxygen delivery 1042.688015 mL/min and extraction 0.2397649118.
- The PO₂ unit switch and a Hüfner factor of 1.39 must give 19.17149928 mL/dL for Hb 14 at 97 % and 12.7 kPa.
- Poiseuille flow on the same page must match SciPy's integral of the parabolic velocity profile to 10⁻⁸, and doubling the radius must give exactly 16 times the flow.
- New with this article: the arterial content at Hb 14, 98 % and 95 mmHg must be 18.6793 mL/dL, and a V̇O₂ of 2240 mL/min with a cardiac output of 18.2 L/min must imply an a–v difference of 12.3077 mL/dL and a mixed venous saturation of 33.63 % at a venous PO₂ of 20 mmHg.

## Check it yourself

On the [[fick-cardiac-output]] page, in the Fick principle card:

1. Type *O₂ uptake V̇O₂ (mL/min)* **2240** (the paper's peak before surgery, in mL/min).
2. Type *Haemoglobin (g/dL)* **14**, *Arterial saturation SaO₂ (%)* **98**, *Arterial PO₂* **95** with *PO₂ unit* on **mmHg**.
3. Leave *Hüfner factor* on **1.34**. The arterial content shown is **18.68 mL/dL**: that is the most any a–v difference can be.
4. Set *Mixed venous saturation SvO₂ (%)* to **34** and *Mixed venous PO₂* to **20**. Cardiac output comes out at **18.30 L/min**, close to the paper's 18.2, and the a–v difference at **12.24 mL/dL**, nowhere near the 50.5 in the table.
5. Now set *Mixed venous saturation* to **0** (physically impossible, but try it): the a–v difference reaches only **18.62 mL/dL** and cardiac output bottoms out at **12.03 L/min**. There is no setting that produces 50 mL/dL.
6. For the resting row, type *O₂ uptake* **260**, *Mixed venous saturation* **75**, *Mixed venous PO₂* **40**: cardiac output is **5.80 L/min**, below the paper's 7.2, so the reported resting output needs a higher venous saturation, near 80 %.

## What researchers can use it for

- **Audit a Fick table before submission**: if V̇O₂, cardiac output and the a–v difference are all reported, two of them fix the third, and the check takes a minute.
- **Convert between the three columns** when a paper gives only two, so a reported cardiac output can be compared with another study that reports extraction instead.
- **Set a plausibility ceiling**: compute the arterial oxygen content for your population's haemoglobin and reject any extraction value above it.
- **Report summary statistics carefully**: medians of linked variables do not satisfy the identity that links them, so say which quantity was summarised and which was derived.
- **Teach the Fick principle with real numbers** rather than textbook ones, including the high resting cardiac output and low extraction seen in severe obesity.

## The fine print

- The paper reports medians, not individual data, so we cannot recompute patient-level values; the mismatch we show is a property of the published summary table.
- Haemoglobin, arterial saturation and venous PO₂ are **our assumptions**. Changing haemoglobin from 14 to 16 g/dL moves the ceiling from 18.7 to 21.8 mL/dL, which does not change the conclusion.
- We are not saying the measurements are wrong. The most likely explanation is a unit or definition difference in one column together with the non-linearity of the median.
- This is general science education, not medical advice, and the Fick calculator is for study and teaching, not clinical use.
