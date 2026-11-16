---
name: Rotate video
num: 2251
shelf: everyday
code: T968
section: video-audio
title: "Rotate video: turn a sideways or upside-down video 90 or 180 degrees, or mirror it"
seoTitle: "Rotate video 90 or 180 degrees, free online tool"
summary: "Fix a sideways or upside-down phone video: turn it 90° either way or 180°, or mirror it. The quick way keeps every pixel and takes seconds. Nothing is uploaded."
status: live
ads: false
order: 2251
icon: convert
works: offline
updated: 2026-11-16
related: [video-compressor, video-trimmer, frame-grabber, mute-video]
sources:
  - "Reading, writing and converting video with Mediabunny (MPL-2.0, credited in NOTICE), using the browser's own WebCodecs encoder and decoder (W3C). Nothing is uploaded."
flow:
  - { icon: file, label: "Open video" }
  - { icon: convert, label: "Turn" }
  - { icon: download, label: "Download" }
---

## What it does

A phone held the wrong way makes a video that plays on its side. This tool turns it the right way: 90° clockwise, 90° anticlockwise or 180°, and it can mirror the picture too (useful for selfie videos where writing reads backwards). It runs in your browser, so the video is not uploaded.

By default it does the quick, lossless fix: the picture stays exactly as it is and the file gets a "turn" flag, the same one your phone writes, which browsers, phones, VLC, YouTube and most players follow. That takes seconds even for long videos. If a player ignores the flag, tick "Turn the pixels themselves" and the picture is encoded again, already turned. Make the file smaller afterwards with the [[video-compressor]], or cut it with the [[video-trimmer]].

## How to use it

1. Press **Open a video** and check how it plays in the preview.
2. Choose how to **Turn** it, and tick **Mirror** if you need it.
3. Press **Turn the video**, check the result in the page, then **Download**.

## What each setting does

- **90° clockwise**: for a video that plays lying on its left side.
- **90° anticlockwise**: for one lying on its right side.
- **Upside down (180°)**: for one that plays the wrong way up.
- **Mirror**: flips left and right after turning. Mirroring always encodes the picture again.
- **Turn the pixels themselves**: encodes the picture again, already turned, for old TVs, some editors and some web players that ignore the turn flag. Slower, and some quality is lost, as with any re-encode.

## Worked example

A 1920 × 1080 video plays sideways. Choose "90° clockwise" and press the button: a 300 MB file is ready in a few seconds, still 300 MB, now showing as 1080 × 1920 portrait. With "Turn the pixels themselves", the picture really becomes 1080 × 1920; the test for this page checks that a 320 × 240 clip comes out 240 × 320.

## FAQs

**Why is the quick way lossless?** It copies the video data unchanged and only changes the instruction that says which way up to show it.

**Which files work?** MP4 and MOV (H.264 or H.265) for the quick way; for re-encoding, any video your browser can play. WebM files are re-encoded, since WebM has no standard turn flag.

**Is my video uploaded?** No. Everything happens on this device.
