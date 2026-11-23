---
name: Live Trackers
num: 3098
shelf: everyday
code: T1079
section: screen-sensors
title: "Live trackers: see every sensor your phone has, from GPS speed and altitude to g-force, steps and compass"
summary: "One button checks which sensors your phone, tablet or laptop has and shows a live card for each that works: speed, altitude, compass heading, g-force, steps, tilt, light, battery and Bluetooth fitness machines. Each card opens its full tool."
seoTitle: "Live phone sensors: speed, altitude, g-force, steps"
status: live
ads: false
order: 3098
icon: compass
works: offline
updated: 2026-11-23
related: [speedometer, g-force-meter, step-counter, ergometer-link, sensor-test, device-info]
sources:
  - "Location, speed and altitude: Geolocation API. Motion and tilt: DeviceMotionEvent. Compass: DeviceOrientationEvent (absolute) or iOS webkitCompassHeading. Light: Generic Sensor API AmbientLightSensor. Battery: Battery Status API. Bluetooth: Web Bluetooth. Which browsers offer each one follows the MDN browser compatibility tables, checked 2026-11-23."
  - "G-force on the card is how far the total acceleration is from 1 g (standard gravity 9.806 65 m/s²); step counting and speed maths are shared with the full tools and checked in tests/device.mjs."
flow:
  - { icon: phone, label: "Check" }
  - { icon: check, label: "Found" }
  - { icon: chart, label: "Live" }
---

## What it does

Live Trackers answers one question: what can this device measure, right now? Press the button and the page checks every sensor the browser can reach, then shows a live card only for those that actually work on your phone, tablet or laptop. Phones usually show speed, altitude, compass heading, g-force, steps and tilt; laptops often show only battery and, in Chrome or Edge, Bluetooth fitness machines. Anything missing is listed at the end with the plain reason, such as "no accelerometer" or "this browser does not offer it".

Each card opens the full tool: the [[speedometer]] for GPS speed with top speed, distance and alerts; the [[g-force-meter]] for braking and cornering; the [[step-counter]] for a pedometer; and [[ergometer-link]] for rowing machines, smart bikes, power meters and heart-rate straps.

## How to use it

1. Leave "Include location" ticked if you want speed and altitude, or untick it to keep location off.
2. Press **Check my device and start**. Allow location and, on iPhone or iPad, motion access.
3. Watch the cards fill in after a second or two. Tap any card for its full tool.
4. Press **Stop** to switch the sensors off.

## What each card shows

- **Speed (GPS)**: speed now, accuracy and top speed. km/h, or mph if your browser is set to US or UK English.
- **Altitude (GPS)**: height above sea level and how sure the GPS is.
- **Compass heading**: degrees and compass point, from the magnetometer.
- **G-force**: how far the total push differs from gravity right now, and the peak.
- **Steps**: steps counted since you pressed start.
- **Tilt**: left-right and front-back tilt in degrees.
- **Light**: lux from the light sensor, where the browser allows it.
- **Battery**: charge level and whether it is charging.
- **Bluetooth fitness**: shown when the browser can talk to fitness machines.

## Worked example

On a typical Android phone in Chrome, outdoors, the page shows Speed 0 km/h (±5 m), Altitude 182 m, Compass 270° W, G-force 0.01 g, Steps 0, Tilt 2°, 1°, Battery 76% and Bluetooth fitness Ready; only Light is listed as missing, because Chrome hides that sensor behind a flag. On an iPhone, Battery and Bluetooth are missing too, because Safari offers neither. On a desktop computer with no motion sensors, motion and compass are listed as missing after two seconds.

## FAQs

**Why is a sensor missing when my phone has it?** The browser decides what a web page may read. Light, barometer (air pressure) and step-count history are kept from web pages by every browser today, even when the hardware exists.

**Is anything saved or sent?** No. Readings stay in the page and stop when you press Stop or leave.

**Does it run in the background?** No. Browsers pause sensors when the page is hidden or the screen locks, so keep it open.

**What about heart rate?** Phones do not let web pages read their own heart sensors, but a Bluetooth chest strap works through the Ergometer Link tool in Chrome or Edge.
