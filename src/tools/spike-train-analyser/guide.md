---
name: Spike train analyser
num: 348
shelf: science
section: neuroscience
title: "Spike train analyser: firing rate, ISI histogram, CV, Fano factor, PSTH, raster plot and autocorrelogram (free)"
summary: "Paste spike times for one or more trials or cells and get the firing rate, inter-spike interval histogram, coefficient of variation, Fano factor, a peri-stimulus time histogram, a raster plot and an autocorrelogram, with CSV and report downloads. Runs in your browser."
status: live
ads: true
order: 348
icon: chart
works: offline
updated: 2026-11-09
related: [period-finder, plot-maker, sample-size, uncertainty-calculator, hodgkin-huxley-simulator, calcium-imaging-dff, notch-filter-psd]
sources:
  - "Definitions as in P. Dayan and L. F. Abbott, Theoretical Neuroscience (MIT Press, 2001), chapter 1: firing rate, ISI coefficient of variation (SD with n in the denominator), Fano factor, PSTH and autocorrelogram. Fano factor here uses the sample variance (n − 1) of spike counts across trains. Written by fibub."
  - "Checked in the tests against an independent NumPy 2.5 calculation (np.diff, np.var, np.histogram) on the example, and against the Poisson-process values CV = 1 and Fano factor = 1."
  - "The example spike trains are random and made up for this page."
flow:
  - { icon: table, label: "Spike times" }
  - { icon: chart, label: "Raster" }
  - { icon: sigma, label: "CV, Fano" }
  - { icon: download, label: "Report" }
---

## What it does

Give it the times at which a neuron fired, for one or many trials (or many cells), and it describes the spike trains the way electrophysiologists do:

- **Firing rate**: spikes per second in the window you choose, for each train and on average (± SD across trains).
- **Inter-spike intervals (ISI)**: the gaps between consecutive spikes, as a histogram, with the **coefficient of variation** (CV = SD ÷ mean). A regular, clock-like neuron has a CV near 0; a Poisson (random) one near 1; bursty firing gives more than 1.
- **Fano factor**: the variance of the spike count across trials divided by its mean. It is 1 for a Poisson process and lower when the response is reliable from trial to trial.
- **PSTH** (peri-stimulus time histogram): the firing rate over time, averaged over trials, in spikes per second.
- **Raster plot**: every spike as a tick, one row per train.
- **Autocorrelogram**: how often a neuron fires again at each lag after one of its own spikes. A gap around zero shows the refractory period; side peaks show rhythmic or bursting firing.

Nothing is uploaded; all the sums are done in your browser.

## How to use it

1. Paste your spike times, or open a CSV, text or Excel file. Pick the **layout**: one train per line (a label and a colon at the start are optional), two columns (train label, spike time; one spike per row, as many spike sorters export) or one train per column. Choose whether times are in **seconds or milliseconds**.
2. Set the **window**. It starts as the whole recording, rounded out. Rates, CV and Fano factor use only spikes inside it, so set it to the response period to measure the response.
3. Set the bin widths for the PSTH, the ISI histogram and the autocorrelogram, and the **refractory period** used to flag suspiciously short intervals (often a sign of two cells mixed together by spike sorting).
4. Download the per-train table or the PSTH as CSV, or the whole report as an image, PDF or Word file.

## Worked example

The example is made up: 20 trials of 2 s, firing at about 5 spikes/s at rest and 40 spikes/s between 0.5 and 1 s, with a 3 ms dead time after each spike.

Over the whole 0–2 s window the page shows a mean rate of **12.70 ± 2.48 spikes/s**, a Fano factor of **0.971** and a pooled CV of **1.63**, with 0 of 488 intervals under 2 ms. The CV is high because the rate changes during the trial: short intervals in the response, long ones at rest. Trial 1 has 25 spikes (12.5 spikes/s), a mean ISI of 77.84 ms and a CV of 1.48.

Set the window to 0.5–1 s and the mean rate becomes **36.8 spikes/s**, the Fano factor **0.677** and the CV **0.863**: during the response the firing is close to Poisson but a little more regular, because of the dead time. The PSTH jumps from about 5 to about 40 spikes/s at the stimulus line, and the autocorrelogram is empty within ±3 ms.

## Tips

- Compare CV and Fano factor only within a window where the rate is steady; rate changes inflate both.
- Fano factor depends on the window length. Report the window with it.
- PSTH bins of 10–50 ms suit most responses; smaller bins need more trials.
- Times are taken as they are. If each trial was recorded from its own start, the PSTH is aligned to that start; subtract the stimulus time first if it varies from trial to trial.

## FAQ

**Which standard deviation is used?** The CV uses the SD of the intervals with n in the denominator (as Dayan and Abbott define it). The rate's ± and the Fano factor use the sample variance across trains (n − 1).

**How is the autocorrelogram scaled?** Counts of all spike pairs at each lag, divided by the number of spikes and the bin width: the rate of other spikes at that lag after a spike, in spikes per second. A spike's pairing with itself (lag 0) is left out.

**How many spikes can it take?** Up to a million rows from a file. Very long trains with many spikes make the autocorrelogram slower; use a shorter lag.
