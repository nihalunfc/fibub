---
name: Gel and western blot densitometry
num: 180
shelf: science
section: proteomics-and-protein-science
title: "Gel and western blot densitometry: band volumes, background and loading-control normalisation"
summary: "Open a photo of an SDS-PAGE gel, a DNA gel or a western blot and measure every band: lane profiles, a straight-line or rolling background, band volumes, amounts relative to a reference lane and divided by a loading control, with a warning for saturated bands. The photo stays in your browser."
status: live
ads: false
order: 3
icon: image
works: offline
updated: 2026-11-09
related: [gel-band-sizer, protein-calculator, peptide-mass-calculator, nucleic-acid-concentration]
sources:
  - "Lane profiles, the straight-line and rolling-window backgrounds, band finding and volumes are written by fibub and checked in the tests against NumPy on a random image."
  - "The example blot is drawn by the page from made-up band amounts (target 1, 2, 4, 6, 3 and 1.5; loading control near 1), and the tests check that the page gets those amounts back."
  - "A photo you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: image, label: "Photo" }
  - { icon: sliders, label: "Lanes" }
  - { icon: chart, label: "Profiles" }
  - { icon: table, label: "Amounts" }
---

## What it does

Densitometry turns the darkness of a band into a number, so you can say that a protein is three times more abundant in one lane than another. This page does what a gel analysis program does, inside your browser:

- **Lanes.** It splits the lane area into equal lanes and reads the middle part of each (60 % of the lane by default), so the gaps between lanes and smiling edges are left out.
- **Profiles.** For every lane it takes the average signal across the lane, row by row down the gel. Dark bands on a light gel or film and light bands on a dark fluorescent scan both work.
- **Background.** *Straight line under each band* draws a line from the start of the band to its end and counts only what sits above it, the classic method that copes with a background that gets darker down the gel. *Rolling window* rolls a flat window along the underside of the whole profile and suits an even background. *None* counts the raw signal.
- **Bands.** Band rows are found from the average profile of all lanes. You can rename them, move their top and bottom, or type your own.
- **Amounts.** Each band's volume (signal added up over the band's rows and the lane's width) is shown as a percentage of a reference lane. Pick a loading control, such as actin, tubulin or GAPDH on a western blot, and each lane's band is divided by that lane's control first.
- **Saturation check.** A band whose pixels hit the top of the photo's range reads too low. The page warns you when more than 1 % of a band's pixels are saturated.

Size the bands with the [[gel-band-sizer|gel band size estimator]], and check the protein's expected mass with the [[protein-calculator|protein parameter calculator]].

## How to use it

1. **Photo.** Open the original image from the scanner or imager. A phone photo of a gel works for rough numbers, but a flat, evenly lit scan is better. Do not adjust contrast or brightness first.
2. **Lanes.** Tap *Set the lane area*, then tap two opposite corners around your lanes. Type the number of lanes. Blue boxes show what is read.
3. **Profiles.** Check that the green band rows sit around each band. Change *Find bands above* or type the rows by hand if needed.
4. **Amounts.** Pick the reference lane and, for a blot, the loading control. Read the bar chart and table, and download the CSVs or a PNG, PDF or Word report.

## Worked example

The example is a made-up blot with six lanes (untreated, then 1 to 24 hours of a treatment). The target band was drawn with amounts 1, 2, 4, 6, 3 and 1.5, and the loading control with 1, 1.1, 0.9, 1, 1.05 and 0.95, on a background that darkens down the film, with a little noise.

With the straight-line background, the target comes back as **100, 200, 400, 601, 302 and 150 %** of the untreated lane, within 1 % of the truth. Divided by the loading control, the 2 h lane is about 444 %, because that lane was loaded with a little less protein. Switch to the rolling window and the ratios come out up to 10 % high, because the background slopes under the bands and the faint untreated band loses the most: a good reason to look at the profiles before trusting a number.

## Tips

- Keep every band in the linear range of the stain or film. Run a dilution series of one sample once to check that twice the protein gives twice the volume.
- Compare bands only within one gel or blot. Different exposures are not on the same scale.
- Choose the lane width so that the boxes stay inside the bands; reading into the gaps adds background.
- Report the loading-control-normalised values for blots, with the number of repeats.

## FAQ

**Are the volumes in real units?** No. Volume is the stain signal (0 to 1 for each pixel) added up over pixels. Only ratios between bands on the same image mean anything, which is why the page shows percentages.

**Why do my numbers differ from another program?** Programs differ in how they draw the background and where a band ends. Use one method for a whole study.

**Can I measure a DNA gel?** Yes. Pick *light on a dark background* for an ethidium or SYBR photo, unless it has been inverted. To size bands instead, use the gel band size estimator.
