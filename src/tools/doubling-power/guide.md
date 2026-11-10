---
name: Power of doubling
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
updated: 2026-11-09
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

Doubling looks slow at first and then runs away from you. This page lets you feel that with two classic puzzles:

- **Fold paper.** A sheet 0.1 mm thick, folded in half n times, has 2ⁿ layers and is 0.1 mm × 2ⁿ thick. Slide n and watch a marker climb a ladder of heights, from a fingernail to Mount Everest, the Moon and beyond. Every step on the ladder is ten times the one below (a *log scale*), so a curve that shoots off any ordinary graph climbs it in a straight, steady line.
- **Chessboard grains.** One grain on the first square, two on the next, four on the next, and so on. Tap any square to see how many grains it holds and how many are on all the squares up to it, counted exactly, with a rough mass of the whole pile.

A **Level** switch adds the Class 11 view: the sum 1 + 2 + 4 + … as a geometric series, and the number of folds worked out with log₂.

It fits Class 8 Mathematics, *power play* (exponents, powers, very large numbers and paper folding), and Class 11 *sequences and series* (geometric progressions) and logarithms. For more on sequences, try the [[ap-explorer]]; for the rules that make powers easy to handle, [[exponent-laws]]; and for doubling in living things, [[population-growth-models]].

## How to use it

1. Pick **Fold paper** or **Chessboard grains**.
2. Fold paper: drag the **n** slider (or type up to 100 folds). Change the sheet thickness if your paper is thicker. The side view shows the layers while there are 64 or fewer; after that there are too many to draw. Landmarks you have passed turn green with a tick.
3. Chessboard: tap a square or slide **k**. Squares up to k are shaded, darker for more grains. Change the grain mass if you like.
4. Read the formula lines: they always show the live numbers.

## A worked example

The page starts at 10 folds of a 0.1 mm sheet: 2¹⁰ = 1,024 layers, 0.1 mm × 1,024 = 10.24 cm, about the width of a hand. To pass a person (1.7 m) you need 15 folds (2¹⁵ × 0.1 mm = 3.28 m), and the Moon at 384,400 km needs just 42 folds: 2⁴² × 0.1 mm is 439,805 km, while 41 folds give only about 220,000 km. In the Class 11 view: n ≥ log₂(3.844 × 10⁸ m ÷ 10⁻⁴ m) = log₂(3.84 × 10¹²) ≈ 41.8, so n = 42.

On the chessboard, square 10 holds 2⁹ = 512 grains and squares 1 to 10 hold 2¹⁰ − 1 = 1,023. Square 64 alone holds 2⁶³ = 9,223,372,036,854,775,808 grains, and the whole board holds 2⁶⁴ − 1 = 18,446,744,073,709,551,615: at 0.02 g a grain, about 3.7 × 10¹¹ tonnes.

## Why the total is always one less than the next square

1 + 2 = 3 = 4 − 1. Add 4 and you get 7 = 8 − 1. Each new square doubles, and the total so far was always one short of it, so the pattern carries on: 1 + 2 + … + 2ᵏ⁻¹ = 2ᵏ − 1.

## Check yourself

Four fresh questions each time: thickness after some folds, grains on one square, grains on several squares, and the fewest folds to pass a height. Type a number, press **Check**, and open the worked answer if you need it. Nothing is saved.

## FAQ

**Can you really fold paper 42 times?** No. Real paper stops at about 7 or 8 folds because each fold needs a longer strip and more force. The puzzle is about the maths of doubling, not about real paper.

**Why do the counts stay exact on the chessboard?** The page uses whole-number arithmetic with no rounding, so even 2⁶⁴ − 1 is shown digit for digit.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
