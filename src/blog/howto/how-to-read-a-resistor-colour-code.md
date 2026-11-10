---
title: "How to read a resistor colour code (4 and 5 bands, with examples)"
summary: "Turn the bands into digits, add the multiplier's zeros, then read the tolerance band. Worked 4-band and 5-band examples, plus how to tell which end to start from."
tools: [resistor-colour-code, ohms-law-lab, led-resistor-calculator, circuit-simulator]
updated: 2026-11-10
sources:
  - "Resistor colour code and E-series preferred values: IEC 60062 and IEC 60063, the conventions printed in electronics textbooks and on parts."
---

Read the bands from the end that has a band closest to the edge: the first two bands (three on a 5-band part) are digits, the next one says how many zeros to add, and the last one is the tolerance. The [[resistor-colour-code]] calculator does it both ways: pick the colours to get the value in ohms, or type a value to see which bands it should carry.

## What you need

- **The resistor**, and good light. Brown, red and orange are easy to mix up under a yellow bulb; daylight or a white phone torch helps.
- **The digit colours.** Black 0, brown 1, red 2, orange 3, yellow 4, green 5, blue 6, violet 7, grey 8, white 9. Many people learn them with a memory sentence whose first letters run B B R O Y G B V G W.
- **The two extra multipliers**: gold means ×0.1 and silver means ×0.01, for values under 10 Ω.
- **The common tolerances**: gold ±5 %, silver ±10 %, brown ±1 %, red ±2 %. No band at all means ±20 %.

## Step by step

1. **Find the start.** Hold the resistor so the bands bunched near one end are on your left. Gold or silver is never a first band, so if one of them is at an end, that end is the last band.
2. **Count the bands.** Four bands: two digits, a multiplier, a tolerance. Five bands: three digits, a multiplier, a tolerance. Six bands: the same as five, plus a temperature band at the end that says how much the value drifts as the part warms up.
3. **Write down the digits**, side by side, as a number.
4. **Apply the multiplier.** Its colour is the number of zeros to add (black adds none, brown one, red two, orange three, and so on). In symbols, R = (digits) × 10ⁿ ohms, where n is the multiplier's digit.
5. **Add the tolerance.** It tells you how far a good part may be from the printed value.

In the tool:

1. In **Colour bands to value**, choose the **Number of bands** (3 to 6).
2. Pick each band's colour from its drop-down. Each box only offers the colours that band can be.
3. Read the value with its tolerance, the **Range** a good part may measure, and **Standard value?**, which says whether it is one of the preferred values manufacturers make (the E series).
4. To go the other way, type a value such as 4.7k or 4k7 in **Value to colour bands**, choose 4, 5 or 6 bands and a tolerance, and see the colours, plus the nearest standard values above and below it.

## A worked example

**A 4-band resistor: green, blue, orange, gold.**

- Digits: green 5, blue 6, so 56.
- Multiplier: orange is 3, so add three zeros: 56 000 Ω, written **56 kΩ**.
- Tolerance: gold, **±5 %**. 5 % of 56 000 Ω is 2 800 Ω, so a good part measures anywhere from **53.2 kΩ to 58.8 kΩ**.

The tool shows the same, and says 56 kΩ is a standard value in E12 (the 12-step series).

**A 5-band resistor: orange, orange, black, brown, brown.**

- Digits: 3, 3, 0, so 330.
- Multiplier: brown is 1, so add one zero: 3 300 Ω = **3.3 kΩ**.
- Tolerance: brown, **±1 %**, so 3 267 Ω to 3 333 Ω.

The last example trips people up, because brown appears as both a multiplier and a tolerance. The gap tells you which is which: makers usually leave a wider space before the tolerance band.

**Going the other way.** You need 2.2 kΩ on a 4-band part. That is 22 followed by two zeros, so the bands are **red, red, red**, then gold for ±5 %.

## Check your answer

- **Measure it.** Set a multimeter to resistance and touch the two leads, without your fingers on both ends (your skin adds a parallel path). The reading should fall inside the tolerance range.
- **Is it a standard value?** Real parts come in set steps such as 1.0, 2.2, 3.3, 4.7, 5.6, 6.8 times a power of ten. If you get something odd, like 7.9 kΩ, you have probably read it backwards or mistaken a colour.
- **Backwards check.** Read it the other way round. If that way starts with gold or silver, it cannot be right, because those colours are never digits (the tool's digit boxes do not even offer them). That confirms your first direction.
- **Does it fit the circuit?** Once you know the value, Ohm's law I = V ÷ R gives the current it lets through. Try it with the sliders in the [[ohms-law-lab]], or build the circuit in the [[circuit-simulator]].

## Questions people ask

**What does "k" mean in 4k7?**
It means thousand, and its position replaces the decimal point: 4k7 is 4.7 kΩ, or 4 700 Ω. In the same way, 1M5 is 1.5 MΩ and 0R47 is 0.47 Ω.

**Why can't I find a 5 kΩ resistor?**
It is not in the common series. In E12, the nearest values are 4.7 kΩ and 5.6 kΩ; 4.7 kΩ is 6 % low. A 1 % series such as E96 has 4.99 kΩ.

**Which resistor does an LED need?**
That depends on your supply voltage and the LED's current. The [[led-resistor-calculator]] works it out and picks the nearest standard value.
