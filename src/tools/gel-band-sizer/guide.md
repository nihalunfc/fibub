---
name: Gel band sizer
num: 169
shelf: science
code: T169
section: molecular-biology
title: "Gel band sizer"
summary: "Type your ladder sizes and how far each band ran, or tap them on a gel photo that stays in your browser, then read the size of every unknown band with a fit line, R², a typical error and a warning when a band sits outside the ladder."
status: live
ads: true
order: 17
icon: ruler
works: offline
updated: 2026-11-09
related: [restriction-digest, primer-checker, nucleic-acid-concentration, ligation-calculator]
sources:
  - "Log-linear (log10 size against distance), cubic and point-to-point fits written by fibub and checked in the tests against NumPy polyfit and interp."
  - "The example ladder sizes, distances and unknown bands are made up. They are not taken from any supplier's ladder chart."
  - "A gel photo you open is drawn on the page only. It is never uploaded or stored."
flow:
  - { icon: ruler, label: "Ladder" }
  - { icon: pointer, label: "Bands" }
  - { icon: curve, label: "Fit" }
  - { icon: table, label: "Sizes" }
---

## What it does

DNA runs through an agarose gel at a speed that falls with the logarithm of its length, so over the useful part of a gel, log10(size) against distance is close to a straight line. This page fits that line to your ladder and reads off the size of every unknown band:

- **Three fits.** *Log-linear* (a straight line through log10 size), the usual choice. *Cubic* bends to follow the curve that appears at the top and bottom of a gel, but needs at least 5 ladder bands. *Point-to-point* joins neighbouring ladder bands and is good when the ladder covers the band closely.
- **Error you can trust.** The fit shows its equation, R² and a *typical error* in per cent, worked out from how far the ladder bands themselves sit from the line. Each band also gets a likely range.
- **Outside the ladder.** A band that ran further or shorter than any ladder band is flagged, because the size there is a guess beyond your data.
- **Photo mode.** Open a gel picture, tap the well, then the ladder bands from the top down (they take the sizes in the ladder box, largest first), then your bands. The distances (in pixels from the well) are typed into the boxes for you. The photo never leaves your device.

To predict the bands before you run the gel, use the [[restriction-digest]]; to check the DNA concentration loaded, [[nucleic-acid-concentration|DNA, RNA and protein concentration]].

## How to use it

1. **Ladder.** One line per ladder band: size in bp, a comma, and how far it ran (mm, cm or pixels, as long as you use the same unit throughout). Paste from a spreadsheet or open a CSV or Excel file (2 columns, up to 200 rows).
2. **Bands.** One line per unknown band: a name, a comma and its distance. A distance alone also works.
3. **Fit.** Pick log-linear, cubic or point-to-point.
4. **Sizes.** Read the sizes, look at the chart and download the report as an image, PDF or Word file.

Measure every distance from the bottom of the well to the middle of the band, on the same photo.

## Worked example

The example uses a made-up 12-band ladder from 10,000 to 100 bp, which ran from 6.2 to 52.7 mm, and three unknown bands at 20.5, 31.0 and 47.2 mm.

The log-linear fit is log10(size) = 4.19 − 0.0427 × distance with R² = 0.9966. The ladder bands sit on average 0.036 log units from the line, which is a typical error of about ± 8.7 %. The three bands come out at **2,073, 739 and 150 bp**. Switch to cubic and they become 1,968, 693 and 160 bp; point-to-point gives 2,020, 713 and 162 bp. The spread between fits (about 5 %) is a fair reminder that a gel gives sizes to within a few per cent, not to the base.

## Tips

- Use a ladder whose bands bracket your band, and run it on the same gel, ideally next to your sample.
- Supercoiled plasmid runs faster than linear DNA of the same length, so uncut plasmid sizes will look too small.
- Very large bands bunch together near the well. If your band is there, a lower agarose percentage separates them better.

## FAQ

**Which fit should I use?** Log-linear for most gels. If the ladder points clearly curve away from the line at either end, try cubic or point-to-point and compare.

**Why is the range empty for point-to-point?** That fit goes through every ladder band exactly, so there is no spread to estimate an error from.

**Can I use RNA or protein ladders?** The maths is the same for any marker that runs in log-linear fashion, including SDS-PAGE protein markers (use kDa instead of bp, the numbers are just labels).
