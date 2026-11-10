---
name: Specific gravity
num: 1604
shelf: collecting
code: T724
section: vetting
title: "Specific gravity calculator: density test for coins and metal"
summary: "Weigh a coin or bar in air and hanging in water to get its specific gravity and density, then see which common metals and alloys it is closest to, and a rough gold share."
status: live
ads: false
order: 1604
icon: scale
works: offline
updated: 2026-11-10
related: [coin-check, gold-purity, melt-value]
sources:
  - "Method: Archimedes' principle (hydrostatic weighing). Water density at the temperature you enter comes from a standard fit, good to about 0.0001 g/cm³ between 0 and 40 °C."
  - "Metal densities are general physical values; alloy densities assume the volumes of the parts add up, which is close to within about 1%. Real coins vary a little."
flow:
  - { icon: scale, label: "Weigh dry" }
  - { icon: flask, label: "Weigh wet" }
  - { icon: calculator, label: "Density" }
  - { icon: check, label: "Compare" }
---

## What it does

Every metal has its own density. If you weigh a piece in air, then again while it hangs in water, the difference tells you its volume, and weight divided by volume gives its density. Gold is about 19.3 g/cm³, silver 10.5 and copper 9.0, so the number says a lot about what a piece is made of.

This tool turns your two weighings into the specific gravity and density, ranks common coin and bullion alloys by how close they are, and compares with the metal you think it is. For gold with copper or gold with silver it also estimates the gold share. Check the size and weight first with [[coin-check]], and turn a result into fineness with [[gold-purity]].

## How to use it

1. Weigh the piece in air and type it in.
2. Weigh it hanging in water (steps are in the tool) and type that in, plus the water temperature.
3. Optionally pick the metal it is meant to be.
4. Read the density, the closest alloys and the pill.

## What each setting does

- **Weight in air**: the normal weight in grams.
- **Weight in water**: the weight when fully dipped on a thread. Always lower than in air.
- **Water temperature**: corrects for warm water being a little lighter.
- **What it is meant to be**: shows how far your density is from that alloy's.

## Worked example

A coin weighs 31.10 g in air and 29.49 g in water at 20 °C. It loses 1.61 g, so the specific gravity is 31.10 ÷ 1.61 = 19.32. That is very close to fine gold, and the table lists fine gold first. If you thought it was silver (10.49), it would show as far off.

## FAQs

**Does a match prove it is genuine?** No. Some gold-plated fakes are made from dense metals. This is a clue. If it is far off, ask an expert or a dealer to check it.

**Why do I get odd results with small pieces?** A few hundredths of a gram matter a lot on a light coin. Use a scale that reads to 0.01 g, and brush off air bubbles.

**Can I test stone or jewellery with stones?** Stones change the density, so the metal estimate won't apply.

**Is anything sent anywhere?** No. It all runs in your browser.
