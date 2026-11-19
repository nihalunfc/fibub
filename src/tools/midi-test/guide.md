---
name: MIDI Test
num: 3081
shelf: everyday
code: T1062
section: controls
title: "MIDI test: check your MIDI keyboard or controller online"
summary: "Test a MIDI keyboard or controller in the browser: see the devices, every message as it arrives, a piano that lights up, knob values, and send a test note back."
seoTitle: "MIDI test online: check keyboard or controller"
status: live
ads: false
order: 3081
icon: play
works: offline
updated: 2026-11-19
related: [keyboard-test, gamepad-test, instrument-tuner, bpm-key-finder]
sources:
  - "Devices and messages come from the Web MIDI API, navigator.requestMIDIAccess({ sysex: false }). Chrome, Edge, Opera and Firefox support it; Safari and iOS browsers do not."
  - "Message names follow the MIDI 1.0 specification (status bytes 0x80 note off, 0x90 note on, 0xB0 control change, 0xF8 clock); middle C is note 60, shown as C4. Checked in tests/device.mjs."
  - "Controller 123 is the standard All Notes Off message. The piano drawing is fibub's own."
flow:
  - { icon: play, label: "Connect" }
  - { icon: wave, label: "Play keys" }
  - { icon: check, label: "Check" }
---

## What it does

The MIDI Test connects to a MIDI keyboard, drum pad, controller or interface plugged into your computer or Android phone and shows what it sends. It lists every input and output with its name, maker and state, logs each message as it arrives, lights the keys on a two-octave piano with the velocity you played, and keeps the latest value of every knob, slider and pedal. It also sends a test note back out to a synth to check the other direction.

It asks permission, uses no system-exclusive messages, and keeps everything in the tab: nothing is stored or sent. It needs a browser with Web MIDI, which means Chrome, Edge, Opera or Firefox; Safari and all iPhone and iPad browsers do not have it and the page says so. To check a computer keyboard or a game controller instead, use the [[keyboard-test]] or the [[gamepad-test]]; to tune an instrument, the [[instrument-tuner]].

## How to test a MIDI device

1. Plug in the device (and switch it on) before you start.
2. Press **Connect MIDI** and allow access.
3. Check that the device appears under Devices.
4. Press keys and move knobs. Watch the piano, the controller bars and the message list.
5. To test an output, pick it under **Send a test** and press **Play middle C**. **All notes off** stops any note that is stuck.

## What each part shows

- **Devices**: each input and output with name, maker, and whether it is connected.
- **Keys**: C3 to B4. A pressed key lights up; the line below gives its name and velocity, 1 to 127 (how hard you hit it).
- **Controllers**: the last value, 0 to 127, of each knob, slider or pedal, labelled by channel and controller number.
- **Messages**: newest first, up to 200. Clock messages are a constant tick from some gear and are hidden unless you untick the box.
- **Send a test**: sends middle C (note 60, velocity 100) for half a second, or controller 123.

## Worked example

Press middle C on a keyboard, fairly hard. The log reads "Note on C4 (60), velocity 100", the key marked C4 lights up and the line under the piano shows its velocity. Turn the mod wheel and "Control 1 = 64" appears, with a half-full bar in the Controllers list.

## If nothing shows up

- **"Does not support Web MIDI"**: switch to Chrome, Edge, Opera or Firefox on a computer or Android. iPhones and iPads cannot.
- **Permission blocked**: allow MIDI in the box or the lock icon by the address bar and press Connect again.
- **No devices**: try another USB cable or port, power the device on, and close other programs (such as a music app) that may hold the device exclusively.
- **Output sends but no sound**: the output must be a synth or a program that makes sound; many keyboards send only.

## FAQs

**Is my MIDI data stored?** No. Messages are shown in this tab only and gone when you close it.

**Why are some messages missing?** Clock messages are hidden by default, and system-exclusive messages are not requested at all.

**Does it work with Bluetooth MIDI?** Yes, if your system has paired the device so that the browser sees it.

**What is velocity?** How hard a key was struck, from 1 to 127. Some keyboards send a fixed value.
