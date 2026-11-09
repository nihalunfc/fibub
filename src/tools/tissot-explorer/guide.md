---
name: Tissot explorer
num: 894
shelf: science
section: remote-sensing-and-gis
title: "Map projection distortion explorer: Tissot indicatrix, scale and area for Mercator, UTM, Lambert, Albers and more"
summary: "See how 11 map projections bend the world: Mercator, transverse Mercator, equirectangular, Lambert conformal conic, Albers, azimuthal equidistant and equal-area, stereographic, orthographic, Mollweide and sinusoidal. Tissot ellipses on a world map, and at any point the scale along the meridian and parallel, the areal scale and the angular distortion, compared across all projections."
status: live
ads: true
order: 894
icon: compass
works: offline
updated: 2026-11-09
related: [band-combiner, spectral-index-calculator, gps-track-analyser, traverse-calculator, vector-map-viewer, utm-converter, poincare-disk]
sources:
  - "Projection formulas on the sphere and the distortion formulas (h, k, areal scale, Tissot axes a and b, angular distortion ω) follow J. P. Snyder, Map Projections: A Working Manual, USGS Professional Paper 1395 (1987), a public-domain US government work. The code is written by fibub."
  - "The tests check every projection and its distortion against pyproj 3.8 with PROJ 9.8 (forward projection and Proj.get_factors) at random points."
  - "World outline: Natural Earth 1:110m land (public domain)."
flow:
  - { icon: compass, label: "Projection" }
  - { icon: target, label: "Point" }
  - { icon: ruler, label: "Distortion" }
  - { icon: table, label: "Compare" }
---

## What it does

Every flat map of the round Earth stretches something: distances, areas, angles or all three. In the 1880s Nicolas Tissot showed how to see it. Draw small circles of the same size all over the globe and project them: each becomes an ellipse (a **Tissot indicatrix**) whose size and shape tell you how the map distorts that place.

This page draws 11 common projections with the world's coastlines and a grid of these ellipses, and works out the distortion numbers at any point you tap. The numbers come from the projection's own partial derivatives, as in Snyder's *Map Projections: A Working Manual*, and are checked against PROJ, the library behind most GIS software.

See your own map data in the [[vector-map-viewer]], and convert between latitude, longitude and UTM with the [[utm-converter]].

## How to use it

1. Choose a **projection**. Set the central meridian and, where the projection has them, the latitude of origin or centre and the standard parallels.
2. Choose how far apart the circles are, how big they are on the globe, and whether to colour them by **areal scale** or **angular distortion**.
3. **Tap the map**, or type a latitude and longitude, to read the distortion there.
4. Read the table to see how every other projection treats the same point. Download a grid of numbers as CSV, or the map and numbers as PNG, PDF or Word.

## The numbers

- **h**: scale along the meridian (north–south). A north–south distance on the map is h times the true distance (at the map's nominal scale).
- **k**: scale along the parallel (east–west).
- **Areal scale**: how much areas are enlarged. Equal-area projections keep it at exactly 1.
- **a and b**: the largest and smallest scale at the point, in any direction (the ellipse's semi-axes).
- **Angular distortion ω**: the most any angle at the point is bent. Conformal projections keep it at 0°, so small shapes look right.
- **Largest scale error**: how far a or b is from 1, in per cent.

## Worked example

The page opens on **Mercator** with the point at 60° N, 30° E (near St Petersburg). The big line reads "60° N, 30° E: area × 4.000, ω 0.00°". On Mercator, both h and k equal 1 / cos 60° = 2.0000, so every distance there is drawn twice too long and every area four times too big, while shapes stay true (ω = 0°). The circles near the equator are small and grow towards the poles.

In the table at the same point, **Mollweide**, **sinusoidal**, **Albers** and **Lambert azimuthal equal-area** all show an areal scale of 1.0000, but with angular distortion instead. The **Lambert conformal conic** with standard parallels 20° and 50° shows ω 0.00° and a scale a little above 1, because 60° N lies outside its two parallels.

## Tips

- For a country map, pick a conic projection with standard parallels at about one-sixth and five-sixths of its north–south extent: errors stay small between them.
- UTM is transverse Mercator with a scale of 0.9996 on the central meridian; this page uses a scale of 1, so add the factor yourself.
- Everything is on a sphere. On the ellipsoid used by GPS (WGS 84), scale factors differ in the third or fourth decimal place.
- Colour by angular distortion to see where shapes go wrong on equal-area maps.

## FAQ

**Why do the ellipses near the poles look so big on Mercator?** Mercator keeps angles by stretching east–west and north–south equally, and the east–west stretch must reach infinity at the pole, where all meridians meet. It is drawn only to 85°.

**Why is Robinson not here?** Robinson is defined by a table of numbers rather than formulas, and this page uses formulas only.

**What does "not shown" mean in the table?** The point is outside the part of that projection drawn here, such as the far side of the globe on the orthographic, or near the antipode of the centre on an azimuthal map.

**Can I use the distortion numbers for real measurements?** They are correct for a sphere, which is close enough for teaching and for choosing a projection. For survey work, use the ellipsoidal factors from your GIS software.
