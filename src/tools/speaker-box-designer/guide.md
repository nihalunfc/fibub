---
name: Speaker box designer
num: 942
shelf: science
code: T677
section: acoustics-and-wave-physics
title: "Speaker box designer: sealed and ported enclosure response from Thiele-Small parameters, port length and f3"
summary: "Type a woofer's Thiele-Small parameters (Fs, Qts, Vas) and compare a sealed box with a ported one: the low-frequency response curves, the −3 dB point f3, Qtc and any bump, the port length for your tuning with end corrections, a rough port air speed and the driver's sensitivity. Or size a sealed box for a chosen Qtc."
status: live
ads: true
order: 5
icon: chart
works: offline
updated: 2026-11-09
related: [standing-waves, room-acoustics, decibel-distance, filter-designer, audio-spectrum-analyser]
sources:
  - "Thiele, A. N. (1961) and Small, R. H. (1972, 1973), closed-box and vented-box loudspeaker systems, J. Audio Eng. Soc.: the 2nd-order closed-box and 4th-order vented-box transfer functions with box losses QL, used as formulas."
  - "Port length from the Helmholtz resonance with end corrections 0.8216 and 0.6133 times the radius (flanged and free ends); reference efficiency 4π²·fs³·Vas/(c³·Qes) and 112.1 + 10·lg η0 dB at 1 W, 1 m."
  - "Checked against an independent NumPy model of the acoustic equivalent circuit (driver, box compliance, port mass, leak) with SciPy root finding for f3, and against the Butterworth B4 alignment. The example driver is made up."
flow:
  - { icon: sliders, label: "Driver" }
  - { icon: ruler, label: "Box" }
  - { icon: chart, label: "Response" }
  - { icon: target, label: "Port" }
---

## What it does

A woofer on its own makes little bass: the sound from the back of the cone cancels the front. Putting it in a box stops that, and the box's air then acts as an extra spring. This designer uses the driver's **Thiele-Small parameters** to predict the low-frequency response of two kinds of box side by side:

- a **sealed box** (closed box): a smooth second-order roll-off of 12 dB per octave, described by the system resonance **fc** and total **Qtc**;
- a **ported box** (vented, bass reflex): a tuned port extends the bass lower, then falls at 24 dB per octave below the tuning frequency **fb**.

It gives each box's **f3** (where the response is 3 dB down), whether there is a **bump**, the **port length** for your port size with end corrections, a rough worst-case **port air speed**, the cone's **displacement volume** and the driver's **sensitivity** from Qes. It can also **size a sealed box** for a chosen Qtc.

Design the crossover with the [[filter-designer|analog filter designer]], and check the room the speaker will play in with the [[room-acoustics|room acoustics calculator]].

## How to use it

1. Copy **Fs, Qts and Vas** from the driver's data sheet. Qes, Sd and Xmax are optional extras.
2. For the sealed box, type a **net volume**, or type a **target Qtc** and press **Size the box for this Qtc**.
3. For the ported box, type the **net volume**, the **tuning frequency fb**, the **losses QL** (7 if unsure), and the **port diameter** and number of ports.
4. Compare the curves. Download the response as CSV, or the report as an image, PDF or Word file.

## Worked example

The made-up example driver has Fs 35 Hz, Qts 0.38, Vas 60 L and Qes 0.42, with a 220 cm² cone and 6 mm of Xmax. In a **30 L sealed box** the page shows fc 60.6 Hz and **Qtc 0.658**, and **f3 65.6 Hz**: no bump, a smooth roll-off. In a **50 L ported box tuned to 35 Hz** with QL 7, **f3 falls to 37.2 Hz** with no bump. The port, one 7.5 cm tube, must be **161.4 mm** long, and its worst-case air speed is 6.57 m/s, well below the 17 m/s where ports start to chuff. The driver's sensitivity works out at **89.9 dB** for 1 W at 1 m (η0 = 0.598 %). The driver alone in a wall would reach only 79.4 Hz.

Type 0.707 as the target Qtc and press the button: the sealed box becomes 24.37 L with f3 65.2 Hz. Retune the port to 40 Hz and a +0.6 dB bump appears above the tuning.

## Tips

- Drivers with Qts below about 0.4 usually suit ported boxes; above about 0.5, sealed boxes.
- A room adds a lot of bass below about 50 Hz in a small room, so a sealed box that measures "too early" in this model often sounds deep at home.
- Leave room for the driver, the port tube and bracing: they take volume away from the net figure.

## FAQ

**Why does my port come out "too short"?** The end corrections alone already tune the box lower than you want; use a narrower port or a smaller box.

**Why is the curve different from my measurement?** The model is free-field and low-frequency only: no baffle step, room, voice-coil inductance or cone break-up, and the parameters on data sheets vary from driver to driver. Measure your own driver for the best result. For study and planning, not a substitute for professional judgement.
