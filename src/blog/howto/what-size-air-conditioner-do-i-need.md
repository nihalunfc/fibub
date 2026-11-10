---
title: "What size air conditioner do I need for my room? (BTU worked out)"
summary: "Look up the room's floor area in the ENERGY STAR sizing chart, then adjust for sun, extra people, a kitchen and a tall ceiling. A 22.5 m² living room worked through in BTU/h, kW and tons."
tools: [ac-size-calculator, hvac-room-load, electricity-cost]
updated: 2026-11-10
sources:
  - "ENERGY STAR, Properly Sized Room Air Conditioners (energystar.gov, as used by the fibub AC size calculator, checked 2026-11-10): floor-area bands, 10% less for heavy shade, 10% more for strong sun, 600 BTU/h per extra person over two, 4,000 BTU/h for a kitchen. Check the official source."
  - "Scaling for ceilings above 8 ft and the 100 W/m² heating figure are rules of thumb used by the calculator. 1 W = 3.41214 BTU/h; 1 ton of cooling = 12,000 BTU/h; 1 sq ft = 0.09290304 m²."
  - "Example numbers checked with node, using the same formulas as the fibub AC size calculator."
---

A room air conditioner is sized from the floor area first, using a chart that gives the cooling power in BTU per hour (BTU/h, British thermal units per hour) for each band of room size, and then nudged up or down for sun, people and heat sources. The [[ac-size-calculator]] looks up the band, applies the adjustments, converts the answer to kilowatts and tons, and names the next common unit size to shop for.

## What you need

- **The floor area of the room**, in square feet or square metres. Length times width is enough for a rectangle.
- **The ceiling height**, if it is taller than an ordinary 8 ft (about 2.44 m) ceiling.
- **How sunny the room is.** A room with big west- or south-facing windows (north-facing in the southern hemisphere) gains far more heat than one shaded by trees or a building.
- **How many people usually use it**, and whether it is a kitchen, since cooking adds a lot of heat.
- A rough idea of the insulation: old single glazing and no loft insulation count as poor.

## Step by step

The calculation the tool follows is:

**Cooling = chart value × ceiling factor × sun factor × insulation factor + 600 × (people − 2) + kitchen extra**

- The **chart value** comes from the ENERGY STAR band the area falls into. For example, 150 to 250 sq ft is 6,000 BTU/h and 250 to 300 sq ft is 7,000 BTU/h.
- The **ceiling factor** is ceiling height ÷ 8 ft when the ceiling is higher than 8 ft, because there is more air to cool. Otherwise it is 1.
- The **sun factor** is 0.9 for a heavily shaded room and 1.1 for a very sunny one. The **insulation factor** is 1.1 for poor and 0.9 for good.
- Each person beyond two adds 600 BTU/h, and a kitchen adds 4,000 BTU/h.

To convert the answer, divide BTU/h by 3,412 for kilowatts and by 12,000 for tons.

With the calculator:

1. In **Units**, choose feet or metres. The area and height you already typed are converted for you.
2. Type the **Room area** and the **Ceiling height**.
3. Set **Sun** and **Insulation** from their drop-down lists.
4. Type how many **People who usually use the room**. The 600 BTU/h figure for each extra person sits in its own box and can be changed.
5. Tick **The room is a kitchen** if it is one.
6. Read the result: the chart band, the cooling in BTU/h, the same in kW and tons, and the next common unit size. The heating box underneath gives a rough heater size from watts per square metre.

## A worked example

A living room is 5 m by 4.5 m with a 2.7 m ceiling. It faces the afternoon sun, insulation is average, and three people usually sit in it in the evening.

1. Area: 5 × 4.5 = **22.5 m²**, which is 22.5 ÷ 0.0929 = **242 sq ft**.
2. Chart band: 150 to 250 sq ft, so **6,000 BTU/h**.
3. Ceiling: 2.7 m is 8.86 ft, so the factor is 8.86 ÷ 8 = **1.107**. 6,000 × 1.107 = 6,644 BTU/h.
4. Very sunny: × 1.1 = 7,308 BTU/h.
5. One person over two: + 600 = about **7,908 BTU/h**.
6. In other units: 7,908 ÷ 3,412 = **2.32 kW**, and 7,908 ÷ 12,000 = **0.66 tons**.
7. The next common unit size is **8,000 BTU/h**.

For winter, at the rough rule of 100 W per square metre, the same room needs about 22.5 × 100 = **2.25 kW** of heating.

Once you have picked a unit, the [[electricity-cost]] calculator shows what it costs to run from its watts and your price per kWh. For a room with large windows or unusual walls, [[hvac-room-load]] builds the load up surface by surface instead of from a chart.

## Check your answer

- **The 20 BTU per square foot shortcut.** 242 sq ft × 20 = 4,844 BTU/h. The chart starts higher than this for small rooms, and our sun, ceiling and people adjustments push the answer up further, so landing between 6,000 and 8,000 is sensible.
- **kW sense check.** Most window and small split units for a single room are between about 1.5 and 3.5 kW of cooling. If your answer is 20 kW for a bedroom, the area was probably typed in square feet with the units set to metres.
- **Go up, not far up.** Choose the next size above your figure. A unit much bigger than needed reaches the set temperature quickly and switches off before it has pulled moisture out of the air, so the room feels cool but clammy.

## Questions people ask

**Is BTU the same as BTU/h?** On air conditioner labels, "BTU" almost always means BTU per hour, a rate of cooling. A 12,000 BTU unit removes 12,000 BTU of heat each hour.

**What does "one ton" of cooling mean?** It is 12,000 BTU/h, the cooling from melting one ton of ice over a day. A "1.5 ton" split unit is 18,000 BTU/h.

**Does an open-plan room count as one room?** Yes, add up the whole open area. If it joins a kitchen, tick the kitchen box too, and above 2,500 sq ft ask a professional for a full load calculation.
