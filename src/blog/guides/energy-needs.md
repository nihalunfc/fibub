---
title: "BMR and TDEE: four resting energy equations compared"
summary: "How the energy needs calculator estimates resting and daily energy with Mifflin-St Jeor, two Harris-Benedict versions and Katch-McArdle, with a worked example in pounds and inches."
tools: [energy-needs, nutrient-planner, glycaemic-load, lab-unit-converter]
updated: 2026-11-10
sources:
  - "Mifflin M.D., St Jeor S.T. et al. (1990), American Journal of Clinical Nutrition 51: 241-247."
  - "Harris J.A., Benedict F.G. (1919), A Biometric Study of Basal Metabolism in Man, Carnegie Institution of Washington, publication 279."
  - "Roza A.M., Shizgal H.M. (1984), American Journal of Clinical Nutrition 40: 168-182."
  - "Katch-McArdle equation (370 + 21.6 × lean mass), from the exercise physiology textbooks of McArdle, Katch and Katch."
  - "Hall K.D. et al. (2011), The Lancet 378: 826-837, on why the 7700 kcal per kg rule overstates long-term weight change."
  - "1 kcal = 4.184 kJ (the thermochemical calorie). 1 lb = 0.45359237 kg, 1 in = 2.54 cm (exact definitions)."
---

The energy needs calculator estimates how much energy a body uses in a day. It sets four published equations side by side, so you see a range rather than one confident number, and multiplies each by an activity factor you choose. It is for nutrition students, sports science classes and anyone curious where calorie targets come from; general education only, not personal advice. Once you have a daily figure, the [[nutrient-planner]] helps build meals around it, the [[glycaemic-load|glycaemic load calculator]] looks at how quickly those meals raise blood sugar, and the [[lab-unit-converter]] handles units from blood test reports.

## What it is

The day's energy use has two main parts.

**Resting energy expenditure (REE)** is what the body burns lying still and awake. It is close to the **basal metabolic rate (BMR)** and, for most people, well over half of the daily total.

**Total daily energy expenditure (TDEE)** adds everything else: walking, work, exercise and digesting food. The usual shortcut is

TDEE = REE × activity factor

where the factor runs from about 1.2 (mostly sitting) to 1.9 (heavy training).

Researchers measured REE in the lab, from the oxygen people breathed in, and fitted equations to weight, height, age and sex. The tool uses four:

- **Mifflin-St Jeor (1990):** REE = 10 W + 6.25 H − 5 A + s, with W the weight in kg, H the height in cm, A the age in years, and s = +5 for men or −161 for women.
- **Harris-Benedict (1919):** the oldest, over a century old.
- **Roza-Shizgal (1984):** the Harris-Benedict form, fitted again.
- **Katch-McArdle:** REE = 370 + 21.6 × LBM, where LBM is the lean body mass in kg (everything that is not fat). It needs a body fat percentage and ignores age and sex.

The equations agree within a few percent for a typical adult, but any of them can miss one real person by 10 % or more. That is why the tool shows the spread.

## How to use it

1. Pick the **sex used by the equations** (female or male), then type the **age** in years.
2. Type the **weight** and choose kg or lb next to it; type the **height** and choose cm or in.
3. If you know the **body fat %**, type it (2 to 70 %). Leave the box empty and the Katch-McArdle row says it needs body fat.
4. Choose an **example level** from the list of five, or type your own **activity factor** between 1.0 and 2.5.
5. Choose **kcal per day** or **kJ per day** and read the table: resting and total energy for each equation, with the range of totals in large type above it.
6. Under **Weight change, roughly**, type a daily gap between −2000 and 2000 kcal to see the simple rule-of-thumb result, then download the page as an image, PDF or Word file if you need it.

## A worked example

Take a made-up man, 50 years old, 180 lb and 70 in tall, with 22 % body fat and a light activity factor of 1.375.

Converted: 180 lb × 0.45359 = **81.6 kg**, and 70 in × 2.54 = **177.8 cm**.

Mifflin-St Jeor: 10 × 81.6 + 6.25 × 177.8 − 5 × 50 + 5 = 816.5 + 1,111.3 − 250 + 5 = **1,683 kcal/day** at rest. Times 1.375, that is **2,314 kcal/day** in total.

Katch-McArdle: lean mass = 81.6 × (1 − 0.22) = **63.7 kg**, so REE = 370 + 21.6 × 63.7 = **1,746 kcal/day**, and the total is **2,400 kcal/day**.

The two Harris-Benedict rows give 1,741 and 1,752 kcal/day at rest, or 2,394 and 2,408 kcal/day in total. The big line reads **About 2,314 to 2,408 kcal a day in total**. Switched to kJ, the same range is about 9,681 to 10,077 kJ/day.

Now type a gap of **−400 kcal/day**. The tool takes the Mifflin-St Jeor total, 2,314 − 400 = **1,914 kcal/day**, and the 7700 kcal per kg rule gives 400 × 7 ÷ 7700 = **0.36 kg (0.80 lb) per week** at first. That stays above his resting energy, so no extra warning appears.

## Where it is used

- **Dietetics and nursing courses** use these equations to practise estimating needs before learning the clinical versions used in hospitals.
- **Sports science** compares the lean-mass equation with the others, since muscular athletes are where they disagree most.

## Common mistakes

- **Reading one row as the truth.** Each equation is an average fit to a group of people. Quote the range, and remember that a measured value (indirect calorimetry) beats all four.
- **Choosing too high an activity factor.** People tend to overrate how active they are. Start with a lower example and adjust only with good reason.
- **Treating the weekly figure as a promise.** The 7700 kcal per kg rule ignores the fact that a lighter body burns less, so real change slows over the months. Use it for the first few weeks only.
- **Using it for groups it was not built for.** Children, pregnancy, older age and illness all change energy needs. Those cases belong with a doctor or registered dietitian.

## Questions people ask

**What is the difference between BMR and REE?** BMR is measured after a night's sleep, fasting, in a warm, quiet room. REE is measured under looser conditions and usually comes out a few percent higher. The tool's equations estimate resting energy, which is close enough to BMR for teaching.

**Why keep the 1919 equation?** Comparing it with the 1984 re-fit and the 1990 equation shows how little a century of new data changed the answer.

**Can I use my own activity factor from a textbook?** Yes. Type it in the activity factor box. Anything from 1.0 to 2.5 is accepted.

For general education only, not medical or dietary advice. Check with a qualified professional, and check the official source for the guidance used where you live.
