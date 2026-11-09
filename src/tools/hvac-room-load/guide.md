---
name: Room heating and cooling load
num: 663
shelf: science
section: thermal-and-fluid-engineering
title: "Room heating and cooling load calculator: U·A·ΔT, solar gain, ventilation, people and equipment, in W, BTU/h and tons"
summary: "Estimate the peak heating and cooling load of a room from its walls, windows and roof (U-values), sun through the glass, air leakage and ventilation (sensible and latent), and the heat from people, lighting and equipment. Results in watts, BTU per hour and tons of refrigeration, with a breakdown. A simplified estimate, not a full ASHRAE or CIBSE method."
status: live
ads: true
order: 663
icon: calculator
works: offline
updated: 2026-11-09
related: [psychrometric-calculator, steam-tables, pump-system-curve, pipe-network-solver, greenhouse-heating, fume-hood-ventilation, heat-conduction, heat-exchanger-sizing]
sources:
  - "Steady-state fabric loss Q = U × A × ΔT, solar gain through glazing Q = A × SHGC × I, and the sensible and latent loads of outdoor air from mass flow and humidity ratios: standard building services engineering, as set out in textbooks such as McQuiston, Parker and Spitler, Heating, Ventilating and Air Conditioning (methods only)."
  - "Moist air properties from the ASHRAE Handbook, Fundamentals (2017, SI) chapter 1 equations, shared with fibub's psychrometric calculator."
  - "Ranges for U-values, SHGC, sun, air leakage and heat from people are rounded general figures chosen by fibub, labelled as rough; no table from ASHRAE, CIBSE or any code is copied. The example room is made up."
  - "Checked against an independent Python calculation written for the tests."
flow:
  - { icon: ruler, label: "Room" }
  - { icon: sliders, label: "Gains" }
  - { icon: calculator, label: "Loads" }
  - { icon: chart, label: "Breakdown" }
---

## What it does

Before choosing a radiator, heat pump or air conditioner you need the room's **peak load**: how much heat it loses on the coldest design day, and how much heat (and moisture) has to be removed on the hottest. This tool adds up the main parts:

- **Fabric:** heat through each wall, window and roof, U × A × ΔT. For cooling, an extra temperature difference you choose allows for sun-heated walls and roofs.
- **Sun through glass:** area × SHGC × the sunlight falling on it at the peak hour.
- **Outdoor air:** air leaking in (infiltration, in air changes per hour) plus fresh air brought in on purpose (ventilation, L/s). It has to be heated in winter; in summer it brings in both heat (**sensible**) and moisture (**latent**), worked out from the humidity ratios inside and outside.
- **Internal gains:** people (sensible and latent), lighting and equipment.

You get the heating load, and the sensible, latent and total cooling loads, in **watts, kW, BTU/h and tons of refrigeration**, the load per m² of floor, the sensible heat ratio, a bar chart and a breakdown table.

This is a **simplified steady-state estimate**. A full ASHRAE (heat balance, radiant time series) or CIBSE calculation also handles the heat stored in walls and furniture, the time lag before sun on a wall reaches the room, and the sun hour by hour. For study and planning, check important designs with a qualified engineer.

Check the air's humidity and dew point with the [[psychrometric-calculator|psychrometric calculator]], and size the pump for the chilled water with the [[pump-system-curve|pump and system curve tool]].

## How to use it

1. Give the floor area, ceiling height and altitude (thinner air carries less heat).
2. Give the inside temperatures and humidity you want, and the outside design conditions for your town.
3. List each wall, window and roof that faces outside, with its area and U-value. Add the SHGC and sun for glass. Paste from a spreadsheet or open a CSV or Excel file.
4. Give the air leakage, ventilation, people, lighting and equipment, and a safety margin.

## Worked example

A made-up 20 m² office, 2.7 m high, with 10.5 m² of external wall (U 0.35), a 3 m² window (U 1.6, SHGC 0.4, 400 W/m² of sun) and a 20 m² roof (U 0.2). Heating to 21 °C with −10 °C outside, the fabric loses 387 W and the 27.5 L/s of outdoor air 1,151 W; with a 10 % margin the **heating load is 1,691 W** (5,771 BTU/h). Cooling to 24 °C and 50 % RH with 32 °C and 40 % outside, the sun through the window alone adds 480 W. Two people, 200 W of lights and 300 W of equipment bring the **cooling load to 2,048 W**: 1,699 W sensible and 349 W latent, a sensible heat ratio of 0.83, or 6,989 BTU/h (0.582 tons).

## Tips

- Outdoor air is often the biggest heating item in a leaky room. Sealing gaps or using heat recovery cuts it.
- Shade the glass: the sun through a west window can outweigh everything else on a summer afternoon.
- Run the cooling case for the sunniest facade and hour; the peak is not always at noon.

## FAQ

**Why is latent load separate?** An air conditioner must also condense moisture out of the air. A unit sized only for the sensible load will leave the room cool but clammy.

**Should I add the internal gains to heating?** Usually not: a room must still warm up when it is empty and dark. Tick the box only if the gains are always there.
