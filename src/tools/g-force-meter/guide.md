---
name: G-Force Meter
num: 3095
shelf: everyday
code: T1076
section: screen-sensors
title: "G-force meter: measure braking, acceleration and cornering g with your phone"
summary: "A live g-meter from your phone's accelerometer: a g-ball, forward, sideways and up-down g, and peaks for the hardest braking, speeding up, left and right turns and bumps, with a 10-second trace. Nothing is recorded or sent."
seoTitle: "G-force meter online: braking and cornering g"
status: live
ads: false
order: 3095
icon: compass
works: offline
updated: 2026-11-23
related: [speedometer, sensor-test, live-trackers, phone-seismometer, trip-tracker]
sources:
  - "Readings come from the browser's DeviceMotionEvent (accelerationIncludingGravity, m/s²). iPhone and iPad need a tap to grant motion access."
  - "The car frame is built from the gravity reading at rest: up is the gravity direction, forward is the phone's top (lying flat) or its back (upright in a holder) with the up part removed, and right is forward × up. The g values are the change from the resting reading divided by standard gravity, 9.806 65 m/s² (CGPM 1901). Checked in tests/device.mjs."
  - "Typical values (calm driving under 0.3 g, emergency stops 0.8 to 1 g, road-car cornering up to about 0.9 g) are rounded figures from vehicle dynamics texts such as Gillespie, Fundamentals of Vehicle Dynamics (SAE, 1992); treat them as a rough guide."
  - "Smoothing (a 0.12 s time constant) is fibub's own choice."
flow:
  - { icon: phone, label: "Fix it" }
  - { icon: target, label: "Zero" }
  - { icon: compass, label: "Drive" }
  - { icon: chart, label: "Peaks" }
---

## What it does

G-Force Meter reads your phone's accelerometer and shows the forces you feel in a car, on a bike, on a ride or in sport, in g (1 g is the pull of gravity). A dot on the g-ball moves the way you are pushed, like a ball rolling in a bowl: brake and it slides up, turn right and it slides left. Beside it you get forward and back g, sideways g and up-and-down g, and the peaks for the hardest braking, hardest speed-up, hardest left and right turns, the biggest bump and the biggest total. A trace shows the last 10 seconds.

Drivers use it to learn smooth braking and cornering, instructors to show a learner what "gentle" means, and the curious to see what a roller coaster or a lift does. Pair it with the [[speedometer]] for speed at the same time, or open [[sensor-test]] to check the raw sensor; [[live-trackers]] shows every sensor your device has.

## How to use it

1. Fix the phone so it cannot slide: flat in a tray or on the seat with its top pointing forward, or upright in a holder with the screen facing you.
2. Choose the matching placement chip.
3. Press **Start** (allow motion on iPhone or iPad) and keep still for about half a second while it zeroes.
4. Drive or ride. Press **Zero again** if the phone shifts, and **Reset peaks** to start a new run.

## What each setting does

- **Lying flat, top forward**: the top edge of the phone points the way you travel.
- **In a holder, screen facing me**: the back of the phone points the way you travel. A slightly tilted holder is fine: tilt is removed when it zeroes.
- **Zero again**: takes a fresh resting reading. Do it when stopped on level ground.
- **Reset peaks**: clears peaks and the trace.

## Worked example

The phone lies flat, top forward. At rest it reads 9.81 m/s² straight up out of the screen. You brake firmly and the reading along the top of the phone becomes −2.94 m/s². The change is −2.94 m/s², and −2.94 ÷ 9.807 = **−0.30 g** forward, so the Hardest braking peak reads **0.30 g** and the dot moves up. In a right turn the side reading becomes +4.90 m/s², which is **+0.50 g** sideways: a brisk corner. The page checks both these numbers in its tests.

## FAQs

**Why does the dot move left when I turn right?** It shows the push you feel. In a right turn the car pulls right, and your body (and the dot) is thrown to the left, like coffee sloshing in a cup.

**How accurate is it?** Phone accelerometers are good to a few hundredths of a g. Errors come mostly from the phone moving in its holder, tilting roads and hills (a 5° slope adds about 0.09 g), and engine buzz. Zero on level ground for best results.

**Does it record a log?** No. Nothing is saved; peaks stay only while the page is open. For a saved trip with speed-ups and braking events, use the trip tracker.

**Does it work on a laptop?** Most laptops have no accelerometer, so the page says so. Use a phone or tablet.

**Is it safe to use while driving?** Set it up before you go and never handle the phone while driving.
