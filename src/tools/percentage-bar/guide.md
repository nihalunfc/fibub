---
name: Percentage bar
num: 1242
shelf: learn
code: L127
section: school-maths
title: "Percentage bar: drag to find any percent of a number, and see why up 20% then down 20% is not the same"
summary: "A bar stands for the whole, split into ten 10% blocks. Drag along it to see 35% of 240 (or any percent of any number) with every step. Then chain two percentage changes and see why going up and down by the same percent never gets you back to the start."
status: live
ads: false
order: 1242
icon: percent
works: offline
updated: 2026-11-09
related: [ratio-mixer, hcf-lcm-venn, inflation-calculator]
sources:
  - "Percentages, percentage change and successive changes are standard school arithmetic. Wording, pictures and examples are fibub's own."
  - "Checked against hand-worked examples (35% of 240 = 84; up 20% then down 20% = a 4% fall; up p% then down p% = a fall of p² ÷ 100 %)."
flow:
  - { icon: pencil, label: "The whole" }
  - { icon: sliders, label: "Drag" }
  - { icon: percent, label: "Percent" }
  - { icon: check, label: "Practise" }
---

## What it does

A **percent** is a fraction in disguise: 35% means 35 out of every 100, or 35/100. This page draws the whole as a bar split into ten blocks of 10%. Drag the handle (or slide **p**) and the bar fills up to that percent, with the answer and the steps written out underneath. Past 100% the bar grows longer than the whole, so 150% of 60 is plainly more than 60.

The second part chains **two percentage changes**. Start at 500, go up 20% and then down 20%: you end at 480, not 500. Three bars show why. The second change is a percent of a bigger number, so it takes away more than the first one added. Swap the order and you still end at 480.

It fits Class 8 Mathematics, fractions in disguise (percentages, percentage increase and decrease, and successive changes), and is useful revision for profit, loss and discount problems in later classes. The same "parts of a whole" idea is behind ratios in the [[ratio-mixer]], and real price rises over many years are worked out in the [[inflation-calculator]].

## How to use it

- Type **the whole** (for example 240), then drag the round handle on the bar or move the **p** slider. You can also type any percent up to 1000 in the box.
- The quick buttons load 35% of 240, 12.5% of 640, 150% of 60 and 1% of 4500.
- The steps show three ways to think about it: percent as a fraction, multiplying by a decimal, and building from 1% (and each 10% block).
- In **Up, then down by the same percent**, type a start and two changes. Use a minus sign for a fall: −20 means down 20%. **Swap the order** swaps the two changes.

## A worked example

The page starts with 35% of 240.

- 35% = 35/100 = 0.35, and 0.35 × 240 = 84.
- Or: 1% of 240 is 2.4, so 35% is 35 × 2.4 = 84. Each 10% block is 24, so 35% is three blocks and a half: 24 + 24 + 24 + 12 = 84.

Below, the start is 500 with changes of +20% and −20%:

- Up 20%: 500 × 1.2 = 600 (the rise is 20% of 500 = 100).
- Down 20%: 600 × 0.8 = 480 (the fall is 20% of 600 = 120, a bigger amount).
- Overall: × 1.2 × 0.8 = × 0.96, a fall of 4%. In general, up p% then down p% is a fall of p² ÷ 100 percent.

## Check yourself

Five fresh questions each time: a percent of a number, what percent one number is of another, a price rise, up-then-down by the same percent, and finding the price before a rise. Type the answer, press **Check**, and open the worked answer if you need it. Nothing is saved.

## FAQ

**Why can't I just take 25% off to undo a 25% rise?** The rise was 25% of the old price, but taking off 25% means 25% of the new, bigger price. To undo a 25% rise you divide by 1.25, which is a fall of 20%.

**Can a percent be more than 100?** Yes. 150% of 60 is one and a half times 60, which is 90. The bar shows it running past the whole.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
