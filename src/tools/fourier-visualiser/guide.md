---
name: Fourier series and FFT visualiser
num: 549
shelf: science
section: applied-mathematics
title: "Fourier series visualiser with Gibbs phenomenon, epicycles drawing and FFT spectrum (amplitude, phase, windows)"
summary: "See how sines and cosines build a square, sawtooth or any typed wave, watch the Gibbs overshoot, draw shapes with epicycles, and take the FFT of a formula or your own data with Hann, Hamming, Blackman or flat-top windows. All in your browser."
status: live
ads: true
order: 549
icon: curve
works: offline
updated: 2026-11-09
related: [period-finder, ode-solver, plot-maker, fft-workbench, wavelet-viewer, audio-spectrum-analyser, numerical-methods, aliasing-demo]
sources:
  - "Methods: textbook Fourier series formulas; Cooley-Tukey radix-2 FFT with Bluestein's algorithm for other lengths; periodic windows as in SciPy's get_window. Example signals and shapes are made from formulas."
flow:
  - { icon: curve, label: "Pick a wave" }
  - { icon: sliders, label: "Add terms" }
  - { icon: chart, label: "Spectrum" }
---

## What it does

Every repeating signal is a sum of sine and cosine waves. This tool shows that in three ways.

- **Series:** choose a square, sawtooth, triangle, rectified sine or pulse wave, or type your own f(t). Add terms one by one and watch the partial sum close in on the wave. The coefficients aₙ and bₙ are listed (exact formulas for the standard waves), with the error and the **Gibbs overshoot**: near a jump the sum always overshoots by about 9 % of the jump, however many terms you add. Fejér and Lanczos smoothing show how to tame it.
- **Epicycles:** any closed drawing is a sum of turning circles. Pick a shape or draw your own, and watch the circles draw it. The heart is made of only a few circles, so a handful draw it perfectly; a star's sharp corners need many. Fewer circles give a smoother, rounder version.
- **Spectrum (FFT):** type a signal such as sin(2*pi*50*t) or paste your own measurements (or open a CSV or Excel file), choose a window, and get the amplitude and phase spectrum with the largest peaks listed.

For longer recordings and filtering use the [[fft-workbench]], and for signals whose frequency changes over time the [[wavelet-viewer|wavelet transform viewer]].

## How to use it

1. **Series:** pick the wave and slide N. Tick "Show the first five terms" to see the separate harmonics. For your own f(t), type a formula in t; it is used on −π < t < π and repeated.
2. **Epicycles:** pick a shape and slide the number of circles. To draw, press **Clear and draw** and drag on the picture; the shape is closed when you let go.
3. **Spectrum:** type x(t) with its sample rate and number of samples, or choose "My data" and paste one column of values (and give the sample rate) or two columns, time and value.

The **window** controls leakage: with no window a frequency between two bins spreads into wide skirts. Hann is a good default; flat top gives the most accurate amplitudes. Amplitudes are scaled so that a sine of amplitude A shows as A.

## Worked example

The square wave is −1 then +1 on each half period. Its coefficients are bₙ = 4/(nπ) for odd n: 1.27324, 0.424413, 0.254648, ... With N = 9 the page shows a mean square error of 0.04040 (4.04 % of the mean square). The highest point of the sum is 1.182328 at t = 0.3142 (π/10), an overshoot of 9.116 % of the wave's height of 2. With 99 terms the top is 1.179013, and as N grows it tends to (2/π)·Si(π) = 1.178980, so the overshoot never goes away; it only gets narrower.

In the spectrum part, the default x(t) = sin(2π·50t) + 0.5 sin(2π·120t), 1000 samples at 1000 Hz, gives peaks at exactly 50 Hz (amplitude 1) and 120 Hz (amplitude 0.5) with any window, because both fit a whole number of cycles. Change 50 to 50.3: with no window the peak is reported at 50.13 Hz with amplitude 0.858 and leaks widely, while Hann gives 50.32 Hz and 0.943, and flat top gives an amplitude close to 1.

## How the maths was checked

The FFT was compared with numpy.fft.fft for lengths 7, 1000, 1023 and 1024 (agreement to 10⁻¹² or better) and the windows with scipy.signal.get_window. The numerical series coefficients agree with the exact formulas to 10⁻⁶, and the Gibbs limit with SciPy's sine integral.

## Good to know

- Amplitude between bins is lower than the true amplitude (by up to 36 % with no window, 15 % with Hann, under 0.1 % with flat top). The peak frequency is refined between bins with a parabola through the log amplitudes.
- The FFT assumes evenly spaced samples. For uneven times use the period finder (Lomb-Scargle).
- Phase is shown only for bins above 1 % of the largest; elsewhere it is noise.
- The FFT takes up to 1,048,576 samples, and files up to 10 MB.

## Frequently asked questions

**Is my data uploaded?** No. Everything runs in your browser and nothing is stored.

**Why does the spectrum stop at half the sample rate?** That is the Nyquist frequency: higher frequencies cannot be told apart from lower ones (aliasing).

**What are negative circle speeds?** In epicycles, circles turn both ways; a negative speed turns clockwise.
