---
name: McCabe-Thiele calculator
num: 119
shelf: science
section: chemical-engineering
title: "McCabe-Thiele calculator: distillation stages, minimum reflux, q-line and feed stage"
summary: "Step off the theoretical stages of a binary distillation column on a McCabe-Thiele diagram, from a relative volatility or your own x-y data. Gives minimum reflux (including tangent pinches), Fenske minimum stages, the best feed stage, real trays and column flows."
status: live
ads: true
order: 1
icon: curve
works: offline
updated: 2026-11-08
related: [phase-diagram-calculator, gas-law-calculator, thermochemistry-calculator]
sources:
  - "McCabe-Thiele method (McCabe and Thiele, 1925), Fenske equation (1932) and Gilliland correlation in Eduljee's fitted form (1975): standard chemical engineering methods, written from the equations; no tables copied."
  - "Example equilibrium data on the page are made up by fibub for illustration; they are not measured values for any real mixture."
  - "Worked example written by fibub."
flow:
  - { icon: flask, label: "Mixture" }
  - { icon: sliders, label: "Column" }
  - { icon: curve, label: "Steps" }
  - { icon: table, label: "Stages" }
---

## What it does

A distillation column splits a mixture of two liquids by boiling. Each tray (a "stage") lets rising vapour and falling liquid reach equilibrium, so the vapour gets a little richer in the more volatile, light component each step up. The **McCabe-Thiele diagram** is the classic way to count how many such stages a separation needs. You draw the equilibrium curve, the operating lines from the mass balances, and then step between them like a staircase from the top product down to the bottom product.

This tool draws the diagram and counts the stages for you. It also works out the **minimum reflux**, the **minimum number of stages**, the best **feed stage**, the number of **real trays** for a chosen efficiency, and the column **flows**.

## How to use it

1. Choose the equilibrium. With a **constant relative volatility α**, y = αx / (1 + (α − 1)x). That suits ideal mixtures such as benzene and toluene. For anything else, pick **My x–y data** and paste or open two columns: liquid mole fraction x and vapour mole fraction y of the light component. The tool adds (0, 0) and (1, 1) and draws a smooth, wiggle-free curve through your points.
2. Enter the light-component mole fractions of the **feed (xF)**, **distillate (xD)** and **bottoms (xB)**.
3. Set the **feed condition q**: 1 for a liquid at its boiling point, 0 for a saturated vapour, a fraction for a part-vapour feed, above 1 for a cold liquid, below 0 for a superheated vapour. It sets the slope of the q-line.
4. Choose the **reflux**: a multiple of the minimum (1.2 to 1.5 is a common design choice), a reflux ratio L/D of your own, or total reflux to see the fewest stages possible.
5. Optionally give a **feed rate** for the flows and an **overall tray efficiency** to turn theoretical stages into real trays.

## What each result means

- **Minimum reflux**: the lowest reflux at which the separation is possible with endless stages. Usually the pinch is where the q-line meets the curve. With non-ideal data the curve may touch the top operating line above the feed first; the tool then reports a **tangent pinch**.
- **Theoretical stages**: counted from the total condenser at the top. The last stage is the partial reboiler. The stepped fraction shows how much of the last step was needed.
- **Feed stage**: the step that crosses where the operating lines meet. Feeding there gives the fewest stages.
- **Minimum stages**: from the Fenske equation with a constant α, or by stepping against y = x with data.
- **Gilliland estimate**: a quick shortcut correlation, useful as a cross-check.
- **Flows**: distillate D and bottoms B from the component balance, then the liquid and vapour flows above and below the feed.

## Worked example

A saturated-liquid feed of 100 kmol/h has 50 % light component. The relative volatility is 2.5. The targets are 95 % in the distillate and 5 % in the bottoms.

The q-line is vertical at x = 0.5 and meets the curve at y = 0.714, so the **minimum reflux is 1.100**. At 1.5 times that, R = 1.65. Stepping gives **12 theoretical stages (11.67)**, with the **feed on stage 6**. Fenske gives at least 6.43 stages, and Gilliland estimates 12.3. At 70 % tray efficiency the column needs **16 real trays** plus the reboiler. The flows are D = 50 and B = 50 kmol/h; L = 82.5 and V = 132.5 above the feed; L′ = 182.5 and V′ = 132.5 below it.

## Good to know

- The method assumes **constant molar overflow**: the two components have similar molar heats of vaporisation, so flows stay the same within each section. For very different heats, use an enthalpy method or a process simulator.
- An **azeotrope** inside your range stops the separation; the tool says so.
- The real-tray count uses one overall efficiency. Real trays vary up the column.

## FAQ

**Why does the stage count shoot up near the minimum reflux?** The operating line gets close to the equilibrium curve, so the steps become tiny near the pinch.

**Should the reboiler count as a stage?** It usually acts as one equilibrium stage, so the tool counts it. A total condenser does not change composition, so it is not a stage.

**Where do I get x–y data?** From a lab measurement, a handbook or a thermodynamic model. Check its licence before you share it.
