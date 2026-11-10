---
name: Protein assay
num: 181
shelf: science
section: proteomics-and-protein-science
title: "Protein assay"
summary: "Paste your BSA standards and sample readings from a Bradford, BCA or Lowry assay. Get a straight-line, quadratic or point-to-point standard curve, each sample's concentration with mean, SD and CV, warnings when a sample is outside the standards, and how many µL hold 20 µg for a gel."
status: live
ads: true
order: 4
icon: flask
works: offline
updated: 2026-11-09
related: [calibration-curve, protein-calculator, nucleic-acid-concentration, gel-densitometry, beer-lambert-calculator, solution-calculator]
sources:
  - "Blank subtraction, the least-squares straight line and quadratic, point-to-point reading, mean, SD and CV are standard methods, written by fibub and checked in the tests against NumPy (polyfit, roots, interp, std) and against curves worked by hand."
  - "The example standards and sample readings are made up for this page. They are not taken from any kit insert, paper or database."
flow:
  - { icon: table, label: "Standards" }
  - { icon: curve, label: "Curve" }
  - { icon: flask, label: "Samples" }
  - { icon: calculator, label: "Volumes" }
---

## What it does

A protein assay turns protein into colour. In a Bradford assay Coomassie dye shifts to blue when it binds protein (read near 595 nm); in a BCA assay protein reduces copper, which then makes a purple colour with BCA (read near 562 nm). You measure a series of standards of known concentration, usually BSA, draw a standard curve and read your samples off it. This page does that in one go:

- **Blank subtraction.** The mean of the 0 standard (or a blank you type) is taken away from every reading.
- **Three curves.** *Straight line* is fine for a narrow range or a BCA assay. *Quadratic* follows the bend at the top of a Bradford curve. *Point to point* joins the standards' means with straight segments and assumes no shape at all.
- **Replicates.** Each standard and sample can have any number of readings. You get the mean, the SD and the CV, and samples whose CV is above your limit are flagged.
- **Dilutions.** Each sample has its own dilution factor, so the page reports both the concentration in the assay and in the original sample.
- **Range checks.** Samples above the top standard, below the lowest standard, past the top of a quadratic, or at the blank are flagged in the table.
- **Loading volumes.** Type an amount (20 µg for an SDS-PAGE lane, say) and an optional final volume, and the page gives the µL of each sample and of buffer to add.

For a straight-line fit with LOD and LOQ, use the [[calibration-curve|calibration curve]] tool; for a reading at 280 nm instead, [[nucleic-acid-concentration|DNA, RNA and protein concentration]].

## How to use it

1. **Standards.** One line per standard: the concentration, then each absorbance. Paste straight from a plate reader export or spreadsheet. A header line is fine.
2. **Settings.** Choose the concentration unit, the curve and how the blank is handled.
3. **Samples.** One line per sample: a name, the dilution factor (10 or 1:10 for one part sample in ten), then each absorbance.
4. **Read the results.** Check the curve picture and the standards read back table, then the samples table. Download the CSV or a PNG, PDF or Word report.

## Worked example

The example is a made-up Bradford assay: eight BSA standards from 0 to 2000 µg/mL in triplicate, and four samples. The blank (the 0 standard) is **0.4517**.

With the **quadratic** curve, R² is **0.99956** and every standard reads back within 2 % of its value. The cell lysate, diluted 10-fold, has a mean absorbance of 0.8677, a net absorbance of 0.4160, reads **590** µg/mL in the assay and so **5900 µg/mL** in the lysate (SD 104 from its three readings). To load 20 µg you need **3.39 µL**, topped up with **21.6 µL** of buffer to 25 µL.

The other samples show the flags: the tissue extract has one stray reading (CV 11.7 %, above the 10 % limit), the purified protein reads 2751 µg/mL, above the top standard (dilute it and measure again), and the wash fraction reads 31.99 µg/mL, below the lowest standard of 100.

Switch to the **straight line** and R² drops to 0.98264; the 100 µg/mL standard reads back as only 35.04 µg/mL (35.0 %) and the lysate comes out at 6666 µg/mL, 13 % too high. That is why a straight line through a whole Bradford range is a poor idea. **Point to point** gives 5868 µg/mL for the lysate.

## Tips

- Make the standards in the same buffer as your samples; detergents and reducing agents change the colour.
- Dilute samples so they land in the middle of the curve, where it is steepest and most precise.
- Run at least duplicates, better triplicates, of standards and samples.
- Treat the result as relative to BSA. Different proteins give different amounts of colour per µg.

## FAQ

**Which curve should I use?** For a Bradford assay over a wide range, the quadratic or point to point. For BCA or a narrow range, the straight line is often enough. Look at the standards read back table: a good curve reads every standard back within about 10 %.

**Why is the curve fitted to every reading and not the means?** So that standards with more replicates count more and the scatter is real. With the same number of replicates at each level the line is identical.

**Why is the zero standard not flagged as "below the lowest standard"?** Ranges are judged against the lowest standard above zero, because at the bottom of a curve readings are least reliable.

**Are my readings sent anywhere?** No. Everything is worked out on this page and nothing is stored.
