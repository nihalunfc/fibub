---
name: Data dictionary generator
num: 817
shelf: science
section: data-management
title: "Data dictionary generator from a CSV or Excel file: column types, missing values, ranges and a Frictionless Table Schema"
summary: "Open a CSV or Excel file and get a data dictionary: each column's type, missing values, distinct values, range, mean, SD and median, examples and allowed values. Add titles, descriptions and units, then export Markdown, CSV or a Frictionless Table Schema (JSON). The file stays in your browser."
status: live
ads: false
order: 817
icon: table
works: offline
updated: 2026-11-09
related: [sql-playground, data-cleaner, table-converter, plot-maker, csv-profiler, dataset-readme, metadata-builder, science-file-converter]
sources:
  - "Column statistics and type rules are written by fibub. The tests check missing and distinct counts, minimum, maximum, mean, standard deviation and median against pandas on six tables, and check the exported Table Schema against the data with the frictionless Python package (Frictionless Data, MIT licence)."
  - "The Table Schema export follows the published Frictionless Table Schema specification (specs.frictionlessdata.io)."
  - "The example bird survey is made up. A file you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: file, label: "Open" }
  - { icon: search, label: "Profile" }
  - { icon: pencil, label: "Describe" }
  - { icon: download, label: "Export" }
---

## What it does

A data dictionary tells the next person (a co-author, a reviewer, a repository or you in a year) what every column in a table means. Most journals and data repositories now ask for one. This page writes the dull half for you and gives you a form for the half only you can write:

- **Type** of each column: integer, number, true/false, date (YYYY-MM-DD), date and time, or text.
- **Missing values:** empty cells plus the codes you list (NA, -999 ...), as a count and a percentage.
- **Distinct values**, and whether every value is different (a sign of an ID column).
- **Range:** minimum and maximum for numbers and dates, length for text; **mean ± SD** (sample standard deviation) and **median** for numbers.
- **Examples**, or for categories (up to 20 distinct values, each used more than once on average) the **allowed values** with their counts.
- **Warnings** for things that trip up analysis: codes with leading zeros, dates written day/month or month/day, and numbers with thousands commas.

Then you add a **title**, a **description** and a **unit** for each column. Units are never guessed: only you know whether a 12 is metres, feet or a count.

Profile the data for gaps and odd values first with the [[csv-profiler]], and add the dictionary to your [[dataset-readme|dataset README]].

## How to use it

1. **Open.** Press *Open a file* for a CSV, TSV or Excel (.xlsx) file, or paste cells from a spreadsheet. The first row should hold the column names.
2. **Profile.** Check the missing-value codes your data uses; the dictionary updates as you type.
3. **Describe.** Fill in a title, a one-line description and the unit under each column.
4. **Export.** Choose Markdown (for a README or data paper), CSV (one row per column) or a Frictionless **Table Schema** in JSON, and copy or download it.

## The Table Schema export

The JSON follows the Frictionless Data Table Schema: every column becomes a field with its name, title, description, type and (as an extra property) unit, and the missing-value codes are listed once. Constraints describe the data as it is: `required` when nothing is missing, `unique` for identifier-like columns, `enum` with the allowed values of categories, and `minimum` and `maximum` for numbers and dates. Tools such as the frictionless Python package can then check new data against it.

## Worked example

Press *Use the example*: a made-up spring bird survey of 12 plots with 9 columns. The page reports 12 rows, 9 columns and 11 missing cells. `temp_c` is a number with 2 missing (16.7 %), from 9.8 to 17.2, mean 13.45 ± 2.515 and median 13.3. `habitat` is a category with the allowed values forest (4), grassland (4) and wetland (4). `rain` is true/false. `plot_code` is kept as text with a warning, because codes such as 007 would lose their zeros as numbers. `notes` is missing in 8 of 12 rows.

## FAQ

**Is my file uploaded?** No. It is read and summarised on this page, and the page works offline. Your descriptions are not saved either, so download the dictionary when you are done.

**Why is my number column shown as text?** At least one cell is not a plain number: a unit typed into the cell ("12 mg"), a thousands comma, or a missing-value code that is not in the list. Add the code or clean the column first.

**How large a file can it take?** Up to 20 MB, 100 columns and 100,000 rows.
