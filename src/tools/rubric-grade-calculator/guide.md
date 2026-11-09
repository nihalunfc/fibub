---
name: Rubric grade calculator
num: 766
shelf: science
section: education-research
title: "Rubric grade calculator: weighted rubric scores, grade bands and class summary (free)"
summary: "Build a marking rubric with your own criteria, levels and weights, mark each student by picking a level, and get weighted percentages, grades from your own cut-offs and a class summary. Download as CSV, PDF or Word, or print."
status: live
ads: false
order: 766
icon: check
works: offline
updated: 2026-11-09
related: [reliability-analysis, plot-maker, data-cleaner, sample-size]
sources:
  - "Method: weighted analytic rubric scoring (weighted mean of level points over top points); grade bands set by the user."
  - "Example rubric and marks: made up for this page."
flow:
  - { icon: pencil, label: "Rubric" }
  - { icon: check, label: "Mark" }
  - { icon: percent, label: "Grades" }
  - { icon: download, label: "Export" }
---

## What it does

An analytic rubric breaks an assignment into criteria (such as content, organisation, evidence and language) and describes a few levels of quality for each. This calculator turns the levels you pick into a fair, weighted mark. You set the criteria, their weights, the levels and their points, and the grade cut-offs your school uses. Then you mark each student by choosing a level for each criterion. The tool works out each student's percentage and grade at once, and summarises the class: mean, median, spread, how many got each grade and which criterion was weakest on average.

Everything happens in your browser. Student names and marks are not sent anywhere. If you want to come back to a class later, you can tick **Remember this rubric and these marks on this device**; it is off by default, keeps the data only in this browser, and **Clear saved data** deletes it.

## How to use it

1. **Levels**: one per line, such as `Excellent = 4`. Every criterion uses the same levels.
2. **Criteria and weights**: rename, add or remove criteria. Weights can be percentages that add up to 100 or any numbers; only their proportions matter. The line under the list shows the sum.
3. **Grade bands**: one per line, a grade and the lowest percentage that earns it, such as `B: 70`. Use your school's own scale.
4. **Students**: type each name (or an ID) and pick a level for each criterion. A student with an unmarked criterion shows "not finished" and is left out of the class summary until finished.
5. **Export**: download the marks as CSV for your gradebook, as an image, PDF or Word report, or print the page.

## How the total works

Each criterion's level is turned into a share of the top level (points ÷ top points), multiplied by the criterion's weight, and the weighted shares are averaged:

total % = Σ (weight × points ÷ top points) ÷ Σ weight × 100.

So with levels from 1 to 4, a student at the top level everywhere gets 100 %, and one at the bottom everywhere gets 25 %. If your school wants the bottom level to be 0 %, give it 0 points.

## Worked example

The example rubric has Content (40), Organisation (20), Evidence (25) and Language (15), with levels Excellent 4, Good 3, Developing 2 and Beginning 1. Student 1 has Excellent, Good, Excellent and Good: (40 × 4/4 + 20 × 3/4 + 25 × 4/4 + 15 × 3/4) ÷ 100 = 91.3 %, an A with the cut-offs A 85, B 70, C 55, D 40. Across the six students the mean is 73.3 % (median 74.4 %, SD 21.0), with two As, two Bs, one C and one D. The weakest criterion on average is Content (70.8 %).

## Tips

- Share the rubric with students before the task; it makes marking more consistent and easier to explain.
- To check that two markers agree, mark the same work separately and compare with the **Reliability and agreement** tool.
- Keep a copy of the CSV: saved data lives only in this browser and is lost if the browser's storage is cleared.

## Frequently asked questions

**Can criteria have different levels?** Not in this version: all criteria share one set of levels. Use weights to make some criteria count more.

**Are grades rounded?** No. The percentage is compared with the cut-offs before rounding for display, so 84.96 % is a B when A starts at 85.

**Is my data sent anywhere?** No. Everything runs in your browser and the page keeps working offline.
