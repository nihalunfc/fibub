---
name: Number line zoom
num: 1274
shelf: learn
code: L155
section: school-maths
title: "Number line zoom: find √2, π or 7/13 digit by digit, and see which decimals stop or repeat"
summary: "Zoom into the number line ten times at a time to pin down √2, √3, π or any fraction, one decimal digit per zoom, with the check at each step. See why √2 never lands on a mark (irrational) while 3/8 does, and use the decimal detective to find whether p/q stops or repeats, and how long the repeating block is."
status: live
ads: false
order: 1274
icon: ruler
works: offline
updated: 2026-11-09
related: [hcf-lcm-venn, pythagoras-proofs, limit-zoom, number-theory-toolkit]
sources:
  - "Standard facts about real numbers: decimal expansions by successive tenths, √n irrational unless n is a perfect square, p/q terminating exactly when the denominator in lowest terms has no prime factors other than 2 and 5, and long division giving the repeating block. π to 60 places is a mathematical constant. Written for fibub."
  - "Exact digits with BigInt integer square roots and long division. Checked against Python's decimal module (square roots of 2, 3, 5, 7, 10 and 13 to 30 places), the period of 1/q from the multiplicative order of 10 mod q (Python) for eleven q, and the 2-and-5 rule for every q up to 300."
flow:
  - { icon: target, label: "Pick" }
  - { icon: search, label: "Zoom ×10" }
  - { icon: check, label: "Check" }
  - { icon: sigma, label: "Stop/repeat" }
---

## What it does

Where exactly is √2 on the number line? It is between 1 and 2, because 1² = 1 and 2² = 4. Zoom in ten times and it is between 1.4 and 1.5, because 1.4² = 1.96 and 1.5² = 2.25. Zoom again: between 1.41 and 1.42. Each zoom finds one more decimal digit, and you can go on for ever.

This page draws that zoom. The top line is the stretch you are looking at, cut into ten numbered parts; the part that holds the number is magnified ten times on the line below. Under the picture you see the digits found so far and **why** they are right: for a square root, square both ends; for a fraction, multiply both ends by the denominator.

- **Zoom for me** zooms straight in. **I'll find it** asks you to tap the right part first, and explains a wrong tap with the squares.
- Pick √2, √3, √5, √10, π, 1/3, 2/7, 7/13 or 3/8, or type your own **√n** or **p/q**.
- The **decimal detective** does the long division of p ÷ q and shows whether the decimal stops or repeats, the repeating block and its length, and why, from the prime factors of q.

It fits the Class 9 Maths chapter on the world of numbers (real numbers, rational and irrational), and real numbers in Class 10.

The denominator's prime factors come from the factor trees in [[hcf-lcm-venn]]; √2 first appears as the diagonal of a unit square in [[pythagoras-proofs]], and zooming in on a number is the idea behind the [[limit-zoom]].

## How to use it

1. Choose a number from the list, or type √7 or 5/6 in the box.
2. Press **Zoom in ×10** again and again. The big line shows the digits found; the line under it shows the check.
3. Switch to **I'll find it** and tap the part you think holds the number before each zoom.
4. **Zoom out** goes back one step; **Start again** goes back to whole numbers.
5. In the detective, type p and q. The table lists each step of the long division; the highlighted row is where a remainder comes back, which is where the repeating starts.

## A worked example

With √2, zoom twice. The page shows **√2 = 1.41…** and *1.41² = 1.9881 ≤ 2 < 2.0164 = 1.42²*. Six more zooms give 1.41421356…, and the note says √2 is irrational: 2 is not a perfect square, so the zoom never lands exactly on a mark.

With 3/8, the third zoom lands exactly on 0.375 and the button stops: the decimal terminates, because 8 = 2 × 2 × 2.

In the detective, 7/13 = 0.538461 538461 …: 13 is a prime other than 2 and 5, so the decimal repeats, with a block of 6 digits. The long division gets remainder 7 back after six steps.

## Tips

- A fraction in lowest terms stops exactly when its denominator is made only of 2s and 5s, and the number of places is the larger of the two powers: 3/40 = 3/(2³ × 5) has 3 places.
- 1/q can repeat with a block of at most q − 1 digits, because there are only q − 1 possible non-zero remainders.
- Irrational numbers have decimals that never stop and never settle into a repeating block.

## Check yourself

Four fresh questions: which tenths a square root lies between, the length of a repeating block, how many places a terminating decimal has, and whether a square root is rational. Nothing is saved.

## FAQ

**How deep can I zoom?** 24 times, to 24 decimal places, with exact whole-number arithmetic, so every digit shown is right. π is stored to 60 places.

**Is 0.999… equal to 1?** Yes. Zooming in on 1 and on 0.999… gives the same point at every level; there is no gap between them.

**Is this from the NCERT book?** It covers the same topic with fibub's own examples. fibub is not part of NCERT.
