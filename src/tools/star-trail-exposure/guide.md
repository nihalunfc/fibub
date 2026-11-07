---
name: Star trails and exposure calculator
num: 20
shelf: science
section: astrophotography
title: "NPF rule and 500 rule calculator, plus a star trails planner"
summary: "Find the longest exposure before stars start to trail with your camera and lens (NPF and 500 rule), and plan star-trail sequences: frames, total time and card space."
status: live
ads: true
order: 62
icon: camera
works: offline
updated: 2026-11-07
related: [telescope-calculator, sky-tonight, polar-alignment]
flow:
  - { icon: camera, label: "Camera" }
  - { icon: target, label: "Aim" }
  - { icon: clock, label: "Max exposure" }
  - { icon: star, label: "Trail plan" }
---

## Sharp stars or long trails

The sky turns about 15° an hour. On a camera on a plain tripod, every star slowly slides across the sensor. Keep the shutter open too long and pin-point stars turn into short dashes. This page gives you the longest exposure for **sharp stars** with your exact camera and lens. It also does the opposite: it plans a **star trails** sequence, where you want long, smooth circles.

## How to use it

1. **Camera:** pick your camera type, or type the sensor size and pixel size from your camera's specifications. Phone cameras are included for night mode.
2. **Lens:** type the focal length (for a zoom, the setting you use) and the aperture (f-number) you shoot at.
3. **Aiming at declination:** how far north or south of the celestial equator you are pointing. Stars near the celestial pole move the slowest, so you can expose longer when you point at them.
4. Read **Longest exposure before stars trail**. The table shows the limit for different parts of the sky.
5. For trails, type the **arc** you want, or the **total time**, plus your frame length and gap. The planner tells you how many frames to set on your intervalometer and how much card space you need. The picture shows roughly how the circles will look.

## NPF rule or 500 rule?

The **500 rule** divides 500 by your full-frame equivalent focal length. It was made for film and low-resolution cameras. On a modern 24 to 45 megapixel sensor, stars are already visibly stretched at full size. The **NPF rule** (from the Société Astronomique de France) also uses the aperture and the pixel size, so it suits today's cameras. Its simple form is (35 × f-number + 30 × pixel size) ÷ focal length, divided by the cosine of the declination. We show both, and also a stricter 300 rule for comparison.

## Worked example

A full-frame camera with 5.9 µm pixels and a 24 mm f/2.8 lens, aimed at the celestial equator, gives an NPF limit of about 11 seconds. The 500 rule says 21 seconds. Stars will look fine on a phone at 21 s but trailed when you zoom in. Point the same lens at Cassiopeia (declination 60°) and the NPF limit doubles to about 23 seconds.

For trails, a 45° arc takes about 3 hours. With 30-second frames and 1-second gaps that is 348 frames, and at 30 MB each about 10.2 GB of card space.

## Questions

**Why are my stars still not sharp?** The rules assume the lens is focused well (use live view on a bright star) and that the tripod is steady. Wide-open lenses also show stretched stars (coma) in the corners whatever the exposure. Stopping down one step helps.

**Does it work without internet?** Yes, once the page has loaded.
