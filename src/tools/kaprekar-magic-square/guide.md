---
name: Kaprekar magic squares
num: 1240
shelf: learn
code: L125
section: school-maths
title: "Kaprekar's constant 6174 and a magic square maker: number play you can watch"
summary: "Run Kaprekar's routine on any 4-digit number and watch it land on 6174 (or 495 for 3 digits), with a chart of how many steps every start needs. Then build 3 × 3, 4 × 4 and 5 × 5 magic squares one number at a time."
status: live
ads: false
order: 1240
icon: table
works: offline
updated: 2026-11-10
related: [divisibility-tests, number-theory-toolkit, hcf-lcm-venn]
sources:
  - "Kaprekar's routine (D. R. Kaprekar, 1949), the Lo Shu square, the up-and-right (de la Loubère) method for odd magic squares and the diagonal method for 4 × 4 are standard recreational mathematics. Wording, pictures and examples are fibub's own."
  - "Checked against a Python brute force over every start 0000 to 9999 (steps to 6174: 0:1, 1:383, 2:576, 3:2400, 4:1272, 5:1518, 6:1656, 7:2184) and 000 to 999 (steps to 495, at most 6); every square is checked for equal row, column and diagonal sums."
flow:
  - { icon: pencil, label: "Pick a start" }
  - { icon: convert, label: "Repeat" }
  - { icon: table, label: "Magic square" }
  - { icon: check, label: "Check" }
---

## What it does

**Kaprekar's routine.** Take a 4-digit number whose digits are not all the same. Arrange its digits from biggest to smallest and from smallest to biggest, and take the smaller number from the bigger. Repeat with the answer. Whatever you start with, you reach **6174** in at most 7 steps, and then you are stuck: 7641 − 1467 = 6174. With 3 digits the same thing happens with **495**. The page lists every step and charts how many steps each start needs.

**Magic squares.** In a magic square every row, column and diagonal adds to the same number, the **magic constant**. The maker builds them one number at a time with a slider:

- **3 × 3 and 5 × 5**: the up-and-right method. Put 1 in the middle of the top row; move one up and one right (wrapping round the edges), or one down if taken.
- **4 × 4**: write 1 to 16 in order, then swap every number on the two diagonals for 17 minus it.

Tap two cells to swap them and see the sums break.

It fits Class 8 Mathematics, *number play* (number puzzles, magic squares and Kaprekar's constant). For more digit tricks, try the [[divisibility-tests]] machine; for more number properties, the [[number-theory-toolkit]].

## How to use it

1. Choose **Kaprekar 6174** or **Magic squares**.
2. Kaprekar: type a start number or press **Random number**. Switch to 3 digits for 495.
3. Magic squares: pick a size, then slide **k** from 0 to watch the numbers go in. At the end, the sums appear (green when they match).
4. Change **Start with** and **Go up in steps of**, or tap two cells to swap them.

## A worked example

The page starts with 3524: 5432 − 2345 = 3087, then 8730 − 0378 = 8352, then 8532 − 2358 = 6174, so it takes 3 steps.

The 3 × 3 square comes out as 8 1 6 / 3 5 7 / 4 9 2. The numbers 1 to 9 add to 45, shared by 3 rows, so each line adds to 15. For sizes 3, 4 and 5 the constant is 15, 34 and 65.

## Check yourself

Five fresh questions on Kaprekar steps and magic constants. Type a number and press **Check**.

## FAQ

**Why must the digits not all be the same?** 1111 − 1111 = 0, and the routine stays at 0.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
