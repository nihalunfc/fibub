---
name: Wind chill and heat index calculator
num: 896
shelf: science
section: meteorology
title: "Wind chill, heat index, humidex and apparent temperature calculator with tables"
summary: "Type the air temperature, humidity and wind and get the wind chill, the US heat index, the Canadian humidex and the apparent temperature, each with the range where it applies and its warning band, plus a table for any range of temperatures. °C or °F; km/h, mph, m/s or knots."
status: live
ads: true
order: 896
icon: calculator
works: offline
updated: 2026-11-09
related: [psychrometric-calculator, skew-t-sounding, station-data-viewer, weather-log, density-altitude, uv-index-estimator]
sources:
  - "Wind chill: the 2001 wind chill temperature index of the Joint Action Group for Temperature Indices (JAG/TI), as used by the US National Weather Service and Environment and Climate Change Canada (government formula). Risk categories: Environment and Climate Change Canada."
  - "Heat index: US National Weather Service method (Steadman's simple formula and the Rothfusz regression with the NWS adjustments) and its caution bands (government formula)."
  - "Humidex: Environment and Climate Change Canada formula from the dew point (government formula)."
  - "Apparent temperature: Steadman, R. G. (1994), Norms of apparent temperature in Australia, Australian Meteorological Magazine 43, 1 to 10, as used by the Australian Bureau of Meteorology."
  - "Formulas checked 2026-11-09 against MetPy 1.7.1 (windchill, heat_index, apparent_temperature, dewpoint). Check the official source for warnings."
flow:
  - { icon: sliders, label: "Weather" }
  - { icon: calculator, label: "Indices" }
  - { icon: table, label: "Table" }
  - { icon: download, label: "Download" }
---

## What it does

The air temperature alone does not say how cold or hot it feels. Wind strips heat from skin, and humid air stops sweat from cooling you. Weather services turn this into "feels like" numbers. This page works out the four in common use, side by side, and shows where each one is meant to be used:

- **Wind chill**: the 2001 wind chill index of the US National Weather Service and Environment Canada. It applies when the air is 10 °C (50 °F) or colder and the wind is over 4.8 km/h (3 mph).
- **Heat index**: the US National Weather Service method. Below about 80 °F it uses Steadman's simple formula; above, the Rothfusz regression, with a correction for very dry air (humidity under 13 %, 80 to 112 °F) and very humid air (over 85 %, 80 to 87 °F). The NWS uses it from 80 °F (26.7 °C) up.
- **Humidex**: Environment Canada's summer index, worked out from the dew point. It has no unit, but reads like °C. Canada uses it in warm weather, from about 20 °C.
- **Apparent temperature**: Steadman's index as the Australian Bureau of Meteorology uses it. It covers any weather and takes temperature, humidity and wind together, in the shade.

The big number is the single "feels like" the US National Weather Service would give: the wind chill when it applies, the heat index from 80 °F, and otherwise the air temperature.

**Not a safety forecast.** The page applies the published formulas to the numbers you type. For warnings and advice, check your national weather service.

Read the temperature and wind from your own station with the [[station-data-viewer]], and note what you felt in the [[weather-log]].

## How to use it

1. Choose **°C or °F** and the **wind unit**. Switching keeps the same weather and converts what you typed.
2. Type the **air temperature**, the **relative humidity** or the **dew point**, and the **wind speed**.
3. The formulas expect the wind at 10 m, where weather stations measure it. If you measured it with a hand-held meter at face height, tick the box: the speed is multiplied by 1.5 first.
4. Read the indices, their warning bands, and the table of where each applies. The chart draws every index against air temperature at your humidity and wind.
5. For a printable chart, use **Table for a range**: pick the index, the temperature range and step, and the wind speeds or humidities for the columns. Cells outside the index's range show a dash. Download it as CSV.

## Worked example

On a winter day at **−10 °C** with **70 %** humidity and a **20 km/h** wind, the page shows:

- Wind chill **−17.9 °C**, moderate risk. That is the big "feels like" number.
- Heat index and humidex: do not apply (too cold).
- Apparent temperature **−17.2 °C**, and the dew point **−14.4 °C**.

On a summer afternoon at **32 °C**, **60 %** and **10 km/h**, the heat index is **37.1 °C** (98.7 °F, extreme caution, from the Rothfusz regression), the humidex **42.5** (great discomfort) and the apparent temperature **35.4 °C**.

## Tips

- Wind chill describes how fast exposed skin cools. It never makes a car engine or a water pipe colder than the air.
- The heat index and apparent temperature are for the shade. Full sun can add several degrees.
- For dew point, wet bulb, enthalpy and a psychrometric chart, use the psychrometric calculator.

## FAQ

**Why do the heat index and the humidex differ?** They are different scales built on different models of the body. The humidex is not a temperature, though it reads like one.

**Why does MetPy give a slightly different heat index near 80 °F?** MetPy switches from the simple formula to the regression when the simple value reaches 79 °F; the NWS switches when the simple value averaged with the temperature reaches 80 °F. This page follows the NWS. Everywhere else the two agree.

**Why is there no wind chill above 10 °C?** The formula was built and tested for cold air only. Above that, use the apparent temperature.
