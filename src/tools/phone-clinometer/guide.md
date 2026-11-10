---
name: Phone clinometer
num: 866
shelf: science
code: T602
section: structural-geology
title: "Phone clinometer: measure strike and dip, dip direction, trend and plunge with your phone (compass-clinometer)"
summary: "Lay your phone on a rock surface to measure strike and dip (or dip direction and dip), or along a lineation for trend and plunge. Averaged over a second, corrected by the magnetic declination you enter, logged offline in this browser with notes and an optional position, and exported as CSV for the stereonet plotter."
status: live
ads: false
order: 866
icon: compass
works: offline
updated: 2026-11-09
related: [stereonet, drill-hole-composites, apparent-dip, cross-section-profile, paleostress-inversion, utm-converter, gps-track-analyser]
sources:
  - "Device orientation angles and the rotation R = Rz(alpha)·Rx(beta)·Ry(gamma) from the W3C DeviceOrientation Event specification; checked against SciPy's Rotation (intrinsic Z-X'-Y'' Euler angles) for 48 angle sets."
  - "Strike and dip (right-hand rule), dip direction, trend and plunge from the plane's normal and the line's direction vector: standard structural geology, written by fibub."
  - "Magnetic declination is typed by the user; no magnetic-field model or table is included. The demo angles are made up."
flow:
  - { icon: pointer, label: "Sensor on" }
  - { icon: compass, label: "Lay phone" }
  - { icon: table, label: "Log" }
  - { icon: download, label: "CSV" }
---

## What it does

A geologist's compass-clinometer measures how rock surfaces and lines are oriented. Your phone has the same sensors: an accelerometer that knows which way is down and a magnetometer that knows magnetic north. This page uses them to measure:

- **Planes** (bedding, joints, foliation, faults): lay the phone flat on the surface. The page gives the **strike and dip** by the right-hand rule (the plane dips to your right when you face along the strike) or the **dip direction and dip**.
- **Lines** (lineations, fold axes, slickenlines): lay the phone's long edge along the line. The page gives the **plunge and trend**, pointing down the line.

Each reading is **averaged over one second** of sensor data and shows its **spread** (how much the phone moved). Directions are corrected by the **magnetic declination** you type, so they are from true north. Readings go into a **field log** with your note and, if you press the button, your **position**. The log works offline, is kept in this browser only once you tick **Remember my readings in this browser** (nothing is saved until then), and downloads as CSV, including files ready for the [Stereonet plotter](/science/stereonet/).

Plot your readings on the [[stereonet]], and turn them into a section with the [[cross-section-profile|cross-section tool]].

## How to use it

1. Type the **declination** for your area (east positive). Your map's margin or a magnetic-model calculator gives it; it changes slowly over the years.
2. Press **Turn on the sensor**. On iPhones, allow Motion & Orientation access.
3. For a plane, lay the phone's back flat on the surface (screen up; screen down also works on an overhang). For a line, lay the long edge along it.
4. Type a note if you like, press **Take a reading** and hold still for a second.
5. Repeat. Download the log or the stereonet files when you are done.

## Worked example (demo)

On a computer, open the demo and tick *Use these angles*. With alpha 300°, beta 40° and gamma 0°, the phone's top points to 060° and is raised 40°, so the surface dips 40° towards 240°: the page shows **Strike/dip 150/40.0** (dip direction/dip 240/40.0). Type a declination of 5 and it becomes 155/40.0. With the declination back at 0 and *Measure a line* chosen, the same position reads **plunge → trend 40.0 → 240** along the long edge. To check a plane, type dip direction 120 and dip 35, press *Set the angles for this plane*, and the page reads 030/35.0.

## Accuracy

- Phone compasses are easily thrown off by magnets, steel (hammers, cars, phone cases with magnets) and power lines. Keep metal away and compare with a real compass now and then. Errors of 5° or more in direction are common; dips are usually better than 1°.
- A phone case or a rough surface tilts the phone: use a notebook or clipboard laid on the surface for an average plane.
- On a near-horizontal plane the dip direction is poorly defined; on a near-vertical line the trend is.

## FAQ

**Does it need a signal?** No. Once the page has loaded it works offline. Position comes from the phone's GPS when you ask.

**Where is my log kept?** Nowhere until you tick **Remember my readings in this browser**; then only in this browser on this device, positions included. Untick it to remove the saved copy. Nothing is sent anywhere. Delete readings one by one, or all of them.

**Which north does it use?** Phones report magnetic north (Android and iPhone compass readings); adding your declination gives true north.
