---
name: Bioreactor
num: 1457
shelf: learn
section: school-biology
title: "Bioreactor simulator: a stirred tank with temperature, pH and oxygen control loops"
summary: "Grow bacteria on sugar in a stirred-tank bioreactor for 24 hours. Switch the temperature, pH and oxygen control loops on and off, change their set points, and watch the heat, acid and oxygen demand of growing cells push the tank off course. A teaching model."
status: live
ads: false
order: 1457
icon: flask
works: offline
updated: 2026-11-09
related: [recombinant-insulin, population-growth, enzyme-activity]
sources:
  - "Standard school biotechnology: stirred-tank bioreactors (agitator, sparger, temperature and pH control, sampling) and downstream processing. Growth follows the Monod equation with yield on sugar; temperature, pH and oxygen effects and the simple proportional control loops are teaching choices. Written for fibub; no textbook text, figures or exercises are used."
  - "All numbers (growth rate, yield, heat, acid and oxygen per gram of growth, the best temperature 37 °C and pH 7) are round, made-up teaching values, not data for any real organism."
  - "Checked against scipy.integrate.solve_ivp (LSODA, rtol 1e-10) on the same equations at 6 and 12 hours, with all loops on and with each switched off."
flow:
  - { icon: sliders, label: "Set points" }
  - { icon: flask, label: "Stirred tank" }
  - { icon: chart, label: "Growth" }
  - { icon: check, label: "Check" }
---

## What it shows

To make a product with microbes (an enzyme, an antibiotic, or human insulin from recombinant bacteria) you need billions of cells, grown in large **bioreactors**. The most common is the **stirred tank**: a steel vessel with a stirrer, an air pipe (sparger) bubbling air in at the bottom, a cooling jacket, probes that measure temperature, pH and dissolved oxygen, and pumps that add acid or base.

Growing cells keep pushing the tank away from the best conditions: they **give off heat**, they **make acid**, and they **use up oxygen**. Each of these has a **control loop**: a probe measures the value, and the controller acts (more cooling water, a little base, a faster stirrer) to pull it back to its **set point**.

This page simulates a 24-hour batch of bacteria on 20 g/L of sugar. Switch each loop off to see what it was doing.

It fits **Class 12 Biology: biotechnology, principles and processes** (obtaining the foreign gene product: bioreactors, the stirred-tank reactor, downstream processing) and **microbes in human welfare** (industrial products). The cells being grown might carry the gene from [[recombinant-insulin]]; their growth curve is the logistic shape in [[population-growth]], and why temperature and pH matter so much is shown in [[enzyme-activity]].

## How to use it

1. Leave all three loops on, then switch one off at a time.
2. Slide the **set points**: temperature, pH and the oxygen level to keep above. With oxygen control off, set the **fixed stirring** instead.
3. Drag the **Hour** slider: the gauges by the tank show the values at that hour, and the sentence says what is wrong, if anything.
4. Read the growth graph and the facts: bacteria at 24 h, when the sugar runs out, and the highest temperature, lowest pH and lowest oxygen.

## Worked example

With every loop on (37 °C, pH 7, oxygen above 30 %), the bacteria grow from 0.1 to **10.1 g/L** and use up the sugar after about **9.7 hours**: 20 g/L of sugar × 0.5 g of cells per gram of sugar = 10 g/L of new cells. The temperature never goes above **37.8 °C** and the pH never below **6.85**.

Switch **temperature control** off and the tank heats up to about **44.9 °C**; growth slows and sugar is still left after 24 hours. Switch **pH control** off and the acid takes the pH down to about **5.64**, with 9.15 g/L of bacteria. Switch **oxygen control** off with fixed stirring 2 per hour, and the oxygen falls to about **2.8 %**: the cells still finish, but only after about 14.4 hours.

## Check yourself

Five fresh questions: cells from sugar using the yield, kilograms in a tank, and why tanks are cooled, stirred and followed by downstream processing. Nothing is saved.

## FAQ

**Why not just grow cells in a flask?** Flasks work for small amounts. A bioreactor keeps conditions right for thousands of litres, keeps the culture sterile, and lets samples be taken.

**What happens after the batch?** Downstream processing: the product is separated from the cells and broth, purified, tested for quality, and formulated with preservatives before it can be used.

**Is this from my textbook?** It covers the standard school topic with its own model and examples. It is an independent study aid.
