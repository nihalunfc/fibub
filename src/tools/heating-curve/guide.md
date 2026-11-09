---
name: Heating curve of water
num: 1065
shelf: learn
section: school-physics
title: "Heating curve of water: why the temperature stops while ice melts and water boils, latent heat, Q = mcΔT, and mixing"
summary: "Heat ice at a steady rate and watch the temperature climb, stop while it melts, climb again and stop while it boils. See the heat and time for each stage, and use the mixer to find the final temperature when hot and cold things, or ice and water, are mixed."
status: live
ads: false
order: 1065
icon: chart
works: offline
updated: 2026-11-09
related: [states-of-matter, phase-diagram-calculator, heat-engine-cycles]
sources:
  - "Heat for a temperature change Q = mcΔT, latent heat Q = mL, power P = Q/t, and the principle of calorimetry (heat lost = heat gained): standard physics."
  - "Rounded school values: specific heat of ice 2,100, water 4,200 and steam 2,000 J/(kg K); latent heat of fusion 3.34 × 10⁵ J/kg and of vaporisation 2.26 × 10⁶ J/kg; metals iron about 450, copper about 385 and aluminium about 900 J/(kg K)."
  - "Checked against hand working in Python written for the tests."
flow:
  - { icon: sliders, label: "Set heater" }
  - { icon: chart, label: "Curve" }
  - { icon: calculator, label: "Mix" }
  - { icon: check, label: "Check" }
---

## What it does

Put ice from the freezer on a steady heater and measure its temperature. It rises, then **stops at 0 °C** for a long time while the ice melts, rises again, then **stops at 100 °C** for even longer while the water boils, and only then does the steam get hotter. The flat parts are where the heat goes into pulling the particles apart instead of making them move faster: that hidden heat is called **latent heat**. This page plays the whole heating curve, with a beaker that melts and boils as the graph is drawn, and a table of the heat and time for each stage. A second card is a **mixer**: drop hot water, a metal ball or ice into a cup of water and find the final temperature.

It follows the school topics on heat: Class 9 Science, Matter in Our Surroundings (change of state, latent heat of fusion and vaporisation), and Class 11 Physics, Thermal Properties of Matter (specific heat capacity, calorimetry, change of state, latent heat). Before this, try [[states-of-matter]] for the particle picture; afterwards, [[phase-diagram-calculator]] shows melting and boiling at other pressures and [[heat-engine-cycles]] turns heat into work.

## How to use it

1. Set the **mass of ice**, the **heater power** and the **starting temperature** of the ice.
2. Watch the curve draw itself (the whole heating plays in about 24 seconds). **Pause** to stop at a moment; **Start again** goes back to the start.
3. Read the **table**: the heat each stage needs and how long it takes at your heater power, with the formula used.
4. In the **mixer**, choose what you drop in, its mass and temperature, and the mass and temperature of the water in the cup. The final temperature is shown with the working.

## Worked example

With the page as it opens: 0.5 kg of ice at −20 °C on a 500 W heater, heated to 120 °C.

- Ice warms from −20 °C to 0 °C: Q = mcΔT = 0.5 × 2,100 × 20 = 21 kJ, taking 42 s.
- Ice melts: Q = mL = 0.5 × 3.34 × 10⁵ = 167 kJ, taking 334 s (5.57 min).
- Water warms from 0 °C to 100 °C: 0.5 × 4,200 × 100 = 210 kJ, 7 min.
- Water boils: 0.5 × 2.26 × 10⁶ = 1,130 kJ, 37.7 min.
- Steam warms to 120 °C: 0.5 × 2,000 × 20 = 20 kJ, 40 s.

In all, 1,548 kJ in 51.6 min. In the mixer, 0.2 kg of water at 80 °C and 0.3 kg at 20 °C end at (0.2 × 80 + 0.3 × 20) / 0.5 = 44.0 °C. Drop 50 g of ice into 0.2 kg of water at 50 °C: the water can give 42 kJ, melting needs 16.7 kJ, and the 25.3 kJ left warms all 0.25 kg to 24.1 °C.

## Check yourself

Five questions with fresh numbers: heat to warm water, heat to melt ice, how long a heater takes to melt ice, the final temperature of a mixture, and what happens to the temperature while ice melts. Nothing is saved.

## Tips

- Steeper lines mean less heat per degree. Water's line is the least steep: water has a large specific heat, which is why the sea warms up slowly.
- Steam at 100 °C burns worse than water at 100 °C because it gives up its latent heat as it condenses on your skin.
- Real experiments lose heat to the air and the container, so measured times are longer than the page shows.

## FAQ

**Why is boiling so much longer than melting?** Turning liquid into gas pulls particles completely apart, which takes about 7 times as much energy per kilogram as loosening them from the solid.

**Why does the mixer stop at 0 °C sometimes?** If the warm water cannot supply enough heat to melt all the ice, the mixture stays at 0 °C with ice left over.

**Is this from NCERT?** No. It is an independent study aid that follows the same school topics, with its own pictures and numbers.
