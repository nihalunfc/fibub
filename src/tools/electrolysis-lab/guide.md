---
name: Electrolysis lab
num: 2259
shelf: learn
code: L345
section: school-chemistry
title: "Electrolysis lab: products at the cathode and anode"
summary: "Pick a molten or dissolved electrolyte and watch ions drift to the electrodes. See what forms at the cathode and anode, the rule that decides it, the half-equations and how much is made."
status: live
ads: false
order: 2259
icon: flask
works: offline
updated: 2026-11-16
related: [galvanic-cell, reactivity-series, electroplating-calculator]
sources:
  - "Standard school electrolysis rules and the Faraday constant (96 485 C/mol); room-temperature molar gas volume 24 dm³/mol. Serves GCSE chemistry C4 (electrolysis and the required practical), A-level electrochemistry, Ontario SCH4U electrochemistry and NGSS HS-PS1-2. Maths in src/lib/learn/curr-chem.ts, checked in tests/curr-chem.mjs. Drawings are fibub's own."
flow:
  - { icon: flask, label: "Choose" }
  - { icon: play, label: "Watch" }
  - { icon: sliders, label: "Faraday" }
  - { icon: check, label: "Quiz" }
---

## What it does

Electrolysis uses electricity to break up a compound that is melted or dissolved. The positive ions (cations) are pulled to the negative electrode, the cathode, and gain electrons. The negative ions (anions) go to the positive electrode, the anode, and lose electrons. This lab shows eight electrolytes with ions drifting across the cell and bubbles or metal forming at each electrode.

Under the picture you see what forms at each electrode and the rule that decided it. At the cathode, a metal forms if the metal is less reactive than hydrogen (or if the compound is molten); otherwise hydrogen gas forms. At the anode, a halogen forms if a halide ion is present; otherwise oxygen forms. To compare with other cells and metals, try [[galvanic-cell]], [[reactivity-series]] and [[electroplating-calculator]].

## How to use it

1. Choose an electrolyte from the menu.
2. Watch the ions move and the products form. Press Pause to freeze the picture.
3. Read the product at each electrode and the rule underneath.
4. Switch to the 11 to 12 level for half-equations and Faraday mode.
5. In Faraday mode, move the current and time sliders and read the moles of electrons and the mass made.
6. Answer the quiz, which uses new numbers each time.

## What each setting does

- **Electrolyte:** what is in the cell. Molten means melted with no water; aqueous means dissolved in water.
- **Current (A):** how much charge flows each second.
- **Time (s):** how long the current flows.
- **Level:** the lower level gives products and rules; the upper level adds half-equations and calculations.

## Worked example

Copper(II) sulfate solution with inert electrodes, 2.0 A for 965 s. Charge Q = 2.0 × 965 = 1930 C. Moles of electrons = 1930 ÷ 96 485 = 0.0200 mol. At the cathode Cu²⁺ + 2e⁻ → Cu, so 0.0100 mol of copper forms, a mass of 0.0100 × 63.5 = 0.635 g. At the anode oxygen forms, 4OH⁻ → O₂ + 2H₂O + 4e⁻, so 0.0050 mol of O₂, about 120 cm³ at room temperature.

## FAQs

**Why does brine give hydrogen and not sodium?** Sodium is more reactive than hydrogen, so the H⁺ ions from the water are discharged instead. The solution is left with sodium hydroxide.

**Why does the copper anode shrink?** With copper electrodes the anode itself loses electrons and dissolves. The same amount of copper is deposited on the cathode, so the blue solution stays the same colour.

**Why do the ion tiles all look alike?** They are a simplified picture. Real solutions also contain H⁺ and OH⁻ ions from water, which is why they matter in the rules.
