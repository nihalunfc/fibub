---
name: Orbit elements
num: 831
shelf: science
section: spaceflight-and-astrodynamics
title: "Orbit elements"
summary: "Turn classical orbital elements into position and velocity vectors and back for any central body, with the true, mean, eccentric and hyperbolic anomalies, period, apsides and energy. Read every field of a two-line element set with its checksums, propagate the orbit by Kepler's equation and see it in a 3D view you can turn, or flat on the reference planes."
status: live
ads: true
order: 831
icon: orbit
works: offline
updated: 2026-11-09
related: [satellite-tracker, orbit-transfer-calculator, porkchop-plot, rocket-equation, link-budget-calculator, two-body-orbit, cubesat-power-budget]
sources:
  - "Two-body orbital mechanics (conic sections, the anomalies, Kepler's and Barker's equations, the conversions between elements and state vectors) is standard textbook material; the code is written by fibub and checked against an independent NumPy implementation, SciPy's solve_ivp integrating the two-body equations, SciPy brentq, the sgp4 package's TLE reader and Vallado's RV2COE worked example."
  - "Gravitational parameters and radii of the preset bodies are general physical constants. The ISS example is a public NORAD two-line element set from 2008 (a common test case); the other examples are made up."
flow:
  - { icon: orbit, label: "Elements" }
  - { icon: convert, label: "r and v" }
  - { icon: clock, label: "Propagate" }
  - { icon: compass, label: "3D view" }
---
## What it does

An orbit around one body can be described two ways. **Classical (Keplerian) elements** give its size and shape (semi-major axis a and eccentricity e), how it is tilted (inclination i and the longitude of the ascending node Ω), where its closest point is (the argument of periapsis ω), and where the object is along it (an anomaly). **State vectors** give the position r and velocity v at one moment. This page turns one into the other for any central body, and adds:

- **All the anomalies**: true anomaly ν, eccentric anomaly E (ellipse), hyperbolic anomaly H (hyperbola), Barker's D = tan(ν/2) (parabola), and the mean anomaly M. You can give the position as any of them, or as the time since periapsis.
- **Orbit facts**: periapsis and apoapsis distance and altitude, speeds there, period and mean motion, specific energy −μ/2a, angular momentum, flight-path angle, and for a hyperbola the excess speed v∞, C3 and turn angle.
- **Two-line element sets (TLEs)**: every field is read (catalogue number, international designator, epoch, ṅ/2, n̈/6, B*, element set and revolution numbers), and both checksums are checked. The mean motion gives a by Kepler's third law.
- **Propagation** by Kepler's equation, with a table and a CSV download.
- **A drawing** you can turn in 3D, or view flat on the x-y, x-z and y-z planes or in the orbit's own plane.

The special cases are handled: a circular orbit has no periapsis, so ω is set to 0 and ν becomes the argument of latitude; an equatorial orbit has no node, so Ω is 0 and ω becomes the longitude of periapsis; a circular equatorial orbit uses the true longitude.

Plan a change of orbit with the [[orbit-transfer-calculator|orbit transfer calculator]], and follow a real satellite across your sky with the [[satellite-tracker|satellite tracker]].

## How to use it

1. Pick the central body, or type μ = GM (km³/s²) and a radius.
2. Choose what you know: elements, state vectors, or a TLE. The examples fill in each kind.
3. For elements, give the size as a, the periapsis distance q or the semi-latus rectum p. A parabola needs q or p, and a hyperbola has a negative a.
4. Read the results, then use "Edit as elements" or "Edit as state vectors" to go the other way.
5. Set a span and step to propagate, and turn the drawing with the sliders or by dragging.

## Worked example

Vallado's textbook example has r = (6524.834, 6862.875, 6448.296) km and v = (4.901327, 5.533756, −1.976341) km/s around Earth (μ = 398600.4418 km³/s²). The page gives p = 11067.80 km, a = 36127.34 km, e = 0.83285340, i = 87.8691°, Ω = 227.8983°, ω = 53.3849° and ν = 92.3352°, a period of 18.983 h and a periapsis of 6038.6 km, which is below Earth's radius: as the page warns, this orbit would hit the surface.

The page opens on a made-up Molniya-like orbit: a = 26600 km, e = 0.74, i = 63.4°, ω = 270°, so the long, slow apoapsis is over the northern hemisphere. The period is 11.993 h, the periapsis altitude 537.9 km and the apoapsis altitude 39905.9 km.

## Tips

- TLEs hold SGP4 mean elements, not two-body ones, so positions here differ by a few km from SGP4. For passes and ground tracks use the satellite tracker.
- Keep units in km and km/s; μ for the Sun is about 1.327 × 10¹¹ km³/s².
- Two-body propagation is exact for two point masses but ignores the body's flattening, drag and other bodies, which matter over days for low orbits.

## FAQ

**Why is ν different from what I typed after a round trip?** For circular or equatorial orbits some angles are undefined, and the page uses the standard replacements described above.

**What frame are the vectors in?** Whatever inertial frame your elements refer to: x toward the reference direction (for Earth, usually the vernal equinox) and z along the reference pole.

**Is anything sent anywhere?** No. Everything runs in your browser.
