---
name: Mouse Test
num: 3074
shelf: everyday
code: T1055
section: controls
title: "Mouse test: check buttons, double-click problems, scroll wheel and polling rate"
seoTitle: "Mouse test online: buttons, double-click, wheel"
summary: "Test every mouse button, catch a double-click problem, check the scroll wheel, draw a movement trail and see your mouse's report rate. Works with trackpads. Nothing is stored or sent."
status: live
ads: false
order: 3074
icon: pointer
works: offline
updated: 2026-11-19
related: [keyboard-test, touch-test, reaction-time-test, gamepad-test]
sources:
  - "Buttons come from pointer events: button 0 is left, 1 middle, 2 right, 3 back, 4 forward. Wheel values come from the wheel event (deltaX, deltaY, deltaMode)."
  - "Report (polling) rate is the median gap between move timestamps from pointerrawupdate or coalesced pointer events, rounded to a usual rate (125, 250, 500, 1000 Hz and so on). Checked in tests/device.mjs. Browsers may limit this."
  - "The 80 ms chatter threshold is fibub's own rule of thumb: people rarely click the same button twice within about 100 ms."
flow:
  - { icon: pointer, label: "Click pad" }
  - { icon: wave, label: "Move, scroll" }
  - { icon: check, label: "Read result" }
---

## What it does

The Mouse Test shows every button you press on a test pad: left, middle, right, back and forward light up and count. It watches the time between clicks, so it can warn you about a **double-click problem**, where one press registers as two clicks. That is a classic sign of a worn switch inside the mouse. It also counts scroll-wheel steps up, down, left and right, draws a trail as you move, and estimates the mouse's report (polling) rate.

It works with mice, trackpads, pen tablets and touch screens; the device row says what the browser sees. A trackpad two-finger swipe counts as the wheel, and a pinch arrives as Ctrl + wheel. Nothing is stored or sent anywhere. For your keyboard use the [[keyboard-test]]; for fingers on a screen, the [[touch-test]]; for how fast you react, the [[reaction-time-test]].

## How to test your mouse

1. Click, right-click and middle-click (press the wheel) on the pad. Try the back and forward side buttons if you have them. Each box turns green once it works.
2. Click normally a few times. If the red warning appears, the mouse registered two clicks under 80 ms apart.
3. Scroll the wheel up and down, and sideways if it tilts. The counters and the delta values change.
4. Move the mouse fast in circles for a few seconds to read the report rate.
5. Press **Clear and reset** to start over.

## What each part shows

- **Button boxes**: lit while held, green once tested, with a count of presses.
- **Double-clicks**: pairs of quick clicks the browser treated as a double-click.
- **Time since last click / Shortest gap**: milliseconds between presses of the same button. A normal double-click is 100 to 400 ms.
- **Chatter events**: gaps under 80 ms, which a hand cannot make.
- **Wheel counters and deltaY / deltaX**: how far each step scrolled. The unit is pixels on most mice and trackpads, sometimes lines.
- **Report rate**: how often the mouse reports its position. 125 Hz is basic, 1000 Hz is common for gaming mice.

## Worked example

You click the left button once a second for ten clicks: the shortest gap reads about 1000 ms and there are no warnings. On a mouse with a failing switch, a single press may show a gap of 30 ms and a chatter event, and the warning appears. A gaming mouse moved quickly may show about 1000 Hz; an ordinary office mouse about 125 Hz.

## Something looks wrong

- **Report rate reads about 60 Hz**: some browsers merge movements into one per screen frame. Try Chrome or Edge, and move faster.
- **Side buttons do nothing**: they may be set to a macro in the mouse's own software, or the mouse may not have them.
- **Page jumps back or forward**: the test blocks this on the pad only; outside the pad the side buttons still navigate.
- **Chatter warning**: clean around the button, try another USB port, and if it persists the switch is worn; many makers replace under warranty.

## FAQs

**Can it measure my exact DPI?** No. Browsers do not know the mouse's DPI; they only see movement in screen pixels.

**Does it work on a laptop trackpad?** Yes. A tap is a left click, a two-finger tap is a right click on most laptops, and swipes count as wheel movement.

**Why is my polling rate lower than the box says?** Browsers, power saving and busy computers can reduce what a page sees. Treat it as a minimum.

**Is my mouse activity recorded?** No. Everything stays in this tab and is cleared when you leave.
