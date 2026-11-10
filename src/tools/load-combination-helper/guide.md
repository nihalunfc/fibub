---
name: Load combination helper
num: 651
shelf: science
code: T448
section: civil-and-structural-engineering
title: "Load combination calculator: factored load combinations and the governing case for each effect"
summary: "Type your load cases (dead, live, snow, wind, earthquake and more) with their forces or moments, and your own load combinations with factors. The tool works out every combination, tries both directions of wind and earthquake, and shows the largest and smallest value of each effect and where it comes from."
status: live
ads: true
order: 651
icon: sigma
works: offline
updated: 2026-11-09
related: [rebar-calculator, concrete-mix-design, uncertainty-calculator, column-buckling, retaining-wall-check, beam-calculator, truss-solver, bearing-capacity]
sources:
  - "Linear superposition of factored load effects: general structural analysis (for example Hibbeler, R. C., Structural Analysis). The sign search and the governing-value search are fibub's own code."
  - "The two example factor sets are made up by fibub to show how the tool works. They are not taken from ASCE 7, Eurocode (EN 1990), IS 875, NBC, AASHTO or any other code, and are labelled \"check your code edition\"."
  - "The example loads are made up. Checked against an independent NumPy calculation written for the tests."
flow:
  - { icon: table, label: "Loads" }
  - { icon: pencil, label: "Factors" }
  - { icon: sigma, label: "Combine" }
  - { icon: target, label: "Governing" }
---

## What it does

Structures are designed for loads acting together: the weight of the structure (dead load), people and furniture (live load), snow, wind, earthquake and so on. A **load combination** adds them up with **factors**, such as 1.25D + 1.5L. Codes give a list of combinations, and the designer has to find, for every force or moment, the combination that gives the worst value. That is tedious and easy to get wrong by hand. This helper does the bookkeeping:

- You type the result of each **load case** on its own (from your analysis), for as many **effects** as you like: an axial force, a bending moment, a shear, a support reaction or a deflection.
- You type your **combinations**, one per line, with the factors from the code you use.
- It works out every combination. Loads that can act **either way**, marked with ±, are tried in both directions, and with two such loads in one combination all four sign cases are tried.
- For each effect it shows the **largest** and **smallest** value and which combination gives it, highlights them in the full table, and draws a bar chart.

For study and planning, not a substitute for professional judgement. Check your local code and a qualified engineer.

Take the governing combination to the [[beam-calculator|beam calculator]] or the [[column-buckling|column buckling check]], then size the steel with the [[rebar-calculator|rebar calculator]].

## How to use it

1. **Loads.** The first row is a label, then the names of the effects with their units. Each further row is a load case: a short name (D, L, S, W, E, or W1, Wx, Snow...) and its value for each effect. Put **±** (or +/-) in front of values that can reverse. You can paste from a spreadsheet or open a CSV or Excel file.
2. **Combinations.** Write one per line, such as `1.25D + 1.5L + 0.5S`. A factor of 1 can be left out (`D + L`). Name a line with a colon: `ULS 4: 0.9D + 1.4W`. Lines starting with # are notes.
3. **Example sets.** The menu fills in two made-up sets, factored and unfactored, only to show the format. Replace them with the combinations of the code edition for your project.
4. Choose which effect to chart, and download the table as CSV, or the whole report as an image, PDF or Word file.

## Worked example

The page opens with made-up loads on a column: dead load gives N = 400 kN, M = 35 kN·m, V = 18 kN; live 220, 28 and 12; snow 60, 8 and 4; wind ±40, ±95 and ±42; earthquake ±25, ±120 and ±55. With the made-up factored set (7 combinations), the wind and earthquake lines each run twice, giving **11 cases**.

- **Axial force:** largest +860 kN from 1.25D + 1.5L + 0.5S; smallest +304 kN from 0.9D + 1.4W with the wind reversed (W−).
- **Moment:** largest +190.8 kN·m from 1.25D + 1.4W + 0.5L (W+): 1.25 × 35 + 1.4 × 95 + 0.5 × 28 = 190.75. Smallest −101.5 kN·m from 0.9D + 1.4W (W−): 0.9 × 35 − 1.4 × 95.
- **Shear:** +87.3 kN from the wind combination, −42.6 kN from 0.9D + 1.4W (W−).

## Tips

- The largest and smallest values of different effects often come from different combinations. A column, for example, may need checking for the largest axial force with its moment, and the largest moment with its axial force; the full table shows each case's matching values.
- Where a load helps (dead load resisting uplift or overturning), codes use a lower factor. Write that combination separately, as in 0.9D + 1.4W.
- Superposition assumes the structure behaves linearly. For second-order (P-delta) or nonlinear analysis, combine the loads first and analyse each combination.

## FAQ

**Why are there no built-in code combinations?** Factors differ between codes, countries and editions, and change over time. Typing the ones you are required to use keeps the responsibility, and the edition, clear.

**Can I use it for serviceability?** Yes: enter deflections or stresses as effects and unfactored combinations.

**How many loads and combinations can I use?** Up to 12 effects, 60 load cases and 200 combinations.
