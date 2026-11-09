---
name: Publication plot maker
num: 27
shelf: science
section: figures-and-data-presentation
title: "Publication plot maker: journal-ready graphs as SVG, PDF or 300 dpi PNG (free)"
summary: "Paste columns or open a CSV or Excel file and get a clean scientific figure with error bars, sized for a journal column. Download vector SVG or PDF, or PNG at 300 or 600 dpi. Your data stays in your browser."
status: live
ads: true
order: 20
icon: chart
works: offline
updated: 2026-11-08
related: [graph-digitizer, calibration-curve, dose-response, uncertainty-calculator]
flow:
  - { icon: table, label: "Your data" }
  - { icon: chart, label: "Style" }
  - { icon: download, label: "SVG/PDF/PNG" }
---

## What it does

Journals ask for figures at a set width, with readable text, error bars, and no fuzzy screenshots. Spreadsheet charts rarely meet that without a lot of fiddling. This tool takes columns pasted from Excel, Google Sheets or a plate reader export and draws a plain, print-ready graph: black axes, outward ticks, colour-blind safe colours, a different marker for every series, and text at the size you set. You download it as vector **SVG** or **PDF**, or as **PNG** at 300 or 600 dpi. Everything happens in your browser.

To get numbers from a figure in a paper, use the [[graph-digitizer|graph digitiser]]; for error bars from a formula, the [[uncertainty-calculator]].

## How to use it

1. **Paste your data** with a header row, or press **Open a file** (or drop a file on the box) to load a CSV, TSV, TXT or Excel (.xlsx) file. Files can be up to 10 MB, 20 columns and 50,000 rows; a wider or longer file is cut to the first 20 columns and 50,000 rows, and the page says so. For an Excel file with several sheets, the first sheet with data is used. The first column is x. Every other column becomes a series.
2. A column headed **SD**, **SE**, **SEM** or **error** is used as error bars (±) for the column to its left. Each column has a menu, so you can change its role or leave it out.
3. Type the **axis labels**, including units, for example "Time (h)".
4. Choose the **width**. A single journal column is about 85 mm and a full page width about 178 mm (Elsevier, Springer Nature, ACS and the APS all use widths close to these). Check your journal's author guide.
5. Set the **text size**. Most journals want 6 to 8 pt at the printed size, so 8 pt is the default.
6. Download. The preview above the buttons is the actual figure at its printed proportions.

## What each setting does

- **Show as:** points with lines between them, points only (for measurements), or lines only (for dense or model data).
- **Colours:** Okabe and Ito's colour-blind safe palette, or black and greys for print. Markers also change shape from series to series, so the figure still works in black and white.
- **Height:** the shape of the figure: 4 : 3, square, wide or tall.
- **Legend:** "Automatic" puts it in the emptiest corner of the plot, or below it when there are more than four series. It is left out when there is only one series.
- **Log axes** show only values above zero. Error bars that would go below zero are cut at the axis.
- **Axis limits** fix the start or end of an axis. Leave them blank to fit the data with round numbers.

## Which file to use

**SVG** keeps every character and opens in Inkscape, Illustrator and PowerPoint for editing. **PDF** is vector too and is what LaTeX prefers. It uses Helvetica, and symbols that font does not have (Greek letters, for example) are swapped and listed, so use the SVG for those. **PNG** is for Word and for journals that want images: the file records its dpi, so Word places it at the right size.

## Worked example

The sample shows bacterial growth, measured as optical density every two hours, for a control and a treated culture, each with its standard deviation. With the defaults, you get an 85 × 64 mm figure with 8 pt text. Each culture has its own colour and marker, the error bars are capped, and the legend sits top left, away from the curves. The "PNG 300 dpi" button gives a 1004 × 753 pixel image.

## Frequently asked questions

**Is my data uploaded?** No. The figure is drawn in your browser and nothing is sent anywhere. The page keeps working offline.

**Can I plot a fitted curve?** Fit it in the [calibration curve](/science/calibration-curve/) or [dose-response](/science/dose-response/) tool, or paste the model's values as a column shown as a line.

**My data is only in a published figure.** Get the numbers back with the [graph digitizer](/science/graph-digitizer/) first.
