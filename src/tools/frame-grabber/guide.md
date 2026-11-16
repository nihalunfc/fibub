---
name: Frame grabber
num: 2249
shelf: everyday
code: T966
section: video-audio
title: "Frame grabber: save a still image or every few seconds from a video as PNG or JPG"
seoTitle: "Extract frames from video as images, free online tool"
summary: "Save a still from your own video at the exact frame you choose, or one every few seconds as a ZIP of PNG, JPG or WebP images, at full or reduced size. Nothing is uploaded."
status: live
ads: false
order: 2249
icon: camera
works: offline
updated: 2026-11-16
related: [video-to-gif, video-trimmer, image-resizer, video-info]
sources:
  - "Frames are drawn by the browser's own video player onto a canvas (HTML Living Standard) and saved with its PNG, JPEG and WebP encoders; ZIP by fflate (MIT). Code is fibub's own."
flow:
  - { icon: file, label: "Open video" }
  - { icon: camera, label: "Pick frame" }
  - { icon: download, label: "Save image" }
---

## What it does

Pausing a video and taking a screenshot gives you the player's buttons, a blurry scaled copy and the wrong size. This tool saves the real frame at the video's own resolution: a clear still for a thumbnail, a photo from a family video, a slide from a recorded talk, or a series of frames for a report or a flip book. Step through frame by frame to get the exact moment, or save one frame every few seconds as a ZIP.

The video is played by your browser on this device and nothing is uploaded. To make a short animation instead, use [[video-to-gif]]; to make the stills smaller afterwards, use the [[image-resizer]].

## How to use it

1. Press **Open a video**.
2. Play or drag the video to the moment you want; use **◀ Frame** and **Frame ▶** to step.
3. Press **Save this frame**.
4. For many frames, set **From**, **To** and **One frame every**, then press **Save the frames as a ZIP**.

## What each setting does

- **Save as**: PNG keeps every pixel exactly but makes larger files; JPG and WebP are much smaller. For photos, JPG at 92 is hard to tell from PNG.
- **Quality**: for JPG and WebP only. Lower numbers make smaller, softer images.
- **Size**: full size, half or quarter of the video's width and height.
- **From, To and One frame every**: the part of the video and how often to take a frame, up to 300 frames at a time.

Each file name includes the time, such as `holiday-01m23.40s.png`, so you can find the moment again.

## Worked example

A 2-minute 1080p talk with a new slide every 15 seconds: set From 0, To 120 and One frame every 15. That makes 9 frames (0, 15, 30 ... 120 s), saved as 1920 × 1080 JPGs of about 200 to 400 KB each in one ZIP.

## FAQs

**Why does the step move by 1/30 of a second?** Most phone videos are 30 frames a second. At 25 or 60 frames a second, a step may land between frames or skip one; drag slowly for the exact one.

**Which videos work?** Any your browser can play: MP4, MOV and WebM almost everywhere, MKV in Chrome and Edge.

**Is my video uploaded?** No. Everything happens on this device.
