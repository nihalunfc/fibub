---
name: Heat stress
num: 2260
shelf: science
code: T996
section: meteorology
title: "Heat stress and WBGT calculator for outdoor work and sport"
summary: "Work out the wet-bulb globe temperature (WBGT) from your readings, or estimate it from air temperature and humidity, with the wet-bulb temperature and the white, green, yellow, red or black heat flag."
status: live
ads: true
order: 2260
icon: calculator
works: offline
updated: 2026-11-16
related: [wind-chill-heat-index, uv-index-estimator, temperature-scales]
sources:
  - "WBGT weights: outdoor with sun 0.7 Tnw + 0.2 Tg + 0.1 Ta; indoor or shade 0.7 Tnw + 0.3 Tg (ISO 7243; NIOSH Criteria for a Recommended Standard: Occupational Exposure to Heat and Hot Environments, 2016) (checked 2026-11-16)."
  - "Shade estimate: WBGT = 0.567 Ta + 0.393 e + 3.94, with e = RH/100 x 6.105 x exp(17.27 Ta / (237.7 + Ta)) hPa, the approximation published by the Australian Bureau of Meteorology (checked 2026-11-16)."
  - "Wet-bulb temperature: Stull, R. (2011), Wet-bulb temperature from relative humidity and air temperature, J. Appl. Meteorol. Climatol. 50, 2267-2269 (checked 2026-11-16)."
  - "Flag bands in degrees F (82, 85, 88, 90) follow the US Army heat categories in TB MED 507. The work/rest and water table is in that document and is not copied here: check the official source."
flow:
  - { icon: pencil, label: "Readings" }
  - { icon: calculator, label: "WBGT" }
  - { icon: flag, label: "Flag" }
  - { icon: check, label: "Plan" }
---

## What it does

Hot, humid air makes hard work or sport risky even when the thermometer does not look extreme. The wet-bulb globe temperature (WBGT) combines humidity, sun and air temperature into one number that workplaces and sports bodies use to plan. This tool gets it two ways: from three instrument readings, or as a quick estimate from air temperature and relative humidity.

It also shows the wet-bulb temperature and a heat flag. For planning only, not medical advice; follow your local workplace rules. For feels-like numbers see [[wind-chill-heat-index]], for sun exposure the [[uv-index-estimator]], and to switch units the [[temperature-scales]].

## How to use it

1. Choose **Measured** if you have a natural wet bulb (Tnw), a globe (Tg) and an air thermometer (Ta). Otherwise choose **Estimate**.
2. Pick **°C** or **°F**, then type your readings.
3. For Measured, say whether you are in **sun** or **indoors or shade**.
4. Read the WBGT, the flag and the wet-bulb temperature.

## What each setting does

- **Outdoor with sun**: 0.7 Tnw + 0.2 Tg + 0.1 Ta.
- **Indoors or shade**: 0.7 Tnw + 0.3 Tg.
- **Estimate**: uses only air temperature and humidity, so it does not include sun. Real sun adds to the true WBGT.
- **Flag**: white under 27.8 °C (82 °F), green to 29.4 (85), yellow to 31.1 (88), red to 32.2 (90), black at 32.2 °C or more.

## Worked example

Tnw 25 °C, Tg 40 °C, Ta 32 °C in sun: 0.7 x 25 + 0.2 x 40 + 0.1 x 32 = 17.5 + 8 + 3.2 = 28.7 °C, a green flag. Estimate for 30 °C and 50% humidity: e = 21.14 hPa, so 0.567 x 30 + 0.393 x 21.14 + 3.94 = 29.26 °C, a yellow flag. Stull wet bulb for 20 °C and 50%: 13.7 °C.

## FAQs

**What do the flags mean?** They are the US Army heat categories; the matching work/rest and water table is in TB MED 507, so check the official source.

**Is the estimate accurate?** It is a shade approximation. Use real readings for safety decisions.

**Is anything stored?** No, it all runs on this page.
