---
name: Margin of error
num: 2233
shelf: learn
code: L333
section: school-maths
title: "Margin of error: polls, sample size and the 95% rule"
summary: "Run 100 pretend polls of the same town and see how often the margin of error catches the true share. Change the sample size and the true percentage to see why bigger polls are more precise, but only by the square root."
status: live
ads: false
order: 2233
icon: chart
works: offline
updated: 2026-11-16
related: [normal-curve-lab, hypothesis-tests, sample-space]
sources:
  - "The margin of error for a sample proportion, 1.96 × √(p̂(1 − p̂) ÷ n), and the worst-case sample size are standard statistics (Common Core HS-S-IC.4 to 6). Checked against hand-worked values in tests/sci.mjs. Polls are simulated with a normal approximation, so nothing real is shown."
flow:
  - { icon: sliders, label: "Share, n" }
  - { icon: target, label: "Run polls" }
  - { icon: chart, label: "Bars" }
  - { icon: check, label: "Quiz" }
---

## What it does

When a poll asks 400 people instead of everyone, its answer is only an estimate. The **margin of error** says how far the estimate is likely to be from the truth, and "95%" means that if you ran the poll again and again, about 95 out of 100 of the bars would reach the true share. This page lets you do exactly that, 100 polls at a time, and count how many bars miss.

Each row on the graph is one poll: a dot for what it found and a bar for its margin of error. Bars that miss the true share (the orange line) turn red. The size of the margin depends on how many people you ask and on the share itself. See [[normal-curve-lab]] for the bell curve behind the rule and [[hypothesis-tests]] for the next step.

## How to use it

1. Set the true share saying yes (say 50%) and the number of people asked.
2. Look at the margin of error in the sentence under the graph.
3. Press "Run 100 new polls" and read how many bars caught the true share.
4. Change n and run again. Watch the bars get narrower or wider.
5. Answer the quiz questions at the bottom.

## What each setting does

- **True share saying yes:** the real percentage in the whole town.
- **People asked (n):** the sample size. More people means narrower bars.
- **Run 100 new polls:** redraws with a new random sample for every poll.

## Worked example

A poll of 1,000 people finds 50% yes. The margin is 1.96 × √(0.5 × 0.5 ÷ 1000) = 0.031, so about ±3.1 points. To get ±3% in the worst case you need n = (1.96 ÷ 0.06)² ≈ 1,068 people. To halve the margin you need four times as many people.

## FAQs

**Does the margin cover bad questions or people who do not answer?** No. It only covers the chance variation from sampling.

**Why do about 5 bars miss?** A 95% rule is wrong 5 times in 100 by design.

**Why use 1.96?** It is the number of standard deviations that holds the middle 95% of a normal curve.
