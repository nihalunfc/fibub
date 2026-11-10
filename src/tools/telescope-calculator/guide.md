---
name: Telescope calculator
num: 19
shelf: science
code: T19
section: astrophotography
title: "Telescope calculator"
summary: "Enter your telescope, eyepieces and camera to see magnification, true field, exit pupil, faintest stars, image scale and whether your camera suits your seeing, with a picture of what fits in the view."
status: live
ads: true
order: 60
icon: telescope
works: offline
updated: 2026-11-07
related: [star-trail-exposure, fits-viewer, sky-tonight, sky-coordinates]
sources:
  - "Deep-sky objects: the OpenNGC catalogue by Mattia Verga (CC BY-SA 4.0)."
  - "Telescope and camera examples: common apertures, focal lengths and sensor sizes, typed by fibub."
flow:
  - { icon: telescope, label: "Telescope" }
  - { icon: eye, label: "Eyepieces" }
  - { icon: camera, label: "Camera" }
  - { icon: target, label: "See the fit" }
---

## What this calculator answers

Before you buy an eyepiece or a camera, or before you plan a night, you want to know some simple things. How much will it magnify? How much sky will I see? Will the Andromeda Galaxy fit? Is my camera's pixel size right for my telescope? The answers come from a handful of simple formulas. This page works them all out together and draws the result, so you can see the field rather than imagine it.

Choose exposure lengths with the [[sub-exposure-calculator]], and plan big targets in several panels with the [[mosaic-planner]].

## How to use it

1. **Telescope:** pick a common telescope or type its **aperture** (the width of the main lens or mirror) and **focal length** in millimetres. Both are printed on the tube or in the manual. Add a **Barlow** or **reducer** if you use one. **Typical seeing** is how much the air blurs stars on an average night: 2 to 3 arcseconds for most backyards, and 1 to 1.5 at a good mountain site.
2. **Eyepieces:** type each eyepiece's focal length (the number on it, in mm) and its **apparent field**. That's 50 to 52° for a standard Plössl, around 66 to 70° for wide-angle and 82° or more for ultra-wide. Add or remove rows as you like.
3. **Camera:** pick a sensor or type its width, height and pixel size. Binning joins pixels together, which acts like bigger pixels.
4. **What fits in the view:** type an object, such as M42, M31 or the Double Cluster. The picture draws the eyepiece view as a circle and the camera frame as a rectangle. A dashed outline of the full Moon (31 arcminutes) is shown for scale.
5. Download everything as an image, PDF or Word file to keep with your kit.

## What each number means

- **Focal ratio:** focal length divided by aperture. Lower ("faster") ratios give wider, brighter camera fields.
- **Light grasp:** how much more light the telescope collects than a dark-adapted eye with a 7 mm pupil.
- **Faintest stars:** a typical limiting magnitude under a dark sky. Light pollution makes this a couple of magnitudes brighter.
- **Resolution:** the Dawes limit is the closest pair of equal stars the aperture can split. Real nights are usually limited by seeing instead.
- **Power and true field:** power = telescope focal length ÷ eyepiece focal length. True field = apparent field ÷ power.
- **Exit pupil:** the width of the beam leaving the eyepiece. 4 to 7 mm suits wide, faint objects, 2 to 4 mm suits galaxies, and under 1 mm suits planets on steady nights. Wider than about 7 mm wastes light, and much under 0.5 mm makes the view dim and soft.
- **Image scale:** arcseconds of sky per camera pixel, 206.265 × pixel size ÷ focal length.
- **Sampling:** for sharp, round stars you want roughly 2 to 3.5 pixels across a star's blur. The gauge shows whether you are under, well or over sampled for the seeing you entered.

## Worked example

A 150 mm f/5 reflector (750 mm focal length) with a 25 mm, 52° eyepiece gives 30× power, a 1.73° true field and a 5 mm exit pupil. That's lovely for the Pleiades. With an APS-C astro camera (3.76 µm pixels), the image scale is 1.03″ per pixel, and the frame is about 1.8° × 1.2°. On a 2.5″ night that is well matched, and M42 with its surrounding nebula fits comfortably.

## Questions

**Why is a row greyed out?** That eyepiece gives more power than the aperture can support, or an exit pupil wider than your eye. It still works, but it isn't the best use of the telescope.

**Is anything saved?** Your eyepiece list is kept in this tab only, so it is there while you move between astronomy tools, and it goes when you close the tab.
