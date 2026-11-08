---
name: Interferometer uv-coverage
num: 67
shelf: science
section: radio-astronomy
title: "Radio interferometer uv-coverage planner: baselines, resolution and the dirty beam"
summary: "Lay out an array of radio dishes, pick a source and an observing time, and see the uv tracks Earth's rotation sweeps out, the resolution, the largest scale you can image and the dirty beam."
status: live
ads: true
order: 20
icon: telescope
works: offline
updated: 2026-11-08
related: [radio-telescope-calculator, link-budget-calculator, redshift-calculator, sky-coordinates, object-altitude]
flow:
  - { icon: telescope, label: "Array" }
  - { icon: clock, label: "Observation" }
  - { icon: target, label: "Beam" }
---

## What it does

A radio interferometer links several dishes so that together they act like one telescope as wide as the array. Each pair of dishes, a **baseline**, measures one spatial frequency of the sky's brightness: one point in the **uv plane**. As Earth turns, each baseline's projection changes and its point sweeps along an arc. More dishes and longer observations fill the uv plane better, and the better it is filled, the cleaner the image.

This planner takes your antenna layout, the observing frequency, the source's declination and the hour-angle range, and draws three pictures: the array, the uv coverage, and the **dirty beam** (the image a single point source would make). It reports the number of baselines, the shortest and longest in metres and wavelengths, the resolution, the largest structure you can image, the single-dish field of view, and the beam size measured from the actual coverage.

## How to use it

1. Pick a **layout**, or type your own antenna positions: east and north in metres from any reference point, one dish per line. A name in front is fine, and a third number (height) is used if given.
2. Set the **dish diameter**, the array's **latitude** and the observing **frequency** (1.42 GHz is the hydrogen line).
3. Set the source's **declination** and the **hour-angle** range, plus the lowest elevation you will observe at. Times below it are skipped.
4. Compare: try a single snapshot (start = end = 0), a full track, a source at low declination, or a more compact array.
5. Download the uv points as a CSV, or the page as a PNG, PDF or Word file.

## How it is worked out

Baselines in local east, north and up are turned into equatorial X, Y, Z for the array's latitude, then into u and v for each hour angle H and declination δ: u = X sin H + Y cos H and v = −X sin δ cos H + Y sin δ sin H + Z cos δ, in wavelengths. The tool samples every 5 minutes. Each sample and its mirror image (the sky is real, so the uv plane is symmetric) is added to a 256 × 256 grid with natural weighting. A two-dimensional FFT then gives the dirty beam. The beam's half-power widths east–west and north–south are measured on that image. Resolution is quoted as λ divided by the longest baseline, the largest scale as 0.6 λ divided by the shortest, and the primary beam as 1.13 λ/D.

## Worked example

The default is a Y-shaped array with three 600 m arms and 27 dishes of 25 m, the layout large arrays use, at latitude 34.08°. It observes a source at declination +30° at 1.42 GHz for eight hours (hour angle −4 to +4), always above 15°. That gives 351 baselines from 24 m to 1,039 m (113 to 4,920 wavelengths) and 34,047 uv points. λ/B<sub>max</sub> is 42″, and the measured dirty beam is about 58″ × 52″. Natural weighting favours the many short baselines, so the beam is a little wider than λ/B<sub>max</sub>. The largest scale is about 18′ and the primary beam 33′. Switching to the 3.6 km arms shrinks the beam to about 9.6″ × 8.7″, but the gaps between the dishes leave stronger sidelobes.

## Frequently asked questions

**Why does a short snapshot give a spiky beam?** One instant gives only one point per baseline, so the uv plane is sparse and the beam has strong sidelobes. Earth's rotation fills it in: this is Earth-rotation synthesis.

**Why do east–west arrays struggle with sources near the equator?** For a source at declination 0°, the uv tracks of an east–west array collapse onto a line, so it has no north–south resolution.

**What is the largest scale?** The shortest baseline can't measure structure much bigger than about λ/B<sub>min</sub>. Anything smoother is "resolved out" and missing from the image unless you add single-dish data.

**Does it work offline?** Yes. Everything is worked out in your browser.
