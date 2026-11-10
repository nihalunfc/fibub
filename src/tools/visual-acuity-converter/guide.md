---
name: Visual acuity converter
num: 496
shelf: science
code: T347
section: audiology-and-vision-science
title: "Visual acuity converter: Snellen 20/20 and 6/6 to logMAR, decimal, MAR, VAS and ETDRS letters"
summary: "Convert visual acuity between Snellen (20/40, 6/12, any distance), decimal, logMAR, MAR, the Visual Acuity Score and ETDRS letter score. Paste many values at once, average them properly in logMAR and see the chart lines. For study and teaching."
status: live
ads: false
order: 36
icon: eye
works: offline
updated: 2026-11-09
related: [reliability-analysis, sample-size, plot-maker, uncertainty-calculator]
sources:
  - "Formulas: logMAR as in Bailey IL, Lovie JE (1976) New design principles for visual acuity letter charts, Am J Optom Physiol Opt 53:740; ETDRS chart, Ferris FL et al. (1982) Am J Ophthalmol 94:91."
  - "ETDRS letter score = 85 − 50 × logMAR: Beck RW et al. (2003) Am J Ophthalmol 135:194; Gregori NZ, Feuer W, Rosenfeld PJ (2010) Retina 30:1046."
  - "Visual Acuity Score = 100 − 50 × logMAR: Colenbrander A, Visual acuity measurement standard (International Council of Ophthalmology, 1984; in the AMA Guides)."
  - "Averaging in logMAR: Holladay JT (1997) Proper method for calculating average visual acuity, J Refract Surg 13:388."
  - "Code written by fibub from these formulas and checked against a separate Python implementation. Chart labels are the usual rounded values, computed as 10^(logMAR)."
flow:
  - { icon: pencil, label: "Type" }
  - { icon: convert, label: "Convert" }
  - { icon: table, label: "Lines" }
  - { icon: download, label: "Save" }
---

## What it does

Visual acuity is written in many ways. A clinic in the US writes 20/40, one in the UK or India writes 6/12, much of Europe writes the decimal 0.5, research papers use logMAR 0.30, and clinical trials count ETDRS letters (70). They are all the same measurement: the size of the smallest detail the eye can resolve. This tool converts any of them into all the others, for one value or a whole column pasted from a spreadsheet.

Every notation is a simple function of the **minimum angle of resolution** (MAR), the size of a letter's stroke in minutes of arc:

- Snellen 20/x: x = 20 × MAR (feet); 6/y: y = 6 × MAR (metres). Any test distance works: 4/10 means MAR 2.5.
- Decimal = 1 ÷ MAR.
- logMAR = log₁₀(MAR) (Bailey and Lovie 1976). 0 is 20/20; bigger numbers are worse sight.
- Visual Acuity Score, VAS = 100 − 50 × logMAR (Colenbrander). 100 is 20/20, and each line is 5 points.
- ETDRS letter score = 85 − 50 × logMAR (Beck 2003; Gregori 2010). 85 letters is 20/20; each letter is 0.02 logMAR.

For study and teaching, not medical advice. Check with a qualified professional.

For hearing, use the [[audiogram|audiogram plotter]]; to compare two examiners' readings, [[reliability-analysis|reliability and agreement]].

## How to use it

1. Type or paste values, one per line. A name before the value (Right eye, Visit 2) is kept. You can also open a CSV, TSV, text or Excel file.
2. Fractions are read as Snellen. **Numbers without a slash are** read as decimal by default; switch it to logMAR, MAR, VAS or letters if your column is in that notation. A word in front of a value (logMAR 0.3, VAS 85, letters 70) always wins.
3. **Letters per line** sets the step for "+2" or "−1" after a Snellen fraction. With 5 letters per line each letter is 0.02 logMAR, so 20/40+2 is logMAR 0.26.
4. The results table lists every value in every notation and the nearest whole chart line. The **Chart lines** table highlights the lines your values fall on.
5. Download the table as CSV, or the whole report as an image, PDF or Word file.

## Worked example

The example's first value is Right eye, 20/40. MAR = 40 ÷ 20 = 2 minutes of arc, so the page shows **Right eye: 20/40 = 6/12 = decimal 0.50 = logMAR 0.30**, with VAS 84.9 and 69.9 ETDRS letters (rounded to 85 and 70 in the table). Left eye, 6/9+2 is logMAR log₁₀(9/6) − 2 × 0.02 = 0.14, which is 20/27.4 and 78 letters; its nearest chart line is 20/25 −2.

With all six values, the page also gives their **average in logMAR**. Averaging Snellen denominators gives the wrong answer: Holladay's example is that the average of 20/20 and 20/200 is about 20/63 (logMAR 0.5), not 20/110.

## Tips

- Average, compare and run statistics on logMAR or letter scores, never on Snellen denominators or decimal acuity.
- A change of 0.1 logMAR is one line, or 5 letters, or 5 VAS points.
- The chart labels (20/63, 6/9.5, 0.63) are the rounded values printed on charts; the converter itself uses the exact formulas, so 20/63 converts to logMAR 0.50 and logMAR 0.5 to 20/63.2.
- Off-chart measures such as counting fingers or hand movements have no formula and are not converted.

## FAQ

**Is 6/6 the same as 20/20?** Yes. Both mean MAR = 1 minute of arc; 6 metres is about 20 feet.

**Why is a smaller logMAR better?** logMAR measures the angle of the smallest detail you can see. A smaller angle means finer detail, so better acuity. Negative values (20/16 is −0.10) are better than 20/20.

**Does it measure my eyesight?** No. It only converts numbers you already have. An eye test must be done by a qualified professional with a proper chart, lighting and distance.

**Is anything sent anywhere?** No. Everything is worked out in your browser.
