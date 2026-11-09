---
name: Wavelet transform viewer
num: 631
shelf: science
section: signal-processing
title: "Wavelet transform online: Morlet scalogram (CWT) and Haar or Daubechies decomposition (DWT)"
summary: "Paste or open a signal and see which frequencies are present at each moment with a continuous Morlet wavelet scalogram, and split it into detail and approximation levels with a Haar or Daubechies discrete wavelet transform. Matches PyWavelets; CSV downloads; nothing is uploaded."
status: live
ads: true
order: 631
icon: chart
works: offline
updated: 2026-11-09
related: [fft-workbench, digital-filter-designer, aliasing-demo, period-finder, fourier-visualiser, seismogram-viewer, time-series-analyser, bird-song-spectrogram]
sources:
  - "Continuous wavelet transform with the Morlet wavelet and the cone of influence: Torrence and Compo (1998), A practical guide to wavelet analysis, Bulletin of the American Meteorological Society 79, 61 to 78. Discrete wavelet transform and the Daubechies filters: Daubechies (1992), Ten Lectures on Wavelets; Mallat (1989)."
  - "Computed the same way as the open-source PyWavelets library (MIT licence) and checked against PyWavelets 1.8 (pywt.cwt, central_frequency, wavedec, dwt_max_level), used only for testing; the filter coefficients are the wavelets' defining mathematical constants."
  - "Colour scale: stops of the viridis colour map (matplotlib, CC0)."
  - "The example signal is made up by fibub."
flow:
  - { icon: table, label: "Signal" }
  - { icon: chart, label: "Scalogram" }
  - { icon: sliders, label: "Levels" }
  - { icon: download, label: "Download" }
---

## What it does

A Fourier spectrum tells you which frequencies a signal contains, but not **when**. Wavelets answer both. This viewer gives two views of a signal you paste or open:

- A **scalogram** from the **continuous wavelet transform** (CWT) with a **Morlet** wavelet: time across, frequency up, brightness for how strong each frequency is at each moment. It shows a machine changing speed, a bird call sweeping up, a heartbeat speeding up or a short click hidden in a steady tone.
- A **multilevel discrete wavelet transform** (DWT) with the **Haar** or **Daubechies** wavelets: the signal split into detail levels D1, D2, … (each an octave of frequencies, fastest first) and a final smooth approximation. This is the transform behind denoising, compression (JPEG 2000) and many feature-extraction methods.

Everything runs in your browser; the numbers match the PyWavelets library.

Compare with a plain spectrum in the [[fft-workbench]], and for a time series with a trend and seasons try [[time-series-analyser|time series decomposition]].

## How to use it

1. **Paste or open your signal**: time and value columns, or one column of values plus the sample rate. The samples must be evenly spaced.
2. **Scalogram**: choose the wavelet and the frequency range. The complex Morlet wavelet gives a smooth picture of the strength (magnitude). Its bandwidth B trades time detail against frequency detail: B = 4 separates close frequencies better, B = 0.5 pins down short events better. The real Morlet (pywt "morl") shows the oscillation itself, so the picture has stripes. Choose 32, 64 or 96 frequency rows, and magnitude or power (magnitude squared) for the colour.
3. **The cone of influence** is shaded at both ends: there, the wavelet reaches past the start or end of the record, so values are lower than they should be.
4. **Decomposition**: choose Haar (the simplest, a step), Daubechies D4 (4 taps, PyWavelets db2) or db4 (8 taps, smoother), how the edges are handled (mirror or wrap round), and the number of levels. The table gives each level's frequency band, its number of coefficients and its share of the signal's energy.
5. Download the scalogram (CSV, one row per frequency), all the DWT coefficients (CSV), or the report as an image, PDF or Word file.

## Worked example

The made-up example is 2 seconds sampled at 200 Hz: an 8 Hz wave for the first second, then a 25 Hz wave, with a short click at 0.5 s. The scalogram shows a bright band near 8 Hz that stops at 1 s, a band near 25 Hz after it, and the click as a thin vertical streak reaching up to high frequencies. The strongest point is at 7.69 Hz, 0.64 s (the nearest of the 64 frequency rows to 8 Hz). In the db4 decomposition with 5 levels, D3 (12.5 to 25 Hz) holds 34.6 % of the energy and D4 (6.25 to 12.5 Hz) 35.8 %, the click shows as a spike in D1 and D2, and the approximation A5 holds 18.7 %.

## FAQ

**Is "Daubechies-4" db2 or db4?** Both names are used. Many textbooks call the 4-coefficient filter D4; PyWavelets and MATLAB call it db2 and use db4 for the 8-coefficient filter. Both are offered and labelled with their tap counts.

**Do the numbers match PyWavelets?** Yes. The CWT is computed the same way as pywt.cwt (integrated wavelet resampled for each scale, precision 2¹²), and the tests compare coefficients at several scales to 8 significant figures; the DWT matches pywt.wavedec in both edge modes.

**Why do frequencies not land exactly on my tone?** The rows are spaced on a log scale between your lowest and highest frequency. Narrow the range or add rows for finer steps.

**How is scale linked to frequency?** Frequency = centre frequency of the wavelet ÷ (scale × time step). The complex Morlet used here has a centre frequency of 1; the real Morlet 0.8125.
