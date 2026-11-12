---
name: 2-stroke mix
num: 2122
shelf: vehicles
code: T949
section: fuel-types
title: "2-stroke fuel mix calculator: petrol to oil ratio"
summary: "Work out how much 2-stroke oil to add to your petrol for a ratio like 50:1, in ml and fluid ounces, or how much petrol goes with the oil you have."
status: live
ads: false
order: 2122
icon: flask
works: offline
updated: 2026-11-12
related: [fuel-cost, unit-converter, octane-guide]
sources:
  - "Oil = petrol / ratio. 1 US gallon = 3.785 L, 1 UK gallon = 4.546 L, 1 US fluid ounce = 29.574 ml. Always use the ratio in your engine's own manual or on the tank. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Ratio" }
  - { icon: flask, label: "Petrol" }
  - { icon: check, label: "Oil" }
---

## What it does

Small two-stroke engines, such as chainsaws, trimmers, some mowers, outboards and older scooters and mopeds, have no separate oil sump, so the oil is mixed into the petrol. The ratio is written as 50:1, meaning 50 parts petrol to 1 part oil. This tool turns that into the amount of oil for your petrol, or the amount of petrol that matches the oil you have.

Fuel quality matters too, so see [[octane-guide]] for the petrol grade, and [[unit-converter]] for other volume units. To cost a tank, use [[fuel-cost]].

## How to use it

1. Pick the ratio from your engine's manual, or choose custom and type the second number.
2. Pick litres, US gallons or UK gallons and type how much petrol you will mix.
3. Read the oil in millilitres and in US fluid ounces.
4. Optional: type the size of your oil bottle cap to see how many capfuls that is.
5. To work the other way, switch to "I have this much oil" and type the oil in millilitres.

## What each setting does

- **Ratio**: petrol to oil. A smaller second number such as 25:1 means more oil.
- **Petrol unit**: litres, US gallons or UK gallons. It follows your country if you open the page from a country page.
- **Cap size (ml)**: the oil the cap holds when filled; look on the bottle.
- **I have this much oil**: gives the petrol amount for a chosen oil volume.

## Worked example

5 litres of petrol at 50:1 needs 5000 / 50 = 100 ml of oil. One US gallon at 50:1 needs 3785 / 50 = 75.7 ml, which is about 2.6 US fluid ounces.

## FAQs

**Which ratio should I use?** The one in your engine's manual or on its tank. Do not guess; too little oil can ruin an engine, and too much makes smoke and fouls the plug.

**How do I mix safely?** Mix in a clean approved fuel can, outdoors, away from flames and sparks. Pour in the oil first, then the petrol, and shake. Label the can and use the mix within a few weeks.

**Can I use this for a four-stroke?** No. Four-stroke engines take plain petrol.
