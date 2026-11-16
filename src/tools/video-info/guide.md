---
name: Video info
num: 2253
shelf: everyday
code: T970
section: video-audio
title: "Video info: see a video's codec, resolution, frame rate and bitrate"
seoTitle: "Video info: codec, resolution and bitrate checker"
summary: "Find out what is inside a video or sound file: container, video and audio codecs, resolution, frame rate, bitrates, length, sample rate, channels and tags. Nothing is uploaded."
status: live
ads: false
order: 2253
icon: search
works: offline
updated: 2026-11-16
related: [video-compressor, frame-grabber, extract-audio, rotate-video]
sources:
  - "Reading, writing and converting video with Mediabunny (MPL-2.0, credited in NOTICE), using the browser's own WebCodecs encoder and decoder (W3C). Nothing is uploaded."
flow:
  - { icon: file, label: "Open file" }
  - { icon: search, label: "Read" }
  - { icon: copy, label: "Copy" }
---

## What it does

When a video will not play on a TV, an upload form rejects it, or an editor asks for "H.264, 30 fps, under 8 Mbit/s", you need to know what is inside the file. This tool reads a video (or sound) file on your device and lists its container, the video codec and profile, the picture size and shape, the frame rate, the bitrates, the length, the sound codec, sample rate and channels, any turn flag, and tags such as the title or the camera's creation time.

It reads only the parts of the file it needs, so even a 10 GB file opens in a moment, and nothing is uploaded. If the file is too big for where it is going, shrink it with the [[video-compressor]]; to save a still from it, use the [[frame-grabber]].

## How to use it

1. Press **Open a video** (or drop a file on the box).
2. Read the table.
3. Press **Copy as text** to paste the details into an email or a support ticket.

## What each line means

- **Container**: the wrapper (MP4, QuickTime MOV, WebM, Matroska MKV...). Players need to understand both the wrapper and the codecs inside it.
- **Codec**: how the picture or sound is compressed. H.264 plays almost everywhere; H.265 (HEVC) is smaller but not supported by every browser or TV; VP9 and AV1 are common on the web. The code in brackets (such as avc1.64001f) gives the exact profile.
- **Picture**: width × height in pixels as shown, and the shape (16:9, 9:16, 4:3).
- **Frame rate**: pictures per second, averaged over the start of the file.
- **Bitrate**: how much data per second. Overall bitrate includes everything; the video and sound lines are each track's own.
- **Turn flag**: a rotation players apply when showing the picture.

## Worked example

A phone clip reads: MP4, 0:12.53, H.264 (avc1.640028), 1920 × 1080 (16:9), 30 frames a second, 16.9 Mbit/s video, AAC 48,000 Hz stereo. At 16.9 Mbit/s, one minute is about 127 MB; a site that allows 8 Mbit/s needs it compressed to half that rate or less.

## FAQs

**Why does the frame rate show decimals?** Many cameras record at 29.97 or 59.94 frames a second (the old TV rates), and phones often vary the rate slightly.

**Can it read files my browser cannot play?** Often yes: it reads the file's structure, not the picture itself, so it can name an H.265 or ProRes track even where it will not play.

**Is my file uploaded?** No. It is read on this device only.
