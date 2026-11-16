---
name: Final grade
num: 2043
shelf: everyday
code: T926
section: grades
title: "Final grade calculator: what score do I need on my final exam?"
summary: "Type your current grade, how much the final exam counts and the grade you want, and see the score you need on the final, plus a table for every letter grade."
status: live
ads: false
order: 2043
icon: target
works: offline
updated: 2026-11-10
related: [weighted-grade-calculator, gpa-converter, rubric-grade-calculator]
sources:
  - "Standard weighted-average formula: needed = (target − current × (1 − weight)) ÷ weight. fibub's own working."
  - "The A/B/C/D cut-offs (90/80/70/60), the plus-minus scale and the UK class boundaries (70/60/50/40) are common defaults, not rules; your school's or university's scale may differ, so edit them and check your official grading policy."
flow:
  - { icon: pencil, label: "Your grade" }
  - { icon: percent, label: "Final weight" }
  - { icon: target, label: "Score needed" }
---

## What it does

Before a final exam, most students want one number: what do I need to score to end up with the grade I want? This calculator works it out from three things you know: your grade so far, how much the final counts towards the course, and your target. It also shows a small table with the score needed for each letter grade, so you can see what is realistic.

It shows the working, a small chart of the course grade for every possible final score, and a table with a choice of letter scales. Everything runs in your browser and nothing is sent anywhere. To work out your grade so far from several marks, start with the [[weighted-grade-calculator]], and to turn the result into a grade point use the [[gpa-converter]].

## How to use it

1. Type your current grade as a percent.
2. Type how much the final exam is worth, as a percent of the whole course.
3. Type the course grade you are aiming for, or drag the slider below it. The score you need appears straight away, with the working under it.
4. Pick a letter scale under the table (simple A to D, plus and minus, or UK degree classes) and change the cut-offs if your school uses different ones.
5. Under More options, type a score you expect on the final to see the course grade it would give, or type the exam's points to see the points you need.

## What each setting does

- **Current grade**: your average on everything before the final.
- **Final exam weight**: the share of the course grade that comes from the final. 30 means the final counts for 30%.
- **Target grade**: the course grade you want at the end.
- **Target slider**: moves the target between 50 and 100; typing a target moves the slider too.
- **If I score this on the final**: the course grade and letter you would end with for a score you choose.
- **Final is out of (points)**: shows the needed score as points too, rounded up to a tenth of a point.
- **Chart**: the line is your course grade for every final score from 0% to 100%; the dashed line is your target and the dot is the score where they meet.
- **Letter scale**: simple A to D (90, 80, 70, 60), plus and minus (A 93, A- 90, B+ 87, B 83, B- 80, C+ 77, C 73, C- 70, D+ 67, D 63, D- 60) or UK degree classes (70, 60, 50, 40). They are common defaults, not rules. The cut-offs are editable and only change the table and the letter.

## Worked example

Your current grade is 82%, the final is worth 30% and you want 85%. The 70% of the course you have done gives 82 × 0.7 = 57.4 points. You need 85 − 57.4 = 27.6 more points from the final, which is 27.6 ÷ 0.3 = 92.0%. If you wanted 95% instead, you would need 125.3%, so the calculator says that is over 100% and cannot be reached with a normal final.

## FAQs

**What if the final weight is 0?** Then the final cannot change your grade, and the calculator says so instead of dividing by zero.

**Why can the needed score be below 0?** If you are already well above your target, even a zero on the final keeps it. The calculator tells you that.

**Does it round?** It shows one decimal place. Check how your teacher rounds before you rely on a borderline score.
