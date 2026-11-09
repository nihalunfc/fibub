---
name: Exposure TWA calculator (8-hour TWA, STEL, long shifts)
num: 477
shelf: science
section: toxicology
title: "8-hour TWA calculator: time-weighted average exposure, 15-minute STEL, excursion check and Brief and Scala long-shift adjustment"
summary: "Work out a worker's 8-hour time-weighted average from sampled periods (unsampled time as zero or at the sampled average), the highest 15-minute average for a STEL, an excursion check, and a reduced limit for long shifts by Brief and Scala or the OSHA model, against limits you type in."
status: live
ads: false
order: 17
icon: clock
works: offline
updated: 2026-11-09
related: [margin-of-exposure, air-quality-calculator, gaussian-plume-calculator, psychrometric-calculator, gas-law-calculator, uncertainty-calculator, shift-scheduler]
sources:
  - "8-hour TWA = Σ(C × t) ÷ 8 h: the standard definition, as in US OSHA 29 CFR 1910.1000(d) and UK HSE EH40/2005. Excursion guidance (3 × the TWA limit for at most 30 minutes a day, never 5 ×): ACGIH TLV documentation, given as editable defaults (checked 2026-11-09; check the official source)."
  - "Long-shift adjustment: R. S. Brief and R. A. Scala, Occupational exposure limits for novel work schedules, Am Ind Hyg Assoc J 36:467 (1975). OSHA model (8 ÷ h daily, 40 ÷ h weekly) as described by D. J. Paustenbach in Patty's Industrial Hygiene and Toxicology. Formulas only."
  - "No exposure limit tables are included; the example limits and measurements are made up. Checked in the tests by hand and against an independent Python calculation (minute-by-minute profile) on 30 random sampling days."
flow:
  - { icon: clock, label: "Samples" }
  - { icon: calculator, label: "C × t" }
  - { icon: chart, label: "TWA, STEL" }
  - { icon: check, label: "Limits" }
---

## What it does

Workplace air limits are usually written as an **8-hour time-weighted average (TWA)**, often with a **15-minute short-term exposure limit (STEL)**. Air sampling gives a series of periods, each with its own measured concentration. This page adds up concentration × time for each period, works out the 8-hour TWA, the average over the whole shift and the highest 15-minute average, checks the **excursion rule**, and for shifts longer than 8 hours reduces the limit by the **Brief and Scala** model or the **OSHA model**. It compares everything with limits you type in, and shows the working so you can check every sum. It is for study and teaching, not medical advice or a compliance report.

Convert readings between ppm and mg/m³ with the [[air-quality-calculator]], and compare the dose with a safe level using the [[margin-of-exposure|margin of exposure calculator]].

## How to use it

1. Paste the **sampled periods**, one per line, either as clock times and a concentration (07:00 09:30 12) or as minutes and a concentration (150 12). A task name at the end of the line is optional. You can also open a CSV or Excel file. Periods that cross midnight work.
2. Choose the **unit** and type the **shift length** in hours.
3. Choose what happens to **time not sampled**: counted as zero exposure (only if there truly was none, such as a break away from the work) or assumed to be at the average of the samples.
4. Type your **8-hour limit** and, if there is one, your **STEL**. Choose a **long-shift adjustment** and the **hours per week** for the weekly models.
5. The **excursion rule** is for substances without a STEL. Change the three numbers if your guidance differs.
6. Download the working as CSV, or the report as an image, PDF or Word file.

## The formulas

- 8-hour TWA = Σ(Cᵢ × tᵢ) ÷ 480 minutes, over the whole shift (so a 10-hour shift is still divided by 8 hours).
- Shift average = Σ(Cᵢ × tᵢ) ÷ shift length.
- Highest 15-minute average: the largest average over any 15-minute window, with gaps between samples counted as zero. It is exact for the stepped profile the samples give.
- Brief and Scala: daily reduction factor = (8 ÷ h) × (24 − h) ÷ 16; weekly = (40 ÷ h) × (168 − h) ÷ 128. OSHA model: 8 ÷ h daily, 40 ÷ h weekly. The adjusted limit (limit × factor) is compared with the shift average. The factor is never above 1.

## Worked example

The example is a made-up 10-hour day from 07:00 to 17:00 with a 30-minute lunch break, with an 8-hour limit of 20 ppm and a STEL of 50 ppm (both made up). The five samples cover 570 minutes and add up to **6000 ppm·min**, so the **8-hour TWA is 6000 ÷ 480 = 12.5 ppm** (63 % of the limit) and the shift average is 10 ppm. The 15-minute tank cleaning at 60 ppm gives a highest 15-minute average of **60 ppm from 09:30**, which is **above the 50 ppm STEL**. For a 10-hour shift the Brief and Scala daily factor is 0.8 × 14 ÷ 16 = 0.7, so the adjusted limit is 14 ppm, and the 10 ppm shift average is within it.

## Tips

- Take short (15-minute) samples during peak tasks; long samples hide peaks.
- Brief and Scala is simple and cautious. Models based on how the body clears a substance need its half-life, which this page does not ask for.

## FAQ

**Why divide by 8 hours on a 10-hour shift?** The 8-hour TWA is defined as the total daily exposure spread over 8 hours, so long shifts are counted in full. The long-shift adjustment then asks whether the limit itself should be lower.

**Are limit values included?** No. Type the limits that apply to you from the official source.

**Is anything uploaded?** No. Everything is worked out in your browser.
