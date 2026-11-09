---
name: Eye-tracking heat map
num: 728
shelf: science
section: cognitive-science
title: "Eye-tracking heat map and fixation finder: I-VT, I-DT, scanpath and areas of interest (free, in your browser)"
summary: "Open a gaze export (time, x, y), find fixations with the velocity (I-VT) or dispersion (I-DT) method, and see a heat map and scanpath over your own stimulus picture. Draw areas of interest to get dwell time, time to first fixation, fixation counts and visits. Download CSV and PNG. Nothing is uploaded."
status: live
ads: false
order: 728
icon: eye
works: offline
updated: 2026-11-09
related: [plot-maker, data-cleaner, reliability-analysis, memory-attention-tasks, reaction-time-experiments, hotspot-density]
sources:
  - "Fixation detection: Salvucci, D. D. and Goldberg, J. H. (2000), Identifying fixations and saccades in eye-tracking protocols (I-VT and I-DT). Method only; no data or tables are copied."
  - "Heat map: a duration-weighted Gaussian kernel, the usual attention map. Written by fibub and checked in the tests against an independent NumPy implementation of I-VT, I-DT, the heat map and the area measures."
  - "The example gaze recording is made up."
flow:
  - { icon: table, label: "Gaze data" }
  - { icon: eye, label: "Fixations" }
  - { icon: image, label: "Heat map" }
  - { icon: target, label: "Areas" }
---

## What it does

Eye trackers record where someone looks many times a second. Those raw samples are noisy: the eye rests on a spot for a few hundred milliseconds (a **fixation**), then jumps (a **saccade**). This tool turns an exported gaze file into fixations, draws a **heat map** of where attention went, draws the **scanpath** (the order of fixations), and measures **areas of interest** (AOIs) such as a logo, a headline or a button. It works with the CSV or text export of most eye trackers and webcam trackers. Your gaze file and your stimulus picture are read in the browser and never leave your device.

Run the task that goes with it using the [[memory-attention-tasks]] or the [[reaction-time-experiments]], and clean the gaze file first in the [[data-cleaner]].

## How to use it

1. **Gaze data.** Paste or open a file with one row per sample: time, x and y. A header row lets the tool find columns named like *time*, *timestamp*, *gaze_x*, *x*, *y* and *duration*; without a header it reads time, x, y (and duration) in that order. Set the time unit (milliseconds, seconds or microseconds) and whether coordinates are pixels or 0 to 1 of the screen.
2. **Already have fixations?** Choose "Fixations" and give x, y, start time and duration per row; detection is then skipped.
3. **Fixation method.** *I-VT* (velocity threshold) marks each sample slower than the speed limit as part of a fixation; runs of slow samples become one fixation at their average position. *I-DT* (dispersion threshold) takes a window that lasts at least the shortest fixation and keeps it as a fixation while its spread (x range plus y range) stays within the dispersion limit. The **shortest fixation** drops very brief stops. A gap of more than 100 ms in the samples (a blink or lost tracking) ends a fixation.
4. **Picture.** Open the stimulus picture the person looked at; its pixel size is used for the map. Without one, enter the screen size.
5. **Heat map blur σ** sets how far each fixation spreads; **heat weight** chooses duration (longer looks count more) or count. Tick heat map, scanpath and areas to show or hide each layer.
6. **Areas of interest.** Type one rectangle per row (name, left x, top y, right x, bottom y) or drag across the picture to add one.
7. Download fixations and areas as CSV, the map as a PNG at the picture's own size, or the whole report as PNG, PDF or Word.

## What the numbers mean

- **Dwell time**: total duration of fixations inside the area. **Share** is that as a percentage of all fixation time.
- **Time to first fixation**: from the first sample of the recording to the start of the first fixation inside the area. "Never" means no fixation landed there.
- **Visits**: how many separate times the gaze entered the area (a run of fixations inside counts once).
- **Saccade length** and **scanpath length**: straight-line distances between successive fixation centres, in pixels.

## Worked example

The made-up recording has 153 samples at 60 Hz on an 800 × 600 screen. With I-VT at 1,000 px/s and a shortest fixation of 60 ms, the tool finds **7 fixations, mean 279 ms**. The *Logo* area (100, 80 to 220, 180) gets 2 fixations and 567 ms of dwell time (29.1 % of fixation time) over 2 visits, first fixated 350 ms into the recording. The *Photo* area gets 1 fixation of 450 ms, first reached at 1,150 ms. Switch to I-DT with a 40 px limit and 100 ms shortest fixation and you still get 7 fixations, a little longer each because I-DT keeps the edge samples.

## Tips

- Thresholds depend on your tracker's sampling rate and noise. Common starting points are about 30 °/s for I-VT and 1° of dispersion for I-DT; convert degrees to pixels with your setup's pixels per degree.
- Low sampling rates (30 Hz webcams) need a longer shortest fixation and a looser threshold.
- Compare people with the same thresholds, and report the method and settings with your results.

## Frequently asked questions

**Is my data or picture uploaded?** No. Both are read in your browser, and the page works offline once loaded.

**Can I combine several participants?** Paste their fixations one after another with the "Fixations" option; the heat map then shows everyone together. Scanpath order will join across people, so hide the scanpath.

**Why does the heat map look blocky?** It is worked out on a grid about 400 cells across and smoothed when drawn. A larger blur σ gives a smoother map.
