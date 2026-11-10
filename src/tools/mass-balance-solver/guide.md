---
name: Mass balance
num: 664
shelf: science
section: chemical-engineering
title: "Mass balance"
summary: "Describe a process flowsheet in a few lines (mixers, splitters, separators with split fractions, reactors with a conversion) and its feeds, and get every stream's component flows, a degrees-of-freedom check, a stream table and, with heat capacities, the temperatures and heat duties. Recycle loops are solved directly as one linear system."
status: live
ads: true
order: 664
icon: table
works: offline
updated: 2026-11-09
related: [equilibrium-solver, molar-mass-calculator, thermochemistry-calculator, steam-tables, reactor-design, adiabatic-temperature-rise, mccabe-thiele-calculator, heat-exchanger-sizing]
sources:
  - "Steady-state material balances, degrees-of-freedom analysis, extent of reaction, recycle and purge, and sensible-heat energy balances with constant heat capacity: standard chemical engineering, for example Felder, Rousseau and Bullard, Elementary Principles of Chemical Processes, and Himmelblau and Riggs, Basic Principles and Calculations in Chemical Engineering (methods only)."
  - "Molar masses are general facts from standard atomic weights. The heat capacities and heat of reaction in the example are rounded, made-up values for illustration; the example flowsheet is made up."
  - "Checked against an independent NumPy calculation (numpy.linalg.solve on the hand-written balance equations) written for the tests."
flow:
  - { icon: flask, label: "Components" }
  - { icon: link, label: "Flowsheet" }
  - { icon: sigma, label: "Solve" }
  - { icon: table, label: "Streams" }
---

## What it does

Material balances are the first calculation in any chemical process: what goes in must come out, or be made or used up by reaction. This tool solves the balances for a whole flowsheet at once.

You describe the plant as **units** joined by **streams**:

- **Mixer**: several streams join into one.
- **Splitter**: one stream divides into branches with the same make-up (for example a purge and a recycle).
- **Separator**: one stream divides into two, with a split fraction for each component (a condenser, a column, a membrane).
- **Reactor**: one reaction, with the conversion of a key reactant.

Every balance is linear in the component molar flows, so the tool writes all of them as one matrix and solves it in a single step. That handles **recycle loops directly**, with no guessing and iterating of "tear streams" as in a sequential solution. Before solving it does a **degrees-of-freedom analysis**: it counts the unknown flows and the independent equations, and tells you if the problem is fully specified, needs more information (and which flows are still free) or has conflicting specifications.

Add a molar mass for each component to get mass flows and a mass closure check on every unit. Add heat capacities and feed temperatures to get the **energy balance**: the outlet temperature of adiabatic mixers and reactors (with the heat of reaction), and the heat duty of any reactor or separator whose outlet temperature you fix.

Size the reactor in the [[reactor-design|reactor design calculator]], and check how hot it could get with the [[adiabatic-temperature-rise|adiabatic temperature rise calculator]].

## How to use it

1. List the components with their molar mass and, if you want an energy balance, a constant cp.
2. Write one line per unit, for example `separator SEP: S3 -> S4 + S5 | NH3 0.95 | T 25`.
3. Give the feeds, for example `S1: N2 100, H2 300, Ar 1 | T 150`. To fix a different stream instead, write `H2 ?` in the feed and add a line such as `S6 total 50` or `S6 H2 39`.
4. Read the result and stream table. Switch between flows, mole fractions and mass flows; download the table.

## Worked example

A made-up ammonia-style loop: 100 kmol/h of N2, 300 of H2 and 1 of argon at 150 °C join the recycle (M1), 25 % of the N2 reacts (N2 + 3 H2 → 2 NH3), a condenser at 25 °C takes 95 % of the ammonia out as product, and 5 % of the remaining gas is purged to stop the argon building up. There are 28 unknown flows and 28 independent equations: **0 degrees of freedom**. The extent of reaction is 86.96 kmol/h, so the product stream S4 carries **173.46 kmol/h of NH3** (2,954 kg/h) and the purge S6 carries all the argon that comes in, 1 kmol/h. With the example heat capacities the mixer outlet is 60.37 °C, the adiabatic reactor outlet 280.62 °C, and the condenser must remove **2,624 kW**.

## Tips

- If the result says "under-specified", the list of free flows shows where information is missing.
- A purge fraction that is too small makes inerts build up: try 0.01 and watch the argon in the recycle.
- Units with no recycle can be checked by hand one at a time; recycle problems are where the matrix method saves time.

## FAQ

**Why molar flows?** Reactions are written in moles, so molar flows keep every balance linear. Mass flows follow from the molar masses.

**Can it do several reactions or equilibrium?** Not yet: one reaction per reactor, with a set conversion. Use the equilibrium solver for equilibrium conversions, then enter the conversion here.
