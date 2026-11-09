---
name: Sampling and aliasing explorer
num: 630
shelf: science
section: signal-processing
title: "Aliasing calculator and Nyquist explorer: apparent frequency, folding diagram and samples"
summary: "Type a signal frequency and a sample rate and see what the samples really record: the apparent (alias) frequency, the Nyquist zone, the alias sine drawn through the samples, a folding diagram and the ideal sinc reconstruction. Includes the wagon-wheel effect and audio examples."
status: live
ads: true
order: 630
icon: curve
works: offline
updated: 2026-11-09
related: [fft-workbench, digital-filter-designer]
sources:
  - "Sampling theorem and aliasing: Shannon (1949), Communication in the presence of noise; Whittaker-Shannon interpolation; standard textbook treatment, for example Oppenheim and Schafer, Discrete-Time Signal Processing."
  - "Apparent frequencies checked against the peak of numpy.fft.rfft of the sampled sine (test use only)."
  - "Example values are made up by fibub."
flow:
  - { icon: sliders, label: "Frequencies" }
  - { icon: curve, label: "Samples" }
  - { icon: chart, label: "Folding" }
---

## What it does

When a signal is sampled, only its values at evenly spaced instants are kept. A frequency above half the sample rate does not disappear: it shows up disguised as a lower one. That disguise is **aliasing**, and it is behind wagon wheels that turn backwards in films, moiré stripes in photos of fabric, false tones in cheap audio and wrong readings from a data logger set to sample too slowly.

This explorer shows it directly. Type a signal frequency and a sample rate (or drag the slider), and it draws the real signal, the samples, and the **alias**: the slowest sine that goes through every sample. It tells you the **apparent frequency**, which **Nyquist zone** the signal is in, whether the alias is mirrored, and the sample rate you would need. A **folding diagram** shows where every input frequency ends up.

## How to use it

1. Pick an **example**, or type the **signal frequency** f and the **sample rate** fs in hertz. Use the slider to sweep f from 0 to three times the sample rate and watch the alias move.
2. **Starting phase** shifts the sine. It matters only in the edge case where f is an exact multiple of fs/2.
3. **Samples shown** sets how much time the chart covers.
4. Tick **Show the ideal (sinc) reconstruction** to draw what a perfect digital-to-analogue converter would rebuild from the samples (the Whittaker-Shannon formula). It follows the alias, not the original, once f is above fs/2.

## The formulas

- Nyquist frequency: f_N = fs / 2.
- Apparent frequency: f_a = |f − k·fs|, where k is the whole number nearest to f / fs. The signed value f − k·fs is negative when the alias runs backwards with its phase flipped.
- Nyquist zone: 1 + the whole part of f / (fs/2). Zone 1 (0 to fs/2) is safe; in even zones the spectrum is mirrored.
- To avoid aliasing, sample faster than 2f, and filter out everything above fs/2 before sampling.

## Worked example

The page opens with a 70 Hz sine sampled at 100 Hz. The Nyquist frequency is 50 Hz, so 70 Hz is in zone 2. The samples trace a sine of **30 Hz** (|70 − 1 × 100|), and the signed alias is −30 Hz: the alias runs backwards, phase flipped. You would need more than 140 Hz to sample it properly; 100 Hz is only 0.714 times that minimum.

The wagon wheel example: a wheel turning 23 times a second, filmed at 24 frames a second, appears to turn backwards once a second (23 − 24 = −1). A 30 kHz tone recorded at 44.1 kHz without a filter appears as an audible 14.1 kHz tone. Hum at 60 Hz sampled at 50 Hz appears as 10 Hz.

## FAQ

**Is sampling at exactly twice the frequency enough?** No. At exactly fs/2 the samples can land on the zero crossings and show nothing at all; try "Exactly half the sample rate" and change the phase between 0 and 90 degrees. Sample comfortably faster, typically 2.5 to 10 times the highest frequency.

**Can I remove aliasing afterwards?** No. Once two frequencies give identical samples, nothing in the data tells them apart. That is why converters have an analogue low-pass (anti-aliasing) filter in front.

**How was it checked?** The apparent frequency was compared with the spectral peak numpy's FFT finds in the sampled sine, for twelve cases including the examples here. The tests also check that the alias passes through every sample and that the sinc reconstruction converges to it.
