---
name: Calorie calculator
num: 2033
shelf: everyday
code: T916
section: nutrition
title: "Calorie calculator: daily calories (BMR and TDEE) and macros"
summary: "Estimate the calories you burn at rest (Mifflin-St Jeor) and in a day, set a goal to lose, keep or gain weight, and split the target into protein, fat and carbs."
status: live
ads: false
order: 2033
icon: calculator
works: offline
updated: 2026-11-10
related: [body-measures, one-rep-max, pace-calculator, steps-to-distance, water-intake]
sources:
  - "Mifflin MD, St Jeor ST et al. (1990). A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr 51(2): 241–247 (the BMR formula)."
  - "Activity factors 1.2 to 1.9 and about 7,700 kcal per kg of body weight are common rules of thumb; both are editable."
  - "Jäger R et al. (2017). ISSN position stand: protein and exercise. J Int Soc Sports Nutr 14: 20 (1.4 to 2.0 g/kg for active people). Institute of Medicine (2005), Dietary Reference Intakes for Energy and Macronutrients (fat 20 to 35% of energy)."
flow:
  - { icon: pencil, label: "You" }
  - { icon: sliders, label: "Activity" }
  - { icon: target, label: "Goal" }
  - { icon: table, label: "Macros" }
---

## What it does

This calculator estimates how many calories your body uses in a day. It starts with your basal metabolic rate (BMR), the energy used at rest, from the Mifflin-St Jeor equation published in 1990. It multiplies that by an activity factor to get the calories that keep your weight steady, then adds or takes away a little for a weight goal and splits the result into protein, fat and carbs.

It is an estimate, not medical advice, and everything runs in your browser. To check your weight range first, use the [[body-measures|BMI calculator]]; to count a walk, try [[steps-to-distance]].

## How to use it

1. Pick metric or imperial, then type your sex, age, weight and height.
2. Choose how active you are. You can fine-tune the factor.
3. Pick a goal, then read the daily target and the macro table.

## What each setting does

- **Sex**: Mifflin-St Jeor adds 5 for men and takes 161 for women.
- **Activity factor**: 1.2 for little exercise up to 1.9 for very hard training or a physical job.
- **Goal**: 0.25 or 0.5 kg a week up or down. Each kg is counted as about 7,700 kcal, an approximate figure.
- **Lowest daily target**: a warning shows below this; it starts at 1,500 kcal for men and 1,200 for women, common minimums without medical supervision.
- **Protein**: grams per kg (the default 1.6 sits in the 1.4 to 2.0 g/kg range for active people) or a percent.
- **Fat**: percent of calories; 20 to 35% is the US adult range. Carbs get the rest.

## Worked example

A man aged 30, 80 kg and 180 cm tall:

BMR = 10 × 80 + 6.25 × 180 − 5 × 30 + 5 = **1,780 kcal**. Moderately active (× 1.55) gives **2,759 kcal** to keep his weight. To lose 0.5 kg a week he takes off 0.5 × 7,700 ÷ 7 = 550 kcal, a target of **2,209 kcal**.

At 2,759 kcal with 1.6 g/kg protein and 30% fat: protein 128 g, fat 92 g, carbs 355 g.

A woman aged 30, 60 kg and 165 cm: 600 + 1,031.25 − 150 − 161 = 1,320.25, shown as **1,320 kcal**.

## FAQs

**How accurate is it?** For most healthy adults Mifflin-St Jeor lands within about 10% of a measured value, but people vary.

**Is anything saved?** No. Nothing is stored.
