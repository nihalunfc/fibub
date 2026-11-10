---
name: Input-output multipliers
num: 741
shelf: science
code: T509
section: economics
title: "Leontief input-output calculator: technical coefficients, Leontief inverse, output, income and employment multipliers"
summary: "Paste an input-output table of flows between sectors and final demand. Get the technical coefficients, the Leontief inverse, output multipliers, backward and forward linkages and key sectors, Type I income or job multipliers, and the knock-on effect of any change in final demand."
status: live
ads: true
order: 741
icon: table
works: offline
updated: 2026-11-09
related: [sql-playground, data-cleaner, plot-maker, location-quotient-shift-share, matrix-calculator, supply-demand]
sources:
  - "Method: Wassily Leontief's input-output model, as set out in Miller and Blair, Input-Output Analysis: Foundations and Extensions (2nd ed., 2009): A = Z x̂⁻¹, L = (I − A)⁻¹, simple and Type I multipliers; Rasmussen (1956) linkages. No tables copied."
  - "Written by fibub. Checked in the tests against NumPy (numpy.linalg.inv and matrix products) on the example and a random 5-sector table."
  - "The example table is made up."
flow:
  - { icon: table, label: "Flows" }
  - { icon: sigma, label: "(I − A)⁻¹" }
  - { icon: chart, label: "Multipliers" }
  - { icon: target, label: "Impact" }
---

## What it does

An **input-output table** records how much each sector of an economy buys from every other sector, and how much of its output goes to final users (households, government, investment and exports). Wassily Leontief turned such a table into a model: if final demand for one sector rises, that sector buys more inputs, its suppliers buy more of theirs, and so on. This tool works through the whole model in your browser:

- **Technical coefficients** A: the input from each sector per unit of another sector's output.
- **Leontief inverse** (I − A)⁻¹: the total output of each sector needed, directly and indirectly, per unit of final demand.
- **Output multipliers** (column sums of the inverse), **backward and forward linkages**, and **key sectors**.
- **Type I multipliers** for any quantity you have per sector, such as wages or jobs.
- The **impact** of any change in final demand on each sector's output, wages and jobs.

Check the matrix sums by hand with the [[matrix-calculator]], and compare a region's industries with the [[location-quotient-shift-share|location quotient and shift-share]] tool.

## How to use it

1. Paste the table: one row and one column per sector, in the same order, then a final-demand column. Sector names in the first row and column are optional. If you add a total-output column after final demand, the tool checks that each row adds up.
2. Optionally paste totals per sector to turn into multipliers, one row each, such as wages paid and jobs.
3. Type a change in final demand for any sectors to see the effect.
4. Download everything as CSV, or the report as an image, PDF or Word file.

National statistics offices publish input-output or supply-use tables. Check the official source, and use flows for domestic production only (without imports) if you want domestic multipliers.

## Worked example (made-up table)

Three sectors, Farming, Factories and Services, with total outputs of 100, 250 and 250 ($ million). Factories buy 40 from Farming, so a<sub>Farming,Factories</sub> = 40 ÷ 250 = 0.16. The output multipliers are 1.8551 for Farming, **1.9890 for Factories** and 1.7903 for Services. Factories is the key sector (backward linkage 1.059, forward 1.160).

An extra $10 million of final demand for Factories raises output by 2.85 in Farming, 14.51 in Factories and 2.53 in Services, **19.89 in all**, of which 9.89 is indirect. With the made-up wages and jobs rows, that is $5.35 million of wages and about 1.01 thousand jobs. The Type I employment multiplier of Factories is 3.153: each job in the sector supports about two more in its supply chain.

## Assumptions

The model assumes each sector always uses inputs in the same proportions, has spare capacity, and that prices do not change. It suits small changes; large shocks overstate the effect. Type I multipliers leave out the extra spending by households who earn more (Type II multipliers add it); they are the more cautious figure.

## FAQ

**Why is the multiplier never below 1?** One unit of final demand needs at least one unit of the sector's own output; anything above 1 is the supply chain.

**What does "I − A cannot be inverted" mean?** Some group of sectors uses up all of its own output as inputs, which a real table cannot do. Check for a typing error or a column without its total.
