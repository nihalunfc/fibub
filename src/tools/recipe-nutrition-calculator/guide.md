---
name: Recipe nutrition calculator
num: 391
shelf: science
section: food-science
title: "Recipe nutrition calculator: per serving and per 100 g from your own ingredient labels, with cooking loss"
summary: "Type or paste your ingredients with the values per 100 g from their packs, set the servings and the weight lost in cooking, and get a label-style table per 100 g and per serving, with energy from the labels or from the Atwater factors. Nothing is uploaded."
status: live
ads: false
order: 391
icon: table
works: offline
updated: 2026-11-09
related: [solution-calculator]
sources:
  - "Sums by weight, general facts: energy 1 kcal = 4.184 kJ; the general Atwater factors of 4 kcal per gram for protein and carbohydrate, 9 for fat and 2 for fibre; salt = sodium × 2.5."
  - "Checked against an independent numpy calculation on the example recipe (totals, per 100 g after cooking loss, per serving, Atwater energy with and without fibre in the carbohydrate)."
  - "No food composition database is included. The example recipe's values are made-up, rounded example numbers, not taken from any table."
flow:
  - { icon: pencil, label: "Ingredients" }
  - { icon: sliders, label: "Servings" }
  - { icon: table, label: "Label table" }
  - { icon: download, label: "Download" }
---

## What it does

This calculator adds up the nutrition of a recipe from the labels of the things you put in it. You give each ingredient's amount in grams and its values per 100 g, copied from its pack or label (or from any source you trust). It works out the whole recipe, then the values **per serving** and **per 100 g of the cooked food**, as a table laid out like a food label: energy in kJ and kcal, fat, saturates, carbohydrate, sugars, fibre, protein and salt.

There is no built-in food database. Every number comes from you, so the result is only as good as the labels you typed.

## How to use it

1. Press **Start a blank table**, or paste rows from a spreadsheet, or open a CSV or Excel file. Each line is one ingredient: name, amount in grams, then the values per 100 g. Columns are found by their header names, so the order can change and you can leave out any you do not have. A column of energy in kJ or of sodium is converted for you.
2. Set the number of **servings**.
3. Set the **weight lost in cooking**, as a percentage of the raw weight, or type the **weight after cooking** if you weighed the pot (subtract the pot). The loss is treated as water: nutrients stay in the food, so they get more concentrated per 100 g.
4. Choose where the **energy** comes from. "From the labels" adds up the energy figures you typed. "From the nutrients" works energy out with the general Atwater factors: 4 kcal per gram of protein, 4 per gram of carbohydrate, 9 per gram of fat and 2 per gram of fibre.
5. Tick **carbohydrate includes fibre** if your labels give a US-style "total carbohydrate". Fibre is then taken off before the energy sum, so it is not counted at 4 kcal per gram.

Download the table as CSV, or the report as an image, PDF or Word file.

## Worked example

Press **Use the example**. It loads a made-up lentil soup with rounded example values (not from any database): 200 g dry red lentils, 150 g onion, 150 g carrot, 20 g olive oil and 1000 g stock, 4 servings and 15 % of the weight lost in cooking.

The raw ingredients weigh 1520 g, so the cooked soup weighs 1292 g and a serving is 323 g. The whole pot has 1002.5 kcal, so a serving has **251 kcal** (1049 kJ), 6.4 g fat, 31.9 g carbohydrate, 13.1 g protein and 2.07 g salt. Per 100 g of soup that is 78 kcal (325 kJ) and 4.1 g protein. The lentils give 65.8 % of the energy. With energy from the nutrients instead, a serving has 252 kcal.

## Tips

- Use the values for the food as you weigh it. If you weigh dry pasta, use the dry pasta label.
- Leave a cell empty if the label does not give it. The note under the table lists anything counted as 0.
- Vitamins can be lost in cooking; this calculator assumes the listed nutrients are not.

## FAQ

**Can I use it for food I sell?** It helps you plan, but labelling rules (rounding, reference intakes, which nutrients must be listed) differ by country. Check the official source where you sell.

**Why does the energy differ between the two options?** Labels may use slightly different factors or measured values. The 4/9/4/2 method is a general estimate.

**Is my recipe uploaded?** No. Everything runs in your browser and works offline.
