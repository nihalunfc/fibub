---
title: "Gaussian plume model: how far smoke from a chimney travels"
summary: "How the Gaussian plume calculator estimates ground-level pollution downwind of a stack: stability classes, Briggs spreads, plume rise, and a worked city example."
tools: [gaussian-plume-calculator, air-quality-calculator, psychrometric-calculator, gas-law-calculator]
updated: 2026-11-10
sources:
  - "Gaussian plume equation with ground reflection: standard form in Turner D.B., Workbook of Atmospheric Dispersion Estimates, US EPA (a US government work)."
  - "Stability classes from wind and sky: Pasquill (1961) and Turner (1964), as given in US EPA guidance."
  - "Dispersion curves: Briggs (1973) open-country and urban formulas; plume rise: Briggs, as in the US EPA ISC3 user's guide."
  - "The source, weather and receptor in the worked example are made up."
---

The Gaussian plume calculator estimates how much of a gas from a chimney reaches the ground downwind, how far away the worst spot is, and how much arrives at a house or school you choose. You describe the stack, the wind and the sky, and it returns the peak, a chart of concentration against distance, a map seen from above and a table. It is a screening tool for environmental science students and anyone doing a first check on a boiler or incinerator stack. To turn the answer into an air quality index, use the [[air-quality-calculator]]; the [[gas-law-calculator]] shows why hot stack gas is lighter than the air around it, and the [[psychrometric-calculator]] deals with the moisture in that air.

## What it is

A steady wind carries chimney gas downwind (x), while eddies spread it sideways (y) and up and down (z). The Gaussian plume model assumes that, at each distance, the gas is spread in a bell curve (a normal, or Gaussian, distribution) in both of those directions. The concentration at ground level on the plume's centre line is then

C = Q ÷ (π u σy σz) × e^(−H² ÷ 2σz²)

where:

- **C** is the concentration, in g/m³ (the tool shows µg/m³, a millionth of that);
- **Q** is the emission rate, in g/s;
- **u** is the wind speed at the stack top, in m/s;
- **σy** and **σz** are the widths of the bell curves sideways and vertically, in m, which grow with distance;
- **H** is the effective height of the plume, in m: the stack plus however far the hot gas rises.

The ground acts as a mirror, which doubles the amount near the surface. Near the stack the plume has not reached the ground; far away it is thin. The peak sits in between.

How fast σy and σz grow depends on the **stability class**, a letter from A (very unstable: sunny, light wind, strong stirring) to F (moderately stable: clear night, calm). The tool uses Briggs's formulas for each class, with separate versions for open country and for cities, where buildings stir the air more. **Plume rise** is worked out from the **buoyancy flux** F, a measure of how strongly the hot gas wants to rise:

F = g v d² (Ts − Ta) ÷ (4 Ts)

with g = 9.81 m/s², v the exit speed, d the inner diameter, and Ts and Ta the gas and air temperatures in kelvin.

## How to use it

1. Enter the **emission rate** and choose its unit, then the **stack height** in metres.
2. Enter the **wind at 10 m**, as weather stations report it; the tool scales it to the stack top.
3. For **stability**, either choose a class yourself or leave "Work it out from the sky" and pick the **sky**: day with strong, moderate or weak sun, overcast, or night with more or less cloud. Then choose **open country** or **city**.
4. If you know it, give a **mixing height**, the top of the stirred layer of air. Leave it blank for no lid.
5. Leave **Add plume rise** ticked for a hot stack and fill in the exit speed, inner diameter and both temperatures, or untick it for a cold release.
6. Choose a **gas** to see parts per billion as well, and set a **receptor**: its distance downwind, distance off the centre line and height above the ground.
7. Read the peak, the facts list, the chart, the plan-view map and the table from 100 m to 20 km, and download them as an image, PDF or Word file.

## A worked example

A made-up hospital boiler in a city has a **30 m** stack giving off **20 g/s** of sulfur dioxide (SO₂). The gas leaves at **10 m/s** through a **1 m** opening at **120 °C**, into air at **10 °C**. The sky is overcast and the 10 m wind is **3 m/s**. A school stands **1.5 km** downwind, **100 m** to one side of the centre line.

1. Overcast skies give class **D** (neutral) at any wind speed.
2. The city wind profile raises the wind at 30 m to **3.95 m/s**.
3. Buoyancy flux: 9.81 × 10 × 1² × (393.15 − 283.15) ÷ (4 × 393.15) = **6.9 m⁴/s³**. Briggs's formula for a small flux gives a rise of 21.4 × 6.9^0.75 ÷ 3.95 = **23.0 m**, reached about **163 m** downwind. The effective height is **53.0 m**.
4. The highest ground-level concentration is **374 µg/m³ (about 143 ppb), 280 m downwind**. The plume is about **182 m** wide there.
5. At the school, σy is **189.7 m** and σz **174.4 m**, and the concentration is **40.5 µg/m³ (about 15.5 ppb)**.

Untick plume rise and the peak jumps to about **1,160 µg/m³ only 155 m away**: three times higher, and much closer.

## Where it is used

- **Environmental impact studies** use screening runs like this to decide whether a full model is needed.
- **Planning**: rough checks of how tall a new stack should be, or how close homes can sit.
- **Odour**: the same physics applies to smells from farms or composting sites.

## Common mistakes

- **Mixing up wind heights.** Use the 10 m wind from the weather report, not a guess at the stack top; the tool does the scaling.
- **Forgetting the background.** The answer is only what this stack adds. Add the existing level before comparing with a limit.
- **Comparing with the wrong averaging time.** The results are roughly 10 to 60 minute averages. A yearly limit needs a much lower figure. Check the official source for the limit and its averaging time.

## Questions people ask

**Why is a city plume closer to the ground?** Buildings make the air rougher, so the plume spreads faster in every direction, including downwards.

**What does the plan-view map show?** It looks down on the ground with the wind blowing to the right. The darker the shade, the more gas; the palest shade is a thousandth of the peak.
