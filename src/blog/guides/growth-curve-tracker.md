---
title: "Growth curves for livestock: daily gain, Gompertz and mature weight"
summary: "How to turn weigh records into average daily gain, fit Gompertz, logistic and von Bertalanffy curves, read mature weight and inflection, and track body condition."
tools: [growth-curve-tracker, feed-ration-balancer, breeding-calendar, plot-maker]
updated: 2026-11-10
sources:
  - "Gompertz, logistic and von Bertalanffy growth equations and their inflection points: standard growth-model mathematics, as used in animal science (for example Fitzhugh 1976, Journal of Animal Science 42: 1036-1051). Formulas only."
  - "Akaike information criterion (AIC) for comparing fitted models: standard statistics."
  - "The lamb in the worked example is made up for teaching; it is not a real animal."
---

The growth tracker takes a list of weighings and tells you how fast each animal is putting on weight, what it is likely to weigh when fully grown, and whether its body condition is drifting up or down. It suits farmers, animal science students and researchers. Once you know the gain, check that the diet can support it with the [[feed-ration-balancer]], plan the next matings with the [[breeding-calendar]], or redraw the figure for a paper in the [[plot-maker]].

## What it is

Animals do not grow in a straight line. Gain is slow at first, then fast, then slow again near adult size, so weight against age makes an S shape.

**Average daily gain (ADG)** is the simplest measure: the weight gained between two weighings divided by the days between them. ADG = (W₂ − W₁) ÷ (t₂ − t₁), where W is weight and t is the day.

A **growth curve** describes the whole S at once. The tool fits three classic shapes:

- **Gompertz:** W = A·exp(−b·e^(−kt))
- **Logistic:** W = A ÷ (1 + b·e^(−kt))
- **von Bertalanffy:** W = A·(1 − b·e^(−kt))³

In each one, t is time in days, **A** is the mature weight (where the curve flattens out), **k** is a rate constant per day (bigger means the animal reaches A sooner) and **b** sets where the curve starts. The **inflection point** is where growth is fastest. For Gompertz it falls at A ÷ e (about 37 % of A), for the logistic at A ÷ 2, and for von Bertalanffy at 8/27 of A (about 30 %).

The tool adjusts A, b and k until the squared gaps between curve and data are as small as possible (nonlinear least squares). It ranks the three fits by **AIC** (Akaike information criterion), a score that rewards a close fit with few parameters. Lower is better.

**Body condition score (BCS)** rates fat cover by hand, often from 1 to 5. The tool fits a straight line through the scores and reports the change per 30 days.

## How to use it

1. Type or paste one weighing per line: animal tag, date or age in days, weight, and a body condition score if you have one. You can also load a CSV or Excel sheet, or press **Use the example** to see a filled-in herd.
2. If the weight is not in kg, change the **Weight unit** box (for example to lb). It only changes the labels.
3. Choose the animal from the **Animal** menu. With more than one animal in the list, you can also fit the whole group as one.
4. Use **Curve for the figure** to pick which of the three fits is drawn over the points. The table below always shows all three, with the lowest AIC in bold.
5. Read the table of gains between weighings, and the body condition trend if you gave scores.
6. Save the gains or the fitted values with the two CSV buttons, or the whole report as an image, PDF or Word file.

## A worked example

A made-up lamb, Lamb 7, is weighed every 30 days from birth, then every 60 days. Ages are in days, weights in kg, BCS on a 1 to 5 scale:

| Age (days) | 0 | 30 | 60 | 90 | 120 | 150 | 180 | 240 | 300 |
|---|---|---|---|---|---|---|---|---|---|
| Weight (kg) | 4.5 | 12.0 | 20.5 | 28.0 | 34.5 | 39.5 | 43.0 | 48.0 | 51.0 |
| BCS | 3 | 3 | 3.25 | 3.25 | 3.5 | 3.25 | 3.5 | 3.5 | 3.75 |

**Daily gain.** Over the whole 300 days, the lamb gained 51.0 − 4.5 = 46.5 kg, so ADG = 46.5 ÷ 300 = 0.155 kg/day. The fastest stretch is day 30 to 60: 8.5 kg in 30 days, or 0.283 kg/day. The last stretch, day 240 to 300, is only 3.0 kg in 60 days, or 0.050 kg/day. The slowdown is the top of the S.

**Curves.** The three fits come out as:

- von Bertalanffy: A = 53.31 ± 0.26 kg, k = 0.0118 per day, AIC −24.2 (lowest, so best)
- Gompertz: A = 51.93 ± 0.67 kg, k = 0.0143 per day, AIC −4.2
- Logistic: A = 49.86 ± 1.35 kg, k = 0.0216 per day, AIC 13.3

The von Bertalanffy curve puts the fastest growth near day 44, at 8/27 × 53.31 = 15.8 kg. At 51.0 kg the lamb is already about 96 % of that, so the three values of A agree fairly well, as expected once weighings reach the flat part of the curve.

**Condition.** The straight line through the nine scores rises by about +0.070 points per 30 days and ends near 3.73 at day 300.

## Where it is used

- **Beef, sheep and goat farms:** spotting animals that lag behind, and timing sale or breeding by weight.
- **Poultry and pig units:** comparing batches or diets by k and the inflection age.
- **Fisheries and aquaculture:** von Bertalanffy curves are a standard way to describe fish growth from length or weight at age.

## Common mistakes

- **Weighing at different times of day.** A full gut can add several percent to the scale reading. Weigh at the same hour, before feeding.
- **Trusting A from young animals only.** If weighings stop on the steep part of the S, the mature weight is a guess. Keep weighing until gains clearly slow down.
- **Mixing ages and dates.** Use one or the other for the whole list; ages line up animals born on different days.
- **Comparing A or k across different curves.** Each model defines them a little differently. Compare animals using the same curve.
- **Reading AIC as a grade.** It only ranks the three fits on the same data, so look at the figure too.

## Questions people ask

**How many weighings do I need?** Each curve has three parameters, so at least four; in practice eight or more, spread over the whole growth period.

**Can I track length instead of weight?** Yes. Put the length in the weight column and type the unit, for example cm, in the Weight unit box. The maths does not care what is being measured.

**Why is overall ADG lower than in the early weeks?** It averages fast early growth with slow late growth. The table of gains shows each stage on its own.
