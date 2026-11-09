---
name: Phasor diagram and LCR circuit
num: 1046
shelf: learn
section: school-physics
title: "Series LCR circuit: rotating phasors, impedance triangle, resonance curve, Q factor and power factor"
summary: "Slide R, L, C and the frequency of a series LCR circuit and watch the phasors turn: V_R in step with the current, V_L ahead by 90°, V_C behind by 90°. See the impedance triangle, the phase angle, the power factor and the rms current, and find resonance on the current-against-frequency curve with its Q factor and bandwidth."
status: live
ads: false
order: 1046
icon: orbit
works: offline
updated: 2026-11-09
related: [faraday-induction, circuit-simulator, capacitor-inductor-calculator]
sources:
  - "Series LCR circuit: X_L = 2πfL, X_C = 1/(2πfC), Z = √(R² + (X_L − X_C)²), tan φ = (X_L − X_C)/R, P = V I cos φ, f₀ = 1/(2π√LC), Q = (1/R)√(L/C), half-power frequencies from the exact quadratic, rms = peak/√2: standard physics results."
  - "Checked against an independent NumPy script using complex impedance, and a brute-force frequency scan for the half-power points."
flow:
  - { icon: sliders, label: "Set R, L, C" }
  - { icon: orbit, label: "Phasors" }
  - { icon: chart, label: "Resonance" }
  - { icon: check, label: "Check" }
---

## What it does

In an AC circuit the voltages across a resistor, an inductor and a capacitor do not peak at the same moment, so you cannot just add them up. A **phasor diagram** shows them as arrows turning round together: the voltage across the resistor, V_R, points the same way as the current; the voltage across the inductor, V_L, is a quarter turn (90°) ahead; the voltage across the capacitor, V_C, is a quarter turn behind. The supply voltage is the arrow sum of the three.

This page draws those phasors turning, the **impedance triangle** (R along the bottom, the net reactance X_L − X_C up or down, the impedance Z along the slope), and the **resonance curve**: the current at every frequency from 10 Hz to 1 kHz, with your frequency marked. Every number is worked out as you slide R, L, C and f: the reactances, the impedance, the rms and peak current, the phase angle, the power factor and the average power, and the resonant frequency, Q factor and bandwidth.

It follows the alternating current chapter of Class 12 Physics (AC through R, L and C, phasors, the series LCR circuit, resonance and sharpness, power in AC circuits and the power factor). Before this, see where the AC comes from in [[faraday-induction]]; to sweep bigger circuits and see Bode plots, go on to the [[circuit-simulator]].

## How to use it

1. Slide **R** (1 to 100 Ω), **L** (10 to 500 mH) and **C** (1 to 100 µF).
2. Slide the **frequency**. The slider is logarithmic, from 10 Hz to 1000 Hz, so both ends are easy to reach.
3. Pick a **supply** of 10 V or 230 V rms.
4. Tap **Go to resonance** to jump to f₀, and **Pause** or **Play** to stop the phasors turning.
5. Read the line under the phasors: the current, and whether it leads or lags the supply voltage.

## Worked example

The page starts with R = 20 Ω, L = 100 mH, C = 10 µF on a 10 V rms supply at 50 Hz.

- X_L = 2π × 50 × 0.1 = 31.4 Ω and X_C = 1 / (2π × 50 × 10 × 10⁻⁶) = 318 Ω.
- Z = √(20² + (31.4 − 318)²) = 288 Ω, so I = 10 / 288 = 34.8 mA rms.
- tan φ = (31.4 − 318) / 20, so φ = −86°: the circuit is mostly capacitive and the current leads the voltage by 86°. The power factor is cos φ = 0.0695, and the average power is only 24.2 mW.
- Resonance is at f₀ = 1 / (2π √(0.1 × 10 × 10⁻⁶)) = 159 Hz. There Z = R = 20 Ω and the current is 500 mA. Q = (1/20) √(0.1 / 10⁻⁵) = 5, so the bandwidth is 159 / 5 = 31.8 Hz (from 144 Hz to 176 Hz). At resonance V_L and V_C are each 50 V, five times the supply, but they cancel.

## Tips

- Below f₀ the circuit is capacitive (current leads); above f₀ it is inductive (current lags).
- All the average power goes into R: an ideal inductor or capacitor stores energy and gives it back each cycle.
- A low resistance gives a high Q and a sharp peak. Tuning circuits in radios use this.

## FAQ

**Are the values rms or peak?** The voltages and currents shown are rms values, as AC meters read. The peak current is √2 times the rms current and is shown too.

**Why does the current arrow look short?** The current is drawn only to show its direction; its length is not to the same scale as the voltages.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.
