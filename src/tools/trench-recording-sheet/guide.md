---
name: Trench and grid recording sheet
num: 406
shelf: science
section: archaeology
title: "Trench and grid recording sheet: find positions from offsets, levels, grid squares and lat/long (free, in your browser)"
summary: "Set up a site grid and a trench, then record finds, samples and levels by grid coordinates, tape offsets from a peg or a baseline, with heights from a level and staff. Get grid squares, latitude and longitude, a plan, a printable PDF sheet and a CSV. Your location is used only if you press the GPS button, and nothing is saved or sent."
status: live
ads: false
order: 406
icon: compass
works: offline
updated: 2026-11-09
related: [traverse-calculator, level-book-reducer, gps-track-analyser, harris-matrix-builder, artefact-scale-tool]
sources:
  - "Baseline-and-offset and levelling (height of instrument = datum + backsight, height = HI − foresight) as in standard field survey practice. Grid to latitude/longitude by Puissant's short-line formulas on the WGS84 ellipsoid (a = 6378137 m, f = 1/298.257223563), using the meridian and prime-vertical radii of curvature."
  - "Checked against Vincenty's direct formula on WGS84, written separately in Python: 40 random cases up to 1 km from the origin at latitudes up to 60° agreed to better than 0.03 mm per metre (under 1 mm at 1 km); the inverse returns the grid point to 1e-9 m."
  - "The example grid, trench, points and origin coordinates are made up for this tool."
flow:
  - { icon: compass, label: "Grid" }
  - { icon: ruler, label: "Offsets" }
  - { icon: target, label: "Points" }
  - { icon: file, label: "Sheet" }
---

## What it does

Excavation records place every find, sample and level on the site grid. This page does the sums for you as you record, and gives you a clean sheet at the end:

- **Grid squares**: from the grid origin and square size, each point gets its square, named by the square's south-west corner (E1010 N5020) or by letters east and numbers north (C5).
- **Positions three ways**: type the grid easting and northing; measure offsets east and north from a peg; or measure along a baseline between two pegs and at right angles to it (right of the line is +, left is −).
- **Heights from a level**: give the datum height and the backsight on it once; each staff reading then becomes a height. You can also type heights, or leave them out.
- **Trench check**: whether each point lies inside the trench.
- **Latitude and longitude**: tie the grid origin to a latitude and longitude, and give the bearing of grid north if the grid is turned. Every point then gets its own latitude and longitude.
- **Phone GPS** (optional): press **Use my location**, and the browser asks your permission. The fix (with its accuracy) is kept with the next point; if the grid is tied to latitude and longitude you can also place the point on the grid from it. Phone GPS is good to a few metres at best, so it suits survey points and surface finds, not finds in a trench.

Nothing is stored or sent. Points live only in this page, so download the CSV or the PDF sheet before you close it.

Reduce the levels with the [[level-book-reducer]], and order the contexts with the [[harris-matrix-builder]].

## Worked example

Press **Use the example**. It sets a made-up grid with origin E 1000, N 5000 and 5 m squares, Trench 1 of 4 × 2 m with its south-west corner at E 1012, N 5021, a datum of 100 m with a backsight of 1.42 m (height of instrument 101.420 m), and the origin at 45.5° N, 73.6° W. Six points are added:

- **F1** at E 1013.250, N 5021.800 with a staff reading of 1.87 m: height **99.550 m**, square **E1010 N5020**, latitude **45.5001961**, longitude **−73.5998305**.
- **F2** from the peg at 1012/5021, 2.40 m east and 1.15 m north: **E 1014.400, N 5022.150**, height 99.470 m.
- **S1** on the baseline from 1012/5021 to 1016/5021, 3.10 m along and 0.60 m to the left: **E 1015.100, N 5021.600**.
- **L1** and **P1** (a level and a section peg), and **F3**, a surface find at E 1008.600, N 5017.200 in square E1005 N5015.

The sheet reports **6 points: 5 inside Trench 1, 1 outside**, and draws the plan with the grid, the trench and each point by type.

## Tips

- Use a false origin (such as 1000/5000) so all coordinates stay positive.
- Measure offsets with the tape level and square to the grid; for long offsets a baseline is easier to keep square.
- The latitude/longitude tie is only as good as the origin's coordinates. A hand-held GPS reading of the origin is off by metres.

## FAQ

**How accurate is the latitude and longitude?** The sums are within a millimetre of the full ellipsoid answer up to 1 km from the origin. The real limit is how well you know the origin's position and the grid's rotation.

**Is my location stored?** No. It is asked for only when you press the button, it stays in this page, and it is lost when you close or reload it.
