---
name: LED resistor calculator
num: 626
shelf: science
section: electrical-and-electronics
title: "LED resistor calculator: series resistor, power, series and parallel strings, nearest E-series value and power budget"
summary: "Work out the series resistor for one LED or a string of LEDs, pick the standard E12, E24 or E96 value, see the resistor and LED power with a safe resistor rating, how much the current moves with forward-voltage spread and supply tolerance, and plan an array of many LEDs as even strings with a power budget."
status: live
ads: true
order: 626
icon: calculator
works: offline
updated: 2026-11-09
related: [resistor-colour-code, op-amp-calculator, circuit-simulator, battery-solar-sizing, pcb-trace-calculator]
sources:
  - "Ohm's law with a straight-line LED model, R = (Vsupply − n × Vf) / I, and P = I²R (general electronics)."
  - "E-series values from the fibub resistor colour code tool (IEC 60063 preferred numbers). Typical LED forward voltages in the list are rough, rounded general figures chosen by fibub, not taken from any data sheet."
  - "Checked against an independent Python calculation. The example values are made up."
flow:
  - { icon: sliders, label: "LEDs" }
  - { icon: calculator, label: "Resistor" }
  - { icon: chart, label: "Current" }
  - { icon: table, label: "Array" }
---

## What it does

An LED needs something to limit its current; the simplest is a resistor in series. This calculator works out that resistor and everything around it:

- The exact resistance, and the standard value to buy in E12, E24 or E96 (the next value up, so the current never goes above your target).
- The real current with that resistor, the **power in the resistor** and the rating to buy (at least twice the heat), and the power in the LEDs.
- **Series and parallel strings**: several LEDs in series share one resistor; several strings in parallel each get their own.
- How much the current changes when the LED's **forward voltage** varies between parts and the **supply** drifts, with a warning when the design is too touchy.
- An **array planner**: give the total number of LEDs and it splits them into even strings, with a resistor for each string length and a **power budget**.

Read the colour bands on the resistor you pick with the [[resistor-colour-code]], and see how long a battery will run your LEDs with the [[battery-solar-sizing|battery runtime calculator]].

## How to use it

1. Type the supply voltage and the LED's forward voltage (Vf) and current from its data sheet. The list of LED types fills in rough typical values if you have no data sheet.
2. Set how many LEDs are in series in each string and how many strings run in parallel.
3. Choose the resistor series you can buy and how much Vf and the supply may vary.
4. For a bigger project, type the total number of LEDs in the planner.

## Worked example

The page opens on a made-up 12 V strip with white LEDs at 3.0 V and 20 mA, three in series per string and four strings. Each string needs (12 − 3 × 3.0) ÷ 0.020 = **150 Ω**, a standard E24 value, which makes 60 mW of heat, so a 1/8 W resistor is fine. The LEDs take 720 mW in all and the supply gives 80 mA (960 mW), so 75 % of the power reaches the LEDs. With Vf ± 0.1 V and the supply ± 5 % the current could be anywhere from 14 mA to 26 mA, which earns a warning: only 3 V is left across the resistor.

For 10 LEDs on the same supply the planner makes **4 strings** (3, 3, 2 and 2 LEDs): 150 Ω for the strings of three and 300 Ω for the strings of two, 960 mW in all with 37.5 % lost in the resistors.

## FAQ

**Why not one resistor for LEDs in parallel?** Each LED's forward voltage is a little different, and the one with the lowest Vf takes most of the current, gets hotter, and takes even more. Give each string its own resistor.

**Why pick the next resistor up?** A slightly larger resistor gives a little less current, which is safer for the LED and barely changes the brightness.

**When should I use a driver instead?** When the resistor would waste a lot of power, when the supply varies a lot (a car or a battery), or for high-power LEDs. A constant-current driver keeps the current steady. For study and planning, not a substitute for professional judgement.
