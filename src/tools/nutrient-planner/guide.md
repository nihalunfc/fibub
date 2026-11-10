---
name: Nutrient planner
num: 485
shelf: science
code: T336
section: nutrition-and-dietetics
title: "Nutrient planner: daily totals, macro energy split and % of your targets from food labels"
summary: "Plan a meal or a day from your own food label values: energy, protein, fat, carbohydrate, fibre, sugars and sodium per 100 g or per serving. Totals by meal and day, the energy split from macronutrients, and percent of your own targets. CSV in and out."
status: live
ads: false
order: 25
icon: table
works: offline
updated: 2026-11-09
related: [energy-needs, glycaemic-load, lab-unit-converter, clinical-scores, recipe-nutrition-calculator, body-measures]
sources:
  - "Energy factors 4, 9 and 4 kcal per gram for protein, fat and carbohydrate: the general Atwater factors (Atwater and Bryant, 1900; FAO Food and Nutrition Paper 77, 2003)."
  - "Fibre at 2 kcal per gram, and salt = sodium × 2.5: as used for food labels in EU Regulation (EU) No 1169/2011, Annex XIV and Annex I (checked 2026-11-09; check the official source)."
  - "Food values: entered by the user. The example day uses invented, rounded values; no food database is bundled."
flow:
  - { icon: pencil, label: "Labels" }
  - { icon: table, label: "Foods" }
  - { icon: sigma, label: "Totals" }
  - { icon: target, label: "Targets" }
---

## What it does

Students of nutrition and dietetics, and anyone keeping a food diary, spend a lot of time adding up label values by hand. This planner does the sums. You type each food's values from its **nutrition label**, per 100 g or per serving, and how much was eaten. The page adds up energy, protein, fat, carbohydrate, fibre, sugars and sodium for each meal and for the day, shows where the energy comes from, and compares the totals with **targets you set yourself**.

There is **no built-in food list**. Food composition databases are other people's data, and fibub does not copy them; your own labels are also the most accurate numbers for the foods you actually eat.

Set the daily target with the [[energy-needs]] calculator, and check the carbohydrates with the [[glycaemic-load|glycaemic load calculator]].

## How to use it

1. Choose whether the energy on your labels is in **kcal** or **kJ**.
2. For each food: type its **name**, choose the **meal** (breakfast, lunch, dinner, snacks), whether the label values are **per 100 g** or **per serving**, and the **grams** or **servings** eaten. Then copy the label values. Leave a box empty if the label does not give it; it counts as 0.
3. **Add a food**, **Remove** one, go **Back to the example**, or **Start empty**.
4. Type your own **targets** in the Day totals table to see each total as a percentage of its target. The page has none built in: use the numbers from your dietitian, your course, or the official guidance where you live.
5. **Where the energy comes from** works out energy from the macronutrients with 4 kcal per gram of protein, 9 of fat and 4 of carbohydrate, and shows each one's share. Tick **Count fibre at 2 kcal per gram** if your labels list fibre separately from carbohydrate (UK and EU). In the US and Canada carbohydrate includes fibre, so leave it off.
6. **Download foods (CSV)** saves your list so you can open it next time with **Open a CSV file**, or edit it in a spreadsheet. **Download totals (CSV)** and the Image, PDF and Word buttons save the results.
7. **Remember my foods and targets** is off by default. Switch it on to keep your list in this browser only (localStorage), so it is here next visit. **Clear what is remembered** removes it.

## Worked example

The example day uses invented, rounded values: 50 g of an oat cereal (370 kcal, 12 g protein, 7 g fat, 60 g carbohydrate per 100 g), 200 g of milk, one sandwich, 200 g of cooked rice, one vegetable curry and a 150 g apple. The page shows **1,340 kcal from 6 foods**: 48.5 g protein, 39 g fat, 190 g carbohydrate, 22.3 g fibre, 39.5 g sugars and 1,795 mg sodium (4.5 g salt). From the macronutrients that is 4 × 48.45 + 9 × 39 + 4 × 190 = 1,305 kcal, split **Protein 15 % · Fat 27 % · Carbohydrate 58 %**. Type a target of 2000 kcal and the energy row shows 67 %.

## Tips

- Label energy and the macronutrient sum rarely match exactly: labels round each value, and alcohol and sugar alcohols (polyols) have their own factors not counted here.
- For a food eaten in several meals, add it once per meal.
- Sodium is in milligrams. To read salt from a label that gives only salt, divide the salt in grams by 2.5 and multiply by 1000.

## Frequently asked questions

**Why can't I search for a food?** Bundling a food database would mean copying someone else's data. Typing your own labels keeps the page small, accurate for your foods, and free of licence problems.

**Where is my data kept?** Only on your screen, unless you switch on Remember, which keeps it in this browser on this device. Nothing is ever sent anywhere.

For study and teaching, not medical advice. Check with a qualified professional.
