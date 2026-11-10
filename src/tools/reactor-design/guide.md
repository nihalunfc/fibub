---
name: Reactor design
num: 665
shelf: science
code: T462
section: chemical-engineering
title: "Reactor design"
summary: "Size an isothermal CSTR, plug flow reactor, train of equal CSTRs or batch reactor for a target conversion, or find the conversion a given size reaches. n-th order, reversible first-order and saturating rate laws, an Arrhenius rate constant, gas-phase volume change, a Levenspiel plot and conversion-volume curves."
status: live
ads: true
order: 665
icon: flask
works: offline
updated: 2026-11-09
related: [mass-balance-solver, reaction-kinetics-fitter, enzyme-kinetics-fitter, equilibrium-solver, adiabatic-temperature-rise, ode-solver, thermochemistry-calculator]
sources:
  - "Design equations of ideal reactors (CSTR, PFR, batch, CSTRs in series), the Levenspiel plot, the Arrhenius equation and the volume-change factor ε: standard chemical reaction engineering, for example Fogler, Elements of Chemical Reaction Engineering, and Levenspiel, Chemical Reaction Engineering (methods only)."
  - "The example rate constant, activation energy and feed are made up."
  - "Checked against an independent SciPy calculation (solve_ivp, quad and brentq) for five rate laws, written for the tests."
flow:
  - { icon: flask, label: "Rate law" }
  - { icon: sliders, label: "Reactor" }
  - { icon: curve, label: "Levenspiel" }
  - { icon: table, label: "Sizes" }
---

## What it does

The same reaction can need very different reactor sizes depending on how the reactor is mixed. This tool works out, for one reaction A → products at a fixed temperature, the size of four ideal reactors:

- a **CSTR** (continuous stirred tank), where the whole tank sits at the exit concentration;
- a **PFR** (plug flow reactor, a long tube), where the concentration falls along the length;
- **N equal CSTRs in series**, which behave more and more like a PFR as N grows;
- a **batch reactor** at constant volume, for which the answer is a reaction time.

Choose the rate law: **n-th order** (−rA = k·CA^n, any order from 0 to 5), **reversible first order** A ⇌ B (the conversion cannot pass equilibrium, Xe = K/(1+K)) or a **saturating** law of Michaelis-Menten form, −rA = k·CA/(Km + CA). The rate constant is moved from a reference temperature to the reactor temperature with the **Arrhenius** equation. For gas-phase flow reactors, ε accounts for the change in the number of moles.

You can size the reactors for a target conversion or find the conversion a given volume (or batch time) reaches. The **Levenspiel plot** shows FA0/(−rA) against conversion: the CSTR volume is the rectangle, the PFR volume the area under the curve. A second chart shows conversion against volume for all three flow arrangements.

Fit the rate constant from your lab data with the [[reaction-kinetics-fitter]], and check the heat released with the [[adiabatic-temperature-rise|adiabatic temperature rise calculator]].

## How to use it

1. Pick the rate law and give the order, K or Km.
2. Give k at a reference temperature, the activation energy and the reactor temperature, the feed concentration and ε (0 for liquids). Keep units consistent: concentrations in mol/L, volumes in L, and k in the units shown for your chosen time unit.
3. Give the feed flow, the number of tanks for the series, and either the target conversion or the reactor volume and batch time.

## Worked example

A made-up second-order liquid reaction, k = 0.15 L/(mol·min) at 50 °C with Ea = 60 kJ/mol, run at 60 °C: k rises to 0.2932 L/(mol·min). With CA0 = 1 mol/L and 10 L/min of feed, **80 % conversion needs a 136.4 L PFR but a 682.1 L CSTR**, five times as big, because the CSTR works at the low exit concentration where the rate is slow. Three equal CSTRs in series need 230.7 L in all, and a batch reactor needs 13.64 min. Switching to "conversion from a given size", a 200 L CSTR reaches 66.36 % and a 200 L PFR 85.43 %.

## Tips

- For positive-order reactions the PFR is always the smallest flow reactor; for zero order the two are equal.
- A few tanks in series recover most of the PFR's advantage; try 2, 3 and 5.
- With a reversible reaction, aim well below the equilibrium conversion: the size grows without limit as you approach it.

## FAQ

**Is the reactor isothermal?** Yes. Heat effects are not included; a strongly exothermic reaction needs an energy balance as well (the mass and energy balance solver gives the adiabatic outlet temperature for a set conversion).

**What about pressure drop or non-ideal mixing?** Not included. Real reactors sit between the ideal CSTR and PFR; a residence time distribution study tells you where.
