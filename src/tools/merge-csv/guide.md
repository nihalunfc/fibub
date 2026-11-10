---
name: Merge CSV
num: 1766
shelf: documents
section: convert-files
title: "Merge CSV: combine many CSV or Excel files into one, or split by a column"
summary: "Stack several CSV or Excel files into one table, with a column showing which file each row came from. Or split one table into many files by a column. Nothing is uploaded."
seoTitle: "Merge CSV files online: combine or split, no upload"
status: live
ads: false
order: 1766
icon: table
works: offline
updated: 2026-11-10
related: [file-converter, excel-viewer, mail-merge]
sources:
  - "Reads CSV, TSV and the first sheet with data from .xlsx files (values only, not formulas or formatting). The Excel reader is shared with the file converter."
flow:
  - { icon: file, label: "Add files" }
  - { icon: table, label: "Join" }
  - { icon: download, label: "Download" }
---

## What it does

Monthly exports, one file per branch, one sheet per class: sooner or later you end up with many small files that should be one. This tool stacks them for you. It reads the first row of each file as the column names, lines the columns up by name (so a different column order is fine), and writes one combined CSV or Excel file. A column with the original file name can be added to every row, so you always know where a row came from.

It also works the other way round: pick a column such as country or department and get one CSV for each different value, all packed into a ZIP. Check a file first with [[excel-viewer]], change formats with [[file-converter]], or turn the rows into letters with [[mail-merge]].

## How to use it

1. Choose several CSV or .xlsx files. You can add more files later.
2. Pick how to join them: **Same columns** or **All columns**.
3. Keep or remove the source-file column, and rename it if you like.
4. Read the summary line, then download the merged CSV or Excel file.
5. To split instead, pick a column and press Download ZIP.

## What each setting does

- **Same columns**: every file must have the same column names. If one differs, the tool tells you which and stops, so no data is silently lost.
- **All columns**: the result has every column from every file. Missing cells stay empty.
- **Source-file column**: adds the file name to each row.
- **Split by column**: one CSV per different value; blank values go to a file called blank.

## Worked example

File A has 3 rows and File B has 2 rows, both with columns Name and City. Merged with the source column on, you get 5 rows and 3 columns. If B also had a Phone column, "All columns" gives 4 columns with Phone empty for A's rows, while "Same columns" refuses and names B.

## FAQs

**Does the header have to be in row 1?** Yes. The first non-empty row of each file is its header.

**What about Excel files with many sheets?** The first sheet that has data is used, and the file list says so.

**Is there a size limit?** Only your device's memory. Very large files (hundreds of thousands of rows) may be slow on a phone.

**Are my files uploaded?** No, everything happens in your browser.
