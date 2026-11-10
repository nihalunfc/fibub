---
name: Health log
num: 1967
shelf: documents
code: T842
section: health-logs
title: "Blood pressure, blood sugar and weight log with charts"
summary: "Keep a log of blood pressure, blood glucose, weight, sleep, symptoms or a period. See a chart and weekly averages, then download a CSV or a summary to take to your doctor. Nothing leaves your device."
status: live
ads: false
order: 1967
icon: chart
works: offline
updated: 2026-11-10
related: [lab-results-tracker, health-summary-card, heart-rate-zones]
sources:
  - "Blood glucose conversion: mg/dL ÷ 18.016 = mmol/L (the molar mass of glucose is about 180.16 g/mol). Weight: 1 kg = 2.2046 lb."
  - "Averages, lowest and highest are plain arithmetic. Weeks start on Monday. No guideline categories or colour bands are used; any target line is typed by you."
flow:
  - { icon: sliders, label: "Pick log" }
  - { icon: pencil, label: "Add entries" }
  - { icon: curve, label: "See chart" }
  - { icon: download, label: "Download" }
---

## What it does

A health log is just a dated list of numbers you measure yourself. This tool gives each kind a ready-made form: blood pressure, blood glucose, weight, sleep, a symptom diary, a period log, or a custom one with your own name and unit. Add entries as you go, and it draws a chart for each measure, works out weekly averages, and shows the lowest and highest.

It never says whether a number is good or bad. There are no categories or warning colours. If your doctor gave you a target, you can type it and a dashed line appears on the chart. Lab results go in [[lab-results-tracker]], and [[health-summary-card]] makes a one-page summary for a new doctor.

## How to use it

1. Pick a log at the top. Set the unit if there is a choice (mg/dL or mmol/L, kg or lb).
2. Check the date and time, fill in the boxes and press **Add entry**.
3. Use **From** and **To** to pick a date range. Everything below follows it.
4. Download the CSV, or the summary as a PDF, image or Word file, to show your doctor.

## What each option does

- **Unit switch** changes how numbers are shown. Glucose is converted with ÷ or × 18.016, so no entry is lost.
- **Your own target line** is optional and only a line on the chart.
- **Bring your own CSV** adds entries from a file in the same layout as the download.
- **Keep my logs on this device** is off by default. Ticking it keeps your logs in this browser only; **Clear all my logs** deletes them.

## Worked example

Sam records blood pressure on three mornings: 120/78, 130/80 and 140/82. The weekly table shows an average of 130 over 80 for the week of Monday 2 November. Sam types 120 as the target his doctor gave him, and a dashed line appears across the chart.

## FAQs

**Does it tell me if a reading is high?** No. It only organises your numbers. Ask your doctor what they mean.

**Where is my data?** Only in the open page, unless you tick the keep box, and then only in this browser.

**Can I move between devices?** Download the CSV on one device and import it on another.
