---
name: Gibbs explorer
num: 1361
shelf: learn
code: L221
section: school-chemistry
title: "Gibbs explorer"
summary: "Slide ΔH, ΔS and the temperature and watch ΔG = ΔH − TΔS change as a straight line against temperature, with the spontaneous region shaded, the turn-over temperature T = ΔH/ΔS marked and the four sign cases sorted. A Class 12 level adds K = e^(−ΔG°/RT) and E° = −ΔG°/nF."
status: live
ads: false
order: 1361
icon: flask
works: offline
updated: 2026-11-09
related: [thermochemistry-calculator, le-chatelier, galvanic-cell, heating-curve]
sources:
  - "Standard thermodynamics: ΔG = ΔH − TΔS, ΔG° = −RT ln K and ΔG° = −nFE°. R and F from CODATA 2018. Preset ΔH and ΔS values are rounded general reference values, labelled as rounded. Written for fibub; no textbook text, figures or exercises are used."
  - "Checked against values worked by hand in independent Python: ice melting (T = 273.18 K), ammonia synthesis (ΔG at 298 K = −32.99 kJ/mol, K ≈ 6.05 × 10⁵, turn-over 464.0 K) and limestone decomposing (turn-over 1110.9 K)."
flow:
  - { icon: flask, label: "Reaction" }
  - { icon: sliders, label: "ΔH, ΔS, T" }
  - { icon: curve, label: "ΔG line" }
  - { icon: check, label: "Spontaneous" }
---

## What it shows

Whether a change can happen by itself depends on two things: the heat it gives out or takes in (the **enthalpy change ΔH**) and how much more spread out, or disordered, things become (the **entropy change ΔS**). The **Gibbs energy change** puts them together: **ΔG = ΔH − TΔS**. When ΔG is negative the change is spontaneous at that temperature; when it is positive, it is not (the reverse change is); when it is zero, the system is at equilibrium.

Because ΔH and ΔS hardly change with temperature, ΔG plotted against T is a straight line: it starts at ΔH when T = 0 and slopes by −ΔS. Where the line crosses zero, at **T = ΔH/ΔS**, the reaction turns over from one side to the other. This page draws that line, shades the spontaneous region green, and sorts every reaction into one of four sign cases.

It follows thermodynamics in Class 11 chemistry, and its Class 12 level links to equilibrium and electrochemistry. The [[thermochemistry-calculator]] works out ΔH, ΔS and ΔG for any reaction you type; the [[le-chatelier]] sandbox shows what temperature does to an equilibrium; and the [[galvanic-cell]] builder turns ΔG into a cell voltage.

## How to use it

1. **Start from** a reaction: ice melting, making ammonia, heating limestone, hydrogen peroxide breaking down, or making ozone. Their ΔH and ΔS are rounded values for the equation as written. Pick **My own numbers** to type anything.
2. **Slide ΔH, ΔS and T**, or type them in the boxes. ΔH is in kJ/mol; ΔS is in J/(K·mol), so it is divided by 1000 before it is multiplied by T. The formula line shows each step with your numbers.
3. **Read the picture.** The blue line is ΔG at every temperature from 0 to 1500 K; the big dot is your temperature; the orange dot is the turn-over temperature.
4. The **table of four sign cases** lights up the row your reaction belongs to.
5. **Class 12 level** adds the equilibrium constant K = e^(−ΔG°/RT) and the cell voltage E° = −ΔG°/(nF) for n electrons moved.

## Worked example

Making ammonia, N₂ + 3H₂ → 2NH₃, has ΔH = −92.2 kJ/mol and ΔS = −198.7 J/(K·mol). At 298 K:

ΔG = −92.2 − 298 × (−0.1987) = −92.2 + 59.21 = **−32.99 kJ/mol**, so it is spontaneous.

Both signs are negative, so it is the "spontaneous when cold" case. It turns over at T = ΔH/ΔS = −92 200 ÷ −198.7 = **464.0 K** (about 191 °C). At the Class 12 level, K = e^(32 987 ÷ (8.314 × 298)) ≈ **6.05 × 10⁵**.

For ice, ΔH = +6.01 kJ/mol and ΔS = +22.0 J/(K·mol): T = 6010 ÷ 22.0 = **273.2 K**, the melting point. Below it ΔG is positive (ice stays ice); above it, negative (ice melts).

## The four cases in one line each

- ΔH negative, ΔS positive: spontaneous at every temperature.
- ΔH positive, ΔS negative: never spontaneous; the reverse change is.
- Both negative: spontaneous below T = ΔH/ΔS.
- Both positive: spontaneous above T = ΔH/ΔS.

## Check yourself

Four questions with fresh numbers: ΔG at a temperature, the temperature where a change becomes spontaneous, which sign case applies, and K from ΔG°. Nothing is saved.

## FAQ

**Why divide ΔS by 1000?** ΔH is in kilojoules but ΔS is usually given in joules per kelvin. Mixing them is the most common slip.

**Does negative ΔG mean the reaction is fast?** No. ΔG says whether a change can go, not how quickly. That is kinetics.

**Is this from my textbook?** It covers the standard school topic with its own examples and pictures. It is an independent study aid, not part of NCERT.
