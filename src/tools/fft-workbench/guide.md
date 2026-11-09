---
name: FFT workbench
num: 628
shelf: science
section: signal-processing
title: "FFT spectrum analyser online: amplitude and power spectrum, windows, peaks and FFT filter"
summary: "Paste or open a signal (time and value, or values and a sample rate) and get its amplitude or power spectrum with a Hann, Hamming, Blackman or no window, a list of peaks, and a simple FFT low-, high- or band-pass filter back to time. CSV downloads; nothing is uploaded."
status: live
ads: true
order: 628
icon: chart
works: offline
updated: 2026-11-09
related: [period-finder, plot-maker, data-cleaner]
sources:
  - "Discrete Fourier transform (radix-2 FFT and Bluestein's chirp-z method for other lengths) and the Hann, Hamming and Blackman windows: standard textbook definitions, for example Oppenheim and Schafer, Discrete-Time Signal Processing; Harris (1978), Proceedings of the IEEE 66, 51 to 83."
  - "Checked against numpy.fft (fft, rfft, irfft) and scipy.signal (periodogram, get_window), used only for testing; no code copied."
  - "The example signal is made up by fibub."
flow:
  - { icon: table, label: "Signal" }
  - { icon: sliders, label: "Window" }
  - { icon: chart, label: "Spectrum" }
  - { icon: download, label: "Download" }
---

## What it does

A fast Fourier transform (FFT) splits a signal into the sine waves it is made of. This workbench takes a signal you paste or open (a vibration record, a voltage from a data logger, an audio clip saved as numbers, a sensor reading) and shows its **spectrum**: how strong each frequency is. It lists the strongest **peaks**, lets you choose the **window** that tapers the record, and can **filter** the signal by keeping only some frequencies and transforming back to time. Everything runs in your browser; the signal never leaves your device.

## How to use it

1. **Paste or open your signal.** Two columns give the time (in seconds) and the value; the sample rate is worked out from the time step. One column of values works too: then type the **sample rate** (samples per second, Hz). The samples must be evenly spaced; the tool says so if they are not.
2. **Window.** Hann is a good all-round choice. Blackman leaks least, so weak tones next to strong ones show up better, but its peaks are wider. Hamming sits between them. Rectangular (no window) gives the sharpest peaks only when every tone fits a whole number of cycles in the record.
3. **Show.** *Amplitude* reads directly as the height of each sine wave. *Amplitude in dB* shows weak and strong parts together. *Power spectral density* (dB per hertz) is what noise is measured in; it does not depend on the record length. *Power spectrum* gives the power of each tone (a sine of amplitude A has power A²/2).
4. **Zero padding** adds zeros to the end so the curve is drawn at more points. It does not improve the true resolution, which is 1 divided by the record length.
5. **Filter.** Choose low-pass, high-pass, band-pass or band-stop and the edges in hertz. The chart shows the original and the filtered signal; the CSV gives both.

## Worked example

The example is a made-up record: 1,000 samples over 1 second (1,000 Hz), with an offset of 0.2 V, a 50 Hz sine of 1 V, a 120 Hz sine of 0.5 V and random noise. With the Hann window the page finds the strongest peak at **49.99 Hz with an amplitude of 1.01 V**, and the second at **120.0 Hz with 0.486 V**, close to the true values; the noise moves them slightly. The resolution is 1 Hz and the Nyquist frequency is 500 Hz. The mean, 0.1928 V, is removed first. A low-pass filter at 80 Hz keeps the 50 Hz wave and removes the 120 Hz wave and most of the noise: the standard deviation drops from 0.846 V to 0.719 V.

## Tips

- A tone that falls between two bins looks lower and wider ("scalloping" and leakage). The peak list corrects for this by fitting a parabola through the top three bins.
- Remove a slow drift before the FFT (for example with a high-pass filter at a very low frequency) or it will hide the low frequencies.
- Anything above the Nyquist frequency (half the sample rate) folds back and appears at a wrong, lower frequency. Filter it out before sampling, or sample faster.

## FAQ

**Is it the same as numpy or MATLAB?** Yes: the transform follows numpy.fft, and the density and power scalings match scipy.signal.periodogram with the mean removed. The checks compare many values to 9 or more significant figures.

**Does the length need to be a power of 2?** No. Any length works; other lengths use Bluestein's method, which is just as exact.

**Why does the filtered signal wobble at the ends?** The FFT treats the record as if it repeated end to end. If the first and last values differ a lot, that jump spreads into the filtered result. A real-time filter from the FIR/IIR filter designer avoids this.

**My times are uneven.** Use the light curve period finder (Lomb-Scargle), which is made for uneven sampling.
