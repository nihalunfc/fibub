---
name: Video compressor
num: 2250
shelf: everyday
code: T967
section: video-audio
title: "Video compressor: make a video smaller for email, WhatsApp or upload"
seoTitle: "Video compressor: reduce video size, free online tool"
summary: "Shrink your own MP4, MOV or WebM video to fit email, WhatsApp, Discord or an upload limit: choose a quality or a target size in MB, a smaller picture or no sound. Saves MP4. Nothing is uploaded."
status: live
ads: false
order: 2250
icon: shrink
works: offline
updated: 2026-11-16
related: [compress-file, video-trimmer, rotate-video, mute-video, video-info]
sources:
  - "Reading, writing and converting video with Mediabunny (MPL-2.0, credited in NOTICE), using the browser's own WebCodecs encoder and decoder (W3C). Nothing is uploaded."
flow:
  - { icon: file, label: "Open video" }
  - { icon: sliders, label: "Choose size" }
  - { icon: shrink, label: "Compress" }
  - { icon: download, label: "Download" }
---

## What it does

Phone videos are big: a minute of 4K can be 300 MB or more, far over the 25 MB most email services take or the limits of WhatsApp, Discord and many upload forms. This compressor makes your video smaller on your own device. It encodes the picture again at a lower bitrate, can shrink the picture to 1080p, 720p, 480p or 360p, and can drop the sound. The result is an MP4 (H.264 and AAC) that plays everywhere; on the few browsers that cannot make H.264 it saves WebM.

It uses the video encoder built into your browser, which is usually faster than playing the video, and nothing is uploaded, so private videos stay private. Cut out the part you need first with the [[video-trimmer]], fix a sideways video with [[rotate-video]], and check what is inside a file with [[video-info]]. For PDFs, images and office files, use [[compress-file]].

## How to use it

1. Press **Open a video** (or drop it on the box).
2. Under **Make it**, choose how small, or "Fit a size I choose" and type the size in MB.
3. Pick a **Picture size**. 720p is sharp on a phone and much smaller than 4K.
4. Press **Compress**, watch the result in the page, then **Download**.

## What each setting does

- **Smaller, good quality**: a balanced bitrate for the picture size; usually 3 to 10 times smaller than a phone video.
- **Much smaller, fair quality** and **Smallest**: lower bitrates; fine for a quick look, softer in detail and fast motion.
- **Fit a size I choose**: works out the bitrate from the length so the file lands near that size (sound counts as 128 kbit/s). Very small targets for long videos look blurry; choose a smaller picture size too.
- **Picture size**: the height in pixels. The width follows the shape of your video. It never makes a picture bigger.
- **Remove the sound**: leaves the sound out, which saves about 1 MB a minute.

## Worked example

To send a 2-minute video by email with a 25 MB limit, choose "Fit a size I choose" and 24 MB. The page works out 24 × 8,000,000 × 0.98 ÷ 120 ≈ 1.57 Mbit/s in all; less 0.128 Mbit/s for sound, that is about 1.44 Mbit/s for the picture, which suits 720p well.

## FAQs

**How long does it take?** Usually less than the length of the video on a computer, and about the same on a phone. Keep the tab open while it works.

**Is quality lost?** Some, as with any compressor. "Smaller, good quality" at 720p is hard to tell from the original on a phone screen.

**Is my video uploaded?** No. It is read, encoded and saved on this device.
