---
name: Touch Test
num: 3075
shelf: everyday
code: T1056
section: controls
title: "Touch screen test: check multi-touch, dead zones, pressure and stylus"
seoTitle: "Touch screen test online: multi-touch, dead zones"
summary: "Check your touch screen: see every finger with its number, how many touches it handles at once, pressure and stylus tilt, and find dead spots with a coverage grid. Nothing is stored."
status: live
ads: false
order: 3075
icon: pointer
works: offline
updated: 2026-11-19
related: [screen-test, mouse-test, vibration-test, sensor-test]
sources:
  - "Touches come from pointer events (pointerType touch or pen): pointerId, clientX/Y, pressure, width, height, tiltX and tiltY. The device's own limit is navigator.maxTouchPoints."
  - "Dead-zone coverage is the share of grid squares (8 x 12 on tall screens, 12 x 8 on wide ones) you touched, counted in src/lib/device/core.ts and checked in tests/device.mjs. The grid size is fibub's own choice."
flow:
  - { icon: pointer, label: "Touch" }
  - { icon: pencil, label: "Swipe" }
  - { icon: percent, label: "Coverage" }
---

## What it does

The Touch Test shows a touch area where every finger is drawn as a ring with its own number. It tells you how many touches are down now, the most you have used at once, and what the device says it supports. It also reads the pressure, the contact size and, for a stylus, the pen's tilt, whatever the screen reports.

A second mode, **Dead zones**, splits the area into a grid of squares that fill in as you swipe. Any square you cannot fill may be a dead spot on a cracked, worn or badly calibrated screen, and a percentage shows how much of the screen you have covered. It runs in your browser; nothing is stored or sent. Check the picture itself with the [[screen-test]], a pointer with the [[mouse-test]], and the phone's motion hardware with the [[sensor-test]].

## How to test your touch screen

1. Touch the area with one finger and draw. Add fingers one at a time and watch the ring numbers and the **Most at once** figure.
2. Switch to **Dead zones** and press **Clear**. Swipe slowly back and forth until every square is filled; leave nothing out.
3. Look for squares that stay white however many times you swipe over them.
4. Use **Full screen** to test the edges and corners (not available on iPhone). Press **Clear** to start again.

## What each part shows

- **Touching now / Most at once**: fingers down right now, and the highest number seen together.
- **Device says it supports**: the touch points the device reports. Many phones say 5 or 10; the real limit can be lower.
- **Input type**: touch, stylus (pen) or mouse.
- **Pressure**: 0 to 1. Many screens give a fixed 0.5, or 0, because they cannot sense force.
- **Contact size**: the touch width and height in pixels. Often fixed or 1 on some devices.
- **Pen tilt**: stylus lean in degrees, only for pens that report it.
- **Screen covered**: how much of the grid you touched.

## Worked example

On a tall phone the grid is 8 by 12, so 96 squares. If you swipe everywhere except one corner square, the test reads 95 of 96, or 99%. If that same square stays white after many tries in different directions, the touch layer there may be dead. Five fingers down read "Most at once 5".

## Touch problems

- **Phantom touches or lag**: clean the screen, remove a thick screen protector, and try without a case.
- **A dead strip at the edge**: some phones ignore edge touches on purpose to avoid accidental taps. Test it with a flat finger.
- **Fewer touches than expected**: some screens drop touches when palms rest on the edge; try fingertips only.
- **The page will not scroll**: it is blocked only while a finger is on the test area. Touch outside it to scroll.

## FAQs

**Why is the pressure always 0.5?** Most touch screens cannot measure force, so browsers report a placeholder. Real values mostly come from styluses and a few phones.

**Does it work on a laptop with a touch screen?** Yes. A mouse draws too, one point at a time.

**Does the dead-zone test prove a screen is broken?** It shows where the screen did not register a touch. Also swipe slowly, because very fast strokes can skip squares even on a good screen.

**Is anything recorded?** No. Touches are drawn and forgotten; nothing is saved or sent.
