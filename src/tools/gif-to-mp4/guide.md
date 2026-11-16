---
name: GIF to MP4
num: 2267
shelf: everyday
code: T974
section: video-audio
title: "GIF to MP4: turn an animated GIF into a small MP4 video"
seoTitle: "GIF to MP4 converter, free online tool"
summary: "Turn an animated GIF into an MP4 video that is often 80 to 95% smaller and plays smoothly everywhere. Keeps each frame's timing. Nothing is uploaded."
status: live
ads: false
order: 2267
icon: convert
works: offline
updated: 2026-11-16
related: [video-to-gif, video-compressor, video-converter]
sources:
  - "GIF89a file format (CompuServe, 1990) with LZW compression. The GIF reader is fibub's own working, checked pixel for pixel against ffmpeg in tests/audio.mjs."
  - "Reading, writing and converting video with Mediabunny (MPL-2.0, credited in NOTICE), using the browser's own WebCodecs encoder and decoder (W3C). Nothing is uploaded."
flow:
  - { icon: image, label: "Open GIF" }
  - { icon: sliders, label: "Choose" }
  - { icon: convert, label: "Make MP4" }
  - { icon: download, label: "Download" }
---

## What it does

GIF is an old picture format: every frame is stored separately with only 256 colours, so animations get large fast. An MP4 video of the same animation is usually 80 to 95% smaller and looks better. Many sites (and most messaging apps) turn GIFs into videos behind the scenes for this reason. This tool does it in your browser, so the GIF is not uploaded.

It reads every frame with its own timing, the way browsers play GIFs, and fills see-through parts with white or black, since ordinary videos cannot be see-through. To go the other way, use [[video-to-gif]]; to make the video smaller still, use the [[video-compressor]] or the [[video-converter]] for other formats.

## How to use it

1. Press **Open a GIF** (or drop one on the box).
2. Choose how many times to **Play it**, the colour for see-through parts and the **Largest side**.
3. Press **Make the video**, check it in the page, then **Download**.

## What each setting does

- **Play it**: GIFs usually loop for ever; videos play once unless the player loops them. Choose 2 to 10 times for a longer video, for example to post on a site that does not loop.
- **See-through parts become**: white or black.
- **Largest side**: keeps the size, or makes the video smaller. Video encoders need even sizes, so a 99-pixel side becomes 100.

Frames that a GIF says last 0 or 10 ms are played for 100 ms, as browsers do.

## Worked example

A 96 × 64 test GIF with 15 frames at 10 frames per second is 1.5 s long. As MP4 it is a 96 × 64 video of 1.5 s; played 3 times it is 4.5 s. The checks for this page convert exactly this GIF and check the size and length of the video.

## FAQs

**Why is my MP4 bigger than the GIF?** That can happen with tiny GIFs of a few frames. For anything longer than a second, the video is almost always much smaller.

**Will it play on my phone?** Yes. MP4 with H.264 plays on every phone, computer and social site.

**Is my GIF uploaded?** No. Everything happens on this device.
