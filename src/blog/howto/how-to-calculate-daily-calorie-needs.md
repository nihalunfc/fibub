---
title: "How to calculate daily calorie needs (BMR and TDEE explained)"
summary: "Estimate resting energy (BMR) from weight, height and age, then multiply by an activity factor. A worked example with four equations and honest limits."
tools: [energy-needs, body-measures, nutrient-planner]
updated: 2026-11-10
sources:
  - "Mifflin M.D., St Jeor S.T. et al. (1990), American Journal of Clinical Nutrition 51:241-247."
  - "Harris J.A., Benedict F.G. (1919), Carnegie Institution of Washington publication 279; Roza A.M., Shizgal H.M. (1984), American Journal of Clinical Nutrition 40:168-182."
  - "Weight change caution: Hall K.D. et al. (2011), The Lancet 378:826-837."
  - "Example numbers worked with fibub's own src/lib/sci/energy.ts."
---

Daily calorie needs are usually estimated in two steps: work out the energy the body burns at rest (the basal or resting metabolic rate, BMR), then multiply it by an activity factor to get the total for the day (often called TDEE, total daily energy expenditure). The [[energy-needs]] calculator runs four well-known resting equations side by side so you can see the spread, not just one number. This is general education; for a diet plan, talk to a doctor or registered dietitian.

## What you need

- **Weight**, in kilograms or pounds.
- **Height**, in centimetres or inches.
- **Age** in years.
- **Sex**, because the equations were fitted separately on men and women.
- **Body fat percentage**, only if you have a reasonable measurement. One equation (Katch-McArdle) uses it; the others do not.
- **An honest idea of how active you are**, which turns into a number between about 1.2 and 1.9.

## Step by step

The most widely used resting equation today is Mifflin-St Jeor:

**BMR = 10 × weight (kg) + 6.25 × height (cm) − 5 × age (years) + s**

- **s** is +5 for men and −161 for women.
- Each kilogram adds 10 kcal, each centimetre adds 6.25 kcal, and each year of age takes 5 kcal away.

Then:

**TDEE = BMR × activity factor**

The activity factor covers everything beyond lying still: walking, work, exercise and digesting food. Common teaching values run from 1.2 (mostly sitting) through 1.375 (light exercise one to three days a week), 1.55 (moderate, three to five days), 1.725 (hard, six to seven days) up to 1.9 (very hard training or a physical job).

With the calculator:

1. Under **The person**, choose the sex used by the equations, then type age, weight and height. Each of weight and height has its own unit menu (kg or lb, cm or in).
2. Fill in **Body fat %** if you know it, or clear the box. With it empty, the Katch-McArdle row reads "needs body fat".
3. Under **Activity**, pick an example level from the list. Its factor fills the box next to it, and you can overwrite that with your own value anywhere from 1.0 to 2.5.
4. Choose **kcal per day** or **kJ per day**. Food labels in Australia and parts of Europe use kilojoules (1 kcal = 4.184 kJ).
5. Read the **Results** table: resting and total energy for each equation, with a headline giving the lowest and highest total.
6. The **Weight change, roughly** box lets you type a daily gap, such as −300, and see a first-weeks estimate based on the 7700 kcal per kg rule. Treat it as a rough sketch only.

## A worked example

Take a man aged 42 who weighs 82 kg, stands 178 cm tall, has 22 % body fat and does light exercise (factor 1.375).

Mifflin-St Jeor at rest:

10 × 82 + 6.25 × 178 − 5 × 42 + 5 = 820 + 1,112.5 − 210 + 5 = **1,727.5 kcal**, which the page rounds to 1,728.

Total: 1,727.5 × 1.375 = **2,375 kcal a day**.

The other rows on the page:

| Equation | Resting (kcal) | Total × 1.375 (kcal) |
|---|---|---|
| Mifflin-St Jeor (1990) | 1,728 | 2,375 |
| Harris-Benedict (1919) | 1,801 | 2,476 |
| Harris-Benedict, Roza-Shizgal (1984) | 1,803 | 2,479 |
| Katch-McArdle | 1,752 | 2,408 |

For Katch-McArdle, lean mass is 82 × (1 − 0.22) = 63.96 kg, and 370 + 21.6 × 63.96 = 1,751.5 kcal at rest.

The headline reads "About 2,375 to 2,479 kcal a day in total". In kilojoules the low end is about 9,938 kJ. If he typed a gap of −400 kcal a day, the page would suggest eating about 1,975 kcal, roughly 0.36 kg less per week at first (400 × 7 ÷ 7,700). In practice the change slows over the months, because a lighter body burns less.

## Check your answer

- **Total should be above resting.** With any factor from 1.0 upwards, the total can never be smaller than the BMR. If it is, a number went in the wrong box.
- **Rough size check.** For most adults, resting energy lands somewhere around 1,200 to 2,000 kcal a day. A result like 17,000 usually means the height went in as millimetres or the weight as grams.
- **The equations should roughly agree.** Here the highest total is only about 4 % above the lowest. If one row is far from the others, check the body fat box, since only Katch-McArdle uses it.

## Questions people ask

**Is BMR the same as resting energy?** Nearly. BMR is measured under strict lab conditions (fasted, fully rested, at a set temperature); resting energy is a little looser. For everyday estimates the two are used almost interchangeably.

**Which activity level should I pick?** If in doubt, pick the lower one. People tend to overrate how active they are, and the factor has a bigger effect on the total than any small difference between equations.

**Can I use this for a child or during pregnancy?** No. These adult equations are not designed for children, pregnancy or illness, where needs are different. Ask a qualified professional. For a related adult measure, the [[body-measures]] page works out BMI from the same height and weight, and the [[nutrient-planner]] adds up the energy in the foods you eat.
