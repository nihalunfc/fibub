---
title: "Red wine anthocyanins oxidise by first-order kinetics, Arrhenius study"
summary: "A 2025 study followed the colour pigments of a Merlot wine under forced oxidation and found first-order loss with activation energies of about 41 to 57 kJ/mol. Here is how to fit such data yourself."
tools: [reaction-kinetics-fitter, beer-lambert-calculator, calibration-curve]
updated: 2026-11-10
sources:
  - "Alabbosh KFS et al. (2025), Processes 13(7): 2245, CC BY, the paper described here."
  - "First-order law [A] = [A]0 e^(-kt), half-life = ln 2 / k, and the Arrhenius equation k = A e^(-Ea/RT): standard physical chemistry."
paper:
  title: "Oxidative Degradation of Anthocyanins in Red Wine: Kinetic Characterization Under Accelerated Aging Conditions"
  authors: "Alabbosh KFS, Jevtovic V, Mitić J, Pržić Z, Stankov Jovanović V, Alyami RA, Alshammari MR, Alshammari B, Mitić M"
  journal: "Processes"
  year: 2025
  doi: "10.3390/pr13072245"
  url: "https://www.mdpi.com/2227-9717/13/7/2245"
  licence: "CC BY"
  reviewed: true
---

The deep red of a young red wine comes from anthocyanins, plant pigments that also colour blueberries and red cabbage. As wine ages, oxygen slowly breaks them down and the colour shifts toward brick and brown. A team of chemists sped this up in the lab and measured how fast each pigment disappeared at different temperatures. Their paper, in the journal Processes (2025, CC BY), found that every pigment followed simple first-order kinetics. This page explains it in our own words, and shows how the [[reaction-kinetics-fitter]] gets the order, rate constant, half-life and activation energy from the same kind of data. To turn raw detector signals into concentrations first, use the [[calibration-curve]] or [[beer-lambert-calculator]].

## What they found

All the anthocyanins they followed, from delphinidin to malvidin glucosides and their acylated forms, faded in a first-order way: the amount lost per minute was proportional to the amount left. The paper reports rate constants from roughly 0.002 to 0.011 per minute, faster at higher temperature, and half-lives at 40 °C between about one and two and a half hours.

From the rate constants at several temperatures they worked out activation energies, the energy barrier the reaction must climb, of about 41 to 57 kJ/mol. Cyanidin-3-glucoside broke down most easily, and peonidin-based pigments were the most stable. Of the factors they varied, temperature mattered most.

## Why it matters

Winemakers want to know how long colour will last in the bottle and how much warm storage or shipping costs them. Kinetic constants turn "keep it cool" into numbers: how much faster the colour fades at 30 °C than at 15 °C. The same pigments are used as natural food colours, so the results interest food chemists too.

## How they did it

1. They used one commercial Merlot (pH 3.4) and ran the kinetic tests in a tartaric acid buffer at pH 3.5.
2. They forced oxidation with a Fenton-like mix, hydrogen peroxide plus a trace of copper(II), which makes hydroxyl radicals.
3. A factorial design varied peroxide, copper and temperature at two levels each, to see which mattered most.
4. Kinetic runs went from 25 to 40 °C; hotter runs faded too fast to sample.
5. They separated the pigments by reversed-phase HPLC with a diode-array detector at 520 nm and fitted a first-order decay to each pigment.

## Check it yourself with fibub

Here is a worked example with **our own invented numbers**, not the paper's data: one pigment's HPLC peak area, as a percentage of the starting area, at 35 °C (a different pigment from the Arrhenius set below).

| Time (min) | 0 | 15 | 30 | 45 | 60 | 90 | 120 | 150 | 180 |
|---|---|---|---|---|---|---|---|---|---|
| Peak area (%) | 100 | 91.5 | 83.4 | 76.6 | 70.0 | 58.1 | 48.8 | 40.6 | 34.0 |

1. Paste time and peak area as two columns in the first card. Peak area is fine in place of concentration as long as it is proportional to it.
2. Set the time unit to min and type % as the concentration unit.
3. Read the table. First order wins with a support of about 100 %, k ≈ **0.00600 per minute** (standard error about 0.00002), and a half-life of about **116 minutes** (ln 2 ÷ k). The zero- and second-order fits have lower R² and almost no support.
4. The free-order line gives n = 0.99 ± 0.02, close to 1. Tap the ln [A] button: the points sit on a straight line.

For the activation energy, paste invented rate constants into the Arrhenius card, with temperatures in °C: 25 and 0.0026, 30 and 0.0036, 35 and 0.0049, 40 and 0.0066 (per minute). The tool gives **Ea ≈ 48.2 kJ/mol**, with a 95 % range of 47.4 to 49.0, inside the span the paper reports.

Type 15 in the box for predicting k. The tool gives about 0.00133 per minute and flags it as outside the measured range. By ln 2 ÷ k, that is a half-life near **8.7 hours**, against about 141 minutes (ln 2 ÷ 0.0049) at 35 °C in the same set. That gap is the whole case for cool cellars, but treat any extrapolation with care.

One trap: the ΔS‡ line assumes k is per second. Divide per-minute rate constants by 60 before pasting if you want the Eyring entropy; Ea does not change.

## The fine print

- The study used one wine from one producer at one pH. Other grapes and acidities may behave differently.
- Fenton-type oxidation is much harsher and faster than ageing in a bottle, so the rates are not shelf-life predictions.
- Dissolved oxygen was not measured.
- Some acylated pigments were measured against standards of related compounds, which adds uncertainty.
- The temperatures span only 15 °C, so each activation energy rests on a short stretch of the Arrhenius line. Read the full paper for exact values for each pigment.
