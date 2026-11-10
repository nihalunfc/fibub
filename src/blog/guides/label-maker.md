---
title: "How to print labels from a list: sheet sizes, copies and a PDF"
summary: "Turn a list of addresses, jar names or name tags into a printable PDF for sticky label sheets: how label grids work, how to reuse a part-used sheet, and how to get the print lined up."
tools: [label-maker, mail-merge, image-resizer, invoice-maker]
updated: 2026-11-10
sources:
  - "Sheet measurements are the common generic grids for sticky label paper (US Letter 3 × 10 at 2.625 × 1 in; A4 3 × 7 at 63.5 × 38.1 mm; A4 5 × 13 at 38.1 × 21.2 mm; Letter 2 × 5 at 4 × 2 in). Check your own pack, as makers vary slightly."
  - "The worked example list is made up."
---

Getting text to land inside each little sticky rectangle is fiddly. The [[label-maker]] takes a plain list and lays it out on the grid of a real label sheet as a PDF you print at actual size. It suits invitations, parcels, jar labels and name tags. If each label needs extra wording pulled from spreadsheet columns, write the text with [[mail-merge]] first; for the paperwork that goes in the parcel, try the [[invoice-maker]].

## What it is

A label sheet is a page cut into a grid of identical stickers. Five measures describe it:

- **columns** and **rows**: how many labels across and down;
- **label width** and **label height**;
- **left** and **top margin**: the space from the page edge to the first label;
- **gap across** and **gap down**: any space between labels.

The tool places label number k (counting from 0, left to right, then down) at:

- x = left + (k mod columns) × (width + gap across)
- y = top + floor(k ÷ columns) × (height + gap down)

Here "k mod columns" is the remainder after dividing k by the number of columns, and floor means rounding down to a whole number.

The sheets on offer are US Letter with 30 labels (3 × 10), A4 with 21 (3 × 7), A4 with 65 small labels (5 × 13), Letter with 10 shipping labels (2 × 5), and a **Custom grid** where you type every measure in millimetres.

Each label is then filled with your lines of text. The tool starts at your chosen text size and steps down in half points until every line fits the width and all the lines fit the height, so long names never spill over the edge.

## How to use it

1. Under **Your labels**, choose how the text is written: *One label per line* (commas inside a line start a new line on the label) or *Labels separated by a blank line*.
2. Type or paste the list, or open a CSV or text file. Tick the heading-row box if the file's first line holds column names.
3. Under **The label sheet**, pick the sheet that matches your pack, or *Custom grid* and type the measures printed on the box.
4. Under **Look**, set the **Text size**, **Copies of each**, **Skip used labels** and **Align** (left or centre). Tick **First line in bold** to make the name stand out, and **Draw light label outlines** for a test print.
5. Check the count line and the preview of the first sheet on the right.
6. Press **Download PDF** and print it at 100 % (actual size).

## A worked example

You make 12 kinds of jam for a market stall and want 3 labels of each, on A4 sheets of 21. Four labels on your open sheet are already used.

Each line of the list looks like this:

```
Wild Strawberry Jam, Made 2026-11, Keep cool
```

That gives one label with three lines.

**How many labels:** 12 kinds × 3 copies = **36 labels**.

**How many pages:** the 4 used spots count as taken, so the tool needs 36 + 4 = 40 places. At 21 per sheet, 40 ÷ 21 = 1.9, which rounds up to **2 pages**.

**What goes where:** the first sheet has 21 − 4 = **17** new labels, and the second sheet takes the other 36 − 17 = **19**.

**Does the text fit at 10 pt?** Each A4 label is 63.5 mm × 38.1 mm. The tool keeps 2.5 mm padding at each side and 1.5 mm at top and bottom, leaving 38.1 − 3 = 35.1 mm, about **99.5 pt** of height. Three lines at 10 pt with line spacing take 3 × 10 × 1.18 = **35.4 pt**, so they fit easily. The usable width is 63.5 − 5 = 58.5 mm, about **166 pt**.

**Does the grid add up?** Across: 7.21 mm + 3 × 63.5 mm + 2 × 2.54 mm = **202.79 mm**, leaving 7.21 mm on the right of a 210 mm page. Down: 15.15 mm + 7 × 38.1 mm = **281.85 mm**, leaving 15.15 mm at the bottom of 297 mm. The same sum checks a custom grid.

## Where it is used

- **Post.** Addresses for invitations, holiday cards or a small shop's orders, on 30-up or shipping sheets.
- **Small food and craft sellers.** Product names, batch months and storage notes on jars and bags. Check your local rules for what a food label must say.
- **Events.** Name tags with the name in bold and a team or role underneath.
- **Offices and schools.** File folders, storage boxes, shelf labels and book labels.

## Common mistakes

- **Printing with "fit to page".** The printer shrinks the page and the text drifts off the labels. Choose 100 % or actual size.
- **Wasting a whole sheet on a test.** Tick the outline box, print on plain paper, and hold it against a label sheet up to a window.
- **Guessing custom measures.** Measure one label and the margins with a ruler, or copy them from the pack, then check that the sums fit the page.
- **Commas inside one line.** In one-label-per-line mode a comma starts a new line. Put text that must keep its comma in double quotes, or use the blank-line mode.
- **Letters the PDF font cannot show.** The built-in fonts cover Latin letters with accents; other scripts are replaced with a question mark, and the status line lists them.

## Questions people ask

**Can I print the same return address on a whole sheet?** Yes. Type it once and set **Copies of each** to the number of labels on your sheet, such as 30.

**Why does one label look smaller than the rest?** Its text was too long at your chosen size, so it was shrunk to fit. Shorten the wording or split it over another line.

**Can I add a logo?** Not in this tool; it prints text only. Shrink a logo with the [[image-resizer]] if you plan to add it in another program.
