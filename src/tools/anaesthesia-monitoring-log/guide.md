---
name: Anaesthesia monitoring log
num: 400
shelf: science
section: veterinary-science
title: "Anaesthesia monitoring log: a fillable and printable veterinary record sheet with vitals chart, for teaching"
summary: "A record sheet for practising anaesthesia monitoring: heart rate, breathing rate, SpO₂, EtCO₂, temperature, blood pressure and depth notes every few minutes, with your own alert ranges, a chart of the vitals over time, and CSV or PDF downloads, including a blank sheet to print. No dose calculations. Nothing is uploaded or stored."
status: live
ads: false
order: 400
icon: clock
works: offline
updated: 2026-11-09
related: [growth-curve-tracker, plot-maker]
sources:
  - "Record layout follows the general pattern of anaesthetic monitoring records used in veterinary teaching (time-stamped vital signs and depth notes). No published chart, form or reference ranges are reproduced."
  - "The alert ranges are blank by default and set by the user; the optional practice ranges are round made-up numbers labelled as such."
  - "The example record is made up for teaching; it is not a real patient. Times, alerts and summaries are checked by hand in the tests."
flow:
  - { icon: pencil, label: "Patient" }
  - { icon: clock, label: "Every 5 min" }
  - { icon: chart, label: "Chart" }
  - { icon: download, label: "PDF / CSV" }
---

## What it does

During an anaesthetic, someone records the patient's vital signs every few minutes. This page is a **record sheet for study and practice**: fill it in on a phone or tablet during a teaching session or a simulation, or print a blank sheet and fill it in by hand.

- A row every 1, 2, 5, 10 or 15 minutes from the start time, with **heart rate, respiratory rate, SpO₂, EtCO₂, temperature, systolic, mean and diastolic blood pressure**, and a free-text column for depth signs and events.
- **Alert ranges you set yourself**. They are blank to start with; any reading outside a range you set is marked in red and listed under the table.
- A **chart** of each group of vitals over time, a summary (lowest, highest, mean, first and last reading), and downloads: the log as CSV (which you can open again later), the record as an image, PDF or Word file, and a **blank sheet** as PDF.

It has no drug, dose or fluid-rate fields and calculates no doses. It is for study and planning, not a substitute for professional judgement: the anaesthetist in charge decides what is normal for each patient.

To track an animal's weight and condition between procedures, use the [[growth-curve-tracker|growth curve tracker]]; to make a figure from the readings, the [[plot-maker]].

## How to use it

1. Fill in the patient details. Only the species is needed; a name is optional and there are no owner fields.
2. Set the start time, the interval and the number of rows. Rows keep what you typed if you change these.
3. Type your alert ranges, or press **Fill made-up practice ranges** to see how alerts work. Those numbers are round practice values, not targets for any patient.
4. Fill in each row as you go. **Add a row** extends the sheet by one interval.
5. Pick a group of vitals to chart, and download the log before you close the page: nothing is saved on the site or in your browser.

## Worked example

Press **Use the example** and then **Fill made-up practice ranges**. The example is a made-up teaching record for a dog, nine rows from 09:00 to 09:40. With the practice ranges, the page reports **6 readings outside your ranges**: at 09:20, EtCO₂ 47 (above 45), systolic 88 (below 90) and mean pressure 58 (below 60), and the temperature at 09:30, 09:35 and 09:40 (36.9, 36.8 and 36.7, below 37). The respiratory rate of 8 at 09:20 equals the low limit, so it is not marked.

The summary shows heart rate between 88 and 112 beats/min with a mean of 98.44, first 112 and last 102. The blood pressure chart shows the dip at 09:20 and the recovery afterwards.

## Tips

- Write depth signs (eye position, jaw tone, reflexes) and events (start of surgery, position change) in the notes column, so the chart can be read against them.
- Choose °F if your clinic records temperature in Fahrenheit; set your ranges in the same unit.
- The page checks for readings that cannot be right as typed, such as SpO₂ above 100 % or a mean pressure outside systolic and diastolic.

## FAQ

**Is anything stored?** No. The log lives only in this page until you download it. Nothing is uploaded and the page works offline.

**Can it suggest what to do about an alert?** No, by design. It records and charts; decisions belong to the trained person responsible for the patient.
