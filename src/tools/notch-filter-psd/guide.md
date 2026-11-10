---
name: Notch filter
num: 346
shelf: science
section: neuroscience
title: "Notch filter"
summary: "Paste or open an EEG, LFP or patch-clamp trace (CSV, text, Excel or WAV) and remove 50 or 60 Hz mains hum and its harmonics with IIR notch filters run forwards and backwards. See the Welch power spectrum before and after, band powers (delta to gamma or your own bands), and download the filtered trace as CSV."
status: live
ads: false
order: 346
icon: curve
works: offline
updated: 2026-11-09
related: [period-finder, trend-analyser, plot-maker, uncertainty-calculator, digital-filter-designer, fft-workbench, ecg-viewer, spike-train-analyser, emg-analyser, wavelet-viewer]
sources:
  - "Notch design as scipy.signal.iirnotch (second-order IIR notch; S. J. Orfanidis, Introduction to Signal Processing, Prentice Hall 1996). Zero-phase filtering as scipy.signal.filtfilt (forward-backward with odd padding and steady-state initial conditions, F. Gustafsson, IEEE Trans. Signal Process. 44 (1996) 988–992). Spectra by Welch's method (P. D. Welch, IEEE Trans. Audio Electroacoust. 15 (1967) 70–73). Written by fibub."
  - "Checked in the tests against SciPy 1.18 (iirnotch, lfilter_zi, lfilter, filtfilt, welch, freqz) to 1 part in 10⁹, and band powers against NumPy sums over the SciPy spectrum. EEG band edges are common conventions, not a standard; edit them freely."
  - "The example trace is synthetic and made up for this page. For study and research, not for clinical use."
flow:
  - { icon: table, label: "Trace" }
  - { icon: sliders, label: "Notch" }
  - { icon: curve, label: "Spectrum" }
  - { icon: download, label: "CSV" }
---

## What it does

Mains electricity puts a hum at 50 Hz (or 60 Hz) and its harmonics into almost every electrophysiology recording: EEG, local field potentials, ECG, and patch-clamp currents. This tool removes it with narrow **IIR notch filters**, one per harmonic, run **forwards and then backwards** so the waveform is not shifted in time. It shows the **power spectrum** before and after (Welch's method), the **power in each frequency band** you name, and how much hum was removed. Download the cleaned trace as CSV to carry on in your own analysis.

Everything runs in your browser. Files are read on your device and never uploaded. For study and research, not for clinical use.

Detect spikes in the clean recording with the [[spike-train-analyser]], or design a different filter in the [[digital-filter-designer]].

## How to use it

1. Paste a trace, open a CSV, text or Excel file, or open a WAV file. A first column called **time** or **t** (in seconds, or milliseconds if the name says ms) sets the sample rate; otherwise type the **sample rate** yourself. With several signal columns, pick one under **Signal column**.
2. Choose **50 Hz or 60 Hz** and how many **harmonics** to notch. Harmonics at or above half the sample rate cannot exist in the recording and are skipped.
3. Set **Q**: the notch is f₀/Q wide at its −3 dB points. Q 30 at 50 Hz cuts a band 1.67 Hz wide. A higher Q removes less of your signal but needs the hum to sit exactly at the mains frequency.
4. Check the spectrum and the band table, look at the trace, then download the **filtered trace (CSV)**, the **spectra (CSV)**, or a report.

## What each option does

- **Zero-phase (forward and backward)**: the standard offline choice. The notch is applied twice, once in each direction, so there is no phase delay and the notch is twice as deep in dB. Untick it to see a single causal pass, like a hardware filter, which delays components near the notch.
- **Welch segment**: the spectrum is the average of Hann-windowed segments of this many samples, overlapping by half. Longer segments give finer frequency steps (sample rate ÷ segment) but a noisier estimate.
- **Bands**: name and range in Hz, separated by semicolons. Band power is the sum of the spectrum × frequency step over the bins from the lower edge up to (not including) the upper edge. **Share after** is each band's part of the total of the bands listed.
- **Units**: only the labels; the numbers are in whatever units your trace uses (power in units²).

## Worked example

The made-up example is 10 s at 500 Hz in µV: a 20 µV alpha rhythm at 10 Hz, an 8 µV theta at 6 Hz, random noise, 30 µV of 50 Hz hum and a 6 µV third harmonic at 150 Hz. With 50 Hz, three notches (50, 100, 150 Hz), Q 30, zero-phase and 512-sample segments (1.02 s, frequency step 0.977 Hz, 18 segments):

- Line noise power within ±1.95 Hz of the notches falls from **463 to 0.204 µV²**, a reduction of **33.6 dB**.
- Total power falls from 734.5 to 270.8 µV², and the RMS from 27.23 to 16.69 µV.
- Alpha (8–13 Hz) power is **202.3 µV²** before and after (a change of −0.015 %), and it makes up 78.1 % of the band power after filtering. Gamma (30–45 Hz), closest to the notch, loses 1.14 %.

## Tips

- Look at the spectrum before choosing: if the hum peak is a little off 50 Hz, lower Q so the notch is wide enough to catch it.
- Notches leave a gap in the spectrum. Do not read band power right at the notch frequencies after filtering.
- If you plan to low-pass filter below 50 Hz anyway, you may not need a notch at all.
- A filtered trace cannot be "unfiltered": keep your raw data.

## FAQ

**Does it match SciPy?** Yes. The coefficients, filtering and spectra are checked against scipy.signal.iirnotch, filtfilt (default padding) and welch (Hann, half overlap, constant detrend).

**How is the line-noise power measured?** As the band power within ±1 Hz or ±2 frequency steps (whichever is wider) of each notch frequency, before and after. The Hann window spreads a pure tone over about two steps each side, so this catches nearly all of it: 463 µV² in the example against 468 µV² for the two sine waves. With coarse steps (short segments, high sample rates) the window gets wide and also catches your signal, so pick a longer Welch segment.

**Is my data uploaded?** No. Everything is computed in your browser.

**Is this for diagnosis?** No. It is a study and research tool, not for clinical use.
