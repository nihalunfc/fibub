---
name: Memory tasks
num: 727
shelf: science
section: cognitive-science
title: "Memory tasks"
summary: "Run a digit span or Corsi block test (forward or backward), a visual search task with search slopes, and simple or choice reaction time, in the browser. Get scores, a results table for the session and a CSV of every trial."
status: live
ads: true
order: 727
icon: eye
works: offline
updated: 2026-11-09
related: [reaction-time-experiments, signal-detection-calculator, neural-network-toys, reliability-analysis, sample-size, plot-maker, trend-analyser, eye-tracking-heatmap, staircase-threshold-fitter]
sources:
  - "Task designs: digit span (Jacobs 1887), Corsi block tapping (Corsi 1972) with a made-up block layout, visual search (Treisman and Gelade 1980), simple and choice reaction time (Donders 1868, Hick 1952). Corsi total score: Kessels et al. (2000)."
  - "All sequences and displays are generated at random in the page; no norms or published data are included."
flow:
  - { icon: pointer, label: "Pick task" }
  - { icon: eye, label: "Do it" }
  - { icon: table, label: "Scores" }
  - { icon: download, label: "CSV" }
---

## What it does

This page is a small battery of classic memory and attention tests for teaching cognitive psychology. A class can try each task, see their own scores at once, and download every trial to pool results and analyse them. It runs entirely in your browser: nothing is uploaded or kept after you close the page.

- **Digit span:** digits appear one per second and you type them back. **Backward** span asks for them in reverse, which also needs working memory to rearrange them.
- **Corsi blocks:** nine blocks, a few light up in turn, and you tap them in the same order. It is the visual-spatial partner of digit span.
- **Visual search:** find a T among Ls (hard) or an O among Xs (easy) in displays of different sizes. The tool fits a straight line of reaction time against the number of items and reports the **search slope** in milliseconds per item.
- **Simple and choice reaction time:** press as soon as a circle appears, or press left or right for the side it appears on.

For simple speed tests try the [[reaction-time-experiments]], and score how well people told signal from noise with the [[signal-detection-calculator]].

## How to use it

1. Pick a task and its settings: direction and start length for the span tasks; target, set sizes and trials for search; simple or choice and number of trials for reaction time.
2. Press **Start**. Use the keys shown, or tap on a phone or tablet. **Stop** or Esc ends a run without scoring it.
3. Span tasks give each length twice and stop when both tries at a length are wrong, as in the usual paper versions.
4. Read the results, then run another task. **This session** lists every completed run, and the CSV holds every trial from all of them.

## What the numbers mean

- **Span** is the longest sequence you recalled correctly at least once. The Corsi **total score** is span × number of correct trials, which separates people more finely.
- **Search slope:** the extra time each added item costs. A flat slope means the target pops out; a slope of 20 to 40 ms per item or more means you checked the items one by one. Target-absent slopes are often about twice the present slopes. r² shows how straight the line is.
- **Reaction time:** the median is shown first because a single slow trial pulls the mean up. False starts (pressing before the signal) and anticipations (faster than 100 ms) are counted and left out.
- Browser timing is approximate. Screens, keyboards and touch screens add a delay of a few to tens of milliseconds that is similar on every trial, so compare people on the same device.

## Worked example

Every run is random, so this example shows how scores are worked out rather than fixed numbers. Suppose a student gets both tries right at lengths 3 and 4, one of two at length 5, and both wrong at length 6. The test stops there: span = 5 and 5 of 8 tries are correct, so the Corsi total score would be 5 × 5 = 25. In a visual search run where mean RT rises from about 550 ms with 4 items to about 820 ms with 16 items on target-present trials, the slope is about 22 ms per item.

## Tips

- Run the easy search (O among Xs) and the hard one (T among Ls) to show the difference between pop-out and serial search.
- Try forward then backward span to compare short-term storage with working memory.
- For a class data set, have everyone download the CSV and paste the files together.

## Frequently asked questions

**Are these clinical tests?** No. They are for teaching and demonstration. No norms are given, and the block layout is made up.

**Where are my results kept?** Only in this page. Download the CSV before closing it.

**Was the maths checked?** Yes: search slopes against SciPy's linear regression, and the reaction time summaries against NumPy.
