---
name: Wheatstone bridge
num: 1048
shelf: learn
section: school-physics
title: "Wheatstone bridge"
summary: "A virtual metre bridge with a mystery resistor. Slide the jockey along the wire until the galvanometer reads zero, then work out the unknown resistance from the balance length. Every current in the bridge is shown, with Kirchhoff's junction and loop rules worked out with the live numbers."
status: live
ads: false
order: 1048
icon: ruler
works: offline
updated: 2026-11-09
related: [series-parallel, ohms-law-lab, circuit-simulator]
sources:
  - "Wheatstone bridge balance P/Q = R/S, the metre bridge X/R = l/(100 − l), and Kirchhoff's junction and loop rules: standard school physics results."
  - "Checked against an independent NumPy mesh-current solve of the full bridge (with the cell's internal resistance and the galvanometer's resistance) and the balance condition. The cell, wire and galvanometer values are made-up teaching values."
flow:
  - { icon: pointer, label: "Slide jockey" }
  - { icon: target, label: "Find null" }
  - { icon: calculator, label: "Work out X" }
  - { icon: check, label: "Check" }
---

## What it does

A **Wheatstone bridge** is four resistors in a diamond with a galvanometer across the middle. When the ratio of the two resistors on one side equals the ratio on the other side, no current flows through the galvanometer: the bridge is **balanced**. A **metre bridge** is the classroom version: two of the arms are the two parts of a uniform wire 1 metre long, split by a sliding contact called the **jockey**, so the ratio of those two arms is just the ratio of the two lengths.

This page gives you a metre bridge with a **mystery resistor X** in the left gap and a known resistor R in the right gap. Drag the jockey along the wire, or use the fine buttons, and watch the galvanometer needle. When it reads zero, the balance length l gives X = R l / (100 − l). Tap **Show the answer** to check yourself, or **New mystery resistor** for another one.

Under it, every current in the bridge is listed, worked out from Kirchhoff's rules, and the junction and loop rules are written out with the live numbers. It follows the Class 12 Physics chapter on current electricity (Kirchhoff's rules, the Wheatstone bridge, the metre bridge). If series and parallel resistors are new to you, start with the [[series-parallel]] builder; for Ohm's law itself see the [[ohms-law-lab]].

## How to use it

1. Pick the **known resistance R** for the right gap.
2. **Drag** the jockey (the triangle under the wire) or tap the wire to put it there. Use **◀ 1 cm**, **◀ 0.1**, **0.1 ▶** and **1 cm ▶** for fine steps.
3. The line under the picture tells you which way to move: if the needle swings right, move the jockey left, and the other way round.
4. When the needle reads zero the page says **Balanced** and shows X = R l / (100 − l) with your numbers.
5. Tap **Show the answer** to see the mystery value, then **New mystery resistor** to try again.

## Worked example

The page starts with X = 6 Ω (hidden) and R = 10 Ω. With the jockey at 20 cm the galvanometer carries about 5 mA and the needle swings left, so move right. At l = 37.5 cm the needle reads zero: X = 10 × 37.5 / 62.5 = 6 Ω. At that point the table shows the same current through X and R, and the same current along both parts of the wire, because none goes through the galvanometer. Change R to 5 Ω and the balance point moves to 100 × 6 / 11 = 54.5 cm; the answer is still 6 Ω.

## Tips

- The result is most accurate when the balance point is near the middle of the wire, so choose R close to X.
- Swap X and R round: the balance length becomes 100 − l. Taking the average of both readings cancels small errors at the ends of the wire.
- The balance does not depend on the cell's voltage or the galvanometer's resistance: only the ratio of the arms matters.

## FAQ

**Why does a balanced bridge not care about the galvanometer?** At balance its two ends are at the same voltage, so no current flows through it whatever its resistance.

**Are the cell and wire values real?** They are made-up teaching values: a 2 V cell with 0.5 Ω inside, a 2 Ω wire and a 50 Ω galvanometer.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.
