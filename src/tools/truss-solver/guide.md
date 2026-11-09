---
name: 2D truss and frame solver
num: 648
shelf: science
section: mechanical-engineering
title: "Truss and frame calculator: member forces, reactions and deflections by the direct stiffness method"
summary: "Type or paste the nodes, members, supports and loads of a plane truss or frame and solve it by the direct stiffness method: truss member forces in tension or compression, frame axial forces, shears and moments, support reactions, node displacements and a drawing of the deflected shape, with CSV downloads."
status: live
ads: true
order: 648
icon: calculator
works: offline
updated: 2026-11-09
related: [column-buckling, load-combination-helper, rebar-calculator, retaining-wall-check]
sources:
  - "Direct stiffness method for plane trusses and frames (Euler-Bernoulli beam-column elements, fixed-end loads for a uniform load, Hermite shape functions for the deflected shape): standard structural analysis, for example Kassimali, A., Matrix Analysis of Structures, and Hibbeler, R. C., Structural Analysis (method only)."
  - "Checked against an independent NumPy direct stiffness program written for the tests, against the method of joints for a statically determinate truss (solved as an equilibrium matrix), and against textbook formulas for a cantilever (PL³/3EI) and a propped cantilever (wL²/8)."
  - "The example truss and frame are made up; E of about 200 GPa for steel is a general material fact."
flow:
  - { icon: table, label: "Nodes" }
  - { icon: link, label: "Members" }
  - { icon: calculator, label: "Solve" }
  - { icon: chart, label: "Forces" }
---

## What it does

This is a small structural analysis program for flat (2D) structures. You describe the structure as **nodes** (joints), **members** joining them, **supports** and **loads**, and it solves it with the **direct stiffness method**, the method inside professional analysis software:

- **Truss mode**: members are pin-jointed and carry only axial force. You get each member's force and whether it is in **tension** or **compression**, coloured on the drawing.
- **Frame mode**: joints are rigid, so members also bend. You get each member's axial force N, and the shear V and bending moment M at both ends. A frame member can also carry a uniform load along its length, such as its own weight or a floor load.
- **Support reactions**, every node's **displacement** (and rotation in a frame), and an **equilibrium check** that loads and reactions add up to zero.
- A drawing of the structure with its supports and loads and the **deflected shape**, drawn larger by a factor you can set, plus CSV files of the member forces and node results.

For study and planning, not a substitute for professional judgement. Check your local code and a qualified engineer.

## How to use it

1. Pick **truss** or **frame**, or fill in one of the made-up examples.
2. **Nodes**: one row per joint, with a name and x and y in metres.
3. **Members**: a name, the two node names, Young's modulus E in GPa and area A in cm². For a frame, add the second moment of area I in cm⁴ and, if you want, a uniform load w in kN per metre of member length (in the y direction, negative for gravity).
4. **Supports**: node and type. **pin** holds x and y; **roller** holds only y (a roller on a level surface); **roller-y** holds only x; **fixed** holds x, y and rotation.
5. **Loads**: node, Fx and Fy in kN (right and up are positive) and a moment M in kN·m (anticlockwise positive).

You can paste each table from a spreadsheet, or open a CSV or Excel file. A header row is skipped.

## Worked example

The made-up **Pratt truss** the page opens with spans 12 m in four 3 m panels, 3 m deep, with a pin at node 1, a roller at node 5 and 20 kN hanging at each of the three inner bottom nodes. Each support takes 30 kN. By the method of joints, the bottom chord carries **30 kN tension**, the top chord **40 kN compression**, the end diagonals **42.43 kN compression**, the verticals beside the ends 20 kN tension, the middle vertical nothing, and the inner diagonals 14.14 kN tension. The solver gives the same, and with 20 cm² steel members the middle of the bottom chord drops **1.899 mm**.

The **portal frame** example is 6 m wide and 4 m tall with fixed feet, a 10 kN/m load on the beam and 15 kN pushing sideways at the top left. The top sways 6.46 mm, and the largest moment is 34.44 kN·m at the right end of the beam.

## FAQ

**Why does it say the structure is a mechanism?** The supports or members cannot stop some movement: a truss with too few members, a roller-only structure that can slide, or a node not connected to anything. A stable plane truss needs at least as many members plus reactions as twice the number of nodes, arranged in triangles.

**Can a frame have pinned joints?** Not yet in one model: all frame joints are rigid. Model a pinned frame as a truss if its loads are only at the joints.

**What about buckling?** Compression members can buckle well before they yield. Check them with the column buckling calculator.
