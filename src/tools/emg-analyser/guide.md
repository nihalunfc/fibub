---
name: EMG envelope and fatigue analyser
num: 681
shelf: science
section: biomedical-engineering
title: "EMG envelope, onset and fatigue analyser: RMS envelope, burst detection, median and mean frequency trend"
summary: "Open or paste a surface EMG recording, band-pass and rectify it, get a moving RMS or low-pass envelope, find each contraction's onset and offset from a rest threshold, and follow muscle fatigue as the median and mean frequency fall in sliding Welch windows, with the slope. For study and research, not for diagnosis. Nothing is uploaded."
status: live
ads: false
order: 681
icon: chart
works: offline
updated: 2026-11-09
related: [ecg-viewer, trend-analyser, plot-maker, fft-workbench, digital-filter-designer, notch-filter-psd, gait-cadence]
sources:
  - "Methods written from their standard textbook descriptions: Welch's averaged periodogram (Welch 1967), mean and median frequency of the EMG power spectrum and their fall with fatigue (De Luca 1997, The use of surface electromyography in biomechanics, Journal of Applied Biomechanics 13), onset by a baseline mean plus k standard deviations (Hodges and Bui 1996). No code or data copied."
  - "Checked against SciPy and NumPy: scipy.signal.welch spectra to 1e-15, mean and median frequency in all 63 windows of the example to 1e-12 Hz, the moving RMS against numpy.convolve, the low-pass envelope against scipy.signal.sosfiltfilt, and the fatigue slope, intercept, R² and slope error against scipy.stats.linregress; burst onsets against the known burst times of the synthetic EMG (within 30 ms)."
  - "The example EMG is synthetic, made up by fibub from filtered random noise; it is not a recording of any person and no database recordings are used."
flow:
  - { icon: file, label: "Open EMG" }
  - { icon: sliders, label: "Filter" }
  - { icon: target, label: "Bursts" }
  - { icon: curve, label: "Fatigue" }
---

## What it does

Surface electromyography (EMG) records the electrical activity of a muscle through the skin. This page turns a raw EMG trace into the numbers used in movement science, ergonomics and sports research:

- **Filtering**: a band-pass (20 to 450 Hz by default) and an optional 50 or 60 Hz notch, run forwards and backwards so nothing shifts in time.
- **Envelope**: a moving RMS (root mean square) over a window you choose, or the full-wave rectified signal smoothed by a low-pass filter (a "linear envelope").
- **Onsets and offsets**: a burst starts when the envelope rises above the rest level plus k standard deviations and ends when it falls back. Each burst gets its length, peak and mean envelope, and its iEMG (the area under the rectified signal).
- **Fatigue**: the median frequency (MDF) and mean frequency (MNF) of the spectrum in sliding windows, with a straight-line trend. When a muscle tires during a sustained contraction, the spectrum shifts to lower frequencies and both fall.

**For study and research, not for diagnosis.**

Remove mains hum first with the [[notch-filter-psd|notch filter and PSD tool]], and look at the spectrum in more depth with the [[fft-workbench|FFT workbench]].

## How to use it

1. Paste the samples or press **Open a file** (CSV, TSV, TXT or Excel). With one column, give the **sample rate**; with a time column in seconds, pick that layout. Choose the **value column** for files with several channels.
2. Check the filter band. The low-pass must be below half the sample rate.
3. Choose the **envelope**. 50 to 100 ms suits a moving RMS; 2 to 10 Hz suits a low-pass envelope.
4. Give a **rest** stretch with no contraction. The **threshold k** is usually 2 or 3. **Shortest burst** drops brief noise spikes and **join** merges bursts split by a short dip.
5. Set the **window** for the fatigue analysis (0.5 to 1 s is common) and the **Welch segment** (shorter segments give smoother but coarser spectra). Keep **only windows inside a burst** ticked, so rest periods do not pull the trend.
6. Download the bursts and windows as CSV, or the report as an image, PDF or Word file.

## Worked example

The example is a made-up 32-second EMG at 1000 Hz with five contractions of 4 seconds (starting at 2, 8, 14, 20 and 26 s). Its spectrum is built to slide down over time, like a tiring muscle. With the default settings the page finds all 5 bursts, with onsets at 1.982, 7.978, 13.981, 19.981 and 25.978 s (within 22 ms of the true times). Of the 63 one-second windows, 35 lie inside a burst. The median frequency falls from 145 Hz to 106 Hz, a slope of −1.42 Hz/s (R² = 0.704), which is −58.9 % per minute of the starting value. The mean frequency falls by −1.24 Hz/s. The iEMG grows from burst to burst because the made-up amplitude rises as fatigue sets in.

## Tips

- Fatigue slopes are only comparable at the same force, joint angle and electrode position.
- A notch filter rings for a fraction of a second, which moves onsets earlier; use it only when hum is clearly present.
- Dynamic movements change the spectrum for reasons other than fatigue; these measures are designed for steady (isometric) contractions.

## FAQ

**How is the median frequency found?** The power in each frequency bin is added up from the bottom of the band; the median is where the sum reaches half the total, interpolated within the bin.

**Why does the threshold use the envelope, not the raw signal?** The raw EMG swings around zero; its envelope is a smooth measure of size, so one threshold works.

**Is my recording uploaded?** No. Everything runs on your device and works offline.
