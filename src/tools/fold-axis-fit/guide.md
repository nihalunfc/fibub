---
name: Fold axis
num: 207
shelf: science
code: T207
section: structural-geology
title: "Fold axis"
summary: "Paste bedding or foliation as strike and dip or dip direction and dip. Get the fold axis (plunge and trend) from the eigenvectors of the poles, the best-fit π-girdle, Woodcock and Vollmer shape numbers, how cylindrical the fold is, the interlimb angle and axial plane from two labelled limbs, and an equal-area net with Kamb density contours."
status: live
ads: true
order: 207
icon: compass
works: offline
updated: 2026-11-09
related: [stereonet, apparent-dip, paleostress-inversion, phone-clinometer, cross-section-profile]
sources:
  - "Methods: orientation tensor eigenvectors (Scheidegger 1965; Woodcock 1977 shape K and strength C), point, girdle and random indices (Vollmer 1990), Kamb (1959) counting circle, interlimb angle classes after Fleuty (1964). The methods are described in words and formulas; no data were copied."
  - "Example: 32 made-up readings of a fold plunging about 18° towards 062, made by fibub with a few degrees of random scatter."
  - "The maths is checked in the tests against an independent NumPy implementation (numpy.linalg.eigh) and folds worked by hand."
flow:
  - { icon: table, label: "Planes" }
  - { icon: sigma, label: "Eigenvectors" }
  - { icon: compass, label: "Net" }
  - { icon: download, label: "Report" }
---

## What it does

When rock layers are folded, the poles (the lines at right angles) to the bedding on both limbs and around the hinge fall on one great circle of a stereonet, called the **π-girdle**, as long as the fold is **cylindrical** (every part of it can be swept out by moving one straight line, the fold axis, parallel to itself). The pole of that girdle is the **fold axis**. This page finds it by the standard eigenvector method: it builds the **orientation tensor** of the poles and splits it into three eigenvalues and eigenvectors. The smallest eigenvector, **e3**, is the fold axis, also called the π-axis (many field guides call it β). It also reports how girdle-like and how cylindrical the data are, and, when you label the two limbs, the **interlimb angle** and the **axial plane**. Everything is drawn on a lower-hemisphere equal-area net with optional **Kamb density contours**.

Plot single planes and lines or get a mean orientation with the [[stereonet]], work out apparent dips and true thickness with [[apparent-dip]], and take readings with your phone using the [[phone-clinometer]].

## How to use it

1. Choose how your planes are written: **strike and dip with the right-hand rule** (face along the strike and the plane dips to your right, so 030 40 dips south-east) or **dip direction and dip** (120 40 dips 40° towards 120).
2. Paste one plane per line, or open a CSV or Excel file. Commas, spaces, tabs and slashes all work, and a header line is skipped.
3. To get the interlimb angle and axial plane, add a **third column naming the limb**, such as A and B. Readings without a label (from the hinge, say) still count towards the fold axis. Compass letters such as SE are refused, because quadrant notation is not read: convert to the right-hand rule first.
4. If one limb is **overturned** (turned past vertical, so its beds face down), say so under Options. The angle between two planes has two answers that add up to 180°, and this picks the right one.
5. Show or hide the poles, the girdle, the density contours, the limb planes and the axial plane. Download the poles or the results as CSV, or the whole report as an image, PDF or Word file.

## What the numbers mean

- **Eigenvalues λ1 ≥ λ2 ≥ λ3** add up to 1. Poles in one tight cluster give λ1 near 1; poles spread along a girdle give a small λ3 and similar λ1 and λ2.
- **Woodcock shape K = ln(λ1/λ2) / ln(λ2/λ3)**: below 1 the poles form a girdle, above 1 a cluster. **Strength C = ln(λ1/λ3)**: the larger it is, the better organised the data.
- **Vollmer P, G and R** split the data into point, girdle and random shares that add up to 1.
- **Cylindricity** is the root-mean-square angle of the poles off the best-fit girdle. As a rule of thumb used here, under 5° is very nearly cylindrical, under 10° close to cylindrical, and above 15° you should split the area into smaller domains and fit each one.
- **Kamb contours** count poles in a small circle whose size is chosen so that a uniform spread would give 3σ; lines are drawn at 2σ, 4σ, 6σ and up.
- **Interlimb angle** is measured in the profile plane, at right angles to the fold axis, between the mean planes of the two limbs, and named with Fleuty's classes: gentle (120° to 180°), open (70° to 120°), close (30° to 70°), tight (10° to 30°) and isoclinal (under 10°).
- **Axial plane** holds the fold axis and bisects the two limbs.

## Worked example

The example holds 32 made-up readings from a fold: 14 on limb A, 13 on limb B and five from the hinge. The page gives a **fold axis of 18° → 062** and a best-fit girdle of 152/72. The eigenvalues are 0.547, 0.451 and 0.002, so K = 0.03 (a clear girdle) and C = 5.74. The poles sit an RMS **2.4°** off the girdle, the largest 7.9°, so the fold is very nearly cylindrical. Limb A's mean plane is 052/60 and limb B's is 265/38. With both limbs the right way up the **interlimb angle is 86.6°**, an **open** fold, and the **axial plane is 246/78**. The two limb planes meet in a line 17° → 062, 0.8° from the π-axis, a good sign that the fit holds together. Switch to "One overturned" and the interlimb angle becomes 93.4°, its supplement.

## Tips

- Take readings all around the fold, both limbs and the hinge. Readings from one limb only fix a plane, not an axis; the page warns when the poles do not spread along a great circle.
- A fold axis from the girdle and the intersection of the limb planes should agree within a few degrees. A large gap points to a non-cylindrical fold, mixed-up limb labels or a typing slip.
- Sort the pole table by the off-girdle column in a spreadsheet to find readings that do not fit.

## Frequently asked questions

**Why the smallest eigenvector?** The poles of a cylindrical fold lie in one plane, so they spread least in the direction at right angles to it. That direction, e3, is the pole of the girdle and parallel to the fold axis.

**Is this the β-diagram method?** No. The β method intersects every pair of planes and looks for the cluster of intersections; the eigenvector π-method used here is steadier with many readings and gives the same axis for a cylindrical fold.

**Is my data uploaded?** No. Everything runs in your browser and nothing leaves your device; the page works offline once loaded.
