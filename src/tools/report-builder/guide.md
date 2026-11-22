---
name: Report builder
num: 3093
shelf: money
code: T1074
section: small-business
title: "Report builder: turn a CSV or Excel export into a short report with charts and notes"
summary: "Open the exports you already have (CSV or Excel) and get a manager's report with key numbers, charts, a breakdown and plain notes, ready to download as an image, PDF or Word file."
status: live
ads: false
order: 3093
icon: file
works: offline
updated: 2026-11-22
related: [kpi-dashboard, revenue-dashboard, daily-close, trend-analyser]
sources:
  - "The maths is plain addition and averaging of the rows you give it, compared with the previous stretch of the same length. Weeks start on Monday. The example numbers are made up."
  - "Sample files you can download are invented: sites, suppliers and staff names do not belong to any real business."
flow:
  - { icon: file, label: "Open export" }
  - { icon: sliders, label: "Pick columns" }
  - { icon: curve, label: "Read report" }
  - { icon: download, label: "Download" }
---

## What it does

Many teams already have the data, just not in a shape anyone reads. A point-of-sale system, a booking system, a payroll run or an accounts package will all export a table. This tool takes that table and writes a short report: the headline number for the period, how it compares with the period before, a chart over time, a breakdown by department, branch or supplier, a summary of every number column, and a handful of plain sentences saying what stands out.

It needs very little. One table with a heading row, a column of dates, and at least one column of numbers. A label column (department, branch, supplier, product) is optional and gives you the breakdown. It guesses which columns are which and you can change any guess. Everything happens in your browser. If you want more than a report, the [[kpi-dashboard]] tracks use of capacity and price against budget, the [[revenue-dashboard]] explains where revenue came from, and the [[daily-close]] checks each day's takings.

## How to use it

1. **Step 1:** open a CSV or Excel (.xlsx) file, paste rows from a spreadsheet, or start from one of the two examples. For a quick try, download one of the sample files: [daily revenue by department](/samples/report-builder/daily_revenue_by_department.csv), [supplier invoices](/samples/report-builder/supplier_invoices.csv) or [staff timecards](/samples/report-builder/staff_timecards.csv), then open it with the button.
2. **Step 2:** check the columns it chose: the date, the measure to add up, and what to split by. Pick a period and, if you like, a currency symbol.
3. **Step 3:** read the report. Press **Add this to my report** to keep it, then open another export and add that too. Several exports can sit in one report.
4. Download the report as an image, a PDF or a Word file and send it.

## What each setting does

- **Date column**: which column places each row in time. Dates such as 2026-10-31, 10/31/2026, 31-Oct-2026 and Excel day numbers are read.
- **Measure**: the number to add up. "Number of rows" counts rows instead, useful for incident logs.
- **Add up as**: a total, or an average per row. Use the average for things like a price, a rate or a score, where adding up makes no sense.
- **Split by**: a label column for the breakdown. Choose nothing to leave the breakdown out.
- **Period**: all the data, or the last 7, 28 or 90 days, month to date, year to date or the last 12 months, counted back from the latest date in the file. Each is compared with the stretch just before it.
- **Dates are written**: day first or month first. "Work it out" looks for a day above 12 and usually gets it right; set it by hand if it does not.
- **Remember my title**: off by default. Only the title and the symbol are kept, only in this browser, and the Clear button removes them.

## Worked example

Open the sales example. It has a row for each branch and product line for each of 120 days. The date column is Date, the measure is Sales, and the report splits by Branch. Total sales for all the data comes to 486,270 across 1,440 rows. Change the period to "Last 28 days" and the cards add the previous 28 days and the percentage change (about 5% up on the 28 days before). The chart switches to days, the breakdown table shows each branch's share, and the notes say which branch is biggest, which weekday is strongest and whether the later weeks sell more than the earlier ones. If a branch jumped, the notes name the biggest mover.

## FAQs

**Can it read Excel?** Yes, .xlsx files. The first sheet with data is used. Older .xls files should be saved as .xlsx or CSV first.

**It picked the wrong measure.** Choose another from the Measure list. It prefers columns named like revenue, sales, amount or cost, but only you know which one matters.

**Why were some rows left out?** Rows with no readable date, or no number in the measure column, are skipped and the notes say how many. Fix those in your file if they matter.

**Are my files uploaded?** No. The file is read on your device, the report is made on your device and nothing is sent anywhere.

**How big can the file be?** About 10 MB and 100,000 rows. Very large files are slow because everything runs in your browser.

**Can I combine two exports?** Yes: add the first report part, open the second file, add that, and download. Each part is labelled with its measure and split.

**Does it give advice?** No. The notes are arithmetic on your rows. Check the numbers that matter against your own system.
