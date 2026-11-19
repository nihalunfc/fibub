---
name: Gamepad Test
num: 3077
shelf: everyday
code: T1058
section: controls
title: "Gamepad test: check buttons, sticks, drift and rumble on any controller"
seoTitle: "Gamepad test online: buttons, sticks, drift, rumble"
summary: "Plug in or pair a controller and see every button, trigger and stick live. Check for stick drift against a dead zone, read the raw axes, and test rumble. Nothing is stored or sent."
status: live
ads: false
order: 3077
icon: target
works: offline
updated: 2026-11-19
related: [keyboard-test, mouse-test, vibration-test, midi-test]
sources:
  - "Everything comes from the browser's Gamepad API (navigator.getGamepads): buttons (pressed, value 0 to 1), axes (-1 to 1) and the mapping name. Rumble uses vibrationActuator.playEffect('dual-rumble'), offered by Chromium browsers only."
  - "Stick drift is how far the stick rests from centre (the length of its x, y reading) averaged over one second, compared with the dead zone you pick. Checked in tests/device.mjs."
  - "The 10% default dead zone is fibub's own rule of thumb: many games use 5% to 20%."
flow:
  - { icon: play, label: "Press button" }
  - { icon: target, label: "Move sticks" }
  - { icon: check, label: "Check drift" }
---

## What it does

The Gamepad Test shows a connected controller live: every button lights when pressed, triggers fill as you squeeze them, and each stick is drawn as a dot inside a circle. A dashed ring marks the dead zone, the small area around the centre that games ignore. A table lists the raw axis values for anyone who wants exact numbers.

It is a quick way to check a new pad, spot **stick drift** (a stick that thinks it is pushed when you let go), find a worn button, or test rumble. It handles several controllers at once and works with Xbox, PlayStation, Switch and most generic pads, wired or Bluetooth. Nothing is stored or sent anywhere. Use the [[keyboard-test]] and [[mouse-test]] for the rest of your input devices, and the [[vibration-test]] to try your phone's own motor.

## How to test a controller

1. Connect the pad (USB cable or Bluetooth pairing in your system settings).
2. Press any button on it. Browsers hide controllers until a button is pressed, so sites cannot detect one silently.
3. Press every button and squeeze both triggers; each box lights, and triggers show a value from 0 to 1.
4. Roll each stick around the edge of its circle. The dot should follow smoothly and reach the ring.
5. Let go of the sticks and press **Check drift**. Wait one second for the verdict.
6. Press **Test rumble** if your browser supports it.

## What each part shows

- **Buttons**: named A, B, X, Y and so on on a standard layout; numbered on others. The number inside is the analogue value.
- **Stick circles**: the dot is the stick position. The dashed ring is the dead zone you chose.
- **Drift check**: the average distance from centre over one second, compared with the dead zone. It will say if the stick moved during the check.
- **Axes table**: raw values from -1 to 1; 0 is centre.
- **Test rumble**: a short two-motor buzz, in Chrome and Edge only.

## Worked example

You let go of the right stick, press **Check drift**, and it rests at (0.15, 0.02). That is 15% from the centre, outside the default 10% dead zone, so the test says "Drift". Many games would see the camera slowly turning on its own. At a 20% dead zone the same pad reads fine, which is why games often hide small drift with a bigger dead zone.

## When the pad is not found

- **Nothing appears**: press a button on the controller, not a key. Try another USB port or cable, and make sure the pad is not paired only to a console.
- **Buttons are numbered, not named**: the pad does not report the standard layout. The Axes table is still exact.
- **Rumble says unavailable**: Firefox and Safari do not offer rumble to web pages, and some pads only rumble in a wired mode.
- **iPhone and iPad**: Safari supports MFi, Xbox and PlayStation controllers once paired in Bluetooth settings.

## FAQs

**Is drift always a broken stick?** Dirt and wear are common causes; a gentle clean of the stick base can help. Slight rest values under 5% are normal.

**Why do two controllers share one page?** Each connected pad gets its own card; the dead zone applies to all.

**Does the page keep my button history?** No. It only shows what the pad is doing now.

**Why is Home or Share missing?** Those buttons are often handled by the system or console software and are not sent to the browser.
