---
name: Speedometer
num: 3094
shelf: everyday
code: T1075
section: reminders-travel
title: "Speedometer: live GPS speed in km/h, mph or knots, with top speed, distance and a speed alert"
summary: "A live GPS speedometer for your phone: speed now, top and average speed, distance, heading, altitude and climb, in km/h, mph, knots or m/s. Set a speed alert and use the mirrored windscreen view at night. Nothing is recorded or sent."
seoTitle: "GPS speedometer online: live speed in km/h or mph"
status: live
ads: false
order: 3094
icon: pointer
works: offline
updated: 2026-11-23
related: [trip-tracker, g-force-meter, live-trackers, gps-track-analyser, step-counter]
sources:
  - "Position, speed, heading, altitude and accuracy come from your browser's Geolocation API (watchPosition with high accuracy). Most phones report speed from the Doppler shift of the satellite signals, which is steadier than working it out from positions."
  - "When the browser gives no speed, it is worked out as distance over time with the haversine formula on a sphere of radius 6 371 008.8 m (the IUGG mean Earth radius); heading uses the initial great-circle bearing. Both are checked in tests/device.mjs."
  - "Unit factors: 1 m/s = 3.6 km/h = 2.236 94 mph = 1.943 84 knots (1 knot = 1 852 m an hour; 1 mile = 1 609.344 m, both exact by definition)."
  - "The standing-still threshold (0.5 m/s), the accuracy filter (fixes worse than ±50 m are not counted) and the 3 m step for counting climb are fibub's own rules of thumb against GPS jitter."
flow:
  - { icon: pointer, label: "Start" }
  - { icon: compass, label: "Move" }
  - { icon: chart, label: "Read" }
---

## What it does

Speedometer turns your phone into a live GPS speedometer. Press Start, allow location, and the big number shows how fast you are going right now, in km/h, mph, knots or metres per second. Under it you see your top speed, your average speed while moving, the distance covered, moving time, the direction you are heading, your altitude and how much you have climbed, plus how accurate the GPS fix is.

It is handy for checking a car's speedometer (most read a few percent high on purpose), for cycling, running, boating in knots, skiing, a train or plane window seat, or simply curiosity. Nothing is recorded: when you close the page, the figures are gone. To keep a route with a map-free record, speed-ups and a GPX file, use the [[trip-tracker]]; to feel the braking and cornering forces, open the [[g-force-meter]]; and [[live-trackers]] shows every sensor your device has at once.

## How to use it

1. Pick your units: km/h, mph, knots or m/s.
2. Press **Start** and allow location when the browser asks. The first fix can take up to a minute; outdoors with a clear sky is fastest.
3. Keep the page open with the screen on. The page asks the screen to stay awake while it runs.
4. Press **Stop** to pause the GPS. Your trip figures stay on screen until you press **Reset trip** or leave.

## What each setting does

- **Units**: changes every speed and distance on the page. Altitude shows in feet when you choose mph, otherwise in metres.
- **Speed alert**: tick "Beep, buzz and turn red" and type a limit in the chosen units. Above it the number turns red, the phone beeps and vibrates, and it repeats every few seconds while you stay over. Switching units keeps the same real speed.
- **Windscreen view**: a full-screen black page with a huge number, flipped top to bottom. At night, lay the phone flat on the dashboard, screen up, top toward the windscreen, and the reflection in the glass reads the right way up. Tap to close.
- **Reset trip**: clears top speed, average, distance, moving time and climb.

## Worked example

You drive at a steady 20 metres a second due north for 10 seconds. The GPS reports positions every second, 20 m apart. The page adds them up to 200 m in 10 s of moving time, so the average is 200 ÷ 10 = 20 m/s, which is 20 × 3.6 = **72 km/h**, 20 × 2.237 = **44.7 mph** or 20 × 1.944 = **38.9 knots**. The heading reads **0° N**. If your car's dial said 75 km/h at the same time, it reads about 4% high, which is normal: the law in most countries lets a speedometer read high but never low.

## FAQs

**Why does it show 0 when I am walking slowly?** Below 0.5 m/s (1.8 km/h) the page shows 0, because a GPS standing still drifts by a few metres and would otherwise look like slow movement.

**How accurate is GPS speed?** Usually within 1 km/h at steady speed with a clear sky. It lags by a second or so when you speed up or brake, and it is poor in tunnels, between tall buildings and indoors. Watch the accuracy figure: under ±10 m is good.

**Does it work with the screen off or in another app?** No. Browsers stop giving location to a page that is hidden or locked. A native app is needed for that.

**Is my location saved or sent?** No. Positions are used in the page and thrown away. There is no account and nothing goes to a server.

**Can I use it while driving?** Set it up before you set off and let a passenger handle it. Never touch the phone while driving, and follow your local law on phone mounts.
