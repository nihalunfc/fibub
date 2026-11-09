---
name: CubeSat power budget
num: 510
shelf: science
section: spaceflight-and-astrodynamics
title: "CubeSat power budget calculator: eclipse time, solar array power, loads by mode and battery depth of discharge"
summary: "Work out a small satellite's orbit-average power: eclipse time from altitude and beta angle, solar panel output by attitude (nadir, Sun pointing or tumbling) with efficiency, packing, temperature and ageing, loads with duty cycles in each operating mode, and a battery simulation over several orbits with depth of discharge."
status: live
ads: true
order: 510
icon: orbit
works: offline
updated: 2026-11-09
related: [link-budget-calculator, satellite-tracker, orbit-transfer-calculator, solar-cell-iv]
sources:
  - "Eclipse fraction of a circular orbit in a cylindrical shadow, f = acos(√(h² + 2Rₑh) / ((Rₑ + h) cos β)) / π, the standard result in spacecraft design texts. Earth radius 6378.137 km and GM 398600.4418 km³/s² (WGS 84); total solar irradiance 1361 W/m²."
  - "Array power, the nadir-frame Sun direction, the duty-cycle load averages and the battery simulation are written by fibub and checked in the tests against numpy (a brute-force shadow test at 2 million points, explicit body-axis vectors, a fine trapezoid integral and a separate battery model)."
  - "All example values (panel areas, efficiencies, loads, battery) are rounded and made up by fibub, not taken from any datasheet or mission."
flow:
  - { icon: orbit, label: "Orbit" }
  - { icon: star, label: "Panels" }
  - { icon: table, label: "Loads" }
  - { icon: chart, label: "Battery" }
---

## What it does

Every CubeSat team has to show that its satellite makes more energy than it uses, orbit after orbit, and that the battery never drains too deep in the Earth's shadow. This page does that first power budget:

- **Eclipse.** From the altitude and the **beta angle** (the Sun's angle above the orbit plane) it finds the orbit period and the time in the Earth's shadow, treating the shadow as a cylinder: f = acos(√(h² + 2Rₑh) / ((Rₑ + h) cos β)) / π. Above a critical beta the orbit never enters the shadow.
- **Solar array.** Each panel gives 1361 W/m² × area × packing × cell efficiency × derating × cos(Sun angle). Derating covers temperature (cells lose a little power per degree above the temperature their efficiency was measured at), ageing (a percentage per year in orbit) and converter and wiring losses.
- **Attitude.** *Nadir pointing* keeps +Z at the Earth and +X along the velocity, so the Sun angle on every face changes around the orbit and the page follows it. *Sun pointing* keeps one face square to the Sun. *Tumbling* uses the average of a randomly turning body, a quarter of each panel's peak.
- **Loads.** A table of loads with their power and the share of the orbit each is on (duty cycle) in each operating mode, summed into an orbit-average load per mode.
- **Battery.** A step-by-step simulation (1440 steps an orbit) charges the battery with any surplus, drains it with any shortfall, and reports the **deepest depth of discharge** and whether the battery is back where it started after each orbit.

## How to use it

1. **Orbit.** Type the altitude and the beta angle. Try the worst case for your orbit: β = 0 gives the longest shadow.
2. **Panels.** List each panel's face and area, and set the cell figures from your datasheets. Pick the attitude.
3. **Loads.** List each load's power and duty cycle in each mode; the header row names the modes. Pick the mode to plot; the table at the end shows every mode.
4. **Battery.** Type the capacity, the efficiencies and your depth-of-discharge limit, and read the verdict, the charts and the table. Download the simulation as CSV or the report as an image, PDF or Word file.

## Worked example

The example is a **made-up** 3U CubeSat at 500 km with β = 20°, nadir pointing, with four body panels and two wings of 340 cm² facing the sky (−Z). The orbit lasts **94.6 min** with **35.0 min** of shadow (37.0 %). After 80.9 % derating, each panel gives 8.90 W when square to the Sun, and the array averages **10.97 W** over the orbit (17.41 W in sunlight).

In *Nominal* mode the loads average **2.70 W**: 17.30 Wh is made and 4.26 Wh used per orbit, a surplus of +13.05 Wh, and the 20 Wh battery falls to **8.3 %** depth of discharge in the shadow. In *Payload* mode (S-band 25 % and camera 50 % of the orbit) the load is 8.20 W: still energy positive (+4.37 Wh), but the battery drops **25.1 %**, over the 20 % limit. A bigger battery, a shorter payload duty cycle in the shadow, or Sun pointing in sunlight would fix it.

## Tips

- Run the lowest and highest beta angles your orbit will see. A dawn-dusk Sun-synchronous orbit can have no shadow at all for months.
- Use end-of-life numbers (several years of degradation) for the design case.
- Duty cycles average a load over the orbit. A big load switched on only in the shadow drains the battery more than its average suggests; the simulation does not model that timing.
- Leave margin: early budgets usually add 10 to 20 % on the loads for things not yet known.

## FAQ

**Where do I find the beta angle?** It depends on the orbit's inclination, its right ascension and the date. Mission analysis tools give it over the year; for a first budget, try 0° and your orbit's maximum.

**Is Earth albedo included?** No. Sunlight reflected by the Earth adds a little power on the Earth-facing side, which is usually left out as margin.

**What does "power positive" mean here?** The battery ends each orbit no lower than it started, never runs flat, and stays within your depth-of-discharge limit.

**Are the example values real?** No. They are rounded, made-up numbers to show the method. Use your own components' datasheets.
