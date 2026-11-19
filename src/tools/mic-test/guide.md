---
name: Mic Test
num: 3070
shelf: everyday
code: T1051
section: sound-camera
title: "Mic test: check your microphone online, with a live level meter and playback"
seoTitle: "Mic test online: check your microphone works"
summary: "Check your microphone in the browser: a live level meter, a sound spectrum, the settings your browser uses, and a short record-and-play-back to hear how you sound. Nothing is recorded or sent."
status: live
ads: false
order: 3070
icon: mic
works: offline
updated: 2026-11-19
related: [speaker-test, webcam-test, voice-recorder, audio-spectrum-analyser]
sources:
  - "Levels are in dB below full scale (dBFS): 20 × log10 of the RMS or peak sample value; a full-scale sine is -3.01 dBFS RMS. Checked in tests/device.mjs."
  - "Level bands (quiet below -36 dB peak, good -36 to -6 dB, clipping at 0 dB) are fibub's own rule of thumb for speech, rounded from common recording advice to peak between -12 and -6 dB."
  - "Microphone settings (sample rate, channels, echo cancellation, noise suppression, auto gain, latency) are what the browser reports through MediaStreamTrack.getSettings(); some browsers leave some out."
flow:
  - { icon: mic, label: "Allow mic" }
  - { icon: chart, label: "Watch level" }
  - { icon: play, label: "Play back" }
---

## What it does

The Mic Test checks that your microphone works and is set to a sensible level, right in the browser. Press **Start microphone**, allow access, and speak: a bar shows the level as you talk, a spectrum shows which pitches it hears, and a plain sentence tells you whether you are too quiet, about right or so loud that the sound clips. You can then **record a few seconds and play them back** to hear exactly what other people hear on a call.

It works on laptops, desktops, phones and tablets, with built-in microphones, headsets, USB and Bluetooth mics. Nothing is recorded to a server or sent anywhere: the sound stays in your browser tab and the clip is gone when you leave. To check the other direction, use the [[speaker-test]]; for your camera, the [[webcam-test]]; to keep a recording, the [[voice-recorder]].

## How to test your microphone

1. Pick the microphone in the list (it shows names after you allow access once; until then it uses your default).
2. Press **Start microphone** and allow it when the browser asks.
3. Speak at your normal volume, about an arm's length away. Watch the bar and the sentence under the buttons.
4. Press **Record**, talk for the chosen length, and listen to the playback.
5. Press **Stop** when you are done. The browser's microphone light goes off.

## What each part shows

- **Level now**: how loud the sound is at this moment, in decibels below the loudest a recording can hold (0 dB). Speech usually sits between -40 and -15 dB.
- **Peak (last 2 s)**: the loudest point in the last two seconds; the thin line on the bar marks it. Peaks between -12 and -6 dB are ideal.
- **Spectrum**: bars from low pitches (left) to high (right). A voice shows a hump between about 100 Hz and 4 kHz; a flat line means silence.
- **Call clean-up**: switches on the browser's echo cancellation, noise suppression and automatic volume, as a video call would. Leave it off to hear the raw microphone.
- **Listen live**: sends the microphone to your speakers as you talk. Use headphones, or it will howl.
- **What the browser reports**: sample rate, channels and which clean-up the browser applied.

## Worked example

A laptop's built-in mic, speaking at arm's length, shows a level around -30 dB and peaks near -14 dB: "Good level for calls and recordings." Leaning in and shouting pushes the peak to 0 dB and the bar turns red: "Clipping". A headset mic switched to mute shows "silent" and the sentence says no sound is reaching the browser.

## Why does my microphone not work?

- **"Not allowed"**: the browser or the system blocked it. Click the lock or camera icon by the address bar and allow the microphone. On Windows, check Settings > Privacy > Microphone; on a Mac, System Settings > Privacy & Security > Microphone; on a phone, the browser app's permissions.
- **"Another app is using it"**: close video calls, recorders or other tabs using the mic.
- **No sound but no error**: check the mute switch on the headset or keyboard, the input volume in your sound settings, and that the right microphone is picked in the list.
- **Bluetooth headset sounds muffled**: many headsets drop to "headset" (call) quality while the mic is in use. That is normal for Bluetooth.

## FAQs

**Is my voice recorded or uploaded?** No. The sound is read in your browser to draw the meter. The playback clip is held in this tab only and is deleted when you close it.

**Why is the list of microphones empty or unnamed?** Browsers hide device names until you allow access once, so sites cannot fingerprint you. Press Start and the names appear.

**Why do the readings differ from my recording app?** Apps may apply their own gain and clean-up. Switch off **Call clean-up** here to see the raw level.

**Does it work on iPhone?** Yes, in Safari and other browsers on iOS 14.3 and later.
