---
name: Resistor colour code
num: 622
shelf: science
section: electrical-and-electronics
title: "Resistor colour code calculator: 4, 5 and 6 bands both ways, nearest E-series value and voltage divider designer"
summary: "Read a resistor's colour bands (3 to 6 bands) as ohms, tolerance and temperature coefficient, or turn a value into its colour bands; find the nearest standard value in E6 to E192; and design a voltage divider from a pair of standard resistors with worst-case output, current and power."
status: live
ads: true
order: 622
icon: ruler
works: offline
updated: 2026-11-09
related: [circuit-simulator, uncertainty-calculator, led-resistor-calculator, op-amp-calculator, filter-designer, pcb-trace-calculator]
sources:
  - "Band meanings (digits, multipliers including gold, silver and pink, tolerance and temperature coefficient colours) follow the colour code of IEC 60062, a general convention printed on parts and in electronics textbooks."
  - "E-series preferred numbers: E3 to E24 are the well-known IEC 60063 lists; E48, E96 and E192 are 10^(i/n) rounded to three figures, with 9.20 in E192 as the standard has it."
  - "Divider pairs checked against an independent brute-force Python search of every pair. The example values are made up."
flow:
  - { icon: eye, label: "Bands" }
  - { icon: calculator, label: "Value" }
  - { icon: search, label: "E-series" }
  - { icon: sliders, label: "Divider" }
---

## What it does

Most through-hole resistors show their value as coloured bands instead of printed numbers. This tool reads them both ways and helps you choose standard values:

- **Colour bands to value**: pick 3, 4, 5 or 6 bands and get the resistance, tolerance, the range a good part may measure, whether it is a standard value, and (for 6 bands) the temperature coefficient.
- **Value to colour bands**: type a value such as 4.7k or 4k7 and see the bands for 4, 5 or 6-band parts, plus the nearest standard value below and above it in every E series from E6 to E192.
- **Voltage divider designer**: give the input and wanted output voltage and it searches every pair in your chosen series for the closest output, with the worst-case range, current and power in each resistor.

Once you know the value, work out the resistor an LED needs with the [[led-resistor-calculator]], or try the part in a circuit with the [[circuit-simulator]].

## How the code works

On a 4-band resistor the first two bands are digits, the third is the multiplier (how many zeros, or gold ×0.1 and silver ×0.01) and the fourth is the tolerance. Five and six-band parts have three digit bands; the sixth band is the temperature coefficient in ppm per kelvin. Digits run black 0, brown 1, red 2, orange 3, yellow 4, green 5, blue 6, violet 7, grey 8, white 9. Tolerance: brown ±1 %, red ±2 %, green ±0.5 %, blue ±0.25 %, violet ±0.1 %, gold ±5 %, silver ±10 %, no band ±20 %.

## E series

Resistors are made in preferred values spaced evenly on a log scale. E12 has 12 values per decade (1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2) and is usually ±10 %; E24 is usually ±5 %, E96 ±1 %. A value off by less than the tolerance is as good as any other in that series.

## Worked example

The first card starts with **yellow, violet, red, gold**: 4, 7, ×100, ±5 %, so **4.7 kΩ ±5 %**, anything from 4.465 kΩ to 4.935 kΩ, and a standard E6 value. For 5,000 Ω the nearest E24 values are 4.7 kΩ and 5.1 kΩ; 5.1 kΩ is nearer (+2 %), and in E96 4.99 kΩ is only 0.2 % off.

The divider starts at 12 V to 3.3 V with E24 parts and a total of 1 kΩ to 100 kΩ. The best pair is **R1 = 2.4 kΩ, R2 = 910 Ω**, giving 3.299 V (0.0275 % low), drawing 3.63 mA (24 kΩ and 9.1 kΩ give the same ratio at a tenth of the current); with ±5 % parts the output could be anywhere from 3.065 V to 3.544 V. A 10 kΩ load on the output changes the best pair to 2.2 kΩ and 910 Ω.

## FAQ

**Which end do I start from?** The end with a band closest to the edge. Gold and silver are never first. If you get a value that is not standard, read it the other way.

**Why does m mean mega here?** Resistors are never marked in milliohms by colour, so 1m or 1M both mean 1 MΩ, as on many parts lists.

**Is the divider good for a power supply?** No: a divider's output sags with any load current. It is fine for setting a reference, biasing, or scaling a signal into a measuring input. For study and planning, not a substitute for professional judgement.
