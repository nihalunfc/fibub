---
name: Weighted grade
num: 2044
shelf: everyday
code: T927
section: grades
title: "Weighted grade calculator: average your marks by weight, with letter grade"
summary: "Add each assignment or test with its score and weight and get your weighted average and letter grade. Takes percents or points like 45/50, and shows what-if grades for work still to come."
status: live
ads: false
order: 2044
icon: calculator
works: offline
updated: 2026-11-10
related: [final-grade-calculator, gpa-converter, rubric-grade-calculator]
sources:
  - "Standard weighted mean: sum of (score × weight) ÷ sum of weights. fibub's own working."
  - "The A/B/C/D cut-offs (90/80/70/60), the plus-minus scale and the UK class boundaries (70/60/50/40) are common defaults, not rules; edit them to match your school and check its official grading policy."
flow:
  - { icon: table, label: "Add items" }
  - { icon: scale, label: "Weigh" }
  - { icon: calculator, label: "Average" }
---

## What it does

Most courses weigh marks differently. Homework might be 20% of the grade, a midterm 30% and the final 50%. This calculator multiplies each score by its weight, adds them up and divides by the total weight, so you see your real course grade and its letter.

Everything runs in your browser and nothing is sent anywhere. Once you know your grade so far, the [[final-grade-calculator]] shows what you need on the final, and the [[gpa-converter]] turns a percent into a grade point.

## How to use it

1. Type each item's name, score and weight on its own row. Use **Add a row** for more and × to remove one.
2. Read your weighted average and letter grade under the rows.
3. Leave the score empty on anything not marked yet, then use **What if** to try a score for it, or type the grade you want to see what the missing items must average.
4. Open **Show the working** to see each row's share of the total, and **More options** for several scores in one row, dropping the lowest, and the letter scale.

## What each setting does

- **Score**: a percent such as 90, or points earned and possible such as 45/50 (which counts as 90%).
- **Several scores in one row**: type them separated by spaces or semicolons, such as 90 85 45/50. The row's score is their average, which suits homework or quizzes with one weight in total.
- **Drop the lowest**: removes the lowest 1 or 2 scores from every row that has several (never the last one left).
- **Weight**: how much the item counts, as a percent or in points (a trailing % is fine).
- **Weights that do not add up to 100**: the calculator divides by the total weight, so 50 and 30 work like 62.5% and 37.5% (with a note).
- **Items with no score**: left out of the average, which then covers only the marked part of the course.
- **What if**: the score you might get on every item with no score yet, and the course grade that would give.
- **I want to finish with**: the average the missing items need so that the whole course ends on your goal. It tells you plainly when that is over 100% or already safe.
- **Letter scale**: simple A to D (90, 80, 70, 60), plus and minus (A 93 down to D- 60) or UK degree classes (70, 60, 50, 40); every cut-off is editable. Below the last cut-off is F (or Fail).

## Worked example

Homework 90% (weight 20), midterm 80% (weight 30) and final 70% (weight 50): 90 × 20 + 80 × 30 + 70 × 50 = 7,700, divided by 100 is 77.0%, a C on the default scale. Without the final mark yet, the average of the rest is 4,200 ÷ 50 = 84.0%, and the what-if box shows that 70% on the final brings it to 77.0%. With only two items, 90% weighted 50 and 80% weighted 30, the total weight is 80 and the result is 86.3%.

## FAQs

**My teacher uses points, not percents. Does it still work?** Yes. Type points as 45/50 and the weight from the syllabus.

**How do I get 76% from the missing final?** Leave the final's score empty, type 80 in "I want to finish with", and the page says the final must average 76.0% in the default example.

**Is this the same as my GPA?** No. This is one course's grade. A GPA averages grade points across courses.
