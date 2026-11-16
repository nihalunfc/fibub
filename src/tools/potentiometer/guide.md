---
name: Potentiometer virtual practical
num: 1412
shelf: learn
code: L266
section: school-physics
title: "Potentiometer practical: compare the emfs of two cells and find a cell's internal resistance"
summary: "A virtual 4 m potentiometer wire with a driver cell, rheostat, jockey and galvanometer. Slide the jockey until the galvanometer reads zero, record the balance length, and work out an unknown cell's emf or a cell's internal resistance. The cells are a mystery until you ask to see the true values."
status: live
ads: false
order: 1412
icon: ruler
works: offline
updated: 2026-11-16
related: [internal-resistance, wheatstone-bridge, kirchhoff-solver, ohms-law-lab]
sources:
  - "Potentiometer principle: with a steady current in a uniform wire the fall of potential is proportional to length (k = V/L); at balance no current flows in the cell's branch, so E = k l. E₁/E₂ = l₁/l₂ and r = R (l₁ − l₂)/l₂: standard results."
  - "The galvanometer current away from balance is found exactly from the Thévenin equivalent of the wire between end A and the jockey."
  - "Wire, driver cell, galvanometer and test-cell values are made-up teaching values."
  - "Checked against a separate nodal analysis of the whole circuit in the tests (galvanometer current at several jockey positions) and by hand (2 V driver, 0.5 Ω rheostat, 4 Ω wire: k = 0.435 V/m, a 1.50 V cell balances at 345 cm)."
  - "The solve card uses E₁/E₂ = l₁/l₂, r = R (l₁ − l₂)/l₂, k = V/L, E = k l and I = E/(R_wire + R_rheostat) with the potential drop V = I R_wire: standard textbook results, checked by hand (1.5 V × 250/300 = 1.25 V; 5 Ω × 50/250 = 1 Ω; 2 V on 4 m is 0.5 V/m; 1.2 V balances at 240 cm)."
flow:
  - { icon: sliders, label: "Rheostat" }
  - { icon: pointer, label: "Jockey" }
  - { icon: ruler, label: "Balance" }
  - { icon: check, label: "Result" }
---

## What it does

A **potentiometer** is a long, uniform wire with a steady current through it from a driver cell. The potential falls evenly along the wire, so the voltage between end A and any point is proportional to the length. A test cell and a galvanometer are joined between A and a sliding contact (the **jockey**). Where the fall of potential along the wire exactly matches the cell's emf, no current flows through the galvanometer: that is the **balance point**. Because no current is drawn from the cell at balance, a potentiometer measures its true emf, which an ordinary voltmeter cannot.

This page is a virtual version of the two classic experiments:

- **Compare two emfs.** Balance cell 1 (a known 1.50 V) at l₁ and cell 2 (unknown) at l₂. Then E₂ / E₁ = l₂ / l₁.
- **Internal resistance.** Balance the cell on open circuit (l₁), then with a resistance box R across it (key K₂ closed, l₂). Then r = R (l₁ − l₂) / l₂.

The galvanometer needle swings left or right as you move the jockey, worked out exactly from the circuit, so you find the balance point just as in the lab.

It follows the Class 12 Physics practicals on the potentiometer (comparing emfs, internal resistance of a cell) and the current electricity chapter. For the theory of internal resistance see [[internal-resistance]]; the [[wheatstone-bridge]] uses the same null method to find a resistance.

## How to use it

1. Pick **Compare two emfs** or **Internal resistance**.
2. Set the **rheostat** in the driver circuit. If it is too big, there is no balance point; the page says so.
3. Slide the **jockey**, then use the −10 … +10 cm buttons to bring the needle to zero. The needle turns green at balance.
4. Press **Record this balance length**. It only records when the galvanometer reads zero.
5. For emfs: switch to **Cell 2** and repeat. For internal resistance: **Close key K₂** and repeat. The result appears under the table.
6. **Show the true values** to check your answer; **New cells** gives you new mystery cells.

## Solve your own numbers

The first card handles the numbers from a textbook or practical question. Choose **compare emfs** (type the known emf and the two balance lengths to get E₂), **internal resistance** (balance lengths with the key open and closed, and the resistance box R), **potential gradient** (the drop across the wire and its length, in V/m and mV per cm), **balance length** (the cell's emf and the gradient), **emf from a balance length**, or the **potential drop along the wire** (driver emf, wire resistance and rheostat; add the wire length to get the gradient). Lengths can be in cm, m or mm. The working shows the formula, the substitution with units and the result, and it warns you when the numbers cannot work: l₂ longer than l₁, or a cell whose emf is larger than the drop along the whole wire (no balance point).

Common mistakes it points out: using l₂ − l₁ instead of l₁ − l₂, dividing by l₁ instead of l₂, and mixing cm with m.

## Worked example

The driver cell is 2 V with 0.1 Ω inside, the wire is 4 m of 4 Ω and the rheostat is set to 0.5 Ω. The current in the wire is 2 / 4.6 = 0.435 A, so the potential gradient is 0.435 V/m, or **4.35 mV per cm**. Cell 1 (1.50 V) balances at 1.50 / 0.435 = **345 cm**. If cell 2 balances at 276 cm, its emf is 1.50 × 276 / 345 = **1.20 V**.

For internal resistance: a cell balancing at 340 cm on open circuit and at 283.3 cm with R = 5 Ω across it has r = 5 × (340 − 283.3) / 283.3 = 1.00 Ω.

## Tips

- A longer balance length gives a more precise answer; raise the rheostat as long as a balance point remains.
- Both balance lengths must be measured with the same current in the wire, so do not touch the rheostat between readings.
- The driver cell's emf must be bigger than the cells you test.

## FAQ

**How do I find the internal resistance of a cell with a potentiometer?** Use r = R (l₁ − l₂) / l₂, where l₁ is the balance length with the key open and l₂ the (shorter) balance length with the resistance R across the cell.

**Why not just use a voltmeter?** A voltmeter draws a little current, so it reads the terminal voltage, a bit less than the emf. At balance the potentiometer draws none.

**Why does the needle go off the scale far from balance?** The galvanometer is very sensitive; real setups add a protective resistance first and remove it near balance.

**Is this an official NCERT resource?** No. fibub is independent; the page follows the topics in the syllabus in its own words.
