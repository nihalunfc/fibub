---
name: Video to GIF
num: 2038
shelf: everyday
code: T921
section: video-audio
title: "Video to GIF: turn a clip from your own video into an animated GIF"
summary: "Pick the start and end of a video, choose the width and frames per second, and make an animated GIF in your browser. The video is never uploaded."
status: live
ads: false
order: 2038
icon: convert
works: offline
updated: 2026-11-10
related: [video-trimmer, image-resizer, screen-recorder]
sources:
  - "GIF89a file format (CompuServe Graphics Interchange Format, version 89a, 1990) with LZW compression; median-cut colour reduction (Heckbert, 1982). Encoder is fibub's own working."
flow:
  - { icon: file, label: "Open video" }
  - { icon: scissors, label: "Pick part" }
  - { icon: convert, label: "Make GIF" }
  - { icon: download, label: "Download" }
---

## What it does

This tool turns part of your own video into an animated GIF. Your browser steps through the video frame by frame, reduces each frame to 256 colours and writes the GIF itself, so nothing is uploaded and it keeps working offline once the page has loaded.

GIFs play almost everywhere but are large, so short clips work best. To cut a longer video first, use the [[video-trimmer]]; to make a GIF of something on your screen, record it with the [[screen-recorder]] and open the recording here.

## How to use it

1. Press **Open a video** and choose a video your browser can play.
2. Set the start and end with the sliders or the time boxes, or play the video and use **Start at the current frame** and **End at the current frame**.
3. Choose the width, frames per second, colours and loop.
4. Press **Make the GIF**, watch the progress bar, then **Download the GIF**.

## What each setting does

- **Start and End**: the part of the video to use, in seconds.
- **Width in pixels**: 80 to 800; the height follows the video's shape. A video is never made larger than it is.
- **Frames per second**: 5 to 20. More is smoother but makes a bigger file.
- **Colours**: Best works out 256 colours for each frame (median cut). Fixed uses the same 252 colours for every frame: faster, but skin and skies can look banded.
- **Loop forever**: on, the GIF repeats; off, it plays once and stops.

The line under the settings shows the number of frames and an estimated size, worked out by encoding the first frame and multiplying. A clip can have at most 300 frames.

## Worked example

A 1280 × 720 phone video, clip from 2 to 5 seconds, width 320, 10 frames per second: that is 3 seconds × 10 = 30 frames of 320 × 180 pixels, each shown for 0.1 s.

## FAQs

**Why is 15 frames per second not exact?** GIF stores how long each frame shows in hundredths of a second, so 15 fps becomes 0.07 s per frame (about 14.3 fps).

**Does the GIF have sound?** No. GIF is a picture format with no sound.

**How do I make the file smaller?** Shorten the clip, lower the width or the frames per second.
