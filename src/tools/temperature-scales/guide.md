---
name: Temperature scales
num: 1346
shelf: learn
code: L208
section: school-physics
title: "Temperature scales"
summary: "Drag one thermometer and read Celsius, Fahrenheit and kelvin side by side, with the conversion worked out. See a gas thermometer's straight lines all reach zero pressure at −273.15 °C, and at Class 11 add Rankine and make a scale of your own."
status: live
ads: false
order: 1346
icon: sliders
works: offline
updated: 2026-11-09
related: [heating-curve, kinetic-theory, gas-law-calculator, unit-converter]
sources:
  - "Celsius, Fahrenheit, kelvin and Rankine relations: F = 9/5 C + 32, K = C + 273.15, °R = 9/5 K; 0 K = −273.15 °C by the definition of the kelvin (SI Brochure, BIPM)."
  - "Constant-volume gas thermometer: p proportional to absolute temperature for an ideal gas (Gay-Lussac's law): standard physics."
  - "Landmarks are rounded general values: water boils at 100 °C at standard sea-level pressure, body temperature about 37 °C, lead melts at about 327.5 °C."
  - "Checked against an independent Python calculation of the same formulas."
flow:
  - { icon: sliders, label: "Drag" }
  - { icon: ruler, label: "Read scales" }
  - { icon: chart, label: "Zero line" }
  - { icon: check, label: "Check" }
---

## What it does

Three thermometers stand side by side, marked in **Celsius**, **Fahrenheit** and **kelvin**. They share one liquid level, because they are measuring the same temperature; only the numbers painted on them differ. Drag the level up and down (or type a temperature in any scale) and every reading changes together, with the conversion formulas filled in with your numbers.

A second picture answers the question every student asks: why does the kelvin scale start at **−273.15 °C**? It shows a constant-volume gas thermometer. Pressure against temperature is a straight line, and if you carry the line on to colder temperatures it reaches zero pressure at −273.15 °C, whatever the amount of gas. That point is **absolute zero**, the zero of the kelvin scale.

It serves Class 7 and 8 Science (heat and measuring temperature), Class 9 (matter and the kelvin scale) and Class 11 Physics, Thermal Properties of Matter (temperature scales, the ideal-gas equation and absolute temperature). See [[heating-curve]] for what happens to water as it warms, [[kinetic-theory]] for what temperature means for the molecules, and [[gas-law-calculator]] to put kelvin to work in the gas laws.

## How to use it

1. **Level**: *Class 8–10* shows Celsius, Fahrenheit and kelvin. *Class 11* adds the **Rankine** scale and a card where you **make your own scale**.
2. **Drag** on the thermometer, move the **Temperature** slider, or **type** a value and choose its scale. The other readings follow.
3. The landmark buttons jump to **absolute zero**, **−40°**, **ice melting**, **body temperature** and **water boiling**.
4. On the gas graph, the **Gas in the flask** slider changes how much gas is trapped (its pressure at 0 °C). The three lines are half, the same and one and a half times that amount.
5. At Class 11, type the **ice point** and **steam point** of your own scale. The page gives the reading on your scale and the one temperature where it agrees with Celsius.

## Worked example

The page opens at 25 °C. Then F = 1.8 × 25 + 32 = **77 °F** and K = 25 + 273.15 = **298.15 K**. With 100 kPa of gas in the flask at 0 °C, the pressure at 25 °C is 100 × 298.15 / 273.15 = **109.2 kPa**.

Press **−40°**: F = 1.8 × (−40) + 32 = −40 °F, so the two scales agree there. K = 233.15 K.

Class 11: a scale reading 20 at melting ice and 220 at boiling water reads 20 + 200 × 25 / 100 = **70** at 25 °C. It agrees with Celsius where C = 20 + 2C, so at C = **−20 °C**.

## Check yourself

Five fresh questions each time: Celsius to Fahrenheit, Fahrenheit to Celsius, kelvin to Celsius, a reading on a made-up scale, and where two scales read the same. Answers are checked on the page and the working is shown. Nothing is saved.

## Tips

- A change of 1 °C is a change of 1 K, but a change of 1.8 °F. Temperature *differences* convert without the 32 or the 273.15.
- Write kelvin as K, never °K, and never negative.
- Gas laws (pV = nRT and the rest) only work with temperatures in kelvin.

## FAQ

**Has anything reached absolute zero?** No. Laboratories have cooled atoms to within a billionth of a kelvin, but absolute zero itself can be approached, never reached.

**Why does the gas line stop being solid below −50 °C?** Real gases turn liquid before they get that cold, so the dashed part is the line carried on (extrapolated), not a measurement.

**Why 9/5?** Between melting ice and boiling water there are 100 Celsius degrees but 180 Fahrenheit degrees (32 to 212), and 180/100 = 9/5.
