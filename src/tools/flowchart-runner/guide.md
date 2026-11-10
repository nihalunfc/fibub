---
name: Flowchart runner
num: 1293
shelf: learn
code: L174
section: school-maths
title: "Flowchart runner: follow six classic flowcharts box by box with a trace table"
summary: "Pick a flowchart (even or odd, largest of three, add 1 to n, Euclid's HCF, leap year, steps to 1), type the inputs and follow it one box at a time. The current box lights up, the arrow taken is marked, and a trace table records every variable. Ends with predict-the-output questions."
status: live
ads: false
order: 1293
icon: pointer
works: offline
updated: 2026-11-09
related: [algorithm-stepper, hcf-lcm-venn, venn-diagram]
sources:
  - "Flowchart symbols and the six algorithms (parity, maximum of three, sum of 1 to n, Euclid's algorithm, the Gregorian leap-year rule and the Collatz sequence) are standard. Wording, charts and examples are fibub's own."
  - "Checked against Python: n(n+1)/2, math.gcd, calendar.isleap, max() and Collatz step counts for 1 to 1000."
flow:
  - { icon: pointer, label: "Pick chart" }
  - { icon: pencil, label: "Inputs" }
  - { icon: sliders, label: "Step" }
  - { icon: table, label: "Trace" }
---

## What it does

A **flowchart** is an algorithm drawn as a picture: boxes for the steps and arrows for the order. This page has six classic flowcharts that you can run with your own numbers, one box at a time:

- **Even or odd:** one decision, two paths.
- **Largest of three:** decisions inside decisions. Two questions always find the biggest.
- **Add 1 to n:** a loop. The arrow goes back up to the diamond until the answer to "i ≤ n?" is no.
- **Euclid's HCF:** the same loop idea, replacing (a, b) by (b, a mod b) until b is 0.
- **Leap year:** a chain of questions where the order matters (divisible by 400, then by 100, then by 4).
- **Steps to 1:** halve even numbers, triple and add 1 to odd ones, and count the steps (the famous Collatz question, still unproved).

As you step, the current box lights up, the arrow just taken is highlighted, the variables are shown, and a **trace table** records every box visited with the variables after it. That table is exactly what you would write by hand to check an algorithm.

It fits the Class 9 mathematics chapter on algorithms (step-by-step methods and flowcharts). To watch sorting and searching step by step, see the [[algorithm-stepper]]; Euclid's algorithm is drawn as factor trees and a Venn picture in [[hcf-lcm-venn]].

## How to use it

1. Choose a flowchart from the list. A line under it says what it shows.
2. Type the inputs (whole numbers). The run is worked out at once and sits at the Start box.
3. Press **Step** to move one box, **Back** to go back, **Play** to run it on its own, or **To the end** to jump to Stop.
4. Watch the variables and the output, and scroll the trace table.

The shapes: a rounded box is Start or Stop, a slanted box is input or output, a rectangle is a process ("s ← s + i" means "s becomes s + i"), and a diamond is a yes-or-no decision.

## A worked example

**Add 1 to n** with n = 5. After Start and "Read n", the process box sets s = 0 and i = 1. The diamond asks "i ≤ n?": 1 ≤ 5, yes, so s becomes 1 and i becomes 2, and the arrow goes back up. This repeats for i = 2, 3, 4 and 5, making s = 3, 6, 10 and 15. When i = 6 the answer is no, so the chart says **15** and stops. The diamond was visited 6 times (5 yes and 1 no), and the whole run is 21 boxes.

**Euclid's HCF** with 168 and 60: (168, 60) → (60, 48) → (48, 12) → (12, 0), so it says **12**. **Leap year** with 1900: 400 does not divide it, but 100 does, so it says **not a leap year**, even though 4 divides 1900.

## Check yourself

Four fresh questions each time: the output of "Add 1 to n", how many times its diamond is visited, the output of Euclid's HCF, and the number of steps to 1 for a small number. Work them out in your head or on paper, then run the chart to check. Nothing is saved.

## FAQ

**Why does the leap-year chart ask about 400 first?** Every year divisible by 400 is also divisible by 100. If the 100 question came first, 2000 would wrongly be called "not leap".

**What happens with a negative n in "Add 1 to n"?** It needs n from 0 to 200 on this page. With n = 0 the diamond says no straight away and the output is 0.

**Is this from the NCERT book?** It covers the same topic with fibub's own charts and examples. fibub is not part of NCERT.
