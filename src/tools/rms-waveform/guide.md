---
name: RMS waveform
num: 1416
shelf: learn
code: L270
section: school-physics
title: "RMS waveform"
summary: "Pick a waveform and its peak and see v and v² over a cycle, the mean of v² and the root-mean-square value, worked out slice by slice and compared with the exact formula. Learn why India's 230 V mains actually swings up to 325 V, and why the mean of AC is zero but its heating is not."
status: live
ads: false
order: 1416
icon: curve
works: offline
updated: 2026-11-16
related: [lcr-phasors, faraday-induction, transformer-calculator, travelling-wave]
sources:
  - "Root-mean-square value V_rms = √(mean of v²) and the standard results for a sine wave (V₀/√2), square wave (V₀), triangle and sawtooth (V₀/√3), half-wave (V₀/2) and full-wave rectified sine (V₀/√2). Standard mathematics."
  - "India's nominal supply of 230 V at 50 Hz is the standard nominal mains voltage in India; check your local supplier for exact limits."
  - "Checked against an independent NumPy script (mean of v² over 10⁶ samples) and the exact integrals."
  - "The solve card uses the exact factors in the list above, peak-to-peak = 2 × peak for waves that swing both ways (equal to the peak for rectified waves), and P = V_rms²/R. Checked by hand: 230/0.7071 = 325 V, 12 V peak-to-peak sine is 4.24 V rms, a 5 V square wave over 100 Ω gives 0.25 W."
flow:
  - { icon: curve, label: "Pick wave" }
  - { icon: sigma, label: "Square, mean" }
  - { icon: target, label: "RMS" }
  - { icon: check, label: "Check" }
---

## What it does

An alternating voltage keeps changing: a sine wave goes up to a peak V₀, down through zero to −V₀ and back, fifty times a second in India. Its plain average over a cycle is zero, yet it clearly heats a kettle. So we need a better "size" for AC.

Heating in a resistor depends on v²/R, and v² is never negative. Take the mean of v² over a cycle, then the square root, and you get the **root-mean-square** (rms) value. A steady (DC) voltage equal to V_rms would heat the resistor exactly as much. For a sine wave, V_rms = V₀/√2 ≈ 0.707 V₀. That is why the 230 V on the label of Indian mains is an rms value: the voltage actually swings between +325 V and −325 V.

This page draws two cycles of the waveform you choose, its square (shaded), the mean of the square (dashed) and the rms level (green). It adds up the square in 2000 thin slices, takes the square root, and compares it with the exact formula. It also gives the plain mean, the mean of the size |v|, and the power the waveform would deliver into a 100 Ω resistor.

It follows the alternating current chapter of Class 12 Physics (AC voltage applied to a resistor, rms or effective values, power). AC itself comes from a turning coil in [[faraday-induction]]; to see rms values in circuits with L and C use [[lcr-phasors]], and to change AC voltages use the [[transformer-calculator]].

## How to use it

1. Choose a waveform: **Sine**, **Square**, **Triangle**, **Sawtooth**, **Half-wave** (only the positive halves of a sine) or **Full-wave** (the negative halves flipped up).
2. Set the peak voltage V₀ with the slider, from 1 to 400 V, or press **Indian mains** for a 325 V peak sine.
3. Read the rms value, the working and the facts.

## Solve your own numbers

The first card converts between the peak, rms and peak-to-peak values for the waveform in your question. Choose **rms from the peak**, **peak from the rms** (for example, the 325 V peak of 230 V mains) or **rms from peak-to-peak** (what an oscilloscope screen shows), pick the waveform (sine, square, triangle, sawtooth, half-wave or full-wave rectified) and say whether it is a voltage or a current. Type a load resistance to also get the average heating power. The working shows the factor used, the substitution and the result, plus the peak-to-peak value and the average (the half-cycle average 2V₀/π for a sine wave). Inputs can be in mV, V or kV. Five examples are included.

Common mistakes it points out: using 0.707 for every waveform (it is only for a sine or a full-wave rectified sine), and reading peak-to-peak on a scope as the peak.

## Worked example

The page opens with Indian mains: a sine wave with a peak of 325 V.

- Squaring every value and averaging over a cycle gives a mean of v² of 52 800 V² (exactly V₀²/2 = 325²/2 = 52 812.5 V²).
- V_rms = √52 812.5 = **230 V**, which is 325/√2.
- The mean over a cycle is 0 V, but the mean of the size |v| is 2V₀/π = 207 V.
- Into a 100 Ω resistor it delivers V_rms²/R = 528 W, the same as a steady 230 V.

Switch to **Square** with the same peak and the rms is the full 325 V; switch to **Half-wave** and it is 325/2 = 163 V.

## Tips

- AC meters read rms values. The ratings on appliances (230 V, 5 A) are rms too.
- Peak = √2 × rms holds only for a sine wave. Other shapes have other ratios.
- Insulation must survive the peak voltage, not the rms, so 230 V wiring is built for well over 325 V.

## FAQ

**How do I find the rms value from the peak?** For a sine wave V_rms = V₀/√2 = 0.707 V₀, so a 325 V peak is 230 V rms; other waveforms use other factors (square 1, triangle and sawtooth 1/√3, half-wave 1/2), all handled by the card above.

**Why not just use the average?** For a symmetric wave the average is zero, which tells you nothing about how much it heats or lights things. The rms value does.

**Does the frequency change the rms value?** No. Only the shape and the peak matter. The time axis is labelled for 50 Hz, but any frequency gives the same rms.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.
