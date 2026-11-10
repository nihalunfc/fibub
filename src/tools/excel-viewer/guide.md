---
name: Excel viewer
num: 1765
shelf: documents
section: convert-files
title: "Excel viewer: open XLSX and CSV online, free, nothing uploaded"
summary: "Open an Excel or CSV file in your browser, flip between sheets, see hidden sheets, rows and columns marked, and save a sheet as CSV or PDF. Nothing is uploaded."
seoTitle: "Excel viewer: open XLSX and CSV online, no upload"
status: live
ads: false
order: 1765
icon: table
works: offline
updated: 2026-11-10
related: [file-converter, merge-csv, mail-merge]
sources:
  - "Reads the cell values stored in the file (text, numbers, shown results of formulas). It does not show formatting, charts, pictures or macros."
flow:
  - { icon: file, label: "Open" }
  - { icon: table, label: "Look" }
  - { icon: download, label: "Save" }
---

## What it does

Open a spreadsheet you received and look inside it without installing Excel or uploading the file anywhere. You get a tab for every sheet, a scrollable grid, and a clear mark on anything the author hid: whole sheets, rows and columns. That makes it handy for checking a file before you send it on, or for reading one on a phone.

You can then save the sheet you are looking at as a CSV, or as a PDF that is scaled to fit the page width, with the header row repeated on every page. To turn a whole Excel file into CSV or JSON in one step, use [[file-converter]]. To stack many files into one, use [[merge-csv]], and to fill letters from the rows, use [[mail-merge]].

## How to use it

1. Choose an .xlsx, .csv or .tsv file, or drop it on the box.
2. Pick a sheet from the tabs. Hidden sheets are in italics and say "(hidden)".
3. Scroll the grid. Press "Show more rows" for big sheets.
4. Choose Save as CSV or Save as PDF.

## What each setting does

- **Show hidden rows and columns**: on, they are shown in grey and marked. Off, they disappear from the grid.
- **First row is a header**: bolds it, and repeats it on each PDF page.
- **Leave out hidden rows and columns**: applies to the CSV and PDF you save.
- **Paper**: A4 or US Letter, landscape.

## Worked example

A workbook has sheets Sales and Costs, plus a hidden sheet Secret. Sales has a header and three data rows, and row 3 is hidden. The viewer shows three tabs with Secret marked hidden, and "Hidden in the file: 1 row". Saving Sales as CSV gives 4 lines; with "Leave out hidden rows" ticked it gives 3.

## FAQs

**Does it open old .xls files?** No. Open the file in Excel or LibreOffice and save it as .xlsx or CSV first.

**Why do I see numbers instead of dates?** Excel stores dates as serial numbers, and this viewer shows the stored value. Convert the column in your spreadsheet program if you need dates.

**Are formulas shown?** You see the last result saved in the file, not the formula.

**Is my file uploaded?** No. It is read in your browser and never leaves your device.
