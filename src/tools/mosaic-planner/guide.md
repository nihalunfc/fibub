---
name: Mosaic planner
num: 49
shelf: science
section: astrophotography
title: "Astrophotography mosaic planner: panels, overlap and panel centres"
summary: "Work out how many panels you need to cover a big target such as the Andromeda Galaxy with your telescope and camera, with the overlap you choose, a picture of the layout, and RA/Dec for every panel centre as a CSV."
status: live
ads: true
order: 50
icon: crop
works: offline
updated: 2026-11-08
related: [telescope-calculator, sky-coordinates, object-altitude, sub-exposure-calculator]
flow:
  - { icon: target, label: "Target" }
  - { icon: camera, label: "Camera" }
  - { icon: crop, label: "Panels" }
---

## What it does

Some of the best targets, such as the Andromeda Galaxy, the North America Nebula or the Veil, are bigger than one camera frame. A mosaic covers them with several overlapping panels that are stitched together later. This planner works out how many panels your telescope and camera need, draws them over the target as it sits on the sky, and lists the right ascension and declination of every panel centre to type into your mount or capture software.

## How to use it

1. **Target:** start typing a name or catalogue number (M31, NGC 7000, Veil) and pick it from the list to fill in its position and catalogue size, or type RA and Dec yourself.
2. Set the **width and height to cover** in arcminutes. Catalogues give only the long side, so set the short side and leave a margin around faint outer parts.
3. Set the **angle of the width**: the position angle of the target's long side, measured from north towards east. Galaxy catalogues list it (M31 is about 35°). 90° means the width runs east to west.
4. **Telescope and camera:** type the focal length (with any reducer) and pick your sensor, or type its size. Tick **Turn the camera 90°** to put the frame's long side across the target's height instead.
5. Choose the **overlap**. 10 to 20 % is typical.
6. The result shows the number of panels, the area covered, a drawing with north up and east to the left as on the sky, and a table of panel centres. **Panel centres (CSV)** downloads them in degrees and in sexagesimal form.

## How it works

One frame covers 2 atan(sensor size / (2 × focal length)) on the sky. Along each side, n frames with overlap o cover n·f − (n − 1)·f·o, so the planner takes the smallest n that reaches the size you asked for. Panel centres are laid out in a grid on the plane tangent to the sky at the target, turned to the angle you set, and converted to RA and Dec with the standard gnomonic projection, so the spacing stays right even near the celestial pole.

## Worked example

The Andromeda Galaxy (M31) is about 190 × 70 arcminutes at a position angle of 35°. With a 480 mm focal length and an APS-C astro camera (23.5 × 15.7 mm), one frame covers 168.3′ × 112.4′. With 15 % overlap, a 2 × 1 mosaic covers 311′ × 112′, enough for the whole galaxy and its companions. The two panel centres sit about 1.2° either side of the core, along the galaxy's long axis.

## Frequently asked questions

**How do I set the camera angle?** Rotate the camera until a plate-solved frame shows the angle the planner gives, or use your capture software's framing tool with the panel centres.

**Do panels need the same exposure?** Yes. Give each panel the same total time so the noise matches when they are joined.

**Is anything uploaded?** No. Everything runs in your browser and works offline.
