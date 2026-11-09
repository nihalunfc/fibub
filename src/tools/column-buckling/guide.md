---
name: Column buckling calculator
num: 652
shelf: science
section: civil-and-structural-engineering
title: "Column buckling calculator: Euler critical load, effective length, slenderness and the Johnson parabola"
summary: "Work out the buckling load of a straight column from its section (I or H, rectangle, solid circle or round tube), length, end conditions and material: section properties, slenderness KL/r, Euler's critical load for slender columns and the Johnson parabola for intermediate ones, with a column curve and an optional load check."
status: live
ads: true
order: 652
icon: chart
works: offline
updated: 2026-11-09
related: [load-combination-helper, rebar-calculator, uncertainty-calculator]
sources:
  - "Euler's buckling formula P = π²EI/(KL)², ideal effective length factors from elastic stability theory, and the Johnson parabola σ = fy − (fy/2π)² λ²/E for intermediate columns, as in mechanics of materials textbooks such as Timoshenko and Gere, Theory of Elastic Stability, and Gere and Goodno, Mechanics of Materials (formulas only)."
  - "Section properties from the standard formulas for area and second moment of area."
  - "No design-code column curves or tables are used. E and fy are example values for a mild steel that the user replaces; the example column is made up."
  - "Checked against an independent Python calculation written for the tests: grid integration of the sections with NumPy and a finite-difference buckling eigenvalue solution (scipy.linalg.eigh) for pinned and clamped ends."
flow:
  - { icon: ruler, label: "Section" }
  - { icon: sliders, label: "Ends" }
  - { icon: calculator, label: "Slender" }
  - { icon: chart, label: "Load" }
---

## What it does

A slim column under compression does not crush first: it bows sideways and collapses at a load far below the crushing load. That is **buckling**. This calculator works out the load at which an ideal, straight column buckles:

- **Section properties**: area A, second moments of area Ix and Iy, and radii of gyration r = √(I/A), for an I or H section, a solid rectangle, a solid circle or a round tube.
- **Effective length** KL, where K depends on how the ends are held: 1 for pinned ends, 2 for a flagpole fixed at the base, 0.7 for fixed at one end and pinned at the other, 0.5 for both ends fixed.
- **Slenderness** λ = KL / r, using the smaller r, because the column buckles about its weakest axis.
- **Euler's critical load** P = π²EI / (KL)², valid for slender columns.
- The **Johnson parabola** σ = fy − (fy² / 4π²E) λ² for intermediate columns, where Euler's formula would give stresses near or above yield. The two curves meet at the transition slenderness Cc = √(2π²E / fy), where the stress is fy/2.
- An **allowed load** with a factor of safety you choose, and a check of an applied load if you give one.

For study and planning, not a substitute for professional judgement. Check your local code and a qualified engineer.

## How to use it

1. Choose the **shape** and type its sizes in millimetres.
2. Type the **length** between supports, and pick the **end conditions** (or type your own K).
3. Type the material's **Young's modulus** and **yield strength** in MPa (N/mm²). The starting values, 200,000 and 250 MPa, are example values for a mild steel.
4. Choose a **factor of safety**, and type an **applied load** in kN if you want it checked.

The chart shows the column curve: the Johnson parabola up to Cc, the Euler curve beyond, and your column as a dot.

## Worked example

A made-up I section 200 mm deep with 150 × 10 mm flanges and a 6 mm web, 4 m long with pinned ends, E = 200,000 MPa and fy = 250 MPa (the page opens with these):

- A = 2 × 150 × 10 + 180 × 6 = **4080 mm²**; Ix = 3.002 × 10⁷ mm⁴; Iy = 5.628 × 10⁶ mm⁴, so ry = 37.14 mm. It buckles about the weak (y) axis.
- KL/r = 4000 / 37.14 = **107.7**, below Cc = 125.7, so the Johnson parabola applies.
- σ = 250 − (250² / (4π² × 200,000)) × 107.7² = **158.2 MPa**, so the critical load is 158.2 × 4080 = **645.4 kN**. Euler alone would give 694.4 kN, which overestimates it.
- With a factor of safety of 2, the allowed load is 322.7 kN.

Fixing both ends (K = 0.5) halves the slenderness to 53.8 and raises the critical stress to 227 MPa.

## FAQ

**Why is my code's answer lower?** Real columns are never perfectly straight, have residual stresses from rolling or welding, and carry loads slightly off-centre. Design codes use their own column curves and factors to allow for this, and usually larger K values than the ideal ones. This calculator gives the ideal-column result for study and a first check.

**Can a column buckle about a different axis?** Yes, if it is braced differently in each direction. Work out each axis separately with its own effective length and use the lower load.

**Does it cover local buckling of thin plates or tubes?** No. Very thin flanges, webs or tube walls can buckle locally first; check their width-to-thickness ratios with your code.
