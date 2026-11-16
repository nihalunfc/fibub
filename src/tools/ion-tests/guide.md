---
name: Ion tests
num: 2260
shelf: learn
code: L346
section: school-chemistry
title: "Ion tests: flame tests, precipitates and mystery salts"
summary: "Run flame, sodium hydroxide, acid, silver nitrate and barium chloride tests on a virtual bench, then identify the cation and anion of a mystery salt from your results."
status: live
ads: false
order: 2260
icon: flask
works: offline
updated: 2026-11-16
related: [reactivity-series, periodic-table, formula-writer]
sources:
  - "Standard school qualitative analysis: flame colours, hydroxide precipitates, carbonate, halide and sulfate tests. Serves GCSE chemistry C8 chemical analysis (required practical), Ontario SCH3U qualitative analysis, A-level inorganic tests and NGSS HS-PS1-1. Maths and data in src/lib/learn/curr-chem.ts, checked in tests/curr-chem.mjs. Drawings are fibub's own."
flow:
  - { icon: flask, label: "Sample" }
  - { icon: sliders, label: "Test" }
  - { icon: search, label: "Clues" }
  - { icon: check, label: "Answer" }
---

## What it does

Chemists identify the ions in a salt by testing it and noticing what happens. Metal ions (cations) show up in flame tests and as coloured or white precipitates with sodium hydroxide. Negative ions (anions) show up with acid, silver nitrate and barium chloride. This virtual bench lets you run each test and see the flame, the precipitate or the gas.

In Mystery salt mode the page hides one cation and one anion. You choose tests, collect clues in a list, and then pick your answer. Practice mode lets you choose the sample yourself. Pair it with [[periodic-table]] for group trends, [[reactivity-series]] for the metals and [[formula-writer]] to write the salt's formula.

## How to use it

1. Choose Mystery salt or Practice.
2. Press the test buttons. Each result is added to your list.
3. Think about which ions fit all your results.
4. In Mystery salt mode, choose your cation and anion and press Check my answer.
5. Switch to the upper level to see the ionic equation for each precipitate or gas.

## What each setting does

- **Flame test:** lithium crimson, sodium yellow, potassium lilac, calcium orange-red, copper green.
- **NaOH drops and excess:** copper(II) blue, iron(II) green, iron(III) brown, calcium, magnesium and aluminium white. Only the aluminium precipitate dissolves in excess.
- **Dilute acid:** carbonates fizz, and the gas turns limewater milky.
- **AgNO₃ with HNO₃:** chloride white, bromide cream, iodide yellow.
- **BaCl₂ with HCl:** sulfate gives a white precipitate.

## Worked example

A sample gives no flame colour. With a few drops of sodium hydroxide it gives a white precipitate, and the precipitate dissolves in excess. That points to aluminium (calcium and magnesium precipitates do not dissolve). Barium chloride then gives a white precipitate, so the anion is sulfate. The salt is aluminium sulfate, Al₂(SO₄)₃.

## FAQs

**Why does calcium need a flame test?** Calcium, magnesium and aluminium all give white precipitates. Calcium gives an orange-red flame, magnesium none, and only aluminium dissolves in excess.

**Why is acid added in the halide and sulfate tests?** It removes carbonate, which would also form a white precipitate and give a false result.

**Why is no iron colour drawn in the solution?** The solutions are drawn colourless on purpose so the tests, not the colour of the solution, give the answer.
