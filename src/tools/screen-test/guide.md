---
name: Screen Test
num: 3076
shelf: everyday
code: T1057
section: screen-sensors
title: "Screen test: check dead pixels, refresh rate and screen details online"
seoTitle: "Screen test online: dead pixels and refresh rate"
summary: "Test your screen in the browser: full-screen colours to spot dead or stuck pixels, a banding view, your measured refresh rate, real pixel size, HDR and colour range, and pixels per inch."
status: live
ads: false
order: 3076
icon: eye
works: offline
updated: 2026-11-19
related: [touch-test, device-info, colour-vision-simulator, webcam-test]
sources:
  - "Screen facts come from screen.width, screen.height, devicePixelRatio, screen.colorDepth and the CSS media queries dynamic-range and color-gamut (p3, rec2020); browsers may round or hide some of them."
  - "Refresh rate is measured here: the median gap between requestAnimationFrame timestamps over about two seconds, rounded to the nearest usual panel rate. Browsers can cap it (for example in power-saving mode)."
  - "Pixels per inch is the diagonal in pixels divided by the diagonal in inches, the standard formula (checked in tests/device.mjs)."
flow:
  - { icon: eye, label: "Full screen" }
  - { icon: pointer, label: "Step colours" }
  - { icon: check, label: "Read facts" }
---

## What it does

The Screen Test helps you find dead or stuck pixels, check smooth colour, and see what your display really is. Press **Start full-screen test** and the whole screen turns one colour at a time: black, white, red, green, blue and grey. Tap, click or use the arrow keys to step, and press Esc to leave. A pixel that stays lit on black, or dark on white, is stuck or dead. A **gradient view** shows banding, and the page measures your **refresh rate** and lists the screen's size, depth, colour range and HDR support.

A **pixels per inch** box turns the screen's diagonal size into sharpness. It all runs in your browser; nothing is sent anywhere. To test touch input use the [[touch-test]], to see the rest of what your device reports the [[device-info]], and to see how colour looks with colour blindness the [[colour-vision-simulator]].

## How to test your screen

1. Clean the screen, then press **Start full-screen test** in a dim room.
2. Step through the colours. On black look for bright dots and for glowing edges or patches; on white and the colours look for dark or odd-coloured dots.
3. Press Esc to leave, then look at the **gradient** bars. They should be smooth, not stepped bands.
4. Press **Measure refresh rate** and keep this tab in front for two seconds.
5. Type your screen's diagonal in inches to get pixels per inch.

## What each part shows

- **Colour cycle**: solid colours that make dead (always black), stuck (always one colour) and hot (always lit) pixels easy to see.
- **Gradient view**: smooth ramps of grey, red, green and blue. Visible stripes mean banding, common on cheap panels or low colour depth.
- **Refresh rate**: how many times per second the browser can draw to the screen, usually 60, 90, 120 or 144.
- **Screen facts**: the size in physical pixels (width times height times display scaling), the size in CSS pixels the page sees, colour depth, HDR, colour range and orientation.
- **Pixels per inch (PPI)**: how tightly the pixels are packed. Phones are often 400 or more, laptops 100 to 220.

## Worked example

A laptop reports 1536 x 864 CSS pixels at a scale of 1.25, so its physical size is 1920 x 1080. With a 15.6-inch diagonal, PPI is the diagonal in pixels (about 2203) divided by 15.6, or roughly 141. The refresh test shows 60 Hz, so it is a standard panel.

## If the readings look wrong

- **Refresh rate reads 60 on a faster screen**: set the display to its top rate in system settings, and turn off battery saver. Some browsers cap animation to 60 Hz when saving power.
- **Number is lower than expected**: the page was in the background or the computer was busy; measure again with this tab in front.
- **Full screen does not open**: some phones and in-app browsers block it, so the page uses an overlay that fills the window instead.
- **Physical pixels look off**: browser zoom changes the scale. Reset zoom to 100% first.

## FAQs

**Can I fix a dead pixel with this?** This page finds them; it does not repair them. A stuck pixel (lit in one colour) sometimes recovers after gentle massage or time; a dead one rarely does. Check the warranty rules for your screen.

**How many dead pixels are acceptable?** Makers differ. Many follow ISO 9241-307 classes and accept a few; check your maker's policy.

**Why does HDR say no?** HDR needs a capable screen, HDR switched on in the system and a browser that reports it.

**Does the test store anything?** No. Nothing is saved or sent.
