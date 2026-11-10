---
name: Screen recorder
num: 2041
shelf: everyday
code: T924
section: video-audio
title: "Screen recorder: record your screen, a window or a tab in the browser"
summary: "Record your whole screen, one window or one browser tab, with tab sound where the browser offers it, then download the video as WebM. No install, no sign-up, nothing uploaded."
status: live
ads: false
order: 2041
icon: camera
works: offline
updated: 2026-11-10
related: [video-trimmer, video-to-gif]
sources:
  - "Browser Screen Capture API (getDisplayMedia, W3C Screen Capture) and MediaRecorder (W3C MediaStream Recording); WebM container. fibub's own working."
flow:
  - { icon: eye, label: "Choose" }
  - { icon: camera, label: "Record" }
  - { icon: clock, label: "Stop" }
  - { icon: download, label: "Download" }
---

## What it does

This tool records what is on your screen: the whole screen, one window or one browser tab. It uses the screen sharing built into your browser, so there is nothing to install, and the video is made and kept on this device. Nothing is uploaded, and the microphone is never used.

When it stops, you can watch the recording on the page and download it as a WebM video. To cut the start and end off, open it in the [[video-trimmer]]; to turn a short part into an animation, use [[video-to-gif]].

## How to use it

1. Pick a countdown and whether to record sound.
2. Press **Choose what to record**. Your browser asks what to share; pick a screen, window or tab and confirm.
3. After the countdown the timer starts. Use **Pause** and **Resume** as needed.
4. Press **Stop**, or end sharing from the browser's own bar. Watch the preview, then press **Download the recording (WebM)**.

## What each setting does

- **Countdown before recording**: none, 3, 5 or 10 seconds after you choose what to share, so you can switch to the right window first. Stop during the countdown cancels it.
- **Record sound from the tab or screen**: asks the browser for the sound of what you share. Chrome and Edge offer it for a tab, and on Windows for a whole screen; other browsers may record no sound. The status line says whether sound is being recorded.
- **Pause and Resume**: the paused time is left out of the video and the timer.

## Worked example

You want a two-minute walkthrough of a spreadsheet. Choose a 3 second countdown, press Choose what to record and pick the spreadsheet's window. After "Recording starts in 3…, 2…, 1…" the timer runs; pause for 20 seconds while you open the right file, then resume. Stop when the timer shows 02:00: the recording is two minutes long, without the pause, and is saved as screen-recording-2026-11-10.webm (the date you record).

## FAQs

**Does it work on a phone?** Mostly not. Phone and tablet browsers do not let pages record the screen; the page tells you when yours cannot.

**Can I record my voice?** No. This recorder never asks for the microphone.

**Why WebM?** It is what browsers record natively. It plays in Chrome, Edge, Firefox and VLC.
