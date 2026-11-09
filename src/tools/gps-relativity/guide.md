---
name: GPS relativity explainer
num: 970
shelf: science
section: relativity-and-gravitation
title: "GPS relativity explainer: why satellite clocks gain 38 microseconds a day, with the numbers for any orbit"
summary: "Work out how much faster a navigation satellite's clock runs than one on the ground: the general relativity gain from weaker gravity, the special relativity loss from orbital speed, the net microseconds per day, the frequency the clock must be set to before launch, the kilometres of error per day if nobody corrected it, and the periodic eccentricity correction, for GPS, Galileo, GLONASS, geostationary or any orbit."
status: live
ads: true
order: 4
icon: clock
works: offline
updated: 2026-11-09
related: [spacetime-diagram, schwarzschild-orbits, satellite-tracker, orbit-transfer-calculator]
sources:
  - "Gravitational and velocity time dilation in the weak-field, slow-motion limit, the factory frequency offset and the eccentricity correction (2/c²)√(GMa) e sin E: standard results, for example Ashby, N. (2003), Relativity in the Global Positioning System, Living Reviews in Relativity 6, 1 (open access)."
  - "Earth's GM = 3.986004418 × 10¹⁴ m³/s², rotation rate 7.292115 × 10⁻⁵ rad/s and mean radius 6,371 km are standard rounded constants; orbit radii of the presets are rounded."
  - "Checked by fibub against the exact (unexpanded) clock-rate ratio evaluated with mpmath at 30 digits."
flow:
  - { icon: orbit, label: "Orbit" }
  - { icon: clock, label: "Clocks" }
  - { icon: calculator, label: "Offset" }
  - { icon: target, label: "Error" }
---

## What it does

A GPS receiver works out where it is by timing signals from satellites: a timing error of one microsecond is 300 metres of distance. The satellites' atomic clocks therefore have to keep time to a few nanoseconds, and at that level **both kinds of relativity** matter:

- **General relativity:** the satellites sit higher in Earth's gravity well, where clocks run **faster**, by about 45.7 microseconds a day for GPS.
- **Special relativity:** they move at almost 3.9 km/s, which makes their clocks run **slower**, by about 7.1 microseconds a day.

The net effect is a gain of about **38 microseconds per day**. Left uncorrected, positions would drift by around 11 km a day. GPS deals with this by tuning each clock slightly low before launch, so it ticks at the right rate in orbit, and receivers apply a small periodic correction for the slightly elliptical orbit.

This explainer shows each of these numbers for any orbit and receiver: the two effects separately and together, the frequency to set on the ground, the error if ignored, the eccentricity correction, and the orbit radius at which the two effects cancel.

## How to use it

1. Pick an **orbit** (GPS, Galileo, GLONASS, geostationary or a low orbit) or type a **radius** from Earth's centre.
2. Give the orbit's **eccentricity** (0 for a circle).
3. Set the **receiver's latitude and height**: the ground clock moves with Earth's rotation, faster at the equator.
4. Optionally change the satellite clock's **nominal frequency** (10.23 MHz for GPS).
5. Read the results and chart; download the rates as CSV or a report.

## Worked example

For a GPS orbit of 26,560 km radius and a receiver on the equator at sea level, the page shows **Satellite clock gains 38.6 µs per day**: +45.72 µs/day from gravity and −7.11 µs/day from speed. The clock must be set to **10.22999999543 MHz** on the ground, about 0.0046 Hz low, to tick at 10.23 MHz in orbit. Ignored, the offset would grow by **11.6 km of range error per day**, about 482 m an hour. An eccentricity of 0.01 adds a periodic correction of **±22.9 ns**, or ±6.86 m of range. Commonly quoted figures (38.4 µs/day) differ slightly because the real system uses Earth's exact shape and gravity.

Choose the low orbit (6,780 km) and the sign flips: the clock **loses 24.5 µs per day**, because below about **9,540 km** radius the speed effect wins.

## Tips

- Move the receiver to the pole: its own clock no longer moves with Earth's rotation, which changes the net by about 0.1 µs/day.
- The break-even radius is about 1.5 Earth radii: orbiting clocks above it run fast, below it slow.
- Geostationary clocks gain more (about 46.6 µs/day) because they are higher and slower.

## FAQ

**Is GPS really corrected for relativity?** Yes. The clocks are offset before launch and receivers apply the eccentricity correction. Without relativity, the system would not work for more than a few minutes.

**What about the Sagnac effect?** Earth turns while a signal travels from satellite to receiver, adding up to about 100 ns depending on direction. It is a correction to each signal's travel time, not to the clock rate, and is not computed here.

**Why do these numbers differ a little from official ones?** This tool treats Earth as a round point mass and uses a mean radius. The real system uses the geoid; the difference is well under 1 %.
