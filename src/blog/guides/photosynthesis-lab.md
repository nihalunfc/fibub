---
title: "Photosynthesis and limiting factors: the pondweed bubble experiment"
summary: "How light, carbon dioxide and temperature set the rate of photosynthesis, why only one factor limits it at a time, and how to run the pondweed experiment on screen."
tools: [photosynthesis-lab, osmosis-lab, photosynthesis-curve-fitter, enzyme-kinetics-fitter]
updated: 2026-11-10
sources:
  - "Blackman, F. F. (1905), Annals of Botany 19: 281-295 (optima and limiting factors)."
  - "Inverse square law for light from a small source: standard physics."
  - "The plant's rates, carbon dioxide cap, optimum temperature and respiration are the tool's own made-up round teaching values, not measurements of a real plant."
---

The photosynthesis lab is an on-screen version of the classic pondweed experiment. A water plant sits under a lamp, and you change how close the lamp is, how much carbon dioxide is in the water and how warm the water is, then count the oxygen bubbles it gives off. It tells you which of the three is holding the rate back and draws graphs of rate against each one. It suits Class 10 and Class 11 students. For how water reaches plant cells in the first place, try the [[osmosis-lab]]; to analyse real light-response readings afterwards, use the [[photosynthesis-curve-fitter]].

## What it is

Plants make sugar from carbon dioxide and water, using energy from light caught by chlorophyll. Oxygen is a by-product:

carbon dioxide + water → glucose + oxygen

Under water, that oxygen leaves the cut stem as bubbles, so the number of bubbles a minute is a rough measure of how fast photosynthesis is going.

Three things set that speed:

- **Light.** Light spreads out as it travels, so its strength falls with the square of the distance from the lamp. In the model, light at distance d (cm) is 100 × (10 ÷ d)² units: 100 units at 10 cm, 25 at 20 cm.
- **Carbon dioxide.** Baking soda (sodium hydrogencarbonate) dissolved in the water releases it. A little is in the water already.
- **Temperature.** The enzymes that build sugar work faster as the water warms, up to a best temperature (30 °C in this model). Above that, heat starts to damage them and the rate falls.

The key idea is the **law of limiting factors**, from the plant scientist Frederick Blackman in 1905. Each factor on its own would allow a certain rate. The plant can only go as fast as the smallest of these. Improving any other factor does nothing until the limiting one is raised.

The bubbles you see are not the whole story. The plant also **respires** all the time, using some oxygen. What you count is the **net rate**: the gross rate of photosynthesis minus respiration. The light level at which the two balance, and no bubbles appear, is the **compensation point**.

## How to use it

1. Choose **Class 10** for the bubble rate and the limiting factor, or **Class 11** to see what each factor allows on its own, respiration and the compensation point.
2. Move the **Lamp distance**, **Carbon dioxide** and **Water temperature** sliders. The bubbles in the picture speed up or slow down (shown four times faster than real life).
3. Press **Count for 1 minute** to add a reading to the results table. Repeat it: counts vary a little, as in a real lab.
4. Pick **Light**, **CO₂** or **Temperature** under **Rate graph** to see how the rate changes along that factor.
5. Download your table as a CSV file, or press **Clear** to start again.
6. Try **Check yourself** and press **Check answers**; **New questions** gives a fresh set.

## A worked example

Set the lamp at **30 cm**, add **0.5 %** baking soda and keep the water at **20 °C**.

- **Light:** 100 × (10 ÷ 30)² = **11.1 units**. In this model each light unit allows 0.6 bubbles a minute, so light allows 0.6 × 11.1 = **6.7 bubbles/min**.
- **Carbon dioxide:** 80 × (0.05 + 0.5) = **44 bubbles/min** (0.05 % is already in the water).
- **Temperature:** at 20 °C the enzymes run at half their best speed, so they allow 50 × 0.5 = **25 bubbles/min**.

The smallest is 6.7, so **light is limiting**. Respiration at 20 °C uses about 1.4 bubbles' worth of oxygen, so you see about **5.3 bubbles a minute**.

Move the lamp to **15 cm**. Light becomes 44.4 units and allows **26.7 bubbles/min**. Now the smallest is temperature, at 25. The net rate is 25 − 1.4 ≈ **23.6 bubbles/min**: more than four times as fast. Adding baking soda would not help now.

Warm the water to **30 °C**. The enzymes now allow 50, so light (26.7) limits again. Respiration has doubled to about 2.8, so you see about **23.8 bubbles a minute**, barely more than before. Warming helped the enzymes, but light caps the rate and respiration ate most of the gain.

At 20 °C the compensation point is about 1.4 ÷ 0.6 ≈ **2.4 light units**, which means a lamp about **65 cm** away. Further than that, no bubbles appear even though photosynthesis is still happening.

## Where it is used

- **Greenhouse growing.** Growers add carbon dioxide, heating and extra lamps, but only the limiting one pays off. The same reasoning decides which to spend money on.
- **Climate science.** How fast crops and forests take up carbon as carbon dioxide and temperature rise depends on which factor limits them.
- **Other sciences.** The idea of a single bottleneck setting the rate also appears in chemistry (the slowest step of a reaction) and in enzyme studies; see [[enzyme-kinetics-fitter]].

## Common mistakes

- **Changing two things at once.** You cannot tell which one made the difference. Change one factor and keep the others fixed.
- **Thinking light falls in a straight line with distance.** Doubling the distance gives a quarter of the light, not a half.
- **Assuming more is always better.** Above 30 °C in this model the rate drops, because the enzymes are damaged.
- **Reading no bubbles as no photosynthesis.** At or below the compensation point respiration uses all the oxygen made.
- **Trusting one count.** Bubbles come at random. Take three counts and use the average.

## Questions people ask

**Is counting bubbles accurate?** Only roughly. Bubbles differ in size, so collecting the gas and measuring its volume is better in a real lab.

**Do the numbers match a real pondweed?** No. They are round teaching values chosen to show the ideas clearly. Real plants differ in their rates and best temperature.
