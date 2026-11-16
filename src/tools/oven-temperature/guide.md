---
name: Oven temperature
num: 2013
shelf: everyday
code: T861
section: measures
title: "Oven temperature: Celsius to Fahrenheit, gas mark and fan oven converter"
summary: "Convert oven temperatures between °C, °F and UK gas marks, and adjust for a fan (convection) oven, with a table of gas marks and named heats like moderate and hot."
status: live
ads: false
order: 2013
icon: clock
works: offline
updated: 2026-11-10
related: [cups-to-grams, recipe-scaler, pan-size-converter, roast-time]
sources:
  - "°F = °C × 9/5 + 32. Gas mark settings: the usual UK cooker scale as printed on gas ovens and in UK recipes; fibub's own working."
  - "Fan oven 20 °C / 25 °F lower: a common rule of thumb given by oven makers; check your oven's manual."
  - "Typical settings for common bakes and the air fryer rule (20 °C / 25 °F lower, about 20% less time): rules of thumb, fibub's own working, cited from memory, not re-checked. Check the official source: your recipe and appliance manual."
flow:
  - { icon: pencil, label: "Type" }
  - { icon: sliders, label: "Oven type" }
  - { icon: check, label: "Set oven" }
---

## What it does

Recipes give oven heat in Celsius, Fahrenheit or gas marks, and they are written for either a conventional oven or a fan (convection) oven. This converter takes one temperature and shows it in all three scales for both kinds of oven, with the nearest gas mark and its usual name, such as "moderate" or "hot".

A fan blows hot air around, so food cooks faster at the same setting. The usual rule is to set a fan oven about 20 °C (25 °F) lower. Both numbers are editable, because some makers suggest less. When the recipe also needs new amounts, use the [[recipe-scaler]], and the [[cups-to-grams]] converter turns cups into grams.

## How to use it

1. Type the temperature from the recipe. For gas marks, type 1 to 9, or 1/4 and 1/2.
2. Choose its scale: °C, °F or gas mark.
3. Say whether the recipe was written for a conventional or a fan oven.
4. Read the setting for your oven. The matching gas mark row is highlighted in the table.

## What each setting does

- **Temperature and In**: the number from the recipe and its scale.
- **Slider**: moves the temperature in 5 °C steps (25 °F, or whole gas marks) and stays in step with the box.
- **Typical settings**: buttons for common bakes (slow cook 150 °C, cake 180, cookies 180, roast vegetables 200, bread 220, pizza 240). They are typical figures only, so follow your own recipe if it differs.
- **Set the dial to**: the answer rounded to what an oven dial can be set to, the nearest 5 °C or 25 °F, for a conventional and a fan oven.
- **Recipe is for**: if the recipe is for a fan oven, the conventional setting is worked out by adding the fan difference back on.
- **Fan oven is cooler by**: how much lower a fan oven is set, in °C and in °F (20 and 25 by default). The table's fan column follows it.
- **More options, air fryer**: a line giving 20 °C (25 °F) lower and about 20% less time as a starting point. It is a rule of thumb, not a standard, so check the air fryer's own manual.
- **Reset**: back to 180 °C, conventional.

A negative number or a value no home oven reaches (above about 300 °C) gets a short message instead of an answer. Answers are rounded to whole degrees. The gas mark is the one nearest in °C; outside about 110 to 240 °C there is no gas mark.

## Worked example

A recipe says 180 °C. That is 356 °F, closest to gas mark 4 (a moderate oven). In a fan oven, set 160 °C. An American recipe at 425 °F is 218 °C, gas mark 7, a hot oven.

## FAQs

**Why does 180 °C show as 356 °F when recipes say 350 °F?** Recipes round to the nearest 25 °F. 350 °F is 177 °C, close enough for almost all cooking.

**Do I always lower the heat for a fan oven?** Only when the recipe was written for a conventional oven. Many newer recipes give both.

**My cakes still burn.** Many ovens run hot. An oven thermometer shows the real temperature.
