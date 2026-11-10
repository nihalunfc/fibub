---
name: SQL playground
num: 38
shelf: science
code: T38
section: data-science-and-machine-learning
title: "SQL playground"
summary: "Open CSV, TSV or Excel files and get a profile of every column: type, missing values, distinct values, range and most common values. Then query them with SQL (SQLite), join files, and download the result. Nothing is uploaded."
status: live
ads: false
order: 10
icon: table
works: offline
updated: 2026-11-08
related: [plot-maker, sample-size, data-cleaner, file-converter]
sources:
  - "Example table: Palmer Penguins data by Allison Horst, Alison Hill and Kristen Gorman (CC0)."
flow:
  - { icon: file, label: "Open files" }
  - { icon: search, label: "Profile" }
  - { icon: table, label: "SQL query" }
---

## What it does

Spreadsheets struggle once data has more than a few thousand rows, or when you need to combine two files. SQL handles both easily, but setting up a database just to ask a few questions takes time. This tool gives you a full SQLite database inside the browser tab. Open your files and each one becomes a table. You see a profile of every column straight away, and you can then ask questions in SQL. Your files are read on your device and never uploaded. The database disappears when you close the tab.

Draw the results with the [[plot-maker]], or turn the file into another format with the [[file-converter]].

## How to use it

1. **Open** one or more CSV, TSV or Excel (.xlsx) files, or drop them on the box. Each sheet of an Excel file becomes its own table. The table name comes from the file name, for example `sales_2025`.
2. **Read the profile.** For each column you see the type (whole number, number or text), how many cells are filled or missing, the number of distinct values, the minimum and maximum, the mean, and the three most common values. It is a quick way to spot typos, missing data and outliers before analysis.
3. **Write a query.** A first query is suggested from your data. Press **Run** or Ctrl+Enter.
4. **Download** the result as CSV, or **copy** it to paste into Excel. The page shows the first 1000 rows of a result, and the download has every row.
5. A query that takes too long can be **stopped**. Your tables are then loaded again.

## Good to know

- Empty cells and NA, N/A, null and #N/A count as missing (SQL NULL).
- Numbers with leading zeros, such as postcodes or IDs like 007, stay as text, so nothing is changed.
- Column names are kept as they are. Put names with spaces in double quotes: `"Unit price"`.
- Files up to 150 MB each. Larger files work on a computer with plenty of memory, but phones may run out.

## Worked example

Press **Try it with sample data** to load the Palmer penguins dataset (Horst, Hill and Gorman, CC0): 344 penguins from three islands in Antarctica. The profile shows 11 missing sex values. The suggested query `SELECT species, COUNT(*) AS n, ROUND(AVG(bill_length_mm), 2) … GROUP BY species` gives 152 Adelie, 124 Gentoo and 68 Chinstrap. Try `SELECT island, sex, COUNT(*) FROM penguins WHERE sex IS NOT NULL GROUP BY island, sex` next.

## Frequently asked questions

**Which SQL is this?** SQLite 3, the most widely used database engine, compiled to WebAssembly. Window functions, CTEs (`WITH`), joins, and date and text functions all work.

**Is my data safe?** It stays in this browser tab. Nothing is sent anywhere, and the page works offline.

Turn a result into a figure with the [publication plot maker](/science/plot-maker/), or tidy messy files first with the [data cleaner](/documents/data-cleaner/).
