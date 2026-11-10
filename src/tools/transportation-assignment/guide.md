---
name: Transportation solver
num: 583
shelf: science
section: operations-research
title: "Transportation solver"
summary: "Solve a transportation problem from a starting plan (northwest corner, least cost or Vogel's approximation) to the optimum with the MODI method, showing every step, the u and v potentials and dummy rows for unbalanced problems. Or solve an assignment problem with the Hungarian method, minimising cost or maximising profit. Checked against scipy."
status: live
ads: true
order: 583
icon: table
works: offline
updated: 2026-11-09
related: [graph-algorithms, sql-playground, lp-solver, vehicle-routing, queueing-calculator, project-scheduler, shift-scheduler]
sources:
  - "Standard operations-research methods (northwest corner rule, least-cost method, Vogel's approximation, MODI / u-v method with stepping-stone loops, Hungarian method of Kuhn and Munkres), written by fibub."
  - "Checked against scipy (BSD licence): optimize.linprog (HiGHS) for 150 random transportation problems and optimize.linear_sum_assignment for 150 random assignment tables, including unbalanced, degenerate, forbidden and maximising cases; all optima equal."
  - "The factory and job examples are made up for this tool."
flow:
  - { icon: table, label: "Costs" }
  - { icon: pencil, label: "Start plan" }
  - { icon: sigma, label: "Improve" }
  - { icon: check, label: "Optimum" }
---

## What it does

Two classic problems from an operations research course, solved in your browser with the working shown:

- **Transportation problem**: several sources (factories, depots) with a supply, several destinations (shops, warehouses) with a demand, and a cost per unit on each route. Which routes should carry how much, to meet demand at the lowest total cost? The tool builds a **starting plan** by the **northwest corner** rule, the **least-cost** method or **Vogel's approximation method**, then improves it with the **MODI (u-v) method**, moving goods round stepping-stone loops until no route can lower the cost.
- **Assignment problem**: give each person (or machine) a different job so the total cost or time is lowest, or the total profit highest. Solved by the **Hungarian method**.

Add extra rules with the [[lp-solver|linear programming solver]], and plan the delivery rounds with the [[vehicle-routing|vehicle routing planner]].

## How to use it

1. Choose **Transportation** or **Assignment**, and the **goal**: lowest total cost, or highest total profit.
2. For transportation, paste the cost table with each source's **supply in the last column** and each destination's **demand in the last row** (names in the first row and column are optional). Paste straight from a spreadsheet or open a CSV, TSV or Excel file.
3. Write **x** for a route or pairing that is not allowed.
4. Pick the **starting plan** method. All three reach the same optimum; Vogel usually starts closest to it, northwest corner furthest.
5. Read the answer, the best plan, the improvement steps and the starting plan. Download the plan as CSV, or the whole working as an image, PDF or Word file.

## What the results mean

- **Shaded cells** carry goods; the small number under each is the cost per unit.
- **u and v** are the MODI potentials. On every used route cost = u + v; on every unused route cost − u − v is 0 or more. That is the proof that no cheaper plan exists.
- Each **improvement step** adds the unused route whose cost − u − v is most negative, moves θ units round a loop of used routes, and drops a route that falls to zero.
- **Unbalanced** problems get a dummy destination (spare supply) or dummy source (unmet demand) at zero cost.
- **Degenerate** plans have fewer than rows + columns − 1 used routes; a 0 is kept in a cell so the method can carry on.
- **Other equally good plans** says yes when an unused route has cost − u − v exactly 0.

## Worked example

The example has three factories (supplies 40, 55, 45) and four warehouses (demands 30, 35, 40, 35). The northwest corner rule starts at a cost of **2145**, least cost at **1820** and Vogel at **1780**. MODI takes two steps from the northwest corner, one from least cost and none from Vogel, and all three end at the **lowest total cost of 1780**: F1 sends 5 to W1 and 35 to W4, F2 sends 35 to W2 and 20 to W3, F3 sends 25 to W1 and 20 to W3. scipy's linear programming solver gives the same 1780.

The assignment example gives four people four jobs, with the minutes each would take. The lowest total is **38 minutes**: Asha → Job 3, Ben → Job 2, Chen → Job 1, Dara → Job 4. Choose "highest total" and the largest total is 82.

## Limits

Transportation tables up to 20 × 20 and assignment tables up to 50 × 50. It solves the classic forms only: no transhipment through middle points, no fixed costs per route and no integer-only rules beyond what the methods give (with whole-number supplies and demands the answer is in whole numbers anyway).

## Frequently asked questions

**Why does my answer differ from my textbook's plan?** If "Other equally good plans" says yes, several plans share the lowest cost. Starting plans can also differ when ties are broken another way; the optimal total is the same.

**Is my data stored?** No. Everything runs in your browser and nothing is stored or sent anywhere.
