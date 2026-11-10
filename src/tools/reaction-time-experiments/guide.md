---
name: Reaction time experiments
num: 722
shelf: science
code: T490
section: psychology-and-psychometrics
title: "Stroop test, flanker task and n-back online: reaction time experiment with CSV download (free)"
summary: "Run a Stroop, Eriksen flanker or n-back task in your browser with keys or touch. Get mean and median reaction times on correct trials, accuracy, the congruency effect or n-back d′, with trimming rules and a CSV of every trial."
status: live
ads: true
order: 722
icon: clock
works: offline
updated: 2026-11-09
related: [reliability-analysis, sample-size, plot-maker, data-cleaner, staircase-threshold-fitter, eye-tracking-heatmap, memory-attention-tasks, signal-detection-calculator, hypothesis-tests, effect-size-converter]
sources:
  - "Task designs: Stroop (1935), Eriksen and Eriksen (1974) flanker task, Kirchner (1958) n-back. Trial lists are generated at random in the page."
  - "Summary formulas: standard descriptive statistics; n-back d′ with the log-linear correction (Hautus 1995)."
flow:
  - { icon: pointer, label: "Pick task" }
  - { icon: clock, label: "Run trials" }
  - { icon: sigma, label: "RT summary" }
  - { icon: download, label: "CSV" }
---

## What it does

This page runs three classic attention and memory experiments in your browser, times every answer and summarises the results the way a psychology lab report needs them. It is meant for class demonstrations, student practicals and trying out a design before building it in lab software. Nothing is uploaded or stored: the trials live in the page until you close or reload it, and you can download them as a CSV first.

- **Stroop:** a colour word (RED, GREEN, BLUE, YELLOW) appears in coloured ink and you name the ink. When the word and ink disagree (incongruent), most people are slower and make more errors.
- **Flanker:** five arrows appear and you answer the direction of the middle one. Neighbours pointing the other way slow you down.
- **N-back:** letters appear one at a time and you press Space when a letter is the same as the one 1, 2 or 3 places back.

Compare conditions across people with the [[hypothesis-tests|hypothesis tests]], and report the size of the effect with the [[effect-size-converter|effect size converter]].

## How to use it

1. Pick a task and set the number of trials. For Stroop and flanker, choose the share of congruent trials (50 % is usual; a low share makes the effect bigger). For n-back, choose N, the share of targets and the pace.
2. Press **Start**. On a computer, answer with the keys shown (R, G, B, Y for Stroop; the left and right arrow keys or F and J for flanker; Space for n-back). On a phone or tablet, tap the buttons under the screen. Esc or **Stop** ends a run early and keeps the trials done so far.
3. Each Stroop and flanker trial shows a + for half a second, then the stimulus until you answer or 2 seconds pass. An n-back letter shows for half a second and you can answer until the next one.
4. Read the summary, change the trimming rules if you like, and download the trials as CSV or the summary as an image, PDF or Word file.

## What the numbers mean

- **Reaction time (RT)** is measured from the frame in which the stimulus was drawn to the key press or touch, using the browser's high-resolution clock. It is approximate: screens, keyboards and touch screens add a delay of a few to a few tens of milliseconds. That delay is about the same on every trial, so **differences between conditions** are much more reliable than single times.
- Mean and median RT use **correct trials only**. Answers faster than the fastest RT kept (150 ms by default) are treated as anticipations, and slower than the slowest kept (3000 ms) as lapses. The optional SD rule also drops RTs more than 2, 2.5 or 3 standard deviations from their condition's mean.
- The **congruency effect** is the mean RT on incongruent trials minus congruent trials. The table also gives medians, SDs and accuracy for each condition.
- For n-back, **d′** compares hits (Space on a target) with false alarms (Space on a non-target), with 0.5 added to each count so a perfect score still gives a finite value. The first N letters cannot be targets and are left out.

## Worked example

Every run uses a fresh random order, so your numbers will differ. In a typical 40-trial Stroop run with 50 % congruent trials, a student might average about 650 ms on congruent and 720 ms on incongruent trials, a Stroop effect of about 70 ms, with 95 % correct. The summary shows "Stroop effect = 70 ms", the table lists both conditions, and the chart plots each trial's RT so slow outliers stand out.

## Tips

- Practise with 8 trials first, then do a real run of 40 to 100.
- Use the same device for everyone you compare, and close other tabs.
- The Stroop task needs colour vision; use the flanker task for anyone who finds the colours hard to tell apart.

## Frequently asked questions

**Is it accurate enough for research?** For teaching and pilot work, yes. Published studies usually use dedicated software with checked display timing.

**Where are my results kept?** Only in this page. Reloading clears them, so download the CSV first.

**Was the maths checked?** Yes. The summary statistics were compared with pandas and the n-back d′ with SciPy.
