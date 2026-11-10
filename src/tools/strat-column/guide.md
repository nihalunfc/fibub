---
name: Stratigraphic column maker
num: 876
shelf: science
code: T612
section: sedimentology-and-stratigraphy
title: "Stratigraphic column maker: draw a graphic log from a bed table, with lithology patterns and grain-size profile (free, SVG/PDF)"
summary: "Type or open a bed table (thickness, lithology, grain size, contact, notes) and get a scaled stratigraphic column with fill patterns, a grain-size profile, contacts, notes, a scale bar and a legend, as SVG, PNG, PDF or CSV."
status: live
ads: true
order: 876
icon: ruler
works: offline
updated: 2026-11-09
related: [grain-size-stats, apparent-dip, age-depth-model, range-chart-plotter, cross-section-profile, proxy-stacker]
sources:
  - "Lithology patterns: fibub's own simple designs, in the spirit of common geological map and log conventions (such as the US FGDC digital cartographic standard) but not copied from them. Grain-size classes: Udden-Wentworth."
  - "Example section: made up by fibub."
flow:
  - { icon: table, label: "Bed table" }
  - { icon: ruler, label: "Scale" }
  - { icon: pencil, label: "Column" }
  - { icon: download, label: "SVG, PDF" }
---

## What it does

A stratigraphic column (a graphic log) shows a rock succession as a stack of beds: the height of each bed is its thickness at a fixed vertical scale, the fill pattern shows the rock type and the width shows the grain size, so coarsening and fining trends stand out at a glance. This page draws one from a plain table:

- **thickness** of each bed (m, cm or ft);
- **lithology**, such as sandstone, conglomerate, mudstone, shale, limestone, dolostone, marl, coal, tuff or evaporite (18 patterns, open "Lithologies with a pattern" for the full list);
- **grain size**, which sets the column's width: cl, si, vf, f, m, c, vc, gr, pb, cb, bd, or the words. **c-f** draws a bed that fines up from coarse at its base to fine at its top, and **f-c** one that coarsens up;
- **contact** at the bed's base: sharp (solid line), erosive (wavy line) or gradational (dashed line);
- **notes**: fossils, structures, sample numbers. They go to the right of the column with leader lines and are moved apart so they never overlap.

The heights are added up from the base, a black-and-white scale bar runs up the left side, a grain-size scale sits under the column, and a legend lists the patterns used.

Get the grain-size numbers for each bed from [[grain-size-stats]], and turn depths into ages with the [[age-depth-model]].

## How to use it

1. Paste your bed table or open a CSV or Excel file. A header row with the names thickness, lithology, grain, contact and notes lets the columns come in any order.
2. Say whether the beds are listed **oldest first** (the way a section is logged, from the base up) or **youngest first**.
3. Pick the **vertical scale**. "Fit about 22 cm" picks the largest round scale that keeps the column under 22 cm tall; 1:100 means 1 m of rock is 1 cm on paper.
4. Add a title, switch on colour fills if you like, and download the column as **SVG** (vector, true scale), **PNG** or **PDF** (300 dpi at true size), or the beds with their base and top heights as **CSV**.

## Worked example

The example is a made-up 26.6 m section of 12 beds, listed from the base up: a 1.5 m pebble conglomerate with an erosive base, a 3 m sandstone fining from coarse to medium, siltstone, a 0.4 m coal, mudstone, a fining-up sandstone, a thin tuff, shale passing gradationally into marl, a 5 m limestone, a metre of no exposure and dolostone at the top. At "Fit about 22 cm" the page picks **1:200** (5 mm per metre), so the column is 133 mm tall with a tick every 2 m. The CSV gives each bed's base and top: the coal runs from 5.7 to 6.1 m and the limestone from 18.4 to 23.4 m.

## Tips

- Log from the base up, as you walk the section, and keep that order in the table.
- Put the sample number in the notes so the column doubles as a sample map.
- For carbonates, use the grain size of the grains (f for a fine grainstone) or a single width for all of them; the profile is about texture, not mineralogy.
- Unknown rock names are drawn as "covered" and listed in a warning, so nothing is silently lost.

## FAQ

**Are these the official FGDC patterns?** No. They are fibub's own simple patterns that follow the usual ideas (dots for sand, circles for pebbles, bricks for limestone, black for coal) so that geologists can read them, but they are drawn from scratch.

**Can I edit the drawing?** Download the SVG and open it in Inkscape or Illustrator: every bed, line and label is a separate shape.

**Is my data sent anywhere?** No. The column is drawn in your browser and nothing leaves your device.
