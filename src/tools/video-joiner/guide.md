---
name: Video joiner
num: 2266
shelf: everyday
code: T973
section: video-audio
title: "Video joiner: merge several video clips into one video"
seoTitle: "Join videos: merge clips into one, free online tool"
summary: "Put video clips in order and join them into one MP4, with their sound kept in step. Clips of different sizes are fitted into one frame. Nothing is uploaded."
status: live
ads: false
order: 2266
icon: link
works: offline
updated: 2026-11-16
related: [video-trimmer, video-compressor, audio-joiner, video-converter]
sources:
  - "Reading, writing and converting video with Mediabunny (MPL-2.0, credited in NOTICE), using the browser's own WebCodecs encoder and decoder (W3C). Nothing is uploaded."
flow:
  - { icon: file, label: "Add clips" }
  - { icon: sliders, label: "Order" }
  - { icon: link, label: "Join" }
  - { icon: download, label: "Download" }
---

## What it does

The video joiner merges several clips into one video, one after another. Use it for phone clips from a day out, parts of a recorded meeting, or scenes you cut separately. Your browser decodes each clip, draws its frames into one picture size and encodes a new MP4 (or WebM in browsers that cannot make MP4), so nothing is uploaded.

Each clip's sound stays in step with its picture; a clip with no sound becomes silence for its length. Cut the clips first with the [[video-trimmer]], and make the joined video smaller afterwards with the [[video-compressor]]. For sound files only, use the [[audio-joiner]].

## How to use it

1. Press **Add videos** and choose two or more clips (or drop them on the box).
2. Put them in order with the ↑ and ↓ buttons; ✕ removes a clip.
3. Choose the **Picture size** and what happens to **Clips of another shape**.
4. Press **Join the videos**, check the result in the page, then **Download**.

## What each setting does

- **Picture size**: the joined video has the first clip's shape. "Same as the first clip" keeps its size; 1080p, 720p or 480p make it smaller (never larger).
- **Clips of another shape**: "Fit inside" shows the whole clip with black bars (a tall phone clip in a wide video gets bars at the sides); "Fill the frame" zooms until there are no bars and cuts off the edges.
- **Remove the sound**: makes a silent video.

## Worked example

Two clips: 4 s at 320 × 240 and 2 s at 320 × 240. Joined, they make one 6 s video of 320 × 240; the second clip starts at exactly 4 s. The checks for this page join two copies of a test clip and check the length and size of the result. Joining is about as fast as playing the clips, often faster.

## FAQs

**Is any quality lost?** The picture is encoded again, as every joiner that accepts mixed clips must. At the default quality the difference is hard to see.

**Can I join clips from different phones?** Yes. Different sizes, frame rates and formats (MP4, MOV, WebM) are all fitted into one video.

**Is my video uploaded?** No. Everything happens on this device.
