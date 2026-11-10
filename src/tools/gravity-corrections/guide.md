---
name: Gravity survey corrections
num: 880
shelf: science
code: T615
section: geophysics-and-seismology
title: "Gravity corrections: drift, latitude (normal gravity), free-air, Bouguer and terrain corrections, with free-air and Bouguer anomalies"
summary: "Paste a day of gravity meter readings with base station repeats. Get drift-corrected observed gravity, normal gravity from GRS80 or WGS84, free-air and Bouguer slab corrections at your density, ring terrain corrections, and free-air, simple and complete Bouguer anomalies as a table, a profile plot and a CSV."
status: live
ads: true
order: 880
icon: mountain
works: offline
updated: 2026-11-09
related: [earthquake-locator, level-book-reducer, traverse-calculator, plot-maker, magnetic-anomaly, utm-converter, cross-section-profile, uncertainty-calculator]
sources:
  - "Normal gravity: Somigliana's closed formula with the GRS80 constants (Moritz 1980, Geodetic Reference System 1980) and the WGS84 constants (NIMA TR8350.2); general geodetic constants."
  - "Free-air gradient 0.3086 mGal/m, the second-order free-air formula (as given by Hinze et al. 2005, Geophysics 70 J25), the Bouguer slab 2πGρh and the ring-compartment formula of Hammer (1939) are standard results, written by fibub from the formulas; no zone charts or tables are reproduced."
  - "Checked against an independent NumPy reduction of the same survey and SciPy numerical integration of each ring sector."
  - "The example survey, base gravity value, ring radii and heights are made up by fibub."
flow:
  - { icon: table, label: "Readings" }
  - { icon: clock, label: "Drift" }
  - { icon: mountain, label: "Corrections" }
  - { icon: chart, label: "Anomalies" }
---

## What it does

A gravity meter measures tiny differences in the pull of the Earth, a few parts in a hundred million. To see the pull of what is under the ground (an ore body, a buried valley, a salt dome), you must first remove everything else: the meter's drift, the Earth's shape and spin, the height of each station and the hills around it. This page does those **reductions**:

- **Drift.** Gravity meters creep during the day. You read a **base station** several times; the page draws straight lines between those base readings and takes the drift off every station read in between.
- **Observed gravity.** Each drift-corrected reading is tied to the base station's known gravity value. A **meter factor** turns reading units into mGal if your meter needs one.
- **Latitude correction.** Gravity is stronger at the poles. The page computes **normal gravity** on the reference ellipsoid with Somigliana's exact formula and the GRS80 or WGS84 constants.
- **Free-air correction.** Gravity falls by about 0.3086 mGal for every metre you climb. You can also use the second-order formula, which allows for latitude and height squared.
- **Bouguer correction.** The rock between the station and the datum pulls too. It is taken as a flat slab: 2πGρh, about 0.1119 mGal per metre at 2670 kg/m³.
- **Terrain correction.** Hills above and valleys below the station both reduce gravity, so a terrain correction is always added. The ring calculator works it out from the mean height of each compartment of rings around the station.
- **Anomalies.** Free-air anomaly = observed − normal + free-air correction. Simple Bouguer anomaly = free-air anomaly − Bouguer correction. Complete Bouguer anomaly = simple Bouguer anomaly + terrain correction.

Get accurate station heights from the [[level-book-reducer]] before you start, and plot the anomaly along your survey line with the [[plot-maker]].

## How to use it

1. Enter the base station's name as it appears in your table, and its gravity value in mGal.
2. Enter the Bouguer density. 2670 kg/m³ is the usual convention for crustal rock; use your own if you know the local rock.
3. Paste or open the readings in time order: station, time (hh:mm or decimal hours), reading, latitude, elevation in metres, and optionally the distance along the line and a terrain correction in mGal.
4. Read the anomalies in the table and the profile plot, and download the CSV.
5. For terrain, type one ring per line in the ring calculator, read off the total and put it in the station's terrain column.

## Worked example

The example is a made-up line of 11 stations, 200 m apart, over a buried dense body, read between 08:00 and 11:30 with the base read three times. The base readings rise from 2512.300 to 2512.440, so the drift is **+0.040 mGal/h**. At station G04 (800 m along the line, 152.8 m high), the free-air anomaly is **4.519 mGal**, the simple Bouguer anomaly **−12.590 mGal** and, with its 0.21 mGal terrain correction, the complete Bouguer anomaly **−12.380 mGal**. Along the line the complete Bouguer anomaly runs from **−13.967 to −10.945 mGal**, a regional slope with a bump of about 0.8 mGal over the body at 1100 m. The example ring set gives a terrain correction of **0.949 mGal**.

## Good to know

- Elevations matter most. An error of 1 m in height is about 0.2 mGal in the Bouguer anomaly, so survey heights carefully.
- The density you pick changes the Bouguer anomaly wherever the ground is high. If the anomaly mirrors the topography, the density is probably wrong (the Nettleton method).
- Earth tides move gravity by up to about 0.3 mGal over a day. Frequent base readings take most of the tide out with the drift.
- For long lines or mountains, surveys also add a curvature (Bullard B) correction to the slab; it is not included here.

## FAQ

**What is a mGal?** A milligal is 10⁻⁵ m/s², about a millionth of the Earth's gravity.

**Should elevations be above sea level or the ellipsoid?** Modern practice uses heights above the ellipsoid (from GNSS) with normal gravity on the ellipsoid. Older surveys used sea level. Be consistent within a survey.

**Is my data sent anywhere?** No. All the sums are done on this page and nothing leaves your device.
