---
name: Mute video
num: 2252
shelf: everyday
code: T969
section: video-audio
title: "Mute video: remove the sound from a video without losing quality"
seoTitle: "Remove audio from video, free online tool"
summary: "Take the sound out of your own MP4, MOV or WebM video in seconds. The picture is copied exactly, so nothing is lost and the file gets smaller. Nothing is uploaded."
status: live
ads: false
order: 2252
icon: file
works: offline
updated: 2026-11-16
related: [extract-audio, video-compressor, video-trimmer, rotate-video]
sources:
  - "Reading, writing and converting video with Mediabunny (MPL-2.0, credited in NOTICE), using the browser's own WebCodecs encoder and decoder (W3C). Nothing is uploaded."
flow:
  - { icon: file, label: "Open video" }
  - { icon: sliders, label: "Mute" }
  - { icon: download, label: "Download" }
---

## What it does

Sometimes the sound has to go: background chatter in a clip for work, a song you are not allowed to post, wind noise, or a private conversation in a family video you want to share. This tool removes the sound track and keeps the picture exactly as it was. Because the picture is copied rather than encoded again, it takes seconds, loses no quality, and the file gets a little smaller.

It runs in your browser, so nothing is uploaded. To keep the sound instead of the picture, use [[extract-audio]]; to make the muted video smaller still, use the [[video-compressor]]; to cut it first, use the [[video-trimmer]].

## How to use it

1. Press **Open a video** (or drop it on the box).
2. Press **Remove the sound**.
3. Play the result in the page to check it, then press **Download**.

## What it does to the file

- **Picture**: copied byte for byte. The frame rate, size and colours do not change.
- **Sound**: every sound track is left out, including extra languages or commentary.
- **Format**: an MP4 or MOV comes out as MP4; a WebM or MKV comes out as WebM, so the picture can be copied without re-encoding.
- **Tags**: title and other tags are kept; the creation time is not.

## Worked example

A 3-minute phone video at 1080p is 180 MB, of which the AAC sound at 256 kbit/s is 3 × 60 × 256,000 ÷ 8 = 5.8 MB. Muted, the file is about 174 MB and is ready in a few seconds. The test for this page mutes a small MP4 and checks that the H.264 picture is still there and the AAC sound is gone.

## FAQs

**Can I mute only part of the video?** Not here. Cut the part out with the [[video-trimmer]] (it has a "Remove the sound" box), or use a video editor.

**Will it work on very long videos?** Yes, up to 2 GB. The whole result is held in memory before you download it, so very large files need a computer.

**Is my video uploaded?** No. It never leaves this device.
