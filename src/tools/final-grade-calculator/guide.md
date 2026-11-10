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
  - "The A/B/C/D cut-offs (90/80/70/60) are a common default, not a rule; your school's scale may differ, so edit them."
flow:
  - { icon: pencil, label: "Your grade" }
  - { icon: percent, label: "Final weight" }
  - { icon: target, label: "Score needed" }
---

## What it does

Before a final exam, most students want one number: what do I need to score to end up with the grade I want? This calculator works it out from three things you know: your grade so far, how much the final counts towards the course, and your target. It also shows a small table with the score needed for each letter grade, so you can see what is realistic.

Everything runs in your browser and nothing is sent anywhere. To work out your grade so far from several marks, start with the [[weighted-grade-calculator]], and to turn the result into a grade point use the [[gpa-converter]].

## How to use it

1. Type your current grade as a percent.
2. Type how much the final exam is worth, as a percent of the whole course.
3. Type the course grade you are aiming for. The score you need appears straight away.
4. Change the letter cut-offs under the table if your school uses a different scale.

## What each setting does

- **Current grade**: your average on everything before the final.
- **Final exam weight**: the share of the course grade that comes from the final. 30 means the final counts for 30%.
- **Target grade**: the course grade you want at the end.
- **Letter cut-offs**: the lowest percent for A, B, C and D. They start at 90, 80, 70 and 60 and only change the table.

## Worked example

Your current grade is 82%, the final is worth 30% and you want 85%. The 70% of the course you have done gives 82 × 0.7 = 57.4 points. You need 85 − 57.4 = 27.6 more points from the final, which is 27.6 ÷ 0.3 = 92.0%. If you wanted 95% instead, you would need 125.3%, so the calculator says that is over 100% and cannot be reached with a normal final.

## FAQs

**What if the final weight is 0?** Then the final cannot change your grade, and the calculator says so instead of dividing by zero.

**Why can the needed score be below 0?** If you are already well above your target, even a zero on the final keeps it. The calculator tells you that.

**Does it round?** It shows one decimal place. Check how your teacher rounds before you rely on a borderline score.
