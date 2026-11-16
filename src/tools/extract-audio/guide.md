---
name: Extract audio
num: 2248
shelf: everyday
code: T965
section: video-audio
title: "Extract audio: get the sound from a video and save it as MP3 or WAV"
seoTitle: "Extract audio from video to MP3, free online tool"
summary: "Take the sound track out of your own MP4, MOV or WebM video and save it as MP3, WAV or u-law, for a podcast, a song, a lecture or a transcript. Several videos at once. Nothing is uploaded."
status: live
ads: false
order: 2248
icon: convert
works: offline
updated: 2026-11-16
related: [audio-converter, video-trimmer, audio-trimmer, screen-recorder, loudness-normaliser]
sources:
  - "Sound decoded by the browser's Web Audio API (W3C); MP3 encoding by lamejs, a JavaScript port of LAME (LGPL-3.0, credited in NOTICE); WAV layout as published by Microsoft and IBM (1991)."
flow:
  - { icon: file, label: "Open video" }
  - { icon: sliders, label: "Pick format" }
  - { icon: download, label: "Save audio" }
---

## What it does

This tool saves the sound of a video as an audio file: the talk from a recorded lecture or meeting, the music from a performance you filmed, the voice track for a podcast, or a clip to send to someone who only needs to listen. It works on files on your device only. It is not a downloader for videos on other websites.

Your browser reads the sound out of the video and fibub writes it as MP3, WAV or u-law. The video is never uploaded, which matters for meeting recordings and family videos, and the page keeps working with no internet once it has loaded. To cut the video first, use the [[video-trimmer]]; to cut the sound afterwards, use the [[audio-trimmer]]; for other sound formats, use the [[audio-converter]].

## How to use it

1. Press **Open video files** and choose one or more videos (or drop them on the box).
2. Choose **Save as**: MP3 for a small file that plays anywhere, WAV for editing.
3. Press **Play** to hear the sound, then **Download** (or **Download all as a ZIP**).

## What each setting does

- **Save as**: MP3 at 64 to 320 kbps, WAV at 16 or 24 bits, or u-law for phone systems. MP3 at 64 kbps mono is plenty for speech; use 192 kbps or more for music.
- **Sample rate**: "Keep" uses the video's own (usually 48,000 Hz). Lower rates make smaller files.
- **Channels**: "Mix to mono" averages left and right into one channel, good for a single speaker.

## Worked example

A 45-minute lecture filmed on a phone is an 800 MB MP4. Its sound saved as MP3 at 64 kbps mono is 45 × 60 × 64,000 ÷ 8 = 21.6 MB, small enough to email or put in a transcription app. As 16-bit stereo WAV at 48 kHz it would be 45 × 60 × 48,000 × 4 = 518 MB.

## FAQs

**Which videos work?** MP4 and MOV with AAC sound, and WebM, in all modern browsers; MKV works in Chrome and Edge. If a file fails, try Chrome, or convert the video first.

**Is there a size limit?** 500 MB per video, because the whole file is read into the browser's memory. Trim long videos first if they are bigger.

**Can I use it on YouTube or other sites?** No. It only opens files you already have. Respect the rights of whoever made the video.

**Is anything uploaded?** No. Everything happens on this device.
