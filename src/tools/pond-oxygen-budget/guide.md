---
name: Pond oxygen budget estimator
num: 402
shelf: science
section: aquaculture
title: "Pond oxygen budget: DO saturation, night-time oxygen drop and aeration needed by dawn"
summary: "Work out dissolved oxygen saturation from temperature, salinity and altitude, then follow a fish pond's oxygen from dusk to dawn with your own fish, plankton and sediment rates and surface reaeration, and see how much aeration keeps the DO above your chosen minimum. Nothing is uploaded."
status: live
ads: true
order: 402
icon: chart
works: offline
updated: 2026-11-09
related: [stocking-density-calculator, water-quality-index, activated-sludge, dissolved-oxygen]
sources:
  - "DO saturation: Benson, B. B. and Krause, D. (1984), The concentration and isotopic fractionation of oxygen dissolved in freshwater and seawater in equilibrium with the atmosphere, Limnology and Oceanography 29, 620–632, with their pressure correction, in the form used by Standard Methods and the USGS (formulas only)."
  - "Air pressure from altitude: the international standard atmosphere."
  - "Night balance dC/dt = (K_L/depth)·(Cs − C) − respiration + aeration, a standard single-box oxygen budget, solved exactly."
  - "Checked against the published saturation values at 0, 20, 25 and 30 °C (14.621, 9.092, 8.263 and 7.559 mg/L), an independent Python version of Garcia and Gordon (1992) (within 0.03 %), and the night curve, time to the minimum and aeration needed against scipy solve_ivp and brentq. The example rates are made-up round numbers, not measurements."
flow:
  - { icon: flask, label: "Saturation" }
  - { icon: moon, label: "Night" }
  - { icon: curve, label: "DO curve" }
  - { icon: target, label: "Aeration" }
---

## What it does

In a fish pond, plants and plankton make oxygen in daylight, but at night everything only uses it. The dissolved oxygen (DO) falls from dusk until dawn, and the lowest point, just before sunrise, is when fish suffer or die. This estimator helps you plan for that night:

- **DO saturation**: the most oxygen the water holds in balance with the air, from temperature, salinity and altitude, using the Benson and Krause equations used by Standard Methods and the USGS.
- **Night budget**: oxygen used by the fish, by plankton and bacteria in the water, and by the pond bottom (sediment), minus the oxygen that diffuses in through the surface and any aeration already running.
- **Aeration needed**: the extra oxygen per hour that keeps the DO at or above your chosen minimum at dawn, in kg O₂ per hour and, if you give your aerator's field transfer rate, in kW.

Set the stocking that the oxygen can carry with the [[stocking-density-calculator]], and score the pond water with the [[water-quality-index]].

## How to use it

1. Type the water temperature, salinity (0 for fresh water) and altitude. The saturation appears at once.
2. Give the pond's water surface area and mean depth, the DO you measured at dusk, the hours until dawn and the lowest DO you accept.
3. Give your oxygen use rates: fish biomass and oxygen use per kg of fish per hour, water-column respiration in mg/L per hour, and sediment demand in g O₂ per m² per day. Your extension service, a textbook or your own dusk and dawn readings can give these; there are no built-in values.
4. Give the surface transfer velocity K<sub>L</sub> (higher on windy nights) and any aeration already running, as oxygen actually delivered to the water.
5. Read the DO at dawn, when it falls to your minimum, and the extra aeration needed. The figure shows the night with and without that aeration.

## Worked example

Press **Use the example** (made-up round numbers). At 28 °C in fresh water at sea level, saturation is 7.83 mg/L. The pond is 5000 m² and 1.2 m deep (6000 m³), with 6000 kg of fish using 300 mg O₂/kg/h, water-column use of 0.3 mg/L/h and a sediment demand of 1 g/m²/day: in all 0.635 mg/L per hour (fish 0.3, water 0.3, sediment 0.0347).

From 9 mg/L at dusk (115 % of saturation) the DO falls to **2.23 mg/L** after 11 hours, crossing 3 mg/L after 9 h 41 min. To keep it at 3 mg/L at dawn, the pond needs about **0.442 kg O₂ per hour** of extra aeration (0.0737 mg/L per hour), roughly 0.442 kW for an aerator delivering 1 kg O₂ per kWh in the field.

## Tips

- Night respiration rises with temperature and with a heavy plankton bloom; cloudy days leave less oxygen at dusk.
- Aerator ratings are measured in clean water at zero DO; in a pond at night they deliver less. Use a field figure.
- Measure DO before dawn on the worst nights to check the estimate.

## FAQ

**Why is DO at dusk above 100 %?** Plankton photosynthesis can supersaturate the water in the afternoon; the extra escapes to the air at night, which the model includes.

**Is my data uploaded?** No. Everything runs in your browser and works offline. This is a planning estimate, not a substitute for measuring DO.
