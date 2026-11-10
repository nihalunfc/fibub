---
name: Artefact scale
num: 404
shelf: science
section: archaeology
title: "Artefact scale"
summary: "Open a photo of a find with a scale bar in it, tap both ends of the bar and type its length, then measure lengths, edge angles and outline areas in millimetres. Includes a perspective check, click uncertainty, an annotated PNG and a CSV. The photo never leaves your device."
status: live
ads: false
order: 404
icon: ruler
works: offline
updated: 2026-11-09
related: [graph-digitizer, impact-crater-calculator, uncertainty-calculator, harris-matrix-builder]
sources:
  - "Geometry only: distance, the angle between two vectors (atan2 of the cross and dot products) and the shoelace formula for polygon area. Uncertainty from click placement follows the usual propagation of independent errors (JCGM 100:2008, the GUM)."
  - "Checked against numpy: areas of the example outline and three random polygons, the example angle and perimeter."
  - "The example photo (a leaf-shaped point and an L-shaped scale) is drawn by the page and made up for this tool."
flow:
  - { icon: camera, label: "Photo" }
  - { icon: ruler, label: "Scale bar" }
  - { icon: target, label: "Measure" }
  - { icon: table, label: "Table" }
---

## What it does

Finds photographed with a scale bar can be measured later, at the desk, without handling them again. This tool turns pixels into millimetres from the scale bar in the picture and gives you:

- **Lengths** between two taps (length, width, thickness, a scar or a hole), with a ± from how precisely you can place a tap.
- **Angles** at a corner from three taps, such as the edge angle of a scraper or the tip angle of a point. Angles do not need the scale.
- **Areas** of an outline you tap round, with its perimeter, for example the area of a sherd, a flake or a stain.
- **A perspective check**: mark a second scale bar (the other arm of an L-scale, or a second ruler) and the tool compares the two. If they disagree by more than 2 %, the photo was taken at a slant.

The photo is opened inside your browser. It is never uploaded, and nothing is kept when you close the page.

To take measurements from a printed drawing or graph instead, use the [[graph-digitizer|graph digitiser]]; to put an error on what you measure, the [[uncertainty-calculator]].

## How to use it

1. **Open a photo** (or drop it on the button). Photograph the object square-on, with the scale bar lying on the same level as the surface you want to measure.
2. In **Scale bar** mode, tap one end of the bar, then the other, and type its length (mm, cm or inch). Use **Zoom** (2× or 4×) to tap precisely.
3. Pick **Length**, **Angle** or **Area** and tap on the object. For an area, tap round the edge and tap the first point again or press **Finish shape**.
4. Optional: **Check scale** with a second bar at right angles to the first.
5. Download the **annotated photo** (PNG with every measurement drawn on) and the **CSV** (values, ±, notes and the pixel coordinates of every tap).

**Click accuracy** is how far off, in pixels, you think each tap is (1 px at a good zoom). The ± for a length combines the taps at both ends of the line and of the scale bar. Notes warn when a measurement is more than three times as long as the scale bar, lies far from it, or when an outline crosses itself.

## Worked example

Press **Use the example photo**. It is a made-up leaf-shaped point with an L-shaped scale: 50 mm along the bottom and 25 mm up the side, both 8 px per mm. The tool shows **8 px per mm** (one pixel is 0.125 mm) and the two bars agree to within 0.0 %, 90° apart. The three example measurements are:

- **L1**, the length from tip to base: 500 px, so **62.5 mm ± 0.3**.
- **A1**, the tip angle: **41.7°**.
- **P1**, the outline: 52,600 px², so **822 mm² ± 6**, perimeter **135.1 mm**.

Now type 30 in the second bar's length: the bars disagree by 18.2 %, and the tool warns that the photo looks slanted.

## FAQ

**How accurate is it?** With a sharp photo, the bar in the same plane and a square-on camera, about the ± shown. Tilt and wide-angle lens distortion add errors the tool cannot see, except through the second-bar check.

**Can I measure a curved length?** Use Area and read the perimeter, or add short straight lengths.

**Is my photo uploaded?** No. Everything runs in your browser and works offline.
