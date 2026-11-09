---
name: Phone seismometer
num: 885
shelf: science
section: geophysics-and-seismology
title: "Phone seismometer: record vibrations with your phone's accelerometer, PGA, spectrum and dominant frequency"
summary: "Lay your phone on a table and record its accelerometer: a live trace of the three components, gravity removed by a highpass filter, peak ground acceleration (PGA), the amplitude spectrum and dominant frequency. Save recordings in this browser, download CSV or SAC. A toy for learning, not an earthquake detector."
status: live
ads: true
order: 885
icon: chart
works: offline
updated: 2026-11-09
related: [seismogram-viewer, earthquake-locator, fft-workbench, digital-filter-designer, phone-clinometer]
sources:
  - "Motion readings from the W3C DeviceOrientation Event specification (devicemotion, accelerationIncludingGravity in m/s²; device axes x across the screen, y along it, z out of the screen)."
  - "Linear resampling, Butterworth highpass by the bilinear transform with zero-phase filtering, Tukey taper and amplitude spectrum: standard signal processing written by fibub, checked against NumPy (interp, rfft) and SciPy 1.18 (butter, sosfiltfilt, detrend, tukey). Standard gravity g = 9.80665 m/s²."
  - "The words for how strong shaking feels are fibub's rough guide for scale, not an intensity scale. The demo recording is made up by fibub."
flow:
  - { icon: pointer, label: "Start" }
  - { icon: curve, label: "Record" }
  - { icon: sliders, label: "Gravity off" }
  - { icon: chart, label: "PGA, Hz" }
---

## What it does

Every smartphone has an **accelerometer**: a tiny sensor that measures acceleration along three axes, about 50 to 200 times a second. Lying still on a table it reads gravity, about 9.8 m/s² on the axis out of the screen, plus small wobbles from anything that shakes the table. This page turns your phone into a **toy seismometer**:

- **Records** the three components after you press Start (your phone may ask for permission first; the page never starts by itself) and draws the last 10 seconds live.
- **Resamples** the readings evenly (phones deliver them at slightly uneven times) and **removes gravity and slow tilt** with a zero-phase Butterworth highpass filter.
- Measures the **peak ground acceleration (PGA)** on each component, in m/s² and as a percentage of g, plus the 3-D and horizontal peaks.
- Shows the **amplitude spectrum** and the **dominant frequency** of each component.
- **Saves** recordings in this browser only, and downloads them as **CSV** or as a **SAC** file to open in the [Seismogram viewer](/science/seismogram-viewer/) or seismology software.

**It is a toy for learning, not an earthquake detector.** A phone is thousands of times less sensitive than a real seismometer, its sensor drifts, and footsteps or a closing door look like earthquakes. It gives no warnings. For real earthquake information follow your national geological survey or civil protection agency.

Open your recordings in the [[seismogram-viewer]] to pick arrivals, and look at the frequencies in a shake with the [[fft-workbench]].

## How to use it

1. Lay the phone flat on a solid surface, screen up, and press **Start recording**. On iPhones, allow Motion & Orientation access when asked.
2. Don't touch the phone. Make something shake: walk past, drop a book on the floor nearby, or record a washing machine.
3. Press **Stop** (or wait for the time limit). The analysis appears below.
4. Adjust **Remove below** (the highpass corner; 0.5 Hz removes gravity and slow tilt) and optionally **Remove above** to cut fast noise. Higher filter orders cut more steeply.
5. **Save this recording** to keep it in this browser, or download the CSV or SAC.

On a computer (which has no accelerometer), open a CSV recording from a phone app, or press **Use the demo recording**.

## Worked example

The demo is a made-up 30-second recording of a phone on a table, with readings about every 16 ms (62.5 a second, slightly uneven) resampled to 63 Hz. A lorry passes from 8 to 16 s and a door is slammed at 21 s. With the default 0.5 Hz highpass, the page reports **PGA 0.314 m/s² (3.20 % g) on z**, at 21.06 s: the door. The dominant frequency on z is **3.17 Hz** (the door's knock) and on y **12.0 Hz** (the lorry's hum, which shakes y most). Set Remove above to 5 Hz and the lorry almost disappears from y, because its 12 Hz is filtered out.

## Good to know

- The axes are the phone's own: x across the screen, y along it, z out of the screen. Lying flat, z is vertical.
- Phones deliver readings unevenly and some stop when the screen locks; keep the screen on. The page states the spread of the intervals.
- A sharp tap on the table gives a huge PGA: that is why it says "check your recording" for large values.

## FAQ

**Is my recording sent anywhere?** No. Readings stay on this page. Saved recordings are kept in this browser's storage on this device until you delete them.

**Why is the PGA not zero when nothing happens?** The sensor has noise of a few thousandths of a m/s², plus building vibration.

**Can I use it for a science fair?** Yes: compare floors of a building, machines, or how a heavier table damps vibration.
