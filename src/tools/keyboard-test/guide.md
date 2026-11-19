---
name: Keyboard Test
num: 3073
shelf: everyday
code: T1054
section: controls
title: "Keyboard test: check every key works, with an on-screen keyboard and rollover"
seoTitle: "Keyboard test online: check every key works"
summary: "Press each key and watch it light up on an on-screen keyboard. See which keys you have tested, the last key's code, and how many keys you can hold at once. Nothing you type is stored."
status: live
ads: false
order: 3073
icon: pointer
works: offline
updated: 2026-11-19
related: [mouse-test, reaction-time-test, midi-test, device-info]
sources:
  - "Keys are read from the browser's KeyboardEvent: key (the character), code (the physical key, such as KeyA) and location (left, right or numpad)."
  - "Key names on your layout come from navigator.keyboard.getLayoutMap(), which only Chromium browsers offer; elsewhere the labels follow a US layout."
  - "Rollover is the largest number of keys seen down at the same moment, counted from keydown and keyup events. Checked in tests/device.mjs."
flow:
  - { icon: pointer, label: "Click box" }
  - { icon: pencil, label: "Press keys" }
  - { icon: check, label: "All green" }
---

## What it does

The Keyboard Test shows a full-size keyboard on screen and lights each key while you hold it. A key stays green once it has worked, so a quick sweep across the keyboard shows which keys never responded. It also shows the last key's name, its physical code, whether it is a left, right or numpad key, and whether the press was an auto-repeat.

It is useful for a new or second-hand keyboard, a laptop after a spill, or a key that "sometimes" misses. The **Most at once** figure shows rollover: how many keys the keyboard reports together, which matters for gaming and fast typing. Nothing you type is stored or sent anywhere. To check the other half of your desk, use the [[mouse-test]]; for your hands' speed, the [[reaction-time-test]]; for a music keyboard, the [[midi-test]].

## How to test your keyboard

1. Click the keyboard picture ("Click here to start"). The box gets a solid border while it is listening.
2. Press every key once. Each turns green. Hold a key to see it stay lit while held.
3. Choose **Laptop** to hide the number pad and the Insert/Home block, or **Full** to test them.
4. Press **Reset** to start again. Click outside the box to leave it (Tab is captured while testing).

## What each part shows

- **Keys tested**: green keys out of the keys on the picture. Hidden keys are not counted.
- **Held now / Most at once**: keys down right now, and the highest number seen together (rollover).
- **Last key, Code, Location**: what the browser reported. The code names the physical key, so it stays the same on any language layout.
- **Auto-repeat**: "yes" when the key is held and the system is repeating it.
- **Rollover**: if you press three keys and a fourth appears, or one vanishes, the keyboard is "ghosting".

## Worked example

Press and hold Q, W and E together, then release. **Most at once** reads 3, and Q, W, E stay green. A basic membrane keyboard may stop at 3 to 6 keys; a gaming keyboard with N-key rollover shows as many as you can press.

## A key stays dark

- **Fn, media, brightness and volume keys** are handled by the laptop and never reach a web page. Windows/Cmd combinations, and Print Screen on some systems, are also taken by the system.
- **Try the key in another app.** If it types nowhere, it may be worn, dirty or broken. Clean under it with compressed air.
- **Check the layout.** A key may type a different character than printed if the system language differs, but the code and the lit position will match the physical key.
- **On a phone or tablet**, the on-screen keyboard does not send physical key events; connect a keyboard.

## FAQs

**Is what I type saved?** No. Key presses are shown on screen and forgotten when you reset or leave. Nothing is uploaded.

**Why does the page not scroll when I press Space or the arrows?** While the box is focused the test blocks those keys so they only light up. Click outside the box and they work normally.

**Why is the Fn key never lit?** Fn is handled inside the keyboard hardware and is not sent to the computer at all.

**Can it tell me my keyboard's exact rollover?** It reports the most keys you managed to hold; press more keys together to find the limit.
