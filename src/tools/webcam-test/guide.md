---
name: Webcam Test
num: 3072
shelf: everyday
code: T1053
section: sound-camera
title: "Webcam test: check your camera, resolution, frame rate and brightness online"
seoTitle: "Webcam test online: check your camera works"
summary: "Check your webcam in the browser: live picture, real resolution, measured frame rate, brightness, the most the camera can do, and a snapshot. Nothing is recorded or sent anywhere."
status: live
ads: false
order: 3072
icon: camera
works: offline
updated: 2026-11-19
related: [mic-test, screen-recorder, frame-grabber, device-info]
sources:
  - "Resolution, frame rate and capabilities are what the browser reports through MediaStreamTrack.getSettings() and getCapabilities(); some browsers leave some out (Safari and Firefox report fewer)."
  - "Frame rate is measured here: the median gap between frames from requestVideoFrameCallback (or the video clock where that is missing), shown as frames per second."
  - "Brightness is the average of 0.2126 R + 0.7152 G + 0.0722 B (Rec. 709 luma) over a small copy of the picture. The dark and bright warnings (below 20% and above 85%) are fibub's own rule of thumb."
flow:
  - { icon: camera, label: "Allow camera" }
  - { icon: eye, label: "See picture" }
  - { icon: image, label: "Snapshot" }
---

## What it does

The Webcam Test shows what your camera sees and what it really delivers. Press **Start camera**, allow access, and you get a live picture plus the actual resolution, the measured frames per second, and a brightness reading that warns you when the room is too dark for a video call. A table shows the most the camera says it can do, and **Take snapshot** keeps a still image you can look at closely or save.

It works with built-in and USB webcams and with the front and back cameras on a phone. The picture is shown in your browser and nothing is recorded or sent anywhere; the camera light goes off when you press Stop or leave the page. To check your sound too, use the [[mic-test]]; to pick a frame out of a video, the [[frame-grabber]]; and to capture your screen, the [[screen-recorder]].

## How to test your webcam

1. Pick the camera in the list (names appear after you allow access once). On a phone, choose **Front** or **Back**.
2. Press **Start camera** and allow it when the browser asks.
3. Check the picture, the resolution, the frames per second and the brightness line.
4. Tick **Mirror** if you want it to look like a mirror, as call apps do. This only changes the preview.
5. Press **Take snapshot** to keep a still. Press **Stop** when you are done.

## What each part shows

- **Resolution**: the size of the picture the camera is sending now, with its usual name (for example 1080p Full HD) and shape (16:9, 4:3).
- **Frame rate**: how many pictures per second really arrive. 30 is normal; dim rooms often drop it to 15 as the camera lengthens its exposure.
- **Brightness**: average light in the picture from 0% (black) to 100% (white). Between about 25% and 75% is comfortable.
- **Most the camera can do**: the largest width, height and frame rate the browser says the camera supports.
- **Mirror**: flips the preview left to right; snapshots match what you see.
- **Snapshot**: a still image kept in this page only, with an optional **Save image** link.

## Worked example

A laptop webcam might show 1280 x 720, "720p (HD)", 16:9, 30 fps and brightness 45%, with a maximum of 1920 x 1080. The picture is 720p because the browser asked for the highest available and the camera or connection chose less. Switching on a lamp moves brightness from 12% ("too dark") to 50%.

## If the camera does not work

- **"Not allowed"**: click the lock or camera icon by the address bar and allow the camera. On Windows check Settings > Privacy > Camera; on a Mac, System Settings > Privacy & Security > Camera.
- **"Another app is using it"**: close video calls and other tabs that use the camera.
- **Black picture**: check the physical privacy shutter or a switch on the keyboard.
- **Low frame rate**: more light usually fixes it; also close other apps using the camera.

## FAQs

**Is my video recorded or uploaded?** No. The picture stays in your browser. Snapshots are kept in this page and vanish when you leave unless you save one yourself.

**Why is the resolution lower than the camera box says?** Cameras often send less over USB or in low light. The figure shown is what actually arrives.

**Why is the frame rate shown as a few frames lower than 30?** It is measured, so small drops show. Tabs in the background also slow it down.

**Does it work on iPhone?** Yes, in Safari and other browsers on iOS 14.3 and later; fewer capabilities are reported there.
