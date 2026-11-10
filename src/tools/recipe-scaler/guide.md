---
name: Recipe scaler
num: 2015
shelf: everyday
code: T863
section: recipes
title: "Recipe scaler: double, halve or resize a recipe for any number of servings"
summary: "Paste an ingredient list and scale it to more or fewer servings or by any factor. Reads fractions like 2 1/2 and ½ and ranges like 2-3, gives friendly cup and spoon amounts, and can switch to grams."
status: live
ads: false
order: 2015
icon: calculator
works: offline
updated: 2026-11-10
related: [cups-to-grams, pan-size-converter, recipe-nutrition-calculator]
sources:
  - "Grams per cup from USDA FoodData Central household measures (US public domain), as used by the Cups to grams converter, checked 2026-11-10. Egg weight about 50 g (a large egg without shell) is a rule of thumb. Fraction rounding is fibub's own working."
flow:
  - { icon: pencil, label: "Paste" }
  - { icon: sliders, label: "Servings" }
  - { icon: check, label: "Cook" }
---

## What it does

A recipe for four is no help when six people are coming. Paste the ingredient list, say how many it serves and how many you want, and every line is scaled at once. Amounts in cups and spoons come back as kitchen fractions you can measure, like 1¼ cups or ¾ tsp.

It reads whole numbers, decimals, fractions such as 2 1/2 or 1/3, the symbols ½ ¼ ¾ ⅓, and ranges such as 2-3 or 2 to 3. Lines without a number at the start, like "Salt to taste", are left as they are. If the pan changes too, the [[pan-size-converter]] gives the factor to use, and [[cups-to-grams]] converts single ingredients in more detail.

## How to use it

1. Paste or type the ingredients, one per line, with the amount first.
2. Choose Servings and type how many the recipe serves and how many you want, or choose A factor and type a number such as 2 or 0.5.
3. Read the new list, and press Copy to take it to your notes.

## What each setting does

- **Servings**: the factor is the new servings divided by the old.
- **A factor**: multiply by any number; 2 doubles, 0.5 halves.
- **Change to grams or ml**: cups, spoons and fluid ounces become grams when the line names an ingredient the converter knows (flour, sugar, butter, milk, rice and about 40 more), otherwise ml; oz and lb become grams. US cups are assumed, and the old amount is shown in brackets.
- **Copy, Clear, Example**: copy the scaled list, empty the box, or bring back the example.

Eggs cannot be split neatly, so a part egg gets a note: beat the eggs and weigh out the amount, counting about 50 g per large egg.

## Worked example

Doubling "2 1/2 cups flour" gives "5 cups flour". Halving "3 eggs" gives "1½ eggs (beat 2 and use about 75 g; a large egg is about 50 g)". Going from 4 servings to 6 is × 1.5, so "200 g sugar" becomes "300 g sugar".

## FAQs

**Can I scale baking safely?** Most cakes and breads scale well by 0.5 to 2. Raising agents and salt are the least forgiving; round them down rather than up.

**Why 1⅞ cups and not 1.875?** Measuring cups come in fractions, so the nearest eighth or third is shown.
