---
title: "How to merge CSV files into one (without copy and paste)"
summary: "Stack several CSV or Excel exports into one table, matched by column name, with a column that records which file each row came from. Worked example included."
tools: [merge-csv, excel-viewer, file-converter, mail-merge]
updated: 2026-11-10
sources:
  - "Matching rules (header in the first row, names compared without regard to capital letters, blank rows dropped) from fibub's own src/lib/docs/csvmerge.ts."
  - "The three expense files in the example are made up; the row counts and total were worked with that same code."
---

To merge CSV files, read the first row of each file as its column names, line the columns up by name, and stack the data rows underneath one shared header. The [[merge-csv]] tool does exactly that in your browser: choose all the files at once, pick how strict the column match should be, and download one CSV or Excel file.

## What you need

- **The files.** CSV, TSV, plain .txt with commas, or modern Excel (.xlsx). Older formats such as .xls, .ods or Apple Numbers need to be saved as .xlsx or CSV first.
- **A header row in each file.** The first row that is not empty is treated as the column names. If a file starts with a title line or a logo row, delete it before you begin.
- **A row count per file.** Note it down, or open each file in the [[excel-viewer]], so you can check the result.

## Step by step

Merging is simple arithmetic once the columns line up:

**rows in the result = rows in file 1 + rows in file 2 + ... + rows in the last file**

The header row is counted once, not once per file. For the columns:

**columns in the result = every different column name across the files (+ 1 if you add a source column)**

Names are compared without caring about capital letters or spaces at the ends, so `City`, `city` and ` City ` count as one column. Order does not matter either: a file with Item before Date still lines up with one that has Date first.

With the tool:

1. Choose your files, or drop them on the box. Each one shows its row and column count, and for an Excel workbook, which sheet was read (the first sheet that holds data).
2. Under **How to join them**, pick **Same columns** if every file should have identical headings. The tool compares each file with the first one and stops with a message naming any file that differs. Pick **All columns** if some files have extra headings; cells a file did not have are left blank.
3. Leave the box ticked to add a column with each row's file name. The column is called `source_file` unless you type another name.
4. Read the summary line. It states how many files, rows and columns the result holds.
5. Press **Download merged CSV** or **Download merged Excel**.

To go the other way, choose a column under **Or split the result into many files** and press **Download ZIP**. You get one CSV per different value in that column, and rows where it is empty go into a file named blank.

## A worked example

A small office keeps one expenses export per month:

- **jan.csv**: Date, Item, Amount. 3 rows (Paper 12.50, Ink 40.00, Stamps 9.80).
- **feb.csv**: Item, Date, Amount. 2 rows (Toner 65.00, Paper 12.50). Same headings, different order.
- **mar.csv**: Date, Item, Amount, Card. 4 rows (Folders 7.25, Ink 40.00, Labels 5.60, Paper 12.50).

First try **Same columns**. The tool reports that mar.csv has different columns from jan.csv, because March added Card. Nothing is merged, so no column is lost by accident.

Switch to **All columns**:

- Rows: 3 + 2 + 4 = **9 rows**.
- Columns: Date, Item, Amount, Card, plus source_file = **5 columns**.

The summary reads "3 files, 9 rows and 5 columns in the result." February's Toner row lands under the right headings even though its file had Item first. The Card cell is empty for the five January and February rows.

Now total the Amount column in the merged file:

- 12.50 + 40.00 + 9.80 + 65.00 + 12.50 + 7.25 + 40.00 + 5.60 + 12.50 = **205.15**.

Finally, split by Item. Six items appear (Paper, Ink, Stamps, Toner, Folders, Labels), so the ZIP holds six files. Paper.csv has 3 rows, one from each month, worth 3 × 12.50 = 37.50 in all.

## Check your answer

- **Row count.** Add up the row counts shown beside each file. The summary must match. If it is lower, a file probably had blank rows, which are dropped on purpose.
- **Column count.** If **All columns** gives more columns than you expected, two files likely spell a heading differently, such as `Amount` and `Amt`. Rename one and add the files again.
- **Spot-check one row from each file.** Find it in the merged file using the source column and compare it with the original.

## Questions people ask

**Does it remove duplicate rows?** No. Every row from every file is kept, which is what you want for a fair count. If the same export was added twice, the source column makes it easy to spot.

**Can I merge Excel files with several sheets?** Each workbook gives one table, read from its first sheet with data. To get another sheet, save it as its own CSV with the [[file-converter]] and add that.

**What can I do with the merged list?** Open it in any spreadsheet, or use it as the list for [[mail-merge]] to make one letter per row.
