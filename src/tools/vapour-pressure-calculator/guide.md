---
name: Vapour pressure
num: 120
shelf: science
section: chemical-engineering
title: "Vapour pressure"
summary: "Work out vapour pressure and boiling point from Antoine constants, then the bubble and dew points, flash split, relative volatility and Txy and xy diagrams of an ideal two-component mixture (Raoult's law)."
status: live
ads: true
order: 2
icon: flask
works: offline
updated: 2026-11-08
related: [mccabe-thiele-calculator, phase-diagram-calculator, colligative-properties, gas-law-calculator]
sources:
  - "Antoine equation (Antoine, 1888), Raoult's law and the Clausius-Clapeyron relation: standard physical chemistry, written from the equations."
  - "Example Antoine constants: widely published textbook values, rounded by fibub (A to 3 decimals, B and C to 1 decimal) and labelled approximate. Each is checked against the compound's normal boiling point, a general fact."
  - "Worked example written by fibub."
flow:
  - { icon: flask, label: "Compounds" }
  - { icon: sliders, label: "T and P" }
  - { icon: curve, label: "Txy curve" }
  - { icon: target, label: "Bubble, dew" }
---

## What it does

Every liquid has a **vapour pressure**: the pressure of its own vapour when the two are in balance. It climbs steeply with temperature, and the liquid boils when it reaches the pressure around it. The **Antoine equation** describes that curve with three constants:

log₁₀ P = A − B / (C + T)

This tool turns Antoine constants into vapour pressures and boiling points, and estimates the heat of vaporisation from the slope of the curve. Give it two components and it treats them as an **ideal mixture** (Raoult's law), working out where the mixture starts to boil, where it is fully vapour, how a flash splits it, and how much easier one component is to boil off than the other.

Step off distillation stages with the [[mccabe-thiele-calculator]], and see boiling and freezing point changes in solutions with the [[colligative-properties]].

## How to use it

1. For each component, pick an example or choose **My own constants** and type A, B and C. Set the pressure unit the constants were made for (mmHg is the most common). Temperature is in °C.
2. Make component 1 the lighter, lower-boiling one. The tool warns you if it is the other way round.
3. Enter a **temperature** and a **pressure**. The table shows each pure component's vapour pressure at that temperature, boiling point at that pressure and heat of vaporisation.
4. Enter the **mole fraction** of component 1 in the mixture.

## What each result means

- **Bubble point**: the temperature at which the liquid first starts to boil, and the composition of that first bubble.
- **Dew point**: the temperature at which a vapour of this composition first starts to condense; above it, everything is vapour.
- **Bubble and dew pressure**: the same idea at a fixed temperature, changing the pressure instead.
- **Flash**: at your temperature and pressure, how much of the feed is vapour and what the two phases contain.
- **Relative volatility α**: the ratio of the two vapour pressures. It is shown at each pure boiling point and as their geometric mean, ready for the [McCabe-Thiele calculator](/science/mccabe-thiele-calculator/).
- **Txy diagram**: the bubble curve (liquid) and dew curve (vapour) against composition. Between them the mixture is part liquid, part vapour.

## Worked example

Take benzene and toluene, a nearly ideal pair, at 1 atm (101.325 kPa), with an equal mole mixture.

The pure boiling points are 80.06 °C and 110.58 °C. The mixture starts to boil at **92.07 °C**, and the first vapour is 71.4 % benzene. It is fully vapour at **98.73 °C**, where the last drop of liquid is 29.1 % benzene.

At 95 °C, benzene's vapour pressure is 157.1 kPa and toluene's is 63.7 kPa. A 50:50 feed flashed at 95 °C and 1 atm is **43.7 % vapour**, with liquid at 40.3 % and vapour at 62.5 % benzene. The mean relative volatility is **2.47**.

## Good to know

- Antoine constants only hold over the temperature range they were fitted for. The examples show their range, and the table flags values outside it.
- Some references use kelvin, natural logarithms or other pressure units. Convert to °C and log₁₀ first, then pick the right pressure unit.
- Raoult's law ignores how molecules attract each other. Real mixtures such as ethanol and water, or acetone and chloroform, depart from it strongly; they need activity coefficient models (Wilson, NRTL, UNIQUAC).
- The heat of vaporisation comes from the Clausius-Clapeyron relation. It assumes an ideal vapour and a small liquid volume, so it is a few percent off near the critical point.

## FAQ

**Why does water boil at about 90 °C in the mountains?** The air pressure is lower. Enter 70 kPa for water and the boiling point drops to about 90 °C.

**Where do I find Antoine constants?** In handbooks, the NIST Chemistry WebBook and textbook appendices. Check the units and the temperature range before you use them.
