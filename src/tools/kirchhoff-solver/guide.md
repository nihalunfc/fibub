---
name: Kirchhoff's rules solver
num: 1407
shelf: learn
code: L248
section: school-physics
title: "Kirchhoff's rules solver: draw a DC circuit, see the junction and loop equations solved"
summary: "Draw a DC circuit of cells and resistors on a grid by tapping the sides between dots. The page writes out Kirchhoff's junction rule and loop rule for it, solves the equations and shows every branch current with its direction, the voltage across each resistor and the power of each cell."
status: live
ads: false
order: 1407
icon: link
works: offline
updated: 2026-11-09
related: [series-parallel, wheatstone-bridge, drift-velocity, ohms-law-lab]
sources:
  - "Kirchhoff's junction rule (current in = current out) and loop rule (the emfs round a closed loop equal the sum of the I R drops): standard circuit theory. One junction equation per junction except one in each connected part, and one loop equation per branch outside a spanning tree, give as many equations as branch currents."
  - "Equations solved by Gaussian elimination with partial pivoting."
  - "Checked against the closed-form two-cell circuit (6 V with 2 Ω and 4 V with 4 Ω across 6 Ω: 0.818, −0.0909 and 0.727 A, worked by hand with the node voltage V = (E₁/R₁ + E₂/R₂)/(1/R₁ + 1/R₂ + 1/R₃)), series and parallel combinations worked by hand, and two cells in parallel (12 V with 1 Ω and 10 V with 2 Ω on 5 Ω: 2 A, 0 A)."
flow:
  - { icon: pencil, label: "Draw" }
  - { icon: sliders, label: "Set values" }
  - { icon: sigma, label: "Equations" }
  - { icon: check, label: "Currents" }
---

## What it does

When a circuit has more than one cell, or resistors that are neither simply in series nor simply in parallel, you need **Kirchhoff's rules**:

- **Junction rule:** at any junction, the current flowing in equals the current flowing out (charge does not pile up).
- **Loop rule:** going once round any closed loop, the emfs of the cells add up to the sum of the I R drops (energy is conserved).

This page lets you draw a circuit on a 3 × 3 grid of dots (A to I). Each side between two dots can hold nothing, a plain wire, a resistor or a cell with an optional internal resistance. Every resistor and cell is a **branch** with its own current I₁, I₂, …. The page writes out one junction equation for each junction (all but one) and one loop equation for each independent loop, solves them and draws the currents as arrows. A table gives each current, which way it really flows, the voltage across each resistor and the power each cell gives or takes.

It follows the Class 12 Physics chapter on current electricity (Kirchhoff's rules, cells in series and parallel, the Wheatstone bridge). Simpler circuits are quicker with [[series-parallel]]; the [[wheatstone-bridge]] uses the same rules on a bridge, and [[drift-velocity]] shows what a current is inside a wire.

## How to use it

1. Pick a ready-made circuit in **Start from**, or **Blank grid** to draw your own.
2. Tap a side between two dots on the picture (or choose it in the **Side** list). It turns orange.
3. Choose **Nothing**, **Wire**, **Resistor** or **Cell** for it. Type the resistance, or the cell's emf and internal resistance. **Turn the cell round** swaps its + and − ends; the long plate and the red + mark the + end.
4. Read the equations and the currents. Each current Iₙ is counted as positive from left to right or top to bottom; a negative answer means it really flows the other way, and the table says which way.

Dots joined by plain wire are at the same potential, so the page treats them as one junction and says so.

## Worked example

Take **Two cells, three resistors**: a 6 V cell and a 2 Ω resistor on the left, a 6 Ω resistor in the middle and a 4 Ω resistor with a 4 V cell on the right, both cells with + at the top. The page writes three junction equations and two loop equations:

- Loop A → B → D → A: 2 I₁ + 6 I₄ = 6
- Loop A → B → C → D → A: 2 I₁ + 4 I₂ = 2

Solving gives I₁ = 0.818 A through the 2 Ω resistor, I₄ = 0.727 A down through the 6 Ω resistor and I₂ = 0.0909 A through the 4 Ω resistor towards the 4 V cell. So 0.0909 A flows **into** the + end of the 4 V cell: the bigger cell is charging the smaller one, and the table marks that cell "charging". Check with the junction rule at B: 0.818 = 0.0909 + 0.727.

## Tips

- Choose any direction for each current when you work on paper; a negative answer just means the other way. The page uses left-to-right and top-to-bottom.
- With N junctions and B branches you need N − 1 junction equations and B − N + 1 loop equations.
- Ideal cells (no internal resistance) in parallel with different emfs, or a cell shorted by plain wire, have no sensible answer; the page tells you when that happens.

## FAQ

**Why do some junction equations look like I₂ = I₅?** At a dot where only two branches meet, the rule just says the current is the same all along a series path.

**Why is one junction left out?** Its equation follows from the others, so it adds nothing new.

**Is this an official NCERT resource?** No. fibub is independent; the page follows the topics in the syllabus in its own words.
