---
title: "CR-39 radon detectors: why detection limits fall as 1/exposure time"
summary: "A 2026 study of 90 indoor radon detectors finds decision thresholds that fall as 1/t, not 1/√t. We show why with Currie's counting formulas and infer the background behind the lines."
tools: [counting-statistics, decay-chain, uncertainty-calculator]
updated: 2026-11-24
sources:
  - "Loffredo, F. and Quarto, M. (2026), Measurement Uncertainty and Detection Limits in Radon Concentration Assessment Using CR-39 Nuclear Track Detectors, Atmosphere 17(6): 621, doi:10.3390/atmos17060621. Licence CC BY, checked on the MDPI article page, 2026-11-24. Values used here: 90 CR-39 detectors exposed 1, 3 or 6 months; calibration factor 0.513 ± 0.051 tracks cm⁻² per kBq h m⁻³; α = β = 0.05; fitted lines ln C* = 8.978 − 1.000 ln t and ln C# = 9.777 − 1.000 ln t; median and geometric mean 68 Bq/m³, geometric standard deviation 3; 4 % of results below the decision threshold, 8 % detectable but not quantifiable, 88 % above the detection limit; expected slope −0.5 for pure Poisson counting; national reference level 300 Bq/m³."
  - "Currie, L. A. (1968), Limits for qualitative detection and quantitative determination, Analytical Chemistry 40: 586-593 (decision threshold and detection limit)."
paper:
  title: "Measurement Uncertainty and Detection Limits in Radon Concentration Assessment Using CR-39 Nuclear Track Detectors"
  authors: "Loffredo F, Quarto M"
  journal: "Atmosphere"
  year: 2026
  doi: "10.3390/atmos17060621"
  url: "https://www.mdpi.com/2073-4433/17/6/621"
  licence: "CC BY 3.0"
  reviewed: true
---

Radon is a radioactive gas that seeps from the ground into homes, and after smoking it is a leading cause of lung cancer. The cheapest way to measure it is a small plastic chip, **CR-39**, left in a room for months: each alpha particle from radon and its decay products leaves a tiny damage trail that a chemical bath etches into a countable pit, a **track**. A 2026 paper in *Atmosphere* works through 90 such measurements and asks two questions every lab must answer: is there really radon above the background, and how sure are we of the number? Here we rebuild its key result, limits that fall in proportion to 1/exposure time, with the Currie formulas in fibub's [[counting-statistics]] helper. The radon decay products themselves can be followed with the [[decay-chain]] calculator, and the full uncertainty budget with the [[uncertainty-calculator]].

## The paper in brief

The authors exposed CR-39 detectors in homes for 1, 3 or 6 months, etched them and counted tracks. Unexposed chips from the same batch, about one in ten, gave the **background**: tracks that are there before any radon (from manufacture, storage and transport). Radon concentration is net tracks divided by the counted area, the calibration factor (0.513 tracks per cm² for every kBq h m⁻³ of exposure) and the exposure time.

Following ISO 11929, they work out two **characteristic limits**. The **decision threshold** C* is the level above which a result counts as "radon present", with a 5 % chance of a false alarm. The **detection limit** C# is the true concentration that would be detected 95 % of the time. Their fitted lines, ln C* = 8.978 − ln t and ln C# = 9.777 − ln t, fall with a slope of exactly −1 on log axes, not the −½ that pure Poisson counting suggests. Of the 90 results, 4 % sat below C*, 8 % between C* and C#, and 88 % above C#; the typical home had 68 Bq/m³, well under the national reference level of 300.

## Checked with the tools

The paper gives its limits as fitted lines, not as track counts, so we did two things with the helper's `currie` function: a **recomputation** of the slope argument, and an **inference** of the background that the lines imply. We read t in the fitted lines as hours (**our reading**: in days the one-month limit would be 264 Bq/m³, above most homes) and took 1 month as 720 h.

**Step 1: the limits from the fitted lines.** At 1, 3 and 6 months the paper's lines give C* = **11.0, 3.67 and 1.83 Bq/m³** and C# = **24.5, 8.16 and 4.08 Bq/m³**. The ratio C#/C* is the same at every exposure: e^0.799 = **2.22**.

**Step 2: what background does that ratio imply?** Currie's formulas fix this ratio by the background alone: with lots of background counts it tends to 2.0, and with few it is larger, because the detection limit carries an extra 2.71 counts. Solving with the helper's maths for a single blank of the same area, the ratio 2.22 needs a background of about **27 tracks**, so σ₀ (the spread of the net count when there is no radon) is **7.37 tracks**, the decision threshold **12.1 tracks** and the detection limit **26.9 tracks**. Matching 12.1 tracks to C* = 11.0 Bq/m³ at one month then gives a counted area of about **3.0 cm²**. These are **our inferences**, not values from the paper; if the 9.9 % uncertainty of the calibration factor is folded in as ISO 11929 does, the same lines imply about 50 tracks on about 4 cm².

**Step 3: why the slope is −1.** The background tracks are in the chip before it is ever exposed, so their number does not grow with exposure time. The decision threshold in **tracks** is then the same for a 1-month and a 6-month chip, and dividing by t to get Bq/m³ makes C* fall as 1/t. A detector whose background **grows** with time, like a counter with a steady background rate, has a threshold in counts that rises as √t, so in concentration it falls only as 1/√t. Figure 1 shows both, matched at one month: by 6 months the growing-background case is at **4.49 Bq/m³** against **1.83** for the fixed background, which sits on the paper's line.

<!-- fig:slope -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="Decision threshold in Bq/m³ against exposure time on log scales. A background fixed in tracks gives slope −1 and matches the paper's line (11.01, 3.67 and 1.83 Bq/m³ at 1, 3 and 6 months); a background that grows with time would give slope −0.5." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>CR-39: decision threshold against exposure time</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">CR-39: decision threshold against exposure time</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--line)"/><text x="52" y="246" text-anchor="end" style="fill:var(--muted)">0.5</text><line x1="58" x2="546" y1="213.1" y2="213.1" style="stroke:var(--line)"/><text x="52" y="217.1" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="184.2" y2="184.2" style="stroke:var(--line)"/><text x="52" y="188.2" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="146" y2="146" style="stroke:var(--line)"/><text x="52" y="150" text-anchor="end" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="117.1" y2="117.1" style="stroke:var(--line)"/><text x="52" y="121.1" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="88.2" y2="88.2" style="stroke:var(--line)"/><text x="52" y="92.2" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">50</text><line x1="58" x2="58" y1="242" y2="246" style="stroke:var(--muted)"/><text x="58" y="259" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="164.4" x2="164.4" y1="242" y2="246" style="stroke:var(--muted)"/><text x="164.4" y="259" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="270.9" x2="270.9" y1="242" y2="246" style="stroke:var(--muted)"/><text x="270.9" y="259" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="333.1" x2="333.1" y1="242" y2="246" style="stroke:var(--muted)"/><text x="333.1" y="259" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="439.6" x2="439.6" y1="242" y2="246" style="stroke:var(--muted)"/><text x="439.6" y="259" text-anchor="middle" style="fill:var(--muted)">6</text><line x1="546" x2="546" y1="242" y2="246" style="stroke:var(--muted)"/><text x="546" y="259" text-anchor="middle" style="fill:var(--muted)">12</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">Exposure (months, log scale)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">C* (Bq/m³, log scale)</text><path d="M58 84.2L66.1 86.4L74.3 88.6L82.4 90.8L90.5 93L98.7 95.2L106.8 97.4L114.9 99.6L123.1 101.8L131.2 104L139.3 106.3L147.5 108.5L155.6 110.7L163.7 112.9L171.9 115.1L180 117.3L188.1 119.5L196.3 121.7L204.4 123.9L212.5 126.1L220.7 128.3L228.8 130.5L236.9 132.7L245.1 135L253.2 137.2L261.3 139.4L269.5 141.6L277.6 143.8L285.7 146L293.9 148.2L302 150.4L310.1 152.6L318.3 154.8L326.4 157L334.5 159.2L342.7 161.5L350.8 163.7L358.9 165.9L367.1 168.1L375.2 170.3L383.3 172.5L391.5 174.7L399.6 176.9L407.7 179.1L415.9 181.3L424 183.5L432.1 185.7L440.3 187.9L448.4 190.2L456.5 192.4L464.7 194.6L472.8 196.8L480.9 199L489.1 201.2L497.2 203.4L505.3 205.6L513.5 207.8L521.6 210L529.7 212.2L537.9 214.4L546 216.7" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 98.7L66.1 99.7L74.3 100.9L82.4 101.9L90.5 103.1L98.7 104.1L106.8 105.3L114.9 106.3L123.1 107.5L131.2 108.6L139.3 109.7L147.5 110.8L155.6 111.9L163.7 113L171.9 114.1L180 115.2L188.1 116.3L196.3 117.4L204.4 118.5L212.5 119.6L220.7 120.7L228.8 121.8L236.9 123L245.1 124L253.2 125.2L261.3 126.2L269.5 127.4L277.6 128.4L285.7 129.6L293.9 130.6L302 131.8L310.1 132.8L318.3 134L326.4 135.1L334.5 136.2L342.7 137.3L350.8 138.4L358.9 139.5L367.1 140.6L375.2 141.7L383.3 142.8L391.5 143.9L399.6 145L407.7 146.1L415.9 147.2L424 148.3L432.1 149.5L440.3 150.5L448.4 151.7L456.5 152.7L464.7 153.9L472.8 154.9L480.9 156.1L489.1 157.1L497.2 158.3L505.3 159.3L513.5 160.5L521.6 161.5L529.7 162.7L537.9 163.8L546 164.9" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><circle cx="164.4" cy="113.1" r="4" style="fill:var(--ink);opacity:1"/><circle cx="333.1" cy="158.9" r="4" style="fill:var(--ink);opacity:1"/><circle cx="439.6" cy="187.8" r="4" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Fixed background (slope −1)</text><line x1="278.4" x2="290.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:5 4"/><text x="294.4" y="40" style="fill:var(--muted)">Background grows (slope −½)</text><circle cx="503.8" cy="36" r="4" style="fill:var(--ink)"/><text x="514.8" y="40" style="fill:var(--muted)">Paper's fitted line</text><text class="fibub-mark" x="546" y="280" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Decision threshold against exposure time, both on log scales, from Currie's formulas in the Counting statistics helper's maths. Solid: a background fixed in tracks, with the background count inferred from the paper's two fitted lines; dashed: the same background at one month but growing with exposure; dots: the paper's fitted line at 1, 3 and 6 months.</figcaption></figure>
<!-- /fig:slope -->

**Step 4: do the class shares make sense?** If radon in homes is log-normal with a geometric mean of 68 Bq/m³ and a geometric standard deviation of 3 (the paper's values), the share of homes below C* is 4.9 % for 1-month chips, 0.4 % for 3 months and 0.1 % for 6 months. With equal numbers of each (**our assumption**; the paper's mix is not in its text) that gives **1.8 % / 5.2 % / 93.1 %** for below C*, between, and above C#; with all chips at 1 month, 4.9 % / 12.7 % / 82.4 %. The paper's 4 % / 8 % / 88 % sits between, as it should if many chips were short exposures.

| Check | Paper | Counting statistics maths |
|---|---|---|
| Slope of the limits on log axes | −1.000 | −1 for a background fixed in tracks; −½ if it grew with time |
| C#/C* | e^0.799 = 2.22 | needs about 27 background tracks (σ₀ 7.4) for a paired blank |
| C* at 6 months | 1.83 Bq/m³ | 1.83 (fixed background), 4.49 (growing background) |
| Shares below C*, between, above C# | 4 %, 8 %, 88 % | 1.8 to 4.9 %, 5.2 to 12.7 %, 82.4 to 93.1 % depending on the exposure mix |

## How we made the graphs

The chart and numbers come from `scripts/blog-figures/cr-39-radon-detector-decision-threshold-detection-limit-exposure-time-currie.mjs`. It calls `currie` and `poissonCI` from `src/lib/sci/phcount.ts`, the maths behind the [[counting-statistics]] helper, and `normCdf` from `src/lib/sci/stats.ts` for the log-normal class shares.

The calibration factor, the fitted lines, α and β, the radon distribution and the class shares come from the paper. Reading t in hours, a month of 720 h, a paired blank of the same area, leaving out the calibration term in Step 2's main numbers, and the equal mix of exposure times are **our assumptions**. The background count and counted area are **inferred**, not measured.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/counting-statistics.mjs`, which pins the helper against SciPy and Currie's own paper:

- For a paired blank of 400 counts, the decision threshold must be **46.52** counts and the detection limit **95.75**, which is Currie's 2.33√B and 2.71 + 4.65√B.
- With unequal times (150 background counts in 3600 s, a 600 s sample) and β = 0.10, L_C and L_D must match SciPy's root-finding: **8.883 and 17.652** counts.
- New with this article: a paired blank of 27 tracks must give L_C **12.09**, L_D **26.88** and σ₀ **7.348**, and the same background averaged over nine blanks (243 tracks) L_C **9.009** and L_D **20.72**.

## Check it yourself

On the [[counting-statistics]] helper, in *1. Net counts and detection limit*:

1. Type **60** in *Gross counts (sample)* and **1** in *Gross counting time* (one chip; the time unit does not matter here).
2. Type **27** in *Background counts* and **1** in *Background counting time* (one blank chip of the same area). Leave *Counting efficiency (%, optional)* empty and α and β at **5 %**.
3. *Decision threshold L_C* reads **12.09 net counts** (σ₀ = 7.348) and *Detection limit L_D* **26.88 net counts**. The net count, 33 tracks, is above both: radon detected and quantifiable.
4. Turn tracks into radon: 33 tracks ÷ (3.0 cm² × 0.000513 tracks cm⁻² per Bq h m⁻³ × 2160 h) is about **10 Bq/m³** for a 3-month chip.
5. Now average the background over nine blanks: **243** in *Background counts* and **9** in *Background counting time*. L_C drops to **9.009** and L_D to **20.72**: more blanks, lower limits, with no longer exposure.

## What researchers can use it for

- **Decide "detected or not"** for any track, alpha or gamma count with the [[counting-statistics]] helper, before quoting a concentration.
- **Plan how many blanks to etch**: compare one, five and ten blank chips and see how far the decision threshold falls.
- **Choose an exposure time** for a target detection limit, remembering that for track detectors the limit falls as 1/t.
- **Combine uncertainties** of calibration, area and counting in the [[uncertainty-calculator]] to check a reported relative uncertainty.
- **Teach radon physics**: follow radon-222 and its short-lived decay products into equilibrium with the [[decay-chain]] calculator, which is why the chips see more alpha particles than radon alone gives.

## The fine print

- The background count and counted area are **inferred** from the paper's two fitted lines with counting statistics alone; the real values are not in the paper's text, and ISO 11929's calibration term changes them (about 50 tracks and 4 cm²).
- We read the fitted lines with t in hours; with another unit the limits would scale but the slopes would not.
- The class shares depend on how many chips were exposed for each time, which we did not have.
- Health: this is general education. For radon in your own home, follow your national radon programme's guidance.
