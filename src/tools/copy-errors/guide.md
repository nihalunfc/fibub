---
name: Copying errors
num: 1487
shelf: learn
section: school-biology
title: "Copying errors: how mistakes in copying DNA create variation over generations"
summary: "Copy a 60-base DNA string again and again with a small chance of a wrong base each time, and watch the changes pile up. Compare the average with length times rate times generations."
status: live
ads: false
order: 1487
icon: sliders
works: offline
updated: 2026-11-10
related: [central-dogma, natural-selection]
sources:
  - "Variation from small copying errors in DNA, and the rule of thumb expected changes = length x error rate x generations, are standard school biology and probability. The exact average for Class 11 is 3/4 x length x (1 - (1 - 4p/3)^g), checked in the tests."
  - "A teaching model: the string is short and random, and real error rates are far smaller and are mostly fixed by repair enzymes. Drawings are fibub's own. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: sliders, label: "Rate" }
  - { icon: clock, label: "Generations" }
  - { icon: curve, label: "See" }
  - { icon: check, label: "Check" }
---

## What it does

Before a cell divides, it copies its DNA. The copying is very accurate, but not perfect: now and then a wrong base goes in. The next copy is made from the changed string, so the change is passed on, and new errors add to it. Over many generations small changes build up, and this is one source of the **variation** that natural selection works on.

This page copies a short string of 60 bases (A, T, G, C) over up to 20 generations. Changed bases are coloured so you can see exactly where they are. It is a teaching model with a far higher error rate than real cells have. See also [[central-dogma]] for what the DNA does and [[natural-selection]] for what happens to the variation.

## How to use it

1. Set the **error chance per base** (0 to 5 %) and the number of **generations**.
2. Read the rows from top (the original) to bottom (the latest copy).
3. Press **Copy again** for a fresh random string and fresh errors.
4. Press **Run 500 times** to average many experiments.

## What each setting does

- **Error chance per base**: how likely each single base is to be copied wrongly. A wrong base is always one of the other three.
- **Generations**: how many times the string is copied in a row, each copy made from the one before.
- **Class 11**: shows the exact average, which allows for a base being hit twice and changing back.

## Worked example

With 60 bases, a 1 % error chance and 5 generations, the rule of thumb gives 60 × 0.01 × 5 = 3 changes on average. A single run might show 1 or 5, but the 500-run average lands close to 3 (the exact formula gives about 2.9).

## FAQs

**If the rate is 0, is there any variation?** Not from copying. Every copy is the same.

**Are all changes bad?** No. Most do nothing noticeable, some harm, and a few help.

**Do real cells make this many errors?** No. Real error rates are around one in a billion per base after repair, so this page exaggerates to make the idea visible.
