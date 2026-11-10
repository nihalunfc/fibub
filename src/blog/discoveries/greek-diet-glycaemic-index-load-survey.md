---
title: "Dietary glycaemic index and load in Greek adults: a national survey"
summary: "A 2025 study worked out the daily glycaemic index and load of nearly 4,000 Greek adults from two 24-hour food recalls. Here is how to redo that kind of sum for one day of food."
tools: [glycaemic-load, survey-weighting, nutrient-planner]
updated: 2026-11-10
sources:
  - "Vourli G, Augustin L, La Vecchia C, Peppa E, Trichopoulou A (2025), Estimates of the Dietary Glycemic Index and Load in a Representative Sample of the Greek Population, Nutrients 17: 3596. Open access under a Creative Commons Attribution (CC BY) licence, as stated on the publisher's article page, checked 2026-11-10."
  - "Wolever TMS and Jenkins DJA (1986), American Journal of Clinical Nutrition 43: 167-172 (the GI of a mixed meal as a carbohydrate-weighted mean)."
  - "Salmerón J et al. (1997), JAMA 277: 472-477 (glycaemic load as GI times carbohydrate)."
paper:
  title: "Estimates of the Dietary Glycemic Index and Load in a Representative Sample of the Greek Population"
  authors: "Vourli G, Augustin L, La Vecchia C, Peppa E, Trichopoulou A"
  journal: "Nutrients"
  year: 2025
  doi: "10.3390/nu17223596"
  url: "https://www.mdpi.com/2072-6643/17/22/3596"
  licence: "CC BY"
  reviewed: true
---

How fast does a whole country's food raise blood sugar? A 2025 paper in *Nutrients* estimated the average dietary glycaemic index and glycaemic load of adults in Greece, using a national survey of what people ate. Men had a higher load than women, and older and more educated people had lower values. The paper is open access under a CC BY licence. The arithmetic behind each person's daily score is exactly what the [[glycaemic-load]] calculator does, food by food, in your browser.

## What they found

The team used food records from 3,951 adults in the HYDRIA survey, collected in 2013 and 2014. For the whole sample they report a mean dietary glycaemic index (GI) of about 59.7 and a mean daily glycaemic load (GL) of about 101.7.

The authors report clear differences between groups:

- Men averaged a GI of about 61 and a GL of about 113; women about 59 and 82. Much of the gap in load comes from men simply eating more carbohydrate.
- People aged 55 or over, and people with more years of education, had lower GI and GL.
- Current smokers had higher values, most clearly among men.
- Among men, closer adherence to a Mediterranean-style diet went with a slightly lower GI and GL. Among women the pattern was not the same.

## Why it matters

The glycaemic index compares how much a food's carbohydrate raises blood glucose against pure glucose, which is set at 100. The glycaemic load also counts how much carbohydrate is eaten. Many cohort studies link these two numbers with type 2 diabetes and heart disease, so knowing a population's typical values gives a baseline. It helps researchers compare countries, plan diet studies, and see which groups might gain most from food swaps. This is general education about nutrition research, not personal diet advice.

## How they did it

No one drank a glucose drink in this study. Each person described everything they ate on two separate days in a structured interview (a 24-hour recall). Every food was then given a GI value from published international tables. Foods with almost no carbohydrate, such as meat, fish, eggs and oils, were left without a GI.

For each day, the daily GL is the sum over foods of GI × available carbohydrate ÷ 100. The daily GI is the average GI of the foods, weighted by how much carbohydrate each one supplied. The two days were averaged. Because the survey was designed to represent the whole adult population, every result was weighted to match it, and regression models adjusted for energy, carbohydrate and fat intake.

## Check it yourself with fibub

Here is one **made-up day of food**, with **rounded GI values chosen for illustration**, not values from the paper or from any GI table.

| Food | GI | Carbohydrate per 100 g | Eaten |
|---|---|---|---|
| White bread | 70 | 45 g | 80 g |
| Boiled rice | 65 | 28 g | 180 g |
| Cooked lentils | 30 | 12 g | 200 g |
| Orange | 40 | 9 g | 150 g |
| Plain yogurt | 35 | 4 g | 200 g |

1. Open the glycaemic load calculator and press **Start empty**.
2. Press **Add a food** five times and fill in each row: the name, the GI, carbohydrate per 100 g, fibre per 100 g (type 0 here) and the portion in grams.
3. Leave the fibre box unticked, since these carbohydrate figures already leave fibre out, as European labels do.
4. Each row now shows its own result. The bread gives 36 g of available carbohydrate and a GL of 25.2; the rice gives 50.4 g and a GL of 32.8; the lentils 24 g and 7.2; the orange 13.5 g and 5.4; the yogurt 8 g and 2.8.
5. The meal box adds them up: **GL 73.4, GI 55.6, 131.9 g carbohydrate**. The share column shows that rice and bread together make up almost four fifths of the day's load.
6. Try a swap. Change the bread's GI to 55, as if it were a denser wholegrain loaf. The day's GL falls to about 68.0 and its GI to about 51.5, while the carbohydrate stays the same.

This made-up day has a GI a little below the paper's national average and a GL well below it, because it holds less carbohydrate than a typical adult's day. To reach the paper's kind of figure for a whole group, you would repeat the sum for each person and then average with survey weights. The [[survey-weighting]] tool can make those weights from population counts by age and sex, and the [[nutrient-planner]] helps check the rest of the day's nutrients.

## The fine print

- The food records are from 2013 and 2014, and diets change over time.
- Two days of recall cannot fully capture what someone usually eats, and people may misremember or under-report.
- GI values came from international tables, not from testing Greek foods. Local breads, pies and pulses can differ from the foods in those tables.
- A survey like this shows patterns at one point in time. It cannot show that smoking, age or diet style causes a higher or lower GI.
- GI values vary with ripeness, cooking and what else is on the plate. For a person's own diet, check with a qualified health professional and the official national guidance.
