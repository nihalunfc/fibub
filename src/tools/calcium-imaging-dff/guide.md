---
name: Calcium imaging ΔF/F
num: 350
shelf: science
code: T265
section: neuroscience
title: "Calcium imaging ΔF/F calculator: neuropil subtraction, sliding percentile baseline, event detection and ROI heat map (free)"
summary: "Paste or open fluorescence traces for many ROIs (CSV or Excel) and get ΔF/F with a sliding-window percentile, first-N-frames or whole-trace baseline, optional neuropil subtraction, threshold event detection in units of noise, a heat map of all ROIs and CSV downloads. Runs in your browser."
status: live
ads: true
order: 350
icon: chart
works: offline
updated: 2026-11-09
related: [period-finder, trend-analyser, plot-maker, hemocytometer, spike-train-analyser, fluorescence-image-analyser, stereotaxic-helper, time-series-analyser]
sources:
  - "ΔF/F = (F − F0)/F0 with F0 from a running low percentile, as widely used in two-photon imaging (e.g. Jia et al., Nature Protocols 6 (2011) 28–35, for the idea of a running baseline; Suite2p and CaImAn documentation for neuropil factor 0.7 as a common default). Robust noise as 1.4826 × median absolute deviation. Written by fibub; methods only, no data copied."
  - "Checked in the tests against an independent NumPy 2.5 calculation (np.percentile over each clipped window, np.median, np.std(ddof=1), run finding with np.argmax), and against the made-up transients planted in the example."
  - "The example traces are synthetic and made up for this page."
flow:
  - { icon: table, label: "Traces" }
  - { icon: sliders, label: "Baseline" }
  - { icon: target, label: "Events" }
  - { icon: chart, label: "Heat map" }
---

## What it does

Calcium imaging gives a fluorescence trace F for every region of interest (ROI, usually a cell body). Raw F depends on how bright the cell is and drifts as the dye bleaches, so activity is reported as **ΔF/F**: the change from a resting baseline F0, as a fraction of that baseline. This tool:

1. optionally subtracts **neuropil**: F − r × Fneu, removing the glow of the surrounding tissue that leaks into each ROI;
2. finds the **baseline F0** for each ROI;
3. computes **ΔF/F = (F − F0) / F0** for every frame;
4. detects **events**: stretches where ΔF/F rises more than a chosen number of noise units above its resting level;
5. draws a **heat map** of all ROIs, plus the trace, baseline and events of any one ROI.

Everything runs in your browser; files are never uploaded.

Measure the cells in your images first with the [[fluorescence-image-analyser]], and compare the events with electrode recordings in the [[spike-train-analyser]].

## How to use it

1. Paste or open a table with **one column per ROI** and one row per frame (Suite2p's F.npy saved as CSV, ImageJ "Multi Measure" results, or any spreadsheet). A first column named **time** or **t** sets the frame rate; otherwise type it.
2. If you have **neuropil traces** (the same shape, same ROI order), open the "Neuropil traces" box and paste them, and set the **neuropil factor r** (0.7 is a common choice; 0 turns it off).
3. Pick a **baseline**:
   - **Percentile of a sliding window**: for each frame, the chosen percentile (8 by default) of the frames within half a window either side. It follows slow drift and bleaching while staying under the transients. The window is clipped at the start and end of the recording.
   - **Mean of the first N frames**: one value per ROI from a quiet stretch at the start, for short trials with a pre-stimulus period.
   - **Percentile of the whole trace**: one value per ROI, for short recordings with little drift.
4. Set the **event threshold** in noise units, the **noise estimate** and the **shortest event** in frames.
5. Pick an ROI to see its trace in detail, then download ΔF/F or the events as CSV, or a report.

## What each option does

- **Noise estimate**: robust uses 1.4826 × the median absolute deviation of ΔF/F around its median, which equals the standard deviation for pure noise but is barely moved by the transients. Standard deviation uses the sample SD around the mean; with many transients it is larger, so fewer events pass.
- **Event threshold**: an event starts when ΔF/F rises above median + k × noise (mean + k × SD) and ends when it falls back. Each run of at least the **shortest event** frames counts once; its peak is the highest ΔF/F in the run. Two transients that overlap without dropping below the threshold count as one.
- **Colour scale top**: the ΔF/F drawn at full colour in the heat map; blank uses the 99th percentile of all values.

## Worked example

The example is made up: 8 ROIs imaged at 20 frames/s for 60 s, each with its own brightness, slow bleaching, random transients and 0.7 × a shared neuropil signal. With the defaults (neuropil factor 0.7, 8th percentile of a 30 s window, 3 × robust noise, at least 3 frames) the page finds **54 events**, **6.75 per ROI per minute**, and all 8 ROIs active. ROI1 has a median F0 of 103.3, noise σ of 0.0358 ΔF/F, a threshold of 0.161, **8 events** and a maximum ΔF/F of 1.20.

## Tips

- The sliding window should be several times longer than a transient and its decay; 30–60 s is typical for GCaMP.
- Very active cells push a percentile baseline up. Use a lower percentile, or a longer window.
- Check the "One ROI" plots: the baseline line should hug the bottom of the trace.
- This is simple thresholding, not spike inference. For spike rates use a deconvolution method.

## FAQ

**Why must the baseline be positive?** ΔF/F divides by F0. Too much neuropil subtraction can push F − r × Fneu to zero or below; the tool stops with a message and you can lower r.

**Is my data uploaded?** No. Everything is computed in your browser.

**Does it match NumPy?** Yes: the baseline, ΔF/F, noise and events are checked in the tests against an independent NumPy calculation.
