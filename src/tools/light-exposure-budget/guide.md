---
name: Light exposure budget for museum objects
num: 419
shelf: science
section: heritage-conservation
title: "Light exposure budget calculator for museum objects: lux-hours per year, display time allowed and UV dose"
summary: "Work out the lux-hours an object gets from lux × hours a day × days, how much of the yearly budget your institution sets that uses, how long or how brightly it can be shown, the UV it receives from the light's µW/lm, and a plan of display periods with the budget left. Nothing is uploaded."
status: live
ads: false
order: 419
icon: clock
works: offline
updated: 2026-11-09
related: [colour-difference-calculator, psychrometric-calculator, plot-maker, heritage-climate-checker]
sources:
  - "Lux-hours (illuminance × time) and the reciprocity assumption that light damage depends on the total exposure; UV irradiance from illuminance × UV content in µW/lm. General conservation science and photometry."
  - "Checked against an independent Python sum of the example plan (124,800 lux-hours, 62.4 % of a 200,000 lux-hour plan budget, 188 more days at 50 lux for 8 hours)."
  - "The budget, UV values and plan in the example are made-up, rounded examples, not recommendations; the user enters the figures their institution sets."
flow:
  - { icon: sliders, label: "Budget" }
  - { icon: calculator, label: "Lux-hours" }
  - { icon: table, label: "Plan" }
  - { icon: chart, label: "Chart" }
---

## What it does

Light fades dyes, pigments, paper, textiles, photographs and many other materials, and the damage cannot be undone. Museums manage it with a **light budget**: a yearly allowance of light exposure for each sensitive object, measured in **lux-hours** (the light level in lux multiplied by the hours it is lit). The usual working assumption, called reciprocity, is that the damage depends on the total: 50 lux for 2,000 hours counts the same as 100 lux for 1,000 hours.

This calculator does the sums around a budget:

- **One display**: lux × hours lit per day × days on display gives the lux-hours per year, the share of the budget used, what is left, how many days the object may be shown at that light level, and the brightest steady light level that fits the schedule.
- **UV**: from the UV content of the light in microwatts per lumen (µW/lm, read from a UV meter), the UV irradiance in mW/m² and the UV exposure in kJ/m². Give your own UV limit and the page says whether the light is within it.
- **Plan of display periods**: list displays, loans, study visits and photography sessions for one object. The page adds them up, compares the total with the yearly budget × the years the plan covers, and says how many more days a next display could last.

Measure any fading you see with the [[colour-difference-calculator|colour difference calculator]], and keep the room's climate in range with the [[heritage-climate-checker|heritage climate checker]].

## How to use it

1. Type the **yearly budget** your institution, conservator or loan agreement sets for this object. The 100,000 lux-hours on the page is only an example: budgets depend on how light-sensitive the object is.
2. Under **One display**, type the light level measured at the object, the hours the lights are on each day, and the days on display in a year.
3. For a longer view, list the periods in the **plan** box (name, lux, hours per day, days), or open a CSV or Excel file. Set the years the plan covers.

## Worked example

With the example budget of 100,000 lux-hours a year, a display at 50 lux, 8 hours a day for 300 days gives **120,000 lux-hours a year: 120.0 % of the budget**. It is over by 20,000 lux-hours. At 50 lux and 8 hours a day the budget allows 250 days, or, to stay on show all 300 days, about 41.7 lux. With 30 µW/lm of UV the irradiance is 1.50 mW/m² and the yearly UV exposure 13 kJ/m².

The example plan covers two years (a 200,000 lux-hour budget): an opening display (50 lux, 8 h, 180 days: 72,000), study room visits (150 lux, 1 h, 12 days: 1,800), a loan exhibition (50 lux, 10 h, 100 days: 50,000) and a photography session (1,000 lux, 0.5 h, 2 days: 1,000). Together that is **124,800 of 200,000 lux-hours (62.4 %)**, leaving 75,200: enough for up to 188 more days at 50 lux, 8 hours a day.

## Tips

- Measure the lux at the object's surface, at its brightest point, with the display lights as they will be. Daylight changes through the day and the year, so a light logger gives a better total than one reading.
- Short bright events add up: photography, filming and conservation work under strong light all count.
- Lower UV with filters on windows and lamps; visible light cannot be filtered away without dimming the object.

## FAQ

**What budget should I use?** Ask your conservator or follow your institution's policy or the loan agreement. The page does not recommend a figure.

**Does reciprocity always hold?** It is a practical working assumption. Some materials do not follow it exactly, but it is the standard way to plan exposure.

**Is anything uploaded?** No. Everything runs in your browser and works offline.
