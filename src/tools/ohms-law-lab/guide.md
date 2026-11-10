---
name: Ohm's law lab
num: 1041
shelf: learn
code: L16
section: school-physics
title: "Ohm's law lab: slide the voltage, read the ammeter and voltmeter, plot the V-I graph"
summary: "A virtual circuit for Ohm's law. Slide the battery voltage, read the ammeter and voltmeter, record readings and plot V against I. The slope is the resistance. Compare a resistor with a filament bulb, and work out a wire's resistance from its length, thickness and metal."
status: live
ads: false
order: 1041
icon: sliders
works: offline
updated: 2026-11-09
related: [circuit-simulator, resistor-colour-code, led-resistor-calculator]
sources:
  - "Ohm's law V = IR, R = ρL/A, current density J = I/A = σE and drift speed v = I/(neA): standard school physics results."
  - "Resistivities at about 20 °C rounded to two figures (copper 1.7 × 10⁻⁸ Ω m, nichrome 1.1 × 10⁻⁶ Ω m and so on) and one free electron per copper atom (8.5 × 10²⁸ per m³): general textbook values, rounded."
  - "The filament bulb is a made-up teaching model (2 Ω cold, 12 Ω at 6 V), not data for a real bulb."
  - "Checked against an independent NumPy script (np.polyfit for the best line, the wire and drift-speed formulas) and the textbook drift speed of 1.1 × 10⁻⁴ m/s for 1.5 A in 1 mm² of copper."
flow:
  - { icon: sliders, label: "Set volts" }
  - { icon: eye, label: "Read meters" }
  - { icon: chart, label: "Plot V-I" }
  - { icon: check, label: "Check" }
---

## What it does

This is a practice bench for Ohm's law. A battery, an ammeter, a part and a voltmeter are wired up for you. Slide the voltage and watch the ammeter needle move, the electrons drift faster round the circuit and the reading change. Record a few readings and the page plots the **V-I graph** and draws the best straight line through them. For a resistor the points lie on a straight line through zero, and the slope of that line is the resistance. For a filament bulb they do not: the line bends, because the hot filament has more resistance than the cold one.

It follows the electricity topics of Class 10 Science (Ohm's law, the factors a wire's resistance depends on, resistivity) and the current electricity topics of Class 12 Physics (current density, conductivity, drift speed of electrons, materials that do not obey Ohm's law). The **Level** switch adds the Class 12 quantities. When you have the idea, connect resistors together in the [[circuit-simulator]], or read real resistor values with the [[resistor-colour-code]].

## How to use it

1. Pick a **level**: Class 10 shows the readings and V = IR; Class 12 also shows power, and for a wire the current density, conductivity, electric field and (for copper) the drift speed of the electrons.
2. Pick what is in the circuit: a **resistor** (choose 1 to 50 Ω), a **bulb**, or a **wire** (choose the metal, its thickness and its length).
3. Slide the **battery voltage** from 0 to 12 V. The ammeter, voltmeter and the formula line update straight away.
4. Tap **Record this reading** at several voltages, or **Take 6 readings** to record 2, 4, 6, 8, 10 and 12 V in one go. The graph shows your points and the best straight line; the text under it gives the slope (the resistance) or tells you the points bend.
5. Use **Check yourself** at the bottom for fresh questions with new numbers each time.

What each part means:

- **Ammeter**: measures the current, in amperes, and is connected in series. It reads to 0.001 A below 1 A and to 0.01 A above.
- **Voltmeter**: measures the potential difference across the part, in volts, and is connected in parallel with it. It reads to 0.1 V.
- **Resistance now**: V ÷ I for the reading you are looking at.

## Worked example

Choose the wire: nichrome, 0.3 mm thick, 1.00 m long. The area is A = π d² / 4 = π × (0.0003 m)² / 4 = 7.07 × 10⁻⁸ m², so R = ρL/A = 1.1 × 10⁻⁶ × 1.00 ÷ 7.07 × 10⁻⁸ = 15.6 Ω. At 6.0 V the ammeter reads 0.386 A (6 ÷ 15.6). Take 6 readings and the slope comes out at about 15.6 Ω. Now slide the length to 2.00 m: the resistance doubles to 31.1 Ω and the current at 6 V halves to 0.193 A.

With the bulb, 6 readings give V/I from about 6 Ω at 2 V up to about 19 Ω at 12 V, and the page says the points bend.

## Tips

- The V-I graph here has the current across the bottom and the voltage up the side, so the slope is V/I = R. Some books draw it the other way round; then the slope is 1/R.
- Changing the part, the resistance or the wire clears the readings, so one graph is always one part.
- A copper wire has so little resistance that the current gets huge. A real cell could not supply it, and the page warns you.

## FAQ

**Why does the bulb not obey Ohm's law?** Ohm's law needs the temperature to stay the same. A filament gets white hot, and the resistance of a metal rises with temperature, so V/I is bigger at higher voltages.

**Is the bulb a real one?** No. It is a simple teaching model (2 Ω cold, 12 Ω at 6 V) chosen to show the shape of the curve.

**Is anything saved?** No. Your readings and answers stay on this page and are gone when you close it.
