---
name: Seismogram viewer
num: 879
shelf: science
section: geophysics-and-seismology
title: "Seismogram viewer: open SAC and miniSEED, filter, spectrogram and pick P and S arrivals"
summary: "Open SAC and miniSEED seismogram files (Steim-1, Steim-2, integers and floats) in your browser. See several traces at once with zoom and pan, remove the trend, taper, apply a Butterworth bandpass (one pass or zero phase), see the amplitude spectrum and a spectrogram, tap to pick P and S, and download CSV."
status: live
ads: false
order: 879
icon: curve
works: offline
updated: 2026-11-09
related: [earthquake-locator, seismic-refraction, science-file-converter, phone-seismometer, fft-workbench, digital-filter-designer]
sources:
  - "SAC binary header layout from the SAC user manual (IRIS); miniSEED 2 record layout, blockettes 1000 and 1001 and the Steim-1 and Steim-2 compression from the SEED Reference Manual 2.4 (FDSN). Readers written by fibub and checked against ObsPy 1.5 reading the same files."
  - "Butterworth filters by the bilinear transform with prewarped corners, zero-phase filtering with odd extension and steady-state start, Tukey taper, linear detrend and Hann-window spectrogram: standard signal processing, checked against SciPy 1.18 (butter, sosfilt, sosfiltfilt, detrend, tukey, spectrogram) and NumPy's FFT."
  - "S−P distance d = (tS − tP)·Vp·Vs/(Vp − Vs) for a straight path in a uniform medium; the default speeds of 6 and 3.5 km/s are rounded typical crustal values. The example earthquake is made up by fibub."
flow:
  - { icon: file, label: "Open file" }
  - { icon: sliders, label: "Filter" }
  - { icon: pointer, label: "Pick P, S" }
  - { icon: chart, label: "Spectrum" }
---

## What it does

A seismogram is a record of ground motion against time. Seismometers and data centres store them in two common formats: **SAC** (one trace per file, used for analysis) and **miniSEED** (records of compressed samples, used for archives and real-time feeds). This page opens both, in your browser, and lets you:

- See **several traces stacked** on one time axis, with zoom, pan (drag sideways) and a typed time window.
- **Remove the trend** (the mean, or a best-fit straight line) and **taper** the ends with a half cosine.
- Apply a **Butterworth filter** (bandpass, highpass or lowpass), either one pass (causal) or **zero phase** (forwards and backwards).
- Look at the **amplitude spectrum** with its dominant frequency, and a **spectrogram** (how the frequency content changes with time).
- **Pick P and S arrivals** by tapping, get the S − P time and the distance it implies, and download picks and the traces in view as CSV.

Files are read in your browser and never uploaded. miniSEED files with several channels, or with gaps, are split into one trace per channel and continuous piece.

Record your own traces with the [[phone-seismometer]], and send your P and S picks on to the [[earthquake-locator]] to find where the earthquake was.

## How to use it

1. Press **Open SAC or miniSEED files** and pick one or more files (or drop them onto the page). The table lists each trace with its start time, sampling rate and length; untick a trace to hide it.
2. Choose the **processing**. The default removes a straight line, tapers 5 % at each end and applies a 1 to 15 Hz bandpass of order 2, zero phase, which suits local earthquakes. For distant earthquakes try 0.02 to 1 Hz; for noise studies, no filter.
3. Zoom in on the part you want with **Zoom in** or by typing **From** and **To** in seconds. Drag sideways to move along.
4. With *A tap on a trace* set to **picks P**, tap the first arrival. The page switches to **picks S** for the next tap. Tap again to move a pick; remove picks in the table.
5. Under **Spectrum**, choose a trace. The spectrum and spectrogram use only the time window you are looking at, so zoom in on a wave to see its own frequencies.

## What each setting does

- **Order** is the number of poles per corner: higher orders cut more steeply but ring more. Zero phase doubles the effective steepness and has no delay.
- **Same scale for all** draws all traces at one amplitude scale, so you can compare components; **each trace fills its row** shows small signals best.
- The **spectrogram window** sets the trade-off between time and frequency detail: longer windows give finer frequency steps but blur in time.

## Worked example

The example is a made-up small local earthquake recorded at 100 samples per second on three components. After the default processing, zoom to 10 to 25 s. The P wave arrives at about 12.4 s, strongest on the vertical (HHZ); the larger S wave arrives at about 19.6 s, strongest on the horizontals. With picks at those times, the S − P time is 7.20 s and, with Vp = 6 and Vs = 3.5 km/s, the distance is **60.5 km**. Zoom to the S wave on HHN (19.5 to 24 s) and the dominant frequency is close to 2.5 Hz, the frequency the example was made with.

## FAQ

**Which files are not read?** SAC text (alphanumeric) files, SEG-Y, GSE, full SEED volumes, miniSEED 3, and miniSEED records without blockette 1000. Steim-3 and older encodings are refused with a message.

**Is the amplitude in ground motion units?** No: the traces are shown in the units of the file, usually raw counts. Removing the instrument response needs the station's response file, which this page does not do.

**Where do I locate the earthquake?** Use the S − P times from three or more stations in the [Earthquake locator](/science/earthquake-locator/).

**Is my data sent anywhere?** No. Everything happens on this page.
