---
name: Psychrometrics
num: 34
shelf: science
section: meteorology
title: "Psychrometrics"
summary: "From the air temperature and humidity (or dew point, or wet bulb), get every moist air property with the ASHRAE equations, a psychrometric chart, the heat index and the humidex."
status: live
ads: true
order: 10
icon: sliders
works: offline
updated: 2026-11-08
related: [uncertainty-calculator, plot-maker, sample-size]
sources:
  - "Moist air equations: Hyland and Wexler, as given in the ASHRAE Handbook, Fundamentals (2017)."
  - "Heat index: US National Weather Service; humidex: Environment Canada (government formulas)."
flow:
  - { icon: sliders, label: "Air" }
  - { icon: calculator, label: "Properties" }
  - { icon: chart, label: "Chart" }
---

## What it does

Psychrometrics describes moist air: how much water vapour it holds, when it condenses, and how much energy it carries. It matters in weather, building heating and cooling, greenhouses and plant growth rooms, drying, museums, and health and safety in hot workplaces. Type the air temperature and one humidity value, and the calculator gives all the others, draws the point on a psychrometric chart, and gives two common heat stress indices.

For dry gases at any pressure, use the [[gas-law-calculator]]; for a full profile of the atmosphere, the [[skew-t-sounding|Skew-T sounding plotter]].

## How to use it

1. Choose **°C or °F**.
2. Type the **dry bulb** temperature, the normal air temperature.
3. Choose the second value: **relative humidity**, the **dew point**, or the **wet bulb** temperature from a sling psychrometer.
4. Give the **altitude**, or type the **pressure** if you know it. Pressure matters for the humidity ratio, the wet bulb and the enthalpy. At 1500 m, air pressure is about 85 kPa instead of 101.3.

## What the results mean

- **Dew point:** cool air to this temperature and water starts to condense. Below 0 °C it is the frost point.
- **Wet bulb:** the temperature a wet surface reaches as it evaporates. It is the lower limit for evaporative cooling.
- **Humidity ratio:** grams of water vapour per kilogram of dry air. It is the y axis of the psychrometric chart.
- **Enthalpy:** heat content per kilogram of dry air, used to size heating and cooling.
- **Vapour pressure deficit (VPD):** how strongly the air dries leaves and products. Growers aim for roughly 0.8 to 1.2 kPa for many crops.
- **Heat index (US National Weather Service):** how hot it feels in the shade, from 27 °C (80 °F) up.
- **Humidex (Environment Canada):** the Canadian equivalent, from the dew point.

## Methods

Saturation pressure uses the Hyland and Wexler equations, as in the ASHRAE Handbook, Fundamentals (2017), chapter 1, over ice below 0 °C and over water above. The wet bulb is found by solving ASHRAE's equation 35 numerically. The heat index uses the NWS Rothfusz regression with its corrections. The humidex uses Environment Canada's formula.

## Worked example

ASHRAE's example air at 40 °C dry bulb and 20 °C wet bulb at sea level has a humidity ratio of 6.40 g/kg, a relative humidity of 14 %, a dew point of 7.4 °C, an enthalpy of 56.7 kJ/kg and a specific volume of 0.896 m³/kg. Room air at 25 °C and 50 % has a dew point of 13.9 °C and a wet bulb of 17.9 °C. At 32.2 °C (90 °F) and 70 %, the heat index is 41 °C (106 °F): danger. At 30 °C with a dew point of 15 °C, the humidex is 34: some discomfort.

## Frequently asked questions

**Can I use this for workplace heat rules?** The heat index and the humidex are guides. Many workplace rules use the WBGT, which also needs radiant heat and wind, so check your local regulator.

**Is anything uploaded?** No. All the calculations happen in your browser.

Plot a series of readings with the [publication plot maker](/science/plot-maker/).
