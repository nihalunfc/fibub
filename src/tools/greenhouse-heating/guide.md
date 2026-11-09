---
name: Greenhouse heating and ventilation calculator
num: 390
shelf: science
section: horticulture-and-plant-breeding
title: "Greenhouse heating and ventilation calculator: heat loss, heater size, fuel use, air changes and fans"
summary: "Work out a greenhouse's heat loss through the cover and air leaks, the heater size you need, the fuel it will burn over a season, and the ventilation needed to keep it cool in full sun: air flow, air changes per minute and number of fans. Nothing is uploaded."
status: live
ads: false
order: 390
icon: calculator
works: offline
updated: 2026-11-09
related: [psychrometric-calculator, et0-calculator, irrigation-scheduler]
sources:
  - "Heat balance from first principles: conduction Q = U A ΔT, air exchange Q = ρ cp V̇ ΔT, dry air density from the ideal gas law (R_d = R / M_air), cp of air 1006 J/(kg K), ISA standard atmosphere for pressure at altitude. Unit conversions are exact definitions."
  - "Checked against an independent Python version of the sums, with air density and heat capacity from CoolProp (real-gas air): heat loss agrees within 0.01 % and ventilation flow within 0.1 %."
  - "Cover U values, fuel energy contents and the example greenhouse are rounded, made-up examples; check your supplier's figures."
flow:
  - { icon: ruler, label: "Size" }
  - { icon: sliders, label: "Cover" }
  - { icon: calculator, label: "Heater" }
  - { icon: chart, label: "Fans" }
---

## What it does

A greenhouse loses heat in two ways: through the cover (glass or plastic) and through air leaking in and out. In summer it has the opposite problem: sunlight heats the air, and fans or vents must swap it for cooler outside air. This calculator does both sums from physics, not from rule-of-thumb tables.

**Heating.** Heat loss = U × cover area × (inside − outside temperature) + air density × heat capacity × volume × air changes per hour ÷ 3600 × (inside − outside). U is how many watts pass through a square metre of cover for each degree of difference. The page gives the heat loss, the share through the cover and through leaks, and the heater size with your safety margin, in kW and BTU/h.

**Fuel over a season.** Heating degree-days add up how far the outside stays below your set point, day by day. Multiply by 24 hours and by the greenhouse's heat loss per degree, divide by the fuel's energy content and the heater's efficiency, and you have the season's fuel use and, with a price, its cost.

**Ventilation.** The sunlight that gets through the cover, minus the share the crop uses to evaporate water, warms the air. To keep the inside only a few degrees above outside, that heat must leave with outside air: flow = heat ÷ (air density × heat capacity × allowed rise). You get the flow in m³/s, m³/h and CFM, the air changes per minute, and the number of fans.

For the humidity and dew point inside, use the [[psychrometric-calculator]]; for the water the crop uses, the [[irrigation-scheduler]].

## How to use it

1. Enter the greenhouse size and pick the cover. The listed U values are rounded examples; type your own if you know it.
2. Enter the inside set point, the coldest outside temperature you design for, how leaky the house is (air changes per hour) and a safety margin.
3. For the season, enter heating degree-days for your site and set point, the fuel, and optionally its price.
4. For ventilation, enter the strongest sunlight, how much the cover lets through, how much the crop uses, the outside temperature and the rise you will accept, and your fan's rated flow.

## Worked example

Press **Use the example**: a made-up house 30 m long, 9.6 m wide, 3 m to the eaves and 4.8 m to the ridge, covered with double inflated film (example U = 4.0). It has 288 m² of floor, 562.5 m² of cover and 1,123.2 m³ of air.

Holding 18 °C when it is −10 °C outside with one air change an hour, it loses 74.8 kW: 63.0 kW (84 %) through the cover and 11.8 kW (16 %) through leaks. With a 10 % margin the heater should be 82.3 kW, about 280,694 BTU/h, or 260 W per m² of floor. Over a season of 3,000 degree-days that is 192,303 kWh of heat, or 21,433 m³ of natural gas at an example 38 MJ/m³ and 85 % efficiency.

In summer sun of 800 W/m², with 70 % getting through and half used by the crop, 80.6 kW warms the air, and 9.0 kW leaves through the cover at a 4 °C rise. Holding the rise to 4 °C with 28 °C outside needs 15.19 m³/s, which is 0.81 air changes a minute, or 2 fans of 35,000 m³/h.

## FAQ

**Why does the ventilation fall so fast as I allow a bigger rise?** The flow is divided by the allowed rise: halving the rise doubles the air you must move.

**Does this include thermal screens or humidity?** No. A screen lowers the effective U value at night; type a lower U to see its effect. The ventilation sum is for sensible heat in dry air.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
