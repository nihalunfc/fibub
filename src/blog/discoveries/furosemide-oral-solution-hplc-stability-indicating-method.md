---
title: "Stability-indicating HPLC method for furosemide oral solution and its degradant"
summary: "A 2025 Molecules study validated one HPLC-UV run for furosemide, its main breakdown product and two parabens in a children's oral solution. Here is how to check such validation numbers yourself."
tools: [method-validation, calibration-curve]
updated: 2026-11-10
sources:
  - "Srejomthong K et al. (2025), Molecules 30(19): 4031, CC BY, the paper described here."
  - "Validation terms (linearity, LOD = 3.3σ/slope, LOQ = 10σ/slope, repeatability, intermediate precision, recovery): ICH Q2(R2)."
  - "Repeatability and intermediate precision from one-way ANOVA: ISO 5725-2 and -3."
paper:
  title: "Simultaneous Development and Validation of an HPLC Method for the Determination of Furosemide and Its Degraded Compound in Pediatric Extemporaneous Furosemide Oral Solution"
  authors: "Srejomthong K, Pattananandecha T, Apichai S, Charumanee S, Sirithunyalug B, Ogata F, Kawasaki N, Saenjum C"
  journal: "Molecules"
  year: 2025
  doi: "10.3390/molecules30194031"
  url: "https://www.mdpi.com/1420-3049/30/19/4031"
  licence: "CC BY"
  reviewed: true
---

When no ready-made liquid medicine suits a small child, hospital pharmacists often mix one themselves, an "extemporaneous" preparation. Someone then has to show how long it stays good. A 2025 paper in Molecules (CC BY) built a single HPLC run that measures the diuretic furosemide, its main breakdown product and two paraben preservatives at once. The authors validated it by the ICH rules and used it to follow a 5 mg/mL oral solution for 90 days. Below we explain the work in our own words and show how the [[method-validation]] tool and the [[calibration-curve]] reproduce the statistics behind a validation report.

## What they found

One isocratic run on a C18 column, with dilute acetic acid and acetonitrile (60:40) and UV detection at 272 nm, separated all four compounds in under 15 minutes. Every calibration line had R² above 0.995. The authors report a quantitation limit of about 0.36 µg/mL for the breakdown product, furosemide-related compound B. They also report repeatability RSDs of 0.1 to 1.5 %, intermediate precision RSDs of 0.5 to 2.0 % and recoveries of about 98 to 101 %.

Forced stress showed the method is stability-indicating: acid and peroxide broke furosemide down, and the product peaks did not overlap the drug. In storage, solutions kept at 2 to 8 °C showed no detectable degradant over 90 days. At 40 °C the degradant reached several per cent by day 90, above the 1.5 % limit the authors cite, and methylparaben lost about half its content.

## Why it matters

A method that sees the drug, its breakdown product and the preservatives in one run saves time and solvent. Stability data for home-made paediatric liquids are scarce, so validated methods like this are what beyond-use dates are built on. This is laboratory research, not guidance on any medicine: storage rules come from the pharmacist and the official monograph.

## How they did it

1. Two columns and several wavelengths were compared; 272 nm was chosen as the best compromise for all four compounds.
2. Linearity used seven levels per compound, each in triplicate.
3. Precision used three levels in triplicate on one day (repeatability) and on three days (intermediate precision). Recovery used spiked samples at three levels.
4. Robustness checks varied column temperature, flow rate and wavelength slightly.
5. Acid, base, peroxide, heat and light stressed the drug. The solutions were then stored at three conditions and sampled over 90 days.

## Check it yourself with fibub

Here is a worked example with **our own invented numbers**, not the paper's data.

**Step 1: linearity, LOD and LOQ.** Paste these standards into the calibration curve tool (concentration in µg/mL, then peak area):

| µg/mL | 5 | 10 | 25 | 50 | 75 | 100 |
|---|---|---|---|---|---|---|
| Peak area | 61.8 | 121.0 | 306.9 | 610.5 | 918.8 | 1219.6 |

With no weighting and LOD from the residual SD, the tool gives a slope of 12.209 per µg/mL, an intercept of 0.54 (not different from zero), R² = 0.99999, an **LOD of about 0.51 µg/mL** and an **LOQ of about 1.55 µg/mL**. Check the residual plot: the points should scatter with no curve. Then type two injections of one sample, 612.0 and 609.1, on one line. The tool reads **49.96 µg/mL**, with a 95 % interval of about 49.6 to 50.3.

**Step 2: precision and recovery.** A solution is spiked at exactly 50 µg/mL and measured three times on each of three days. Paste the columns with their header row:

| Day 1 | Day 2 | Day 3 |
|---|---|---|
| 49.6 | 50.6 | 49.4 |
| 50.3 | 50.1 | 49.8 |
| 49.9 | 50.8 | 50.2 |

Type 50 as the true value. The tool reports:

- no Grubbs outliers in any day, and no day whose mean stands out
- repeatability **RSD_r ≈ 0.74 %**, from the pooled scatter within days
- intermediate precision **RSD_I ≈ 0.96 %**, which adds the day-to-day spread
- F = 3.01, p = 0.12: the days do not clearly differ
- recovery **100.16 %**, 95 % interval 99.46 to 100.85 %, bias +0.16 % (p = 0.62, not significant)

All of these sit inside the usual drug-assay limits of RSD ≤ 2 % and recovery 98 to 102 %. Do the same at a low and a high level, as the paper did, since precision usually gets worse near the LOQ. Leave the Horwitz box empty here. That check comes from interlaboratory studies and suits trace analysis better than a clean drug solution.

## The fine print

- The authors call their storage results qualitative trends, not a formal stability study, and say beyond-use dates need confirmation.
- Only one preparation, in two variants, was followed.
- 272 nm is less sensitive for the parabens than a shorter wavelength.
- Some retention times in the main text seem to be mixed up with resolution values; the full set is in the supplement.
- Raw data are available only on request. Read the full paper for the exact figures at each level.
