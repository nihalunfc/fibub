---
name: Apparent dip and true thickness calculator
num: 867
shelf: science
section: structural-geology
title: "Apparent dip calculator: true dip, true thickness on slopes, borehole depth and three-point problem (free)"
summary: "Work out the apparent dip of a bed in any section, the true dip from two apparent dips, true and vertical thickness from outcrop width on sloping ground, the depth to a bed in a borehole, and strike and dip from three points."
status: live
ads: true
order: 867
icon: ruler
works: offline
updated: 2026-11-09
related: [stereonet, traverse-calculator, drill-hole-composites, cross-section-profile, phone-clinometer, strat-column]
sources:
  - "Formulas: standard structural geology trigonometry (tan α = tan δ sin β; Ragan's general thickness formula for sloping ground), worked here as vector products."
  - "Example bed, outcrop, borehole and three points: made up by fibub."
flow:
  - { icon: compass, label: "Strike, dip" }
  - { icon: ruler, label: "Widths" }
  - { icon: calculator, label: "Dip, depth" }
  - { icon: download, label: "Report" }
---

## What it does

Five everyday structural geology sums in one place, all for a flat (planar) bed:

- **Apparent dip**: how steep the bed looks in a road cut, cliff or cross-section that does not run along the dip direction, with a chart of the apparent dip in every direction.
- **True thickness** and **vertical thickness** from the width of an outcrop, on flat or sloping ground, whichever way you walked across it.
- **Depth to the bed in a borehole**, vertical or inclined, and the length of core you should get through it.
- **True dip from two apparent dips**, such as two quarry faces at an angle.
- The **three-point problem**: strike and dip from three places where the same contact was found.

Take the strike and dip readings with the [[phone-clinometer]], and use the apparent dips to draw a section with the [[cross-section-profile|cross-section tool]].

## How to use it

1. Type the bed's **strike and dip** (right-hand rule: dip direction = strike + 90°), or switch to dip direction and dip. Pick metres or feet; every length on the page uses that unit.
2. **Apparent dip:** type the direction of the section. The answer says which way the bed goes down in that section.
3. **Thickness:** type the outcrop width from the base to the top of the bed, whether you taped it along the ground or read it off a map, the direction you walked, the slope of the ground and whether the ground went downhill or uphill in that direction.
4. **Borehole:** type how far the collar is from where the bed crops out, in which direction, and how much higher the collar is. Set the hole's direction and plunge (90 for a vertical hole) and, if you want the core length, the bed's true thickness.
5. **Two apparent dips** or **three points:** the result can be copied into the bed at the top with **Use as the bed**, so the other sums use it.
6. Download everything as an image, a PDF or a Word file, or the apparent dips every 5° as a CSV file.

## How it works

Each sum is a piece of vector geometry. The bed is a plane with a unit normal **n**. The apparent dip in a direction is the plunge of the line where the bed meets a vertical section in that direction: tan α = tan δ · sin β, with β the angle from the strike. The true thickness is the length of the outcrop traverse (a vector along the ground) projected onto **n**, which is Ragan's general formula T = w · |sin δ cos σ sin β − s cos δ sin σ|: the minus sign applies when you walk downhill (s = +1), the plus sign uphill. The vertical thickness is T / cos δ. The borehole depth is where the line of the hole meets the plane. Two apparent dips are two lines in the plane, and their cross product is its normal; the three-point problem uses the cross product of two sides of the triangle.

## Worked example

The made-up example bed strikes **040** and dips **35°** to the south-east (130).

- In a section running east (090) the apparent dip is **28.2° towards 090**, since β = 50° and tan α = tan 35° × sin 50°.
- An outcrop 120 m wide, taped along the ground while walking towards 130 (straight down the dip) on a 15° slope going downhill, gives a **true thickness of 41.04 m** (120 × sin(35° − 15°)) and a **vertical thickness of 50.10 m**.
- A vertical hole 250 m from the outcrop towards 130, with its collar 12 m higher, meets the bed at **187.1 m**; through a bed 40 m thick it cuts **48.83 m** of core.
- Apparent dips of 25° towards 090 and 20° towards 180 give a true dip of **30.6° towards 128**, strike **038**.
- Points A (0, 0, 320 m), B (800, 200, 260 m) and C (300, 900, 210 m) give a bed **295 / 6.65**, dipping gently towards 025.

## Tips

- Thickness from a traverse close to the strike is very sensitive to the direction; walk across the strike if you can.
- When the ground slopes the same way as the bed at the same angle, the outcrop can be very wide for a thin bed.
- For many measurements or to see them on a net, use the [stereonet plotter](/science/stereonet/).

## Frequently asked questions

**Which way is a negative apparent dip?** It means the bed rises in the direction you typed, so it goes down in the opposite direction. The result always says which way is down.

**Does it allow for folds or faults?** No. Every sum assumes one flat, unbroken plane between the points.

**Is my data sent anywhere?** No. Everything is worked out in your browser and nothing leaves your device; the page keeps working offline once it has loaded.
