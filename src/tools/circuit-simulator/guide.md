---
name: Circuit simulator
num: 621
shelf: science
section: electrical-and-electronics
title: "Circuit simulator online: SPICE-style DC, AC (Bode plot) and transient analysis of RLC circuits in your browser"
summary: "Type or paste a SPICE-style netlist of resistors, capacitors, inductors and voltage or current sources, then get the DC operating point, an AC sweep with the Bode magnitude and phase at any node, or the voltage against time with pulse, sine or piecewise sources. Nothing is uploaded."
status: live
ads: true
order: 621
icon: chart
works: offline
updated: 2026-11-09
related: [impedance-fitter, wave-calculator, uncertainty-calculator, resistor-colour-code, filter-designer, op-amp-calculator, led-resistor-calculator, capacitor-inductor-calculator, oscilloscope-viewer]
sources:
  - "Modified nodal analysis, the trapezoidal rule and backward Euler companion models, and the PULSE, SIN and PWL source conventions as described in circuit simulation textbooks (for example Vlach and Singhal, Computer Methods for Circuit Analysis and Design) and the public Berkeley SPICE documentation (method only; no code copied)."
  - "Checked against an independent NumPy nodal solve, the analytic transfer functions of RC and series RLC circuits, and SciPy solve_ivp on the circuits' differential equations with the same sources."
  - "The example circuits are made up for this tool."
flow:
  - { icon: pencil, label: "Netlist" }
  - { icon: sliders, label: "Analysis" }
  - { icon: curve, label: "Bode/time" }
  - { icon: download, label: "Save" }
---

## What it does

This is a small circuit simulator in the style of SPICE, for **linear circuits**: resistors (R), capacitors (C), inductors (L), and independent voltage (V) and current (I) sources. It builds the circuit equations by **modified nodal analysis** (one equation per node, plus one per voltage source and inductor) and solves them three ways:

- **DC operating point**: every node voltage and every part's current and power, with capacitors open and inductors shorted.
- **AC sweep**: the gain and phase at a node over a range of frequencies, drawn as a **Bode plot**, with the −3 dB points, bandwidth and roll-off.
- **Transient**: the voltage against time when the sources switch on, pulse or oscillate, by the trapezoidal rule or backward Euler.

It is for study and planning, not a substitute for professional judgement. Diodes, transistors and op-amp models are not included.

Read the values off your parts with the [[resistor-colour-code]] first, and design a filter to drop into your circuit with the [[filter-designer|analog filter designer]].

## How to use it

1. Pick an **example** or type a netlist, one part per line: `R1 in out 1k` puts a 1 kΩ resistor between nodes *in* and *out*. Node **0** (or gnd) is ground, and every circuit needs it.
2. Values use SPICE letters: f, p, n, u (micro), m (milli), k, meg, g. So `100n` is 100 nF and `1meg` is 1 MΩ. Note that `m` is milli, not mega.
3. Sources: `V1 in 0 DC 5 AC 1 PULSE(0 5 0 1u 1u 1m 2m)`. **DC** is used for the operating point, **AC** (amplitude and optional phase in degrees) for the sweep, and PULSE (low, high, delay, rise, fall, width, period), SIN (offset, amplitude, frequency, delay, damping, phase) or PWL (time-value pairs) for the transient. A current source `I1 a b 1m` pushes current from a through the source to b.
4. Choose the **analysis** and the **node** to show. For the transient, choose a time step and stop time (such as 10u and 10m) and optionally a second node to compare.
5. Download the data as CSV, or the report as an image, PDF or Word file.

## Worked example

The first example is an RC low-pass filter: a 1 kΩ resistor feeding a 1 µF capacitor. Its corner frequency is 1/(2πRC) = 159.2 Hz. The AC sweep from 1 Hz to 100 kHz shows **−3 dB at 159.2 Hz**, a phase of −45° there, and a slope of −20 dB per decade at the top end. Switch to **Transient** and the 1 V pulse charges the capacitor with a time constant of 1 ms: about 63 % after 1 ms and 99.3 % by 5 ms.

The series RLC example (10 mH, 1 µF, 10 Ω) rings at about 1.59 kHz when the step arrives. Its AC sweep shows −3 dB points near 1.514 kHz and 1.673 kHz, a bandwidth of 159 Hz and Q = 10.

## Tips

- Use a time step at least ten times shorter than the fastest edge or period you care about. Edges shorter than one step are spread over that step.
- The trapezoidal rule is accurate but can ring around sudden steps in circuits with an inductor or a capacitor directly across a source. Backward Euler damps that ringing but also damps real oscillations a little.
- A node joined only through capacitors has no DC level; the simulator ties it to ground through a tiny leak, as SPICE does, and says so.
- Two voltage sources in parallel, or a voltage source shorted by an inductor at DC, cannot be solved: add a small resistor.

## FAQ

**Is this real SPICE?** No. It follows the same netlist style and methods for linear parts, written from scratch in TypeScript. Files from other simulators work if they only use R, C, L, V and I lines; lines starting with a dot (.tran, .ac) are not read.

**How big a circuit can it handle?** Up to 80 nodes and 200,000 time steps, which runs in a moment on a phone.

**Does the AC sweep include the DC level?** No. AC analysis is small-signal: each source gives only its AC amplitude, and the result is the steady sine response at each frequency.
