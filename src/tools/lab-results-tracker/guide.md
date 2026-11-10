---
name: Lab results tracker
num: 1963
shelf: documents
code: T838
section: lab-results
title: "Lab results tracker: chart blood test results over time"
summary: "Add lab results by form, paste or file, pick a test and see it as a line over time with each report's own printed range beside it. Download a CSV or a one-page PDF for your doctor."
status: live
ads: false
order: 1963
icon: chart
works: offline
updated: 2026-11-10
related: [lab-report-reader, lab-unit-converter, health-log]
sources:
  - "Only the values and ranges you enter or import are used. Nothing is added by fibub. The chart and PDF are drawn in your browser."
flow:
  - { icon: table, label: "Add results" }
  - { icon: search, label: "Pick a test" }
  - { icon: chart, label: "See trend" }
  - { icon: download, label: "Download" }
---

## What it does

Blood tests are usually done months apart, on separate reports. This tracker puts them in one place. Add each result with its date, the unit and the range printed on that report, and the tool draws a simple line for any test you pick. Each point carries its own printed range as a light bar, because different labs print different ranges.

It does not judge your numbers or add ranges, and nothing leaves your device. Use it to see your own results side by side, then take the printout to your doctor. Pull results out of a report with the [[lab-report-reader]], and convert units first with the [[lab-unit-converter]] if two labs used different ones.

## How to use it

1. Add results with the form, paste rows, or open a CSV or Excel file. The reader's tracker CSV works directly.
2. Pick a test. If it was reported in more than one unit, pick the unit to draw; units are never mixed.
3. Read the chart and the table under it. Delete a wrong row with the cross.
4. Download the CSV of all results, or the report as an image, PDF or Word file.

## What each option does

- **Printed low / high**: the range printed on that report, if any. Leave blank when none was printed.
- **Dates like 03/04/2026 mean**: tells the tool whether that is 3 April or March 4.
- **Keep my results in this browser**: off by default. When ticked, the rows you added are kept on this device only.
- **Clear everything**: removes all rows and any kept copy.

## Worked example

Three tests on four dates, as a CSV with the columns date, test, value, unit, low, high, lab. After opening it, the picker lists Glucose, Haemoglobin and Potassium. Pick Haemoglobin and you see four dated points from 13.1 to 13.9 g/dL, each with its bar from 13.0 to 17.0. The PDF lists every test with its dates, values, ranges and labs.

## FAQs

**Does it say if a value is good or bad?** No. Ask your doctor or pharmacist about your results.

**Are my results stored?** Only if you tick the keep box, and then only in this browser.

**Why are some results missing from the chart?** They use a different unit. Choose the unit above the chart.
