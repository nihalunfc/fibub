---
name: Kaprekar 6174 and magic square maker
num: 1240
shelf: learn
section: school-maths
title: "Kaprekar's constant 6174 and a magic square maker: number play you can watch"
summary: "Run Kaprekar's routine on any 4-digit number and watch it land on 6174 (or 495 for 3 digits), with a chart of how many steps every start needs. Then build 3 × 3, 4 × 4 and 5 × 5 magic squares one number at a time."
status: live
ads: false
order: 1240
icon: table
works: offline
updated: 2026-11-09
related: [divisibility-tests, number-systems, hcf-lcm-venn]
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

Two number puzzles that look like magic until you see how they work.

**Kaprekar's routine.** Take a 4-digit number whose digits are not all the same. Arrange its digits from biggest to smallest and from smallest to biggest, and take the smaller number from the bigger. Repeat with the answer. Whatever you start with, you reach **6174** in at most 7 steps, and then you are stuck: 7641 − 1467 = 6174. With 3 digits the same thing happens with **495**. The page lists every step and draws a chart of how many steps all the possible starts need, with your number's bar highlighted.

**Magic squares.** In a magic square every row, column and diagonal adds to the same number, the **magic constant**. The maker builds them one number at a time with a slider:

- **3 × 3 and 5 × 5**: the up-and-right method. Put 1 in the middle of the top row; move one up and one right (wrapping round the edges); if that cell is taken, move one down instead.
- **4 × 4**: write 1 to 16 in order, then swap every number on the two diagonals for 17 minus it.

Change the start number and the step to build squares from any evenly spaced numbers, and tap two cells to swap them and see the sums break.

It fits Class 8 Mathematics, *number play* (number puzzles, magic squares and Kaprekar's constant), and is fun practice for place value and patterns from Class 6 up. For more digit tricks, try the [[divisibility-tests]] machine; for other ways of writing numbers, the [[number-systems]] translator.

## How to use it

1. Choose **Kaprekar 6174** or **Magic squares**.
2. Kaprekar: type a start number or press **Random number**. Switch to 3 digits for 495.
3. Magic squares: pick a size, then slide **k** from 0 to watch the numbers go in. At the end, the sums appear (green when they match).
4. Change **Start with** and **Go up in steps of**, or tap two cells to swap them. **Reset the square** puts it back.

## A worked example

The page starts with 3524: 5432 − 2345 = 3087, then 8730 − 0378 = 8352, then 8532 − 2358 = 6174, so it takes 3 steps, like 2,400 of the 9,990 possible starts. Start with 2111 and you get 2111 − 1112 = 0999; keeping the zero, 9990 − 0999 = 8991, then 8082, 8532 and 6174: 5 steps.

The 3 × 3 square comes out as 8 1 6 / 3 5 7 / 4 9 2. The numbers 1 to 9 add to 45, shared by 3 rows, so each row (and column, and diagonal) adds to 15. With start 1 and step 1 the constant is n(n² + 1)/2: 15, 34 and 65 for sizes 3, 4 and 5.

## Check yourself

Five fresh questions: one Kaprekar step for 4 digits and for 3 digits, a magic constant, a missing number in a 3 × 3 magic square, and the constant for nine numbers in a row. Nothing is saved.

## FAQ

**Why must the digits not all be the same?** 1111 − 1111 = 0, and the routine stays at 0.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
