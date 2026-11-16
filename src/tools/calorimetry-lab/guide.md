---
name: Calorimetry lab
num: 2237
shelf: learn
code: L337
section: school-chemistry
title: "Calorimetry lab: specific heat and final temperature"
summary: "Drop a hot metal into water and see the final temperature, the heat that moved and the specific heat worked back from the result. Choose different metals and amounts to see why water warms so slowly."
status: live
ads: false
order: 2237
icon: flask
works: offline
updated: 2026-11-16
related: [heating-curve, bomb-calorimeter, thermochemistry-calculator]
sources:
  - "Heat transfer q = m c ΔT and heat balance are standard physics and chemistry (NGSS MS-PS3-4, HS-PS3-4). Specific heats are standard textbook values near room temperature: water 4.184, aluminium 0.897, iron 0.449, copper 0.385, lead 0.129 J/g°C. Checked in tests/sci.mjs. The model assumes no heat is lost to the cup or air."
flow:
  - { icon: sliders, label: "Masses" }
  - { icon: curve, label: "Cooling" }
  - { icon: calculator, label: "Final T" }
  - { icon: check, label: "Quiz" }
---

## What it does

Heat always flows from a hotter object to a cooler one until they reach the same temperature. In a well-insulated cup, the heat the hot metal loses is exactly the heat the cool water gains. This page uses that fact to find the **final temperature** when you drop a hot metal into water, and to work backward from a measured final temperature to the metal's **specific heat**, the heat needed to warm 1 g by 1 °C.

The graph shows both temperatures moving toward the dashed final line. The formula is q = m × c × ΔT. Water has a very high specific heat (4.184 J/g°C), which is why it warms slowly and cools slowly. Related tools: [[heating-curve]] for changes of state, [[bomb-calorimeter]] for burning fuels, and [[thermochemistry-calculator]] for reaction heat.

## How to use it

1. Choose a metal.
2. Set the mass and starting temperature of the water and of the metal.
3. Read the final temperature and the heat moved.
4. Compare metals with the same masses and temperatures.
5. Answer the quiz, including one that finds a metal's specific heat.

## What each setting does

- **Metal:** sets the specific heat of the solid.
- **Water mass and temperature:** the cool starting point.
- **Metal mass and temperature:** the hot starting point.

## Worked example

Drop 100 g of aluminium at 95 °C into 100 g of water at 20 °C. The final temperature is (100 × 4.184 × 20 + 100 × 0.897 × 95) ÷ (100 × 4.184 + 100 × 0.897) = 33.2 °C. The water warms by 13.2 °C and gains about 5,540 J, and the metal loses the same.

## FAQs

**Why do real experiments give a lower specific heat?** Some heat escapes to the cup and air, so the water warms less than the model says.

**Why does the order of the curves not matter?** Only the final temperature and the heat balance matter here; the time axis is only schematic.

**Can I use any metal?** Choose from the five metals here; other materials have their own specific heats.
