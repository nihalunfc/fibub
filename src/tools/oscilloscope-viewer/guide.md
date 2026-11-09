---
name: Oscilloscope CSV viewer
num: 979
shelf: science
section: general-physics-lab-helpers
title: "Oscilloscope CSV viewer: plot scope exports and measure frequency, rise time, duty cycle and phase between channels"
summary: "Open the CSV your oscilloscope saves and get the measurements a scope makes: frequency and period, 10-90 % rise and fall time, top, base, peak to peak, RMS, duty cycle, and the delay and phase between two channels, with a plot of every channel and a zoom on the first edge."
status: live
ads: true
order: 15
icon: chart
works: offline
updated: 2026-11-09
related: [curve-fitter, plot-maker, sig-fig-checker]
sources:
  - "Pulse and transition terms and the histogram method for top and base levels: IEEE Std 181-2011 (IEEE Standard for Transitions, Pulses, and Related Waveforms), used for definitions only. Rise time of an RC circuit τ ln 9 and its phase lag atan(ωτ): standard circuit theory."
  - "Checked against theory on noise-free traces and against an independent numpy implementation on the noisy example, written for the tests."
  - "The example capture is simulated (made up)."
flow:
  - { icon: file, label: "CSV" }
  - { icon: chart, label: "Traces" }
  - { icon: ruler, label: "Measure" }
  - { icon: table, label: "Results" }
---

## What it does

Most oscilloscopes can save what is on the screen as a CSV file: a time column and one column per channel, often with a few lines of settings at the top. This viewer opens that file in your browser, plots every channel, and makes the standard automatic measurements a scope makes, so you can measure saved captures later, check the scope's own numbers, or put clean figures and tables into a lab report.

## How to use it

1. Open the CSV (or paste it). Lines of settings such as "Record Length" and the column titles are found and skipped automatically. If the file has no time column, type the **sample interval** in seconds.
2. Choose the **channel to measure** and, for the phase, the channel to compare it with.
3. Choose the **rise and fall levels** (10 to 90 % is the usual definition, 20 to 80 % suits slow or ringing edges) and the **hysteresis**, which stops noise near a level from counting as extra edges.
4. To measure only part of the capture, give a **from** and **to** time.
5. Read the measurement table (every channel side by side), the phase line, the plot with the 10, 50 and 90 % levels, and the zoom on the first rising edge. Download the table as CSV or the report as an image, PDF or Word file.

## How the measurements are made

- **Top and base** are the most common high and low values (the IEEE 181 histogram method), so overshoot and noise do not move them; for a sine wave with no flat parts they are the peaks. The **amplitude** is top minus base.
- **Frequency and period** come from the times the signal rises through 50 % of the amplitude, interpolated between samples and averaged over all whole cycles in view.
- **Rise time** runs from the low to the high level on each rising edge, averaged over all edges; **fall time** likewise. The **duty cycle** is the time above 50 % divided by the period.
- **Phase** is given two ways: from the fundamental (a Fourier component over a whole number of periods, best for sine-like signals) and from the delay between 50 % rising edges (what you would read off the screen). Positive means the second channel lags.

## Worked example

The example is a simulated capture: CH1 is a 1 kHz, 3.3 V logic signal after an RC filter with a 10 µs time constant, CH2 a 1 V sine wave 45° behind the logic signal, 4,000 samples 1 µs apart. The page measures CH1 at **999.99 Hz** with a **rise time of 21.9 µs** (theory: τ ln 9 = 22.0 µs), fall time 21.8 µs and a 50 % duty cycle. CH2 has an AC RMS of 707.1 mV (1 V ÷ √2). The phase line reads **CH2 lags CH1 by 41.39° at the fundamental** (45° minus the RC filter's own lag of 3.6°) and the delay between edges is 118.2 µs, or 42.53°. With 20 to 80 % levels the rise time is 13.8 µs (τ ln 4).

## FAQ

**My scope saves in another format.** Any CSV, TSV, text or Excel file with a time column and channel columns works. Binary formats need the scope's own software to convert them first.

**Is my data uploaded?** No. The file is read and measured in this page only.
