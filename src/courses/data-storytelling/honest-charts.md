---
title: 'Honest charts: axes, scales and other ways charts mislead'
seoTitle: 'Misleading charts: truncated axes and how to avoid them'
summary: How charts mislead, often by accident. Truncated bar axes, the lie factor, dual axes, cherry-picked periods, 3D and missing context, with an interactive axis you can drag.
minutes: 13
updated: 2026-11-22
quiz:
  - q: A bar chart axis starts at 50,000. Sales rose from 53,199 to 57,838 (8.7 %). How much taller does the second bar look?
    choices: ['About 9 %', 'About 150 %', 'Exactly the same']
    ans: 1
    why: 'The visible parts are 3,199 and 7,838: the second is about 2.5 times the first, so it looks about 150 % taller.'
  - q: What is the lie factor?
    choices: ['The size of the effect shown divided by the size of the effect in the data', 'The number of errors in a chart', 'A Power BI setting']
    ans: 0
    why: Tufte's lie factor. 1 is honest; much above 1 exaggerates.
  - q: Why are dual-axis charts risky?
    choices: ['They use two colours', 'By changing either scale you can make the lines cross or match anywhere you like', 'They are slow']
    ans: 1
    why: The apparent relationship depends on scale choices, not the data.
---

**Module 2 · about 13 minutes · read first: 2.2.** You'll be able to spot the common ways charts mislead, and keep your own charts honest.

## 1. Why this matters

A chart that exaggerates, even by accident, can lead to a bad decision, and once a manager catches one, they stop trusting your other charts. Honest charts protect your credibility. They also make you a better reader of other people's numbers, which interviewers love to test ("what's wrong with this chart?").

## 2. The idea in one picture

Drag the slider to move where the axis starts. Watch the 2025 bar seem to grow while the data stays the same.

<!--fig:axis-honesty-->

## 3. Six ways charts mislead

1. **Truncated bar axis.** Bars must start at zero. A cut axis can turn a 9 % rise into what looks like 150 %.
2. **Zooming a line too far.** Lines may start above zero, but zooming into tiny changes makes noise look like a crisis. Show enough range for context.
3. **Dual axes.** Two measures on two scales can be made to look related or unrelated at will. Prefer two charts, or index both to 100.
4. **Cherry-picked periods.** "Sales up 63 % since February" sounds great, until you notice February 2025 was the worst month. State a fair comparison (same month last year, full year).
5. **3D and area tricks.** Tilted pies, 3D bars and pictures scaled by height (which grows area by the square) all distort.
6. **Missing context.** "Up 29 %" without "including a new store" or "vs a target of +21 %" is a half-truth.

<details class="maths" open><summary>Maths and principle</summary>

**Lie factor** (Edward Tufte): size of effect shown in the graphic ÷ size of effect in the data.

With an axis starting at *m*, bars of values *a* and *b* show visible heights *a − m* and *b − m*. The change shown is (b − m)/(a − m) − 1; the real change is b/a − 1.

Falls Centre: *a* = 53,199, *b* = 57,838, real change = 8.7 %. With *m* = 50,000: shown change = 7,838/3,199 − 1 = 145 %. Lie factor = 145 / 8.7 ≈ 17.

**Physical meaning:** our eyes read the whole bar as the value. Cutting the bottom off is like measuring two people's height from their waists up: the taller one looks huge.
</details>

## 4. Worked example

*A slide says "Sunday sales double Wednesday's!" with columns starting at 50,000.* Real numbers: Sunday 86,285, Wednesday 55,998, so Sunday is 54 % higher. On the cut axis the Sunday bar looks about 6 times taller. The fix: start at zero and title it honestly: "Sunday sales are about 1.5 times Wednesday's."

## 5. Practice

1. Two bars, 40 and 44, with the axis starting at 38. How much taller does the second look, and what's the real difference?
2. A line chart of margin % runs from 48 % to 50 % on the axis. Is that dishonest?
3. Rewrite fairly: "Sales up 63 % since February!" (Feb 13,369; Mar 21,792; Mar last year 15,461.)

<details><summary>Answers</summary>

1. Visible heights 2 and 6: it looks 3 times as tall (200 % taller). Real difference: 10 %.
2. Not necessarily: lines may zoom. But label the axis clearly and ask whether a 2-point move matters; if not, show a wider range.
3. "March sales were $21.8k, up 41 % on March last year."
</details>

Next, Module 3: cutting clutter and using colour to focus attention.
