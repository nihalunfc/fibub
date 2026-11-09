---
name: Cross-section and topographic profile
num: 509
shelf: science
section: structural-geology
title: "Geological cross-section maker: topographic profile from a DEM, apparent dip and units, SVG and PDF"
summary: "Draw a topographic profile from a DEM (GeoTIFF or ASCII grid) along a line you tap on the map, or from typed distance and elevation pairs, with vertical exaggeration. Add contacts by strike and dip: each is drawn at its apparent dip in the section's direction and the units between them are filled. Download SVG, PNG, PDF or CSV."
status: live
ads: false
order: 509
icon: mountain
works: offline
updated: 2026-11-09
related: [apparent-dip, stereonet, gps-track-analyser, drill-hole-composites, phone-clinometer, dem-terrain, strat-column, gravity-corrections]
sources:
  - "Apparent dip: tan α = tan δ · sin(azimuth − strike) (right-hand rule), the standard relation found in structural geology textbooks; the page uses the same function as fibub's apparent dip calculator."
  - "Bilinear sampling, the GeoTIFF and ASCII grid readers, the profile and the apparent dips are written by fibub and checked in the tests against scipy (RegularGridInterpolator) on rasters written by Python (tifffile), and against the intersection of the bed and section planes in numpy."
  - "The example DEM, line and contacts are made up by fibub. A DEM you open is read on this page only and is never uploaded."
flow:
  - { icon: mountain, label: "DEM" }
  - { icon: pencil, label: "Line" }
  - { icon: compass, label: "Contacts" }
  - { icon: download, label: "Section" }
---

## What it does

A geological cross-section shows what lies under a line across a map: the shape of the ground along the line, and the rock units cut by it. This page builds one in your browser:

- **Topographic profile.** Open a digital elevation model (DEM) as a GeoTIFF or an ESRI ASCII grid and tap points on the shaded map to draw the section line, or type the points. The page samples the DEM along the line by bilinear interpolation, every half cell by default. No DEM? Type distance and elevation pairs instead (from a topographic map or a GPS track).
- **Vertical exaggeration (VE).** The vertical scale is VE times the horizontal scale, so at 1× the section is true to scale and slopes keep their real angles.
- **Contacts by apparent dip.** For each contact, give the distance where it meets the surface and the bed's strike and dip. A section that does not run straight down the dip shows a gentler **apparent dip**: tan α = tan δ · sin(azimuth − strike), right-hand rule. The page works this out with the azimuth of the line segment the contact falls on and draws the contact down from the surface.
- **Units.** Contacts are listed from the youngest unit down. Each unit is filled between its base contact and the contacts above it (a layer cake), with the last unit filling everything below.
- **Downloads.** The section as SVG (vector, edit it in Inkscape or Illustrator), as an image, PDF or Word report, and the sampled profile with each contact's elevation as CSV.

Measure strike and dip in the field with the [[phone-clinometer]], and turn true dips into the apparent dips seen along your line with the [[apparent-dip|apparent dip calculator]].

## How to use it

1. **DEM.** Open a GeoTIFF or ASCII grid, ideally in a projected system in metres (UTM). Clip large DEMs to your area first.
2. **Line.** Tap the start of the section on the map, then each bend, then the end. *Undo last point* and *Clear the line* fix mistakes; the coordinates appear in the box, where you can also type them.
3. **Contacts.** Read off the distance where each contact crosses the line (the CSV or the section helps), and type unit name, distance, strike and dip, youngest first. Name the lowest unit.
4. **Section.** Set the vertical exaggeration and how deep to draw, then download.

## Worked example

The example is a **made-up** DEM of a ridge and a valley (160 × 120 cells of 25 m) with a three-point line. The section is **3529 m long, towards 080°, then 109°**, with elevations from 337.65 to 633.83 m. The three contacts, all dipping roughly east, show these apparent dips:

- Sandstone base at 2600 m, 010°/20°, on the 109° segment: **19.8°**.
- Shale base at 1500 m, 015°/25°, on the 080° segment: **22.9°**.
- Limestone base at 700 m, 020°/30°: **26.6°**.

At 2× vertical exaggeration they are drawn at 35.7°, 40.2° and 45.0° on the page, which is why the table lists both. Dolomite fills the core of the ridge, and the units get younger towards the east, as they should for east-dipping beds.

## Tips

- Use 1× when you want to measure angles or thicknesses off the drawing. Use more only to show low relief, and always print the VE on the figure (the page does).
- A section across the strike shows dips best. Along strike, every bed looks flat.
- Contacts are straight lines from the surface: folds and faults are not modelled. For those, draw several short sections or edit the SVG.
- To get true thickness from an outcrop width, use the apparent dip and thickness calculator.

## FAQ

**Which DEM formats work?** GeoTIFF (16 or 32-bit, uncompressed, LZW or Deflate) and ESRI ASCII grids. Distances come from the file's coordinates, so the DEM must be georeferenced.

**My DEM is in latitude and longitude.** That works: distances are worked out on a local flat Earth at each segment's latitude, which is accurate for sections of a few tens of kilometres.

**Why is a contact missing from the drawing?** It is drawn only below the ground. A contact that dips steeply out of the section, or one listed in the wrong order, may be cut off by the units above it.

**Is my DEM uploaded?** No. It is read on this page and nothing leaves your device.
