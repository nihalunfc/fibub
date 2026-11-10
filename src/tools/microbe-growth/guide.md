---
name: Microbe growth simulator
num: 1213
shelf: learn
code: L99
section: school-biology
title: "Microbe growth simulator: bacteria doubling, and why fridges, pickling, jam and boiling keep food safe"
summary: "Watch microbes double every few minutes in warm food, then cool them in a fridge, salt them like a pickle, sugar them like jam or boil them. Yeast puffs up dough and curd bacteria sour milk. A teaching model with made-up numbers."
status: live
ads: false
order: 1213
icon: chart
works: offline
updated: 2026-11-09
related: [virtual-microscope, cell-doubling-time, osmosis-lab, decay-dice]
sources:
  - "Exponential growth by doubling, N = N₀ × 2^(t/td) = N₀ e^(kt) with k = ln 2 / td, and logistic levelling off: standard school biology and maths."
  - "Temperature effect: the cardinal temperature model with inflection, Rosso L., Lobry J. R., Flandrois J. P. (1993), Journal of Theoretical Biology 162, 447–463 (the formula only). Heat death with a decimal reduction time and z-value: standard food science. All temperatures, doubling times and limits on the page are rounded, made-up values for a typical microbe, not data for a real species."
  - "Checked against an independent Python implementation of the same model, written for the tests."
flow:
  - { icon: flask, label: "Microbe" }
  - { icon: sliders, label: "Conditions" }
  - { icon: clock, label: "Time" }
  - { icon: chart, label: "Count" }
---

## What it does

Bacteria and yeast multiply by splitting in two. When it is warm and there is food and water, a microbe can **double every 20 minutes or so**, so 100 microbes become thousands in a few hours and millions by the next day. This page shows that growth on a dish of dots and on a graph. Change the **temperature**, add **salt** or **sugar**, and move the **time** slider to see how each one speeds growth up, slows it down or stops it. Heat above about 55 °C kills microbes instead, and boiling kills them in a minute or two. Choose **yeast in dough** to see the dough puff up with carbon dioxide gas, or **curd bacteria** to see milk turn sour as its pH falls.

It follows the school topics Class 8 Science, the invisible living world (microorganisms, useful and harmful microbes, food preservation) and the exponential growth that comes up again in Class 9 to 12 maths and biology. Look at microbes themselves in the [[virtual-microscope]], see why salt and sugar draw water out of cells in the [[osmosis-lab]], and compare growth with decay in [[decay-dice]].

## How to use it

1. Pick a **microbe**: bacteria in cooked food, curd bacteria in milk, or yeast in dough.
2. Press a ready-made setting (**Fridge**, **Warm kitchen**, **Pickle**, **Jam**, **Boiling**) or move the sliders yourself.
3. Move the **time** slider (up to 12 hours). The dish fills with dots as the count grows; each extra dot means more microbes on a "times ten" scale.
4. Read the count, the doubling time and the sum N = N₀ × 2^(t ÷ td) under the dish.

The **Level** switch (Class 9 and up) draws the graph on a log scale (steady doubling becomes a straight line) and adds the number of doublings and the growth rate k = ln 2 ÷ doubling time.

## Worked example

Bacteria in cooked food at 30 °C double about every 24.7 minutes in this model. After 4 hours (240 minutes) that is 240 ÷ 24.7 = 9.7 doublings, so 100 × 2^9.7 ≈ 84,000 microbes; the page shows 84,038. In the fridge at 4 °C the same food still has 100 after 4 hours. With 12 % salt (a pickle) or 65 % sugar (jam) growth stops altogether. At 100 °C every microbe is dead within the first minute.

Curd bacteria at 40 °C double every 60 minutes, so after 12 hours 100 become about 409,000 (12 doublings would give 409,600; the model slows a tiny bit as food runs out).

## Check yourself

Five fresh questions on doubling, the number of doublings, time to reach 1,000, and why fridges, salt and sugar keep food. Nothing is saved.

## Tips

- Doubling is fast: ten doublings multiply by about 1,000, twenty by about a million.
- A fridge slows microbes down but does not kill them. Food left out warms up and they start again.
- Real microbes differ a lot. Some grow in the cold or in salty food, and some make toxins that boiling does not destroy.

## FAQ

**Can I use this to decide if food is safe?** No. It is a teaching model with made-up numbers. Follow food safety advice from your local health authority.

**Why does growth level off?** Food and space run out, and waste builds up. The model levels off near 1,000 million.

**Is this from NCERT?** No. It is an independent study aid that follows the same school topics, with its own model and numbers.
