---
name: Schwarzschild orbit plotter
num: 968
shelf: science
code: T703
section: relativity-and-gravitation
title: "Schwarzschild orbit plotter: black hole ISCO, photon sphere, precessing orbits and light bending"
summary: "Pick a black hole mass and follow a particle or a light ray around it using the exact Schwarzschild geodesics. Get the horizon, photon sphere, ISCO and shadow radius in kilometres, the periapsis advance of any bound orbit (compared with the weak-field formula), its energy and angular momentum and effective potential, or a light ray's bending angle, closest approach or capture, all drawn to scale."
status: live
ads: true
order: 2
icon: orbit
works: offline
updated: 2026-11-09
related: [spacetime-diagram, orbit-transfer-calculator, cosmology-calculator, gw-chirp, gps-relativity, two-body-orbit, orbit-elements]
sources:
  - "Schwarzschild geodesics, effective potential, circular orbits, ISCO at 6M, photon sphere at 3M, critical impact parameter 3√3 M, periapsis advance and light deflection: standard results of general relativity, for example Hartle, J. B., Gravity: An Introduction to Einstein's General Relativity (2003), chapters 9 and 15, and Misner, Thorne and Wheeler, Gravitation (1973)."
  - "Periapsis advance in closed form with the complete elliptic integral K (the cubic-root form of the orbit equation), checked by fibub against SciPy solve_ivp integrations; light deflection checked against SciPy quad. GM☉/c² = 1.4766 km is the IAU nominal value, rounded."
  - "Example masses and orbits are made up."
flow:
  - { icon: sliders, label: "Mass" }
  - { icon: target, label: "Orbit" }
  - { icon: orbit, label: "Geodesic" }
  - { icon: chart, label: "Precession" }
---

## What it does

Near a black hole, gravity no longer follows Newton's rules. Orbits do not close: each pass the closest point (the **periapsis**) moves forward, sometimes by more than a full turn. Inside **6M** (where M = GM/c², half the Schwarzschild radius) no circular orbit is stable: this **innermost stable circular orbit (ISCO)** sets the inner edge of accretion discs. At **3M**, the **photon sphere**, light itself can circle the hole, and rays aimed closer than **3√3 M** fall in, which sets the size of the black hole's **shadow**.

This plotter uses the exact equations for a non-spinning (Schwarzschild) black hole:

- the **key radii** for your mass in kilometres, and the ISCO orbital period;
- for a **particle** with chosen closest and farthest distances: the **periapsis advance** per orbit (exact, compared with the weak-field formula used for Mercury), energy and angular momentum per unit mass, the orbit drawn for several turns, and the **effective potential**;
- for a **light ray** with impact parameter b: whether it is **captured**, how much it is **bent**, and its closest approach, drawn among a fan of other rays.

Compare with Newton's orbits in the [[two-body-orbit]], and follow two black holes as they spiral together with the [[gw-chirp|gravitational wave chirp calculator]].

## How to use it

1. Type the **mass** in solar masses (10 for a stellar black hole, 4 × 10⁶ for the Milky Way's centre).
2. Choose **a massive particle** and type the closest and farthest distances r_p and r_a in units of M. Equal values give a circular orbit. Choose how many turns to draw.
3. Or choose **a light ray** and type the impact parameter b in units of M.
4. Read the results and the table of key radii; download the path as CSV or the report.

## Worked example

Take a made-up 10-solar-mass black hole. Its horizon is at **29.53 km**, the photon sphere at 44.3 km and the ISCO at **88.6 km**, where an orbit takes **4.548 ms** as seen from far away. A particle moving between 10M and 30M (148 and 443 km) has E = 0.976315 and L = 4.3759 M c, and its periapsis advances **105.8° per orbit**, far more than the weak-field formula's 72°. The drawing shows the rosette this makes.

A light ray with b = 6M passes 4.453M (65.76 km) from the centre and is **bent by 98.51°**. Make b smaller than 5.196M and it is captured.

## Tips

- Bring r_p close to 4M with a large r_a to see "zoom-whirl" orbits that circle several times near the hole before swinging out.
- Set r_p = r_a = 6 for the ISCO itself: the periapsis advance becomes huge because radial oscillations there take forever.
- With b just above 5.196M, the light ray loops around the photon sphere before escaping.

## FAQ

**Does it work for the Sun or Earth?** Yes, outside the body: it is the exact field of any round, non-spinning mass. Use large r_p and r_a (Mercury's orbit is about 4 × 10⁷ M) and the advance agrees with the weak-field formula.

**What about spinning black holes?** Spin (the Kerr metric) moves the ISCO inwards for prograde orbits and outwards for retrograde ones. It is not included.

**Why use M as the unit?** Every Schwarzschild black hole looks the same in units of M; only the kilometres and seconds scale with mass.
