---
title: "How to calculate BMI (with a worked example)"
summary: "Divide weight in kilograms by height in metres squared. A worked example in metric and US units, the WHO adult bands, and what BMI cannot tell you."
tools: [body-measures, energy-needs, health-log]
updated: 2026-11-10
sources:
  - "BMI bands for adults: World Health Organization, Technical Report Series 894 (2000). Cut points differ for children and for some countries; check the official source."
  - "Example numbers worked with fibub's own src/lib/sci/body.ts."
---

Body mass index (BMI) is your weight in kilograms divided by the square of your height in metres. The [[body-measures]] calculator does the sum as you type, in metric or US units, names the WHO adult band and marks the result on a weight-for-height chart. It is general education, not a health check: only a doctor or nurse can say what a number means for one person.

## What you need

- **Height**, in centimetres, or in feet and inches.
- **Weight**, in kilograms or pounds. Weigh at about the same time of day if you plan to compare over weeks, because body weight swings by a kilogram or so between morning and evening.
- **An adult.** The WHO bands below are for people aged 18 and over. Children and teenagers are judged against BMI-for-age charts instead, because their bodies change shape as they grow.

## Step by step

The formula is:

**BMI = weight (kg) ÷ height (m)²**

- **Weight** is in kilograms.
- **Height** is in metres, so 162 cm becomes 1.62 m.
- **Squared** means multiplied by itself: 1.62 × 1.62.
- The unit of the answer is kg/m², though people usually leave it off.

If you work in pounds and inches, there is a shortcut with a conversion factor already built in:

**BMI = 703 × weight (lb) ÷ height (in)²**

The 703 comes from changing pounds to kilograms and inches to metres in one go. It gives the same answer to within a rounding error.

With the calculator:

1. Press **Metric (cm, kg)** or **US (ft, in, lb)**. If you switch after typing, your numbers are converted rather than wiped.
2. Pick a **sex**. BMI ignores it, but other rows on the page (ideal and lean weight) use it.
3. Type the height and weight. The big line under **Body mass index** shows the result to one decimal place, and a coloured label beside it names the WHO adult band.
4. Look at the chart. Each line is one band edge (18.5, 25, 30, 35 and 40) drawn across a range of heights, and a diamond marks where your numbers sit.
5. Ignore the extra tables unless you need them. Body surface area and ideal body weight are measures used in clinical teaching, such as working out some medicine doses, and have nothing to do with BMI itself.
6. Save the page as an image, PDF or Word file with the download buttons if you want a record. To track readings over time, the [[health-log]] keeps weight next to blood pressure and blood sugar.

The WHO adult bands are: under 18.5 underweight, 18.5 up to 25 normal range, 25 up to 30 pre-obese (often called overweight), and 30 or more obese, split into classes I, II and III at 30, 35 and 40.

## A worked example

Take an adult who is 162 cm tall and weighs 68 kg.

1. Height in metres: 162 ÷ 100 = 1.62 m.
2. Square it: 1.62 × 1.62 = 2.6244 m².
3. Divide: 68 ÷ 2.6244 = 25.9 kg/m².

So the BMI is **25.9**, which falls in the 25 to 30 band. The calculator shows "BMI 25.9 kg/m²" with the label "Pre-obese (overweight)".

The same person in US units is about 5 ft 4 in (64 inches) and 150 lb:

703 × 150 ÷ (64 × 64) = 105,450 ÷ 4,096 = 25.7

The small gap (25.7 against 25.9) is only because 5 ft 4 in and 150 lb are rounded versions of 162 cm and 68 kg. Type the exact figures and both modes agree.

Notice how close this result sits to the 25 line. A difference of a kilogram either way, or a centimetre of height, can move someone across a band edge. That is a good reason to treat the bands as rough guides rather than verdicts.

## Check your answer

- **Work backwards.** BMI × height² should give the weight back: 25.9 × 2.6244 = 68.0 kg. If you get something wildly different, you probably used centimetres instead of metres.
- **Know the usual range.** Most adult BMIs land between about 17 and 40. An answer like 0.0026 or 259,000 means a unit slipped (centimetres not converted, or pounds used with the metric formula).
- **Use the band edges as a frame.** For a height of 1.62 m, BMI 18.5 is 18.5 × 2.6244 = 48.6 kg and BMI 25 is 25 × 2.6244 = 65.6 kg. A weight of 68 kg is just above the upper figure, which matches 25.9.

## Questions people ask

**Is BMI accurate for athletes?** Not very. BMI cannot tell muscle from fat, so a muscular person can score in the overweight band while carrying little fat. It also says nothing about where fat sits on the body, which matters for health. It is a quick screen for large groups, not a full picture of one person.

**Are the bands the same everywhere?** No. Some countries use lower cut points for people of South Asian or East Asian heritage, and children use age-based charts. Check the official source for your country.

**What should I do with my number?** Treat it as general information. If you have questions about your weight or health, talk to a doctor or other qualified professional. The [[energy-needs]] calculator shows how daily energy use is estimated, which is a related topic often taught alongside BMI.
