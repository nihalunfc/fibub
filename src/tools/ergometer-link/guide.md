---
name: Ergometer Link
num: 3098
shelf: everyday
code: T1079
section: running
title: "Ergometer link: live power, cadence and heart rate from a Bluetooth rower, smart bike or power meter"
summary: "Connect a Bluetooth rowing machine, exercise bike, smart trainer, power meter or heart-rate strap in Chrome or Edge and see live watts, cadence or stroke rate, speed, pace per 500 m, distance and heart rate, with session averages and work done. No app or account; nothing is recorded or sent."
seoTitle: "Bluetooth ergometer, rower and bike power online"
status: live
ads: false
order: 3098
icon: chart
works: offline
updated: 2026-11-23
related: [heart-rate-zones, live-trackers, step-counter, pace-calculator, training-load]
sources:
  - "Bluetooth SIG GATT specifications: Heart Rate Service (Heart Rate Measurement 0x2A37), Cycling Power Service (Cycling Power Measurement 0x2A63) and Fitness Machine Service 1.0 (Indoor Bike Data 0x2AD2, Rower Data 0x2AD1). Field layouts and units follow the published specs; parsers written by fibub and checked with sample packets in tests/device.mjs."
  - "Connections use the browser's Web Bluetooth API, available in Chrome and Edge on Android, Windows, macOS and ChromeOS (MDN compatibility table, checked 2026-11-23)."
  - "Work done is power summed each second (1 kJ = 1 000 W·s). The 'about four times in food energy' note uses the usual 20 to 25% gross efficiency of human muscle for cycling and rowing."
  - "The demo rower's numbers are made up by the page."
flow:
  - { icon: phone, label: "Wake it" }
  - { icon: link, label: "Connect" }
  - { icon: chart, label: "Train" }
---

## What it does

Ergometer Link reads a Bluetooth exercise machine straight into your browser, with no maker's app and no account. Connect a rowing machine, exercise bike, smart trainer or bike power meter and see live **power in watts**, **cadence** (pedal turns a minute) or **stroke rate**, **speed**, **pace per 500 m**, **distance** and **heart rate**. Add a chest strap or armband for heart rate. The page also keeps session figures: time, average and top power, work done in kilojoules, and average and top heart rate, with a two-minute chart.

An ergometer is any machine that measures the work you do, and almost every one sold in recent years speaks the standard Bluetooth fitness services this page uses. Set your training zones first with [[heart-rate-zones]], keep an eye on weekly load with [[training-load]], and see what else your device can track in [[live-trackers]].

## How to use it

1. Use Chrome or Edge on Android, Windows, a Mac or a Chromebook, with Bluetooth on.
2. Close the machine's own app (most talk to one app at a time) and wake the machine by pedalling or rowing.
3. Press **Connect a rower, bike or power meter** and pick it from the list. Do the same with **Connect a heart-rate strap** if you have one.
4. Train. Readings update as the machine sends them, usually once a second.
5. **Reset session** starts the averages again; **Disconnect all** lets go of every device.

No machine? Press **Try a demo rower** to see the page work with made-up numbers.

## What each reading means

- **Power**: how hard you are working right now, in watts.
- **Cadence / stroke rate**: pedal turns or strokes a minute.
- **Pace per 500 m**: rowers' usual measure: the time to row 500 m at this speed.
- **Work done**: power added up over the session, in kJ.

## Worked example

A rower sends a packet saying 26 strokes a minute, stroke 120, 1,500 m, pace 115 seconds and 180 W. The page shows **26 strokes/min**, **1.50 km**, a pace of **1:55 per 500 m** and **180 W**. Rowing 10 minutes at a steady 180 W is 180 × 600 = 108,000 W·s, so work done reads **108 kJ**; your body burns about four times that, roughly 430 kJ or 100 kcal. The page's tests decode this exact packet.

## FAQs

**Why can't my iPhone connect?** Safari and every other iPhone or iPad browser do not offer Web Bluetooth yet. Use Chrome on Android or a computer.

**My machine does not appear in the list.** Wake it, close its own app and other apps that might be connected (Zwift, Kinomap, the maker's app), and move closer. Very old machines without the standard fitness service cannot be read.

**Is my data saved or uploaded?** No. Readings live in the page only and are gone when you close it.

**Can it control resistance?** Not yet: it only reads the machine.
