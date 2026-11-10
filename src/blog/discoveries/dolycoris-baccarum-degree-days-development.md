---
title: "Sloe bug Dolycoris baccarum development: temperature threshold and degree-days"
summary: "A 2025 study reared the sloe bug at seven temperatures and found it needs about 492 degree-days above 14.2 °C from egg to adult. Here is how to run that figure against your own weather."
tools: [insect-degree-days, station-data-viewer, trap-count-index]
updated: 2026-11-10
sources:
  - "Maharjan R et al. (2025), Insects 16(12): 1245, open access under a Creative Commons Attribution licence, the paper described here. Title, authors, volume and DOI checked on the publisher's page, 2026-11-10."
  - "Linear degree-day model: development rate = (T - T0) / K, so K = days x (T - T0). Single sine method: Baskerville and Emin (1969), Ecology 50: 514-517."
paper:
  title: "The Developmental Processes of Dolycoris baccarum (L.) (Hemiptera: Pentatomidae) Under Different Temperature Regimes"
  authors: "Maharjan R, Hong SY, Jeon JH, Ahn JJ, Yoon YN, Won OJ, Lee HS, Ko JY"
  journal: "Insects"
  year: 2025
  doi: "10.3390/insects16121245"
  url: "https://www.mdpi.com/2075-4450/16/12/1245"
  licence: "CC BY"
  reviewed: true
---

The sloe bug, *Dolycoris baccarum*, is a hairy shield bug that feeds on many crops, from beans and sesame to cereals and fruit. Like all insects, it grows faster when it is warm. A December 2025 paper in the journal *Insects* measured exactly how fast, at seven steady temperatures in the lab, and turned the results into a heat budget for the whole life cycle. It then used that budget with real Korean weather to predict when adults appear and how many generations a year are possible. With the [[insect-degree-days]] calculator you can apply the same heat budget to any set of daily temperatures. Fetch the weather with the [[station-data-viewer]], and line the forecast up with field catches in the [[trap-count-index]].

## What they found

The bugs completed development between about 21 °C and 35 °C (seven steady temperatures from about 15 °C to 40 °C were tested). At 15 °C and at 40 °C, no nymphs survived to adulthood. Warmth sped things up a lot.

From the straight-line part of the rate curve, the authors put the lower developmental threshold at **14.22 °C** for the whole immature stage, egg to adult. This is the temperature below which no development happens. The thermal constant is **492.22 degree-days**. Both figures are the paper's. A curved model, known as Lactin-2, described the full range better, including the slow-down near the upper limit. Run against several years of weather from Miryang in South Korea, the model suggested roughly three generations a year. It put the first adults of spring at the end of June or the start of July.

## Why it matters

Growers and advisers time their field checks and controls by the insect's calendar, not the human one. A known threshold and degree-day total let them do that for any year and place, using only daily minimum and maximum temperatures. As summers warm, the same numbers show how an extra generation might slip into the season.

## How they did it

1. Eggs and nymphs from a Korean population were kept in incubators at seven constant temperatures, from about 15 °C to 40 °C.
2. Nymphs were reared and each stage was timed.
3. Development rate (1 ÷ days) was plotted against temperature. A straight line through the middle range gave the threshold and the degree-day total. A curved model covered the whole range.
4. A statistical curve described how spread out the development times were, so emergence could be simulated as a spread of dates.
5. Daily weather from sesame fields in Miryang, Korea, for 2018 to 2024 was fed into the degree-day model.

## Check it yourself with fibub

First, the idea behind the numbers. In a linear model, each day adds (temperature − threshold) degree-days. At a steady 25 °C the bug gains 25 − 14.22 = 10.78 a day. So it should need 492.22 ÷ 10.78 ≈ 46 days from egg to adult.

Now with daily weather. **Our own made-up week**, not data from the paper:

```
date	min	max
2026-06-01	12	24
2026-06-02	13	26
2026-06-03	15	27
2026-06-04	16	29
2026-06-05	14	25
2026-06-06	17	30
2026-06-07	18	31
```

1. Paste the three columns into the temperature box and keep the unit on °C.
2. Type **14.22** as the lower threshold. Clear the upper threshold box, since the hottest day here is well below the 35 °C the bugs coped with.
3. Keep the method on **Single sine** and type **492.22** as the degree-day target.
4. Read the total: about **49.5 degree-days** for the week. The first day adds 4.19 and the last adds 10.28.
5. Read the projection. At this week's pace of about 7.1 a day, the target is still about 63 days away, so around 9 August. Real weather will change that, so add days as they come.
6. Switch the method to **Simple average** and watch the first day drop to 3.78. When the minimum is below the threshold, the average misses the warm afternoon hours. On days that stay above 14.22 °C all day, both methods give the same number.

To estimate generations, divide a season's total by 492.22. A made-up summer of 1,500 degree-days gives 1,500 ÷ 492.22 ≈ 3.0 generations. That is about what the paper suggests for Korea. In the field each generation also includes an egg-laying period before the next eggs, so treat this as an upper guide.

## The fine print

- One Korean population was tested at constant temperatures. In the field, temperatures swing through the day, and insects in sun or under leaves are not at air temperature.
- A straight-line model is known to estimate the threshold only roughly. The authors used a curved model (Lactin-2) to cover the full range.
- The degree-day total is for egg to adult only. Read the full paper for the stage-by-stage values. Check advice from your local extension service before you time any control work.
