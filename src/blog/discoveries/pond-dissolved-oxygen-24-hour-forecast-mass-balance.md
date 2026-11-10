---
title: "Forecasting pond dissolved oxygen a day ahead with a mass-balance model"
summary: "A Kentucky study predicted next-day dissolved oxygen in fish ponds from yesterday's oxygen curve. Here is how it works, and how to run your own dusk-to-dawn oxygen budget."
tools: [pond-oxygen-budget, dissolved-oxygen, stocking-density-calculator]
updated: 2026-11-10
sources:
  - "Martin S et al. (2026), Water 18: 1618, CC BY, the paper described here."
  - "Oxygen saturation in water: Benson BB and Krause D (1984), Limnology and Oceanography 29: 620-632 (the formula the pond tool uses)."
  - "Night oxygen balance dC/dt = (K_L / depth)(Cs - C) - respiration + aeration: a standard single-box budget."
paper:
  title: "Short-Term Dissolved Oxygen Forecasting in Aquaculture Systems Using a Process-Based Mass-Balance Model"
  authors: "Martin S, Dvorak J, Semmens K, Ford B"
  journal: "Water"
  year: 2026
  doi: "10.3390/w18131618"
  url: "https://doi.org/10.3390/w18131618"
  licence: "CC BY"
  reviewed: true
---

Fish in ponds die most often just before sunrise, when the night has used up the oxygen. A team at Kentucky State University asked a practical question: can yesterday's oxygen record tell a farmer whether tonight will be dangerous? They built a small physics-style model, an oxygen "budget" with income and spending, and used it to forecast dissolved oxygen (DO) 24 hours ahead in four ponds. The paper appeared in the journal Water in July 2026 under a CC BY licence. Below we explain it in our own words, and show how the [[pond-oxygen-budget]] tool lets you run the night half of the same budget with your own numbers. For a single saturation value, the [[dissolved-oxygen]] calculator is quicker.

## What they found

The model followed the daily rise and fall of oxygen well enough to be useful as a warning. At one cemented pond, the authors report that the predicted minimum was within 1 mg/L of the measured one, or safely lower, on roughly nine in ten of the days when the real minimum dropped below 6 mg/L. In the large farm pond, at a spot away from the aerators, it caught all 14 critical days in the record. Typical daily errors were around 1 mg/L, but larger where aerators were switched on and off unpredictably.

## Why it matters

Many forecasting tools for ponds use machine learning, which needs months of training data and can fail in a pond it has never seen. A budget model needs only the last day of readings plus tomorrow's weather. That makes it easier to set up on a small farm with one sensor. It also shows why a night will be bad: heavy respiration, or calm air.

## How they did it

1. They logged DO, water temperature, light and air pressure every 10 minutes at several spots in four ponds, one natural pond of about 8,000 m² and three cemented pools of about 400 m².
2. Each day, they fitted three numbers to the previous 24 hours of readings: how much oxygen the algae make per unit of light, how fast everything in the pond uses oxygen (respiration), and how quickly oxygen crosses the water surface (reaeration).
3. They carried those numbers forward, fed in the next day's measured light, temperature and pressure, and stepped the budget forward in 10-minute steps from the last DO reading.
4. They repeated the fit 1,000 times with small random changes and kept the middle forecast.
5. They scored each day by whether the forecast minimum was close to, or safely below, the measured minimum.

## Check it yourself with fibub

The night is the part of the budget that matters for fish, because there is no light and photosynthesis drops out. The [[pond-oxygen-budget]] tool solves that night exactly. The numbers below are **our own made-up values**, not the paper's data.

**Step 1: estimate tonight's respiration from last night.** Say your sensor read 12.0 mg/L at dusk and 5.0 mg/L at dawn, 10 hours later. Ignoring the air, that is a fall of (12.0 − 5.0) ÷ 10 = 0.7 mg/L per hour. This is the same idea as the paper's respiration term, done by hand.

**Step 2: describe the pond.** Type a water temperature of 26 °C, salinity 0, altitude 150 m, an area of 400 m² and a mean depth of 1.2 m. The tool shows that water at saturation here holds about 7.97 mg/L. A dusk reading of 12.0 mg/L is about 151 % of that: the algae have over-filled the water by day.

**Step 3: set up the night.** Dusk DO 12, hours to dawn 10, lowest DO you accept 4. Leave fish biomass at 0 and put the whole 0.7 mg/L per hour into the water-column box, because our estimate lumps fish, plankton and mud together, as the paper does. Set the surface transfer to 0.02 m per hour.

The tool reports a dawn DO of about **4.93 mg/L**: above our limit, no extra aeration needed. Notice that it is a little lower than the 5.0 we started from. Because the water begins supersaturated, some oxygen escapes to the air early in the night, which the simple subtraction in Step 1 ignored.

**Step 4: ask "what if?"** A warm, cloudy spell can raise respiration. Change 0.7 to 1.0 mg/L per hour. Now dawn DO falls to about **2.17 mg/L**, the line crosses 4 mg/L after about 8 hours, and the tool says to add roughly **0.095 kg of oxygen per hour**. If your aerator delivers 1 kg of oxygen per kWh in the field, that is about 0.1 kW of running power through the night.

For a full study, the [[stocking-density-calculator]] helps you turn fish weight into the biomass box when you want to split fish from plankton.

## The fine print

- The tests used the next day's measured weather, not a weather forecast, so this is a best case. Real forecasts will add error.
- Only four ponds at one university farm were studied, and salinity was taken as constant.
- The model struggled where aerators were cycled on and off, because its surface-exchange term was built for still, natural water.
- It needs about a day to catch up when conditions change suddenly, since it borrows yesterday's numbers.
- The authors declare part-funding from a fish company. The data are available on request, not in a public archive.
- Our tool assumes steady rates all night. It is a planning aid: always measure DO before dawn. Read the full paper for the exact methods and scores.
