---
name: Porkchop plot
num: 63
shelf: science
code: T63
section: spaceflight-and-astrodynamics
title: "Porkchop plot: launch windows and launch energy C3 for trips between planets"
summary: "Draw a porkchop plot for a trip from one planet to another: launch energy and arrival speed for every launch date and flight time, the cheapest window, and the burns from a parking orbit."
status: live
ads: true
order: 20
icon: orbit
works: offline
updated: 2026-11-08
related: [orbit-transfer-calculator, rocket-equation, link-budget-calculator, mars-time]
sources:
  - "Planet orbits: JPL approximate Keplerian elements (Standish), NASA."
  - "Gravitational parameters and radii: JPL and IAU values."
flow:
  - { icon: orbit, label: "Planets" }
  - { icon: calendar, label: "Dates" }
  - { icon: chart, label: "Porkchop" }
---

## What it does

A spacecraft cannot leave for Mars whenever it likes. The planets must line up so that a path round the Sun links Earth on launch day with Mars on arrival day, and the energy that path needs changes from week to week. Mission planners map it on a **porkchop plot**: launch date along the bottom, flight time up the side, and colour for the energy. The cheap region forms a rounded blob, which is where the name comes from.

This tool draws that plot for any pair of Mercury, Venus, Earth, Mars, Jupiter and Saturn. For each of 3,600 combinations of launch date and flight time it solves **Lambert's problem**: which orbit round the Sun joins two positions in a given time. It then gives the **launch energy C3**, the excess speed when leaving and arriving, and the burns needed from a low parking orbit. It marks the cheapest trip and repeats the best flight for a dozen launch dates in a table.

For a single transfer worked burn by burn, use the [[orbit-transfer-calculator]]; for the rocket that has to fly it, the [[rocket-equation]].

## How to use it

1. Pick the planet you leave **from** and the one you go **to**. The tool jumps to their next launch window.
2. Adjust the **earliest departure**, how many **days of departure dates** to cover, and the **shortest** and **longest flight** times. Wider ranges show more, at coarser detail (the grid is always 60 by 60).
3. Choose what the colour shows: **launch energy C3**, the **departure excess speed** or the **arrival excess speed**.
4. Tap anywhere on the plot to read that flight: launch and arrival dates, C3, speeds and burns.
5. **Find the next window from today** resets the dates. Download the whole grid as a CSV, or the page as a PNG, PDF or Word file.

## What each number means

- **C3** is the square of the speed a spacecraft has left once it has escaped the departure planet's gravity, in km²/s². Launch vehicle makers publish how much mass each rocket can send at each C3, so it is the number planners trade on.
- **Departure and arrival excess speed (v∞)** are the speeds relative to each planet, far outside its gravity. A high arrival speed means a big braking burn, a heat shield, or a fast fly-by.
- **Burns from a 200 km orbit** use the patched-conic formula Δv = √(v∞² + 2μ/r) − √(μ/r), where μ is the planet's gravity and r its radius plus 200 km. They leave out gravity losses, aerobraking and fly-bys.
- **Hohmann transfer** is the textbook half-ellipse between circular orbits in one plane, a handy yardstick for flight times.
- **Windows repeat** once each synodic period: about every 26 months for Mars and 19 months for Venus.

## How it is worked out

Planet positions and speeds come from the VSOP87 theory in the open-source astronomy-engine library. Lambert's problem is solved with the universal-variable method in Curtis's *Orbital Mechanics for Engineering Students*, which the tests check against the book's Example 5.2. Only direct, prograde paths of less than one revolution are used. Near a transfer angle of 180° the plane of the orbit is poorly defined and the energy shoots up, which shows as a blank stripe through the plot; real missions avoid it with a small mid-course plane change.

## Worked example

Earth to Mars in late 2026: the tool's default window, opened in November 2026, shows its cheapest point on **1 November 2026** with a **291-day** flight, arriving on 20 August 2027. The launch energy is **C3 ≈ 9.2 km²/s²**, a departure v∞ of 3.03 km/s, which needs a burn of about **3.63 km/s** from a 200 km Earth orbit. Mars is met at 2.71 km/s, so stopping in a low Mars orbit without aerobraking would take another 2.13 km/s.

To check the method against a real mission, set the earliest departure to 1 July 2020 and tap the point for a 30 July launch with a 203-day flight: the date NASA's Perseverance rover left Earth and the time it took to land. The tool gives C3 ≈ 14.5 km²/s², close to the launch energy published for that mission.

## Frequently asked questions

**Why are there two blobs?** Paths that travel less than halfway round the Sun ("type I") and more than halfway ("type II") each have their own cheap region, split by the stripe at 180°.

**Why does Jupiter need so much energy?** Climbing out to 5.2 AU takes a C3 of about 80 km²/s². Real missions such as Juno and Galileo looped past Venus or Earth for gravity assists to cut that.

**Can it plan gravity assists or multi-revolution paths?** No. It shows direct transfers only, which is what porkchop plots usually show.

**Does it work offline?** Yes. Everything runs in your browser once the page has loaded.
