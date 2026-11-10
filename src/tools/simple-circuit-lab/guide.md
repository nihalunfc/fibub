---
name: Simple circuit lab
num: 1215
shelf: learn
code: L101
section: school-physics
title: "Simple circuit lab: test materials as conductors or insulators with a bulb or an LED tester"
summary: "Build a circuit of cells, a switch and a torch bulb or LED, then put copper, pencil lead, salt water, plastic and more in the gap. See which conduct and why an LED shows weak conductors a bulb misses; Class 10 adds R = ρL/A."
status: live
ads: false
order: 1215
icon: target
works: offline
updated: 2026-11-09
related: [ohms-law-lab, series-parallel, electromagnet-builder, fair-test-planner]
sources:
  - "Resistance R = ρL/A, Ohm's law I = V/R, power P = I²R, and a 1.5 V cell, a 2.5 V 0.3 A torch bulb and an LED with about 1.8 V across it: standard school physics."
  - "Resistivities are rounded typical room-temperature values from general physics knowledge (metals to three figures, poor conductors and insulators only to the nearest power of ten, as they vary a lot between samples)."
  - "Checked by hand: resistance, current and glow level for every material with each tester and cell count."
flow:
  - { icon: target, label: "Pick tester" }
  - { icon: pointer, label: "Material" }
  - { icon: check, label: "Switch on" }
  - { icon: table, label: "Results" }
---

## What it does

Electricity flows only around a **closed circuit**: from the cell, through the wires and the bulb, and back. This page gives you a simple circuit with a gap in it. Put a material in the gap, press **Switch on**, and see whether the bulb glows. If it does, the material is a **conductor**; if it stays dark, it is an **insulator** (or a very poor conductor). Swap the torch bulb for an **LED tester**: an LED lights up with a much smaller current, so it can show weak conductors like salt water, lemon juice and even tap water that a bulb cannot. Every test you make is added to a results table.

It follows the school topics Class 8 Science, electricity (circuits, conductors and insulators, and how liquids such as salt water conduct) and Class 10 Physics, electricity (resistance and resistivity). Next, the [[ohms-law-lab]] measures current against voltage, and [[series-parallel]] connects several bulbs; the [[fair-test-planner]] helps you plan your own conductor test.

## How to use it

1. Choose a **tester**: a torch bulb or an LED. Choose **1 cell** or **2 cells**.
2. Tap a **material** to put it in the gap at the bottom of the circuit.
3. Press **Switch on** (or tap the switch in the picture). Read whether it glows brightly, dimly, faintly or not at all.
4. Try each material and read the results table.
5. The **Level** switch (Class 10) shows the sample's resistance from R = ρL/A (a 5 cm strip of 1 mm² for solids, 5 cm of liquid 1 cm² across) and the current.

## Worked example

With 2 cells (3 V) and the torch bulb, a copper strip has R = 1.68 × 10⁻⁸ × 0.05 ÷ 10⁻⁶ = 0.00084 Ω, so the current is 3 ÷ 8.33 = 0.36 A and the bulb glows brightly. Salt water between two nails has R = 0.2 × 0.05 ÷ 10⁻⁴ = 100 Ω. The current is 3 ÷ (8.33 + 100) = 27.7 mA, far too small for the bulb, which stays almost dark. With the LED tester the current is (3 − 1.8) ÷ (100 + 100) = 6 mA, and the LED glows brightly. A plastic ruler lets through only about 10⁻¹⁴ A: nothing at all.

## Check yourself

Five fresh questions: picking a conductor, why wires have plastic covers, why an LED shows weak conductors, Ohm's law and R = ρL/A. Nothing is saved.

## Tips

- Metals are good conductors; graphite (pencil lead) is the odd non-metal that conducts.
- Pure water hardly conducts. Water from taps, rivers and our bodies has dissolved salts in it, which is why wet hands and electricity are dangerous.
- An LED needs about 1.8 V just to start glowing, so one 1.5 V cell cannot light it.

## FAQ

**Can I test these at home?** Use only a torch cell or two, never mains electricity or a wall socket.

**Why does the bulb glow more with two cells?** Twice the voltage pushes more current through, and the bulb's power rises with the current squared.

**Is this from NCERT?** No. It is an independent study aid that follows the same school topics, with its own pictures and numbers.
