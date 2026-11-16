---
name: Cooling and insulation
num: 2267
shelf: learn
code: L343
section: school-physics
title: "Cooling and insulation: Leslie cube emission and cooling curves of wrapped beakers"
summary: "Point an infrared detector at the four faces of a Leslie cube, then watch beakers of hot water wrapped in newspaper, bubble wrap and foam cool along their temperature-time graphs."
status: live
ads: false
order: 2267
icon: curve
works: offline
updated: 2026-11-16
related: [heat-conduction, calorimetry-lab, energy-stores]
sources:
  - "Infrared emission depends on surface and temperature (Stefan-Boltzmann form: power per area = emissivity x sigma x (T^4 - Troom^4), T in kelvin) and Newton's law of cooling (T = Troom + (T0 - Troom) e^(-kt)). Serves the GCSE energy practical on thermal insulation and the radiation practical, Ontario heat and thermal energy courses and NGSS HS-PS3-4. Emissivities are approximate textbook-style values: matt black 0.95, shiny black 0.88, matt white 0.90 (white paint is a good emitter of infrared), shiny silver 0.05. Cooling constants (per minute) are fibub's teaching values: bare 0.040, newspaper 0.040/(1 + 0.35 layers), bubble wrap 0.022, foam 0.013, lids x 0.7. Checked in tests/curr-physics.mjs. Drawings are fibub's own."
flow:
  - { icon: target, label: "Detector" }
  - { icon: sliders, label: "Wrap it" }
  - { icon: curve, label: "Cool" }
  - { icon: check, label: "Quiz" }
---

## What it does

Hot objects lose energy in several ways. This page covers two famous school practicals. In the **Leslie cube** a hollow cube filled with hot water has four different faces: matt black, shiny black, matt white and shiny silver. An infrared detector held at the same distance reads how much radiation each face gives out. Dull and dark or white matt surfaces emit well. Shiny silver is a poor emitter.

In the **insulation** practical, beakers of hot water are wrapped in different materials and left to cool while you record the temperature. The graph drops quickly at first and then flattens as the water nears room temperature. Better insulation makes the curve shallower. Go on to [[heat-conduction]], [[calorimetry-lab]] and [[energy-stores]] for related ideas.

## How to use it

1. In Leslie cube, choose a face and move the temperature slider. Read the detector value and compare faces in the bar chart.
2. Switch to Insulation. The beakers start at 90 °C and cool as time runs.
3. Set the layers of newspaper, tick the lids, and change the speed. Restart to run again.
4. Use Jump to 60 min to see the end of the run.
5. Read the temperatures and the time to reach 50 °C under the graph, then answer the quiz.

## What each setting does

- **Water temperature (cube):** hotter faces give out more infrared, roughly with the fourth power of the kelvin temperature.
- **Face:** the surface the detector points at. Its emissivity is shown, and it is approximate.
- **Layers of newspaper:** each layer traps more air and lowers the cooling rate.
- **Lids:** reduce evaporation and air currents, so cooling slows.
- **Speed:** how many minutes of simulated time pass each second.

## Worked example

A bare beaker starts at 90 °C in a 20 °C room with k = 0.040 per minute. After 30 minutes T = 20 + 70 e^(−1.2) = 20 + 70 × 0.301 = 41.1 °C. Its half-time is ln 2 ÷ 0.040 = 17.3 minutes, so after 17.3 minutes it is at 55 °C, halfway between 90 and 20. A matt black cube face at 100 °C reads 100 on the detector, so a shiny silver face reads about 100 × 0.05 ÷ 0.95 = 5.

## FAQs

**Why is matt white nearly as good as matt black?** Colour you see is about visible light. For infrared, most paints behave alike, so white matt paint emits almost as well as black.

**Why does cooling slow down?** The rate of heat loss depends on the temperature difference from the room, which shrinks as the water cools.

**Does the water ever reach exactly room temperature?** In this model it only gets closer and closer, as the curve levels off.
