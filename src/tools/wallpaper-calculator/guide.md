---
name: Wallpaper calculator
num: 2021
shelf: everyday
code: T869
section: walls-floors
title: "Wallpaper calculator: how many rolls of wallpaper, with pattern repeat"
summary: "Work out how many rolls of wallpaper a room needs from the wall widths, height, roll size and pattern repeat, counted strip by strip."
status: live
ads: false
order: 2021
icon: ruler
works: offline
updated: 2026-11-10
related: [paint-calculator, tile-calculator, drywall-calculator]
sources:
  - "Strip-by-strip roll count: fibub's own working. Default roll sizes (0.53 x 10.05 m, common in Europe and the UK; 20.5 in x 33 ft, common in the US) are typical; check the label."
flow:
  - { icon: ruler, label: "Walls" }
  - { icon: sliders, label: "Roll size" }
  - { icon: calculator, label: "Strips" }
  - { icon: check, label: "Rolls" }
---

## What it does

This wallpaper calculator counts how many rolls you need the way a decorator does: it works out how many strips (drops) cover the walls, how many strips you can cut from one roll, and divides. That is more honest than dividing the wall area by the roll area, because the piece left at the end of a roll is often too short.

For the walls you are painting instead, the [[paint-calculator]] works out the litres; if the room also needs new boards first, try the [[drywall-calculator]].

## How to use it

1. Pick metric or imperial (changing units loads the example in those units).
2. Type the wall height and the width of each wall you will paper.
3. Type the roll width and length from the label, and the pattern repeat if there is one.

## What each setting does

- **Roll width and length**: the defaults are 53 cm by 10.05 m (a common European roll) or 20.5 in by 33 ft (a common US roll).
- **Pattern repeat**: the distance before the pattern starts again, printed on the label. Each strip is rounded up to whole repeats so the pattern lines up. Use 0 for plain paper.
- **Pattern match**: a straight match lines up side by side; a half-drop match shifts every other strip by half a repeat, so half a repeat is added to each strip.
- **Trim allowance**: extra length per strip for trimming at the ceiling and skirting. Many decorators add 5 to 10 cm (2 to 4 in); it is 0 in the example.
- **Doors and windows**: the total width you will not paper full height. Strips above and below still need paper, so only take off wide openings.

## Worked example

Four walls of 4, 3, 4 and 3 m make 14 m of wall, 2.5 m high, with 0.53 × 10.05 m rolls and no repeat. 14 ÷ 0.53 = 26.4, so 27 strips. Each roll gives 4 strips of 2.5 m (10.05 ÷ 2.5 = 4.02), so 27 ÷ 4 needs **7 rolls**.

With a 64 cm repeat, each strip is rounded up to 4 repeats, 2.56 m, and a roll now gives only 3 strips: 27 ÷ 3 = **9 rolls**.

## FAQs

**Why buy a spare roll?** Batches can differ in shade, so the calculator suggests one extra from the same batch.

**Can I join leftover pieces?** Not on a patterned paper; the count assumes you do not.
