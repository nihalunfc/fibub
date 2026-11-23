---
name: Sensor Test
num: 3079
shelf: everyday
code: T1060
section: screen-sensors
title: "Sensor test: check your phone's accelerometer, gyroscope and compass online"
summary: "See your phone or tablet's motion sensors live: accelerometer, gyroscope, compass, a bubble level, a shake graph and the update rate. Says plainly when a device has none."
seoTitle: "Sensor test online: accelerometer, gyro, compass"
status: live
ads: false
order: 3079
icon: compass
works: offline
updated: 2026-11-19
related: [vibration-test, touch-test, battery-test, device-info, live-trackers, g-force-meter]
sources:
  - "Readings come from the browser's DeviceMotionEvent (acceleration in m/s², rotation rate in degrees per second) and DeviceOrientationEvent (alpha, beta, gamma in degrees). iPhone and iPad need a tap to grant permission."
  - "Tilt is atan2 of the gravity components in degrees; compass heading is 360 minus alpha for absolute orientation, or webkitCompassHeading on iOS. Checked in tests/device.mjs."
  - "The light sensor uses the Generic Sensor API's AmbientLightSensor, which is behind a flag in Chrome and absent elsewhere. The shake threshold (more than 6 m/s² away from gravity) is fibub's own rule of thumb."
flow:
  - { icon: phone, label: "Start" }
  - { icon: compass, label: "Move it" }
  - { icon: check, label: "Check" }
---

## What it does

The Sensor Test shows the motion sensors inside your phone or tablet, live. It reads the accelerometer (how the device speeds up and which way gravity pulls), the gyroscope (how fast it turns) and the orientation and compass (which way it points). A bubble level on a canvas shows tilt in degrees, a rolling graph shows total acceleration so you can see shakes, and the page measures how many readings per second your browser delivers.

Everything is read in the page and goes nowhere. On a laptop or desktop most of these sensors do not exist, so no readings arrive; after one and a half seconds the page says so in plain words instead of staying blank. To check the vibration motor, battery or screen touches, try the [[vibration-test]], the [[battery-test]] or the [[touch-test]].

## How to test the sensors

1. Open the page on a phone or tablet and press **Start sensors**. On iPhone and iPad, tap **Allow** when asked for motion access.
2. Lay the device flat. The bubble should sit in the centre and both tilts read close to 0°.
3. Tilt it, turn it around and watch the compass and the readings change.
4. Shake it: the graph spikes and a red "Shake!" appears.
5. Press **Stop** when finished.

## What each part shows

- **Tilt left-right and front-back**: degrees from flat, worked out from gravity.
- **Compass**: the direction the device points, with a letter such as NE. It needs a working magnetometer and may be a few degrees off near metal or magnets.
- **Sample rate**: motion readings per second. Phones commonly give 50 to 60 Hz; browsers may limit it.
- **Acceleration with gravity**: x, y and z in metres per second squared. Flat on a table, z is about 9.8.
- **Acceleration without gravity**: only the movement you add. Near zero when still.
- **Turning speed**: gyroscope rotation in degrees per second.
- **Ambient light**: only where the rare light sensor is switched on (a Chrome flag).

## Worked example

Prop a phone up so it leans 10 degrees to one side. Gravity splits into about 1.70 m/s² along the side and 9.66 m/s² through the screen, so the page shows a tilt of 10.0° left-right and 0.0° front-back, and the bubble moves off centre.

## If nothing moves

- **Laptop or desktop**: most have no motion sensors; the page says so after 1.5 seconds.
- **iPhone**: you must allow motion access. If you tapped Don't Allow, quit Safari, reopen the page and try again, or check Settings > Safari > Motion & Orientation Access.
- **Android**: make sure the page is on https and that the browser site settings allow motion sensors.
- **Compass shows a dash**: the device has no magnetometer, or the browser does not report an absolute direction.

## FAQs

**Why does the compass not show on my Android phone?** Chrome reports an absolute heading only when the magnetometer is available and calibrated. Wave the phone in a figure of eight and press Start again.

**Is the bubble level accurate?** It is good to about a degree on a flat, steady surface. Calibration differs between devices, so check against a known flat table.

**Does it work offline?** Yes, once the page has loaded.

**Why is the sample rate lower than my phone's spec?** Browsers cap sensor speed for privacy and battery.
