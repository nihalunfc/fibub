---
name: Light curve period finder
num: 48
shelf: science
section: stellar-astrophysics
title: "Period finder: Lomb-Scargle periodogram and phase folding for variable stars"
summary: "Paste times and brightness measurements, even with gaps and uneven spacing, and find the period with a Lomb-Scargle periodogram, false alarm probabilities, alias checks and a folded light curve."
status: live
ads: true
order: 20
icon: curve
works: offline
updated: 2026-11-08
related: [magnitude-flux-converter, plot-maker, uncertainty-calculator, observing-log]
flow:
  - { icon: table, label: "Paste data" }
  - { icon: chart, label: "Periodogram" }
  - { icon: curve, label: "Fold" }
---

## What it does

Variable stars, eclipsing binaries, rotating asteroids and pulsating stars repeat themselves, but you can only observe them at night, in clear weather, and when they are up. The measurements end up unevenly spaced, so ordinary Fourier methods struggle. The Lomb-Scargle periodogram is the standard answer: it tests every trial period against the data you actually have. This tool finds the strongest periods, tells you how likely each is to be a fluke of noise, and folds the light curve so you can see whether the period is real.

## How to use it

1. Paste three columns: **time** (such as JD or HJD), **value** (magnitude or flux) and, if you have them, **errors**. A header row is fine, and columns can be separated by tabs, commas or spaces.
2. Tick **Values are magnitudes** so brighter points are drawn higher up. Leave **Weight by the errors** ticked so precise points count for more.
3. The period range is set for you: from the whole time span down to five times the average Nyquist limit (astropy's default). For short periods, such as fast rotators or pulsators, type a smaller **shortest period**.
4. Tap a peak in the table to fold the data at its period. Try **twice the period** for eclipsing binaries, whose two eclipses per orbit often make the strongest peak at half the true period.

## What the numbers mean

- **Power** runs from 0 to 1. It is the share of the data's variation that a sine wave at that period explains. The generalised form (Zechmeister and Kürster 2009) also fits the mean, which matters when the data do not cover all phases evenly.
- **False alarm probability** is the chance that pure noise would give a peak at least this high somewhere in the searched range (Baluev 2008, as used in astropy). Below 0.01 is usually taken as a real signal. Simulated pure noise checks this, and it errs on the safe side.
- **Aliases** are extra peaks caused by the observing pattern. Nightly observing makes peaks at 1/P ± 1 cycles per day. The fold with the least scatter is usually the true period.

## Worked example

The example is a simulated RR Lyrae-type star with a period of 0.5672 days: 92 V-band measurements over 43 nights, two to four a night, with errors of 0.02 to 0.04 mag. The best peak is at 0.56713 days with power 0.767 and a false alarm probability far below one in a million. The next peaks, at 1.31086 and 0.36225 days, are its one-day aliases (1/0.56713 − 1 and 1/0.56713 + 1 cycles per day). Folding at 0.56713 days shows the classic fast rise and slow fade, and folding at the aliases gives a scattered mess.

## Frequently asked questions

**How many points do I need?** At least 5 to run, but a reliable period needs a few dozen spread over several cycles.

**Is there a limit?** It handles thousands of points. Very wide period ranges are limited to 400,000 trial frequencies; narrow the range to search in finer detail.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
