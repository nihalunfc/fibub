---
name: Galvanometer conversion
num: 1413
shelf: learn
code: L254
section: school-physics
title: "Galvanometer conversion"
summary: "Turn a moving-coil galvanometer into an ammeter with a shunt, or into a voltmeter with a series resistance. Set the coil resistance, its full-scale current and the range you want; get the resistance with the formula and your numbers, the meter's own resistance, and a relabelled meter face that you can test."
status: live
ads: false
order: 1413
icon: calculator
works: offline
updated: 2026-11-09
related: [ohms-law-lab, wheatstone-bridge, internal-resistance, biot-savart]
sources:
  - "Shunt S = Ig G / (I₀ − Ig), series resistance R = V₀ / Ig − G, meter resistances G S / (G + S) and G + R, and the current divider I S / (G + S): standard circuit results."
  - "Checked by hand (G = 50 Ω, Ig = 1 mA: a 2 A ammeter needs S = 25.0 mΩ; a 10 V voltmeter needs R = 9950 Ω) and by checking that the full range always drives exactly Ig through the coil."
flow:
  - { icon: sliders, label: "Coil G, Ig" }
  - { icon: target, label: "Pick range" }
  - { icon: calculator, label: "S or R" }
  - { icon: check, label: "Test" }
---

## What it does

A **moving-coil galvanometer** is a very sensitive meter: a coil in a magnetic field turns when a tiny current flows, and the needle shows how much. A typical one gives full-scale deflection at about 1 mA and has a coil resistance of tens of ohms. On its own it cannot measure big currents or voltages, but adding one resistor fixes that:

- **Ammeter:** a small **shunt** S in parallel lets most of the current bypass the coil. S = Ig G / (I₀ − Ig).
- **Voltmeter:** a large **resistance** R in series limits the current, so the full range V₀ just drives Ig. R = V₀ / Ig − G.

This page works out S or R with your numbers, shows the meter's own resistance (an ammeter should be tiny, a voltmeter huge), and redraws the meter face with the new scale outside and the coil current inside. Move the **Test it** slider to put a current or voltage through it and watch the needle and the current split.

It follows the Class 12 Physics chapter on moving charges and magnetism (the moving-coil galvanometer and its conversion into an ammeter and a voltmeter) and the matching practical. Meters are used in the [[ohms-law-lab]]; a galvanometer finds the balance in the [[wheatstone-bridge]], and [[biot-savart]] shows where the coil's turning force comes from.

## How to use it

1. Choose **Make an ammeter** or **Make a voltmeter**.
2. Set the galvanometer's **coil resistance G** and its **full-scale current Ig** (in milliamperes).
3. Pick the **new range**.
4. Read the shunt or series resistance, the formula with your numbers and the meter's resistance.
5. Slide **Test it** from 0 to 120% of the range. Past 100% the needle hits the stop.

## Worked example

A galvanometer has G = 50 Ω and Ig = 1 mA. To read up to 2 A, the shunt is S = 0.001 × 50 / (2 − 0.001) = **25.0 mΩ**. The ammeter's resistance is G S / (G + S) = 25.0 mΩ too, almost all from the shunt. When 1 A flows, 0.5 mA goes through the coil (half of full scale) and the rest through the shunt.

To read up to 10 V instead, R = 10 / 0.001 − 50 = **9950 Ω**, so the voltmeter's resistance is 10 kΩ: 1000 ohms per volt, whatever the range. Across 5 V it draws 0.5 mA, half of full scale.

## Tips

- An ammeter goes in series, so it must have a very low resistance; a voltmeter goes in parallel, so it must have a very high one.
- A more sensitive galvanometer (smaller Ig) makes a better voltmeter: more ohms per volt, so it disturbs the circuit less.
- Shunts for big ranges are tiny, often a short thick strip of metal.

## FAQ

**Why can the range not be smaller than Ig (or Ig G)?** The galvanometer already reaches full scale there; a shunt or series resistor can only extend the range.

**Do real multimeters work like this?** Old analogue ones do, with a switch choosing different shunts and series resistors. Digital meters measure a voltage electronically instead.

**Is this an official NCERT resource?** No. fibub is independent; the page follows the topics in the syllabus in its own words.
