---
title: "How to calculate a bioconcentration factor (BCF) from k1 and k2"
summary: "Fit uptake and depuration rates to a fish test, turn them into a kinetic BCF with corrections for growth and fat, and measure food-web build-up with the trophic magnification factor."
tools: [bioaccumulation-factor, lc50-probit, species-sensitivity, non-detects]
updated: 2026-11-10
sources:
  - "The first-order one-compartment model of uptake from water and loss to clean water, the kinetic BCF k1/k2, growth correction of k2 and lipid normalisation to 5 %, as used in flow-through fish bioconcentration tests (OECD Test Guideline 305 sets out the test design)."
  - "Trophic magnification factor as 10 to the power of the slope of log₁₀ concentration against trophic level: the standard food-web regression."
  - "All data in the worked example are made up for this article."
---

Some chemicals end up far more concentrated inside a fish than in the water it swims in. The [[bioaccumulation-factor]] tool measures how much. Give it the results of a fish test, where fish first swim in dosed water and then in clean water, and it fits the rates at which they take the chemical up and clear it. From those it gives the bioconcentration factor (BCF), with a confidence interval and the usual corrections. A second mode looks at a whole food web and works out the trophic magnification factor (TMF). It suits ecotoxicology students, lab analysts and anyone reading a chemical safety dossier. Fish concentrations below the detection limit are best handled first with [[non-detects]], and the same fish species often turn up in toxicity work in [[lc50-probit]] and [[species-sensitivity]].

## What it is

Picture a fish as one well-mixed box. While the water holds a steady concentration **Cw**, the fish gains chemical through its gills at a rate proportional to Cw and loses it at a rate proportional to what it already holds:

**dC/dt = k1 × Cw − k2 × C**

- **C** is the concentration in the fish (for example µg/kg).
- **k1** is the uptake rate constant, in L/kg per day.
- **k2** is the depuration (clearing) rate constant, per day.

Once the fish move to clean water, only the loss term is left, so C falls by the same fraction each day. If uptake went on forever, C would level off where gain equals loss. That level divided by Cw is the **kinetic BCF = k1 ÷ k2**, in L/kg.

Three other numbers follow from k2. The **half-life** in clean water is ln 2 ÷ k2. The time to reach 95 % of the plateau is ln 20 ÷ k2. And because a growing fish dilutes what it holds, part of the measured k2 is really growth; taking off the growth rate ln(w2 ÷ w1) ÷ days gives a **growth-corrected BCF**. Fatty fish hold more of a fat-loving chemical, so results are often scaled to a standard 5 % lipid: BCF × 5 ÷ lipid %.

The **TMF** asks a different question: does the chemical get more concentrated with each step up a food chain? Plot log₁₀ concentration against trophic level (1 for plants, about 2 for grazers, higher for predators). TMF = 10 raised to the slope. Above 1 means the chemical builds up as it moves up the chain.

## How to use it

1. Under **Work out**, choose **Bioconcentration factor from a fish test** or **Trophic magnification factor (food web)**.
2. For a fish test, paste rows of day and fish concentration into the box, or open a file. Several rows on the same day are fine, one per fish.
3. Enter the **water concentration during uptake** and the day **uptake ends**, then choose to fit on **log** or **raw** concentrations.
4. Optionally add the fish **lipid content** and the fish **weights** at the end of uptake and at the end of the test.
5. For a food web, paste rows of organism name (optional), trophic level and concentration.
6. Read the result: the headline value, the facts below it and the chart of data with the fitted line. Open **Data and fit** for the table, then save it as CSV, or the whole report as PNG, PDF or Word.

## A worked example

A made-up test exposes fish to **0.5 µg/L** for 21 days, then moves them to clean water until day 38. The pooled fish samples, in µg/kg:

| Day | 2 | 5 | 10 | 14 | 18 | 21 | 22 | 24 | 28 | 32 | 38 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Fish | 248 | 411 | 567 | 570 | 605 | 579 | 483 | 268 | 107 | 37 | 9 |

Fitted on logs, the tool gives **k1 = 298.8 L/kg per day** and **k2 = 0.2488 per day**. So:

- kinetic BCF = 298.8 ÷ 0.2488 ≈ **1,201 L/kg** (95 % CI 1,164 to 1,238 L/kg)
- half-life = 0.693 ÷ 0.2488 ≈ **2.79 days**
- time to 95 % of steady state = 3.00 ÷ 0.2488 ≈ **12.0 days**, well inside the 21-day uptake

The last three uptake days (570, 605 and 579 µg/kg) average 584.7 µg/kg, each within ±20 % of that mean. The steady-state BCF is 584.7 ÷ 0.5 ≈ **1,169 L/kg**, close to the kinetic value.

The fish grew from **4.0 g to 4.6 g** over the 17 days of depuration: growth rate = ln(4.6 ÷ 4.0) ÷ 17 ≈ 0.00822 per day. Then k2 without growth = 0.2488 − 0.0082 ≈ 0.2405 per day, and the **growth-corrected BCF ≈ 1,242 L/kg**.

These fish were fatty, at **8 % lipid**. Scaled to 5 %: 1,201 × 5 ÷ 8 ≈ **751 L/kg**.

For a TMF, take five made-up organisms at trophic levels 2.0, 2.5, 3.1, 3.6 and 4.2 with 5, 8, 14, 26 and 41 ng/g lipid. The slope is 0.4248 per level, so **TMF = 10^0.4248 ≈ 2.66** (95 % CI 2.37 to 2.98). The whole interval sits above 1, so the chemical biomagnifies.

## Where it is used

- **Chemical registration.** Many regions ask for a fish BCF before a new substance is sold. The value decides whether it is labelled as bioaccumulative; check the official source for the threshold where you are.
- **Environmental risk assessment.** BCF links a water concentration to what predators eating the fish will swallow.
- **Monitoring programmes.** TMF from field samples shows whether a pollutant such as a flame retardant or mercury climbs a lake's food chain.
- **Teaching and lab quality checks.** The same model fits any first-order uptake and clearance, such as a drug in a tank of shrimp.

## Common mistakes

- **Mixing units.** Water in µg/L and fish in µg/kg gives L/kg. Put the water in ng/L and the BCF is off by 1,000.
- **Stopping uptake too early.** If the time to 95 % of steady state is longer than the uptake phase, the steady-state BCF is not valid. Use the kinetic one.
- **Forgetting growth.** Fast-growing fish make depuration look quicker and the BCF look smaller.
- **Comparing BCFs at different lipid levels.** Normalise to 5 % before comparing species or studies.
- **Using wet-weight concentrations for a TMF.** Fat-loving chemicals need lipid-normalised values, or fat content will swamp the trend.

## Questions people ask

**Is BCF the same as BAF?** No. A BCF counts uptake from water alone, in a lab. A bioaccumulation factor (BAF) is measured in the wild, where food adds to the dose.

**Why fit on logs?** Errors in fish tests tend to grow with the concentration. On logs, a 10 % miss counts the same at 10 µg/kg as at 1,000 µg/kg.

**Can a TMF be below 1?** Yes. It means the chemical becomes less concentrated up the chain, often because predators break it down. This is called trophic dilution.
