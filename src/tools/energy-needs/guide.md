---
name: Energy needs calculator
num: 484
shelf: science
code: T335
section: nutrition-and-dietetics
title: "Energy needs calculator: Mifflin-St Jeor, Harris-Benedict and Katch-McArdle (BMR and TDEE)"
summary: "Estimate resting energy with Mifflin-St Jeor, the original 1919 Harris-Benedict, the 1984 Roza-Shizgal revision and Katch-McArdle, side by side, times an activity factor you can edit. In kcal or kJ, with a careful note on weight change."
status: live
ads: false
order: 24
icon: calculator
works: offline
updated: 2026-11-09
related: [clinical-scores, lab-unit-converter, uncertainty-calculator, sample-size]
sources:
  - "Mifflin M.D., St Jeor S.T. et al. (1990), A new predictive equation for resting energy expenditure in healthy individuals, American Journal of Clinical Nutrition 51:241-247."
  - "Harris J.A., Benedict F.G. (1919), A Biometric Study of Basal Metabolism in Man, Carnegie Institution of Washington, publication 279."
  - "Roza A.M., Shizgal H.M. (1984), The Harris Benedict equation reevaluated, American Journal of Clinical Nutrition 40:168-182."
  - "Katch-McArdle: 370 + 21.6 × lean body mass, as given in McArdle, Katch and Katch, Exercise Physiology (textbook)."
  - "Weight change: the 7700 kcal per kg rule of thumb, with the caution from Hall K.D. et al. (2011), The Lancet 378:826-837."
  - "Activity factors: rounded example values, labelled approximate and editable."
flow:
  - { icon: pencil, label: "Body" }
  - { icon: sliders, label: "Activity" }
  - { icon: calculator, label: "Energy" }
  - { icon: download, label: "Save" }
---

## What it does

How much energy does a person use in a day? Nutrition and dietetics students learn to estimate it in two steps. First, **resting energy expenditure** (REE, close to the basal metabolic rate or BMR): the energy used lying still, which is most of the day's total for most people. Second, the **total** (sometimes called TDEE): resting energy times an **activity factor** for everything else.

This calculator works out resting energy with four well-known equations side by side, so you can see how much they differ:

- **Mifflin-St Jeor (1990):** 10 × weight (kg) + 6.25 × height (cm) − 5 × age (years), then + 5 for men or − 161 for women. Often the first choice for healthy adults today.
- **Harris-Benedict (1919):** the classic equation from Harris and Benedict's study of basal metabolism, with their original coefficients.
- **Harris-Benedict, Roza-Shizgal (1984):** the same form re-fitted to newer data.
- **Katch-McArdle:** 370 + 21.6 × lean body mass (kg). It ignores sex and age but needs the body fat percentage, from which lean mass = weight × (1 − fat % ÷ 100).

Plan meals to meet the target with the [[nutrient-planner]], and check how fast their carbohydrates act with the [[glycaemic-load|glycaemic load calculator]].

## How to use it

1. Choose the **sex used by the equations**, then type **age**, **weight** (kg or lb) and **height** (cm or inches).
2. Add **body fat %** if you know it, for Katch-McArdle. Leave it empty otherwise.
3. Pick an **example activity level**, or type your own **activity factor**. The examples (1.2, 1.375, 1.55, 1.725 and 1.9) are rounded teaching values and only approximate.
4. Read the table: resting energy and the total for each equation. The big line gives the range across the equations. Switch to **kJ** if your country uses kilojoules (1 kcal = 4.184 kJ).
5. Under **Weight change, roughly**, type a daily energy gap, such as −500 kcal, to see what the simple 7700 kcal per kg rule suggests.
6. **Download** the result as an image, a PDF or a Word file.

## Worked example

The page opens with a woman aged 35, 65 kg, 165 cm, 30 % body fat, with the moderate example factor 1.55. Mifflin-St Jeor gives 10 × 65 + 6.25 × 165 − 5 × 35 − 161 = 1,345 kcal at rest and 2,085 kcal in total. Harris-Benedict (1919) gives 1,418 and 2,198, Roza-Shizgal 1,408 and 2,183, and Katch-McArdle (lean mass 45.5 kg) 1,353 and 2,097. So the page shows **About 2,085 to 2,198 kcal a day in total**. With a gap of −500 kcal a day it suggests eating about 1,585 kcal, roughly 0.45 kg less per week at first.

## Weight change: read this

The 7700 kcal per kg rule assumes the body keeps using the same energy as weight falls. It does not: a smaller body uses less, so a fixed gap shrinks over time and the real loss slows down (Hall et al., 2011). Use the number as a rough first-weeks guide only. Eating below the resting energy, very fast loss, and anything for children, pregnancy, older adults or illness needs a qualified professional.

## Frequently asked questions

**Which equation is right?** None exactly. Studies find Mifflin-St Jeor closest for many healthy adults, but any of them can be off by 10 % or more for one person. Measured values (indirect calorimetry) are better when it matters.

**Why does it ask for sex?** The original studies fitted separate equations for men and women. Katch-McArdle does not use it.

**Is anything stored?** No. Nothing you type is stored or sent anywhere.

For study and teaching, not medical advice. Check with a qualified professional.
