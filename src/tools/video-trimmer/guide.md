---
name: Video trimmer
num: 2039
shelf: everyday
code: T922
section: video-audio
title: "Video trimmer: cut a clip from your own video, with or without sound"
summary: "Set a start and end, choose whether to keep the sound, and save that part of your video as a WebM clip. It runs in your browser and the video is never uploaded."
status: live
ads: false
order: 2039
icon: scissors
works: offline
updated: 2026-11-10
related: [video-to-gif, audio-trimmer, screen-recorder]
sources:
  - "Browser MediaRecorder and HTMLMediaElement.captureStream (W3C Media Capture from DOM Elements); WebM container with VP8/VP9 video and Opus sound. fibub's own working."
flow:
  - { icon: file, label: "Open video" }
  - { icon: scissors, label: "Set start" }
  - { icon: clock, label: "Record" }
  - { icon: download, label: "Download" }
---

## What it does

This tool cuts one part out of a video you already have and saves it as a new WebM file, with or without the sound. The file is never uploaded.

Browsers cannot cut a video file directly, so the tool plays the chosen part into the browser's own recorder. That has two honest consequences: making the clip takes as long as the clip (a 30 second clip takes about 30 seconds), and the picture is encoded again, so the quality can drop a little. To turn the clip into an animation, open it in [[video-to-gif]]; to cut sound on its own, use the [[audio-trimmer]].

## How to use it

1. Press **Open a video** and choose a video your browser can play.
2. Set the start and end with the sliders or the time boxes, or pause the video and press **Start at the current frame** or **End at the current frame**.
3. Tick **Remove the sound** if you want a silent clip.
4. Press **Make the clip** and keep the tab open until the progress bar fills, then watch the preview and press **Download the clip (WebM)**.

## What each setting does

- **Start and End**: the part to keep, in seconds. The end must be after the start.
- **Remove the sound**: saves the picture only, with no sound track.
- **Cancel**: stops the recording and throws away what was made so far.

While the clip is recorded, its sound goes to the recorder but not to your speakers.

## Worked example

You have a 2 minute phone video and want the goal between 1:05 and 1:20. Type 65 as the start and 80 as the end. The line under the boxes reads "Clip from 65 s to 80 s: 15 s long", and making it takes about 15 seconds. The download is named after your video, such as match-65-80s.webm.

## FAQs

**Can I save MP4?** No, the clip is WebM, which plays in Chrome, Edge, Firefox, VLC and most editors.

**Why is the clip not cut on the exact frame?** The recorder starts as playback starts, so the first and last frames can differ by a fraction of a second.

**Does it work on a phone?** Only where the browser can record a playing video; if not, the page says so.
