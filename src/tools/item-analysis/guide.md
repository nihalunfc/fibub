---
name: Item analysis
num: 764
shelf: science
section: education-research
title: "Test item analysis calculator: difficulty, discrimination index, point-biserial, KR-20, distractors (free)"
summary: "Analyse a multiple-choice or right/wrong test in your browser: item difficulty, the upper-lower discrimination index, point-biserial and corrected item-total correlations, KR-20 reliability and a distractor table for every question."
status: live
ads: false
order: 764
icon: check
works: offline
updated: 2026-11-09
related: [reliability-analysis, data-cleaner, plot-maker, sample-size, irt-item-analysis, effect-size-learning-gain]
sources:
  - "Methods: classical test theory; Kelley (1939) 27 % groups; Kuder and Richardson (1937) KR-20 and KR-21; Ebel and Frisbie's guide for the discrimination index."
  - "Example data: made up for this page."
flow:
  - { icon: table, label: "Paste" }
  - { icon: check, label: "Key" }
  - { icon: sigma, label: "Analyse" }
  - { icon: download, label: "CSV" }
---

## What it does

After a test, item analysis tells you which questions worked: which were too easy or too hard, which separated students who know the material from those who do not, and which wrong options (distractors) did their job. This tool does the standard classical test theory analysis from a pasted table of answers, the way exam boards and teacher-education courses describe it. Everything runs in your browser, so student results never leave your computer.

## How to use it

1. **Choose your data type.** *Answers and a key*: paste the letters (or any short codes) students chose, one row per student and one column per question. *Scored 1 or 0*: paste right/wrong scores.
2. **Give the key** in a row whose first cell is `Key`, or type it in the Answer key box (for example `BDACABCDBA` or `B, D, A, C`). Blank answers count as wrong.
3. **Upper and lower groups**: 27 % is the classic choice (Kelley); 25 %, 33 % and 50 % are also used.
4. Read the item table, pick a question to see its distractors, and download the item statistics or the students' scores as CSV, or the full report with every distractor table.

## What the numbers mean

- **Difficulty p** is the share who got the question right. Between about 0.3 and 0.8 is typical for a class test; below 0.2 is marked very hard and above 0.9 very easy.
- **D** (discrimination index) is p in the top group minus p in the bottom group. Ebel's guide: 0.40 and up very good, 0.30 to 0.39 good, 0.20 to 0.29 marginal, below 0.20 poor.
- **Point-biserial** is the correlation between getting the question right and the total score. The **corrected r** leaves the question out of the total, which is fairer for short tests. A negative value usually means a wrong key.
- **KR-20** is the reliability of the whole test (the same as Cronbach's alpha for right/wrong items). **KR-20 if dropped** shows whether a question pulls it down. The **standard error of measurement** is SD × √(1 − KR-20).
- **Distractors**: a good wrong option is chosen more by the lower group and has a negative correlation with the total. One that nobody picks, or that attracts strong students, should be rewritten.

## Worked example

The made-up example has 30 students and 10 questions. The mean score is 4.30 of 10 (SD 2.60), KR-20 is 0.761 and the standard error of measurement is 1.27 marks. With 27 % groups, the top and bottom groups have 8 students each. Q1 is easy (p = 0.83) and still discriminates (D = 0.50). Q7 is very hard (p = 0.13). Dropping Q3 would raise KR-20 to 0.768, so it is marked. For Q10, the key A was chosen by 88 % of the upper group and none of the lower group, while B and C drew mostly weaker students: the distractors work.

## Tips

- With fewer than about 30 students, treat the numbers as rough guides, not verdicts.
- Look at the question itself before dropping it: a hard question on an important topic may still belong in the test.
- A negative corrected r on a question is the first thing to check: the key is often wrong.

## Frequently asked questions

**How are ties at the 27 % cut handled?** Students are ranked by total score, and those tied at the cut are taken in list order, so the groups are always exactly the stated size.

**Can I use true/false or text answers?** Yes. Any short codes work, such as T and F.

**Is my data sent anywhere?** No. Everything runs in your browser and the page keeps working offline.
