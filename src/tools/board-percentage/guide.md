---
name: Board marks
num: 2259
shelf: everyday
code: T995
section: grades
title: "Board marks percentage calculator: CBSE best five and Kerala grades"
summary: "Work out your percentage from CBSE Class 10 or 12 marks (best five subjects and all subjects), or turn Kerala SSLC and Higher Secondary grades into a percentage range."
status: live
ads: true
order: 2259
icon: percent
works: offline
updated: 2026-11-16
related: [gpa-converter, weighted-grade-calculator, percentage-calculator]
sources:
  - "CBSE does not officially publish an aggregate percentage or divide; its result shows marks and grades per subject. Best-five percentage is how many schools and colleges work it out, so ask the one you are applying to (checked 2026-11-16, cbse.gov.in)."
  - "Kerala grade bands and points as commonly published (A+ 90-100 with 9 points down to E below 20 with 1 point). Not confirmed on an official page when this tool was written: check the official source, keralapareekshabhavan.in or dhsekerala.gov.in (checked 2026-11-16)."
flow:
  - { icon: pencil, label: "Your marks" }
  - { icon: calculator, label: "Add up" }
  - { icon: percent, label: "Percentage" }
  - { icon: check, label: "Check" }
---

## What it does

After board results, people want one percentage for a form, a scholarship or a college. This tool works it out in two ways. For CBSE it adds your marks and shows the percentage of your best five subjects and of all subjects. For Kerala SSLC and Higher Secondary, where results are grades, it turns each grade into the range of marks it stands for.

CBSE itself does not publish an aggregate percentage, so treat the result as a guide and use whatever your school or college asks for. To work with GPAs see the [[gpa-converter]], for weighted subjects the [[weighted-grade-calculator]], and for any other percentage the [[percentage-calculator]].

## How to use it

1. Pick **CBSE marks** or **Kerala grades**.
2. CBSE: type each subject's marks obtained and the maximum (100 unless it is different). Leave unused rows empty.
3. Kerala: choose the grade for each subject.
4. Read the percentages and the working underneath.

## What each setting does

- **Best five**: the five subjects with the highest percentage are added up (marks obtained divided by their maximum marks). Many colleges use a set of core subjects instead, so check the rule you need.
- **All subjects**: total marks obtained over total maximum.
- **Kerala range**: each grade is a band of marks. The lowest and highest bands average to a range, and the midpoint is the middle of that range. Grade point average is the simple average of the points.

## Worked example

Marks 92, 88, 95, 79, 85 and 70 out of 100 each. Best five are 95, 92, 88, 85 and 79, which total 439 out of 500, so 87.8%. All six total 509 out of 600, so 84.83%.

Kerala: grades A+, A, B+ give bands 90-100, 80-89 and 70-79. The range is (90+80+70) / 3 = 80 to (100+89+79) / 3 = 89.33, midpoint 84.67%; points 9, 8, 7 average 8.

## FAQs

**Does CBSE divide my marks?** No. CBSE does not officially compute an aggregate percentage; check the official source.

**Are the Kerala bands official?** They are the commonly published bands. Check the official source before using them.

**Why only a range for Kerala?** A grade stands for a band of marks, not your exact mark.

**Is my data saved?** No. Everything stays on this page.
