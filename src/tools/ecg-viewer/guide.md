---
name: ECG viewer and HRV
num: 680
shelf: science
section: biomedical-engineering
title: "ECG viewer and heart rate variability (HRV) calculator: Pan-Tompkins beats, SDNN, RMSSD, LF/HF, Poincaré plot"
summary: "Open or paste a single-lead ECG, filter it, find the beats with the Pan-Tompkins method and get heart rate, an RR tachogram, time-domain HRV (SDNN, RMSSD, pNN50), a Lomb-Scargle spectrum with LF and HF power, and a Poincaré plot. For study and research, not for diagnosis. Nothing is uploaded."
status: live
ads: false
order: 680
icon: curve
works: offline
updated: 2026-11-09
related: [period-finder, plot-maker, trend-analyser, emg-analyser, heart-rate-zones, fft-workbench, digital-filter-designer, notch-filter-psd]
sources:
  - "QRS detection: Pan, J. and Tompkins, W. J. (1985), A real-time QRS detection algorithm, IEEE Transactions on Biomedical Engineering 32, 230 to 236 (method only, written from the description)."
  - "HRV measures and bands: Task Force of the European Society of Cardiology and the North American Society of Pacing and Electrophysiology (1996), Heart rate variability: standards of measurement, physiological interpretation and clinical use. Poincaré SD1 and SD2: Brennan, Palaniswami and Kamen (2001). Lomb-Scargle spectrum: Zechmeister and Kürster (2009), using fibub's existing periodogram code."
  - "Checked against SciPy and NumPy: the Butterworth and notch filter coefficients (scipy.signal.butter, iirnotch), zero-phase filtering (sosfiltfilt) to 1e-13, SDNN, RMSSD, pNN50, SD1 and SD2 to 1e-9 ms, and LF, HF and VLF power against scipy.signal.lombscargle; beat detection against the known beat times of synthetic ECGs at 45, 68 and 150 bpm, noisy and upside down."
  - "The example ECG is synthetic, made up by fibub from Gaussian waves (in the spirit of McSharry et al. 2003); it is not a recording of any person and no database recordings are used."
flow:
  - { icon: file, label: "Open ECG" }
  - { icon: sliders, label: "Filter" }
  - { icon: target, label: "Find beats" }
  - { icon: chart, label: "HRV" }
---

## What it does

Heart rate variability (HRV) is the beat-to-beat change in the time between heartbeats. This page takes a single-lead electrocardiogram (ECG), finds every beat and works out the usual HRV measures, all in your browser:

- **Filtering**: a high-pass to remove baseline wander, a low-pass to remove muscle noise and an optional 50 or 60 Hz notch for mains hum. The filters run forwards and backwards, so the waves are not shifted in time.
- **Beat detection** with the Pan-Tompkins method: a 5 to 15 Hz band-pass, derivative, squaring and a 150 ms moving window, with thresholds that adapt to the signal and noise, a 200 ms refractory period, a check that rejects tall T waves, and a search back for beats it missed. Each beat is then placed on the tip of the R wave, to a fraction of a sample.
- **Time domain**: mean RR interval, heart rate, SDNN, RMSSD, SDSD, NN50 and pNN50.
- **Frequency domain**: a Lomb-Scargle spectrum of the RR intervals, which works on the uneven beat times without resampling, with VLF, LF and HF power, LF/HF and normalised units.
- **Poincaré plot** of each interval against the next, with SD1 and SD2.

**For study and research, not for diagnosis.** It does not judge heart rhythm or wave shapes.

Look at muscle signals in the same way with the [[emg-analyser|EMG analyser]], and design your own filters with the [[digital-filter-designer|digital filter designer]].

## How to use it

1. Paste the samples or press **Open a file** (CSV, TSV, TXT or Excel). With one column of values, give the **sample rate**. If the first column is time in seconds, pick that layout and the sample rate is read from it. Choose the **value column** for files with several leads.
2. Set the filter cut-offs. 0.5 to 40 Hz is a common viewing band. Leave a box empty to switch that filter off.
3. **R wave points**: most leads have an upward R wave; the page works out the direction itself, or you can set it.
4. **Set aside RR intervals** that differ by more than 10, 20 or 30 % from the median of the 11 intervals around them. This drops missed beats, extra beats and ectopic beats from HRV. They still show as crosses on the tachogram.
5. Scroll through the trace with the **Window** and **Start at** controls, and download the beat list as CSV or the whole report as an image, PDF or Word file.

## Worked example

The example is a made-up 3-minute ECG at 250 Hz with a heart rate near 68 bpm. The interval between beats swings by ±40 ms at 0.1 Hz (a slow LF rhythm) and by ±30 ms at 0.25 Hz (breathing, 15 breaths a minute), plus random jitter. The page finds all 204 beats and shows a heart rate of 68.3 bpm, SDNN 37.6 ms, RMSSD 33.7 ms and pNN50 13.9 %. The spectrum has its LF peak at 0.1 Hz and its HF peak at 0.25 Hz, just as built in, with LF power about 875 ms² and HF about 497 ms². A sine of amplitude A adds about A²/2 to its band, so 800 and 450 ms² come from the two rhythms and the rest from the jitter. SD1 is 23.9 ms and SD2 47.5 ms.

## Tips

- Record at least 2 minutes for LF power and 5 minutes for comparisons; VLF needs much longer.
- Breathing slower than 9 breaths a minute moves breathing power from HF into LF, so LF/HF then says little about the nervous system.
- If beats are missed, check the sample rate, try the other R wave direction, or lower the low-pass cut-off.

## FAQ

**How is power scaled?** The Lomb-Scargle power is scaled so its area equals the variance of the intervals (ms²), the same convention as an FFT spectrum. Values differ a little from tools that resample to 4 Hz and use Welch's method.

**Why is SDSD slightly different from RMSSD?** SDSD subtracts the mean difference; RMSSD does not.

**Is my recording uploaded?** No. Everything runs on your device and works offline.
