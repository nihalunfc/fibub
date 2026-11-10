---
name: PCB trace
num: 624
shelf: science
section: electrical-and-electronics
title: "PCB trace"
summary: "Work out the minimum PCB trace width for a current and temperature rise with the IPC-2221 formula, with the trace's resistance, voltage drop and heat; and the characteristic impedance, effective permittivity and delay of a microstrip or stripline, or the width for 50 Ω. Millimetres or mils."
status: live
ads: true
order: 624
icon: ruler
works: offline
updated: 2026-11-09
related: [circuit-simulator, filter-designer, link-budget-calculator, skin-depth-calculator, smith-chart, op-amp-calculator]
sources:
  - "Trace current capacity: the curve-fit formula for the IPC-2221 design chart, I = k ΔT^0.44 A^0.725 (as widely published; the formula only, no chart data)."
  - "Microstrip: Hammerstad, E. and Jensen, O. (1980), Accurate models for microstrip computer-aided design, IEEE MTT-S Digest, with their strip-thickness correction. Stripline: Wheeler, H. A. (1978), Transmission-line properties of a strip line between parallel planes, IEEE Trans. MTT 26 (equations only)."
  - "Copper resistivity 1.724 × 10⁻⁸ Ω·m and temperature coefficient 0.00393 per °C (annealed copper, a general fact)."
  - "Checked against an independent 2-D finite-volume field solve in SciPy and the exact stripline formula. Example values are made up."
flow:
  - { icon: calculator, label: "Current" }
  - { icon: ruler, label: "Width" }
  - { icon: sliders, label: "Stack-up" }
  - { icon: chart, label: "Impedance" }
---

## What it does

Two everyday sums for circuit board layout:

- **Trace width for current.** A copper trace heats up as current flows. The tool gives the narrowest trace that stays within your chosen temperature rise, using the formula fitted to the IPC-2221 design chart, then the trace's resistance, voltage drop and heat over its length.
- **Impedance.** Fast signals (USB, Ethernet, RF, fast clocks) need traces of a set characteristic impedance, often 50 Ω single-ended. Give the stack-up and width to get Z0, or the impedance to get the width, for a **microstrip** (outer layer over a plane) or a **stripline** (inner layer centred between two planes).

These formulas are approximations. They are good for planning and checking, but for a board that must hit an impedance, ask the board maker to calculate it with their field solver and real materials. For study and planning, not a substitute for professional judgement.

Simulate the circuit before you lay it out with the [[circuit-simulator]], and match an RF trace to its load on the [[smith-chart]].

## How to use it

1. Choose millimetres or mils. Values already typed are converted when you switch.
2. For current: give the current, the temperature rise you accept (10 °C is a common, cautious choice), the copper weight and whether the trace is on an outer or inner layer. Add the length to see resistance and drop.
3. For impedance: pick microstrip or stripline, the dielectric height (to the plane for microstrip; between the two planes for stripline), the board εr and either the width or the impedance you want.

## Worked example

A made-up 2 A supply trace on an outer layer with 1 oz copper and a 10 °C rise needs **at least 0.786 mm (31 mil)**, a cross-section of 42.4 mil². Over 50 mm it has about 33.4 mΩ at 35 °C, so it drops about 67 mV and makes about 133 mW of heat. The same current on an inner layer needs about 2.05 mm.

A microstrip 0.35 mm wide on 0.2 mm of dielectric with εr 4.2 and 1 oz copper is **Z0 = 51.2 Ω**, with an effective εr of 3.05 and a delay of 5.83 ps/mm. For exactly 50 Ω it should be 0.366 mm wide.

## FAQ

**Why is the inner layer so much wider?** Inside the board the heat must pass through the laminate; the IPC chart halves the current for the same cross-section, so the area grows by about 2.6 times.

**How accurate is the IPC-2221 formula?** It is based on old measurements of single traces and is usually cautious. Wide copper pours, planes underneath and airflow let traces carry more; a crowded board in a box carries less. IPC-2152 has newer, more detailed charts.

**Does solder mask change the impedance?** Yes, usually by lowering microstrip Z0 by 1 to 3 Ω. The formula here ignores solder mask, frequency dependence and copper roughness.
