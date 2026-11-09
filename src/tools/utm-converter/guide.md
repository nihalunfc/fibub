---
name: UTM and MGRS converter
num: 892
shelf: science
section: geodesy-and-surveying
title: "UTM converter: latitude/longitude (decimal or DMS) to UTM and MGRS and back, batch lists, distance and bearing"
summary: "Convert a position between latitude and longitude (decimal degrees, degrees and minutes, or degrees minutes seconds), UTM with zone and band, and MGRS at any precision, on WGS 84, GRS 1980, International 1924 or Clarke 1866. Force a zone, convert a whole list from a file, and get the geodesic distance and bearings between two points. Nothing leaves your device."
status: live
ads: true
order: 892
icon: compass
works: offline
updated: 2026-11-09
related: [gps-track-analyser, traverse-calculator, level-book-reducer]
sources:
  - "Transverse Mercator: the Krüger series to sixth order in the third flattening, as given by C. F. F. Karney, 'Transverse Mercator with an accuracy of a few nanometres', Journal of Geodesy 85 (2011); formulas written by fibub."
  - "UTM zones, latitude bands, the Norway and Svalbard exceptions and the MGRS 100 km square lettering: public grid definitions, written by fibub."
  - "Distance and bearings: T. Vincenty, 'Direct and inverse solutions of geodesics on the ellipsoid', Survey Review 23 (1975); formulas written by fibub."
  - "Ellipsoid sizes (WGS 84, GRS 1980, International 1924, Clarke 1866): published defining constants."
  - "The example points are made up by fibub, apart from well-known landmarks given as rounded coordinates."
flow:
  - { icon: compass, label: "Position" }
  - { icon: convert, label: "Convert" }
  - { icon: ruler, label: "Distance" }
  - { icon: download, label: "Save CSV" }
---

## What it does

GPS receivers, maps and field forms write the same place in different ways. This converter reads a position in any of the common forms and writes it in all the others at once:

- **Latitude and longitude** as decimal degrees (51.4778, −0.0015), degrees and decimal minutes (51°28.668′ N) or degrees, minutes and seconds (51°28′40.1″ N).
- **UTM** (Universal Transverse Mercator): a zone number from 1 to 60, a latitude band letter, and an easting and northing in metres.
- **MGRS** (Military Grid Reference System), used by search and rescue, the military and many field teams: the UTM zone and band, two letters for the 100 km square, and 1 to 5 digits each way.

It also gives the **grid convergence** (the angle between grid north and true north) and the **point scale factor** (how much the grid stretches distances there), the **distance and bearings** between two points along the shortest path on the ellipsoid, and converts **a whole list** of points from a paste or a file.

Everything runs in your browser and works offline once the page has loaded.

## How to use it

1. Type or paste a position in **Convert a point**. The tool recognises the form by itself. Without N, S, E or W letters, write the latitude first.
2. Read the results. Change **UTM rounding** or **MGRS precision** to suit your work (1 m is plenty for a hand-held GPS).
3. For a project that crosses a zone boundary, choose one **UTM zone** in Settings so every point uses the same grid.
4. In **Distance and bearing**, type two points in any form.
5. In **A list of points**, paste one point per line (optionally with a name and a comma first) or open a CSV or Excel file with latitude and longitude columns. Download the results as CSV or GeoJSON.

## Settings explained

- **Ellipsoid**: the shape of the Earth your coordinates refer to. GPS uses WGS 84. GRS 1980 (NAD83, ETRS89, GDA) differs from it by well under a millimetre in UTM. International 1924 (ED50) and Clarke 1866 (NAD27) are for old maps. The tool does **not** shift between datums; it only changes how a position on one datum is written.
- **UTM zone**: automatic uses the standard zone, including the special zone 32V over south-west Norway and the wide zones 31X, 33X, 35X and 37X over Svalbard.
- **MGRS precision**: 5 digits each way names a 1 m square, 4 digits 10 m, 3 digits 100 m, and so on. MGRS references are **truncated**, not rounded, so the reference names the square the point lies in.

## Worked example

The example point is 51°28′40.1″ N, 0°00′05.3″ W, near the Greenwich meridian. The tool shows 51.4778056, −0.0014722 in decimal degrees and UTM **30U 708215.85 E 5707225.24 N**. The point is just 3.0° east of the centre of zone 30 (central meridian 3° W), so the point scale factor is 1.0001323 and the grid convergence +2.34679°. In MGRS at 1 m precision it is **30U YC 08215 07225**; at 100 m, 30U YC 082 072. Forcing zone 31 gives 31U 291579.73 E 5707233.62 N instead, the same place on the neighbouring grid.

From 51.4778, −0.0015 to 48.8584 N, 2.2945 E (Paris) the geodesic distance is **334.325 km**, with an initial bearing of 149.7330° and a final bearing of 151.4967°.

## Accuracy

The UTM formulas are the Krüger series to sixth order, which are accurate to a few nanometres within 3,900 km of the central meridian; the tool refuses points more than 15° of longitude from the zone centre. Checked against PROJ (pyproj 3.8) at 5,000 random points on the four ellipsoids, including zone and band edges and the Norway and Svalbard zones: eastings, northings and the round trip agree to better than 0.0001 mm, and the convergence and scale factor to 10 decimal places. MGRS was checked against the GeoTrans-based mgrs library at 5,250 points and every precision. Distances match Karney's geodesic method (as in GeographicLib) to under 0.1 mm.

## FAQ

**Why does "33S" sometimes mean south and sometimes band S?** A single letter after the zone is usually the latitude band, but some people write N or S for the hemisphere. Band N and "north" agree, but band S (32° N to 40° N) and "south" do not. The tool takes whichever fits the northing and says which it used. Write "33 south" to be explicit.

**Does it work near the poles?** UTM stops at 80° S and 84° N; the polar regions use the UPS grid, which this tool does not convert.

**Why do two zones give different coordinates for the same place?** Each zone is its own flat map with its own central meridian, so eastings and northings from different zones cannot be compared.
