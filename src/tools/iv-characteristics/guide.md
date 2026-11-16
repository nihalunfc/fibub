---
name: I-V characteristics
num: 2264
shelf: learn
code: L340
section: school-physics
title: "I-V characteristics: plot current against voltage for a resistor, lamp, diode, thermistor and LDR"
summary: "Choose a component, sweep the supply from -6 V to +6 V and record readings one at a time to build its current-voltage graph, with R = V/I at every point."
status: live
ads: false
order: 2264
icon: sliders
works: offline
updated: 2026-11-16
related: [ohms-law-lab, simple-circuit-lab, internal-resistance]
sources:
  - "Ohm's law and I-V characteristics of a resistor, filament lamp, diode, NTC thermistor and LDR, as in the GCSE required practical on I-V, Ontario SPH3U electricity and NGSS HS-PS3 energy and electric forces. The numbers are fibub's own model values: resistor 100 ohm, thermistor 1000 ohm at 20 C and 250 ohm at 60 C, LDR 300 ohm in light and 5000 ohm in the dark, diode with a Shockley-type curve (turn-on about 0.6 V) and a 10 ohm protective resistor, filament lamp R = R0(1 + I/I1) with R0 = 10 ohm and I1 = 0.1 A. Checked in tests/curr-physics.mjs. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Pick part" }
  - { icon: pointer, label: "Set volts" }
  - { icon: curve, label: "Record" }
  - { icon: check, label: "Quiz" }
---

## What it does

In the real practical you wire a component to a variable supply, put an ammeter in series and a voltmeter across it, then change the voltage and write down the current each time. Plotting those readings gives the component's **I-V characteristic**, a graph that shows how it behaves. This page does the same on screen, with no wires to get wrong.

Choose a fixed resistor, a filament lamp, a diode, a thermistor (at two temperatures) or an LDR (in light and in the dark). Slide the supply from -6 V to +6 V and press Record reading to add a point. Tick the full curve to check your points against the whole shape. For the step before and after this one, use [[ohms-law-lab]], [[simple-circuit-lab]] and [[internal-resistance]].

## How to use it

1. Pick a component from the menu.
2. Move the voltage slider. The ammeter and voltmeter in the picture change.
3. Press Record reading at each voltage you want. Record both positive and negative values.
4. Watch the points join into a curve. Use Record every volt to add 13 points at once.
5. Read R = V / I under the picture for the point you are on.
6. Answer the quiz questions, which use new numbers each time.

## What each setting does

- **Component:** which part is in the circuit. Changing it clears your points.
- **Supply voltage:** the voltage the cell or power supply gives, reversed when negative.
- **Record reading:** keeps the current point and joins it to the others.
- **Show the full curve:** draws the model's whole line as a dashed guide.

## Worked example

Take the fixed resistor and set 3.0 V. Its current is 3.0 / 100 = 0.030 A, or 30 mA, so R = 3.0 / 0.030 = 100 ohms. At -3.0 V the current is -30 mA, so the graph is a straight line through the origin. Now switch to the filament lamp at 6.0 V. The model gives 0.20 A, so R = 6.0 / 0.20 = 30 ohms, three times its cold value of 10 ohms. The line bends because the filament heats up.

The lamp is a simple model, not a measurement: a real filament resistance depends on its temperature and size.

## FAQs

**Why is the lamp graph curved?** The filament gets hot, so its resistance rises as the current rises. Ohm's law only holds at steady temperature.

**Why does the diode do almost nothing below 0.6 V?** A silicon diode needs about 0.6 V forward before it conducts well. In reverse it passes only a tiny leakage current.

**Is R = V / I the slope of the curve?** No. R is the slope of the line from the origin to the point. The gradient of the curve at the point is a different quantity.

**Why do the thermistor and LDR lines differ?** The thermistor's resistance falls as it warms. The LDR's resistance falls as light increases. Each is a straight line at a fixed temperature or light level in this model.
