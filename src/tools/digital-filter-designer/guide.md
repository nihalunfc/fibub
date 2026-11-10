---
name: FIR/IIR filter designer
num: 629
shelf: science
code: T426
section: signal-processing
title: "Digital filter designer: FIR windowed sinc, Butterworth and Chebyshev IIR, with C coefficients"
summary: "Design a low-pass, high-pass, band-pass or band-stop digital filter: FIR by the window method (Hamming, Hann, Blackman, Kaiser) or IIR Butterworth and Chebyshev type I by the bilinear transform. See the gain, phase and group delay, the poles and zeros, and copy the coefficients as C arrays, second-order sections or CSV."
status: live
ads: true
order: 629
icon: sliders
works: offline
updated: 2026-11-09
related: [fft-workbench, plot-maker, aliasing-demo, wavelet-viewer, filter-designer, notch-filter-psd, oscilloscope-viewer, kalman-filter-playground]
sources:
  - "Window method and Kaiser's formulas: Oppenheim and Schafer, Discrete-Time Signal Processing; Kaiser (1974), Nonrecursive digital filter design using the I0-sinh window function. Butterworth and Chebyshev prototypes and the bilinear transform with pre-warping: standard textbook results (for example Parks and Burrus, Digital Filter Design)."
  - "Checked against scipy.signal (firwin, kaiserord, butter, cheby1, zpk2sos, sosfreqz, group_delay, lfilter) and numpy (kaiser, roots), used only for testing; no code copied."
  - "The default settings are an example made up by fibub."
flow:
  - { icon: sliders, label: "Specs" }
  - { icon: curve, label: "Response" }
  - { icon: target, label: "Poles" }
  - { icon: copy, label: "Coefficients" }
---

## What it does

A digital filter keeps some frequencies of a sampled signal and removes others: it takes hum out of a sensor reading, smooths noise before you look for a trend, or keeps one band of a radio or audio signal. This designer works out the filter's **coefficients** from a few numbers you choose, shows how it treats each frequency, and gives you the coefficients to paste into C, Python, MATLAB, a microcontroller or a spreadsheet. Everything is calculated in your browser.

It designs two families:

- **FIR (finite impulse response)** filters by the **window method**: the ideal "brick-wall" response is a sinc function; it is cut to a fixed length (the number of **taps**) and tapered with a window. FIR filters are always stable and delay every frequency by the same time (linear phase), so pulse shapes are kept.
- **IIR (infinite impulse response)** filters, **Butterworth** (as flat as possible in the pass band) and **Chebyshev type I** (a small ripple in the pass band for a steeper edge). They are designed as analogue filters and turned into digital ones with the **bilinear transform**, with the edge frequencies pre-warped so they land exactly where you asked. An IIR filter needs far fewer coefficients than an FIR filter for the same steepness, but its delay varies with frequency.

Find the noise you need to remove with the [[fft-workbench]] first, and for a filter built from resistors, capacitors and op-amps use the [[filter-designer|analog filter designer]].

## How to use it

1. Type the **sample rate** of your signal in Hz.
2. Choose the **design** and the **type**: low-pass, high-pass, band-pass or band-stop, and the edge frequency or frequencies. They must be below half the sample rate (the Nyquist frequency).
3. For FIR, choose a **window** and the number of **taps**. Hamming and Hann are good defaults; Blackman blocks more but needs more taps for the same edge. **Kaiser** asks instead for the stop-band attenuation in dB and the width of the transition from pass to stop, and works out the taps and the window's shape (β) from Kaiser's formulas. High-pass and band-stop FIR filters need an odd number of taps.
4. For IIR, choose the **order** (each step adds 6 dB per octave of steepness; band filters have twice as many poles) and, for Chebyshev, the **ripple** in dB.
5. Read the **gain at the edges**, the half-power (−3 dB) points and the gain one octave beyond the edge. Switch the plot between gain in dB, linear gain, phase and group delay (the delay in samples at each frequency).
6. Copy or download the **coefficients**: C arrays of b and a, C second-order sections for IIR filters, or CSV.

## Worked example

The page opens with a 51-tap Hamming FIR low-pass filter at 100 Hz for a 1,000 Hz sample rate. The gain at 100 Hz is −6.05 dB (a windowed-sinc filter is always about half amplitude at its cut-off), the half-power point is 91.9 Hz, and at 200 Hz, one octave out, the gain is −61.7 dB. Every frequency is delayed by 25 samples, 25 ms.

Switch to a 4th-order **Butterworth**: the gain at 100 Hz is exactly −3.01 dB and one octave out it is −28.0 dB, with only 5 b and 5 a coefficients (two second-order sections). A 4th-order **Chebyshev I** with 1 dB ripple is −1 dB at 100 Hz and −38.3 dB at 200 Hz: steeper, at the cost of the ripple and poles closer to the unit circle (radius 0.921 against 0.795).

## Using the coefficients

Run the filter with the difference equation shown, or with scipy.signal.lfilter(b, a, x) or sosfilt(sos, x) in Python and filter(b, a, x) or sosfilt in MATLAB and Octave. For IIR filters above about 6 poles, use the second-order sections: one long b/a pair is very sensitive to rounding and can even turn unstable in single precision.

## FAQ

**Are these the same as scipy?** Yes. The FIR taps match scipy.signal.firwin, and the Butterworth and Chebyshev poles, zeros, gain and b/a coefficients match scipy.signal.butter and cheby1 to about 9 significant figures; the second-order sections give the same response.

**Why is my FIR filter's cut-off at −6 dB, not −3 dB?** The window method puts the cut-off at the middle of the transition, where the gain is one half. If you need −3 dB at a set frequency, move the cut-off up a little and check the half-power point shown.

**Which should I choose?** FIR when the shape of pulses or the timing must be kept, or when you will run the filter offline. IIR when you need a steep edge with little computing, as on a small microcontroller.

**Can I filter a signal here?** Not directly; the FFT workbench filters a pasted signal in the frequency domain. Use these coefficients in your own code to filter as samples arrive.
