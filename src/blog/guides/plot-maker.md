---
title: "How to make a journal-ready scientific graph with error bars"
summary: "Turn spreadsheet columns into a print-ready figure: error bars, log axes, journal column widths, point sizes and dpi, saved as SVG, PDF or PNG, with a worked example."
tools: [plot-maker, graph-digitizer, dose-response, uncertainty-calculator]
updated: 2026-11-10
sources:
  - "Single-column (about 85 mm) and double-column (about 178 mm) figure widths and 6 to 8 pt text: typical figure guidance from major journal publishers; check your own journal's author guide."
  - "Okabe and Ito colour-blind safe palette: Okabe M, Ito K (2008), Color Universal Design."
  - "Unit conversions (25.4 mm per inch, 72 points per inch): standard definitions. The data in the worked example are made up."
---

The plot maker draws a clean scientific graph from columns of numbers and saves it at the exact width a journal asks for. It suits students writing a thesis, researchers sending a paper, and anyone whose spreadsheet chart looks blurry or oddly sized once it is printed. If your numbers are only in someone else's figure, pull them out first with the [[graph-digitizer]]. If you need to fit a curve to a dose series, do it in the [[dose-response]] tool, and work out the size of your error bars with the [[uncertainty-calculator]].

## What it is

A printed figure has a real size. Journals set it in millimetres, usually one column or the full page width, and they want text that is still readable after the figure is shrunk to fit. A spreadsheet chart is drawn for the screen, so when it is scaled down the labels can become tiny and the lines blurry.

The plot maker works the other way round. It starts from the printed size and the text size, then lays the figure out to match. Two unit facts sit behind it:

- **1 inch = 25.4 mm**, and type is measured in **points**, with **72 points per inch**. So an 85 mm column is 85 ÷ 25.4 × 72 ≈ 241 points wide.
- A raster image needs **pixels = mm ÷ 25.4 × dpi**, where dpi is dots per inch. More dpi means a sharper print and a bigger file.

**Vector** files (SVG and PDF) store lines and letters as shapes, so they stay sharp at any zoom. **Raster** files (PNG) store pixels, so their quality is fixed by the dpi you choose.

**Error bars** show the spread of a measurement, such as a standard deviation (SD) or standard error (SE), drawn as a line above and below each point.

## How to use it

1. Paste your columns with a header row into the **Data** box, or press **Open a file** (or drag a file onto the box) for a CSV, TSV, TXT or Excel file. The first column becomes the x axis and each other column a series.
2. Check the role menu under each column. A column headed SD, SE, SEM or error is taken as ± error bars for the column on its left. You can set any column to x values, a series, error bars or leave it out.
3. In **Look**, type the axis labels with units, and choose **Show as** (points and lines, points only, lines only) and **Colours** (colour-blind safe, or black and grey).
4. Set **Width**, **Height**, **Text size** and **Legend**. Tick **Log x axis**, **Log y axis** or **Grid lines** if you need them, and open **Axis limits** to fix where an axis starts or ends.
5. Check the preview, which shows the figure at its printed proportions, with the size in mm and the text size next to the heading.
6. Download **SVG**, **PDF**, **PNG 300 dpi** or **PNG 600 dpi**.

## A worked example

Suppose you tested a compound on two made-up cell lines and measured how many cells survived. Your sheet has five columns: concentration, line A, its SD, line B, its SD.

| Concentration (µM) | Line A (%) | SD | Line B (%) | SD |
|---|---|---|---|---|
| 0.1 | 98 | 3 | 99 | 2 |
| 1 | 91 | 4 | 96 | 3 |
| 10 | 62 | 5 | 84 | 4 |
| 100 | 18 | 3 | 47 | 5 |

Paste it in. The two SD columns are picked up as error bars for the column on their left, so you get two series.

The concentrations jump by ten each time, so tick **Log x axis**. The points then sit evenly across the axis instead of crowding at the left. Type "Cell viability (%)" as the y label.

You want it across the full page in a short, wide shape, so pick **Double column (178 mm)** and **Wide (16 : 9)**. The height is 178 × 0.5625 = 100.1 mm, shown as 178 × 100 mm. The width is 178 ÷ 25.4 × 72 ≈ 504.6 points, and the 8 pt text is set against that.

The journal wants a 600 dpi image, so press **PNG 600 dpi**:

- width: 178 ÷ 25.4 × 600 ≈ 4,205 pixels
- height: 100.125 ÷ 25.4 × 600 ≈ 2,365 pixels

For a Word draft, **PNG 300 dpi** gives 2,102 × 1,183 pixels. For final typesetting, send the **PDF** or **SVG**.

## Where it is used

- **Journal papers and theses:** figures at the right column width with consistent text.
- **Posters and slides:** the slide width option and larger text sizes give figures that read from the back of a room.
- **Lab reports:** students plotting growth, titration or calibration data with honest error bars.
- **Engineering and quality work:** test results plotted the same way every time, for reports that are compared side by side.
- **Grant applications:** small, sharp figures that survive being shrunk into a page limit.

## Common mistakes

- **Making the figure big, then shrinking it.** Text shrinks too. Choose the final width first, then the text size.
- **Using a log axis with zero or negative values.** A log scale has no zero. Those points are left out, so remove or replace them first.
- **Labels without units.** "Time" alone is not enough; write "Time (h)".
- **Relying on colour alone.** Some readers cannot tell red from green, and many papers are printed in grey. The tool changes the marker shape per series as well; keep it that way.
- **Sending a screenshot.** A screenshot is screen resolution, often far below 300 dpi. Download the file instead.

## Questions people ask

**SD or SE for the error bars?** SD shows how spread out the measurements are; SE shows how well the mean is known. Say which one you used in the figure caption.

**Can I edit the figure afterwards?** Yes. Open the SVG in a vector editor such as Inkscape to move labels or add arrows, then export again.

**Why does my PDF show a different symbol?** The PDF uses a standard font that lacks some characters. The page tells you which ones were swapped; use the SVG to keep them all.
