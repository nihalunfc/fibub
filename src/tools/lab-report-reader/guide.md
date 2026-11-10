---
name: Lab report reader
num: 1962
shelf: documents
code: T837
section: lab-results
title: "Lab report reader: turn a blood test report into a clear table"
summary: "Open or paste a lab report and get a tidy table of tests, results, units and the range printed on your report, with the original line beside each row. Everything stays on your device."
status: live
ads: false
order: 1962
icon: table
works: offline
updated: 2026-11-10
related: [lab-results-tracker, lab-unit-converter, medical-terms, records-organiser]
sources:
  - "Test descriptions are fibub's own one-line explanations of what a test measures, informed by public patient-information pages (MedlinePlus, NHS). No ranges are added: only the range printed on your own report is used."
flow:
  - { icon: file, label: "Open report" }
  - { icon: search, label: "Find tests" }
  - { icon: check, label: "Check table" }
  - { icon: download, label: "Download" }
---

## What it does

A lab report is often a page of small print. This tool reads the text of your report and turns each test line into a row: the test, your result, the unit, and the range the lab printed beside it. Next to every row it keeps the original line in small type, so a misread digit is easy to catch.

It never adds a range of its own and never says what a result means for you. A result is marked only as "below the printed range" or "above the printed range" when it sits outside the range on your own report, in plain colours with no alarm signals. Take your results to your doctor or pharmacist. Once the table is checked, you can follow your numbers over time in the [[lab-results-tracker]], look up report words in [[medical-terms]], or file the PDF with the [[records-organiser]].

## How to use it

1. Open a report (PDF with selectable text, Word or text file), or paste the text into the box.
2. Press **Find the tests**. Lines with a name, a number and a unit or range become rows.
3. Compare each row with your report. Fix any cell by typing, delete rows that are not tests, or add a row.
4. Set the report date and lab name if you want them in the files.
5. Download a CSV or a report (image, PDF or Word), or the special CSV for the tracker.

## What each part does

- **Range on report**: the text printed beside the result, like `13.0 - 17.0` or `< 200`. Edit it and the mark updates.
- **Mark**: says whether your result is outside that printed range. Blank means inside it, or no range found.
- **What it measures**: a short note on the test itself, such as what a haemoglobin test counts. It is about the test, not your result.
- **Original**: the line as it was read, for checking.

## Worked example

Take the line `Potassium 3.2 mmol/L 3.5-5.0`. The tool reads the test as Potassium, the result as 3.2, the unit as mmol/L and the printed range as 3.5 to 5.0. Because 3.2 is under 3.5, the mark reads "below the printed range". For `Total Cholesterol 210 mg/dL < 200` the mark reads "above the printed range".

## FAQs

**Can it read a photo or a scan?** Yes. If the file has no text layer, the tool reads the words on your device (the reader, about 4 MB, loads the first time). Photo reading makes more mistakes than a text PDF, so check each row against the original line.

**Is anything uploaded?** No. Reading happens in your browser and nothing leaves the device.

**Why was a line missed?** A line needs a name, a number and a unit or range. Add it as a row by hand.

**Does a mark mean something is wrong?** No. It only says the number is outside the printed range. Ask your doctor about your results.
