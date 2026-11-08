---
name: TLC Rf calculator
num: 91
shelf: science
section: organic-chemistry
title: "TLC Rf calculator: tap spots on a plate photo for Rf values and flash column volumes"
summary: "Open a photo of a TLC plate, tap the baseline, solvent front and spots, and get each spot's Rf, its lane, the column volumes it needs on a flash column and how well neighbouring spots separate. Or type measured distances."
status: live
ads: false
order: 6
icon: ruler
works: offline
updated: 2026-11-08
related: [chromatography-calculator, reaction-equivalents, molar-mass-calculator, graph-digitizer]
flow:
  - { icon: camera, label: "Photo" }
  - { icon: pointer, label: "Tap spots" }
  - { icon: ruler, label: "Rf values" }
  - { icon: check, label: "Column" }
---

## What it does

Thin-layer chromatography (TLC) is the quickest check in an organic lab: has the starting material gone, is there one product or three, which eluent will work for the column? Each spot is described by its retardation factor, Rf = distance moved by the spot ÷ distance moved by the solvent, both from the baseline.

- **From a photo.** Open a picture of your plate (taken under a UV lamp or after staining), tap the baseline, the solvent front and the centre of each spot. The tool marks them on the photo, groups the spots into lanes, and lists each Rf. The photo is never uploaded; it stays on your device.
- **From a ruler.** Type the distance to the solvent front and to each spot in millimetres.
- **Column volumes.** On a flash column packed with the same silica and run in the same eluent, a compound comes off after about 1/Rf column volumes (CV). Spots with Rf 0.25 to 0.35 are the usual aim.
- **Separation.** For the closest pair of spots it gives ΔRf and ΔCV. A ΔCV of 1 or more usually separates on a flash column; below that, change the eluent.
- **Same compound?** Spots within 0.02 of each other in different lanes are pointed out, which is what a co-spot lane is for.
- **Advice per spot**: barely moved (more polar eluent), near the front (less polar eluent), or good for a column.

## How to use it

1. Press **Example plate** to see how it works, or open your own photo. Hold the plate upright in the picture, baseline at the bottom, so distances are measured straight up the plate.
2. **Baseline** is selected first: tap the pencil line where you spotted. Then tap the solvent front. The tool moves on to **Spots**.
3. Tap the centre of each spot. Use **Undo**, or **Remove** in the table, to fix a mistake. You can switch back to Baseline or Front to move a line.
4. Download the marked photo with the table as a PNG, PDF or Word file for your notebook.

## Worked example

The example plate has three lanes: starting material (SM), a co-spot, and the reaction mixture, with the front 480 pixels above the baseline. The starting material sits at Rf 0.36, the product at 0.58 and a by-product at 0.12. The co-spot lane shows the product spot is not starting material. Starting material and product need 2.8 and 1.7 column volumes, a ΔCV of 1.05, so a flash column in this eluent should separate them.

With a ruler: the front 52 mm from the baseline and spots at 18 and 32 mm give Rf 0.35 and 0.62.

## Questions

**Should I measure to the top or the middle of a spot?** The centre (the darkest point). Streaky or very large spots mean the plate was overloaded.

**Why does my Rf change from day to day?** Rf depends on the eluent mixture, plate type, chamber saturation, temperature and humidity. Compare with a reference spot on the same plate.

**Is my photo uploaded?** No. It is opened in your browser and never leaves your device.
