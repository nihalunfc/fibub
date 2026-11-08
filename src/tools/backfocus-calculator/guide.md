---
name: Backfocus calculator
num: 43
shelf: science
section: astrophotography
title: "Backfocus calculator: spacers for a reducer or flattener (55 mm and others)"
summary: "Add up your camera, filter wheel, off-axis guider and adapters, allow for the filter's thickness, and get the exact spacer stack to hit your reducer's or flattener's backfocus from the spacers you own."
status: live
ads: true
order: 40
icon: ruler
works: offline
updated: 2026-11-08
related: [telescope-calculator, sub-exposure-calculator, fits-viewer]
flow:
  - { icon: target, label: "Backfocus" }
  - { icon: table, label: "Your parts" }
  - { icon: ruler, label: "Spacers" }
---

## What it does

A field flattener or focal reducer only gives round stars to the corners when the sensor sits at one exact distance behind it, the "backfocus", often 55 mm. Between them sit the camera, perhaps a filter wheel or an off-axis guider, adapters and spacers, and filters push the focus back a little too. This calculator adds it all up, tells you how much spacing is missing, and picks the combination of your own spacers that comes closest, using as few as possible.

## How to use it

1. Type the **backfocus** from your reducer's or flattener's manual.
2. List the **parts in the light path**, one per line, with the optical length each one adds in mm. A camera's figure is the distance from its front face to the sensor (often 17.5 or 12.5 mm). A filter wheel or off-axis guider adds its body thickness. Use the length a part adds when mounted, not the length of its thread.
3. Type the **filter thickness** if a filter sits between the reducer and the sensor. Glass of index n moves focus back by t × (1 − 1/n), about a third of its thickness: 0.67 mm for a 2 mm filter. Type 0 if there is none.
4. List the **spacers you have**, for example "10, 5, 2 x2, 1, 0.5". Fine-tuning rings of 0.1 to 0.5 mm help you get close.
5. The result shows the gap, the best stack, and how far it is from perfect. It updates as you type.

## Worked example

A reducer needs 55 mm. The camera adds 17.5 mm, the filter wheel 20 mm and the off-axis guider 9 mm, 46.5 mm in all. A 2 mm filter adds 0.67 mm, so the target is 55.67 mm and the gap is 9.17 mm. From spacers of 10, 5, 2, 2, 1, 0.5, 0.3, 0.2 and 0.1 mm, the best stack is 5 + 2 + 2 + 0.2 = 9.2 mm, which is 0.03 mm long: well inside the tolerance of any reducer.

## Frequently asked questions

**How exact does it need to be?** Most reducers and flatteners are happy within about ±0.5 mm. Fast optics and large sensors are pickier, so get as close as you can and then check the corners of a star field.

**My corner stars still look stretched.** If stars point away from the centre like a comet's tail, change the spacing in small steps (0.2 to 0.5 mm) and compare. Which way to go depends on the optics; your manual usually says. Tilt or a mis-collimated camera can look similar, so check that all four corners look alike.

**Does anything leave my computer?** No. All the sums are done in your browser and the page works offline.
