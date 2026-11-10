---
name: Analog filter designer
num: 623
shelf: science
code: T420
section: electrical-and-electronics
title: "Analog filter designer: Butterworth and Chebyshev Sallen-Key, LC ladder, RC and RL low-pass and high-pass with Bode plot"
summary: "Design a low-pass or high-pass filter of order 1 to 12 with a Butterworth or Chebyshev response, built as unity-gain Sallen-Key op-amp stages, a passive LC ladder, or a single RC or RL. Get every part value, rounded to E-series, the pole frequency and Q of each stage, the order you need for a given cut, and a Bode plot of the exact and rounded designs."
status: live
ads: true
order: 623
icon: curve
works: offline
updated: 2026-11-09
related: [circuit-simulator, resistor-colour-code, impedance-fitter, op-amp-calculator, digital-filter-designer, capacitor-inductor-calculator]
sources:
  - "Butterworth and Chebyshev type I pole formulas, the minimum-order formulas, and doubly terminated ladder g-values (Matthaei, Young and Jones, Microwave Filters, Impedance-Matching Networks and Coupling Structures, 1964; equations only, the values are computed)."
  - "Unity-gain Sallen-Key low-pass and high-pass transfer functions derived from nodal analysis (Sallen and Key, 1955), with the common equal-resistor and equal-capacitor choices."
  - "Checked against SciPy signal.butter, signal.cheby1 (analog), signal.freqs, buttord and cheb1ord; the LC ladders were simulated with the fibub circuit simulator. Example values are made up."
flow:
  - { icon: sliders, label: "Spec" }
  - { icon: calculator, label: "Parts" }
  - { icon: curve, label: "Bode plot" }
  - { icon: download, label: "Save" }
---

## What it does

A filter lets some frequencies through and cuts others. This designer works out the parts for the classic analog filters:

- **Butterworth**: the flattest possible passband, −3 dB at the corner.
- **Chebyshev (type I)**: a steeper cut for the same order, in return for a small ripple in the passband. The corner is where the ripple band ends.
- **Low-pass** or **high-pass**, of **order 1 to 12**. Each order adds 20 dB per decade of cut far from the corner.

You can build it as **Sallen-Key** active stages (one op-amp per two orders, unity gain), a **passive LC ladder** between equal source and load resistances, or a single **RC** or **RL** for a simple first-order filter. Every part is listed exactly and rounded to standard E-series values, and the Bode plot shows both, so you can see whether rounding matters.

Check the op-amp in each stage with the [[op-amp-calculator]], and if your signal is already digital, use the [[digital-filter-designer]] instead.

## How to use it

1. Choose low-pass or high-pass and how to build it.
2. Pick the shape, the order and the corner frequency (use k for kilohertz: 1k, 4.7k).
3. For Sallen-Key, choose a capacitor value you have (10n is a good start for audio); the resistors follow. For an LC ladder, give the source and load resistance (50 Ω for RF, 8 Ω for a speaker).
4. Not sure of the order? Open **What order do I need?**, type the cut you want at some frequency, and press **Use this order**.
5. For passive designs, copy the netlist into the circuit simulator to check it with your own source and load.

## Worked example

The page opens on a **fourth-order Butterworth low-pass at 1 kHz** built from Sallen-Key stages with C = 10 nF. The two stages both have f0 = 1 kHz, with Q = 0.541 and Q = 1.307. For the first stage, C2 = 10 nF, C1 = 4Q²C = 11.72 nF and both resistors are 1/(2Q × 2π × 1 kHz × 10 nF) = 14.7 kΩ. The response is −3 dB at 1 kHz, −24.1 dB at 2 kHz and −80 dB at 10 kHz. Asking for 40 dB at 3 kHz says order 5 is needed.

## Tips

- High-Q stages are sensitive to part tolerance; a Chebyshev with large ripple and high order has very high Q stages.
- Even-order Chebyshev Sallen-Key designs start at 0 dB and ripple up to the ripple value; even-order Chebyshev LC ladders need a load resistance different from the source, which the tool works out.
- For an op-amp stage, pick one whose gain-bandwidth is at least 100 × f0 × Q.

## FAQ

**Why is the LC ladder's gain −6 dB?** The source and load resistances form a 2 : 1 divider. The plot shows the response relative to that.

**Can I make a band-pass?** Put a high-pass and a low-pass in series when the band is wide. Narrow band-pass designs need a different method.

**Are the formulas exact?** For ideal parts, yes. Real op-amps, inductor resistance and capacitor tolerance change the response. For study and planning, not a substitute for professional judgement.
