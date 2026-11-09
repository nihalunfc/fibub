---
name: Photosynthesis lab
num: 1122
shelf: learn
section: school-biology
title: "Photosynthesis lab: light, carbon dioxide and temperature against oxygen bubbles, with limiting factors"
summary: "Move a lamp, add carbon dioxide and warm the water around a pondweed, then watch and count the oxygen bubbles. See which factor is limiting the rate, and graphs of rate against light at several carbon dioxide levels (Blackman's law)."
status: live
ads: false
order: 1122
icon: flask
works: offline
updated: 2026-11-09
related: [osmosis-lab, photosynthesis-curve-fitter, enzyme-kinetics-fitter]
sources:
  - "Inverse square law for light from a small lamp, and Blackman's (1905) law of limiting factors: written by fibub from these standard ideas."
  - "The plant's numbers (bubbles per light unit, carbon dioxide cap, top rate, optimum 30 °C, respiration) are made-up round values for teaching. They are not measurements of any real plant."
  - "The rates were checked in the tests against a separate Python version of the same model (40 random settings) and hand-worked cases."
  - "Drawings are fibub's own simple shapes. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: sliders, label: "Set up" }
  - { icon: eye, label: "Watch" }
  - { icon: chart, label: "Graph" }
  - { icon: check, label: "Check" }
---

## What it does

A green water plant (pondweed) under a lamp makes food by **photosynthesis**: carbon dioxide + water → glucose + oxygen, using light trapped by chlorophyll. The oxygen comes off as bubbles you can count. This lab lets you change three things and see the bubbles change:

- **Light**: slide the lamp nearer or further. Light gets weaker with the square of the distance, so half the distance gives four times the light.
- **Carbon dioxide**: add baking soda (sodium hydrogencarbonate), which gives off carbon dioxide in water.
- **Temperature**: warm or cool the water. The enzymes that build sugar speed up as it warms, work best near 30 °C in this model, then break down.

The page tells you which of the three is the **limiting factor**: the one in shortest supply, which sets the rate (Blackman's law). It fits **Class 10 Science: life processes** (nutrition, photosynthesis and the factors it needs) and **Class 11 Biology: photosynthesis in higher plants** (factors affecting photosynthesis and the law of limiting factors). It is a teaching model with made-up round numbers. Before this, see how water gets into plant cells in the [[osmosis-lab]]; after it, fit real light-response data with [[photosynthesis-curve-fitter]], or see how enzyme speed depends on substrate in [[enzyme-kinetics-fitter]].

## How to use it

1. **Pick the level.** *Class 10* shows the bubble rate, the limiting factor and the light sum. *Class 11* adds how fast each factor would allow on its own, gross rate minus respiration, and the light compensation point.
2. **Slide the lamp, carbon dioxide and temperature.** The picture shows bubbles rising (4 times faster than real life, so you do not have to wait).
3. **Count for 1 minute** to add a row to your results table, as in the real experiment. Bubbles come at random, so repeat counts differ a little. Download the table as a CSV file for a graph or a report.
4. **Rate graph**: choose *Light*, *CO₂* or *Temperature* along the bottom. The light graph has three lines for three carbon dioxide levels; the carbon dioxide graph has three lamp distances.
5. **Check yourself** gives fresh questions every time and shows the working.

## Worked example

The page opens with the lamp at 20 cm, 0.25 % baking soda and water at 25 °C. Light = (10 ÷ 20)² × 100 = **25 units**. In this model light allows 0.6 × 25 = 15 bubbles a minute, carbon dioxide allows 80 × (0.05 + 0.25) = 24, and the enzymes at 25 °C allow 50 × 0.71 = 35.4. The smallest is 15, so **light is the limiting factor**. Respiration uses 2 bubbles' worth of oxygen, so you see **13.0 bubbles a minute**. Move the lamp to 10 cm: light allows 60, so now carbon dioxide (24) limits, and you see 22.0. Adding baking soda now helps; a closer lamp would not.

## Tips

- Change one thing at a time and keep the others the same, so you know what caused the change.
- In a real lab, a lamp also warms the water. Put a beaker of water between lamp and plant as a heat screen.
- If no bubbles come off in dim light, the plant is still photosynthesising: it is using all its oxygen in respiration. That light level is the **compensation point**.

## FAQ

**Why does the light graph go flat?** Once there is plenty of light, something else (carbon dioxide or temperature) is in short supply and holds the rate down.

**Why does the rate fall above 30 °C?** Enzymes are proteins; heat changes their shape, so they work more slowly and finally stop. Real plants differ in their best temperature.

**Are the bubbles pure oxygen?** Mostly, but they also carry some dissolved gases, so counting bubbles is a rough measure. Measuring the volume of gas collected is better.
