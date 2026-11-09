---
name: Snow water, snow load and slope angle
num: 512
shelf: science
section: glaciology-and-cryosphere
title: "Snow water equivalent, roof snow load and slope angle calculator (snow tube, layers, map contours, phone inclinometer, GPS)"
summary: "Snow water equivalent from depth and density, snow tube weighings or layers; ground and roof snow load with your own factor; slope angle from map contours, your phone's tilt sensor or two GPS points, shown against the general 30 to 45° avalanche starting band. Not an avalanche or safety forecast."
status: live
ads: true
order: 512
icon: mountain
works: offline
updated: 2026-11-09
related: [infinite-slope, load-combination-helper]
sources:
  - "Formulas (general physics and snow science, no data copied): SWE = depth × snow density ÷ water density; snow tube SWE = snow mass ÷ tube cross-section; load = mass × standard gravity; slope = atan(rise ÷ run)."
  - "Vincenty (1975), direct and inverse solutions of geodesics on the ellipsoid, with the WGS84 ellipsoid; W3C DeviceOrientation Event specification for the phone's tilt angles."
  - "General avalanche terrain fact that most slab avalanches start on slopes of about 30 to 45°, as taught in avalanche awareness courses; not a forecast."
  - "Example numbers are made up by fibub."
flow:
  - { icon: ruler, label: "Measure" }
  - { icon: calculator, label: "SWE, load" }
  - { icon: compass, label: "Slope" }
  - { icon: mountain, label: "Angle band" }
---

## What it does

Three small field calculators for snow, on one page, all working without internet once the page is open:

- **Snow water equivalent (SWE)**: how much water the snowpack holds, in millimetres (1 mm is 1 kg on each square metre). Work it out from **depth and density**, from **snow tube** weighings (tube with snow, empty tube, core length) or from **layers** of a snow pit (thickness and density of each). The page also gives the bulk density and the ground snow load.
- **Snow load on a roof**: the ground load (from the SWE or a value you type) times **your own roof factor**, in kN/m², kg/m² and lb/ft², and the total on a roof area. **It is not a design code**: building codes set their own loads and factors, and roofs need an engineer.
- **Slope angle**: from **map contours** (interval, number of intervals, map distance and scale), from your **phone's tilt sensor** laid on the slope, from a typed clinometer reading, or from **two GPS points** with elevations. The angle is shown on a 0 to 90° bar with the general band where most slab avalanches start (about 30 to 45°).

**This is not an avalanche or safety forecast.** Angle is only one part of avalanche terrain; the snowpack, the weather, the terrain above and the runout below all matter. Read your local avalanche forecast and take an avalanche course.

## How to use it

1. **SWE**: pick a method. For a snow tube, type the inner diameter of the cutter and one line per sample: the tube's weight with snow (g), empty (g) and the length of the snow core (cm). For a pit, type one layer per line, thickness then density. You can also open a CSV file of samples or layers.
2. **Roof**: keep "the SWE above", or switch to typing a ground load. Type a roof factor (roof load ÷ ground load) and, if you like, the roof's plan area.
3. **Slope**: pick map, phone or GPS. On a phone, press **Start the tilt sensor** (iPhones ask for permission), lay the phone screen up on the snow or on a ski pole laid down the fall line, and press **Hold this reading**. For GPS, type both points or use **Use my location** at each one; heights from a map or altimeter are better than phone GPS heights.
4. Download the results as CSV, or a PNG, PDF or Word report.

## Worked example (made-up numbers)

- **Depth and density**: 85 cm of snow at 250 kg/m³ gives **SWE = 212.5 mm**, a ground load of 2.084 kN/m².
- **Snow tube**: a 4.6 cm tube (16.62 cm²) with three samples, 480, 505 and 460 g of snow over 78, 82 and 74 cm, gives SWE 288.8, 303.9 and 276.8 mm, so **SWE = 289.8 mm** (standard deviation 13.6 mm) and a bulk density of 372 kg/m³.
- **Layers**: 12 cm at 90, 25 cm at 180, 30 cm at 260 and 15 cm at 320 kg/m³ make 82 cm of snow with SWE 181.8 mm and a bulk density of 222 kg/m³.
- **Roof**: with the first example's 2.084 kN/m² and a factor of 0.8, the roof load is **1.67 kN/m²** (170 kg/m²); on 120 m² that is 200 kN, about 20.4 tonnes of snow.
- **Map**: five 10 m contour intervals across 3 mm on a 1:25 000 map: 50 m of rise over 75 m, **33.7°**, in the 30 to 45° band.
- **GPS**: two made-up points 146.8 m apart horizontally and 95 m apart in height give **32.9°**.

## Tips

- Weigh the tube on the same scale with and without snow, and measure the core length, not the hole depth, if some snow fell out.
- Density above 917 kg/m³ is impossible (that is solid ice), so the page flags it: check grams, centimetres and the diameter.
- Contours hide small steep steps: a short convex roll can be much steeper than the map shows.
- A phone measures the surface right under it; measure in a few places and on the steepest part.

## FAQ

**Is a slope under 30° safe?** No. Avalanches can start on lower slopes in some conditions, and gentle slopes are often in the path or runout of steeper ones. The band is a general fact about angles, not advice.

**Why does my phone show no reading on a computer?** Most computers have no tilt sensor. Type an angle from a clinometer instead.

**Does anything leave my device?** No. The tilt sensor, your location and your numbers stay in this page.
