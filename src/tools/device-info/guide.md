---
name: Device Info
num: 3082
shelf: everyday
code: T1063
section: screen-sensors
title: "Device info: see what your browser and device report, with a copyable report"
seoTitle: "Device info: what your browser reports"
summary: "See what your device and browser report: system, browser, screen, processor threads, memory, graphics, touch, language, time zone and which hardware tests work. Copy a text report. Nothing is sent."
status: live
ads: false
order: 3082
icon: search
works: offline
updated: 2026-11-19
related: [screen-test, speaker-test, battery-test, internet-speed-test]
sources:
  - "Every value is read from the browser itself: navigator (hardwareConcurrency, deviceMemory, maxTouchPoints, language, onLine, connection), screen, matchMedia, Intl, and the WebGL debug renderer extension for the graphics name."
  - "deviceMemory is rounded by the browser (to 0.25, 0.5, 1, 2, 4 or 8 GB at most) and exists in Chromium browsers only; connection type likewise. Browsers can hide or round other values."
  - "Which tests work is a feature check on each API; a yes means the browser offers it, not that the hardware is present. Pages and numbers are fibub's own."
flow:
  - { icon: search, label: "Open page" }
  - { icon: table, label: "Read list" }
  - { icon: copy, label: "Copy report" }
---

## What it does

Device Info lists what your device and browser tell any web page: the system and browser, screen size, processor threads, memory, graphics chip, touch points, language, time zone, whether you are online and what kind of connection the browser sees. A second table shows which hardware features this browser supports, with a link to the matching fibub test for each one, so you can go straight from "does it have a camera API?" to checking the camera.

All of it is read on your device and shown only to you. Nothing is sent, saved or tracked, and the page adds nothing beyond what it displays. Press **Copy report** to get the list as plain text for a support request or a bug report. To check the screen in detail use the [[screen-test]], for sound the [[speaker-test]], for the battery the [[battery-test]], and for your connection the [[internet-speed-test]].

## How to use it

1. Open the page; the list fills in at once.
2. Read down the table. Entries marked "not reported" are ones your browser does not share.
3. In **Hardware tests this browser can run**, follow a link to try that device.
4. Press **Copy report** and paste it where you need it.

## What each part shows

- **System and browser**: the operating system and browser worked out from the browser's own name tag. It can be wrong if you use a "desktop site" mode.
- **Screen**: physical size in pixels, display scaling and colour depth.
- **Processor threads**: how many tasks your processor runs at once (logical cores). Browsers may round this.
- **Memory**: roughly how much RAM, in gigabytes, rounded by the browser. Only Chromium browsers report it, and it tops out at 8 GB.
- **Graphics**: the graphics chip name, where the browser allows it.
- **Touch and pointer**: how many touches at once, and whether the main pointer is fine (mouse) or coarse (finger).
- **Language, time zone, online status**: from the browser settings.
- **Hardware tests**: Yes means the browser has the feature; it does not prove the hardware exists.

## Worked example

A laptop with Chrome shows "Windows, Chrome", 8 processor threads, memory 8 GB (the most Chrome will say, even if there is more), touch points 0, pointer fine with hover. In the hardware table, the vibration test says no, because desktop browsers have no vibration motor, while the keyboard, mouse and speaker tests say yes.

## If something looks wrong

- **Memory is missing**: Firefox and Safari do not report it.
- **Graphics is hidden**: some browsers mask it for privacy.
- **The OS looks wrong**: browsers freeze or simplify the system name; "Request desktop site" changes it on phones.
- **Copy does not work**: some browsers block copying without a tap; select the text in the box that appears and copy it by hand.

## FAQs

**Is anything sent to fibub?** No. The page reads these values and shows them to you. The report is only ever copied to your own clipboard when you press the button.

**Can websites see this?** Some of it, yes: most pages can read the same browser facts. This page shows it so you know what it is.

**Why does it say 8 GB when I have 32?** Browsers cap the number to make you harder to single out.

**Why is a test marked "no"?** Your browser lacks that feature, for example Safari has no Web MIDI and iPhones have no vibration support.
