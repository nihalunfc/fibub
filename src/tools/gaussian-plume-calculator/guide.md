---
name: Gaussian plume calculator
num: 118
shelf: science
section: atmospheric-chemistry-and-air-quality
title: "Gaussian plume calculator: smoke stack dispersion, ground-level concentration and plume rise"
summary: "Estimate how a chimney plume spreads downwind: Pasquill stability class from the wind and sky, Briggs dispersion curves for open country or a city, buoyant plume rise, the highest ground-level concentration and where it lands, and a plan-view map."
status: live
ads: true
order: 2
icon: chart
works: offline
updated: 2026-11-08
related: [air-quality-calculator, psychrometric-calculator, gas-law-calculator]
sources:
  - "Gaussian plume equation with ground reflection and mixing-lid images: standard textbook form (for example Turner's Workbook of Atmospheric Dispersion Estimates, US EPA, a US government work)."
  - "Stability classes from wind and sky: Pasquill (1961) and Turner (1964), as reproduced in US EPA guidance. Checked 2026-11-08."
  - "Dispersion curves σy and σz: Briggs (1973) open-country and urban formulas, as given in US EPA and textbook references. Formulas only; no tables copied."
  - "Wind-profile exponents and plume-rise formulas: US EPA ISC3 model user's guide (Briggs plume rise), a US government work. Checked 2026-11-08."
  - "Worked example written by fibub with made-up numbers."
flow:
  - { icon: sliders, label: "Source" }
  - { icon: compass, label: "Weather" }
  - { icon: chart, label: "Plume" }
  - { icon: target, label: "Receptor" }
---

## What it does

A chimney sends out a steady stream of gas. The wind carries it away, and turbulence spreads it sideways and up and down. The **Gaussian plume model** treats that spread as a bell curve in both directions, widening with distance. Where the lower edge of the plume touches the ground, people breathe it. This tool works out how much, how far away the worst spot is, and how wide the plume is there.

C(x, y, z) = Q / (2π u σy σz) × e^(−y²/2σy²) × [e^(−(z−H)²/2σz²) + e^(−(z+H)²/2σz²)]

Q is the emission rate, u the wind at the stack top, H the effective height (stack plus plume rise), and σy and σz the sideways and vertical spread at distance x. The second exponential is the ground acting as a mirror: gas that reaches the ground bounces back rather than soaking in.

## How to use it

1. Enter the **emission rate** (g/s, kg/h or tonnes a year) and the **stack height**.
2. Enter the **wind at 10 m**, the height weather stations measure it. The tool scales it up to the stack top with the power-law wind profile used in US regulatory models.
3. Pick a **stability class**, or let the tool choose one from the wind and the sky using Pasquill's table. Pairs such as "BC" sit between two classes; the tool then averages the two spreads.
4. Choose **open country** or **city**. Cities stir the air more, so plumes spread faster.
5. Leave **plume rise** on for a hot stack and enter the exit speed, inner diameter and temperatures. Hot gas is buoyant and climbs before it bends over, which raises the effective height and lowers the ground-level peak.
6. Optionally enter a **mixing height**, the lid on the stirred layer of air. Below it the plume is reflected back down; far downwind it becomes well mixed. A plume released above the lid is treated as staying aloft.
7. Pick a gas if you want parts per billion as well as µg/m³, and set a **receptor**: a house or school at some distance downwind, off the centreline and above the ground.

## What you get

- The highest ground-level concentration on the centreline and its distance.
- The concentration at your receptor, with σy and σz there.
- A log-log chart of ground-level concentration against distance.
- A plan-view map of the ground footprint, with the source and receptor marked.
- A table of σy, σz, plume height and ground concentration from 100 m to 20 km.
- PNG, PDF and Word downloads.

## Worked example

A boiler stack 50 m tall gives off 100 g/s of sulfur dioxide. The gas leaves at 15 m/s through a 2 m opening at 147 °C, into air at 15 °C. It is a day of moderate sun with a 4 m/s wind over open country.

Pasquill's table gives class **BC**. The wind at the stack top is about 4.59 m/s. The buoyancy flux is 46.2 m⁴/s³, so the plume rises a further **82.8 m**, reaching its full height about 540 m downwind; the effective height is 132.8 m.

The ground-level peak is **217 µg/m³ (about 83 ppb of SO₂), about 976 m downwind**, and the plume is about 540 m wide there. At a house 2 km downwind on the centreline it is about 117 µg/m³.

Turn plume rise off and pick class D instead: the peak jumps to about 951 µg/m³ only 814 m away. That shows why tall, hot stacks matter.

## Good to know

- This is a **screening** model. It assumes flat ground, a steady wind and no chemistry or deposition. It is not for emergency response or for permits, which need an approved model, local weather records and expert review.
- The results are short averages, roughly 10 minutes to an hour. Longer averages are lower because the wind direction wanders.
- Below about 0.5 m/s the plume does not travel in a straight line, so the tool stops.
- Briggs's curves were fitted from about 100 m to 10 km. The tool still draws beyond that, but treat those values as rough.

## FAQ

**Why is the worst spot not right next to the chimney?** Near the stack the plume is still high and narrow, so it has not reached the ground. Further away it is so spread out that it is dilute. The peak sits in between.

**Why does stable night air give such low values?** A stable layer keeps the plume thin, so it can travel many kilometres before touching down. That is also why fumigation in the morning, when the sun breaks up the night layer, can bring a sudden high reading.

**Can I compare the result with air quality limits?** Roughly. Add the background level, and match the averaging time; then check the official limit. The [air quality calculator](/science/air-quality-calculator/) turns concentrations into AQI values.
