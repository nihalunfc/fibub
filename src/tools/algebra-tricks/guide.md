---
name: Number trick decoder
num: 1249
shelf: learn
code: L121
section: school-maths
title: "Number trick decoder: think of a number tricks explained with algebra"
summary: "Run a think-of-a-number trick with any number and with the letter n side by side, see each step as bags and counters, and find out why the answer is always the same, or how a mind reader gets your number back. Build your own trick too."
status: live
ads: false
order: 1249
icon: sigma
works: offline
updated: 2026-11-09
related: [identity-tiles, balance-scale, symbolic-algebra, linear-pair-solver]
sources:
  - "Think-of-a-number tricks and their algebra are standard school mathematics. The tricks, pictures and questions on this page were written for fibub."
  - "Checked by hand and against exact fraction arithmetic in Python (fractions.Fraction) for every built-in trick and 500 random home-made tricks."
flow:
  - { icon: pencil, label: "Pick trick" }
  - { icon: sliders, label: "Any number" }
  - { icon: sigma, label: "Use n" }
  - { icon: check, label: "Decode" }
---

## What it does

"Think of a number. Double it. Add 10. Halve it. Take away the number you first thought of. Your answer is 5!" Tricks like this feel like magic, but a little algebra explains them completely. This page runs a trick two ways at once:

- with **a number you choose**, so you see the trick work, and
- with the **letter n**, standing for any number at all, so you see *why* it works.

Each step is also drawn as **bags and counters**: a bag holds n counters (we don't know how many), and a loose counter is worth 1. Doubling doubles the bags and the counters; halving shares them into two equal groups; taking away your number removes one bag. When every bag has gone, the answer cannot depend on the number you thought of.

Some tricks keep the n on purpose. In the **mind reader** the answer is 100n + 165, so the trickster takes away 165 and reads your number from the hundreds. Type your friend's answer and the page decodes it.

It fits the Class 8 maths chapter *Algebra Play*, where number tricks lead into expressions and equations. Collecting like terms with tiles is in [[identity-tiles]], and solving an equation by doing the same to both sides is in [[balance-scale|the balance scale equation solver]].

## How to use it

1. Pick a trick: **Always 5**, **Always 3**, **Always 7**, **Mind reader** or **Back to you**.
2. Move the **n** slider (or type any number, even a decimal or a negative one). The middle column changes; the right-hand column, the algebra, does not.
3. Tap a row of the table to see that step as bags and counters.
4. Read **Why it works**. It either says "Always ..." or tells you how to undo the trick. For a trick that keeps n, type an answer in the box to get the starting number.
5. Choose **Make your own** to build a trick from steps: add, take away, multiply, divide, and add or take away "your number". **Undo** removes the last step.

## A worked example

Choose **Always 5** and keep n = 12:

| Step | With 12 | With n |
|---|---|---|
| Think of a number | 12 | n |
| Double it | 24 | 2n |
| Add 10 | 34 | 2n + 10 |
| Halve it | 17 | n + 5 |
| Take away your number | 5 | 5 |

Halving 2n + 10 gives n + 5 (half of each part). Taking away n leaves 5, whatever n was.

Now the **Mind reader** with n = 12: × 5 gives 60, + 6 gives 66, × 4 gives 264, + 9 gives 273, × 5 gives 1 365. In algebra: 5n, 5n + 6, 20n + 24, 20n + 33, 100n + 165. Type 1365 in the decoder: 1 365 − 165 = 1 200, and 1 200 ÷ 100 = 12.

## Tips

- To make an "always" trick, the bags must cancel: whatever you multiply by, divide by the same number later, then take away your number once.
- Dividing can make fractions on the way (try "divide by 3" with n = 4). The final answer still works, because the algebra is exact.
- The bags-and-counters picture is drawn for small whole numbers; for fractions or very big numbers the page shows the expression instead.

## Check yourself

Four fresh questions each time: the answer of an "always" trick, decoding a friend's answer, expanding a bracket, and one more trick to unravel. Nothing is saved.

## FAQ

**Why does a negative or decimal number work too?** Every step is an ordinary operation on numbers, and the algebra a·n + b holds for any n. Only "divide by 0" is not allowed.

**Is this the NCERT book?** No. It covers the same topic with fibub's own tricks and questions. fibub is not part of NCERT.
