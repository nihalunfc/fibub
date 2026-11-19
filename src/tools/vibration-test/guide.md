---
name: Vibration Test
num: 3078
shelf: everyday
code: T1059
section: screen-sensors
title: "Vibration test: check your phone vibrates, with buzz patterns and SOS"
summary: "Test your phone's vibration motor in the browser: short, long, pulse, SOS and heartbeat buzzes, or type your own pattern. Says plainly when your browser or device cannot vibrate."
seoTitle: "Vibration test online: does my phone vibrate?"
status: live
ads: false
order: 3078
icon: phone
works: offline
updated: 2026-11-19
related: [touch-test, sensor-test, gamepad-test, battery-test]
sources:
  - "Buzzes use navigator.vibrate(pattern) from the Vibration API: numbers alternate buzz and pause in milliseconds; vibrate(0) stops. Browsers cap very long patterns."
  - "Available in Chrome, Firefox and Samsung Internet on Android; Safari on iPhone and iPad does not implement it (see MDN browser compatibility)."
  - "The preset patterns (SOS as three short, three long, three short; heartbeat) are fibub's own."
flow:
  - { icon: phone, label: "Pick buzz" }
  - { icon: wave, label: "Feel it" }
  - { icon: check, label: "Check" }
---

## What it does

The Vibration Test checks whether your phone's vibration motor can be triggered by a web page. Press a button and the phone buzzes: a short tap, a one second buzz, a pulse, the SOS signal in Morse, or a heartbeat. You can also type your own pattern as a list of times in milliseconds, alternating buzz and pause, and a **Stop** button cuts it off.

The page tells you plainly what is going on. If the browser has no vibration support, it says so instead of staying silent: that is the case on every iPhone and iPad, and on laptops and desktops, which have no motor. Nothing is sent or stored anywhere. For the other touch hardware, try the [[touch-test]], the [[sensor-test]], or the [[gamepad-test]] for controller rumble.

## How to test the vibration

1. Open this page on an Android phone in Chrome, Firefox or Samsung Internet.
2. Tap **Short buzz**. Hold the phone in your hand so you can feel it.
3. Try **Long**, **Pulse**, **SOS** and **Heartbeat** to hear and feel different rhythms.
4. For your own rhythm, type numbers like `200, 100, 200` and press **Play my pattern**.
5. Press **Stop** to end a long pattern early.

## What each part shows

- **Status line**: says whether this browser has the Vibration API and whether the last request was accepted.
- **Preset buttons**: ready-made patterns. SOS is three short, three long, three short buzzes and lasts 2.7 seconds.
- **Your own pattern**: odd numbers are buzz times, even numbers are pauses. The line under the box shows the steps and total length.
- **Stop**: sends a zero, which cancels any buzz in progress.

## Worked example

The pattern `200, 100, 200` is a 200 ms buzz, a 100 ms pause and another 200 ms buzz: 3 steps and 500 ms in total, which the page shows under the box. The SOS preset is 17 steps and 2,700 ms.

## If it does not vibrate

- **iPhone or iPad**: no browser there can vibrate from a web page. Open Settings, then Sounds & Haptics, and try a haptic to test the motor.
- **Laptop or desktop**: there is no vibration motor.
- **Android, no buzz**: turn off battery saver and Do Not Disturb, check Settings for touch or vibration intensity, and tap the page once before pressing a button.
- **"The browser refused"**: the browser returned false from vibrate(), usually because the page was not tapped yet or the system has vibration switched off.

## FAQs

**Why does my iPhone not vibrate?** Apple does not support the Vibration API in Safari or in any iOS browser. This is a limit of the phone, not of the page.

**Is there a longest pattern?** Browsers cap the length. This page accepts up to 50 steps of at most 10 seconds each.

**Does it work offline?** Yes. Once the page has loaded, nothing needs the internet.

**Can it test my game controller?** Not here. Use the gamepad test, which can rumble controllers that support it.
