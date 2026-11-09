---
name: Op-amp circuit calculator
num: 625
shelf: science
section: electrical-and-electronics
title: "Op-amp calculator: inverting, non-inverting, difference, summing, integrator and differentiator gain, bandwidth and clipping"
summary: "Work out the gain of the classic op-amp circuits from their resistors and capacitors, the real bandwidth from the op-amp's gain-bandwidth product, the output swing and clipping on your supply, slew-rate limits, and the common-mode rejection of a difference amplifier, with a Bode plot and the input and output waveforms."
status: live
ads: true
order: 625
icon: calculator
works: offline
updated: 2026-11-09
related: [filter-designer, circuit-simulator, resistor-colour-code]
sources:
  - "Ideal op-amp circuit gains and the feedback-factor model of a single-pole op-amp, closed-loop gain G × Aβ/(1 + Aβ), as in electronics textbooks (for example Horowitz and Hill, The Art of Electronics; Franco, Design with Operational Amplifiers and Analog Integrated Circuits; equations only)."
  - "Full-power bandwidth SR/(2πVpeak) and the difference-amplifier common-mode rejection formulas (standard results)."
  - "Checked against python-control and an independent NumPy node-equation solve. The op-amp figures in the example (1 MHz, 0.5 V/µs) are made up, not from any data sheet."
flow:
  - { icon: sliders, label: "Circuit" }
  - { icon: calculator, label: "Gain" }
  - { icon: curve, label: "Bandwidth" }
  - { icon: chart, label: "Waveform" }
---

## What it does

Op-amps are the building block of analog electronics. Pick one of six classic circuits, type the parts, and the calculator gives:

- **Gain**: −Rf/R1 (inverting), 1 + Rf/R1 (non-inverting), (Rf/R1)(V2 − V1) (difference), −Rf × ΣVi/Ri (summing), and the frequency-dependent gain of the **integrator** and **differentiator**.
- **Bandwidth** from the op-amp's **gain-bandwidth product (GBW)**: the closed-loop −3 dB frequency is about GBW divided by the noise gain 1/β, worked out exactly with a single-pole op-amp model.
- **Output swing and clipping**: the DC and sine output against the supply rails, the largest input that does not clip, and whether the **slew rate** can keep up.
- For the difference amplifier, the **common-mode rejection** caused by mismatched resistors.

The Bode plot compares the ideal circuit with your op-amp, and the waveform shows two periods of the input and the (clipped) output.

## How to use it

1. Choose the circuit; the help line under it says how it is wired.
2. Type resistor values as 10k, 4k7 or 1M, and capacitors as 10n or 100p.
3. Give the op-amp's GBW and slew rate from its data sheet, the supply voltages, and how close the output gets to each rail.
4. Give a DC input and a sine (peak and frequency) to see the output and check for clipping. For the summing amplifier type one DC value per input, comma separated.

## Worked example

The page opens with an **inverting amplifier**, R1 = 10 kΩ and Rf = 100 kΩ: **gain −10 (20 dB)**. The noise gain is 11, so with a 1 MHz op-amp the bandwidth is about 1 MHz ÷ 11 = 90.9 kHz. A 1 V peak sine at 1 kHz gives 10 V peak at the output (9.998 V with the real op-amp). On ±15 V supplies with a 1.5 V swing limit the output can reach ±13.5 V, so there is about 3.5 V to spare and the largest input before clipping is 1.35 V peak. The sine needs 0.0628 V/µs of slew rate against the 0.5 V/µs available; the full-power bandwidth at 10 V peak is 7.96 kHz.

## Tips

- An inverting amplifier with gain −1 has a noise gain of 2, so it has half the bandwidth of a unity-gain buffer.
- A difference amplifier made from 1 % resistors may reject common-mode signals by only about 48 dB at gain 10. Use 0.1 % resistors or a matched network, or an instrumentation amplifier.
- A pure integrator has unlimited DC gain: any offset drives it to a rail. A large resistor across the capacitor fixes that.

## FAQ

**What does the model leave out?** Input offset voltage, bias currents, noise, output current limits and the op-amp's second pole. Check those on the data sheet. For study and planning, not a substitute for professional judgement.

**Why does my differentiator ring?** Its gain rises with frequency until it meets the op-amp's falling gain, where the phase margin is small. A resistor in series with the capacitor limits the high-frequency gain.
