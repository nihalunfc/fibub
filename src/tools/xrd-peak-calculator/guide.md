---
name: XRD peak calculator
num: 842
shelf: science
code: T578
section: crystallography
title: "XRD calculator: Bragg's law, Scherrer crystallite size, Williamson-Hall plot and cubic peak indexing"
summary: "Turn powder X-ray diffraction peaks into d-spacings, crystallite sizes (Scherrer, with the instrument's width taken away), size and microstrain from a Williamson-Hall plot, and a cubic lattice (simple, body-centred, face-centred or diamond) with its lattice parameter. Type peaks or open a 2θ scan and let the page find and fit them."
status: live
ads: true
order: 842
icon: chart
works: offline
updated: 2026-11-09
related: [point-group-finder, crystal-field-calculator, plot-maker, cif-viewer, miller-index-calculator, electron-diffraction-indexer, lattice-fft]
sources:
  - "Bragg's law, the Scherrer equation, the Williamson-Hall method and the cubic selection rules are standard textbook physics; the code is written by fibub and checked in the tests against NumPy and SciPy (find_peaks, curve_fit, polyfit)."
  - "Anode wavelengths are rounded general constants (for example Cu Kα1 1.5406 Å) and can be edited."
  - "The example scan is made up by the page: a face-centred cubic metal with a = 4.000 Å, 25 nm crystallites and 0.2 % strain, with made-up intensities and noise."
flow:
  - { icon: chart, label: "Scan" }
  - { icon: target, label: "Peaks" }
  - { icon: ruler, label: "d and size" }
  - { icon: table, label: "Lattice" }
---

## What it does

A powder X-ray diffraction pattern is a list of peaks: each sits at an angle 2θ set by the spacing d between planes of atoms, and each has a width that grows as the crystallites get smaller or more strained. This page does the everyday sums on those peaks in one place:

- **Bragg's law.** nλ = 2d sin θ turns every 2θ into a d-spacing, for Cu, Co, Fe, Cr, Mo or Ag Kα lines or any wavelength you type. A small box converts one 2θ to d and back.
- **Scherrer size.** D = Kλ / (β cos θ), where β is the peak's own breadth in radians after the instrument's width is taken away: in quadrature for Gaussian peaks (β² = B² − b²) or straight for Lorentzian ones (β = B − b).
- **Williamson-Hall plot.** With three or more widths, β cos θ is plotted against 4 sin θ. A straight line through the points has intercept Kλ/D (size) and slope ε (microstrain), so size and strain are separated. Standard errors and R² are shown.
- **Cubic indexing.** The ratios of 1/d² (or sin²θ) between lines are whole-number ratios of h² + k² + l². The page tries simple cubic, body-centred, face-centred and diamond cubic, assigns hkl to every line, works out the lattice parameter a from all indexed lines, and lists allowed lines that should be there but are not.
- **Peak picking.** Open a 2θ/intensity scan (XY, CSV, TXT or Excel). The page takes away a smooth background, finds the peaks, and fits each with a Gaussian or Lorentzian plus a straight line to get its position and FWHM.

Load the structure from a file in the [[cif-viewer|CIF viewer]], and check the planes behind each peak with the [[miller-index-calculator|Miller index calculator]].

## How to use it

1. **Wavelength.** Pick the X-ray source or type λ. Set K (0.9 is usual) and your instrument's width: the FWHM a large-grain, strain-free standard such as a line-profile standard gives on the same machine and settings.
2. **Scan or peaks.** Open a scan and press *Find peaks*, or type peaks straight into the list: 2θ, then FWHM if you have it, then intensity. Delete rows you do not want, such as Kα2 shoulders or impurity peaks.
3. **Read the results.** The table gives d, the sample breadth, the Scherrer size, hkl and a for each peak. The cubic table ranks the four lattices. The Williamson-Hall plot shows how well size and strain explain the widths.
4. **Download** the peak table as CSV, or a PNG, PDF or Word report.

## Worked example

Press *Use the example scan*. It is a made-up Cu Kα1 pattern (λ = 1.5406 Å) of a face-centred cubic metal with a = 4.000 Å, 25 nm crystallites and 0.2 % strain, measured on an instrument with a 0.06° width.

*Find peaks* returns six peaks, at 2θ = 38.969, 45.306, 66.007, 79.387, 83.694 and 100.756°. Their ratios of 1/d² are 3 : 4 : 8 : 11 : 12 : 16, so the page reports **face-centred cubic, a = 4.0000 Å**, with hkl 111, 200, 220, 311, 222 and 400 and no allowed lines missing. Simple cubic indexes the same lines only by leaving out 100, 110, 210 and more; diamond cubic cannot index 200 or 222.

The Scherrer sizes fall from 16.8 nm at 111 to 11.4 nm at 400. That steady fall is the sign of strain: Scherrer puts all the broadening down to size. The Williamson-Hall fit separates the two and gives **26.1 nm and 0.21 % strain** (R² = 0.986), close to the 25 nm and 0.2 % the scan was made with; the weak 400 peak carries the most noise.

## Tips

- Widths need care. Use a Kα1-only source or strip Kα2 first, and measure the instrument width on a standard under the same slits.
- A Scherrer size above about 100 to 200 nm is not reliable: the sample breadth becomes too small next to the instrument's.
- Indexing assumes a cubic phase. If no lattice indexes every line, the sample may be another crystal system, a mixture, or the list may hold Kα2 or Kβ peaks. Use the Miller index calculator for other systems.
- Simple cubic and body-centred cubic give identical patterns up to the sixth line. A seventh line, at seven times the first 1/d², settles it.

## FAQ

**Which width should I use: FWHM or integral breadth?** The page uses whatever width you give. With FWHM, K is about 0.9; with integral breadth (area ÷ height), use K close to 1.

**Why is the Williamson-Hall size different from the Scherrer size?** Scherrer assumes there is no strain, so strain broadening makes the crystallites look smaller. Williamson-Hall separates the two, but it assumes the size and strain broadenings simply add.

**Is my scan uploaded?** No. The file is read and fitted on this page, and nothing is sent anywhere.
