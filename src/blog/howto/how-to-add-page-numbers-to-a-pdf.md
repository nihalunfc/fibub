---
title: "How to add page numbers to a PDF (skip the cover, Page 1 of N)"
summary: "Number a PDF's pages from any start, leave the cover and contents blank, or stamp Bates numbers across several files. Formulas and a worked example."
tools: [page-numbers, organise-pdf, watermark-pdf]
updated: 2026-11-10
sources:
  - "Label rules (start, skip, Page 1 of N, zero-padded Bates numbers) from fibub's own src/lib/docs/pdfpages.ts; the example labels were produced with its labelFor() function."
  - "The report and the two case files in the example are made up."
---

To add page numbers to a PDF, decide which page gets the first number and what that number is, then stamp a label on every page from there to the end. The [[page-numbers]] tool does this on your device: choose the PDF, set **Start at** and **Skip first pages**, check the preview line and press **Add and download**.

## What you need

- **The finished PDF.** Number last. If pages still need moving or deleting, do that first with [[organise-pdf]], because numbers are drawn onto the page and do not move with it.
- **Your rule for the front pages.** Should the cover and contents page be blank? Should the first numbered page read 1, or carry on from an earlier part?
- **For legal bundles**, the prefix your team uses (often a short case or client code) and how many digits the numbers should have.

## Step by step

Two numbers control everything: the **skip** (how many opening pages get no label) and the **start** (the label on the first numbered page). For page *p* of the file, counting from 1:

**label on page p = start + (p − skip − 1)**, for every page after the skipped ones

**N in "Page x of N" = start + (total pages − skip) − 1**

So N is the last label used, not the file's page count.

Bates numbers work the same way, with a fixed prefix and the number padded with zeros to a set width:

**Bates label = prefix + the number written with leading zeros to D digits**

When a second file continues the series, its start is the first file's start plus its page count.

With the tool:

1. Choose your PDF.
2. Pick the **Type**: Page numbers, or Bates numbers (legal).
3. Pick the **Position**: bottom centre, bottom right, bottom left, or the same three along the top.
4. For page numbers, choose a **Style**: `1`, `Page 1` or `Page 1 of N`. For Bates, type a **Prefix** (up to 20 characters) and the number of **Digits** (1 to 10, 6 to begin with).
5. Set **Start at** and **Skip first pages**, and a **Font size** from 6 to 40 (11 at first).
6. Optionally fill **Header text** or **Footer text**. Inside them, `{date}` becomes today's date and `{file}` the file's name. They sit in the centre; if a number shares that spot, the text is nudged inward so the two do not overlap.
7. Read the preview line, which quotes the first and last labels, then press **Add and download**. You get a new copy ending in "-numbered"; the original is not touched.

## A worked example

**A report with front pages.** A 14-page report has a cover and a contents page. You want the first page of text to read "Page 1 of …".

- Skip = 2, start = 1, style **Page 1 of N**.
- N = 1 + (14 − 2) − 1 = **12**.
- Page 3 of the file: 1 + (3 − 2 − 1) = 1, so it reads **Page 1 of 12**.
- Page 14 of the file: 1 + (14 − 2 − 1) = 12, so it reads **Page 12 of 12**.

The preview line says: 14 pages, first numbered page "Page 1 of 12", last "Page 12 of 12". Pages 1 and 2 stay clean.

**Two files in one Bates series.** A legal team must number two files in one run. The first has 40 pages, the second 23. Prefix `SMITH-`, 6 digits, bottom right, skip 0.

- File 1: start 1. Labels run from **SMITH-000001** to **SMITH-000040**.
- File 2: start = 1 + 40 = **41**. Labels run from **SMITH-000041** to 41 + 23 − 1 = 63, so the last is **SMITH-000063**.

Six digits keep every label the same width, so they sort in order as text.

## Check your answer

- **Read the preview line before you download.** If the last label is not what you worked out, the start or skip is wrong.
- **Count the gap in a Bates series.** The last label of one file plus 1 must equal the first label of the next. No numbers should be missing or repeated.
- **Look at the corners at 100% zoom.** If the number runs into a page footer or a margin note, move it to another position or lower the font size.

## Questions people ask

**Can the numbering start at a number other than 1?** Yes. Set **Start at** to any number, for example 25 for a chapter that continues an earlier file. "Page x of N" then ends at the last label, such as 25 + 10 − 1 = 34 for a 10-page chapter.

**Can I number a file written in Arabic, Hindi or Chinese?** The number itself works, but header and footer text has to use Latin letters, digits and common symbols for now.

**How do I add a "Draft" or "Copy" mark as well?** Add it afterwards with [[watermark-pdf]], which writes your own words across the page, or puts a Received, Approved or Paid stamp with the date in a corner.
