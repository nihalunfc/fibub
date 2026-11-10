---
name: Doubling power
num: 1234
shelf: learn
section: school-maths
title: "Power of doubling: fold paper to the Moon and fill a chessboard with grains"
summary: "Fold a sheet of paper again and again and watch its thickness climb a ladder from a fingernail to the Moon, or put 1, 2, 4, 8 grains on a chessboard and see the exact total. Exponents and exponential growth, live."
status: live
ads: false
order: 1234
icon: chart
works: offline
updated: 2026-11-10
related: [ap-explorer, exponent-laws, population-growth-models, cell-doubling-time]
sources:
  - "Powers of 2, exponential growth and the sum of a geometric series are standard mathematics. The paper-folding and chessboard puzzles are old folk puzzles. Wording, pictures and examples are fibub's own."
  - "Ladder heights are well-known round figures: Qutub Minar about 73 m, Mount Everest 8,849 m, the space station about 400 km up, the Moon's average distance 384,400 km, 1 astronomical unit about 150 million km, Proxima Centauri about 4.2 light years. A grain of rice at 0.02 g is a rough round figure you can change."
  - "Checked against Python's exact integers (2**k and 2**k − 1 for every square 1 to 64) and math.log2 for the folds needed to pass each landmark."
flow:
  - { icon: pencil, label: "Fold or fill" }
  - { icon: sliders, label: "Slide n" }
  - { icon: chart, label: "It grows" }
  - { icon: check, label: "Check" }
---

## What it does

Doubling looks slow at first and then runs away. Two classic puzzles show it:

- **Fold paper.** A 0.1 mm sheet folded n times has 2ⁿ layers. Slide n and watch a marker climb a ladder of heights, from a fingernail to Everest, the Moon and beyond. Each step is ten times the one below (a *log scale*).
- **Chessboard grains.** 1 grain on square one, 2 on the next, 4 on the next. Tap a square to see its grains and the running total, counted exactly.

A **Level** switch adds the Class 11 view: the geometric series 1 + 2 + 4 + … and the folds worked out with log₂.

It fits Class 8 Mathematics, *power play* (powers and very large numbers). Related: [[exponent-laws]] for the rules of powers, [[ap-explorer]] for sequences, and [[population-growth-models]] for doubling in living things.

## How to use it

1. Pick **Fold paper** or **Chessboard grains**.
2. Fold paper: drag **n** (up to 100) and change the thickness if you like. Landmarks you pass turn green.
3. Chessboard: tap a square or slide **k**.
4. Read the formula lines; they show the live numbers.

## A worked example

At 10 folds: 2¹⁰ = 1,024 layers, 0.1 mm × 1,024 = 10.24 cm. The Moon (384,400 km) needs just 42 folds: 2⁴² × 0.1 mm = 439,805 km, while 41 folds give about 220,000 km. With logs: n ≥ log₂(3.84 × 10¹²) ≈ 41.8, so n = 42.

On the board, square 10 holds 2⁹ = 512 grains and squares 1 to 10 hold 2¹⁰ − 1 = 1,023. The whole board holds 2⁶⁴ − 1 = 18,446,744,073,709,551,615 grains.

## Check yourself

Four fresh questions each time: thickness after folds, grains on a square, grains on several squares, and the fewest folds to pass a height. Press **Check**; open the worked answer if needed. Nothing is saved.

## FAQ

**Can you really fold paper 42 times?** No. Real paper stops at about 7 or 8 folds. The puzzle is about the maths.

**Why are the counts exact?** The page uses whole-number arithmetic with no rounding.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
