---
name: Detention pond router
num: 155
shelf: science
section: environmental-engineering
title: "Stormwater detention pond sizing: route a storm through a pond with an orifice and overflow weir, and size the orifice"
summary: "Size a stormwater detention pond. Build the inflow with the modified rational method or paste a hydrograph, set the pond shape, orifice and overflow weir, and route the storm through it. See the peak outflow, how much it is cut, the highest water level, storage used and drain time. The tool can also find the orifice size that meets a target peak outflow."
status: live
ads: true
order: 2
icon: ruler
works: offline
updated: 2026-11-09
related: [unit-hydrograph, rain-gauge-average, landfill-gas, runoff-calculator, manning-weir-calculator, flood-frequency, watershed-delineation]
sources:
  - "Level-pool (storage) routing, the modified rational method, and the orifice and weir equations: standard hydrology and hydraulics textbook methods. Written by fibub; no design-manual tables are copied."
  - "Checked in the tests against SciPy solve_ivp (DOP853, relative tolerance 1e-11) with the same outlet equations, and storage against the integral of the surface area."
  - "The example catchment, rain and pond are made up. Use your local design rainfall and your council's or agency's rules for design."
flow:
  - { icon: curve, label: "Inflow" }
  - { icon: ruler, label: "Pond" }
  - { icon: target, label: "Outlet" }
  - { icon: chart, label: "Outflow" }
---

## What it does

When a field becomes roofs and roads, rain runs off faster and in greater volume, and the stream below gets sharper flood peaks. A **detention pond** catches the runoff and lets it out slowly through a small outlet, so the peak leaving the site is no bigger than before. This tool shows how well a pond does that for one storm.

It **routes** the storm through the pond. At each moment the water in the pond changes by inflow minus outflow, and the outflow depends on how deep the water is. Solving this step by step (level-pool routing, the same idea as the classic Modified Puls method) gives the outflow hydrograph, the highest water level and the storage used.

To build the inflow from a design storm, use the [[unit-hydrograph]]; to turn several rain gauges into one rainfall figure, the [[rain-gauge-average|rain gauge average]] tool.

## How to use it

1. **Inflow.** Either use the **modified rational method**: catchment area, runoff coefficient C, rain intensity, storm duration and time of concentration. Or paste a hydrograph (time in minutes, flow in m³/s) from another model, such as the [unit hydrograph builder](/science/unit-hydrograph/).
2. **Pond.** Bottom length and width, side slope (3 means 3 m across for every 1 m up) and depth to the top of the bank.
3. **Orifice.** Diameter and coefficient (about 0.6 for a sharp-edged hole). It sits at the pond bottom. While the water is below its top it flows like a weir; once covered it flows as an orifice.
4. **Overflow weir.** Crest height, length and coefficient (SI; about 1.7 for a broad crest). It carries the extra flow once the water passes its crest.
5. **Target peak outflow** (optional): often the site's peak flow before development, or a limit from your council. The tool finds the orifice diameter that meets it.

## What you get

- **Peak inflow and outflow**, the percentage cut, and when each happens.
- **Highest water level** and the freeboard below the bank, with a warning if the pond overtops.
- **Most water stored**, as a share of what the pond can hold.
- Whether the **overflow weir** runs, and **how long the pond takes to empty**.
- The **orifice size** for your target, with the water level it gives.
- Charts of the inflow and outflow and of the water level, a stage–storage–outflow table, and CSV, PDF, PNG and Word downloads.

## Worked example

A made-up 12 ha catchment with C = 0.65 gets 60 mm/h of rain for 30 minutes. The time of concentration is 15 minutes, so the inflow peaks at 1.3 m³/s and brings 2,340 m³ of runoff. The pond is 40 × 25 m at the bottom with 3:1 sides and 2 m deep. It has a 300 mm orifice and a 3 m overflow weir at 1.6 m.

- **Peak outflow is 0.219 m³/s, cut by 83 %**, about 28 minutes after the peak inflow.
- The water rises to **1.50 m**, 0.50 m below the bank, storing 1,986 m³ (69 % of the pond). The overflow weir is not reached.
- The pond empties to 1 % of its peak outflow about 5 hours after the storm starts.
- For a target of 0.4 m³/s, a **425 mm orifice** is enough, and the water then peaks at 1.34 m.

## Good practice

- Try several storm durations. A long, gentle storm can fill a pond more than a short, intense one.
- Check the pond also passes a larger storm safely over the overflow weir without overtopping.
- Outlet equations are idealised. Real outlets have trash screens, pipe losses and tailwater from the stream, which can slow the outflow and raise the pond. Your design manual's rules come first.

## FAQs

**Why is the outflow peak later than the inflow peak?** The pond keeps filling as long as more comes in than goes out. The outflow peaks when the two are equal, on the falling side of the inflow.

**Is this the Modified Puls method?** It solves the same storage equation, step by step with a fine time step, so it gives the same answer as a careful Modified Puls table.

**Is my data uploaded?** No. Everything runs in your browser.
