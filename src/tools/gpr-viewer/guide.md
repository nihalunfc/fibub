---
name: GPR radargram viewer
num: 513
shelf: science
section: geophysics-and-seismology
title: "GPR viewer online: open SEG-Y and GSSI DZT ground-penetrating radar files, gain, dewow, background removal, velocity from hyperbolas"
summary: "Open ground-penetrating radar profiles in SEG-Y (rev 0 or 1, IBM or IEEE floats, integers, either byte order) or GSSI DZT format in your browser. Set time zero, dewow, remove the background, add linear, exponential or AGC gain, show depth from a wave speed, fit a hyperbola for the speed, view single traces and save the radargram as PNG."
status: live
ads: false
order: 513
icon: chart
works: offline
updated: 2026-11-09
related: [seismic-refraction, ves-inversion, magnetic-anomaly]
sources:
  - "SEG-Y rev 1 data exchange format (SEG Technical Standards Committee, 2002) and rev 0 (1975): header byte positions and sample formats; IBM System/360 floating point format."
  - "GSSI DZT header layout as read by the open-source readgssi package (Nesbitt, GPL-3.0; layout facts only, no code copied)."
  - "Standard GPR processing (time-zero correction, dewow, background removal, time gains, AGC) and the point-target hyperbola t = (2/v)√((x − x0)² + d²), as in general GPR textbooks such as Jol (ed.), Ground Penetrating Radar Theory and Applications (2009)."
  - "Example profile made up by fibub."
flow:
  - { icon: file, label: "Open file" }
  - { icon: sliders, label: "Process" }
  - { icon: curve, label: "Hyperbola" }
  - { icon: image, label: "PNG" }
---

## What it does

Ground-penetrating radar (GPR) sends short radio pulses into the ground and records the echoes. A line of traces makes a **radargram**: distance along the line across, two-way travel time down. This page opens GPR files in the browser and gives the basic processing you need to look at them:

- **Files**: SEG-Y (rev 0 and rev 1; IBM floats, IEEE floats, 32, 16 and 8-bit integers; big- or little-endian, found automatically) and simple GSSI **DZT** files (8, 16 or 32-bit samples, one or more channels). Trace spacing comes from SEG-Y source coordinates or DZT scans per metre when they are there; you can type it.
- **Time zero**: cut the samples before the direct wave so time 0 is the ground surface. **Find time zero** puts it at the peak of the direct wave in the mean trace.
- **Dewow**: subtracts a running mean along each trace to remove slow drift.
- **Background removal**: subtracts the mean trace (of all traces or a moving window), which clears flat bands like antenna ringing.
- **Gain**: linear (1 + a·t), exponential (a steady number of dB per ns) or **AGC** (each sample divided by the RMS amplitude around it).
- **Depth axis** from a wave speed v: depth = v × time ÷ 2, with the matching relative permittivity ε = (c/v)².
- **Velocity from a hyperbola**: a small object such as a pipe gives a hyperbola. Tap 3 or more points on it and the page fits t² = a x² + b x + c by least squares, which gives v = 2/√a, the apex position and the depth of the target.
- **Trace view** for any trace, and downloads: radargram PNG, trace CSV, and a PNG, PDF or Word report.

Nothing is uploaded: the file is read in this page.

## How to use it

1. Press **Open a GPR file** (or drop it on the page), or try **Use the made-up example**.
2. Check the **time step**. SEG-Y has only a whole number for the sample interval, meant in microseconds, so GPR programs often store picoseconds or nanoseconds there; the page picks the unit that gives a GPR-like time window and tells you which. Type the right value if it is wrong.
3. Set **time zero**, then try dewow, background removal and a gain. Raise the **clip percentile** for less contrast, lower it for more.
4. Tap the radargram to see one **trace** below it.
5. To measure speed, press **Pick a hyperbola** and tap its apex and both arms. Press **Use this speed** to set the depth axis.

## Worked example (made-up profile)

The example is 241 traces at 5 cm (12 m) with 0.125 ns samples over 60 ns, a 400 MHz pulse, a wave speed of 0.1 m/ns, a flat layer at 1.2 m, a dipping layer and two pipes, 0.7 m deep at 4 m and 1.6 m deep at 8.5 m. **Find time zero** gives 6 ns, the peak of the direct wave. With dewow (10 ns), background removal and 0.4 dB/ns exponential gain, both pipes show as hyperbolas. Tapping five points along the one at 4 m gives a speed of about **0.10 m/ns** (ε about 9) and a depth of about **0.7 m**.

## Tips

- Set time zero **before** picking hyperbolas: the fit assumes times are measured from the surface.
- Background removal also weakens flat, real layers. Compare with it on and off.
- AGC makes everything visible but loses true amplitudes; use time gains when amplitudes matter.
- A hyperbola fit gives the average speed above the target. Picks on the far arms help most.
- Samples are held as 32-bit floats, so 32-bit integer data keep about 7 significant digits.

## FAQ

**Which SEG-Y files work?** Rev 0 and 1 with sample formats 1 (IBM float), 2 (32-bit integer), 3 (16-bit integer), 5 (IEEE float) and 8 (8-bit integer), fixed or variable trace length (shorter traces are padded with zeros). Extended text headers in rev 1 are skipped.

**What about other GPR formats?** Many programs export SEG-Y; export to it first.

**Is my survey uploaded?** No. The file is read and drawn in this page only.
