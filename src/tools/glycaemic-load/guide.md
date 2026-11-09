---
name: Glycaemic load calculator
num: 486
shelf: science
section: nutrition-and-dietetics
title: "Glycaemic load calculator for foods and whole meals (meal GI and GL)"
summary: "Work out the glycaemic load of each food and of a whole meal, and the meal's GI as a carbohydrate-weighted average, from GI values and label carbohydrate you enter. Subtract fibre for US-style labels. CSV and report downloads."
status: live
ads: false
order: 26
icon: chart
works: offline
updated: 2026-11-09
related: [energy-needs, lab-unit-converter, clinical-scores, uncertainty-calculator, nutrient-planner, recipe-nutrition-calculator, body-measures]
sources:
  - "Glycaemic index: Jenkins D.J.A. et al. (1981), American Journal of Clinical Nutrition 34:362-366."
  - "Glycaemic load: Salmerón J. et al. (1997), JAMA 277:472-477; Foster-Powell K., Holt S.H.A., Brand-Miller J.C. (2002), American Journal of Clinical Nutrition 76:5-56 (formula only)."
  - "Meal GI as a carbohydrate-weighted mean: Wolever T.M.S., Jenkins D.J.A. (1986), American Journal of Clinical Nutrition 43:167-172."
  - "GI values: entered by the user. The example GI values are rough, rounded numbers for illustration, not copied from any table."
flow:
  - { icon: pencil, label: "Foods" }
  - { icon: sigma, label: "GL each" }
  - { icon: chart, label: "Meal" }
  - { icon: download, label: "Save" }
---

## What it does

The **glycaemic index** (GI) ranks carbohydrate foods by how much they raise blood glucose compared with pure glucose (GI 100), for the same amount of carbohydrate. It says nothing about how much carbohydrate a portion holds. The **glycaemic load** (GL) adds that in:

**GL = GI × available carbohydrate in the portion (g) ÷ 100**

A food with a high GI but little carbohydrate per portion can have a low GL, and the other way round. For a meal, the GI is the average of the foods' GI weighted by how much carbohydrate each brings (Wolever and Jenkins, 1986), and the meal's GL is simply the sum of the foods' GL.

This calculator does those sums for each food and for the whole meal. It does not come with a GI table: you type the GI values from a source you trust, and the carbohydrate from the food label.

Set the day's energy target with the [[energy-needs]] calculator, and plan the rest of the meal with the [[nutrient-planner]].

## How to use it

1. For each food type a **name**, its **GI**, the **carbohydrate per 100 g** and **fibre per 100 g** from the label, and the **portion** eaten in grams. **Add a food** adds a row; **Remove** deletes one.
2. Labels differ. In the UK, EU, Australia and many other places the carbohydrate figure already leaves fibre out. In the US and Canada "total carbohydrate" includes fibre: tick **My carbohydrate numbers include fibre** to subtract it.
3. Each food shows its available carbohydrate and GL. The meal box shows the meal's **GL**, its **GI** and the total available carbohydrate, with the usual bands, and a table with each food's share of the meal's GL.
4. **Download CSV** saves the table; the Image, PDF and Word buttons save a short report.

Usual bands: GI is low at 55 or less, medium from 56 to 69 and high from 70. GL per serving is low at 10 or less, medium from 11 to 19 and high from 20.

## Worked example

The page opens with three example foods. Their GI values are **rough, rounded numbers for illustration only**; replace them with real values for your foods.

- Porridge: GI 55, 12 g carbohydrate per 100 g, 250 g eaten: 30 g carbohydrate, GL 55 × 30 ÷ 100 = 16.5.
- Banana: GI 50, 20 g per 100 g, 120 g: 24 g, GL 12.
- Milk: GI 35, 5 g per 100 g, 200 g: 10 g, GL 3.5.

The page shows **Meal GL 32 · GI 50 · 64 g carbohydrate**. The meal GI is (55 × 30 + 50 × 24 + 35 × 10) ÷ 64 = 50, low, but the meal GL of 32 is high, because the meal holds a lot of carbohydrate. Ticking the fibre box (as if these were US-style labels) gives a GL of 28.4 from 57.3 g.

## Tips

- GI values for the "same" food vary with variety, ripeness, cooking and processing, often by 10 or more. Use the closest match you can find and treat the result as an estimate.
- Foods with almost no carbohydrate, such as meat, eggs or oil, add nothing to GL. Leave them out or give them 0 carbohydrate.
- Fat and protein eaten with a meal can lower its real glucose response, which a simple weighted average does not capture.

## Frequently asked questions

**Why is there no list of foods and their GI?** Published GI tables are someone else's data, and fibub does not copy them. You type the values from the source you use.

**Can GL be used for planning diabetes meals?** It is a teaching and comparison tool. Meal planning for diabetes should be done with a doctor or dietitian.

**Is anything stored?** No. Nothing you type is stored or sent anywhere.

For study and teaching, not medical advice. Check with a qualified professional.
