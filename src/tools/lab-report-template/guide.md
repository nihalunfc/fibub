---
name: Lab report
num: 826
shelf: science
section: teaching-and-outreach
title: "Lab report"
summary: "Build a lab report skeleton with prompts for every section and a checklist for figures and tables, then a marking rubric of criteria and levels with weights. Mark a report and get the weighted score. Download the template or the rubric as Word, PDF or Markdown, and save a rubric to use again."
status: live
ads: true
order: 826
icon: resume
works: offline
updated: 2026-11-09
related: [practice-problems, uncertainty-calculator, plot-maker, flashcards, rubric-grade-calculator, sig-fig-checker, figure-checker, abstract-word-counter]
sources:
  - "The section prompts, the figure and table checklist, the example rubric and its level descriptions are written by fibub from common practice in science teaching; no school, exam board or university rubric is copied."
  - "The score is a weighted mean, checked against NumPy on 500 random rubrics."
  - "Nothing you type is stored or sent. A rubric is saved only as a file you download."
flow:
  - { icon: resume, label: "Sections" }
  - { icon: check, label: "Checklist" }
  - { icon: table, label: "Rubric" }
  - { icon: download, label: "Download" }
---

## What it does

A good lab report follows a pattern, and students write better ones when they know what each part needs. Teachers mark better when the rubric is clear before anyone starts writing. This page builds both, in your browser:

- **A report template.** Choose a *School practical* (aim, hypothesis, variables, equipment, safety, method, results, analysis, conclusion, evaluation), a *University lab report* (abstract, introduction, materials and methods, results, discussion, conclusion, references, appendices) or a *Short report* of one page. Each section comes with prompts that say what belongs there. Rename, reorder, untick or add sections, and rewrite any prompt.
- **A figure and table checklist.** List the figures and tables you plan, and tick the checks to include: numbers and captions, axis labels with units, error bars explained, the number of repeats, consistent decimal places, colours that work in black and white.
- **A marking rubric.** Criteria down the side, levels across the top (Excellent, Good, Developing, Beginning in the example), a description in every cell and a weight for every criterion. Add, remove, rename and reorder them.
- **A score.** Pick a level for each criterion and the page works out the weighted score as a percentage and as marks out of the total you set.
- **Downloads.** The template and the rubric each download as Word, PDF or Markdown. Save the rubric as a small .json file to open it again next term.

Draw the graphs for your report with the [[plot-maker]], and work out the error in each result with the [[uncertainty-calculator]].

## How the score works

Each level has points; the top level's points are the most a criterion can earn. A criterion's share of the score is its weight divided by the sum of all weights, so weights of 20 and 10 behave exactly like 2 and 1. A criterion adds its share times its level's points over the top points. With the example rubric, a report that earns *Good* (3 of 4 points) on the three criteria weighted 20 and *Excellent* on everything else scores 100 − 3 × 20 × (1 − 3/4) = **85 %**, or **42.5 out of 50**. While only some criteria are marked, the page shows the running score over the criteria marked so far and says how many are left.

## How to use it

1. **Report.** Pick the kind of report and fill in the title, author, course and date.
2. **Sections.** Untick what you do not need, edit the prompts, and use the arrows to move sections.
3. **Figures and tables.** List what you plan to show and keep the checks you want. Download the template and write your report in it.
4. **Rubric.** Edit the levels, criteria, weights and descriptions. A red message says if something would make the score unfair, such as no levels with points.
5. **Score.** Choose a mark for each criterion, set the total marks, and download the marked rubric for the student.

## Worked example

Open the page and leave the example rubric as it is. Set the mark for *Results presentation*, *Analysis* and *Discussion and evaluation* to *Good (3)* and every other criterion to *Excellent (4)*. The Score card shows **85 %, 42.5 out of 50**, and its table lists each criterion's weight (10 %, 15 %, 20 %, 20 %, 20 %, 5 %, 10 %), mark and what it adds (15 % for each of the three *Good* criteria). Mark only the first two criteria, *Excellent* and *Beginning*, and the page shows **55 % (2 of 7 criteria marked so far)**: (10 × 4/4 + 15 × 1/4) ÷ 25.

## Tips

- Give students the rubric with the template, so they know how they will be marked.
- Keep the level descriptions about what the work shows, not about effort.
- For a lab with no hypothesis (a measurement or a preparation), untick *Hypothesis* and rewrite the first criterion.
- Markdown suits a course website or a Git repository; Word suits editing; PDF suits printing.

## FAQ

**Is anything saved?** No. Leaving the page forgets your edits. Save the rubric as a .json file if you want it again; it stays on your device.

**Do the weights have to add up to 100?** No. They are scaled to 100 %, and the Score table shows each criterion's share.

**Can a level be worth 0 points?** Yes, for work that is missing. At least one level needs more than 0.

**Is this an official rubric?** No. The wording is fibub's own example. Change it to match your course, school or exam board.
