---
name: Dendrochronology cross-dating helper
num: 410
shelf: science
section: dating-methods
title: "Tree-ring cross-dating online: Baillie-Pilcher and Hollstein t-values and Gleichläufigkeit against a master chronology"
summary: "Paste or open a dated master (Tucson .rwl or a year table) and an undated ring-width series, and slide one along the other: t-values after Baillie-Pilcher and Hollstein standardisation, Gleichläufigkeit with its significance, a best-matches table and an overlay plot. Nothing is uploaded."
status: live
ads: true
order: 410
icon: chart
works: offline
updated: 2026-11-09
related: [radiocarbon-calibration, radiometric-age-calculator, trend-analyser, period-finder, harris-matrix-builder]
sources:
  - "Baillie, M. G. L. and Pilcher, J. R. (1973), A simple crossdating program for tree-ring research, Tree-Ring Bulletin 33. Hollstein, E. (1980), Mitteleuropäische Eichenchronologie. Gleichläufigkeit after Eckstein, D. and Bauch, J. (1969), with its standard error 1/(2√n). Tucson decadal format as used by the International Tree-Ring Data Bank."
  - "Checked against an independent pandas and scipy implementation (rolling means, scipy.stats.pearsonr, scipy.stats.norm) at all 221 positions of the example: r, both t-values, Gleichläufigkeit and its p agree to 1e-10."
  - "The example master and sample are made-up ring widths, generated for this tool."
flow:
  - { icon: table, label: "Master" }
  - { icon: pencil, label: "Sample" }
  - { icon: sliders, label: "Slide" }
  - { icon: target, label: "Best date" }
---

## What it does

Trees in one region lay down wide rings in good years and narrow rings in bad ones, so their ring-width patterns match. **Cross-dating** finds where the pattern of an undated piece of wood (a beam, a panel, a coffin plank) fits a dated **master chronology**. This tool slides your sample along the master one year at a time and scores every position with the three measures most used in Europe:

- **t-value after Baillie-Pilcher (1973).** Each width is divided by the mean of the five rings centred on it (×100), which removes slow age and stand trends, and the natural log is taken. The Pearson correlation r of the overlapping values becomes t = r √(n − 2) / √(1 − r²).
- **t-value after Hollstein (1980).** Each ring is turned into 100 × ln(this width / last year's width), the year-to-year change, before the same correlation and t.
- **Gleichläufigkeit (GLK).** The share of year-to-year steps in which both series go the same way (both up or both down). A step where one series does not change counts as half. Its standard error is 1 / (2√n), so z = (GLK − 0.5) × 2√n gives a one-sided p, shown with stars.

With several series in the master, each is standardised on its own and the indices are averaged year by year.

## How to use it

1. Paste or open the **master**: Tucson decadal format (`.rwl`, with 999 or −9999 end markers; widths in 0.01 or 0.001 mm) or a table with a year column and one column per series.
2. Paste the **sample**: its widths from the pith side outwards, one per line. You can also paste a `.rwl` or year table; with several series you pick which one to date, and if it already has dates the tool also shows the score at that dating.
3. Choose what ranks the matches and the **shortest overlap**. 30 rings is a common minimum; shorter overlaps give high t-values by chance.
4. Tap a row in the best-matches table to see the two series drawn together at that position.

## Worked example

The example master has four made-up oak series from 1601 to 1800, and the sample has 80 made-up rings. The tool tries 221 positions. The best is **last ring in 1770** (first ring 1691) with t (Baillie-Pilcher) 9.06, t (Hollstein) 7.89 and GLK 69.6 % (***). The next best Baillie-Pilcher t is 3.08, for a last ring in 1687, so the 1770 match stands out clearly, and the plot shows the narrow and wide rings lining up.

## Reading the result

A widely used rule of thumb looks for t-values of about 3.5 or more on both measures, a significant GLK, a clear gap to the next best position, and the same answer against other masters or other samples from the same building. A single high t-value alone is not proof: with hundreds of positions tried, a few high values happen by chance. Always look at the plot.

## FAQ

**Missing or zero rings?** A zero width is kept in place but left out of the indices that need it. Gaps (missing values) inside a sample are refused, because the ring count must be continuous.

**Can I download the scores?** Yes: *Every position (CSV)* lists r, both t-values with their n, GLK, z and p for every position; Image, PDF and Word give a report.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
