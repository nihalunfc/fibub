---
name: Sample label maker
num: 814
shelf: science
section: lab-management
title: "Sample and tube label maker with QR codes and Code 128 barcodes (printable PDF)"
summary: "Paste a sample list or open a CSV or Excel file and print tube and sample labels with a QR code, a Code 128 barcode or both, plus up to four text lines. Describe your label sheet (or use an example layout), skip labels already used, and download a vector PDF to print at actual size."
status: live
ads: false
order: 814
icon: qr
works: offline
updated: 2026-11-09
related: [plate-layout, reagent-inventory, cryovial-inventory, herbarium-label-maker, field-sampling-planner]
sources:
  - "The QR code (byte mode, versions 1 to 10, levels L to H) and Code 128 encoders are written by fibub from the published standards (ISO/IEC 18004 and ISO/IEC 15417). The tests check them module for module against python-qrcode and python-barcode, and every test code was read back with the zxing-cpp decoder."
  - "Sheet presets are rounded example layouts, not any label maker's products; measure your own sheet. The example samples are made up."
  - "Your list is read on the page only. It is never uploaded or stored."
flow:
  - { icon: table, label: "Samples" }
  - { icon: qr, label: "Code" }
  - { icon: ruler, label: "Sheet" }
  - { icon: download, label: "PDF" }
---

## What it does

Hand-written tube labels smudge, fade in the freezer and are hard to read. This page turns your sample list into neat labels with a scannable code, ready to print on a sheet of labels or a label printer.

- **Your list.** Paste rows from a spreadsheet (tabs) or type comma-separated lines, or open a CSV, TSV or Excel file. Quoted commas such as `"Liver, rep 1"` are kept together.
- **The code.** A QR code (any text, including accents and µ), a Code 128 barcode (plain letters, digits and keyboard symbols, read by ordinary handheld scanners), both, or none. You choose which column the code holds, usually a short unique ID.
- **Text lines.** Up to four columns are printed as text, the first in bold. Text shrinks to fit the label, and long text is cut with "…".
- **The sheet.** Page size, labels across and down, label size, margins and pitch. Pick an example layout or type your own. *Labels already used* lets you start part-way down a sheet you used before.
- **PDF.** A vector PDF: QR squares and bars are exact rectangles, so they print sharp on any printer.

Keep track of what the labelled tubes and bottles hold with the [[cryovial-inventory]] and the [[reagent-inventory]].

## How to use it

1. Paste or open your list. Tick *First row is column names* if it has a header.
2. Choose the code type and the column it holds. Keep the ID short: a shorter ID gives bigger squares and bars, which scan more reliably on small tubes.
3. Tick the columns to print as text.
4. Pick the sheet, or type the sizes from your label box. Check the preview.
5. Download the PDF and print it at **actual size (100 %)**. Do a test print on plain paper first, hold it against a label sheet to the light, and adjust the margins if needed. *Draw label outlines* helps with this test.

## Worked example

The page opens with six made-up samples (S-001 to S-006, with tissue, date and concentration) on the example A4 sheet of 5 × 13 labels, each 38 × 21 mm. The headline reads *6 labels on 1 sheet (65 a sheet)*. Each QR code is version 1 (21 × 21 squares) at level M, 17.5 mm square, so each square is 0.7 mm: easy for a phone camera or a 2D scanner. The text beside it shows the ID in bold, then the name, date and concentration.

Switch the code to *Code 128 barcode* and the ID S-001 becomes 70 modules of bars plus quiet zones, with the narrowest bar 0.39 mm wide on this label. Set *Copies of each* to 2 and *Labels already used* to 7, and the 12 labels start on the second row, third column.

## Tips

- **QR or barcode?** QR codes fit small square spaces and survive scratches (choose level Q or H for rough handling); Code 128 suits long, thin labels and older scanners.
- **Small tubes.** For 0.5 mL tubes and cryovial lids, use a short ID (6 to 8 characters) and level L, and check that squares are at least 0.25 mm and bars at least 0.19 mm, which the page warns about.
- **Keep data in your records.** The code should identify the sample; the full details belong in your notebook, spreadsheet or LIMS.
- **Right labels.** Office labels peel off in freezers and liquid nitrogen. Use cryo-rated labels and a laser printer for cold storage.

## Questions

**Is my sample list uploaded?** No. It is read in your browser and the PDF is made on your device.

**Why does some text print as "?"?** The PDF uses the built-in Helvetica font, which covers Western European letters, µ and °. Other characters (for example Greek or Chinese) print as "?" in the text lines, and the page lists them. QR codes keep every character.

**My scanner reads the barcode but not the QR code.** One-line (laser) scanners cannot read QR codes. Choose Code 128 or both.

**How do I find the pitch?** Measure from the left edge of one label to the left edge of the next one across (across pitch), and from the top of one to the top of the next one down (down pitch).
