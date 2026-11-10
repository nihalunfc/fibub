---
name: Hemocytometer cell counter
num: 36
shelf: science
code: T36
section: cell-biology-and-cell-culture
title: "Hemocytometer cell counter: cells per mL, viability and seeding calculator"
summary: "Tally live and dead cells square by square with on-screen buttons or the keyboard. Get cells per mL, viability, the counting error, and exactly how much suspension and medium to mix to seed your plates."
status: live
ads: true
order: 10
icon: calculator
works: offline
updated: 2026-11-08
related: [plate-layout, solution-calculator, pcr-master-mix]
sources:
  - "Chamber size: the improved Neubauer chamber (0.1 µL per large square)."
flow:
  - { icon: target, label: "Tally" }
  - { icon: calculator, label: "Cells/mL" }
  - { icon: flask, label: "Seed wells" }
---

## What it does

Counting cells with a hemocytometer is one of the most common jobs in cell culture. The counting is the easy part. The arithmetic afterwards, with squares, chamber volume, trypan blue dilution, and then the volumes to seed a plate, is where mistakes creep in. This counter keeps the tally for you, square by square, and does the sums as you go.

To dilute the cells to the density you need, use the [[solution-calculator]]; to plan where they go on a plate, the [[plate-layout]].

## How to use it

1. Choose how many **large squares** you will count (usually the four corner squares) and how the cells were **mixed with trypan blue** (1 : 1 doubles the dilution). Add any **earlier dilution** of the cells.
2. **Count.** Press **Live** or **Dead** for every cell in the current square, then **Next square**. With a keyboard, keep your eyes on the microscope: L or Space for a live cell, D for a dead (blue) cell, N or Enter for the next square, and Backspace to undo. You can also type the totals for each square into the table.
3. **Read the result:** live cells per mL, dead and total cells per mL, and the viability.
4. **Seed.** Type how many live cells each well should get, the number of wells and the medium per well. The tool says how much cell suspension to mix with how much medium, including a spare margin.

## The maths

Each large square of an improved Neubauer chamber is 1 mm × 1 mm with a depth of 0.1 mm, which is 0.1 µL. Cells per mL = average count per large square × 10,000 × dilution. Viability = live / (live + dead). Cells land in the chamber at random, so the counting error is about 1/√N for N cells counted. 100 cells give about ±10 % and 400 cells about ±5 %. Aim for 20 to 200 cells per square. The tool warns you when the count is too sparse or too dense, or when the squares differ widely, which suggests poorly mixed cells.

## Worked example

You count four corner squares after mixing 1 : 1 with trypan blue: 52, 47, 55 and 46 live cells and 4, 3, 5 and 4 dead. That is 200 live cells, an average of 50 per square, so 50 × 10,000 × 2 = 1.0 × 10⁶ live cells/mL with 92.6 % viability. To seed 24 wells with 100,000 cells in 0.5 mL each, with 10 % spare, mix 2.64 mL of cells with 10.56 mL of medium and put 0.5 mL in each well.

## Frequently asked questions

**Which cells do I count on the lines?** Count cells touching the top and left lines, and not those touching the bottom and right lines.

**Is anything saved?** No. Nothing is stored or sent. The page works offline, even at a cell culture hood with no network.

Plan the plate with the [plate layout designer](/science/plate-layout/).
