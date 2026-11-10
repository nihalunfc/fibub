---
name: Infection spread
num: 1214
shelf: learn
section: school-biology
title: "Infection spread"
summary: "A town of 400 dots: ill people meet others and pass a made-up illness on. Change how many people they meet, the chance of passing it on, days ill and the share vaccinated, and watch R0 and herd immunity at work. A study tool only."
status: live
ads: false
order: 1214
icon: chart
works: offline
updated: 2026-11-09
related: [microbe-growth, epidemic-model, virtual-microscope, probability-tree]
sources:
  - "Basic reproduction number R0 = contacts per day × chance per contact × days infectious, herd immunity threshold 1 − 1/R0, effective R = R0 × susceptible share, and the SIR final-size equation z = 1 − e^(−R z): standard epidemiology (Kermack and McKendrick, 1927, for the final size)."
  - "The illness, the town and every number on the page are made up. Checked against an independent Python calculation of the final-size equation and against the average of many simulated towns."
flow:
  - { icon: sliders, label: "Set illness" }
  - { icon: target, label: "Vaccinate" }
  - { icon: clock, label: "Run days" }
  - { icon: chart, label: "Outbreak" }
---

## What it does

Some illnesses pass from person to person. How far one spreads depends on three things: how many people an ill person meets each day, the chance of passing it on at each meeting, and how many days they stay ill. Multiply them and you get **R0** ("R nought"), the number of people one ill person infects in a town where nobody is immune. If R0 is above 1 the illness can spread; below 1 it fades away. This page shows a town of 400 dots. Three start ill; press **Play** or **One day** and watch the illness move through the town, with a graph of how many can still catch it, are ill and have recovered.

Move the **share vaccinated** slider to give some people immunity before it starts. Once enough people are immune, the **herd immunity threshold** 1 − 1/R0, chains of infection break and even unvaccinated people are mostly protected.

It follows the school topics Class 8 Science, health (how diseases spread, prevention and vaccination) and Class 9 Biology, why do we fall ill. Germs multiply inside the body as in the [[microbe-growth]] simulator, and the full maths model is in the [[epidemic-model]].

## How to use it

1. Set the three illness sliders: **people met each day**, **chance of passing it on** and **days ill**. R0 is worked out under the town.
2. Set the **share vaccinated**.
3. Press **Play**, **One day** or **Run to the end**. Press **New town** to try again with a fresh town: results vary because meetings are random.
4. The **Level** switch (Class 9 and up) adds the effective R (R0 × share who can still catch it) and the big-town prediction from the final-size equation.

## Worked example

Each ill person meets 4 people a day, passes it on at 15 % of meetings and is ill for 5 days: R0 = 4 × 0.15 × 5 = **3**. The herd immunity threshold is 1 − 1/3 = **67 %**. With nobody vaccinated, the final-size equation z = 1 − e^(−3z) gives z = 0.94, so about 94 % of a big town catches it; most runs of the town come close, though now and then it dies out in the first days by luck. With 80 % vaccinated the effective R is 3 × 0.2 = 0.6, below 1, and only a handful of people catch it.

## Check yourself

Five fresh questions: R0 from the three numbers, the herd immunity threshold, effective R, what happens below 1, and why vaccination protects others. Nothing is saved.

## Tips

- Staying home when ill cuts people met; washing hands and covering coughs cut the chance per meeting. Both lower R0.
- Herd immunity needs a higher share for illnesses that spread more easily.
- Small towns are lucky or unlucky: the same settings can give very different outbreaks.

## FAQ

**Is this a real illness?** No. The illness, the town and every number are made up. Real people do not mix at random, so real outbreaks are more complicated. Use this only to learn the ideas.

**Why does it sometimes stop at once?** If the first few ill people happen to pass it on to nobody, it dies out. This happens even when R0 is above 1.

**Is this from NCERT?** No. It is an independent study aid that follows the same school topics, with its own model and numbers.
