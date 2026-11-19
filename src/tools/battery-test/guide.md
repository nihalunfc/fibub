---
name: Battery Test
num: 3080
shelf: everyday
code: T1061
section: screen-sensors
title: "Battery test: check battery level, charging and time left in your browser"
summary: "See your battery level, charging state and time left live in the browser, with a change log, a level chart and our own estimate. Says plainly which browsers cannot share it."
seoTitle: "Battery test online: level, charging, time left"
status: live
ads: false
order: 3080
icon: clock
works: offline
updated: 2026-11-19
related: [device-info, sensor-test, vibration-test, screen-test]
sources:
  - "Values come from the Battery Status API, navigator.getBattery(): level 0 to 1, charging, chargingTime and dischargingTime in seconds (Infinity when unknown). Only Chromium-based browsers offer it."
  - "Our time-left estimate is a straight line through two readings: minutes = level / (level change per minute), checked in tests/device.mjs. It needs at least 30 seconds and a changing level."
  - "Battery health figures are not available to web pages; use the system tools listed on the page."
flow:
  - { icon: clock, label: "Read it" }
  - { icon: chart, label: "Watch" }
  - { icon: check, label: "Check" }
---

## What it does

The Battery Test reads what your browser knows about the battery: the charge level, whether it is charging, and the time to full or time left as the browser reports it. It logs each change during your visit, draws a chart of the level, and works out its own time-left estimate from how fast the level has moved, which is often steadier than the browser's figure.

It only works where the browser shares battery information: Chromium browsers such as Chrome, Edge and Opera, on Windows, Mac, Android, ChromeOS and Linux. Safari, Firefox and all iPhone browsers do not, and the page says so rather than showing an error. Nothing is sent or stored. To compare with other device details, try the [[device-info]], the [[sensor-test]] or the [[screen-test]].

## How to test your battery

1. Press **Read battery**.
2. Read the level, charging state and times. "Not reported" means the browser does not know.
3. Leave the page open while you use or charge the device. The **Changes** list and the chart grow as the level moves.
4. Tick **Keep screen on while watching** if the screen keeps dimming. It uses more power.
5. For health and wear, use the system tools in "Good to know" on the page.

## What each part shows

- **Level**: the charge in percent, rounded by the browser (often to 1%).
- **Charging**: whether the charger is connected and charging.
- **Time to full / Time left (browser)**: the browser's own guess, or "not reported" when it has none.
- **Our estimate**: a straight-line guess from the level change since you opened the page. It shows "collecting…" until at least 30 seconds and one level step have passed.
- **Chart and Changes**: the level over this visit and a list of each change, newest first.

## Worked example

A laptop starts at 50% on battery. Ten minutes later it reads 49%. That is 1 point in 10 minutes, so the remaining 49 points would last 490 minutes: our estimate shows "8 h 10 min left". When you plug in and the browser reports 1,800 seconds to full, the page shows "30 min".

## If it shows nothing useful

- **"Does not share battery information"**: use a Chromium browser, or the system tools: Windows `powercfg /batteryreport`, Mac System Settings > Battery > Battery Health, iPhone Settings > Battery > Battery Health, Android Settings > Battery.
- **Always 100% and charging**: a desktop with no battery reports exactly this.
- **Level barely moves**: browsers round it, so it can sit still for many minutes.
- **Estimate jumps about**: heavy use changes the drain rate; the estimate follows the recent change.

## FAQs

**Why does Safari or my iPhone not work?** Apple and Mozilla chose not to offer the Battery API, partly because it could be used to track people. This is not a fault of your device.

**Can it tell me my battery's health?** No. Web pages cannot see capacity or wear. Use the system steps above.

**Is anything stored?** No. The log and chart live in this tab only.

**Does keeping the screen on use more power?** Yes. Leave it off unless you want to watch for a long time.
